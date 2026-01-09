---
title: 在 Nuxt Content 中自动计算文章阅读时间的一种实现思路
date: 2025-12-27
description: 结合中文、英文与代码块内容，在 Nuxt Content 的 afterParse hook 中实现一个更合理的文章阅读时间自动计算方案。
tags:
  - 技术分享
  - Plugin
---

## 前置场景

在博客文章中展示预计阅读时间是一个非常常见的需求，它可以帮助读者快速判断一篇文章的阅读成本，从而提升整体的阅读体验。但对于作者来说，这件事多少有点麻烦：每次写完文章，还要纠结——这篇文章应该标注 3 分钟，还是 5 分钟？

作为一个能自动化就绝不手动的人，我开始思考，这个阅读时间，是否可以在构建阶段自动算出来？

## 实现思路

最直观的思路其实很简单：

- 统计文章的字数
- 设定一个每分钟阅读量
- 计算结果后，写入文章的上下文中

查询 Nuxt Content 的文档后，发现它提供了一个非常合适的 hook：`content:file:afterParse`
这个 hook 会在 Markdown 文件解析完成后触发，非常适合做一些内容级的后处理。

## 一个最简单的实现

如果暂时不考虑文章结构，只关心能不能跑起来，实现其实非常直接：

```ts
const CHARS_PER_MIN = 300

export default defineNuxtConfig({
  hooks: {
    'content:file:afterParse': function (ctx) {
      const { file, content } = ctx

      const body = typeof file.body === 'string' ? file.body : ''

      const text = body
        // 行内代码：保留内容
        .replace(/`([^`]+)`/g, '$1')
        // 图片
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        // 链接：保留文本
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // 标题、列表等结构符号
        .replace(/^[>\-*+]\s+|^#{1,6}\s+/gm, '')
        // 加粗、斜体标记
        .replace(/\*\*|__|\*|_/g, '')
        .trim()

      content.minRead = Math.ceil(text.length / CHARS_PER_MIN)
    }
  }
})
```

这个方案的核心思路是去掉 Markdown 语法，只统计真正需要阅读的文本长度，在中文为主、代码不多的文章中，这个结果已经基本可用。

## 深入思考

随着文章内容变得更偏技术向，一些问题开始显现出来：

1. 代码块被当作普通文本计算
   实际阅读代码时，大多数时候是扫读，而不是逐字阅读。

2. 英文内容不适合用 length 统计
   英文的阅读成本更接近单词数，而不是字符数。

这意味着，不同类型的内容，应该使用不同的阅读模型,结合自己平时阅读技术博客的体验，我把内容拆分成了三类：

| 内容类型 | 统计方式 |
| -------- | -------- |
| 中文说明 | 按字符   |
| 英文内容 | 按单词   |
| 代码块   | 按行     |

并为它们分别设定了一个相对合理的阅读速度：

```ts
const CHARS_PER_MIN = 300 // 中文
const WORDS_PER_MIN = 180 // 英文
const CODE_LINES_PER_MIN = 60 // 代码块
```

代码块的处理，避免代码内容对正文统计造成干扰：

````ts
const CODE_BLOCK_REG = /```[\s\S]*?```/g

const codeBlocks = body.match(CODE_BLOCK_REG) ?? []
const codeLines = codeBlocks
  .map(block => block.split('\n').length)
  .reduce((a, b) => a + b, 0)

const text = body.replace(CODE_BLOCK_REG, '')
````

移除代码块后，再分别统计中文字符和英文单词：

```ts
const chineseChars = (text.match(/[\u4E00-\u9FA5]/g) ?? []).length
const englishWords = (text.match(/[a-z]+/gi) ?? []).length
```

合并计算阅读时间：

```ts
const minutes = chineseChars / CHARS_PER_MIN
  + englishWords / WORDS_PER_MIN
  + codeLines / CODE_LINES_PER_MIN

content.minRead = Math.max(1, Math.ceil(minutes))
```

## 完整实现

````ts
const CHARS_PER_MIN = 300
const WORDS_PER_MIN = 180
const CODE_LINES_PER_MIN = 60

const CODE_BLOCK_REG = /```[\s\S]*?```/g

export default defineNuxtConfig({
  hooks: {
    'content:file:afterParse': function (ctx) {
      const { file, content } = ctx

      if (!file.id.endsWith('.md'))
        return

      if (content.minRead)
        return

      const body = typeof file.body === 'string' ? file.body : ''

      if (!body)
        return

      const codeBlocks = body.match(CODE_BLOCK_REG) ?? []
      const codeLines = codeBlocks
        .map(block => block.split('\n').length)
        .reduce((a, b) => a + b, 0)

      const text = body.replace(CODE_BLOCK_REG, '')

      const chineseChars = (text.match(/[\u4E00-\u9FA5]/g) ?? []).length
      const englishWords = (text.match(/[a-z]+/gi) ?? []).length

      const minutes = chineseChars / CHARS_PER_MIN
        + englishWords / WORDS_PER_MIN
        + codeLines / CODE_LINES_PER_MIN

      content.minRead = Math.max(1, Math.ceil(minutes))
    }
  },
})
````
