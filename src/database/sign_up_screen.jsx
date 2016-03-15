import React from 'react';
import Screen from '../lock/screen';
import { hasScreen } from './index';
import { signUp } from './actions';
import LoginSignUpTabs from './login_sign_up_tabs';
import { renderSignedUpConfirmation } from './signed_up_confirmation';
import SignUpPane from './sign_up_pane';

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
    return (
      <SignUpPane
        emailInputPlaceholder={this.t(model, ["emailInputPlaceholder"], {__textOnly: true})}
        model={model}
        passwordInputPlaceholder={this.t(model, ["passwordInputPlaceholder"], {__textOnly: true})}
        usernameInputPlaceholder={this.t(model, ["usernameInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
