import * as l from '../lock/index';

export function setSelectingLocation(m, value) {
  return m.set("selectingLocation", !!value);
}

export function selectingLocation(m) {
  return m.get("selectingLocation", false);
}

export function setSMSSent(m, value) {
  return m.set("smsSent", value);
}

export function smsSent(m) {
  return m.get("smsSent", false);
}

export function reset(m, clearCred = true) {
  if (clearCred) {
    m = m.remove("cred");
  }
  return l.clearGlobalError(m.remove("selectingLocation").remove("smsSent"));
}

export function close(m) {
  return reset(l.close(m));
}
