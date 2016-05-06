import { getEntity, read, swap, updateEntity } from '../../store/index';
import {
  enterpriseConnection,
  findADConnectionWithoutDomain,
  isHRDActive,
  matchConnection,
  toggleHRD
} from '../enterprise';
import * as l from '../../core/index';
import * as c from '../../field/index';
import { setUsername } from '../../field/username';
import { emailLocalPart } from '../../field/email';
import webApi from '../../core/web_api';
import { validateAndSubmit } from '../../core/actions';

export function startHRD(id) {
  swap(updateEntity, "lock", id, m => {
    m = toggleHRD(m, true);
    m = setUsername(m, emailLocalPart(c.email(m)));
    return m;
  });
}

export function cancelHRD(id) {
  swap(updateEntity, "lock", id, toggleHRD, false);
}

export function logIn(id) {
  const m = read(getEntity, "lock", id);
  const email = c.email(m);
  const ssoConnection = matchConnection(m, email);

  if (ssoConnection && !isHRDActive(m)) {
    return logInSSO(id, ssoConnection);
  }

  logInActiveFlow(id);
}

function logInActiveFlow(id) {
  const m = read(getEntity, "lock", id);
  const useUsername = isHRDActive(m);

  validateAndSubmit(id, ["password", useUsername ? "username" : "email"], m => {
    const options = {
      connection: enterpriseConnection(m).get("name"),
      username: useUsername ? c.username(m) : c.email(m),
      password: c.password(m),
      login_hint: useUsername ? c.username(m) : c.email(m),
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
  });
}

function logInSSO(id, connection) {
  swap(updateEntity, "lock", id, lock => {
    if (c.isFieldValid(lock, "email")) {
      return l.setSubmitting(lock, true);
    } else {
      lock = c.setFieldShowInvalid(lock, "email", !c.isFieldValid(lock, "email"));
      return lock;
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    const options = {
      connection: connection.get("name"),
      login_hint: c.email(lock)
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
