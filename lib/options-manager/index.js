/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var small_screen = require('../is-small-screen');
var ocreate = require('../object-create');

var regex = require('../regex');
var i18n = require('../i18n');
var bind = require('../bind');
var _ = require('underscore');
var okeys = _.keys;

/**
 * Expose `OptionsManager`
 */

module.exports = OptionsManager;

/**
 * Create an `OptionsManager` from
 * instanceOptions and displayOptions
 *
 * @param {Auth0Lock} widget
 * @param {Object} displayOptions
 * @constructor
 */

function OptionsManager(widget, options) {
  if (!(this instanceof OptionsManager)) {
    return new OptionsManager(widget, options);
  }

  // Initiate `EventEmitter`
  EventEmitter.call(this);

  // Flag OptionsManager as `unloaded`
  this.state('loading');

  // holds widget as reference
  this.$widget = widget;

  // save widget's $client object reference
  this.$client = widget.$client;

  // save copy of widget's valid strategies
  this.$strategies = widget.$strategies;

  // save widget's `auth0-js` instance object
  this.$auth0 = widget.$auth0;

  // save widget instance options with `$` prepended
  _.each(okeys(widget.$options), function(key) {
    this['$' + key] = widget.$options[key];
  }, this);

  // copies all provided options to instance
  // filtering by allowed options `whitelist`
  _.each(okeys(options), function(key) {
    // we should whitelist options
    // so no OptionsManager method gets overriden
    // by user configurable object
    // XXX: Broken, fix it!
    // if (!~whitelist.indexOf(key) && !~supportedParams.indexOf(key)) return;
    this[key] = options[key];
  }, this);

  // Set `i18n` dictionary for templates
  this.i18n = i18n.getDict(this.dict);

  // default authParams to empty object
  this.authParams = _.extend({}, options.authParams);

  // enable/disable last login and AD discovery
  this.rememberLastLogin = null != options.rememberLastLogin ? !!options.rememberLastLogin : true;
  this.integratedWindowsLogin = null != options.integratedWindowsLogin ? !!options.integratedWindowsLogin : true;

  // default theme is `default`
  this.theme = null != options.theme ? options.theme : 'default';

  // enable/disable gravatar image fetch
  this.gravatar = null != options.gravatar ? !!options.gravatar : true;

  if ('function' === typeof options.popupCallback) {
    // XXX: the following to should already come with
    // the options from constructor... right?
    this.popupOptions = _.extend({}, options.popupOptions);
    this.popupCallback = options.popupCallback;
  }

  // save default responseType
  if (options.responseType) {
    this.responseType = options.responseType;
  } else {
    this.responseType = (this.popup || !options.callbackURL) ? 'token' : 'code';
  }

  // Options moved from constructor and hacked into `auth0-js` instance
  this.$auth0._useJSONP = options.forceJSONP || this.$auth0._useJSONP;
  this.$auth0._callbackURL = options.callbackURL || this.$auth0._callbackURL;
  this.$auth0._callbackOnLocationHash = 'token' === this.responseType || !!this.$auth0._callbackOnLocationHash;

  // force `closable` when provided with `container`
  this.closable = null != options.closable ? !!options.closable : !this.container;

  // force `loginAfterSignup` to true unles provided
  this.loginAfterSignup = null != options.loginAfterSignup ? !!options.loginAfterSignup : true;

  // force `defaultADUsernameFromEmailPrefix` to true if not provided
  // This variable is used
  this.defaultADUsernameFromEmailPrefix = null != options.defaultADUsernameFromEmailPrefix ? !!options.defaultADUsernameFromEmailPrefix : true;

  // SSO by default. User&Password can be authenticated with an ajax call
  // However, since this call is CORS or JSONP it will not set the cookie,
  // hence SSO will not work.
  // To enable Ajax/jsonp/cors use sso: false.
  this.sso = null != this.sso ? !!this.sso : true;

  // sso:true && popupCallback overrides usage of popup
  // otherwise defaults to popup default value (false)
  // or whatever provided via options.
  this.popup = 'function' === typeof this.popupCallback || !!this.popup;

  // Submit button color
  this.primaryColor = null != options.primaryColor ? options.primaryColor : "#ea5323";

  this.cssBlurSupport = (function() {
    // Check stolen from Modernizr, see https://github.com/Modernizr/Modernizr/blob/29eab707f7a2fb261c8a9c538370e97eb1f86e25/feature-detects/css/filters.js
    var el = global.document.createElement("div");
    el.style.cssText = "filter: blur(2px); -webkit-filter: blur(2px)";
    return !!el.style.length && (global.document.documentMode === undefined || global.document.documentMode > 9);
  })();

  if (this.icon) {
    this.headerIcon = this.icon;
  } else {
    this.headerIcon = "//cdn.auth0.com/styleguide/4.6.1/lib/logos/img/badge.png";
    if (window.location.protocol && window.location.protocol === "file:") {
      this.headerIcon = "http:" + this.headerIcon;
    }
  }

  // By default use the new flor for password reset
  this.useNewReset = null != options.useNewReset ? !!options.useNewReset : true;

  // Delay options requiring $client configuration
  this.$widget.getClientConfiguration(bind(this._onclientloaded, this));
}

/**
 * Inherit from `EventEmitter`
 */

OptionsManager.prototype = ocreate(EventEmitter.prototype);

/**
 * Get or Set `$_state` for track
 * `OptionsManager`s ready state
 *
 * @param {String} state
 * @param {String} message
 * @return {OptionsManager}
 * @public
 */

OptionsManager.prototype.state = function(state, message) {
  if (0 === arguments.length) {
    return this.$_state;
  }

  // debug('state is now %s', state);
  this.$_state = state;
  this.emit(state, message);
  return this;
};

/**
 * Register `fn` for when `OptionsManager`
 * is ready (or `loaded`)
 *
 * @param {Function} fn
 * @return {OptionsManager}
 * @public
 */

OptionsManager.prototype.ready = function(fn) {
  function done() {
    if ('loaded' === this.state()) {
      return fn();
    }
  }

  if ('loaded' === this.state()) {
    setTimeout(bind(done, this), 0);
  } else {
    this.once('loaded', bind(done, this));
  }

  return this;
};

/**
 * Continue setup once client's configuration
 * is retrieved from assets url or S3
 *
 * @param {Object} client
 * @return {OptionsManager}
 * @private
 */

OptionsManager.prototype._onclientloaded = function(client) {

  // Refresh clients configuration with what's stored
  // on the Auth0's hash
  this.$client = _.extend(this.$client, client);

  // Enrich $client.strategies
  // then, continue setting up the mode
  if (this.connections) {
    this.$client.strategies = _.chain(this.$client.strategies)
      .map(strategiesConnectionsMapper(this.connections))
      .filter(hasConnectionsFilter)
      .value();
  }

  // merge strategies info
  for (var i = 0; i < this.$client.strategies.length; i++) {
    var sname = this.$client.strategies[i].name;
    this.$client.strategies[i] = _.extend({}, this.$client.strategies[i], this.$strategies[sname]);
  }

  // Holds auth0 strategies only
  this.auth0Strategies = _.chain(this.$client.strategies)
    .filter(auth0StrategiesFilter)
    .value();

  // show signup/forgot links
  var auth0Conn = this._getAuth0Connection() || {};

  // if booted on `signup` or `reset`, but not configured
  // on connection => override mode with `signin`
  if (this.mode === 'signup' && !auth0Conn.showSignup && !this._isThereAnySocialConnection()) { this.mode = 'signin'; }
  if (this.mode === 'reset' && !auth0Conn.showForgot) { this.mode = 'signin'; }

  // Resolve show action buttons or not
  this.showSignupAction = (this.disableSignupAction !== true) && ((auth0Conn && auth0Conn.showSignup) || this.signupLink);
  this.showResetAction = (this.disableResetAction !== true) && ((auth0Conn && auth0Conn.showForgot) || this.resetLink);

    // override usernameStyle if required by connection
    var auth0ConnStrategy = this._getClientStrategyByConnectionName(auth0Conn.name) || {};
    if (!this.usernameStyle && (auth0ConnStrategy.name === 'ad' || auth0ConnStrategy.name === 'auth0-adldap')) {
      this.usernameStyle = 'username';
    }

  // Ensure usernameStyle
  this.usernameStyle = null != this.usernameStyle ? this.usernameStyle : 'email';

  this.state('loaded');

  return this;
};

/**
 * Resolve whether are there or not any
 * social connections within client
 * strategies
 *
 * @return {Boolean}
 * @private
 */

OptionsManager.prototype._isThereAnySocialConnection = function () {
  var client = this.$client;
  var filter = { social: true };
  return !!_.findWhere(client.strategies, filter);
};

/**
 * Resolve whether are there or not any
 * enterprise or Databse connection within
 * client strategies
 *
 * @return {Boolean}
 * @private
 */

OptionsManager.prototype._isThereAnyEnterpriseOrDbConnection = function() {
  var client = this.$client;
  var filter = { social: false };
  return !!_.findWhere(client.strategies, filter);
};

/**
 * Resolve whether are there or not any
 * database connection within client strategies
 *
 * @return {Boolean}
 * @private
 */

OptionsManager.prototype._isThereAnyDBConnection = function() {
  var client = this.$client;
  var filter = { userAndPass: true };
  return !!_.findWhere(client.strategies, filter);
};

/**
 * Resolve whether are there or not any
 * Active Directory connection within client
 * strategies
 *
 * @return {Boolean}
 * @private
 */

OptionsManager.prototype._isThereAnyADConnection = function() {
  return _.some(this.$client.strategies, function (s) {
    return (s.name === 'ad' || s.name === 'auth0-adldap') && s.connections.length > 0;
  });
};

/**
 * Given an email extracts it domain part.
 *
 * @param {String} email
 *
 * @return {String} domain of the email
 */
OptionsManager.prototype._extractEmailDomain = function (email) {
  var parser = regex.email_parser;
  var emailM = parser.exec(email.toLowerCase());
  return emailM ? emailM.slice(-2)[0] : null;
};

/**
 * Helper to filter AD connections by domain.
 *
 * @private
 */
OptionsManager.prototype._findConnectionByADDomain = function (domain, strategies) {
  return this._filterConnections(domain, strategies, {userAndPass: true});
};

/**
 * Helper to filter enterprise connections by domain.
 *
 * @private
 */
OptionsManager.prototype._findConnectionByDomain = function (domain, strategies) {
  return this._filterConnections(domain, strategies, {userAndPass: undefined});
};

/**
 * Get from the strategies list (filtered by criteria) connections and
 * filter those connections by a given domain.
 *
 * @param   {String}  domain      Domain to be found.
 * @param   {Array}   strategies  Array with all the existing strategies
 *                                for this client.
 * @param   {Object}  criteria    Criteria to filter strategies.
 *
 * @returns {Object} the connection matching the domain or undefined otherwise.
 *
 * @private
 */
OptionsManager.prototype._filterConnections = function (domain, strategies, criteria) {
  strategies = strategies || this.$client.strategies;
  var conn_obj = _.chain(strategies)
    .where(criteria)
    .pluck('connections')
    .flatten()
    .map(function (e) {
      var l = [];
      if (e.domain) {
        l.push(e.domain);
      }
      l = l.concat(e.domain_aliases || []);
      e.domains = l;
      return e;
    })
    .find(function (e) { return e.domains.indexOf(domain) !== -1; })
    .value();

  return conn_obj;
};

/**
 * Given an email verifies if the email address matches a specific connection.
 * In that case the login will happen through an external platform (SSO enabled).
 *
 * @param {String} email
 *
 * @return {Boolean}
 */
OptionsManager.prototype._isConnectionEmail = function(email) {
  var emailDomain = this._extractEmailDomain(email || '');
  var adConnection = this._findConnectionByADDomain(emailDomain);
  var isEnterpriseConnection =
    this._isEnterpriseConnection(email || '');
  return ('username' !== this.usernameStyle && adConnection) ||
    isEnterpriseConnection;
};

/**
 * Resolves wether `email`'s domain belongs to
 * an enterprise connection or not, and alters
 * `output` object in the way...
 *
 * @param {String} email
 * @param {Object} output
 * @return {Boolean}
 * @private
 */

OptionsManager.prototype._isEnterpriseConnection = function (email, output) {
  var client = this.$client;
  var domain = this._extractEmailDomain(email);

  var conn = this._filterConnections(domain, client.strategies, {userAndPass: undefined});

  if (conn && output) {
    output.domain = conn.domain;
  }

  return !!conn;
};

OptionsManager.prototype._isFreeSubscription = function() {
  return this.$client.subscription && !~['free', 'dev'].indexOf(this.$client.subscription);
};

/**
 * Get resolved Auth0 connection to signin by `userName`
 * XXX: No idea what logic this follows...
 *
 * @param {String} userName
 * @return {Object}
 * @private
 */

OptionsManager.prototype._getAuth0Connection = function(username) {

  // if specified, use it, otherwise return first
  if (null != this.defaultUserPasswordConnection) {
    return _.chain(this.auth0Strategies)
      .pluck('connections')
      .flatten()
      .findWhere({ name: this.defaultUserPasswordConnection })
      .value();
  }

  var domain = username && ~username.indexOf('@') ? username.split('@')[1] : '';

  if (username && domain && this.$client.strategies) {
    //there is still a chance that the connection might be
    //adldap and with domain
    var conn = _.chain(this.$client.strategies)
                .pluck('connections')
                .flatten()
                .findWhere({domain: domain})
                .value();
    if (conn) {
      return conn;
    }
  }

  // By default, if exists, return auth0 connection (db-conn) or first
  var defaultStrategy = _.findWhere(this.auth0Strategies, { name: 'auth0' });
  defaultStrategy = defaultStrategy || (this.auth0Strategies.length > 0 ? this.auth0Strategies[0] : null);

  return defaultStrategy && defaultStrategy.connections.length > 0 ? defaultStrategy.connections[0] : null;
};

/**
 * Get Loggedin auth parameters from `strategy` and `ssoData`
 *
 * @param {String} strategy
 * @param {Object} ssoData
 * @return {Object}
 * @private
 */

OptionsManager.prototype._getLoggedInAuthParams = function (strategy, ssoData) {
  switch (strategy) {
    case 'google-oauth2':
      return { login_hint: ssoData.lastUsedUsername };
    default:
      return {};
  }
};

/**
 * Get client strategy by connection `connName`
 * XXX: Check that there may exist 2 connection with same name
 * but at different strategies... in that case this is wrong,
 * and it should also accept a strategy name as second parameter
 *
 * @param {String} connName
 * @return {Object}
 * @private
 */

OptionsManager.prototype._getClientStrategyByConnectionName = function (connName) {
  return _.chain(this.$client.strategies)
    .filter(function (s) {
      return _.findWhere(s.connections, { name: connName });
    }).value()[0];
};

/**
 * Get configured client strategy by strategy `name`
 *
 * @param {String} name
 * @return {Object}
 * @private
 */

OptionsManager.prototype._getClientStrategyByName = function (name) {
  return _.findWhere(this.$client.strategies, { name: name });
};

/**
 * Resolve whether use or don't use big social buttons
 *
 * @return {Boolean}
 * @public
 */

OptionsManager.prototype._useBigSocialButtons = function() {
  return null != this.socialBigButtons ? !!this.socialBigButtons : !this._isThereAnyEnterpriseOrDbConnection();
};

/**
 * Retrieve `$client` strategies by `social: true`
 *
 * @return {Array}
 * @public
 */

OptionsManager.prototype._getSocialStrategies = function() {
  return _.where(this.$client.strategies, { social: true });
};

/**
 * Resolve disable the focus on `is_small_screen`
 * or at embeded mode in `container`. Or override
 * by user preferences
 *
 * @return {Boolean}
 * @public
 */

OptionsManager.prototype._focusDisabled = function() {
  return null != this.focusInput ? !this.focusInput : (small_screen() || !!this.container);
};

/**
 * Resolve whether it should or should not
 * show last login connection
 *
 * @return {Boolean}
 * @public
 */

OptionsManager.prototype._shouldShowLastLogin = function() {
  var $ssoData = this.$widget.$ssoData;

  var connectionStrategy = $ssoData && $ssoData.lastUsedConnection && $ssoData.lastUsedConnection.strategy;
  var isADOrAuth0 = connectionStrategy === 'auth0' || connectionStrategy === 'ad';

  // Don't show last login if in Phonegap with AD or auth0 connection
  if (window.cordova && isADOrAuth0) {
    return false;
  }

  // Don't show last login if we don't know the strategy
  if (connectionStrategy && !this.$strategies[connectionStrategy]) {
    return false;
  }

  var shouldShow = $ssoData
    && $ssoData.sso
    && $ssoData.lastUsedConnection
    && this._isEnabledConnection($ssoData.lastUsedConnection.name)
    && !!this.rememberLastLogin;

  return shouldShow;
};

/**
 * Resolve whether it is or is not a connection
 * between enabled client's connection strategies
 *
 * @param {String} connectionName
 * @return {Boolean}
 * @public
 */

OptionsManager.prototype._isEnabledConnection = function(connectionName) {
  var strategy = this._getClientStrategyByConnectionName(connectionName);
  return strategy != null ? true : false;
};

OptionsManager.prototype._isUsernameRequired = function() {
  var dbConnection = this._getAuth0Connection();
  return dbConnection && dbConnection.requires_username;
}

/**
 * Private helpers
 */

function auth0StrategiesFilter(strategy) {
  return strategy.userAndPass && strategy.connections.length > 0;
}

function hasConnectionsFilter(strategy) {
  return strategy.connections.length > 0;
}

function strategiesConnectionsMapper(connections) {
  return function (strategy) {
    // XXX: We need to replace with Lodash
    // no deep clone/extend is a pain for referential objects...
    var cloned = _.extend({}, strategy);
    cloned.connections = _.filter(cloned.connections, function (connection) {
      return _.contains(connections, connection.name);
    });
    return cloned;
  };
}
