/**
 * Module dependencies.
 */

var _ = require('underscore');
var $ = require('../bonzo-augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var template = require('./loading.ejs');

/**
 * Expose LoadingPanel
 */

module.exports = LoadingPanel;

/**
 * Create `LoadingPanel`
 *
 * @param {Auth0Lock} widget
 * @param {Object} options
 * @constructor
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
  this.options = this.resolveOptions(options);
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

LoadingPanel.prototype = create(Emitter.prototype);

/**
 * Query for elements at `this.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */

LoadingPanel.prototype.query = function(selector) {
  if (!this.el) throw new Error('Can\'t get element since no `el` is set to local context');
  return $(selector, this.el);
}

/**
 * Create `el`
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
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
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
 */

LoadingPanel.prototype.render = function() {
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

LoadingPanel.prototype.resolveOptions = function(options) {
  return _.extend({}, this.widget.options,  this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 */

LoadingPanel.prototype.bindAll = function() {
  return this;
}
