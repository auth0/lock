import React from 'react';
import EmailPane from '../../field/email/email_pane';
import UsernamePane from '../../field/username/username_pane';
import PasswordPane from '../../field/password/password_pane';
import { showResetPasswordActivity } from './actions';
import { authWithUsername, hasScreen, forgotPasswordLink } from './index';
import * as l from '../../core/index';

export default class LoginPane extends React.Component {

  handleDontRememberPasswordClick(e) {
    e.preventDefault();
    showResetPasswordActivity(l.id(this.props.lock));
  }

  render() {
    const {
      emailInputPlaceholder,
      forgotPasswordAction,
      i18n,
      instructions,
      lock,
      passwordInputPlaceholder,
      showForgotPasswordLink,
      showPassword,
      usernameInputPlaceholder,
      usernameStyle
    } = this.props;

    const headerText = instructions || null;
    const header = headerText && <p>{headerText}</p>;

    const fieldPane = usernameStyle === "email"
      ? <EmailPane
          i18n={i18n}
          lock={lock}
          placeholder={emailInputPlaceholder}
        />
      : <UsernamePane
          i18n={i18n}
          lock={lock}
          placeholder={usernameInputPlaceholder}
          usernameStyle={usernameStyle}
          validateFormat={true}
        />

    const passwordPane = showPassword
      ? <PasswordPane
          i18n={i18n}
          lock={lock}
          placeholder={passwordInputPlaceholder}
        />
      : null;

    const dontRememberPassword = showForgotPasswordLink && hasScreen(lock, "forgotPassword")
      ? <p className="auth0-lock-alternative">
          <a
            className="auth0-lock-alternative-link"
            href={forgotPasswordLink(lock, "#")}
            onClick={forgotPasswordLink(lock) ? undefined : ::this.handleDontRememberPasswordClick}
          >
            {forgotPasswordAction}
          </a>
        </p>
      : null;

    return <div>{header}{fieldPane}{passwordPane}{dontRememberPassword}</div>;
  }

}

LoginPane.propTypes = {
  emailInputPlaceholder: React.PropTypes.string.isRequired,
  forgotPasswordAction: React.PropTypes.string.isRequired,
  i18n: React.PropTypes.object.isRequired,
  instructions: React.PropTypes.any,
  lock: React.PropTypes.object.isRequired,
  passwordInputPlaceholder: React.PropTypes.string.isRequired,
  showForgotPasswordLink: React.PropTypes.bool.isRequired,
  showPassword: React.PropTypes.bool.isRequired,
  usernameInputPlaceholder: React.PropTypes.string.isRequired,
  usernameStyle: React.PropTypes.oneOf(["any", "email", "username"])
};
