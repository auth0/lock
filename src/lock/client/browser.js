import Auth0 from 'auth0-js';
import { endsWith } from '../../utils/string_utils';
import {
  loadClientSettingsError,
  loadClientSettingsSuccess,
} from './actions';

global.window.Auth0 = Auth0;

global.window.Auth0.setClient = function(o) {
  loadClientSettingsSuccess(o);
};

export function loadClientSettings(clientID, domain, assetsUrl) {
  const script = global.document.createElement('script');
  script.src = clientScriptTagSrc(clientID, domain, assetsUrl);
  global.document.getElementsByTagName('head')[0].appendChild(script);

  const timeoutID = setTimeout(function() {
    loadClientSettingsError(clientID);
  }, 5000);

  script.addEventListener('load', function() {
    clearTimeout(timeoutID);
  });

  script.addEventListener('error', function() {
    clearTimeout(timeoutID);
    loadClientSettingsError(clientID);
  });
}

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

// NOTE: mostly copy-pasted from Lock classic, can review later but it works
