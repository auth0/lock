import { Map } from 'immutable';
import { getEntity, read, swap, updateEntity } from '../store/index';
import webApi from '../lock/web_api';
import { closeLock } from '../lock/actions';
import * as l from '../lock/index';
import * as c from '../field/index';
import  {
  authWithUsername,
  databaseConnectionName,
  setScreen,
  shouldAutoLogin
} from './index';

export function signInWithUsername(id) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if (c.isFieldValid(lock, "username") && c.isFieldValid(lock, "password")) {
      return l.setSubmitting(lock, true);
    } else {
      lock = c.setFieldShowInvalid(lock, "username", !c.isFieldValid(lock, "username"));
      lock = c.setFieldShowInvalid(lock, "password", !c.isFieldValid(lock, "password"));
      return lock;
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    // TODO: check options, redirect is missing
    const options = l.withAuthOptions(lock, {
      connection: databaseConnectionName(lock),
      username: c.username(lock),
      password: c.password(lock)
    });

    webApi.signIn(
      id,
      options,
      (error, ...args) => {
        if (error) {
          setTimeout(() => signInError(id, error), 250);
        } else {
          signInSuccess(id, ...args);
        }
      }
    );
  }
}

export function signInWithEmail(id) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if (c.isFieldValid(lock, "email") && c.isFieldValid(lock, "password")) {
      return l.setSubmitting(lock, true);
    } else {
      lock = c.setFieldShowInvalid(lock, "email", !c.isFieldValid(lock, "email"));
      lock = c.setFieldShowInvalid(lock, "password", !c.isFieldValid(lock, "password"));
      return lock;
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    // TODO: check options, redirect is missing
    const options = l.withAuthOptions(lock, {
      connection: databaseConnectionName(lock),
      username: c.email(lock),
      password: c.password(lock)
    });

    webApi.signIn(
      id,
      options,
      (error, ...args) => {
        if (error) {
          setTimeout(() => signInError(id, error), 250);
        } else {
          signInSuccess(id, ...args);
        }
      }
    );
  }
}

function signInSuccess(id, ...args) {
  const lock = read(getEntity, "lock", id);
  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, lock => l.setSignedIn(l.setSubmitting(lock, false), true));
    l.invokeSignInCallback(lock, null, ...args);
  } else {
    closeLock(id, false, lock => l.invokeSignInCallback(lock, null, ...args));
  }
}

function signInError(id, error) {
  const lock = read(getEntity, "lock", id);
  // TODO: proper error message
  // const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {field: field, __textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {field: field, __textOnly: true});
  const errorMessage = "Invalid email or password";
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);

  l.invokeSignInCallback(lock, error);
}


export function signUp(id, options = {}) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if (c.isFieldValid(lock, "email")
        && c.isFieldValid(lock, "password")
        && (!authWithUsername(lock) || c.isFieldValid(lock, "username"))) {
      return l.setSubmitting(lock, true);
    } else {
      lock = c.setFieldShowInvalid(lock, "email", !c.isFieldValid(lock, "email"));
      lock = c.setFieldShowInvalid(lock, "password", !c.isFieldValid(lock, "password"));
      if (authWithUsername(lock)) {
        lock = c.setFieldShowInvalid(lock, "username", !c.isFieldValid(lock, "username"));
      }
      return lock;
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    // TODO: check options
    options.connection = databaseConnectionName(lock);
    options.email = c.email(lock);
    options.password = c.password(lock)

    if (authWithUsername(lock)) {
      options.username = c.username(lock);
    }

    const authOptions = l.withAuthOptions(lock, {
      autoLogin: shouldAutoLogin(lock)
    });

    webApi.signUp(
      id,
      options,
      authOptions,
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

  // TODO: should we auto login if sign the login screen is not
  // available? if we do, we should check that we handle login errors
  // properly.
  if (shouldAutoLogin(lock)) {
    swap(updateEntity, "lock", id, m => m.set("signedUp", true));

    // TODO: check options, redirect is missing
    const options = l.withAuthOptions(lock, {
      connection: databaseConnectionName(lock),
      username: c.email(lock),
      password: c.password(lock)
    });

    return webApi.signIn(
      id,
      options,
      (error, ...args) => {
        if (error) {
          setTimeout(() => autoSignInError(id, error), 250);
        } else {
          autoSignInSuccess(id, ...args);
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
  // TODO: proper error message
  // const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {field: field, __textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {field: field, __textOnly: true});
  const errorMessage = "Something went wrong";
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}


function autoSignInSuccess(id, ...args) {
  const lock = read(getEntity, "lock", id);
  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, lock => l.setSubmitting(lock, false).set("signedIn", true));
    l.invokeSignInCallback(lock, null, ...args);
  } else {
    closeLock(id, false, lock => l.invokeSignInCallback(lock, null, ...args));
  }
}

function autoSignInError(id, error) {
  const lock = read(getEntity, "lock", id);
  // TODO: proper error message
  // const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {field: field, __textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {field: field, __textOnly: true});
  const errorMessage = "An error ocurred when logging in";
  swap(updateEntity, "lock", id, m => {
    m = l.setSubmitting(m, false, errorMessage);
    m = m.set("signedIn", false);
    return m;
  });

  l.invokeSignInCallback(lock, error);
}

export function resetPassword(id) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if ((authWithUsername(lock) && c.isFieldValid(lock, "username"))
        || (!authWithUsername(lock) && c.isFieldValid(lock, "email"))) {
      return l.setSubmitting(lock, true);
    } else {
      lock = authWithUsername(lock)
        ? c.setFieldShowInvalid(lock, "username", !c.isFieldValid(lock, "username"))
        : c.setFieldShowInvalid(lock, "email", !c.isFieldValid(lock, "email"));
      return lock;
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    // TODO: check options
    const options = {
      connection: databaseConnectionName(lock),
      username:   authWithUsername(lock) ? c.username(lock) : c.email(lock)
    };

    webApi.resetPassword(
      id,
      options,
      (error, ...args) => {
        if (error) {
          setTimeout(() => resetPasswordError(id, error), 250);
        } else {
          resetPasswordSuccess(id, ...args);
        }
      }
    );
  }
}

function resetPasswordSuccess(id, ...args) {
  const lock = read(getEntity, "lock", id);
  // TODO: needs to be auto closed?
  // TODO: what if login is not enabled?
  swap(updateEntity, "lock", id, lock => (
    setScreen(l.setSubmitting(lock, false), "login")
  ));

  setTimeout(() => {
    const successMessage = l.ui.t(lock, ["success", "resetPassword"], {__textOnly: true});
    swap(updateEntity, "lock", id, l.setGlobalSuccess, successMessage);
  }, 500);
}

function resetPasswordError(id, error) {
  const lock = read(getEntity, "lock", id);
  // TODO: proper error message, consider 429s
  // const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {field: field, __textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {field: field, __textOnly: true});
  const errorMessage = "Something went wrong";
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function showLoginActivity(id, fields = ["password"]) {
  swap(updateEntity, "lock", id, setScreen, "login", fields);
}

export function showSignUpActivity(id, fields = ["password"]) {
  swap(updateEntity, "lock", id, setScreen, "signUp", fields);
}

export function showResetPasswordActivity(id, fields = ["password"]) {
  swap(updateEntity, "lock", id, setScreen, "resetPassword", fields);
}

export function cancelResetPassword(id) {
 return showLoginActivity(id);
}
