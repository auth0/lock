/**
 * Module dependencies.
 */

var small_screen = require('../is-small-screen');
var whitelist = require('./whitelist');
var regex = require('../regex');
var utils = require('../utils');
var i18n = require('../i18n');
var _ = require('underscore');
var xtend = _.extend;
var okeys = _.keys;
var supportedParams = [
  'state',
  'access_token',
  'scope',
  'protocol',
  'device',
  'request_id',
  'connection_scopes',
  'nonce',
  'offline_mode'
];

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
  };

  // holds widget as reference
  this.$widget = widget;

  // save widget's $client object reference
  this.$client = widget.$client;

  // save copy of widget's valid strategies
  this.$strategies = widget.$strategies;

  // save widget's `auth0-js` instance object
  this.$auth0 = widget.$auth0;

  // Options moved from constructor and hacked into `auth0-js` instance
  this.$auth0._useJSONP = options.forceJSONP || this.$client._useJSONP;
  this.$auth0._callbackURL = options.callbackURL || this.$client._callbackURL;
  this.$auth0._callbackOnLocationHash = !!options.callbackOnLocationHash || this.$client._callbackOnLocationHash;

  // save widget instance options with `$` prepended
  _.each(okeys(widget.$options), function(key) {
    this["$" + key] = widget.$options[key];
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

  // Copies the supportedParams from displayOptions
  // to this.extraParameters
  var extra = utils.extract(options, supportedParams);
  this.extraParameters = _.extend({}, extra, options.extraParameters);

  // enable/disable last login and AD discovery
  this.rememberLastLogin = null != options.rememberLastLogin
    ? options.rememberLastLogin
    : true;
  this.enableADRealmDiscovery = null != options.enableADRealmDiscovery
    ? options.enableADRealmDiscovery
    : true;

  // If popupCallback, enable popup mode
  if ('function' === typeof options.popupCallback) {
    this.popup = true;
    this.popupOptions = _.merge({}, options.popupOptions);
    this.popupCallback = options.popupCallback;
  };

  // force `closable` when provided with `container`
  this.closable = !this.container;

  // Delay options requiring $client configuration
  if (!_.isEmpty(this.$client)) {
    this._onclientloaded();
  } else {
    var setClient = global.window.Auth0.setClient;
    var self = this;
    global.window.Auth0.setClient = function(client) {
      setClient.apply(window.Auth0, arguments);
      self.$client = _.extend(self.$client, client);
      self._onclientloaded.call(self);
    }
  }
}

OptionsManager.prototype._onclientloaded = function() {
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
  if (this.mode === 'signup' && !auth0Conn.showSignup) this.mode = 'signin';
  if (this.mode === 'reset' && !auth0Conn.showForgot) this.mode = 'signin';

  // Resolve show action buttons or not
  this.showSignupAction = (this.disableSignupAction !== true) && ((auth0Conn && auth0Conn.showSignup) || this.signupLink);
  this.showResetAction = (this.disableResetAction !== true) && ((auth0Conn && auth0Conn.showForgot) || this.resetLink);

  // username_style
  var auth0ConnStrategy = this._getClientStrategyByConnectionName(auth0Conn.name) || {};

  if (!this.username_style && (auth0ConnStrategy.name === 'ad' || auth0ConnStrategy.name === 'auth0-adldap')) {
    this.username_style = 'username';
  }
}

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
}

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
  var parser = regex.email_parser;
  var emailM = parser.exec(email.toLowerCase());
  var email_domain = null != emailM ? emailM.slice(-2)[0] : null;
  var sfilter = { userAndPass: undefined };
  var cfilter = { domain: email_domain };

  if (!email_domain) return false;

  var conn = _.chain(client.strategies)
    .where(sfilter)
    .pluck('connections')
    .flatten()
    .findWhere(cfilter)
    .value();

  if (conn && output) {
    output.domain = conn.domain;
  }

  return !!conn;
};

OptionsManager.prototype._isFreeSubscription = function() {
  return this.$client.subscription && !~['free', 'dev'].indexOf(this.$client.subscription)
}

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
  if (null != this.userPwdConnectionName) {
    return _.chain(this.auth0Strategies)
      .pluck('connections')
      .flatten()
      .findWhere({ name: this.userPwdConnectionName })
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
  defaultStrategy = defaultStrategy || (this.auth0Strategies.length > 0 ? this.auth0Strategies[0] : null);

  return defaultStrategy && defaultStrategy.connections.length > 0
    ? defaultStrategy.connections[0]
    : null;
}

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
  return this.socialBigButtons || !this._isThereAnyEnterpriseOrDbConnection();
}

/**
 * Retrieve `$client` strategies by `social: true`
 *
 * @return {Array}
 * @public
 */

OptionsManager.prototype._getSocialStrategies = function() {
  return _.where(this.$client.strategies, { social: true })
}

/**
 * Resolve disable the focus on `is_small_screen`
 * or at embeded mode in `container`. Or override
 * by user preferences
 *
 * @return {Boolean}
 * @public
 */

OptionsManager.prototype._focusDisabled = function() {
  return null != this.focusInput
    ? !this.focusInput
    : small_screen() || !!this.container;
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
    strategy.connections = _.filter(strategy.connections, function (connection) {
      return _.contains(connections, connection.name);
    });
    return strategy;
  }
}
