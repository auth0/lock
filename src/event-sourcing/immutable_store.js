export default class ImmutableStore {
  constructor(reducer, state) {
    this.reducer = reducer;
    this.state = state;
    this.callbacks = [];
  }

  register(cb) {
    this.callbacks.push(cb);
  }

  effect(e) {
    const state = this.reducer(this.state, e);
    if (this.state != state) {
      this.state = state;
      this.callbacks.forEach(cb => cb());
    }
  }

  getState() {
    return this.state;
  }
}
