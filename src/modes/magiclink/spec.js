import React from 'react';
import Lock from '../../lock/lock';
import AskEmail from '../../cred/email/ask_email';
import { openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';

// TODO: remove passwordless dep
import * as m from '../../passwordless/index';
import { close, requestPasswordlessEmail } from '../../passwordless/actions';

const NAME = "magiclink";


function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  options.modeOptions = {send: "link", dictName: NAME, storageKey: NAME};
  return openLock(id, NAME, options);
}

function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(l.id(lock));
}

function render(lock) {
  const props = {
    closeHandler: close,
    children: <AskEmail lock={lock} key="ask-email" />,
    escHandler: close,
    isDone: m.passwordlessStarted(lock),
    lock: lock,
    submitHandler: !m.passwordlessStarted(lock) && askEmailSubmitHandler
  };

  return <Lock {...props} />;
}

export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      magiclink: open
    }
  },
  renderFn: render
};
