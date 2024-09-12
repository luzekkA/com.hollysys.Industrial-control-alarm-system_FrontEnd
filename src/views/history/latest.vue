<template>
    <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3"> 历史报警 </span>
        </template>
    </el-page-header>

    <el-table :data="alarmsList" style="width: 100%">
        <el-table-column prop="id" label="Id" />
        <el-table-column prop="alarmTime" label="警告时间" />
        <el-table-column prop="source" label="警告源" />
        <el-table-column prop="level" label="警告等级" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="additionalInfo" label="附加信息" />
        <el-table-column prop="isConfirmed" label="是否确认" />
        <el-table-column prop="confirmTime" label="确认时间" />
        <el-table-column prop="isRecovered" label="是否恢复" />
        <el-table-column prop="recoverTime" label="恢复时间" />
    </el-table>
</template>

<script setup lang='ts'>
import { onMounted, ref, onUnmounted } from 'vue';
import { getLatestHistoryAlarms } from '../../api/user'
import { devLog } from '../../utils/devLog';
let alarmsList = ref()
let intervalId: any
onMounted(() => {
    getLatestHistoryAlarms().then(data => {
        devLog("this is data", data.data)
        alarmsList.value = data.data
        // total.value = data.data.data.TotalPages
        //devLog("this is CoursesList", CoursesList.value)
    }).catch(error => {
        console.error('获取警告列表失败', error);
    });
})

const fetchAlarms = () => {
    devLog("reload")
    getLatestHistoryAlarms().then(data => {
        devLog("this is data", data.data);
        alarmsList.value = data.data;
    }).catch(error => {
        console.error('获取警告列表失败', error);
    });
};

onMounted(() => {
    fetchAlarms(); // 初次加载时调用一次
    intervalId = setInterval(fetchAlarms, 5 * 1000); // 每5分钟调用一次
});

onUnmounted(() => {
    clearInterval(intervalId); // 组件卸载时清除定时器
});
const goBack = () => {
    console.log('go back')
}
</script>
<style></style>