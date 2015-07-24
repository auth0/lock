import Auth0 from 'auth0-js';
import * as StringUtils from '../utils/string_utils';

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
  }

  signIn(lockID, options, success, fail) {
    this._clients[lockID].login(options, function (error, profile, idToken, accessToken, state, refreshToken) {
      if (!handleSignInError(lockID, error, fail)) {
        success(lockID, [error, profile, idToken, accessToken, state, refreshToken]);
      }
    });
  }

  signOut(lockID, query) {
    this._clients[lockID].logout(query);
  }

  requestPasswordlessEmail(lockID, email, send, authParams, cb) {
    const options = {email: email, send: send};
    if (authParams) {
      opts.authParams = authParams;
    }
    this._clients[lockID].startPasswordless(options, cb);
  }

  requestPasswordlessSMS(lockID, phoneNumber, cb) {
    this._clients[lockID].startPasswordless({phoneNumber: phoneNumber}, cb);
  }

}

export default new LockWebAPI();

function handleSignInError(lockID, error, callback) {
  if (error) {
    // TODO when hitting https://*.auth0.com/usernamepassword/login
    // error.details has the keys 'code', 'description', 'name' and
    // 'statusCode'. But, when hitting https://*.auth0.com/oauth/ro it has
    // the keys: 'code', 'error' and 'error_description'.
    const normalizedError = {
      code: error.details.code,
      description: error.details.description || error.details.error_description
    };
    callback(lockID, normalizedError);
    return normalizedError;
  }

  return error;
}
