import { LockStates } from '../control/constants';
import WebApi from '../lock/web_api';
import { updateLock } from '../store/index';
import EmailCredentials from '../lock/credentials/email';
import * as l from '../lock/index';

export function changeEmail(lockID, email) {
  updateLock(lockID, lock => {
    const valid = !!EmailCredentials.validateEmail(email);
    return l.changeEmail(lock, email, !!valid)
      .set("validate", lock.get("validate") && !valid);
  });
}

export function changeCode(lockID, code) {
  return updateLock(lockID, lock => lock.set("code", code));
}

export function requestPasswordlessEmail(lockID) {
  let submit = false;
  updateLock(lockID, lock => {
    if (lock.get("validEmail")) {
      submit = true;
      return lock.set("submitting", true);
    } else {
      return lock.set("validate", true);
    }
  });

  if (submit) {
    WebApi.requestPasswordlessEmail(lockID);
  }
}

export function requestPasswordlessEmailSuccess(lockID) {
  updateLock(lockID, lock => {
    const state = lock.get("send") === "link" ?
      LockStates.DONE : LockStates.ASK_CODE;
    return lock.set("submitting", false).set("state", state);
  });
}

export function signIn(lockID) {
  updateLock(lockID, lock => lock.set("submitting", true));
  // TODO: pass the real options
  WebApi.signIn(lockID);
}
