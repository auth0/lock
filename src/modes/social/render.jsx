import AskSocialNetwork from '../../cred/social/ask_social_network';
import * as l from '../../lock/index';

export default function render(lock) {
  return new AskSocialNetwork(lock, l.signedIn(lock));
}
