---
title: 纯 CSS 骨架屏
description: 使用纯 CSS 实现骨架屏效果，无需额外的 JavaScript 代码
language: css
tags: [css, skeleton]
---

```css
*[loading='true'] > div:not([loading='true']) {
  background-image: linear-gradient(90deg, #f0f2f5 25%, #e6e8eb 37%, #f0f2f5 63%) !important;
  background-size: 400% 100% !important;
  animation: skeleton-loading 1.4s infinite ease !important;
  border: none !important;
  min-height: 30px;
}
*[loading='true'] > div:not([loading='true']) > * {
  display: none !important;
}
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

```
