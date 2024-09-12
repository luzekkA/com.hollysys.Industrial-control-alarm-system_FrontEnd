<template>
    <!-- 这个路由有多个children -->
    <el-sub-menu v-if="(route.children && route.children.length > 1)" :index="index">
        <template #title>
            <el-icon>
                <component :is="route.meta.icon"></component>
            </el-icon>
            <span @click="handleClick()">{{ route?.meta?.name }}</span>
        </template>
        <div v-for="(children, childrenIndex) in route.children">
            <item :route="children" :father-route="route" :index="`${index}-${childrenIndex}`"></item>
        </div>
    </el-sub-menu>

    <el-menu-item v-if="(route.children && route.children.length == 1)" :index="index" @click="handleClick2()">
        <!-- 只有1个children -->
        <el-icon>
            <component :is="route.meta.icon"></component>
        </el-icon>
        <template #title>
            {{ route.children[0].name }}
        </template>
    </el-menu-item>


    <el-menu-item v-if="(!route.children)" :index="index" @click="handleClick()">
        <template #title>
            {{ route.name }}
        </template>
    </el-menu-item>
    <!-- </div> -->
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { devLog } from '../../../../utils/devLog';

const router = useRouter()
// 使用 <script setup>
const props = defineProps({
    route: {
        type: Object,
        required: true
    },
    fatherRoute: {
        type: Object,
        required: true
    },
    index: {
        type: String,
        required: true,
        default: 0
    },
})
let myPath: string
let fatherPath = props.fatherRoute.path || ''
if (fatherPath == '') {
    myPath = props.route.path
}
else {
    myPath = fatherPath + "/" + props.route.path
}

const handleClick = () => {
    devLog(myPath)
    router.push(myPath)
}
const handleClick2 = () => {
    devLog(myPath)
    router.push(myPath+'/'+props.route.children[0].path)
}
</script>
<style>
.menu{
    height: 100px;
}
</style>