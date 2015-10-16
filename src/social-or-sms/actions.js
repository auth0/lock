import { getEntity, read } from '../store/index';
import { closeLock } from '../lock/actions';
import * as l from '../lock/index';

export function close(id, force = false) {
  const lock = read(getEntity, "lock", id);
  if (l.ui.closable(lock) || force) {
    closeLock(id);
  }
}
