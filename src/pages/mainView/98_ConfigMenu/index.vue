<template>
  <div style="height: calc(100vh - 88px);">
    <li><a class="title">基础设置</a></li>
    <div style="margin-left: 30px;">
      <el-checkbox v-model="autoCheckUpdate" size="large"
        @change="systemConfigStore.changeAutoCheckUpdate(autoCheckUpdate)">
        启动App自动检测商店版本
      </el-checkbox>
      <!-- <el-checkbox size="large" @change="isFloat">
        启用悬浮球
      </el-checkbox> -->
      <!-- <em style="font-size: 14px;margin-left: 30px;">更换玲珑仓库：</em>
      <el-select v-model="defaultRepo" style="width: 120px;" @change="changeDefaultRepo" disabled>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select> -->
    </div>
    <hr>
    <li><a class="title">卸载程序</a></li>
    <div style="margin-left: 30px;">
      <el-checkbox v-model="isShowBaseService" size="large" @change="checkedBaseService(isShowBaseService)">
        显示基础运行服务
      </el-checkbox>
      <el-checkbox v-model="isMergeApp" size="large" @change="systemConfigStore.changeIsShowMergeApp(isMergeApp)">
        同appId程序合并
      </el-checkbox>
      <el-button v-if="compareVersions(systemConfigStore.llVersion, '1.7.0') >= 0" type="success" @click="pruneLinyaps"
        style="margin-left: 50px;height: 24px;">清除废弃基础服务</el-button>
    </div>
    <hr>
    <li><a class="title">测试环节</a></li>
    <div style="margin-left: 30px;">
      <label style="font-size: 14px;">测试玲珑命令：</label>
      <el-input v-model="msg" style="width: 300px;" @keyup.enter="reback"></el-input>
    </div>
    <div>{{ result }}</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ipcRenderer } from "electron";
import { ElNotification } from 'element-plus'
import { compareVersions } from '@/util/checkVersion';
// 路由对象
import { useRouter } from "vue-router";
const router = useRouter();

import { useSystemConfigStore } from "@/store/systemConfig";
const systemConfigStore = useSystemConfigStore();

let msg = ref('')
let result = ref('')

// 默认玲珑仓库对象
let defaultRepo = ref('');
// 自动检测更新
let autoCheckUpdate = ref(true);
// 是否显示基础运行服务
let isShowBaseService = ref(false);
// 卸载程序页面同程序合并
let isMergeApp = ref(true);
// 切换仓库源的下拉选项
const options = [
  { label: "stable", value: "stable" },
  { label: "repo", value: "repo" }
]

// 切换仓库源的change事件
const changeDefaultRepo = () => {
  let repoCommond = 'll-cli repo modify --name=' + defaultRepo.value + ' https://mirror-repo-linglong.deepin.com';
  ipcRenderer.send('command', { command: repoCommond });
  router.push('/'); // 返回首页重新加载商店
}

// 显示悬浮球
const isFloat = (event: any) => {
  ipcRenderer.send('toggle-floating', event);
}

// 是否显示基础运行服务的变更事件
const checkedBaseService = (checkStatus: boolean) => {
  // 修改系统配置文件，记录状态
  systemConfigStore.changeIsShowBaseService(checkStatus);
  // 检测版本，执行不同的命令
  let getInstalledItemsCommand = "ll-cli --json list";
  if (compareVersions(systemConfigStore.llVersion, "1.3.99") < 0) {
    getInstalledItemsCommand = "ll-cli list | sed 's/\x1b\[[0-9;]*m//g'"; // 1.4.0版本之前的命令
  }
  ipcRenderer.send('command', { command: getInstalledItemsCommand, type: "refreshInstalledApps" });
}

const reback = () => {
  if (msg.value.startsWith("ll-cli")) {
    ipcRenderer.send('command_only_stdout', msg.value);
    ipcRenderer.once('command_only_stdout_result', (_event, res) => {
      result.value = res.stdout ? res.stdout : res.error;
    })
  } else {
    result.value = "非玲珑命令不可执行！！";
  }
}

// 清除无用组件
const pruneLinyaps = () => {
  ipcRenderer.send('command', { command: "ll-cli prune" });
  ipcRenderer.once('command-result', (_event, res) => {
    if ('stdout' == res.code && res.param.command == 'll-cli prune') {
      ElNotification({ title: '操作成功!', type: 'success', duration: 3000, message: res.result });
    }
  })
}

// 页面启动时加载
onMounted(() => {
  defaultRepo.value = systemConfigStore.defaultRepoName;  // 默认仓库
  autoCheckUpdate.value = systemConfigStore.autoCheckUpdate;  // 是否自动检测更新
  isShowBaseService.value = systemConfigStore.isShowBaseService;  // 是否显示基础运行服务
  isMergeApp.value = systemConfigStore.isShowMergeApp;  // 卸载程序页面同程序合并
})
</script>

<style scoped>
.title {
  font-weight: bold;
  font-size: 16px;
  color: #D3D3D3;
  text-decoration: inherit;
}

@media (prefers-color-scheme: light) {
  .title {
    color: #000;
  }
}
</style>