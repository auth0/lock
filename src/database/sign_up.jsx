import React from 'react';
import Screen from '../lock/screen';
import EmailPane from '../cred/email/email_pane';
import PasswordPane from '../cred/password/password_pane';
import UsernamePane from '../cred/username/username_pane';
import { authWithUsername, hasActivity, passwordStrengthPolicy } from './index';
import { signUp } from './actions';
import LoginSignUpTabs from './login_sign_up_tabs';
import { renderSignedUpConfirmation } from './signed_up_confirmation';

export default class SignUp extends Screen {

  constructor() {
    super("signUp");
  }

  submitHandler() {
    return signUp;
  }

  renderAuxiliaryPane(lock) {
    return renderSignedUpConfirmation(lock);
  }

  renderTabs(lock) {
    return hasActivity(lock, "login")
      ? <LoginSignUpTabs key="loginsignup" lock={lock}/>
      : null;
  }

  render({lock}) {
    const usernamePane = authWithUsername(lock)
      ? <UsernamePane
          lock={lock}
          placeholder={this.t(lock, ["usernameInputPlaceholder"], {__textOnly: true})}
        />
      : null;

    return (
      <div>
        <EmailPane
          lock={lock}
          placeholder={this.t(lock, ["emailInputPlaceholder"], {__textOnly: true})}
        />
        {usernamePane}
        <PasswordPane
          lock={lock}
          placeholder={this.t(lock, ["passwordInputPlaceholder"], {__textOnly: true})}
          policy={passwordStrengthPolicy(lock)}
        />
      </div>
    );
  }

}
