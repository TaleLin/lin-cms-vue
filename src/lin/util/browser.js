import { defaultWindow } from '@vueuse/core'

export function openExternalLink(link, open = defaultWindow?.open) {
  open?.(link, '_blank', 'noopener')
}
