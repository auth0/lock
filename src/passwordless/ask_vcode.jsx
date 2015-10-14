import React from 'react';
import MainScreen from '../lock/main_screen';
import MainScreenContainer from '../lock/main_screen_container';
import VcodeInput from '../cred/vcode_input';
import SignedInConfirmation from '../lock/signed_in_confirmation';
import { back, changeVcode, close } from './actions';
import * as l from '../lock/index';
import * as c from '../cred/index';
import * as m from './index';
import { isSmallScreen } from '../utils/media_utils';

export default class AskVcode extends MainScreenContainer {

  constructor(props) {
    super(props, "code", "cred");
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  handleVcodeChange(e) {
    e.preventDefault();
    changeVcode(l.id(this.props.lock), e.target.value);
  }

  handleBack() {
    back(l.id(this.props.lock), {clearCred: ["vcode"]});
  }

  handleResendClick(e) {
    e.preventDefault();
    this.handleBack();
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
        <VcodeInput value={c.vcode(lock)}
          isValid={!c.visiblyInvalidVcode(lock) && !l.globalError(lock)}
          onChange={::this.handleVcodeChange}
          autoFocus={!isSmallScreen()}
          placeholder={this.t(["codeInputPlaceholder"], {__textOnly: true})}
          disabled={l.submitting(lock)}
          tabIndex={l.tabIndex(lock, 1)} />
        <p className="auth0-lock-did-not-receive-code">
          <a href="#" className="auth0-lock-did-not-receive-code-link" onClick={::this.handleResendClick}>
            {this.t(["resendLabel"], {__textOnly: true})}
          </a>
        </p>
      </MainScreen>
    );
  }

}
