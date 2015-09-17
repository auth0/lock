import { read, getEntity, swap, updateEntity } from '../store/index';
import { closeLock } from '../lock/actions';
import webApi from '../lock/web_api';
import * as c from '../cred/index';
import * as cc from '../cred/country_codes';
import * as l from '../lock/index';
import * as m from './index';

export function changePhoneNumber(id, phoneNumber) {
  swap(updateEntity, "lock", id, c.setPhoneNumber, phoneNumber);
}

export function changePhoneLocation(id, location) {
  swap(updateEntity, "lock", id, lock => {
    lock = m.setSelectingLocation(lock, false);
    lock = c.setPhoneLocation(lock, location);
    return lock;
  });
}

export function setDefaultLocation(id, str) {
  let [dialingCode, ...countryParts] = str.split(" ");
  const result = cc.find(dialingCode, countryParts.join(" "));

  if (result.size === 0) {
    throw new Error(`Unable to set the default location, can't find any that matches "${str}".`);
  }

  if (result.size > 1) {
    throw new Error(`Unable to set the default location, multiple locations match "${str}". Try appending the country name.`);
  }

  swap(updateEntity, "lock", id, c.setPhoneLocation, result.get(0));
}

export function changeEmail(id, email) {
  swap(updateEntity, "lock", id, c.setEmail, email);
}

export function changeVcode(id, vcode) {
  swap(updateEntity, "lock", id, c.setVcode, vcode)
}

export function selectPhoneLocation(id) {
  swap(updateEntity, "lock", id, m.setSelectingLocation, true);
}

export function cancelSelectPhoneLocation(id) {
  swap(updateEntity, "lock", id, m.setSelectingLocation, false);
}

export function requestPasswordlessEmail(id) {
  // TODO: abstract this submit thing.
  swap(updateEntity, "lock", id, lock => {
    if (c.validEmail(lock)) {
      return l.setSubmitting(lock, true);
    } else {
      return c.setShowInvalidEmail(lock);
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    const options = {email: c.email(lock), send: m.send(lock)};
    webApi.startPasswordless(id, options, error => {
      if (error) {
        requestPasswordlessEmailError(id, error);
      } else {
        requestPasswordlessEmailSuccess(id);
      }
    });
  }
}

export function requestPasswordlessEmailSuccess(id) {
  swap(updateEntity, "lock", id, lock => {
    return m.setPasswordlessStarted(l.setSubmitting(lock, false), true);
  });
  const lock = read(getEntity, "lock", id);
  if (m.send(lock) === "link") {
    l.invokeDoneCallback(lock, null, c.email(lock));
  }
}

export function requestPasswordlessEmailError(id, error) {
  const fallbackDescription = "We're sorry, something went wrong when sending the email.";
  swap(updateEntity, "lock", id, l.setSubmitting, false, error.description || fallbackDescription);
  const lock = read(getEntity, "lock", id);
  if (m.send(lock) === "link") {
    l.invokeDoneCallback(lock, error);
  }
}

function fixArgentinianPhoneNumber(lock) {
  const phoneNumber = c.phoneNumber(lock);
  const phoneIsoCode = c.phoneIsoCode(lock);

  return phoneIsoCode === "AR" && phoneNumber[0] === "9" ?
    c.setPhoneNumber(lock, phoneNumber.substr(1, phoneNumber.length -1)) : lock;
}

export function sendSMS(id) {
  // TODO: abstract this submit thing.
  swap(updateEntity, "lock", id, lock => {

    if (c.validPhoneNumber(lock)) {
      lock = fixArgentinianPhoneNumber(lock);
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
    lock = m.setPasswordlessStarted(lock, true);
    return lock;
  });
}

export function sendSMSError(id, error) {
  const fallbackDescription = "We're sorry, something went wrong when sending the SMS.";
  swap(updateEntity, "lock", id, l.setSubmitting, false, error.description || fallbackDescription);
}

export function resendEmail(id) {
  swap(updateEntity, "lock", id, m.resend);

  const lock = read(getEntity, "lock", id);
  const options = {email: c.email(lock), send: m.send(lock)};
  webApi.startPasswordless(id, options, error => {
    if (error) {
      resendEmailError(id, error);
    } else {
      resendEmailSuccess(id);
    }
  });
}

export function resendEmailSuccess(id) {
  swap(updateEntity, "lock", id, m.setResendSuccess);
  const lock = read(getEntity, "lock", id);
  l.invokeDoneCallback(lock, null, c.email(lock));
}

export function resendEmailError(id, error) {
  swap(updateEntity, "lock", id, m.setResendFailed);
  const lock = read(getEntity, "lock", id);
  l.invokeDoneCallback(lock, error);
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
    const isSMS = m.send(lock) === "sms";
    const options = {
      connection: isSMS ? "sms" : "email",
      username: isSMS ? c.fullPhoneNumber(lock) : c.email(lock),
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
  swap(updateEntity, "lock", id, lock => m.setSignedIn(l.setSubmitting(lock, false), true));

  const lock = read(getEntity, "lock", id);
  l.invokeDoneCallback(lock, null, ...args);
}

function signInError(id, error) {
  swap(updateEntity, "lock", id, l.setSubmitting, false, error.description);

  const lock = read(getEntity, "lock", id);
  l.invokeDoneCallback(lock, error);
}

export function reset(id, opts = {}) {
  swap(updateEntity, "lock", id, m.reset, opts);
}

export function close(id) {
  closeLock(id, m.reset);
}

export function back(id, resetOpts = {}) {
  reset(id, resetOpts);
}
