<template>
    <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" style="margin-bottom: 10px;">
        <el-menu-item index="0">
            <h1 style="margin: 0px;">历史报警</h1>
        </el-menu-item>
        <RouterLink to="/">
            <el-menu-item index="1">
                <h3 style="margin: 0px;">主页</h3>
            </el-menu-item>
        </RouterLink>
        <RouterLink to="/history/all">
            <el-menu-item index="1">
                <h3 style="margin: 0px;">查看所有实时报警</h3>
            </el-menu-item>
        </RouterLink>
    </el-menu>
    <!-- <div> this is massage :{{ refreshMassage }}</div> -->

    <el-table :data="alarmsList" style="width: 100%" stripe>
        <!-- <el-table-column prop="id" label="Id" /> -->
        <el-table-column prop="alarmTime" label="警告时间" />
        <el-table-column prop="source" label="警告源" />
        <el-table-column prop="level" label="警告等级" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="additionalInfo" label="附加信息" />
        <!-- <el-table-column prop="isConfirmed" label="是否确认" /> -->
        <!-- <el-table-column fixed="right" label="操作" >
            <template #default="scope">
                <el-button v-if="!scope.row.isConfirmed" link type="primary" size="small"
                    @click="confirmAlarm(getOrigin(scope.row.serviceUrl), scope.row.id)">
                    确认状态
                </el-button>
                <el-button v-if="scope.row.isConfirmed&&!scope.row.isRecovered" link type="primary" size="small"
                    @click="recoverAlarm(getOrigin(scope.row.serviceUrl), scope.row.id)">
                    确认修复
                </el-button>
            </template>
        </el-table-column> -->
        <el-table-column prop="confirmTime" label="确认时间" />
        <!-- <el-table-column prop="isRecovered" label="是否恢复" /> -->
        <el-table-column prop="recoverTime" label="恢复时间" />
        <el-table-column label="警告状态">
            <template #default="scope">
                <div style="color: green;" v-if="!scope.row.isConfirmed&&!scope.row.isRecovered">
                    未确认
                </div>
                <div style="color: green;" v-if="!scope.row.isConfirmed&&scope.row.isRecovered">
                    未确认已恢复
                </div>
                <div style="color: green;" v-if="scope.row.isConfirmed&&!scope.row.isRecovered">
                    已确认未恢复
                </div>
                <div style="color: green;" v-if="scope.row.isConfirmed&&scope.row.isRecovered">
                    已确认已恢复
                </div>
            
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang='ts'>
import { onMounted, ref, onUnmounted } from 'vue';
import { getLatestHistoryAlarms} from '../../api/user'
import { devLog } from '../../utils/devLog';
import * as signalR from "@microsoft/signalr";
import { ElMessage } from 'element-plus';
import { useUrlStore } from '../../store/useUrlStore';
const urlStore = useUrlStore()
let alarmsList = ref()
// let intervalId: any
const refreshMassage = ref("")
// const getOrigin = (serviceUrl: any) => {
//     devLog("this is serviceUrl",serviceUrl)
//     let url = new URL(serviceUrl);
//     let serverAddress = url.origin+'/api';
//     devLog("this is serviceADDRES",serverAddress)
//     return serverAddress
// }
const connectionBuilder = new signalR.HubConnectionBuilder()
    // .withUrl("http://127.0.0.1:5235/alarmHub")
    // .build();
urlStore.UrlList.forEach(element => {
    let url = new URL(element.path)
    url.origin
connectionBuilder.withUrl(url.origin+'/alarmHub')
});
const connection = connectionBuilder.build();
connection.on("Massage", (message: string) => {
    devLog("Received Massage message", message);
    ElMessage.success("消息更新")
    refreshMassage.value = message

    getLatestHistoryAlarms().then(data => {
        devLog("this is data", data)
        alarmsList.value = data.sort((a, b) => new Date(b.alarmTime).getTime() - new Date(a.alarmTime).getTime()).slice(0, 30)
        // total.value = data.data.data.TotalPages
        //devLog("this is CoursesList", CoursesList.value)
    }).catch(error => {
        console.error('获取警告列表失败', error);
    });
});

connection.start().catch((err) => document.write(err));
onMounted(() => {
    getLatestHistoryAlarms().then(data => {
        devLog("this is data", data)
        alarmsList.value = data.sort((a, b) => new Date(b.alarmTime).getTime() - new Date(a.alarmTime).getTime()).slice(0, 30)
        // total.value = data.data.data.TotalPages
        //devLog("this is CoursesList", CoursesList.value)
    }).catch(error => {
        console.error('获取警告列表失败', error);
    });
})
onUnmounted(() => {
    connection.stop().then(() => {
        devLog("SignalR connection stopped");
    }).catch(err => {
        devLog("Error stopping SignalR connection", err);
    });
});

// const goBack = () => {
//     console.log('go back')
// }



</script>
<style></style>