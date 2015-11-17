import Auth0 from 'auth0-js';
import reqwest from 'reqwest';
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
    const f = loginCallback(redirect, cb);
    const client = this.clients[lockID];

    transferLoginOptionsToClient(client, options);

    delete options.redirect;

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
  const { callbackURL, forceJSONP, redirect, responseType } = options;

  client._callbackOnLocationHash = responseType === "token";
  client._callbackURL = callbackURL || client._callbackURL;
  client._shouldRedirect = redirect || responseType === "code" || !!callbackURL;
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
