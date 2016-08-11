import * as l from './index';
import * as i18n from '../i18n';

export default class Screen {

  constructor(name) {
    this.name = name;
  }

  backHandler() {
    return null;
  }

  escHandler() {
    return null;
  }

  submitButtonLabel(m) {
    return i18n.str(m, ["submitLabel"]);
  }

  submitHandler() {
    return null;
  }

  renderAuxiliaryPane() {
    return null;
  }

  renderTabs() {
    return false;
  }

  renderTerms() {
    return null;
  }

}
