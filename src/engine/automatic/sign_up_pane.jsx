import React from 'react';
import EmailPane from '../../field/email/email_pane';
import PasswordPane from '../../field/password/password_pane';
import UsernamePane from '../../field/username/username_pane';
import {
  authWithUsername,
  additionalSignUpFields,
  passwordStrengthPolicy,
} from '../../database/index';
import { changeField } from '../../field/actions';
import TextInput from '../../ui/input/text_input';
import { isFieldVisiblyInvalid } from '../../field/index';

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
          autofocus={false}
          lock={model}
          placeholder={usernameInputPlaceholder}
        />
      : null;
    const fields = additionalSignUpFields(model).map(x => (
      <TextInput
        iconUrl={x.get("icon")}
        isValid={!isFieldVisiblyInvalid(model, x.get("name"))}
        key={x.get("name")}
        name={x.get("name")}
        onChange={e => changeField(model.get("id"), x.get("name"), e.target.value, x.get("validator"))}
        placeholder={x.get("placeholder")}
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
