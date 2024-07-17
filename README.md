# [简易玲珑商店] linglong-store
 
这里是一个使用electron+vite构建出的简单玲珑客户端程序，质量没保障，非官方制作！
里面包含着大量BUG,欢迎使用App内置的问题反馈通道，作者会认真审视各位的反馈意见


## 更新日志

- v1.2.9
    
    ```shell
    1.修复当下载队列中同时存在多个任务时，下载停止的情况
    2.下载队列，新增可控取消还未开始的任务
    3.商店推荐页面，程序新增分类标签
    4.优化代码若干行...
    ```

- v1.2.8
    
    ```shell
    1.基础设置页面初次新增切换仓库功能操作，仅支持1.5.0版本以上的玲珑组件
    2.商店推荐页面，轮播和分类列表由原本静态改为动态刷新
    3.商店关于页面，App数量切换获取来源
    4.优化代码若干行...
    ```

- v1.2.7
    
    ```shell
    1.修复明细页面版本列表不展示问题
    2.修复安装失败也提示安装完成的问题
    3.关闭配置界面非当前架构和无图标功能设置
    ```

- v1.2.6
    
    ```shell
    1.修复玲珑进程列表展示提示异常的问题
    2.修复玲珑进程停止操作后，列表没有刷新的问题
    3.修复安装运行后，程序被多次启动的问题
    4.修复程序安装后，在已安装程序列表有部分不展示的问题
    5.新增安装队列限制10个程序机制
    ```

- v1.2.5
    
    ```shell
    1.初步兼容1.5.0版本玲珑组件
    2.安装列表中新增安装进度
    3.全部列表，已安装列表的卡片移除架构显示
    ```

- v1.2.4

    ```
    1.修复暗色主题模式下，程序明细页面基本信息看不到的问题
    ```

- v1.2.3

    ```
    1.统一整个商店的页面样式
    2.发布新版的全部程序菜单
    3.关于页面添加意见反馈
    4.调整明细页面，增加部分参数使明细展示更全面
    5.修复一些BUG
    ```

- v1.2.2

    ```
    1.推荐首页改造
    2.左下角新增下载队列查看和实时网速展示
    3.优化更新页面逻辑，新增一键更新
    4.修复明细页面简介过多的情况下，内容溢出范围的现象
    5.其他部分样式微度调整
    ```

- v1.2.1

    ```
    1.新增排行榜，包含最新上架和下载量排行
    2.调整明细详情页面
    ```

- v1.1.10

    ```
    1.更新列表页面，去除基础服务组件的更新检测
    2.程序明细页面，样式做了微调
    3.修复程序明细页面，安装程序时版本列表跳动的问题
    ```
- v1.1.9

    ```
    兼容低版本玲珑组件，修复无法检测版本的BUG
    ```
- v1.1.8

    ```
    1.修复兼容1.4版本之前的玲珑组件(待测试)
    2.修复珑珑推荐页面安装/卸载玲珑应用，推荐页状态未刷新的问题
    3.修复全部程序页面，安装非当前卡片上的版本号的版本时，卡片加载状态失效的问题
    4.修复全部程序页面，当多版本存在时，删除其中一个版本，卡片就变成了“安装”的错误提示的问题
    5.修复明细页面，左上角层级菜单没有随上个版本名称改变而改变的问题
    6.修复明细页面，版本列表从最新到最古老版本排序有时不准确的问题
    7.修复基础设置页面，取消显示基础组件而卸载列表中未隐藏wine组件的问题
    8.添加后台服务，为以后数据统计分析做下一步基石
    9.优化了更新检测逻辑
    ```
- 1.1.7

    ```
    1.关于程序界面，添加赞助二维码
    2.基础设置页面，新增“是否显示无图标玲珑程序”和“是否显示基础运行服务”的选项
    3.卡片上卸载程序新增弹框提示
    4.添加缺失的wps程序
    5.调整主界面菜单栏文案以及尺寸
    6.调整推荐页程序名称中文化
    7.调整程序明细页面，版本列表展示的字段
    8.修复推荐跳转明细页面一级菜单显示错误的BUG
    9.修复其他BUG若干
    ```
- v1.1.6

    ```
    1.新增“珑珑推荐”页面
    2.更新框架版本
    3.搜索框新增防抖机制，解决输出卡顿的问题
    4.修复停止服务，运行中列表没有刷新的问题
    5.关于页面新增，当前官方玲珑个数展示
    6.修复在明细界面安装程序，返回到列表后再进入明细页面程序安装中加载状态丢失的问题
    7.更新全部程序页面，已安装程序的按钮由“卸载”变更成“已安装”
    8.修复其他BUG
    ```
- v1.1.5

    ```
    1.基础设置内过滤版本选项默认选项改为不勾选
    2.修复明细页面返回列表页面，列表页面又会被初始化显示到顶部而没有定位查看明细前高度的问题
    3.全部应用排序方式由原本id排序变更为按照名称首字母排序
    4.修复部分应用卡片明细页面信息解析异常的问题
    5.添加退出程序即清除下载缓存的逻辑
    ```
- v1.1.4

    ```
    1.兼容玲珑1.4.x新版本
    2.商店检测更新环节逻辑前置
    ```
- v1.1.3

    ```
    1.新增程序启动按钮。点击卡片图标进入版本列表页面，如果该版本已安装，则同时显现启动按钮，启动可打开程序
    2.新增运行程序菜单查看当前系统内运行的玲珑程序，支持强制停止操作
    3.当菜单页面空数据时，新增默认页面样式
    4.修复启动页检测版本更新，进度条不加载的问题
    ```
- v1.1.2

    ```
    1.适配浅色主题
    2.新增并优化更新玲珑程序检测
    3.修复安装程序后，在已安装程序菜单中查看图标异常显示的问题
    ```
- v1.1.1

    ```
    1.新增更新检测菜单(逻辑待完善)
    2.紧急修复描述不存在时，导致系统崩溃无法使用的问题
    ```
- v1.1.0

    ```
    本次新增：
    1.关于程序页面，新增手动检测商店版本按钮，点击检测有更新时会提示是否更新操作
    2.系统更新支持下载完成后手动安装
    本次优化：
    1.优化启动页面，下载新版本时增加下载进度显示
    2.安装程序后，在已安装程序列表，图标无法识别的问题
    3.全部程序搜索范围变大，支持描述搜索
    4.提升卡片展示程序信息准确性
    5.优化部分逻辑代码
    ```
- v1.0.9

    ```
    本次更新：
    1.安装程序逻辑变动，新增程序详情页。点击程序图标可进入详情页，可根据选择版本进行指定版本安装了
    本次优化：
    1.去除卡片简介展示，改到鼠标放入程序卡片浮框显示
    2.程序名称展示被隐藏部分，可鼠标放入程序名称上方可查看完整名称
    3.程序图标和卡片大小默认都有瘦身
    4.已安装程序映射真实程序图片扩充，减少默认图片的显示数量
    5.关于程序，新增码云地址
    ```
- v1.0.8

    ```
    本次新增：
    1.商店版本更新检测
    本次修复：
    1.应用安装/卸载时，加载loading显示异常的问题
    2.基础参数设置后，再次启动程序还原回默认状态没有保存的问题
    本次优化：
    1.商店启动页，加载逻辑优化
    2.玲珑应用信息参数优化
    ```
- v1.0.7

    ```
    本次更新：
    1.启动页取消倒计时，改为加载模式
    2.启动检测玲珑环境是否存在，不存在弹出提示，跳转指导官网页面
    3.优化安装/卸载体验，安装/卸载时添加加载效果
    4.优化页面布局展示，根据不同的分辨率进行适配展示效果
    5.优化程序卡片样式和搜索按钮样式，使整体样式更协调美观
    6.基础设置中新增过滤不匹配当前系统架构软件的选项
    7.修复一些其他BUG
    ```
- v1.0.6

    ```
    本次更新：
    1.处理打包配置，添加程序图标文件，解决程序安装后启动器图标以及名称显示异常的问题
    2.新增支持arm64配置
    3.搜索框显示时添加焦点
    4.修复已安装信息数据显示异常的问题
    5.修复卡片状态安装/卸载时，状态异常的问题
    ```
- v1.0.5

    ```
    抽空更新了一下项目，本次更新：
    1.优化搜索程序功能，改变搜索界面样式
    2.添加重试机制，修复卸载程序时，第一次点击会提示异常
    3.启动倒计时缩减5秒钟
    4.优化安装/卸载程序时，弹出提示消息
    ```
- v1.0.4

    ```
    1.刚程序运行时，会检测当前系统是否满足玲珑环境，不满足，倒计时加载会卡住不动并弹出提示，程序不会进入到后续界面;这里需要您手动安装玲珑环境方可使用。
    2.点击安装时，受网速和程序大小的影响，程序安装比较缓慢甚至可能会没反应，此时无需操作耐心等待程序安装成功提示即可。
    3.卸载程序时，第一次点击会提示异常，可以再次点击卸载即可卸载成功。
    ```