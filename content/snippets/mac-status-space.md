---
title: MacOS 菜单栏图标间距自定义
description: 通过 defaults 命令调整 Mac 菜单栏图标的间距与内边距，解决图标过多或刘海屏遮挡问题。
language: bash
tags:
  - MacOS
  - Bash
---

```bash
# 指定间距
defaults -currentHost write -globalDomain NSStatusItemSpacing -int 8
# 指定内边距
defaults -currentHost write -globalDomain NSStatusItemSelectionPadding -int 8

# 当前间距查询
defaults -currentHost read -globalDomain NSStatusItemSpacing
defaults -currentHost read -globalDomain NSStatusItemSelectionPadding

# 重置间距
defaults -currentHost delete -globalDomain NSStatusItemSpacing
defaults -currentHost delete -globalDomain NSStatusItemSelectionPadding

# 生效命令（较新系统可能仍需要你注销或重启）
killall ControlCenter
```
