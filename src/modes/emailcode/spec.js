import React from 'react';
import Lock from '../../lock/lock';
import AskEmail from '../../cred/email/ask_email';
import AskVcode from '../../cred/vcode/ask_vcode';
import { openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import * as c from '../../cred/index';

// TODO: remove passwordless dep
import * as m from '../../passwordless/index';
import {
  close,
  requestPasswordlessEmail,
  signIn
} from '../../passwordless/actions';

const NAME = "emailcode";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  options.modeOptions = {send: "code", dictName: NAME, storageKey: NAME};
  return openLock(id, NAME, options);
}

function render(lock) {
  const props = {
    closeHandler: close,
    children: m.passwordlessStarted(lock) ?
      <AskVcode destination={c.email(lock)} lock={lock} key="ask-vcode" /> :
      <AskEmail lock={lock} key="ask-email" />,
    escHandler: close,
    isDone: l.signedIn(lock),
    lock: lock,
    submitHandler: m.passwordlessStarted(lock) ? signIn : requestPasswordlessEmail
  };

  return <Lock {...props} />;
}

export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      emailcode: open
    }
  },
  renderFn: render
};
