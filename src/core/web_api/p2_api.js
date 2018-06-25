import auth0 from 'auth0-js';
import CordovaAuth0Plugin from 'auth0-js/plugins/cordova';
import superagent from 'superagent';
import * as l from '../index';
import { getEntity, read } from '../../store/index';
import { normalizeError, loginCallback, normalizeAuthParams, webAuthOverrides } from './helper';

class Auth0APIClient {
  constructor(lockID, clientID, domain, opts) {
    this.lockID = lockID;
    this.client = null;
    this.authOpt = null;
    this.domain = domain;
    this.isUniversalLogin = window.location.host === domain;
    this._enableIdPInitiatedLogin = !!(opts._enableIdPInitiatedLogin || opts._enableImpersonation);

    const default_telemetry = {
      name: 'lock.js',
      version: __VERSION__,
      lib_version: auth0.version
    };

    var state = opts.state;
    if (opts.params && opts.params.state) {
      state = opts.params.state;
    }

    var nonce = opts.nonce;
    if (opts.params && opts.params.nonce) {
      nonce = opts.params.nonce;
    }

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
      _telemetryInfo: opts._telemetryInfo || default_telemetry,
      state,
      nonce
    });

    this.authOpt = {
      popup: !opts.redirect,
      popupOptions: opts.popupOptions,
      nonce: nonce,
      state: state
    };
    if (this.isUniversalLogin && opts.sso !== undefined) {
      this.authOpt.sso = opts.sso;
    }
  }

  logIn(options, authParams, cb) {
    // TODO: for passwordless only, try to clean in auth0.js
    // client._shouldRedirect = redirect || responseType === "code" || !!redirectUrl;
    const f = loginCallback(false, cb);
    const loginOptions = normalizeAuthParams({ ...options, ...this.authOpt, ...authParams });

    if (!options.username && !options.email) {
      if (this.authOpt.popup) {
        this.client.popup.authorize({ ...loginOptions, owp: true }, f);
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
    const { popup, sso } = this.authOpt;
    const { autoLogin } = options;

    delete options.autoLogin;

    this.client.signup(options, (err, result) => cb(err, result));
  }

  resetPassword(options, cb) {
    this.client.changePassword(options, cb);
  }

  passwordlessStart(options, cb) {
    this.client.passwordlessStart(options, err => cb(normalizeError(err)));
  }

  passwordlessVerify(options, cb) {
    const verifyOptions = { ...options, popup: this.authOpt.popup };
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
