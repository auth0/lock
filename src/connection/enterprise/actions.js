import { getEntity, read, swap, updateEntity } from '../../store/index';
import {
  enterpriseConnection,
  findADConnectionWithoutDomain,
  isHRDDomain,
  matchConnection,
  toggleHRD
} from '../enterprise';
import * as l from '../../core/index';
import * as c from '../../field/index';
import { setUsername } from '../../field/username';
import { emailLocalPart } from '../../field/email';
import webApi from '../../core/web_api';

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

  if (ssoConnection && isHRDDomain(m, email)) {
    // TODO: maybe this shouldn't be dispatched from here, maybe the
    // logIn function shouldn't exists at all.
    return logInHRD(id, ssoConnection);
  }

  if (ssoConnection) {
    return logInSSO(id, ssoConnection);
  }

  // TODO: should we call this corporateConnection?
  logInAD(id, enterpriseConnection(m));
}

export function logInHRD(id, connection = undefined) {
  swap(updateEntity, "lock", id, lock => {
    if (!connection) connection = enterpriseConnection(lock);

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
    // TODO: popup + popup options
    const options = l.withAuthOptions(lock, {
      connection: connection.get("name"),
      username: c.username(lock),
      password: c.password(lock),
      login_hint: c.username(lock)
    });

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
    // TODO: popup + popup options
    const options = l.withAuthOptions(lock, {
      connection: connection.get("name"),
      login_hint: c.email(lock)
    });

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

function logInAD(id, connection) {
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
    // TODO: popup + popup options
    const options = l.withAuthOptions(lock, {
      connection: connection.get("name"),
      username: c.email(lock),
      password: c.password(lock),
      login_hint: c.email(lock)
    });

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
