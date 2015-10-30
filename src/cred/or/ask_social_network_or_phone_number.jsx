import React from 'react';
import Base from '../../passwordless/ask_phone_number';
import PhoneNumberPane from '../phone-number/phone_number_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../panes/pane_separator';
import * as l from '../../lock/index';

import { renderSignedInConfirmation } from '../../modes/shared';

export default class AskSocialNetworkOrPhoneNumber extends Base {

  constructor(lock, isDone) {
    super(lock, isDone);
    this.name = "networkOrPhone";
  }

  renderAuxiliaryPane() {
    return renderSignedInConfirmation(this.lock) || super.renderAuxiliaryPane();
  }

  render({lock}) {
    return (
      <div>
        <SocialButtonsPane lock={lock} />
        <PaneSeparator />
        <PhoneNumberPane
          lock={lock}
          placeholder={this.t(["phoneNumberInputPlaceholder"], {__textOnly: true})}
          tabIndex={1}
        />
      </div>
    );
  }

}
