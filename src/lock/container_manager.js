export default class LockContainerManager {
  constructor() {
    this.cache = {};
  }

  ensure(id, create) {
    let container = this.cache[id];
    if (!container) {
      container = this.cache[id] = document.getElementById(id);
    }
    if (!container) {
      if (create) {
        container = document.createElement('div');
        container.id = id;
        container.className = "auth0-lock-container";
        this.cache[id] = document.body.appendChild(container);
      } else {
        throw new Error(`Can't find element with id ${id}`);
      }
    }
    return container;
  }
}
