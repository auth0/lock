import Base from './index';
import ClassicPlugin from './plugin/classic/plugin.js';
import AskSocialNetwork from './cred/social/ask_social_network';
import AskSocialNetworkOrLogin from './cred/or/ask_social_network_or_login';
import Login from './database/login';
import SignUp from './database/sign_up';
import ResetPassword from './database/reset_password';
import { renderSSOScreens } from './lock/sso/index';
import { getScreen } from './database/index';
import * as l from './lock/index';

Base.plugins.register(ClassicPlugin);

export default class Auth0Lock extends Base {

  constructor(...args) {
    super("classic", ...args);
  }

  render(m) {
    const ssoScreen = renderSSOScreens(m);
    if (ssoScreen) return ssoScreen;

    if (l.getEnabledConnections(m, "database").count() === 0) {
      return new AskSocialNetwork();
    }

    const screen = getScreen(m);
    switch(screen) {
      case "login":
      return l.getEnabledConnections(m, "social").count() > 0
        ? new AskSocialNetworkOrLogin()
        : new Login();

      case "signUp":
      return new SignUp();

      case "resetPassword":
      return new ResetPassword();

      default: // TODO: show a crashed screen.
      throw new Error("unknown screen");
    }
  }

}
