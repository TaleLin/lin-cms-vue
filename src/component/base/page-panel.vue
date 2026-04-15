<template>
  <section class="page-panel">
    <header
      v-if="title || hasTitleSlot || hasActionsSlot"
      class="page-panel__header"
      :class="{
        'page-panel__header--with-actions': hasActionsSlot,
        'page-panel__header--sticky': stickyHeader,
      }"
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

const { title, headerPadding, bodyPadding, bodyClass, stickyHeader, stickyTop } = defineProps({
  title: {
    type: String,
    default: '',
  },
  headerPadding: {
    type: String,
    default: '0 30px',
  },
  bodyPadding: {
    type: String,
    default: '',
  },
  bodyClass: {
    type: [String, Array, Object],
    default: '',
  },
  stickyHeader: {
    type: Boolean,
    default: true,
  },
  stickyTop: {
    type: String,
    default: '0px',
  },
})

const slots = useSlots()
const hasTitleSlot = computed(() => Boolean(slots.title))
const hasActionsSlot = computed(() => Boolean(slots.actions))
const headerStyle = computed(() => ({
  '--page-panel-header-padding': headerPadding,
  '--page-panel-sticky-top': stickyTop,
}))
const bodyStyle = computed(() => ({
  '--page-panel-body-padding': resolveBodyPadding(),
}))

function resolveBodyPadding() {
  if (bodyPadding) {
    return bodyPadding
  }

  return '20px 30px 30px'
}
</script>

<style lang="scss" scoped>
.page-panel {
  position: relative;
}

.page-panel__header {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 59px;
  padding: var(--page-panel-header-padding);
  border-bottom: 1px solid var(--theme-border);
}

.page-panel__header--with-actions {
  justify-content: space-between;
  gap: 16px;
}

.page-panel__header--sticky {
  position: sticky;
  top: var(--page-panel-sticky-top);
  z-index: 9;
}

.page-panel__header--sticky:before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--theme-main-bg);
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
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  min-width: 0;
}

.page-panel__body {
  position: relative;
  padding: var(--page-panel-body-padding);
}

@media screen and (width <= 680px) {
  .page-panel__header--with-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .page-panel__actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
