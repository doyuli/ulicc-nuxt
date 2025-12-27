---
title: 自动为 async 函数添加 try...catch，告别手动错误处理
date: 2025-10-29
description: 基于构建期自动注入 try...catch，统一为异步函数植入错误捕获与 finally 逻辑，提升异步错误处理的可靠性与一致性。
hidden: false
tags:
  - Vite
  - Plugin
  - Async/Await
priority: 0
---

## 前置知识

在现代前端开发中，`async/await` 已成为异步编程的主流方式。然而，一个常见的痛点是：**每一个 `await` 表达式都可能抛出异常，但手动包裹 `try...catch` 既繁琐又容易遗漏**。尤其在大型项目中，忘记处理异步错误可能导致页面白屏、数据丢失，甚至影响用户体验，本文将带你从零实现一个 **Vite 插件**，自动为包含 `await` 的 `async` 函数添加 `try...catch`（甚至 `finally`）。

## 最终效果

假设你写了如下代码：

```ts
export async function fetchUser(id: number) {
  const res = await axios.get(`/api/user/${id}`)
  return res.data
}
```

经过插件处理后，会自动变成：

```ts
export async function fetchUser(id: number) {
  try {
    const res = await axios.get(`/api/user/${id}`)
    return res.data
  }
  catch (e) {
    console.error(e)
  }
}
```

你甚至可以自定义 `catch` 块内容，比如上报错误日志：

```ts
import { AsyncCatchPlugin } from 'vite-plugin-async-catch'

export default defineConfig({
  plugins: [
    AsyncCatchPlugin({
      catchCode: e => `Sentry.captureException(${e})`,
      finallyCode: `console.log('请求结束')`
    })
  ]
})
```

## 实现原理

要实现这个功能，核心在于 **代码的静态分析与转换**。我们借助 Babel 的 AST（抽象语法树）能力，在构建阶段自动修改源码。

步骤概览：

1. **解析代码**：使用 `@babel/parser` 将源码转为 AST。
2. **遍历 AST**：通过 `@babel/traverse` 找出所有包含 `await` 的 `async` 函数。
3. **包裹 try...catch**：将函数体整体替换为 `try { ... } catch (e) { ... }`。
4. **生成新代码**：用 `@babel/generator` 将修改后的 AST 转回字符串。
5. **集成到 Vite**：依赖 `transform` 钩子，在构建时自动处理符合条件的文件。

## 代码实现

### compile 实现

```ts
import type { NodePath } from 'babel__traverse'
import { generate } from '@babel/generator'
import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'
import * as T from '@babel/types'

// 兼容 @babel/traverse 的 cjs/esm 混合导出
const traverse = typeof _traverse === 'function' ? _traverse : ((_traverse as any).default as typeof _traverse)

export interface Options {
  /**
   * catch 块中执行的代码
   * @default console.error(e)
   */
  catchCode?: string | ((identifier: string) => string)
  /**
   * catch 参数名
   * @default e
   */
  identifier?: string
  /**
   * 可选的 finally 块代码
   */
  finallyCode?: string
}

export function compile(
  code: string,
  options?: Options,
) {
  const {
    identifier = 'e',
    catchCode: _catchCode = `console.error(${identifier})`,
    finallyCode,
  } = options || {}

  const catchCode = typeof _catchCode === 'function' ? _catchCode(identifier) : _catchCode

  // 解析用户提供的 catch/finally 代码为 AST 节点
  const catchStatement = parse(catchCode).program.body
  const finallyStatement = finallyCode ? parse(finallyCode).program.body : null

  const ast = parse(code, {
    sourceType: 'module',
    plugins: [
      'asyncGenerators',
      'classProperties',
      'dynamicImport',
      'optionalChaining',
    ],
  })

  const asyncFuncBodies = new Set<NodePath<T.BlockStatement>>()

  // 遍历 AST，找到所有包含 await 且不在 try...catch 内的 async 函数体
  traverse(ast, {
    AwaitExpression(path) {
      // 如果已在 try...catch 内，跳过
      if (path.findParent(path => T.isTryStatement(path.node)))
        return

      let parent: any = path.parentPath
      while (parent && !isAsyncFunction(parent)) {
        parent = parent.parentPath
      }

      if (parent && T.isBlockStatement(parent.get('body').node)) {
        asyncFuncBodies.add(parent.get('body'))
      }
    },
  })

  // 为每个 async 函数体包裹 try...catch
  for (const bodyPath of asyncFuncBodies) {
    const originalBody = bodyPath.node.body

    const tryBlock = T.blockStatement([...originalBody])
    const catchParam = T.identifier(identifier)
    const catchBlock = T.blockStatement([...catchStatement])

    const finallyBlock = finallyStatement ? T.blockStatement([...finallyStatement]) : null

    const tryStmt = T.tryStatement(tryBlock, T.catchClause(catchParam, catchBlock), finallyBlock)

    // 替换整个函数体为 [tryStmt]
    bodyPath.node.body = [tryStmt]
  }

  return generate(ast, { compact: false }, code).code
}

function isAsyncFunction(path: NodePath): boolean {
  const node = path.node
  return (
    (T.isFunctionDeclaration(node) && node.async)
    || (T.isFunctionExpression(node) && node.async)
    || (T.isArrowFunctionExpression(node) && node.async)
    || (T.isObjectMethod(node) && node.async)
    || (T.isClassMethod(node) && node.async)
  )
}
```

### Vite 插件实现

```ts
import type { Plugin } from 'vite'
import type { Options as CompileOptions } from '.'
import { createFilter } from 'vite'
import { compile } from '.'

const VITE_PLUGIN_NAME = 'vite-plugin-async-catch'

interface PluginOptions extends CompileOptions {
  include?: string | string[]
  exclude?: string | string[]
}

export function AsyncCatchPlugin(options?: PluginOptions): Plugin {
  const {
    include = ['**/*.{js,ts,jsx,tsx,vue}'],
    exclude = ['**/node_modules/**'],
    ...compileOpts
  } = options || {}

  const filter = createFilter(include, exclude)

  return {
    name: VITE_PLUGIN_NAME,
    // 在其他转换（如 TS、Vue）之后执行
    enforce: 'post',
    transform(code, id) {
      if (!filter(id) || !code.includes('await'))
        return null

      try {
        const transformedCode = compile(code, compileOpts)
        return {
          code: transformedCode,
          map: null,
        }
      }
      catch (err: any) {
        console.warn(`[${VITE_PLUGIN_NAME}] Failed to process ${id}:`, err.message)
        return null
      }
    },
  }
}
```
