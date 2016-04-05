import React from 'react';
import Screen from '../lock/screen';
import ResetPasswordPane from './reset_password_pane';
import { authWithUsername } from './index';
import { cancelResetPassword, resetPassword } from './actions';

export default class ResetPassword extends Screen {

  constructor() {
    super("forgotPassword");
  }

  backHandler(m) {
    return cancelResetPassword;
  }

  submitHandler() {
    return resetPassword;
  }

  render({model}) {
    const headerText = this.t(model, ["headerText"]) || null;
    const header = headerText && <p>{headerText}</p>;

    return (
      <ResetPasswordPane
        emailInputPlaceholder={this.t(model, ["emailInputPlaceholder"], {__textOnly: true})}
        header={header}
        lock={model}
        usernameInputPlaceholder={this.t(model, ["usernameInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
