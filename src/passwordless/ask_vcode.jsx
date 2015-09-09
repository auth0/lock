import React from 'react';
import ConfirmationPane from '../lock/confirmation_pane';
import CredPane from '../lock/cred_pane';
import VcodeInput from '../cred/vcode_input';
import { changeVcode, close } from './actions';
import * as l from '../lock/index';
import * as c from '../cred/index';
import * as m from './index';

export default class AskVcode extends React.Component {
  render() {
    const { className, cred, dimensions, lock } = this.props;
    const auxiliaryPane = m.signedIn(lock) ?
      <SignedInConfirmation key="auxiliarypane" lock={lock} /> : null;

    return (
      <CredPane lock={lock} dimensions={dimensions} auxiliaryPane={auxiliaryPane} className={className}>
        <div className="auth0-lock-form auth0-lock-passwordless">
          <h2>Enter the code</h2>
          <p>
            Pleace check your {cred}<br />
            You've received a message from us<br />
            with your passcode.
          </p>
          <VcodeInput value={c.vcode(lock)}
            isValid={!c.visiblyInvalidVcode(lock) && !l.globalError(lock)}
            onChange={::this.handleVcodeChange}
            autoFocus={l.ui.focusInput(lock)}
            disabled={l.submitting(lock)} />
        </div>
      </CredPane>
    );
  }

  handleVcodeChange(e) {
    e.preventDefault();
    changeVcode(l.id(this.props.lock), e.target.value);
  }
}

class SignedInConfirmation extends React.Component {
  render() {
    return (
      <ConfirmationPane closeHandler={::this.handleClose}>
        <p>Thanks for signing in.</p>
      </ConfirmationPane>
    )
  }

  handleClose() {
    close(l.id(this.props.lock));
  }
}
