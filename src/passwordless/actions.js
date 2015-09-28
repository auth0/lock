import { Map } from 'immutable';
import { read, getEntity, swap, updateEntity } from '../store/index';
import { closeLock } from '../lock/actions';
import webApi from '../lock/web_api';
import * as c from '../cred/index';
import * as cc from '../cred/country_codes';
import * as cs from '../cred/storage';
import * as l from '../lock/index';
import * as m from './index';

export function changePhoneNumber(id, phoneNumber) {
  swap(updateEntity, "lock", id, c.setPhoneNumber, phoneNumber);
}

export function changePhoneLocation(id, location) {
  swap(updateEntity, "lock", id, lock => {
    lock = m.closeLocationSelect(lock);
    lock = c.setPhoneLocation(lock, location);
    return lock;
  });
}

export function setDefaultLocation(id, str) {
  const result = cc.findByIsoCode(str);
  if (!result) {
    throw new Error(`Unable to set the default location, can't find any country with the code "${str}".`);
  }

  swap(updateEntity, "lock", id, c.setPhoneLocation, result);
}

export function changeEmail(id, email) {
  swap(updateEntity, "lock", id, c.setEmail, email);
}

export function changeVcode(id, vcode) {
  swap(updateEntity, "lock", id, c.setVcode, vcode)
}

export function selectPhoneLocation(id, searchStr) {
  swap(updateEntity, "lock", id, m.openLocationSelect, searchStr);
}

export function cancelSelectPhoneLocation(id) {
  swap(updateEntity, "lock", id, m.closeLocationSelect);
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
    const isMagicLink = m.send(lock) === "link";
    const options = {
      authParams: isMagicLink ? l.login.authParams(lock).toJS() : {},
      callbackURL: l.login.callbackURL(lock),
      forceJSONP: l.login.forceJSONP(lock),
      email: c.email(lock),
      send: m.send(lock),
      responseType: l.login.responseType(lock)
    };

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
  cs.store(lock, "email", l.modeOptions(lock).get("storageKey"));
  if (m.send(lock) === "link") {
    l.invokeDoneCallback(lock, null, c.email(lock));
  }
}

export function requestPasswordlessEmailError(id, error) {
  const lock = read(getEntity, "lock", id);
  const errorMessage = l.ui.t(lock, ["error", "passwordless", error.error], {medium: "email", __textOnly: true}) || l.ui.t(lock, ["error", "passwordless", "lock.request"], {medium: "email", __textOnly: true})
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
  if (m.send(lock) === "link") {
    l.invokeDoneCallback(lock, error);
  }
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
    lock = m.setPasswordlessStarted(lock, true);
    return lock;
  });

  const lock = read(getEntity, "lock", id);
  cs.store(lock, "phoneNumber", l.modeOptions(lock).get("storageKey"));
}

export function sendSMSError(id, error) {
  const lock = read(getEntity, "lock", id);
  const errorMessage = l.ui.t(lock, ["error", "passwordless", error.error], {medium: "SMS", __textOnly: true}) || l.ui.t(lock, ["error", "passwordless", "lock.request"], {medium: "SMS", __textOnly: true})
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function resendEmail(id) {
  swap(updateEntity, "lock", id, m.resend);

  const lock = read(getEntity, "lock", id);
  const options = {
    authParams: m.send(lock) === "link" ? l.login.authParams(lock).toJS() : {},
    email: c.email(lock),
    send: m.send(lock),
    responseType: l.login.responseType(lock),
    callbackURL: l.login.callbackURL(lock),
    forceJSONP: l.login.forceJSONP(lock)
  };
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
    const options = {
      passcode: c.vcode(lock),
      redirect: l.shouldRedirect(lock),
      responseType: l.login.responseType(lock),
      callbackURL: l.login.callbackURL(lock),
      forceJSONP: l.login.forceJSONP(lock)
    };

    if (m.send(lock) === "sms") {
      options.phoneNumber = c.fullPhoneNumber(lock);
    } else {
      options.email = c.email(lock);
    }

    webApi.signIn(
      id,
      Map(options).merge(l.login.authParams(lock)).toJS(),
      (error, ...args) => error ? signInError(id, error) : signInSuccess(id, ...args)
    );
  }
}

function signInSuccess(id, ...args) {
  const lock = read(getEntity, "lock", id);
  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, lock => m.setSignedIn(l.setSubmitting(lock, false), true));
    l.invokeDoneCallback(lock, null, ...args);
  } else {
    closeLock(id, m.reset, lock => l.invokeDoneCallback(lock, null, ...args));
  }
}

function signInError(id, error) {
  const lock = read(getEntity, "lock", id);
  const cred = m.send(lock) === "sms" ? "phone number" : "email";
  const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {cred: cred, __textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {cred: cred, __textOnly: true});
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);

  l.invokeDoneCallback(lock, error);
}

export function reset(id, opts = {}) {
  swap(updateEntity, "lock", id, m.reset, opts);
}

export function close(id, force = false) {
  const lock = read(getEntity, "lock", id);
  if (l.ui.closable(lock) || force) {
    closeLock(id, m.reset);
  }
}

export function back(id, resetOpts = {}) {
  reset(id, resetOpts);
}
