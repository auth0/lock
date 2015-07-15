export default class Dispatcher {
  constructor(store) {
    this.store = store;
  }

  dispatch(action) {
    const [e, f] = action;
    this.store.effect(e);
    if (f) {
      f(this.store.getState());
    }
  }
}
