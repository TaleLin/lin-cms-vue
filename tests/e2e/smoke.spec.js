import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('home page loads without errors', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')

    // Wait for the app to load
    await page.waitForSelector('.home-shell, .login-shell, #app', { timeout: 10000 })

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(err => !err.includes('Failed to load resource') && !err.includes('favicon'))

    expect(criticalErrors).toHaveLength(0)
  })
})
