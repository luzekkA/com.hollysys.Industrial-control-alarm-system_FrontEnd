//引入路由对象
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
//定义静态路由
export const staticRoutes: Array<RouteRecordRaw> = [
    
    {
        path: "/index",
        component: () => import('../views/Layout/index.vue'),
        meta: {
            icon: 'HomeFilled',
            name: "主页"
        },
        children: [
            {
                path: '',
                name: "主页",
                component: () => import('../views/index.vue'),
            }, 
        ],
    },
    {
        path: "/addurl",
        component: () => import('../views/Layout/index.vue'),
        meta: {
            icon: 'HomeFilled',
            name: "添加服务器地址"
        },
        children: [
            {
                path: '',
                name: "添加服务器地址",
                component: () => import('../views/addURL.vue'),
            }, 
        ],
    },
    {
        path: "/realtime",
        component: () => import('../views/Layout/index.vue'),
        meta: {
            icon: 'HomeFilled',
            name: "实时报警"
        },
        children: [
            {
                path: 'latest',
                name: "最近30条实时报警",
                component: () => import('../views/realtime/latest.vue'),
            }, 
            {
                // path: '/404',
                path: 'all',
                name: "所有实时报警",
                component: () => import('../views/realtime/all.vue'),
            },
        ],
    },
    {
        path: "/history",
        component: () => import('../views/Layout/index.vue'),
        meta: {
            icon: 'HomeFilled',
            name: "历史报警"
        },
        children: [
            {
                path: 'latest',
                name: "最近30条历史报警",
                component: () => import('../views/history/latest.vue'),
            }, 
            {
                // path: '/404',
                path: 'all',
                name: "所有历史报警",
                component: () => import('../views/history/all.vue'),
            },
        ],
    },
    {
        path: "/search",
        component: () => import('../views/Layout/index.vue'),
        meta: {
            icon: 'HomeFilled',
            name: "搜索报警"
        },
        children: [
            {
                path: '',
                name: "搜索报警",
                component: () => import('../views/search/index.vue'),
            }
        ],
    },
    {
        // path: '/404',
        path: '/:pathMatch(.*)*',
        meta: {
            hidden: true
        },
        component: () => import('../views/error-page/404.vue'),
    },

]
//静态路由直接添加到router
let router = createRouter({
    history: createWebHistory(),
    routes: staticRoutes
})
//重置路由
export function resetRouter() {
    const newRouter = createRouter({
        history: createWebHistory(),
        routes: [],  // 如果routes是undefined，使用空数组
    });
    router = newRouter;
}

//导出router
export default router