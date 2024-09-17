import { settings, Env } from "../settings";
// import { useUserStore } from "../store/useUserStore";
// import { getToken } from "./auth";
//import { ElMessage } from "element-plus";
import axios, { AxiosInstance } from 'axios'
//import { devLog } from "./devLog";

let baseURL = ''
if (settings.env == Env.Mock) {
    baseURL = settings.mockURL
}
else if (settings.env == Env.Dev) {
    baseURL = settings.baseURL
}
const service: AxiosInstance = axios.create({
    //baseURL: baseURL,
    timeout: 5000
})

export default service;

