import Mode from '../../lock/mode';
import { setInitialPhoneLocation } from '../../cred/phone-number/actions';
import AskPhoneNumberVcode from '../ask_phone_number_vcode';
import AskPhoneNumber from '../ask_phone_number';
import { initPasswordless, passwordlessStarted } from '../index';

export default class SmsMode extends Mode {

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
