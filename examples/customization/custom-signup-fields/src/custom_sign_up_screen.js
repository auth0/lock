import React from 'react';
import SignUpScreen from 'auth0-lock-next/lib/database/sign_up_screen';
import SignUpPane from 'auth0-lock-next/lib/database/sign_up_pane';
import CustomSignUpPane from './custom_sign_up_pane';
import { customSignUp } from './actions';

export default class CustomSignUpScreen extends SignUpScreen {

  submitHandler() {
    // This method returns a function that will be invoked when the form is
    // submitted.
    return customSignUp;
  }

  render({model}) {
    // This method returns a ReactElement that will be rendered in the main
    // content area of Lock (between the header and the submit button)
    return (
      <div className="custom-sign-up-screen">
        <SignUpPane
          emailInputPlaceholder={this.t(model, ["emailInputPlaceholder"], {__textOnly: true})}
          model={model}
          passwordInputPlaceholder={this.t(model, ["passwordInputPlaceholder"], {__textOnly: true})}
          usernameInputPlaceholder={this.t(model, ["usernameInputPlaceholder"], {__textOnly: true})}
        />
        <CustomSignUpPane model={model} />
      </div>
    )
  }

}
