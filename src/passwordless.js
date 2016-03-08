import Base from './index';
import PasswordlessPlugin from './plugin/passwordless/plugin.js';

import AskSocialNetwork from './cred/social/ask_social_network';
import AskEmail from './passwordless/ask_email';
import AskEmailVcode from './passwordless/ask_email_vcode';
import AskSocialNetworkOrEmail from './cred/or/ask_social_network_or_email';
import AskSocialNetworkOrPhoneNumber from './cred/or/ask_social_network_or_phone_number';
import AskPhoneNumber from './passwordless/ask_phone_number';
import AskPhoneNumberVcode from './passwordless/ask_phone_number_vcode';
import MagiclinkScreen from './passwordless/magiclink';
import { renderSSOScreens } from './lock/sso/index';
import { isEmail, isSendLink, passwordlessStarted } from './passwordless/index';
import * as l from './lock/index';

Base.plugins.register(PasswordlessPlugin);

export default class Auth0LockPasswordless extends Base {

  constructor(...args) {
    super("passwordless", ...args);
  }

  render(m) {
    const ssoScreen = renderSSOScreens(m);
    if (ssoScreen) return ssoScreen;

    const anyPasswordlessConnection =
      l.getEnabledConnections(m, "passwordless").count() > 0;
    const anySocialConnection =
      l.getEnabledConnections(m, "social").count() > 0;

    // social flow
    if (!anyPasswordlessConnection) {
      return new AskSocialNetwork();
    }

    // social or magiclink flow, or magiclink flow
    // a link can be send only in an email
    if (isSendLink(m)) {
      return anySocialConnection
        ? new AskSocialNetworkOrEmail()
        : new MagiclinkScreen();
    }

    // social or emailcode flow, or emailcode flow
    if (isEmail(m)) {
      return passwordlessStarted(m)
        ? new AskEmailVcode()
        : (anySocialConnection ? new AskSocialNetworkOrEmail() : new AskEmail());
    }

    // social or sms flow, or sms flow
    return passwordlessStarted(m)
      ? new AskPhoneNumberVcode()
      : (anySocialConnection ? new AskSocialNetworkOrPhoneNumber() : new AskPhoneNumber());

    // TODO: show a crashed screen.
    throw new Error("unknown screen");
  }

}
