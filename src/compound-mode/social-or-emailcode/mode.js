import Mode from '../../lock/mode';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { initSocial } from '../../social/index';
import { initPasswordless, passwordlessStarted } from '../../passwordless/index';
import dict from './dict';
import * as l from '../../lock/index';

export default class SocialOrEmailCodeMode extends Mode {

  constructor() {
    super("socialOrEmailcode", dict);
  }

  didInitialize(model, options) {
    model = model.set("forceRedirect", !options.popup);
    model = initSocial(model, options);
    model = initPasswordless(model, {send: "code"});
    this.setModel(model);
  }

  didReceiveClientSettings(m) {
    // TODO: refactor
    if (l.getEnabledConnections(m, "social").count() === 0) {
      throw new Error("At least one social connection needs to be specified");
    }
  }

  render(lock) {
    return passwordlessStarted(lock)
      ? new AskEmailVcode()
      : new AskSocialNetworkOrEmail();
  }

}
