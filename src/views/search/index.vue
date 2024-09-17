<template>
    <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3"> 搜索报警 </span>
        </template>
        <el-select v-model="serverUrl" placeholder="请选择要请求的服务器地址" @change="handleSelectChange" style="margin-bottom: 20px;">
            <el-option v-for="item in urlStore.UrlList" :key="item.path" :label="item.path" :value="item.path">
            </el-option>
        </el-select>
    </el-page-header>
    <div class="input-rows">
        <div class="input-row">
            <el-date-picker v-model="Start_AlarmTime" type="date" placeholder="选择开始警告时间"
                style="width: 200px;"></el-date-picker>
            <el-date-picker v-model="End_AlarmTime" type="date" placeholder="选择结束警告时间"
                style="width: 200px;"></el-date-picker>
            <!-- <el-input v-model="Start_AlarmTime" placeholder="开始警告时间"></el-input>
            <el-input v-model="End_AlarmTime" placeholder="结束警告时间"></el-input> -->
            <el-input v-model="Source" placeholder="警告源" style="width: 200px;"></el-input>
            <el-input v-model="Type" placeholder="类型" style="width: 200px;"></el-input>
            <el-input v-model="Level" placeholder="等级" style="width: 200px;"></el-input>
            <el-button type="primary" @click="search" style="width: 200px;">搜索</el-button>
        </div>
        <div class="input-row">
            <el-select v-model="IsConfirmed" placeholder="是否确认" style="width: 200px;">
                <el-option label="true" :value="true"></el-option>
                <el-option label="false" :value="false"></el-option>
            </el-select>
            <el-select v-model="IsRecovered" placeholder="是否修复" style="width: 200px;">
                <el-option label="true" :value="true"></el-option>
                <el-option label="false" :value="false"></el-option>
            </el-select>
        </div>
    </div>
    <el-table :data="alarmsList" style="width: 100%">
        <el-table-column prop="id" label="Id" />
        <el-table-column prop="alarmTime" label="警告时间" />
        <el-table-column prop="source" label="警告源" />
        <el-table-column prop="level" label="警告等级" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="additionalInfo" label="附加信息" />
        <el-table-column prop="isConfirmed" label="是否确认" />
        <el-table-column fixed="right" label="操作">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="confirmAlarm('', scope.row.id)"
                    :disabled="scope.row.isConfirmed">
                    更改确认状态
                </el-button>
            </template>
        </el-table-column>
        <el-table-column prop="confirmTime" label="确认时间" />
        <el-table-column prop="isRecovered" label="是否恢复" />
        <el-table-column fixed="right" label="操作">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="recoverAlarm('', scope.row.id)"
                    :disabled="scope.row.isRecovered">
                    更改恢复状态
                </el-button>
            </template>
        </el-table-column>
        <el-table-column prop="recoverTime" label="恢复时间" />
    </el-table>

    <div class="pagination-buttons">
        <el-button @click="prevPage">上一页</el-button>
        <el-button @click="nextPage">下一页</el-button>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { getAlarms, confirmAlarm, recoverAlarm } from '../../api/user'
import { devLog } from '../../utils/devLog';
import { ElMessage } from 'element-plus';
import { useUrlStore } from '../../store/useUrlStore';
const urlStore = useUrlStore()
let alarmsList = ref<any>([])
const serverUrl = ref(urlStore.UrlList[0].path)
const Start_AlarmTime = ref('');
const End_AlarmTime = ref('');
const Source = ref('');
const Type = ref('');
const Level = ref('');
const IsConfirmed = ref(false);
const IsRecovered = ref(false);
let page = ref(1)
// let intervalId: any
onMounted(() => {
    getAlarms(serverUrl.value,Start_AlarmTime.value, End_AlarmTime.value, Source.value, Type.value, IsConfirmed.value, IsRecovered.value, Level.value, page.value).then(data => {
        devLog("this is data", data)
        alarmsList.value = data.data.items
        // total.value = data.data.data.TotalPages
        //devLog("this is CoursesList", CoursesList.value)
    }).catch(error => {
        console.error('获取警告列表失败', error);
    });
})

const search = () => {
    getAlarms(serverUrl.value,Start_AlarmTime.value, End_AlarmTime.value, Source.value, Type.value, IsConfirmed.value, IsRecovered.value, Level.value, page.value).then(data => {
        devLog("this is data", data)
        alarmsList.value = data.data.items
        // total.value = data.data.data.TotalPages
        //devLog("this is CoursesList", CoursesList.value)
    }).catch(error => {
        console.error('获取警告列表失败', error);
    });
}

const prevPage = () => {
    page.value -= 1
    getAlarms(serverUrl.value,Start_AlarmTime.value, End_AlarmTime.value, Source.value, Type.value, IsConfirmed.value, IsRecovered.value, Level.value, page.value).then(data => {
        if (data.data.items.length < 1) {
            ElMessage.success("已经是第一页")
        }
        else {
            devLog("this is data dasfdsafdsafdsafdsafsdfsd", data.data.items)
            alarmsList.value = data.data.items

        }

        // total.value = data.data.data.TotalPages
        //devLog("this is CoursesList", CoursesList.value)
    }).catch(error => {
        console.error('获取警告列表失败', error);
    });


};

const nextPage = () => {
    page.value += 1
    getAlarms(serverUrl.value,Start_AlarmTime.value, End_AlarmTime.value, Source.value, Type.value, IsConfirmed.value, IsRecovered.value, Level.value, page.value).then(data => {
        if (data.data.items.length < 1) {
            devLog("no more")
            ElMessage.success("已经是最后一页")
        }
        else {
            devLog("this is data asfdsafdsafdsafdsa", data.data.items)
            alarmsList.value = data.data.items

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

const handleSelectChange = () => {
    devLog("serverchange")
    alarmsList.value=[]
    // // 在这里处理选中值的变化
    // getRealtimeAlarms(serverUrl.value).then(data => {
    //     devLog("this is data", data)
    //     alarmsList.value = data.data.items
    //     // total.value = data.data.data.TotalPages
    //     //devLog("this is CoursesList", CoursesList.value)
    //     //ElMessage.success("已经是第一页")
    // }).catch(error => {
    //     console.error('获取警告列表失败', error);
    // });
    page.value=1

}
</script>
<style>
.pagination-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.input-rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.input-row {
    display: flex;
    gap: 10px;
}
</style>