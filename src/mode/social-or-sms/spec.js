import { Mode } from '../index';
import { setDefaultLocation } from '../../passwordless/actions';
import AskSocialNetworkOrPhoneNumber from '../../cred/or/ask_social_network_or_phone_number';
import AskPhoneNumberVcode from '../../passwordless/ask_phone_number_vcode';
import { validateSocialOptions } from '../../social/index';
import * as m from '../../passwordless/index';

export default class SocialOrSms extends Mode {

  constructor() {
    super("socialOrSms");
  }

  processOpenOptions(options, lockID) {
    validateSocialOptions(options);
    options.modeOptions.send = "sms";

    const { defaultLocation } = options;

    if (defaultLocation && typeof defaultLocation === "string") {
      setDefaultLocation(lockID, defaultLocation.toUpperCase());
    }

    return options;
  }

  render(lock) {
    return m.passwordlessStarted(lock)
      ? new AskPhoneNumberVcode(lock)
      : new AskSocialNetworkOrPhoneNumber(lock);
  }

}
