import FastScanner from 'fastscan'

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

export function escapeSearchKeyword(keyword = '') {
  return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function highlightSearchKeyword(content = '', keyword = '', className = 'strong') {
  if (!keyword || typeof content !== 'string') {
    return content
  }

  const safeKeyword = escapeSearchKeyword(keyword)
  return content.replace(RegExp(safeKeyword, 'g'), `<span class="${className}">${keyword}</span>`)
}

export function buildHighlightedMessageSegments(content = '', keyword = '') {
  if (typeof content !== 'string') {
    return []
  }

  if (!keyword) {
    return [
      {
        text: content,
        highlighted: false,
      },
    ]
  }

  const safeKeyword = escapeSearchKeyword(keyword)
  return content
    .split(RegExp(`(${safeKeyword})`, 'g'))
    .filter(Boolean)
    .map(part => ({
      text: part,
      highlighted: part === keyword,
    }))
}

/**
 *
 * @param {string} keyword
 * @param {Array} logs
 */
export function searchLogKeyword(keyword, logs, className = 'strong') {
  if (!Array.isArray(logs)) {
    return []
  }

  return logs.map(log => ({
    ...log,
    message: highlightSearchKeyword(log.message, keyword, className),
    messageSegments: buildHighlightedMessageSegments(log.message, keyword),
  }))
}
