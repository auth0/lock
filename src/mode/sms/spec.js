import { Mode } from '../index';
import { setInitialPhoneLocation } from '../../cred/phone-number/actions';
import AskPhoneNumberVcode from '../../passwordless/ask_phone_number_vcode';
import AskPhoneNumber from '../../passwordless/ask_phone_number';
import * as m from '../../passwordless/index';

export default class Sms extends Mode {

  constructor() {
    super("sms");
  }

  willOpen(model, options) {
    this.setModel(setInitialPhoneLocation(model, options));
    options.mode.send = "sms";
    this.setOptions(options);
  }

  render(lock) {
    return m.passwordlessStarted(lock)
      ? new AskPhoneNumberVcode()
      : new AskPhoneNumber();
  }

}
