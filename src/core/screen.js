import * as l from './index';

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
