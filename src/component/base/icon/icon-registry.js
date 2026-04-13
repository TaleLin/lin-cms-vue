import {
  Back,
  Brush,
  Camera,
  ChatDotRound,
  Collection,
  Delete,
  Document,
  Expand,
  Failed,
  Fold,
  FolderOpened,
  FullScreen,
  House,
  Loading,
  Memo,
  MoreFilled,
  Plus,
  QuestionFilled,
  Reading,
  ScaleToOriginal,
  Share,
  Star,
  SwitchButton,
  Top,
  User,
} from '@element-plus/icons-vue'

const ELEMENT_PLUS_ICONS = Object.freeze({
  Back,
  Brush,
  Camera,
  ChatDotRound,
  Collection,
  Delete,
  Document,
  Expand,
  Failed,
  Fold,
  FolderOpened,
  FullScreen,
  House,
  Loading,
  Memo,
  MoreFilled,
  Plus,
  QuestionFilled,
  Reading,
  ScaleToOriginal,
  Share,
  Star,
  SwitchButton,
  Top,
  User,
})

function toPascalCase(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

export function resolveElementPlusIcon(name) {
  if (!name) {
    return QuestionFilled
  }

  if (typeof name !== 'string') {
    return name
  }

  const resolvedName = name.trim()
  const component = ELEMENT_PLUS_ICONS[resolvedName] || ELEMENT_PLUS_ICONS[toPascalCase(resolvedName)]

  return component || QuestionFilled
}
