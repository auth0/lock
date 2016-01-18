import { Map } from 'immutable';
import { getEntity, read, swap, updateEntity } from '../store/index';
import { closeLock } from '../lock/actions';
import WebAPI from '../lock/web_api';
import * as l from '../lock/index';

export function signIn(id, connection) {
  swap(updateEntity, "lock", id, l.setSubmitting, true);

  const lock = read(getEntity, "lock", id);

  const options = l.login.authParams(lock).merge(Map({
    connection: connection.name,
    popup: l.ui.popup(lock),
    popupOptions: l.ui.popupOptions(lock),
    redirect: !l.ui.popup(lock),
    responseType: l.login.responseType(lock),
    callbackURL: l.login.callbackURL(lock),
    forceJSONP: l.login.forceJSONP(lock)
  })).toJS();

  if (l.ui.popup(lock) && connection.strategy === "facebook") {
    options.display = "popup";
  }

  WebAPI.signIn(id, options,  (error, ...args) => {
    if (error) {
      setTimeout(() => signInError(id, error), 250);
    } else {
      signInSuccess(id, ...args);
    }
  });
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
  const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {__textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {__textOnly: true});
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);

  l.invokeDoneCallback(lock, error);
}
