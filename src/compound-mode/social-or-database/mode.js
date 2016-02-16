import Mode from '../../lock/mode';
import { initSocial } from '../../social/index';
import { getScreen, initDatabase } from '../../database/index';
import AskSocialNetworkOrLogin from '../../cred/or/ask_social_network_or_login';
import ResetPassword from '../../database/reset_password';
import SignUp from '../../database/sign_up';
import dict from './dict';

export default class SocialOrDatabaseMode extends Mode {

  constructor() {
    super("socialOrDatabase", dict);
  }

  didInitialize(model, options) {
    model = model.set("forceRedirect", !options.popup);
    model = initSocial(model, options);
    model = initDatabase(model, options);
    this.setModel(model);
  }

  render(lock) {
    const screen = getScreen(lock);
    switch(screen) {
      case "login":
      return new AskSocialNetworkOrLogin();

      case "signUp":
      return new SignUp();

      case "resetPassword":
      return new ResetPassword();

      default: // TODO: show a crashed screen.
      throw new Error("unknown screen");
    }
  }

}
