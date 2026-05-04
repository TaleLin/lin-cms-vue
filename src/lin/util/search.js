import FastScanner from 'fastscan'

// const words = ['今日头条',
//   '微信', '支付宝',
// ]
// const scanner = new FastScanner(words)
// const content = '今日头条小程序终于来了，这是继微信、支付宝、百度后，第四个推出小程序功能的App。猫眼电影率先试水，出现在今日头条。'
// const offWords = scanner.search(content)
// console.log(offWords)
// const hits = scanner.hits(content)
// console.log(hits)

/**
 *
 * @param {string} word
 * @param {string} content
 */
export async function searchForWord(word, content) {
  const scanner = new FastScanner([word])
  const offWords = scanner.search(content)
  return offWords
}

/**
 *
 * @param {Array<string>} words
 * @param {string} content
 */
export async function searchForWords(words, content) {
  const scanner = new FastScanner(words)
  const offWords = scanner.search(content)
  return offWords
}
/**
 * 转义正则表达式特殊字符
 * @param {string} str
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * HTML转义，防止keyword注入恶意HTML（如 <img onerror=...>）
 * @param {string} str
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 *
 * @param {string} keyword
 * @param {Array} logs
 */
export function searchLogKeyword(keyword, logs, className = 'strong') {
  if (!keyword) {
    return logs
  }
  const escaped = escapeRegExp(keyword)
  const safeKeyword = escapeHtml(keyword)
  const _logs = logs.map(log => {
    const msg = log.message.replace(
      RegExp(escaped, 'g'),
      `<span class="${className}">${safeKeyword}</span>`,
    )
    return { ...log, message: msg }
  })
  return _logs
}
