import { Map } from 'immutable';
import { dataFns } from './utils/data_utils';
const { get, set } = dataFns(['sync']);
import * as l from './core/index';

import { getEntity, observe, read, swap, updateEntity } from './store/index';

export default (m, key, opts) => {
  if (get(m, key) !== undefined) return m;

  const status = opts.waitFn
    ? 'waiting'
    : !opts.conditionFn || opts.conditionFn(m) ? 'pending' : 'no';

  return set(
    m,
    key,
    Map({
      conditionFn: opts.conditionFn,
      errorFn: opts.errorFn,
      recoverResult: opts.recoverResult,
      syncStatus: status,
      successFn: opts.successFn,
      syncFn: opts.syncFn,
      timeout: opts.timeout || 6000,
      waitFn: opts.waitFn
    })
  );
};

const syncStatusKey = key => (global.Array.isArray(key) ? key : [key]).concat(['syncStatus']);
const getStatus = (m, key) => get(m, syncStatusKey(key));
const setStatus = (m, key, str) => set(m, syncStatusKey(key), str);
const getProp = (m, key, name) => get(m, key).get(name);

const findKeys = m => {
  return m.reduce((r, v, k) => {
    const current = Map.isMap(v) && v.has('syncStatus') ? [k] : [];
    const nested = Map.isMap(v) ? findKeys(v).map(x => [k].concat(x)) : [];
    return r.concat(current, ...[nested]);
  }, []);
};

function removeKeys(m, keys) {
  return keys.reduce((r, k) => r.deleteIn(syncStatusKey(k)), m);
}

const process = (m, id) => {
  const keys = findKeys(get(m, [], Map()));
  // TODO timeout
  return keys.reduce((r, k) => {
    if (typeof getProp(r, k, 'syncFn') != 'function') return r;
    if (getStatus(r, k) === 'pending') {
      r = setStatus(r, k, 'loading');
      let called = false;
      getProp(r, k, 'syncFn')(r, (error, result) => {
        if (called) return;
        called = true;
        setTimeout(() => {
          swap(updateEntity, 'lock', id, m => {
            const errorFn = getProp(r, k, 'errorFn');

            if (error && typeof errorFn === 'function') {
              setTimeout(() => errorFn(m, error), 0);
            }

            const recoverResult = getProp(m, k, 'recoverResult');

            if (error && recoverResult === undefined) {
              return handleError(m, k, error);
            } else {
              m = setStatus(m, k, 'ok');
              return getProp(m, k, 'successFn')(m, error ? recoverResult : result);
            }
          });
        }, 0);
      });
    } else if (getStatus(r, k) === 'waiting') {
      if (getProp(r, k, 'waitFn')(r)) {
        const conditionFn = getProp(r, k, 'conditionFn');
        r = setStatus(r, k, !conditionFn || conditionFn(r) ? 'pending' : 'no');
      }
    }

    return r;
  }, m);
};

export const go = id => {
  observe('sync', id, m => {
    setTimeout(() => swap(updateEntity, 'lock', id, process, id), 0);
  });
};

export function isSuccess(m, key) {
  return getStatus(m, key) === 'ok';
}

export function isDone(m) {
  const keys = findKeys(get(m, [], Map()));
  return keys.length > 0 && keys.reduce((r, k) => r && !isLoading(m, k), true);
}

export function hasError(m, excludeKeys = []) {
  const keys = findKeys(removeKeys(get(m, [], Map()), excludeKeys));
  return keys.length > 0 && keys.reduce((r, k) => r || getStatus(m, k) === 'error', false);
}

function isLoading(m, key) {
  return ['loading', 'pending', 'waiting'].indexOf(getStatus(m, key)) > -1;
}

function handleError(m, key, error) {
  let result = setStatus(m, key, 'error');

  // TODO: this should be configurable for each sync
  if (key !== 'sso') {
    const stopError = new Error(
      `An error occurred when fetching ${key} data for Lock: ${error.message}`
    );
    stopError.code = 'sync';
    stopError.origin = error;
    result = l.stop(result, stopError);
  }

  return result;
}
