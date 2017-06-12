export function isSmallScreen() {
  return window.matchMedia && !window.matchMedia('(min-width: 380px)').matches;
}
