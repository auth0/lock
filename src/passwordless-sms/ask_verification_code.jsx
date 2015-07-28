import React from 'react';
import VerificationCodeInput from '../credentials/verification_code_input';
import { changeVerificationCode } from './actions';
import { verificationCode, visiblyInvalidVerificationCode } from '../credentials/index';
import { ui } from '../lock/index';

export default class AskVerificationCode extends React.Component {
  render() {
    const { lock } = this.props;

    return (
      <div>
        <div className="auth0-lock-instructions">
          We sent you a code to sign in. <br/>
          Please check your phone.
        </div>
        <VerificationCodeInput value={verificationCode(lock)}
          isValid={!visiblyInvalidVerificationCode(lock)}
          disabled={lock.get("submitting")}
          onChange={::this.handleVerificationCodeChange}
          autoFocus={ui.autoFocus(lock)} />
      </div>
    );
  }

  handleVerificationCodeChange(e) {
    const lockID = this.props.lock.get('id');
    const verificationCode = e.target.value;
    changeVerificationCode(lockID, verificationCode);
  }
}
