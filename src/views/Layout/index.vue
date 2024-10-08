<template>
  <!-- <el-container class="container">
    <el-header id="header">
      <Navbar />
    </el-header>
    <el-container>
      <el-aside id="aside">
        <Aside />
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container> -->
  <el-container class="container">
    <el-main class="container"><router-view></router-view></el-main>
  </el-container>
</template>
<script setup lang='ts'>
// import Aside from "./Aside/index.vue"
// import Navbar from "./Navbar/Navbar.vue"
// import {useUserStore} from "../../store/useUserStore"
// const userStore = useUserStore()
</script>
<style>
#header {
  padding: 0px;
  height: 55px;
}

#aside {
  width: 215px;
}

.container {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  border: 0px;
}
</style>
