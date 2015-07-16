import Immutable, { Map } from 'immutable';
import { LockStates } from '../control/constants';

export function setup(attrs) {
  const { clientID, lockID, domain, options } = attrs;

  return Immutable.fromJS({
    clientID: clientID,
    domain: domain,
    id: lockID,
    options: options,
    show: false,
    state: LockStates.WAITING_CLIENT_CONFIG
  });
}

export function hasClient(lock, clientID) {
  return lock.get("clientID") === clientID;
}

export function hasCrashed(lock) {
  return lock.get("state") === LockStates.CRASHED;
}

export function markCrashed(lock) {
  return lock.set("state", LockStates.CRASHED);
}

export function markReady(lock) {
  return lock.set("state", LockStates.READY);
}

export function show(lock, mode) {
  return lock.merge(Map({show: true, mode: mode}));
}

export function hide(lock) {
  return lock.set("show", false);
}
