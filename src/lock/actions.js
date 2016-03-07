import Immutable, { Map } from 'immutable';
import WebAPI from './web_api';
import { getEntity, read, removeEntity, swap, setEntity, updateEntity } from '../store/index';
import { syncRemoteData } from './remote-data/actions';
import * as l from './index';
import * as cs from '../cred/storage';

export function setupLock(id, clientID, domain, options, signInCallback, hookRunner, emitEventFn) {
  // TODO: run a hook before initialization, useful for when we want
  // to provide some options by default.
  const m = l.setup(id, clientID, domain, options, signInCallback, hookRunner, emitEventFn);

  swap(setEntity, "lock", id, m);
  // TODO: check options.mode is a valid mode.

  // TODO: this may trigger a second call to swap, maybe it can be
  // optimized. However, the Lock isn't rendering yet so it might not
  // be really an issue.
  hookRunner(options.mode, "didInitialize", id, options);

  WebAPI.setupClient(id, clientID, domain, options);

  if (l.auth.redirect(m)) {
    const hash = WebAPI.parseHash(id);

    if (hash) {
      // TODO: this leaves the hash symbol (#) in the URL, maybe we can
      // use the history API instead to remove it.
      global.window.location.hash = "";
      if (hash.error) {
        // TODO: should we pass the error directly or do some processing?
        setTimeout(() => l.invokeSignInCallback(m, hash), 0);
      } else {
        WebAPI.getProfile(id, hash.id_token, (error, profile) => {
          const result = {
            accessToken: hash.access_token,
            idToken: hash.id_token,
            payload: hash.profile,
            profile: profile,
            refreshToken: hash.refresh_token,
            state: hash.state
          };

          // TODO: should we pass the error directly or do some processing?
          l.invokeSignInCallback(m, error, result);
        });
      }
    } else {
      setTimeout(() => l.invokeSignInCallback(m, null), 0);
    }
  }

  syncRemoteData(id);
}

export function openLock(id) {
  const lock = read(getEntity, "lock", id);
  if (!lock) {
    throw new Error("The Lock can't be opened again after it has been destroyed");
  }

  if (l.show(lock)) {
    return false;
  }

  swap(updateEntity, "lock", id, lock => {
    lock = l.render(lock);
    lock = l.setShow(lock, true);

    return l.ui.rememberLastLogin(lock)
      ? cs.restore(lock, l.modeName(lock))
      : lock;
  });

  return true;
}

export function closeLock(id, force = false, callback = () => {}) {
  // Do nothing when the Lock can't be closed, unless closing is forced.
  let lock = read(getEntity, "lock", id);
  if (!l.ui.closable(lock) && !force) {
    return;
  }

  // Stop rendering.
  swap(updateEntity, "lock", id, lock => l.stopRendering(l.close(lock)));

  // If is a modal wait for the animation to end before resetting and
  // calling callback, otherwise do that immediately.
  if (l.ui.appendContainer(lock)) {
    setTimeout(() => {
      callback(read(getEntity, "lock", id));
      setTimeout(() => swap(updateEntity, "lock", id, l.reset), 17);
    }, 1000);
  } else {
    swap(updateEntity, "lock", id, l.reset);
    callback(lock);
  }
}

export function removeLock(id) {
  swap(updateEntity, "lock", id, lock => l.stopRendering(lock));
  swap(removeEntity, "lock", id);
}

export function updateLock(id, f) {
  return swap(updateEntity, "lock", id, f);
}

export function registerMode(spec) {
  swap(setEntity, "mode", spec.name, Immutable.fromJS(spec));
}

export function pinLoadingPane(id) {
  const lock = read(getEntity, "lock", id);
  if (!lock.get("isLoadingPanePinned")) {
    swap(updateEntity, "lock", id, m => m.set("isLoadingPanePinned", true));
  }
}

export function unpinLoadingPane(id) {
  swap(updateEntity, "lock", id, m => m.set("isLoadingPanePinned", false));
}

function emitEvent(id, str, ...args) {
  l.emitEvent(read(getEntity, "lock", id), str, ...args);
}
