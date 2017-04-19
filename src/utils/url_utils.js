export function parseUrl(str) {
  const parser = global.document.createElement('a');
  parser.href = str;
  return parser;
}
