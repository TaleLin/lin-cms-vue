import { debounce, throttle } from 'lodash'

export function createDebouncedHandler(handler, wait = 50) {
  return debounce(handler, wait)
}

export function createThrottledHandler(handler, wait = 50) {
  return throttle(handler, wait)
}
