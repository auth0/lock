import Immutable from 'immutable';
import WebAPI from './web_api';
import { getEntity, read, swap, setEntity, updateEntity } from '../store/index';
import * as l from './index';

export function setupLock(id, clientID, domain) {
  const lock = l.setup({id: id, clientID: clientID, domain: domain});
  swap(setEntity, "lock", id, lock);

  WebAPI.setupClient(id, clientID, domain);
}

export function openLock(id, mode, options) {
  const lock = read(getEntity, "lock", id);
  if (l.show(lock)) {
    return false;
  }
  swap(updateEntity, "lock", id, l.render, mode, options);
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
    }, 1000);
  } else {
    callback(lock);
  }
}

export function registerMode(spec) {
  swap(setEntity, "mode", spec.name, Immutable.fromJS(spec));
}
