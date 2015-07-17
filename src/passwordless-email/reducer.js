import { ActionTypes, LockModes } from '../control/constants';
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
      const valid = EmailCredentials.validateEmail(e.email);
      return l.changeEmail(lock, e.email, valid);
    });
  default:
    return locks;
  }
}
