import request from '../utils/request'
export function getLatestRealtimeAlarms() {
    return request({
        url: '/Alarm/GetLatest30RealTimeAlarms',
        method: 'get',
    })
}
export function getRealtimeAlarms(time:any) {
    return request({
        url: '/Alarm/GetRealTimeAlarms',
        method: 'get',
        params:{time}
    })
}


export function getLatestHistoryAlarms() {
    return request({
        url: '/Alarm/GetLatest30HistoryTimeAlarms',
        method: 'get',
    })
}
export function getHistoryAlarms(time:any) {
    return request({
        url: '/Alarm/GetHistoryAlarms',
        method: 'get',
        params:{time}
    })
}

export function getAlarms(Start_AlarmTime:any,End_AlarmTime:any,Source:any,Type:any,IsConfirmed:any,IsRecovered:any,Level:any,PageNumber:any,PageSize = 30) {
    return request({
        url: '/Alarm/GetAlarm',
        method: 'get',
        params:{Start_AlarmTime,End_AlarmTime,Source,Type,IsConfirmed,IsRecovered,Level,PageNumber,PageSize}
    })
}
export function confirmAlarm(id:any) {
    return request({
        url: '/Alarm/ConfirmAlarm',
        method: 'patch',
        params:{id}
    })
}
export function recoverAlarm(id:any) {
    return request({
        url: '/Alarm/RecoverAlarm',
        method: 'patch',
        params:{id}
    })
}