import { Mode } from '../index';
import { setDefaultLocation } from '../../cred/phone-number/actions';
import AskPhoneNumberVcode from '../../passwordless/ask_phone_number_vcode';
import AskPhoneNumber from '../../passwordless/ask_phone_number';
import * as m from '../../passwordless/index';

export default class Sms extends Mode {

  constructor() {
    super("sms");
  }

  processOpenOptions(options, lockID) {
    options.mode.send = "sms";
    const { defaultLocation } = options;
    if (defaultLocation && typeof defaultLocation === "string") {
      setDefaultLocation(lockID, defaultLocation.toUpperCase());
    }

    return options;
  }

  render(lock) {
    return m.passwordlessStarted(lock)
      ? new AskPhoneNumberVcode(lock)
      : new AskPhoneNumber(lock);
  }

}
