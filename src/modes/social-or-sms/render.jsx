import AskSocialNetworkOrPhoneNumber from '../../cred/or/ask_social_network_or_phone_number';
import AskVcode from '../../passwordless/ask_vcode';
import * as l from '../../lock/index';
import * as m from '../../passwordless/index';

export default function render(lock) {
  return m.passwordlessStarted(lock)
    ? new AskVcode(lock, l.signedIn(lock))
    : new AskSocialNetworkOrPhoneNumber(lock, l.signedIn(lock));
}
