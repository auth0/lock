import { List } from 'immutable';
import * as l from '../lock/index';

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
  let keyPaths = List([
    ["passwordlessStarted"],
    ["resendStatus"],
    ["selectingLocation"],
    ["signedIn"]
  ]);

  // TODO `signedIn` should be handled at the lock level, later instead of
  // calling l.clearGlobalError we should call something like l.reset.

  const { clearCred } = opts;

  if (!clearCred) {
    keyPaths = keyPaths.push(["cred"]);
  } else {
    const credKeyPaths = List(clearCred).map(x => ["cred", x]);
    keyPaths = keyPaths.concat(credKeyPaths);
  }

  m = keyPaths.reduce((r, v) => r.removeIn(v), m);

  return l.clearGlobalError(m);
}

export function send(m) {
  return l.modeOptions(m).get("send", "link")
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
