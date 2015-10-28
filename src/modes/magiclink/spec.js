import React from 'react';
import AskEmail from '../../cred/email/ask_email';
import { closeLock, openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import { renderEmailSentConfirmation } from '../shared';

// TODO: remove passwordless dep
import * as m from '../../passwordless/index';
import { requestPasswordlessEmail } from '../../passwordless/actions';

const NAME = "magiclink";


function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  options.modeOptions = {send: "link", dictName: NAME, storageKey: NAME};
  return openLock(id, NAME, options);
}

function render(lock) {
  const screenName = "email";
  const placeholder = l.ui.t(lock, [screenName, "emailInputPlaceholder"], {__textOnly: true});

  return {
    auxiliaryPane: renderEmailSentConfirmation(lock),
    closeHandler: closeLock,
    children: <AskEmail lock={lock} placeholder={placeholder}/>,
    escHandler: closeLock,
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"]),
    isDone: m.passwordlessStarted(lock),
    lock: lock,
    screenName: screenName,
    submitHandler: !m.passwordlessStarted(lock) && requestPasswordlessEmail
  };
}

export default {
  name: NAME,
  methods: {
    close: closeLock,
    open: {
      magiclink: open
    }
  },
  renderFn: render
};
