import React from 'react';
import Lock from '../lock/lock';
import AskSocialNetworkOrPhoneNumber from './ask_social_network_or_phone_number';
import AskVcode from '../cred/vcode/ask_vcode';
import { close } from './actions';
import * as l from '../lock/index';
import * as c from '../cred/index';
import * as mp from '../passwordless/index';
import { cancelSelectPhoneLocation, requestPasswordlessEmail, sendSMS, signIn } from '../passwordless/actions';

function askVcodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

function askPhoneNumberSubmitHandler(lock) {
  sendSMS(l.id(lock));
}

export default function render(lock) {
  const props = {
    children: mp.passwordlessStarted(lock) ?
      <AskVcode destination={c.email(lock)} lock={lock} key="ask-vcode" /> :
      <AskSocialNetworkOrPhoneNumber key="social-network-or-phone-bumber" lock={lock} />,
    closeHandler: close,
    escHandler: function() {
      mp.selectingLocation(lock) ?
        cancelSelectPhoneLocation(l.id(lock)) : close(l.id(lock));
    },
    isDone: l.signedIn(lock),
    lock: lock,
    submitHandler: mp.passwordlessStarted(lock) ? askVcodeSubmitHandler : askPhoneNumberSubmitHandler
  };

  return <Lock {...props} />;
}
