---
title: Android 开发效率工具箱：常用库、插件与镜像源
date: 2026-07-03 18:30:00
tags:
  - Android
categories:
  - Android
---

程序员的效率提升，一半靠新键盘（心理作用），另一半靠一套顺手的工具链（真实作用）。这篇整理我在 Android 开发中沉淀下来的三类效率工具：开箱即用的第三方库、Android Studio 插件、以及国内构建提速必备的 Maven 镜像源——最后这个能治好你「一杯茶一包烟，一个 Gradle sync 一天」的顽疾。

<!-- more -->

## 一、常用第三方库

### UI 整体方案

- [**XUI**](https://github.com/xuexiangjys/XUI/blob/master/README_ZH.md)：简洁优雅的 Android 原生 UI 框架。注意它给出的是一整套 UI 解决方案，如果只想用其中几个控件，没必要引入这么庞大的库。
- [**QMUI_Android**](https://github.com/Tencent/QMUI_Android)：腾讯出品，辅助快速搭建具备基本设计还原效果的项目，丰富控件 + 兼容处理，让开发者专注业务。

### 单点控件

- [**MaterialEditText**](https://github.com/rengwuxian/MaterialEditText)：符合 Material Design 规范的 EditText。
- [**BasePopup**](https://github.com/razerdp/BasePopup)：对系统 PopupWindow 封装改进的弹窗库，自由度和 API 丰富度都很高。
- [**DslTabLayout**](https://github.com/angcyo/DslTabLayout)：号称 Android 界最万能的 TabLayout，高能自绘控件，继承自 ViewGroup 而非组合控件。
- [**SmartRefreshLayout**](https://github.com/scwang90/SmartRefreshLayout)：强大稳定的下拉刷新框架，支持所有 View 和多层嵌套结构，集成了各种炫酷的 Header/Footer。

### 选择器

- [**AndroidPicker**](https://github.com/gzu-liyujiang/AndroidPicker)：日期时间、单项、二三级联动、城市地址、数字、日历、颜色、文件目录选择器，一库全包。
- [**PictureSelector**](https://github.com/LuckSiege/PictureSelector/blob/version_component/README_CN.md)：图片/视频/音频选择器，支持拍照、裁剪、压缩、权限适配。
- [**CityPicker**](https://github.com/xuexiangjys/CityPicker)：美团外卖式的城市选择界面，一行代码接入。

### WebView 与权限

- [**AgentWeb**](https://github.com/Justson/AgentWeb)：极易使用且功能强大的 WebView 库，解决了 Android WebView 的一系列坑。
- [**XXPermissions**](https://github.com/getActivity/XXPermissions)：权限请求框架，长期维护、系统适配及时。

### 网络框架

- [**OkHttp**](https://github.com/square/okhttp) / [**Retrofit**](https://github.com/square/retrofit)：事实标准，不用介绍——没用过的 Android 开发者建议假装用过。
- [**RxHttp**](https://github.com/liujingxing/rxhttp/blob/master/README_zh.md)、[**Net**](https://github.com/liangjingkanji/Net)、[**EasyHttp**](https://github.com/getActivity/EasyHttp)：国产封装，链式 API 更顺手，按团队口味选。

## 二、Android Studio 插件

- [**Translation**](https://github.com/YiiGuxing/TranslationPlugin)：强大的 IDE 翻译插件，支持 Google/有道/百度等翻译引擎，IDE 插件市场直接搜 "Translation" 安装。
- [**CodeGlance**](https://github.com/Vektah/CodeGlance)：编辑器右侧的代码缩略图，类似 Sublime 的 minimap，长文件快速定位。
- [**Android Drawable Preview**](https://github.com/mistamek/Android-drawable-preview-plugin)：在项目树里直接预览 drawable 图标。
- [**JsonToKotlinClass**](https://github.com/wuseal/JsonToKotlinClass)：JSON 字符串一键转 Kotlin data class。
- [**WakaTime**](https://wakatime.com/dashboard)：编码时间统计工具，支持主流 IDE 和 Chrome。注册账号 → 装插件 → 填 Secret API Key，就能在网站上看到自己的编码报告。

## 三、Maven 镜像源（国内构建提速）

Gradle sync 转圈转到怀疑人生，八成不是你网速的问题，是仓库在地球另一边。阿里云的镜像仓库是目前最省心的方案（[阿里云云效 Maven](https://developer.aliyun.com/mvn/view)）：

| 仓库 | 源地址 | 阿里云镜像 |
|:---|:---|:---|
| mavenCentral | https://repo1.maven.org/maven2 | https://maven.aliyun.com/repository/central |
| google | https://maven.google.com | https://maven.aliyun.com/repository/google |
| gradle-plugin | https://plugins.gradle.org/m2 | https://maven.aliyun.com/repository/gradle-plugin |
| jcenter（已废弃） | http://jcenter.bintray.com | https://maven.aliyun.com/repository/jcenter |
| public（central+jcenter 聚合） | — | https://maven.aliyun.com/repository/public |
| jitpack | https://jitpack.io | https://jitpack.io |

jcenter 已经作古，老项目里还有依赖走 jcenter 的，尽快迁到 mavenCentral 或用阿里云镜像兜底——别等哪天全量构建失败了才想起这条。
