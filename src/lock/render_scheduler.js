export default class RenderScheduler {
  constructor() {
    this.queued = false;
  }

  schedule(f) {
    if (!this.queued) {
      global.window.requestAnimationFrame(() => {
        this.queued();
        this.queued = null;
      });
    }
    this.queued = f;
  }
}
