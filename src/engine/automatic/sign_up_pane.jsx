import React from 'react';
import EmailPane from '../../field/email/email_pane';
import PasswordPane from '../../field/password/password_pane';
import UsernamePane from '../../field/username/username_pane';
import {
  authWithUsername,
  additionalSignUpFields,
  passwordStrengthPolicy,
} from '../../connection/database/index';
import CustomInput from '../../field/custom_input';

export default class SignUpPane extends React.Component {

  render() {
    const {
      emailInputPlaceholder,
      model,
      onlyEmail,
      passwordInputPlaceholder,
      passwordStrengthMessages,
      usernameInputPlaceholder
    } = this.props;

    const usernamePane = !onlyEmail && authWithUsername(model)
      ? <UsernamePane
          autofocus={false}
          lock={model}
          placeholder={usernameInputPlaceholder}
        />
      : null;

    const fields = !onlyEmail && additionalSignUpFields(model).map(x => (
      <CustomInput
        iconUrl={x.get("icon")}
        key={x.get("name")}
        model={model}
        name={x.get("name")}
        options={x.get("options")}
        placeholder={x.get("placeholder")}
        type={x.get("type")}
        validatior={x.get("validator")}
      />
    ));

    const passwordPane = !onlyEmail
      && <PasswordPane
           lock={model}
           placeholder={passwordInputPlaceholder}
           policy={passwordStrengthPolicy(model)}
           strengthMessages={passwordStrengthMessages}
         />;

    return (
      <div>
        <EmailPane
          lock={model}
          placeholder={emailInputPlaceholder}
        />
        {usernamePane}
        {passwordPane}
        {fields}
      </div>
    );
  }

}
