---
title: Vue3 Emit 警告排查
date: 2026-03-21
description: 一次内部 hook 导致的 emit 警告排查，结合 runtime-core 源码定位真正触发条件。
tags:
  - Vue3
  - 踩坑日记
---

## 初步定位

最近在项目里看到下面这个 Warning，顺着调用链排查后发现源头在一个内部 hook。

> Component emitted event "register" but it is neither declared in the emits option nor as an "onRegister" prop.

最初以为是简单的 `instance.emit('register')` 调用时事件未注册导致的，本着对控制台 Warning ‘零容忍’的态度，我在 hook 内部加了一个是否声明该 event 的检查。

```ts
function createInstanceEmitChecker(instance: ComponentInternalInstance) {
  const emits = instance.type?.emits
  return (event: string) => (Array.isArray(emits) ? emits.includes(event) : !!emits?.[event])
}

function emitWithCheck(instance: ComponentInternalInstance, event: string, ...args: any[]) {
  const hasRegisterEmit = createInstanceEmitChecker(instance)
  if (!hasRegisterEmit(event))
    return

  instance.emit(event, ...args)
}
```

在组件内部显式声明 `defineEmits(['register'])` 后，控制台的 Warning 立刻消失了。

事情还远远没有结束，在排查过程中，我发现原本正常调用 hook 的页面，经过上面的代码调整后，`register` 的事件回调失效了。排查代码后发现这些原本正常的组件，是没有注册 `register` 事件的，但是控制台没有显示 Warning，这引起了我的思考：

1. 是否存在某种隐式的事件注册机制？
2. 该 Warning 的触发逻辑，并非单纯的未注册事件

## 源码溯源

为了证实猜想，我先在 Vue SFC Playground 编写了一个最小复现案例：[未声明 emits 时的调用](https://play.vuejs.org/#eNp9UtuK2zAQ/ZWpXuxAsFnap9QJbZeFbqEXuoW+6MXIE0e7smR0yQaM/31Hcpy950GgOXNmdGZ0Bva174t9QLZilRNW9h4c+tBvuJZdb6yHASxuYYStNR1kRM1OqUvT9Ue8KGMQO2WfueZaGO08dK6FdazPs++olIH/xqrmQ7aIlG3QwkujYVfrRuFNEAKdy3EBA9cAsYNRWCjTEsb1yHVVThJJHAUeu17VHikCqHYXm2FID45jVVKU0KTwi5tarzl79hRnUBKtKp90YkvmHT29lW1x64ymvSQ1nAlqJRXa330UTcWrSWfM1TTb/Y+EeRtwOeNih+LuDfzWHSLG2R+LDu0eOTvlfG1b9FP66uYXHuh+SnamCYrYZ5J/kdYWosaJ9i3Eke0TXlJ7nb5Q6vafuzp41G4eKgqNzDHxOaMvjVt8b/RHuR+LT6mOvoq2ONvhnLGo8DJYi9pfk1tqLXAJRv80QXtsXlhutpQ8MslXr8vzZKxTizxfwHozaZ3rCuykz7OjJbIlydjXKuAKLmCMNqNzzmeN3KcLJPcnqJyw5z4aHwBQSCOl)

出乎意料的是，控制台并没有弹出任何警告，那么，最初那个扎眼的 Warning 到底是如何触发的？

带着这种好奇心，深入翻阅 Vue 源码，最终在 [componentEmits.ts](https://github.com/vuejs/core/blob/d61d8031f0d547fdb75ab3525e54ace790a4db82/packages/runtime-core/src/componentEmits.ts#L124) 中找到了该 Warning 的判断逻辑，我将其核心逻辑简化如下：

```ts
if (emitsOptions) {
  // 检查事件是否在 emits 选项中定义
  if (!event in emitsOptions) {
    // 如果未定义，进一步检查是否作为 Props (如 onRegister) 传入
    const handlerKey = toHandlerKey(camelize(event))
    if (!propsOptions || !(handlerKey in propsOptions)) {
      warn(
        `Component emitted event "${event}" but it is neither declared in `
        + `the emits option nor as an "${handlerKey}" prop.`
      )
    }
  }
}
```

根据源码逻辑，我重新构建了一个能稳定触发警告的案例：[声明 emits 后触发的合法性警告](https://play.vuejs.org/#eNp9U9uK2zAQ/ZWpXuxAsFnapzQJbZdAt9AL3UIfqj4Ye+xoK4+MLmnA+N87kpN0t5c8GDRnzozOjI5H8XoYikNAsRJrV1s1eHDow7CVpPrBWA8jWGxhgtaaHjKmZpfUremHE16UMYidspeSJNWGnIfedbCJ9Xn2FrU28NVY3TzLFpHSBqq9MgT7ihqN96Gu0bkcFzBKAogdjMZCm44xSZOkdTlLZHEceOwHXXnkCGC9v9mOY7pwmtYlRwlNCl+5ufVGiidXSQEl09blo05iKbzjq1vVFQ/OEO8lqZGi5lZKo/04RNFcvJp1xlzFs/18lzBvAy7PeL3H+sc/8Ad3jJgUnyw6tAeU4pLzle3Qz+nd/Qc88vmS7E0TNLOvJD8jry1EjTPtTYgj20e8pPYuPaGi7ovbHT2SOw8VhUbmlPhS8JPGLf5v9N9ynxcvUh0/FW/xbIdrxuLC22Atkr9jt1RU4xIMvTeBPDZ/WE5Sg60i3PXKu/zb92Sh2WXqVMxW+7tjnoiXrnm+gM12ln+uK5B75tnJJdmSlR0qHXAFNzBF5/F3zXqNOqQDpB8iQeWMPbXW9AuRfyqv)

## 总结

Vue 的 emit 校验机制遵循按需启用原则，只有显式的用 `defineEmits` 声明事件，才会触发事件的合法性检查，如果一个组件完全没有定义 emits，Vue 会保持静默，但只要你定义了其中任何一个事件，Vue 就会认为你开启了严格模式，此时再调用任何未注册的事件，这行扎眼的 Warning 就会如约而至\*\*
