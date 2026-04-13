import cloneDeep from 'lodash/cloneDeep'

import { sortByOrder } from '@/lin/util/order'
import { getRandomStr } from '@/lin/util/random'

export function collectStageReferences(stages, refs = new Set()) {
  if (Array.isArray(stages)) {
    stages.forEach(stage => collectStageReferences(stage, refs))
    return refs
  }

  if (!stages || typeof stages !== 'object') {
    return refs
  }

  refs.add(stages)

  if (Array.isArray(stages.children)) {
    collectStageReferences(stages.children, refs)
  }

  return refs
}

export function filterDuplicatedPluginStages(baseStages = [], pluginStages = []) {
  const stageRefs = collectStageReferences(baseStages)

  return pluginStages.filter(stage => !stageRefs.has(stage))
}

export function normalizeStageNames(target, createRandomName = getRandomStr) {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (item && typeof item === 'object') {
        normalizeStageNames(item, createRandomName)
      }
    })

    return target
  }

  if (!target || typeof target !== 'object') {
    return target
  }

  if (typeof target.name !== 'symbol') {
    const name = target.name || createRandomName()
    target.name = Symbol(name)
  }

  if (Array.isArray(target.children)) {
    target.children.forEach(item => {
      if (item && typeof item === 'object') {
        normalizeStageNames(item, createRandomName)
      }
    })
  }

  return target
}

export function visitStageViews(config, visit) {
  if (Array.isArray(config)) {
    config.forEach(item => {
      visitStageViews(item, visit)
    })
    return
  }

  if (config?.children?.length) {
    config.children.forEach(item => {
      visitStageViews(item, visit)
    })
    return
  }

  if (config) {
    visit(config)
  }
}

export function createStageConfig({
  baseStages = [],
  pluginStages = [],
  createRandomName = getRandomStr,
  orderStages = sortByOrder,
} = {}) {
  const nextStages = [...baseStages, ...filterDuplicatedPluginStages(baseStages, pluginStages)]

  const normalizedStages = cloneDeep(orderStages(nextStages))

  return normalizeStageNames(normalizedStages, createRandomName)
}
