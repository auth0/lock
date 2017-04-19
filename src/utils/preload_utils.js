export function img(src, cb = () => {}) {
  const img = document.createElement('img');
  img.addEventListener('load', () => {
    cb(null, img);
  });
  img.addEventListener('error', event => {
    cb(event);
  });
  img.src = src;
  return img;
}
