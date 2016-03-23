import Auth0 from 'auth0-js';
import reqwest from 'reqwest';

class Auth0WebAPI {
  constructor() {
    this.clients = {};
  }

  setupClient(lockID, clientID, domain, options) {
    // TODO: reuse clients
    this.clients[lockID] = new Auth0({
      clientID: clientID,
      domain: domain,
      sendSDKClientInfo: true
    });
  }

  signIn(lockID, options, cb) {
    const { redirect } = options;
    const f = loginCallback(redirect, cb);
    const client = this.clients[lockID];

    transferLoginOptionsToClient(client, options);

    delete options.redirect;

    client.login(options, f);
  }

  signOut(lockID, query) {
    this.clients[lockID].logout(query);
  }

  signUp(lockID, options, authOptions, cb) {
    const client = this.clients[lockID];
    const { autoLogin, jsonp, popup, sso } = authOptions;
    client._useJSONP = jsonp;

    // When needed, open popup for sso login immediately, otherwise it
    // may be blocked by the browser.
    // TODO: can we get rid of the popup?
    let win;
    if (autoLogin && popup && sso) {
      win = client._buildPopupWindow({});
    }

    // Never allow automatic login and disable popup (since it is only
    // needed for automatic login).
    options.auto_login = false;
    options.popup = false;

    // Also, wrap callback in a function that closes the popup.
    const f = (error, ...args) => {
      if (error && win) {
        win.kill();
      }

      cb(error, ...args);
    };

    client.signup(options, f);
  }

  resetPassword(lockID, options, authOptions, cb) {
    const client = this.clients[lockID];
    const { jsonp } = authOptions;
    client._useJSONP = jsonp;
    client.changePassword(options, cb);
  }

  startPasswordless(lockID, options, cb) {
    const client = this.clients[lockID];
    transferLoginOptionsToClient(client, options);

    client.startPasswordless(options, err => cb(normalizeError(err)));
  }

  parseHash(lockID, hash = undefined) {
    return this.clients[lockID].parseHash(hash);
  }

  getProfile(lockID, token, callback) {
    return this.clients[lockID].getProfile(token, callback);
  }

  getSSOData(lockID, ...args) {
    return this.clients[lockID].getSSOData(...args);
  }

  getUserCountry(lockID, cb) {
    // TODO: This code belongs to Auth0.js
    const protocol = "https:";
    const domain = this.clients[lockID]._domain;
    const endpoint = "/user/geoloc/country";
    const url = joinUrl(protocol, domain, endpoint);

    reqwest({
      url: same_origin(protocol, domain) ? endpoint : url,
      method: "get",
      type: "json",
      crossOrigin: !same_origin(protocol, domain),
      success: (res) => cb(null, res.country_code),
      error: (err) => cb(err)
    });
  }
}

export default new Auth0WebAPI();

function normalizeError(error) {
  if (!error) {
    return error;
  }

  // TODO: clean this mess, the first checks are for social/popup,
  // then we have some stuff for passwordless and the latter is for
  // db.

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
      code: "lock.popup_closed",
      error: "lock.popup_closed",
      description: "Popup window closed."
    };
  }

  if (error.code === "unauthorized") {

    // Custom rule error
    //
    // {
    //   "code": "unauthorized",
    //   "details": {
    //     "code": "unauthorized",
    //     "error_description": "user is blocked",
    //     "error": "unauthorized"
    //   },
    //   "name": "unauthorized",
    //   "status": 401
    // }

    // Default "user is blocked" rule error
    //
    // {
    //   "code": "unauthorized",
    //   "details": {
    //     "code": "unauthorized",
    //     "error_description": "user is blocked",
    //     "error": "unauthorized"
    //   },
    //   "name": "unauthorized",
    //   "status": 401
    // }

    // Social cancel permissions.
    //
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

    // Social cancel permissions or unknown error
    if (!error.details
        || !error.details.error_description
        || error.details.error_description === "access_denied") {

      return {
        code: "lock.unauthorized",
        error: "lock.unauthorized",
        description: (error.details && error.details.error_description) || "Permissions were not granted."
      }
    }

    // Special case for custom rule error
    if (error.details.error_description === "user is blocked") {
      return {
        code: "blocked_user",
        error: "blocked_user",
        description: error.details.error_description
      };
    }

    // Custom Rule error
    return {
      code: "rule_error",
      error: "rule_error",
      description: error.details.error_description
    };

  }

  const result = {
    error: error.details ? error.details.error : (error.statusCode || error.error),
    description: error.details ? error.details.error_description : (error.error_description || error.error)
  }

  // result is used for passwordless and error for database.
  return result.error === undefined && result.description === undefined
    ? error
    : result;
}

// The properties callbackOnLocationHash, callbackURL, and jsonp can
// only be specified when counstructing an Auth0
// instance. Unfortunately we construct the Auth0 client along with
// the Lock and we don't have the values of those options until later
// when the Lock is shown. While today we may construct the client
// here, in the future that will not be possible becasue we will need
// to retrieve some client information before before we can show the
// Lock.
function transferLoginOptionsToClient(client, options) {
  const { callbackURL, jsonp, redirect, responseType } = options;

  client._callbackOnLocationHash = responseType === "token";
  client._callbackURL = callbackURL || client._callbackURL;
  client._shouldRedirect = redirect || responseType === "code" || !!callbackURL;
  client._useJSONP = jsonp;

  delete options.callbackURL;
  delete options.jsonp;
  delete options.responseType;
}

function loginCallback(redirect, cb) {
  if (redirect) {
    return error => cb(normalizeError(error));
  } else {
    return (error, profile, idToken, accessToken, state, refreshToken) => {
      // TODO: in redirect mode we also provide a payload.
      const result = {
        accessToken,
        idToken,
        profile,
        refreshToken,
        state
      };
      cb(normalizeError(error), result);
    }
  }
}

function joinUrl(protocol, domain, endpoint) {
  return protocol + '//' + domain + endpoint;
}

function same_origin(tprotocol, tdomain, tport) {
  const protocol = window.location.protocol;
  const domain = window.location.hostname;
  const port = window.location.port;
  tport = tport || '';

  return protocol === tprotocol && domain === tdomain && port === tport;
}
