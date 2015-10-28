import React from 'react';
import AskVcode from '../../cred/vcode/ask_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { closeLock, openLock } from '../../lock/actions';
import { requestPasswordlessEmail, signIn } from '../../passwordless/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import * as c from '../../cred/index';
import * as m from '../../passwordless/index';
import { buildBackHandler, renderSignedInConfirmation } from '../shared';


const NAME = "socialOrEmailcode";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  const { connections } = options;
  if (!Array.isArray(connections) || connection.length === 0) {
    throw new Error("The `connections` option array needs to be provided with at least one connection.");
  }
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
    screenName = "networkOrEmail";
    const placeholder = l.ui.t(lock, [screenName, "emailInputPlaceholder"], {__textOnly: true});
    children = <AskSocialNetworkOrEmail lock={lock} placeholder={placeholder} />;
    submitHandler = requestPasswordlessEmail;
  }

  return {
    auxiliaryPane: renderSignedInConfirmation(lock),
    backHandler: backHandler,
    children: children,
    closeHandler: closeLock,
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"], {email: c.email(lock)}),
    isDone: l.signedIn(lock),
    lock: lock,
    screenName: screenName,
    submitHandler: submitHandler
  };

}


export default {
  name: NAME,
  methods: {
    close: closeLock,
    open: {
      socialOrEmailcode: open
    }
  },
  renderFn: render
};
