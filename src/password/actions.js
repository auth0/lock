import { Map } from 'immutable';
import { getEntity, read, swap, updateEntity } from '../store/index';
import webApi from '../lock/web_api';
import * as l from '../lock/index';
import * as c from '../cred/index';

export function signIn(id) {
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
      connection: l.ui.connection(lock),
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
