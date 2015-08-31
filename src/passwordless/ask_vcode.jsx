import React from 'react';
import CredPane from '../lock/cred_pane';
import VcodeInput from '../cred/vcode_input';
import { changeVcode } from './actions';
import * as l from '../lock/index';
import * as c from '../cred/index';

export default class AskVcode extends React.Component {
  render() {
    const { className, cred, lock } = this.props;
    return (
      <CredPane lock={lock} className={className}>
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
            autoFocus={l.ui.focusInput(lock)} />
        </div>
      </CredPane>
    );
  }

  handleVcodeChange(e) {
    e.preventDefault();
    changeVcode(l.id(this.props.lock), e.target.value);
  }
}
