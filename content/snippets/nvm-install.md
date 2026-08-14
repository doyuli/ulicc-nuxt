---
title: NVM 安装新版本并迁移全局包
description: 使用 nvm 安装新的 Node 版本时，同时迁移旧版本中的 npm 全局包，避免重新安装常用工具。
language: bash
tags:
  - Node
  - Bash
---

```bash
# 查看当前已安装的 Node.js 版本
nvm ls

# 安装新版本并迁移指定版本的全局包
nvm install 24.16.0 --reinstall-packages-from=24.12.0

# 或者从当前正在使用的版本迁移全局包
nvm install 24.16.0 --reinstall-packages-from=current

# 切换到新版本
nvm use 24.16.0

# 设置默认版本
nvm alias default 24.16.0

# 查看全局包
npm ls -g --depth=0
```
