/**
 * Module dependencies.
 */

var _ = require('underscore');
var $ = require('../js/bonzo_augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var template = require('./loggedin.ejs');
var buttonTmpl  = require('../html/button.ejs');
var stop = require('../stop-event');

/**
 * Expose KerberosPanel
 */

module.exports = KerberosPanel;

/**
 * Create
 */

function KerberosPanel(widget, options) {
  if (!(this instanceof KerberosPanel)) {
    return new KerberosPanel(widget, options);
  };

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for KerberosPanel');
  }

  this.name = 'kerberos'
  this.widget = widget;
  this.options = options;
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

KerberosPanel.prototype = create(Emitter.prototype);

/**
 * Create `el`
 */

KerberosPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  var widget = this.widget;

  this.el = $.create(widget.render(template, opts))[0];
  this.bindAll();
  return this.el;
}

/**
 * Return `el` or create it
 */

KerberosPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
}

/**
 * Resolves login options passed to template
 */

KerberosPanel.prototype.resolveOptions = function(options) {
  var widget = this.widget;
  var widgetOptions = widget._options;
  var modeResolvedOptions = widget._signinOptions;

  return _.extend({}, widgetOptions, modeResolvedOptions,  this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 */

KerberosPanel.prototype.bindAll = function() {
  var self = this;
  var widget = this.widget;

  var connection = widget._ssoData.connection;
  //this could be ad or auth0-adldap
  var strategy_name = widget._ssoData.strategy;
  var strategy = widget._strategies[strategy_name];

  if (!strategy) return;

  this.query('form').a0_on('submit', function (e) {
    stop(e);
    widget._signInEnterprise(e);
  });

  var button = $.create(buttonTmpl({
    use_big_buttons: true,
    name: strategy_name,
    title: widget._dict.t('windowsAuthTitle').replace('{connection}', connection),
    css: strategy.css,
    imageicon: strategy.imageicon,
  }));

  this.query('.a0-last-time').html(widget._dict.t('signin:domainUserLabel'));

  this.query('.a0-strategy div').remove();

  this.query('.a0-strategy')
    .append(button);

  this.query('.a0-strategy .a0-zocial[data-strategy]').a0_on('click', function (e) {
    stop(e);
    widget._signinSocial(strategy_name, connection, null, self);
  });

  this.query('.a0-all', loginView).a0_on('click', function (e) {
    stop(e);
    widget._signinPanel(self.options);
  });
}

KerberosPanel.prototype.query = function(selector) {
  return $(selector, this.el);
}
