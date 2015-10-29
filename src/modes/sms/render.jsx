import AskVcode from '../../passwordless/ask_vcode';
import AskPhoneNumber from '../../passwordless/ask_phone_number';
import * as l from '../../lock/index';
import * as m from '../../passwordless/index';

export default function render(lock) {
  return m.passwordlessStarted(lock)
    ? new AskVcode(lock, l.signedIn(lock))
    : new AskPhoneNumber(lock, false);
}
