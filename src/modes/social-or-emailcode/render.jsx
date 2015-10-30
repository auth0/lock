import AskEmailVcode from '../../passwordless/ask_email_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import * as l from '../../lock/index';
import * as m from '../../passwordless/index';

export default function render(lock) {
  return m.passwordlessStarted(lock)
    ? new AskEmailVcode(lock, l.signedIn(lock))
    : new AskSocialNetworkOrEmail(lock, false);
}
