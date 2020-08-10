import React from 'react';
import EmailPane from '../../field/email/email_pane';
import PasswordPane from '../../field/password/password_pane';
import UsernamePane from '../../field/username/username_pane';
import CustomInput from '../../field/custom_input';
import {
  additionalSignUpFields,
  databaseConnectionRequiresUsername,
  passwordStrengthPolicy
} from '../../connection/database/index';
import CaptchaPane from '../../field/captcha/captcha_pane';
import * as l from '../../core/index';
import { swapCaptcha } from '../../connection/database/actions';

export default class SignUpPane extends React.Component {
  render() {
    const {
      emailInputPlaceholder,
      instructions,
      i18n,
      model,
      onlyEmail,
      passwordInputPlaceholder,
      passwordStrengthMessages,
      usernameInputPlaceholder
    } = this.props;

    const headerText = instructions || null;
    const header = headerText && <p>{headerText}</p>;

    const usernamePane =
      !onlyEmail && databaseConnectionRequiresUsername(model) ? (
        <UsernamePane
          i18n={i18n}
          lock={model}
          placeholder={usernameInputPlaceholder}
          validateFormat={true}
        />
      ) : null;

    const fields =
      !onlyEmail &&
      additionalSignUpFields(model).map(x => (
        <CustomInput
          iconUrl={x.get('icon')}
          key={x.get('name')}
          model={model}
          name={x.get('name')}
          ariaLabel={x.get('ariaLabel')}
          options={x.get('options')}
          placeholder={x.get('placeholder')}
          placeholderHTML={x.get('placeholderHTML')}
          type={x.get('type')}
          validator={x.get('validator')}
          value={x.get('value')}
        />
      ));

    const captchaPane =
      l.captcha(model) && l.captcha(model).get('required') ? (
        <CaptchaPane i18n={i18n} lock={model} onReload={() => swapCaptcha(l.id(model), false)} />
      ) : null;

    const passwordPane = !onlyEmail && (
      <PasswordPane
        i18n={i18n}
        lock={model}
        placeholder={passwordInputPlaceholder}
        policy={passwordStrengthPolicy(model)}
        strengthMessages={passwordStrengthMessages}
      />
    );

    return (
      <div>
        {header}
        <EmailPane i18n={i18n} lock={model} placeholder={emailInputPlaceholder} />
        {usernamePane}
        {passwordPane}
        {captchaPane}
        {fields}
      </div>
    );
  }
}
