import urljoin from 'url-join';
import Immutable, { List, Map, Set } from 'immutable';
import { isSmallScreen } from '../utils/media_utils';
import { endsWith } from '../utils/string_utils';
import { parseUrl } from '../utils/url_utils';
import * as i18n from '../i18n';
import trim from 'trim';
import * as gp from '../avatar/gravatar_provider';
import { dataFns } from '../utils/data_utils';
import { processSocialOptions } from '../connection/social/index';
import { clientConnections, hasFreeSubscription } from './client/index';

const { get, init, remove, reset, set, tget, tset, tremove } = dataFns(['core']);

const { tset: tsetSocial } = dataFns(['social']);

export function setup(id, clientID, domain, options, hookRunner, emitEventFn) {
  let m = init(
    id,
    Immutable.fromJS({
      clientBaseUrl: extractClientBaseUrlOption(options, domain),
      tenantBaseUrl: extractTenantBaseUrlOption(options, domain),
      languageBaseUrl: extractLanguageBaseUrlOption(options, domain),
      auth: extractAuthOptions(options),
      clientID: clientID,
      domain: domain,
      emitEventFn: emitEventFn,
      hookRunner: hookRunner,
      useTenantInfo: options.__useTenantInfo || false,
      oidcConformant: options.oidcConformant || false,
      hashCleanup: options.hashCleanup === false ? false : true,
      allowedConnections: Immutable.fromJS(options.allowedConnections || []),
      ui: extractUIOptions(id, options),
      defaultADUsernameFromEmailPrefix: options.defaultADUsernameFromEmailPrefix === false
        ? false
        : true,
      prefill: options.prefill || {},
      connectionResolver: options.connectionResolver
    })
  );

  m = i18n.initI18n(m);

  return m;
}

export function id(m) {
  return m.get('id');
}

export function clientID(m) {
  return get(m, 'clientID');
}

export function domain(m) {
  return get(m, 'domain');
}

export function clientBaseUrl(m) {
  return get(m, 'clientBaseUrl');
}

export function tenantBaseUrl(m) {
  return get(m, 'tenantBaseUrl');
}

export function useTenantInfo(m) {
  return get(m, 'useTenantInfo');
}

export function oidcConformant(m) {
  return get(m, 'oidcConformant');
}

export function connectionResolver(m) {
  return get(m, 'connectionResolver');
}

export function setResolvedConnection(m, resolvedConnection) {
  if (!resolvedConnection) {
    return set(m, 'resolvedConnection', undefined);
  }
  if (!resolvedConnection.type || !resolvedConnection.name) {
    throw new Error(
      'Invalid connection object. The resolved connection must look like: `{ type: "database", name: "connection name" }`.'
    );
  }
  if (resolvedConnection.type !== 'database') {
    throw new Error(
      'Invalid connection type. Only database connections can be resolved with a custom resolver.'
    );
  }
  return set(m, 'resolvedConnection', resolvedConnection);
}

export function resolvedConnection(m) {
  return get(m, 'resolvedConnection');
}

export function languageBaseUrl(m) {
  return get(m, 'languageBaseUrl');
}

export function setSubmitting(m, value, error = '') {
  m = tset(m, 'submitting', value);
  m = clearGlobalSuccess(m);
  m = error && !value ? setGlobalError(m, error) : clearGlobalError(m);
  return m;
}

export function submitting(m) {
  return tget(m, 'submitting', false);
}

export function setGlobalError(m, str) {
  return tset(m, 'globalError', str);
}

export function globalError(m) {
  return tget(m, 'globalError', '');
}

export function clearGlobalError(m) {
  return tremove(m, 'globalError');
}

export function setGlobalSuccess(m, str) {
  return tset(m, 'globalSuccess', str);
}

export function globalSuccess(m) {
  return tget(m, 'globalSuccess', '');
}

export function clearGlobalSuccess(m) {
  return tremove(m, 'globalSuccess');
}

export function rendering(m) {
  return tget(m, 'render', false);
}

export function stopRendering(m) {
  return tremove(m, 'render');
}

function extractUIOptions(id, options) {
  const closable = options.container
    ? false
    : undefined === options.closable ? true : !!options.closable;
  const theme = options.theme || {};
  const { labeledSubmitButton, hideMainScreenTitle, logo, primaryColor, authButtons } = theme;

  const avatar = options.avatar !== null;
  const customAvatarProvider =
    options.avatar &&
    typeof options.avatar.url === 'function' &&
    typeof options.avatar.displayName === 'function' &&
    options.avatar;
  const avatarProvider = customAvatarProvider || gp;

  return new Immutable.fromJS({
    containerID: options.container || `auth0-lock-container-${id}`,
    appendContainer: !options.container,
    autoclose: undefined === options.autoclose ? false : closable && options.autoclose,
    autofocus: undefined === options.autofocus
      ? !(options.container || isSmallScreen())
      : !!options.autofocus,
    avatar: avatar,
    avatarProvider: avatarProvider,
    logo: typeof logo === 'string' ? logo : undefined,
    closable: closable,
    hideMainScreenTitle: !!hideMainScreenTitle,
    labeledSubmitButton: undefined === labeledSubmitButton ? true : !!labeledSubmitButton,
    language: undefined === options.language ? 'en' : trim(options.language || '').toLowerCase(),
    dict: typeof options.languageDictionary === 'object' ? options.languageDictionary : {},
    disableWarnings: options.disableWarnings === undefined ? false : !!options.disableWarnings,
    mobile: undefined === options.mobile ? false : !!options.mobile,
    popupOptions: undefined === options.popupOptions ? {} : options.popupOptions,
    primaryColor: typeof primaryColor === 'string' ? primaryColor : undefined,
    rememberLastLogin: undefined === options.rememberLastLogin ? true : !!options.rememberLastLogin,
    allowAutocomplete: !!options.allowAutocomplete,
    authButtonsTheme: typeof authButtons === 'object' ? authButtons : {},
    allowShowPassword: !!options.allowShowPassword,
    scrollGlobalMessagesIntoView: undefined === options.scrollGlobalMessagesIntoView
      ? true
      : !!options.scrollGlobalMessagesIntoView
  });
}

const { get: getUI, set: setUI } = dataFns(['core', 'ui']);

const { get: tgetUI, set: tsetUI } = dataFns(['core', 'transient', 'ui']);

const getUIAttribute = (m, attribute) => {
  return tgetUI(m, attribute) || getUI(m, attribute);
};

export const ui = {
  containerID: lock => getUIAttribute(lock, 'containerID'),
  appendContainer: lock => getUIAttribute(lock, 'appendContainer'),
  autoclose: lock => getUIAttribute(lock, 'autoclose'),
  autofocus: lock => getUIAttribute(lock, 'autofocus'),
  avatar: lock => getUIAttribute(lock, 'avatar'),
  avatarProvider: lock => getUIAttribute(lock, 'avatarProvider'),
  closable: lock => getUIAttribute(lock, 'closable'),
  dict: lock => getUIAttribute(lock, 'dict'),
  disableWarnings: lock => getUIAttribute(lock, 'disableWarnings'),
  labeledSubmitButton: lock => getUIAttribute(lock, 'labeledSubmitButton'),
  hideMainScreenTitle: lock => getUIAttribute(lock, 'hideMainScreenTitle'),
  language: lock => getUIAttribute(lock, 'language'),
  logo: lock => getUIAttribute(lock, 'logo'),
  mobile: lock => getUIAttribute(lock, 'mobile'),
  popupOptions: lock => getUIAttribute(lock, 'popupOptions'),
  primaryColor: lock => getUIAttribute(lock, 'primaryColor'),
  authButtonsTheme: lock => getUIAttribute(lock, 'authButtonsTheme'),
  rememberLastLogin: m => tget(m, 'rememberLastLogin', getUIAttribute(m, 'rememberLastLogin')),
  allowAutocomplete: m => tget(m, 'allowAutocomplete', getUIAttribute(m, 'allowAutocomplete')),
  scrollGlobalMessagesIntoView: lock => getUIAttribute(lock, 'scrollGlobalMessagesIntoView'),
  allowShowPassword: m => tget(m, 'allowShowPassword', getUIAttribute(m, 'allowShowPassword'))
};

const { get: getAuthAttribute } = dataFns(['core', 'auth']);

export const auth = {
  connectionScopes: m => getAuthAttribute(m, 'connectionScopes'),
  params: m => tget(m, 'authParams') || getAuthAttribute(m, 'params'),
  autoParseHash: lock => getAuthAttribute(lock, 'autoParseHash'),
  redirect: lock => getAuthAttribute(lock, 'redirect'),
  redirectUrl: lock => getAuthAttribute(lock, 'redirectUrl'),
  responseType: lock => getAuthAttribute(lock, 'responseType'),
  sso: lock => getAuthAttribute(lock, 'sso')
};

function extractAuthOptions(options) {
  let {
    audience,
    connectionScopes,
    params,
    autoParseHash,
    redirect,
    redirectUrl,
    responseMode,
    responseType,
    sso,
    state,
    nonce
  } = options.auth || {};

  let { oidcConformant } = options;

  audience = typeof audience === 'string' ? audience : undefined;
  connectionScopes = typeof connectionScopes === 'object' ? connectionScopes : {};
  params = typeof params === 'object' ? params : {};
  // by default is null because we need to know if it was set when we curate the responseType
  redirectUrl = typeof redirectUrl === 'string' && redirectUrl ? redirectUrl : null;
  autoParseHash = typeof autoParseHash === 'boolean' ? autoParseHash : true;
  redirect = typeof redirect === 'boolean' ? redirect : true;
  responseMode = typeof responseMode === 'string' ? responseMode : undefined;
  state = typeof state === 'string' ? state : undefined;
  nonce = typeof nonce === 'string' ? nonce : undefined;
  // if responseType was not set and there is a redirectUrl, it defaults to code. Otherwise token.
  responseType = typeof responseType === 'string' ? responseType : redirectUrl ? 'code' : 'token';
  // now we set the default because we already did the validation
  redirectUrl = redirectUrl || window.location.href;

  sso = typeof sso === 'boolean' ? sso : true;

  if (!oidcConformant && trim(params.scope || '') === 'openid profile') {
    warn(
      options,
      "Usage of scope 'openid profile' is not recommended. See https://auth0.com/docs/scopes for more details."
    );
  }

  if (oidcConformant && !redirect && responseType.indexOf('id_token') > -1) {
    throw new Error("It is not possible to request an 'id_token' while using popup mode.");
  }

  if (!oidcConformant && audience) {
    throw new Error(
      'It is not possible to use the `auth.audience` option when the `oidcConformant` flag is set to false'
    );
  }

  // for legacy flow, the scope should default to openid
  if (!oidcConformant && !params.scope) {
    params.scope = 'openid';
  }

  return Immutable.fromJS({
    audience,
    connectionScopes,
    params,
    autoParseHash,
    redirect,
    redirectUrl,
    responseMode,
    responseType,
    sso,
    state,
    nonce
  });
}

export function withAuthOptions(m, opts) {
  return Immutable.fromJS(opts).merge(get(m, 'auth')).toJS();
}

function extractClientBaseUrlOption(opts, domain) {
  if (opts.clientBaseUrl && typeof opts.clientBaseUrl === 'string') {
    return opts.clientBaseUrl;
  }

  if (opts.configurationBaseUrl && typeof opts.configurationBaseUrl === 'string') {
    return opts.configurationBaseUrl;
  }

  if (opts.assetsUrl && typeof opts.assetsUrl === 'string') {
    return opts.assetsUrl;
  }

  const domainUrl = 'https://' + domain;
  const hostname = parseUrl(domainUrl).hostname;
  const DOT_AUTH0_DOT_COM = '.auth0.com';
  const AUTH0_US_CDN_URL = 'https://cdn.auth0.com';
  if (endsWith(hostname, DOT_AUTH0_DOT_COM)) {
    const parts = hostname.split('.');
    return parts.length > 3
      ? 'https://cdn.' + parts[parts.length - 3] + DOT_AUTH0_DOT_COM
      : AUTH0_US_CDN_URL;
  } else {
    return domainUrl;
  }
}

export function extractTenantBaseUrlOption(opts, domain) {
  if (opts.configurationBaseUrl && typeof opts.configurationBaseUrl === 'string') {
    return urljoin(opts.configurationBaseUrl, 'info-v1.js');
  }

  if (opts.assetsUrl && typeof opts.assetsUrl === 'string') {
    return opts.assetsUrl;
  }

  const domainUrl = 'https://' + domain;
  const hostname = parseUrl(domainUrl).hostname;
  const DOT_AUTH0_DOT_COM = '.auth0.com';
  const AUTH0_US_CDN_URL = 'https://cdn.auth0.com';

  const parts = hostname.split('.');
  const tenant_name = parts[0];
  var domain;

  if (endsWith(hostname, DOT_AUTH0_DOT_COM)) {
    domain = parts.length > 3
      ? 'https://cdn.' + parts[parts.length - 3] + DOT_AUTH0_DOT_COM
      : AUTH0_US_CDN_URL;

    return urljoin(domain, 'tenants', 'v1', `${tenant_name}.js`);
  } else {
    return urljoin(domainUrl, 'info-v1.js');
  }
}

function extractLanguageBaseUrlOption(opts, domain) {
  if (opts.languageBaseUrl && typeof opts.languageBaseUrl === 'string') {
    return opts.languageBaseUrl;
  }

  if (opts.assetsUrl && typeof opts.assetsUrl === 'string') {
    return opts.assetsUrl;
  }

  return 'https://cdn.auth0.com';
}

export function render(m) {
  return tset(m, 'render', true);
}

export { reset };

export function setLoggedIn(m, value) {
  return tset(m, 'loggedIn', value);
}

export function loggedIn(m) {
  return tget(m, 'loggedIn', false);
}

export function defaultADUsernameFromEmailPrefix(m) {
  return get(m, 'defaultADUsernameFromEmailPrefix', true);
}

export function prefill(m) {
  return get(m, 'prefill', {});
}

export function warn(x, str) {
  const shouldOutput = Map.isMap(x) ? !ui.disableWarnings(x) : !x.disableWarnings;

  if (shouldOutput && console && console.warn) {
    console.warn(str);
  }
}

export function error(x, str) {
  const shouldOutput = Map.isMap(x) ? !ui.disableWarnings(x) : !x.disableWarnings;

  if (shouldOutput && console && console.error) {
    console.error(str);
  }
}

export function allowedConnections(m) {
  return tget(m, 'allowedConnections') || get(m, 'allowedConnections');
}

export function connections(m, type = undefined, ...strategies) {
  if (arguments.length === 1) {
    return tget(m, 'connections', Map()).filter((v, k) => k !== 'unknown').valueSeq().flatten(true);
  }

  const xs = tget(m, ['connections', type], List());
  return strategies.length > 0 ? xs.filter(x => ~strategies.indexOf(x.get('strategy'))) : xs;
}

export function connection(m, type = undefined, ...strategies) {
  return connections(m, type, ...strategies).get(0);
}

export function hasOneConnection(m, type = undefined) {
  const xs = connections(m);
  return xs.count() === 1 && (!type || xs.getIn([0, 'type']) === type);
}

export function hasOnlyConnections(m, type = undefined, ...strategies) {
  const all = connections(m).count();
  const filtered = connections(m, type, ...strategies).count();
  return all > 0 && all === filtered;
}

export function hasSomeConnections(m, type = undefined, ...strategies) {
  return countConnections(m, type, ...strategies) > 0;
}

export function countConnections(m, type = undefined, ...strategies) {
  return connections(m, type, ...strategies).count();
}

export function findConnection(m, name) {
  return connections(m).find(m1 => m1.get('name') === name);
}

export function hasConnection(m, name) {
  return !!findConnection(m, name);
}

export function filterConnections(m) {
  const allowed = allowedConnections(m);

  const order = allowed.count() === 0 ? _ => 0 : c => allowed.indexOf(c.get('name'));

  return tset(
    m,
    'connections',
    clientConnections(m).map(cs => {
      return cs.filter(c => order(c) >= 0).sort((c1, c2) => order(c1) - order(c2));
    })
  );
}

export function runHook(m, str, ...args) {
  return get(m, 'hookRunner')(str, m, ...args);
}

export function emitEvent(m, str, ...args) {
  setTimeout(() => {
    const emitEventFn = get(m, 'emitEventFn');
    const hadListener = emitEventFn(str, ...args);
    // Handle uncaught custom error
    if (str === 'unrecoverable_error' && !hadListener) {
      throw new Error(...args);
    }
  }, 0);
}

export function loginErrorMessage(m, error, type) {
  // NOTE: previous version of lock checked for status codes and, at
  // some point, if the status code was 401 it defaults to an
  // "invalid_user_password" error (actually the
  // "wrongEmailPasswordErrorText" dict entry) instead of checking
  // explicitly. We should figure out if there was a reason for that.

  if (error.status === 0) {
    return i18n.html(m, ['error', 'login', 'lock.network']);
  }

  // Custom rule error (except blocked_user)
  if (error.code === 'rule_error') {
    return error.description || i18n.html(m, ['error', 'login', 'lock.fallback']);
  }

  const INVALID_MAP = {
    code: 'lock.invalid_code',
    email: 'lock.invalid_email_password',
    username: 'lock.invalid_username_password'
  };

  let code = error.error || error.code;
  if (code === 'invalid_user_password' && INVALID_MAP[type]) {
    code = INVALID_MAP[type];
  }

  if (code === 'a0.mfa_registration_required') {
    code = 'lock.mfa_registration_required';
  }

  if (code === 'a0.mfa_invalid_code') {
    code = 'lock.mfa_invalid_code';
  }

  return (
    i18n.html(m, ['error', 'login', code]) || i18n.html(m, ['error', 'login', 'lock.fallback'])
  );
}

// TODO: rename to something less generic that is easier to grep
export function stop(m, error) {
  if (error) {
    setTimeout(() => emitEvent(m, 'unrecoverable_error', error), 17);
  }

  return set(m, 'stopped', true);
}

export function hasStopped(m) {
  return get(m, 'stopped');
}

export function hashCleanup(m) {
  return get(m, 'hashCleanup');
}

export function emitHashParsedEvent(m, parsedHash) {
  emitEvent(m, 'hash_parsed', parsedHash);
}

export function emitAuthenticatedEvent(m, result) {
  emitEvent(m, 'authenticated', result);
}

export function emitAuthorizationErrorEvent(m, error) {
  emitEvent(m, 'authorization_error', error);
}

export function emitUnrecoverableErrorEvent(m, error) {
  emitEvent(m, 'unrecoverable_error', error);
}

export function showBadge(m) {
  return hasFreeSubscription(m) || false;
}

export function overrideOptions(m, opts) {
  if (!opts) opts = {};

  if (opts.allowedConnections) {
    m = tset(m, 'allowedConnections', Immutable.fromJS(opts.allowedConnections));
  }

  if (opts.socialButtonStyle) {
    let curated = processSocialOptions(opts);
    m = tsetSocial(m, 'socialButtonStyle', curated.socialButtonStyle);
  }

  if (opts.flashMessage) {
    const key = 'success' === opts.flashMessage.type ? 'globalSuccess' : 'globalError';
    m = tset(m, key, opts.flashMessage.text);
  }

  if (opts.auth && opts.auth.params) {
    m = tset(m, 'authParams', Immutable.fromJS(opts.auth.params));
  }

  if (opts.theme) {
    if (opts.theme.primaryColor) {
      m = tset(m, ['ui', 'primaryColor'], opts.theme.primaryColor);
    }

    if (opts.theme.logo) {
      m = tset(m, ['ui', 'logo'], opts.theme.logo);
    }
  }

  if (opts.language || opts.languageDictionary) {
    if (opts.language) {
      m = tset(m, ['ui', 'language'], opts.language);
    }

    if (opts.languageDictionary) {
      m = tset(m, ['ui', 'dict'], opts.languageDictionary);
    }

    m = i18n.initI18n(m);
  }

  if (typeof opts.rememberLastLogin === 'boolean') {
    m = tset(m, 'rememberLastLogin', opts.rememberLastLogin);
  }
  if (typeof opts.allowAutocomplete === 'boolean') {
    m = tset(m, 'allowAutocomplete', opts.allowAutocomplete);
  }
  if (typeof opts.allowShowPassword === 'boolean') {
    m = tset(m, 'allowShowPassword', opts.allowShowPassword);
  }

  return m;
}
