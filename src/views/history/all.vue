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

    <div class="pagination-buttons">
        <el-button @click="prevPage">上一页</el-button>
        <el-button @click="nextPage">下一页</el-button>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { getLatestHistoryAlarms, getHistoryAlarms } from '../../api/user'
import { devLog } from '../../utils/devLog';
import { ElMessage } from 'element-plus';
let alarmsList = ref<any>([])
let previewList = ref<any>([])
let nextTime = ref()
// let intervalId: any
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

let page = ref(1)

const prevPage = () => {
    if (page.value == 1) {
        getLatestHistoryAlarms().then(data => {
            devLog("this is data", data.data)
            alarmsList.value = data.data
            // total.value = data.data.data.TotalPages
            //devLog("this is CoursesList", CoursesList.value)
            ElMessage.success("已经是第一页")
        }).catch(error => {
            console.error('获取警告列表失败', error);
        });
    }
    else {
        getHistoryAlarms(previewList.value[previewList.value.length]).then(data => {

            devLog("this is data dasfdsafdsafdsafdsafsdfsd", data.data.items)
            alarmsList.value = data.data.items

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
        if (data.data.items.length<1) {
            devLog("no more")
            ElMessage.success("已经是最后一页")
        }
        else {
            devLog("this is data asfdsafdsafdsafdsa", data.data.items)
            alarmsList.value = data.data.items
            page.value += 1

        }
        // total.value = data.data.data.TotalPages
        //devLog("this is CoursesList", CoursesList.value)
    }).catch(error => {
        console.error('获取警告列表失败', error);
    });
   
};
const goBack = () => {
    console.log('go back')
}
</script>
<style>
.pagination-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>