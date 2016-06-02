import { Map } from 'immutable';
import { read, getEntity, swap, updateEntity } from '../../store/index';
import {
  closeLock,
  logIn as coreLogIn,
  validateAndSubmit
} from '../../core/actions';
import webApi from '../../core/web_api';
import * as c from '../../field/index';
import * as l from '../../core/index';
import {
  resend,
  restartPasswordless,
  send,
  setPasswordlessStarted,
  setResendFailed,
  setResendSuccess
} from './index';

export function requestPasswordlessEmail(id) {
  validateAndSubmit(id, ["email"], m => {
    const params = {
      email: c.getFieldValue(m, "email"),
      send: send(m)
    };

    webApi.startPasswordless(id, params, error => {
      if (error) {
        setTimeout(() => requestPasswordlessEmailError(id, error), 250);
      } else {
        requestPasswordlessEmailSuccess(id);
      }
    });
  });
}

export function requestPasswordlessEmailSuccess(id) {
  swap(updateEntity, "lock", id, lock => {
    return setPasswordlessStarted(l.setSubmitting(lock, false), true);
  });
}

export function requestPasswordlessEmailError(id, error) {
  const lock = read(getEntity, "lock", id);
  // TODO: update to new i18n API when bringing passwordless back
  // const errorMessage = l.ui.t(lock, ["error", "passwordless", error.error], {medium: "email", __textOnly: true}) || l.ui.t(lock, ["error", "passwordless", "lock.request"], {medium: "email", __textOnly: true})
  const errorMessage = "";
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function sendSMS(id) {
  // TODO: abstract this submit thing.
  swap(updateEntity, "lock", id, lock => {

    if (c.isFieldValid(lock, "phoneNumber")) {
      return l.setSubmitting(lock, true);
    } else {
      return c.setFieldShowInvalid(lock, "phoneNumber", true);
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    const options = {phoneNumber: c.fullPhoneNumber(lock)};
    webApi.startPasswordless(id, options, error => {
      if (error) {
        setTimeout(() => sendSMSError(id, error), 250);
      } else {
        sendSMSSuccess(id);
      }
    });
  }
}

export function sendSMSSuccess(id) {
  swap(updateEntity, "lock", id, lock => {
    lock = l.setSubmitting(lock, false);
    lock = setPasswordlessStarted(lock, true);
    return lock;
  });

  const lock = read(getEntity, "lock", id);
}

export function sendSMSError(id, error) {
  const lock = read(getEntity, "lock", id);
  let errorMessage;
  // TODO: update to new i18n API when bringing passwordless back
  errorMessage = "";
  // if (error.error === "sms_provider_error" && (error.description || "").indexOf("(Code: 21211)") > -1) {
  //   errorMessage = l.ui.t(lock, ["error", "passwordless", "sms_provider_error.bad_phone_number"], {phoneNumber: c.fullPhoneNumber(lock), __textOnly: true});
  // } else {
  //   errorMessage = l.ui.t(lock, ["error", "passwordless", error.error], {medium: "SMS", __textOnly: true}) || l.ui.t(lock, ["error", "passwordless", "lock.request"], {medium: "SMS", __textOnly: true})
  // }

  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function resendEmail(id) {
  swap(updateEntity, "lock", id, resend);

  const lock = read(getEntity, "lock", id);
  const options = {
    email: c.email(lock),
    send: send(lock),
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
  swap(updateEntity, "lock", id, setResendSuccess);
}

export function resendEmailError(id, error) {
  swap(updateEntity, "lock", id, setResendFailed);
}

export function logIn(id) {
  const m = read(getEntity, "lock", id);
  const params = {passcode: c.getFieldValue(m, "vcode")};
  if (send(m) === "sms") {
    params.phoneNumber = c.fullPhoneNumber(m);
  } else {
    params.email = c.getFieldValue(m, "email");
  }

  coreLogIn(id, ["vcode"], params);
}

export function restart(id) {
  swap(updateEntity, "lock", id, restartPasswordless);
}
