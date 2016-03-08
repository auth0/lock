import Plugin from '../../lock/mode';
import { setInitialPhoneLocation } from '../../cred/phone-number/actions';
import { initSocial } from '../../social/index';
import { initPasswordless } from '../../passwordless/index';
import dict from './dict';
import * as l from '../../lock/index';


export default class PasswordlessPlugin extends Plugin {
  constructor() {
    super("passwordless", dict);
  }

  didInitialize(model, options) {
    model = setInitialPhoneLocation(model, options);
    model = initSocial(model, options);
    model = initPasswordless(model, options);
    this.setModel(model);
  }

  didReceiveClientSettings(m) {
    const anySocialConnection = l.getEnabledConnections(m, "social").count() > 0;
    const anyPasswordlessConnection = l.getEnabledConnections(m, "passwordless").count() > 0;

    if (!anySocialConnection && !anyPasswordlessConnection) {
      // TODO: improve message
      throw new Error("At least one database or passwordless connection needs to be available.");
    }

    // TODO: check for the send option and emit warning if we have a sms
    // connection.
  }

}
