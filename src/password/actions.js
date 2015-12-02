import { Map } from 'immutable';
import { getEntity, read, swap, updateEntity } from '../store/index';
import webApi from '../lock/web_api';
import * as l from '../lock/index';
import * as c from '../cred/index';
import  {
  authWithUsername,
  databaseConnection,
  setActivity,
  shouldAutoLogin
} from './index';

export function signInWithUsername(id) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if (c.validUsername(lock) && c.validPassword(lock)) {
      return l.setSubmitting(lock, true);
    } else {
      lock = c.setShowInvalidUsername(lock, !c.validUsername(lock));
      lock = c.setShowInvalidPassword(lock, !c.validPassword(lock));
      return lock;
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    // TODO: check options
    const options = {
      connection: databaseConnection(lock),
      username: c.username(lock),
      password: c.password(lock),
      sso: false,
      responseType: l.login.responseType(lock),
      callbackURL: l.login.callbackURL(lock),
      forceJSONP: l.login.forceJSONP(lock)
    };

    webApi.signIn(
      id,
      Map(options).merge(l.login.authParams(lock)).toJS(),
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
    if (c.validEmail(lock) && c.validPassword(lock)) {
      return l.setSubmitting(lock, true);
    } else {
      lock = c.setShowInvalidEmail(lock, !c.validEmail(lock));
      lock = c.setShowInvalidPassword(lock, !c.validPassword(lock));
      return lock;
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    // TODO: check options
    const options = {
      connection: databaseConnection(lock),
      username: c.email(lock),
      password: c.password(lock),
      sso: false,
      responseType: l.login.responseType(lock),
      callbackURL: l.login.callbackURL(lock),
      forceJSONP: l.login.forceJSONP(lock)
    };

    webApi.signIn(
      id,
      Map(options).merge(l.login.authParams(lock)).toJS(),
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
    l.invokeDoneCallback(lock, null, ...args);
  } else {
    closeLock(id, false, lock => l.invokeDoneCallback(lock, null, ...args));
  }
}

function signInError(id, error) {
  const lock = read(getEntity, "lock", id);
  // TODO: proper error message
  // const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {cred: cred, __textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {cred: cred, __textOnly: true});
  const errorMessage = "Invalid email or password";
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);

  l.invokeDoneCallback(lock, error);
}


export function signUp(id) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if (c.validEmail(lock)
        && c.validPassword(lock)
        && (!authWithUsername(lock) || c.validUsername(lock))) {
      return l.setSubmitting(lock, true);
    } else {
      lock = c.setShowInvalidEmail(lock, !c.validEmail(lock));
      lock = c.setShowInvalidPassword(lock, !c.validPassword(lock));
      if (authWithUsername(lock)) {
        lock = c.setShowInvalidUsername(lock, !c.validUsername(lock));
      }
      return lock;
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    // TODO: check options
    const options = {
      connection: databaseConnection(lock),
      email:      c.email(lock),
      password:   c.password(lock),
      auto_login: false,
      popup:      false
    };

    if (authWithUsername(lock)) {
      options.username = c.username(lock);
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

    const options = {
      connection: databaseConnection(lock),
      username: c.email(lock),
      password: c.password(lock),
      sso: false,
      responseType: l.login.responseType(lock),
      callbackURL: l.login.callbackURL(lock),
      forceJSONP: l.login.forceJSONP(lock)
    };

    return webApi.signIn(
      id,
      Map(options).merge(l.login.authParams(lock)).toJS(),
      (error, ...args) => {
        if (error) {
          setTimeout(() => autoSignInError(id, error), 250);
        } else {
          autoSignInSuccess(id, ...args);
        }
      }
    );
  }

  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, lock => l.setSubmitting(lock, false).set("signedUp", true));
    l.invokeDoneCallback(lock, null, ...args);
  } else {
    closeLock(id, false, lock => l.invokeDoneCallback(lock, null, ...args));
  }

}

function signUpError(id, error) {
  const lock = read(getEntity, "lock", id);
  // TODO: proper error message
  // const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {cred: cred, __textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {cred: cred, __textOnly: true});
  const errorMessage = "Something went wrong";
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);

  l.invokeDoneCallback(lock, error);
}


function autoSignInSuccess(id, ...args) {
  const lock = read(getEntity, "lock", id);
  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, lock => l.setSubmitting(lock, false).set("signedIn", true));
    l.invokeDoneCallback(lock, null, ...args);
  } else {
    closeLock(id, false, lock => l.invokeDoneCallback(lock, null, ...args));
  }
}

function autoSignInError(id, error) {
  const lock = read(getEntity, "lock", id);
  // TODO: proper error message
  // const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {cred: cred, __textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {cred: cred, __textOnly: true});
  const errorMessage = "An error ocurred when logging in";
  console.log("ufff");
  swap(updateEntity, "lock", id, m => {
    m = l.setSubmitting(m, false, errorMessage);
    m = m.set("signedIn", false);
    return m;
  });

  l.invokeDoneCallback(lock, error);
}

export function resetPassword(id) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if ((authWithUsername(lock) || c.validEmail(lock))
        && (!authWithUsername(lock) || c.validUsername(lock))
        && c.validPassword(lock)
        && c.validPasswordConfirmation(lock)) {
      return l.setSubmitting(lock, true);
    } else {
      lock = authWithUsername(lock)
        ? c.setShowInvalidUsername(lock, !c.validUsername(lock))
        : c.setShowInvalidEmail(lock, !c.validEmail(lock));
      lock = c.setShowInvalidPassword(lock, !c.validPassword(lock));
      lock = c.setShowInvalidPasswordConfirmation(lock, !c.validPasswordConfirmation(lock));
      return lock;
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    // TODO: check options
    const options = {
      connection: databaseConnection(lock),
      username:   authWithUsername(lock) ? c.username(lock) : c.email(lock),
      password:   c.password(lock)
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
  swap(updateEntity, "lock", id, lock => setActivity(l.setSubmitting(lock, false), "login"));
}

function resetPasswordError(id, error) {
  const lock = read(getEntity, "lock", id);
  // TODO: proper error message
  // const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {cred: cred, __textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {cred: cred, __textOnly: true});
  const errorMessage = "Something went wrong";
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function showLoginActivity(id) {
  swap(updateEntity, "lock", id, setActivity, "login");
}

export function showSignUpActivity(id) {
  swap(updateEntity, "lock", id, setActivity, "signUp");
}

export function showResetPasswordActivity(id) {
  swap(updateEntity, "lock", id, setActivity, "resetPassword");
}

export function cancelResetPassword(id) {
  return showLoginActivity(id);
}
