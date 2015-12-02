import { Mode } from '../index';
import { setInitialPhoneLocation } from '../../cred/phone-number/actions';
import AskPhoneNumberVcode from '../../passwordless/ask_phone_number_vcode';
import AskPhoneNumber from '../../passwordless/ask_phone_number';
import { initPasswordless, passwordlessStarted } from '../../passwordless/index';

export default class Sms extends Mode {

  constructor() {
    super("sms");
  }

  willOpen(model, options) {
    model = setInitialPhoneLocation(model, options);
    model = initPasswordless(model, {send: "sms"});
    this.setModel(model);
  }

  render(lock) {
    return passwordlessStarted(lock)
      ? new AskPhoneNumberVcode()
      : new AskPhoneNumber();
  }

}
