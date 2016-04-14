import {
  hasSyncStatus,
  markError,
  markLoading,
  markSuccess,
  reject
} from '../remote_data';
import { getEntity, read, swap, updateEntity } from '../store/index';


export function sync(id, key, conditionFn, syncFn, updateFn) {
  let m = read(getEntity, "lock", id);

  if (hasSyncStatus(m)) return;

  if (typeof conditionFn === "function" && !conditionFn(m)) {
    swap(updateEntity, "lock", id, reject, key);
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
