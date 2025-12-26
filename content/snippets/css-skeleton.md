---
title: 纯 CSS 骨架屏
description: 使用纯 CSS 实现骨架屏效果，无需额外的 JavaScript 代码
language: css
tags: [css, skeleton]
---

::code-collapse

```css
@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

*[loading='true'] > div:not([loading='true']) {
  position: relative;
  overflow: hidden;
  background-color: #eff1f3 !important;
  border: none !important;
  min-height: 30px;
  cursor: default;
  pointer-events: none;
}

*[loading='true'] > div:not([loading='true'])::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: skeleton-shimmer 1.5s infinite;
}

*[loading='true'] > div:not([loading='true']) > * {
  visibility: hidden !important;
}

```

::
