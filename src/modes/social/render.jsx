import React from 'react';
import AskSocialNetwork from '../../cred/social/ask_social_network';
import { closeLock } from '../../lock/actions';
import { renderSignedInConfirmation } from '../shared';
import * as l from '../../lock/index';

export default function render(lock) {
  const screenName = "network";
  return {
    auxiliaryPane: renderSignedInConfirmation(lock),
    children: <AskSocialNetwork lock={lock} />,
    closeHandler: closeLock,
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"]),
    lock: lock,
    isDone: l.signedIn(lock),
    screenName: screenName,
    showSubmitButton: false
  };
}
