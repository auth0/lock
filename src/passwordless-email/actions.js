import { LockStates } from '../control/constants';
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
  // TODO: abstract this submit thing
  let submit = false;
  swap(updateEntity, "lock", lockID, lock => {
    if (c.validEmail(lock)) {
      submit = true;
      return l.setSubmitting(lock, true);
    } else {
      return c.setShowInvalidEmail(lock);
    }
  });

  if (submit) {
    const lock = read(getEntity, "lock", lockID);
    WebApi.requestPasswordlessEmail(
      lockID,
      c.email(lock),
      lock.get("send"), // TODO: abstract access in a function
      null, // TODO: condier authParams
      (error, result) => {
        if (error) {
          requestPasswordlessEmailError(lockID, error);
        } else {
          requestPasswordlessEmailSuccess(lockID);
        }
      }
    );
  }
}

export function requestPasswordlessEmailSuccess(lockID) {
  swap(updateEntity, "lock", lockID, lock => {
    return m.setEmailSent(l.setSubmitting(lock, false), true);
  });
}

export function requestPasswordlessEmailError(lockID, error) {
  // TODO: set a proper error message
  swap(updateEntity, "lock", lockID, lock =>{
    return l.setGlobalError(l.setSubmitting(lock, false), "We're sorry, something went wrong.");
  });
}

export function allowResend(lockID) {
  swap(updateEntity, "lock", lockID, m.allowResend);
}

export function resendEmail(lockID) {
  swap(updateEntity, "lock", lockID, m.resend);

  const lock = read(getEntity, "lock", lockID);
  WebApi.requestPasswordlessEmail(
    lockID,
    c.email(lock),
    lock.get("send"), // TODO: abstract access in a function
    null, // TODO: condier authParams
    (error, result) => {
      if (error) {
        resendEmailError(lockID, error);
      } else {
        resendEmailSuccess(lockID);
      }
    }
  );
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
  let submit = false;
  swap(updateEntity, "lock", lockID, lock => {
    if (c.validVerificationCode(lock)) {
      submit = true;
      return l.setSubmitting(lock, true);
    } else {
      return c.setShowInvalidVerificationCode(lock);
    }
  });
  if (submit) {
    const lock = read(getEntity, "lock", lockID);
    const options = {
      connection: "email",
      username: c.email(lock),
      password: c.verificationCode(lock),
      sso: false
    };
    WebApi.signIn(lockID, options, signInSuccess, signInError);
  }
}

function signInSuccess(lockID, response) {
  const lock = read(getEntity, "lock", lockID);
  const callback = l.ui.signInCallback(lock);
  if (callback) {
    callback.apply(null, response);
  }
  // TODO update lock state
}

function signInError(lockID, error) {
  const lock = read(getEntity, "lock", lockID);
  const callback = l.ui.signInCallback(lock);
  if (callback) {
    callback.call(null, error);
  }
  // TODO update lock state
}
