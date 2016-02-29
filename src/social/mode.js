import Mode from '../lock/mode';
import AskSocialNetwork from '../cred/social/ask_social_network';
import { initSocial } from './index';
import { renderSSOScreens } from '../lock/sso/index';
import dict from './dict';
import * as l from '../lock/index';

export default class SocialMode extends Mode {

  constructor() {
    super("social", dict);
  }

  didInitialize(model, options) {
    model = initSocial(model, options);
    this.setModel(model);
  }

  didReceiveClientSettings(m) {
    // TODO: refactor
    if (l.getEnabledConnections(m, "social").count() === 0) {
      throw new Error("At least one social connection needs to be specified");
    }
  }

  render(lock) {
    return renderSSOScreens(lock) || new AskSocialNetwork();
  }

}
