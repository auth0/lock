import { read, getEntity, swap, updateEntity } from '../store/index';
import webApi from '../lock/web_api';
import * as l from '../lock';
import * as m from './index';
import * as c from '../cred/index';

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

export function changeVcode(id, vcode) {
  return swap(updateEntity, "lock", id, c.setVcode, vcode);
}

export function signIn(id) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if (c.validVcode(lock)) {
      return l.setSubmitting(lock, true);
    } else {
      return c.setShowInvalidVcode(lock);
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    const options = {
      connection: "sms",
      username: c.fullPhoneNumber(lock),
      password: c.vcode(lock),
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

export function reset(id, clearCred = true) {
  swap(updateEntity, "lock", id, m.reset, clearCred);
}

export function close(id) {
  // TODO: if m.selectingLocation(lock) === true, go back to previous screen.
  swap(updateEntity, "lock", id, m.close);
}
