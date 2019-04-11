// 预计算一下版本是否有冲突
const semver = require('semver')

const validateSemver = (range1, range2) => {
  if (!range1 || !range2) {
    return false
  }
  // 都是指定版本
  if (semver.valid(range1) && semver.valid(range2)) {
    return (semver.coerce(range1) === semver.coerce(range2))
  }

  // 都是范围
  if (semver.validRange(range1) && semver.validRange(range2)) {
    return semver.intersects(range1, range2)
  }

  // 一个版本一个范围
  if (semver.valid(range1) && semver.validRange(range2)) {
    return semver.satisfies(range1, range2)
  }

  if (semver.valid(range2) && semver.validRange(range1)) {
    return semver.satisfies(range2, range1)
  }

  return false
}

module.exports = validateSemver
