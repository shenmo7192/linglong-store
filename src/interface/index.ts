/**
 * 存放所有的接口对象参数
 */

/**
 * 卡片信息
 */
export interface CardFace {
    id?: string,
    appId: string,
    name: string,
    version: string,
    description?: string,
    arch: string,
    icon?: string,
    channel?: string,
    module?: string,
    command?:string,
    isInstalled?: boolean,
    loading?: boolean,
    createTime?: string,
    installCount?: number,
    zhName?: string,
    size?: string,
    repoName?: string,
    categoryName?: string,
}

/**
 * 安装对象
 */
export interface InstalledEntity {
    appId: string, // 1.4.x版本玲珑id
    appid?: string, // 1.5.0版本玲珑id
    id?: string, // 1.5.1版本玲珑id
    name: string, // 玲珑名称
    version: string, // 玲珑版本
    arch: string, // 架构
    channel: string, // 玲珑渠道
    description: string, // 玲珑描述
    icon: string, // 玲珑图标
    kind?: string, // 玲珑类型
    module: string, // 玲珑模块
    zhName?: string, // 玲珑名称
    repoName: string, // 来源仓库
    runtime: string, // 运行依赖
    size: string, // 文件大小
    createTime?: string, // 上架时间
    installCount?: number, // 安装次数
    uninstallCount?: number, // 卸载次数
    uabUrl?: string, // 玲珑地址
    user?: string, // 用户名
    categoryName?: string, // 分类名称
    /* ********** 非命令传递字段 ********* */
    isInstalled?: boolean, // 是否已安装
    loading?: boolean,  // 是否正在安装
    schedule?: string,  // 安装进度
    occurrenceNumber?: number, // 同appId安装个数
}

/**
 * 卡片信息传递到明细页面的路由传递的字段
 */
export interface OpenDetailParams {
    menuName: string,
    appId: string,
    name: string,
    version: string,
    description: string,
    arch: string,
    icon?: string,
    zhName?: string,
    size?: string,
}

/**
 * 玲珑列表请求入参对象
 */
export interface AppListParams {
    appId?: string,
    name?: string,
    categoryId?: string,
    kind?: string,
    module?: string,
    repoName?: string,
    arch?: string,
    pageNo: number,
    pageSize: number,
}

/**
 * 玲珑详细信息对象
 */
export interface AppMain {
    id: string,
    appId: string,
    icon: string,
    zhName: string,
    categoryId: string,
    name: string,
    channel: string,
    arch: string,
    description: string,
    kind: string,
    module: string,
    repoName: string,
    runtime: string,
    size: string,
    uabUrl: string,
    user: string,
    version: string,
    installCount: number,
    uninstallCount: number,
    flag: string,
    createTime: string,
    updateTime: string,
    isDelete: string
}

/**
 * 根据appid获取程序列表-入参对象
 */
export interface GetAppListByAppIdParam {
    appId: string,
    repoName: string,
    arch?: string
}

/**
 * 响应体对象
 * @param code 状态码
 * @param message 提示信息
 * @param data 返回的数据
 */
export interface Result {
    code: number,
    message: string,
    data: any
}

export interface pageResult {
    current: number,
    size: number,
    total: number,
    records: any[]
    pages: number
}

/**
 * 请求参数
 * @param page 页码
 * @param size 每页条数
 */
export interface Pagination {
    page: number;
    size: number;
}

/**
 * 运行时对象
 */
export interface RunTime {
    app: string,
    containerId: string,
    pid: string,
    Path: string,
    version: string,
    arch: string,
    channel: string,
    repo: string,
}