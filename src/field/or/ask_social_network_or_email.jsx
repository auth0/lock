import React from 'react';
import Screen from '../../core/screen';
import EmailPane from '../email/email_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../core/pane_separator';

import { requestPasswordlessEmail } from '../../connection/passwordless/actions';
import { renderEmailSentConfirmation } from '../../connection/passwordless/email_sent_confirmation';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';

// TODO: review when bringing passwordless back
const Component = ({i18n, model}) => (
  <div>
    <SocialButtonsPane
      bigButtons={false}
      instructions={i18n.html("socialLoginInstructions")}
      labelFn={i18n.str}
      lock={model}
      signUp={false}
    />
    <PaneSeparator />
    <EmailPane
      lock={model}
      placeholder={i18n.str("emailInputPlaceholder")}
    />
  </div>
);

export default class AskSocialNetworkOrEmail extends Screen {

  constructor() {
    super("networkOrEmail");
  }

  submitHandler() {
    return requestPasswordlessEmail;
  }

  renderAuxiliaryPane(lock) {
    return renderEmailSentConfirmation(lock)
      || renderSignedInConfirmation(lock);
  }

  render() {
    return Compoent;
  }

}
