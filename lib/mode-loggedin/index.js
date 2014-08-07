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

/**
 * Expose LoggedinPanel
 */

module.exports = LoggedinPanel;

/**
 * Create
 */

function LoggedinPanel(widget, options) {
  if (!(this instanceof LoggedinPanel)) {
    return new LoggedinPanel(widget, options);
  };

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for LoggedinPanel');
  }

  this.name = 'loggedin';
  this.widget = widget;
  this.options = options;
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

LoggedinPanel.prototype = create(Emitter.prototype);

/**
 * Create `el`
 */

LoggedinPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  var widget = this.widget;

  this.el = $.create(widget.render(template, opts))[0];
  this.bindAll();
  return this.el;
}

/**
 * Return `el` or create it
 */

LoggedinPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
}

/**
 * Resolves login options passed to template
 */

LoggedinPanel.prototype.resolveOptions = function(options) {
  var widget = this.widget;
  var widgetOptions = widget._options;
  var modeResolvedOptions = widget.displayOptions;

  return _.extend({}, widgetOptions, modeResolvedOptions,  this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 */

LoggedinPanel.prototype.bindAll = function() {
  var self = this;
  var widget = this.widget;

  var strategy_name = widget._ssoData.lastUsedConnection.strategy;
  var strategy = widget._strategies[strategy_name];

  if (!strategy) return;

  this.query('form').a0_on('submit', function (e) {
    stop(e);
    widget._signInEnterprise(e);
  });

  var button = $.create(loggedinBtnTmpl({
    name: strategy_name,
    title: strategy.title,
    css: strategy.css,
    imageicon: strategy.imageicon,
    username: widget._ssoData.lastUsedUsername
  }));

  this.query('.a0-last-time').html(widget._dict.t('signin:returnUserLabel'));

  this.query('.a0-strategy div').remove();

  this.query('.a0-strategy').append(button);

  this.query('.a0-strategy .a0-zocial[data-strategy]').a0_on('click', function (e) {
    stop(e);

    widfet._signinSocial(
      strategy_name,
      widget._ssoData.lastUsedConnection && widget._ssoData.lastUsedConnection.name,
      widget._getLoggedInAuthParams(strategy_name, widget._ssoData),
      self
    );
  });

  this.query('.a0-all').a0_on('click', function (e) {
    stop(e);
    // no need to check other panels since
    // no reset nor signup modes allow for
    // return user experience...
    widget._signinPanel(self.options);
  });

}

LoggedinPanel.prototype.query = function(selector) {
  return $(selector, this.el);
}
