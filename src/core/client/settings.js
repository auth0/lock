import Auth0 from 'auth0-js';
import Immutable from 'immutable';
import { endsWith } from '../../utils/string_utils';

export function fetchClientSettings(clientID, domain, assetsUrl, cb = () => {}) {
  if (clients.hasOwnProperty(clientID)) {
    return clients[clientID] ? cb(null, clients[clientID]) : cb({}, {});
  }
  if (registerCallback(clientID, cb) > 1) return;

  const script = global.document.createElement('script');
  script.src = clientScriptTagSrc(clientID, domain, assetsUrl);
  global.document.getElementsByTagName('head')[0].appendChild(script);

  const handleError = () => {
    clients[clientID] = null;
    execCallbacks(clientID, {});
  };

  const timeoutID = setTimeout(handleError, 5000);

  script.addEventListener('load', () => clearTimeout(timeoutID));

  script.addEventListener('error', () => {
    clearTimeout(timeoutID);
    handleError();
  });
}

global.window.Auth0 = Auth0;

global.window.Auth0.setClient = function(settings) {
  const client = Immutable.fromJS(settings);
  clients[settings.id] = client;
  execCallbacks(settings.id, null, client);
};

const clients = {};
const callbacks = {};

function registerCallback(clientID, cb) {
  if (callbacks[clientID]) {
    callbacks[clientID].push(cb);
  } else {
    callbacks[clientID] = [cb];
  }

  return callbacks[clientID].length;
}

function execCallbacks(clientID, ...args) {
  callbacks[clientID].forEach(x => x(...args));
  delete callbacks[clientID];
}

// NOTE: mostly copy-pasted from Lock classic, can review later but it works

function clientScriptTagSrc(clientID, domain, assetsUrl) {
  return `${clientScriptTagAssetsUrl(domain, assetsUrl)}client/${clientID}.js?t${+new Date()}`;
}

function clientScriptTagAssetsUrl(domain, assetsUrl) {
  if (assetsUrl) {
    return assetsUrl;
  }

  if (isAuth0Domain(domain, 'eu')) {
    return 'https://cdn.eu.auth0.com/';
  }

  if (isAuth0Domain(domain, 'au')) {
    return 'https://cdn.au.auth0.com/';
  }

  if (isAuth0Domain(domain)) {
    return 'https://cdn.auth0.com/';
  }

  return 'https://' + domain + '/';
}

function isAuth0Domain(domain, prefix) {
  const hostname = parseUrl('https://' + domain).hostname;

  if (prefix) {
    return endsWith(hostname, '.' + prefix + '.auth0.com')
      && hostname.match(/\./g).length === 3;
  }

  return endsWith(hostname, '.auth0.com')
    && hostname.match(/\./g).length === 2;
}

function parseUrl(url) {
  const parser = global.document.createElement('a');
  parser.href = url;
  return parser;
}
