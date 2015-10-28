import React from 'react';
import AskEmail from '../../cred/email/ask_email';
import AskVcode from '../../cred/vcode/ask_vcode';
import { buildBackHandler, renderSignedInConfirmation } from '../shared';
import { closeLock } from '../../lock/actions';
import { requestPasswordlessEmail, signIn } from '../../passwordless/actions';
import * as l from '../../lock/index';
import * as c from '../../cred/index';
import * as m from '../../passwordless/index';


export default function render(lock) {
  let backHandler, children, screenName, submitHandler;
  if (m.passwordlessStarted(lock)) {
    backHandler = buildBackHandler(lock, ["vcode"]);
    screenName = "code";
    const resendLabel = l.ui.t(lock, [screenName, "resendLabel"], {__textOnly: true});
    children = <AskVcode lock={lock} resendLabel={resendLabel} />;
    submitHandler = signIn;
  } else {
    screenName = "email";
    children = <AskEmail lock={lock} />;
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
