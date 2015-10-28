import React from 'react';
import AskVcode from '../../cred/vcode/ask_vcode';
import AskPhoneNumber from '../../cred/phone-number/ask_phone_number';
import { closeLock } from '../../lock/actions';
import {
  cancelSelectPhoneLocation,
  sendSMS,
  signIn
} from '../../passwordless/actions';
import {
  buildBackHandler,
  renderAskLocation,
  renderSignedInConfirmation
} from '../shared';
import * as l from '../../lock/index';
import * as c from '../../cred/index';
import * as m from '../../passwordless/index';

export default function render(lock) {
  let auxiliaryPane, backHandler, children, screenName, submitHandler;
  if (m.passwordlessStarted(lock)) {
    auxiliaryPane = renderSignedInConfirmation(lock);
    backHandler = buildBackHandler(lock, ["vcode"]);
    screenName = "code";
    const placeholder = l.ui.t(lock, [screenName, "codeInputPlaceholder"], {__textOnly: true});
    const resendLabel = l.ui.t(lock, [screenName, "resendLabel"], {__textOnly: true});
    children = <AskVcode lock={lock} placeholder={placeholder} resendLabel={resendLabel} />;
    submitHandler = signIn;
  } else {
    auxiliaryPane = renderAskLocation(lock);
    screenName = "phone";
    children = <AskPhoneNumber lock={lock} />;
    submitHandler = sendSMS;
  }

  return {
    auxiliaryPane: auxiliaryPane,
    backHandler: backHandler,
    children: children,
    closeHandler: closeLock,
    disallowClose: m.selectingLocation(lock),
    escHandler: function() {
      m.selectingLocation(lock) ?
        cancelSelectPhoneLocation(l.id(lock)) : closeLock(l.id(lock));
    },
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"], {phoneNumber: c.fullHumanPhoneNumber(lock)}),
    isDone: l.signedIn(lock),
    screenName: screenName,
    submitHandler: submitHandler
  };
}
