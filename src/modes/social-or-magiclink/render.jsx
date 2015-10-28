import React from 'react';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { closeLock } from '../../lock/actions';
import { requestPasswordlessEmail } from '../../passwordless/actions';
import {
  renderEmailSentConfirmation,
  renderSignedInConfirmation
} from '../shared';
import * as l from '../../lock/index';
import * as m from '../../passwordless/index';

export default function render(lock) {
  const screenName = "networkOrEmail";

  const auxiliaryPane =
    renderEmailSentConfirmation(lock, {dictKey: "magiclinkConfirmation"})
    || renderSignedInConfirmation(lock, {dictKey: "socialConfirmation"});

  return {
    auxiliaryPane: auxiliaryPane,
    children: <AskSocialNetworkOrEmail lock={lock} />,
    closeHandler: closeLock,
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"]),
    isDone: m.passwordlessStarted(lock) || l.signedIn(lock),
    screenName: screenName,
    submitHandler: !m.passwordlessStarted(lock) && requestPasswordlessEmail
  };
}
