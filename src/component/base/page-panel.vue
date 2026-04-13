<template>
  <section class="page-panel">
    <header
      v-if="title || hasTitleSlot || hasActionsSlot"
      class="page-panel__header"
      :class="{ 'page-panel__header--with-actions': hasActionsSlot }"
      :style="headerStyle"
    >
      <div class="page-panel__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="hasActionsSlot" class="page-panel__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="page-panel__body" :class="bodyClass" :style="bodyStyle">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { computed, useSlots } from 'vue'

defineOptions({
  name: 'PagePanel',
})

const { title, headerPadding, bodyPadding, bodyClass } = defineProps({
  title: {
    type: String,
    default: '',
  },
  headerPadding: {
    type: String,
    default: '0 40px',
  },
  bodyPadding: {
    type: String,
    default: '20px',
  },
  bodyClass: {
    type: [String, Array, Object],
    default: '',
  },
})

const slots = useSlots()
const hasTitleSlot = computed(() => Boolean(slots.title))
const hasActionsSlot = computed(() => Boolean(slots.actions))
const headerStyle = computed(() => ({
  '--page-panel-header-padding': headerPadding,
}))
const bodyStyle = computed(() => ({
  '--page-panel-body-padding': bodyPadding,
}))
</script>

<style lang="scss" scoped>
.page-panel {
  position: relative;
  overflow: hidden;
  background: var(--theme-panel-gradient);
  border: 1px solid var(--theme-border);
  border-radius: 18px;
  box-shadow: var(--theme-panel-shadow);

  &:before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 68px;
    background: linear-gradient(180deg, var(--theme-panel-highlight), transparent);
    pointer-events: none;
  }
}

.page-panel__header {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 59px;
  padding: var(--page-panel-header-padding);
  border-bottom: 1px solid var(--theme-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), transparent);
}

.page-panel__header--with-actions {
  justify-content: space-between;
  gap: 16px;
}

.page-panel__title {
  min-width: 0;
  color: $parent-title-color;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  font-family: var(--theme-font-display);
}

.page-panel__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-panel__body {
  position: relative;
  padding: var(--page-panel-body-padding);
}
</style>
