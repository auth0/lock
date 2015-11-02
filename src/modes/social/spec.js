import { Mode } from '../index';
import AskSocialNetwork from '../../cred/social/ask_social_network';
import { validateSocialOptions } from '../../social/index';

export default class Social extends Mode {

  constructor() {
    super("social");
  }

  processOpenOptions(options) {
    validateSocialOptions(options);
    return options;
  }

  render(lock) {
    return new AskSocialNetwork(lock);
  }

}
