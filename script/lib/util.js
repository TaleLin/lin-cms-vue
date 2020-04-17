const came = str => `${str}`.replace(/-\D/g, match => match.charAt(1).toUpperCase())

const hyphenate = str => `${str}`.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)

module.exports = {
  came,
  hyphenate,
}
