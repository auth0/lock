import { Mode } from '../index';
import { setInitialPhoneLocation } from '../../cred/phone-number/actions';
import AskPhoneNumberVcode from '../../passwordless/ask_phone_number_vcode';
import AskPhoneNumber from '../../passwordless/ask_phone_number';
import * as m from '../../passwordless/index';

export default class Sms extends Mode {

  constructor() {
    super("sms");
  }

  processOpenOptions(options, lockID) {
    setInitialPhoneLocation(lockID, options);
    options.mode.send = "sms";
    return options;
  }

  render(lock) {
    return m.passwordlessStarted(lock)
      ? new AskPhoneNumberVcode(lock)
      : new AskPhoneNumber(lock);
  }

}
