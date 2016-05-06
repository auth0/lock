import Immutable, { List, Map, Set } from 'immutable';
import { isSmallScreen } from '../utils/media_utils';
import * as d from './i18n/index';
import t from './i18n/t';
import trim from 'trim';
import * as gp from '../avatar/gravatar_provider';
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

export function setup(id, clientID, domain, options, logInCallback, hookRunner, emitEventFn) {
  return init(id, Immutable.fromJS({
    auth: extractAuthOptions(options),
    clientID: clientID,
    domain: domain,
    emitEventFn: emitEventFn,
    hookRunner: hookRunner,
    mode: options.mode,
    logInCallback: logInCallback,
    allowedConnections: Immutable.fromJS(options.allowedConnections || []),
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

export function setSubmitting(m, value, error = "") {
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

function extractUIOptions(id, modeName, options) {
  const closable = options.container ? false : undefined === options.closable ? true : !!options.closable;
  const theme = options.theme || {};
  const { logo, primaryColor } = theme;

  const avatar = options.avatar !== null;
  const customAvatarProvider = options.avatar
    && typeof options.avatar.url === "function"
    && typeof options.avatar.displayName === "function"
    && options.avatar;
  const avatarProvider = customAvatarProvider || gp;

  return new Map({
    containerID: options.container || `auth0-lock-container-${id}`,
    appendContainer: !options.container,
    autoclose: undefined === options.autoclose ? false : closable && options.autoclose,
    autofocus: undefined === options.autofocus ? !(options.container || isSmallScreen()) : !!options.autofocus,
    avatar: avatar,
    avatarProvider: avatarProvider,
    logo: typeof logo === "string" ? logo : undefined,
    closable: closable,
    dict: d.buildDict(modeName, typeof options.languageDictionary === "object" ? options.languageDictionary : {}),
    disableWarnings: options.disableWarnings === undefined ? false : !!options.disableWarnings,
    mobile: undefined === options.mobile ? false : !!options.mobile,
    popupOptions: new Map(undefined === options.popupOptions ? {} : options.popupOptions),
    primaryColor: typeof primaryColor === "string" ? primaryColor : undefined,
    rememberLastLogin: undefined === options.rememberLastLogin ? true : !!options.rememberLastLogin
  });
}

const { get: getUIAttribute } = dataFns(["core", "ui"]);

export const ui = {
  containerID: lock => getUIAttribute(lock, "containerID"),
  appendContainer: lock => getUIAttribute(lock, "appendContainer"),
  autoclose: lock => getUIAttribute(lock, "autoclose"),
  autofocus: lock => getUIAttribute(lock, "autofocus"),
  avatar: lock => getUIAttribute(lock, "avatar"),
  avatarProvider: lock => getUIAttribute(lock, "avatarProvider"),
  closable: lock => getUIAttribute(lock, "closable"),
  dict: lock => getUIAttribute(lock, "dict"),
  disableWarnings: lock => getUIAttribute(lock, "disableWarnings"),
  t: (lock, keyPath, params) => t(ui.dict(lock), keyPath, params),
  logo: lock => getUIAttribute(lock, "logo"),
  mobile: lock => getUIAttribute(lock, "mobile"),
  popupOptions: lock => getUIAttribute(lock, "popupOptions"),
  primaryColor: lock => getUIAttribute(lock, "primaryColor"),
  rememberLastLogin: lock => getUIAttribute(lock, "rememberLastLogin")
};

const { get: getAuthAttribute } = dataFns(["core", "auth"]);

export const auth = {
  params: lock => getAuthAttribute(lock, "params"),
  jsonp: lock => getAuthAttribute(lock, "jsonp"),
  redirect: lock => getAuthAttribute(lock, "redirect"),
  redirectUrl: lock => getAuthAttribute(lock, "redirectUrl"),
  responseType: lock => getAuthAttribute(lock, "responseType"),
  sso: lock => getAuthAttribute(lock, "sso")
};


function extractAuthOptions(options) {
  // TODO: shouldn't all options be namespased in authentication?
  let {
    params,
    jsonp,
    redirect,
    redirectUrl,
    responseType,
    sso
  } = options.auth || {};

  params = typeof params === "object" ? params : {};
  redirectUrl = typeof redirectUrl === "string" && redirectUrl ? redirectUrl : undefined;
  redirect = typeof redirect === "boolean" ? redirect : true;
  responseType = typeof responseType === "string" ? responseType : redirectUrl ? "code" : "token";
  sso = typeof sso === "boolean" ? sso : true;

  if (trim(params.scope || "") === "openid profile") {
    warn(options, "Usage of scope 'openid profile' is not recommended. See https://auth0.com/docs/scopes for more details.");
  }

  return Immutable.fromJS({
    jsonp,
    params,
    redirect,
    redirectUrl,
    responseType,
    sso
  });
}

export function withAuthOptions(m, opts) {
  return Immutable.fromJS(opts)
    .merge(get(m, "auth"))
    .toJS();
}

export function invokeLogInCallback(m, ...args) {
  get(m, "logInCallback").apply(undefined, args);
}

export function render(m) {
  return tset(m, "render", true);
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

export function allowedConnections(m) {
  return get(m, "allowedConnections");
}

export function connections(m, type = undefined, ...strategies) {
  // TODO: is this considering "unknown" connections? it should not

  if (arguments.length === 1) {
    return get(m, "connections", Map()).valueSeq().flatten(true);
  }

  const xs = get(m, ["connections", type], List());
  return strategies.length > 0
    ? xs.filter(x => ~strategies.indexOf(x.get("strategy")))
    : xs;
}

export function connection(m, type = undefined, ...strategies) {
  return connections(m, type, ...strategies).get(0);
}

export function hasOneConnection(m, type = undefined) {
  const xs = connections(m);
  return xs.count() === 1 && (!type || xs.getIn([0, "type"]) === type);
}

export function hasOnlyConnections(m, type = undefined, ...strategies) {
  const all = connections(m).count();
  const filtered = connections(m, type, ...strategies).count();
  return all > 0 && all === filtered;
}

export function hasSomeConnections(m, type = undefined, ...strategies) {
  return connections(m, type, ...strategies).count() > 0;
}

export function findConnection(m, name) {
  return connections(m).find(m1 => m1.get("name") === name);
}

export function hasConnection(m, name) {
  return !!findConnection(m, name);
}

export function runHook(m, str, ...args) {
  get(m, "hookRunner")(str, ...args);
}

export function emitEvent(m, str, ...args) {
  get(m, "emitEventFn")(str, ...args);
}

export function loginErrorMessage(m, error) {
  // NOTE: previous version of lock checked for status codes and, at
  // some point, if the status code was 401 it defaults to an
  // "invalid_user_password" error (actually the
  // "wrongEmailPasswordErrorText" dict entry) instead of checking
  // explicitly. We should figure out if there was a reason for that.

  if (error.status === 0) {
    return ui.t(m, ["error", "login", "lock.network"], {__textOnly: true});
  }

  // Custom rule error (except blocked_user)
  if (error.error === "rule_error") {
    return error.description
      || ui.t(m, ["error", "login", "lock.fallback"], {__textOnly: true});
  }

  return ui.t(m, ["error", "login", error.error], {__textOnly: true})
    || ui.t(m, ["error", "login", "lock.fallback"], {__textOnly: true});
}
