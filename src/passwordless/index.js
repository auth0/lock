import { List, Map } from 'immutable';
import * as l from '../lock/index';
import { clearCreds } from '../cred/index';
import { dataFns } from '../utils/data_utils';

const { get, initNS, tget, tremove, tset } = dataFns(["passwordless"]);

export function initPasswordless(m, opts) {
  // TODO: validate send option
  return opts.send
    ? initNS(m, Map({send: opts.send}))
    : m;
}

function setResendStatus(m, value) {
  // TODO: check value
  return tset(m, "resendStatus", value);
}

export function setResendSuccess(m) {
  return setResendStatus(m, "success");
}

export function resendSuccess(m) {
  return resendStatus(m) == "success";
}

export function setResendFailed(m) {
  return setResendStatus(m, "failed");
}

export function resendFailed(m) {
  return resendStatus(m) == "failed";
}

export function resendOngoing(m) {
  return resendStatus(m) == "ongoing";
}

export function resend(m) {
  if (resendAvailable(m)) {
    return setResendStatus(m, "ongoing");
  } else {
    return m;
  }
}

function resendStatus(m) {
  return tget(m, "resendStatus", "waiting");
}

export function resendAvailable(m) {
  return resendStatus(m) == "waiting" || resendStatus(m) == "failed";
}

export function restartPasswordless(m) {
  // TODO: maybe we can take advantage of the transient fields
  m = tremove(m, "passwordlessStarted");
  m = tremove(m, "resendStatus")  // only for link
  m = clearCreds(m, ["vcode"]); // only for code

  return l.clearGlobalError(m);
}

export function send(m) {
  // TODO: maybe it's better to explicitly set send = "link" during
  // initialization.
  return get(m, "send", "link");
}

export function isSendLink(m) {
  return send(m) === "link";
}

export function setPasswordlessStarted(m, value) {
  return tset(m, "passwordlessStarted", value);
}

export function passwordlessStarted(m) {
  return tget(m, "passwordlessStarted", false);
}

export function passwordlessConnection(m) {
  return l.getEnabledConnections(m, "passwordless").get(0, Map());
}

export function isEmail(m) {
  const c = passwordlessConnection(m);
  return c.isEmpty()
    ? undefined
    : c.get("strategy") === "email";
}
