import Immutable, { Map } from 'immutable';
import { getEntity, read, swap, updateEntity } from '../../store/index';
import webApi from '../../core/web_api';
import {
  closeLock,
  logIn as coreLogIn,
  validateAndSubmit
} from '../../core/actions';
import * as l from '../../core/index';
import { startSubmit } from '../../core/actions';
import * as c from '../../field/index';
import  {
  authWithUsername,
  databaseConnectionName,
  setScreen,
  shouldAutoLogin,
  toggleTermsAcceptance as switchTermsAcceptance,
  additionalSignUpFields
} from './index';
// TODO: we should not depend on this from here
import { usernameStyle } from '../../engine/automatic';

export function logIn(id) {
  const m = read(getEntity, "lock", id);
  const usernameField = usernameStyle(m) === "username"
    ? "username"
    : "email";
  const username = c.getFieldValue(m, usernameField);

  coreLogIn(id, [usernameField, "password"], {
    connection: databaseConnectionName(m),
    username: username,
    password: c.getFieldValue(m, "password")
  });
}

export function signUp(id, options = {}) {
  let lock = read(getEntity, "lock", id);
  const fields = ["email", "password"];
  additionalSignUpFields(lock).forEach(x => fields.push(x.get("name")));
  if (authWithUsername(lock)) fields.push("username");
  let isSubmitting;
  [isSubmitting, lock] = startSubmit(id, fields);

  if (isSubmitting) {
    options.connection = databaseConnectionName(lock);
    options.email = c.email(lock);
    options.password = c.password(lock)
    options.autoLogin = shouldAutoLogin(lock);

    if (authWithUsername(lock)) {
      options.username = c.username(lock);
    }

    if (!additionalSignUpFields(lock).isEmpty()) {
      options.user_metadata = {};
      additionalSignUpFields(lock).forEach(x => {
        options.user_metadata[x.get("name")] = c.getFieldValue(lock, x.get("name"))
      });
    }

    webApi.signUp(
      id,
      options,
      (error, ...args) => {
        if (error) {
          setTimeout(() => signUpError(id, error), 250);
        } else {
          signUpSuccess(id, ...args);
        }
      }
    );
  }
}

function signUpSuccess(id, ...args) {
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
      (error, ...args) => {
        if (error) {
          setTimeout(() => autoLogInError(id, error), 250);
        } else {
          autoLogInSuccess(id, ...args);
        }
      }
    );
  }


  // TODO: should we autoclose here? I believe we should do it only if
  // no login screen is available.
  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, lock => l.setSubmitting(lock, false).set("signedUp", true));
  } else {
    closeLock(id, false);
  }
}

function signUpError(id, error) {
  const lock = read(getEntity, "lock", id);

  const errorMessage =
    l.ui.t(lock, ["error", "signUp", error.code], {__textOnly: true})
    || l.ui.t(lock, ["error", "signUp", "lock.fallback"], {__textOnly: true});

  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}


function autoLogInSuccess(id, ...args) {
  const lock = read(getEntity, "lock", id);
  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, lock => l.setLoggedIn(l.setSubmitting(lock, false), true));
    l.invokeLogInCallback(lock, null, ...args);
  } else {
    closeLock(id, false, lock => l.invokeLogInCallback(lock, null, ...args));
  }
}

function autoLogInError(id, error) {
  const lock = read(getEntity, "lock", id);
  const errorMessage = l.loginErrorMessage(lock, error);
  swap(updateEntity, "lock", id, m => (
    l.setSubmitting(setScreen(m, "login"), false, errorMessage)
  ));
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
        resetPasswordSuccess(id, ...args);
      }
    });
  });
}

function resetPasswordSuccess(id, ...args) {
  // TODO: needs to be auto closed?
  // TODO: what if login is not enabled?

  const m = read(getEntity, "lock", id);
  swap(updateEntity, "lock", id, m => (
    setScreen(l.setSubmitting(m, false), "login")
  ));

  // TODO: should be handled by box
  setTimeout(() => {
    const successMessage = l.ui.t(m, ["success", "resetPassword"], {__textOnly: true});
    swap(updateEntity, "lock", id, l.setGlobalSuccess, successMessage);
  }, 500);
}

function resetPasswordError(id, error) {
  const m = read(getEntity, "lock", id);

  const errorMessage =
    l.ui.t(m, ["error", "forgotPassword", error.code], {__textOnly: true})
    || l.ui.t(m, ["error", "forgotPassword", "lock.fallback"], {__textOnly: true});

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
