import React from 'react';
import VerificationCodeInput from '../credentials/verification_code_input';
import { changeVerificationCode } from './actions';
import * as l from '../lock/index';
import * as c from '../credentials/index';

export default class AskVerificationCode extends React.Component {
  render() {
    const { lock } = this.props;

    return (
      <div>
        <div className="auth0-lock-instructions">
          We sent you a code to sign in. <br/>
          Please check your inbox.
        </div>
        <VerificationCodeInput value={c.verificationCode(lock)}
          isValid={!c.visiblyInvalidVerificationCode(lock) && !l.globalError(lock)}
          onChange={::this.handleVerificationCodeChange}
          autoFocus={l.ui.focusInput(lock)} />
      </div>
    );
  }

  handleVerificationCodeChange(e) {
    e.preventDefault();
    changeVerificationCode(l.id(this.props.lock), e.target.value);
  }
}
