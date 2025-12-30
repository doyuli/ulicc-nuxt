---
title: 个人向 CSS 编码风格汇总
date: 2025-12-30
description: 记录我在项目中沉淀的 CSS 布局习惯与编码风格。不追求唯一标准，只记录当前阶段的最优解。
priority: 0
tags:
  - 日常随笔
  - CSS
---

## 尽可能的使用 Flex

### 告别间隔 Margin

在现代 Web 开发中，布局的核心应倾向于 **“容器分配空间，子项声明偏移”**。

传统的 `margin-top` 或 `margin-bottom` 容易导致样式耦合，通过容器的 `gap` 属性，可以实现更纯粹的布局解耦。

```html
<div class="flex flex-col gap-4">
  <section>第一部分</section>
  <section>第二部分</section>
  <section>第三部分</section>
</div>

```

### 子元素居中

对于大多数居中场景，`grid` 是最简短的写法。

```html
<div class="grid place-items-center"></div>
<div class="flex justify-center items-center"></div>

```

### 子项的自决权：Self 对齐

```html
<div class="flex flex-col gap-4">
  <div>全局通知栏</div>
  <button class="self-start">返回</button>
  <span class="self-center text-sm">无更多内容</span>
</div>

```

### Flex 与 Margin 的剩余空间分配

在 Flex 容器中，`margin: auto` 会自动吞掉对应方向的剩余空间。这在处理左右对齐导航栏时比 `justify-content: space-between` 更具灵活性。

```html
<header class="flex items-center">
  <div class="logo">Logo</div>
  <nav>导航链接</nav>
  <button class="ml-auto">登录</button>
</header>

```

### Flex 边界保护

在横向布局中，当右侧文字过多时，左侧的图标或头像常会被挤压成椭圆。`shrink-0` 能强制元素保持原始物理尺寸。

```html
<div class="flex items-center gap-3">
  <img src="avatar.jpg" class="size-10 shrink-0 rounded-full" />

  <div class="min-w-0">
    <h3 class="truncate">这里是一个非常长长长长长的用户名</h3>
  </div>
</div>

```

## Grid 实现响应式布局

### 响应式无缝切换

Grid 的强大之处在于通过一行类名即可改变整个页面的骨架，而无需修改 HTML 结构。

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="md:col-span-2 text-lg">主要内容区域</div>
  <div class="md:col-span-1 bg-gray-50">侧边栏辅助信息</div>
</div>

```

### 侧边栏 + 主内容区

使用 `minmax` 或特定宽度配合 `1fr`，可以轻松创建稳定的后台布局。

```html
<div class="grid grid-cols-[240px_1fr] gap-4">
  <aside>固定 240px 侧边栏</aside>
  <main>自适应主体</main>
</div>

```

::tip
文章部分内容参考并融合自御守老师的[《个人向 CSS 编码风格汇总》](https://archive.bikari.top/book/daily/44dc7f8){target="\_blank"}，在此致谢。
::
