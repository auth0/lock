import AskSocialNetworkOrPhoneNumber from '../../cred/or/ask_social_network_or_phone_number';
import AskPhoneNumberVcode from '../../passwordless/ask_phone_number_vcode';
import * as l from '../../lock/index';
import * as m from '../../passwordless/index';

export default function render(lock) {
  return m.passwordlessStarted(lock)
    ? new AskPhoneNumberVcode(lock, l.signedIn(lock))
    : new AskSocialNetworkOrPhoneNumber(lock, l.signedIn(lock));
}
