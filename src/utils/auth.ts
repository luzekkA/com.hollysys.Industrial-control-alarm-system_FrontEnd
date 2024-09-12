import Cookies from 'js-cookie'
import { devLog } from './devLog'
//对cookie中的token进行操作
const TokenKey = 'Token'
const refreshTokenKey = 'refreshToken'
export function getToken():string{
    return Cookies.get(TokenKey) as string
}
export function getRefreshToken():string{
    return Cookies.get(refreshTokenKey) as string
}
export function setToken(token:string):string{
    return Cookies.set(TokenKey,token) as string
}

export function setRefreshToken(refreshToken:string):string{
    return Cookies.set(refreshTokenKey,refreshToken) as string
}

export function removeToken(){
    Cookies.remove(TokenKey)
    Cookies.remove(refreshTokenKey)
}

// export function refreshCookieToken(){
//     Cookies.set(TokenKey,Cookies.get(refreshTokenKey) as string)
// }