import { Mode } from '../index';
import { setInitialPhoneLocation } from '../../cred/phone-number/actions';
import AskSocialNetworkOrPhoneNumber from '../../cred/or/ask_social_network_or_phone_number';
import AskPhoneNumberVcode from '../../passwordless/ask_phone_number_vcode';
import { processSocialOptions } from '../../social/index';
import * as m from '../../passwordless/index';

export default class SocialOrSms extends Mode {

  constructor() {
    super("socialOrSms");
  }

  willOpen(model, options) {
    options = processSocialOptions(options);
    model = setInitialPhoneLocation(model, options);
    this.setModel(model.set("forceRedirect", !options.popup));
    options.mode.send = "sms";
    this.setOptions(options);
  }

  render(lock) {
    return m.passwordlessStarted(lock)
      ? new AskPhoneNumberVcode()
      : new AskSocialNetworkOrPhoneNumber();
  }

}
