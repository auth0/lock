import Immutable from 'immutable';
import WebAPI from './web_api';
import { getEntity, read, removeEntity, swap, setEntity, updateEntity } from '../store/index';
import * as l from './index';
import * as cs from '../cred/storage';

export function setupLock(id, clientID, domain) {
  const lock = l.setup({id: id, clientID: clientID, domain: domain});
  swap(setEntity, "lock", id, lock);

  WebAPI.setupClient(id, clientID, domain);

  // TODO: only modes with a phone number are making use of the user's location
  const user = read(getEntity, "user");
  const location = user && user.get("location");

  if (!location) {
    WebAPI.getUserCountry(id, (err, isoCode) => {
      if (!err) {
        swap(updateEntity, "user", 0, m => m.set("location", isoCode));
      }
    });
  }
}

export function openLock(id, modeName, options) {
  const lock = read(getEntity, "lock", id);
  if (!lock) {
    throw new Error("The Lock can't be opened again after it has been destroyed");
  }

  if (l.show(lock)) {
    return false;
  }

  swap(updateEntity, "lock", id, lock => {
    lock = l.render(lock, modeName, options);

    return l.ui.rememberLastLogin(lock)
      ? cs.restore(lock, l.modeName(lock))
      : lock;
  });

  setTimeout(() => swap(updateEntity, "lock", id, l.setShow, true), 17);
  return true;
}

export function closeLock(id, force = false, callback = () => {}) {
  // Do nothing when the Lock can't be closed, unless closing is forced.
  let lock = read(getEntity, "lock", id);
  if (!l.ui.closable(lock) && !force) {
    return;
  }

  // Close the Lock. Also, stop rendering when in inline mode. In modal mode we
  // need to wait for the close animation to finish before stop rendering the
  // Lock.
  swap(updateEntity, "lock", id, lock => {
    if (!l.ui.appendContainer(lock)) {
      lock = lock.remove("render");
    }

    return l.close(lock)
  });

  // If we are still rendering (modal mode), schedule a function that will
  // execute the callback and destroy the Lock (liberate its resources). If we
  // are not rendering (inline mode), do both things immediately.
  lock = read(getEntity, "lock", id);

  if (l.rendering(lock)) {
    setTimeout(() => {
      // swap(updateEntity, "lock", id, m => m.remove("render"));
      callback(read(getEntity, "lock", id));
      setTimeout(() => swap(updateEntity, "lock", id, l.reset), 17);
    }, 1000);
  } else {
    swap(updateEntity, "lock", id, l.reset);
    callback(lock);
  }
}

export function removeLock(id) {
  swap(updateEntity, "lock", id, (lock) => lock.remove("render"));
  swap(removeEntity, "lock", id);
}

export function updateLock(id, f) {
  return swap(updateEntity, "lock", id, f);
}

export function registerMode(spec) {
  swap(setEntity, "mode", spec.name, Immutable.fromJS(spec));
}
