export default {
  random: () => {
    return (+new Date() + Math.floor(Math.random() * 10000000)).toString(36);
  }
}
