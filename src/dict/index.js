import Immutable from 'immutable';

const dict = Immutable.fromJS({
  passwordless: {
    email: {
      headerText: "Enter your email to sign in or sign up.",
      magicLinkSent: "We sent you a link to sign in<br />to {email}.",
      footerText: ""
    },
    sms: {
      headerText: "Please enter your phone number.<br />You will get a code via SMS to login.",
      footerText: ""
    }
  }
});

class Dict {
  constructor(x) {
    this.dict = x;
  }

  get(keyPath, params = {}) {
    return Immutable.fromJS(params).reduce((r, v, k) => {
      return r.replace(`{${k}}`, v);
    }, this.dict.getIn(keyPath, ""));
  }
}

export function build(overrides) {
  overrides = Immutable.fromJS(overrides);
  return new Dict(dict.mergeDeep(overrides));
}
