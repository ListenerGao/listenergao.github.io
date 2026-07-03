---
title: 我常用的 adb 命令速查
date: 2026-07-03 18:20:00
tags:
  - Android
  - adb
categories:
  - Android
---

做 Android 开发这些年，adb 大概是我敲得最多的三个字母（没有之一，git 表示不服）。命令大全网上一搜一大把，但真到用的时候还是想不起来参数怎么拼——所以这篇只收录我日常真正高频使用的命令，按场景分类，忘了就回来抄。想要百科全书版的，推荐 [mzlogin/awesome-adb](https://github.com/mzlogin/awesome-adb)，本文的整理也参考了该项目。

<!-- more -->

## 一、设备连接

**USB 连接**：设备开启「开发者选项 → USB 调试」，连线后确认：

```bash
adb devices        # 列出已连接设备
```

**WiFi 连接**（初次需借助 USB 线）：

```bash
adb tcpip 5555                    # 让设备在 5555 端口监听 TCP/IP 连接
adb connect <device-ip>           # 断开 USB 后用设备 IP 连接（IP 在设置-关于手机里查）
adb disconnect <device-ip>        # 用完断开
```

多设备并存时用 `-s` 指定目标设备：

```bash
adb -s emulator-5554 shell
```

## 二、应用管理

```bash
adb install -r demo.apk                   # 安装（-r 允许覆盖安装，-t 允许装 debug 包，-d 允许降级）
adb uninstall <package>                   # 卸载（-k 保留数据和缓存）
adb shell pm clear <package>              # 清除应用数据与缓存（等于设置里点「清除数据」）
adb shell am force-stop <package>         # 强制停止应用
adb shell pm list packages -3             # 列出第三方应用包名（-s 系统应用，无参数为全部）
adb shell pm list packages <keyword>      # 按关键字过滤包名
adb shell pm path <package>               # 查看应用安装路径
adb shell dumpsys package <package>       # 查看应用详细信息（版本、权限、签名等）
```

安装失败时控制台会甩给你一串大写的错误码，看着吓人，其实翻译过来大多是「你装过了」「签名不对」「先卸载」这三句话的排列组合。常见的几个：

| 错误码 | 原因 | 解决 |
|:---|:---|:---|
| INSTALL_FAILED_ALREADY_EXISTS | 应用已存在 | 加 `-r` 或先卸载 |
| INSTALL_FAILED_UPDATE_INCOMPATIBLE | 已装同名应用但签名不一致 | 先卸载再装 |
| INSTALL_FAILED_VERSION_DOWNGRADE | 已安装更高版本 | 加 `-d` |
| INSTALL_FAILED_TEST_ONLY | Android Studio 直接 Run 出来的包 | 用 assembleDebug 重新打包，或加 `-t` |
| INSTALL_FAILED_INSUFFICIENT_STORAGE | 存储空间不足 | 清理空间 |

## 三、实战：从手机提取已安装应用的 APK

「这个 App 的效果怎么实现的？」——想反编译研究一下，第一步得先把 APK 弄下来。这是我用得最多的组合技之一：

```bash
adb shell pm list packages | grep <关键字>     # 1. 找到目标应用包名（也可用 LibChecker 查）
adb shell pm path com.tencent.mobileqq         # 2. 获取安装路径
adb pull /data/app/<path>/base.apk ~/Desktop/  # 3. 拉取 APK 到电脑
```

## 四、日志

```bash
adb logcat                                # 全部日志
adb logcat -s TagName                     # 只看指定 tag
adb logcat '*:W'                          # 按级别过滤（V/D/I/W/E/F/S 依次升高；macOS 下要加引号）
adb logcat ActivityManager:I MyApp:D '*:S'  # 组合过滤：指定 tag 的指定级别，屏蔽其它
adb logcat -v time                        # 输出格式带时间戳（可选 brief/tag/time/threadtime/long 等）
adb logcat -c                             # 清空日志缓冲区
adb logcat > log.txt                      # 输出到文件
adb wait-for-device logcat -b all -v time > log.txt   # 设备一连上就自动开抓，抓全部缓冲区
adb shell dmesg                           # 内核日志
```

## 五、模拟按键与输入

`adb shell input` 在自动化和调试时非常好用：

```bash
adb shell input keyevent 3                # HOME 键
adb shell input keyevent 4                # 返回键
adb shell input keyevent 26               # 电源键
adb shell input keyevent 82               # 菜单键
adb shell input keyevent 24               # 音量加（25 减，164 静音）
adb shell input text hello_world          # 向焦点文本框输入文本
adb shell input tap 500 800               # 点击坐标
adb shell input swipe 300 1000 300 500    # 滑动（可加持续时间 ms）
```

完整 keycode 列表见 [KeyEvent 文档](https://developer.android.com/reference/android/view/KeyEvent.html)。

## 六、截图与录屏

```bash
adb exec-out screencap -p > sc.png              # 截图直接保存到电脑
adb shell screenrecord /sdcard/demo.mp4         # 录屏（Ctrl-C 停止，默认最长 180 秒）
adb shell screenrecord --size 1280x720 --bit-rate 6000000 --time-limit 30 /sdcard/demo.mp4
adb pull /sdcard/demo.mp4                       # 导出到电脑
```

## 七、设备信息

```bash
adb shell getprop ro.build.version.release   # 系统版本
adb shell getprop ro.build.version.sdk       # SDK 版本
adb shell getprop ro.product.model           # 设备型号
adb shell getprop ro.product.brand           # 厂商
adb shell wm size                            # 屏幕分辨率
adb shell wm density                         # 屏幕密度
adb shell dumpsys battery                    # 电池状态（level 为当前电量）
adb shell settings get secure android_id     # android_id
adb shell cat /proc/cpuinfo                  # CPU 信息
adb shell cat /proc/meminfo                  # 内存信息
adb shell ifconfig wlan0                     # WiFi IP 地址
```

## 八、文件传输

```bash
adb push <本地路径> <设备路径>     # 电脑 → 设备
adb pull <设备路径> [本地路径]     # 设备 → 电脑，本地路径省略则存到当前目录
```

## 九、与应用交互（am 命令）

```bash
adb shell am start -a android.settings.SETTINGS                # 打开系统设置
adb shell am start -a android.intent.action.DIAL -d tel:10086  # 打开拨号页
adb shell am start -n <package>/<activity>                     # 启动指定 Activity
adb shell am start -W -n <package>/<activity>                  # 启动并等待完成（测启动耗时）
adb shell am broadcast -a <action>                             # 发送广播（制造难复现的广播场景很实用）
```

## 十、修改设备设置（调试适配利器）

```bash
adb shell wm size 480x1024        # 临时修改分辨率（测小屏适配）
adb shell wm size reset           # 恢复
adb shell wm density 160          # 临时修改屏幕密度
adb shell wm density reset        # 恢复
```

## 十一、其他

```bash
adb reboot                        # 重启设备
adb reboot recovery               # 重启到 Recovery 模式
adb reboot bootloader             # 重启到 Fastboot 模式
adb shell monkey -p <package> -v 500   # Monkey 随机事件压力测试（让猴子帮你乱点 500 下）
adb kill-server && adb start-server    # adb 抽风时的重启大法，成功率高得离谱
```

---

**参考**：[mzlogin/awesome-adb](https://github.com/mzlogin/awesome-adb)——最全面的 adb 命令中文文档，本文按个人使用频率做了精选和场景化整理。
