// syncing is never transient
import { getEntity, read, swap, updateEntity } from './store/index';
import { dataFns } from './utils/data_utils';
const { get, set } = dataFns(["sync"]);

export function sync(id, key, conditionFn, syncFn, updateFn) {
  let m = read(getEntity, "lock", id);

  if (hasSyncStatus(m, key)) return;

  if (typeof conditionFn === "function" && !conditionFn(m)) {
    swap(updateEntity, "lock", id, reject, key);
    return;
  }

  swap(updateEntity, "lock", id, markLoading, key);

  m = read(getEntity, "lock", id);
  syncFn(m, (error, result) => {
    if (error) {
      swap(updateEntity, "lock", id, markError, key);
    } else {
      swap(updateEntity, "lock", id, m => updateFn(markSuccess(m, key), result));
    }
  });
}

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
