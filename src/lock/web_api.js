import Auth0 from 'auth0-js';
import StringUtils from '../utils/string_utils';
import { requestClientSuccess, requestClientTimeout, requestClientError } from '../client/action_creators';
import LockActionCreators from './action_creators';
import Store from '../control/store';
import Client from '../client/client';
import { requestPasswordlessEmailSuccess } from '../passwordless-email/actions';

global.window.Auth0 = Auth0;

global.window.Auth0.setClient = function(clientAttrs) {
  requestClientSuccess(clientAttrs);
};

class LockWebAPI {
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

    var timeoutID = setTimeout(function() {
      requestClientTimeout(clientID);
    }, 5000);

    script.addEventListener('load', function() {
      clearTimeout(timeoutID);
    });

    script.addEventListener('error', function() {
      clearTimeout(timeoutID);
      requestClientError(clientID);
    });

  }

  // signIn(lockID) {
  //   var lock = Store.getLock(lockID);
  //   // NOTE the amount of parameters determine whether a redirect will be
  //   // performed after a successful login or not.
  //   // See https://github.com/auth0/auth0.js/issues/26
  //   var signInCallback = lock.getIn(["showOptions", "signInCallback"]);
  //   var f;
  //   if (signInCallback.length > 1) {
  //     f = function(error, profile, idToken, accessToken, state, refreshToken) {
  //       if (!handleSignInError(lockID, error)) {
  //         var signIn = {
  //           profile: profile,
  //           idToken: idToken,
  //           accessToken: accessToken,
  //           state: state,
  //           refreshToken: refreshToken
  //         };
  //         LockActionCreators.successfulSignIn(lock.get("id"), signIn);
  //       }
  //       signInCallback(error, profile, idToken, accessToken, state, refreshToken);
  //     }
  //   } else {
  //     f = function(error) {
  //       handleSignInError(lockID, error);
  //       signInCallback(error);
  //     }
  //   }
  //
  //   this._clients[lockID].login({
  //     connection: Client.getDefaultConnection(lock.get("client")).get("name"),
  //     username: lock.get("email"),
  //     password: lock.get("password"),
  //     sso: false,
  //     callbackURL: lock.getIn(["showOptions", "callbackURL"]),
  //     callbackOnLocationHash: lock.getIn(["showOptions", "callbackOnLocationHash"])
  //   }, f);
  // }

  signIn(lockID, options, callback) {
    var f;
    if (callback.length > 1) {
      f = function(error, profile, idToken, accessToken, state, refreshToken) {
        if (!handleSignInError(lockID, error)) { // pass fail arg
          var signIn = {
            profile: profile,
            idToken: idToken,
            accessToken: accessToken,
            state: state,
            refreshToken: refreshToken
          };
          // success(...)
          // LockActionCreators.successfulSignIn(lock.get("id"), signIn);
        }
        cb(error, profile, idToken, accessToken, state, refreshToken);
      }
    } else {
      f = function(error) {
        handleSignInError(lockID, error);
        cb(error);
      }
    }

    this._clients[lockID].login(options, f);
  }

  signOut(lockID, query) {
    this._clients[lockID].logout(query);
  }

  requestPasswordlessEmail(lockID) {
    // TODO this._clients[lockID].startPasswordless()
    setTimeout(() => requestPasswordlessEmailSuccess(lockID), 2000);
  }
}

export default new LockWebAPI();

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

function handleSignInError(lockID, error) {
  if (error) {
    // TODO when hitting https://*.auth0.com/usernamepassword/login
    // error.details has the keys 'code', 'description', 'name' and
    // 'statusCode'. But, when hitting https://*.auth0.com/oauth/ro it has
    // the keys: 'code', 'error' and 'error_description'.
    var preparedError = {
      code: error.details.code,
      description: error.details.description || error.details.error_description
    };
    // fail(...)
    // LockActionCreators.failedSignIn(lockID, preparedError);
  }

  return error;
}
