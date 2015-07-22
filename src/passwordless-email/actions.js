import { LockStates } from '../control/constants';
import WebApi from '../lock/web_api';
import { getLock, updateLock } from '../store/index';
import { validateEmail } from '../credentials/index';
import * as l from '../lock/index';

export function changeEmail(lockID, email) {
  updateLock(lockID, lock => {
    const valid = !!validateEmail(email);
    return l.changeEmail(lock, email, !!valid)
      .set("validateEmail", lock.get("validateEmail") && !valid);
  });
}

export function changeVerificationCode(lockID, verificationCode) {
  return updateLock(lockID, lock => lock.set("verificationCode", verificationCode));
}

export function requestPasswordlessEmail(lockID) {
  let submit = false;
  updateLock(lockID, lock => {
    if (lock.get("validEmail")) {
      submit = true;
      return lock.set("submitting", true);
    } else {
      return lock.set("validateEmail", true);
    }
  });

  if (submit) {
    const lock = getLock(lockID);
    WebApi.requestPasswordlessEmail(
      lockID,
      lock.get("email"),
      lock.get("send"),
      lock.getIn(["showOptions", "authParams"])
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
  updateLock(lockID, lock => lock.set("submitting", true));
  const lock = getLock(lockID);
  const options = {
    connection: "email",
    username: lock.get("email"),
    password: lock.get("verificationCode"),
    sso: false,
    callbackURL: lock.getIn(["showOptions", "callbackURL"]),
    callbackOnLocationHash: lock.getIn(["showOptions", "callbackOnLocationHash"])
  };
  WebApi.signIn(lockID, options, true, signInSuccess, signInError);
}

function signInSuccess(lockID, response) {
  const callback = getLock(lockID).getIn(["showOptions", "signInCallback"]);
  if (callback) {
    callback.apply(null, response);
  }
  // TODO update lock state
}

function signInError(lockID, error) {
  const callback = getLock(lockID).getIn(["showOptions", "signInCallback"]);
  if (callback) {
    callback.call(null, error);
  }
  // TODO update lock state
}
