import Immutable, { Map } from 'immutable';
import { LockStates, LockModes } from '../control/constants';
import { isSmallScreen } from '../utils/media_utils';

export function setup(attrs) {
  const { clientID, lockID, domain, options } = attrs;

  return Immutable.fromJS({
    clientID: clientID,
    domain: domain,
    id: lockID,
    options: options,
    show: false,
    mode: LockModes.LOADING,
    state: LockStates.READY,
    submitting: false,
    credentials: {
      phoneNumber: {countryCode: "+1", number: "", valid: false, showInvalid: false},
      email: {email: "", valid: false, showInvalid: false}
    }
  });
}

export function extractUIOptions(id, options) {

  return new Map({
    containerID: options.container, // || `auth0-lock-container-${id}`,
    // appendContainer: !options.container,
    icon: options.icon || false,
    closable: undefined === options.closable ? !options.container : !!options.closable,
    focusInput: undefined === options.focusInput ? !(options.container || isSmallScreen()) : !!options.focusInput,
    gravatar: undefined === options.gravatar ? true : !!options.gravatar,
    signInCallback: options.signInCallback // TODO: this doesn't belong here
  });
}

function getUIAttribute(lock, attribute) {
  return lock.getIn(["ui", attribute]);
}

export const ui = {
  containerID: lock => getUIAttribute(lock, "containerID"),
  //appendContainer: lock => getUIAttribute(lock, "appendContainer"),
  icon: lock => getUIAttribute(lock, "icon"),
  closable: lock => getUIAttribute(lock, "closable"),
  focusInput: lock => getUIAttribute(lock, "focusInput"),
  gravatar: lock => getUIAttribute(lock, "gravatar"),
  signInCallback: lock => getUIAttribute(lock, "signInCallback")
};

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
  return lock.set("mode", LockModes.CRASHED);
}

export function markReady(lock) {
  return lock.set("state", LockStates.READY);
}

export function show(lock, options) {
  const { mode } = options;
  const send = options.send || "link";

  if (!lock.get("ui")) {
    lock = lock.set("ui", extractUIOptions(lock.get("id"), options));
  }

  if (lock.get("mode") === LockModes.LOADING) {
    if (lock.get("state") === LockStates.READY) {
      return lock.merge(Map({show: true, mode: mode, send: send}));
    } else {
      return lock.merge(Map({show: true, loading: mode, send: send}));
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
