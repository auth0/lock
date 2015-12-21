import Immutable, { Map } from 'immutable';
import baseDict from './base_dict';

class Dict {
  constructor(dict) {
    this.dict = dict;
  }

  get(keyPath, params = {}) {
    return Immutable.fromJS(params).reduce((r, v, k) => {
      return r.replace(`{${k}}`, v);
    }, this.dict.getIn(keyPath, ""));
  }
}

let dicts = Map();

export function registerDict(mode, dict) {
  dicts = dicts.set(
    mode,
    Immutable.fromJS(baseDict).mergeDeep(Immutable.fromJS(dict))
  );
}

export function buildDict(mode, overrides) {
  const dict = dicts.get(mode, Map()).mergeDeep(Immutable.fromJS(overrides));
  return new Dict(dict);
}
