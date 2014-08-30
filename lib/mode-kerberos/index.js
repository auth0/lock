/**
 * Module dependencies.
 */

var _ = require('underscore');
var $ = require('../bonzo-augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var template = require('./loggedin.ejs');
var buttonTmpl  = require('../html/zocial-button.ejs');
var stop = require('../stop-event');

/**
 * Expose KerberosPanel
 */

module.exports = KerberosPanel;

/**
 * Create `KerberosPanel`
 *
 * @param {Auth0Lock} widget
 * @param {Object} options
 * @constructor
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
  this.options = this.resolveOptions(options);
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

KerberosPanel.prototype = create(Emitter.prototype);

/**
 * Query for elements at `this.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */
KerberosPanel.prototype.query = function(selector) {
  if (!this.el) throw new Error('Can\'t get element since no `el` is set to local context');
  return $(selector, this.el);
};

/**
 * Create `el`
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
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
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
 */

KerberosPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
}

/**
 * Resolves login options passed to template
 *
 * @param {Object} options
 * @return {Object}
 * @private
 */

KerberosPanel.prototype.resolveOptions = function(options) {
  return _.extend({}, this.widget.options,  this.options, options);
};

/**
 * Bind events to `this.el`, like submit
 */
KerberosPanel.prototype.bindAll = function() {
  var self = this;
  var widget = this.widget;
  var options = this.options;

  var connection = widget.$ssoData.connection;
  //this could be ad or auth0-adldap
  var strategy_name = widget.$ssoData.strategy;
  var strategy = widget.$strategies[strategy_name];

  if (!strategy) return;

  this.query('form').a0_on('submit', function (e) {
    stop(e);
    widget._signInEnterprise(e);
  });

  var button = $.create(buttonTmpl({
    use_big_buttons: true,
    name: strategy_name,
    title: options.i18n.t('windowsAuthTitle').replace('{connection}', connection),
    css: strategy.css,
    imageicon: strategy.imageicon,
  }));

  this.query('.a0-last-time').html(options.i18n.t('signin:domainUserLabel'));

  this.query('.a0-strategy div').remove();

  this.query('.a0-strategy')
    .append(button);

  this.query('.a0-strategy .a0-zocial[data-strategy]').a0_on('click', function (e) {
    stop(e);
    widget._signinSocial(strategy_name, connection, null, self);
  });

  this.query('.a0-all').a0_on('click', function (e) {
    stop(e);
    // no need to check other panels since
    // no reset nor signup modes allow for
    // return user experience...
    widget._signinPanel(self.options);
  });
}
