import webAPI from '../web_api';
import { getEntity, read, swap, updateEntity } from '../../store/index';
import { lastUsedUsername, skipSSOLogin as skip } from './index';
import * as l from '../index';
import { closeLock } from '../actions';

export function skipSSOLogin(id) {
  swap(updateEntity, "lock", id, skip, true);
}

export function signIn(id, connection) {
  swap(updateEntity, "lock", id, l.setSubmitting, true);

  const lock = read(getEntity, "lock", id);

  const options = l.withAuthOptions(lock, {
    connection: connection.name,
    popup: l.ui.popup(lock),
    popupOptions: l.ui.popupOptions(lock),
    redirect: !l.ui.popup(lock)
  });

  if (l.ui.popup(lock) && connection.strategy === "facebook") {
    options.display = "popup";
  }

  // TODO: figure out what the following lines do. Copied from from
  // Lock classic code but don't know why is it needed.
  if (connection.strategy === "google-oauth2") {
    options.login_hint = lastUsedUsername(lock);
  }

  webAPI.signIn(id, options, (error, ...args) => {
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
