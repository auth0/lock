/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var template = require('../html/modes/signin.ejs');
var _ = require('underscore');

/**
 * Expose SigninPanel
 */

module.exports = SigninPanel;

/**
 * Create
 */

function SigninPanel(widget, options) {
  if (!(this instanceof SigninPanel)) {
    return new SigninPanel(widget, options);
  };

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for SigninPanel');
  }

  this.widget = widget;
  this.options = options;
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

SigninPanel.prototype = create(Emitter.prototype);

/**
 * Create `el`
 */

SigninPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  this.el = widget.render(template, opts);
  this.bindAll();
  return this.el;
}

/**
 * Return `el` or create it
 */

SigninPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.call(this, arguments);
}

/**
 * Resolves login options passed to template
 */

SigninPanel.prototype.resolveOptions = function(options) {
  return _.extend({}, widget._options, this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 */

SigninPanel.prototype.bindAll = function() {
  // body...
}
