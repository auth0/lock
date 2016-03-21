import React from 'react';
import Screen from '../lock/screen';
import { hasScreen } from '../database/index';
import { signUp } from '../database/actions';
import LoginSignUpTabs from '../database/login_sign_up_tabs';
import { renderSignedUpConfirmation } from '../database/signed_up_confirmation';
import SignUpPane from './sign_up_pane';
import SocialButtonsPane from '../field/social/social_buttons_pane';
import * as l from '../lock/index';
import PaneSeparator from '../lock/pane_separator';

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
    return (
      <LoginSignUpTabs
        key="loginsignup"
        lock={lock}
        loginTabLabel={this.t(lock, ["loginTabLabel"], {__textOnly: true})}
        signUpTabLabel={this.t(lock, ["signUpTabLabel"], {__textOnly: true})}
      />
    );
  }

  render({model}) {
    const social = l.getEnabledConnections(model, "social").count() > 0
      && <SocialButtonsPane lock={model} t={::this.t} signUp={true} />;

    const db =
      <SignUpPane
        emailInputPlaceholder={this.t(model, ["emailInputPlaceholder"], {__textOnly: true})}
        model={model}
        passwordInputPlaceholder={this.t(model, ["passwordInputPlaceholder"], {__textOnly: true})}
        usernameInputPlaceholder={this.t(model, ["usernameInputPlaceholder"], {__textOnly: true})}
      />;

    const separator = social
      && <PaneSeparator>{this.t(model, ["separatorText"])}</PaneSeparator>;

    return <div>{social}{separator}{db}</div>;
  }

}
