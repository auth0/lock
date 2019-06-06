import auth0 from 'auth0-js';
import qs from 'qs';
import CordovaAuth0Plugin from 'auth0-js/dist/cordova-auth0-plugin.min.js';
import {
  normalizeError,
  loginCallback,
  normalizeAuthParams,
  webAuthOverrides,
  trimAuthParams,
  getVersion
} from './helper';

class Auth0APIClient {
  constructor(lockID, clientID, domain, opts) {
    this.lockID = lockID;
    this.client = null;
    this.authOpt = null;
    this.domain = domain;
    this.isUniversalLogin = window.location.host === domain;
    this._enableIdPInitiatedLogin = !!(opts._enableIdPInitiatedLogin || opts._enableImpersonation);
    const telemetry = this.getTelemetryInfo(opts._telemetryInfo);

    var state = opts.state;
    if (opts.params && opts.params.state) {
      state = opts.params.state;
    }

    var nonce = opts.nonce;
    if (opts.params && opts.params.nonce) {
      nonce = opts.params.nonce;
    }

    const scope = opts.params && opts.params.scope;

    this.client = new auth0.WebAuth({
      clientID: clientID,
      domain: domain,
      audience: opts.audience,
      redirectUri: opts.redirectUrl,
      responseMode: opts.responseMode,
      responseType: opts.responseType,
      leeway: opts.leeway || 1,
      plugins: opts.plugins || [new CordovaAuth0Plugin()],
      overrides: webAuthOverrides(opts.overrides),
      _sendTelemetry: opts._sendTelemetry === false ? false : true,
      _telemetryInfo: telemetry,
      state,
      nonce,
      scope
    });

    this.authOpt = {
      popup: !opts.redirect,
      popupOptions: opts.popupOptions,
      nonce,
      state,
      scope
    };
    if (this.isUniversalLogin && opts.sso !== undefined) {
      this.authOpt.sso = opts.sso;
    }
  }
  getTelemetryInfo(telemetryOverride) {
    let telemetry;
    const { auth0Client } = qs.parse(window.location.search.substr(1));
    let ulpTelemetry = auth0Client && JSON.parse(atob(auth0Client));
    if (this.isUniversalLogin && ulpTelemetry) {
      telemetry = {
        ...ulpTelemetry,
        env: {
          ...ulpTelemetry.env,
          ['lock.js-ulp']: getVersion(),
          ['auth0.js-ulp']: auth0.version.raw
        }
      };
    }
    if (this.isUniversalLogin && !ulpTelemetry) {
      telemetry = {
        name: 'lock.js-ulp',
        version: getVersion(),
        env: {
          ['auth0.js-ulp']: auth0.version.raw
        }
      };
    }
    if (!this.isUniversalLogin && telemetryOverride) {
      telemetry = {
        ...telemetryOverride,
        env: {
          ...telemetryOverride.env,
          ['lock.js']: getVersion(),
          ['auth0.js']: auth0.version.raw
        }
      };
    }
    if (!telemetry) {
      telemetry = {
        name: 'lock.js',
        version: getVersion(),
        env: {
          ['auth0.js']: auth0.version.raw
        }
      };
    }
    return telemetry;
  }

  logIn(options, authParams, cb) {
    // TODO: for passwordless only, try to clean in auth0.js
    // client._shouldRedirect = redirect || responseType === "code" || !!redirectUrl;
    const f = loginCallback(false, this.domain, cb);
    const loginOptions = trimAuthParams(
      normalizeAuthParams({
        ...options,
        ...this.authOpt,
        ...authParams
      })
    );

    if (options.login_hint) {
      loginOptions.login_hint = options.login_hint;
    }

    if (!options.username && !options.email) {
      if (this.authOpt.popup) {
        this.client.popup.authorize(
          {
            ...loginOptions,
            owp: true
          },
          f
        );
      } else {
        this.client.authorize(loginOptions, f);
      }
    } else if (this.authOpt.popup) {
      this.client.popup.loginWithCredentials(loginOptions, f);
    } else {
      loginOptions.realm = options.connection;
      this.client.login(loginOptions, f);
    }
  }

  logout(query) {
    this.client.logout(query);
  }

  signUp(options, cb) {
    delete options.autoLogin;
    this.client.signup(trimAuthParams(options), (err, result) => cb(err, result));
  }

  resetPassword(options, cb) {
    this.client.changePassword(trimAuthParams(options), cb);
  }

  passwordlessStart(options, cb) {
    this.client.passwordlessStart(trimAuthParams(options), err => cb(normalizeError(err)));
  }

  passwordlessVerify(options, cb) {
    const verifyOptions = {
      ...options,
      popup: this.authOpt.popup
    };
    this.client.passwordlessLogin(verifyOptions, (err, result) => cb(normalizeError(err), result));
  }

  parseHash(hash = '', cb) {
    return this.client.parseHash(
      {
        __enableIdPInitiatedLogin: this._enableIdPInitiatedLogin,
        hash,
        nonce: this.authOpt.nonce,
        state: this.authOpt.state
      },
      cb
    );
  }

  getUserInfo(token, callback) {
    return this.client.client.userInfo(token, callback);
  }

  getProfile(token, callback) {
    this.getUserInfo(token, callback);
  }

  getSSOData(...params) {
    return this.client.client.getSSOData(...params);
  }

  getUserCountry(cb) {
    return this.client.client.getUserCountry(cb);
  }

  checkSession(options, cb) {
    return this.client.checkSession(options, cb);
  }
}

export default Auth0APIClient;
