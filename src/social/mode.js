import Mode from '../lock/mode';
import AskSocialNetwork from '../cred/social/ask_social_network';
import { initSocial } from './index';
import { renderSSOScreens } from '../lock/sso/index';
import dict from './dict';

export default class SocialMode extends Mode {

  constructor() {
    super("social", dict);
  }

  willOpen(model, options) {
    model = model.set("forceRedirect", !options.popup);
    model = initSocial(model, options);
    this.setModel(model);
  }

  render(lock) {
    return renderSSOScreens(lock) || new AskSocialNetwork();
  }

}
