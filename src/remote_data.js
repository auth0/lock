// syncing is never transient

import { dataFns } from './utils/data_utils';
const { get, set } = dataFns(["sync"]);

const syncStatusKey = key => (
  (global.Array.isArray(key) ? key : [key]).concat(["syncStatus"])
);
const getStatus = (m, key) => get(m, syncStatusKey(key));
const setStatus = (m, key, str) => set(m, syncStatusKey(key), str);

export function isLoading(m, key) {
  return getStatus(m, key) === "loading";
}

export function isSuccess(m, key) {
  return getStatus(m, key) === "ok";
}

export function hasSyncStatus(m, key) {
  return getStatus(m, key) !== undefined;
}

export function markLoading(m, key) {
  return setStatus(m, key, "loading");
}

export function markSuccess(m, key) {
  return setStatus(m, key, "ok");
}

export function markError(m, key) {
  return setStatus(m, key, "error");
}

export function reject(m, key) {
  return setStatus(m, key, "no");
}
