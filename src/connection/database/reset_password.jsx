import React from 'react';
import Screen from '../../core/screen';
import ResetPasswordPane from './reset_password_pane';
import { authWithUsername, hasScreen } from './index';
import { cancelResetPassword, resetPassword } from './actions';
import { renderPasswordResetConfirmation } from './password_reset_confirmation';
import { databaseUsernameValue } from '../../connection/database/index';
import { isEnterpriseDomain } from '../../connection/enterprise';
import * as i18n from '../../i18n';
import * as l from '../../core/index';
import { swap, updateEntity } from '../../store/index';
import { isEmail, setEmail } from '../../field/email';
import { getField } from '../../field';

const Component = ({ i18n, model }) => {
  const headerText = i18n.html('forgotPasswordInstructions') || null;
  const header = headerText && <p>{headerText}</p>;
  const connectionResolver = l.connectionResolver(model);

  // When using a custom connection resolver, `usernameStyle` is always 'username' (as opposed to 'email').
  // If the user has entered an email address as the username, and a custom resolver is being used, copy the
  // value from the 'username' field to the 'email' field so that `EmailPane` can render it.
  if (connectionResolver) {
    const field = getField(model, 'username');
    const value = field.get('value', '');

    swap(updateEntity, 'lock', l.id(model), setEmail, isEmail(value, false) ? value : '', false);
  }

  return (
    <ResetPasswordPane
      emailInputPlaceholder={i18n.str('emailInputPlaceholder')}
      header={header}
      i18n={i18n}
      lock={model}
    />
  );
};

export default class ResetPassword extends Screen {
  constructor() {
    super('forgotPassword');
  }

  backHandler(m) {
    return hasScreen(m, 'login') ? cancelResetPassword : undefined;
  }

  submitButtonLabel(m) {
    return i18n.str(m, ['forgotPasswordSubmitLabel']);
  }

  getScreenTitle(m) {
    return i18n.str(m, 'forgotPasswordTitle');
  }
  isSubmitDisabled(m) {
    const tryingToResetPasswordWithEnterpriseEmail = isEnterpriseDomain(
      m,
      databaseUsernameValue(m, { emailFirst: true })
    );
    if (tryingToResetPasswordWithEnterpriseEmail) {
      setTimeout(() => {
        swap(
          updateEntity,
          'lock',
          l.id(m),
          l.setGlobalError,
          i18n.str(m, ['error', 'forgotPassword', 'enterprise_email'])
        );
      }, 50);
    } else {
      swap(updateEntity, 'lock', l.id(m), l.clearGlobalError);
    }
    return tryingToResetPasswordWithEnterpriseEmail;
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
