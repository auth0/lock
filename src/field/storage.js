import Immutable, { Map } from 'immutable';

function prefixKey(key) {
  return `${key}Cred`;
}

export function store(m, cred, key) {
  try {
    const value = Map().set(cred, m.getIn(["cred", cred])).toJS();
    global.localStorage.setItem(prefixKey(key), global.JSON.stringify(value));
  } catch (e) {
    // silently fail for now...
  }
}

export function restore(m, key) {
  try {
    const item = global.localStorage.getItem(prefixKey(key));
    if (item) {
      const cred = Immutable.fromJS(global.JSON.parse(item));
      return m.set("cred", cred);
    }
  } catch (e) {
    // silently fail for now...
  }

  return m;
}
