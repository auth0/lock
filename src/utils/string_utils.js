export function matches(search, str) {
  return str.toLowerCase().indexOf(search.toLowerCase()) > -1;
}
