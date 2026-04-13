export const NOT_FOUND_HEADER_HEIGHT = 72

export function getNotFoundContainerHeight(clientHeight, headerHeight = NOT_FOUND_HEADER_HEIGHT) {
  return `${clientHeight - headerHeight}px`
}
