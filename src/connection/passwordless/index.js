import Immutable, { List, Map } from 'immutable';
import * as l from '../../core/index';
import { clearFields } from '../../field/index';
import { initLocation } from '../../field/phone_number';
import { dataFns } from '../../utils/data_utils';
const { get, initNS, tget, tremove, tset } = dataFns(['passwordless']);
import webAPI from '../../core/web_api';
import sync from '../../sync';

export function initPasswordless(m, opts) {
  // TODO: validate opts

  const send = typeof opts.sendCode === 'boolean' && opts.sendCode ? 'code' : 'link';

  m = initNS(m, Map({ send: send }));
  if (opts.defaultLocation && typeof opts.defaultLocation === 'string') {
    m = initLocation(m, opts.defaultLocation.toUpperCase());
  } else {
    m = sync(m, 'location', {
      recoverResult: 'US',
      syncFn: (m, cb) => webAPI.getUserCountry(l.id(m), cb),
      successFn: (m, result) => initLocation(m, result)
    });
  }

  return m;
}

function setResendStatus(m, value) {
  // TODO: check value
  return tset(m, 'resendStatus', value);
}

export function setResendSuccess(m) {
  return setResendStatus(m, 'success');
}

export function resendSuccess(m) {
  return resendStatus(m) == 'success';
}

export function setResendFailed(m) {
  return setResendStatus(m, 'failed');
}

export function resendFailed(m) {
  return resendStatus(m) == 'failed';
}

export function resendOngoing(m) {
  return resendStatus(m) == 'ongoing';
}

export function resend(m) {
  if (resendAvailable(m)) {
    return setResendStatus(m, 'ongoing');
  } else {
    return m;
  }
}

function resendStatus(m) {
  return tget(m, 'resendStatus', 'waiting');
}

export function resendAvailable(m) {
  return resendStatus(m) == 'waiting' || resendStatus(m) == 'failed';
}

export function restartPasswordless(m) {
  // TODO: maybe we can take advantage of the transient fields
  m = tremove(m, 'passwordlessStarted');
  m = tremove(m, 'resendStatus'); // only for link
  m = clearFields(m, ['vcode']); // only for code

  return l.clearGlobalError(m);
}

export function send(m) {
  return get(m, 'send', isEmail(m) ? 'link' : 'code');
}

export function isSendLink(m) {
  return send(m) === 'link';
}

export function setPasswordlessStarted(m, value) {
  return tset(m, 'passwordlessStarted', value);
}

export function passwordlessStarted(m) {
  return tget(m, 'passwordlessStarted', false);
}

export function passwordlessConnection(m) {
  return (
    l.connections(m, 'passwordless', 'email').get(0) ||
    l.connections(m, 'passwordless', 'sms').get(0) ||
    new Map()
  );
}

export function isEmail(m) {
  const c = passwordlessConnection(m);
  return c.isEmpty() ? undefined : c.get('strategy') === 'email';
}
