import React from 'react';
import Screen from '../lock/screen';
import EmailPane from '../cred/email/email_pane';
import PasswordPane from '../cred/password/password_pane';
import { getActivity } from './index';
import { signIn } from './actions';
import { renderSignedInConfirmation } from '../lock/signed_in_confirmation';
import LoginSignUpTabs from './login_sign_up_tabs';

export default class SignUp extends Screen {

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
        <LoginSignUpTabs lock={lock}/>
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
