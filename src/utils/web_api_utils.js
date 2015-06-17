import Auth0 from 'auth0-js';
import StringUtils from './string_utils';
import ClientActionCreators from '../actions/client_action_creators';

global.window.Auth0 = Auth0;

global.window.Auth0.setClient = function(client_attributes) {
  ClientActionCreators.receiveClient(client_attributes);
};

class WebAPIUtils {
  constructor() {
    this._clients = {};
  }

  setupClient(lockID, clientID, domain, options) {
    // TODO check there isn't already a client for the lock
    this._clients[lockID] = new Auth0({
      clientID: clientID,
      domain: domain,
      useCordovaSocialPlugins: options.useCordovaSocialPlugins
    });

    var script = document.createElement('script');
    script.src = clientScriptTagSrc(clientID, domain, options.assetsUrl);
    document.getElementsByTagName('head')[0].appendChild(script);

    // TODO handle errors and timeouts while loading the script
  }
}

export default new WebAPIUtils();

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

  if (isAuth0Domain(domain)) {
    return 'https://cdn.auth0.com/';
  }

  return 'https://' + domain + '/';
}

function isAuth0Domain(domain, prefix) {
  var domainUrl = parseUrl('https://' + domain);
  if (prefix) {
    return StringUtils.endsWith(domainUrl.hostname, '.' + prefix + '.auth0.com');
  }
  return StringUtils.endsWith(domainUrl.hostname, '.auth0.com');
}

function parseUrl(url) { // TODO this function doesn't belong here
  var parser = document.createElement('a');
  parser.href = url;
  return parser;
}
