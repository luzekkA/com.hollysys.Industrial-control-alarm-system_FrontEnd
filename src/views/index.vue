<template>
  <el-page-header>
    <template #content>
      <span class="text-large font-600 mr-3"> 主页 </span>
    </template>
    <el-select v-model="serverUrl" placeholder="请选择要请求的服务器地址" @change="handleSelectChange" style="margin-bottom: 20px;">
      <el-option v-for="item in urlStore.UrlList" :key="item.path" :label="item.path" :value="item.path">
      </el-option>
    </el-select>
  </el-page-header>
  <el-row>
    <el-col :span="8">
      <el-row>
        <el-col :span="12">
          <el-card style="width: 150px;height: 150px;">

            <span>实时报警数</span>

            <h1> {{ IndexInfo?.realTimeAlarmTimes }}</h1>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="width: 150px;height: 150px;">
            <span>历史报警数</span>
            <h1>{{ IndexInfo?.historyAlarmTimes }}</h1>
          </el-card>
        </el-col>


      </el-row>
      <el-row>
        <el-col :span="12">
          <el-card style="width: 150px;height: 150px;">
            <span>待确认数</span>
            <h1>{{ IndexInfo?.notConfirmedAlarmTimes }}</h1>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="width: 150px;height: 150px;">
            <span>待恢复数</span>
            <h1>{{ IndexInfo?.notRecoveredAlarmTimes }}</h1>
          </el-card>
        </el-col>
      </el-row>
    </el-col>

    <el-col :span="16">
      <canvas id="myBarChart" style="width: 800px; height: 300px;"></canvas>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <canvas id="myBarChart2" style="width: 600px; height: 250px;"></canvas>
    </el-col>
    <el-col :span="12">
      <canvas id="myChart" style="width: 600px; height: 250px;"></canvas>
    </el-col>
  </el-row>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useUrlStore } from '../store/useUrlStore'
import { devLog } from '../utils/devLog';
import { getIndexInfo } from '../api/user'
import Chart from 'chart.js/auto';
import * as signalR from "@microsoft/signalr";
import { ElMessage } from 'element-plus';
const urlStore = useUrlStore()
const serverUrl = ref(urlStore.UrlList[0].path)
const IndexInfo = ref<any>()
//const totalInfo = ref<any>()
const refreshMassage = ref("")
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


    getIndexInfo().then(data => {
    devLog("this is data", data)
    IndexInfo.value = data
    // total.value = data.data.data.TotalPages
    //devLog("this is CoursesList", CoursesList.value)

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    //devLog("reported", reportedStudentList.value.length)
    //devLog("", allStudentList.value.length - reportedStudentList.value.length)
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['实时报警', '历史报警'],
        datasets: [{
          data: [IndexInfo.value.realTimeAlarmTimes,IndexInfo.value.historyAlarmTimes],
          //data: [1, 0],
          backgroundColor: ['rgb(25, 25, 112)', 'rgb(0, 0, 128)'],
        }]
      },
      options: {
        responsive: false,
      },
    });

    let labels = Object.keys(IndexInfo.value.countGroupByType);
    let datas = Object.values(IndexInfo.value.countGroupByType);

    const barCtx = document.getElementById('myBarChart') as HTMLCanvasElement;
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: datas,
          label: '报警类型分布图',
          backgroundColor: ['rgb(25, 25, 112)', 'rgb(0, 0, 128)', 'rgb(0, 0, 139)', 'rgb(0, 0, 156)', 'rgb(0, 0, 205)', 'rgb(0, 0, 255)'],
        }]
      },
      options: {
        responsive: false,
      },
    });

    labels = Object.keys(IndexInfo.value.countGroupByLevel);
    datas = Object.values(IndexInfo.value.countGroupByLevel);

    const barCtx2 = document.getElementById('myBarChart2') as HTMLCanvasElement;
    new Chart(barCtx2, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: datas,
          label: '报警级别分布图',
          backgroundColor: ['rgb(25, 25, 112)', 'rgb(0, 0, 128)', 'rgb(0, 0, 139)', 'rgb(0, 0, 156)', 'rgb(0, 0, 205)', 'rgb(0, 0, 255)'],
        }]
      },
      options: {
        responsive: false,
      },
    });
  }).catch(error => {
    console.error('获取警告列表失败', error);
  });

});

connection.start().catch((err) => document.write(err));
onMounted(() => {
  // UrlStore.loadUrls(); // 组件挂载时加载URL列表
  // devLog("this is store", UrlStore.UrlList)
  getIndexInfo().then(data => {
    devLog("this is data", data)
    // data.forEach(element => {
    //   element.
    // });
    IndexInfo.value = data
    // total.value = data.data.data.TotalPages
    //devLog("this is CoursesList", CoursesList.value)

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    //devLog("reported", reportedStudentList.value.length)
    //devLog("", allStudentList.value.length - reportedStudentList.value.length)
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['实时报警', '历史报警'],
        datasets: [{
          data: [IndexInfo.value.realTimeAlarmTimes,IndexInfo.value.historyAlarmTimes],
          //data: [1, 0],
          backgroundColor: ['rgb(25, 25, 112)', 'rgb(0, 0, 128)'],
        }]
      },
      options: {
        responsive: false,
      },
    });

    let labels = Object.keys(IndexInfo.value.countGroupByType);
    let datas = Object.values(IndexInfo.value.countGroupByType);

    const barCtx = document.getElementById('myBarChart') as HTMLCanvasElement;
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: datas,
          label: '报警类型分布图',
          backgroundColor: ['rgb(25, 25, 112)', 'rgb(0, 0, 128)', 'rgb(0, 0, 139)', 'rgb(0, 0, 156)', 'rgb(0, 0, 205)', 'rgb(0, 0, 255)'],
        }]
      },
      options: {
        responsive: false,
      },
    });

    labels = Object.keys(IndexInfo.value.countGroupByLevel);
    datas = Object.values(IndexInfo.value.countGroupByLevel);

    const barCtx2 = document.getElementById('myBarChart2') as HTMLCanvasElement;
    new Chart(barCtx2, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: datas,
          label: '报警级别分布图',
          backgroundColor: ['rgb(25, 25, 112)', 'rgb(0, 0, 128)', 'rgb(0, 0, 139)', 'rgb(0, 0, 156)', 'rgb(0, 0, 205)', 'rgb(0, 0, 255)'],
        }]
      },
      options: {
        responsive: false,
      },
    });
  }).catch(error => {
    console.error('获取警告列表失败', error);
  });
});





const handleSelectChange = () => {


}
</script>
<style></style>