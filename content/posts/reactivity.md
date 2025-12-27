---
title: 实现一个最基础的响应式模块
date: 2025-06-08
description: 用极简代码实现 ref 与 effect，演示依赖追踪与触发更新流程，快速掌握 Vue 响应式的基础原理与运行机制。
hidden: false
tags:
  - Vue3
  - Reactivity
priority: 0
---

## 响应式最基础的实现

`ref` 是一个响应式对象包装器，它可以让我们追踪基础类型值的变化

```js
class RefImpl {
  _value = undefined
  // 存储所有追踪了该响应式数据的订阅者（副作用函数）集合
  subs = new Set()

  constructor(value) {
    this._value = value
  }

  get value() {
    if (activeSub) {
      subs.add(activeSub)
    }
    return this._value
  }

  set value(newValue) {
    this._value = newValue
    subs.forEach(effect => effect())
  }
}

function ref(value) {
  return new RefImpl(value)
}
```

`effect` 副作用函数，供内部响应式数据被读取时，进行依赖追踪时定位当前活跃的副作用函数，当数据发生变化时，重新执行这些函数

```js
let activeSub

class ReactiveEffect {
  constructor(fn) {
    this.fn = fn
  }

  run() {
    activeSub = this
    this.fn()
    activeSub = undefined
  }
}

function effect(fn) {
  return new ReactiveEffect(fn)
}
```

这段代码实现了一个简单的响应式系统，它能够让我们追踪的数据发生变化时自动执行相关的副作用函数

```js
const count = ref(0)

effect(() => {
  console.log(count.value)
})

count.value++
```
