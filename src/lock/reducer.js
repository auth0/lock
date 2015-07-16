import { ActionTypes } from '../control/constants';
import * as l from './index';

function resetLock(locks, lock) {
  return locks.set(lock.get("id"), lock);
}

function updateLock(locks, id, f) {
  return locks.update(id, f);
}

function updateLocks(locks, pred, f) {
  return locks.merge(locks.filter(pred).map(f));
}

function updateLocksWithClient(locks, clientID, f) {
  return updateLocks(locks, x => l.hasClient(x, clientID), f);
}

export default function reducer(locks, e) {
  switch(e.type) {
  case ActionTypes.HIDE_LOCK:
    return updateLock(locks, e.lockID, l.hide);
  case ActionTypes.SHOW_LOCK:
    return updateLock(locks, e.lockID, lock => l.show(lock, e.options.mode));
  case ActionTypes.SETUP_LOCK:
    return resetLock(locks, l.setup(e));
  case ActionTypes.RECEIVE_CLIENT:
    return updateLocksWithClient(locks, e.attrs.id, l.markReady);
  case ActionTypes.RECEIVE_CLIENT_ERROR:
  case ActionTypes.RECEIVE_CLIENT_TIMEOUT:
    return updateLocksWithClient(locks, e.clientID, l.markCrashed);
  default:
    return locks;
  }
}
