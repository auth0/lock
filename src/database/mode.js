import Mode from '../lock/mode';
import Login from './login';
import ResetPassword from './reset_password';
import SignUp from './sign_up';
import { renderSSOScreens } from '../lock/sso/index';
import { getScreen, initDatabase } from './index';
import dict from './dict';
import * as l from '../lock/index';

export default class DatabaseMode extends Mode {

  constructor() {
    super("database", dict);
  }

  didInitialize(model, options) {
    this.setModel(initDatabase(model, options));
  }

  didReceiveClientSettings(m) {
    // TODO: refactor
    if (l.getEnabledConnections(m, "database").count() === 0) {
      throw new Error("At least one database connection needs to be specified");
    }
  }

  render(lock) {
    const ssoScreen = renderSSOScreens(lock);
    if (ssoScreen) return ssoScreen;

    const screen = getScreen(lock);
    switch(screen) {
      case "login":
      return new Login();

      case "signUp":
      return new SignUp();

      case "resetPassword":
      return new ResetPassword();

      default: // TODO: show a crashed screen.
      throw new Error("unknown screen");
    }
  }

}
