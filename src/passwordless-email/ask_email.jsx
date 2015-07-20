import React from 'react';
import EmailInput from '../forms/email_input';
import { changeEmail } from './actions';

export default class AskEmail extends React.Component {
  render() {
    const { lock } = this.props;
    const isValid = !lock.get("validate") || lock.get("validEmail");
    const autoFocus = lock.getIn(["showOptions", "focusInput"]);

    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          Enter your email address to sign in or create an account
        </div>
        <EmailInput value={lock.get("email")}
          isValid={isValid}
          disabled={lock.get("submitting")}
          onChange={::this.handleEmailChange}
          autoFocus={autoFocus} />
      </div>
    );
  }

  handleEmailChange(e) {
    const lockID = this.props.lock.get('id');
    const email = e.target.value;
    changeEmail(lockID, email);
  }
}
