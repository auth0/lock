import { read, getEntity, swap, updateEntity } from '../store/index';
import webApi from '../lock/web_api';
import * as l from '../lock';
import * as m from './index';
import * as c from '../credentials/index';

export function changePhoneNumber(id, phoneNumber) {
  swap(updateEntity, "lock", id, c.setPhoneNumber, phoneNumber);
}

export function selectPhoneLocation(id) {
  swap(updateEntity, "lock", id, m.setSelectingLocation, true);
}

export function changePhoneLocation(id, location) {
  swap(updateEntity, "lock", id, lock => {
    lock = m.setSelectingLocation(lock, false);
    lock = c.setPhoneLocation(lock, location);
    return lock;
  });
}

export function sendSMS(id) {
  // TODO: abstract this submit thing.
  swap(updateEntity, "lock", id, lock => {
    if (c.validPhoneNumber(lock)) {
      return l.setSubmitting(lock, true);
    } else {
      return c.setShowInvalidPhoneNumber(lock, true);
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    const options = {phoneNumber: c.fullPhoneNumber(lock)};
    webApi.startPasswordless(id, options, error => {
      if (error) {
        sendSMSError(id, error);
      } else {
        sendSMSSuccess(id);
      }
    });
  }
}

export function sendSMSSuccess(id) {
  swap(updateEntity, "lock", id, lock => {
    lock = l.setSubmitting(lock, false);
    lock = m.setSMSSent(lock, true);
    return lock;
  });
}

export function sendSMSError(id, error) {
  const errorMessage = "We're sorry, something went wrong when sending the email.";
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function changeVerificationCode(id, verificationCode) {
  return swap(updateEntity, "lock", id, c.setVerificationCode, verificationCode);
}

export function signIn(id) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if (c.validVerificationCode(lock)) {
      return l.setSubmitting(lock, true);
    } else {
      return c.setShowInvalidVerificationCode(lock);
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    const options = {
      connection: "sms",
      username: c.fullPhoneNumber(lock),
      password: c.verificationCode(lock),
      sso: false
    };

    webApi.signIn(id, options, (error, ...args) => {
      if (error) {
        signInError(id, error);
      } else {
        signInSuccess(id, ...args);
      }
    });
  }
}

function signInSuccess(id, ...args) {
  swap(updateEntity, "lock", id, lock => m.close(l.setSubmitting(lock, false)));

  const lock = read(getEntity, "lock", id);
  l.invokeDoneCallback(lock, null, ...args);
}

function signInError(id, error) {
  swap(updateEntity, "lock", id, l.setSubmitting, false, error.description);

  const lock = read(getEntity, "lock", id);
  l.invokeDoneCallback(lock, error);
}

export function reset(id, clearCredentials = true) {
  swap(updateEntity, "lock", id, m.reset, clearCredentials);
}

export function close(id) {
  // TODO: if m.selectingLocation(lock) === true, go back to previous screen.
  swap(updateEntity, "lock", id, m.close);
}


// import { Map } from 'immutable';
// import { LockStates } from '../control/constants';
// import { getLock, updateLock }k from '../store/index';
// import { fullPhoneNumber, setCountryCode, setPhoneNumber, setShowInvalidPhoneNumber, setVerificationCode, validPhoneNumber, validVerificationCode, verificationCode } from '../credentials/index';
// import WebApi from '../lock/web_api';
//
// export function changeVerificationCode(lockID, verificationCode) {
//   return updateLock(lockID, setVerificationCode, verificationCode);
// }
//
// export function signIn(lockID) {
//   let submit = false;
//   updateLock(lockID, lock => {
//     if (validVerificationCode(lock)) {
//       submit = true;
//       return lock.set("submitting", true);
//     } else {
//       return setShowInvalidVerificationCode(lock);
//     }
//   });
//
//   if (submit) {
//     const lock = getLock(lockID);
//     const options = {
//       connection: "sms",
//       username: fullPhoneNumber(lock),
//       password: verificationCode(lock),
//       sso: false
//     };
//     WebApi.signIn(lockID, options, ignInSuccess, signInError);
//   }
// }
//
// function signInSuccess(lockID, response) {
//   const callback = l.ui.signInCallback(getLock(lockID));;
//   if (callback) {
//     callback.apply(null, response);
//   }
//   // TODO update lock state
// }
//
// function signInError(lockID, error) {
//   const callback = l.ui.signInCallback(getLock(lockID));;
//   if (callback) {
//     callback.call(null, error);
//   }
//   // TODO update lock state
// }
