/**
 * Module dependencies.
 */

var _ = require('underscore');
var $ = require('../js/bonzo_augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var template = require('./loading.ejs');

/**
 * Expose LoadingPanel
 */

module.exports = LoadingPanel;

/**
 * Create
 */

function LoadingPanel(widget, options) {
  if (!(this instanceof LoadingPanel)) {
    return new LoadingPanel(widget, options);
  };

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for LoadingPanel');
  }

  this.name = 'loading';
  this.widget = widget;
  this.options = options;
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

LoadingPanel.prototype = create(Emitter.prototype);

/**
 * Create `el`
 */

LoadingPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  var widget = this.widget;

  this.el = $.create(widget.render(template, opts))[0];
  this.bindAll();
  return this.el;
}

/**
 * Return `el` or create it
 */

LoadingPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
}

/**
 * Resolves login options passed to template
 */

LoadingPanel.prototype.resolveOptions = function(options) {
  var widget = this.widget;
  var widgetOptions = widget._options;
  var modeResolvedOptions = widget.displayOptions;

  return _.extend({}, widgetOptions, modeResolvedOptions,  this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 */

LoadingPanel.prototype.bindAll = function() {
  return this;
}

LoadingPanel.prototype.query = function(selector) {
  return $(selector, this.el);
}
