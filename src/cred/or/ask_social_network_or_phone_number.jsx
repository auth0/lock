import React from 'react';
import Base from '../../passwordless/ask_phone_number';
import PhoneNumberPane from '../phone-number/phone_number_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../lock/pane_separator';
import * as l from '../../lock/index';

import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';

export default class AskSocialNetworkOrPhoneNumber extends Base {

  constructor() {
    super();
    this.name = "networkOrPhone";
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock) || super.renderAuxiliaryPane(lock);
  }

  render({focusSubmit, lock}) {
    return (
      <div>
        <SocialButtonsPane
          lock={lock}
          smallButtonsHeader={this.t(lock, ["smallSocialButtonsHeader"], {__textOnly: true})}
        />
        <PaneSeparator>{this.t(lock, ["separatorText"])}</PaneSeparator>
        <PhoneNumberPane
          focusSubmit={focusSubmit}
          lock={lock}
          placeholder={this.t(lock, ["phoneNumberInputPlaceholder"], {__textOnly: true})}
          tabIndex={2}
        />
      </div>
    );
  }

}
