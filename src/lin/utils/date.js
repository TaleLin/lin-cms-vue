/**
 * @param {number} hours
 */
export function getDateAfterHours(hours) {
  const now = new Date()
  return new Date(now.setHours(now.getHours() + hours))
}
/**
 * @param {number} days
 */
export function getDateAfterDays(days) {
  const now = new Date()
  return new Date(now.setHours(now.getHours() + (days * 24)))
}
