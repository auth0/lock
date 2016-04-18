import { skipQuickAuth as skip } from '../quick_auth';
import { getEntity, read, swap, updateEntity } from '../store/index';
import { closeLock } from '../core/actions';
import webApi from '../core/web_api';
import * as l from '../core/index';

export function skipQuickAuth(id) {
  swap(updateEntity, "lock", id, skip, true);
}

export function logIn(id, connection, loginHint) {
  swap(updateEntity, "lock", id, l.setSubmitting, true);

  const m = read(getEntity, "lock", id);

  const options = l.withAuthOptions(m, {
    connection: connection.get("name"),
    popupOptions: l.ui.popupOptions(m)
  });

  if (!l.auth.redirect(m) && connection.get("strategy") === "facebook") {
    options.display = "popup";
  }

  if (connection.strategy === "google-oauth2" && loginHint) {
    options.login_hint = loginHint;
  }

  webApi.logIn(id, options, (error, ...args) => {
    if (error) {
      setTimeout(() => logInError(id, error), 250);
    } else {
      logInSuccess(id, ...args);
    }
  });

}

function logInSuccess(id, ...args) {
  const m = read(getEntity, "lock", id);
  const autoclose = l.ui.autoclose(m);

  if (!autoclose) {
    swap(updateEntity, "lock", id, m1 => l.setSignedIn(l.setSubmitting(m1, false), true));
    l.invokeLogInCallback(m, null, ...args);
  } else {
    closeLock(id, false, m1 => l.invokeLogInCallback(m1, null, ...args));
  }
}

function logInError(id, error) {
  const m = read(getEntity, "lock", id);
  const errorMessage = l.loginErrorMessage(m, error);
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);

  l.invokeLogInCallback(m, error);
}
