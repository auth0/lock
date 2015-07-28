export function setEmailSent(m, value) {
  return m.set("emailSent", value);
}

export function emailSent(m) {
  return m.get("emailSent", false);
}
