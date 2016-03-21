import React from 'react';
import EmailPane from '../field/email/email_pane';
import PasswordPane from '../field/password/password_pane';
import UsernamePane from '../field/username/username_pane';
import {
  authWithUsername,
  signUpFields,
  passwordStrengthPolicy,
} from '../database/index';
import { changeField } from '../field/actions';
import TextInput from '../ui/input/text_input';
import { isFieldVisiblyInvalid } from '../field/index';

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
    const fields = signUpFields(model).entrySeq().map(([k,v]) => (
      <TextInput
        isValid={!isFieldVisiblyInvalid(model, k)}
        key={k}
        onChange={e => changeField(model.get("id"), k, e.target.value, v.get("validator"))}
        placeholder={v.get("placeholder")}
      />
    ));

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
        {fields}
      </div>
    );
  }

}
