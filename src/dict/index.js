import Immutable, { Map } from 'immutable';

const dicts = Immutable.fromJS({
  emailcode: {
    code: {
      codeInputPlaceholder: "Your code",
      footerText: "",
      headerText: "Pleace check your email ({email})<br />You've received a message from us<br />with your passcode."
    },
    confirmation: {
      success: "Thanks for signing in."
    },
    email: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "Enter your email to sign in or sign up."
    },
    title: "Auth0",
    welcome: "Welcome {name}!"
  },
  magiclink: {
    confirmation: {
      failedLabel: "Failed!",
      retryLabel: "Retry",
      resendLabel: "Resend",
      resendingLabel: "Resending...",
      sentLabel: "Sent!",
      success: "We sent you a link to sign in<br />to {email}."
    },
    email: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "Enter your email to sign in or sign up."
    },
    title: "Auth0",
    welcome: "Welcome {name}!"
  },
  sms: {
    code: {
      codeInputPlaceholder: "Your code",
      footerText: "",
      headerText: "Pleace check your phone ({phoneNumber})<br />You've received a message from us<br />with your passcode."
    },
    confirmation: {
      success: "Thanks for signing in."
    },
    location: {
      locationFilterInputPlaceholder: "Select your country"
    },
    phone: {
      footerText: "",
      headerText: "Please enter your phone number.<br />You will get a code via SMS to login.",
      phoneNumberInputPlaceholder: "your phone number"
    },
    title: "Auth0"
  }
});

class Dict {
  constructor(dict) {
    this.dict = dict;
  }

  get(keyPath, params = {}) {
    return Immutable.fromJS(params).reduce((r, v, k) => {
      return r.replace(`{${k}}`, v);
    }, this.dict.getIn(keyPath, ""));
  }
}

export function build(dictName, overrides) {
  overrides = Immutable.fromJS(overrides);
  return new Dict(dicts.get(dictName, Map()).mergeDeep(overrides));
}
