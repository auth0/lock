import React from 'react';
import ConfirmationPane from '../lock/confirmation_pane';
import CredPane from '../lock/cred_pane';
import VcodeInput from '../cred/vcode_input';
import { back, changeVcode, close } from './actions';
import * as l from '../lock/index';
import * as c from '../cred/index';
import * as m from './index';
import { isSmallScreen } from '../utils/media_utils';

export default class AskVcode extends React.Component {
  render() {
    const { className, headerText, lock } = this.props;
    const auxiliaryPane = m.signedIn(lock) ?
      <SignedInConfirmation key="auxiliarypane" lock={lock} /> : null;
    const terms = this.t(["footerText"]);

    return (
      <CredPane lock={lock} auxiliaryPane={auxiliaryPane} className={className} backHandler={::this.handleBack} terms={terms} ref="cred">
        <div className="auth0-lock-form auth0-lock-passwordless">
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
        </div>
      </CredPane>
    );
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

  componentWillSlideIn(...args) {
    return this.refs.cred.componentWillSlideIn(...args);
  }

  componentDidSlideIn(...args) {
    return this.refs.cred.componentDidSlideIn(...args);
  }

  componentWillSlideOut(...args) {
    return this.refs.cred.componentWillSlideOut(...args);
  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["code"].concat(keyPath), params);
  }
}

class SignedInConfirmation extends React.Component {
  render() {
    const { lock } = this.props;
    const closeHandler = l.ui.closable(lock) ? ::this.handleClose : undefined;

    return (
      <ConfirmationPane closeHandler={closeHandler}>
        <p>{this.t(["success"])}</p>
      </ConfirmationPane>
    )
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["confirmation"].concat(keyPath), params);
  }
}
