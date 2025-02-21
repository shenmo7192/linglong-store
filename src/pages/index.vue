<template>
    <div class="containner">
        <a href="https://www.linglong.space/" target="_blank">
            <img src="/logo.svg" class="logo" alt="玲珑商店" />
        </a>
        <h1>玲珑应用商店</h1>
        <h3>{{ message }}</h3>
        <h3>{{ downloadPercentMsg }}</h3>
        <div class="tips">
            <div style="text-align: left;">
                <h3 style="color: chocolate;">注意：</h3>
                <p>1.刚程序运行时，会检测当前系统是否满足玲珑环境;如果环境不满足则弹出提示，程序不会进入到后续界面;这里需要您手动安装玲珑环境方可使用。</p>
                <p>2.点击安装时，受网速和程序包大小(本体+依赖)的影响，程序安装比较缓慢甚至可能会没反应，此时请耐心等待一下下。</p>
                <p>3.执行操作时，若出现长时间卡住无反应，或者报错提示时，请使用官方命令行方式进行操作，尝试玲珑基础环境组件是否异常，如无异常，请重启商店重试。</p>
                <p>4.如出现特殊现象，请在商店内-关于程序-意见反馈，进行反馈，或者进入作者gitee仓库提交issue。</p>
            </div>
        </div>
    </div>
    <div class="footer" v-if="downloadPercent > 0">
        <el-progress :percentage="downloadPercent" :stroke-width="10" status="success" striped striped-flow :duration="10" :show-text="false" />
    </div>
    <el-dialog v-model="centerDialogVisible" width="500" center destroy-on-close :close-on-click-modal="false" :show-close="false"
        :close-on-press-escape="false">
        <template #header>
            <span style="user-select: none;color: black;font-weight: bold;">警告</span>
        </template>
        <span style="user-select: none;">
            <strong style="text-align: center; display: block; color: red">检测当前系统中不存在玲珑组件环境</strong>
            <div style="text-align: center; margin-top: 10px">
                <p>请先安装玲珑组件环境，方可使用本玲珑商店。</p>
                <!-- <p>目前自动安装支持Deepin 23/UOS 1070/OpenEuler 24.03/Ubuntu 22.04/Ubuntu 24.04/Debian 12/openKylin 2.0rc</p> -->
            </div>
        </span>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="info" @click="exitBtnClick">退出商店</el-button>
                <!-- <el-button type="info" @click="autoInstallBtnClick">自动安装</el-button> -->
                <el-button type="primary" @click="manualInstallBtnClick">手动安装</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ElMessageBox } from 'element-plus';
import { ipcRenderer } from "electron";
import { useRouter } from 'vue-router';
import pkg from '../../package.json';
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { compareVersions } from '@/util/checkVersion';
import { useSystemConfigStore } from "@/store/systemConfig";
import { useInstalledItemsStore } from "@/store/installedItems";
import { getSearchAppList } from '@/api/server';
import { pageResult } from '@/interface';

const systemConfigStore = useSystemConfigStore();
const installedItemsStore = useInstalledItemsStore();

// 获取路由对象
const router = useRouter();
// 提示信息
const message = ref('');
// 进度条状态
const downloadPercent = ref(0);
const downloadPercentMsg = ref('');
// 环境检测
const centerDialogVisible = ref(false);

// 命令执行返回结果
const commandResult = async (_event: any, res: any) => {
    const code: string = res.code;
    const result: any = res.result;
    const command: string = res.param.command;
    if (command == 'dpkg -l | grep linglong') {
        systemConfigStore.changeDetailMsg(res.result);
    }
    if (command == 'uname -a') {
        systemConfigStore.changeOsVersion(res.result);
    }
    if (command == 'uname -m') {
        if (code == 'stdout') {
            systemConfigStore.changeArch(result.trim());
            message.value = "系统架构检测完成...";
            ipcRenderer.send('logger', 'info', "系统架构检测完成...");
            message.value = "检测是否存在玲珑环境...";
            ipcRenderer.send('logger', 'info', "检测是否存在玲珑环境...");
            ipcRenderer.send('command', { command: 'll-cli --help' });
        } else {
            message.value = "系统架构检测异常,当前非Linux环境...";
            ipcRenderer.send('logger', 'error', "系统架构检测异常,当前非Linux环境...");
        }
    }
    if (command == 'll-cli --help') {
        if(code == 'stdout') {
            message.value = "玲珑环境存在...";
            ipcRenderer.send('logger', 'info', "玲珑环境存在...");
            message.value = "检测玲珑环境版本...";
            ipcRenderer.send('logger', 'info', "检测玲珑环境版本...");
            ipcRenderer.send('command', { command: 'll-cli --json --version' });
            // 获取玲珑包程序(linglong-bin)的版本号
            ipcRenderer.send("command",{ command: 'apt-cache policy linglong-bin' })
            // 获取玲珑包当前使用的仓库名
            ipcRenderer.send("command",{ command: 'll-cli repo show' })
        } else {
            message.value = "检测玲珑环境不存在...";
            ipcRenderer.send('logger', 'error', "检测玲珑环境不存在...");
            centerDialogVisible.value = true; // 显示弹窗
        }
    }
    if (command == 'll-cli --json --version') {
        if(code == 'stdout') {
            const tempVersion = result.trim();
            // 判断是否为对象并且具有 version 字段
            if (tempVersion.startsWith('{') && tempVersion.endsWith('}') && 'version' in JSON.parse(tempVersion)) {
                const obj = JSON.parse(tempVersion) as { version: unknown }; // 类型断言
                // 判断 version 字段是否为字符串
                if (typeof obj.version === 'string') {
                    systemConfigStore.changeLlVersion(obj.version);
                } else {
                    systemConfigStore.changeLlVersion('1.3.8');
                    ipcRenderer.send('logger', 'error', "非异常返回！1.4.X以前旧版，检测不到版本号，设置默认1.3.8");
                }
            } else {
                const items: RegExpMatchArray | null = tempVersion.match(/'[^']+'|\S+/g);
                if (items) {
                    if (items.length == 3 || items.length == 2) {
                        systemConfigStore.changeLlVersion(items[items.length -1]);
                    } 
                } else {
                    systemConfigStore.changeLlVersion('1.3.8');
                    ipcRenderer.send('logger', 'error', "非异常返回！1.4.X以前旧版，检测不到版本号，设置默认1.3.8");
                }
            }
        } else {
            systemConfigStore.changeLlVersion('1.3.8');
            ipcRenderer.send('logger', 'error', "异常返回！1.4.X以前旧版，检测不到版本号，设置默认1.3.8");
        }
        message.value = "玲珑环境版本检测完毕...";
        ipcRenderer.send('logger', 'info', "玲珑环境版本检测完毕...");
        message.value = "正在检测系统已安装的玲珑程序...";
        ipcRenderer.send('logger', 'info', "正在检测系统已安装的玲珑程序...");
        if (compareVersions(systemConfigStore.llVersion, '1.4.0') < 0) {
            ipcRenderer.send("command", { command: "ll-cli list | sed 's/\x1b\[[0-9;]*m//g'" });
        } else {
            ipcRenderer.send("command", { command: "ll-cli --json list" });
        }
    }
    if (command =='ll-cli --json list' || command == 'll-cli list | sed \'s/\x1b\[[0-9;]*m//g\'') {
        if (code == 'stdout') {
            if (command == 'll-cli list | sed \'s/\x1b\[[0-9;]*m//g\'') {
                installedItemsStore.initInstalledItemsOld(result);
            }
            if (command == 'll-cli --json list') {
                installedItemsStore.initInstalledItems(result);
            }
            message.value = "已安装的玲珑程序检测完成...";
            ipcRenderer.send('logger', 'info', "已安装的玲珑程序检测完成...");
        } else {
            // 网络异常，变更标识
            systemConfigStore.changeNetworkRunStatus(false);
            message.value = "已安装的玲珑程序检测异常...";
            ipcRenderer.send('logger', 'error', "已安装的玲珑程序检测异常...");
        }
        message.value = "正在获取网络源玲珑程序列表...";
        ipcRenderer.send('logger', 'info', "正在获取网络源玲珑程序列表...");
        let response = await getSearchAppList({
            repoName: systemConfigStore.defaultRepoName,
            arch: systemConfigStore.arch, 
            pageNo: 1, pageSize: 1 
        });
        if (response.code == 200) {
            systemConfigStore.changeLinglongCount((response.data as unknown as pageResult).total);
            message.value = "网络源玲珑程序列表获取完成...";
            ipcRenderer.send('logger', 'info', "网络源玲珑程序列表获取完成...");
        } else {
            message.value = "网络源玲珑程序列表获取失败...";
            ipcRenderer.send('logger', 'error', "网络源玲珑程序列表获取失败...");
        }
        message.value = "加载完成...";
        downloadPercentMsg.value = "";
        ipcRenderer.send('logger', 'info', "加载完成...");
        ipcRenderer.send('logger', 'info', systemConfigStore.getSystemConfigInfo);
        // 检测当前环境(非开发环境发送通知APP登陆！)
        if (import.meta.env.MODE != "development") {
            ipcRenderer.send('appLogin', { 
                url: import.meta.env.VITE_SERVER_URL + "/visit/appLogin", 
                llVersion: systemConfigStore.llVersion,
                linglongBinVersion: systemConfigStore.linglongBinVersion,
                detailMsg: systemConfigStore.detailMsg,
                osVersion: systemConfigStore.osVersion,
                defaultRepoName: systemConfigStore.defaultRepoName,
                appVersion: pkg.version,
                visitorId: systemConfigStore.visitorId,
                clientIp: systemConfigStore.clientIP 
            })
        }
        // 延时1000毫秒进入
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 跳转到主界面
        router.push('/main_view');
    }
    if(command == 'apt-cache policy linglong-bin') {
        const lines = result.split('\n');
        let installedVersion = '';
        lines.forEach((line: string) => {
            if (line.includes('已安装：')) {
                installedVersion = line.split('已安装：')[1].trim();
            } else if (line.trim().startsWith('Installed:')) {
                installedVersion = line.split('Installed:')[1].trim();
            }
        });
        ipcRenderer.send('logger', 'info', '已安装版本：' + installedVersion);
        systemConfigStore.changeLinglongBinVersion(installedVersion);
    }
    if(command == 'll-cli repo show') {
        if (code == 'error') {
            console.log('resultresult',result);
            ElMessageBox.confirm('当前旧数据需要迁移后才能使用，确认开始执行吗？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'info',
                center: true,
            }).then(async () => {
                ipcRenderer.send('command', { command: 'll-cli migrate' });
                ipcRenderer.send('logger', 'info', "当前旧数据开始执行迁移...");
                // 延时1000毫秒进入
                await new Promise(resolve => setTimeout(resolve, 1000));
                window.close();
            }).catch(() => {
                window.close();
            })
        }
        const lines = result.split('\n');
        let defaultRepoName = '';
        lines.forEach((line: string) => {
            if (line.includes('Default:')) {
                defaultRepoName = line.split('Default:')[1].trim();
            }
        });
        ipcRenderer.send('logger', 'info', '默认仓库名：' + defaultRepoName);
        systemConfigStore.changeDefaultRepoName(defaultRepoName);
    }
}
// 监听主进程发送的更新消息
const updateMessage = (_event: any, text: string) => {
    if (text == '检测到新版本，是否选择下载？') {
        ElMessageBox.confirm(text, '提示', {
            confirmButtonText: '下载',
            cancelButtonText: '取消',
            type: 'info',
            center: true,
        }).then(() => {
            message.value = "新版本更新下载中...";
            ipcRenderer.send('logger', 'info', "新版本更新下载中...");
            downloadPercent.value = 0
            ipcRenderer.send('downloadUpdate')
            // //注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
            ipcRenderer.on('downloadProgress', (_event, progressObj) => {
                downloadPercent.value = parseInt(progressObj.percent || 0)
                downloadPercentMsg.value = "下载进度：" + parseInt(progressObj.percent || 0) + "%，网速：" + Math.ceil(progressObj.bytesPerSecond / 1000) + " kb/s";
            })
        }).catch(() => {
            message.value = "取消更新，商店版本检测完成...";
            ipcRenderer.send('logger', 'warn', "取消更新，商店版本检测完成...");
            message.value = "检测当前系统架构...";
            ipcRenderer.send('logger', 'info', "检测当前系统架构...");
            ipcRenderer.send('command', { command: 'uname -m' });
        })
    } else if (text == '下载完毕，是否立刻更新？'){
        ElMessageBox.confirm(text, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
            center: true,
        }).then(() => {
            message.value = "下载完毕，正在更新中...";
            ipcRenderer.send('logger', 'info', "下载完毕，正在更新中...");
            ipcRenderer.send('isUpdateNow');
        }).catch(() => {
            message.value = "取消安装，商店版本检测完成...";
            ipcRenderer.send('logger', 'warn', "取消安装，商店版本检测完成...");
            message.value = "检测当前系统架构...";
            ipcRenderer.send('logger', 'info', "检测当前系统架构...");
            ipcRenderer.send('command', { command: 'uname -m' });
        })
    } else if (text == '现在使用的就是最新版本，不用更新' || text == '检查更新出错'){
        message.value = text + ",商店版本检测完成...";
        ipcRenderer.send('logger', 'info', text + ",商店版本检测完成...");
        message.value = "检测当前系统架构...";
        ipcRenderer.send('logger', 'info', "检测当前系统架构...");
        ipcRenderer.send('command', { command: 'uname -m' });
    }
}
// 退出按钮点击事件
const exitBtnClick = () => {
    ElMessageBox.confirm('确定退出吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
        center: true,
    }).then(() => {
        window.close();
    })
}
// 手动安装点击事件
const manualInstallBtnClick = () => {
    window.open('https://www.linglong.space/guide/start/install.html');
    window.close();
}
// 自动安装点击事件
const autoInstallBtnClick = () => {
    const baseURL = import.meta.env.VITE_SERVER_URL as string;
    centerDialogVisible.value = false
    ipcRenderer.send('to_install_linglong',baseURL); // 执行脚本文件
}

// 加载前执行
onMounted(async () => {
    // 开启系统参数中的网络标识
    systemConfigStore.changeNetworkRunStatus(true);
    // 获取指纹码
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    let visitorId = result.visitorId
    systemConfigStore.changeVisitorId(visitorId);
    // 获取客户端ip
    ipcRenderer.send('fetchClientIP');
    ipcRenderer.once('fetchClientIP-result',(_event: any, res: any) => systemConfigStore.changeClientIP(res.data.query))
    // 测试安装玲珑组件
    // centerDialogVisible.value = true; // 显示弹窗
    // return;

    // 获取组件基本信息
    ipcRenderer.send('command', { command: 'dpkg -l | grep linglong' });
    // 获取系统信息
    ipcRenderer.send('command', { command: 'uname -a' });
    // 开启先检测商店版本号是否有更新
    if (process.env.NODE_ENV != "development") {
        if (systemConfigStore.autoCheckUpdate) {
            message.value = "正在检测商店版本号...";
            ipcRenderer.send('logger', 'info', "正在检测商店版本号...");
            ipcRenderer.send('checkForUpdate');    
        } else {
            message.value = "跳过商店版本号检测...";
            ipcRenderer.send('logger', 'warn', "跳过商店版本号检测...");
            message.value = "开始环境检测...";
            ipcRenderer.send('logger', 'info', "开始环境检测...");
            message.value = "检测当前系统架构...";
            ipcRenderer.send('logger', 'info', "检测当前系统架构...");
            ipcRenderer.send('command', { command: 'uname -m' });
        }
    } else {
        message.value = "开发模式，跳过商店版本号检测...";
        ipcRenderer.send('logger', 'warn', "开发模式，跳过商店版本号检测...");
        message.value = "开始环境检测...";
        ipcRenderer.send('logger', 'info', "开始环境检测...");
        message.value = "检测当前系统架构...";
        ipcRenderer.send('logger', 'info', "检测当前系统架构...");
        ipcRenderer.send('command', { command: 'uname -m' });
    }
    // 监听命令行执行结果  /  监听更新事件
    ipcRenderer.on('command-result', commandResult);
    ipcRenderer.on('update-message', updateMessage);
});
// 销毁前执行
onBeforeUnmount(() => {
    ipcRenderer.removeListener('command-result', commandResult);
    ipcRenderer.removeListener('update-message', updateMessage);
    ipcRenderer.removeAllListeners('downloadProgress');
});
</script>
<style scoped>
.containner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 90%;
}

.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.tips {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
}

.dialog-footer button:first-child {
    margin-right: 150px;
}
</style>