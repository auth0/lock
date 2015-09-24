import Immutable, { Map } from 'immutable';
import dicts from './dicts';

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

export function build(dictName, overrides) {
  overrides = Immutable.fromJS(overrides);
  const dict = Immutable.fromJS(dicts).get(dictName, Map()).set("error", Immutable.fromJS(dicts.error));
  return new Dict(dict.mergeDeep(overrides));
}
