import { provide, ref, inject } from 'vue'

// eslint-disable-next-line symbol-description
const adminSymbol = Symbol()

export const useAdminProvide = () => {
  const flag = ref(false)
  provide(adminSymbol, flag)
}

export const useAdminInject = () => {
  const adminContext = inject(adminSymbol)

  return adminContext
}
