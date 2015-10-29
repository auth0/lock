import React from 'react';
import Screen from '../../lock/screen';
import SocialButtonsPane from './social_buttons_pane';

import { renderSignedInConfirmation } from '../../modes/shared';

export default class AskSocialNetwork extends Screen {

  constructor(lock, isDone) {
    super("network", lock, isDone);
  }

  showSubmitButton() {
    return false;
  }

  renderAuxiliaryPane() {
    return renderSignedInConfirmation(this.lock);
  }

  render() {
    return <SocialButtonsPane lock={this.lock} />;
  }

}
