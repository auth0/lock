import Immutable, { Map } from 'immutable';
import webApi from './web_api';
import { getCollection, getEntity, read, removeEntity, swap, setEntity, updateEntity } from '../store/index';
import { syncRemoteData } from './remote_data';
import * as l from './index';
import { img as preload } from '../utils/preload_utils';
import { defaultProps } from '../ui/box/container';
import { isFieldValid, showInvalidField } from '../field/index';

export function setupLock(id, clientID, domain, options, hookRunner, emitEventFn) {
  let m = syncRemoteData(l.setup(id, clientID, domain, options, hookRunner, emitEventFn));
  preload(l.ui.logo(m) || defaultProps.logo);

  webApi.setupClient(id, clientID, domain, l.withAuthOptions(m, {
    ...options,
    popupOptions: l.ui.popupOptions(m)
  }));

  m = l.runHook(m, "didInitialize", options);

  swap(setEntity, "lock", id, m);
}

export function handleAuthCallback() {
  const hash = global.location.hash;

  const ms = read(getCollection, "lock");
  const parsed = ms.filter(m => l.auth.redirect(m) && parseHash(m, hash));

  if (parsed.size > 0) {
    global.location.hash = "";
  }
}

function parseHash(m, hash) {
  const parsedHash = webApi.parseHash(l.id(m), hash);
  l.emitHashParsedEvent(m, parsedHash);

  let error, result;

  if (parsedHash) {
    if (parsedHash.error) {
      error = parsedHash;
    } else if (!parsedHash.hasOwnProperty("error")) {
      // NOTE: if the url hash contains the string "error"
      // `parsedHash` will be the following object:
      // {error: undefined, error_description: undefined}
      // That is why we make the additional check for the error
      // property to ensure we actually have a result.
      result = parsedHash;
    }

    if (error) {
      l.emitAuthorizationErrorEvent(m, error);
    } else if (result) {
      l.emitAuthenticatedEvent(m, result);
    }
  }

  return !!(error || result);
}

export function openLock(id, opts) {
  const m = read(getEntity, "lock", id);
  if (!m) {
    throw new Error("The Lock can't be opened again after it has been destroyed");
  }

  if (l.rendering(m)) {
    return false;
  }

  l.emitEvent(m, "show");

  swap(updateEntity, "lock", id, m => {
    m = l.overrideOptions(m, opts);
    m = l.filterConnections(m);
    m = l.runHook(m, "willShow", opts);
    return l.render(m);
  });

  return true;
}

export function closeLock(id, force = false, callback = () => {}) {
  // Do nothing when the Lock can't be closed, unless closing is forced.
  let m = read(getEntity, "lock", id);
  if (!l.ui.closable(m) && !force || !l.rendering(m)) {
    return;
  }

  l.emitEvent(m, "hide")

  // If it is a modal, stop rendering an reset after a second,
  // otherwise just reset.
  if (l.ui.appendContainer(m)) {
    swap(updateEntity, "lock", id, l.stopRendering);

    setTimeout(() => {
      swap(updateEntity, "lock", id, l.reset);
      m = read(getEntity, "lock", id);
      callback(m);
    }, 1000);
  } else {
    swap(updateEntity, "lock", id, l.reset);
    callback(m);
  }
}

export function removeLock(id) {
  swap(updateEntity, "lock", id, l.stopRendering);
  swap(removeEntity, "lock", id);
}

export function updateLock(id, f) {
  return swap(updateEntity, "lock", id, f);
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

export function validateAndSubmit(id, fields = [], f) {
  swap(updateEntity, "lock", id, m => {
    const allFieldsValid = fields.reduce((r, x) => r && isFieldValid(m, x), true);
    return allFieldsValid
      ? l.setSubmitting(m, true)
      : fields.reduce((r, x) => showInvalidField(r, x), m);
  });

  const m = read(getEntity, "lock", id);
  if (l.submitting(m)) {
    f(m);
  }
}

export function logIn(id, fields, params = {}) {
  validateAndSubmit(id, fields, m => {
    webApi.logIn(id, params, l.auth.params(m).toJS(), (error, result) => {
      if (error) {
        setTimeout(() => logInError(id, fields, error), 250);
      } else {
        logInSuccess(id, result);
      }
    });
  });
}


export function logInSuccess(id, result) {
  const m = read(getEntity, "lock", id);

  if (!l.ui.autoclose(m)) {
    swap(updateEntity, "lock", id, m => {
      m = l.setSubmitting(m, false);
      return l.setLoggedIn(m, true);
    });
    l.emitAuthenticatedEvent(m, result);
  } else {
    closeLock(id, false, m1 => l.emitAuthenticatedEvent(m1, result));
  }
}

function logInError(id, fields, error) {
  const m = read(getEntity, "lock", id);
  const errorMessage = l.loginErrorMessage(m, error, loginType(fields));

  if (["blocked_user", "rule_error", "lock.unauthorized"].indexOf(error.code) > -1) {
    l.emitAuthorizationErrorEvent(m, error);
  }

  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

function loginType(fields) {
  if (!fields) return;
  if (~fields.indexOf("vcode")) return "code";
  if (~fields.indexOf("username")) return "username";
  if (~fields.indexOf("email")) return "email";
}
