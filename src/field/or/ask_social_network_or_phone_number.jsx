import React from 'react';
import Base from '../../connection/passwordless/ask_phone_number';
import PhoneNumberPane from '../phone-number/phone_number_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../core/pane_separator';
import * as l from '../../core/index';

import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';

export default class AskSocialNetworkOrPhoneNumber extends Base {

  constructor() {
    super();
    this.name = "networkOrPhone";
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock) || super.renderAuxiliaryPane(lock);
  }

  render({focusSubmit, i18n, model}) {
    // TODO: review when bringing passwordless back
    return (
      <div>
        <SocialButtonsPane
          bigButtons={false}
          instructions={i18n.html("socialLoginInstructions")}
          label={i18n.str}
          lock={model}
          signUp={false}
        />
        <PaneSeparator />
        <PhoneNumberPane
          focusSubmit={focusSubmit}
          lock={model}
          placeholder={i18n.str("phoneNumberInputPlaceholder")}
        />
      </div>
    );
  }

}
