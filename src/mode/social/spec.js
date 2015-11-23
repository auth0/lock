import { Mode } from '../index';
import AskSocialNetwork from '../../cred/social/ask_social_network';
import { processSocialOptions } from '../../social/index';

export default class Social extends Mode {

  constructor() {
    super("social");
  }

  willOpen(model, options) {
    this.setOptions(processSocialOptions(options));
    this.setModel(model.set("forceRedirect", !options.popup));
  }

  render() {
    return new AskSocialNetwork();
  }

}
