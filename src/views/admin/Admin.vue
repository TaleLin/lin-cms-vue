<template>
  <div>
    <transition name="fade-transform"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
}
</script>
