import React from 'react';
import CredentialsPane from '../lock/credentials_pane';
import VcodeInput from '../credentials/vcode_input';
import { changeVcode } from './actions';
import * as l from '../lock/index';
import * as c from '../credentials/index';

export default class AskVcode extends React.Component {
  render() {
    const { lock } = this.props;

    return (
      <CredentialsPane lock={lock} className="auth0-lock-confirmation">
        <div className="auth0-lock-form auth0-lock-passwordless">
          <h2>Enter the code</h2>
          <p>
            Pleace check your phone ({c.fullHumanPhoneNumber(lock)})<br />
            You've received a message from us<br />
            with your passcode.
          </p>
          <VcodeInput value={c.vcode(lock)}
            isValid={!c.visiblyInvalidVcode(lock) && !l.globalError(lock)}
            onChange={::this.handleVcodeChange}
            autoFocus={l.ui.focusInput(lock)} />
        </div>
      </CredentialsPane>
    );
  }

  handleVcodeChange(e) {
    e.preventDefault();
    changeVcode(l.id(this.props.lock), e.target.value);
  }
}
