---
title: 我的 Mac 软件清单与开发环境配置
date: 2026-07-03 18:40:00
tags:
  - Mac
  - 效率工具
categories:
  - 工具
---

新 Mac 到手的兴奋感，通常在打开空荡荡的启动台那一刻结束——「我原来都装了什么来着？」然后花一下午凭记忆碎片一个个找回来，还总觉得漏了什么（确实漏了，一周后你会想起来的）。

这篇就是为了终结这个轮回：我的 Mac 常备软件清单和 JDK 环境变量配置备忘，绝大部分免费或开源，照着装完直接开工。

<!-- more -->

## 一、基础必装

### [Homebrew](https://brew.sh/index_zh-cn)（开源免费）

macOS 的软件包管理工具，后面很多软件都通过它一行命令安装。主要由 brew、homebrew-core（核心源）、homebrew-cask（macOS 应用和大型二进制）、homebrew-bottles（预编译包）组成。国内建议配置镜像源，可参考[这篇安装教程](https://zhuanlan.zhihu.com/p/90508170)。

### [iTerm2](https://iterm2.com/)（开源免费）

Mac 下最好用的终端，替代系统自带 Terminal：

```bash
brew install --cask iterm2
```

建议配合 oh-my-zsh 使用，教程网上很多。

### [Alfred](https://www.alfredapp.com/)（部分功能收费）

Mac 效率神器：手不离键盘完成打开 App、搜文件、搜网页、自定义 workflow、剪贴板管理等所有操作，Spotlight 的完全上位替代——用熟之后再摸鼠标会有一种莫名的挫败感。免费版功能已经够用，进阶玩法可参考 [高效 Alfred 进阶](https://juejin.cn/post/6844904062484217863)。

## 二、开发相关

### [draw.io](https://drawio-app.com/)（免费）

强大简洁的绘图工具：流程图、UML、架构图、原型图全支持，可同步 GitHub/Google Drive，支持[在线编辑](http://Draw.io)，也有离线桌面版。

### [scrcpy](https://github.com/Genymobile/scrcpy/blob/master/README.zh-Hans.md)（开源免费）

USB/TCP 连接即可在电脑上显示并控制 Android 设备，不需要 root，支持 Linux/Windows/macOS。Android 开发调试和录屏演示利器。

## 三、状态栏与系统监控

- [**iStat Menus**](https://bjango.com/mac/istatmenus/)（收费）：最优秀的系统监控工具，菜单栏实时显示 CPU、GPU、内存、硬盘、网络、温度、电池，稳定且占用低。
- [**eul**](https://github.com/gao-sun/eul)（开源免费）：SwiftUI 编写的菜单栏监控，iStat Menus 的免费替代：`brew install --cask eul`
- [**State**](https://apps.apple.com/cn/app/id1472818562?mt=12)（免费）：App Store 直接装的系统状态监控。
- [**iBar**](https://apps.apple.com/cn/app/id6443843900?mt=12)（免费，Pro 收费）：菜单栏图标管理，图标太多时一键收纳，刘海屏 Mac 体验提升明显。

## 四、截图工具

- [**Snipaste**](https://zh.snipaste.com/)：简单强大的截图 + 贴图工具。「贴图」是杀手级功能——把设计稿截图钉在屏幕上对照写 UI，比在两个窗口间 Cmd+Tab 切到手抽筋文明多了：`brew install --cask snipaste`
- [**iShot**](https://www.better365.com/ishot.html)：截图、长截图、带壳截图、标注、取色、录屏、录音、OCR、翻译，一个顶十个。

## 五、其他

- [**右键助手**](https://apps.apple.com/cn/app/id1551462255?mt=12)（部分收费）：给访达右键菜单加 30 多种小工具（新建文件、拷贝路径、快速移动等）。

## 附：Mac 配置 JDK 环境变量

JDK 各版本下载：[Oracle Archive](https://www.oracle.com/cn/java/technologies/downloads/archive/)。安装路径默认在 `/Library/Java/JavaVirtualMachines/`，如 JDK8：`/Library/Java/JavaVirtualMachines/jdk1.8.0_341.jdk/Contents/Home`。

macOS Catalina 之后默认 shell 是 zsh，配置写进 `~/.zshrc`（老系统用 bash 的话写 `~/.bash_profile`——对着 `.bash_profile` 改半天却不生效的朋友，先看看自己的 shell 是谁）：

```bash
# 安装单个 JDK 版本
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_341.jdk/Contents/Home

# 安装多个 JDK 版本时，可以做成别名一键切换
export JAVA_7_HOME=/Library/Java/JavaVirtualMachines/jdk1.7.0_80.jdk/Contents/Home
export JAVA_8_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_341.jdk/Contents/Home

alias jdk7="export JAVA_HOME=$JAVA_7_HOME"   # 输入 jdk7 切换到 JDK 1.7
alias jdk8="export JAVA_HOME=$JAVA_8_HOME"   # 输入 jdk8 切换到 JDK 1.8

# 默认指向系统里最新的 JDK 版本
export JAVA_HOME=`/usr/libexec/java_home`
```

改完执行 `source ~/.zshrc` 生效，`java -version` 验证。
