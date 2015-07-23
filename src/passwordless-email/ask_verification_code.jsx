import React from 'react';
import VerificationCodeInput from '../credentials/verification_code_input';
import { changeVerificationCode } from './actions';

export default class AskVerificationCode extends React.Component {
  render() {
    const { lock } = this.props;
    const autoFocus = lock.getIn(["showOptions", "focusInput"]);

    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          We sent you a code to sign in. <br/>
          Please check your inbox.
        </div>
        <VerificationCodeInput value={lock.get("verificationCode")}
          isValid={true}
          disabled={lock.get("submitting")}
          onChange={::this.handleVerificationCodeChange}
          autoFocus={autoFocus} />
      </div>
    );
  }

  handleVerificationCodeChange(e) {
    const lockID = this.props.lock.get('id');
    const verificationCode = e.target.value;
    changeVerificationCode(lockID, verificationCode);
  }
}
