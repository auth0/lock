import React from 'react';
import EmailPane from '../cred/email/email_pane';
import UsernamePane from '../cred/username/username_pane';
import PasswordPane from '../cred/password/password_pane';
import { showResetPasswordActivity } from './actions';
import { authWithUsername, hasActivity } from './index';
import * as l from '../lock/index';

export default class LoginPane extends React.Component {

  handleDontRememberPasswordClick(e) {
    e.preventDefault();
    showResetPasswordActivity(l.id(this.props.lock));
  }

  render() {
    const {
      emailInputPlaceholder,
      lock,
      passwordInputPlaceholder,
      usernameInputPlaceholder
    } = this.props;

    const credPane = authWithUsername(lock)
      ? <UsernamePane lock={lock} placeholder={usernameInputPlaceholder} />
      : <EmailPane lock={lock} placeholder={emailInputPlaceholder} />;

    const dontRememberPassword = hasActivity(lock, "resetPassword")
      ? <p className="auth0-lock-alternative">
          <a
            className="auth0-lock-alternative-link"
            href="#"
            onClick={::this.handleDontRememberPasswordClick}
          >
            Don't remember your password?
          </a>
        </p>
      : null;

    return (
      <div>
        {credPane}
        <PasswordPane lock={lock} placeholder={passwordInputPlaceholder} />
        {dontRememberPassword}
      </div>
    );
  }

}
