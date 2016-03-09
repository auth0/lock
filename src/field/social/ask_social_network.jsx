import React from 'react';
import Screen from '../../lock/screen';
import SocialButtonsPane from './social_buttons_pane';
import { renderSocialHeaderText } from '../../social/index';
import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';

export default class AskSocialNetwork extends Screen {

  constructor() {
    super("network");
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  render({lock}) {
    return(
      <SocialButtonsPane
        lock={lock}
        showLoading={true}
        smallButtonsHeader={this.t(lock, ["smallSocialButtonsHeader"], {__textOnly: true})}
      />
    );
  }
}
