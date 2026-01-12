---
title: 实时网速测算工具
description: 基于 Image 资源加载与 Performance API 实现的轻量级网速测量方案
language: typescript
tags:
 - network
 - performance
---

```ts
function calculateSpeed() {
  const FILE_SIZE = 882 // image Bytes
  const FILE_URL = 'https://example/xxx.png'

  return new Promise<number>((resolve, reject) => {
    const img = new Image()
    const start = performance.now()

    img.onload = function () {
      const end = performance.now()
      const duration = (end - start) / 1000
      const speed = FILE_SIZE / duration
      resolve(speed)
    }

    img.onerror = reject

    img.src = `${FILE_URL}?timestamp=${start}`
  }).catch(console.error)
}

function bytesToHuman(speed: number) {
  if (!speed || speed < 0)
    return '0.00 B/s'

  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(speed) / Math.log(1024))
  return `${(speed / 1024 ** i).toFixed(2)} ${units[i]}/s`
}
```

[灵感来源：视频播放弱网提示实现](https://mp.weixin.qq.com/s/XYkbHzDg8CIF3VER7xgs1g)
