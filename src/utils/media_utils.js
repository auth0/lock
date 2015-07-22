export function isSmallScreen() {
  return window.matchMedia && !window.matchMedia("(min-width: 340px)").matches;
}
