module.exports = function () {
  return window.matchMedia && !window.matchMedia( "(min-width: 340px)" ).matches;
};