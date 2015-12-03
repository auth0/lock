import { Mode } from '../index';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { processSocialOptions } from '../../social/index';

export default class SocialOrMagiclink extends Mode {

  constructor() {
    super("socialOrMagiclink");
  }

  willOpen(model, options) {
    options = processSocialOptions(options);
    options.mode.send = "link";
    this.setOptions(options);
    this.setModel(model.set("forceRedirect", !options.popup));
  }

  render() {
    return new AskSocialNetworkOrEmail();
  }

}
