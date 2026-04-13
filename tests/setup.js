import { vi } from 'vitest'

const localStorageStore = new Map()
const localStorageMock = {
  getItem: vi.fn(key => localStorageStore.get(key) ?? null),
  setItem: vi.fn((key, value) => localStorageStore.set(key, value)),
  removeItem: vi.fn(key => localStorageStore.delete(key)),
  clear: vi.fn(() => localStorageStore.clear()),
  key: vi.fn(index => Array.from(localStorageStore.keys())[index] ?? null),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
