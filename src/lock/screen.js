import { closeLock } from './actions';
import * as l from './index';

export default class Screen {
  constructor(name, lock, isDone) {
    this.name = name;
    // NOTE: lock is only used for translations
    this.lock = lock;
    // TODO: we shouldn't handle this here
    this._isDone = isDone;
  }

  backHandler() {
    return null;
  }

  closeHandler() {
    return closeLock;
  }

  escHandler() {
    return null;
  }

  submitHandler() {
    return null;
  }

  renderAuxiliaryPane() {
    return null;
  }

  renderFooterText() {
    return this.t(["footerText"]);
  }

  renderHeaderText() {
    return this.t(["headerText"]);
  }

  showSubmitButton() {
    return true;
  }

  isDone() {
    return this._isDone;
  }

  t(keyPath, params) {
    return l.ui.t(this.lock, [this.name].concat(keyPath), params);
  }
}
