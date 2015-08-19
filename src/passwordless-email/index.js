import * as l from '../lock/index';

export function setEmailSent(m, value) {
  return m.set("emailSent", value);
}

export function emailSent(m) {
  return m.get("emailSent", false);
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

export function reset(m, clearCred = true) {
  if (clearCred) {
    m = m.remove("cred");
  }
  return l.clearGlobalError(m.remove("emailSent").remove("resendStatus"));
}

export function send(m) {
  return m.getIn(["modeOptions", "send"], "link");
}

export function isSendLink(m) {
  return send(m) === "link";
}

export function close(m) {
  return reset(l.close(m));
}
