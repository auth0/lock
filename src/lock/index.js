import Immutable, { List, Map, Set } from 'immutable';
import { isSmallScreen } from '../utils/media_utils';
import { iconUrl } from '../icon/index';
import * as d from '../dict/index';
import t from '../dict/t';
import trim from 'trim';

// TODO: move to its own utils module
function dataFns(nsKeyPath) {
  function keyPath(keyOrKeyPath) {
    return nsKeyPath.concat(
      typeof keyOrKeyPath === "object" ? keyOrKeyPath : [keyOrKeyPath]
    );
  }

  return {
    get: function(m, keyOrKeyPath, notSetValue = undefined) {
      return m.getIn(keyPath(keyOrKeyPath), notSetValue);
    },

    set: function(m, keyOrKeyPath, value) {
      return m.setIn(keyPath(keyOrKeyPath), value);
    },

    remove: function(m, keyOrKeyPath) {
      return m.removeIn(keyPath(keyOrKeyPath));
    },

    init: function(id, m) {
      return new Map({id: id}).setIn(nsKeyPath, m);
    }
  }
}

const { get, set, init } = dataFns(["core"]);
// const ui = dataFns(["core", "ui"]);

function buildSetupSnapshot(m) {
  return set(m, "setupSnapshot", m);
}

export function setup(id, clientID, domain, options, signInCallback, hookRunner) {
  let m = init(id, Immutable.fromJS({
    clientID: clientID,
    domain: domain,
    mode: options.mode,
    hookRunner: hookRunner,
    signInCallback: signInCallback
  }));
  m = setUIOptions(m, options);
  m = setAuthOptions(m, options);
  m = set(m, "pickedConnections", Immutable.fromJS(options.connections || []));
  return buildSetupSnapshot(m);
}

export function id(m) {
  return m.get("id");
}

export function clientID(m) {
  return get(m, "clientID");
}

export function domain(m) {
  return get(m, "domain");
}

export function modeName(m) {
  return get(m, "mode");
}

export function show(m) {
  return get(m, "show", false);
}

export function setShow(m, value) {
  return set(m, "show", value);
}

export function setSubmitting(m, value, error) {
  m = set(m, "submitting", value);
  m = error && !value ? setGlobalError(m, error) : clearGlobalError(m);
  return m;
}

export function submitting(m) {
  return get(m, "submitting", false);
}

export function setGlobalError(m, str) {
  return set(m, "globalError", str);
}

export function globalError(m) {
  return get(m, "globalError", "");
}

export function clearGlobalError(m) {
  return remove(m, "globalError");
}

export function setGlobalSuccess(m, str) {
  return set(m, "globalSuccess", str);
}

export function globalSuccess(m) {
  return get(m, "globalSuccess", "");
}

export function clearGlobalSuccess(m) {
  return remove(m, "globalSuccess");
}

export function rendering(m) {
  return get(m, "render", false);
}

export function gravatar(m) {
  if (ui.gravatar(m)) {
    return m.get("gravatar");
  } else {
    return undefined;
  }
}

function extractUIOptions(id, modeName, options) {
  const closable = options.container ? false : undefined === options.closable ? true : !!options.closable;
  return new Map({
    containerID: options.container || `auth0-lock-container-${id}`,
    appendContainer: !options.container,
    autoclose: undefined === options.autoclose ? false : closable && options.autoclose,
    icon: options.icon || "//cdn.auth0.com/styleguide/1.0.0/img/badge.png",
    closable: closable,
    dict: d.buildDict(modeName, typeof options.dict === "object" ? options.dict : {}),
    disableWarnings: options.disableWarnings === undefined ? false : !!options.disableWarnings,
    focusInput: undefined === options.focusInput ? !(options.container || isSmallScreen()) : !!options.focusInput,
    gravatar: undefined === options.gravatar ? true : !!options.gravatar,
    mobile: undefined === options.mobile ? false : !!options.mobile,
    popup: undefined === options.popup ? false : !!options.popup,
    popupOptions: new Map(undefined === options.popupOptions ? {} : options.popupOptions),
    primaryColor: options.primaryColor && typeof options.primaryColor === "string" ? options.primaryColor : "#ea5323",
    rememberLastLogin: undefined === options.rememberLastLogin ? true : !!options.rememberLastLogin
  });
}

// TODO: review because mode changes are no longer alllowed. Keep in
// mind that now it is just being called during setup but it might be
// possible to overwrite those values when showing the lock.
function setUIOptions(m, options) {
  let currentUIOptions = m.get("ui");
  let newUIOptions = extractUIOptions(id(m), modeName(m), options);
  if (currentUIOptions) {
    const denied = new Set(["containerID", "appendContainer"]);
    const provided = Set.fromKeys(options).subtract(denied);
    newUIOptions = newUIOptions.filter((v, k) => provided.has(k));
  }
  return set(m, "ui", (currentUIOptions || new Map()).merge(newUIOptions));
}

function getUIAttribute(m, attribute) {
  return m.getIn(["core", "ui", attribute]);
}

export const ui = {
  containerID: lock => getUIAttribute(lock, "containerID"),
  appendContainer: lock => getUIAttribute(lock, "appendContainer"),
  autoclose: lock => getUIAttribute(lock, "autoclose"),
  icon: lock => getUIAttribute(lock, "icon"),
  closable: lock => getUIAttribute(lock, "closable"),
  dict: lock => getUIAttribute(lock, "dict"),
  disableWarnings: lock => getUIAttribute(lock, "disableWarnings"),
  t: (lock, keyPath, params) => t(ui.dict(lock), keyPath, params),
  focusInput: lock => getUIAttribute(lock, "focusInput"),
  gravatar: lock => getUIAttribute(lock, "gravatar"),
  mobile: lock => getUIAttribute(lock, "mobile"),
  popup: lock => getUIAttribute(lock, "popup"),
  popupOptions: lock => getUIAttribute(lock, "popupOptions"),
  primaryColor: lock => getUIAttribute(lock, "primaryColor"),
  rememberLastLogin: lock => getUIAttribute(lock, "rememberLastLogin")
};

function getAuthAttribute(m, attribute) {
  return get(m, "auth", attribute);
}

export const auth = {
  authParams: lock => getAuthAttribute(lock, "authParams"),
  callbackURL: lock => getAuthAttribute(lock, "callbackURL"),
  forceJSONP: lock => getAuthAttribute(lock, "forceJSONP"),
  responseType: lock => getAuthAttribute(lock, "responseType")
};

// TODO: review because mode changes are no longer alllowed. Keep in
// mind that now it is just being called during setup.
function setAuthOptions(m, options) {
  // TODO: should `popup` be a auth option?
  let { authParams, callbackURL, forceJSONP, responseType, sso } = options;

  authParams = typeof authParams === "object" ? authParams : {};
  callbackURL = typeof callbackURL === "string" && callbackURL ? callbackURL : undefined;
  responseType = typeof responseType === "string" ? responseType : callbackURL ? "code" : "token";
  sso = typeof sso === "boolean" ? sso : true;

  if (trim(authParams.scope || "") === "openid profile") {
    warn(m, "Usage of scope 'openid profile' is not recommended. See https://auth0.com/docs/scopes for more details.");
  }

  const authOptions = Immutable.fromJS({
    authParams,
    callbackURL,
    forceJSONP,
    responseType,
    sso
  });

  return set(m, "auth", authOptions);
}

export function withAuthOptions(m, opts, flattenAuthParams = true) {
  const auth = get(m, "auth");
  const authOptions = flattenAuthParams
    ? auth.remove("authParams").merge(auth.get("authParams"))
    : auth;

  return authOptions.merge(Immutable.fromJS(opts)).toJS();
}

export function invokeSignInCallback(m, ...args) {
  get(m, "signInCallback").apply(undefined, args);
}

export function shouldRedirect(m) {
  // TODO: remove this hack
  return m.get("forceRedirect", false) || auth.callbackURL(m);
}

export function render(m) {
  return set(m, "render", true);
}

export function close(m) {
  return set(m, "show", false);
}

export function reset(m) {
  return buildSetupSnapshot(get(m, "setupSnapshot"));
}

export function setSignedIn(m, value) {
  return set(m, "signedIn", value);
}

export function signedIn(m) {
  return get(m, "signedIn", false);
}

export function tabIndex(m, n) {
  return [id(m), n > 9 ? "" : "0", n].join("");
}

export function warn(x, str) {
  const shouldOutput = Map.isMap(x)
    ? !ui.disableWarnings(x)
    : !x.disableWarnings;

  if (shouldOutput && console && console.warn) {
    console.warn(str);
  }
}

export function getPickedConnections(m) {
  return get(m, "pickedConnections");
}

export function getEnabledConnections(m, type) {
  return get(m, ["enabledConnections", type], List());
}

export function isConnectionEnabled(m, name) {
  // TODO: is the name enough? shouldn't we check for strategy and/or type?
  return get(m, "enabledConnections", Map())
    .flatten(true)
    .some(c => c.get("name") === name);
}

export function runHook(m, str, ...args) {
  get(m, "hookRunner")(modeName(m), str, id(m), ...args);
}
