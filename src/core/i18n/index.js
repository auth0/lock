import Immutable, { Map } from 'immutable';
import baseDict from './base_dict';

export default class Dict {
  constructor(overrides) {
    this.dict = Immutable.fromJS(baseDict).mergeDeep(Immutable.fromJS(overrides));
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
