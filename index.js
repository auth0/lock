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
var EventEmitter = require('events').EventEmitter;

var strategies = require('./lib/strategies');
var mainTmpl = require('./lib/html/main.ejs');
var embTmpl = require('./lib/html/main_embedded.ejs');


var i18n = require('./i18n');

var regex = require('./lib/regex');
var email_parser = regex.email_parser;

var SigninPanel = require('./lib/mode-signin');
var SignupPanel = require('./lib/mode-signup');
var ResetPanel = require('./lib/mode-reset');
var LoggedinPanel = require('./lib/mode-loggedin');
var KerberosPanel = require('./lib/mode-kerberos');
var LoadingPanel = require('./lib/mode-loading');

var $ = require('./lib/bonzo-augmented');

//browser incompatibilities fixes
var is_small_screen = require('./lib/is-small-screen');
var placeholderSupported = require('./lib/supports-placeholder');
var has_animations = require('./lib/supports-animation');
var transition_end = require('./lib/transition-end');
var object_create = require('./lib/object-create');
var stop = require('./lib/stop-event');
var utils = require('./lib/utils');
var trim = require('trim');

/**
 * Expose `Auth0Widget` constructor
 */

module.exports = Auth0Widget;

/**
 * Create `Auth0Widget` instance
 * resolving `options`.
 *
 * @param {Object} options
 * @return {Auth0Widget}
 * @constructor
 */

function Auth0Widget (options) {
  if (!(this instanceof Auth0Widget)) {
    return new Auth0Widget(options);
  }

  this._dict = i18n.getDict(options.dict);

  this._locals = {
    i18n: this._dict
  };

  this._options = options;
  this._strategies = strategies;

  this._auth0 = new Auth0({
    clientID:     this._options.clientID,
    callbackURL:  this._options.callbackURL,
    domain:       this._options.domain,
    forceJSONP:   this._options.forceJSONP,
    callbackOnLocationHash: this._options.callbackOnLocationHash
  });

  if (!this._options.assetsUrl) {
    // use domain as assetsUrl if domain is not *.auth0.com
    this._options.assetsUrl = this._isAuth0Domain() ?
      'https://s3.amazonaws.com/assets.auth0.com/' :
      'https://' + this._options.domain + '/';
  }

  if (!this._options.cdn) {
    // use domain as cdn if domain is not *.auth0.com
    this._options.cdn = this._isAuth0Domain() ?
      'https://d19p4zemcycm7a.cloudfront.net/w2/' :
      'https://' + this._options.domain + '/w2/';
  }

  this._getApp();

  EventEmitter.call(this);
}

/**
 * Expose current `Auth0Widget`'s version
 */

Auth0Widget.version = require('package.version');

/**
 * Inherit from `EventEmitter`
 */

Auth0Widget.prototype = object_create(EventEmitter.prototype);

/**
 * Query for elements by `selector` within optional `context`.
 * Last defaults to widget's instance `_container`.
 *
 * @param {String} selector
 * @param {NodeElement} context
 * @return {BonzoAugmented}
 * @public
 */

Auth0Widget.prototype.query = function(selector, context) {
  if ('string' === typeof selector) {
    return $(selector, context || this._container);
  }
  return $('#a0-widget', selector || this._container);
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

Auth0Widget.prototype.render = function(tmpl, locals) {
  var _locals = _.extend({}, this._locals, locals);
  return tmpl(_locals);
}

/**
 * Get client configuration.
 * XXX: Why not use jsonp? that woudld allow the
 * global namespace definition to be optional...
 *
 * @return {Auth0Widget}
 * @private
 */

Auth0Widget.prototype._getApp = function () {
  var self = this;
  global.window.Auth0 = global.window.Auth0 || {};
  global.window.Auth0.setClient = function (client) {
    self._client = client;
    self.emit('client initialized', client);
  };

  var script = document.createElement('script');
  script.src = this._options.assetsUrl +
               'client/' + this._options.clientID + '.js' +
               '?t' + (+new Date); //Date.now() doesnt work on ie.

  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);

  return this;
};

/**
 * Show the widget resolving `options`
 * with default mode as 'signin'
 *
 * @param {Object} options
 * @param {Function} callback
 * @return {Auth0Widget}
 * @public
 */

Auth0Widget.prototype.show = function(options, callback) {
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
 * @return {Auth0Widget}
 * @public
 */

Auth0Widget.prototype.showSignin = function(options, callback) {
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
 * @return {Auth0Widget}
 * @public
 */

Auth0Widget.prototype.showSignup = function(options, callback) {
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
 * @return {Auth0Widget}
 * @public
 */

Auth0Widget.prototype.showReset = function(options, callback) {
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
 * @return {Auth0Widget}
 * @public
 */

Auth0Widget.prototype.hide = function (callback) {
  var self = this;
  this.query('div.a0-overlay').removeClass('a0-active');

  this.query().css('display', 'none');
  bonzo(document.body).removeClass('a0-widget-open');

  if (this._container && this.displayOptions.container) {
    // remove `#a0-widget`
    this.query().remove();
  } else if(this._container) {
    // remove `.a0-widget-container`
    this.query().parent('.a0-widget-container').remove();
  }

  this._container = null;

  if ('function' === typeof callback) callback();
  this.emit('hidden');

  return this;
};

/**
 * Proxy `auth0.js` instance `.logout()` method
 *
 * @param {Object} query
 * @return {Auth0Widget}
 * @public
 */

Auth0Widget.prototype.logout = function (query) {
  this._auth0.logout(query);
  return this;
};

/**
 * Display the widget in "signin" or "signup"
 * or "reset" mode, resolved from display `options`.
 * Optionaly set "popupCallback" to `callback` if present
 *
 * @param {Object} options
 * @param {Function} callback
 * @return {Auth0Widget}
 * @private
 */

Auth0Widget.prototype.display = function(options, callback) {

  this.displayOptions = _.extend({ popupCallback: callback }, this._options, options);

  // here we tweak general display options
  // like allowing SSO and stuff
  var params = [ 'state', 'access_token', 'scope', 'protocol', 'device','request_id', 'connection_scopes', 'nonce' ];
  var extra = utils.extract(this.displayOptions, params);

  this.displayOptions.extraParameters = _.extend({}, extra, this.displayOptions.extraParameters);

  // this will evaluate options and render `Auth0Widget`'s container
  var self = this;

  this.initialize(oninitialized);

  function oninitialized() {
    if ('signin' === options.mode) {
      // if user in AD ip range
      if (self._ssoData && self._ssoData.connection) {
        return self._kerberosPanel(options, callback);
      }

      // if user logged in show logged in experience
      if (self._ssoData && self._ssoData.sso && !!self.displayOptions.enableReturnUserExperience) {
        return self._loggedinPanel(options, callback);
      }

      // otherwise, just show signin
      self._signinPanel(options, callback);
    };

    if ('signup' === options.mode) {
      self._signupPanel(options, callback);
    };

    if ('reset' === options.mode) {
      self._resetPanel(options, callback);
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
 * @return {Auth0Widget}
 * @private
 */

Auth0Widget.prototype.initialize = function(done) {
  var self = this;

  this.renderContainer();

  if (!placeholderSupported) {
    this.query('.a0-overlay').addClass('a0-no-placeholder-support');
  }

  if (!this.displayOptions.container) {
    bonzo(document.body).addClass('a0-widget-open');
  }

  // wait for setClient()
  if (!self._client) {
    var args  = arguments;
    var setClient = global.window.Auth0.setClient;

    global.window.Auth0.setClient = function () {
      setClient.apply(this, arguments);
      self.initialize.apply(self, args);
    };

    return;
  }

  // buttons actions
  this.query('.a0-onestep a.a0-close').a0_on('click', function (e) {
    stop(e);
    self.hide();
  });

  // close popup with ESC key
  if (!self.displayOptions.standalone) {
    this.query('').a0_on('keyup', function (e) {
      if ((e.which == 27 || e.keycode == 27)) self.hide();
    });
  };

  if (self._client.subscription && !~['free', 'dev'].indexOf(self._client.subscription)) {
    // hide footer for non free/dev subscriptions
    this.query('.a0-footer').toggleClass('a0-hide', true);
    this.query('.a0-free-subscription').removeClass('a0-free-subscription');
  }

  // labels text
  var options = this.displayOptions =  _.extend({}, this.displayOptions, this.displayOptions.resources);
  options['showEmail'] = typeof options['showEmail'] !== 'undefined' ? options['showEmail'] : true;
  options['showPassword'] = typeof options['showPassword'] !== 'undefined' ? options['showPassword'] : true;
  options['enableReturnUserExperience'] = typeof options['enableReturnUserExperience'] !== 'undefined' ? options['enableReturnUserExperience'] : true;
  options['enableADRealmDiscovery'] = typeof options['enableADRealmDiscovery'] !== 'undefined' ? options['enableADRealmDiscovery'] : true;

  // activate panel
  // XXX: (?) this I don't get... why remove and add?
  this.query('div.a0-panel').removeClass('a0-active');
  this.query('div.a0-overlay').addClass('a0-active');
  this.query('div.a0-panel.a0-onestep').addClass('a0-active');

  if (self.displayOptions.container) {
    this.query('div.a0-active').removeClass('a0-overlay');
  }

  this.query('.a0-popup h1').html(this._dict.t('signin:title'));
  this.query('.a0-popup .a0-invalid').removeClass('a0-invalid');

  this.query('div.a0-panel.a0-onestep h1').html(this.displayOptions['title']);

  // after pre-setting classes and dom handlers
  // emit as shown
  this.emit('shown');

  // then, continue setting up the mode
  if (self.displayOptions.connections) {
    self._client.strategies = _.chain(self._client.strategies)
      .map(function (s) {
        s.connections = _.filter(s.connections, function (c) {
          return _.contains(self.displayOptions.connections, c.name);
        });
        return s;
      })
      .filter(function (s) {
        return s.connections.length > 0;
      })
      .value();
  }


  // merge strategies info
  for (var s = 0; s < self._client.strategies.length; s++) {
    var strategy_name = self._client.strategies[s].name;
    self._client.strategies[s] = _.extend({}, self._client.strategies[s], self._strategies[strategy_name]);
  }

  self._auth0Strategies = _.chain(self._client.strategies)
    .filter(function (s) { return s.userAndPass && s.connections.length > 0; })
    .value();

  var auth0Conn = this._getAuth0Connection() || {};
  if (this.displayOptions.mode === 'signup' && !auth0Conn.showSignup) this.displayOptions.mode = 'signin';
  if (this.displayOptions.mode === 'reset' && !auth0Conn.showForgot) this.displayOptions.mode = 'signin';

  // show loading
  this._loadingPanel(self.displayOptions);

  var is_any_ad = _.some(self._client.strategies, function (s) {
    return (s.name === 'ad' || s.name === 'auth0-adldap') && s.connections.length > 0;
  });

  function finish(err, ssoData) {
    // XXX: maybe we should parse the errors here.
    // Just a thought...
    self._ssoData = ssoData;
    done();
    self.emit('ready');
  }

  // do not get SSO data on signup or reset modes
  if (~['reset', 'signup'].indexOf(this.displayOptions.mode)) {
    return finish(null, {}), this;
  };

  if (false === this.displayOptions.enableReturnUserExperience && (!is_any_ad || this.displayOptions.enableADRealmDiscovery === false)) {
    return finish(null, {}), this;
  };

  // get SSO data and then render
  self._auth0.getSSOData(is_any_ad, finish);

  return this;
}

/**
 * Create and set a new SigninPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Widget}
 * @private
 */

Auth0Widget.prototype._signinPanel = function (options) {
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

  this._setTitle(this._dict.t('signin:title'));

  this.setPanel(panel);

  return this;

}

/**
 * Create and set a new SignupPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Widget}
 * @private
 */

Auth0Widget.prototype._signupPanel = function (options) {
  var self = this;
  var panel = SignupPanel(this, { options: options || {} });

  this._setTitle(this._dict.t('signup:title'));

  this.setPanel(panel);

  return this;
}

/**
 * Create and set a new ResetPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Widget}
 * @private
 */

Auth0Widget.prototype._resetPanel = function (options) {
  var self = this;
  var panel = ResetPanel(this, { options: options || {} });

  this._setTitle(this._dict.t('reset:title'));

  this.setPanel(panel);

  return this;
}

/**
 * Create and set a new LoadingPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Widget}
 * @private
 */

Auth0Widget.prototype._loadingPanel = function (options) {
  var self = this;
  var panel = LoadingPanel(this, { options: options || {} });

  if (options.title) {
    this._setTitle(this._dict.t(options.title + ':title'));
  } else {
    this._setTitle(this._dict.t((options.mode || 'signin') + ':title'));
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
 * @return {Auth0Widget}
 * @private
 */

Auth0Widget.prototype._loggedinPanel = function (options) {
  var self = this;
  var panel = LoggedinPanel(this, { options: options || {} });

  this._setTitle(this._dict.t('signin:title'));

  this.setPanel(panel);

  return this;
}

/**
 * Create and set a new KerberosPanel with
 * `options`, and also set widget's title
 *
 * @param {Object} options
 * @return {Auth0Widget}
 * @private
 */

Auth0Widget.prototype._kerberosPanel = function (options) {
  var self = this;
  var panel = KerberosPanel(this, { options: options || {} });

  this._setTitle(this._dict.t('signin:title'));

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

Auth0Widget.prototype.setPanel = function(panel, name) {
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
 * Render widget container to DOM
 * XXX: consider renaming!
 *
 * @return {Auth0Widget}
 * @private
 */

Auth0Widget.prototype.renderContainer = function() {
  if (this._container) return this;

  var cid = this.displayOptions.container;

  // widget container
  if (cid) {
    this.displayOptions.theme = 'static';
    this.displayOptions.standalone = true;
    this.displayOptions.top = true;

    this._container = document.getElementById(cid);
    if (!this._container) throw new Error('Not found element with \'id\' ' + cid);

    this._container.innerHTML = this._getEmbededTemplate();

  } else {
    this._container = document.createElement('div');
    bonzo(this._container).addClass('a0-widget-container');

    var locals = {
      options: this.displayOptions,
      alt_spinner: !has_animations()
        ? (this.displayOptions.cdn + 'img/ajax-loader.gif')
        : null
    };

    this._container.innerHTML = this.render(mainTmpl, locals);
    document.body.appendChild(this._container);
  }

  return this;
}

/**
 * Resolve whether instance `_options.domain` is an
 * Auth0's domain or not
 *
 * @return {Boolean}
 * @private
 */

Auth0Widget.prototype._isAuth0Domain = function () {
  var domainUrl = utils.parseUrl('https://' + this._options.domain);
  return utils.endsWith(domainUrl.hostname, '.auth0.com');
};

/**
 * Resolve whether ignore or not `inputs` email validation
 *
 * @param {NodeElement} input
 * @return {Boolean}
 * @private
 */

Auth0Widget.prototype._ignoreEmailValidations = function (input) {
  return input.attr('type') !== 'email';
};

/**
 * Set custom validity to `input` with `message`
 * XXX: We should disable this since it's not x-browser
 * and support our own massage tip component
 *
 * @param {NodeElement} input
 * @param {String} message
 * @private
 */
Auth0Widget.prototype._setCustomValidity = function (input, message) {
  if (!input) return;
  if (input.setCustomValidity) {
    input.setCustomValidity(message);
  }
  // TODO: support setCustomValidity in IE9
};

/**
 * Set an error `message` or clean element.
 *
 * @param {String} message
 * @private
 */

Auth0Widget.prototype._showError = function (message) {

  // if no error, clean
  if (!message) {
    // reset errors
    this.query('.a0-error').html('').addClass('a0-hide');
    this.query('.a0-errors').removeClass('a0-errors');
    // reset animations
    return animation_shake_reset(this._container);
  }

  // else, show and render error message
  setTimeout(animation_shake, 0, this._container);

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

Auth0Widget.prototype._showSuccess = function (message) {
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

Auth0Widget.prototype._focusError = function(input, message) {
  // remove all `_focusError` resources
  if (!arguments.length) {
    // reset errors
    this.query('.a0-errors').removeClass('a0-errors');
    this.query('.a0-error-input').removeClass('a0-error-input');
    this.query('.a0-error-message').remove();
    // reset animations
    return animation_shake_reset(this._container);;
  }

  // animation
  setTimeout(animation_shake, 0, this._container);

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

Auth0Widget.prototype._setTitle = function(title) {
  this.query('h1').html(title).css('display', '');
};

/**
 * Resolve whether are there or not any
 * social connections within client
 * strategies
 *
 * @return {Boolean}
 * @private
 */

Auth0Widget.prototype._areThereAnySocialConn = function () {
  return !!_.findWhere(this._client.strategies, {social: true});
};

/**
 * Resolve whether are there or not any
 * enterprise or Databse connection within
 * client strategies
 *
 * @return {Boolean}
 * @private
 */

Auth0Widget.prototype._areThereAnyEnterpriseOrDbConn = function() {
  return !!_.findWhere(this._client.strategies, {social: false});
};

/**
 * Resolve whether are there or not any
 * database connection within client strategies
 *
 * @return {Boolean}
 * @private
 */

Auth0Widget.prototype._areThereAnyDbConn = function() {
  return !!_.findWhere(this._client.strategies, {userAndPass: true});
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

Auth0Widget.prototype._isEnterpriseConnection = function (email, output) {
  var emailM = email_parser.exec(email.toLowerCase());

  if (!emailM) return false;

  var email_domain = emailM.slice(-2)[0];

  var conn = _.chain(this._client.strategies)
              .where({userAndPass: undefined})
              .pluck('connections')
              .flatten()
              .findWhere({domain: email_domain})
              .value();

  if (conn && output) {
    output.domain = conn.domain;
  }

  return !!conn;
};

/**
 * Get configured client strategy by strategy `name`
 *
 * @param {String} name
 * @return {Object}
 * @private
 */

Auth0Widget.prototype._getClientStrategyByName = function (name) {
  return _.findWhere(this._client.strategies, { name: name });
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

Auth0Widget.prototype._getClientStrategyByConnectionName = function (connName) {
  return _.chain(this._client.strategies)
    .filter(function (s) {
      return _.findWhere(s.connections, { name: connName });
    }).value()[0];
};

/**
 * Get resolved Auth0 connection to signin by `userName`
 * XXX: No idea what logic this follows...
 *
 * @param {String} userName
 * @return {Object}
 * @private
 */

Auth0Widget.prototype._getAuth0Connection = function(userName) {
  // if specified, use it, otherwise return first
  if (this.displayOptions['userPwdConnectionName']) {
    return _.chain(this._auth0Strategies)
            .pluck('connections')
            .flatten()
            .findWhere({ name: this.displayOptions['userPwdConnectionName'] })
            .value();
  }

  var domain = userName && ~userName.indexOf('@') ? userName.split('@')[1] : '';

  if (userName && domain && this._client.strategies) {
    //there is still a chance that the connection might be
    //adldap and with domain
    var conn = _.chain(this._client.strategies)
                .pluck('connections')
                .flatten()
                .findWhere({domain: domain})
                .value();
    if (conn) {
      return conn;
    }
  }

  // By default, if exists, return auth0 connection (db-conn) or first
  var defaultStrategy = _.findWhere(this._auth0Strategies, { name: 'auth0' });
  defaultStrategy = defaultStrategy || (this._auth0Strategies.length > 0 ? this._auth0Strategies[0] : null);

  return defaultStrategy && defaultStrategy.connections.length > 0 ?
         defaultStrategy.connections[0] : null;
};

/**
 * Show or hide password input for `SigninPanel` resolved
 * by if it's or it's not an enterprise connection
 * XXX: This should be moved to `SigninPanel` view
 *
 * @private
 */

Auth0Widget.prototype._showOrHidePassword = function () {
  var mailField = this.query('.a0-notloggedin .a0-email input');
  var pwdField  = this.query('.a0-notloggedin .a0-password input').first();

  var isEnterpriseConnection = this._isEnterpriseConnection(mailField.val() || '');

  if (isEnterpriseConnection) {
    pwdField.attr('disabled', true);
    // pwdField.removeAttr('required');
  } else {
    pwdField.removeAttr('disabled');
    // pwdField.attr('required', true);
  }
};

/**
 * Get Loggedin auth parameters from `strategy` and `ssoData`
 *
 * @param {String} strategy
 * @param {Object} ssoData
 * @return {Object}
 * @private
 */

Auth0Widget.prototype._getLoggedInAuthParams = function (strategy, ssoData) {
  switch (strategy) {
    case 'google-oauth2':
      return { login_hint: ssoData.lastUsedUsername };
    default:
      return {};
  }
};

/**
 * Signin entry point method for resolving
 * username and password connections or enterprise
 *
 * @param {SigninPanel|SignupPanel} panel
 * @private
 */

Auth0Widget.prototype._signin = function (panel) {
  var self = this;
  var valid = true;

  var emailD = panel.query('.a0-email');
  var password_input = panel.query('input[name=password]');
  var password_empty = regex.empty.test(password_input.val());
  var password_disabled = password_input.attr('disabled');
  var password_required = self.displayOptions.showEmail && self.displayOptions.showPassword && self._areThereAnyDbConn();
  var email_input = panel.query('input[name=email]');
  var email_parsed = email_parser.exec(email_input.val().toLowerCase());
  var email_empty = regex.empty.test(email_input.val());
  var email = null, domain, connection, has_errors = false;

  // Clean error container
  this._showError();
  this._focusError();

  if (email_empty) {
    this._focusError(email_input);
    has_errors = true;
  }

  if (!this._ignoreEmailValidations(email_input)) {
    if (!email_parsed && !email_empty) {
      this._focusError(email_input, this._dict.t('invalid'));
      has_errors = true;
    }
  }

  if (password_empty && password_required && !password_disabled) {
    this._focusError(password_input);
    has_errors = true;
  };

  if (has_errors) return;

  var input_email_domain = email_parsed ? email_parsed.slice(-2)[0] : undefined;

  var conn_obj = _.chain(this._client.strategies)
    .where({ userAndPass: undefined })
    .pluck('connections')
    .flatten()
    .findWhere({ domain: input_email_domain })
    .value();

  // Gets suffix
  if (!conn_obj) {
    if (this._auth0Strategies.length > 0) {
      return this._signinWithAuth0(panel);
    }

    if (input_email_domain === 'gmail.com') {
      return this._signinSocial('google-oauth2', null, null, panel);
    }

    var message = this._dict.t('signin:strategyDomainInvalid');
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

  if (this.displayOptions.popup && this._options.callbackOnLocationHash) {
    return this._signinPopupNoRedirect(connection, this.displayOptions.popupCallback, panel);
  }

  var message = this._dict.t('signin:loadingMessage').replace('{connection}', connection);
  this._loadingPanel({ mode: 'signin', message: message });

  var loginOptions = _.extend({}, {
    connection: connection,
    popup: this.displayOptions.popup,
    popupOptions: this.displayOptions.popupOptions
  }, this.displayOptions.extraParameters);

  this._auth0.login(loginOptions);
};

/**
 * Signin method for username and password credentials
 *
 * @param {SigninPanel|SignupPanel} panel
 * @private
 */

Auth0Widget.prototype._signinWithAuth0 = function (panel) {
  var self = this;
  var email_input = panel.query('input[name=email]');
  var password_input = panel.query('input[name=password]');
  var username = email_input.val();
  var password = password_input.val();
  var connection  = this._getAuth0Connection(username);

  var loginOptions = {
    connection: connection.name,
    username: connection.domain
      ? username.replace('@' + connection.domain, '')
      : username,
    password: password,
    popup: self.displayOptions.popup,
    popupOptions: self.displayOptions.popupOptions
  };

  loginOptions = _.extend({}, loginOptions, self.displayOptions.extraParameters);

  var strategy = this._getClientStrategyByConnectionName(connection.name) || {};

  // Clean error container
  this._showError();
  this._focusError();

  if (this.displayOptions.popup) {
    // popup without sso = no redirect (ajax, not setting cookie)
    if (!this.displayOptions.sso) {
      return this._signinPopupNoRedirect(connection.name, self.displayOptions.popupCallback, loginOptions, panel);
    }

    // popup + sso = redirect
    return this._auth0.login(loginOptions, function (err) {
      if (!err) return;

      // XXX: Maybe check if panel.name === 'signin'?
      // In case called from signup-mode, I don't want to
      // display the signup form again, but the signin instead

      // display signin
      self.setPanel(panel);

      // display errors
      self._focusError(email_input);
      self._focusError(password_input);

      if (err.status !== 401) {
        self._showError(err.message || self._dict.t('signin:serverErrorText'));
      } else {
        self._showError(self._dict.t('signin:wrongEmailPasswordErrorText'));
      }
    });

  }

  // TODO: Handle sso case without popup
  var message = strategy.name !== 'auth0' // dont show loading message for dbConnections
    ? self._dict.t('signin:loadingMessage').replace('{connection}', connection.name)
    : '';


  this._loadingPanel({ mode: 'signin', message: message });

  self._auth0.login(loginOptions, function (err) {
    if (!err) return;

    // XXX: Maybe check if panel.name === 'signin'?
    // In case called from signup-mode, I don't want to
    // display the signup form again, but the signin instead

    // display signin
    self.setPanel(panel);

    // display errors
    self._focusError(email_input);
    self._focusError(password_input);

    if (err.status !== 401) {
      self._showError(err.message || self._dict.t('signin:serverErrorText'));
    } else {
      self._showError(self._dict.t('signin:wrongEmailPasswordErrorText'));
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

Auth0Widget.prototype._signinSocial = function (e, connection, extraParams, panel) {
  var target = e.currentTarget || e.delegateTarget || e.target || e;
  var self = this;
  var strategyName = typeof target === 'string' ? target : target.getAttribute('data-strategy');
  var strategy = this._getClientStrategyByName(strategyName);

  var connectionName = connection || strategy.connections[0].name;
  // use extraParameters because it is used in all branches to set loginOptions
  var extra = self.displayOptions.extraParameters;

  if (extra.connection_scopes) {
    // if no connection_scope was set for the connection we are ok with sending undefined
    extra.connection_scope = extra.connection_scopes[connectionName];
  }

  if (strategy) {
    // If we are in popup mode and callbackOnLocationHash was specified
    // we need to pass a callback.
    if (self.displayOptions.popup && self._options.callbackOnLocationHash) {
      this._signinPopupNoRedirect(connectionName, self.displayOptions.popupCallback, extraParams, panel);
    } else {
      var loginOptions = _.extend({}, {
        connection: connectionName,
        popup: self.displayOptions.popup,
        popupOptions: self.displayOptions.popupOptions
      }, self.displayOptions.extraParameters, extraParams);

      this._auth0.login(loginOptions);
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

Auth0Widget.prototype._signinPopupNoRedirect = function (connectionName, popupCallback, extraParams, panel) {
  var self = this;
  var email_input = panel.query('input[name=email]');
  var password_input = panel.query('input[name=password]');
  var displayOptions = this.displayOptions;
  var callback = displayOptions.popupCallback;

  extraParams = extraParams || {};

  var loginOptions = _.extend({}, {
        connection: connectionName,
        popup: self.displayOptions.popup,
        popupOptions: self.displayOptions.popupOptions
      }, displayOptions.extraParameters, extraParams);

  if ('function' !== typeof callback) {
    throw new Error('Popup mode needs a callback function to be executed after authentication success or failure.');
  }

  // Clean error container
  this._showError();
  this._focusError();

  // set loading message
  var message = self._dict.t('signin:popupCredentials');
  this._loadingPanel({ mode: 'signin', message: message });

  this._auth0.login(loginOptions, function(err, profile, id_token, access_token, state) {
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
      self._showError(self._dict.t('signin:userClosedPopup'));

    } else if (err.message === 'access_denied') {
      // Permissions not granted
      self._showError(self._dict.t('signin:userConsentFailed'));
    } else if (err.status !== 401) {
      self._showError(self._dict.t('signin:serverErrorText'));
    } else {
      self._showError(self._dict.t('signin:wrongEmailPasswordErrorText'));
      self._focusError(email_input);
      self._focusError(password_input);
    }

    return callback.apply(null, args);
  });
};

/**
 * Get DOM embeded compiled template resolved by `displayOptions`
 *
 * @return {NodeElement}
 * @public
 */

Auth0Widget.prototype._getEmbededTemplate = function () {
  var options = this.displayOptions;

  var locals = {
      options: options,
      alt_spinner:  !has_animations() ? (options.cdn + 'img/ajax-loader.gif') : null
  };

  return options.chrome
    ? this.render(mainTmpl, _.extend(locals, { expand: true })) // cover the entire container
    : this.render(embTmpl, _.extend(locals, { embedded: true }))
};

/**
 * Get `auth0.js` instance client
 *
 * @return {Auth0}
 * @public
 */

Auth0Widget.prototype.getClient = function () {
  return this._auth0;
};

/**
 * Proxy `auth0.js` instance to `parseHash`
 *
 * @param {String} hash
 * @return {Object|Error}
 * @public
 */

Auth0Widget.prototype.parseHash = function (hash) {
  return this._auth0.parseHash(hash);
};

/**
 * Proxy `auth0.js` instance to `getProfile`
 *
 * @param {String} token
 * @param {Function} callback
 * @return {Auth0Widget}
 * @public
 */

Auth0Widget.prototype.getProfile = function (token, callback) {
  this._auth0.getProfile(token, callback);
  return this;
};

/**
 * Private helpers
 */

/**
 * Prevent errors if the script is placed on the <head>
 * and there is no body yet loaded
 *
 * XXX: Could this be called with `domready` core dependency?
 *
 * @param {NodeElement} el
 * @private
 */

function hasTransitions (el) {
  return require('has-transitions')(el);
}

/**
 * Set focus on `el` if supported
 * but avoid mobie media screens
 *
 * @param {NodeElement} el
 * @private
 */

function setfocus (el) {
  if (is_small_screen()) return;
  try{ el.focus(); } catch(er) {}
}

/**
 * Add animate css class to shake `a0-panel`
 * on errorors... withing widget's `_container`
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
 * after errors reset... withing widget's `_container`
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
