import Mode from '../lock/mode';
import AskSocialNetwork from '../cred/social/ask_social_network';
import { initSocial } from './index';

export default class SocialMode extends Mode {

  constructor() {
    super("social");
  }

  willOpen(model, options) {
    model = model.set("forceRedirect", !options.popup);
    model = initSocial(model, options);
    this.setModel(model);
  }

  render() {
    return new AskSocialNetwork();
  }

}
