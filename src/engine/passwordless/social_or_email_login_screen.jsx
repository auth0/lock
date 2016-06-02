import React from 'react';
import Screen from '../../core/screen';
import EmailPane from '../../field/email/email_pane';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import PaneSeparator from '../../core/pane_separator';
import { requestPasswordlessEmail } from '../../connection/passwordless/actions';
import { renderEmailSentConfirmation } from '../../connection/passwordless/email_sent_confirmation';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import { useBigButtons } from '../../connection/social/index';
import * as l from '../../core/index';

const useSocialBigButtons = (m) => {
  const limit = l.connections(m, "passwordless", "email").count() === 0 ? 5 : 3;
  const notFound = l.connections(m, "social").count() <= limit;
  return useBigButtons(m, notFound);
}

const Component = ({i18n, model}) => {
  const social = l.hasSomeConnections(model, "social")
    ? <SocialButtonsPane
        bigButtons={useSocialBigButtons(model)}
        instructions={i18n.html("socialLoginInstructions")}
        labelFn={i18n.str}
        lock={model}
        signUp={false}
      />
   : null;

  const emailInstructionsI18nKey = social
    ? "passwordlessEmailAlternativeInstructions"
    : "passwordlessEmailInstructions";

  const email = l.hasSomeConnections(model, "passwordless", "email")
    ? <EmailPane
        instructions={i18n.html(emailInstructionsI18nKey)}
        lock={model}
        placeholder={i18n.str("emailInputPlaceholder")}
      />
    : null;

  const separator = social && email
    ? <PaneSeparator />
    : null;

  return <div>{social}{separator}{email}</div>;
};

export default class SocialOrEmailLoginScreen extends Screen {

  constructor() {
    super("socialOrEmail");
  }

  submitHandler(m) {
    return l.hasSomeConnections(m, "passwordless", "email")
      ? requestPasswordlessEmail
      : null;
  }

  renderAuxiliaryPane(lock) {
    return renderEmailSentConfirmation(lock)
      || renderSignedInConfirmation(lock);
  }

  render() {
    return Component;
  }

}
