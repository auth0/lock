import { Mode } from '../index';
import AskSocialNetwork from '../../cred/social/ask_social_network';
import { initSocial } from '../../social/index';

export default class Social extends Mode {

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
