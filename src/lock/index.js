import Immutable, { Map } from 'immutable';
import { LockStates, LockModes } from '../control/constants';

export function setup(attrs) {
  const { clientID, lockID, domain, options } = attrs;

  return Immutable.fromJS({
    clientID: clientID,
    domain: domain,
    id: lockID,
    options: options,
    show: false,
    mode: LockModes.LOADING,
    state: LockStates.WAITING_CLIENT_CONFIG
  });
}

export function hasClient(lock, clientID) {
  return lock.get("clientID") === clientID;
}

export function hasCrashed(lock) {
  return lock.get("state") === LockStates.CRASHED;
}

function isLoading(lock) {
  return lock.get("mode") === LockModes.LOADING;
}

export function markCrashed(lock) {
  return lock.set("state", LockStates.CRASHED);
}

export function markReady(lock) {
  return lock.set("state", LockStates.READY);
}

export function show(lock, mode) {
  if (lock.get("mode") === LockModes.LOADING) {
    if (lock.get("state") === LockStates.READY) {
      return lock.merge(Map({show: true, mode: mode}));
    } else {
      return lock.merge(Map({show: true, loading: mode}));
    }
  } else if (lock.get("mode") === LockModes.CRASHED || lock.get("mode") === mode) {
    return lock.set("show", true);
  } else {
    throw new Error("can't show the lock in a different mode");
  }
}

export function hide(lock) {
  return lock.set("show", false);
}
