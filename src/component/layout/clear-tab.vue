<template>
  <div class="tab" title="关闭全部历史记录" @click="closeReuseTab"><Delete class="tab__icon" /></div>
</template>

<script setup>
import { Delete } from '@element-plus/icons-vue'

const emit = defineEmits(['clear'])

function closeReuseTab() {
  emit('clear')
}
</script>

<style lang="scss" scoped>
.tab {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .tab__icon {
    width: 18px;
    height: 18px;
    font-size: 18px;
  }
}
</style>
