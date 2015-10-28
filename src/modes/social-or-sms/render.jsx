import React from 'react';
import AskSocialNetworkOrPhoneNumber from '../../cred/or/ask_social_network_or_phone_number';
import AskVcode from '../../cred/vcode/ask_vcode';
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
  let backHandler, children, screenName, submitHandler;
  if (m.passwordlessStarted(lock)) {
    backHandler = buildBackHandler(lock, ["vcode"]);
    screenName = "code";
    children = <AskVcode lock={lock} />;
    submitHandler = signIn;
  } else {
    screenName = "networkOrPhone";
    const placeholder = l.ui.t(lock, [screenName, "phoneNumberInputPlaceholder"], {__textOnly: true});
    children = <AskSocialNetworkOrPhoneNumber lock={lock} placeholder={placeholder} />;
    submitHandler = sendSMS;
  }

  return {
    auxiliaryPane: renderAskLocation(lock) || renderSignedInConfirmation(lock),
    backHandler: backHandler,
    children: children,
    closeHandler: closeLock,
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
