import { Mode } from '../index';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { validateSocialOptions } from '../../social/index';

export default class SocialOrMagiclink extends Mode {

  constructor() {
    super("socialOrMagiclink");
  }

  processOpenOptions(options) {
    validateSocialOptions(options);
    return options;
  }

  render(lock) {
    return new AskSocialNetworkOrEmail(lock);
  }

}
