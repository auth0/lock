import React from 'react';
import Screen from '../lock/screen';
import EmailPane from '../cred/email/email_pane';
import UsernamePane from '../cred/username/username_pane';
import PasswordPane from '../cred/password/password_pane';
import { authWithUsername, hasActivity } from './index';
import { signInWithEmail, signInWithUsername, showResetPasswordActivity } from './actions';
import { renderSignedInConfirmation } from '../lock/signed_in_confirmation';
import LoginSignUpTabs from './login_sign_up_tabs';
import * as l from '../lock/index';

export default class Login extends Screen {

  constructor() {
    super("login");
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  renderTabs(lock) {
    return hasActivity(lock, "signUp")
      ? <LoginSignUpTabs key="loginsignup" lock={lock}/>
      : null;
  }

  submitHandler(lock) {
    return authWithUsername(lock) ? signInWithUsername : signInWithEmail;
  }

  render({lock}) {
    const credPane = authWithUsername(lock)
      ? <UsernamePane
          lock={lock}
          placeholder={this.t(lock, ["usernameInputPlaceholder"], {__textOnly: true})}
        />
      : <EmailPane
          lock={lock}
          placeholder={this.t(lock, ["emailInputPlaceholder"], {__textOnly: true})}
        />;

    const dontRememberPassword = hasActivity(lock, "resetPassword")
      ? <p className="auth0-lock-alternative">
          <a
            className="auth0-lock-alternative-link"
            onClick={() => showResetPasswordActivity(l.id(lock))}
          >
            Don't remember your password?
          </a>
        </p>
     : null;

    return (
      <div>
        {credPane}
        <PasswordPane
          lock={lock}
          placeholder={this.t(lock, ["passwordInputPlaceholder"], {__textOnly: true})}
        />
        {dontRememberPassword}
      </div>
    );
  }

}
