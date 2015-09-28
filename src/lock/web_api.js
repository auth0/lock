import Auth0 from 'auth0-js';
import * as StringUtils from '../utils/string_utils';

class Auth0WebAPI {
  constructor() {
    this.clients = {};
  }

  setupClient(lockID, clientID, domain) {
    // TODO: reuse clients
    this.clients[lockID] = new Auth0({
      clientID: clientID,
      domain: domain,
      sendSDKClientInfo: true
    });
  }

  signIn(lockID, options, cb) {
    const { redirect } = options;
    delete options.redirect;
    const f = loginCallback(redirect, cb);

    const client = this.clients[lockID];
    transferLoginOptionsToClient(client, options);

    client.login(options, f);
  }

  signOut(lockID, query) {
    this.clients[lockID].logout(query);
  }

  startPasswordless(lockID, options, cb) {
    const client = this.clients[lockID];
    transferLoginOptionsToClient(client, options);

    client.startPasswordless(options, err => cb(normalizeError(err)));
  }

  parseHash(lockID, hash) {
    return this.clients[lockID].parseHash(hash);
  }

  getProfile(lockID, token, callback) {
    return this.clients[lockID].getProfile(token, callback);
  }
}

export default new Auth0WebAPI();

function normalizeError(error) {
  return error && {
    error: error.details ? error.details.error : (error.statusCode || error.error),
    description: error.details ? error.details.error_description : (error.error_description || error.error)
  }
}

// The properties callbackOnLocationHash, callbackURL, and forceJSONP can only
// be specified when counstructing an Auth0 instance. Unfortunately we construct
// the Auth0 client along with the Lock and we don't have the values of those
// options until later when the Lock is shown. While today we may construct the
// client here, in the future that will not be possible becasue we will need to
// retrieve some client information before before we can show the Lock.
function transferLoginOptionsToClient(client, options) {
  const { callbackURL, forceJSONP, responseType } = options;

  client._callbackOnLocationHash = responseType === "token";
  client._callbackURL = callbackURL || client._callbackURL;
  client._shouldRedirect = responseType === "code" || !!callbackURL;
  client._useJSONP = forceJSONP;

  delete options.callbackURL;
  delete options.forceJSONP;
  delete options.responseType;
}

function loginCallback(redirect, cb) {
  if (redirect) {
    return error => cb(normalizeError(error));
  } else {
    return (error, profile, idToken, accessToken, state, refreshToken) => {
      cb(normalizeError(error), profile, idToken, accessToken, state, refreshToken);
    }
  }
}
