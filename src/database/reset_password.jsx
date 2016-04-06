import React from 'react';
import Screen from '../core/screen';
import ResetPasswordPane from './reset_password_pane';
import { authWithUsername } from './index';
import { cancelResetPassword, resetPassword } from './actions';

const Component = ({model, t}) => {
  const headerText = t("headerText") || null;
  const header = headerText && <p>{headerText}</p>;

  return (
    <ResetPasswordPane
      emailInputPlaceholder={t("emailInputPlaceholder", {__textOnly: true})}
      header={header}
      lock={model}
      usernameInputPlaceholder={t("usernameInputPlaceholder", {__textOnly: true})}
    />
  );
};

export default class ResetPassword extends Screen {

  constructor() {
    super("forgotPassword");
  }

  backHandler(m) {
    return cancelResetPassword;
  }

  submitHandler() {
    return resetPassword;
  }

  render() {
    return Component;
  }

}
