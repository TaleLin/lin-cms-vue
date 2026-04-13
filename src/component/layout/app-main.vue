<template>
  <section class="container">
    <div id="wrapper" class="wrapper">
      <router-view :key="routeKey" #default="{ Component }">
        <transition appear mode="out-in" name="fade-transform">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </section>
</template>

<script setup>
defineProps({
  routeKey: {
    type: String,
    required: true,
  },
})

defineOptions({
  name: 'AppMain',
})
</script>

<style lang="scss" scoped>
.container {
  .wrapper {
    width: 100%;
    height: 100%;
    text-align: left;
  }
}
</style>
