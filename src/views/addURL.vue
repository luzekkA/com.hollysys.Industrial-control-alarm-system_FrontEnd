<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="20">
                <el-input v-model="newUrl.path" placeholder="请输入URL"></el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="UrlStore.addUrl({...newUrl})" style="width: 100%;">添加URL</el-button>
            </el-col>
        </el-row>
        <el-table :data="UrlStore.UrlList" style="width: 100%">
            <el-table-column prop="path" label="服务端请求地址" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="danger" @click="UrlStore.removeUrl(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang='ts'>
import { ref,onMounted } from 'vue';
// import { ElMessage } from 'element-plus';
// import { devLog } from '../utils/devLog';
import {useUrlStore,url} from '../store/useUrlStore'
import { devLog } from '../utils/devLog';
let newUrl = ref<url>({
    path:""
})
const UrlStore = useUrlStore()
// UrlStore.UrlList
onMounted(() => {
    UrlStore.loadUrls(); // 组件挂载时加载URL列表
    devLog("this is store",UrlStore.UrlList)
});
</script>