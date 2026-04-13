export function cutString(str, len) {
  if (str.length * 2 <= len) {
    return str
  }

  let stringLength = 0
  let value = ''

  for (let index = 0; index < str.length; index += 1) {
    value += str.charAt(index)

    if (str.charCodeAt(index) > 128) {
      stringLength += 2
      if (stringLength >= len) {
        return `${value.substring(0, value.length - 1)}...`
      }
    } else {
      stringLength += 1
      if (stringLength >= len) {
        return `${value.substring(0, value.length - 2)}...`
      }
    }
  }

  return value
}
