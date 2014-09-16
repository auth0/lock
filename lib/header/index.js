var _ = require('underscore');
var $ = require('../bonzo-augmented');

var whichAnimationEvent = require('../supports-animation');

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
  this.el = el;
  this.widget = widget;
  this.options = _.filter(options, function (option) {
    /*jshint bitwise: false*/
    return !!~validOptionsProperties.indexOf(option);
    /*jshint bitwise: true*/
  });

  this.image = new ImageView(this, options);
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

/**
 *
 * Images
 *
 * Class that handles all the complexity of the animation
 * and display of images in header
 *
 * @constructor
 * @param {Object} widget
 * @param {Object} options
 *
 * @public
 */
function ImageView (header, options) {
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

function callbackify(fn) {
  return function (cb, self) {
    return function (e) {
      fn.apply(self, [cb, self]);
    };
  };
}

// TODO Refactor me! I'm identical to _hide
ImageView.prototype._show = function (el, cb) {
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

ImageView.prototype._hide = function (el, cb) {
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

ImageView.prototype._showIcon = function (cb) {
  return this._show(this.imgContainer, cb);
};
ImageView.prototype._showAvatar = function (cb) {
  return this._show(this.avatar, cb);
};

ImageView.prototype._hideIcon = function (cb) {
  return this._hide(this.imgContainer, cb);
};

ImageView.prototype._hideAvatar = function (cb) {
  return this._hide(this.avatar, cb);
};

ImageView.prototype._onError = callbackify(function (cb, self) {
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

ImageView.prototype._onLoad = callbackify(function (cb, self) {
  clearTimeout(self.timer);
  self.img.a0_off('error');
  self.img.a0_off('load');

  self.query('.a0-image').addClass('a0-gravatar');

  self._hideAvatar(function () { self._showIcon(cb); });
});

ImageView.prototype._processQueue = function () {
  var self = this;

  if (!this.queue.length || this.processing) {
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
ImageView.prototype.set = function(url) {
  var self = this;

  this.queue.push((function (cb) {
    // XXX Super hack: sometimes neither error nor load 
    // executes, that's why this timer is required.
    self.timer = setTimeout(function () { cb(); }, 500);
    self.img.a0_once('error', self._onError(cb, self));
    self.img.a0_once('load', self._onLoad(cb, self));


    self._hideIcon(function () {
      self.img.attr('src', url);
    });

  }));
  this._processQueue();
};


/**
 * Restore image to default image
 *
 * @private
 */
ImageView.prototype.reset = function () {
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
