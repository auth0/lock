var EventEmitter = require('events').EventEmitter;

var whichAnimationEvent = require('../supports-animation');
var ocreate = require('../object-create');

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
  this.query = function (selector) {
    return header.query(selector);
  };

  this.animationEnd = whichAnimationEvent();
  this.avatar = this.query('.a0-avatar');
  this.img = this.query('.a0-image img');

  this.imgContainer = this.query('.a0-image');

  this.queue = [];
}

/**
 * Inherit from `EventEmitter`
 */

IconContainerView.prototype = ocreate(EventEmitter.prototype);

function callbackify(fn) {
  return function (cb, self) {
    return function () {
      fn.apply(self, [cb, self]);
    };
  };
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

  el.removeClass('a0-animated a0-fast a0-flipInX a0-flipOutX');
  el.a0_once(self.animationEnd, function () {
    el.removeClass('a0-animated a0-fast a0-flipInX a0-flipOutX');
    cb();
  });
  el.addClass('a0-animated a0-fast a0-flipInX');
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

  el.removeClass('a0-animated a0-fast a0-flipInX a0-flipOutX');
  el.a0_once(self.animationEnd, function () {
    el.removeClass('a0-animated a0-fast a0-flipOutX a0-flipInX');
    el.addClass('a0-hide');

    cb();
  });
  el.addClass('a0-animated a0-fast a0-flipOutX');
};

IconContainerView.prototype._showIcon = function (cb) {
  var self = this;
  return this._show(this.imgContainer, function () {
    self.emit('icon shown');
    cb();
  });
};
IconContainerView.prototype._showAvatar = function (cb) {
  var self = this;
  return this._show(this.avatar, function () {
    self.emit('avatar shown');
    cb();
  });
};

IconContainerView.prototype._hideIcon = function (cb) {
  var self = this;
  return this._hide(this.imgContainer, function () {
    self.emit('icon hidden');
    cb();
  });
};

IconContainerView.prototype._hideAvatar = function (cb) {
  var self = this;
  return this._hide(this.avatar, function () {
    self.emit('avatar hidden');
    cb();
  });
};

IconContainerView.prototype._onError = callbackify(function (cb, self) {
  clearTimeout(self.timer);
  self.img.a0_off('load');
  self.img.a0_off('error');

  self.imgContainer.removeClass('a0-gravatar');

  self._hideIcon(function () {
    if (self.options.icon) {
      self.img.attr('src', self.options.icon);
      self._showIcon(cb);
    } else {
      self._showAvatar(cb);
    }
  });
});

IconContainerView.prototype._onLoad = callbackify(function (cb, self) {
  clearTimeout(self.timer);
  self.img.a0_off('error');
  self.img.a0_off('load');

  self.query('.a0-image').addClass('a0-gravatar');

  self._hideAvatar(function () {
    self._showIcon(cb);
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
    // XXX Super hack: sometimes neither error nor load
    // executes, that's why this timer is required.
    self.timer = setTimeout(function () { cb(); }, 500);
    self.img.a0_once('error', self._onError(cb, self));
    self.img.a0_once('load', self._onLoad(cb, self));


    self._hideIcon(function () {
      self.img.attr('src', url);
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

  if (this.options.icon) {
    this.queue.push(function (cb) {
      if (self.img.attr('src') !== self.options.icon) {
        self._hideIcon(function () {
          self.imgContainer.removeClass('a0-gravatar');
          self.img.attr('src', self.options.icon);
          self._showIcon(cb);
        });
        return;
      }
      cb();
    });
  } else {
    this.queue.push(function (cb) {
      self.imgContainer.removeClass('a0-gravatar');
      self._hideIcon(function () { self._showAvatar(cb); });
    });
  }
  this._processQueue();
};

module.exports = IconContainerView;
