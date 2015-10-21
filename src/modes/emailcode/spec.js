import React from 'react';
import Lock from '../../lock/lock';
import AskEmail from '../../cred/email/ask_email';
import AskVcode from '../../cred/vcode/ask_vcode';
import { openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import * as c from '../../cred/index';
import { buildBackHandler, renderSignedInConfirmation } from '../shared';

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
  let backHandler, children, screenName, submitHandler;
  if (m.passwordlessStarted(lock)) {
    backHandler = buildBackHandler(lock, ["vcode"]);
    screenName = "code";
    const placeholder = l.ui.t(lock, [screenName, "codeInputPlaceholder"], {__textOnly: true});
    const resendLabel = l.ui.t(lock, [screenName, "resendLabel"], {__textOnly: true});
    children = <AskVcode lock={lock} placeholder={placeholder} resendLabel={resendLabel} />;
    submitHandler = signIn;
  } else {
    screenName = "email";
    const placeholder = l.ui.t(lock, [screenName, "emailInputPlaceholder"], {__textOnly: true});
    children = <AskEmail lock={lock} placeholder={placeholder} />;
    submitHandler = requestPasswordlessEmail;
  }

  const props = {
    auxiliaryPane: renderSignedInConfirmation(lock),
    backHandler: backHandler,
    children: children,
    closeHandler: close,
    escHandler: close,
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"], {email: c.email(lock)}),
    isDone: l.signedIn(lock),
    lock: lock,
    screenName: screenName,
    submitHandler: submitHandler
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
