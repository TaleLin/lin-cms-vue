export function createLoginAccount() {
  return {
    username: '',
    password: '',
    captcha: '',
  }
}

export function extractCaptchaState(result = {}) {
  return {
    image: result.image || '',
    tag: result.tag || '',
  }
}
