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
  isEmail,
  resend,
  restartPasswordless,
  send,
  setPasswordlessStarted,
  setResendFailed,
  setResendSuccess
} from './index';
import { phoneNumberWithDiallingCode } from '../../field/phone_number';

export function requestPasswordlessEmail(id) {
  validateAndSubmit(id, ["email"], m => {
    sendEmail(m, requestPasswordlessEmailSuccess, requestPasswordlessEmailError);
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

export function resendEmail(id) {
  swap(updateEntity, "lock", id, resend);
  const m = read(getEntity, "lock", id);
  sendEmail(m, resendEmailSuccess, resendEmailError);
}

function resendEmailSuccess(id) {
  swap(updateEntity, "lock", id, setResendSuccess);
}

function resendEmailError(id, error) {
  swap(updateEntity, "lock", id, setResendFailed);
}

function sendEmail(m, successFn, errorFn) {
  const params = {
    email: c.getFieldValue(m, "email"),
    send: send(m)
  };

  webApi.startPasswordless(l.id(m), params, error => {
    if (error) {
      setTimeout(() => errorFn(l.id(m), error), 250);
    } else {
      successFn(l.id(m));
    }
  });
}

export function sendSMS(id) {
  validateAndSubmit(id, ["phoneNumber"], m => {
    const params = {phoneNumber: phoneNumberWithDiallingCode(m)};
    webApi.startPasswordless(id, params, error => {
      if (error) {
        setTimeout(() => sendSMSError(id, error), 250);
      } else {
        sendSMSSuccess(id);
      }
    });
  });
}

export function sendSMSSuccess(id) {
  swap(updateEntity, "lock", id, m => {
    m = l.setSubmitting(m, false);
    m = setPasswordlessStarted(m, true);
    return m;
  });
}

export function sendSMSError(id, error) {
  const m = read(getEntity, "lock", id);
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

export function logIn(id) {
  const m = read(getEntity, "lock", id);
  const params = {passcode: c.getFieldValue(m, "vcode")};
  if (isEmail(m)) {
    params.email = c.getFieldValue(m, "email");
  } else {
    params.phoneNumber = phoneNumberWithDiallingCode(m);
  }

  coreLogIn(id, ["vcode"], params);
}

export function restart(id) {
  swap(updateEntity, "lock", id, restartPasswordless);
}
