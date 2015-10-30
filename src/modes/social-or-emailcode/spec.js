import { Mode } from '../index';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import * as m from '../../passwordless/index';

export default class SocialOrEmailCode extends Mode {

  constructor() {
    super("socialOrEmailcode");
  }

  processOpenOptions(options) {
    options.modeOptions.send = "code";

    const { connections } = options;
    if (!Array.isArray(connections) || connections.length === 0) {
      throw new Error("The `connections` option array needs to be provided with at least one connection.");
    }

    return options;
  }

  render(lock) {
    return m.passwordlessStarted(lock)
      ? new AskEmailVcode(lock)
      : new AskSocialNetworkOrEmail(lock);
  }

}
