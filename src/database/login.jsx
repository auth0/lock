import React from 'react';
import Screen from '../lock/screen';
import LoginPane from './login_pane';
import { authWithUsername, hasActivity } from './index';
import { signInWithEmail, signInWithUsername } from './actions';
import { renderSignedInConfirmation } from '../lock/signed_in_confirmation';
import LoginSignUpTabs from './login_sign_up_tabs';

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
    return (
      <LoginPane
        emailInputPlaceholder={this.t(lock, ["emailInputPlaceholder"], {__textOnly: true})}
        forgotPasswordLabel={this.t(lock, ["forgotPasswordLabel"], {__textOnly: true})}
        lock={lock}
        passwordInputPlaceholder={this.t(lock, ["passwordInputPlaceholder"], {__textOnly: true})}
        usernameInputPlaceholder={this.t(lock, ["usernameInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
