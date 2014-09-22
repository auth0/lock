var _ = require('underscore');
var $ = require('../bonzo-augmented');
var IconContainerView = require('./icon-container');

module.exports = HeaderView;

var validOptionsProperties = ['icon'];

/**
 * HeaderView
 *
 * @param {Object} widget
 * @param {Object} el
 * @param {Object} options
 *
 * @public
 */

function HeaderView(widget, el, options) {
  var self = this;

  this.el = el;
  this.widget = widget;
  this.options = _.filter(options, function (option) {
    /*jshint bitwise: false*/
    return !!~validOptionsProperties.indexOf(option);
    /*jshint bitwise: true*/
  });

  this.image = new IconContainerView(this, options);

  function redirectEvent(s) {
    return function () {
      widget.emit(s);
    };
  }

  var events = [ 'icon shown', 'icon hidden', 'avatar shown', 'avatar hidden' ];

  events.forEach(function (eventName) {
    self.image.on(eventName, redirectEvent(eventName));
  });

}

/**
 * Set widget's h1 to `title`
 *
 * @param {String} title
 * @private
 */

HeaderView.prototype.setTitle = function(title) {
  var h1 = this.query('h1');
  h1.html(title);
  h1.css('display', '');
};

/**
 * Query for elements at `this.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */

HeaderView.prototype.query = function(selector) {
  if (!this.el) { throw new Error('Can\'t get element since no `el` is set to local context'); }
  return $(selector, this.el);
};

/**
 * Set image to display on header.
 *
 * @param {String} url Image to display
 * @public
 */

HeaderView.prototype.setImage = function(url) {
  this.image.set(url);
};

/**
 * Reset image to display on header to default.
 *
 * @public
 */

HeaderView.prototype.restoreImage = function () {
  this.image.reset();
};

