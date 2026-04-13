<template>
  <div :class="logoDisplay.className">
    <img :src="logoDisplay.src" alt="logo" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import logo from 'assets/image/logo.png'
import mobileLogo from 'assets/image/mobile-logo.png'

defineOptions({
  name: 'SidebarLogo',
})

const { elMenuCollapse } = defineProps({
  elMenuCollapse: {
    type: Boolean,
    required: true,
  },
})

const logoDisplay = computed(() =>
  elMenuCollapse
    ? {
        className: 'mobile-logo',
        src: mobileLogo,
      }
    : {
        className: 'logo',
        src: logo,
      },
)
</script>

<style lang="scss" scoped>
.logo {
  width: $sidebar-width;
  height: $header-height;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #fff;
  background-color: var(--theme-sidebar-panel);
  transition: all 0.3s linear;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 99;

  img {
    width: 120px;
  }
}

.mobile-logo {
  width: 64px;
  height: 86px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--theme-sidebar-panel);
  transition: all 0.3s linear;

  img {
    width: 40px;
    height: 40px;
  }
}
</style>
