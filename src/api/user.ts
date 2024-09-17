import request from '../utils/request'
import axios from 'axios';
import { useUrlStore } from '../store/useUrlStore';
import { devLog } from '../utils/devLog';
const urlStore = useUrlStore()
// 动态创建请求
function createRequests(url: string, method: string, params?: any, data?: any) {
    return urlStore.UrlList.map(server => {
        return request({
            url: `${server.path}${url}`,
            method: method,
            params: params,
            data: data
        });
    });
}

function createSingleRequests(baseUrl: string, url: string, method: string, params?: any, data?: any) {
    return request({
        url: `${baseUrl}${url}`,
        method: method,
        params: params,
        data: data
    });
}

export function getLatestRealtimeAlarms() {
    const requests = createRequests('/Alarm/GetLatest30RealTimeAlarms', "get");
    return axios.all(requests).then(axios.spread((...responses) => {
        // 合并返回值
        const mergedData = responses.flatMap(response => {
            //response.data
            return response.data.map((data: any) => ({
                ...data,
                serviceUrl: response.config.url
            }));
        });
        // // 给每个响应对象增加信息
        // mergedData.forEach(data => {
        //     data.serviceUrl = '/Alarm/GetLatest30RealTimeAlarms';
        // });
        return mergedData
        //responses.push(serviceUrl:'')
    })).catch(error => {
        console.error('Error fetching latest realtime alarms:', error);
        throw error;
    });
}


export function getRealtimeAlarms(time?: any) {
    //devLog("this is base url",baseUrl)
    //return createSingleRequests(baseUrl,'/Alarm/GetRealTimeAlarms',"get",{time})

    const requests = createRequests('/Alarm/GetRealTimeAlarms', "get", { time });
    return axios.all(requests).then(axios.spread((...responses) => {
        // 合并返回值
        const mergedData = responses.flatMap(response => {
            devLog("this is response", responses)
            //response.data
            return response.data.items.map((data: any) => ({
                ...data,
                serviceUrl: response.config.url
            }));
        });
        return mergedData
    })).catch(error => {
        console.error('Error fetching latest history alarms:', error);
        throw error;
    });
}


export function getLatestHistoryAlarms() {
    const requests = createRequests('/Alarm/GetLatest30HistoryTimeAlarms', "get");
    return axios.all(requests).then(axios.spread((...responses) => {
        // 合并返回值
        const mergedData = responses.flatMap(response => {
            //response.data
            return response.data.map((data: any) => ({
                ...data,
                serviceUrl: response.config.url
            }));
        });
        return mergedData
    })).catch(error => {
        console.error('Error fetching latest history alarms:', error);
        throw error;
    });
}

export function getAlarms(baseUrl: any, Start_AlarmTime: any, End_AlarmTime: any, Source: any, Type: any, IsConfirmed: any, IsRecovered: any, Level: any, PageNumber: any, PageSize = 30) {
    const params = { Start_AlarmTime, End_AlarmTime, Source, Type, IsConfirmed, IsRecovered, Level, PageNumber, PageSize };
    // const requests = createRequests('/Alarm/GetAlarm',"get", params);
    // return axios.all(requests).then(axios.spread((...responses) => {
    //     const mergedData = responses.flatMap(response=>{
    //         //response.data
    //         return response.data.map((data:any) => ({
    //            ...data,
    //            serviceUrl: response.config.url
    //        }));
    //    });
    //    return mergedData
    // })).catch(error => {
    //     console.error('Error fetching alarms:', error);
    //     throw error;
    // });
    return createSingleRequests(baseUrl, '/Alarm/GetAlarm', "get", params)
}

// export function getHistoryAlarms(baseUrl:string,time: any) {
//     return createSingleRequests(baseUrl,'/Alarm/GetHistoryAlarms',"get",{time})
// }

export function getHistoryAlarms(time?: any) {
    //devLog("this is base url",baseUrl)
    //return createSingleRequests(baseUrl,'/Alarm/GetRealTimeAlarms',"get",{time})

    const requests = createRequests('/Alarm/GetHistoryAlarms', "get", { time });
    return axios.all(requests).then(axios.spread((...responses) => {
        // 合并返回值
        const mergedData = responses.flatMap(response => {
            devLog("this is response", responses)
            //response.data
            return response.data.items.map((data: any) => ({
                ...data,
                serviceUrl: response.config.url
            }));
        });
        return mergedData
    })).catch(error => {
        console.error('Error fetching latest history alarms:', error);
        throw error;
    });
}
// export function getHistoryAlarms(time:any) {
//     return request({
//         url: '/Alarm/GetHistoryAlarms',
//         method: 'get',
//         params:{time}
//     })
// }


export function confirmAlarm(baseUrl: string, id: any) {
    return createSingleRequests(baseUrl, '/Alarm/ConfirmAlarm', "patch", { id }).then(() => {
        location.reload()
    })
}
// export function confirmAlarm(id:any) {
//     return request({
//         url: '/Alarm/ConfirmAlarm',
//         method: 'patch',
//         params:{id}
//     }).then(()=>{
//         location.reload()
//     })
// }

export function recoverAlarm(baseUrl: string, id: any) {
    return createSingleRequests(baseUrl, '/Alarm/RecoverAlarm', "patch", { id }).then(() => {
        location.reload()
    })
}

// export function getIndexInfo(baseUrl:string) {
//     return createSingleRequests(baseUrl,'/Alarm/Index',"get")
// }
interface Data {
    realTimeAlarmTimes: number;
    historyAlarmTimes: number;
    notConfirmedAlarmTimes: number;
    notRecoveredAlarmTimes: number;
    countGroupByLevel: { [key: number]: any };
    countGroupByType: { [key: string]: any };
}
export function getIndexInfo() {
    //devLog("this is base url",baseUrl)
    //return createSingleRequests(baseUrl,'/Alarm/GetRealTimeAlarms',"get",{time})

    const requests = createRequests('/Alarm/Index', "get");
    return axios.all(requests).then(axios.spread((...responses) => {
        // 合并返回值
        const mergedData = responses.flatMap(response => {
            devLog("this is response", responses)
            //response.data
            return response
        });
        let data: Data = {
            realTimeAlarmTimes: 0,
            historyAlarmTimes: 0,
            notConfirmedAlarmTimes: 0,
            notRecoveredAlarmTimes: 0,
            countGroupByLevel: {},
            countGroupByType: {}

        }
        mergedData.forEach(element => {
            data.realTimeAlarmTimes += element.data.realTimeAlarmTimes as number
            data.historyAlarmTimes += element.data.historyAlarmTimes as number
            data.notConfirmedAlarmTimes += element.data.notConfirmedAlarmTimes as number
            data.notRecoveredAlarmTimes += element.data.notRecoveredAlarmTimes as number
            //let key:number
            for (const key in element.data.countGroupByLevel) {
                if (data.countGroupByLevel.hasOwnProperty(key)) {
                    data.countGroupByLevel[key as any] += element.data.countGroupByLevel[key];
                } else {
                    data.countGroupByLevel[key as any] = element.data.countGroupByLevel[key];
                }
            }
            for (const key in element.data.countGroupByType) {
                if (data.countGroupByType.hasOwnProperty(key)) {
                    data.countGroupByType[key as any] += element.data.countGroupByType[key];
                } else {
                    data.countGroupByType[key as any] = element.data.countGroupByType[key];
                }
              }
            // data.countGroupByLevel.forEach({})

        });
        //data.countGroupByType.push(element.data.countGroupByType)
        //})
        devLog("this is response data", data)
        return data
    })).catch(error => {
        console.error('Error fetching latest history alarms:', error);
        throw error;
    });
}
// export function recoverAlarm(id:any) {
//     return request({
//         url: '/Alarm/RecoverAlarm',
//         method: 'patch',
//         params:{id}
//     }).then(()=>{
//         location.reload()
//     })
// }