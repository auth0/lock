import { getEntity, read, setEntity, swap } from '../store/index';
import { closeLock, openLock } from '../lock/actions';

export default class Mode {

  constructor(name, dict = {}) {
    this.name = name;
    this.dict = dict;
  }

  execHook(str, id, ...args) {
    if (typeof this[str] != "function") return;
    this.id = id;
    const model = read(getEntity, "lock", id);
    const result = this[str](model, ...args);
    delete this.id;
    return result;
  }

  setModel(m) {
    // TODO: unnecessary swap, should pass along the model
    swap(setEntity, "lock", this.id, m);
  }

}
