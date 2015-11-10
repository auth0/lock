import { Mode } from '../index';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { validateSocialOptions } from '../../social/index';
import * as m from '../../passwordless/index';

export default class SocialOrEmailCode extends Mode {

  constructor() {
    super("socialOrEmailcode");
  }

  willOpen(model, options) {
    validateSocialOptions(options);
    options.mode.send = "code";
    this.setOptions(options);
  }

  render(lock) {
    return m.passwordlessStarted(lock)
      ? new AskEmailVcode()
      : new AskSocialNetworkOrEmail();
  }

}
