import { swap, updateEntity } from '../store/index';
import ErrorScreen from '../core/error_screen';
import LoadingScreen from '../core/loading_screen';
import SocialOrEmailLoginScreen from './passwordless/social_or_email_login_screen';
import SocialOrPhoneNumberLoginScreen from './passwordless/social_or_phone_number_login_screen';
import VcodeScreen from '../connection/passwordless/ask_vcode';
import {
  initPasswordless,
  isEmail,
  isSendLink,
  passwordlessStarted
} from '../connection/passwordless/index';
import { initSocial } from '../connection/social/index';
import { isDone } from '../sync';
import * as l from '../core/index';

// import Base from './index';
// import MagiclinkScreen from './connection/passwordless/magiclink';
// import { renderSSOScreens } from './core/sso/index';
// import { isEmail } from './connection/passwordless/index';
//
//
class Passwordless {

  didInitialize(m, opts) {
    m = initSocial(m, opts);
    m = initPasswordless(m, opts);

    return m;
  }

  didReceiveClientSettings(m) {
    const anySocialConnection = l.hasSomeConnections(m, "social");
    const anyPasswordlessConnection = l.hasSomeConnections(m, "passwordless");

    if (!anySocialConnection && !anyPasswordlessConnection) {
      const error = new Error("At least one email, sms or social connection needs to be available.");
      error.code = "no_connection";
      m = l.stop(m, error);
    }

    return m;
  }

  render(m) {
    // TODO: remove the detail about the loading pane being pinned,
    // sticky screens should be handled at the box module.
    if (!isDone(m) || m.get("isLoadingPanePinned")) {
      return new LoadingScreen();
    }

    if (l.hasStopped(m)) {
      return new ErrorScreen();
    }

    if (isEmail(m)) {
      return isSendLink(m) || !passwordlessStarted(m)
        ? new SocialOrEmailLoginScreen()
        : new VcodeScreen();
    } else {
      return passwordlessStarted(m)
        ? new VcodeScreen()
        : new SocialOrPhoneNumberLoginScreen();
    }

    // const ssoScreen = renderSSOScreens(m);
    // if (ssoScreen) return ssoScreen;

    // const anySocialConnection = l.hasSomeConnections(m, "social");
    // const anyPasswordlessConnection = l.hasSomeConnections(m, "passwordless");

    // // social flow
    // if (!anyPasswordlessConnection) {
    //   return new AskSocialNetwork();
    // }

    // // social or magiclink flow, or magiclink flow
    // // a link can be send only in an email
    // if (isSendLink(m)) {
    //   return anySocialConnection
    //     ? new AskSocialNetworkOrEmail()
    //     : new MagiclinkScreen();
    // }

    // // social or emailcode flow, or emailcode flow
    // if (isEmail(m)) {
    //   return passwordlessStarted(m)
    //     ? new AskEmailVcode()
    //     : (anySocialConnection ? new AskSocialNetworkOrEmail() : new AskEmail());
    // }

    // // social or sms flow, or sms flow
    // return passwordlessStarted(m)
    //   ? new AskPhoneNumberVcode()
    //   : (anySocialConnection ? new AskSocialNetworkOrPhoneNumber() : new AskPhoneNumber());

    // // TODO: show a crashed screen.
    // throw new Error("unknown screen");
    setTimeout(() => {
      const stopError = new Error("Internal error");
      stopError.code = "internal_error";
      stopError.description = "Couldn't find a screen to render";
      swap(updateEntity, "lock", l.id(m), l.stop, stopError);
    }, 0);

    return new ErrorScreen();
  }
}

export default new Passwordless();
//
// const dict = {
//   email: {
//     emailInputPlaceholder: "yours@example.com",
//     headerText: "Enter your email to sign in<br>or create an account",
//     terms: ""
//   },
//   emailCode: {
//     codeInputPlaceholder: "Your code",
//     headerText: "An email with the code has been sent to {email}.",
//     resendLabel: "Did not get the code?"
//   },
//   emailSent: {
//     failedLabel: "Failed!",
//     retryLabel: "Retry",
//     resendLabel: "Resend",
//     resendingLabel: "Resending...",
//     sentLabel: "Sent!",
//     success: "We sent you a link to sign in<br />to {email}."
//   },
//   lastLogin: {
//     headerText: "Last time you logged in with",
//     skipLastLoginLabel: "Not your account?"
//   },
//   location: {
//     locationFilterInputPlaceholder: "Select your country"
//   },
//   network: {
//     headerText: "",
//     loginWith: "Login with {idp}",
//     smallSocialButtonsHeader: "Login with",
//     terms: ""
//   },
//   networkOrEmail: {
//     emailInputPlaceholder: "yours@example.com",
//     headerText: "",
//     loginWith: "Login with {idp}",
//     separatorText: "Otherwise, enter your email to sign in<br>or create an account",
//     smallSocialButtonsHeader: "Login with",
//     terms: ""
//   },
//   networkOrPhone: {
//     headerText: "",
//     loginWith: "Login with {idp}",
//     phoneNumberInputPlaceholder: "your phone number",
//     separatorText: "Otherwise, enter your phone to sign in<br>or create an account",
//     smallSocialButtonsHeader: "Login with",
//     terms: ""
//   },
//   phone: {
//     headerText: "Enter your phone to sign in<br>or create an account",
//     phoneNumberInputPlaceholder: "your phone number",
//     terms: ""
//   },
//   signedIn: {
//     success: "Thanks for logging in."
//   },
//   smsCode: { // social or sms
//     codeInputPlaceholder: "Your code",
//     headerText: "An SMS with the code has been sent to {phoneNumber}.",
//     resendLabel: "Did not get the code?"
//   },
//   error: {
//     passwordless: {
//       "bad.tenant": "We're sorry, we can't send you the {medium} because there's a configuration problem",
//       "bad.client_id": "We're sorry, we can't send you the {medium} because there's a configuration problem",
//       "bad.connection": "We're sorry, we can't send you the {medium} because there's a configuration problem",
//       "bad.send": "We're sorry, we can't send you the {medium} because there's an internal error",
//       "bad.authParams": "We're sorry, we can't send you the {medium} because there's an internal error",
//       "bad.request": "We're sorry, we can't send you the {medium} because there's an internal error",
//       "bad.email": "The email is invalid",
//       "bad.phone_number": "The phone number is invalid",
//       "lock.request": "We're sorry, something went wrong when sending the {medium}",
//       "sms_provider_error": "We're sorry, something went wrong when sending the SMS",
//       "sms_provider_error.bad_phone_number": "The number {phoneNumber} is not a valid phone number"
//     },
//     signIn: { // TODO: move this stuff to login, and namespace by connection
//       "invalid_user_password": "Wrong {field} or verification code",
//       "lock.popup_closed": "Popup window closed. Try again.",
//       "lock.request": "We're sorry, something went wrong when attempting to sign in",
//       "lock.unauthorized": "Permissions were not granted. Try again."
//     },
//   }
// };
