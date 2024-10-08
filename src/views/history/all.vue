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
        <RouterLink to="/realtime/latest">
            <el-menu-item index="1">
                <h3 style="margin: 0px;">查看所有历史报警</h3>
            </el-menu-item>
        </RouterLink>
    </el-menu>

    <el-table :data="alarmsList" style="width: 100%" stripe>
        <!-- <el-table-column prop="id" label="Id" /> -->
        <el-table-column prop="alarmTime" label="警告时间" />
        <el-table-column prop="source" label="警告源" />
        <el-table-column prop="level" label="警告等级" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="additionalInfo" label="附加信息" />
        <!-- <el-table-column prop="isConfirmed" label="是否确认" /> -->
        <!-- <el-table-column fixed="right" label="操作">
            <template #default="scope">
                <el-button v-if="!scope.row.isConfirmed" link type="primary" size="small"
                    @click="confirmAlarm(getOrigin(scope.row.serviceUrl), scope.row.id)">
                    确认状态
                </el-button>
                <el-button v-if="scope.row.isConfirmed && !scope.row.isRecovered" link type="primary" size="small"
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

    <div class="pagination-buttons">
        <el-button @click="prevPage">上一页</el-button>
        <el-button @click="nextPage">下一页</el-button>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { getHistoryAlarms} from '../../api/user'
import { devLog } from '../../utils/devLog';
import { ElMessage } from 'element-plus';
// import { useUrlStore } from '../../store/useUrlStore';
// const urlStore = useUrlStore()
let alarmsList = ref<any>([])
let previewList = ref<any>([])
let nextTime = ref()
//const serverUrl = ref(urlStore.UrlList[0].path)
// let intervalId: any
onMounted(() => {
    // getLatestRealtimeAlarms().then(data => {
    //     devLog("this is data", data)
    //     alarmsList.value = data
    //     // total.value = data.data.data.TotalPages
    //     //devLog("this is CoursesList", CoursesList.value)
    // }).catch(error => {
    //     console.error('获取警告列表失败', error);
    // });
    getHistoryAlarms().then(data => {
        devLog("this is data", data)
        alarmsList.value = data.sort((a, b) => new Date(b.alarmTime).getTime() - new Date(a.alarmTime).getTime()).slice(0, 30)
        // total.value = data.data.data.TotalPages
        //devLog("this is CoursesList", CoursesList.value)
        //ElMessage.success("已经是第一页")
    }).catch(error => {
        console.error('获取警告列表失败', error);
    });
})

let page = ref(1)

const prevPage = () => {
    if (page.value == 1) {
        getHistoryAlarms().then(data => {
            devLog("this is data", data)
            alarmsList.value = data.sort((a, b) => new Date(b.alarmTime).getTime() - new Date(a.alarmTime).getTime()).slice(0, 30)
            // total.value = data.data.data.TotalPages
            //devLog("this is CoursesList", CoursesList.value)
            ElMessage.success("已经是第一页")
        }).catch(error => {
            console.error('获取警告列表失败', error);
        });
    }
    else {
        getHistoryAlarms(previewList.value[previewList.value.length]).then(data => {

            devLog("this is data dasfdsafdsafdsafdsafsdfsd", data)
            alarmsList.value = data.sort((a, b) => new Date(b.alarmTime).getTime() - new Date(a.alarmTime).getTime()).slice(0, 30)

            previewList.value.pop()
            page.value -= 1
            // total.value = data.data.data.TotalPages
            //devLog("this is CoursesList", CoursesList.value)
        }).catch(error => {
            console.error('获取警告列表失败', error);
        });

    }

};

const nextPage = () => {
    previewList.value.push(alarmsList.value[alarmsList.value.length - 2]?.alarmTime)
    //previewList.value = alarmsList.value
    devLog("this is time", alarmsList.value[alarmsList.value.length - 1]?.alarmTime)
    nextTime = alarmsList.value[alarmsList.value.length - 1]?.alarmTime
    getHistoryAlarms(nextTime).then(data => {
        if (data.length < 1) {
            devLog("no more")
            ElMessage.success("已经是最后一页")
        }
        else {
            devLog("this is data asfdsafdsafdsafdsa", data)
            alarmsList.value = data.sort((a, b) => new Date(b.alarmTime).getTime() - new Date(a.alarmTime).getTime()).slice(0, 30)
            page.value += 1
        }
        // total.value = data.data.data.TotalPages
        //devLog("this is CoursesList", CoursesList.value)
    }).catch(error => {
        console.error('获取警告列表失败', error);
    });


};


// const getOrigin = (serviceUrl: any) => {
//     devLog("this is serviceUrl", serviceUrl)
//     let url = new URL(serviceUrl);
//     let serverAddress = url.origin + '/api';
//     devLog("this is serviceADDRES", serverAddress)
//     return serverAddress
// }

// const handleSelectChange = () => {
//     devLog("serverchange")
//     alarmsList.value=[]
//     // 在这里处理选中值的变化
//     getRealtimeAlarms(serverUrl.value).then(data => {
//         devLog("this is data", data)
//         alarmsList.value = data
//         // total.value = data.data.data.TotalPages
//         //devLog("this is CoursesList", CoursesList.value)
//         //ElMessage.success("已经是第一页")
//     }).catch(error => {
//         console.error('获取警告列表失败', error);
//     });
//     page.value=1


</script>
<style>
.pagination-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>