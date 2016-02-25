import React from 'react';
import Screen from '../lock/screen';
import ResetPasswordPane from './reset_password_pane';
import { authWithUsername } from './index';
import { cancelResetPassword, resetPassword } from './actions';

export default class ResetPassword extends Screen {

  constructor() {
    super("resetPassword");
  }

  backHandler(m) {
    return cancelResetPassword;
  }

  submitHandler() {
    return resetPassword;
  }

  render({lock}) {

    return (
      <ResetPasswordPane
        emailInputPlaceholder={this.t(lock, ["emailInputPlaceholder"], {__textOnly: true})}
        lock={lock}
        usernameInputPlaceholder={this.t(lock, ["usernameInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
