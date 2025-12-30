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

在我当前的开发实践中，只要布局逻辑是一维线性的，我都会优先选择 Flex。原因不仅是能用，更是因为它的语义清晰、行为可预测、调试成本低。

### 子元素居中

虽然 `grid` 可以通过 `place-items-center` 一行搞定居中，但 Flex 的写法更能表达对齐意图：

```html
<div class="flex justify-center items-center">
  <section>第一部分</section>
  <section>第二部分</section>
  <section>第三部分</section>
</div>

```

### 垂直等间距分布，拒绝 Margin 间隙

在现代 Web 开发中，布局的核心应倾向于 **“容器分配空间，子项声明偏移”**。

传统的 `margin-top` 或 `margin-bottom` 容易导致样式耦合，通过容器的 `gap` 属性，可以实现更纯粹的布局解耦。

```html
<div class="flex flex-col gap-4">
  <section>第一部分</section>
  <section>第二部分</section>
  <section>第三部分</section>
</div>

```

### 利用 Margin 灵活分配空间

在 Flex 容器中，`margin: auto` 会自动吞掉对应方向的剩余空间。这在导航栏、表单等场景中比 `justify-content: space-between` 更具灵活性：

```html
<header class="flex items-center">
  <div>Logo</div>
  <nav>导航链接</nav>
  <button class="ml-auto">登录</button>
</header>

```

### Flex 边界保护

在横向布局中，文字过长经常会挤压图标或者头像，`shrink-0` 能强制元素保持原始物理尺寸：

```html
<div class="flex items-center gap-3">
  <img src="avatar.jpg" class="size-10 shrink-0 rounded-full" />
  <div class="min-w-0">
    <h3 class="truncate">这里是一个非常长长长长长的用户名</h3>
  </div>
</div>

```

### 子项的自决权：Self 对齐

Flex 允许子项在交叉轴上自主对齐，无需影响整体布局：

```html
<div class="flex flex-col gap-4">
  <div>全局通知栏</div>
  <button class="self-start">返回</button>
  <span class="self-center text-sm">无更多内容</span>
</div>

```

## 什么时候我会用 Grid

尽管我偏爱 Flex，但当遇到以下明确的二维布局需求时，我会毫不犹豫切换到 Grid。

### 响应式页面布局

Grid 最大的优势是用 CSS 控制 HTML 结构的视觉排列，无需改动 DOM：

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="md:col-span-2">主要内容区域</div>
  <div class="md:col-span-1">侧边栏</div>
</div>

```

### 不规则或固定比例布局

当需要混合固定宽度与弹性区域时，Grid 的轨道定义极其直观：

```html
<div class="grid grid-cols-[240px_1fr] gap-4">
  <aside>固定 240px 侧边栏</aside>
  <main>自适应主体</main>
</div>

```

### 精确控制布局需求

仪表盘、数据看板等场景中，某些模块需占据多个单元格，这种显式定位能力是 Flex 无法实现的。

```html
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2">占据两列</div>
  <div>占据一列</div>
  <div class="col-span-3">占据三列</div>
</div>

```

::tip
文章部分内容参考并融合自御守老师的[《个人向 CSS 编码风格汇总》](https://archive.bikari.top/book/daily/44dc7f8){target="\_blank"}，在此致谢。
::
