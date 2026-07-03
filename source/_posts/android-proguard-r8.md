---
title: Android 混淆实践笔记：ProGuard 与 R8
date: 2026-07-03 18:00:00
tags:
  - Android
categories:
  - Android
---

每个 Android 开发者大概都经历过这个剧本：debug 包千好万好，release 包一打开就闪退，一查崩溃堆栈全是 `a.b.c.a(Unknown Source)`——恭喜，你被混淆背刺了。

这篇是我踩坑多年攒下的混淆配置笔记，覆盖参数设置、keep 规则语法、常用规则模板、规则叠加机制和资源压缩，最后聊聊 ProGuard 与 R8 该选谁。官方文档见 [Shrink, obfuscate, and optimize your app](https://developer.android.com/studio/build/shrink-code?hl=zh-cn)。

<!-- more -->

## 一、混淆参数设置

```
-optimizationpasses 5                       # 代码混淆的压缩比例，值介于0-7，默认5
-verbose                                    # 混淆时记录日志
-dontoptimize                               # 不优化输入的类文件
-dontshrink                                 # 关闭压缩
-dontpreverify                              # 关闭预校验(作用于Java平台，Android不需要，去掉可加快混淆)
-dontobfuscate                              # 关闭混淆
-ignorewarnings                             # 忽略警告
-dontwarn com.squareup.okhttp.**            # 指定类不输出警告信息
-dontusemixedcaseclassnames                 # 混淆后类名都为小写
-dontskipnonpubliclibraryclasses            # 不跳过非公共的库的类
-printmapping mapping.txt                   # 生成原类名与混淆后类名的映射文件mapping.txt
-useuniqueclassmembernames                  # 把混淆类中的方法名也混淆
-allowaccessmodification                    # 优化时允许访问并修改有修饰符的类及类的成员
-renamesourcefileattribute SourceFile       # 将源码中有意义的类名转换成SourceFile，用于定位混淆后的崩溃代码
-keepattributes SourceFile,LineNumberTable  # 保留行号
-keepattributes *Annotation*,InnerClasses,Signature,EnclosingMethod # 避免混淆注解、内部类、泛型、匿名类
-optimizations !code/simplification/cast,!field/ ,!class/merging/   # 指定混淆时采用的算法
```

## 二、keep 规则语法

保持规则的语法组成：

```
[保持命令] [类] {
    [成员]
}
```

**保持命令：**

```
-keep                           # 防止类和类成员被移除或被混淆
-keepnames                      # 防止类和类成员被混淆
-keepclassmembers               # 防止类成员被移除或被混淆
-keepclassmembernames           # 防止类成员被混淆
-keepclasseswithmembers         # 防止拥有该成员的类和类成员被移除或被混淆
-keepclasseswithmembernames     # 防止拥有该成员的类和类成员被混淆
```

**类的匹配：**

- 访问修饰符：`public`、`private`、`protected`
- 通配符 `*`：匹配任意长度字符，但不包含包名分隔符 `.`
- 通配符 `**`：匹配任意长度字符，且包含包名分隔符 `.`
- `extends`：匹配某个父类的子类
- `implements`：匹配实现了某接口的类
- `$`：内部类

**成员的匹配：**

- `<init>`：匹配所有构造器
- `<fields>`：匹配所有域
- `<methods>`：匹配所有方法
- 除了 `*` 和 `**`，还支持 `***` 通配符，匹配任意参数类型
- `...`：匹配任意长度的任意类型参数，如 `void test(...)` 可以匹配不同参数个数的 test 方法

## 三、常用混淆规则模板

```
# 不混淆某个类的类名，及类中的内容
-keep class cn.listenergao.myapp.example.Test { *; }

# 不混淆指定包名下的类名，不包括子包下的类名
-keep class cn.listenergao.myapp*

# 不混淆指定包名下的类名，及类里的内容
-keep class cn.listenergao.myapp* {*;}

# 不混淆指定包名下的类名，包括子包下的类名
-keep class cn.listenergao.myapp**

# 不混淆某个类的子类
-keep public class * extends cn.listenergao.myapp.base.BaseFragment

# 不混淆实现了某个接口的类
-keep class * implements cn.listenergao.myapp.dao.DaoImp

# 不混淆类名中包含了"entity"的类，及类中内容
-keep class **.*entity*.** {*;}

# 不混淆内部类中的所有public内容
-keep class cn.listenergao.myapp.widget.CustomView$OnClickInterface {
    public *;
}

# 保持类中特定内容而不是所有内容
-keep class cn.listenergao.myapp.example.Test{
    <init>;     # 匹配所有构造器
    <fields>;   # 匹配所有域
    <methods>;  # 匹配所有方法
}

# 可以在<fields>或<methods>前面加上 private/public/native 等进一步限定
-keep class cn.listenergao.myapp.example.Test{
    public <methods>;                   # 该类下所有公有方法不被混淆
    private <methods>;                  # 该类下所有私有方法不被混淆
    public <init>(java.lang.String);    # 该类的 String 参数构造方法不被混淆
}

# 保留内部类需要用 $ 符号：保持 Test 类中的 MyClass 不被混淆
-keep class cn.listenergao.myapp.example.Test$MyClass{*;}

# 不混淆 native 方法（JNI 依赖完整的包名类名方法名）
-keepclasseswithmembernames class * {
    native <methods>;
}

# 不混淆枚举类（values/valueOf 会被反射调用）
-keepclassmembers enum * {
  public static **[] values();
  public static ** valueOf(java.lang.String);
}

# 不混淆资源类
-keepclassmembers class **.R$* {
    public static <fields>;
}

# 不混淆实现了 Serializable 接口的类成员
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# 不混淆实现了 Parcelable 接口的类成员
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}
```

**注意事项（每一条背后都是一次线上事故，建议裱起来）：**

1. JNI 方法不可混淆，方法名需与 native 方法保持一致
2. 反射用到的类不混淆，否则反射可能出问题
3. 四大组件、Application 子类、Framework 层下的类、自定义 View 默认不会被混淆，无需另外配置
4. WebView 的 JS 调用接口方法不可混淆
5. 注解相关的类不混淆
6. GSON、Fastjson 等解析的 Bean 数据类不可混淆
7. 枚举类中的 values 和 valueOf 这两个方法不可混淆（反射调用）
8. 继承 Parcelable 和 Serializable 等可序列化的类不可混淆
9. 第三方库或 SDK 参考第三方提供的混淆规则，没提供的话建议第三方包全部不混淆

## 四、混淆规则的叠加

你有没有想过一个灵异现象：主模块的 proguard-rules.pro 明明空空如也，代码却被混淆了？这不是闹鬼，是因为混淆规则是**叠加**的，来源远不止你写的那一份：

1. **各模块的 proguard-rules.pro** —— 子模块也可以有，某个模块的配置可能影响其它模块
2. **proguard-android-optimize.txt** —— AGP 编译时生成，包含对大多数 Android 项目有用的规则，并启用 `@Keep*` 注解；AGP 还提供 proguard-defaults.txt 和 proguard-android.txt，可通过 `getDefaultProguardFile` 设置，建议用 optimize 这份（多了优化配置）
3. **build/intermediates/proguard-rules/debug/aapt_rules.txt** —— AAPT2 根据清单文件、布局及其他资源的引用自动生成保留规则，比如不混淆每个 Activity
4. **AAR 库**的 `/proguard.txt`
5. **Jar 库**的 `/META-INF/proguard/`

想查看所有规则叠加后的最终混淆规则，在主模块 proguard-rules.pro 添加：

```
-printconfiguration ./build/outputs/mapping/full-config.txt
```

## 五、资源压缩

资源压缩分两步：**资源合并**与**资源移除**。

**资源合并**：无论是否配置 `shrinkResources true`，AGP 构建 APK 时都会执行。存在两个或更多同名资源时，AGP 从重复项中选择优先级更高的文件传递给 AAPT2。级联优先顺序：

```
依赖项 → 主资源 → 渠道 → 构建类型
```

比如重复资源存在于主资源及渠道中，Gradle 会选渠道中的资源；但如果重复资源在同一层次（如 src/main/res/ 和 src/main/res2/），Gradle 会报资源合并错误。

**资源移除**：开启资源压缩后，所有未被使用的资源默认会被移除。想自定义保留/移除，可在 `res/raw/` 下创建 keep.xml（此文件不会打包进 APK，支持通配符 `*`）：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:keep="@layout/l_used*_c,@layout/l_used_a,@layout/l_used_b*"
    tools:discard="@layout/unused2"
    tools:shrinkMode="strict"/>
```

`shrinkMode` 可选 strict / safe：前者严格按 keep 和 discard 指定的资源保留；后者保守删除未引用资源（如代码中用 `Resources.getIdentifier()` 引用的资源会保留）。

另外还可以用 resConfigs 移除不需要的备用资源，比如只保留中文：

```groovy
android {
    defaultConfig {
        resConfigs "zh-rCN" // 不需要国际化时只打包中文资源
    }
}
```

## 六、ProGuard 与 R8

- **ProGuard**：压缩、优化和混淆 Java 字节码的免费工具，[开源仓库](https://github.com/Guardsquare/proguard)
- **R8**：ProGuard 的替代工具，兼容现有 ProGuard 规则，更快更强。AGP 3.4.0 及以上默认使用 R8

结论：直接用 R8，别纠结。兼容绝大部分 ProGuard 规则、编译更快、对 Kotlin 更友好——想换回 ProGuard 属于「可以但没必要」系列。

构建后会在 `build/outputs/mapping/release/` 输出以下文件：

- **mapping.txt**：原始与混淆后的类、方法、字段名称映射。崩溃堆栈还原全靠它，发版后务必留存——弄丢 mapping 文件再看线上崩溃，就像拿着一张全是马赛克的藏宝图
- **seeds.txt**：未进行混淆的类与成员
- **usage.txt**：APK 中被移除的代码
- **resources.txt**：资源优化记录

这些文件不一定都有，可以在 proguard-rules.pro 显式指定输出：

```
-printmapping ./build/outputs/mapping/mapping.txt
-printseeds ./build/outputs/mapping/seeds.txt
-printusage ./build/outputs/mapping/usage.txt
```
