export function matches(search, str) {
  return str.toLowerCase().indexOf(search.toLowerCase()) > -1;
}

export function startsWith(str, search) {
  return str.indexOf(search) === 0;
}

export function endsWith(str, search) {
  return str.indexOf(search, str.length - search.length) !== -1;
}
