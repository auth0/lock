import * as l from './index';
import * as i18n from '../i18n';
import { getInitialScreen, hasScreen } from '../connection/database/index';

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
    return i18n.str(m, ['submitLabel']);
  }

  isFirstScreen(m) {
    const firstScreenName = getInitialScreen(m);
    const currentScreenNameParts = this.name.split('.');
    const currentScreenName = currentScreenNameParts[1] || currentScreenNameParts[0];

    // if signup and login is enabled, both are the first screen in this scenario and
    // neither of them should show the title
    if (currentScreenName === 'signUp' && hasScreen(m, 'login')) {
      return true;
    }

    const initialScreens = [firstScreenName, 'loading', 'lastLogin'];

    return initialScreens.indexOf(currentScreenName) !== -1;
  }

  getTitle(m) {
    if (this.isFirstScreen(m)) {
      return i18n.str(m, 'title');
    }

    return this.getScreenTitle(m);
  }

  getScreenTitle(m) {
    return i18n.str(m, 'title');
  }

  submitHandler() {
    return null;
  }

  isSubmitDisabled(m) {
    return false;
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
