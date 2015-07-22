import React from 'react';
import EmailInput from '../credentials/email_input';
import { changeEmail } from './actions';

export default class AskEmail extends React.Component {
  render() {
    const { lock } = this.props;
    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          Enter your email address to sign in or create an account
        </div>
        <EmailInput value={lock.get("email")}
          isValid={!lock.get("validateEmail") || lock.get("validEmail")}
          disabled={lock.get("submitting")}
          onChange={::this.handleEmailChange}
          gravatar={lock.getIn(["showOptions", "gravatar"])}
          autoFocus={lock.getIn(["showOptions", "focusInput"])} />
      </div>
    );
  }

  handleEmailChange(e) {
    const lockID = this.props.lock.get('id');
    const email = e.target.value;
    changeEmail(lockID, email);
  }
}
