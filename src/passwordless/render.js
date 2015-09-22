import AskPhoneNumber from './ask_phone_number';
import AskEmail from './ask_email';
import AskVcode from './ask_vcode';
import SignedIn from './signed_in';
import { cancelSelectPhoneLocation, close, requestPasswordlessEmail, sendSMS, signIn } from './actions';
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

export default function render(lock) {
  // NOTE: we can use generics handlers for closeHandler` and `submitHandler`
  // that dispatch to the right function given the value of `lock`.
  function props() {
    switch(m.send(lock)) {
    case "code":
      return {
        closeHandler: close,
        children: m.passwordlessStarted(lock) ?
          <AskVcode className="auth0-lock-ask-email-vcode" headerText={l.ui.t(lock, ["code", "headerText"], {email: c.email(lock)})} lock={lock} key="ask-vcode" /> :
          <AskEmail lock={lock} key="ask-email" />,
        escHandler: close,
        isDone: m.signedIn(lock),
        lock: lock,
        submitHandler: m.passwordlessStarted(lock) ? askVcodeSubmitHandler : askEmailSubmitHandler
      };
    case "link":
      return {
        closeHandler: close,
        children: <AskEmail lock={lock} key="ask-email" />,
        escHandler: close,
        isDone: m.passwordlessStarted(lock),
        lock: lock,
        submitHandler: !m.passwordlessStarted(lock) && askEmailSubmitHandler
      };
    case "sms":
      return {
        closeHandler: close,
        children: m.passwordlessStarted(lock) ?
          <AskVcode className="auth0-lock-enter-code" headerText={l.ui.t(lock, ["code", "headerText"], {phoneNumber: c.fullHumanPhoneNumber(lock)})} lock={lock} key="ask-vcode" /> :
          <AskPhoneNumber lock={lock} key="ask-phone-number" />,
        disallowClose: m.selectingLocation(lock),
        escHandler: function() {
          m.selectingLocation(lock) ?
            cancelSelectPhoneLocation(l.id(lock)) : close(l.id(lock));
        },
        isDone: m.signedIn(lock),
        lock: lock,
        submitHandler: m.passwordlessStarted(lock) ? askVcodeSubmitHandler : askPhoneNumberSubmitHandler
      };
    default:
      throw new Error(`Unable to render, unknown send property value (${m.send(lock)}).`);
    }
  }

  return <Lock {...props()} />;
}
