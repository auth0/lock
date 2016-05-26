import React from 'react';
import Screen from '../../core/screen';
import ResetPasswordPane from './reset_password_pane';
import { authWithUsername, hasScreen } from './index';
import { cancelResetPassword, resetPassword } from './actions';
import { renderPasswordResetConfirmation } from './password_reset_confirmation';

const Component = ({model, t}) => {
  const headerText = t("forgotPasswordInstructions") || null;
  const header = headerText && <p>{headerText}</p>;

  return (
    <ResetPasswordPane
      emailInputPlaceholder={t("emailInputPlaceholder", {__textOnly: true})}
      header={header}
      lock={model}
    />
  );
};

export default class ResetPassword extends Screen {

  constructor() {
    super("forgotPassword");
  }

  backHandler(m) {
    return hasScreen(m, "login") ? cancelResetPassword : undefined;
  }

  submitHandler() {
    return resetPassword;
  }

  renderAuxiliaryPane(m) {
    return renderPasswordResetConfirmation(m);
  }

  render() {
    return Component;
  }

}
