---
title:  Hackergame 2022 Writeup
excerpt: Hackergame 2022的解题思路（
date: 2022-10-29
---

## 签到

只需要查看页面的源代码不难找到一个`timeLimit`

```javascript
      data: {
        digits: [0, 1, 2, 3].map(i => ({
          touches: new Map(),
          context: null,
          timeLimit: TIME_LIMITS[i],
          timeLeft: TIME_LIMITS[i],
          timeState: 0,  // 0: before, 1: during, 2: after
          timeCallbackId: null,
          result: '?',
          recognitionState: 0,  // 0: not running, 1: running and clean, 2: running and dirty
        })),
        contextForRecognition: null,
        modelPromise: tf.loadLayersModel('static/model/model.json'),
        modelReady: false,
      },
```

 因此只需要把时间变长就可以慢慢写了

```javascript
app.digits.forEach((d) => { d.timeLimit = 10 }) 
```

~~（怎么我10秒写出来的数字还能识别错~~

## 猫咪问答喵

1. https://cybersec.ustc.edu.cn/2022/0826/c23847a565848/page.htm

2. 在哔哩哔哩找到av260820233，看弹幕列表，发现2:42:0有弹幕，点进去~~（我觉得这个`kdenlive`字正腔圆很容易听~~

3. 直接搜索`Firefox Windows 2000`，找到[32kr](https://36kr.com/p/1639694827521)的一篇文章

   > Dotzler表示，今年6月5日的Firefox 12发布日期是Firefox支持这些老旧系统的最后期限。如果用户还不升级他们的系统，Opera将是Firefox的最佳替代方案。

4. 直接上GitHub搜索CVE，[torvalds/linux/search?q=CVE-2021-4034&type=commits](https://github.com/torvalds/linux/search?q=CVE-2021-4034&type=commits)，出来的只有一个commit

5. 这种大概只能扫全网对我这种fw来说，于是打开[shodan](https://www.shodan.io/search?query=e4%3Aff%3A65%3Ad7%3Abe%3A5d%3Ac8%3A44%3A1d%3A89%3A6b%3A50%3Af5%3A50%3Aa0%3Ace)（x，一搜就有，除了`motd.org`就是`sdf.org`的各种子域名，所以是`sdf.org`（做完了才发现加了补充说明

6. 搜索找到https://www.ustc.edu.cn/info/1057/4931.htm，但是下拉看到对比，发现在此之前就已经是20元了，而最顶上

   > 同时网字〔2003〕1号《关于实行新的网络费用分担办法的通知》终止实行。
   
   所以找到http://ustcnet.ustc.edu.cn/2003/0301/c11109a210890/pagem.htm

## 家目录里的秘密

### VSCode

直接搜索`flag{`就有啦，在`/.config/Code/User/History/2f23f721/DUGV.c`

### rclone

找到`.config/rclone/rclone.conf`发现里面是加密过的密码，查看[源码](https://github.com/rclone/rclone/blob/master/fs/config/obscure/obscure.go)发现是简单的AES加密。

看了下源代码，然后打开CyberChef

先解Base64（URL Safe），得到`b6aa93ab8b664110d9d2c4ff95e26befe5ad0a21d55d232b54de3d75610b3c7d6e71efb90cf8ae0ed8c150ddc4237f33bdec2037925a66a022acd9cb96c4`

最前面16字节就是IV：`b6aa93ab8b664110d9d2c4ff95e26bef`

后面的丢给AES-CTR解密，rclone使用了固定的Key `9c935b48730a554d6bfd7c63c886a92bd390198eb8128afbf4de162b8b95f638` 进行加密。

## HeiLang

简单的做个解析器就好啦！

```javascript
const fs = require("fs")
var raw = fs.readFileSync("getflag.hei.py").toString().split("\n")

raw.forEach(function (line) {
    if (line.startsWith("a[")) {
        line = line.substring(2)
        var value = line.split("] = ")
        var i = value[0]
        value = value[1]
        i = i.split(" | ")
        i.forEach(function (idx) {
            console.log("a[" + idx + "] = " + value);
        })
    } else {
        console.log(line)
    }
})

```

```bash
node hei.js | python3
```

## Xcaptcha

实际上就是快速进行大数计算~~（这过不去的才是真人罢~~

这种速度只能用脚本完成了，Tampermonkey ON

```javascript
// ==UserScript==
// @name         Hackergame 2022 Xcaptcha
// @namespace    http://xtexx.ml/
// @version      0.1
// @description  HKG
// @author       xtex
// @match        http://202.38.93.111:10047/xcaptcha
// @icon         https://www.google.com/s2/favicons?sz=64&domain=93.111
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
document.querySelectorAll(".form-group").forEach(function(group) {
    var expr = group.querySelector("label").textContent;
    expr = expr.substring(0, expr.length - 6);
    var result = expr.split('+');
    result = eval(result[0] + "n + " + result[1] + "n");
    group.querySelector("input").value = result.toString().replace("n", "");
});
})();
```

## 旅行照片 2.0-1

```bash
exif travel-photo-2.jpg
```

## Latex机器人-1

上网一查，发现可以`\include`和`\input`，我也不知道为什么include用不了，但是flag1直接input就行：

```latex
\input{/flag1}
```

## Flag 的痕迹

加上`do=diff`然后往前翻即可：http://202.38.93.111:15004/doku.php?id=start&do=diff

至于我是怎么发现这个do的。。，看FabricMC Wiki翻到的（

## 线路板

打开KiCAD的Gerber查看器，一个一个层看，就能找到啦

## Flag 自动机

首先查找字符串：
```bash
strings flag_machine.exe | grep flag
```

可以找到`flag_machine.txt`

在Ghidra里面搜索就会直接跳转到WinProc，此时把判断按钮（if == 2和== 3那两个）的if反转（`00401966`附近的两个JZ和JNZ调换，然后把那个判断“超级管理员”的if也反转，就可以点击退出按钮获得Flag了（在`flag_machine.txt`文件里

（好像有人操作会得到乱码flag，但我没试过

## 微积分计算小练习

简单的先测试下：http://202.38.93.111:10056/share?result=MDpzYWZ2

（感谢purofle提醒我这是web题不是math

塞给CyberChef直接Magic得知result是base64

但是这样没什么用

看页面源码，一眼`innerHTML`，好似，XSS

（我以前也没试过XSS注入，写了个`<script>`结果不执行

```html
<iframe src="http://web/share?result=MDp4dGV4" onload="document.getElementById('a').innerText=document.cookie"></iframe><span id="a"></span>
```

上网学了下，知道要用其他元素的事件

这里我选择了iframe，src直接给一个成绩链接改成web

## 杯窗鹅影

在wine中，`start.exe \unix`可以启动unix的程序，查找[wine的源码](https://gitlab.winehq.org/wine/wine/-/blob/master/programs/start/start.c#L545)，可以发现`\\?\unix\`会等效于`/`所以

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
 
int main()
{
   FILE *fp = NULL;
   char buff[255];
fp = fopen("\\\\?\\unix\\flag1", "r");   
   fgets(buff, 255, (FILE*)fp);
   printf("3: %s\n", buff );
   fclose(fp);
   system("\\\\?\\unix\\readflag");
   char *argv[]={"\\\\?\\unix\\readflag", NULL};
    char *envp[]={0,NULL};
    execve("\\\\?\\unix\\readflag",argv,envp);
 
}
```

（我还专门为此装了个交叉编译的环境

### 光与影

先用Firefox把网页和脚本什么的全部保存，看到VS里面啥都没有，于是看FS

一步步分析，找到一个调用链：

1. `main`
2. `mainImage`
3. `shadeScene`
4. `sceneNormal`
5. `sceneSDF`

（可以一步步把各种地方的返回值改成`vec(1.0)`来查找

`sceneSDF`中有许多个min，一个个尝试，把`t5`从min中去掉，就看到flag了

## 总结

很好玩，刚开始那天purofle在做我也跟着玩，晚上排名到了第6（睡一觉就下去了，第二天早上回校，周末一看，170多了

最终

> 当前分数：2450， 总排名：185 / 2747
> binary：600 ， general：1150 ， math：0 ， web：700 

学会了很多东西，好玩，明年继续