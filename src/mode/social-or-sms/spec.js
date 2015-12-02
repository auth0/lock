import { Mode } from '../index';
import { setInitialPhoneLocation } from '../../cred/phone-number/actions';
import AskSocialNetworkOrPhoneNumber from '../../cred/or/ask_social_network_or_phone_number';
import AskPhoneNumberVcode from '../../passwordless/ask_phone_number_vcode';
import { processSocialOptions } from '../../social/index';
import { initPasswordless, passwordlessStarted } from '../../passwordless/index';

export default class SocialOrSms extends Mode {

  constructor() {
    super("socialOrSms");
  }

  willOpen(model, options) {
    this.setOptions(processSocialOptions(options));
    model = setInitialPhoneLocation(model, options);
    model = model.set("forceRedirect", !options.popup);
    model = initPasswordless(model, {send: "sms"});
    this.setModel(model);
  }

  render(lock) {
    return passwordlessStarted(lock)
      ? new AskPhoneNumberVcode()
      : new AskSocialNetworkOrPhoneNumber();
  }

}
