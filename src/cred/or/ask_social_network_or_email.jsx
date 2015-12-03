import React from 'react';
import Screen from '../../lock/screen';
import EmailPane from '../email/email_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../lock/pane_separator';

import { requestPasswordlessEmail } from '../../passwordless/actions';
import { renderEmailSentConfirmation } from '../../passwordless/email_sent_confirmation';
import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';

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

  render({lock}) {
    return (
      <div>
        <SocialButtonsPane
          lock={lock}
          smallButtonsHeader={this.t(lock, ["smallSocialButtonsHeader"], {__textOnly: true})}
        />
        <PaneSeparator>{this.t(lock, ["separatorText"])}</PaneSeparator>
        <EmailPane
          lock={lock}
          placeholder={this.t(lock, ["emailInputPlaceholder"], {__textOnly: true})}
          tabIndex={2}
        />
      </div>
    );
  }

}
