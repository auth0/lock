import React from 'react';
import Screen from '../lock/screen';
import EmailPane from '../cred/email/email_pane';
import UsernamePane from '../cred/username/username_pane';
import PasswordPane from '../cred/password/password_pane';
import PasswordConfirmationPane from '../cred/password-confirmation/password_confirmation_pane';
import { authWithUsername } from './index';
import { cancelResetPassword, resetPassword } from './actions';

export default class ResetPassword extends Screen {

  constructor() {
    super("resetPassword");
  }

  backHandler() {
    return cancelResetPassword;
  }

  submitHandler() {
    return resetPassword;
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

    return (
      <div>
        {credPane}
        <PasswordPane
          lock={lock}
          placeholder={this.t(lock, ["passwordInputPlaceholder"], {__textOnly: true})}
        />
        <PasswordConfirmationPane
          lock={lock}
          placeholder={this.t(lock, ["passwordConfirmationInputPlaceholder"], {__textOnly: true})}
        />
      </div>
    );
  }

}
