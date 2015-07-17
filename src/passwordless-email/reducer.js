import { ActionTypes, LockModes, LockStates } from '../control/constants';
import EmailCredentials from '../lock/credentials/email';
import * as l from '../lock/index';

function updateLock(locks, id, f) {
  return locks.update(id, lock => {
    return lock.get("mode") === LockModes.PASSWORDLESS_EMAIL ? f(lock) : lock;
  });
}

export default function reducer(locks, e) {
  switch(e.type) {
  case ActionTypes.CHANGE_EMAIL:
    return updateLock(locks, e.lockID, lock => {
      const valid = !!EmailCredentials.validateEmail(e.email);
      return l.changeEmail(lock, e.email, !!valid)
        .set("validate", lock.get("validate") && !valid);
    });
  case ActionTypes.REQUEST_PASSWORDLESS_LINK_EMAIL:
    return updateLock(locks, e.lockID, lock => {
      if (lock.get("validEmail")) {
        return lock.set("submitting", true);
          // .set("state", LockStates.WAITING_PASSWORDLESS_LINK_EMAIL);
      } else {
        return lock.set("validate", true);
      }
    });
  case ActionTypes.REQUEST_PASSWORDLESS_LINK_EMAIL_SUCCESS:
    return updateLock(locks, e.lockID, lock => {
      return lock.set("submitting", false).set("state", LockStates.DONE);
    });
  default:
    return locks;
  }
}
