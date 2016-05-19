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

  // TODO: this is a bad name because it's meant to be used in groups
  raw(keyPath) {
    return this.dict.getIn(keyPath, Map()).toJS();
  }
}

export function buildDict(mode, overrides) {
  const dict = Immutable.fromJS(baseDict).mergeDeep(Immutable.fromJS(overrides));
  return new Dict(dict);
}
