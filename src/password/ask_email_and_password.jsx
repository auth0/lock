import React from 'react';
import Screen from '../lock/screen';
import EmailPane from '../cred/email/email_pane';
import PasswordPane from '../cred/password/password_pane';
import { signIn } from './actions';
import { renderSignedInConfirmation } from '../lock/signed_in_confirmation';

export default class AskEmailAndPassword extends Screen {

  constructor() {
    super("emailAndPassword");
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  submitHandler() {
    return signIn;
  }

  render({lock}) {
    return (
      <div>
        <EmailPane
          lock={lock}
          placeholder={this.t(lock, ["emailInputPlaceholder"], {__textOnly: true})}
        />
        <PasswordPane
          lock={lock}
          placeholder={this.t(lock, ["passwordInputPlaceholder"], {__textOnly: true})}
        />
      </div>
    );
  }

}
