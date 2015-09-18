export function random() {
  return (+new Date() + Math.floor(Math.random() * 10000000)).toString(36);
}

let start = 1;
export function incremental() {
  return start++;
}
