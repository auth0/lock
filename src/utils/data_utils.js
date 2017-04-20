import { Map } from 'immutable';

export function dataFns(baseNSKeyPath) {
  function keyPath(nsKeyPath, keyOrKeyPath) {
    return nsKeyPath.concat(typeof keyOrKeyPath === 'object' ? keyOrKeyPath : [keyOrKeyPath]);
  }

  function getFn(nsKeyPath) {
    return function(m, keyOrKeyPath, notSetValue = undefined) {
      return m.getIn(keyPath(nsKeyPath, keyOrKeyPath), notSetValue);
    };
  }

  function setFn(nsKeyPath) {
    return function(m, keyOrKeyPath, value) {
      return m.setIn(keyPath(nsKeyPath, keyOrKeyPath), value);
    };
  }

  function removeFn(nsKeyPath) {
    return function(m, keyOrKeyPath) {
      return m.removeIn(keyPath(nsKeyPath, keyOrKeyPath));
    };
  }

  const transientNSKeyPath = baseNSKeyPath.concat(['transient']);

  return {
    get: getFn(baseNSKeyPath),
    set: setFn(baseNSKeyPath),
    remove: removeFn(baseNSKeyPath),
    tget: getFn(transientNSKeyPath),
    tset: setFn(transientNSKeyPath),
    tremove: removeFn(transientNSKeyPath),
    reset: function(m) {
      return m.map(x => (Map.isMap(x) ? x.remove('transient') : x));
    },
    init: function(id, m) {
      return new Map({ id: id }).setIn(baseNSKeyPath, m);
    },
    initNS: function(m, ns) {
      return m.setIn(baseNSKeyPath, ns);
    }
  };
}
