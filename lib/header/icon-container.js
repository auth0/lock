var EventEmitter = require('events').EventEmitter;

var whichAnimationEvent = require('../supports-animation');
var ocreate = require('../object-create');

// XXX This number should match the value in less .animation.match duration
var ANIMATION_TIMEOUT_MS = 300;

module.exports = IconContainerView;

/**
 *
 * IconContainerView
 *
 * Class that handles all the complexity of the animation
 * and display of icon and avatar in header.
 *
 * @constructor
 * @param {Object} widget
 * @param {Object} options
 *
 * @public
 */

function IconContainerView (header, options) {
  this.header = header;
  this.options = options;

  this.animationEnd = whichAnimationEvent();

  this.queue = [];
}

/**
 * Inherit from `EventEmitter`
 */

IconContainerView.prototype = ocreate(EventEmitter.prototype);

/**
 * Query for elements at `this.header.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */

IconContainerView.prototype.query = function(selector) {
  return this.header.query(selector);
}

IconContainerView.prototype.avatar = function() {
  return this.query('.a0-avatar');
}

IconContainerView.prototype.img = function() {
  return this.query('.a0-avatar img');
}

IconContainerView.prototype.image = function() {
  return this.query('.a0-image');
}

// TODO Refactor me! I'm identical to _hide
IconContainerView.prototype._show = function (el, cb) {
  var self = this;

  if(!el.hasClass('a0-hide')) {
    return cb();
  }

  // IE 9 :(
  if (!self.animationEnd){
    el.removeClass('a0-hide');
    return cb();
  }

  el.removeClass('a0-animated a0-fast a0-fadeOut a0-fadeInDown');
  el.a0_once(self.animationEnd, function () {
    el.removeClass('a0-animated a0-fast a0-fadeOut a0-fadeInDown');
    cb();
  });
  el.addClass('a0-animated a0-fast a0-fadeInDown');
  el.removeClass('a0-hide');
};

IconContainerView.prototype._hide = function (el, cb) {
  var self = this;

  if(el.hasClass('a0-hide')) {
    return cb();
  }

  // IE 9 :(
  if (!self.animationEnd){
    el.addClass('a0-hide');
    return cb();
  }

  // The el var generally contains two elements: one that is displayed
  // as it is and other that is blured in the background. Here we
  // don't want to hide the one that is used for the background
  // beacuse it may produce a flicker (for instance, when an avatar is
  // replaced for the icon). The background will be updated when the
  // next image is shown.
  if (el.length === 2) {
    el = el.last();
  }

  el.removeClass('a0-animated a0-fast a0-fadeInDown a0-fadeOut');
  el.a0_once(self.animationEnd, function () {
    el.removeClass('a0-animated a0-fast a0-fadeInDown a0-fadeOut');
    el.addClass('a0-hide');

    cb();
  });
  el.addClass('a0-animated a0-fast a0-fadeOut');
};

IconContainerView.prototype._showIcon = function (cb) {
  var self = this;
  return this._show(this.image(), function () {
    self.emit('icon shown');
    cb();
  });
};

IconContainerView.prototype._showAvatar = function (cb) {
  var self = this;
  return this._show(this.avatar(), function () {
    self.emit('avatar shown');
    cb();
  });
};

IconContainerView.prototype._hideIcon = function (cb) {
  var self = this;
  return this._hide(this.image(), function () {
    self.emit('icon hidden');
    cb();
  });
};

IconContainerView.prototype._hideAvatar = function (cb) {
  var self = this;
  return this._hide(this.avatar(), function () {
    self.emit('avatar hidden');
    cb();
  });
};

IconContainerView.prototype._onError = callbackify(function (cb, self) {
  clearTimeout(self.timer);
  self.img().a0_off('load');
  self.img().a0_off('error');

  self.avatar().removeClass('a0-gravatar');

  self._hideAvatar(function () {
    self._showIcon(cb);
  });
});

IconContainerView.prototype._onLoad = callbackify(function (cb, self) {
  clearTimeout(self.timer);
  self.img().a0_off('error');
  self.img().a0_off('load');

  self.avatar().addClass('a0-gravatar');

  self._hideIcon(function () {
    self._showAvatar(cb);
  });
});

IconContainerView.prototype._processQueue = function () {
  var self = this;

  if (!this.queue.length || this.processing) {
    return;
  }

  var element = this.queue.pop();

  self.processing = true;
  element(function () {
    self.processing = false;
    self._processQueue();
  });
};

/**
 * Show image
 *
 * @param {String} url
 * @private
 */

IconContainerView.prototype.set = function(url) {
  var self = this;

  this.queue.push(function (cb) {
    // URL already set, nothing to do here :)
    if (self.img().attr('src') === url) {
      return cb();
    }
    // XXX Super hack: sometimes neither error nor load
    // executes, that's why this timer is required.
    self.timer = setTimeout(cb, ANIMATION_TIMEOUT_MS);
    self.img().a0_once('error', self._onError(cb, self));
    self.img().a0_once('load', self._onLoad(cb, self));


    self._hideAvatar(function () {
      self.img().attr('src', url);
    });

  });
  this._processQueue();
};


/**
 * Restore image to default image
 *
 * @private
 */

IconContainerView.prototype.reset = function () {
  var self = this;
  this.queue.push(function (cb) {
    self._hideAvatar(function () {
      self.avatar().removeClass('a0-gravatar');
      self.img().attr('src', '');
      self._showIcon(cb);
    });
  });

  this._processQueue();
};

function callbackify(fn) {
  return function (cb, self) {
    return function () {
      fn.apply(self, [cb, self]);
    };
  };
}
