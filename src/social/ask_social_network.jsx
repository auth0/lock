import React from 'react';
import MainScreenContainer from '../lock/main_screen_container';
import SignedInConfirmation from '../lock/signed_in_confirmation';
import SocialButtonsPane from '../panes/social_buttons_pane';
import { close } from './actions';
import * as l from '../lock/index';

export default class AskSocialNetwork extends MainScreenContainer {

  constructor(props) {
    super(props, "network");
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  renderAuxiliaryPane() {
    const { lock } = this.props;

    if (!l.signedIn(lock)) {
      return null;
    }

    return (
      <SignedInConfirmation
        closeHandler={::this.handleClose}
        key="auxiliarypane"
        lock={lock}
      />
    );
  }

  showSubmitButton() {
    return false;
  }

  renderContent() {
    return <SocialButtonsPane lock={this.props.lock} />;
  }

}
