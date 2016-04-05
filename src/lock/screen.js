import { closeLock } from './actions';
import * as l from './index';

export default class Screen {
  constructor(name) {
    this.name = name;
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

  renderFooterText(lock) {
    return this.t(lock, ["footerText"]);
  }

  transitionName() {
    return "horizontal-fade";
  }

  renderTabs() {
    return false;
  }

  t(lock, keyPath, params) {
    return l.ui.t(lock, [this.name].concat(keyPath), params);
  }
}
