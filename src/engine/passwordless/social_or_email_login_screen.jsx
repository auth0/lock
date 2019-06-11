import React from 'react';
import Screen from '../../core/screen';
import EmailPane from '../../field/email/email_pane';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import PaneSeparator from '../../core/pane_separator';
import { mustAcceptTerms, termsAccepted } from '../../connection/passwordless/index';
import { toggleTermsAcceptance } from '../../connection/passwordless/actions';
import { requestPasswordlessEmail } from '../../connection/passwordless/actions';
import { renderEmailSentConfirmation } from '../../connection/passwordless/email_sent_confirmation';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import * as l from '../../core/index';

import SignUpTerms from '../../connection/database/sign_up_terms';

const Component = ({ i18n, model }) => {
  const social = l.hasSomeConnections(model, 'social') ? (
    <SocialButtonsPane
      instructions={i18n.html('socialLoginInstructions')}
      labelFn={i18n.str}
      lock={model}
      signUp={false}
      disabled={!termsAccepted(model)}
    />
  ) : null;

  const email = l.hasSomeConnections(model, 'passwordless', 'email') ? (
    <EmailPane i18n={i18n} lock={model} placeholder={i18n.str('emailInputPlaceholder')} />
  ) : null;

  // TODO: instructions can't be on EmailPane beacuse it breaks the CSS,
  // all input fields needs to share a parent so the last one doesn't have
  // a bottom margin.
  //
  // Maybe we can make new PasswordlessEmailPane component.
  const emailInstructionsI18nKey = social
    ? 'passwordlessEmailAlternativeInstructions'
    : 'passwordlessEmailInstructions';

  const headerText = i18n.html(emailInstructionsI18nKey) || null;
  const header = email && headerText && <p>{headerText}</p>;

  const separator = social && email ? <PaneSeparator /> : null;

  return (
    <div>
      {social}
      {separator}
      {header}
      {email}
    </div>
  );
};

export default class SocialOrEmailLoginScreen extends Screen {
  constructor() {
    super('socialOrEmail');
  }

  submitHandler(m) {
    return l.hasSomeConnections(m, 'passwordless', 'email') ? requestPasswordlessEmail : null;
  }

  renderAuxiliaryPane(lock) {
    return renderEmailSentConfirmation(lock) || renderSignedInConfirmation(lock);
  }

  render() {
    return Component;
  }
  isSubmitDisabled(m) {
    return !termsAccepted(m);
  }

  renderTerms(m, terms) {
    const checkHandler = mustAcceptTerms(m) ? () => toggleTermsAcceptance(l.id(m)) : undefined;
    return terms || mustAcceptTerms(m) ? (
      <SignUpTerms
        showCheckbox={mustAcceptTerms(m)}
        checkHandler={checkHandler}
        checked={termsAccepted(m)}
      >
        {terms}
      </SignUpTerms>
    ) : null;
  }
}
