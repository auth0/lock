import { Mode } from '../index';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { processSocialOptions } from '../../social/index';
import * as m from '../../passwordless/index';

export default class SocialOrEmailCode extends Mode {

  constructor() {
    super("socialOrEmailcode");
  }

  willOpen(model, options) {
    options = processSocialOptions(options);
    options.mode.send = "code";
    this.setOptions(options);
    this.setModel(model.set("forceRedirect", !options.popup));
  }

  render(lock) {
    return m.passwordlessStarted(lock)
      ? new AskEmailVcode()
      : new AskSocialNetworkOrEmail();
  }

}
