<template>
  <div id="mainWindow" style="width: 100%; height: 100%;">
    <!-- <div id="vanta-waves" class="vanta-waves"></div> -->
    <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" style="margin-bottom: 10px;">
      <el-menu-item index="0">
        <h1 style="margin: 0px;">首页</h1>
      </el-menu-item>
      <RouterLink to="/search">
        <el-menu-item index="1">
          <h3 style="margin: 0px;">搜索报警</h3>
        </el-menu-item>
      </RouterLink>
      <RouterLink to="/addUrl">
        <el-menu-item index="1">
          <h3 style="margin: 0px;">添加服务器URL</h3>
        </el-menu-item>
      </RouterLink>
    </el-menu>
    <!--  -->
    <el-row>
      <el-col :span="8">
        <el-row style="margin-bottom: 20px; margin-left: 10px;">
          <el-col :span="12">
            <RouterLink to="/realtime/latest">
              <el-card style="width: 200px;height: 150px; background-color:#212844; border:0px;">
                <span class="blinking-text">实时报警数</span>
                <h1 class="blinking-text" style="margin-top:20px;"> {{ IndexInfo?.realTimeAlarmTimes }}</h1>
              </el-card>
            </RouterLink>
          </el-col>
          <el-col :span="12">
            <RouterLink to="/history/latest">
              <el-card style="width: 200px;height: 150px; background-color:#212844; border:0px;">
                <span style="color: white;">历史报警数</span>
                <h1 style="margin-top:20px;color: white;">{{ IndexInfo?.historyAlarmTimes }}</h1>
              </el-card>
            </RouterLink>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px; margin-left: 10px;">
          <el-col :span="12">
            <el-card style="width: 200px;height: 150px; background-color:#212844; border:0px;">
              <span style="color: white;">待确认数</span>
              <h1 style="margin-top:20px; color: white;">{{ IndexInfo?.notConfirmedAlarmTimes }}</h1>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card style="width: 200px;height: 150px; background-color:#212844; border:0px;">
              <span style="color: white;">待恢复数</span>
              <h1 style="margin-top:20px;color: white;">{{ IndexInfo?.notRecoveredAlarmTimes }}</h1>
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="16">
        <!-- <canvas id="myBarChart" style="width: 100%; height: 100%;"></canvas> -->
        <div id="BarTypeChart" style="width: 100%;height:100%;"></div>
      </el-col>
    </el-row>
    <el-row style="height: 40%;">
      <el-col :span="12">
        <!-- <canvas id="BarLevelChart" style="width: 100%; height: 100%;"></canvas> -->
        <div id="BarLevelChart" style="width: 100%;height:100% !important;"></div>
      </el-col>
      <el-col :span="12">
        <div id="pieChart" style="width: 100%;height: 100%;"></div>
        <!-- <canvas id="pieChart" ></canvas> -->
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue';
import { useUrlStore } from '../store/useUrlStore'
import { devLog } from '../utils/devLog';
import { getIndexInfo } from '../api/user'
import * as signalR from "@microsoft/signalr";
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
//@ts-ignore
import * as THREE from 'three';
//@ts-ignore
import BIRDS from 'vanta/dist/vanta.net.min';
let vantaEffect: any;
type EChartsOption = echarts.EChartsOption;
const urlStore = useUrlStore()
// const serverUrl = ref(urlStore.UrlList[0].path)
const IndexInfo = ref<any>()
//const totalInfo = ref<any>()
const refreshMassage = ref("")
const connectionBuilder = new signalR.HubConnectionBuilder()
// .withUrl("http://127.0.0.1:5235/alarmHub")
// .build();
urlStore.UrlList.forEach(element => {
  let url = new URL(element.path)
  url.origin
  connectionBuilder.withUrl(url.origin + '/alarmHub')
});
const connection = connectionBuilder.build();

connection.on("Massage", (message: string) => {
  devLog("Received Massage message", message);
  ElMessage.success("消息更新")
  refreshMassage.value = message


  getIndexInfo().then(data => {
    devLog("this is data", data)
    IndexInfo.value = data
  }).catch(error => {
    console.error('获取警告列表失败', error);
  });

});

connection.start().catch((err) => document.write(err));


var pieChartDom: any;
var pieChart: any;
var pieChartOption: any;

var BarLevelChartDom: any;
var BarLevelChart: any
var BarLevelChartOption: any;

var BarTypeChartDom: any;
var BarTypeChart: any
var BarTypeChartOption: any;
onMounted(() => {


  let labels
  let datas
  // UrlStore.loadUrls(); // 组件挂载时加载URL列表
  // devLog("this is store", UrlStore.UrlList)
  getIndexInfo().then(data => {
    devLog("this is data", data)
    // data.forEach(element => {
    //   element.
    // });
    IndexInfo.value = data
    labels = Object.keys(IndexInfo.value.countGroupByLevel);
    datas = Object.values(IndexInfo.value.countGroupByLevel);


  }).catch(error => {
    console.error('获取首页信息失败', error);
  });




  //等级柱状图
  BarLevelChartDom = document.getElementById('BarLevelChart')!;
  BarLevelChart = echarts.init(BarLevelChartDom, 'darke');
  BarLevelChartOption = ref<EChartsOption>();
  BarLevelChartOption.value = {
    yAxis: {
      type: 'category',
      //data: labels
      data: []
    },
    xAxis: {
      type: 'value'
    },
    series: [
      {
        //data: datas.map((item, index) => ({ value: item, itemStyle: { color: color[index] } })),
        data: [],
        type: 'bar',

      }
    ]
  };
  BarLevelChartOption && BarLevelChart.setOption(BarLevelChartOption.value);



  //类型柱状图
  BarTypeChartDom = document.getElementById('BarTypeChart')!;
  BarTypeChart = echarts.init(BarTypeChartDom, 'shine');
  BarTypeChartOption = ref<EChartsOption>();
  BarTypeChartOption.value = {
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 0, // 确保每个标签都显示
        rotate: 30, // 如果标签太长，可以旋转标签
      },
      //data: labels
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        //data: datas.map((item, index) => ({ value: item, itemStyle: { color: color[index] } })),
        data: [],
        type: 'bar',

      }
    ]
  };
  BarTypeChartOption && BarTypeChart.setOption(BarTypeChartOption.value);

  //饼图
  pieChartDom = document.getElementById('pieChart')!;
  pieChart = echarts.init(pieChartDom);
  pieChartOption = ref<EChartsOption>();
  pieChartOption.value = {

    legend: {
      top: 'bottom'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [

      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [20, 140],
        center: ['50%', '50%'],
        roseType: 'radius',
        emphasis: {
          label: {
            show: true
          }
        },
        color: [
          '#8b0000',
          '#ff0000',
          '#ff4500',
          '#ffa500',
          '#ff8c00',
          '#ffc800',
          '#ffdc66',
          '#ffb6c1',
          '#ff6347',
          '#ff7f50',
          '#ffb6c1',
          '#f08080',

        ],
        itemStyle: {
          borderRadius: 8
        },
        data: [{ value: 0, name: '实时报警数量' }, { value: 0, name: '历史报警数量' }]
        //data:[10,20]
      }
    ]
  };

  pieChartOption && pieChart.setOption(pieChartOption.value);

  vantaEffect = BIRDS({
    el: "#mainWindow",
    THREE: THREE,
    color: 0x999999,
    backgroundColor: 0x000000,
    maxDistance: 5
  })


});

const color = [
  '#8b0000',
  '#ff0000',
  '#ff4500',
  '#ffa500',
  '#ff8c00',
  '#ffc800',
  '#ffdc66',
  '#ffb6c1',
  '#ff6347',
  '#ff7f50',
  '#ffb6c1',
  '#f08080',

];
watch(IndexInfo, (newValue) => {
  if (pieChart) {
    pieChart.setOption({
      series: [
        {
          data: [
            { value: newValue.realTimeAlarmTimes, name: '实时报警数量' },
            { value: newValue.historyAlarmTimes, name: '历史报警数量' }
          ]
        }
      ]
    });
  }
  if (BarLevelChart) {
    BarLevelChart.setOption({
      yAxis: {
        //data: labels
        data: Object.keys(newValue.countGroupByLevel),
      },
      series: [
        {
          data: Object.values(newValue.countGroupByLevel).map((item, index) => ({ value: item, itemStyle: { color: color[index] } }))
        }
      ]
    });
  }
  if (BarTypeChart) {
    BarTypeChart.setOption({
      xAxis: {
        //data: labels
        data: Object.keys(newValue.countGroupByType),
      },
      series: [
        {
          data: Object.values(newValue.countGroupByType).map((item, index) => ({ value: item, itemStyle: { color: color[index] } }))
        }
      ]
    });
  }
}, { deep: true });

</script>
<style scoped>
.vanta-waves {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.blinking-text {
  margin-top: 20px;
  color: red;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>