import Mode from '../../lock/mode';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { initSocial } from '../../social/index';
import { initPasswordless, passwordlessStarted } from '../../passwordless/index';
import dict from './dict';

export default class SocialOrEmailCodeMode extends Mode {

  constructor() {
    super("socialOrEmailcode", dict);
  }

  willOpen(model, options) {
    model = model.set("forceRedirect", !options.popup);
    model = initSocial(model, options);
    model = initPasswordless(model, {send: "code"});
    this.setModel(model);
  }

  render(lock) {
    return passwordlessStarted(lock)
      ? new AskEmailVcode()
      : new AskSocialNetworkOrEmail();
  }

}
