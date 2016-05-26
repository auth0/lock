import { Map } from 'immutable';
import { read, getEntity, swap, updateEntity } from '../../store/index';
import { closeLock } from '../../core/actions';
import webApi from '../../core/web_api';
import * as c from '../../field/index';
import * as l from '../../core/index';
import * as m from './index';

export function requestPasswordlessEmail(id) {
  // TODO: abstract this submit thing.
  swap(updateEntity, "lock", id, lock => {
    if (c.isFieldValid(lock, "email")) {
      return l.setSubmitting(lock, true);
    } else {
      return c.setFieldShowInvalid(lock, "email", true);
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    const isMagicLink = m.send(lock) === "link";
    const options = {
      email: c.email(lock),
      send: m.send(lock),
    };

    webApi.startPasswordless(id, options, error => {
      if (error) {
        setTimeout(() => requestPasswordlessEmailError(id, error), 250);
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
}

export function requestPasswordlessEmailError(id, error) {
  const lock = read(getEntity, "lock", id);
  const errorMessage = l.ui.t(lock, ["error", "passwordless", error.error], {medium: "email", __textOnly: true}) || l.ui.t(lock, ["error", "passwordless", "lock.request"], {medium: "email", __textOnly: true})
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
    lock = m.setPasswordlessStarted(lock, true);
    return lock;
  });

  const lock = read(getEntity, "lock", id);
}

export function sendSMSError(id, error) {
  const lock = read(getEntity, "lock", id);
  let errorMessage;
  if (error.error === "sms_provider_error" && (error.description || "").indexOf("(Code: 21211)") > -1) {
    errorMessage = l.ui.t(lock, ["error", "passwordless", "sms_provider_error.bad_phone_number"], {phoneNumber: c.fullPhoneNumber(lock), __textOnly: true});
  } else {
    errorMessage = l.ui.t(lock, ["error", "passwordless", error.error], {medium: "SMS", __textOnly: true}) || l.ui.t(lock, ["error", "passwordless", "lock.request"], {medium: "SMS", __textOnly: true})
  }

  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function resendEmail(id) {
  swap(updateEntity, "lock", id, m.resend);

  const lock = read(getEntity, "lock", id);
  const options = {
    email: c.email(lock),
    send: m.send(lock),
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
}

export function resendEmailError(id, error) {
  swap(updateEntity, "lock", id, m.setResendFailed);
  const lock = read(getEntity, "lock", id);
}

export function logIn(id) {
  // TODO: abstract this submit thing
  swap(updateEntity, "lock", id, lock => {
    if (c.isFieldValid(lock, "vcode")) {
      return l.setSubmitting(lock, true);
    } else {
      return c.setFieldShowInvalid(lock, "vcode", true);
    }
  });

  const lock = read(getEntity, "lock", id);

  if (l.submitting(lock)) {
    const options = {
      passcode: c.vcode(lock)
    };

    if (m.send(lock) === "sms") {
      options.phoneNumber = c.fullPhoneNumber(lock);
    } else {
      options.email = c.email(lock);
    }

    webApi.logIn(
      id,
      options,
      (error, ...args) => {
        if (error) {
          setTimeout(() => logInError(id, error), 250);
        } else {
          logInSuccess(id, ...args);
        }
      }
    );
  }
}

function logInSuccess(id, ...args) {
  const lock = read(getEntity, "lock", id);
  const autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, lock => l.setLoggedIn(l.setSubmitting(lock, false), true));
    l.invokeLogInCallback(lock, null, ...args);
  } else {
    closeLock(id, false, lock => l.invokeLogInCallback(lock, null, ...args));
  }
}

function logInError(id, error) {
  const lock = read(getEntity, "lock", id);
  const field = m.send(lock) === "sms" ? "phone number" : "email";
  const errorMessage = l.ui.t(lock, ["error", "signIn", error.error], {field: field, __textOnly: true}) || l.ui.t(lock, ["error", "signIn", "lock.request"], {field: field, __textOnly: true});
  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);

  l.invokeLogInCallback(lock, error);
}

export function restart(id) {
  swap(updateEntity, "lock", id, m.restartPasswordless);
}
