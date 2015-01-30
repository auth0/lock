/**
 * Module dependencies.
 */

var jsonp = require('jsonp');

/**
 * Expose Recaptcha
 */ 

module.exports = Recaptcha;

/**
 * Recaptcha's script url
 */

var script_url = 'https://www.google.com/recaptcha/api.js'

/**
 * Create `Recaptcha`
 * @param {Object} options
 * @constructor
 */

function Recaptcha(options) {
  this.options = options;
  this.verification = null;
  this.widget = null;
  
  this._loadRecaptcha();
}

/**
 * Loads Recaptcha's lib
 * @return {RecaptchaLib}
 * @private
 */

Recaptcha.prototype._loadRecaptcha = function() {
  var self = this;
  if (Recaptcha.loaded) {
    return this._onload();
  } else {
    jsonp(script_url + '?render=explicit', {
      param: 'onload'
    }, function() {
      self._onload();
    }); 
  }
};

/**
 * Shows recaptcha widget
 * @param {NodeElement} el
 * @param {Function} verifycb
 * @return {RecaptchaWidget}
 * @public
 */

Recaptcha.prototype.show = function(el, verifycb) {
  this.verification = null;
  if (null === this.widget) {
    this.widget = grecaptcha.render(el, {
      sitekey: this.options.key,
      theme: this.options.theme,
      callback: verifycb
    }); 
  } else {
    grecaptcha.reset(this.widget);
  }
}

/**
 * Recaptcha's lib onload callback
 * @private
 */

Recaptcha.prototype._onload = function () {
  Recaptcha.loaded = true;
  // XXX: Error handling? custom callback?
};