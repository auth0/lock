import IdTokenVerifier from 'idtoken-verifier';
import auth0 from 'auth0-js';
import CordovaAuth0Plugin from 'auth0-js/plugins/cordova';
import request from 'superagent';
import { normalizeError, loginCallback, normalizeAuthParams, webAuthOverrides } from './helper';
import qs from 'qs';

class Auth0LegacyAPIClient {
  constructor(clientID, domain, opts) {
    this.client = null;
    this.authOpt = null;

    this.domain = domain;
    this.clientID = clientID;
    this.tokenIssuer = (opts.overrides && opts.overrides.__token_issuer) || `https://${domain}/`;

    const default_telemetry = {
      name: 'lock.js',
      version: __VERSION__,
      lib_version: auth0.version
    };

    this.client = new auth0.WebAuth({
      clientID: clientID,
      domain: domain,
      redirectUri: opts.redirectUrl,
      responseMode: opts.responseMode,
      responseType: opts.responseType,
      plugins: [new CordovaAuth0Plugin()],
      overrides: webAuthOverrides(opts.overrides),
      _sendTelemetry: opts._sendTelemetry === false ? false : true,
      _telemetryInfo: opts._telemetryInfo || default_telemetry,
      _disableDeprecationWarnings: true
    });

    this.authOpt = {
      popup: !opts.redirect,
      popupOptions: opts.popupOptions,
      sso: opts.sso,
      nonce: opts.nonce,
      state: opts.state
    };
  }

  logIn(options, authParams, cb) {
    // TODO: for passwordless only, try to clean in auth0.js
    // client._shouldRedirect = redirect || responseType === "code" || !!redirectUrl;
    const f = loginCallback(!this.authOpt.popup, cb);
    const auth0Client = this.client;

    const loginOptions = normalizeAuthParams({ ...options, ...this.authOpt, ...authParams });
    if (!options.username && !options.email) {
      if (this.authOpt.popup) {
        auth0Client.popup.authorize({ ...loginOptions, owp: true }, f);
      } else {
        auth0Client.authorize(loginOptions, f);
      }
    } else if (!this.authOpt.sso && this.authOpt.popup) {
      auth0Client.client.loginWithResourceOwner(loginOptions, f);
    } else if (this.authOpt.popup) {
      auth0Client.popup.loginWithCredentials({ ...loginOptions, owp: true }, f);
    } else {
      auth0Client.redirect.loginWithCredentials(loginOptions, f);
    }
  }

  logout(query) {
    this.client.logout(query);
  }

  signUp(options, cb) {
    const { popup, sso } = this.authOpt;
    const { autoLogin } = options;

    delete options.autoLogin;

    const popupHandler = autoLogin && popup && sso ? this.client.popup.preload() : null;

    this.client.signup(options, (err, result) => cb(err, result, popupHandler));
  }

  resetPassword(options, cb) {
    this.client.changePassword(options, cb);
  }

  startPasswordless(options, cb) {
    this.client.startPasswordless(options, err => cb(normalizeError(err)));
  }

  // for legacy, we should not verify the id_token so we reimplemented it here
  // to avoid adding dirt into auth0.js. At some point we will get rid of this.
  parseHash(hash = '', cb) {
    var parsed_qs = qs.parse(hash.replace(/^#?\/?/, ''));
    var state = this.authOpt.state || parsed_qs.state;

    this.client.transactionManager.getStoredTransaction(state);

    if (parsed_qs.hasOwnProperty('error')) {
      var err = {
        error: parsed_qs.error,
        error_description: parsed_qs.error_description
      };

      if (parsed_qs.state) {
        err.state = parsed_qs.state;
      }

      return cb(err);
    }

    if (
      !parsed_qs.hasOwnProperty('access_token') &&
      !parsed_qs.hasOwnProperty('id_token') &&
      !parsed_qs.hasOwnProperty('refresh_token')
    ) {
      return cb(null, null);
    }

    var prof;

    if (parsed_qs.hasOwnProperty('id_token')) {
      var invalidJwt = function(error) {
        var err = {
          error: 'invalid_token',
          error_description: error
        };
        return err;
      };

      var verifier = new IdTokenVerifier({});
      prof = verifier.decode(parsed_qs.id_token).payload;

      if (prof.aud !== this.clientID) {
        return cb(
          invalidJwt(
            'The clientID configured (' +
              this.clientID +
              ') does not match with the clientID set in the token (' +
              prof.aud +
              ').'
          )
        );
      }

      // iss should be the Auth0 domain (i.e.: https://contoso.auth0.com/)
      if (prof.iss !== this.tokenIssuer) {
        return cb(
          invalidJwt(
            'The domain configured (' +
              this.tokenIssuer +
              ') does not match with the domain set in the token (' +
              prof.iss +
              ').'
          )
        );
      }
    }

    cb(null, {
      accessToken: parsed_qs.access_token,
      idToken: parsed_qs.id_token,
      idTokenPayload: prof,
      refreshToken: parsed_qs.refresh_token,
      state: parsed_qs.state
    });
  }

  getUserInfo(token, callback) {
    return this.client.client.userInfo(token, callback);
  }

  // auth0.js does not supports this endpoint because it is deprecated for oidcConformat clients
  // we implemented it here to provide BC support, we will loose it in lock 11.
  getProfile(token, callback) {
    request.get(`https://${this.domain}/tokeninfo?id_token=${token}`).end(function(err, res) {
      if (err) {
        return callback({
          error: err.message,
          error_description: res.text || res.body
        });
      }

      return callback(null, res.body);
    });
  }

  getSSOData(...args) {
    return this.client.client.getSSOData(...args);
  }

  getUserCountry(cb) {
    return this.client.getUserCountry(cb);
  }
}

export default Auth0LegacyAPIClient;
