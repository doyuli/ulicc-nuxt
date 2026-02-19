---
title: Vue 组件懒挂载与冻结更新的实现思路
date: 2026-02-19
description: 通过懒挂载与 render 冻结技术，减少不必要的 diff 与更新，优化 Vue3 复杂组件的渲染性能。
tags:
  - 技术分析
  - Vue3
---

## 前置场景

在业务开发中，组件的懒挂载是一个非常常见的需求，可以让首屏不可见的组件按需渲染，从而优化首屏加载速度。

冻结更新则是更进一步的优化策略，当组件已经挂载，且当前不在视口内时，让它跳过内部复杂的 DOM diff 与渲染过程，以减少不必要的更新开销，提升整体交互流畅度。

## 实现思路

### 组件的懒挂载

所谓懒挂载，本质上是只有**当组件进入视口内**时才会进行渲染，浏览器提供的 [IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver) API 可以异步监听元素与视口（或某个祖先容器）的交叉状态，非常适合实现这一需求，我们封装一下：

```ts
type MaybeElement = HTMLElement | SVGElement | ComponentPublicInstance | undefined | null
function unrefElement<T extends MaybeElement>(elRef: MaybeRef<T>) {
  const plain = toValue(elRef)
  return (plain as ComponentPublicInstance)?.$el ?? plain
}

export function useIntersectionObserver(
  target: MaybeRef<HTMLElement | null>,
  options?: IntersectionObserverInit,
) {
  const isVisible = shallowRef(false)

  const observer = new IntersectionObserver(([entry]) => {
    isVisible.value = !!entry?.isIntersecting
  }, options)

  watchPostEffect((onCleanup) => {
    const el = unrefElement(target)

    if (!el)
      return

    observer.observe(el)

    onCleanup(() => {
      observer.unobserve(el)
    })
  })

  const stop = () => observer.disconnect()

  return {
    isVisible,
    stop,
  }
}
```

有了这个工具函数之后，我们就可以实现一个简单的懒挂载组件：

```ts
export const LazyRenderer = defineComponent < IntersectionObserverInit > ({
  name: 'LazyRenderer',
  props: ['root', 'rootMargin', 'threshold'],
  setup(props, { slots }) {
    const container = ref < HTMLElement | null > (null)

    const { isVisible } = useIntersectionObserver(container, props)
    return () => isVisible.value ? slots?.default() : h('div', { ref: container }, slots?.fallback())
  },
})
```

初始状态只渲染 fallback 插槽，只有当元素进入视口时，才真正渲染默认插槽内容。至此，一个基础的懒挂载组件就完成了。

### 组件的冻结更新

懒挂载解决的是“**组件要不要渲染**“，而冻结更新需要解决的是“**组件已经挂载，要不要更新**“的问题。

当一个组件已经挂载，但当前不可见，同时内部又包含复杂的 DOM 结构或大量响应式依赖时，持续执行 diff 和 patch 就显得没有必要，要实现冻结更新，必须先理解 Vue 组件的更新流程。

在 Vue 源码中，组件更新最终会走到 [patch](https://github.com/vuejs/core/blob/09dec962ae9c2e2ad49e584cef5f416a0d4558ff/packages/runtime-core/src/renderer.ts#L374) 函数。它会对比：

- `n1`：上一次渲染得到的 VNode
- `n2`：当前需要渲染的 VNode

在 [componentUpdateFn](https://github.com/vuejs/core/blob/09dec962ae9c2e2ad49e584cef5f416a0d4558ff/packages/runtime-core/src/renderer.ts#L1522) 函数中可以看到，`n1` 就是 `instance.subTree` ，而 `n2` 则是通过 [renderComponentRoot(instance)](https://github.com/vuejs/core/blob/09dec962ae9c2e2ad49e584cef5f416a0d4558ff/packages/runtime-core/src/componentRenderUtils.ts#L52) 这个方法获取，它内部调用的是 `instance.render` 方法。

想要跳过组件的更新，其实可以给 Vue 一种“假象“，只要让它以为本次渲染的 VNode 和上次渲染的是同一个，即 `n1 === n2`，那它就会跳过这次更新。换句话说，只要我们让 instance.render 返回上一次的 subTree，Vue 就会认为本次渲染结果和上次一致，从而跳过 diff。

知道了上述组件更新的流程，我们可以在组件不可见时，临时替换它的 render 函数：

```ts
export const LazyRenderer = defineComponent<IntersectionObserverInit>({
  name: 'LazyRenderer',
  props: ['root', 'rootMargin', 'threshold'],
  setup(props, { slots }) {
    const container = ref<HTMLElement | null>(null)

    const { isVisible, stop: stopObserver } = useIntersectionObserver(container, props)

    let render: () => VNode
    let currentVNode: VNode | undefined

    const stopWatch = watchPostEffect(() => {
      isVisible.value

      if (!currentVNode)
        return

      container.value = currentVNode.el as HTMLElement
      const instance: any = currentVNode.component

      if (instance) {
        if (isVisible.value) {
          instance.render = render || instance.render
        }
        else {
          const _render = instance.render
          instance.render = () => instance.subTree
          render = _render
        }
      }
      else {
        stopObserver()
        stopWatch()
      }
    })

    return () => {
      if (!isVisible.value && !currentVNode) {
        return h('div', { ref: container }, slots.fallback?.())
      }

      const children = slots.default?.()
      currentVNode = children?.[0]
      return children
    }
  },
})
```

核心逻辑：可见 → 恢复原始 render，不可见 → render 永远返回上一次的 subTree，从而达到冻结更新的效果。

还有一个关键问题，如果组件在冻结期间发生了响应式数据变更，恢复可见时应该立即执行一次更新，我们可以通过一个标记变量记录是否发生过渲染请求：

```ts
let called = false

if (isVisible.value) {
  instance.render = render || instance.render
  called && instance.update()
}
else {
  const _render = instance.render
  instance.render = () => {
    called = true
    return instance.subTree
  }
  render = _render
}
```

当恢复时，如果 `called` 为 true，则主动调用 `instance.update()` 触发一次真实更新。

## 深入思考

上述实现只冻结了当前子组件，如果组件内部存在大量子孙组件，它们仍然会继续更新。

此时可以考虑递归拦截 render，但有一个值得思考的问题：**递归拦截的性能开销，是否真的小于让它正常更新**？这取决于组件树复杂度和更新频率，我们可以像 watch 的 deep 一样，做一个可控深度，修改后的实现如下：

```ts
export const LazyRenderer = defineComponent<IntersectionObserverInit & { deep?: boolean | number }>({
  name: 'LazyRenderer',
  props: ['root', 'rootMargin', 'threshold', 'deep'],
  setup(props, { slots }) {
    const container = ref<HTMLElement | null>(null)

    const { isVisible, stop: stopObserver } = useIntersectionObserver(container, props)

    let currentVNode: VNode | undefined
    const originalRenderCache = new WeakMap<ComponentInternalInstance, () => VNode>()
    const calledCache = new WeakMap<ComponentInternalInstance, boolean>()

    const updateFreeze = (
      instance: any,
      freeze: boolean,
      depth: number = Infinity,
    ) => {
      if (!instance)
        return

      if (freeze) {
        if (!originalRenderCache.has(instance)) {
          originalRenderCache.set(instance, instance.render)

          instance.render = () => {
            calledCache.set(instance, true)
            return instance.subTree
          }
        }
      }
      else {
        const originRender = originalRenderCache.get(instance)
        if (originRender) {
          instance.render = originRender
          originalRenderCache.delete(instance)

          if (calledCache.get(instance)) {
            calledCache.delete(instance)
            instance.update()
          }
        }
      }

      if (depth > 0) {
        const subTree = instance.subTree

        const walk = (node: any) => {
          if (!node)
            return

          if (node.component) {
            updateFreeze(node.component, freeze, depth - 1)
          }
          else if (Array.isArray(node.children)) {
            node.children.forEach(walk)
          }
        }

        walk(subTree)
      }
    }

    const stopWatch = watchPostEffect(() => {
      isVisible.value

      if (!currentVNode)
        return

      container.value = currentVNode.el as HTMLElement
      const instance: any = currentVNode.component

      if (instance) {
        const depth = props.deep === true ? Infinity : (props.deep || 0)
        updateFreeze(instance, !isVisible.value, depth)
      }
      else {
        stopObserver()
        stopWatch()
      }
    })

    return () => {
      if (!isVisible.value && !currentVNode) {
        return h('div', { ref: container }, slots.fallback?.())
      }

      const children = slots.default?.()
      currentVNode = children?.[0]
      return children
    }
  },
})
```
