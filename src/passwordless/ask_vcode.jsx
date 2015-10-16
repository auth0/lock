import React from 'react';
import MainScreenContainer from '../lock/main_screen_container';
import VcodePane from '../panes/vcode_pane';
import SignedInConfirmation from '../lock/signed_in_confirmation';
import { back, close } from './actions';
import * as l from '../lock/index';

export default class AskVcode extends MainScreenContainer {

  constructor(props) {
    super(props, "code");
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  handleBack() {
    back(l.id(this.props.lock), {clearCred: ["vcode"]});
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

  renderFooterText() {
    const { destination } = this.props;
    return this.t(["headerText"], {destination: destination});
  }

  renderContent() {
    const { lock } = this.props;

    return (
      <VcodePane
        lock={lock}
        placeholder={this.t(["codeInputPlaceholder"], {__textOnly: true})}
        resendLabel={this.t(["resendLabel"], {__textOnly: true})}
        tabIndex={1}
      />
    );
  }

}
