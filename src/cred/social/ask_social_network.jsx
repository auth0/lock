import React from 'react';
import Screen from '../../lock/screen';
import SocialButtonsPane from './social_buttons_pane';

import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';

export default class AskSocialNetwork extends Screen {

  constructor(lock) {
    super("network", lock);
  }

  showSubmitButton() {
    return false;
  }

  renderAuxiliaryPane() {
    return renderSignedInConfirmation(this.lock);
  }

  render({lock}) {
    return <SocialButtonsPane lock={lock} />;
  }

}
