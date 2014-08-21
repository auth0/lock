/**
 * Insert css when first loaded
 */

require('./lib/insert-css');

/**
 * Module dependencies.
 */

var bonzo = require('bonzo');
var _ = require('underscore');
var Auth0 = require('auth0-js');
var domready = require('domready');
var $ = require('./lib/bonzo-augmented');
var EventEmitter = require('events').EventEmitter;

var strategies = require('./lib/strategies');
var template = require('./lib/html/main.ejs');

var required = require('./lib/assert-required');
var regex = require('./lib/regex');
var email_parser = regex.email_parser;

var SigninPanel = require('./lib/mode-signin');
var SignupPanel = require('./lib/mode-signup');
var ResetPanel = require('./lib/mode-reset');
var LoggedinPanel = require('./lib/mode-loggedin');
var KerberosPanel = require('./lib/mode-kerberos');
var LoadingPanel = require('./lib/mode-loading');
var OptionsManager = require('./lib/options-manager');

//browser incompatibilities fixes
var placeholderSupported = require('./lib/supports-placeholder');
var has_animations = require('./lib/supports-animation');
var ocreate = require('./lib/object-create');
var stop = require('./lib/stop-event');
var utils = require('./lib/utils');
var trim = require('trim');
var bind = require('./lib/bind');

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
 *     - cdn
 *     - assetsUrl
 * @return {Auth0Lock}
 * @constructor
 */

function Auth0Lock (clientID, domain, options) {
  if (!(this instanceof Auth0Lock)) {
    return new Auth0Lock(options);
  }

  // validate required options
  if ('string' !== typeof clientID) throw new Error('`ClientID` required as first parameter.');
  if ('string' !== typeof domain) throw new Error('`domain` required as second parameter.');

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
    clientID:     this.$options.clientID,
    domain:       this.$options.domain
  });

  // use domain as assetsUrl if no assetsUrl provided
  // and domain is not *.auth0.com. Fallback to S3 url
  this.$options.assetsUrl = this.$options.assetsUrl || this.isAuth0Domain()
    ? 'https://s3.amazonaws.com/assets.auth0.com/'
    : 'https://' + this.$options.domain + '/';

  this.$options.cdn = this.$options.cdn || this.isAuth0Domain()
    ? 'https://d19p4zemcycm7a.cloudfront.net/w2/'
    : 'https://' + this.$options.domain + '/w2/';

  // Holds SSO Data for return user experience
  this.$ssoData = null;

  // Holds widget's DOM `$container` ref
  this.$container = null;

  // holds client's connections configuration
  // retrieved from S3 or CDN/assetsUrl provided
  this.$client = null;
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
  };

  // If not loading, check for already stored
  // in a previous widget instantiation
  global.window.Auth0 = global.window.Auth0 || { clients: [] };

  var clients = global.window.Auth0.clients;
  var client = clients[this.$options.clientID];
  if (client) return this.emit('client loaded', client);

  // check if loading state
  // and then await for response
  // no need to monkey-patch again
  if (this.loadState) return;
  this.loadState = true;

  // Monkey patch Auth.setClient to load client
  var setClient = global.window.Auth0.setClient || function setClient() {};
  global.window.Auth0.setClient = function (client) {
    setClient.apply(window.Auth0, arguments);

    // If not this client, return
    if (self.$options.clientID !== client.id) return;

    // store the client
    clients[self.$options.clientID] = client;

    // notify initialized and pass the client with it
    self.emit('client loaded', client);
  };

  // Load client from assets url
  var script = document.createElement('script');
  script.src = this.$options.assetsUrl
    + 'client/'
    + this.$options.clientID
    + '.js'
    + '?t'
    + (+new Date);

  // Insert script in DOM head
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
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
}

/**
 * Render widget container to DOM
 * XXX: consider renaming!
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype.insert = function() {
  if (this.$container) return this;

  var options = this.options;
  var cid = options.container;
  var locals = {
    options: options,
    alt_spinner: !has_animations()
      ? (this.$options.cdn + 'img/ajax-loader.gif')
      : null
  };

  // widget container
  if (cid) {
    this.$container = document.getElementById(cid);
    if (!this.$container) throw new Error('Not found element with \'id\' ' + cid);

    this.$container.innerHTML = this.render(template, locals);

  } else {
    this.$container = document.createElement('div');
    bonzo(this.$container).addClass('a0-lock-container');

    this.$container.innerHTML = this.render(template, locals);
    document.body.appendChild(this.$container);
  }

  return this;
}

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
  var opts = _.extend({ mode: 'signin' }, options);
  return this.display(opts, callback);
}

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
  var optional = { disableSignupAction: true, disableResetAction: true };
  var required = { mode: 'signin' };

  // merge and force `signin` mode
  var opts = _.extend(optional, options, required);
  return this.show.call(this, opts, callback);
}

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
  var optional = { disableSignupAction: true, disableResetAction: true };
  var required = { mode: 'signup' };

  // merge and force `signin` mode
  var opts = _.extend(optional, options, required);
  return this.show.call(this, opts, callback);
}

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
  var optional = { disableSignupAction: true, disableResetAction: true };
  var required = { mode: 'reset' };

  // merge and force `signin` mode
  var opts = _.extend(optional, options, required);
  return this.show.call(this, opts, callback);
}

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

  if ('function' === typeof callback) callback();
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
  var self = this;

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
    this.once(this.options.mode + ' ready', bind(this.focusInput, this))

    // resolve view
    if ('signin' === this.options.mode) {
      // if user in AD ip range
      if (this.$ssoData && this.$ssoData.connection) {
        return this._kerberosPanel(this.options, callback);
      }

      // if user logged in show logged in experience
      if (this.$ssoData && this.$ssoData.sso && !!this.options.rememberLastLogin) {
        return this._loggedinPanel(this.options, callback);
      }

      // otherwise, just show signin
      this._signinPanel(this.options, callback);
    };

    if ('signup' === this.options.mode) {
      this._signupPanel(this.options, callback);
    };

    if ('reset' === this.options.mode) {
      this._resetPanel(this.options, callback);
    };

  }

  return this;
}

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
  var i18n = options.i18n;

  // Wait for Auth0.setClient() to be sure
  // we have the client's configuration
  // before setting up
  if (_.isEmpty(this.$client)) {
    var args  = arguments;
    return this.getClientConfiguration(function () {
      self.initialize.apply(self, args);
    });
  }

  this.query('.a0-overlay')
    .toggleClass('a0-no-placeholder-support', !placeholderSupported);

  // buttons actions
  this.query('.a0-onestep a.a0-close').a0_on('click', bind(this.oncloseclick, this));

  // close popup with ESC key
  if (options.closable) {
    this.query('').a0_on('keyup', bind(this.onescpressed, this));
  };

  if (options._isFreeSubscription()) {
    // hide footer for non free/dev subscriptions
    this.query('.a0-footer').toggleClass('a0-hide', true);
    this.query('.a0-free-subscription').removeClass('a0-free-subscription');
  }

  // activate panel
  // XXX: (?) this I don't get... why remove and add?
  this.query('div.a0-panel').removeClass('a0-active');
  this.query('div.a0-overlay').addClass('a0-active');
  this.query('.a0-panel.a0-onestep').addClass('a0-active');

  if (!options.container) {
    bonzo(document.body).addClass('a0-lock-open');
  } else {
    this.query('.a0-active').removeClass('a0-overlay');
  }

  this.query('.a0-popup h1').html(i18n.t('signin:title'));
  this.query('.a0-popup .a0-invalid').removeClass('a0-invalid');

  this.query('.a0-panel.a0-onestep h1').html(options.title);

  // after pre-setting classes and dom handlers
  // emit as shown
  this.emit('shown');

  // show loading
  this._loadingPanel(options);

  function finish(err, ssoData) {
    // XXX: maybe we should parse the errors here.
    // Just a thought...
    self.$ssoData = ssoData;
    done();
    self.emit('ready');
  }

  // do not get SSO data on signup or reset modes
  var notSigninMode = ~['reset', 'signup'].indexOf(options.mode);
  if (notSigninMode) {
    return finish(null, {}), this;
  };

  var disabledReturnUserExperience = false === options.rememberLastLogin
    && (!options._isThereAnyADConnection() || false === options.enableADRealmDiscovery)

  if (disabledReturnUserExperience) {
    return finish(null, {}), this;
  };

  // get SSO data and then render
  this.$auth0.getSSOData(options._isThereAnyADConnection(), finish);

  return this;
}

/**
 * Create and set a new SigninPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._signinPanel = function (options) {
  var self = this;
  var panel = SigninPanel(this, { options: options || {} });

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

}

/**
 * Create and set a new SignupPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._signupPanel = function (options) {
  var self = this;
  var panel = SignupPanel(this, { options: options || {} });

  this._setTitle(this.options.i18n.t('signup:title'));

  this.setPanel(panel);

  return this;
}

/**
 * Create and set a new ResetPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._resetPanel = function (options) {
  var self = this;
  var panel = ResetPanel(this, { options: options || {} });

  this._setTitle(this.options.i18n.t('reset:title'));

  this.setPanel(panel);

  return this;
}

/**
 * Create and set a new LoadingPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._loadingPanel = function (options) {
  var self = this;
  var panel = LoadingPanel(this, { options: options || {} });

  if (options.title) {
    this._setTitle(this.options.i18n.t(options.title + ':title'));
  } else {
    this._setTitle(this.options.i18n.t((options.mode || 'signin') + ':title'));
  }

  this.setPanel(panel);

  if (options.message) {
    panel.query('').addClass('a0-with-message');
    panel.query('.a0-spin-message span').html(options.message.replace('-', ' '));
  };

  return this;
}

/**
 * Create and set a new LoggedinPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._loggedinPanel = function (options) {
  var self = this;
  var panel = LoggedinPanel(this, { options: options || {} });

  this._setTitle(this.options.i18n.t('signin:title'));

  this.setPanel(panel);

  return this;
}

/**
 * Create and set a new KerberosPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Lock}
 * @private
 */

Auth0Lock.prototype._kerberosPanel = function (options) {
  var self = this;
  var panel = KerberosPanel(this, { options: options || {} });

  this._setTitle(this.options.i18n.t('signin:title'));

  this.setPanel(panel);

  return this;
}

/**
 * Set `panel` to .a0-mode-container element and
 * emit it's `name` as ready
 *
 * @param {SigninPanel|SignupPanel|...} panel
 * @param {String} name
 * @private
 */

Auth0Lock.prototype.setPanel = function(panel, name) {
  var el = 'function' === typeof panel.render
    ? panel.render()
    : panel;
  var pname = 'function' === typeof panel.render
    ? panel.name
    : (name || 'signin');

  this.query('.a0-mode-container').html(el);
  this.emit('%s ready'.replace('%s', pname));
}


/**
 * Resolve whether instance `$options.domain` is an
 * Auth0's domain or not
 *
 * @return {Boolean}
 * @private
 */

Auth0Lock.prototype.isAuth0Domain = function () {
  var domainUrl = utils.parseUrl('https://' + this.$options.domain);
  return utils.endsWith(domainUrl.hostname, '.auth0.com');
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
    return animation_shake_reset(this.$container);;
  }

  // animation
  setTimeout(animation_shake, 0, this.$container);

  input
    .parent()
    .addClass('a0-error-input')

  if (!message) return;
  input.parent()
    .append($.create('<span class="a0-error-message">' + message + '</span>'));
};

/**
 * Set widget's h1 to `title`
 *
 * @param {String} title
 * @private
 */

Auth0Lock.prototype._setTitle = function(title) {
  this.query('h1').html(title).css('display', '');
};

/**
 * Signin entry point method for resolving
 * username and password connections or enterprise
 *
 * @param {SigninPanel|SignupPanel} panel
 * @private
 */

Auth0Lock.prototype._signin = function (panel) {
  var self = this;
  var valid = true;

  var emailD = panel.query('.a0-email');
  var email_input = panel.query('input[name=email]');
  var email_parsed = email_parser.exec(email_input.val().toLowerCase());

  var email = null, domain, connection, has_errors = false;

  var input_email_domain = email_parsed ? email_parsed.slice(-2)[0] : undefined;

  var conn_obj = _.chain(this.$client.strategies)
    .where({ userAndPass: undefined })
    .pluck('connections')
    .flatten()
    .findWhere({ domain: input_email_domain })
    .value();

  // Gets suffix
  if (!conn_obj) {
    if (this.options.auth0Strategies.length > 0) {
      return this._signinWithAuth0(panel);
    }

    if (input_email_domain === 'gmail.com') {
      return this._signinSocial('google-oauth2', null, null, panel);
    }

    var message = this.options.i18n.t('signin:strategyDomainInvalid');
    message = message.replace('{domain}', input_email_domain);

    this._showError(message);
    this._focusError(email_input);

    return;
  };

  domain = conn_obj.domain;
  email = email_input.val();
  connection = conn_obj.name;

  valid &= (!domain && !emailD.addClass('a0-invalid')) || (!!domain && !!emailD.removeClass('a0-invalid'));

  // XXX: We should throw something here...
  // There has to be an action!
  if (!valid) return;

  if (this.options.popup && this.options.callbackOnLocationHash) {
    return this._signinPopupNoRedirect(connection, this.options.popupCallback, panel);
  }

  var message = this.options.i18n.t('signin:loadingMessage').replace('{connection}', connection);
  this._loadingPanel({ mode: 'signin', message: message });

  var loginOptions = _.extend({}, {
    connection: connection,
    popup: this.options.popup,
    popupOptions: this.options.popupOptions
  }, this.options.extraParameters);

  this.$auth0.login(loginOptions);
};

/**
 * Signin method for username and password credentials
 *
 * @param {SigninPanel|SignupPanel} panel
 * @private
 */

Auth0Lock.prototype._signinWithAuth0 = function (panel) {
  var self = this;
  var options = this.options;
  var email_input = panel.query('input[name=email]');
  var password_input = panel.query('input[name=password]');
  var username = email_input.val();
  var password = password_input.val();
  var connection  = options._getAuth0Connection(username);

  var loginOptions = {
    connection: connection.name,
    username: connection.domain
      ? username.replace('@' + connection.domain, '')
      : username,
    password: password,
    popup: self.options.popup,
    popupOptions: self.options.popupOptions
  };

  // We might be loosing some instance parameters here
  // XXX: An options method to get $auth0 login options
  // resolved from existing options combined with instance
  // may be a good idea...
  loginOptions = _.extend({}, loginOptions, this.options.extraParameters);

  var strategy = options._getClientStrategyByConnectionName(connection.name) || {};

  // Clean error container
  this._showError();
  this._focusError();

  if (this.options.popup) {
    // popup without sso = no redirect (ajax, not setting cookie)
    if (!this.options.sso) {
      return this._signinPopupNoRedirect(connection.name, this.options.popupCallback, loginOptions, panel);
    }

    // popup + sso = redirect
    // XXX: This call to $auth0.signin is exact the same as the last one
    // in this code's flow...
    // Why call this here? I mean, Why the extra code flow?
    // No options are tweaked in betweeen...
    return this.$auth0.login(loginOptions, function (err) {
      if (!err) return;

      // display `panel`
      self.setPanel(panel);

      // display errors
      self._focusError(email_input);
      self._focusError(password_input);

      if (err.status !== 401) {
        self._showError(err.message || self.options.i18n.t('signin:serverErrorText'));
      } else {
        self._showError(self.options.i18n.t('signin:wrongEmailPasswordErrorText'));
      }
    });

  }

  // TODO: Handle sso case without popup
  var message = strategy.name !== 'auth0' // dont show loading message for dbConnections
    ? this.options.i18n.t('signin:loadingMessage').replace('{connection}', connection.name)
    : '';


  this._loadingPanel({ mode: 'signin', message: message });

  this.$auth0.login(loginOptions, function (err) {
    if (!err) return;

    // display `panel`
    self.setPanel(panel);

    // display errors
    self._focusError(email_input);
    self._focusError(password_input);

    if (err.status !== 401) {
      self._showError(err.message || self.options.i18n.t('signin:serverErrorText'));
    } else {
      self._showError(self.options.i18n.t('signin:wrongEmailPasswordErrorText'));
    }
  });
};

/**
 * Signin method for social connections
 *
 * @param {Event|String} e
 * @param {String} connection
 * @param {Object} extraParameters
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

  // use extraParameters
  var extra = self.options.extraParameters;

  if (extra.connection_scopes) {
    // if no connection_scope was set for the connection we are ok with sending undefined
    extra.connection_scope = extra.connection_scopes[connectionName];
  }

  if (strategy) {
    // If we are in popup mode and callbackOnLocationHash was specified
    // we need to pass a callback.
    if (self.options.popup && self.options.callbackOnLocationHash) {
      this._signinPopupNoRedirect(connectionName, self.options.popupCallback, extraParams, panel);
    } else {
      var loginOptions = _.extend({}, {
        connection: connectionName,
        popup: self.options.popup,
        popupOptions: self.options.popupOptions
      }, self.options.extraParameters, extraParams);

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
 * @param {Object} extraParameters
 * @param {SigninPanel|SignupPanel} panel
 * @private
 */

Auth0Lock.prototype._signinPopupNoRedirect = function (connectionName, popupCallback, extraParams, panel) {
  var self = this;
  var email_input = panel.query('input[name=email]');
  var password_input = panel.query('input[name=password]');
  var options = this.options;
  var callback = options.popupCallback;

  extraParams = extraParams || {};

  var loginOptions = _.extend({}, {
        connection: connectionName,
        popup: self.options.popup,
        popupOptions: self.options.popupOptions
      }, options.extraParameters, extraParams);

  if ('function' !== typeof callback) {
    throw new Error('Popup mode needs a callback function to be executed after authentication success or failure.');
  }

  // Clean error container
  this._showError();
  this._focusError();

  // set loading message
  var message = self.options.i18n.t('signin:popupCredentials');
  this._loadingPanel({ mode: 'signin', message: message });

  this.$auth0.login(loginOptions, function(err, profile, id_token, access_token, state) {
    var args = Array.prototype.slice.call(arguments, 0);
    if (!err) return callback.apply(self, args), self.hide();

    // XXX: Maybe check if panel.name === 'signin'?
    // In case called from signup-mode, I don't want to
    // display the signup form again, but the signin instead

    // display signin
    self.setPanel(panel);

    // render errors
    if (err.message === 'User closed the popup window') {
      // Closed window
      self._showError(self.options.i18n.t('signin:userClosedPopup'));

    } else if (err.message === 'access_denied') {
      // Permissions not granted
      self._showError(self.options.i18n.t('signin:userConsentFailed'));
    } else if (err.status !== 401) {
      self._showError(self.options.i18n.t('signin:serverErrorText'));
    } else {
      self._showError(self.options.i18n.t('signin:wrongEmailPasswordErrorText'));
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
  this.hide();
}

/**
 * Handle `e` when keypressed ESC
 *
 * @param {Event} e
 * @private
 */

Auth0Lock.prototype.onescpressed = function(e) {
  if ((e.which == 27 || e.keycode == 27)) this.hide();
}

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
}

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
