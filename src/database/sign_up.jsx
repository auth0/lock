import React from 'react';
import Screen from '../lock/screen';
import EmailPane from '../field/email/email_pane';
import PasswordPane from '../field/password/password_pane';
import UsernamePane from '../field/username/username_pane';
import { authWithUsername, hasScreen, passwordStrengthPolicy } from './index';
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
    return hasScreen(lock, "login")
      ? <LoginSignUpTabs
          key="loginsignup"
          lock={lock}
          loginTabLabel={this.t(lock, ["loginTabLabel"], {__textOnly: true})}
          signUpTabLabel={this.t(lock, ["signUpTabLabel"], {__textOnly: true})}
        />
      : null;
  }

  render({model}) {
    const usernamePane = authWithUsername(model)
      ? <UsernamePane
          lock={model}
          placeholder={this.t(model, ["usernameInputPlaceholder"], {__textOnly: true})}
        />
      : null;

    return (
      <div>
        <EmailPane
          lock={model}
          placeholder={this.t(model, ["emailInputPlaceholder"], {__textOnly: true})}
        />
        {usernamePane}
        <PasswordPane
          lock={model}
          placeholder={this.t(model, ["passwordInputPlaceholder"], {__textOnly: true})}
          policy={passwordStrengthPolicy(model)}
        />
      </div>
    );
  }

}
