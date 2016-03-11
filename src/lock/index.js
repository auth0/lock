import Immutable, { List, Map, Set } from 'immutable';
import { isSmallScreen } from '../utils/media_utils';
import * as d from '../dict/index';
import t from '../dict/t';
import trim from 'trim';
import { dataFns } from '../utils/data_utils';

const {
  get,
  init,
  remove,
  reset,
  set,
  tget,
  tset,
  tremove
} = dataFns(["core"]);

export function setup(id, clientID, domain, options, signInCallback, hookRunner, emitEventFn) {
  return init(id, Immutable.fromJS({
    auth: extractAuthOptions(options),
    clientID: clientID,
    domain: domain,
    emitEventFn: emitEventFn,
    hookRunner: hookRunner,
    mode: options.mode,
    signInCallback: signInCallback,
    pickedConnections: Immutable.fromJS(options.connections || []),
    ui: extractUIOptions(id, options.mode, options)
  }));
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
  return tget(m, "show", false);
}

export function setShow(m, value) {
  return tset(m, "show", value);
}

export function setSubmitting(m, value, error) {
  m = tset(m, "submitting", value);
  m = error && !value ? setGlobalError(m, error) : clearGlobalError(m);
  return m;
}

export function submitting(m) {
  return tget(m, "submitting", false);
}

export function setGlobalError(m, str) {
  return tset(m, "globalError", str);
}

export function globalError(m) {
  return tget(m, "globalError", "");
}

export function clearGlobalError(m) {
  return tremove(m, "globalError");
}

export function setGlobalSuccess(m, str) {
  return tset(m, "globalSuccess", str);
}

export function globalSuccess(m) {
  return tget(m, "globalSuccess", "");
}

export function clearGlobalSuccess(m) {
  return tremove(m, "globalSuccess");
}

export function rendering(m) {
  return tget(m, "render", false);
}

export function stopRendering(m) {
  return tremove(m, "render");
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
  const primaryColor = options.theme && options.theme.primaryColor;
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
    popupOptions: new Map(undefined === options.popupOptions ? {} : options.popupOptions),
    primaryColor: typeof primaryColor === "string" ? primaryColor : "#ea5323",
    rememberLastLogin: undefined === options.rememberLastLogin ? true : !!options.rememberLastLogin
  });
}

const { get: getUIAttribute } = dataFns(["core", "ui"]);

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
  popupOptions: lock => getUIAttribute(lock, "popupOptions"),
  primaryColor: lock => getUIAttribute(lock, "primaryColor"),
  rememberLastLogin: lock => getUIAttribute(lock, "rememberLastLogin")
};

const { get: getAuthAttribute } = dataFns(["core", "auth"]);

export const auth = {
  authParams: lock => getAuthAttribute(lock, "authParams"),
  callbackURL: lock => getAuthAttribute(lock, "callbackURL"),
  forceJSONP: lock => getAuthAttribute(lock, "forceJSONP"),
  redirect: lock => getAuthAttribute(lock, "redirect"),
  responseType: lock => getAuthAttribute(lock, "responseType")
};


function extractAuthOptions(options) {
  // TODO: shouldn't all options be namespased in authentication?
  let {
    authParams,
    callbackURL,
    forceJSONP,
    redirect,
    responseType,
    sso
  } = options.authentication || {};

  authParams = typeof authParams === "object" ? authParams : {};
  callbackURL = typeof callbackURL === "string" && callbackURL ? callbackURL : undefined;
  redirect = typeof redirect === "boolean" ? redirect : true;
  responseType = typeof responseType === "string" ? responseType : callbackURL ? "code" : "token";
  sso = typeof sso === "boolean" ? sso : true;

  if (trim(authParams.scope || "") === "openid profile") {
    warn(m, "Usage of scope 'openid profile' is not recommended. See https://auth0.com/docs/scopes for more details.");
  }

  return Immutable.fromJS({
    authParams,
    callbackURL,
    forceJSONP,
    redirect,
    responseType,
    sso
  });
}

export function withAuthOptions(m, opts, flattenAuthParams = true) {
  const auth = get(m, "auth");
  const authOptions = flattenAuthParams
    ? auth.remove("authParams").merge(auth.get("authParams"))
    : auth;

  return authOptions
    .set("popup", !authOptions.get("redirect"))
    .merge(Immutable.fromJS(opts))
    .toJS();
}

export function invokeSignInCallback(m, ...args) {
  get(m, "signInCallback").apply(undefined, args);
}

export function render(m) {
  return tset(m, "render", true);
}

export function close(m) {
  return tset(m, "show", false);
}

export { reset };

export function setSignedIn(m, value) {
  return tset(m, "signedIn", value);
}

export function signedIn(m) {
  return tget(m, "signedIn", false);
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

export function getEnabledConnections(m, type, strategy) {
  const xs = get(m, ["enabledConnections", type], List());
  return strategy ? xs.filter(x => x.get("strategy") === strategy) : xs;
}

export function isConnectionEnabled(m, name) {
  // TODO: is the name enough? shouldn't we check for strategy and/or type?
  return get(m, "enabledConnections", Map())
    .flatten(true)
    .some(c => c.get("name") === name);
}

export function runHook(m, str, ...args) {
  get(m, "hookRunner")(str, ...args);
}

export function emitEvent(m, str, ...args) {
  get(m, "emitEventFn")(str, ...args);
}
