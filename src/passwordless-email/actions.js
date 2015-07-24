import { LockStates } from '../control/constants';
import WebApi from '../lock/web_api';
import { getLock, updateLock } from '../store/index';
import { email, setEmail, setShowInvalidEmail, setShowInvalidVerificationCode, setVerificationCode, validateEmail, validEmail, validVerificationCode, verificationCode } from '../credentials/index';
import * as l from '../lock/index';

export function changeEmail(lockID, email) {
  updateLock(lockID, setEmail, email);
}

export function changeVerificationCode(lockID, verificationCode) {
  return updateLock(lockID, setVerificationCode, verificationCode);
}

export function requestPasswordlessEmail(lockID) {
  let submit = false;
  updateLock(lockID, lock => {
    if (validEmail(lock)) {
      submit = true;
      return lock.set("submitting", true);
    } else {
      return setShowInvalidEmail(lock);
    }
  });

  if (submit) {
    const lock = getLock(lockID);
    WebApi.requestPasswordlessEmail(
      lockID,
      email(lock),
      lock.get("send"),
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
  updateLock(lockID, lock => {
    const state = lock.get("send") === "link" ?
      LockStates.DONE : LockStates.ASK_VERIFICATION_CODE;
    return lock.set("submitting", false).set("state", state);
  });
}

export function requestPasswordlessEmailError(lockID, error) {
  console.debug(error);
  console.error("unimplemented action requestPasswordlessEmailError");
}

export function signIn(lockID) {
  let submit = false;
  updateLock(lockID, lock => {
    if (validVerificationCode(lock)) {
      submit = true;
      return lock.set("submitting", true);
    } else {
      return setShowInvalidVerificationCode(lock);
    }
  });

  if (submit) {
    const lock = getLock(lockID);
    const options = {
      connection: "email",
      username: email(lock),
      password: verificationCode(lock),
      sso: false
    };
    WebApi.signIn(lockID, options, signInSuccess, signInError);
  }
}

function signInSuccess(lockID, response) {
  const callback = l.ui.signInCallback(getLock(lockID));
  if (callback) {
    callback.apply(null, response);
  }
  // TODO update lock state
}

function signInError(lockID, error) {
  const callback = l.ui.signInCallback(getLock(lockID));
  if (callback) {
    callback.call(null, error);
  }
  // TODO update lock state
}
