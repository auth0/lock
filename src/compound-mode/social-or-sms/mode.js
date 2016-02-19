import Mode from '../../lock/mode';
import { setInitialPhoneLocation } from '../../cred/phone-number/actions';
import AskSocialNetworkOrPhoneNumber from '../../cred/or/ask_social_network_or_phone_number';
import AskPhoneNumberVcode from '../../passwordless/ask_phone_number_vcode';
import { initSocial } from '../../social/index';
import { initPasswordless, passwordlessStarted } from '../../passwordless/index';
import dict from './dict';
import * as l from '../../lock/index';

export default class SocialOrSmsMode extends Mode {

  constructor() {
    super("socialOrSms", dict);
  }

  didInitialize(model, options) {
    model = setInitialPhoneLocation(model, options);
    model = model.set("forceRedirect", !options.popup);
    model = initSocial(model, options);
    model = initPasswordless(model, {send: "sms"});
    this.setModel(model);
  }

  didReceiveClientSettings(m) {
    // TODO: refactor
    if (l.getEnabledConnections(m, "social").count() === 0) {
      throw new Error("At least one social connection needs to be specified");
    }
  }

  render(lock) {
    return passwordlessStarted(lock)
      ? new AskPhoneNumberVcode()
      : new AskSocialNetworkOrPhoneNumber();
  }

}
