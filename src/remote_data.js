export function isLoading(m, key) {
  return m.getIn([key, "syncStatus"]) === "loading";
}

export function hasSyncStatus(m, key) {
  return m.getIn([key, "syncStatus"]) !== undefined;
}

export function markLoading(m, key) {
  return m.setIn([key, "syncStatus"], "loading");
}

export function markSuccess(m, key) {
  return m.setIn([key, "syncStatus"], "ok");
}

export function markError(m, key) {
  return m.setIn([key, "syncStatus"], "error");
}

export function reject(m, key) {
  return m.setIn([key, "syncStatus"], "no");
}
