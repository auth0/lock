import Immutable, { Map } from 'immutable';
import { getEntity, read, swap, updateEntity } from '../../store/index';
import webApi from '../../core/web_api';
import { closeLock, logIn as coreLogIn, logInSuccess, validateAndSubmit } from '../../core/actions';
import * as l from '../../core/index';
import * as c from '../../field/index';
import {
  databaseConnectionName,
  databaseConnectionRequiresUsername,
  databaseLogInWithEmail,
  hasScreen,
  setScreen,
  shouldAutoLogin,
  toggleTermsAcceptance as switchTermsAcceptance,
  additionalSignUpFields
} from './index';
import * as i18n from '../../i18n';

export function logIn(id, needsMFA = false) {
  const m = read(getEntity, 'lock', id);
  const usernameField = databaseLogInWithEmail(m) ? 'email' : 'username';
  const username = c.getFieldValue(m, usernameField);
  const customResolvedConnection = l.resolvedConnection(m);
  let connectionName = databaseConnectionName(m);
  if (customResolvedConnection) {
    connectionName = customResolvedConnection.name;
  }
  const params = {
    connection: connectionName,
    username: username,
    password: c.getFieldValue(m, 'password')
  };

  const fields = [usernameField, 'password'];

  const mfaCode = c.getFieldValue(m, 'mfa_code');
  if (needsMFA) {
    params['mfa_code'] = mfaCode;
    fields.push('mfa_code');
  }

  coreLogIn(id, fields, params, (id, error, fields, next) => {
    if (error.error === 'a0.mfa_required') {
      return showLoginMFAActivity(id);
    }

    return next();
  });
}

export function signUp(id) {
  const m = read(getEntity, 'lock', id);
  const fields = ['email', 'password'];
  if (databaseConnectionRequiresUsername(m)) fields.push('username');
  additionalSignUpFields(m).forEach(x => fields.push(x.get('name')));

  validateAndSubmit(id, fields, m => {
    const params = {
      connection: databaseConnectionName(m),
      email: c.getFieldValue(m, 'email'),
      password: c.getFieldValue(m, 'password'),
      autoLogin: shouldAutoLogin(m)
    };

    if (databaseConnectionRequiresUsername(m)) {
      params.username = c.getFieldValue(m, 'username');
    }

    if (!additionalSignUpFields(m).isEmpty()) {
      params.user_metadata = {};
      additionalSignUpFields(m).forEach(x => {
        params.user_metadata[x.get('name')] = c.getFieldValue(m, x.get('name'));
      });
    }

    webApi.signUp(id, params, (error, result, popupHandler, ...args) => {
      if (error) {
        if (!!popupHandler) {
          popupHandler._current_popup.kill();
        }
        setTimeout(() => signUpError(id, error), 250);
      } else {
        signUpSuccess(id, result, popupHandler, ...args);
      }
    });
  });
}

function signUpSuccess(id, result, popupHandler) {
  const lock = read(getEntity, 'lock', id);

  if (shouldAutoLogin(lock)) {
    swap(updateEntity, 'lock', id, m => m.set('signedUp', true));

    // TODO: check options, redirect is missing
    const options = {
      connection: databaseConnectionName(lock),
      username: c.email(lock),
      password: c.password(lock)
    };

    if (!!popupHandler) {
      options.popupHandler = popupHandler;
    }

    return webApi.logIn(id, options, l.auth.params(lock).toJS(), (error, ...args) => {
      if (error) {
        setTimeout(() => autoLogInError(id, error), 250);
      } else {
        logInSuccess(id, ...args);
      }
    });
  }

  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, 'lock', id, lock => l.setSubmitting(lock, false).set('signedUp', true));
  } else {
    closeLock(id, false);
  }
}

function signUpError(id, error) {
  const m = read(getEntity, 'lock', id);

  const invalidPasswordKeys = {
    PasswordDictionaryError: 'password_dictionary_error',
    PasswordNoUserInfoError: 'password_no_user_info_error',
    PasswordStrengthError: 'password_strength_error'
  };

  const errorKey =
    (error.code === 'invalid_password' && invalidPasswordKeys[error.name]) || error.code;

  const errorMessage =
    i18n.html(m, ['error', 'signUp', errorKey]) ||
    i18n.html(m, ['error', 'signUp', 'lock.fallback']);

  swap(updateEntity, 'lock', id, l.setSubmitting, false, errorMessage);
}

function autoLogInError(id, error) {
  swap(updateEntity, 'lock', id, m => {
    const errorMessage = l.loginErrorMessage(m, error);
    if (hasScreen(m, 'login')) {
      return l.setSubmitting(setScreen(m, 'login'), false, errorMessage);
    } else {
      return l.setSubmitting(m, false, errorMessage);
    }
  });
}

export function resetPassword(id) {
  validateAndSubmit(id, ['email'], m => {
    const params = {
      connection: databaseConnectionName(m),
      email: c.getFieldValue(m, 'email')
    };

    webApi.resetPassword(id, params, (error, ...args) => {
      if (error) {
        setTimeout(() => resetPasswordError(id, error), 250);
      } else {
        resetPasswordSuccess(id);
      }
    });
  });
}

function resetPasswordSuccess(id) {
  const m = read(getEntity, 'lock', id);
  if (hasScreen(m, 'login')) {
    swap(
      updateEntity,
      'lock',
      id,
      m => setScreen(l.setSubmitting(m, false), 'login', ['']) // array with one empty string tells the function to not clear any field
    );

    // TODO: should be handled by box
    setTimeout(() => {
      const successMessage = i18n.html(m, ['success', 'forgotPassword']);
      swap(updateEntity, 'lock', id, l.setGlobalSuccess, successMessage);
    }, 500);
  } else {
    if (l.ui.autoclose(m)) {
      closeLock(id);
    } else {
      swap(updateEntity, 'lock', id, m => l.setSubmitting(m, false).set('passwordResetted', true));
    }
  }
}

function resetPasswordError(id, error) {
  const m = read(getEntity, 'lock', id);

  const errorMessage =
    i18n.html(m, ['error', 'forgotPassword', error.code]) ||
    i18n.html(m, ['error', 'forgotPassword', 'lock.fallback']);

  swap(updateEntity, 'lock', id, l.setSubmitting, false, errorMessage);
}

export function showLoginActivity(id, fields = ['password']) {
  swap(updateEntity, 'lock', id, setScreen, 'login', fields);
}

export function showSignUpActivity(id, fields = ['password']) {
  swap(updateEntity, 'lock', id, setScreen, 'signUp', fields);
}

export function showResetPasswordActivity(id, fields = ['password']) {
  swap(updateEntity, 'lock', id, setScreen, 'forgotPassword', fields);
}

export function cancelResetPassword(id) {
  return showLoginActivity(id);
}

export function cancelMFALogin(id) {
  return showLoginActivity(id);
}

export function toggleTermsAcceptance(id) {
  swap(updateEntity, 'lock', id, switchTermsAcceptance);
}

export function showLoginMFAActivity(id, fields = ['mfa_code']) {
  swap(updateEntity, 'lock', id, setScreen, 'mfaLogin', fields);
}
