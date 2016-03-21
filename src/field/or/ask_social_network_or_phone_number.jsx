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

  render({focusSubmit, model}) {
    return (
      <div>
        <SocialButtonsPane
          lock={model}
          signUp={false}
          smallButtonsHeader={this.t(model, ["smallSocialButtonsHeader"], {__textOnly: true})}
          t={::this.t}
        />
        <PaneSeparator>{this.t(model, ["separatorText"])}</PaneSeparator>
        <PhoneNumberPane
          focusSubmit={focusSubmit}
          lock={model}
          placeholder={this.t(model, ["phoneNumberInputPlaceholder"], {__textOnly: true})}
        />
      </div>
    );
  }

}
