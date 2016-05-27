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

  render({focusSubmit, i18n, model, t}) {
    return (
      <div>
        <SocialButtonsPane
          label={i18n.str}
          lock={model}
          signUp={false}
          smallButtonsHeader={t("smallSocialButtonsHeader", {__textOnly: true})}
        />
        <PaneSeparator>{t("separatorText")}</PaneSeparator>
        <PhoneNumberPane
          focusSubmit={focusSubmit}
          lock={model}
          placeholder={t("phoneNumberInputPlaceholder", {__textOnly: true})}
        />
      </div>
    );
  }

}
