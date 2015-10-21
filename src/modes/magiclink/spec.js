import React from 'react';
import Lock from '../../lock/lock';
import AskEmail from '../../cred/email/ask_email';
import { openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import { renderEmailSentConfirmation } from '../shared';

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

function render(lock) {
  const screenName = "email";
  const placeholder = l.ui.t(lock, [screenName, "emailInputPlaceholder"], {__textOnly: true});

  const props = {
    auxiliaryPane: renderEmailSentConfirmation(lock),
    closeHandler: close,
    children: <AskEmail lock={lock} placeholder={placeholder}/>,
    escHandler: close,
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"]),
    isDone: m.passwordlessStarted(lock),
    lock: lock,
    screenName: screenName,
    submitHandler: !m.passwordlessStarted(lock) && requestPasswordlessEmail
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
