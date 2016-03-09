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
      tabIndex,
      usernameInputPlaceholder
    } = this.props;

    const fieldPane = authWithUsername(lock)
      ? <UsernamePane
          lock={lock}
          placeholder={usernameInputPlaceholder}
          tabIndex={tabIndex}
        />
      : <EmailPane
          lock={lock}
          placeholder={emailInputPlaceholder}
          tabIndex={tabIndex}
        />;

    const dontRememberPassword = hasScreen(lock, "resetPassword")
      ? <p className="auth0-lock-alternative">
          <a
            className="auth0-lock-alternative-link"
            href={resetLink(lock, "#")}
            onClick={resetLink(lock) ? undefined : ::this.handleDontRememberPasswordClick}
            tabIndex={l.tabIndex(lock, tabIndex)}
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
  tabIndex: React.PropTypes.number.isRequired,
  usernameInputPlaceholder: React.PropTypes.string.isRequired
};

LoginPane.defaultProps = {
  tabIndex: 1
};
