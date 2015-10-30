import AskPhoneNumberVcode from '../../passwordless/ask_phone_number_vcode';
import AskPhoneNumber from '../../passwordless/ask_phone_number';
import * as m from '../../passwordless/index';

export default function render(lock) {
  return m.passwordlessStarted(lock)
    ? new AskPhoneNumberVcode(lock)
    : new AskPhoneNumber(lock);
}
