import Immutable, { Map } from 'immutable';
import { getEntity, read, swap, updateEntity } from '../../store/index';
import webApi from '../../core/web_api';
import { closeLock } from '../../core/actions';
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
import { sync } from '../../sync';
// TODO: we should not depend on this from here
import { usernameStyle } from '../../engine/automatic';

export function logIn(id) {
  swap(updateEntity, "lock", id, lock => {
    const useUsername = usernameStyle(lock) === "username";
    if ((useUsername && c.isFieldValid(lock, "username") && c.isFieldValid(lock, "password"))
        || (!useUsername && c.isFieldValid(lock, "email") && c.isFieldValid(lock, "password"))) {
      return l.setSubmitting(lock, true);
    } else {
      if (useUsername) {
        lock = c.setFieldShowInvalid(lock, "username", !c.isFieldValid(lock, "username"));
      } else {
        lock = c.setFieldShowInvalid(lock, "email", !c.isFieldValid(lock, "email"));
      }

      lock = c.setFieldShowInvalid(lock, "password", !c.isFieldValid(lock, "password"));
      return lock;
    }
  });

  const lock = read(getEntity, "lock", id);
  const useUsername = usernameStyle(lock) === "username";
  if (l.submitting(lock)) {
    const options = {
      connection: databaseConnectionName(lock),
      username: useUsername ? c.username(lock) : c.email(lock),
      password: c.password(lock)
    };

    webApi.logIn(
      id,
      options,
      (error, ...args) => {
        if (error) {
          setTimeout(() => logInError(id, error), 250);
        } else {
          logInSuccess(id, ...args);
        }
      }
    );
  }
}

function logInSuccess(id, ...args) {
  const lock = read(getEntity, "lock", id);
  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, lock => l.setSignedIn(l.setSubmitting(lock, false), true));
    l.invokeLogInCallback(lock, null, ...args);
  } else {
    closeLock(id, false, lock => l.invokeLogInCallback(lock, null, ...args));
  }
}

function logInError(id, error) {
  const lock = read(getEntity, "lock", id);
  const errorMessage = l.loginErrorMessage(lock, error);

  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
  l.invokeLogInCallback(lock, error);
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
    swap(updateEntity, "lock", id, lock => l.setSignedIn(l.setSubmitting(lock, false), true));
    l.invokeLogInCallback(lock, null, ...args);
  } else {
    closeLock(id, false, lock => l.invokeLogInCallback(lock, null, ...args));
  }
}

function autoLogInError(id, error) {
  const lock = read(getEntity, "lock", id);
  const errorMessage = l.loginErrorMessage(lock, error);
  swap(updateEntity, "lock", id, m => {
    swap(updateEntity, "lock", id, m => (
      l.setSubmitting(setScreen(m, "login"), false, errorMessage)
    ));
  });

  l.invokeLogInCallback(lock, error);
}

export function resetPassword(id) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if (c.isFieldValid(lock, "email")) {
      return l.setSubmitting(lock, true);
    } else {
      return c.setFieldShowInvalid(lock, "email", !c.isFieldValid(lock, "email"));
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    const options = {
      connection: databaseConnectionName(lock),
      email: c.email(lock)
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

  const errorMessage =
    l.ui.t(lock, ["error", "forgotPassword", error.code], {__textOnly: true})
    || l.ui.t(lock, ["error", "forgotPassword", "lock.fallback"], {__textOnly: true});

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

export function resolveSingUpFieldCallbacks(id, x) {
  if (x.get("type") === "select") {
    resolveSelectSingUpFieldCallbacks(id, x);
  } else {
    resolveTextSignUpFieldCallback(id, x);
  }
}

function resolveTextSignUpFieldCallback(id, x) {
  let resolvedPrefill, resolvedOptions, done;
  if (typeof x.get("prefill") != "function") resolvedPrefill = x.get("prefill") || "";

  if (resolvedPrefill != undefined) return; // nothing to resolve

  sync(
    id,
    ["additionalSignUpFields", x.get("name")],
    undefined,
    (_, cb) => x.get("prefill")((err, value) => cb(null, err ? "" : value)),
    (m, prefill) => {
      if (done) return m;
      done = true;
      try {
        return c.setField(m, x.get("name"), prefill || "", x.get("validator"));
      } catch (e) {
        l.error(m, e.message);
        return l.stop(m);
      }
    }
  );

}

function resolveSelectSingUpFieldCallbacks(id, x) {
  let resolvedPrefill, resolvedOptions, done;

  if (typeof x.get("prefill") != "function") resolvedPrefill = x.get("prefill") || "";
  if (typeof x.get("options") != "function") resolvedOptions = x.get("options");

  if (resolvedPrefill != undefined && resolvedOptions != undefined) return; // nothing to resolve

  sync(
    id,
    ["additionalSignUpFields", x.get("name")],
    undefined,
    (_, cb) => {
      if (resolvedPrefill === undefined) {
        x.get("prefill")((err, value) => {
          if (done) return;
          resolvedPrefill = value;
          if (resolvedOptions != undefined) {
            cb(null, {prefill: resolvedPrefill, options: resolvedOptions});
          }
        });
      }
      if (resolvedOptions === undefined) {
        x.get("options")((err, value) => {
          if (done) return;
          if (err) cb({});
          resolvedOptions = value;
          if (resolvedPrefill != undefined) {
            cb(null, {prefill: resolvedPrefill, options: resolvedOptions});
          }
        });
      }
    },
    (m, {options, prefill}) => {
      done = true;
      try {
        if (!Array.isArray(options)) {
          throw new Error(`The \`options\` provided for the "${x.get("name")}" field must be an Array.`);
        }

        return c.registerOptionField(m, x.get("name"), Immutable.fromJS(options), prefill);
      } catch (e) {
        l.error(m, e.message);
        return l.stop(m);
      }
    }
  );
}
