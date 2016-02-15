import { List } from 'immutable';
import * as l from '../lock/index';
import { clearCreds } from '../cred/index';

export function initPasswordless(m, opts) {
  return opts.send
    ? m.setIn(["passwordless", "opts", "send"], opts.send)
    : m;
}

function setResendStatus(m, value) {
  // TODO: check value
  return m.set("resendStatus", value);
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
  return m.get("resendStatus", "waiting");
}

export function resendAvailable(m) {
  return resendStatus(m) == "waiting" || resendStatus(m) == "failed";
}

export function reset(m, opts = {}) {
  // TODO `signedIn` should be handled at the lock level, later
  // instead of calling l.clearGlobalError we should call something
  // like l.reset.
  //
  // NOTE: there's now a l.reset that doesn't need to know what keys
  // to clear. Maybe it can be used.

  let keys = [
    "passwordlessStarted",
    "resendStatus",
    "selectingLocation",
    "signedIn"
  ];

  m = keys.reduce((r, v) => r.remove(v), m);
  m = clearCreds(m, opts.clearCred);

  return l.clearGlobalError(m);
}

export function send(m) {
  return m.getIn(["passwordless", "opts", "send"], "link");
}

export function isSendLink(m) {
  return send(m) === "link";
}

export function setPasswordlessStarted(m, value) {
  return m.set("passwordlessStarted", value);
}

export function passwordlessStarted(m) {
  return m.get("passwordlessStarted", false);
}
