// syncing is never transient
import{ Map } from 'immutable';
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

function removeKeys(m, keys) {
  return keys.reduce((r, k) => r.deleteIn(syncStatusKey(k)), m);
}

function findKeys(m) {
  return m.reduce((r, v, k) => {
    const current = Map.isMap(v) && v.has("syncStatus") ? [k] : [];
    const nested = Map.isMap(v)
          ? findKeys(v).map(x => [k].concat(x))
          : [];
    return r.concat(current, ...[nested]);
  }, []);
}

export function isDone(m) {
  const keys = findKeys(get(m, [], Map()));
  return keys.length > 0 && keys.reduce((r, k) => r && !isLoading(m, k), true);
}

export function hasError(m, excludeKeys = []) {
  const keys = findKeys(removeKeys(get(m, [], Map()), excludeKeys));
  return keys.length > 0 && keys.reduce((r, k) => r || getStatus(m, k) === "error", false);
}

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
