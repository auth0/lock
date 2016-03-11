import React from 'react';
import EmailPane from '../field/email/email_pane';
import UsernamePane from '../field/username/username_pane';
import PasswordPane from '../field/password/password_pane';
import { showResetPasswordActivity } from './actions';
import { authWithUsername, hasScreen, resetLink } from './index';
import * as l from '../lock/index';

export default class LoginPane extends React.Component {

  handleDontRememberPasswordClick(e) {
    e.preventDefault();
    showResetPasswordActivity(l.id(this.props.lock));
  }

  render() {
    const {
      emailInputPlaceholder,
      forgotPasswordLabel,
      lock,
      passwordInputPlaceholder,
      usernameInputPlaceholder
    } = this.props;

    const fieldPane = authWithUsername(lock)
      ? <UsernamePane
          lock={lock}
          placeholder={usernameInputPlaceholder}
        />
      : <EmailPane
          lock={lock}
          placeholder={emailInputPlaceholder}
        />;

    const dontRememberPassword = hasScreen(lock, "resetPassword")
      ? <p className="auth0-lock-alternative">
          <a
            className="auth0-lock-alternative-link"
            href={resetLink(lock, "#")}
            onClick={resetLink(lock) ? undefined : ::this.handleDontRememberPasswordClick}
          >
            {forgotPasswordLabel}
          </a>
        </p>
      : null;

    return (
      <div>
        {fieldPane}
        <PasswordPane lock={lock} placeholder={passwordInputPlaceholder} />
        {dontRememberPassword}
      </div>
    );
  }

}

LoginPane.propTypes = {
  emailInputPlaceholder: React.PropTypes.string.isRequired,
  forgotPasswordLabel: React.PropTypes.string.isRequired,
  lock: React.PropTypes.object.isRequired,
  passwordInputPlaceholder: React.PropTypes.string.isRequired,
  usernameInputPlaceholder: React.PropTypes.string.isRequired
};
