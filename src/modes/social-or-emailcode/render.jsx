import React from 'react';
import AskVcode from '../../cred/vcode/ask_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { closeLock } from '../../lock/actions';
import { requestPasswordlessEmail, signIn } from '../../passwordless/actions';
import { buildBackHandler, renderSignedInConfirmation } from '../shared';
import * as l from '../../lock/index';
import * as c from '../../cred/index';
import * as m from '../../passwordless/index';

export default function render(lock) {
  let backHandler, children, screenName, submitHandler;
  if (m.passwordlessStarted(lock)) {
    backHandler = buildBackHandler(lock, ["vcode"]);
    screenName = "code";
    children = <AskVcode lock={lock} />;
    submitHandler = signIn;
  } else {
    screenName = "networkOrEmail";
    children = <AskSocialNetworkOrEmail lock={lock} />;
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
    screenName: screenName,
    submitHandler: submitHandler
  };

}
