import auth0 from 'auth0-js';
import * as l from '../index';
import { getEntity, read } from '../../store/index';
import { normalizeError, loginCallback } from './helper';

class Auth0APIClient {
  constructor(lockID, clientID, domain, opts) {
    this.lockID = lockID;
    this.client = null;
    this.authOpt = null;

    const default_telemetry = {
      name: 'lock.js',
      version: __VERSION__,
      lib_version: auth0.version
    };

    this.client = new auth0.WebAuth({
      clientID: clientID,
      domain: domain,
      audience: opts.audience,
      redirectUri: opts.redirectUrl,
      responseMode: opts.responseMode,
      responseType: opts.responseType,
      leeway: opts.leeway || 1,
      _sendTelemetry: opts._sendTelemetry === false ? false : true,
      _telemetryInfo: opts._telemetryInfo || default_telemetry,
      __tenant: opts.overrides && opts.overrides.__tenant,
      __token_issuer: opts.overrides && opts.overrides.__token_issuer
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
    const f = loginCallback(false, cb);

    if (!options.username && !options.email) {
      if (this.authOpt.popup) {
        this.client.popup.authorize({...options, ...this.authOpt, ...authParams}, f)
      } else {
        this.client.authorize({...options, ...this.authOpt, ...authParams}, f)
      }
    } else {
      options.realm = options.connection;
      this.client.client.login({...options, ...this.authOpt, ...authParams}, f);
    }
  }

  signOut(query) {
    this.client.logout(query);
  }

  signUp(options, cb) {
    const { popup, sso } = this.authOpt;
    const { autoLogin } = options;

    delete options.autoLogin;

    const popupHandler = (autoLogin && popup) ? this.client.popup.preload() : null;

    this.client.signup(options, (err, result) => cb(err, result, popupHandler) );
  }

  resetPassword(options, cb) {
    this.client.changePassword(options, cb);
  }

  startPasswordless(options, cb) {
    this.client.startPasswordless(options, err => cb(normalizeError(err)));
  }

  parseHash(hash = '', cb) {
    return this.client.parseHash({
      hash: decodeURIComponent(hash),
      nonce: this.authOpt.nonce,
      state: this.authOpt.state
    }, cb);
  }

  getUserInfo(token, callback) {
    return this.client.client.userInfo(token, callback);
  }

  getProfile(token, callback) {
    const m = read(getEntity, "lock", this.lockID);
    l.emitUnrecoverableErrorEvent(m, '`getProfile` is deprecated for oidcConformant clients');
  }

  getSSOData(...args) {
    return this.client.client.getSSOData(...args);
  }

  getUserCountry(cb) {
    return this.client.getUserCountry(cb);
  }
}

export default Auth0APIClient;
