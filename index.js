/**
 * Insert css when first loaded
 */

require('./lib/insert-css');

/**
 * Module dependencies.
 */

var bonzo = require('bonzo');
var bean = require('bean');
var _ = require('underscore');
var debug = require('debug')('auth0-lock');
var Auth0 = require('auth0-js');
var $ = require('./lib/bonzo-augmented');
var EventEmitter = require('events').EventEmitter;

var strategies = require('./lib/strategies');
var template = require('./lib/html/main.ejs');

var HeaderView = require('./lib/header');

var SigninPanel = require('./lib/mode-signin');
var SignupPanel = require('./lib/mode-signup');
var ResetPanel = require('./lib/mode-reset');
var LoggedinPanel = require('./lib/mode-loggedin');
var KerberosPanel = require('./lib/mode-kerberos');
var LoadingPanel = require('./lib/mode-loading');
var OptionsManager = require('./lib/options-manager');

//browser incompatibilities fixes
var placeholderSupported = require('./lib/supports-placeholder');
var ocreate = require('./lib/object-create');
var stop = require('./lib/stop-event');
var utils = require('./lib/utils');
var bind = require('./lib/bind');
var i18n = require('./lib/i18n');

/**
 * Expose `Auth0Lock` constructor
 */

module.exports = Auth0Lock;

/**
 * Create `Auth0Lock` instance
 * resolving `options`.
 *
 * @param {String} clientID
 * @param {String} domain
 * @param {Object} options
 *     - assetsUrl
 * @return {Auth0Lock}
 * @constructor
 */

function Auth0Lock (clientID, domain, options) {
  if (!(this instanceof Auth0Lock)) {
    return new Auth0Lock(clientID, domain, options);
  }

  // validate required options
  if ('string' !== typeof clientID) {
    throw new Error('`ClientID` required as first parameter.');
  }
  if ('string' !== typeof domain) {
    throw new Error('`domain` required as second parameter.');
  }

  // Initiate `EventEmitter`
  EventEmitter.call(this);

  // Instance properties and options
  this.$options = _.extend({}, options);

  // Save clientID and domain in $options
  this.$options.clientID = clientID;
  this.$options.domain = domain;

  // Holds copy for all suppported strategies
  this.$strategies = strategies;

  // Holds auth0-js' instance
  this.$auth0 = new Auth0({
    clientID: this.$options.clientID,
    domain: this.$options.domain,
    useCordovaSocialPlugins: this.$options.useCordovaSocialPlugins
  });

  // use domain as assetsUrl if no assetsUrl provided
  // and domain is not *.auth0.com. Fallback to S3 url
  this.$options.assetsUrl = this.getAssetsUrl(this.$options.assetsUrl, this.$options.domain);

  // Holds SSO Data for return user experience
  this.$ssoData = null;

  // Expose `i18n.dicts` to allow custom dictionary overrides
  this.$dicts = i18n.dicts;

  // Holds widget's DOM `$container` ref
  this.$container = null;

  // holds client's connections configuration
  // retrieved from S3 or CDN/assetsUrl provided
  this.$client = {};
  this.getClientConfiguration(bind(this.setClientConfiguration, this));
}

/**
 * Expose current `Auth0Lock`'s version
 */

Auth0Lock.version = require('package.version');

/**
 * Inherit from `EventEmitter`
 */

Auth0Lock.prototype = ocreate(EventEmitter.prototype);

/**
 * Get client configuration.
 * XXX: Why not use jsonp? that woudld allow the
 * global namespace definition to be optional...
 *
 * @param {Function} done
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype.getClientConfiguration = function (done) {
  var self = this;

  // Save callback to be called once
  // client configuration gets loaded
  if ('function' === typeof done) {
    this.once('client loaded', function (client) {
      done(client);
    });
  }

  // If not loading, check for already stored
  // in a previous widget instantiation
  global.window.Auth0 = global.window.Auth0 || { clients: {}, script_tags: {} };

  if (!global.window.Auth0.clients) {
    global.window.Auth0.clients = {};
    global.window.Auth0.script_tags = {};
  }

  var clients = global.window.Auth0.clients;
  var client = clients[this.$options.clientID];
  if (client) {
    return this.emit('client loaded', client);
  }

  // check if loading state
  // and then await for response
  // no need to monkey-patch again
  if (this.loadState) {
    return;
  }
  this.loadState = true;

  // Monkey patch Auth.setClient to load client
  var setClient = global.window.Auth0.setClient || function setClient() {};
  global.window.Auth0.setClient = function (client) {
    setClient.apply(window.Auth0, arguments);

    // If not this client, return
    if (self.$options.clientID !== client.id) {
      return;
    }

    // store the client
    clients[self.$options.clientID] = client;

    // notify initialized and pass the client with it
    self.emit('client loaded', client);
  };

  var script = global.window.Auth0.script_tags[this.$options.clientID];

  if (!script) {
    // Load client from assets url
    var script = document.createElement('script');
    script.src = this.$options.assetsUrl + 'client/' + this.$options.clientID + '.js' + '?t' + (+new Date());

    // Save script reference for other intances using the same clientID
    global.window.Auth0.script_tags[this.$options.clientID] = script;

    // Insert script in DOM head
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  // Handle load and error for client config
  script.addEventListener('load', bind(this.onclientloadsuccess, this));
  script.addEventListener('error', bind(this.onclientloaderror, this));
  this.timeout = setTimeout(bind(this.onclientloaderror, this), 5000);
};

/**
 * Handle success for script load of client's configuration
 *
 * @private
 */

Auth0Lock.prototype.onclientloadsuccess = function() {

  // clear error timeout
  clearTimeout(this.timeout);
  this.timeout = null;

  // clear displayed errors if any
  if (this.options) {
    this._showError();
  }

  // We should use debug and log stuff without console.log
  // and only for debugging
  // XXX: events not yet publicly supported
  this.emit('client fetch success');
  debug('Client fetch success');
};

/**
 * Handle error for script load of client's configuration
 *
 * @private
 */

Auth0Lock.prototype.onclientloaderror = function(err) {

  // timeout has been cleared
  if (!this.timeout) {
    return;
  }

  // clear error timeout
  clearTimeout(this.timeout);
  this.timeout = null;

  // If UI present, delay the show error just a little more,
  // because sometimes this loads before in the async call
  // compared to the `load` event success.
  if (this.options) {
    setTimeout(bind(this.showNetworkError, this), 500);
  }

  // reset loadstate
  this.loadState = false;

  // reset script loading state
  global.window.Auth0.script_tags[this.$options.clientID] = null;

  var error = new Error('Failed to load client configuration for ' + this.$options.clientID);

  // XXX: events not yet publicly supported
  this.emit('client fetch error', error);
  debug('Error loading client: %s', error);
};

Auth0Lock.prototype.showNetworkError = function() {
  // client has been loaded in some async call
  if (global.window.Auth0.clients[this.options.$clientID]) {
    return;
  }

  // Exhibit lock's working canvas
  this.exhibit();

  // XXX: Should we create an "error-mode" for such cases?
  // XXX: or are we ok with this display?
  this._loadingPanel(this.options);

  // Turn off the loading spinner
  this.query('.a0-spinner').addClass('a0-hide');

  // display error
  this._showError(this.options.i18n.t('networkError'));
};

/**
 * Set's the client configuration object
 *
 * @param {Object} client
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype.setClientConfiguration = function (client) {
  this.$client = _.clone(client);
  this.emit('client initialized');
  return this;
};

/**
 * Query for elements by `selector` within optional `context`.
 * Last defaults to widget's instance `$container`.
 *
 * @param {String} selector
 * @param {NodeElement} context
 * @return {BonzoAugmented}
 * @public
 */

Auth0Lock.prototype.query = function(selector, context) {
  if ('string' === typeof selector) {
    return $(selector, context || this.$container);
  }
  return $('#a0-lock', selector || this.$container);
};

/**
 * Render template function with default incance
 * `_locals` resolved.
 *
 * @param {Function} tmpl
 * @param {Object} locals
 * @return {String}
 * @public
 */

Auth0Lock.prototype.render = function(tmpl, locals) {
  var _locals = _.extend({}, this.options, locals);
  return tmpl(_locals);
};

/**
 * Render widget container to DOM
 * XXX: consider renaming!
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype.insert = function() {
  if (this.$container) { return this; }

  var options = this.options;
  var cid = options.container;
  var locals = {
    options:      options,
    cordova:      utils.isCordova(),
    ios:          utils.isIOS()
  };

  // widget container
  if (cid) {
    this.$container = document.getElementById(cid);
    if (!this.$container) { throw new Error('Not found element with \'id\' ' + cid); }

    this.$container.innerHTML = this.render(template, locals);

  } else {
    this.$container = document.createElement('div');
    bonzo(this.$container).addClass('a0-lock-container');

    this.$container.innerHTML = this.render(template, locals);
    document.body.appendChild(this.$container);
  }

  return this;
};

/**
 * Exhibit Lock's working space
 * before loading any other panel
 *
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype.exhibit = function() {
  var options = this.options;

  // Create and set the header
  this.header = new HeaderView(this, this.query('.a0-header').get(0), options);

  // activate panel
  // XXX: (?) this I don't get... why remove and add?
  this.query('div.a0-panel').removeClass('a0-active');
  this.query('div.a0-overlay').addClass('a0-active');
  this.query('.a0-panel.a0-onestep').addClass('a0-active');

  this.query('.a0-overlay')
    .toggleClass('a0-no-placeholder-support', !placeholderSupported);

  this.query('.a0-popup .a0-invalid').removeClass('a0-invalid');

  // buttons actions
  this.query('.a0-onestep a.a0-close').a0_on('click', bind(this.oncloseclick, this));

  if (!options.container) {
    // hides all non-lock elements when lock is open
    bonzo(document.body).addClass('a0-lock-open');
  } else {
    // remove overlay when render inside a div
    this.query('.a0-active').removeClass('a0-overlay');
  }

  // close popup with ESC key
  if (options.closable) {
    this.query('').a0_on('keyup', bind(this.onescpressed, this));
  }

  // after pre-setting classes and dom handlers
  // emit as shown
  this.emit('shown');
};

/**
 * Show the widget resolving `options`
 * with default mode as 'signin'
 *
 * @param {Object} options
 * @param {Function} callback
 * @return {Auth0Lock}
 * @public
 */

Auth0Lock.prototype.show = function(options, callback) {
  var params = getShowParams(options, callback);
  var opts = _.extend({ mode: 'signin' }, params.options);
  return this.display(opts, params.callback);
};

/**
 * Show widget on `signin` mode with
 * signup and reset actions disabled
 * by default so no action buttons
 * are present on widget.
 *
 * @param {Object} options
 * @param {Function} callback
 * @return {Auth0Lock}
 * @public
 */

Auth0Lock.prototype.showSignin = function(options, callback) {

  var params = getShowParams(options, callback);
  var optional = { disableSignupAction: true, disableResetAction: true };
  var required = { mode: 'signin' };

  // merge and force `signin` mode
  var opts = _.extend(optional, params.options, required);
  return this.show.call(this, opts, params.callback);
};

/**
 * Show widget on `reset` mode with
 * signup and reset actions disabled
 * by default so no action buttons
 * are present on widget.
 *
 * @param {Object} options
 * @param {Function} callback
 * @return {Auth0Lock}
 * @public
 */

Auth0Lock.prototype.showSignup = function(options, callback) {
  var params = getShowParams(options, callback);
  var optional = { disableSignupAction: true, disableResetAction: true };
  var required = { mode: 'signup' };

  // merge and force `signin` mode
  var opts = _.extend(optional, params.options, required);
  return this.show.call(this, opts, params.callback);
};

/**
 * Show widget on `reset` mode with
 * signup and reset actions disabled
 * by default so no action buttons
 * are present on widget.
 *
 * @param {Object} options
 * @param {Function} callback
 * @return {Auth0Lock}
 * @public
 */

Auth0Lock.prototype.showReset = function(options, callback) {
  var params = getShowParams(options, callback);
  var optional = { disableSignupAction: true, disableResetAction: true };
  var required = { mode: 'reset' };

  // merge and force `signin` mode
  var opts = _.extend(optional, params.options, required);
  return this.show.call(this, opts, params.callback);
};

/**
 * Hide the widget and call `callback` when done.
 *
 * @param {Function} callback
 * @return {Auth0Lock}
 * @public
 */

Auth0Lock.prototype.hide = function (callback) {
  // immediatelly hide widget
  bonzo(document.body).removeClass('a0-lock-open');

  // Remove widget and/or it's container
  if (this.$container && this.options.container) {
    // remove `#a0-lock`
    this.query().remove();
  } else if(this.$container) {
    // remove `.a0-lock-container`
    this.query().parent('.a0-lock-container').remove();
  }

  this.$container = null;

  if ('function' === typeof callback) {
    callback();
  }
  this.emit('hidden');

  return this;
};

/**
 * Proxy `auth0.js` instance `.logout()` method
 *
 * @param {Object} query
 * @return {Auth0Lock}
 * @public
 */

Auth0Lock.prototype.logout = function (query) {
  this.$auth0.logout(query);
  return this;
};

/**
 * Display the widget in "signin" or "signup"
 * or "reset" mode, resolved from display `options`.
 * Optionaly set "popupCallback" to `callback` if present
 *
 * @param {Object} options
 * @param {Function} callback
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype.display = function(options, callback) {
  // pre-format options
  var opts = _.extend({ popupCallback: callback }, options);

  // Instantiate OptionsManager as `this.options`
  this.options = new OptionsManager(this, opts);

  // Start by render widget's container
  this.insert();

  this.options.ready(bind(onoptionsready, this));

  // Initialize widget's view
  // when options get loaded
  function onoptionsready() {
    this.initialize(bind(oninitialized, this));
  }

  // and right after that render mode
  function oninitialized() {
    // focus once ready
    this.once(this.options.mode + ' ready', bind(this.focusInput, this));

    // resolve view
    if ('signin' === this.options.mode) {
      // if user in AD ip range
      if (this.$ssoData && this.$ssoData.connection) {
        return this._kerberosPanel(this.options, callback);
      }

      // if user logged in show logged in experience
      if (this.options._shouldShowLastLogin()) {
        return this._loggedinPanel(this.options, callback);
      }

      // otherwise, just show signin
      this._signinPanel();
    }

    if ('signup' === this.options.mode) {
      this._signupPanel();
    }

    if ('reset' === this.options.mode) {
      this._resetPanel(this.options, callback);
    }

  }

  return this;
};

/**
 * Initialize widget for the `display` method
 * and calls `done` when ready to continue mode
 * setup...
 *
 * @param {Function} done
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype.initialize = function(done) {
  var self = this;
  var options = this.options;

  // Wait for Auth0.setClient() to be sure
  // we have the client's configuration
  // before setting up
  if (_.isEmpty(this.$client)) {
    var args  = arguments;
    return this.getClientConfiguration(function () {
      self.initialize.apply(self, args);
    });
  }

  if (options._isFreeSubscription()) {
    // hide footer for non free/dev subscriptions
    this.query('.a0-footer').toggleClass('a0-hide', true);
    this.query('.a0-free-subscription').removeClass('a0-free-subscription');
  }

  // Exhibit lock's working canvas
  this.exhibit();

  function finish(err, ssoData) {
    // XXX: auth0.getSSOData() never returns err
    // see source at: https://github.com/auth0/auth0.js/blob/master/lib/index.js
    self.$ssoData = ssoData;
    done();
    self.emit('ready');
  }

  // do not get SSO data on signup or reset modes
  var notSigninMode = ~['reset', 'signup'].indexOf(options.mode);
  if (notSigninMode) {
    return finish(null, {}), this;
  }

  var disabledReturnUserExperience = false === options.rememberLastLogin &&
    (!options._isThereAnyADConnection() || false === options.integratedWindowsLogin);

  if (disabledReturnUserExperience) {
    return finish(null, {}), this;
  }

  this._loadingPanel(options);

  // get SSO data and then render
  this.$auth0.getSSOData(options._isThereAnyADConnection(), finish);

  return this;
};

/**
 * Create and set a new SigninPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._signinPanel = function (options) {
  var panel = SigninPanel(this, options || {});

  // XXX: future Panel API placeholder
  // panel.on('submit', this.setLoadingMode);
  // panel.on('error', function(errors) {
  //   // errors are already saved in `signin` instance
  //   self.unsetLoadinMode();
  //   self.query('.a0-panel').html(signin.create());
  // });

  // panel.on('success', function() {
  //   self.hide();  // will unset loading mode
  //                 // and destroy and detach
  //                 // widget container from DOM
  // });

  this._setTitle(this.options.i18n.t('signin:title'));

  this.setPanel(panel);

  return this;

};

/**
 * Create and set a new SignupPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._signupPanel = function (options) {
  var panel = SignupPanel(this, options || {});

  this._setTitle(this.options.i18n.t('signup:title'));

  this.setPanel(panel);

  return this;
};

/**
 * Create and set a new ResetPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._resetPanel = function (options) {
  var panel = ResetPanel(this, { options: options || {} });

  this._setTitle(this.options.i18n.t('reset:title'));

  this.setPanel(panel);

  return this;
};

/**
 * Create and set a new LoadingPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._loadingPanel = function (options) {
  var panel = LoadingPanel(this, { options: options });

  if (options.title) {
    this._setTitle(this.options.i18n.t(options.title + ':title'));
  } else {
    this._setTitle(this.options.i18n.t((options.mode || 'signin') + ':title'));
  }

  this.setPanel(panel);

  if (options.message) {
    panel.query('').addClass('a0-with-message');
    panel.query('.a0-spin-message span').html(options.message.replace('-', ' '));
  }

  return this;
};

/**
 * Create and set a new LoggedinPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._loggedinPanel = function (options) {
  var panel = LoggedinPanel(this, { options: options || {} });

  this._setTitle(this.options.i18n.t('signin:title'));

  this.setPanel(panel);

  return this;
};

/**
 * Create and set a new KerberosPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._kerberosPanel = function (options) {
  var panel = KerberosPanel(this, { options: options || {} });

  this._setTitle(this.options.i18n.t('signin:title'));

  this.setPanel(panel);

  return this;
};

/**
 * Set `panel` to .a0-mode-container element and
 * emit it's `name` as ready
 *
 * @param {SigninPanel|SignupPanel|...} panel
 * @param {String} name
 * @private
 */

Auth0Lock.prototype.setPanel = function(panel, name) {
  var el = 'function' === typeof panel.render ? panel.render() : panel;
  var pname = 'function' === typeof panel.render ? panel.name : (name || 'signin');

  // Remember current panel
  this.$panel = panel;

  //Removes error messages on new views.
  this._showError();

  this.query('.a0-mode-container').html(el);
  this.emit('%s ready'.replace('%s', pname));

  // When navigating to a different panel, clear the previous panel history.
  // The signin panel will handle this inside the panel.
  if (pname !== 'signin') {
    this._clearPreviousPanel();
  }
};

/**
 * Resolve whether instance `$options.domain` is an
 * Auth0's domain or not
 *
 * @param {String} prefix
 * @return {Boolean}
 * @private
 */

Auth0Lock.prototype.isAuth0Domain = function (prefix) {
  var domainUrl = utils.parseUrl('https://' + this.$options.domain);
  if (prefix) {
    return utils.endsWith(domainUrl.hostname, '.' + prefix + '.auth0.com') &&
      domainUrl.hostname.match(/\./g).length === 3;
  }
  return utils.endsWith(domainUrl.hostname, '.auth0.com') &&
    domainUrl.hostname.match(/\./g).length === 2;
};

/**
 * Calculate the assetsUrl.
 *
 * @param {String} assetsUrl
 * @param {String} domain
 * @return {Boolean}
 * @private
 */

Auth0Lock.prototype.getAssetsUrl = function (assetsUrl, domain) {
  if (assetsUrl) {
    return assetsUrl;
  }
  if (this.isAuth0Domain('eu')) {
    return 'https://cdn.eu.auth0.com/';
  }
  if (this.isAuth0Domain('au')) {
    return 'https://cdn.au.auth0.com/';
  }
  if (this.isAuth0Domain()) {
    return 'https://cdn.auth0.com/';
  }
  return 'https://' + this.$options.domain + '/';
};

/**
 * Resolve whether ignore or not `inputs` email validation
 *
 * @param {NodeElement} input
 * @return {Boolean}
 * @private
 */

Auth0Lock.prototype._ignoreEmailValidations = function (input) {
  return input.attr('type') !== 'email';
};

/**
 * Set an error `message` or clean element.
 *
 * @param {String} message
 * @private
 */

Auth0Lock.prototype._showError = function (message) {

  // if no error, clean
  if (!message) {
    // reset errors
    this.query('.a0-error').html('').addClass('a0-hide');
    this.query('.a0-errors').removeClass('a0-errors');
    // reset animations
    return animation_shake_reset(this.$container);
  }

  // else, show and render error message
  setTimeout(animation_shake, 0, this.$container);

  this.query('.a0-success').addClass('a0-hide');
  this.query('.a0-error').html(message).removeClass('a0-hide');
  this.emit('error shown', message);

  // REMOVEME: This is here for backward compatibility. Deprecated in favor of 'error shown'.
  this.emit('_error', message);
};

/**
 * Set a success `message` or clean element.
 * XXX: This is mostly used on password reset,
 * we should consider moving it to `ResetPanel`
 *
 * @param {String} message
 * @private
 */

Auth0Lock.prototype._showSuccess = function (message) {
  // if no message, clean success span
  if (!message) return this.query('.a0-success').html('').addClass('a0-hide');
  // else, show and render success message
  this.query('.a0-error').addClass('a0-hide');
  this.query('.a0-success').html(message).removeClass('a0-hide');
};

/**
 * Set an `input`s style to focus some
 * error going on, and optionaly
 * append a `message`
 *
 * @param {NodeElement} input
 * @param {String} message
 * @private
 */

Auth0Lock.prototype._focusError = function(input, message) {
  // remove all `_focusError` resources
  if (!arguments.length) {
    // reset errors
    this.query('.a0-errors').removeClass('a0-errors');
    this.query('.a0-error-input').removeClass('a0-error-input');
    this.query('.a0-error-message').remove();
    // reset animations
    return animation_shake_reset(this.$container);
  }

  // animation
  setTimeout(animation_shake, 0, this.$container);

  input
    .parent()
    .addClass('a0-error-input');

  if (!message) return;
  input.parent().append($.create('<span class="a0-error-message">' + message + '</span>'));
  this.emit('error shown', message, input);
};

/**
 * Set the email address in the current panel if possible.
 *
 * @param {String} email
 * @private
 */

Auth0Lock.prototype._setEmail = function(email) {
  var email_input = this.query('input[name=email]');
  if (email_input && email_input.length === 1) {
    email_input.val(email);
    bean.fire(email_input[0], 'input');
  }
};

/**
 * Set widget's `title`
 *
 * @param {String} title
 * @private
 */

Auth0Lock.prototype._setTitle = function(title) {
  this.header.setTitle(title);
};

/**
 * Restore widget's image
 *
 * @param {String} title
 * @private
 */

Auth0Lock.prototype.restoreImage = function(title) {
  this.header.restoreImage(title);
};

/**
 * Set widget's image
 *
 * @param {String} title
 * @private
 */

Auth0Lock.prototype.setImage = function(title) {
  this.header.setImage(title);
};

/**
 * Signin entry point method for resolving
 * username and password connections or enterprise
 *
 * @param {SigninPanel|SignupPanel} panel
 * @private
 */

Auth0Lock.prototype._signin = function (panel) {
  var valid = true;

  var message;

  var emailD = panel.query('.a0-email');
  var email_input = panel.query('input[name=email]');

  // Send out the signin event, allowing users to dynamically change the options.
  this.emit('signin submit', this.options, { email: email_input.val() });

  var email = null, domain, connection;

  var input_email_domain = this.options._extractEmailDomain(email_input.val().toLowerCase());

  var conn_obj = this.options._findConnectionByDomain(
    input_email_domain,
    this.$client.strategies
  );

  // Gets suffix
  if (!conn_obj) {
    if (this.options.auth0Strategies.length > 0) {
      return this._signinWithAuth0(panel);
    }

    if (input_email_domain === 'gmail.com') {
      return this._signinSocial('google-oauth2', null, null, panel);
    }

    message = this.options.i18n.t('signin:strategyDomainInvalid');
    message = message.replace('{domain}', input_email_domain);

    this._showError(message);
    this._focusError(email_input);

    return;
  }

  domain = conn_obj.domain;
  email = email_input.val();
  connection = conn_obj.name;

  valid &= (!domain && !emailD.addClass('a0-invalid')) || (!!domain && !!emailD.removeClass('a0-invalid'));

  // XXX: We should throw something here...
  // There has to be an action!
  if (!valid) { return; }

  if (this.options.popup && 'token' === this.options.responseType) {
    return this._signinPopupNoRedirect(connection, this.options.popupCallback, undefined, panel);
  }

  message = this.options.i18n.t('signin:loadingMessage').replace('{connection}', connection);
  this._loadingPanel({ mode: 'signin', message: message });

  var loginOptions = _.extend({}, {
    connection: connection,
    popup: this.options.popup,
    popupOptions: this.options.popupOptions,
    sso: this.options.sso,
    login_hint: email_input.val()
  }, this.options.authParams);

  this.$auth0.login(loginOptions);
};

/**
 * Signin method for username and password credentials
 *
 * @param {SigninPanel|SignupPanel} panel
 * @private
 */

Auth0Lock.prototype._signinWithAuth0 = function (panel, connection) {
  var self = this;
  var options = this.options;
  var email_input = panel.query('input[name=email]');
  var password_input = panel.query('input[name=password]');
  var username = email_input.val();
  var password = password_input.val();
  connection = connection || options._getAuth0Connection(username);

  var loginOptions = {
    connection: connection.name,
    username: connection.domain ? username.replace('@' + connection.domain, '') : username,
    password: password,
    popup: self.options.popup,
    popupOptions: self.options.popupOptions,
    sso: self.options.sso,
    login_hint: connection.domain ? username.replace('@' + connection.domain, '') : username
  };

  // We might be loosing some instance parameters here
  // XXX: An options method to get $auth0 login options
  // resolved from existing options combined with instance
  // may be a good idea...
  loginOptions = _.extend({}, loginOptions, this.options.authParams);

  var strategy = options._getClientStrategyByConnectionName(connection.name) || {};

  // Clean error container
  this._showError();
  this._focusError();

  if (this.options.popup && 'token' === this.options.responseType) {
    //This will use winchan etc...
    return this._signinPopupNoRedirect(connection.name, this.options.popupCallback, loginOptions, panel);
  }

  // TODO: Handle sso case without popup
  var message = strategy.name !== 'auth0' ? // dont show loading message for dbConnections
    this.options.i18n.t('signin:loadingMessage').replace('{connection}', connection.name) : '';

  this._loadingPanel({ mode: 'signin', message: message });

  debug('sigin in with auth0');
  this.$auth0.login(loginOptions, function (err) {
    if (!err) {
      self.emit('signin success');
      return;
    }

    self.emit('signin error', err);
    // display `panel`
    self.setPanel(panel);

    // display errors
    self._focusError(email_input);
    self._focusError(password_input);

    if (err.status !== 401) {
      self._showError(err.message || self.options.i18n.t('signin:serverErrorText'));
    } else if ('password_change_required' === err.code) {
      self._showError(self.options.i18n.t('signin:passwordChangeRequiredErrorText'));
    } else {
      self._showError(self.options.i18n.t('signin:wrongEmailPasswordErrorText'));
      password_input.focus();
      // password_input.get(0).setSelectionRange(0, password_input.val().length);
    }
  });
};

Auth0Lock.prototype._autoSignin = function(email, password) {
  this._signinPanel({initialEmail: email, initialPassword: password});
  this._signinWithAuth0(this.$panel);
};

/**
 * Signin method for social connections
 *
 * @param {Event|String} e
 * @param {String} connection
 * @param {Object} authParams
 * @param {SigninPanel|SignupPanel} panel
 * @private
 */

Auth0Lock.prototype._signinSocial = function (e, connection, extraParams, panel) {
  var target = e.currentTarget || e.delegateTarget || e.target || e;
  var self = this;
  var options = panel.options;
  var strategyName = typeof target === 'string' ? target : target.getAttribute('data-strategy');
  var strategy = options._getClientStrategyByName(strategyName);

  var connectionName = connection || strategy.connections[0].name;

  // use authParams
  var extra = self.options.authParams;

  if (extra.connection_scopes) {
    // if no connection_scope was set for the connection we are ok with sending undefined
    extra.connection_scope = extra.connection_scopes[connectionName];
  }

  if (strategyName === 'facebook') {
    extraParams = extraParams || {};
    extraParams.display = 'popup';
  }

  if (strategy) {
    // If we are in popup mode and responseType == 'token' was specified
    // we need to pass a callback.
    if (this.options.popup && 'token' === this.options.responseType) {
      this._signinPopupNoRedirect(connectionName, self.options.popupCallback, extraParams, panel);
    } else {
      var loginOptions = _.extend({}, {
        connection: connectionName,
        popup: self.options.popup,
        popupOptions: self.options.popupOptions,
        sso: self.options.sso
      }, self.options.authParams, extraParams);

      debug('sigin with social')
      this.$auth0.login(loginOptions);
    }
  }
};

/**
 * Invoke `auth0.js` signin with popup parameters
 * and call `popupCallback` on complete
 *
 * @param {String} connectionName
 * @param {Function} popupCallback
 * @param {Object} authParams
 * @param {SigninPanel|SignupPanel} panel
 * @private
 */

Auth0Lock.prototype._signinPopupNoRedirect = function (connectionName, popupCallback, extraParams, panel) {
  var self = this;
  var email_input = panel.query('input[name=email]');
  var password_input = panel.query('input[name=password]');
  var options = this.options;
  var callback = popupCallback || options.popupCallback;

  extraParams = extraParams || {};

  var loginOptions = _.extend({}, {
        connection: connectionName,
        popup: self.options.popup,
        popupOptions: self.options.popupOptions,
        sso: self.options.sso,
        login_hint: email_input.val()
      }, options.authParams, extraParams);

  if ('function' !== typeof callback) {
    throw new Error('Popup mode needs a callback function to be executed after authentication success or failure.');
  }

  // Clean error container
  this._showError();
  this._focusError();

  // set loading message
  // unless it's a /ro call for username/email and password
  var message = null == loginOptions.username ? this.options.i18n.t('signin:popupCredentials') : null;
  this._loadingPanel({ mode: 'signin', message: message });

  debug('sigin in with popup');
  this.$auth0.login(loginOptions, function(err, profile, id_token, access_token, state) {
    var args = Array.prototype.slice.call(arguments, 0);
    if (!err) {
      self.emit('signin success');
      return callback.apply(self, args), self.hide();
    }

    self.emit('signin error', err);

    // display signin
    self.setPanel(panel);

    // render errors
    if (err.message === 'User closed the popup window') {
      // Closed window
      self._showError(self.options.i18n.t('signin:userClosedPopup'));
    } else if (err.message === 'access_denied') {
      // Permissions not granted
      self._showError(self.options.i18n.t('signin:userConsentFailed'));
    } else if (err.status === 0) {
      self._showError(self.options.i18n.t('networkError'));
    } else if (err.status !== 401) {
      self._showError(self.options.i18n.t('signin:serverErrorText'));
    } else if ('unauthorized' === err.code && err.details && err.details.error_description === 'user is blocked') {
      var message = self.options.i18n.t('signin:userBlockedErrorText');
      self._showError(message || err.details.error_description);
      self._focusError(email_input);
      self._focusError(password_input);
    } else if ('unauthorized' === err.code) {
      var message = self.options.i18n.t('signin:unauthorizedErrorText');
      self._showError((err.details && err.details.error_description) || message);
      self._focusError(email_input);
      self._focusError(password_input);
    } else if ('password_change_required' === err.code) {
      var message = self.options.i18n.t('signin:passwordChangeRequiredErrorText');
      self._showError(message);
      self._focusError(email_input);
      self._focusError(password_input);
    } else {
      var message = self.options.i18n.t('signin:wrongEmailPasswordErrorText');
      self._showError(message);
      self._focusError(email_input);
      self._focusError(password_input);
    }

    return callback.apply(null, args);
  });
};

/**
 * Get `auth0.js` instance client
 *
 * @return {Auth0}
 * @public
 */

Auth0Lock.prototype.getClient = function () {
  return this.$auth0;
};

/**
 * Proxy `auth0.js` instance to `parseHash`
 *
 * @param {String} hash
 * @return {Object|Error}
 * @public
 */

Auth0Lock.prototype.parseHash = function (hash) {
  return this.$auth0.parseHash(hash);
};

/**
 * Proxy `auth0.js` instance to `getProfile`
 *
 * @param {String} token
 * @param {Function} callback
 * @return {Auth0Lock}
 * @public
 */

Auth0Lock.prototype.getProfile = function (token, callback) {
  this.$auth0.getProfile(token, callback);
  return this;
};

/**
 * Handle `e` when .a0-close is clicked
 *
 * @param {Event} e
 * @private
 */

Auth0Lock.prototype.oncloseclick = function(e) {
  stop(e);
  this.emit('close');
  this.hide();
};

/**
 * Handle `e` when keypressed ESC
 *
 * @param {Event} e
 * @private
 */

Auth0Lock.prototype.onescpressed = function(e) {
  if ((e.which == 27 || e.keycode == 27)) this.hide();
};

/**
 * Set focus on firist `input` if supported
 * but avoid mobie media screens and embeded
 * by default
 *
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype.focusInput = function() {
  if (this.options._focusDisabled()) return this;

  var el = this.query('input').first();
  try{
    el.focus();
  } catch(err) {}

  return this;
};

/**
 * Set the previous panel.
 * This value is used when returning back from the HRD/SSO state.
 *
 * @param {String} panelName
 * @public
 */

Auth0Lock.prototype._setPreviousPanel = function (panelName) {
  this._previousPanel = panelName;
};

/**
 * Get the previous panel.
 * This value is used when returning back from the HRD/SSO state.
 *
 * @return {String}
 * @public
 */

Auth0Lock.prototype._getPreviousPanel = function () {
  return this._previousPanel;
};

/**
 * Clear the previous panel, to prevent infinite redirects to the previous panel.
 *
 * @public
 */

Auth0Lock.prototype._clearPreviousPanel = function () {
  this._setPreviousPanel(null);
};

/**
 * Private helpers
 */

/**
 * Add animate css class to shake `a0-panel`
 * on errorors... withing widget's `$container`
 * (by `context`) element...
 *
 * @param {NodeElement} context
 * @private
 */

function animation_shake(context) {
  $('.a0-panel', context)
    .addClass('a0-errors')
    .addClass('a0-animated a0-shake');
}

/**
 * Restore animate css classes stop shaking `a0-panel`
 * after errors reset... withing widget's `$container`
 * (by `context`) element...
 *
 * @param {NodeElement} context
 * @private
 */

function animation_shake_reset(context) {
  $('.a0-animated', context)
    .removeClass('a0-errors')
    .removeClass('a0-animated a0-shake');
}

/**
 * Parse and retrieve show parameters
 * and invoke callback after it
 *
 * @param {Object} options
 * @param {Function} callback
 * @private
 */

function getShowParams(options, callback) {
  var realOptions = options;
  var realCallback = callback;
  if (_.isFunction(options)) {
    realCallback = options;
    realOptions = {};
  }

  return {
    callback: realCallback,
    options: realOptions
  };
};
