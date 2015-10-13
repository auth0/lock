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
  if (!error) {
    return error;
  }


  // TODO: the following checks were copied from https://github.com/auth0/lock/blob/0a5abf1957c9bb746b0710b274d0feed9b399958/index.js#L1263-L1288
  // Some of the checks are missing because I couldn't reproduce them and I'm
  // affraid they'll break existent functionality if add them.
  // We need a better errror handling story in auth0.js.

  if (error.status === "User closed the popup window") {
    // {
    //   status: "User closed the popup window",
    //   name: undefined,
    //   code: undefined,
    //   details: {
    //     description: "server error",
    //     code: undefined
    //   }
    // }
    return {
      error: "lock.popup_closed",
      description: "Popup window closed."
    };
  }

  if (error.message === 'access_denied' || error.code === "unauthorized") {
    // NOTE: couldn't reproduce for error.message === 'access_denied' and can't
    // see the difference between the two.

    // {
    //   code: "unauthorized",
    //   details: {
    //     code: "unauthorized"
    //     error: "unauthorized"
    //     error_description: "access_denied"
    //   },
    //   name: "unauthorized"
    //   status: 401
    // }
    return {
      error: "lock.unauthorized",
      description: "Permissions were not granted."
    }
  }

  return {
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
