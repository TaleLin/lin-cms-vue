<template>
  <div>
    <!-- 页面过度动画 -->
    <transition name="fade-transform"
                mode="out-in">
      <!-- 主要用于保留组件状态或避免重新渲染 -->
      <!-- <keep-alive> -->
        <!-- 渲染路径匹配到的视图组件 -->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>
