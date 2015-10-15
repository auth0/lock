import React from 'react';
import MainScreen from '../lock/main_screen';
import MainScreenContainer from '../lock/main_screen_container';
import VcodePane from '../panes/vcode_pane';
import SignedInConfirmation from '../lock/signed_in_confirmation';
import { back, close } from './actions';
import * as l from '../lock/index';

export default class AskVcode extends MainScreenContainer {

  constructor(props) {
    super(props, "code", "cred");
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  handleBack() {
    back(l.id(this.props.lock), {clearCred: ["vcode"]});
  }

  render() {
    const { className, headerText, lock } = this.props;
    const auxiliaryPane = l.signedIn(lock) ?
      <SignedInConfirmation closeHandler={::this.handleClose} key="auxiliarypane" lock={lock} /> :
      null;

    const terms = this.t(["footerText"]);

    return (
      <MainScreen lock={lock} auxiliaryPane={auxiliaryPane} className={className} backHandler={::this.handleBack} terms={terms} ref="cred">
        <p>{headerText}</p>
        <VcodePane
          lock={lock}
          placeholder={this.t(["codeInputPlaceholder"], {__textOnly: true})}
          resendLabel={this.t(["resendLabel"], {__textOnly: true})}
          tabIndex={1}
        />
      </MainScreen>
    );
  }

}
