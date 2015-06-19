import Auth0 from 'auth0-js';
import StringUtils from './string_utils';
import ClientActionCreators from '../actions/client_action_creators';
import LockActionCreators from '../actions/lock_action_creators';
import AppStore from '../stores/app_store';

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

  signIn(lockID) {
    var lock = AppStore.getLock(lockID);
    this._clients[lock.get("id")].login({
      // TODO find the propper connection
      connection: lock.getIn(["client", "strategies", 0, "connections", 0, "name"]),
      username: lock.get("email"),
      password: lock.get("password"),
      sso: false
    }, function(error, profile, idToken, accessToken, state, refreshToken) {
      // TODO the amount of parameters determine whether a redirect will be
      // performed after a successful login or not.
      // See https://github.com/auth0/auth0.js/issues/26
      if (error) {
        // NOTE when hitting https://*.auth0.com/usernamepassword/login
        // error.details has the keys 'code', 'description', 'name' and
        // 'statusCode'. But, when hitting https://*.auth0.com/oauth/ro it has
        // the keys: 'code', 'error' and 'error_description'.
        var preparedError = {
          code: error.details.code,
          description: error.details.description || error.details.error_description
        };
        LockActionCreators.failedSignIn(lock.get("id"), preparedError);
      } else {
        var signIn = {
          profile: profile,
          idTocken: idToken,
          accessToken: accessToken,
          state: state,
          refreshToken: refreshToken
        };
        LockActionCreators.successfulSignIn(lock.get("id"), signIn);
      }
    })
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
