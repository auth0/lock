import { read, getEntity, swap, updateEntity } from '../../store/index';
import { validateAndSubmit, logInSuccess } from '../../core/actions';
import webApi from '../../core/web_api';
import * as c from '../../field/index';
import * as l from '../../core/index';
import {
  isEmail,
  isSendLink,
  resend,
  restartPasswordless,
  send,
  setPasswordlessStarted,
  setResendFailed,
  setResendSuccess,
  toggleTermsAcceptance as internalToggleTermsAcceptance
} from './index';
import { phoneNumberWithDiallingCode } from '../../field/phone_number';
import * as i18n from '../../i18n';
import { setCaptchaParams, showMissingCaptcha, swapCaptcha } from '../captcha';

function getErrorMessage(m, id, error) {
  let key = error.error;

  if (
    error.error === 'sms_provider_error' &&
    (error.description || '').indexOf('(Code: 21211)') > -1
  ) {
    key = 'bad.phone_number';
  }

  if (error.code === 'invalid_captcha') {
    const captchaConfig = l.passwordlessCaptcha(m);
    key = (
      captchaConfig.get('provider') === 'recaptcha_v2' ||
      captchaConfig.get('provider') === 'recaptcha_enterprise' ||
      captchaConfig.get('provider') === 'hcaptcha' ||
      captchaConfig.get('provider') === 'auth0_v2' ||
      captchaConfig.get('provider') === 'friendly_captcha' ||
      captchaConfig.get('provider') === 'arkose'
    ) ? 'invalid_recaptcha' : 'invalid_captcha';
  }

  return (
    i18n.html(m, ['error', 'passwordless', key]) ||
    i18n.html(m, ['error', 'passwordless', 'lock.fallback'])
  );
}

function swapCaptchaAfterError(id, error){
  const wasCaptchaInvalid = error && error.code === 'invalid_captcha';
  swapCaptcha(id, true, false, wasCaptchaInvalid);
}

export function requestPasswordlessEmail(id) {
  validateAndSubmit(id, ['email'], m => {
    sendEmail(m, id, requestPasswordlessEmailSuccess, requestPasswordlessEmailError);
  });
}

export function requestPasswordlessEmailSuccess(id) {
  swap(updateEntity, 'lock', id, m => {
    m = l.setSubmitting(m, false);
    return setPasswordlessStarted(m, true);
  });
}

export function requestPasswordlessEmailError(id, error) {
  const m = read(getEntity, 'lock', id);
  const errorMessage = getErrorMessage(m, id, error);
  swap(updateEntity, 'lock', id, l.setSubmitting, false, errorMessage);
  swapCaptchaAfterError(id, error);
}

export function resendEmail(id) {
  swap(updateEntity, 'lock', id, resend);
  const m = read(getEntity, 'lock', id);
  sendEmail(m, id, resendEmailSuccess, resendEmailError);
}

function resendEmailSuccess(id) {
  swap(updateEntity, 'lock', id, setResendSuccess);
}

function resendEmailError(id, error) {
  swap(updateEntity, 'lock', id, setResendFailed);
}

function getPasswordlessConnectionName(m, defaultPasswordlessConnection) {
  const connections = l.connections(m, 'passwordless', defaultPasswordlessConnection);

  return connections.size > 0 && l.useCustomPasswordlessConnection(m)
    ? connections.first().get('name')
    : defaultPasswordlessConnection;
}

function sendEmail(m, id, successFn, errorFn) {
  const params = {
    connection: getPasswordlessConnectionName(m, 'email'),
    email: c.getFieldValue(m, 'email'),
    send: send(m)
  };

  if (isSendLink(m) && !l.auth.params(m).isEmpty()) {
    params.authParams = l.auth.params(m).toJS();
  }
  const isCaptchaValid = setCaptchaParams(m, params, true, false, []);

  if (!isCaptchaValid) {
    return showMissingCaptcha(m, id, true);
  }

  webApi.startPasswordless(l.id(m), params, error => {
    if (error) {
      setTimeout(() => errorFn(l.id(m), error), 250);
    } else {
      successFn(l.id(m));
    }
  });
}

export function sendSMS(id) {
  validateAndSubmit(id, ['phoneNumber'], m => {
    const params = {
      connection: getPasswordlessConnectionName(m, 'sms'),
      phoneNumber: phoneNumberWithDiallingCode(m),
      send: send(m)
    };
    const isCaptchaValid = setCaptchaParams(m, params, true, false, []);
    if (!isCaptchaValid) {
      return showMissingCaptcha(m, id, true);
    }
    webApi.startPasswordless(id, params, error => {
      if (error) {
        setTimeout(() => sendSMSError(id, error), 250);
      } else {
        sendSMSSuccess(id);
      }
    });
  });
}

function sendSMSSuccess(id) {
  swap(updateEntity, 'lock', id, m => {
    m = l.setSubmitting(m, false);
    m = setPasswordlessStarted(m, true);
    return m;
  });
}

function sendSMSError(id, error) {
  const m = read(getEntity, 'lock', id);
  const errorMessage = getErrorMessage(m, id, error);
  l.emitAuthorizationErrorEvent(m, error);
  swap(updateEntity, 'lock', id, l.setSubmitting, false, errorMessage);
  swapCaptchaAfterError(id, error);
}

export function logIn(id) {
  const m = read(getEntity, 'lock', id);
  const authParams = l.auth.params(m).toJS();
  const params = {
    verificationCode: c.getFieldValue(m, 'vcode'),
    ...authParams
  };
  if (isEmail(m)) {
    params.connection = getPasswordlessConnectionName(m, 'email');
    params.email = c.getFieldValue(m, 'email');
  } else {
    params.connection = getPasswordlessConnectionName(m, 'sms');
    params.phoneNumber = phoneNumberWithDiallingCode(m);
  }
  swap(updateEntity, 'lock', id, l.setSubmitting, true);
  webApi.passwordlessVerify(id, params, (error, result) => {
    let errorMessage;
    if (error) {
      const m = read(getEntity, 'lock', id);
      errorMessage = getErrorMessage(m, id, error);
      if (error.logToConsole) {
        console.error(error.description);
      }
      l.emitAuthorizationErrorEvent(m, error);
      return swap(updateEntity, 'lock', id, l.setSubmitting, false, errorMessage);
    } else {
      return logInSuccess(id, result);
    }
  });
}

export function restart(id) {
  swap(updateEntity, 'lock', id, restartPasswordless);
  swapCaptcha(id, true, false, false);
}

export function toggleTermsAcceptance(id) {
  swap(updateEntity, 'lock', id, internalToggleTermsAcceptance);
}
