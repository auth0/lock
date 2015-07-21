export function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function matches(search, str) {
  return str.toLowerCase().indexOf(search.toLowerCase()) > -1;
}
