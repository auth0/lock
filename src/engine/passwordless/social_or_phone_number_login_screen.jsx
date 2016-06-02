import React from 'react';
import Screen from '../../core/screen';
import { sendSMS } from '../../connection/passwordless/actions';
import PhoneNumberPane from '../../field/phone-number/phone_number_pane';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import PaneSeparator from '../../core/pane_separator';
import { useBigButtons } from '../../connection/social/index';
import * as l from '../../core/index';

const useSocialBigButtons = (m) => {
  const limit = l.connections(m, "passwordless", "sms").count() === 0 ? 5 : 3;
  const notFound = l.connections(m, "social").count() <= limit;
  return useBigButtons(m, notFound);
}

const Component = ({focusSubmit, i18n, model}) => (
  <div>
    <SocialButtonsPane
      bigButtons={useSocialBigButtons(model)}
      instructions={i18n.html("socialLoginInstructions")}
      labelFn={i18n.str}
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


export default class AskSocialNetworkOrPhoneNumber extends Screen {

  constructor() {
    super("socialOrPhoneNumber");
  }

  submitHandler() {
    return sendSMS;
  }

  // escHandler(lock) {
  //   return selectingLocation(lock) ? cancelSelectPhoneLocation : null;
  // }

  // renderAuxiliaryPane(lock) {
  //   return renderAskLocation(lock);
  // }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  render() {
    return Component;
  }

}
