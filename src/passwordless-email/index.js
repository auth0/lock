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

export function allowResend(m) {
  if (resendStatus(m) === "unavailable") {
    return setResendStatus(m, "waiting");
  } else {
    return m;
  }
}

export function resend(m) {
  if (resendAvailable(m)) {
    return setResendStatus(m, "ongoing");
  } else {
    return m;
  }
}

function resendStatus(m) {
  return m.get("resendStatus", "unavailable");
}

export function resendAvailable(m) {
  return resendStatus(m) == "waiting" || resendStatus(m) == "failed";
}

export function reset(m) {
  return m.remove("credentials").remove("emailSent").remove("resendStatus");
}
