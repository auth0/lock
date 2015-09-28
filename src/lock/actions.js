import Immutable from 'immutable';
import WebAPI from './web_api';
import { getEntity, read, removeEntity, swap, setEntity, updateEntity } from '../store/index';
import * as l from './index';
import * as cs from '../cred/storage';

export function setupLock(id, clientID, domain) {
  const lock = l.setup({id: id, clientID: clientID, domain: domain});
  swap(setEntity, "lock", id, lock);

  WebAPI.setupClient(id, clientID, domain);
}

export function openLock(id, mode, options) {
  const lock = read(getEntity, "lock", id);
  if (!lock) {
    throw new Error("The Lock can't be opened again after it has been closed");
  }

  if (l.show(lock)) {
    return false;
  }

  swap(updateEntity, "lock", id, lock => {
    lock = l.render(lock, mode, options);
    return l.ui.rememberLastLogin(lock) ?
      cs.restore(lock, options.modeOptions.storageKey) : lock;
  });

  setTimeout(() => swap(updateEntity, "lock", id, l.setShow, true), 17);
  return true;
}

export function closeLock(id, resetFn, callback = () => {}) {
  swap(updateEntity, "lock", id, lock => {
    if (!l.ui.appendContainer(lock)) {
      lock = lock.remove("render");
    }
    lock = l.close(lock)
    return resetFn(lock);
  });

  const lock = read(getEntity, "lock", id);
  if (l.rendering(lock)) {
    setTimeout(() => {
      swap(updateEntity, "lock", id, m => m.remove("render"));
      callback(read(getEntity, "lock", id));
      setTimeout(() => swap(removeEntity, "lock", id), 17);
    }, 1000);
  } else {
    swap(removeEntity, "lock", id);
    callback(lock);
  }
}

export function updateLock(id, f) {
  return swap(updateEntity, "lock", id, f);
}

export function registerMode(spec) {
  swap(setEntity, "mode", spec.name, Immutable.fromJS(spec));
}
