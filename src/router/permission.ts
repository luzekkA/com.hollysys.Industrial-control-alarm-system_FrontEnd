import router from './index'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import getPageTitle from '../utils/get_page_title'
import { devLog } from '../utils/devLog'
import {useRoutesStore}from '../store/useRoutesStore'
import { useUrlStore } from '../store/useUrlStore'
//白名单
// const whiteList = ['/', '/forgot']
devLog("addroute sucsess")
//前置路由守卫
//@ts-ignore
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  devLog("before each")
  let routesStore = useRoutesStore()
  const urlStore = useUrlStore()
  //设置页面标题
  routesStore.generateRoutes()
  document.title = getPageTitle(to.meta.title as string)
  //if()
  // if (!to.path || to.path === '/') {
  //   next({ path: '/index' });
  // } else {
  //   next();
  // }

  if (urlStore.UrlList.length > 0) {
    // next({ path: '/index' });
    if (!to.path || to.path === '/') {
      next({ path: '/index' });
    } else {
      next();
    }
  }
  else {
    if (to.path !== '/addurl') {
      next({ path: '/addurl' })
    } else {
      next()
    }
  }
})

//后置路由守卫
router.afterEach(() => {
})
