import React from 'react';
import AskEmail from '../../cred/email/ask_email';
import { closeLock } from '../../lock/actions';
import { requestPasswordlessEmail } from '../../passwordless/actions';
import { renderEmailSentConfirmation } from '../shared';
import * as l from '../../lock/index';
import * as m from '../../passwordless/index';

export default function render(lock) {
  const screenName = "email";

  return {
    auxiliaryPane: renderEmailSentConfirmation(lock),
    closeHandler: closeLock,
    children: <AskEmail lock={lock} />,
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"]),
    isDone: m.passwordlessStarted(lock),
    screenName: screenName,
    submitHandler: !m.passwordlessStarted(lock) && requestPasswordlessEmail
  };
}
