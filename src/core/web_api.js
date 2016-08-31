import Auth0 from 'auth0-js';

class Auth0WebAPI {
  constructor() {
    this.clients = {};
    this.authOpts = {};
    this.authParams = {};
  }

  setupClient(lockID, clientID, domain, opts) {
    this.clients[lockID] = new Auth0({
      clientID: clientID,
      domain: domain,
      sendSDKClientInfo: true,
      forceJSONP: false,
      callbackURL: opts.redirectUrl,
      responseMode: opts.responseMode,
      responseType: opts.responseType
    });

    this.authOpts[lockID] = {
      popup: !opts.redirect,
      popupOptions: opts.popupOptions,
      sso: opts.sso
    };
  }

  logIn(lockID, options, authParams, cb) {
    // TODO: for passwordless only, try to clean in auth0.js
    // client._shouldRedirect = redirect || responseType === "code" || !!redirectUrl;
    const authOpts = this.authOpts[lockID];
    const f = loginCallback(!authOpts.popup, cb);
    const client = this.clients[lockID];
    client.login({...options, ...authOpts, ...authParams}, f);
  }

  signOut(lockID, query) {
    this.clients[lockID].logout(query);
  }

  signUp(lockID, options, cb) {
    const client = this.clients[lockID];
    const { popup, sso } = this.authOpts[lockID];
    const { autoLogin } = options;
    delete options.autoLogin;

    // TODO: investigate why can't we just delegate to auth0.js the
    // automatic login (error handling maybe?).

    // When needed, open popup for sso login immediately, otherwise it
    // may be blocked by the browser.
    let win;
    if (autoLogin && popup && sso) {
      win = client._buildPopupWindow({});
    }

    // Never allow automatic login and disable popup (since it is only
    // needed when auth0.js handles the automatic login).
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

  resetPassword(lockID, options, cb) {
    this.clients[lockID].changePassword(options, cb);
  }

  startPasswordless(lockID, options, cb) {
    const client = this.clients[lockID];
    client.startPasswordless(options, err => cb(normalizeError(err)));
  }

  parseHash(lockID, hash = '') {
    return this.clients[lockID].parseHash(decodeURIComponent(hash));
  }

  getProfile(lockID, token, callback) {
    return this.clients[lockID].getProfile(token, callback);
  }

  getSSOData(lockID, ...args) {
    return this.clients[lockID].getSSOData(...args);
  }

  getUserCountry(lockID, cb) {
    return this.clients[lockID].getUserCountry(cb);
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

function loginCallback(redirect, cb) {
  return redirect
    ? error => cb(normalizeError(error))
    : (error, result) => cb(normalizeError(error), result);
}
