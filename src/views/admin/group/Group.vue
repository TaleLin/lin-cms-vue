<template>
  <div class="container">
    <transition name="fadeChild-transform"
                mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
