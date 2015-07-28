import React from 'react';
import EmailInput from '../credentials/email_input';
import { email, visiblyInvalidEmail } from '../credentials/index';
import { changeEmail } from './actions';
import { ui } from '../lock/index';

export default class AskEmail extends React.Component {
  render() {
    const { lock } = this.props;

    return (
      <div className="auth0-lock-passwordless auth0-lock-mode">
        <div className="auth0-lock-form auth0-lock-passwordless">
          <p>Enter your email address to sign in or create an account.</p>
          <div className="auth0-lock-input-block-email auth0-lock-input-block">
            <EmailInput value={email(lock)}
              isValid={!visiblyInvalidEmail(lock)}
              disabled={lock.get("submitting")}
              onChange={::this.handleEmailChange}
              gravatar={ui.gravatar(lock)}
              autoFocus={ui.focusInput(lock)} />
          </div>
        </div>
      </div>
    );
  }

  handleEmailChange(e) {
    const lockID = this.props.lock.get('id');
    const email = e.target.value;
    changeEmail(lockID, email);
  }
}
