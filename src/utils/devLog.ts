import { Env,settings } from "../settings";
export function devLog(text?:string ,message?:any){
    if(settings.env==Env.Dev || settings.env==Env.Mock){
        console.log(text,message);
    }
}