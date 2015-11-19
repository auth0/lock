import React from 'react';
import Screen from '../lock/screen';
import EmailPane from '../cred/email/email_pane';
import UsernamePane from '../cred/username/username_pane';
import PasswordPane from '../cred/password/password_pane';
import { authWithUsername, getActivity } from './index';
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

  submitHandler(lock) {
    return authWithUsername(lock) ? signInWithUsername : signInWithEmail;
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
        />

    return (
      <div>
        <LoginSignUpTabs lock={lock}/>
        {credPane}
        <PasswordPane
          lock={lock}
          placeholder={this.t(lock, ["passwordInputPlaceholder"], {__textOnly: true})}
        />
      </div>
    );
  }

}
