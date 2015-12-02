import { Mode } from '../index';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { processSocialOptions } from '../../social/index';
import { initPasswordless, passwordlessStarted } from '../../passwordless/index';

export default class SocialOrEmailCode extends Mode {

  constructor() {
    super("socialOrEmailcode");
  }

  willOpen(model, options) {
    this.setOptions(processSocialOptions(options));
    model = model.set("forceRedirect", !options.popup);
    model = initPasswordless(model, {send: "code"});
    this.setModel(model);
  }

  render(lock) {
    return passwordlessStarted(lock)
      ? new AskEmailVcode()
      : new AskSocialNetworkOrEmail();
  }

}
