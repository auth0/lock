import AskPhoneNumber from './ask_phone_number';
import AskEmail from './ask_email';
import AskVcode from './ask_vcode';
import SignedIn from './signed_in';
import { close, reset, requestPasswordlessEmail, sendSMS, signIn } from './actions';
import * as c from '../cred/index';
import * as l from '../lock/index';
import * as m from './index';
import Lock from '../lock/lock';
import React from 'react';

function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(l.id(lock));
}

function askPhoneNumberSubmitHandler(lock) {
  sendSMS(l.id(lock));
}

function askVcodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

function backHandler(lock) {
  reset(l.id(lock), false);
}

export default function render(lock) {
  // NOTE: we can use generics handlers for `backHandler`, `closeHandler` and
  // `submitHandler` that dispatch to the right function given the value of
  // `lock`. But, in order to do that an extra function `allowBack` needs to be
  // provided (right now passing a `backHandler` means we allow to go back).
  function props() {
    switch(m.send(lock)) {
    case "code":
      return {
        backHandler: m.passwordlessStarted(lock) && !m.signedIn(lock) && backHandler,
        closeHandler: close,
        children: m.signedIn(lock) ?
          <SignedIn lock={lock} key="signed-in" /> :
          m.passwordlessStarted(lock) ?
            <AskVcode className="auth0-lock-ask-email-vcode" cred={`email (${c.email(lock)})`} lock={lock} key="ask-vcode" /> :
            <AskEmail lock={lock} key="ask-email" />,
        lock: lock,
        submitHandler: m.passwordlessStarted(lock) ? askVcodeSubmitHandler : askEmailSubmitHandler
      };
    case "link":
      return {
        closeHandler: close,
        children: <AskEmail lock={lock} key="ask-email" />,
        lock: lock,
        submitHandler: !m.passwordlessStarted(lock) && askEmailSubmitHandler
      };
    case "sms":
      return {
        backHandler: m.passwordlessStarted(lock) && !m.signedIn(lock) && backHandler,
        closeHandler: close,
        children: m.signedIn(lock) ?
          <SignedIn lock={lock} key="signed-in" /> :
          m.passwordlessStarted(lock) ?
            <AskVcode className="auth0-lock-enter-code" cred={`phone (${c.fullHumanPhoneNumber(lock)})`} lock={lock} key="ask-vcode" /> :
            <AskPhoneNumber lock={lock} key="ask-phone-number" />,
        disallowClose: m.selectingLocation(lock),
        lock: lock,
        submitHandler: m.passwordlessStarted(lock) ? askVcodeSubmitHandler : askPhoneNumberSubmitHandler
      };
    default:
      throw new Error(`Unable to render, unknown send property value (${m.send(lock)}).`);
    }
  }

  return <Lock {...props()} />;
}
