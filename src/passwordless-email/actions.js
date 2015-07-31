import WebApi from '../lock/web_api';
import { read, swap, getEntity, updateEntity } from '../store/index';
import * as c from '../credentials/index';
import * as l from '../lock/index';
import * as m from './index';

export function changeEmail(lockID, email) {
  swap(updateEntity, "lock", lockID, c.setEmail, email);
}

export function changeVerificationCode(lockID, verificationCode) {
  swap(updateEntity, "lock", lockID, c.setVerificationCode, verificationCode)
}

export function requestPasswordlessEmail(lockID) {
  // TODO: abstract this submit thing.
  swap(updateEntity, "lock", lockID, lock => {
    if (c.validEmail(lock)) {
      return l.setSubmitting(lock, true);
    } else {
      return c.setShowInvalidEmail(lock);
    }
  });

  const lock = read(getEntity, "lock", lockID);

  if (l.submitting(lock)) {
    const options = {email: c.email(lock), send: m.send(lock)};
    WebApi.startPasswordless(lockID, options, error => {
      if (error) {
        requestPasswordlessEmailError(lockID, error);
      } else {
        requestPasswordlessEmailSuccess(lockID);
      }
    });
  }
}

export function requestPasswordlessEmailSuccess(lockID) {
  swap(updateEntity, "lock", lockID, lock => {
    return m.setEmailSent(l.setSubmitting(lock, false), true);
  });
}

export function requestPasswordlessEmailError(lockID, error) {
  const errorMessage = "We're sorry, something went wrong when sending the email.";
  swap(updateEntity, "lock", lockID, lock => {
    return l.setGlobalError(l.setSubmitting(lock, false), errorMessage);
  });
}

export function allowResend(lockID) {
  swap(updateEntity, "lock", lockID, m.allowResend);
}

export function resendEmail(lockID) {
  swap(updateEntity, "lock", lockID, m.resend);

  const lock = read(getEntity, "lock", lockID);
  const options = {email: c.email(lock), send: m.send(lock)};
  WebApi.startPasswordless(lockID, options, error => {
    if (error) {
      resendEmailError(lockID, error);
    } else {
      resendEmailSuccess(lockID);
    }
  });
}

export function resendEmailSuccess(lockID) {
  swap(updateEntity, "lock", lockID, m.setResendSuccess);
}

export function resendEmailError(lockID, error) {
  // TODO: set a proper error message
  swap(updateEntity, "lock", lockID, m.setResendFailed);
}

export function signIn(lockID) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", lockID, lock => {
    if (c.validVerificationCode(lock)) {
      return l.setSubmitting(lock, true);
    } else {
      return c.setShowInvalidVerificationCode(lock);
    }
  });

  const lock = read(getEntity, "lock", lockID);

  if (l.submitting(lock)) {
    const options = {
      connection: "email",
      username: c.email(lock),
      password: c.verificationCode(lock),
      sso: false
    };
    WebApi.signIn(lockID, options, (error, ...args) => {
      if (error) {
        signInError(lockID, error);
      } else {
        signInSuccess(lockID, ...args);
      }
    });
  }
}

function signInSuccess(lockID, ...args) {
  const lock = read(getEntity, "lock", lockID);
  const callback = l.ui.signInCallback(lock);
  swap(updateEntity, "lock", lockID, l.close);

  if (callback) {
    callback.call(null, null, ...args);
  }
}

function signInError(lockID, error) {
  const lock = read(getEntity, "lock", lockID);
  const callback = l.ui.signInCallback(lock);
  swap(updateEntity, "lock", lockID, lock => {
    return l.setGlobalError(l.setSubmitting(lock, false), error.description);
  });
  if (callback) {
    callback.call(null, error);
  }
}

export function reset(lockID) {
  swap(updateEntity, "lock", lockID, m.reset);
}
