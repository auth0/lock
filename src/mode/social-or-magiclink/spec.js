import { Mode } from '../index';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { validateSocialOptions } from '../../social/index';

export default class SocialOrMagiclink extends Mode {

  constructor() {
    super("socialOrMagiclink");
  }

  willOpen(model, options) {
    validateSocialOptions(options);
    options.mode.send = "link";
    this.setOptions(options);
  }

  render(lock) {
    return new AskSocialNetworkOrEmail(lock);
  }

}
