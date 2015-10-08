import { read, getEntity } from '../store/index';
import { closeLock } from '../lock/actions';
import WebAPI from '../lock/web_api';
import * as l from '../lock/index';

export function close(id, force = false) {
  const lock = read(getEntity, "lock", id);
  if (l.ui.closable(lock) || force) {
    closeLock(id);
  }
}

export function signIn(id, connection) {
  const lock = read(getEntity, "lock", id);
  const options = {
    connection: connection,
    popup: l.ui.popup(lock),
    popupOptions: l.ui.popupOptions(lock),
    // sso: false
  };
  WebAPI.signIn(id, options, (...args) => console.log("cb", args));
}
