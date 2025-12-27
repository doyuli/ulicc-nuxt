---
title: 打造一个安全可靠的 JavaScript 表达式沙箱
date: 2025-10-18
description: 基于 Proxy 与 with 构建受控沙箱，黑名单拦截敏感全局，上下文只读注入，安全执行用户表达式，兼顾性能与易用性。
hidden: false
tags:
  - Sandbox
priority: 0
---

## 前置知识

在低代码平台、表单引擎、模板渲染等场景中，我们通常需要让用户输入一段 JavaScript 表达式，并在受控环境中执行。但直接使用 `eval` 或 `new Function` 会带来严重的安全风险。本文将带你从零实现一个**兼顾安全性与灵活性**的表达式沙箱，并深入剖析其设计原理。

## 为什么需要沙箱

想象以下场景：

- 低代码平台允许用户配置显隐条件：`form.type === 'enterprise' && user.role === 'admin'`
- 表单系统支持动态计算字段：`price * (1 - discount)`
- 模板渲染引擎中编写动态文案：`尊敬的${user.name}，您的快递已经送达`

这些需求本质都是：**在运行时安全地执行用户提供的 JavaScript 表达式**。

但若直接使用：`new Function('return ' + userCode)()`

用户就可以轻易写出：

```
"alert(document.cookie)"
"Function('return globalThis')()"
"location.href = 'https://example.com'"
```

这将导致 **XSS 攻击、数据泄露、页面劫持** 等严重安全问题。

因此，我们需要一个 **隔离的、受控的执行环境** —— 即 **沙箱（Sandbox）**。

## 方案选型

> `Proxy` 拦截 + `with` 注入上下文 + `new Function` 动态执行

该方案优势：

- 支持完整的 JavaScript 表达式语法（包括三元、逻辑运算、对象字面量等）
- 开发成本低，借助 `Proxy` 和 `with` 即可快速构建上下文隔离环境
- 执行性能高，表达式由 JavaScript 引擎直接编译执行，享有原生性能，适合高频计算场景
- 通过 Proxy 严格控制访问边界

### 为什么不直接用 AST 方案？

确实，**基于 AST 的表达式求值器**更安全——它通过静态解析代码结构，仅允许白名单内的语法节点执行，从根本上杜绝动态执行风险。

但 AST 方案也存在明显局限：

- 默认不支持函数调用、正则、`Math` 等常见操作；
- 开发维护成本高，需为每种语法节点编写求值逻辑；
- 性能较差（解释执行，无 JIT 优化）；
- 调试体验差，错误难以定位。

因此，在**用户可信、环境可控**的场景（如企业内部低代码平台、表单引擎），`Proxy` + `with` + `new Function` 方案通过严格的黑名单拦截和上下文隔离，已能提供足够安全的保障，同时兼顾开发效率与运行性能。

## Proxy 防护机制

### 黑名单拦截

首先，定义一组**禁止访问的全局属性**：

```ts
const BLACKLIST = new Set([
  'window',
  'globalThis',
  'document',
  'eval',
  'Function',
  'localStorage',
  'alert',
  'fetch',
  'XMLHttpRequest',
  'console',
  // ...
])
```

任何对这些属性的访问，都将被替换为一个 **“黑洞对象”** —— 调用其任何方法或属性都静默失败。

### 全局别名重定向

在浏览器中，`window`、`self`、`globalThis` 都指向全局对象。为避免用户通过别名绕过拦截，我们将它们统一重定向到**沙箱自身**：

```ts
const GLOBAL_ALIASES = new Set(['window', 'globalThis', 'self', 'global'])
```

这样，`window.location` 实际访问的是沙箱的 `location` 属性。

### 上下文隔离

用户传入的变量作为**只读上下文**注入沙箱，且**禁止修改**：

```ts
const context = { user: { name: 'doyuli' } }
invokeCodeSnippet('user.name', context) // result: 'doyuli'
invokeCodeSnippet('user = null', context) // error: Cannot modify protected property: user
```

## 代码实现

### 创建 Mock Window

我们创建一个 `mockWindow`，作为沙箱的基础环境：

```ts
function createMockWindow() {
  const mockWindow = new Proxy(
    {},
    {
      has() {
        return true
      },
      set(target, key, value) {
        // 允许在 mockWindow 上临时赋值
        return Reflect.set(target, key, value)
      },
      get(_, key) {
        if (GLOBAL_ALIASES.has(key)) {
          // 访问 global 则返回自身
          return mockWindow
        }
        if (typeof key === 'string' && BLACKLIST.has(key)) {
          // 访问黑名单则返回黑洞
          return createBlackHole()
        }
        // 回退到原生 window
        const nativeValue = Reflect.get(window, key)
        if (typeof nativeValue === 'function' && !nativeValue.prototype) {
          return nativeValue.bind(window)
        }
        if (isDomElement(nativeValue)) {
          // 禁止 DOM 元素泄露
          return undefined
        }
        return nativeValue
      },
    },
  )
  return mockWindow
}
```

### 惰性初始化 Mock Window

为避免模块加载时立即创建 `mockWindow`，采用**惰性初始化**：

```ts
let sharedMockWindow: ReturnType<typeof createMockWindow> | null = null

function getSharedMockWindow() {
  if (!sharedMockWindow)
    sharedMockWindow = createMockWindow()

  return sharedMockWindow
}
```

### 构建沙箱 Proxy

每个执行上下文都创建一个独立的沙箱实例：

```ts
type SandboxContent = Record<string, any>

function createSandbox(context: SandboxContent) {
  // 判断某个属性是否受保护
  const isProtected = (prop: PropertyKey) => {
    return prop in context || GLOBAL_ALIASES.has(prop)
  }

  const mock = getSharedMockWindow()

  return new Proxy(mock, {
    has() {
      return true
    },
    get(target, key, receiver) {
      if (key === Symbol.unscopables) {
        return undefined
      }

      if (key === 'toJSON') {
        return receiver
      }

      if (key in context) {
        const value = Reflect.get(context, key, receiver)
        if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
          Object.freeze(value)
        }
        return value
      }

      if (GLOBAL_ALIASES.has(key)) {
        // 全局别名指向沙箱自身
        return receiver
      }

      // 回退到 mockWindow
      return Reflect.get(target, key, receiver)
    },

    set(target, key, value, receiver) {
      if (isProtected (key)) {
        throw new Error(`Cannot modify protected property: ${key.toString()}`)
      }
      return Reflect.set(target, key, value, receiver)
    },

    defineProperty(target, key, attributes) {
      if (isProtected (key)) {
        throw new Error(`Cannot define protected property: ${key.toString()}`)
      }
      return Reflect.defineProperty(target, key, attributes)
    },

    deleteProperty(target, key) {
      if (isProtected (key)) {
        throw new Error(`Cannot delete protected property: ${key.toString()}`)
      }
      return Reflect.deleteProperty(target, key)
    },

    setPrototypeOf() {
      throw new Error('setPrototypeOf is not allowed in sandbox')
    },
  })
}
```

### 编译用户代码片段

使用 `with(this)` 将沙箱作为作用域注入，缓存编译后的函数，提升性能：

```ts
interface CompiledScript {
  execute: (context: SandboxContent) => any
}

const COMPILE_CACHE = new Map<string, CompiledScript>()

function compileScript(code: string): CompiledScript {
  const cached = COMPILE_CACHE.get(code)
  if (cached)
    return cached

  // eslint-disable-next-line no-new-func
  const fn = new Function(`
    with (this) {
      return (function() { 'use strict'; return (${code}); }).call(this);
    }
  `)

  const compiled: CompiledScript = {
    execute(context: SandboxContent) {
      const sandbox = createSandbox(context)
      return fn.call(sandbox)
    },
  }

  COMPILE_CACHE.set(code, compiled)
  return compiled
}
```

### 黑洞对象实现

```ts
export function createBlackHole(): any {
  return new Proxy(
    () => createBlackHole(),
    {
      get(_, key) {
        if (key === 'toString') {
          return () => ''
        }
        if (key === Symbol.toPrimitive) {
          return () => ''
        }
        return createBlackHole()
      },
    },
  )
}
```

### 对外 API

```ts
export function invokeCodeSnippet(snippet: string, context: SandboxContent) {
  const code = snippet.trim()
  if (code === '') {
    return undefined
  }

  const compiled = compileScript(code)
  return compiled.execute(context)
}
```

## 实现模板编译器

```ts
import { invokeCodeSnippet } from '.'

export function compileTemplate(template: string, context: SandboxContent) {
  let error = ''
  let result = ''

  try {
    result = template.replace(/\{\{(.*?)\}\}/g, (_, snippet) => {
      const value = invokeCodeSnippet(snippet, context)
      return value
    })
  }
  catch (err: any) {
    error = err.message
  }

  return { result, error }
}

const user = {
  name: 'doyuli',
  age: 18,
}

const code = `期待一下{{user.name}}的{{user.age}}岁生日`

compileTemplate(code, { user }) // result: 期待一下doyuli的18岁生日
```
