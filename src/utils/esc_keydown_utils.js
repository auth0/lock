export default class EscKeydownUtils {
  constructor(f) {
    this.handler = (e) => {
      if (e.keyCode == 27 && e.target.tagName != "INPUT") {
        f();
      }
    };
    global.document.addEventListener('keydown', this.handler, false);
  }

  release() {
    global.document.removeEventListener('keydown', this.handler);
  }
}
