import React from 'react';
import EmailInput from '../credentials/email_input';
import { email, visiblyInvalidEmail } from '../credentials/index';
import { changeEmail } from './actions';

export default class AskEmail extends React.Component {
  render() {
    const { lock } = this.props;
    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          Enter your email address to sign in or create an account
        </div>
        <EmailInput value={email(lock)}
          isValid={!visiblyInvalidEmail(lock)}
          disabled={lock.get("submitting")}
          onChange={::this.handleEmailChange}
          gravatar={lock.getIn(["ui", "gravatar"])}
          autoFocus={lock.getIn(["ui", "focusInput"])} />
      </div>
    );
  }

  handleEmailChange(e) {
    const lockID = this.props.lock.get('id');
    const email = e.target.value;
    changeEmail(lockID, email);
  }
}
