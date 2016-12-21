import { Map } from '../notmutable';

class StateAccesor {
  constructor(baseNSKeyPath) {
    this.baseNSKeyPath = baseNSKeyPath;
    this.transientNSKeyPath = baseNSKeyPath.concat(["transient"]);

    this.reset = this.reset.bind(this);
    this.init = this.init.bind(this);
    this.initNS = this.initNS.bind(this);
    this.keyPath = this.keyPath.bind(this);
    this.get = this.get.bind(this);
    this.tget = this.tget.bind(this);
    this.set = this.set.bind(this);
    this.tset = this.tset.bind(this);
    this.remove = this.remove.bind(this);
    this.tremove = this.tremove.bind(this);
  }

  reset(m) {
    return m.map(x => Map.isMap(x) ? x.remove("transient") : x);
  }

  init(id, m) {
    return new Map({id: id}).setIn(this.baseNSKeyPath, m);
  }

  initNS(m, ns) {
    return m.setIn(this.baseNSKeyPath, ns);
  }

  keyPath(nsKeyPath, keyOrKeyPath) {
    return nsKeyPath.concat(
      typeof keyOrKeyPath === "object" ? keyOrKeyPath : [keyOrKeyPath]
    );
  }

  get(m, keyOrKeyPath, notSetValue = undefined, debug = false) {
    return m.getIn(this.keyPath(this.baseNSKeyPath, keyOrKeyPath), notSetValue);
  }
  tget(m, keyOrKeyPath, notSetValue = undefined) {
    return m.getIn(this.keyPath(this.transientNSKeyPath, keyOrKeyPath), notSetValue);
  }

  set(m, keyOrKeyPath, value) {
    return m.setIn(this.keyPath(this.baseNSKeyPath, keyOrKeyPath), value);
  }
  tset(m, keyOrKeyPath, value) {
    return m.setIn(this.keyPath(this.transientNSKeyPath, keyOrKeyPath), value);
  }

  remove(m, keyOrKeyPath) {
    return m.removeIn(this.keyPath(this.baseNSKeyPath, keyOrKeyPath));
  }
  tremove(m, keyOrKeyPath) {
    return m.removeIn(this.keyPath(this.transientNSKeyPath, keyOrKeyPath));
  }
}

export function dataFns(baseNSKeyPath) {
  return new StateAccesor(baseNSKeyPath);
}