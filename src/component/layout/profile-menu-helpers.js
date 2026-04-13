import { DEFAULT_NICKNAME } from './profile-helpers'

export { DEFAULT_NICKNAME }
export const DEFAULT_GROUP_NAME = '未分组'

export function getNicknameLabel(nickname) {
  return nickname || DEFAULT_NICKNAME
}

export function getGroupDisplayName(groups = []) {
  const names = groups.map(group => group?.name).filter(Boolean)

  return names.length ? names.join('，') : DEFAULT_GROUP_NAME
}
