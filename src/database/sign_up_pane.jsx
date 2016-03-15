import React from 'react';
import EmailPane from '../field/email/email_pane';
import PasswordPane from '../field/password/password_pane';
import UsernamePane from '../field/username/username_pane';
import { authWithUsername, passwordStrengthPolicy } from './index';

export default class SignUpPane extends React.Component {

  render() {
    const {
      emailInputPlaceholder,
      model,
      passwordInputPlaceholder,
      usernameInputPlaceholder
    } = this.props;

    const usernamePane = authWithUsername(model)
      ? <UsernamePane
          lock={model}
          placeholder={usernameInputPlaceholder}
        />
      : null;

    return (
      <div>
        <EmailPane
          lock={model}
          placeholder={emailInputPlaceholder}
        />
        {usernamePane}
        <PasswordPane
          lock={model}
          placeholder={passwordInputPlaceholder}
          policy={passwordStrengthPolicy(model)}
        />
      </div>
    );
  }

}
