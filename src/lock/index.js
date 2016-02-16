import Immutable, { List, Map, Set } from 'immutable';
import { isSmallScreen } from '../utils/media_utils';
import { iconUrl } from '../icon/index';
import * as d from '../dict/index';
import t from '../dict/t';
import trim from 'trim';

function buildSetupSnapshot(m) {
  return m.set("setupSnapshot", m);
}

export function setup(id, clientID, domain, signInCallback) {
  return buildSetupSnapshot(Immutable.fromJS({
    clientID: clientID,
    domain: domain,
    id: id,
    signInCallback: signInCallback
  }));
}

export function id(m) {
  return m.get("id");
}

export function clientID(m) {
  return m.get("clientID");
}

export function domain(m) {
  return m.get("domain");
}

export function modeName(m) {
  return modeOptions(m).get("name");
}

export function show(m) {
  return m.get("show", false);
}

export function setShow(m, value) {
  return m.set("show", value);
}

export function setSubmitting(m, value, error) {
  m = m.set("submitting", value);
  m = error && !value ? setGlobalError(m, error) : clearGlobalError(m);
  return m;
}

export function submitting(m) {
  return m.get("submitting", false);
}

export function setGlobalError(m, str) {
  return m.set("globalError", str);
}

export function globalError(m) {
  return m.get("globalError", "");
}

export function clearGlobalError(m) {
  return m.remove("globalError");
}

export function setGlobalSuccess(m, str) {
  return m.set("globalSuccess", str);
}

export function globalSuccess(m) {
  return m.get("globalSuccess", "");
}

export function clearGlobalSuccess(m) {
  return m.remove("globalSuccess");
}

export function rendering(m) {
  return m.get("render", false);
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

function setUIOptions(m, options) {
  let currentUIOptions = m.get("ui");
  let newUIOptions = extractUIOptions(id(m), modeName(m), options);;
  if (currentUIOptions) {
    const denied = new Set(["containerID", "appendContainer"]);
    const provided = Set.fromKeys(options).subtract(denied);
    newUIOptions = newUIOptions.filter((v, k) => provided.has(k));
  }
  return m.set("ui", (currentUIOptions || new Map()).merge(newUIOptions));
}

function getUIAttribute(m, attribute) {
  return m.getIn(["ui", attribute]);
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
  return m.getIn(["auth", attribute]);
}

// TODO: find a better name, forceJSONP is not exclusively used for login
export const auth = {
  authParams: lock => getAuthAttribute(lock, "authParams"),
  forceJSONP: lock => getAuthAttribute(lock, "forceJSONP"),
  callbackURL: lock => getAuthAttribute(lock, "callbackURL"),
  responseType: lock => getAuthAttribute(lock, "responseType")
};

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

  return m.set("auth", authOptions);
}

export function withAuthOptions(m, opts, flattenAuthParams = true) {
  const auth = m.get("auth");
  const authOptions = flattenAuthParams
    ? auth.remove("authParams").merge(auth.get("authParams"))
    : auth;

  return authOptions.merge(Immutable.fromJS(opts)).toJS();
}

export function invokeSignInCallback(m, ...args) {
  m.get("signInCallback").apply(undefined, args);
}

export function shouldRedirect(m) {
  return m.get("forceRedirect", false) || auth.callbackURL(m);
}

export function render(m, name, options) {
  if ((modeName(m) != undefined && modeName(m) != name) || show(m)) {
    return m;
  }

  const mode = options.mode || {};
  mode.name = name;

  m = m.merge(Immutable.fromJS({
    mode: mode,
    render: true
  }));

  m = setUIOptions(m, options);
  m = setAuthOptions(m, options);

  return m;
}

export function modeOptions(m) {
  return m.get("mode", new Map());
}

export function close(m) {
  return m.set("show", false);
}

export function reset(m) {
  return buildSetupSnapshot(m.get("setupSnapshot"));
}

export function setSignedIn(m, value) {
  return m.set("signedIn", value);
}

export function signedIn(m) {
  return m.get("signedIn", false);
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

export function registerConnection(m, type, strategy, name) {
  return m.update(
    "connections",
    List(),
    xs => xs.push(Map({type, strategy, name}))
  );
}

export function registerConnections(m, type, connections) {
  return connections.reduce((r, x) => (
    registerConnection(r, type, x.strategy, x.name)
  ), m);
}

export function getConnections(m) {
  return m.get("connections", List());
}

export function findConnection(m, strategy, name) {
  return getConnections(m).find(x => (
    x.get("strategy") === strategy && x.get("name") === name)
  );
}
