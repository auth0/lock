import AskEmail from './ask_email';
import AskVcode from './ask_vcode';
import { close, reset, requestPasswordlessEmail, signIn } from './actions';
import * as l from '../lock/index';
import * as m from './index';
import Lock from '../lock/lock';
import React from 'react';

function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(l.id(lock));
}

function askVcodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

function backHandler(lock) {
  reset(l.id(lock), false);
}

export default function render(lock) {
  const children = m.isSendLink(lock) || !m.emailSent(lock) ?
    <AskEmail lock={lock} key="ask-email" /> :
    <AskVcode lock={lock} key="ask-vcode" />;

  const submitHandler = !m.emailSent(lock) ?
    askEmailSubmitHandler : !m.isSendLink(lock) && askVcodeSubmitHandler;

  const props = {
    backHandler: !m.isSendLink(lock) && m.emailSent(lock) ? backHandler : null,
    children: children,
    closeHandler: close,
    lock: lock,
    submitHandler: submitHandler
  };

  return <Lock {...props} />;
}
