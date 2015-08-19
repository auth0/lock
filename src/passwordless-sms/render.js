import AskPhoneNumber from './ask_phone_number';
import AskVcode from './ask_vcode';
import { close, reset, sendSMS, signIn } from './actions';
import * as l from '../lock/index';
import * as m from './index';
import Lock from '../lock/lock';
import React from 'react';

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
  const children = m.smsSent(lock) ?
    <AskVcode lock={lock} key="ask-vcode" /> :
    <AskPhoneNumber lock={lock} key="ask-phone-number" />;

  const props = {
    backHandler: m.smsSent(lock) ? backHandler : undefined,
    closeHandler: close,
    children: children,
    disallowClose: m.selectingLocation(lock),
    lock: lock,
    submitHandler: m.smsSent(lock) ? askVcodeSubmitHandler : askPhoneNumberSubmitHandler
  };

  return <Lock {...props} />;
}
