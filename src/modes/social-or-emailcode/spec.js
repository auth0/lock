import React from 'react';
import Lock from '../../lock/lock';
import AskVcode from '../../cred/vcode/ask_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { openLock } from '../../lock/actions';
import { close } from '../../social/actions';
import { requestPasswordlessEmail, signIn } from '../../passwordless/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import * as c from '../../cred/index';
import * as m from '../../passwordless/index';
import { buildBackHandler, renderSignedInConfirmation } from '../shared';


const NAME = "socialOrEmailcode";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  // TODO: review cred storage
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
    screenName = "networkOrEmail";
    const placeholder = l.ui.t(lock, [screenName, "emailInputPlaceholder"], {__textOnly: true});
    children = <AskSocialNetworkOrEmail lock={lock} placeholder={placeholder} />;
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
      socialOrEmailcode: open
    }
  },
  renderFn: render
};
