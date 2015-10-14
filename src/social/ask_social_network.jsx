import React from 'react';
import MainScreen from '../lock/main_screen';
import MainScreenContainer from '../lock/main_screen_container';
import SignedInConfirmation from '../lock/signed_in_confirmation';
import SocialButton from './social_button';
import { close } from './actions';
import * as l from '../lock/index';

export default class AskSocialNetwork extends MainScreenContainer {

  constructor(props) {
    super(props, "network", "cred");
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  render() {
    const { lock } = this.props;
    const buttons = l.ui.connections(lock).map(x => {
      return <SocialButton key={x} name={x} lockID={l.id(lock)} />;
    });

    const auxiliaryPane = l.signedIn(lock) ?
      <SignedInConfirmation closeHandler={::this.handleClose} key="auxiliarypane" lock={lock} /> :
      null;

    const terms = this.t(["footerText"]);

    return (
      <MainScreen lock={lock} showSubmitButton={false} ref="cred" terms={terms} auxiliaryPane={auxiliaryPane}>
        {buttons}
      </MainScreen>
    );
  }

}
