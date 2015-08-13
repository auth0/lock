import Immutable, { Map } from 'immutable';

export default class PluginManager {
  constructor(proto) {
    this.proto = proto;
    this.specs = new Map({});
  }

  register(spec) {
    spec = Immutable.fromJS(spec);
    this.specs = this.specs.set(spec.get("name"), spec);

    if (spec.has("methods")) {
      spec.getIn(["methods", "open"]).forEach((f, name) => {
        this.proto[name] = function(...args) {
          const isOpen = f(this.id, ...args);
          if (isOpen) {
            this.plugin = spec.get("name");
          }
          return isOpen;
        }
      });
    }
  }

  renderFns() {
    return this.specs.map(spec => spec.get("renderFn"));
  }

  closeFn(name) {
    const f = this.specs.getIn([name, "methods", "close"]);
    if (typeof f !== "function") {
      throw new Error("Plugin didn't specify a `close` method.")
    }
    return f;
  }
}
