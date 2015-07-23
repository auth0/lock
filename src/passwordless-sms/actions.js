import { Map } from 'immutable';
import { LockStates } from '../control/constants';
import { getLock, updateLock } from '../store/index';
import { fullPhoneNumber, setCountryCode, setPhoneNumber, setShowInvalidPhoneNumber, validPhoneNumber, visiblyInvalidPhoneNumber } from '../credentials/index';
import WebApi from '../lock/web_api';

export function changeVerificationCode(lockID, verificationCode) {
  return updateLock(lockID, lock => lock.set("verificationCode", verificationCode));
}

export function changePhoneNumber(lockID, phoneNumber) {
  updateLock(lockID, setPhoneNumber, phoneNumber);
}

export function selectCountryCode(lockID) {
  updateLock(lockID, lock => lock.set("state", LockStates.SELECT_COUNTRY_CODE));
}

export function changeCountryCode(lockID, countryCode) {
  updateLock(lockID, setCountryCode, countryCode);
  updateLock(lockID, lock => lock.set("state", LockStates.READY));
}

export function requestPasswordlessSMS(lockID) {
  let submit = false;
  updateLock(lockID, lock => {
    if (validPhoneNumber(lock)) {
      submit = true;
      return lock.set("submitting", true);
    } else {
      return setShowInvalidPhoneNumber(lock, true);
    }
  });

  if (submit) {
    const lock = getLock(lockID);
    WebApi.requestPasswordlessSMS(lockID, fullPhoneNumber(lock), function(error, result) {
      if (error) {
        requestPasswordlessSMSError(lockID, error);
      } else {
        requestPasswordlessSMSSuccess(lockID);
      }
    });
  }
}

function requestPasswordlessSMSSuccess(lockID) {
  updateLock(lockID, lock => {
    return lock.merge(Map({
      submitting: false,
      state: LockStates.ASK_VERIFICATION_CODE
    }));
  });
}

function requestPasswordlessSMSError() {
  console.debug(arguments);
  console.error("unimplemented action requestPasswordlessSMSError");
}

export function signIn(lockID) {
  updateLock(lockID, lock => lock.set("submitting", true));
  const lock = getLock(lockID);
  const options = {
    connection: "sms",
    username: fullPhoneNumber(lock),
    password: lock.get("verificationCode"),
    sso: false,
    callbackURL: lock.getIn(["showOptions", "callbackURL"]),
    callbackOnLocationHash: lock.getIn(["showOptions", "callbackOnLocationHash"])
    // TODO authParams?
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
