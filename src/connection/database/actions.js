import Immutable, { Map } from 'immutable';
import { getEntity, read, swap, updateEntity } from '../../store/index';
import webApi from '../../core/web_api';
import {
  closeLock,
  logIn as coreLogIn,
  logInSuccess,
  validateAndSubmit
} from '../../core/actions';
import * as l from '../../core/index';
import * as c from '../../field/index';
import  {
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

export function logIn(id) {
  const m = read(getEntity, "lock", id);
  const usernameField = databaseLogInWithEmail(m) ? "email" : "username";
  const username = c.getFieldValue(m, usernameField);

  coreLogIn(id, [usernameField, "password"], {
    connection: databaseConnectionName(m),
    username: username,
    password: c.getFieldValue(m, "password")
  });
}

export function signUp(id) {
  const m = read(getEntity, "lock", id);
  const fields = ["email", "password"];
  if (databaseConnectionRequiresUsername(m)) fields.push("username");
  additionalSignUpFields(m).forEach(x => fields.push(x.get("name")));

  validateAndSubmit(id, fields, m => {
    const params = {
      connection: databaseConnectionName(m),
      email: c.getFieldValue(m, "email"),
      password: c.getFieldValue(m, "password"),
      autoLogin: shouldAutoLogin(m)
    };

    if (databaseConnectionRequiresUsername(m)) {
      params.username = c.getFieldValue(m, "username");
    }

    if (!additionalSignUpFields(m).isEmpty()) {
      params.user_metadata = {};
      additionalSignUpFields(m).forEach(x => {
        params.user_metadata[x.get("name")] = c.getFieldValue(m, x.get("name"));
      });
    }

    webApi.signUp(id, params, (error, ...args) => {
      if (error) {
        setTimeout(() => signUpError(id, error), 250);
      } else {
        signUpSuccess(id);
      }
    });
  });
}

function signUpSuccess(id) {
  const lock = read(getEntity, "lock", id);

  if (shouldAutoLogin(lock)) {
    swap(updateEntity, "lock", id, m => m.set("signedUp", true));

    // TODO: check options, redirect is missing
    const options = {
      connection: databaseConnectionName(lock),
      username: c.email(lock),
      password: c.password(lock)
    };

    return webApi.logIn(
      id,
      options,
      l.auth.params(lock).toJS(),
      (error, ...args) => {
        if (error) {
          setTimeout(() => autoLogInError(id, error), 250);
        } else {
          logInSuccess(id, ...args);
        }
      }
    );
  }

  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, lock => l.setSubmitting(lock, false).set("signedUp", true));
  } else {
    closeLock(id, false);
  }

}

function signUpError(id, error) {
  const m = read(getEntity, "lock", id);

  const invalidPasswordKeys = {
    PasswordDictionaryError: "password_dictionary_error",
    PasswordNoUserInfoError: "password_no_user_info_error",
    PasswordStrengthError: "password_strength_error"
  };

  const errorKey = (error.code === "invalid_password"
    && invalidPasswordKeys[error.details.name])
    || error.code;

  const errorMessage = i18n.str(m, ["error", "signUp", errorKey])
    || i18n.str(m, ["error", "signUp", "lock.fallback"]);

  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}


function autoLogInError(id, error) {
  swap(updateEntity, "lock", id, m => {
    if (hasScreen(m, "login")) {
      const errorMessage = l.loginErrorMessage(m, error);
      return l.setSubmitting(setScreen(m, "login"), false, errorMessage);
    } else {
      const stopError = new Error("Autologin failed and no the login screen is not allowed.");
      stopError.code = "autologin_error";
      stopError.origin = error;
      return l.setSubmitting(l.stop(m, stopError), false);
    }
  });
}

export function resetPassword(id) {
  validateAndSubmit(id, ["email"], m => {
    const params = {
      connection: databaseConnectionName(m),
      email: c.getFieldValue(m, "email")
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
  const m = read(getEntity, "lock", id);
  if (hasScreen(m, "login")) {
    swap(updateEntity, "lock", id, m => (
      setScreen(l.setSubmitting(m, false), "login")
    ));

    // TODO: should be handled by box
    setTimeout(() => {
      const successMessage = i18n.str(m, ["success", "forgotPassword"]);
      swap(updateEntity, "lock", id, l.setGlobalSuccess, successMessage);
    }, 500);
  } else {
    if (l.ui.autoclose(m)) {
      closeLock(id);
    } else {
      swap(updateEntity, "lock", id, m => (
        l.setSubmitting(m, false).set("passwordResetted", true)
      ));
    }
  }
}

function resetPasswordError(id, error) {
  const m = read(getEntity, "lock", id);

  const errorMessage = i18n.str(m, ["error", "forgotPassword", error.code])
    || i18n.str(m, ["error", "forgotPassword", "lock.fallback"]);

  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function showLoginActivity(id, fields = ["password"]) {
  swap(updateEntity, "lock", id, setScreen, "login", fields);
}

export function showSignUpActivity(id, fields = ["password"]) {
  swap(updateEntity, "lock", id, setScreen, "signUp", fields);
}

export function showResetPasswordActivity(id, fields = ["password"]) {
  swap(updateEntity, "lock", id, setScreen, "forgotPassword", fields);
}

export function cancelResetPassword(id) {
 return showLoginActivity(id);
}

export function toggleTermsAcceptance(id) {
  swap(updateEntity, "lock", id, switchTermsAcceptance);
}
