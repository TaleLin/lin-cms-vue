<template>
  <div :class="!elMenuCollapse ? 'logo' : 'mobile-logo'">
    <img :src="!elMenuCollapse ? logo : mobileLogo" alt="logo" />
  </div>
</template>

<script>
import logo from 'assets/image/logo.png'
import mobileLogo from 'assets/image/mobile-logo.png'

export default {
  props: {
    elMenuCollapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      logo,
      mobileLogo
    }
  },
}
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
  transition: all 0.5s ease-in-out;
  background-color: #122150;
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
  background-color: #122150;
  transition: all 0.3s linear;

  img {
    width: 40px;
    height: 40px;
  }
}
</style>
