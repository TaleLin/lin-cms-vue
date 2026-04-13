import { describe, expect, it } from 'vitest'

import { createLoginAccount, extractCaptchaState } from '@/view/login/login-helpers'

describe('login helpers', () => {
  it('creates an empty login draft', () => {
    expect(createLoginAccount()).toEqual({
      username: '',
      password: '',
      captcha: '',
    })
  })

  it('normalizes captcha payload fields', () => {
    expect(extractCaptchaState({ image: 'data:image/png;base64,abc', tag: 'captcha-tag' })).toEqual({
      image: 'data:image/png;base64,abc',
      tag: 'captcha-tag',
    })

    expect(extractCaptchaState()).toEqual({
      image: '',
      tag: '',
    })
  })
})
