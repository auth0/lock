import React from 'react';
import Screen from '../../core/screen';
import EmailPane from '../email/email_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../core/pane_separator';

import { requestPasswordlessEmail } from '../../passwordless/actions';
import { renderEmailSentConfirmation } from '../../passwordless/email_sent_confirmation';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';

const Component = ({model, t}) => (
  <div>
    <SocialButtonsPane
      lock={model}
      signUp={false}
      smallButtonsHeader={t("smallSocialButtonsHeader", {__textOnly: true})}
      t={t}
    />
    <PaneSeparator>{t("separatorText")}</PaneSeparator>
    <EmailPane
      lock={model}
      placeholder={t("emailInputPlaceholder", {__textOnly: true})}
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
