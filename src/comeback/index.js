export default class Comeback {
  constructor(f, timeout) {
    this.handler = () => { f(); this.release(); };
    this.modernHandler = () => {
      if (global.document.visibilityState == "visible") {
        this.handler();
      }
    };
    this.ie9Handler = () => {
      const { fromElement, toElement, relatedTarget } = global.window.event;
      if (!(fromElement || toElement || relatedTarget)) {
        this.handler();
      }
    };
    this.registerEventHandlers();
    this.registerTimeout(timeout);
  }

  release() {
    if (this.timeoutId) {
      global.clearTimeout(this.timeoutId);
      delete this.timeoutId;
    }

    if (global.document.visibilityState) {
      global.document.removeEventListener("visibilitychange", this.modernHandler);
    } else if (global.document.detachEvent) {
      global.document.detachEvent("onfocusin", this.ie9Handler);
    }
  }

  registerTimeout(timeout) {
    this.timeoutId = global.setTimeout(this.handler, timeout);
  }

  registerEventHandlers() {
    if (global.document.visibilityState) {
      global.document.addEventListener("visibilitychange", this.modernHandler);
    } else if (global.document.attachEvent) {
      global.document.attachEvent("onfocusin", this.ie9Handler)
    }
  }
}
