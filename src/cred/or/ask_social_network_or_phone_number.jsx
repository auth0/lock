import React from 'react';
import Base from '../../passwordless/ask_phone_number';
import PhoneNumberPane from '../phone-number/phone_number_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../lock/pane_separator';
import * as l from '../../lock/index';

import { renderSignedInConfirmation } from '../../modes/shared';

export default class AskSocialNetworkOrPhoneNumber extends Base {

  constructor(lock) {
    super(lock);
    this.name = "networkOrPhone";
  }

  renderAuxiliaryPane() {
    return renderSignedInConfirmation(this.lock) || super.renderAuxiliaryPane();
  }

  render({focusSubmit, lock}) {
    return (
      <div>
        <SocialButtonsPane lock={lock} />
        <PaneSeparator />
        <PhoneNumberPane
          focusSubmit={focusSubmit}
          lock={lock}
          placeholder={this.t(["phoneNumberInputPlaceholder"], {__textOnly: true})}
          tabIndex={1}
        />
      </div>
    );
  }

}
