const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

export function getRandomStr(length = 6) {
  let value = ''

  for (let index = 0; index < length; index += 1) {
    value += RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length))
  }

  return value
}
