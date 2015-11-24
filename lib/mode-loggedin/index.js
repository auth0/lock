/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var template = require('./loggedin.ejs');
var loggedinBtnTmpl = require('./loggedin_button.ejs');
var stop = require('../stop-event');
var _ = require('underscore');
var $ = require('../bonzo-augmented');
var gravatar = require('../gravatar');

/**
 * Expose LoggedinPanel
 */

module.exports = LoggedinPanel;

/**
 * Create `LoggedinPanel`
 *
 * @param {Auth0Lock} widget
 * @param {Object} options
 * @constructor
 */

function LoggedinPanel(widget, options) {
  if (!(this instanceof LoggedinPanel)) {
    return new LoggedinPanel(widget, options);
  }

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for LoggedinPanel');
  }

  this.name = 'loggedin';
  this.widget = widget;
  this.options = this.resolveOptions(options);
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

LoggedinPanel.prototype = create(Emitter.prototype);

/**
 * Query for elements at `this.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */

LoggedinPanel.prototype.query = function(selector) {
  if (!this.el) { throw new Error('Can\'t get element since no `el` is set to local context'); }
  return $(selector, this.el);
};

/**
 * Create `el`
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
 */

LoggedinPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  var widget = this.widget;

  this.el = $.create(widget.render(template, opts))[0];
  this.bindAll();
  return this.el;
};

/**
 * Return `el` or create it
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
 */

LoggedinPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
};

/**
 * Resolves login options passed to template
 *
 * @param {Object} options
 * @return {Object}
 * @private
 */

LoggedinPanel.prototype.resolveOptions = function(options) {
  return _.extend({}, this.widget.options,  this.options, options);
};

/**
 * Bind events to `this.el`, like submit
 */

LoggedinPanel.prototype.bindAll = function() {
  var self = this;
  var widget = this.widget;
  var options = this.options;

  var strategy_name = widget.$ssoData.lastUsedConnection.strategy;
  var strategy = widget.$strategies[strategy_name];

  if (!strategy) { return; }

  this.query('form').a0_on('submit', function (e) {
    stop(e);
    widget.emit('loggedin submit', widget.options);
    widget._signInEnterprise(e);
  });

  if (options.gravatar) {
    gravatar(this.widget, widget.$ssoData.lastUsedUsername);
  }


  var button = $.create(loggedinBtnTmpl({
    name: strategy_name,
    title: strategy.title,
    css: strategy.css,
    imageicon: strategy.imageicon,
    username: widget.$ssoData.lastUsedUsername
  }));

  this.query('.a0-last-time').html(options.i18n.t('signin:returnUserLabel'));

  this.query('.a0-strategy div').remove();

  this.query('.a0-strategy').append(button);

  this.query('.a0-strategy .a0-zocial[data-strategy]').a0_on('click', function (e) {
    stop(e);

    widget.emit('loggedin submit', widget.options, widget.$ssoData);
    widget._signinSocial(
      strategy_name,
      widget.$ssoData.lastUsedConnection && widget.$ssoData.lastUsedConnection.name,
      options._getLoggedInAuthParams(strategy_name, widget.$ssoData),
      self
    );
  });

  this.query('.a0-all').a0_on('click', function (e) {
    stop(e);
    // no need to check other panels since
    // no reset nor signup modes allow for
    // return user experience...
    gravatar(widget, '');
    widget._signinPanel();
  });

};

LoggedinPanel.prototype.query = function(selector) {
  return $(selector, this.el);
};
