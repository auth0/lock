import React from 'react';
import Screen from '../../core/screen';
import { sendSMS } from '../../connection/passwordless/actions';
import PhoneNumberPane from '../../field/phone-number/phone_number_pane';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import PaneSeparator from '../../core/pane_separator';
import * as l from '../../core/index';

import { renderOptionSelection } from '../../field/index';
import { mustAcceptTerms, termsAccepted } from '../../connection/passwordless/index';
import { toggleTermsAcceptance } from '../../connection/passwordless/actions';
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

  const phoneNumberInstructionsI18nKey = social
    ? 'passwordlessSMSAlternativeInstructions'
    : 'passwordlessSMSInstructions';

  const phoneNumber = l.hasSomeConnections(model, 'passwordless', 'sms') ? (
    <PhoneNumberPane
      instructions={i18n.html(phoneNumberInstructionsI18nKey)}
      lock={model}
      placeholder={i18n.str('phoneNumberInputPlaceholder')}
    />
  ) : null;

  const separator = social && phoneNumber ? <PaneSeparator /> : null;

  return (
    <div>
      {social}
      {separator}
      {phoneNumber}
    </div>
  );
};

export default class AskSocialNetworkOrPhoneNumber extends Screen {
  constructor() {
    super('socialOrPhoneNumber');
  }

  submitHandler(m) {
    return l.hasSomeConnections(m, 'passwordless', 'sms') ? sendSMS : null;
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock) || renderOptionSelection(lock);
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
