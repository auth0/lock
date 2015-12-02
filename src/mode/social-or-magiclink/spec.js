import { Mode } from '../index';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { processSocialOptions } from '../../social/index';

export default class SocialOrMagiclink extends Mode {

  constructor() {
    super("socialOrMagiclink");
  }

  willOpen(model, options) {
    this.setOptions(processSocialOptions(options));
    this.setModel(model.set("forceRedirect", !options.popup));
  }

  render() {
    return new AskSocialNetworkOrEmail();
  }

}
