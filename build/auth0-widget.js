;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};var assert_required   = require('./lib/assert_required');
var base64_url_decode = require('./lib/base64_url_decode');
var qs                = require('qs');
var reqwest           = require('reqwest');

var jsonp             = require('jsonp');

var use_jsonp         = require('./lib/use_jsonp');
var LoginError        = require('./lib/LoginError');
var json_parse        = require('./lib/json_parse');

function Auth0 (options) {
  if (!(this instanceof Auth0)) {
    return new Auth0(options);
  }

  assert_required(options, 'clientID');
  assert_required(options, 'callbackURL');
  assert_required(options, 'domain');

  this._clientID = options.clientID;
  this._callbackURL = options.callbackURL;
  this._domain = options.domain;
  if (options.success) {
    this.parseHash(options.success);
  }
  this._failure = options.failure;
}

Auth0.prototype._redirect = function (url) {
  global.window.location = url;
};

Auth0.prototype._renderAndSubmitWSFedForm = function (formHtml) {
  var div = document.createElement('div');
  div.innerHTML = formHtml;
  var form = document.body.appendChild(div).children[0];
  form.submit();
};

Auth0.prototype.parseHash = function (callback) {
  if(!window.location.hash.match(/access_token/)) return;
  var hash = window.location.hash.substr(1);
  var parsed_qs = qs.parse(hash);
  var id_token = parsed_qs.id_token;
  var encoded = id_token.split('.')[1];
  var prof = json_parse(base64_url_decode(encoded));
  callback(prof, id_token, parsed_qs.access_token, parsed_qs.state);
};

Auth0.prototype.signup = function (options, callback) {
  var self = this;

  var query = {
    response_type: 'token',
    client_id:     this._clientID,
    connection:    options.connection,
    redirect_uri:  this._callbackURL,
    scope:         'openid profile'
  };

  if (options.state) {
    query.state = options.state;
  }

  query.email = options.username || options.email;
  query.password = options.password;

  query.tenant = this._domain.split('.')[0];

  function success () {
    if ('auto_login' in options && !options.auto_login) {
      if (callback) callback();
      return;
    }
    self.login(options, callback);
  }

  function fail (status, resp) {
    var error = new LoginError(status, resp);
    if (callback)      return callback(error);
    if (self._failure) return self._failure(error);
  }

  if (use_jsonp()) {
    return jsonp('https://' + this._domain + '/dbconnections/signup?' + qs.stringify(query), {
      param: 'cbx',
      timeout: 15000
    }, function (err, resp) {
      if (err) {
        return fail(0, err);
      }
      return resp.status == 200 ?
              success() :
              fail(resp.status, resp.err);
    });
  }

  reqwest({
    url:     'https://' + this._domain + '/dbconnections/signup',
    method:  'post',
    type:    'html',
    data:    query,
    success: success,
    crossOrigin: true
  }).fail(function (err) {
    fail(err.status, err.responseText);
  });
};

Auth0.prototype.changePassword = function (options, callback) {
  var self = this;
  var query = {
    tenant:         this._domain.split('.')[0],
    connection:     options.connection,
    email:          options.username || options.email,
    password:       options.password
  };

  function success () {
    if (callback) callback();
  }

  function fail (status, resp) {
    var error = new LoginError(status, resp);
    if (callback)      return callback(error);
    if (self._failure) return self._failure(error);
  }

  if (use_jsonp()) {
    return jsonp('https://' + this._domain + '/dbconnections/change_password?' + qs.stringify(query), {
      param: 'cbx',
      timeout: 15000
    }, function (err, resp) {
      if (err) {
        return fail(0, err);
      }
      return resp.status == 200 ?
              success() :
              fail(resp.status, resp.err);
    });
  }

  reqwest({
    url:     'https://' + this._domain + '/dbconnections/change_password',
    method:  'post',
    type:    'html',
    data:    query,
    success: success,
    crossOrigin: true
  }).fail(function (err) {
    fail(err.status, err.responseText);
  });
};

Auth0.prototype.login = function (options, callback) {
  if (options.username || options.email) {
    return this.loginWithDbConnection(options, callback);
  }

  var query = {
    response_type: 'token',
    client_id:     this._clientID,
    connection:    options.connection,
    redirect_uri:  this._callbackURL,
    scope:         'openid profile'
  };

  if (options.state) {
    query.state = options.state;
  }

  this._redirect('https://' + this._domain + '/authorize?' + qs.stringify(query));
};

Auth0.prototype.loginWithDbConnection = function (options, callback) {
  var self = this;

  var query = {
    response_type: 'token',
    client_id:     this._clientID,
    connection:    options.connection,
    redirect_uri:  this._callbackURL,
    scope:         'openid profile'
  };

  if (options.state) {
    query.state = options.state;
  }

  query.username = options.username || options.email;
  query.password = options.password;

  query.tenant = this._domain.split('.')[0];

  function return_error (error) {
    if (callback)      return callback(error);
    if (self._failure) return self._failure(error);
  }

  if (use_jsonp()) {
    return jsonp('https://' + this._domain + '/dbconnections/login?' + qs.stringify(query), {
      param: 'cbx',
      timeout: 15000
    }, function (err, resp) {
      if (err) {
        return return_error(err);
      }
      if('error' in resp) {
        var error = new LoginError(resp.status, resp.error);
        return return_error(error);
      }
      self._renderAndSubmitWSFedForm(resp.form);
    });
  }

  reqwest({
    url:     'https://' + this._domain + '/dbconnections/login',
    method:  'post',
    type:    'html',
    data:    query,
    crossOrigin: true,
    success: function (resp) {
      self._renderAndSubmitWSFedForm(resp);
    }
  }).fail(function (err) {
    var er = err;
    if (!er.status || er.status === 0) { //ie10 trick
      er = {};
      er.status = 401;
      er.responseText = {
        code: 'invalid_user_password'
      };
    }
    var error = new LoginError(er.status, er.responseText);
    return return_error(error);
  });
};

Auth0.prototype.getSSOData = function (callback) {
  return jsonp('https://' + this._domain + '/user/ssodata', {
    param: 'cbx',
    timeout: 15000
  }, function (err, resp) {
    callback(null, err ? {} : resp); // Always return OK, regardless of any errors
  });
};

Auth0.prototype.getConnections = function (callback) {
  return jsonp('https://' + this._domain + '/public/api/' + this._clientID + '/connections', {
    param: 'cbx',
    timeout: 15000
  }, callback);
};

module.exports = Auth0;

},{"./lib/LoginError":2,"./lib/assert_required":3,"./lib/base64_url_decode":4,"./lib/json_parse":5,"./lib/use_jsonp":6,"jsonp":8,"qs":10,"reqwest":11}],2:[function(require,module,exports){
var json_parse = require('./json_parse');

function LoginError(status, details) {
  var obj;

  if (typeof details == 'string') {
    try {
      obj = json_parse(details);
    } catch (er) {
      obj = {message: details};      
    }
  } else {
    obj = details;
  }

  var err = Error.call(this, obj.description || obj.message || obj.error);

  err.status = status;
  err.name = obj.code;
  err.code = obj.code;
  err.details = obj;
  
  if (status === 0) {
    err.code = "Unknown";
    err.message = "Unknown error.";
  }

  return err;
}

if (Object && Object.create) {
  LoginError.prototype = Object.create(Error.prototype, { 
    constructor: { value: LoginError } 
  });
}

module.exports = LoginError;
},{"./json_parse":5}],3:[function(require,module,exports){
module.exports = function (obj, prop) {
  if (!obj[prop]) {
    throw new Error(prop + ' is required.');
  }
};
},{}],4:[function(require,module,exports){
var Base64 = require('Base64');

module.exports = function(str) {
  var output = str.replace("-", "+").replace("_", "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }
  return Base64.atob(output);
};
},{"Base64":7}],5:[function(require,module,exports){
module.exports = function (str) {
  return window.JSON ? window.JSON.parse(str) : eval('(' + str + ')');
};
},{}],6:[function(require,module,exports){
module.exports = function () {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : null;
  
  if (xhr && 'withCredentials' in xhr) {
    return false;
  }

  return 'XDomainRequest' in window && window.location.protocol === 'http:';
};
},{}],7:[function(require,module,exports){
;(function () {

  var
    object = typeof exports != 'undefined' ? exports : this, // #8: web workers
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    INVALID_CHARACTER_ERR = (function () {
      // fabricate a suitable error object
      try { document.createElement('$'); }
      catch (error) { return error; }}());

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next input index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      input.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = input.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) throw INVALID_CHARACTER_ERR;
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '')
    if (input.length % 4 == 1) throw INVALID_CHARACTER_ERR;
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());

},{}],8:[function(require,module,exports){

/**
 * Module dependencies
 */

var debug = require('debug')('jsonp');

/**
 * Module exports.
 */

module.exports = jsonp;

/**
 * Callback index.
 */

var count = 0;

/**
 * Noop function.
 */

function noop(){};

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

function jsonp(url, opts, fn){
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }

  var opts = opts || {};
  var param = opts.param || 'callback';
  var timeout = null != opts.timeout ? opts.timeout : 60000;
  var enc = encodeURIComponent;
  var target = document.getElementsByTagName('script')[0];
  var script;
  var timer;

  // generate a unique id for this request
  var id = count++;

  if (timeout) {
    timer = setTimeout(function(){
      cleanup();
      fn && fn(new Error('Timeout'));
    }, timeout);
  }

  function cleanup(){
    target.parentNode.removeChild(script);
    window['__jp' + id] = noop;
  }

  window['__jp' + id] = function(data){
    debug('jsonp got', data);
    if (timer) clearTimeout(timer);
    cleanup();
    fn && fn(null, data);
  };

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc('__jp' + id + '');
  url = url.replace('?&', '?');

  debug('jsonp req "%s"', url);

  // create script
  script = document.createElement('script');
  script.src = url;
  target.parentNode.insertBefore(script, target);
};

},{"debug":9}],9:[function(require,module,exports){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

// persist

if (window.localStorage) debug.enable(localStorage.debug);

},{}],10:[function(require,module,exports){
/**
 * Object#toString() ref for stringify().
 */

var toString = Object.prototype.toString;

/**
 * Object#hasOwnProperty ref
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * see issue #70
 */
var isRestorableProto = (function () {
  var o;

  if (!Object.create) return false;

  o = Object.create(null);
  o.__proto__ = Object.prototype;

  return o.hasOwnProperty === hasOwnProperty;
})();

/**
 * Array#indexOf shim.
 */

var indexOf = typeof Array.prototype.indexOf === 'function'
  ? function(arr, el) { return arr.indexOf(el); }
  : function(arr, el) {
      if (typeof arr == 'string' && typeof "a"[0] == 'undefined') {
        arr = arr.split('');
      }
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === el) return i;
      }
      return -1;
    };

/**
 * Array.isArray shim.
 */

var isArray = Array.isArray || function(arr) {
  return toString.call(arr) == '[object Array]';
};

/**
 * Object.keys shim.
 */

var objectKeys = Object.keys || function(obj) {
  var ret = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret.push(key);
    }
  }
  return ret;
};

/**
 * Array#forEach shim.
 */

var forEach = typeof Array.prototype.forEach === 'function'
  ? function(arr, fn) { return arr.forEach(fn); }
  : function(arr, fn) {
      for (var i = 0; i < arr.length; i++) fn(arr[i]);
    };

/**
 * Array#reduce shim.
 */

var reduce = function(arr, fn, initial) {
  if (typeof arr.reduce === 'function') return arr.reduce(fn, initial);
  var res = initial;
  for (var i = 0; i < arr.length; i++) res = fn(res, arr[i]);
  return res;
};

/**
 * Create a nullary object if possible
 */

function createObject() {
  return isRestorableProto
    ? Object.create(null)
    : {};
}

/**
 * Cache non-integer test regexp.
 */

var isint = /^[0-9]+$/;

function promote(parent, key) {
  if (parent[key].length == 0) return parent[key] = createObject();
  var t = createObject();
  for (var i in parent[key]) {
    if (hasOwnProperty.call(parent[key], i)) {
      t[i] = parent[key][i];
    }
  }
  parent[key] = t;
  return t;
}

function parse(parts, parent, key, val) {
  var part = parts.shift();
  // end
  if (!part) {
    if (isArray(parent[key])) {
      parent[key].push(val);
    } else if ('object' == typeof parent[key]) {
      parent[key] = val;
    } else if ('undefined' == typeof parent[key]) {
      parent[key] = val;
    } else {
      parent[key] = [parent[key], val];
    }
    // array
  } else {
    var obj = parent[key] = parent[key] || [];
    if (']' == part) {
      if (isArray(obj)) {
        if ('' != val) obj.push(val);
      } else if ('object' == typeof obj) {
        obj[objectKeys(obj).length] = val;
      } else {
        obj = parent[key] = [parent[key], val];
      }
      // prop
    } else if (~indexOf(part, ']')) {
      part = part.substr(0, part.length - 1);
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
      // key
    } else {
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
    }
  }
}

/**
 * Merge parent key/val pair.
 */

function merge(parent, key, val){
  if (~indexOf(key, ']')) {
    var parts = key.split('[')
      , len = parts.length
      , last = len - 1;
    parse(parts, parent, 'base', val);
    // optimize
  } else {
    if (!isint.test(key) && isArray(parent.base)) {
      var t = createObject();
      for (var k in parent.base) t[k] = parent.base[k];
      parent.base = t;
    }
    set(parent.base, key, val);
  }

  return parent;
}

/**
 * Compact sparse arrays.
 */

function compact(obj) {
  if ('object' != typeof obj) return obj;

  if (isArray(obj)) {
    var ret = [];

    for (var i in obj) {
      if (hasOwnProperty.call(obj, i)) {
        ret.push(obj[i]);
      }
    }

    return ret;
  }

  for (var key in obj) {
    obj[key] = compact(obj[key]);
  }

  return obj;
}

/**
 * Restore Object.prototype.
 * see pull-request #58
 */

function restoreProto(obj) {
  if (!isRestorableProto) return obj;
  if (isArray(obj)) return obj;
  if (obj && 'object' != typeof obj) return obj;

  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      obj[key] = restoreProto(obj[key]);
    }
  }

  obj.__proto__ = Object.prototype;
  return obj;
}

/**
 * Parse the given obj.
 */

function parseObject(obj){
  var ret = { base: {} };

  forEach(objectKeys(obj), function(name){
    merge(ret, name, obj[name]);
  });

  return compact(ret.base);
}

/**
 * Parse the given str.
 */

function parseString(str){
  var ret = reduce(String(str).split('&'), function(ret, pair){
    var eql = indexOf(pair, '=')
      , brace = lastBraceInKey(pair)
      , key = pair.substr(0, brace || eql)
      , val = pair.substr(brace || eql, pair.length)
      , val = val.substr(indexOf(val, '=') + 1, val.length);

    // ?foo
    if ('' == key) key = pair, val = '';
    if ('' == key) return ret;

    return merge(ret, decode(key), decode(val));
  }, { base: createObject() }).base;

  return restoreProto(compact(ret));
}

/**
 * Parse the given query `str` or `obj`, returning an object.
 *
 * @param {String} str | {Object} obj
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if (null == str || '' == str) return {};
  return 'object' == typeof str
    ? parseObject(str)
    : parseString(str);
};

/**
 * Turn the given `obj` into a query string
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

var stringify = exports.stringify = function(obj, prefix) {
  if (isArray(obj)) {
    return stringifyArray(obj, prefix);
  } else if ('[object Object]' == toString.call(obj)) {
    return stringifyObject(obj, prefix);
  } else if ('string' == typeof obj) {
    return stringifyString(obj, prefix);
  } else {
    return prefix + '=' + encodeURIComponent(String(obj));
  }
};

/**
 * Stringify the given `str`.
 *
 * @param {String} str
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyString(str, prefix) {
  if (!prefix) throw new TypeError('stringify expects an object');
  return prefix + '=' + encodeURIComponent(str);
}

/**
 * Stringify the given `arr`.
 *
 * @param {Array} arr
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyArray(arr, prefix) {
  var ret = [];
  if (!prefix) throw new TypeError('stringify expects an object');
  for (var i = 0; i < arr.length; i++) {
    ret.push(stringify(arr[i], prefix + '[' + i + ']'));
  }
  return ret.join('&');
}

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyObject(obj, prefix) {
  var ret = []
    , keys = objectKeys(obj)
    , key;

  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    if ('' == key) continue;
    if (null == obj[key]) {
      ret.push(encodeURIComponent(key) + '=');
    } else {
      ret.push(stringify(obj[key], prefix
        ? prefix + '[' + encodeURIComponent(key) + ']'
        : encodeURIComponent(key)));
    }
  }

  return ret.join('&');
}

/**
 * Set `obj`'s `key` to `val` respecting
 * the weird and wonderful syntax of a qs,
 * where "foo=bar&foo=baz" becomes an array.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {String} val
 * @api private
 */

function set(obj, key, val) {
  var v = obj[key];
  if (undefined === v) {
    obj[key] = val;
  } else if (isArray(v)) {
    v.push(val);
  } else {
    obj[key] = [v, val];
  }
}

/**
 * Locate last brace in `str` within the key.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function lastBraceInKey(str) {
  var len = str.length
    , brace
    , c;
  for (var i = 0; i < len; ++i) {
    c = str[i];
    if (']' == c) brace = false;
    if ('[' == c) brace = true;
    if ('=' == c && !brace) return i;
  }
}

/**
 * Decode `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function decode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (err) {
    return str;
  }
}

},{}],11:[function(require,module,exports){
/*! version: 0.9.1 */
/*!
  * Reqwest! A general purpose XHR connection manager
  * (c) Dustin Diaz 2013
  * https://github.com/ded/reqwest
  * license MIT
  */
!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('reqwest', this, function () {

  var win = window
    , doc = document
    , twoHundo = /^20\d$/
    , byTag = 'getElementsByTagName'
    , readyState = 'readyState'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , head = doc[byTag]('head')[0]
    , uniqid = 0
    , callbackPrefix = 'reqwest_' + (+new Date())
    , lastValue // data stored by the most recent JSONP callback
    , xmlHttpRequest = 'XMLHttpRequest'
    , xDomainRequest = 'XDomainRequest'
    , noop = function () {}

    , isArray = typeof Array.isArray == 'function'
        ? Array.isArray
        : function (a) {
            return a instanceof Array
          }

    , defaultHeaders = {
          contentType: 'application/x-www-form-urlencoded'
        , requestedWith: xmlHttpRequest
        , accept: {
              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
            , xml:  'application/xml, text/xml'
            , html: 'text/html'
            , text: 'text/plain'
            , json: 'application/json, text/javascript'
            , js:   'application/javascript, text/javascript'
          }
      }

    , xhr = function(o) {
        // is it x-domain
        if (o.crossOrigin === true) {
          var xhr = win[xmlHttpRequest] ? new XMLHttpRequest() : null
          if (xhr && 'withCredentials' in xhr) {
            return xhr
          } else if (win[xDomainRequest]) {
            return new XDomainRequest()
          } else {
            throw new Error('Browser does not support cross-origin requests')
          }
        } else if (win[xmlHttpRequest]) {
          return new XMLHttpRequest()
        } else {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
      }
    , globalSetupOptions = {
        dataFilter: function (data) {
          return data
        }
      }

  function handleReadyState(r, success, error) {
    return function () {
      // use _aborted to mitigate against IE err c00c023f
      // (can't read props on aborted request objects)
      if (r._aborted) return error(r.request)
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop
        if (twoHundo.test(r.request.status))
          success(r.request)
        else
          error(r.request)
      }
    }
  }

  function setHeaders(http, o) {
    var headers = o.headers || {}
      , h

    headers.Accept = headers.Accept
      || defaultHeaders.accept[o.type]
      || defaultHeaders.accept['*']

    // breaks cross-origin requests with legacy browsers
    if (!o.crossOrigin && !headers[requestedWith]) headers[requestedWith] = defaultHeaders.requestedWith
    if (!headers[contentType]) headers[contentType] = o.contentType || defaultHeaders.contentType
    for (h in headers)
      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
  }

  function setCredentials(http, o) {
    if (typeof o.withCredentials !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o.withCredentials
    }
  }

  function generalCallback(data) {
    lastValue = data
  }

  function urlappend (url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s
  }

  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++
      , cbkey = o.jsonpCallback || 'callback' // the 'callback' key
      , cbval = o.jsonpCallbackName || reqwest.getcallbackPrefix(reqId)
      // , cbval = o.jsonpCallbackName || ('reqwest_' + reqId) // the 'callback' value
      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
      , match = url.match(cbreg)
      , script = doc.createElement('script')
      , loaded = 0
      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1

    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
      } else {
        cbval = match[3] // provided callback func name
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
    }

    win[cbval] = generalCallback

    script.type = 'text/javascript'
    script.src = url
    script.async = true
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      // need this for IE due to out-of-order onreadystatechange(), binding script
      // execution to an event listener gives us control over when the script
      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      //
      // if this hack is used in IE10 jsonp callback are never called
      script.event = 'onclick'
      script.htmlFor = script.id = '_reqwest_' + reqId
    }

    script.onload = script.onreadystatechange = function () {
      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
        return false
      }
      script.onload = script.onreadystatechange = null
      script.onclick && script.onclick()
      // Call the user callback with the last value stored and clean up values and scripts.
      fn(lastValue)
      lastValue = undefined
      head.removeChild(script)
      loaded = 1
    }

    // Add the script to the DOM head
    head.appendChild(script)

    // Enable JSONP timeout
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null
        err({}, 'Request is aborted: timeout', {})
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
    }
  }

  function getRequest(fn, err) {
    var o = this.o
      , method = (o.method || 'GET').toUpperCase()
      , url = typeof o === 'string' ? o : o.url
      // convert non-string objects to query-string form unless o.processData is false
      , data = (o.processData !== false && o.data && typeof o.data !== 'string')
        ? reqwest.toQueryString(o.data)
        : (o.data || null)
      , http
      , sendWait = false

    // if we're working on a GET request and we have data then we should append
    // query string to end of URL and not post data
    if ((o.type == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data)
      data = null
    }

    if (o.type == 'jsonp') return handleJsonp(o, fn, err, url)

    http = xhr(o)
    http.open(method, url, o.async === false ? false : true)
    setHeaders(http, o)
    setCredentials(http, o)
    if (win[xDomainRequest] && http instanceof win[xDomainRequest]) {
        http.onload = fn
        http.onerror = err
        // NOTE: see
        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
        http.onprogress = function() {}
        sendWait = true
    } else {
      http.onreadystatechange = handleReadyState(this, fn, err)
    }
    o.before && o.before(http)
    if (sendWait) {
      setTimeout(function () {
        http.send(data)
      }, 200)
    } else {
      http.send(data)
    }
    return http
  }

  function Reqwest(o, fn) {
    this.o = o
    this.fn = fn

    init.apply(this, arguments)
  }

  function setType(url) {
    var m = url.match(/\.(json|jsonp|html|xml)(\?|$)/)
    return m ? m[1] : 'js'
  }

  function init(o, fn) {

    this.url = typeof o == 'string' ? o : o.url
    this.timeout = null

    // whether request has been fulfilled for purpose
    // of tracking the Promises
    this._fulfilled = false
    // success handlers
    this._successHandler = function(){}
    this._fulfillmentHandlers = []
    // error handlers
    this._errorHandlers = []
    // complete (both success and fail) handlers
    this._completeHandlers = []
    this._erred = false
    this._responseArgs = {}

    var self = this
      , type = o.type || setType(this.url)

    fn = fn || function () {}

    if (o.timeout) {
      this.timeout = setTimeout(function () {
        self.abort()
      }, o.timeout)
    }

    if (o.success) {
      this._successHandler = function () {
        o.success.apply(o, arguments)
      }
    }

    if (o.error) {
      this._errorHandlers.push(function () {
        o.error.apply(o, arguments)
      })
    }

    if (o.complete) {
      this._completeHandlers.push(function () {
        o.complete.apply(o, arguments)
      })
    }

    function complete (resp) {
      o.timeout && clearTimeout(self.timeout)
      self.timeout = null
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp)
      }
    }

    function success (resp) {
      resp = (type !== 'jsonp') ? self.request : resp
      // use global data filter on response text
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
        , r = filteredResponse
      try {
        resp.responseText = r
      } catch (e) {
        // can't assign this in IE<=8, just ignore
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err)
          }
          break
        case 'js':
          resp = eval(r)
          break
        case 'html':
          resp = r
          break
        case 'xml':
          resp = resp.responseXML
              && resp.responseXML.parseError // IE trololo
              && resp.responseXML.parseError.errorCode
              && resp.responseXML.parseError.reason
            ? null
            : resp.responseXML
          break
        }
      }

      self._responseArgs.resp = resp
      self._fulfilled = true
      fn(resp)
      self._successHandler(resp)
      while (self._fulfillmentHandlers.length > 0) {
        resp = self._fulfillmentHandlers.shift()(resp)
      }

      complete(resp)
    }

    function error(resp, msg, t) {
      resp = self.request
      self._responseArgs.resp = resp
      self._responseArgs.msg = msg
      self._responseArgs.t = t
      self._erred = true
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t)
      }
      complete(resp)
    }

    this.request = getRequest.call(this, success, error)
  }

  Reqwest.prototype = {
    abort: function () {
      this._aborted = true
      this.request.abort()
    }

  , retry: function () {
      init.call(this, this.o, this.fn)
    }

    /**
     * Small deviation from the Promises A CommonJs specification
     * http://wiki.commonjs.org/wiki/Promises/A
     */

    /**
     * `then` will execute upon successful requests
     */
  , then: function (success, fail) {
      success = success || function () {}
      fail = fail || function () {}
      if (this._fulfilled) {
        this._responseArgs.resp = success(this._responseArgs.resp)
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._fulfillmentHandlers.push(success)
        this._errorHandlers.push(fail)
      }
      return this
    }

    /**
     * `always` will execute whether the request succeeds or fails
     */
  , always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp)
      } else {
        this._completeHandlers.push(fn)
      }
      return this
    }

    /**
     * `fail` will execute when the request fails
     */
  , fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._errorHandlers.push(fn)
      }
      return this
    }
  }

  function reqwest(o, fn) {
    return new Reqwest(o, fn)
  }

  // normalize newline variants according to spec -> CRLF
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : ''
  }

  function serial(el, cb) {
    var n = el.name
      , t = el.tagName.toLowerCase()
      , optCb = function (o) {
          // IE gives value="" even where there is no value attribute
          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
          if (o && !o.disabled)
            cb(n, normalize(o.attributes.value && o.attributes.value.specified ? o.value : o.text))
        }
      , ch, ra, val, i

    // don't serialize elements that are disabled or without a name
    if (el.disabled || !n) return

    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type)
        ra = /radio/i.test(el.type)
        val = el.value
        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
      }
      break
    case 'textarea':
      cb(n, normalize(el.value))
      break
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i])
        }
      }
      break
    }
  }

  // collect up all form elements found from the passed argument elements all
  // the way down to child elements; pass a '<form>' or form fields.
  // called with 'this'=callback to use for serial() on each element
  function eachFormElement() {
    var cb = this
      , e, i
      , serializeSubtags = function (e, tags) {
          var i, j, fa
          for (i = 0; i < tags.length; i++) {
            fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }

    for (i = 0; i < arguments.length; i++) {
      e = arguments[i]
      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
    }
  }

  // standard query string style serialization
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
  }

  // { 'name': 'value', ... } style serialization
  function serializeHash() {
    var hash = {}
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
        hash[name].push(value)
      } else hash[name] = value
    }, arguments)
    return hash
  }

  // [ { name: 'name', value: 'value' }, ... ] style serialization
  reqwest.serializeArray = function () {
    var arr = []
    eachFormElement.apply(function (name, value) {
      arr.push({name: name, value: value})
    }, arguments)
    return arr
  }

  reqwest.serialize = function () {
    if (arguments.length === 0) return ''
    var opt, fn
      , args = Array.prototype.slice.call(arguments, 0)

    opt = args.pop()
    opt && opt.nodeType && args.push(opt) && (opt = null)
    opt && (opt = opt.type)

    if (opt == 'map') fn = serializeHash
    else if (opt == 'array') fn = reqwest.serializeArray
    else fn = serializeQueryString

    return fn.apply(null, args)
  }

  reqwest.toQueryString = function (o, trad) {
    var prefix, i
      , traditional = trad || false
      , s = []
      , enc = encodeURIComponent
      , add = function (key, value) {
          // If value is a function, invoke it and return its value
          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
          s[s.length] = enc(key) + '=' + enc(value)
        }
    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++) add(o[i].name, o[i].value)
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in o) {
        buildParams(prefix, o[prefix], traditional, add)
      }
    }

    // spaces should be + according to spec
    return s.join('&').replace(/%20/g, '+')
  }

  function buildParams(prefix, obj, traditional, add) {
    var name, i, v
      , rbracket = /\[\]$/

    if (isArray(obj)) {
      // Serialize array item.
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i]
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v)
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj)
    }
  }

  reqwest.getcallbackPrefix = function () {
    return callbackPrefix
  }

  // jQuery and Zepto compatibility, differences can be remapped here so you can call
  // .ajax.compat(options, callback)
  reqwest.compat = function (o, fn) {
    if (o) {
      o.type && (o.method = o.type) && delete o.type
      o.dataType && (o.type = o.dataType)
      o.jsonpCallback && (o.jsonpCallbackName = o.jsonpCallback) && delete o.jsonpCallback
      o.jsonp && (o.jsonpCallback = o.jsonp)
    }
    return new Reqwest(o, fn)
  }

  reqwest.ajaxSetup = function (options) {
    options = options || {}
    for (var k in options) {
      globalSetupOptions[k] = options[k]
    }
  }

  return reqwest
});

},{}],12:[function(require,module,exports){
/*!
  * Bean - copyright (c) Jacob Thornton 2011-2012
  * https://github.com/fat/bean
  * MIT license
  */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('bean', this, function (name, context) {
  name    = name    || 'bean'
  context = context || this

  var win            = window
    , old            = context[name]
    , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
    , nameRegex      = /\..*/
    , addEvent       = 'addEventListener'
    , removeEvent    = 'removeEventListener'
    , doc            = document || {}
    , root           = doc.documentElement || {}
    , W3C_MODEL      = root[addEvent]
    , eventSupport   = W3C_MODEL ? addEvent : 'attachEvent'
    , ONE            = {} // singleton for quick matching making add() do one()

    , slice          = Array.prototype.slice
    , str2arr        = function (s, d) { return s.split(d || ' ') }
    , isString       = function (o) { return typeof o == 'string' }
    , isFunction     = function (o) { return typeof o == 'function' }

      // events that we consider to be 'native', anything not in this list will
      // be treated as a custom event
    , standardNativeEvents =
        'click dblclick mouseup mousedown contextmenu '                  + // mouse buttons
        'mousewheel mousemultiwheel DOMMouseScroll '                     + // mouse wheel
        'mouseover mouseout mousemove selectstart selectend '            + // mouse movement
        'keydown keypress keyup '                                        + // keyboard
        'orientationchange '                                             + // mobile
        'focus blur change reset select submit '                         + // form elements
        'load unload beforeunload resize move DOMContentLoaded '         + // window
        'readystatechange message '                                      + // window
        'error abort scroll '                                              // misc
      // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
      // that doesn't actually exist, so make sure we only do these on newer browsers
    , w3cNativeEvents =
        'show '                                                          + // mouse buttons
        'input invalid '                                                 + // form elements
        'touchstart touchmove touchend touchcancel '                     + // touch
        'gesturestart gesturechange gestureend '                         + // gesture
        'textinput'                                                      + // TextEvent
        'readystatechange pageshow pagehide popstate '                   + // window
        'hashchange offline online '                                     + // window
        'afterprint beforeprint '                                        + // printing
        'dragstart dragenter dragover dragleave drag drop dragend '      + // dnd
        'loadstart progress suspend emptied stalled loadmetadata '       + // media
        'loadeddata canplay canplaythrough playing waiting seeking '     + // media
        'seeked ended durationchange timeupdate play pause ratechange '  + // media
        'volumechange cuechange '                                        + // media
        'checking noupdate downloading cached updateready obsolete '       // appcache

      // convert to a hash for quick lookups
    , nativeEvents = (function (hash, events, i) {
        for (i = 0; i < events.length; i++) events[i] && (hash[events[i]] = 1)
        return hash
      }({}, str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ''))))

      // custom events are events that we *fake*, they are not provided natively but
      // we can use native events to generate them
    , customEvents = (function () {
        var isAncestor = 'compareDocumentPosition' in root
              ? function (element, container) {
                  return container.compareDocumentPosition && (container.compareDocumentPosition(element) & 16) === 16
                }
              : 'contains' in root
                ? function (element, container) {
                    container = container.nodeType === 9 || container === window ? root : container
                    return container !== element && container.contains(element)
                  }
                : function (element, container) {
                    while (element = element.parentNode) if (element === container) return 1
                    return 0
                  }
          , check = function (event) {
              var related = event.relatedTarget
              return !related
                ? related == null
                : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString())
                    && !isAncestor(related, this))
            }

        return {
            mouseenter: { base: 'mouseover', condition: check }
          , mouseleave: { base: 'mouseout', condition: check }
          , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
        }
      }())

      // we provide a consistent Event object across browsers by taking the actual DOM
      // event object and generating a new one from its properties.
    , Event = (function () {
            // a whitelist of properties (for different event types) tells us what to check for and copy
        var commonProps  = str2arr('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget ' +
              'detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey '  +
              'srcElement target timeStamp type view which propertyName')
          , mouseProps   = commonProps.concat(str2arr('button buttons clientX clientY dataTransfer '      +
              'fromElement offsetX offsetY pageX pageY screenX screenY toElement'))
          , mouseWheelProps = mouseProps.concat(str2arr('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
              'axis')) // 'axis' is FF specific
          , keyProps     = commonProps.concat(str2arr('char charCode key keyCode keyIdentifier '          +
              'keyLocation location'))
          , textProps    = commonProps.concat(str2arr('data'))
          , touchProps   = commonProps.concat(str2arr('touches targetTouches changedTouches scale rotation'))
          , messageProps = commonProps.concat(str2arr('data origin source'))
          , stateProps   = commonProps.concat(str2arr('state'))
          , overOutRegex = /over|out/
            // some event types need special handling and some need special properties, do that all here
          , typeFixers   = [
                { // key events
                    reg: /key/i
                  , fix: function (event, newEvent) {
                      newEvent.keyCode = event.keyCode || event.which
                      return keyProps
                    }
                }
              , { // mouse events
                    reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
                  , fix: function (event, newEvent, type) {
                      newEvent.rightClick = event.which === 3 || event.button === 2
                      newEvent.pos = { x: 0, y: 0 }
                      if (event.pageX || event.pageY) {
                        newEvent.clientX = event.pageX
                        newEvent.clientY = event.pageY
                      } else if (event.clientX || event.clientY) {
                        newEvent.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                        newEvent.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                      }
                      if (overOutRegex.test(type)) {
                        newEvent.relatedTarget = event.relatedTarget
                          || event[(type == 'mouseover' ? 'from' : 'to') + 'Element']
                      }
                      return mouseProps
                    }
                }
              , { // mouse wheel events
                    reg: /mouse.*(wheel|scroll)/i
                  , fix: function () { return mouseWheelProps }
                }
              , { // TextEvent
                    reg: /^text/i
                  , fix: function () { return textProps }
                }
              , { // touch and gesture events
                    reg: /^touch|^gesture/i
                  , fix: function () { return touchProps }
                }
              , { // message events
                    reg: /^message$/i
                  , fix: function () { return messageProps }
                }
              , { // popstate events
                    reg: /^popstate$/i
                  , fix: function () { return stateProps }
                }
              , { // everything else
                    reg: /.*/
                  , fix: function () { return commonProps }
                }
            ]
          , typeFixerMap = {} // used to map event types to fixer functions (above), a basic cache mechanism

          , Event = function (event, element, isNative) {
              if (!arguments.length) return
              event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event
              this.originalEvent = event
              this.isNative       = isNative
              this.isBean         = true

              if (!event) return

              var type   = event.type
                , target = event.target || event.srcElement
                , i, l, p, props, fixer

              this.target = target && target.nodeType === 3 ? target.parentNode : target

              if (isNative) { // we only need basic augmentation on custom events, the rest expensive & pointless
                fixer = typeFixerMap[type]
                if (!fixer) { // haven't encountered this event type before, map a fixer function for it
                  for (i = 0, l = typeFixers.length; i < l; i++) {
                    if (typeFixers[i].reg.test(type)) { // guaranteed to match at least one, last is .*
                      typeFixerMap[type] = fixer = typeFixers[i].fix
                      break
                    }
                  }
                }

                props = fixer(event, this, type)
                for (i = props.length; i--;) {
                  if (!((p = props[i]) in this) && p in event) this[p] = event[p]
                }
              }
            }

        // preventDefault() and stopPropagation() are a consistent interface to those functions
        // on the DOM, stop() is an alias for both of them together
        Event.prototype.preventDefault = function () {
          if (this.originalEvent.preventDefault) this.originalEvent.preventDefault()
          else this.originalEvent.returnValue = false
        }
        Event.prototype.stopPropagation = function () {
          if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation()
          else this.originalEvent.cancelBubble = true
        }
        Event.prototype.stop = function () {
          this.preventDefault()
          this.stopPropagation()
          this.stopped = true
        }
        // stopImmediatePropagation() has to be handled internally because we manage the event list for
        // each element
        // note that originalElement may be a Bean#Event object in some situations
        Event.prototype.stopImmediatePropagation = function () {
          if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation()
          this.isImmediatePropagationStopped = function () { return true }
        }
        Event.prototype.isImmediatePropagationStopped = function () {
          return this.originalEvent.isImmediatePropagationStopped && this.originalEvent.isImmediatePropagationStopped()
        }
        Event.prototype.clone = function (currentTarget) {
          //TODO: this is ripe for optimisation, new events are *expensive*
          // improving this will speed up delegated events
          var ne = new Event(this, this.element, this.isNative)
          ne.currentTarget = currentTarget
          return ne
        }

        return Event
      }())

      // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
    , targetElement = function (element, isNative) {
        return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
      }

      /**
        * Bean maintains an internal registry for event listeners. We don't touch elements, objects
        * or functions to identify them, instead we store everything in the registry.
        * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
        */
    , RegEntry = (function () {
        // each handler is wrapped so we can handle delegation and custom events
        var wrappedHandler = function (element, fn, condition, args) {
            var call = function (event, eargs) {
                  return fn.apply(element, args ? slice.call(eargs, event ? 0 : 1).concat(args) : eargs)
                }
              , findTarget = function (event, eventElement) {
                  return fn.__beanDel ? fn.__beanDel.ft(event.target, element) : eventElement
                }
              , handler = condition
                  ? function (event) {
                      var target = findTarget(event, this) // deleated event
                      if (condition.apply(target, arguments)) {
                        if (event) event.currentTarget = target
                        return call(event, arguments)
                      }
                    }
                  : function (event) {
                      if (fn.__beanDel) event = event.clone(findTarget(event)) // delegated event, fix the fix
                      return call(event, arguments)
                    }
            handler.__beanDel = fn.__beanDel
            return handler
          }

        , RegEntry = function (element, type, handler, original, namespaces, args, root) {
            var customType     = customEvents[type]
              , isNative

            if (type == 'unload') {
              // self clean-up
              handler = once(removeListener, element, type, handler, original)
            }

            if (customType) {
              if (customType.condition) {
                handler = wrappedHandler(element, handler, customType.condition, args)
              }
              type = customType.base || type
            }

            this.isNative      = isNative = nativeEvents[type] && !!element[eventSupport]
            this.customType    = !W3C_MODEL && !isNative && type
            this.element       = element
            this.type          = type
            this.original      = original
            this.namespaces    = namespaces
            this.eventType     = W3C_MODEL || isNative ? type : 'propertychange'
            this.target        = targetElement(element, isNative)
            this[eventSupport] = !!this.target[eventSupport]
            this.root          = root
            this.handler       = wrappedHandler(element, handler, null, args)
          }

        // given a list of namespaces, is our entry in any of them?
        RegEntry.prototype.inNamespaces = function (checkNamespaces) {
          var i, j, c = 0
          if (!checkNamespaces) return true
          if (!this.namespaces) return false
          for (i = checkNamespaces.length; i--;) {
            for (j = this.namespaces.length; j--;) {
              if (checkNamespaces[i] == this.namespaces[j]) c++
            }
          }
          return checkNamespaces.length === c
        }

        // match by element, original fn (opt), handler fn (opt)
        RegEntry.prototype.matches = function (checkElement, checkOriginal, checkHandler) {
          return this.element === checkElement &&
            (!checkOriginal || this.original === checkOriginal) &&
            (!checkHandler || this.handler === checkHandler)
        }

        return RegEntry
      }())

    , registry = (function () {
        // our map stores arrays by event type, just because it's better than storing
        // everything in a single array.
        // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
        // rootListeners so we can look them up fast
        var map = {}

          // generic functional search of our registry for matching listeners,
          // `fn` returns false to break out of the loop
          , forAll = function (element, type, original, handler, root, fn) {
              var pfx = root ? 'r' : '$'
              if (!type || type == '*') {
                // search the whole registry
                for (var t in map) {
                  if (t.charAt(0) == pfx) {
                    forAll(element, t.substr(1), original, handler, root, fn)
                  }
                }
              } else {
                var i = 0, l, list = map[pfx + type], all = element == '*'
                if (!list) return
                for (l = list.length; i < l; i++) {
                  if ((all || list[i].matches(element, original, handler)) && !fn(list[i], list, i, type)) return
                }
              }
            }

          , has = function (element, type, original, root) {
              // we're not using forAll here simply because it's a bit slower and this
              // needs to be fast
              var i, list = map[(root ? 'r' : '$') + type]
              if (list) {
                for (i = list.length; i--;) {
                  if (!list[i].root && list[i].matches(element, original, null)) return true
                }
              }
              return false
            }

          , get = function (element, type, original, root) {
              var entries = []
              forAll(element, type, original, null, root, function (entry) {
                return entries.push(entry)
              })
              return entries
            }

          , put = function (entry) {
              var has = !entry.root && !this.has(entry.element, entry.type, null, false)
                , key = (entry.root ? 'r' : '$') + entry.type
              ;(map[key] || (map[key] = [])).push(entry)
              return has
            }

          , del = function (entry) {
              forAll(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {
                list.splice(i, 1)
                entry.removed = true
                if (list.length === 0) delete map[(entry.root ? 'r' : '$') + entry.type]
                return false
              })
            }

            // dump all entries, used for onunload
          , entries = function () {
              var t, entries = []
              for (t in map) {
                if (t.charAt(0) == '$') entries = entries.concat(map[t])
              }
              return entries
            }

        return { has: has, get: get, put: put, del: del, entries: entries }
      }())

      // we need a selector engine for delegated events, use querySelectorAll if it exists
      // but for older browsers we need Qwery, Sizzle or similar
    , selectorEngine
    , setSelectorEngine = function (e) {
        if (!arguments.length) {
          selectorEngine = doc.querySelectorAll
            ? function (s, r) {
                return r.querySelectorAll(s)
              }
            : function () {
                throw new Error('Bean: No selector engine installed') // eeek
              }
        } else {
          selectorEngine = e
        }
      }

      // we attach this listener to each DOM event that we need to listen to, only once
      // per event type per DOM element
    , rootListener = function (event, type) {
        if (!W3C_MODEL && type && event && event.propertyName != '_on' + type) return

        var listeners = registry.get(this, type || event.type, null, false)
          , l = listeners.length
          , i = 0

        event = new Event(event, this, true)
        if (type) event.type = type

        // iterate through all handlers registered for this type, calling them unless they have
        // been removed by a previous handler or stopImmediatePropagation() has been called
        for (; i < l && !event.isImmediatePropagationStopped(); i++) {
          if (!listeners[i].removed) listeners[i].handler.call(this, event)
        }
      }

      // add and remove listeners to DOM elements
    , listener = W3C_MODEL
        ? function (element, type, add) {
            // new browsers
            element[add ? addEvent : removeEvent](type, rootListener, false)
          }
        : function (element, type, add, custom) {
            // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
            // to simulate event bubbling etc.
            var entry
            if (add) {
              registry.put(entry = new RegEntry(
                  element
                , custom || type
                , function (event) { // handler
                    rootListener.call(element, event, custom)
                  }
                , rootListener
                , null
                , null
                , true // is root
              ))
              if (custom && element['_on' + custom] == null) element['_on' + custom] = 0
              entry.target.attachEvent('on' + entry.eventType, entry.handler)
            } else {
              entry = registry.get(element, custom || type, rootListener, true)[0]
              if (entry) {
                entry.target.detachEvent('on' + entry.eventType, entry.handler)
                registry.del(entry)
              }
            }
          }

    , once = function (rm, element, type, fn, originalFn) {
        // wrap the handler in a handler that does a remove as well
        return function () {
          fn.apply(this, arguments)
          rm(element, type, originalFn)
        }
      }

    , removeListener = function (element, orgType, handler, namespaces) {
        var type     = orgType && orgType.replace(nameRegex, '')
          , handlers = registry.get(element, type, null, false)
          , removed  = {}
          , i, l

        for (i = 0, l = handlers.length; i < l; i++) {
          if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
            // TODO: this is problematic, we have a registry.get() and registry.del() that
            // both do registry searches so we waste cycles doing this. Needs to be rolled into
            // a single registry.forAll(fn) that removes while finding, but the catch is that
            // we'll be splicing the arrays that we're iterating over. Needs extra tests to
            // make sure we don't screw it up. @rvagg
            registry.del(handlers[i])
            if (!removed[handlers[i].eventType] && handlers[i][eventSupport])
              removed[handlers[i].eventType] = { t: handlers[i].eventType, c: handlers[i].type }
          }
        }
        // check each type/element for removed listeners and remove the rootListener where it's no longer needed
        for (i in removed) {
          if (!registry.has(element, removed[i].t, null, false)) {
            // last listener of this type, remove the rootListener
            listener(element, removed[i].t, false, removed[i].c)
          }
        }
      }

      // set up a delegate helper using the given selector, wrap the handler function
    , delegate = function (selector, fn) {
        //TODO: findTarget (therefore $) is called twice, once for match and once for
        // setting e.currentTarget, fix this so it's only needed once
        var findTarget = function (target, root) {
              var i, array = isString(selector) ? selectorEngine(selector, root) : selector
              for (; target && target !== root; target = target.parentNode) {
                for (i = array.length; i--;) {
                  if (array[i] === target) return target
                }
              }
            }
          , handler = function (e) {
              var match = findTarget(e.target, this)
              if (match) fn.apply(match, arguments)
            }

        // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
        handler.__beanDel = {
            ft       : findTarget // attach it here for customEvents to use too
          , selector : selector
        }
        return handler
      }

    , fireListener = W3C_MODEL ? function (isNative, type, element) {
        // modern browsers, do a proper dispatchEvent()
        var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
        evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
        element.dispatchEvent(evt)
      } : function (isNative, type, element) {
        // old browser use onpropertychange, just increment a custom property to trigger the event
        element = targetElement(element, isNative)
        isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
      }

      /**
        * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
        */

      /**
        * off(element[, eventType(s)[, handler ]])
        */
    , off = function (element, typeSpec, fn) {
        var isTypeStr = isString(typeSpec)
          , k, type, namespaces, i

        if (isTypeStr && typeSpec.indexOf(' ') > 0) {
          // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
          typeSpec = str2arr(typeSpec)
          for (i = typeSpec.length; i--;)
            off(element, typeSpec[i], fn)
          return element
        }

        type = isTypeStr && typeSpec.replace(nameRegex, '')
        if (type && customEvents[type]) type = customEvents[type].base

        if (!typeSpec || isTypeStr) {
          // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
          if (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, '')) namespaces = str2arr(namespaces, '.')
          removeListener(element, type, fn, namespaces)
        } else if (isFunction(typeSpec)) {
          // off(el, fn)
          removeListener(element, null, typeSpec)
        } else {
          // off(el, { t1: fn1, t2, fn2 })
          for (k in typeSpec) {
            if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k])
          }
        }

        return element
      }

      /**
        * on(element, eventType(s)[, selector], handler[, args ])
        */
    , on = function(element, events, selector, fn) {
        var originalFn, type, types, i, args, entry, first

        //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
        if (selector === undefined && typeof events == 'object') {
          //TODO: this can't handle delegated events
          for (type in events) {
            if (events.hasOwnProperty(type)) {
              on.call(this, element, type, events[type])
            }
          }
          return
        }

        if (!isFunction(selector)) {
          // delegated event
          originalFn = fn
          args       = slice.call(arguments, 4)
          fn         = delegate(selector, originalFn, selectorEngine)
        } else {
          args       = slice.call(arguments, 3)
          fn         = originalFn = selector
        }

        types = str2arr(events)

        // special case for one(), wrap in a self-removing handler
        if (this === ONE) {
          fn = once(off, element, events, fn, originalFn)
        }

        for (i = types.length; i--;) {
          // add new handler to the registry and check if it's the first for this element/type
          first = registry.put(entry = new RegEntry(
              element
            , types[i].replace(nameRegex, '') // event type
            , fn
            , originalFn
            , str2arr(types[i].replace(namespaceRegex, ''), '.') // namespaces
            , args
            , false // not root
          ))
          if (entry[eventSupport] && first) {
            // first event of this type on this element, add root listener
            listener(element, entry.eventType, true, entry.customType)
          }
        }

        return element
      }

      /**
        * add(element[, selector], eventType(s), handler[, args ])
        *
        * Deprecated: kept (for now) for backward-compatibility
        */
    , add = function (element, events, fn, delfn) {
        return on.apply(
            null
          , !isString(fn)
              ? slice.call(arguments)
              : [ element, fn, events, delfn ].concat(arguments.length > 3 ? slice.call(arguments, 5) : [])
        )
      }

      /**
        * one(element, eventType(s)[, selector], handler[, args ])
        */
    , one = function () {
        return on.apply(ONE, arguments)
      }

      /**
        * fire(element, eventType(s)[, args ])
        *
        * The optional 'args' argument must be an array, if no 'args' argument is provided
        * then we can use the browser's DOM event system, otherwise we trigger handlers manually
        */
    , fire = function (element, type, args) {
        var types = str2arr(type)
          , i, j, l, names, handlers

        for (i = types.length; i--;) {
          type = types[i].replace(nameRegex, '')
          if (names = types[i].replace(namespaceRegex, '')) names = str2arr(names, '.')
          if (!names && !args && element[eventSupport]) {
            fireListener(nativeEvents[type], type, element)
          } else {
            // non-native event, either because of a namespace, arguments or a non DOM element
            // iterate over all listeners and manually 'fire'
            handlers = registry.get(element, type, null, false)
            args = [false].concat(args)
            for (j = 0, l = handlers.length; j < l; j++) {
              if (handlers[j].inNamespaces(names)) {
                handlers[j].handler.apply(element, args)
              }
            }
          }
        }
        return element
      }

      /**
        * clone(dstElement, srcElement[, eventType ])
        *
        * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
        */
    , clone = function (element, from, type) {
        var handlers = registry.get(from, type, null, false)
          , l = handlers.length
          , i = 0
          , args, beanDel

        for (; i < l; i++) {
          if (handlers[i].original) {
            args = [ element, handlers[i].type ]
            if (beanDel = handlers[i].handler.__beanDel) args.push(beanDel.selector)
            args.push(handlers[i].original)
            on.apply(null, args)
          }
        }
        return element
      }

    , bean = {
          on                : on
        , add               : add
        , one               : one
        , off               : off
        , remove            : off
        , clone             : clone
        , fire              : fire
        , Event             : Event
        , setSelectorEngine : setSelectorEngine
        , noConflict        : function () {
            context[name] = old
            return this
          }
      }

  // for IE, clean up on unload to avoid leaks
  if (win.attachEvent) {
    var cleanup = function () {
      var i, entries = registry.entries()
      for (i in entries) {
        if (entries[i].type && entries[i].type !== 'unload') off(entries[i].element, entries[i].type)
      }
      win.detachEvent('onunload', cleanup)
      win.CollectGarbage && win.CollectGarbage()
    }
    win.attachEvent('onunload', cleanup)
  }

  // initialize selector engine to internal default (qSA or throw Error)
  setSelectorEngine()

  return bean
});
},{}],13:[function(require,module,exports){
/*!
  * Bonzo: DOM Utility (c) Dustin Diaz 2012
  * https://github.com/ded/bonzo
  * License MIT
  */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('bonzo', this, function() {
  var win = window
    , doc = win.document
    , html = doc.documentElement
    , parentNode = 'parentNode'
    , specialAttributes = /^(checked|value|selected|disabled)$/i
      // tags that we have trouble inserting *into*
    , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
    , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
    , table = ['<table>', '</table>', 1]
    , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
    , option = ['<select>', '</select>', 1]
    , noscope = ['_', '', 0, 1]
    , tagMap = { // tags that we have trouble *inserting*
          thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
        , tr: ['<table><tbody>', '</tbody></table>', 2]
        , th: td , td: td
        , col: ['<table><colgroup>', '</colgroup></table>', 2]
        , fieldset: ['<form>', '</form>', 1]
        , legend: ['<form><fieldset>', '</fieldset></form>', 2]
        , option: option, optgroup: option
        , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
      }
    , stateAttributes = /^(checked|selected|disabled)$/
    , ie = /msie/i.test(navigator.userAgent)
    , hasClass, addClass, removeClass
    , uidMap = {}
    , uuids = 0
    , digit = /^-?[\d\.]+$/
    , dattr = /^data-(.+)$/
    , px = 'px'
    , setAttribute = 'setAttribute'
    , getAttribute = 'getAttribute'
    , byTag = 'getElementsByTagName'
    , features = function() {
        var e = doc.createElement('p')
        e.innerHTML = '<a href="#x">x</a><table style="float:left;"></table>'
        return {
          hrefExtended: e[byTag]('a')[0][getAttribute]('href') != '#x' // IE < 8
        , autoTbody: e[byTag]('tbody').length !== 0 // IE < 8
        , computedStyle: doc.defaultView && doc.defaultView.getComputedStyle
        , cssFloat: e[byTag]('table')[0].style.styleFloat ? 'styleFloat' : 'cssFloat'
        , transform: function () {
            var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
            for (i = 0; i < props.length; i++) {
              if (props[i] in e.style) return props[i]
            }
          }()
        , classList: 'classList' in e
        , opasity: function () {
            return typeof doc.createElement('a').style.opacity !== 'undefined'
          }()
        }
      }()
    , trimReplace = /(^\s*|\s*$)/g
    , whitespaceRegex = /\s+/
    , toString = String.prototype.toString
    , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
    , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
    , trim = String.prototype.trim ?
        function (s) {
          return s.trim()
        } :
        function (s) {
          return s.replace(trimReplace, '')
        }

    , getStyle = features.computedStyle
        ? function (el, property) {
            var value = null
              , computed = doc.defaultView.getComputedStyle(el, '')
            computed && (value = computed[property])
            return el.style[property] || value
          }
        : !(ie && html.currentStyle)
          ? function (el, property) {
              return el.style[property]
            }
          :
          /**
           * @param {Element} el
           * @param {string} property
           * @return {string|number}
           */
          function (el, property) {
            var val, value
            if (property == 'opacity' && !features.opasity) {
              val = 100
              try {
                val = el['filters']['DXImageTransform.Microsoft.Alpha'].opacity
              } catch (e1) {
                try {
                  val = el['filters']('alpha').opacity
                } catch (e2) {}
              }
              return val / 100
            }
            value = el.currentStyle ? el.currentStyle[property] : null
            return el.style[property] || value
          }

  function isNode(node) {
    return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
  }


  function normalize(node, host, clone) {
    var i, l, ret
    if (typeof node == 'string') return bonzo.create(node)
    if (isNode(node)) node = [ node ]
    if (clone) {
      ret = [] // don't change original array
      for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
      return ret
    }
    return node
  }

  /**
   * @param {string} c a class name to test
   * @return {boolean}
   */
  function classReg(c) {
    return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @param {boolean=} opt_rev
   * @return {Bonzo|Array}
   */
  function each(ar, fn, opt_scope, opt_rev) {
    var ind, i = 0, l = ar.length
    for (; i < l; i++) {
      ind = opt_rev ? ar.length - i - 1 : i
      fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
    }
    return ar
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @return {Bonzo|Array}
   */
  function deepEach(ar, fn, opt_scope) {
    for (var i = 0, l = ar.length; i < l; i++) {
      if (isNode(ar[i])) {
        deepEach(ar[i].childNodes, fn, opt_scope)
        fn.call(opt_scope || ar[i], ar[i], i, ar)
      }
    }
    return ar
  }


  /**
   * @param {string} s
   * @return {string}
   */
  function camelize(s) {
    return s.replace(/-(.)/g, function (m, m1) {
      return m1.toUpperCase()
    })
  }


  /**
   * @param {string} s
   * @return {string}
   */
  function decamelize(s) {
    return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
  }


  /**
   * @param {Element} el
   * @return {*}
   */
  function data(el) {
    el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
    var uid = el[getAttribute]('data-node-uid')
    return uidMap[uid] || (uidMap[uid] = {})
  }


  /**
   * removes the data associated with an element
   * @param {Element} el
   */
  function clearData(el) {
    var uid = el[getAttribute]('data-node-uid')
    if (uid) delete uidMap[uid]
  }


  function dataValue(d) {
    var f
    try {
      return (d === null || d === undefined) ? undefined :
        d === 'true' ? true :
          d === 'false' ? false :
            d === 'null' ? null :
              (f = parseFloat(d)) == d ? f : d;
    } catch(e) {}
    return undefined
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @return {boolean} whether `some`thing was found
   */
  function some(ar, fn, opt_scope) {
    for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
    return false
  }


  /**
   * this could be a giant enum of CSS properties
   * but in favor of file size sans-closure deadcode optimizations
   * we're just asking for any ol string
   * then it gets transformed into the appropriate style property for JS access
   * @param {string} p
   * @return {string}
   */
  function styleProperty(p) {
      (p == 'transform' && (p = features.transform)) ||
        (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin')) ||
        (p == 'float' && (p = features.cssFloat))
      return p ? camelize(p) : null
  }

  // this insert method is intense
  function insert(target, host, fn, rev) {
    var i = 0, self = host || this, r = []
      // target nodes could be a css selector if it's a string and a selector engine is present
      // otherwise, just use target
      , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
    // normalize each node in case it's still a string and we need to create nodes on the fly
    each(normalize(nodes), function (t, j) {
      each(self, function (el) {
        fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
      }, null, rev)
    }, this, rev)
    self.length = i
    each(r, function (e) {
      self[--i] = e
    }, null, !rev)
    return self
  }


  /**
   * sets an element to an explicit x/y position on the page
   * @param {Element} el
   * @param {?number} x
   * @param {?number} y
   */
  function xy(el, x, y) {
    var $el = bonzo(el)
      , style = $el.css('position')
      , offset = $el.offset()
      , rel = 'relative'
      , isRel = style == rel
      , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]

    if (style == 'static') {
      $el.css('position', rel)
      style = rel
    }

    isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
    isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)

    x != null && (el.style.left = x - offset.left + delta[0] + px)
    y != null && (el.style.top = y - offset.top + delta[1] + px)

  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  if (features.classList) {
    hasClass = function (el, c) {
      return el.classList.contains(c)
    }
    addClass = function (el, c) {
      el.classList.add(c)
    }
    removeClass = function (el, c) {
      el.classList.remove(c)
    }
  }
  else {
    hasClass = function (el, c) {
      return classReg(c).test(el.className)
    }
    addClass = function (el, c) {
      el.className = trim(el.className + ' ' + c)
    }
    removeClass = function (el, c) {
      el.className = trim(el.className.replace(classReg(c), ' '))
    }
  }


  /**
   * this allows method calling for setting values
   *
   * @example
   * bonzo(elements).css('color', function (el) {
   *   return el.getAttribute('data-original-color')
   * })
   *
   * @param {Element} el
   * @param {function (Element)|string}
   * @return {string}
   */
  function setter(el, v) {
    return typeof v == 'function' ? v(el) : v
  }

  function scroll(x, y, type) {
    var el = this[0]
    if (!el) return this
    if (x == null && y == null) {
      return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
    }
    if (isBody(el)) {
      win.scrollTo(x, y)
    } else {
      x != null && (el.scrollLeft = x)
      y != null && (el.scrollTop = y)
    }
    return this
  }

  /**
   * @constructor
   * @param {Array.<Element>|Element|Node|string} elements
   */
  function Bonzo(elements) {
    this.length = 0
    if (elements) {
      elements = typeof elements !== 'string' &&
        !elements.nodeType &&
        typeof elements.length !== 'undefined' ?
          elements :
          [elements]
      this.length = elements.length
      for (var i = 0; i < elements.length; i++) this[i] = elements[i]
    }
  }

  Bonzo.prototype = {

      /**
       * @param {number} index
       * @return {Element|Node}
       */
      get: function (index) {
        return this[index] || null
      }

      // itetators
      /**
       * @param {function(Element|Node)} fn
       * @param {Object=} opt_scope
       * @return {Bonzo}
       */
    , each: function (fn, opt_scope) {
        return each(this, fn, opt_scope)
      }

      /**
       * @param {Function} fn
       * @param {Object=} opt_scope
       * @return {Bonzo}
       */
    , deepEach: function (fn, opt_scope) {
        return deepEach(this, fn, opt_scope)
      }


      /**
       * @param {Function} fn
       * @param {Function=} opt_reject
       * @return {Array}
       */
    , map: function (fn, opt_reject) {
        var m = [], n, i
        for (i = 0; i < this.length; i++) {
          n = fn.call(this, this[i], i)
          opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
        }
        return m
      }

    // text and html inserters!

    /**
     * @param {string} h the HTML to insert
     * @param {boolean=} opt_text whether to set or get text content
     * @return {Bonzo|string}
     */
    , html: function (h, opt_text) {
        var method = opt_text
              ? html.textContent === undefined ? 'innerText' : 'textContent'
              : 'innerHTML'
          , that = this
          , append = function (el, i) {
              each(normalize(h, that, i), function (node) {
                el.appendChild(node)
              })
            }
          , updateElement = function (el, i) {
              try {
                if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                  return el[method] = h
                }
              } catch (e) {}
              append(el, i)
            }
        return typeof h != 'undefined'
          ? this.empty().each(updateElement)
          : this[0] ? this[0][method] : ''
      }

      /**
       * @param {string=} opt_text the text to set, otherwise this is a getter
       * @return {Bonzo|string}
       */
    , text: function (opt_text) {
        return this.html(opt_text, true)
      }

      // more related insertion methods

      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , append: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el.appendChild(i)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , prepend: function (node) {
        var that = this
        return this.each(function (el, i) {
          var first = el.firstChild
          each(normalize(node, that, i), function (i) {
            el.insertBefore(i, first)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , appendTo: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t.appendChild(el)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , prependTo: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t.insertBefore(el, t.firstChild)
        }, 1)
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , before: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el[parentNode].insertBefore(i, el)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , after: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el[parentNode].insertBefore(i, el.nextSibling)
          }, null, 1)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , insertBefore: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t[parentNode].insertBefore(el, t)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , insertAfter: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          var sibling = t.nextSibling
          sibling ?
            t[parentNode].insertBefore(el, sibling) :
            t[parentNode].appendChild(el)
        }, 1)
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , replaceWith: function (node) {
        bonzo(normalize(node)).insertAfter(this)
        return this.remove()
      }

      /**
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , clone: function (opt_host) {
        var ret = [] // don't change original array
          , l, i
        for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
        return bonzo(ret)
      }

      // class management

      /**
       * @param {string} c
       * @return {Bonzo}
       */
    , addClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          // we `each` here so you can do $el.addClass('foo bar')
          each(c, function (c) {
            if (c && !hasClass(el, setter(el, c)))
              addClass(el, setter(el, c))
          })
        })
      }


      /**
       * @param {string} c
       * @return {Bonzo}
       */
    , removeClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          each(c, function (c) {
            if (c && hasClass(el, setter(el, c)))
              removeClass(el, setter(el, c))
          })
        })
      }


      /**
       * @param {string} c
       * @return {boolean}
       */
    , hasClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return some(this, function (el) {
          return some(c, function (c) {
            return c && hasClass(el, c)
          })
        })
      }


      /**
       * @param {string} c classname to toggle
       * @param {boolean=} opt_condition whether to add or remove the class straight away
       * @return {Bonzo}
       */
    , toggleClass: function (c, opt_condition) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          each(c, function (c) {
            if (c) {
              typeof opt_condition !== 'undefined' ?
                opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
            }
          })
        })
      }

      // display togglers

      /**
       * @param {string=} opt_type useful to set back to anything other than an empty string
       * @return {Bonzo}
       */
    , show: function (opt_type) {
        opt_type = typeof opt_type == 'string' ? opt_type : ''
        return this.each(function (el) {
          el.style.display = opt_type
        })
      }


      /**
       * @return {Bonzo}
       */
    , hide: function () {
        return this.each(function (el) {
          el.style.display = 'none'
        })
      }


      /**
       * @param {Function=} opt_callback
       * @param {string=} opt_type
       * @return {Bonzo}
       */
    , toggle: function (opt_callback, opt_type) {
        opt_type = typeof opt_type == 'string' ? opt_type : '';
        typeof opt_callback != 'function' && (opt_callback = null)
        return this.each(function (el) {
          el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
          opt_callback && opt_callback.call(el)
        })
      }


      // DOM Walkers & getters

      /**
       * @return {Element|Node}
       */
    , first: function () {
        return bonzo(this.length ? this[0] : [])
      }


      /**
       * @return {Element|Node}
       */
    , last: function () {
        return bonzo(this.length ? this[this.length - 1] : [])
      }


      /**
       * @return {Element|Node}
       */
    , next: function () {
        return this.related('nextSibling')
      }


      /**
       * @return {Element|Node}
       */
    , previous: function () {
        return this.related('previousSibling')
      }


      /**
       * @return {Element|Node}
       */
    , parent: function() {
        return this.related(parentNode)
      }


      /**
       * @private
       * @param {string} method the directional DOM method
       * @return {Element|Node}
       */
    , related: function (method) {
        return bonzo(this.map(
          function (el) {
            el = el[method]
            while (el && el.nodeType !== 1) {
              el = el[method]
            }
            return el || 0
          },
          function (el) {
            return el
          }
        ))
      }


      /**
       * @return {Bonzo}
       */
    , focus: function () {
        this.length && this[0].focus()
        return this
      }


      /**
       * @return {Bonzo}
       */
    , blur: function () {
        this.length && this[0].blur()
        return this
      }

      // style getter setter & related methods

      /**
       * @param {Object|string} o
       * @param {string=} opt_v
       * @return {Bonzo|string}
       */
    , css: function (o, opt_v) {
        var p, iter = o
        // is this a request for just getting a style?
        if (opt_v === undefined && typeof o == 'string') {
          // repurpose 'v'
          opt_v = this[0]
          if (!opt_v) return null
          if (opt_v === doc || opt_v === win) {
            p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
            return o == 'width' ? p.width : o == 'height' ? p.height : ''
          }
          return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
        }

        if (typeof o == 'string') {
          iter = {}
          iter[o] = opt_v
        }

        if (!features.opasity && 'opacity' in iter) {
          // oh this 'ol gamut
          iter.filter = iter.opacity != null && iter.opacity !== ''
            ? 'alpha(opacity=' + (iter.opacity * 100) + ')'
            : ''
          // give it layout
          iter.zoom = o.zoom || 1
          ;delete iter.opacity
        }

        function fn(el, p, v) {
          for (var k in iter) {
            if (iter.hasOwnProperty(k)) {
              v = iter[k];
              // change "5" to "5px" - unless you're line-height, which is allowed
              (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
              try { el.style[p] = setter(el, v) } catch(e) {}
            }
          }
        }
        return this.each(fn)
      }


      /**
       * @param {number=} opt_x
       * @param {number=} opt_y
       * @return {Bonzo|number}
       */
    , offset: function (opt_x, opt_y) {
        if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
          return this.each(function (el) {
            xy(el, opt_x.left, opt_x.top)
          })
        } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
          return this.each(function (el) {
            xy(el, opt_x, opt_y)
          })
        }
        if (!this[0]) return {
            top: 0
          , left: 0
          , height: 0
          , width: 0
        }
        var el = this[0]
          , de = el.ownerDocument.documentElement
          , bcr = el.getBoundingClientRect()
          , scroll = getWindowScroll()
          , width = el.offsetWidth
          , height = el.offsetHeight
          , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
          , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)

        return {
            top: top
          , left: left
          , height: height
          , width: width
        }
      }


      /**
       * @return {number}
       */
    , dim: function () {
        if (!this.length) return { height: 0, width: 0 }
        var el = this[0]
          , de = el.nodeType == 9 && el.documentElement // document
          , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
             // el isn't visible, can't be measured properly, so fix that
             function (t) {
               var s = {
                   position: el.style.position || ''
                 , visibility: el.style.visibility || ''
                 , display: el.style.display || ''
               }
               t.first().css({
                   position: 'absolute'
                 , visibility: 'hidden'
                 , display: 'block'
               })
               return s
            }(this) : null
          , width = de
              ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
              : el.offsetWidth
          , height = de
              ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
              : el.offsetHeight

        orig && this.first().css(orig)
        return {
            height: height
          , width: width
        }
      }

      // attributes are hard. go shopping

      /**
       * @param {string} k an attribute to get or set
       * @param {string=} opt_v the value to set
       * @return {Bonzo|string}
       */
    , attr: function (k, opt_v) {
        var el = this[0]
          , n

        if (typeof k != 'string' && !(k instanceof String)) {
          for (n in k) {
            k.hasOwnProperty(n) && this.attr(n, k[n])
          }
          return this
        }

        return typeof opt_v == 'undefined' ?
          !el ? null : specialAttributes.test(k) ?
            stateAttributes.test(k) && typeof el[k] == 'string' ?
              true : el[k] : (k == 'href' || k =='src') && features.hrefExtended ?
                el[getAttribute](k, 2) : el[getAttribute](k) :
          this.each(function (el) {
            specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
          })
      }


      /**
       * @param {string} k
       * @return {Bonzo}
       */
    , removeAttr: function (k) {
        return this.each(function (el) {
          stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
        })
      }


      /**
       * @param {string=} opt_s
       * @return {Bonzo|string}
       */
    , val: function (s) {
        return (typeof s == 'string' || typeof s == 'number') ?
          this.attr('value', s) :
          this.length ? this[0].value : null
      }

      // use with care and knowledge. this data() method uses data attributes on the DOM nodes
      // to do this differently costs a lot more code. c'est la vie
      /**
       * @param {string|Object=} opt_k the key for which to get or set data
       * @param {Object=} opt_v
       * @return {Bonzo|Object}
       */
    , data: function (opt_k, opt_v) {
        var el = this[0], o, m
        if (typeof opt_v === 'undefined') {
          if (!el) return null
          o = data(el)
          if (typeof opt_k === 'undefined') {
            each(el.attributes, function (a) {
              (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
            })
            return o
          } else {
            if (typeof o[opt_k] === 'undefined')
              o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
            return o[opt_k]
          }
        } else {
          return this.each(function (el) { data(el)[opt_k] = opt_v })
        }
      }

      // DOM detachment & related

      /**
       * @return {Bonzo}
       */
    , remove: function () {
        this.deepEach(clearData)
        return this.detach()
      }


      /**
       * @return {Bonzo}
       */
    , empty: function () {
        return this.each(function (el) {
          deepEach(el.childNodes, clearData)

          while (el.firstChild) {
            el.removeChild(el.firstChild)
          }
        })
      }


      /**
       * @return {Bonzo}
       */
    , detach: function () {
        return this.each(function (el) {
          el[parentNode] && el[parentNode].removeChild(el)
        })
      }

      // who uses a mouse anyway? oh right.

      /**
       * @param {number} y
       */
    , scrollTop: function (y) {
        return scroll.call(this, null, y, 'y')
      }


      /**
       * @param {number} x
       */
    , scrollLeft: function (x) {
        return scroll.call(this, x, null, 'x')
      }

  }


  function cloneNode(host, el) {
    var c = el.cloneNode(true)
      , cloneElems
      , elElems
      , i

    // check for existence of an event cloner
    // preferably https://github.com/fat/bean
    // otherwise Bonzo won't do this for you
    if (host.$ && typeof host.cloneEvents == 'function') {
      host.$(c).cloneEvents(el)

      // clone events from every child node
      cloneElems = host.$(c).find('*')
      elElems = host.$(el).find('*')

      for (i = 0; i < elElems.length; i++)
        host.$(cloneElems[i]).cloneEvents(elElems[i])
    }
    return c
  }

  function isBody(element) {
    return element === win || (/^(?:body|html)$/i).test(element.tagName)
  }

  function getWindowScroll() {
    return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
  }

  function createScriptFromHtml(html) {
    var scriptEl = document.createElement('script')
      , matches = html.match(simpleScriptTagRe)
    scriptEl.src = matches[1]
    return scriptEl
  }

  /**
   * @param {Array.<Element>|Element|Node|string} els
   * @return {Bonzo}
   */
  function bonzo(els) {
    return new Bonzo(els)
  }

  bonzo.setQueryEngine = function (q) {
    query = q;
    delete bonzo.setQueryEngine
  }

  bonzo.aug = function (o, target) {
    // for those standalone bonzo users. this love is for you.
    for (var k in o) {
      o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
    }
  }

  bonzo.create = function (node) {
    // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
    return typeof node == 'string' && node !== '' ?
      function () {
        if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
        var tag = node.match(/^\s*<([^\s>]+)/)
          , el = doc.createElement('div')
          , els = []
          , p = tag ? tagMap[tag[1].toLowerCase()] : null
          , dep = p ? p[2] + 1 : 1
          , ns = p && p[3]
          , pn = parentNode
          , tb = features.autoTbody && p && p[0] == '<table>' && !(/<tbody/i).test(node)

        el.innerHTML = p ? (p[0] + node + p[1]) : node
        while (dep--) el = el.firstChild
        // for IE NoScope, we may insert cruft at the begining just to get it to work
        if (ns && el && el.nodeType !== 1) el = el.nextSibling
        do {
          // tbody special case for IE<8, creates tbody on any empty table
          // we don't want it if we're just after a <thead>, <caption>, etc.
          if ((!tag || el.nodeType == 1) && (!tb || (el.tagName && el.tagName != 'TBODY'))) {
            els.push(el)
          }
        } while (el = el.nextSibling)
        // IE < 9 gives us a parentNode which messes up insert() check for cloning
        // `dep` > 1 can also cause problems with the insert() check (must do this last)
        each(els, function(el) { el[pn] && el[pn].removeChild(el) })
        return els
      }() : isNode(node) ? [node.cloneNode(true)] : []
  }

  bonzo.doc = function () {
    var vp = bonzo.viewport()
    return {
        width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
      , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
    }
  }

  bonzo.firstChild = function (el) {
    for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
      if (c[i].nodeType === 1) e = c[j = i]
    }
    return e
  }

  bonzo.viewport = function () {
    return {
        width: ie ? html.clientWidth : win.innerWidth
      , height: ie ? html.clientHeight : win.innerHeight
    }
  }

  bonzo.isAncestor = 'compareDocumentPosition' in html ?
    function (container, element) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (container, element) {
      return container !== element && container.contains(element);
    } :
    function (container, element) {
      while (element = element[parentNode]) {
        if (element === container) {
          return true
        }
      }
      return false
    }

  return bonzo
}); // the only line we care about using a semi-colon. placed here for concatenation tools

},{}],14:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],15:[function(require,module,exports){
/*!
  * @preserve Qwery - A Blazing Fast query selector engine
  * https://github.com/ded/qwery
  * copyright Dustin Diaz 2012
  * MIT License
  */

(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('qwery', this, function () {
  var doc = document
    , html = doc.documentElement
    , byClass = 'getElementsByClassName'
    , byTag = 'getElementsByTagName'
    , qSA = 'querySelectorAll'
    , useNativeQSA = 'useNativeQSA'
    , tagName = 'tagName'
    , nodeType = 'nodeType'
    , select // main select() method, assign later

    , id = /#([\w\-]+)/
    , clas = /\.[\w\-]+/g
    , idOnly = /^#([\w\-]+)$/
    , classOnly = /^\.([\w\-]+)$/
    , tagOnly = /^([\w\-]+)$/
    , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
    , splittable = /(^|,)\s*[>~+]/
    , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
    , splitters = /[\s\>\+\~]/
    , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
    , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
    , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
    , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
    , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
    , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
    , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
    , tokenizr = new RegExp(splitters.source + splittersMore.source)
    , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')

  var walker = {
      ' ': function (node) {
        return node && node !== html && node.parentNode
      }
    , '>': function (node, contestant) {
        return node && node.parentNode == contestant.parentNode && node.parentNode
      }
    , '~': function (node) {
        return node && node.previousSibling
      }
    , '+': function (node, contestant, p1, p2) {
        if (!node) return false
        return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
      }
    }

  function cache() {
    this.c = {}
  }
  cache.prototype = {
    g: function (k) {
      return this.c[k] || undefined
    }
  , s: function (k, v, r) {
      v = r ? new RegExp(v) : v
      return (this.c[k] = v)
    }
  }

  var classCache = new cache()
    , cleanCache = new cache()
    , attrCache = new cache()
    , tokenCache = new cache()

  function classRegex(c) {
    return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
  }

  // not quite as fast as inline loops in older browsers so don't use liberally
  function each(a, fn) {
    var i = 0, l = a.length
    for (; i < l; i++) fn(a[i])
  }

  function flatten(ar) {
    for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
    return r
  }

  function arrayify(ar) {
    var i = 0, l = ar.length, r = []
    for (; i < l; i++) r[i] = ar[i]
    return r
  }

  function previous(n) {
    while (n = n.previousSibling) if (n[nodeType] == 1) break;
    return n
  }

  function q(query) {
    return query.match(chunker)
  }

  // called using `this` as element and arguments from regex group results.
  // given => div.hello[title="world"]:foo('bar')
  // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
  function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
    var i, m, k, o, classes
    if (this[nodeType] !== 1) return false
    if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
    if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
    if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
      for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
    }
    if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
    if (wholeAttribute && !value) { // select is just for existance of attrib
      o = this.attributes
      for (k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
          return this
        }
      }
    }
    if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
      // select is for attrib equality
      return false
    }
    return this
  }

  function clean(s) {
    return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
  }

  function checkAttr(qualify, actual, val) {
    switch (qualify) {
    case '=':
      return actual == val
    case '^=':
      return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
    case '$=':
      return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
    case '*=':
      return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
    case '~=':
      return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
    case '|=':
      return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
    }
    return 0
  }

  // given a selector, first check for simple cases then collect all base candidate matches and filter
  function _qwery(selector, _root) {
    var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
      , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      , dividedTokens = selector.match(dividers)

    if (!tokens.length) return r

    token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
    if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
    if (!root) return r

    intr = q(token)
    // collect base candidates to filter
    els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
      function (r) {
        while (root = root.nextSibling) {
          root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
        }
        return r
      }([]) :
      root[byTag](intr[1] || '*')
    // filter elements according to the right-most part of the selector
    for (i = 0, l = els.length; i < l; i++) {
      if (item = interpret.apply(els[i], intr)) r[r.length] = item
    }
    if (!tokens.length) return r

    // filter further according to the rest of the selector (the left side)
    each(r, function (e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
    return ret
  }

  // compare element to a selector
  function is(el, selector, root) {
    if (isNode(selector)) return el == selector
    if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?

    var selectors = selector.split(','), tokens, dividedTokens
    while (selector = selectors.pop()) {
      tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      dividedTokens = selector.match(dividers)
      tokens = tokens.slice(0) // copy array
      if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
        return true
      }
    }
    return false
  }

  // given elements matching the right-most part of a selector, filter out any that don't match the rest
  function ancestorMatch(el, tokens, dividedTokens, root) {
    var cand
    // recursively work backwards through the tokens and up the dom, covering all options
    function crawl(e, i, p) {
      while (p = walker[dividedTokens[i]](p, e)) {
        if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
          if (i) {
            if (cand = crawl(p, i - 1, p)) return cand
          } else return p
        }
      }
    }
    return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
  }

  function isNode(el, t) {
    return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
  }

  function uniq(ar) {
    var a = [], i, j;
    o:
    for (i = 0; i < ar.length; ++i) {
      for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
      a[a.length] = ar[i]
    }
    return a
  }

  function arrayLike(o) {
    return (typeof o === 'object' && isFinite(o.length))
  }

  function normalizeRoot(root) {
    if (!root) return doc
    if (typeof root == 'string') return qwery(root)[0]
    if (!root[nodeType] && arrayLike(root)) return root[0]
    return root
  }

  function byId(root, id, el) {
    // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
    return root[nodeType] === 9 ? root.getElementById(id) :
      root.ownerDocument &&
        (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
          (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
  }

  function qwery(selector, _root) {
    var m, el, root = normalizeRoot(_root)

    // easy, fast cases that we can dispatch with simple DOM calls
    if (!root || !selector) return []
    if (selector === window || isNode(selector)) {
      return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
    }
    if (selector && arrayLike(selector)) return flatten(selector)
    if (m = selector.match(easy)) {
      if (m[1]) return (el = byId(root, m[1])) ? [el] : []
      if (m[2]) return arrayify(root[byTag](m[2]))
      if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
    }

    return select(selector, root)
  }

  // where the root is not document and a relationship selector is first we have to
  // do some awkward adjustments to get it to work, even with qSA
  function collectSelector(root, collector) {
    return function (s) {
      var oid, nid
      if (splittable.test(s)) {
        if (root[nodeType] !== 9) {
          // make sure the el has an id, rewrite the query, set root to doc and run it
          if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
          s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
          collector(root.parentNode || root, s, true)
          oid || root.removeAttribute('id')
        }
        return;
      }
      s.length && collector(root, s, false)
    }
  }

  var isAncestor = 'compareDocumentPosition' in html ?
    function (element, container) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (element, container) {
      container = container[nodeType] === 9 || container == window ? html : container
      return container !== element && container.contains(element)
    } :
    function (element, container) {
      while (element = element.parentNode) if (element === container) return 1
      return 0
    }
  , getAttr = function () {
      // detect buggy IE src/href getAttribute() call
      var e = doc.createElement('p')
      return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
        function (e, a) {
          return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
            e.getAttribute(a, 2) : e.getAttribute(a)
        } :
        function (e, a) { return e.getAttribute(a) }
    }()
  , hasByClass = !!doc[byClass]
    // has native qSA support
  , hasQSA = doc.querySelector && doc[qSA]
    // use native qSA
  , selectQSA = function (selector, root) {
      var result = [], ss, e
      try {
        if (root[nodeType] === 9 || !splittable.test(selector)) {
          // most work is done right here, defer to qSA
          return arrayify(root[qSA](selector))
        }
        // special case where we need the services of `collectSelector()`
        each(ss = selector.split(','), collectSelector(root, function (ctx, s) {
          e = ctx[qSA](s)
          if (e.length == 1) result[result.length] = e.item(0)
          else if (e.length) result = result.concat(arrayify(e))
        }))
        return ss.length > 1 && result.length > 1 ? uniq(result) : result
      } catch (ex) { }
      return selectNonNative(selector, root)
    }
    // no native selector support
  , selectNonNative = function (selector, root) {
      var result = [], items, m, i, l, r, ss
      selector = selector.replace(normalizr, '$1')
      if (m = selector.match(tagAndOrClass)) {
        r = classRegex(m[2])
        items = root[byTag](m[1] || '*')
        for (i = 0, l = items.length; i < l; i++) {
          if (r.test(items[i].className)) result[result.length] = items[i]
        }
        return result
      }
      // more complex selector, get `_qwery()` to do the work for us
      each(ss = selector.split(','), collectSelector(root, function (ctx, s, rewrite) {
        r = _qwery(s, ctx)
        for (i = 0, l = r.length; i < l; i++) {
          if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
        }
      }))
      return ss.length > 1 && result.length > 1 ? uniq(result) : result
    }
  , configure = function (options) {
      // configNativeQSA: use fully-internal selector or native qSA where present
      if (typeof options[useNativeQSA] !== 'undefined')
        select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
    }

  configure({ useNativeQSA: true })

  qwery.configure = configure
  qwery.uniq = uniq
  qwery.is = is
  qwery.pseudos = {}

  return qwery
});

},{}],16:[function(require,module,exports){
module.exports = hasKeys

function hasKeys(source) {
    return source !== null &&
        (typeof source === "object" ||
        typeof source === "function")
}

},{}],17:[function(require,module,exports){
var Keys = require("object-keys")
var hasKeys = require("./has-keys")

module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        if (!hasKeys(source)) {
            continue
        }

        var keys = Keys(source)

        for (var j = 0; j < keys.length; j++) {
            var name = keys[j]
            target[name] = source[name]
        }
    }

    return target
}

},{"./has-keys":16,"object-keys":19}],18:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var isFunction = function (fn) {
	var isFunc = (typeof fn === 'function' && !(fn instanceof RegExp)) || toString.call(fn) === '[object Function]';
	if (!isFunc && typeof window !== 'undefined') {
		isFunc = fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt;
	}
	return isFunc;
};

module.exports = function forEach(obj, fn) {
	if (!isFunction(fn)) {
		throw new TypeError('iterator must be a function');
	}
	var i, k,
		isString = typeof obj === 'string',
		l = obj.length,
		context = arguments.length > 2 ? arguments[2] : null;
	if (l === +l) {
		for (i = 0; i < l; i++) {
			if (context === null) {
				fn(isString ? obj.charAt(i) : obj[i], i, obj);
			} else {
				fn.call(context, isString ? obj.charAt(i) : obj[i], i, obj);
			}
		}
	} else {
		for (k in obj) {
			if (hasOwn.call(obj, k)) {
				if (context === null) {
					fn(obj[k], k, obj);
				} else {
					fn.call(context, obj[k], k, obj);
				}
			}
		}
	}
};


},{}],19:[function(require,module,exports){
module.exports = Object.keys || require('./shim');


},{"./shim":21}],20:[function(require,module,exports){
var toString = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toString.call(value);
	var isArguments = str === '[object Arguments]';
	if (!isArguments) {
		isArguments = str !== '[object Array]'
			&& value !== null
			&& typeof value === 'object'
			&& typeof value.length === 'number'
			&& value.length >= 0
			&& toString.call(value.callee) === '[object Function]';
	}
	return isArguments;
};


},{}],21:[function(require,module,exports){
(function () {
	"use strict";

	// modified from https://github.com/kriskowal/es5-shim
	var has = Object.prototype.hasOwnProperty,
		toString = Object.prototype.toString,
		forEach = require('./foreach'),
		isArgs = require('./isArguments'),
		hasDontEnumBug = !({'toString': null}).propertyIsEnumerable('toString'),
		hasProtoEnumBug = (function () {}).propertyIsEnumerable('prototype'),
		dontEnums = [
			"toString",
			"toLocaleString",
			"valueOf",
			"hasOwnProperty",
			"isPrototypeOf",
			"propertyIsEnumerable",
			"constructor"
		],
		keysShim;

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object',
			isFunction = toString.call(object) === '[object Function]',
			isArguments = isArgs(object),
			theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError("Object.keys called on a non-object");
		}

		if (isArguments) {
			forEach(object, function (value) {
				theKeys.push(value);
			});
		} else {
			var name,
				skipProto = hasProtoEnumBug && isFunction;

			for (name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(name);
				}
			}
		}

		if (hasDontEnumBug) {
			var ctor = object.constructor,
				skipConstructor = ctor && ctor.prototype === object;

			forEach(dontEnums, function (dontEnum) {
				if (!(skipConstructor && dontEnum === 'constructor') && has.call(object, dontEnum)) {
					theKeys.push(dontEnum);
				}
			});
		}
		return theKeys;
	};

	module.exports = keysShim;
}());


},{"./foreach":18,"./isArguments":20}],22:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};/*
 *
 * This is used to build the bundle with browserify.
 *
 * The bundle is used by people who doesn't use browserify.require
 * Those who use browserify will install with npm and require the module,
 * the package.json file points to index.js.
 */
var Auth0Widget = require('./widget');
var insertCss   = require('./vendor/insert-css');
var fs          = require('fs');

insertCss("@charset \"UTF-8\";#auth0-widget{/*!\n* CleanSlate\n*   github.com/premasagar/cleanslate\n*\n*//*!\n\tZocial Butons\n\thttp://zocial.smcllns.com\n\tby Sam Collins (@smcllns)\n\tLicense: http://opensource.org/licenses/mit-license.php\n\t\n\tYou are free to use and modify, as long as you keep this license comment intact or link back to zocial.smcllns.com on your site.\n*//*! normalize.css v1.0.1 | MIT License | git.io/normalize */}#auth0-widget .cleanslate,#auth0-widget .cleanslate h1,#auth0-widget .cleanslate h2,#auth0-widget .cleanslate h3,#auth0-widget .cleanslate h4,#auth0-widget .cleanslate h5,#auth0-widget .cleanslate h6,#auth0-widget .cleanslate p,#auth0-widget .cleanslate td,#auth0-widget .cleanslate dl,#auth0-widget .cleanslate tr,#auth0-widget .cleanslate dt,#auth0-widget .cleanslate ol,#auth0-widget .cleanslate form,#auth0-widget .cleanslate select,#auth0-widget .cleanslate option,#auth0-widget .cleanslate pre,#auth0-widget .cleanslate div,#auth0-widget .cleanslate table,#auth0-widget .cleanslate th,#auth0-widget .cleanslate tbody,#auth0-widget .cleanslate tfoot,#auth0-widget .cleanslate caption,#auth0-widget .cleanslate thead,#auth0-widget .cleanslate ul,#auth0-widget .cleanslate li,#auth0-widget .cleanslate address,#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate dd,#auth0-widget .cleanslate fieldset,#auth0-widget .cleanslate li,#auth0-widget .cleanslate iframe,#auth0-widget .cleanslate strong,#auth0-widget .cleanslate legend,#auth0-widget .cleanslate em,#auth0-widget .cleanslate s,#auth0-widget .cleanslate cite,#auth0-widget .cleanslate span,#auth0-widget .cleanslate input,#auth0-widget .cleanslate sup,#auth0-widget .cleanslate label,#auth0-widget .cleanslate dfn,#auth0-widget .cleanslate object,#auth0-widget .cleanslate big,#auth0-widget .cleanslate q,#auth0-widget .cleanslate font,#auth0-widget .cleanslate samp,#auth0-widget .cleanslate acronym,#auth0-widget .cleanslate small,#auth0-widget .cleanslate img,#auth0-widget .cleanslate strike,#auth0-widget .cleanslate code,#auth0-widget .cleanslate sub,#auth0-widget .cleanslate ins,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate var,#auth0-widget .cleanslate a,#auth0-widget .cleanslate abbr,#auth0-widget .cleanslate applet,#auth0-widget .cleanslate del,#auth0-widget .cleanslate kbd,#auth0-widget .cleanslate tt,#auth0-widget .cleanslate b,#auth0-widget .cleanslate i,#auth0-widget .cleanslate hr,#auth0-widget .cleanslate article,#auth0-widget .cleanslate aside,#auth0-widget .cleanslate dialog,#auth0-widget .cleanslate figure,#auth0-widget .cleanslate footer,#auth0-widget .cleanslate header,#auth0-widget .cleanslate hgroup,#auth0-widget .cleanslate menu,#auth0-widget .cleanslate nav,#auth0-widget .cleanslate section,#auth0-widget .cleanslate time,#auth0-widget .cleanslate mark,#auth0-widget .cleanslate audio,#auth0-widget .cleanslate video{background-attachment:scroll!important;background-color:transparent!important;background-image:none!important;background-position:0 0!important;background-repeat:repeat!important;border-color:black!important;border-color:currentColor!important;border-radius:0!important;border-style:none!important;border-width:medium!important;bottom:auto!important;clear:none!important;clip:auto!important;color:inherit!important;counter-increment:none!important;counter-reset:none!important;cursor:auto!important;direction:inherit!important;display:inline!important;float:none!important;font-family:inherit!important;font-size:inherit!important;font-style:inherit!important;font-variant:normal!important;font-weight:inherit!important;height:auto!important;left:auto!important;letter-spacing:normal!important;line-height:inherit!important;list-style-type:inherit!important;list-style-position:outside!important;list-style-image:none!important;margin:0!important;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:1;outline:invert none medium!important;overflow:visible!important;padding:0!important;position:static!important;quotes:\"\" \"\"!important;right:auto!important;table-layout:auto!important;text-align:inherit!important;text-decoration:inherit!important;text-indent:0!important;text-transform:none!important;top:auto!important;unicode-bidi:normal!important;vertical-align:baseline!important;visibility:inherit!important;white-space:normal!important;width:auto!important;word-spacing:normal!important;z-index:auto!important;-moz-border-radius:0!important;-webkit-border-radius:0!important;-moz-box-sizing:content-box!important;-webkit-box-sizing:content-box!important;box-sizing:content-box!important;text-shadow:none!important}#auth0-widget .cleanslate,#auth0-widget .cleanslate h3,#auth0-widget .cleanslate h5,#auth0-widget .cleanslate p,#auth0-widget .cleanslate h1,#auth0-widget .cleanslate dl,#auth0-widget .cleanslate dt,#auth0-widget .cleanslate h6,#auth0-widget .cleanslate ol,#auth0-widget .cleanslate form,#auth0-widget .cleanslate select,#auth0-widget .cleanslate option,#auth0-widget .cleanslate pre,#auth0-widget .cleanslate div,#auth0-widget .cleanslate h2,#auth0-widget .cleanslate caption,#auth0-widget .cleanslate h4,#auth0-widget .cleanslate ul,#auth0-widget .cleanslate address,#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate dd,#auth0-widget .cleanslate fieldset,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate hr,#auth0-widget .cleanslate article,#auth0-widget .cleanslate aside,#auth0-widget .cleanslate dialog,#auth0-widget .cleanslate figure,#auth0-widget .cleanslate footer,#auth0-widget .cleanslate header,#auth0-widget .cleanslate hgroup,#auth0-widget .cleanslate menu,#auth0-widget .cleanslate nav,#auth0-widget .cleanslate section{display:block!important}#auth0-widget .cleanslate table{display:table!important}#auth0-widget .cleanslate thead{display:table-header-group!important}#auth0-widget .cleanslate tbody{display:table-row-group!important}#auth0-widget .cleanslate tfoot{display:table-footer-group!important}#auth0-widget .cleanslate tr{display:table-row!important}#auth0-widget .cleanslate th,#auth0-widget .cleanslate td{display:table-cell!important}#auth0-widget .cleanslate nav ul,#auth0-widget .cleanslate nav ol{list-style-type:none!important}#auth0-widget .cleanslate ul,#auth0-widget .cleanslate menu{list-style-type:disc!important}#auth0-widget .cleanslate ol{list-style-type:decimal!important}#auth0-widget .cleanslate ol ul,#auth0-widget .cleanslate ul ul,#auth0-widget .cleanslate menu ul,#auth0-widget .cleanslate ol menu,#auth0-widget .cleanslate ul menu,#auth0-widget .cleanslate menu menu{list-style-type:circle!important}#auth0-widget .cleanslate ol ol ul,#auth0-widget .cleanslate ol ul ul,#auth0-widget .cleanslate ol menu ul,#auth0-widget .cleanslate ol ol menu,#auth0-widget .cleanslate ol ul menu,#auth0-widget .cleanslate ol menu menu,#auth0-widget .cleanslate ul ol ul,#auth0-widget .cleanslate ul ul ul,#auth0-widget .cleanslate ul menu ul,#auth0-widget .cleanslate ul ol menu,#auth0-widget .cleanslate ul ul menu,#auth0-widget .cleanslate ul menu menu,#auth0-widget .cleanslate menu ol ul,#auth0-widget .cleanslate menu ul ul,#auth0-widget .cleanslate menu menu ul,#auth0-widget .cleanslate menu ol menu,#auth0-widget .cleanslate menu ul menu,#auth0-widget .cleanslate menu menu menu{list-style-type:square!important}#auth0-widget .cleanslate li{display:list-item!important;min-height:auto!important;min-width:auto!important}#auth0-widget .cleanslate strong{font-weight:bold!important}#auth0-widget .cleanslate em{font-style:italic!important}#auth0-widget .cleanslate kbd,#auth0-widget .cleanslate samp,#auth0-widget .cleanslate code{font-family:monospace!important}#auth0-widget .cleanslate a,#auth0-widget .cleanslate a *,#auth0-widget .cleanslate input[type=submit],#auth0-widget .cleanslate input[type=radio],#auth0-widget .cleanslate input[type=checkbox],#auth0-widget .cleanslate select{cursor:pointer!important}#auth0-widget .cleanslate a:hover{text-decoration:underline!important}#auth0-widget .cleanslate button,#auth0-widget .cleanslate input[type=submit]{text-align:center!important}#auth0-widget .cleanslate input[type=hidden]{display:none!important}#auth0-widget .cleanslate abbr[title],#auth0-widget .cleanslate acronym[title],#auth0-widget .cleanslate dfn[title]{cursor:help!important;border-bottom-width:1px!important;border-bottom-style:dotted!important}#auth0-widget .cleanslate ins{background-color:#ff9!important;color:black!important}#auth0-widget .cleanslate del{text-decoration:line-through!important}#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate q{quotes:none!important}#auth0-widget .cleanslate blockquote:before,#auth0-widget .cleanslate blockquote:after,#auth0-widget .cleanslate q:before,#auth0-widget .cleanslate q:after,#auth0-widget .cleanslate li:before,#auth0-widget .cleanslate li:after{content:\"\"!important}#auth0-widget .cleanslate input,#auth0-widget .cleanslate select{vertical-align:middle!important}#auth0-widget .cleanslate select,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate input{border:1px solid #ccc!important}#auth0-widget .cleanslate table{border-collapse:collapse!important;border-spacing:0!important}#auth0-widget .cleanslate hr{display:block!important;height:1px!important;border:0!important;border-top:1px solid #ccc!important;margin:1em 0!important}#auth0-widget .cleanslate *[dir=rtl]{direction:rtl!important}#auth0-widget .cleanslate mark{background-color:#ff9!important;color:black!important;font-style:italic!important;font-weight:bold!important}#auth0-widget .cleanslate{font-size:medium!important;line-height:1!important;direction:ltr!important;text-align:left!important;font-family:\"Times New Roman\",Times,serif!important;color:black!important;font-style:normal!important;font-weight:normal!important;text-decoration:none!important;list-style-type:disc!important}#auth0-widget .zocial,#auth0-widget a.zocial{border:1px solid #777;border-color:rgba(0,0,0,0.2);border-bottom-color:#333;border-bottom-color:rgba(0,0,0,0.4);color:#fff;-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);cursor:pointer;display:inline-block;font:bold 100%/2.1 \"Lucida Grande\",Tahoma,sans-serif;padding:0 .95em 0 0;text-align:center;text-decoration:none;text-shadow:0 1px 0 rgba(0,0,0,0.5);white-space:nowrap;-moz-user-select:none;-webkit-user-select:none;user-select:none;position:relative;-moz-border-radius:.3em;-webkit-border-radius:.3em;border-radius:.3em}#auth0-widget .zocial:before{content:\"\";border-right:.075em solid rgba(0,0,0,0.1);float:left;font:120%/1.65 zocial;font-style:normal;font-weight:normal;margin:0 .5em 0 0;padding:0 .5em;text-align:center;text-decoration:none;text-transform:none;-moz-box-shadow:.075em 0 0 rgba(255,255,255,0.25);-webkit-box-shadow:.075em 0 0 rgba(255,255,255,0.25);box-shadow:.075em 0 0 rgba(255,255,255,0.25);-moz-font-smoothing:antialiased;-webkit-font-smoothing:antialiased;font-smoothing:antialiased}#auth0-widget .zocial:active{outline:0}#auth0-widget .zocial.icon{overflow:hidden;max-width:2.4em;padding-left:0;padding-right:0;max-height:2.15em;white-space:nowrap}#auth0-widget .zocial.icon:before{padding:0;width:2em;height:2em;box-shadow:none;border:0}#auth0-widget .zocial{background-image:-moz-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.1)),color-stop(49%,rgba(255,255,255,0.05)),color-stop(51%,rgba(0,0,0,0.05)),to(rgba(0,0,0,0.1)));background-image:-webkit-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1))}#auth0-widget .zocial:hover,#auth0-widget .zocial:focus{background-image:-moz-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-ms-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-o-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.15)),color-stop(49%,rgba(255,255,255,0.15)),color-stop(51%,rgba(0,0,0,0.1)),to(rgba(0,0,0,0.15)));background-image:-webkit-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15))}#auth0-widget .zocial:active{background-image:-moz-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.1)),color-stop(30%,rgba(255,255,255,0)),color-stop(50%,transparent),to(rgba(0,0,0,0.1)));background-image:-webkit-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1))}#auth0-widget .zocial.dropbox,#auth0-widget .zocial.github,#auth0-widget .zocial.gmail,#auth0-widget .zocial.openid,#auth0-widget .zocial.secondary,#auth0-widget .zocial.stackoverflow,#auth0-widget .zocial.salesforce{border:1px solid #aaa;border-color:rgba(0,0,0,0.3);border-bottom-color:#777;border-bottom-color:rgba(0,0,0,0.5);-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget .zocial.dropbox:focus,#auth0-widget .zocial.dropbox:hover,#auth0-widget .zocial.github:focus,#auth0-widget .zocial.github:hover,#auth0-widget .zocial.gmail:focus,#auth0-widget .zocial.gmail:hover,#auth0-widget .zocial.openid:focus,#auth0-widget .zocial.openid:hover,#auth0-widget .zocial.secondary:focus,#auth0-widget .zocial.secondary:hover,#auth0-widget .zocial.stackoverflow:focus,#auth0-widget .zocial.stackoverflow:hover,#auth0-widget .zocial.twitter:focus .zocial.twitter:hover,#auth0-widget .zocial.salesforce:focus .zocial.salesforce:hover{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.5)),color-stop(49%,rgba(255,255,255,0.2)),color-stop(51%,rgba(0,0,0,0.05)),to(rgba(0,0,0,0.15)));background-image:-moz-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-webkit-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-o-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-ms-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15))}#auth0-widget .zocial.dropbox:active,#auth0-widget .zocial.github:active,#auth0-widget .zocial.gmail:active,#auth0-widget .zocial.openid:active,#auth0-widget .zocial.secondary:active,#auth0-widget .zocial.stackoverflow:active,#auth0-widget .zocial.wikipedia:active,#auth0-widget .zocial.salesforce:active{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0)),color-stop(30%,rgba(255,255,255,0)),color-stop(50%,rgba(0,0,0,0)),to(rgba(0,0,0,0.1)));background-image:-moz-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-webkit-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1))}#auth0-widget .zocial.amazon:before{content:\"a\"}#auth0-widget .zocial.dropbox:before{content:\"d\";color:#1f75cc}#auth0-widget .zocial.facebook:before{content:\"f\"}#auth0-widget .zocial.github:before{content:\"\\00E8\"}#auth0-widget .zocial.gmail:before{content:\"m\";color:#f00}#auth0-widget .zocial.google:before{content:\"G\"}#auth0-widget .zocial.googleplus:before{content:\"+\"}#auth0-widget .zocial.guest:before{content:\"?\"}#auth0-widget .zocial.ie:before{content:\"6\"}#auth0-widget .zocial.linkedin:before{content:\"L\"}#auth0-widget .zocial.openid:before{content:\"o\";color:#ff921d}#auth0-widget .zocial.paypal:before{content:\"$\"}#auth0-widget .zocial.stackoverflow:before{content:\"\\00EC\";color:#ff7a15}#auth0-widget .zocial.twitter:before{content:\"T\"}#auth0-widget .zocial.vk:before{content:\"N\"}#auth0-widget .zocial.windows:before{content:\"W\"}#auth0-widget .zocial.yahoo:before{content:\"Y\"}#auth0-widget .zocial.office365:before{content:\"z\"}#auth0-widget .zocial.thirtysevensignals:before{content:\"b\"}#auth0-widget .zocial.salesforce:before{content:\"*\"}#auth0-widget .zocial.waad:before{content:\"z\"}#auth0-widget .zocial.box:before{content:\"x\"}#auth0-widget .zocial.amazon{background-color:#ffad1d;color:#030037;text-shadow:0 1px 0 rgba(255,255,255,0.5)}#auth0-widget .zocial.dropbox{background-color:#fff;color:#312c2a}#auth0-widget .zocial.facebook{background-color:#4863ae}#auth0-widget .zocial.github{background-color:#fbfbfb;color:#050505}#auth0-widget .zocial.gmail{background-color:#efefef;color:#222}#auth0-widget .zocial.google{background-color:#4e6cf7}#auth0-widget .zocial.googleplus{background-color:#dd4b39}#auth0-widget .zocial.guest{background-color:#1b4d6d}#auth0-widget .zocial.ie{background-color:#00a1d9}#auth0-widget .zocial.linkedin{background-color:#0083a8}#auth0-widget .zocial.openid{background-color:#f5f5f5;color:#333}#auth0-widget .zocial.paypal{background-color:#fff;color:#32689a;text-shadow:0 1px 0 rgba(255,255,255,0.5)}#auth0-widget .zocial.twitter{background-color:#46c0fb}#auth0-widget .zocial.vk{background-color:#45688e}#auth0-widget .zocial.windows{background-color:#0052a4;color:#fff}#auth0-widget .zocial.office365{background-color:#00aced;color:#fff}#auth0-widget .zocial.waad{background-color:#00adef;color:#fff}#auth0-widget .zocial.thirtysevensignals{background-color:#6ac071;color:#fff}#auth0-widget .zocial.box{background-color:#267bb6;color:#fff}#auth0-widget .zocial.salesforce{background-color:#fff;color:#f00}#auth0-widget .zocial.windows{background-color:#2672ec;color:#fff}#auth0-widget .zocial.primary,#auth0-widget .zocial.secondary{margin:.1em 0;padding:0 1em}#auth0-widget .zocial.primary:before,#auth0-widget .zocial.secondary:before{display:none}#auth0-widget .zocial.primary{background-color:#333}#auth0-widget .zocial.secondary{background-color:#f0f0eb;color:#222;text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget button:-moz-focus-inner{border:0;padding:0}@font-face{font-family:'zocial';src:url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.eot')}@font-face{font-family:'zocial';src:url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABeQAA0AAAAAIGgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABMAAAABoAAAAcZnuAykdERUYAAAFMAAAAHwAAACAATgAGT1MvMgAAAWwAAABIAAAAVk/l3EBjbWFwAAABtAAAAPYAAAIKnl567Gdhc3AAAAKsAAAACAAAAAj//wADZ2x5ZgAAArQAABKLAAAZsAMpJrBoZWFkAAAVQAAAADAAAAA2/3JSWWhoZWEAABVwAAAAIAAAACQFfQH5aG10eAAAFZAAAABjAAAAgDtOAbdsb2NhAAAV9AAAAEQAAABEWZZf+G1heHAAABY4AAAAHgAAACAAcAC+bmFtZQAAFlgAAADeAAABhlbD9/Jwb3N0AAAXOAAAAFYAAABsUemhhHicY2BgYGQAgpOd+YYg+lwlxxkYDQBA+QYqAAB4nGNgZGBg4ANiCQYQYGJgZGBmUACSLGAeAwAFxABVAHicY2BkEmOcwMDKwMHow5jGwMDgDqW/MkgytDAwMDGwMjPAALMAAwIEpLmmMDgwKH5gYHzw/wGDHuNrBvUGBgZGkBwAj6YLSHictZC9LkRRFIW/O67xzx2GYQwzElHMNBMvoBKNqIQoiVBKJBLxMlSimnJoKGi8gxeQUCh1y7o/jZurtJO1917n7HWy1wEGSNEgcCYIzYKEh7y7rtNyN+1ulTU6dNlgky222WGXfQ444phTzjjngkuurPr8QopfY8Wadk6zZ82hNSfFGn3rTR961Yue9aRHPehefZ/3jFv1dKcbXaujdpRu2qU4WhnyUbe3pj1F1KhQtecyqfnYf8mplFPEl/VGM2TZzWA5Plr8PTGU5GFG4jLKWELHmZhkKpuIav7ESjVjs8lqSzDPQtHuM8bcH77+JX4A6/Y7NwAAAAAAAf//AAJ4nJ1YeYwkV32u33tV79V9H313T/f0MdMzPdNnzeGZ2WN2vYftXXbXF2vvrtc2uw7GDkZADARI2BChiFh2hL1BcsAKicLhkEgJRJEwREFKLMcRoBAnUkKwEsFi5AASOIqTzOT3qmcdkv9I1/T0O6pevXrv+33f9ysJJGn320SCb0tEkjyYIdIOVnYk8ZGx77vwA7gmWVJF6kjLkjQOhoMK4TZ0gTeSYTocTNJJO95rCERD0sNysgnpaDJu3PtyfrntqM5bts/Vrgyv1M4dut+1Z13decuhu2ceev98vA+4nHP3zea6ClmvwvNBa719+OTV9KmThw51W/1DJ58C6xxx/PdBowAySGR3d/cazvd7Uk3axBmPJlvAojCp0ChkjXqrzePEJqJAW+NkNBkO4iRttQebIEpBjGc5MBmPWu2Wa91f+yWnUPYbSWV/NFdeVGJPtSJ6Bl5qRPktu9rrw0KZZy2udSx3dO12eAhruWb/3FCxo6IT55LgrOsCkz0TLjCaBJHv3JFTTeZaO59kFE/2ZudXjgUVScZ5f4ech+9KbekG6bB0CtdyNFmH1niUinlnFd6oQBTiYkZhnIhi1pOGMS7zeNTusXar0WJpBYbxpEeYMh6Oh9EwakSN8dn9xUhV9PH2mcknZge54mJglOxq7syR7XOrNyxupBRklVuqL4fB0qE6G1Qrs/pwYxZmLuUvXcpvLxwOc44DB5eXDhe0YW1p1vYtraLHvUZvezjvzfYXmzpXdJ0ZikkZ9P9zbg3SN62QyUhcfumSBBIgVn4V/hhxIqWjFPdfPNMAF5xnD8W4LTfqrAu4NdkxBmbu73b23bGvMznaJAr1a0ELQIHNwklFky0tOGXEC0e92mBhY2NhUAvuSpdURVUtVVbAszWTqmpDoojRa/As4uEh6f3SRwQiUoTkOogV24C9SpzEyQChGU+PN6aDU8SJirNjm+Cisy51lLBCppdPpzmqR6EDjDfq2bx70G6l43TU5wJ2IT4PZ8pkGCejdgOLqqxpzrJqMO6zSK+EIbWNYtD3IqbIlKg2d6xcGKZtPWeqlk0AgBCgivjIWJJlh3plLwgX3SLRZcWmprO/aXI1oISeAwbKsm9SmDHMJKgSh6twLNQ5VQzVMCuWZigUVDUhjLNS6USvEtt3zMdFl5PCfFI08F5UVqmsU1FSGNcUYufbRby9PgSoFy0TUeIyxz8feYfhLqCGbcwrDJ4koHZBN5ATqMAxHM9wvPn/RnG2aohjXOc0a4Ns8aLwZ4AxXag3BJBJ2bNBGVZIxbN/RhzncojjQlxWtbkVKERlVTzff+2+Qlz4DnKeJ81LEhEcMoUMzpp6Q28dxgLfw0EZhggSnHjU34BGHNLZcsn3PL8MpdIjW2+X1XK8+siR9QPNtwM8PpxxvWLe9XbeC7ftfObLvu7lbv7iV2+6ZQVg2f0sRs9/SG3yNnhMehInMUWwgGy6hsGO7IawrTAE80isFmlvwjqt0jhBBOKyCSQiwDfpeLIlZ1eKtR5UIJu3jXxNkzAbI3sOgWScdQPBTEWvaMAxsSojKBDOCkcgIRcqBqNc4RCWgFGmMEZtolLNlXmzatmWbehczgAMxMLIpHouhyepqqHolseVwHZ1QnzNLylgMgaUyTo0o7CAVxq6Zum03qSWZnOTE5nX7aCzv5WMl0GVGYV3i3AAoETXPDo/R1SFyzKGyqqutmwmpqIhmrluIp69SDFNTU9UqsoWVEemlU0MyUSmslN2cg0OruowmWuyBjPFouHJYtJKl3iaCqTQ4CaRZ2bL2/dQT3NsxPlUF9+FuthHjONypshb4qcHGxAPewIDuL4C8QiPScq4+EahTXExHffNh+cOmrrtu4vrxVqx6i//2gl6fLLSWmza881mvl3ZvO3RQ289WyArgzZR1CM94nqrM43K+hHZs8Y3zWnJUl5x2yVvdPn80YW16XyukePIc/uR4zbpFoj7VhQMsEyDERatbFexPBwMpztty5zVBWER3F8beGllfkbVGNNVy7M0plIvNMyFggVyrHA/b64uLDI2DjSqj7aOToK4WU9U7ZQqeCCx4e6ZUcmlgq3y1W5zwd43We3nY6YUObEPdqryfJh3vNGDZ44vWiaSTgCGjjRDTf26l7hGfgHnHyBzrEsncFUxiLYEVhPegyXAydtYRz4e/u+2ABe6imuOGp4iqziA8P0/bQ2ObRN/6Pn50iie+Ium7blqcX0w9keeVyiO4rG/aFm+g20vjgMsZt3O2B+7XqE0bI+DhayttIZtI98tFkbV53RkTEWPnnM8gh/ze8/pZla3fQFNc+cHX7J9RD8xjOmpBqhf2uszxLlMk4Q+SYfIVxBHx/GZT+Pe4Y5VyTCJyxAKUeH1MswgjXRJfQNa6GYm+Pz4H7Wr1UdTFcZVOuRt0ba8CaIVz+RRM6FtniacEgS6tvobGDFk1WGgIbcfkwFryi9vK7JGKfyTiCRTW/+5d0ZcblCskNdlIPecn6/ZZIXA7+kUx1D+gPGLsiiUyoTwy4ARwt4ja7Kiil3k+JjyfR8jBsiUCx1J6c634OIKWZEyb3ONDHFvc9Lt0mXpo+gAJoKChAuYxEJrQTgyDJYtGE2EJKcCr11ATDIu2sfTba8oZRru0RZqGPJTmwl6ak3VYzhJN8mG0I5kOkqm6NlCZqQ2DQOhJBwVZxkI++CT999DdcI1rjkLD45O/vqKTD5erxbn7Co3EtnLU6Ktadp2z1qbUTSUYODIY3KXMg05UCflop/vDO4IPZTeyGQKVJzFl5DtjNBXlEQhoYcBgSQVEJZopmlQclaWj7XQqVJLYVqhvDIkuBdPNAaWqRCizRgOBMiKHA/SWyAVxdR8FhPXPmfFOrKuTJtUkVGeHFrjynIa5oDFWuK4lmx9HQegCvIWkjH1+w7eWV70sAK4pSA44jH0Qr+dxZiUojkUahyhSKJQZSbxsROH+idOcPPixXu/ebE/Pn7RtQYXX301i8/df9/9IeGoewbqXiQVJamdttMEIZbwtgPjJC0DTdI2Mk+SRuxtb/vE5bd+/P77n758ebB8+cmnrj6Fs7k0eun06ct33nnvmdvPnzxZL5dOwhdg/dx9t+088AU4Wa3hfTDL2H0FduH7OEd0DzeA2MdsG7MdFx4rFWKG9Lpnv9LWlBAmgmYnGPR8Dx0cd/4N5tvbdjzCufNLDyydm4uiuXNYOD8XducPRYZd8JcKpm0oapCvblRD3+XcMgolNx8VooPdec8rlztz3bn5dqXseV+8vHy+E0Wd8/37+xfmwnDuwr1HVleSuaqF9GeUj7aLlQZhnoqGjgE0KsX2ahmlhNiVuWR19caFDo7i+r5brrQ7Ess86su4L21Uk3XpoHSj9ADyXxhnLrMxD42WcBT4JBgYaDPwWZgwT0LXbZhkWYxwUXxqqFm95YsSFigmAOkw6qO4Z15qi2SBsASjNu5/Y4y7vnV2375FxIdpNgeyo+arNFdqT/KhbSWlzdhxYvxGxWYR/z6Ta+RyDXs7VyZOGDCO3hXlFWIT2Q9pY2lps5zO9HoztZ5RcMho1jaovO6641ZuzvJDPzTqX6zncvXcH1lBYNlBAFfEeLmdb7322p897sY6Q3+ryEMOwPH76HhpaerfSRfXZhYzhxRXpbUpb0FkK840r5OrEPWUseKlXiBkrQo8GWfiAMX50ahrWeV+JWdy4RVYsT5b1vTByf6sq4F81KNBGBtG95OT6Fix+HQtnS25BpAt4sb5HD4fVw3dz0UWkuZYKdSajbL6OfjrwU4HuOAB1ev8YjUuEsHhXPgBeAJ5nGOEOIjeBGOkKknROOEzuAtNDLExRkv7p74YKryNcdHZ+dHzzyvPy182/9x6On42ub3xrlmzO9Ot/S187rN/8/PzxxfC7oPz6fxvNS+3vpH/VP6f+V/wLFZ8SScJ/Im0IX0AIzq+nr+kk71jD/r/c6A2XI+D6wfSYxLG6eiNi5A2JxVZjDN8oykRVnI6uqDf69fuDbvcChkz3Up3brQ6Thfm6zrjKDFIRVY+rlabYWJaClFdRQgFM80kbtcqUajho9dRILlHDY37LlMMqlMVbI1zbmACrdsKUyhVwshxfY2F4GsAfr+7ikzf6qK1gAdV7pg5y0Zjyjyvoqm6qjksUOSVfne2ERpc+DjceUVzivOd0WAVs0LREKM15GFJ8Ww1p6BgoaUBR6agmaWGYRPBySA7kRvErtakVZ9ALXARnIrjlbhGhV95QqrQy/B53OO2tCSUG+oMcYfLO+6PWhigfQy7zHxl/0ctud7KojLe+03a6XjSw8yxz9v9Hmpd0k94n1WQtPppgtduQpvkOwd9/0BnqeUmHpxa6xzw/YOdtVOndn54eDA43P/L7P9rR45w2U/45hZPfMqOHEH6R3RtYk3msDJXr8+V3m24rvHK2ptE5fQ7T73cz67M/m9cuABaYlHt9GmNWol2zwU9tqc1O0Z3piC2/wHj+9uZT1MlU3LRp/TTiCdRe5w2Iwui5vgb+Pk+JDvfy75PlV+A+IXy5/9l7sc0/+POX009nin58BNcs560Ld0lPSxJAeZJEwEpgbJNwNIb0Opl1B8P46xnCmVlggi8fkJ93NoD52B6pQ3t+h4is3Y+mUKWh3tI7YFJHM3nbJ8PcFSTA03TaO5ux3bifF0zCHpgH2LL1FHN6VlHhic0Dzedt5p51+YIaDVMqsUR0RVFMwnidHGm7KMoE6Kauea7ZG7lOn0LXEMLZmuuyuA3NQs8+1NdAl/JaapMA33tWtsLuKqAqzkiBTH0PLXQVfzjrBZTpBRfCV2RpRN0GJ4f+78i0OppOA5F7cf0FjMWmZ9GQdfcAvNcJjOzkHNUtJKSsvv67t/jPr2MHKQjNxSkuiQ1G7yRDpPGEvBZoQwIPVZnQloESLNfmDttHL/z5J03FwsFKF196erVl/LPPPLIM4+854lLl5649Ez71VfP3nrrO0T71QOPiJ4Ll0SPtHfPf4N/ha9LMWrXDZh93IiR0AOx4gwXPoqjCmQ+L51QhpuQbTPuFPYy3Ju96iR7N5CZwbag9XQicn54JTnWqRQeeKaoG/HjF868k0LUfW3fB5otdaHzvhSc+MYHNPXWjcMPGNQowy2HzmxsdjoHAN6xvZ0/ppBmBT5dCSydxfdexjShBG++T1ev3Fmr37Tzh0F/de3KpN9IQofqtx5be6uqv+nGhMOJh756w1xnH8CBuflHzf0HLBJsoZaLZ1Uznf4malFJulW6T3pQelT6iPSM9KcCx3Q4tSHCbgrbKnJmEP5E5IBZJrNJpnDNTqsQRKx412hTgdlGXbxCEka4nb1HSqcp+3DcFv6MX5dzLsbCBCASdhlZuwpDIeF4ow1oBD+V2kVisGkwjJKReCeLxtlWuiAyeSCm7aDQxl6IXjFBoTN116GkjplmYtmQr+ia64WK7CIAZXdURn5F6LG4PKoGMfcMS9G0vBlqkPN8dhC4Ud5fbjg5qtZ6tVrPRrp1SgXVJOccVT1Wq8oMqkUaBz6VY9dUQi9H5ZLB4a4Vr2BhpCmq4Wk0tCyTwmJQtFXww1BFSq7nZZxS2dFU5cca5t1xHvOoqOa7hpFRNQsnsV4p5dGSa5GB9oGI5EVk7p7nH+bcdWL2NHQjA9j+Xm//0usYOpot7zMUS7coefgMoOc+BkouHyn5EFWjnITomWM3Vj96sxOLOFWoa9g6ZjksH0qZ5n5w93U4C19DfZ9BpGdOLEEoo73aQhsd4u/YG9HrL7siOHN4cuSWuzEj6jJypiq35F5hptetVuFrp46fbzwrM+XTn1YUeIHtSuNxmv6dJFmSs/sa/AhexDj20EW0MLI2MK5OS3dLb5HeLr1XuiJJswISNtTTEJkwE5T2ng+st5TrjpC1mqJYgezVd9aQZn3pnk/EmKtP31GIOp0OhKXJtHM44G+Yy9a0BwsjvqdgDA6GlRii8tXIdqKoGjwbOXYUlaOdF0M0jaICQ1GCGIsfxpPwZMcJDzpRXM66I9uO8IQwKof4wTbbuRpm7U74nkoYTk+OsPRwOYxK4YdxxBDPvQ0vKUXhbW4QliIc0w7xN7TtEGLbCXAo0VIOr2BTFFlOuPMw9uPNwo/hTylsOKI3eF1cEZaWAyxXAtQ5S7oLXoWLmKdWpa40kNYwsjFSY8xUCaaYdqYxQkcmqPRIanFaIVNtGU04qhhrT7CKHRX4rFr0uemaqlfEfNh2882iZ6gy+VCix6NG8pPeupJozkQlUDK6dDWtfmiyZrQ4a8FFRCfT8c+SnYP1fjBDK2EhXNj3YvnIxpLyO7+rb5+ed/Xmpju79PvWSM7nW61czlpS1Z4k/Tc/tXiPAHicY2BkYGAA4qooY554fpuvDNxMDCBwrpLjDIz+//P/TeYMxtdALgcDWBoAKlkMKXicY2BkYGB8/f8mgx4Lw/+f/xiYMxiAIihAHgCk1AZ5eJxjYoCCVRCK8RMDAxOQZooDsjsYGBnXAGkvIF/k/z+m3P9/mEqBbBC/HIgPAbERUH4RQz8T2/9fIH2MD4BiWkB6ItgcIRYGhklg8xgYeJgY/v8GYcYrYH4DAz8DLwDcABUuAAAAAAAAAAAAAA4AWAC0ASQBYAIYAogCxAOMA9QENASwBSIF5gYEBjgGsgdAB5QHzgiMCQIJJgnWChAKhguIC7oMdgzYeJxjYGRgYFBk2M3AywACTEDMyAAScwDzGQAZIgEvAAB4nHWOMWoDMRBF39prh+AQUoWUgjRpdpE2jfEB9gAp3BsjlgXbAtkGnyRVjpAyx8gBcoQcI9/raVJYMOjN15/5Au54p+B8Cm54MB6JX4zHPHMyLqV/Gk+Y8W08lf4rZ1HeSrkfps48Ej8Zj2nxxqX0D+MJj3wZT6X/0LMmsVUldtCv0zYlwRuRjiMbVmS1sTtuVoJ28B2GO8sRcTTUSnMsVP/3XbQ5FUGOSk4vetWatDu0KXfRNbV3C2e5onkVfNX4INO1vy2Vmtnr/ZIRhnyWMe977Qi1vzr7BwDvOdMAAHicY2BiwA8UgZiRgYmRiYGdgZeBj0GJQYNBi0GfwZDBnMGSwYrBhsGFwZPBnaGQwYshiKGUwZUhmiGWgYVBmIGVIYKBk4GNIZS9NC/TzcDAAADphwhaAAA=) format('woff'),url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.ttf') format('truetype'),url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.svg#zocialregular') format('svg');font-weight:normal;font-style:normal}#auth0-widget .zocial.auth0:before{content:\"?\"}#auth0-widget .zocial.auth0{background-color:#ff4500;width:auto}#auth0-widget .zocial.block{display:block;margin:10px 0;text-overflow:ellipsis;overflow:hidden}#auth0-widget .zocial.primary,#auth0-widget .zocial.secondary{margin:0;padding:0 1em;font-size:14px;line-height:42px}#auth0-widget .zocial.primary:before,#auth0-widget .zocial.secondary:before{display:none}#auth0-widget .zocial.primary{background-color:#747e85}#auth0-widget .zocial.secondary{background-color:#f0f0eb;color:#222;text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget .zocial{-webkit-font-smoothing:antialiased}#auth0-widget .popup .overlay{position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;z-index:9999;font-weight:200;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;background:#000;background:rgba(0,0,0,0.8);background:-webkit-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:-moz-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:-ms-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);opacity:0;-webkit-transition:400ms opacity ease;-moz-transition:400ms opacity ease;transition:400ms opacity ease;-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}#auth0-widget .popup .overlay.active{opacity:1}#auth0-widget .popup .overlay .panel{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;left:50%;display:none}#auth0-widget .popup .overlay .panel.active{display:block;-webkit-animation-duration:400ms;-webkit-animation-timing-function:ease;-webkit-animation-name:showPanel}#auth0-widget .popup .overlay .panel{-webkit-animation-duration:400ms;-webkit-animation-timing-function:ease;-webkit-animation-name:hidePanel;width:280px;margin:0 0 0 -140px}#auth0-widget .popup .overlay .email{margin-bottom:14px}#auth0-widget .popup .overlay .password,#auth0-widget .popup .overlay .repeatPassword{margin-bottom:14px}#auth0-widget .popup .overlay .email-readonly{text-align:center;display:inherit;color:#41444a;font-weight:bold;margin-bottom:25px}#auth0-widget .panel .signup .header,#auth0-widget .panel .reset .header{margin-bottom:15px;font-size:14px;color:#41444a}#auth0-widget .panel .signup .footer{margin-bottom:15px;font-size:12px;color:#41444a;text-align:left;margin-top:10px}@-moz-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-webkit-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-o-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-ms-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-moz-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-webkit-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-o-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-ms-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}#auth0-widget .popup .panel{background:#fafafa;background-image:-webkit-linear-gradient(#fff,#fafafa);background-image:-moz-linear-gradient(#fff,#fafafa);background-image:-ms-linear-gradient(#fff,#fafafa);background-image:-o-linear-gradient(#fff,#fafafa);background-image:linear-gradient(#fff,#fafafa);z-index:10;-moz-box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);-webkit-box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;-webkit-touch-callout:none}#auth0-widget .popup .panel:after{content:\"\";position:absolute;left:0;right:0;top:0;bottom:0;z-index:1;-moz-box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4);-webkit-box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4);box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4)}#auth0-widget .popup .panel header{display:block;position:relative;min-height:65px;overflow:hidden;-moz-border-radius:6px 6px 0 0;-webkit-border-radius:6px 6px 0 0;border-radius:6px 6px 0 0;background:#f1f4f6;background-image:-webkit-linear-gradient(#f1f4f6,#e9edf0);background-image:-moz-linear-gradient(#f1f4f6,#e9edf0);background-image:-ms-linear-gradient(#f1f4f6,#e9edf0);background-image:-o-linear-gradient(#f1f4f6,#e9edf0);background-image:linear-gradient(#f1f4f6,#e9edf0);border-bottom:1px solid rgba(40,69,85,0.11)}#auth0-widget .popup .panel header:before{content:'';position:absolute;height:5px;bottom:-1px;left:0;right:0;background-image:-webkit-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-moz-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-ms-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-o-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1))}#auth0-widget .popup .panel header:after{content:'';position:absolute;height:4px;bottom:0;left:0;right:0;background-image:-webkit-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-moz-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-ms-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-o-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0)}#auth0-widget .popup .panel header h1{padding:21px 20px;margin:0;font-size:18px;color:#41444a;font-weight:bold;border-bottom:1px solid #dde3e6}#auth0-widget .popup .panel header a{display:block;overflow:hidden;text-indent:200%;position:absolute;width:12px;opacity:.4;padding:5px;z-index:5}#auth0-widget .popup .panel header a:hover{opacity:.66}#auth0-widget .popup .panel header a:active{opacity:1}#auth0-widget .popup .panel header a.close{height:12px;background:url(\"https://s3.amazonaws.com/assets.auth0.com/w2/img/close.png\") 50% 50% no-repeat;background-size:12px 12px;right:19px;top:21px;cursor:pointer}#auth0-widget .popup .panel header a.close:hover{opacity:.66}#auth0-widget .popup .panel header img{height:32px;margin:16px 10px 10px 20px;position:relative;float:left}#auth0-widget .action .spinner{width:100%;background-color:#6a777f;background-image:url('https://s3.amazonaws.com/assets.auth0.com/w2/img/spinner.gif');background-repeat:no-repeat;background-position:center;margin:0;height:44px;border:1px solid #777;border-color:rgba(0,0,0,0.2);border-bottom-color:#333;border-bottom-color:rgba(0,0,0,0.4);-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-moz-user-select:none;user-select:none;-moz-border-radius:.3em;-webkit-border-radius:.3em;border-radius:.3em}#auth0-widget .popup .panel footer{display:block;position:relative;-moz-border-radius:0 0 5px 5px;-webkit-border-radius:0 0 5px 5px;border-radius:0 0 5px 5px;height:25px;line-height:25px;vertical-align:middle;margin:0 15px;border-top:1px solid #dde3e6;z-index:5}#auth0-widget .popup .panel footer span{font-size:10px;color:#666}#auth0-widget .popup .panel footer a{font-size:9px;color:#333;font-weight:bold;text-decoration:none;cursor:pointer}#auth0-widget .list,#auth0-widget .iconlist{margin:25px 0;position:relative;z-index:5}#auth0-widget .list:before,#auth0-widget .list:after,#auth0-widget .iconlist:before,#auth0-widget .iconlist:after{display:table;content:\"\"}#auth0-widget .list:after,#auth0-widget .iconlist:after{clear:both}#auth0-widget .list span{display:block;margin:10px 0;cursor:pointer}#auth0-widget .iconlist{text-align:center}#auth0-widget .iconlist span{margin:0 2px}#auth0-widget .forgot-pass{font-size:12px;color:#666;font-weight:normal}#auth0-widget .create-account{display:none;margin-top:20px;text-align:center}#auth0-widget .create-account a{font-size:12px;color:#6d6d6d;text-decoration:none}#auth0-widget .create-account a:hover{text-decoration:underline}#auth0-widget .loggedin span.centered.all{color:#008cdd;cursor:pointer}#auth0-widget .loggedin span.centered{text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;display:block}#auth0-widget .loggedin span.centered.all:hover{text-decoration:underline}#auth0-widget .signup .options a.cancel,#auth0-widget .reset .options a.cancel{color:#008cdd;cursor:pointer;text-decoration:none}#auth0-widget .signup .options a.cancel:hover,#auth0-widget .reset .options a.cancel:hover{text-decoration:underline}#auth0-widget .signup .options,#auth0-widget .reset .options{text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;display:block}#auth0-widget form{margin:30px!important;margin-bottom:22px;position:relative;z-index:5}#auth0-widget form label{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}#auth0-widget form input{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;font-size:18px;padding:10px 12px;border:1px solid #b4becd;border-top-color:#b0baca;border-bottom-color:#d3d9e2;-moz-box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);-webkit-box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;color:black;margin:0;font-family:'Helvetica Neue',Helvetica,Arial Geneva,sans-serif}#auth0-widget .placeholder{color:#ccc}#auth0-widget form input:focus{border-color:#5695db #70a7e4 #89b8ec #70a7e4;outline:0;-moz-box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db;-webkit-box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db;box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db}#auth0-widget form .invalid input{outline:0;border-color:#ff7076;border-top-color:#ff5c61;-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5);box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5)}#auth0-widget header .error{padding:9px 0;margin:10px auto;width:70%;font-size:14px;line-height:13px;color:#b95353;text-align:center}#auth0-widget header .success{padding:9px 0;margin:10px auto;width:70%;font-size:14px;line-height:13px;color:#0fad29;text-align:center}#auth0-widget form .note{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}#auth0-widget form .note a{color:#008cdd;text-decoration:none}#auth0-widget form .invalid .error{visibility:visible}#auth0-widget form button{display:block;margin:20px 0 0 0;cursor:pointer;width:100%}#auth0-widget .action{text-align:right;margin:0 30px 30px 30px;position:relative;z-index:5}#auth0-widget form .action{margin:0}#auth0-widget .action button{width:auto}#auth0-widget .separator{position:relative;text-align:center;margin:0 0 25px 0}#auth0-widget .separator:before{content:\"\";display:block;border-top:1px solid #7f8899;width:200px;left:50%;margin-left:-100px;height:1px;position:absolute;top:50%;z-index:1}#auth0-widget .separator span{background:#fafafa;padding:0 10px;position:relative;z-index:5;color:#7f8899;font-size:13px;font-weight:bold;text-shadow:0 1px 0 white}#auth0-widget span.back{display:block;color:#008cdd;text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;cursor:pointer;position:relative;z-index:5;outline:0}#auth0-widget span.back:hover{text-decoration:underline}#auth0-widget .signin .panel.strategies .list .email{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;text-align:center}#auth0-widget .zocial.office365:before{content:\"W\"}#auth0-widget .zocial.office365{background-color:#00aced;color:#fff}#auth0-widget .zocial.waad:before{content:\"z\"}#auth0-widget .zocial.waad{background-color:#00adef;color:#fff}#auth0-widget .zocial.thirtysevensignals:before{content:\"b\"}#auth0-widget .zocial.thirtysevensignals{background-color:#6ac071;color:#fff}#auth0-widget .zocial.box:before{content:\"x\"}#auth0-widget .zocial.box{background-color:#267bb6;color:#fff}#auth0-widget .zocial.salesforce:before{content:\"*\"}#auth0-widget .zocial.salesforce{background-color:#fff;color:#f00}#auth0-widget .zocial.windows{background-color:#2672ec;color:#fff}#auth0-widget .zocial.fitbit:before{content:\"#\"}#auth0-widget .zocial.fitbit{background-color:#45c2c5;color:#fff}#auth0-widget .zocial.yandex:before{content:\"&\"}#auth0-widget .zocial.yandex{background-color:#f00;color:#fff}#auth0-widget .zocial.renren:before{content:\"r\"}#auth0-widget .zocial.renren{background-color:#0056b5;color:#fff}#auth0-widget .zocial.baidu:before{content:\"u\"}#auth0-widget .zocial.baidu{background-color:#2832e1;color:#fff}#auth0-widget .popup .overlay .onestep{width:345px;margin:0 0 0 -172px}@media(max-width:280px){#auth0-widget .popup .overlay .panel{width:240px;margin:0 0 0 -120px}#auth0-widget .signin .popup .panel.strategies .list{margin:12px}#auth0-widget form{margin:12px}#auth0-widget form input{padding:5px}#auth0-widget .popup .panel header{margin:0;padding:0}#auth0-widget .popup .panel header h1{padding:14px 16px;margin:0;font-size:22px}#auth0-widget .popup .panel header a.close{right:14px;top:16px}}@media(min-width:281px) and (max-width:340px){#auth0-widget .popup .overlay .panel{margin:0;left:0;height:100%;width:100%;border-radius:0}#auth0-widget .popup .zocial,#auth0-widget .popup a.zocial{font-size:18px}#auth0-widget .signin .popup .panel.strategies .list{margin:15px}#auth0-widget form{margin:15px 25px}#auth0-widget form input{padding:6px;font-size:18px}#auth0-widget .popup .panel header{margin:0;padding:0;min-height:32px}#auth0-widget .popup .panel header h1{padding:12px 16px;margin-top:1px;font-size:20px}#auth0-widget .popup .panel header img{height:32px;margin:9px 10px 6px 18px}#auth0-widget .zocial.primary{line-height:34px}#auth0-widget .action .spinner{height:34px}#auth0-widget .create-account{margin-top:20px}#auth0-widget .popup .overlay .email{margin-bottom:5px}#auth0-widget .popup .overlay .password,#auth0-widget .popup .overlay .repeatPassword{margin-bottom:5px}}#auth0-widget .loading{display:none;border:0;overflow:hidden;position:fixed;visibility:visible;margin:0;padding:0;left:0;top:0;width:100%;height:100%;z-index:100000;font-weight:200;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;background-color:rgba(255,255,255,0.5)}#auth0-widget .loading .message{position:absolute;top:50%;margin-top:-110px;width:100%;text-align:center;font-size:22px;font-family:Helvetica,arial,freesans,clean,sans-serif;color:#333}#auth0-widget .loading .balls{position:absolute;left:50%;top:50%;margin-left:-45px;margin-top:-45px;width:90px;height:90px}#auth0-widget .loading .balls>div{position:absolute;width:86px;height:86px;opacity:0;-moz-transform:rotate(225deg);-moz-animation:orbit 7.15s infinite;-webkit-transform:rotate(225deg);-webkit-animation:orbit 7.15s infinite;-ms-transform:rotate(225deg);-ms-animation:orbit 7.15s infinite;-o-transform:rotate(225deg);-o-animation:orbit 7.15s infinite;transform:rotate(225deg);animation:orbit 7.15s infinite}#auth0-widget .loading .balls>div>div{position:absolute;width:11px;height:11px;background:#333;left:0;top:0;-moz-border-radius:11px;-webkit-border-radius:11px;-ms-border-radius:11px;-o-border-radius:11px;border-radius:11px}#auth0-widget .loading .balls .ball01{-moz-animation-delay:1.56s;-webkit-animation-delay:1.56s;-ms-animation-delay:1.56s;-o-animation-delay:1.56s;animation-delay:1.56s}#auth0-widget .loading .balls .ball02{-moz-animation-delay:.31s;-webkit-animation-delay:.31s;-ms-animation-delay:.31s;-o-animation-delay:.31s;animation-delay:.31s}#auth0-widget .loading .balls .ball03{-moz-animation-delay:.62s;-webkit-animation-delay:.62s;-ms-animation-delay:.62s;-o-animation-delay:.62s;animation-delay:.62s}#auth0-widget .loading .balls .ball04{-moz-animation-delay:.94s;-webkit-animation-delay:.94s;-ms-animation-delay:.94s;-o-animation-delay:.94s;animation-delay:.94s}#auth0-widget .loading .balls .ball05{-moz-animation-delay:1.25s;-webkit-animation-delay:1.25s;-ms-animation-delay:1.25s;-o-animation-delay:1.25s;animation-delay:1.25s}@-moz-keyframes orbit{0%{opacity:1;z-index:99;-moz-transform:rotate(180deg);-moz-animation-timing-function:ease-out}7%{opacity:1;-moz-transform:rotate(300deg);-moz-animation-timing-function:linear;-moz-origin:0}30%{opacity:1;-moz-transform:rotate(410deg);-moz-animation-timing-function:ease-in-out;-moz-origin:7%}39%{opacity:1;-moz-transform:rotate(645deg);-moz-animation-timing-function:linear;-moz-origin:30%}70%{opacity:1;-moz-transform:rotate(770deg);-moz-animation-timing-function:ease-out;-moz-origin:39%}75%{opacity:1;-moz-transform:rotate(900deg);-moz-animation-timing-function:ease-out;-moz-origin:70%}76%{opacity:0;-moz-transform:rotate(900deg)}100%{opacity:0;-moz-transform:rotate(900deg)}}@-webkit-keyframes orbit{0%{opacity:1;z-index:99;-webkit-transform:rotate(180deg);-webkit-animation-timing-function:ease-out}7%{opacity:1;-webkit-transform:rotate(300deg);-webkit-animation-timing-function:linear;-webkit-origin:0}30%{opacity:1;-webkit-transform:rotate(410deg);-webkit-animation-timing-function:ease-in-out;-webkit-origin:7%}39%{opacity:1;-webkit-transform:rotate(645deg);-webkit-animation-timing-function:linear;-webkit-origin:30%}70%{opacity:1;-webkit-transform:rotate(770deg);-webkit-animation-timing-function:ease-out;-webkit-origin:39%}75%{opacity:1;-webkit-transform:rotate(900deg);-webkit-animation-timing-function:ease-out;-webkit-origin:70%}76%{opacity:0;-webkit-transform:rotate(900deg)}100%{opacity:0;-webkit-transform:rotate(900deg)}}@-ms-keyframes orbit{0%{opacity:1;z-index:99;-ms-transform:rotate(180deg);-ms-animation-timing-function:ease-out}7%{opacity:1;-ms-transform:rotate(300deg);-ms-animation-timing-function:linear;-ms-origin:0}30%{opacity:1;-ms-transform:rotate(410deg);-ms-animation-timing-function:ease-in-out;-ms-origin:7%}39%{opacity:1;-ms-transform:rotate(645deg);-ms-animation-timing-function:linear;-ms-origin:30%}70%{opacity:1;-ms-transform:rotate(770deg);-ms-animation-timing-function:ease-out;-ms-origin:39%}75%{opacity:1;-ms-transform:rotate(900deg);-ms-animation-timing-function:ease-out;-ms-origin:70%}76%{opacity:0;-ms-transform:rotate(900deg)}100%{opacity:0;-ms-transform:rotate(900deg)}}@-o-keyframes orbit{0%{opacity:1;z-index:99;-o-transform:rotate(180deg);-o-animation-timing-function:ease-out}7%{opacity:1;-o-transform:rotate(300deg);-o-animation-timing-function:linear;-o-origin:0}30%{opacity:1;-o-transform:rotate(410deg);-o-animation-timing-function:ease-in-out;-o-origin:7%}39%{opacity:1;-o-transform:rotate(645deg);-o-animation-timing-function:linear;-o-origin:30%}70%{opacity:1;-o-transform:rotate(770deg);-o-animation-timing-function:ease-out;-o-origin:39%}75%{opacity:1;-o-transform:rotate(900deg);-o-animation-timing-function:ease-out;-o-origin:70%}76%{opacity:0;-o-transform:rotate(900deg)}100%{opacity:0;-o-transform:rotate(900deg)}}@keyframes orbit{0%{opacity:1;z-index:99;transform:rotate(180deg);animation-timing-function:ease-out}7%{opacity:1;transform:rotate(300deg);animation-timing-function:linear;origin:0}30%{opacity:1;transform:rotate(410deg);animation-timing-function:ease-in-out;origin:7%}39%{opacity:1;transform:rotate(645deg);animation-timing-function:linear;origin:30%}70%{opacity:1;transform:rotate(770deg);animation-timing-function:ease-out;origin:39%}75%{opacity:1;transform:rotate(900deg);animation-timing-function:ease-out;origin:70%}76%{opacity:0;transform:rotate(900deg)}100%{opacity:0;transform:rotate(900deg)}}#auth0-widget input[disabled]{background-color:#d9dee0}#auth0-widget article,#auth0-widget aside,#auth0-widget details,#auth0-widget figcaption,#auth0-widget figure,#auth0-widget footer,#auth0-widget header,#auth0-widget hgroup,#auth0-widget nav,#auth0-widget section,#auth0-widget summary{display:block}#auth0-widget audio,#auth0-widget canvas,#auth0-widget video{display:inline-block;*display:inline;*zoom:1}#auth0-widget audio:not([controls]){display:none;height:0}#auth0-widget [hidden]{display:none}#auth0-widget html{font-size:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}#auth0-widget html,#auth0-widget button,#auth0-widget input,#auth0-widget select,#auth0-widget textarea,#auth0-widget h1,#auth0-widget h2,#auth0-widget div,#auth0-widget span,#auth0-widget a{font-family:sans-serif}#auth0-widget body{margin:0}#auth0-widget a:focus{outline:thin dotted}#auth0-widget a:active,#auth0-widget a:hover{outline:0}#auth0-widget h1{font-size:2em;margin:.67em 0}#auth0-widget h2{font-size:1.5em;margin:.83em 0}#auth0-widget h3{font-size:1.17em;margin:1em 0}#auth0-widget h4{font-size:1em;margin:1.33em 0}#auth0-widget h5{font-size:.83em;margin:1.67em 0}#auth0-widget h6{font-size:.75em;margin:2.33em 0}#auth0-widget abbr[title]{border-bottom:1px dotted}#auth0-widget b,#auth0-widget strong{font-weight:bold}#auth0-widget blockquote{margin:1em 40px}#auth0-widget dfn{font-style:italic}#auth0-widget mark{background:#ff0;color:#000}#auth0-widget p,#auth0-widget pre{margin:1em 0}#auth0-widget code,#auth0-widget kbd,#auth0-widget pre,#auth0-widget samp{font-family:monospace,serif;_font-family:'courier new',monospace;font-size:1em}#auth0-widget pre{white-space:pre;white-space:pre-wrap;word-wrap:break-word}#auth0-widget q{quotes:none}#auth0-widget q:before,#auth0-widget q:after{content:'';content:none}#auth0-widget small{font-size:80%}#auth0-widget sub,#auth0-widget sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}#auth0-widget sup{top:-0.5em}#auth0-widget sub{bottom:-0.25em}#auth0-widget dl,#auth0-widget menu,#auth0-widget ol,#auth0-widget ul{margin:1em 0}#auth0-widget dd{margin:0 0 0 40px}#auth0-widget menu,#auth0-widget ol,#auth0-widget ul{padding:0 0 0 40px}#auth0-widget nav ul,#auth0-widget nav ol{list-style:none;list-style-image:none}#auth0-widget img{border:0;-ms-interpolation-mode:bicubic}#auth0-widget svg:not(:root){overflow:hidden}#auth0-widget figure{margin:0}#auth0-widget form{margin:0}#auth0-widget fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:.35em .625em .75em}#auth0-widget legend{border:0;padding:0;white-space:normal;*margin-left:-7px}#auth0-widget button,#auth0-widget input,#auth0-widget select,#auth0-widget textarea{font-size:100%;margin:0;vertical-align:baseline;*vertical-align:middle}#auth0-widget button,#auth0-widget input{line-height:normal}#auth0-widget button,#auth0-widget html input[type=\"button\"],#auth0-widget input[type=\"reset\"],#auth0-widget input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer;*overflow:visible}#auth0-widget button[disabled],#auth0-widget input[disabled]{cursor:default}#auth0-widget input[type=\"checkbox\"],#auth0-widget input[type=\"radio\"]{box-sizing:border-box;padding:0;*height:13px;*width:13px}#auth0-widget input[type=\"search\"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}#auth0-widget input[type=\"search\"]::-webkit-search-cancel-button,#auth0-widget input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}#auth0-widget button::-moz-focus-inner,#auth0-widget input::-moz-focus-inner{border:0;padding:0}#auth0-widget textarea{overflow:auto;vertical-align:top}#auth0-widget table{border-collapse:collapse;border-spacing:0}");

// use amd or just throught to window object.
if (typeof global.window.define == 'function' && global.window.define.amd) {
  global.window.define('auth0-widget', function () { return Auth0Widget; });
} else if (global.window) {
  global.window.Auth0Widget = Auth0Widget;
}

},{"./vendor/insert-css":23,"./widget":25,"fs":14}],23:[function(require,module,exports){
module.exports = function (css) {
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
};

},{}],24:[function(require,module,exports){
module.exports=(function() {var t = function anonymous(locals, filters, escape) {
escape = escape || function (html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};
var buf = [];
with (locals || {}) { (function(){ 
 buf.push('<div id="auth0-widget" class="cleanslate">\n	<div class="signin">\n	    <div class="popup">\n	      	<div class="overlay">\n	        	<div id="onestep" class="panel onestep">\n	          		<header class="header">\n	            		<div class="image" style="display: none">\n	            			<img src="">\n	            		</div>\n	            		<h1>Sign In</h1>\n			            <h2 class="error" style="display: none">&nbsp;</h2>\n			            <h2 class="success" style="display: none">&nbsp;</h2>\n			            <a class="close">Close</a>\n	          		</header>\n\n	          		<div class="loggedin">\n			            <form>\n							<span class="centered last-time"></span>\n							<div class="strategy"></div>\n							<div class="emailPassword" style="display:none">\n								<div class="email">\n									<span class="email-readonly"></span>\n									<input name="email" type="email" value="" disabled placeholder="Email" title="Email" style="display:none">\n								</div>\n								<div class="password">\n									<input name="password" type="password" value="" autofocus placeholder="Password" title="Password">\n								</div>\n								<div class="action">\n									<button type="submit" class="zocial primary next" style="width: 100%;">Sign In</button>\n								  	<button type="submit" class="spinner" style="display: none"></button>\n								  	<label class="create-account"><a href="javascript: {}" class="forgot-pass">Forgot your password?</a></label>\n								</div>\n							</div>\n							<span class="centered all">Show all</span>\n			            </form>\n	          		</div>\n\n		          	<div class="notloggedin">\n			            <form>\n			            	<div class="iconlist" style="display: none"><p style="display:none">... or sign in using</p></div>\n			              	<div class="separator" style="display: none"><span>or</span></div>\n			              	<div class="emailPassword">\n			                	<div class="email">\n			                  		<input name="email" id="signin_easy_email" type="email" required placeholder="Email" title="Email">\n			                	</div>\n			                	<div class="password" style="display:none">\n			                  		<input name="password" id="signin_easy_password" type="password" placeholder="Password" title="Password">\n			                	</div>\n				                <div class="action">\n				                  	<button type="submit" class="zocial primary next" style="width: 100%;">Sign In</button>\n				                  	<button type="submit" class="spinner" style="display: none"></button>\n				                  	<label class="create-account"><a href="javascript: {}" class="sign-up">Sign Up</a><span class="divider" style="display:none">&nbsp;•&nbsp;</span><a href="javascript: {}" class="forgot-pass">Forgot your password?</a></label>\n				                </div>\n			              	</div>\n			            </form>\n		          	</div>\n\n		          	<div class="signup">\n			            <form>\n			              	<div class="header"></div>\n			              	<div class="emailPassword">\n			                	<div class="email">\n			                  		<input name="email" id="signup_easy_email" type="email" value="" required placeholder="Email" title="Email">\n			                	</div>\n			                	<div class="password">\n			                  		<input name="password" id="signup_easy_password" type="password" value="" required placeholder="Create a Password" title="Password">\n			                	</div>\n				                <div class="action">\n				                  	<button type="submit" class="zocial primary next" style="width: 100%;">Sign Up</button>\n				                  	<button type="submit" class="spinner" style="display: none"></button>\n				                  	<div class="footer"></div>\n				                  	<div class="options">\n				                    	<a href="javascript: {}" class="centered cancel">Cancel</a>\n				                  	</div>\n				                </div>\n			              	</div>\n			            </form>\n		          	</div>\n\n					<div class="reset">\n						<form id="change_password">\n						  	<div class="header"></div>\n						  	<div class="emailPassword">\n						    	<div class="email">\n						      		<input name="email" id="reset_easy_email" type="email" value="" required placeholder="Email" title="Email">\n						    	</div>\n						    	<div class="password">\n						      		<input name="password" id="reset_easy_password" type="password" value="" required placeholder="New Password" title="New Password">\n						    	</div>\n						    	<div class="repeatPassword">\n						      		<input name="repeat_password" id="reset_easy_repeat_password" type="password" value="" required placeholder="Confirm New Password" title="Confirm New Password">\n						    	</div>\n						    	<div class="action">\n						      		<button type="submit" class="zocial primary next" style="width: 100%;">Send</button>\n						      		<button type="submit" class="spinner" style="display: none"></button>\n						      		<div class="options">\n						        		<a href="javascript: {}" class="centered cancel">Cancel</a>\n						      		</div>\n						    	</div>\n						  	</div>\n						</form>\n					</div>\n					\n	          		<footer>\n	            		<span>Powered by <a href="http://auth0.com" target="_new">Auth0</a></span>\n	          		</footer>\n	        	</div>\n	      	</div>\n	    </div>\n	</div>\n</div>\n'); })();
} 
return buf.join('');
}; return function(l) { return t(l) }}())
},{}],25:[function(require,module,exports){
var Auth0     = require('auth0-js');
var qwery     = require('qwery');
var bonzo     = require('bonzo');
var bean      = require('bean');
var xtend     = require('xtend');

var mainTmpl = require('./html/main.html');

var $ = function (selector, root) {
  return bonzo(qwery('#auth0-widget ' + (selector || ''), root));
};

function Auth0Widget (options) {
  if (!(this instanceof Auth0Widget)) {
    return new Auth0Widget(options);
  }

  this._options = options;
  this._auth0 = new Auth0({
    clientID:     this._options.clientID, 
    callbackURL:  this._options.callbackURL,
    domain:       this._options.domain
  });
  
  this._strategies = {
    'google-openid': { css: 'google', name: 'Google OpenId', social: true },
    'google-apps': { css: 'google', name: 'Google Apps', social: false },
    'google-oauth2': { css: 'googleplus', name: 'Google', social: true },
    'facebook': { css: 'facebook', name: 'Facebook', social: true },
    'windowslive': { css: 'windows', name: 'Microsoft Account', social: true },
    'linkedin': { css: 'linkedin', name: 'LinkedIn', social: true },
    'github': { css: 'github', name: 'GitHub', social: true },
    'paypal': { css: 'paypal', name: 'PayPal', social: true },
    'twitter': { css: 'twitter', name: 'Twitter', social: true },
    'amazon': { css: 'amazon', name: 'Amazon', social: true },
    'vkontakte': { css: 'vk', name: 'vKontakte', social: true },
    'yandex': { css: 'yandex', name: 'Yandex', social: true },
    'office365': { css: 'office365', name: 'Office365', social: false },
    'waad': { css: 'waad', name: 'Windows Azure AD', social: false },
    'adfs': { css: 'windows', name: 'ADFS', social: false },
    'samlp': { css: 'guest', name: 'SAML', social: false },
    'mscrm': { css: 'guest', name: 'Dynamics CRM', social: false },
    'ad': { css: 'windows', name: 'AD / LDAP', social: false },
    'custom': { css: 'guest', name: 'Custom Auth', social: false },
    'auth0': { css: 'guest', name: 'Auth0', social: false },
    'auth0-adldap': { css: 'guest', name: 'AD/LDAP', social: false },
    'thirtysevensignals': { css: 'thirtysevensignals', name: '37 Signals', social: true },
    'box': { css: 'box', name: 'Box', social: true, imageicon: true },
    'salesforce': { css: 'salesforce', name: 'Salesforce', social: true },
    'fitbit': { css: 'fitbit', name: 'Fitbit', social: true }
  };
}

// helper methods
Auth0Widget.prototype._setTop = function (onTop, element) {
  if (!onTop) {
    setTimeout(function() {
      element.css({
        'marginTop': '-' + (element.offset().height / 2) + 'px',
        'top': '50%'
      });
    }, 1);
  } else {
    element.css({
      'marginTop': '2px',
      'top': '0'
    });
  }
};

Auth0Widget.prototype._showError = function (error) {
  if (!error) return;
  $('.signin h1').css('display', 'none');
  $('.signin .success').css('display', 'none');
  $('.signin .error').html(error).css('display', '');
};

Auth0Widget.prototype._showSuccess = function (message) {
  if (!message) return;
  $('.signin h1').css('display', 'none');
  $('.signin .error').css('display', 'none');
  $('.signin .success').html(message).css('display', '');
};

Auth0Widget.prototype._isAuth0Conn = function (strategy) {
  return strategy === 'auth0' || strategy === 'auth0-adldap';
};

Auth0Widget.prototype._setTitle = function(title) {
  $('.signin .error').css('display', 'none');
  $('.signin .success').css('display', 'none');
  $('.signin h1').html(title).css('display', '');
};

Auth0Widget.prototype._parseResponseMessage = function (responseObj, defaultValue) {
  return this._signinOptions[responseObj.code] || responseObj.message || defaultValue;
};

Auth0Widget.prototype._isAdLdapConn = function (connection) {
  return connection === 'adldap';
};

Auth0Widget.prototype._areThereAnySocialConn = function () {
  for (var s in this._client.strategies) {
    if (this._strategies[this._client.strategies[s].name] && this._strategies[this._client.strategies[s].name].social) {
      return true;
    }
  }

  return false;
};

Auth0Widget.prototype._areThereAnyEnterpriseOrDbConn = function() {
  for (var s in this._client.strategies) {
    if (this._strategies[this._client.strategies[s].name] && 
        !this._strategies[this._client.strategies[s].name].social) {
      return true;
    }
  }

  return false;
};

Auth0Widget.prototype._isEnterpriseConnection = function (email, output) {
  var emailM = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    .exec(email.toLowerCase());

  for (var s in this._client.strategies) {
    var strategy = this._client.strategies[s];
    if (this._isAuth0Conn(strategy.name)) continue;

    for (var c in strategy.connections) {
      if (emailM && emailM.slice(-2)[0] == strategy.connections[c].domain) {
        output = output || {};
        output.domain = strategy.connections[c].domain;
        return true;
      }
    }
  }

  return false;
};

Auth0Widget.prototype._isEnterpriseStrategy = function (strategy) { 
  for (var s in this._strategies) {
    if (s === strategy && !this._strategies[s].social) { 
      return true; 
    } 
  } 

  return false; 
};

Auth0Widget.prototype._getConfiguredStrategy = function (name) {
  for (var s in this._client.strategies) {
    if (this._client.strategies[s] && this._client.strategies[s].name === name) {
      return this._client.strategies[s];
    }
  }
};

Auth0Widget.prototype._getAuth0Connection = function() {
  // if specified, use it, otherwise return first
  if (this._signinOptions['userPwdConnectionName']) {
    for (var i in this._auth0Strategy.connections) {
      if (this._auth0Strategy.connections[i].name === this._signinOptions['userPwdConnectionName']) {
        return this._auth0Strategy.connections[i];
      }
    }
  }

  return this._auth0Strategy ? this._auth0Strategy.connections[0] : null;
};

Auth0Widget.prototype._showOrHidePassword = function () {
  var mailField = $('.notloggedin .email input');
  var pwdField  = $('.notloggedin .password input').first();
  
  var isEnterpriseConnection = this._isEnterpriseConnection(mailField.val());

  if (isEnterpriseConnection) {
    pwdField.attr('disabled', true);
    pwdField.attr('placeholder', '');
    pwdField.removeAttr('required');
  } else {
    pwdField.removeAttr('disabled');
    pwdField.attr('placeholder', this._signinOptions['passwordPlaceholder']);
    pwdField.attr('required', true);
  }
};

Auth0Widget.prototype._hideSignIn = function (cb) {
  $('div.overlay').removeClass('active');

  setTimeout(function () {
    $().removeClass('mode-signin');
    $().css('display', 'none');
    if (cb) cb();
  }, 500);
};

Auth0Widget.prototype._getActiveLoginView = function() {
  var container = this._hasLoggedInBefore ? $('.loggedin') : $('.notloggedin');
  return container;
};

Auth0Widget.prototype._toggleSpinner = function (container) {
  container = container || this._getActiveLoginView();
  var spinner = $('.spinner', container);
  var signin = $('.zocial.primary', container);

  spinner.css('display', spinner.css('display') === 'none' ? '' : 'none');
  signin.css('display', signin.css('display') === 'none' ? '' : 'none');
};

Auth0Widget.prototype._showSignUpExperience = function() {
  this._setLoginView({ mode: 'signup' });
};

Auth0Widget.prototype._showResetExperience = function() {
  this._setLoginView({ mode: 'reset' });
};

Auth0Widget.prototype._setLoginView = function(options) {
  options = options || {};

  $('.loggedin').css('display', 'none');
  $('.notloggedin').css('display', 'none');
  $('.signup').css('display', 'none');
  $('.reset').css('display', 'none');
  $('.signin input[type=password]').val('');

  if (!options.mode) {
    this._hasLoggedInBefore = !!options.isReturningUser;
    this._setTitle(this._signinOptions['title']);

    $('.loggedin').css('display', options.isReturningUser ? '' : 'none');
    $('.notloggedin').css('display', options.isReturningUser ? 'none' : '');

    this._setTop(this._signinOptions.top, $('.signin div.panel.onestep'));

    try { 
      if (options.isReturningUser) $('.loggedin .password input').first().focus();
      else $('.notloggedin .email input').first().focus();
    } catch(e) {}
    
    return;
  }

  var container;

  switch (options.mode) {
    case 'signup':
      this._setTitle(this._signinOptions['signupTitle']);
      container = $('.signup').first();
      break;
    case 'reset':
      this._setTitle(this._signinOptions['resetTitle']);
      container = $('.reset').first();
      break;
  }

  if (container) {
    this._setTop(this._signinOptions.top, $('.signin div.panel.onestep'));
    container.css('display', '');

    try { 
      var email = $('.notloggedin .email input').val();
      $('.email input', container).val(email);
      $('.email input', container).first().focus();
    } catch(e) {}
  }
};

Auth0Widget.prototype._showLoggedInExperience = function() {
  var self = this;
  var strategy = this._ssoData.lastUsedConnection.strategy;
  this._setLoginView({ isReturningUser: !!strategy });

  if (!strategy) return;

  var loginView = this._getActiveLoginView();
  bean.on($('form', loginView)[0], 'submit', function (e) { self._signInEnterprise(e); });
  
  var button;
  if (strategy !== 'auth0') {
    button = bonzo(bonzo.create('<span></span>'))
      .attr('tabindex', 0)
      .attr('data-strategy', strategy)
      .attr('title', this._strategies[strategy].name)
      .addClass('zocial').addClass('block')
      .addClass(this._strategies[strategy].css)
      .addClass(this._strategies[strategy].imageicon ? 'image-icon' : '')
      .html(this._strategies[strategy].name);
    
    bean.on(button[0], 'click', function (e) { self._signInSocial(e.target); });

    $('.strategy span', loginView).each(function (el) { if (el) el.remove(); });
    $('.strategy', loginView).append(button);
  }

  $('.all', loginView).html(this._signinOptions['allButtonTemplate']);

  bean.on($('.all', loginView)[0], 'click', function () {
    self._setLoginView();
  });

  if (this._ssoData.lastUsedUsername) {
    if (strategy === 'auth0') {
      $('.email-readonly', loginView).html(this._ssoData.lastUsedUsername); 
      $('.email input', loginView).css('display', 'none');
      $('.emailPassword', loginView).css('display', '');
    } 
    else if (this._isEnterpriseStrategy(strategy)) {
      button.html(this._ssoData.lastUsedUsername || this._strategies[strategy].name)
            .attr('title', this._ssoData.lastUsedUsername || this._strategies[strategy].name);
    }
  }
};

// sign in methods
Auth0Widget.prototype._signInSocial = function (target) {
  var strategyName = typeof target === 'string' ? target : target.getAttribute('data-strategy');
  var strategy = this._getConfiguredStrategy(strategyName);

  if (strategy) {
    this._auth0.login({
      connection: strategy.connections[0].name
    });
  }
};

Auth0Widget.prototype._signInEnterprise = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var container = this._getActiveLoginView();
  var form = $('form', container);
  var valid = true;

  var emailD = $('.email', form),
      emailE = $('input[name=email]', form),
      emailM = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(emailE.val().toLowerCase()),
      emailP = /^\s*$/.test(emailE.val()),
      domain, connection, email = null, strategy;

  for (var s in this._client.strategies) {
    strategy = this._client.strategies[s];

    if (this._isAuth0Conn(strategy.name)) continue;

    for (var c in strategy.connections) {
      if(!emailP && emailM && emailM.slice(-2)[0] == strategy.connections[c].domain) {
        domain = strategy.connections[c].domain;
        connection = strategy.connections[c].name;
        email = emailE.val();
        break;
      }
    }

    if (domain) break;
  }

  if (emailP) {
    this._showError(this._signinOptions['strategyEmailEmpty']);
  } 
  else if (!emailM) {
    this._showError(this._signinOptions['strategyEmailInvalid']);
  } 
  else if (!domain) {
    if (this._auth0Strategy) {
      return this._signInWithAuth0(emailE.val());
    }

    if (emailM && emailM.slice(-2)[0] === 'gmail.com') {
      return this._signInSocial('google-oauth2');
    }

    this._showError(
      this._signinOptions['strategyDomainInvalid']
          .replace('{domain}', emailM ? emailM.slice(-2)[0] : ''));
  }

  valid &= (!domain && !emailD.addClass('invalid')) || (!!domain && !!emailD.removeClass('invalid'));

  if (valid) {
    this._auth0.login({
      connection: connection
    });
  }
};

Auth0Widget.prototype._signInWithAuth0 = function (userName, signInPassword) {
  this._toggleSpinner();

  var self = this;
  var container = this._getActiveLoginView();
  var connection  = this._getAuth0Connection();
  
  // TODO: support auth0-adldap
  var loginOptions = {
    connection: connection.name,
    username: this._isAdLdapConn(connection.name) ? userName.replace('@' + connection.domain, '') : userName,
    password: signInPassword || $('.password input', container).val()
  };

  for (var k in this._auth0ConnectionParams) {
    loginOptions[k] = this._auth0ConnectionParams[k];
  }

  this._auth0.login(loginOptions, function (err) {
    if (err) {
      self._showError(self._parseResponseMessage(err, self._signinOptions['wrongEmailPasswordErrorText']));
    }

    self._toggleSpinner();
  });
};

Auth0Widget.prototype._signUpWithAuth0 = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var self = this;
  var container = $('.popup .panel.onestep .signup');
  var email = $('.email input', container).val();
  var password = $('.password input', container).val();
  var connection  = this._getAuth0Connection();

  this._toggleSpinner(container);

  this._auth0.signup({
    connection: connection.name,
    username:   email,
    password:   password
  }, 
  function (err) {
    if (err) {
      self._showError(self._parseResponseMessage(err, self._signinOptions['signupServerErrorText']));
      self._toggleSpinner(container);
      return;
    }

    return self._signInWithAuth0(email, password);
  });
};

Auth0Widget.prototype._resetPasswordWithAuth0 = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var self = this;
  var container = $('.popup .panel.onestep .reset');
  var email = $('.email input', container).val();
  var password = $('.password input', container).val();
  var connection  = this._getAuth0Connection();

  this._toggleSpinner(container);

  this._auth0.changePassword({
    connection: connection.name,
    username:   email,
    password:   password
  }, 
  function (err) {
    self._toggleSpinner(container);

    $('.password input', container).val('');
    $('.repeatPassword input', container).val('');

    if (err) {
      self._showError(self._parseResponseMessage(err, self._signinOptions['resetServerErrorText']));
      return;
    }

    $('.email input', container).val('');

    try { 
      $('.email input', container).first().focus(); 
    } catch(e) {}  

    self._setLoginView();
    self._showSuccess(self._signinOptions['resetSuccessText']);
  });
};

// initialize
Auth0Widget.prototype._initialize = function () {
  // TODO: support css option for non free subscriptions

  var self = this;
  bean.on($('.popup .panel.onestep a.close')[0], 'click', function () { self._hideSignIn(); });
  bean.on($('.popup .panel.onestep .notloggedin form')[0], 'submit', function (e) { self._signInEnterprise(e); });
  bean.on($('.popup .panel.onestep .signup form')[0], 'submit', function (e) { self._signUpWithAuth0(e); });
  bean.on($('.popup .panel.onestep .reset form')[0], 'submit', function (e) { self._resetPasswordWithAuth0(e); });
  bean.on(qwery('html')[0], 'keyup', function (e) {
    if ($().hasClass('mode-signin')) {
      if ((e.which == 27 || e.keycode == 27) && !self._signinOptions.standalone) {
        self._hideSignIn(); // close popup with ESC key
      }
    }
  });

  // load social buttons
  var list = $('.popup .panel.onestep .iconlist');
  for (var s in this._client.strategies) {
    var strategy = this._client.strategies[s];

    if (this._isAuth0Conn(strategy.name) && strategy.connections.length > 0) {
      this._auth0Strategy = strategy;
      $('.create-account, .password').css('display', 'block');

      bean.on($('.notloggedin .email input')[0], 'input', function (e) { self._showOrHidePassword(e); });
    }

    if (this._strategies[strategy.name] && this._strategies[strategy.name].social) {
      var button = bonzo(bonzo.create('<span></span>'))
        .attr('tabindex', 0)
        .attr('data-strategy', strategy.name)
        .attr('title', this._strategies[strategy.name].name)
        .addClass('zocial').addClass('icon')
        .addClass(this._strategies[strategy.name].css)
        .addClass(this._strategies[strategy.name].imageicon ? 'image-icon' : '')
        .html(this._strategies[strategy.name].name);

      list.append(button);
      list.css('display', 'block');

      $('.popup .panel.onestep .separator').css('display', 'block');
    }
  }

  $('.popup .panel.onestep .iconlist span').each(function (button) {
    bean.on(button, 'click', function (e) {
      self._signInSocial(e.target);
    });
  });

  this._showSignIn();
};

Auth0Widget.prototype._showSignIn = function () {
  var self = this;
  $().addClass('mode-signin');

  // if no social connections and one enterprise connection only, redirect
  if (!this._areThereAnySocialConn() && 
    this._client.strategies.length === 1 &&
    this._client.strategies[0].name !== 'auth0' &&
    this._client.strategies[0].connections.length === 1) {
    
    this._auth0.login({
      connection: this._client.strategies[0].connections[0].name
    });

    return;
  }

  // labels text
  var options = xtend(this._signinOptions, this._signinOptions.resources);
  options['onestep'] = typeof options['onestep'] !== 'undefined' ? options['onestep'] : false;
  options['top'] = options['top'] || false;
  options['title'] = options['title'] || 'Sign In';
  options['allButtonTemplate'] = options['allButtonTemplate'] || "Show all";
  options['strategyEmailEmpty'] = options['strategyEmailEmpty'] || "The email is empty.";
  options['strategyEmailInvalid'] = options['strategyEmailInvalid'] || "The email is invalid.";
  options['strategyDomainInvalid'] = options['strategyDomainInvalid'] || "The domain {domain} has not been setup.";

  options['icon'] = options['icon'] || "https://s3.amazonaws.com/assets.auth0.com/w2/img/logo-32.png";
  options['showIcon'] = typeof options['showIcon'] !== 'undefined' ? options['showIcon'] : false;
  options['showSignup'] = typeof options['showSignup'] !== 'undefined' ? options['showSignup'] : true;
  options['showForgot'] = typeof options['showForgot'] !== 'undefined' ? options['showForgot'] : true;
  options['signupText'] = options['signupText'] || 'Sign Up';
  options['forgotText'] = options['forgotText'] || 'Forgot your password?';
  options['signInButtonText'] = options['signInButtonText'] || 'Sign In';
  options['emailPlaceholder'] = options['emailPlaceholder'] || 'Email';
  options['passwordPlaceholder'] = options['passwordPlaceholder'] || 'Password';
  options['separatorText'] = options['separatorText'] || 'or';
  options['serverErrorText'] = options['serverErrorText'] || 'There was an error processing the sign in.';
  options['showEmail'] = typeof options['showEmail'] !== 'undefined' ? options['showEmail'] : true;
  options['showPassword'] = typeof options['showPassword'] !== 'undefined' ? options['showPassword'] : true;
  options['socialBigButtons'] = typeof options['socialBigButtons'] !== 'undefined' ? options['socialBigButtons'] : !this._areThereAnyEnterpriseOrDbConn();
  options['enableReturnUserExperience'] = typeof options['enableReturnUserExperience'] !== 'undefined' ? options['enableReturnUserExperience'] : true;
  options['returnUserLabel'] = options['returnUserLabel'] || 'Last time you signed in using...';
  options['wrongEmailPasswordErrorText'] = options['wrongEmailPasswordErrorText'] || 'Wrong email or password.';

  // signup
  options['signupTitle'] = options['signupTitle'] || 'Sign Up';
  options['signupButtonText'] = options['signupButtonText'] || 'Sign Up';
  options['signupEmailPlaceholder'] = options['signupEmailPlaceholder'] || 'Email';
  options['signupPasswordPlaceholder'] = options['signupPasswordPlaceholder'] || 'Create a Password';
  options['signupCancelButtonText'] = options['signupCancelButtonText'] || 'Cancel';
  options['signupHeaderText'] = typeof options['signupHeaderText'] !== 'undefined' ? options['signupHeaderText'] : 'Please enter your email and password';
  options['signupFooterText'] = typeof options['signupFooterText'] !== 'undefined' ? options['signupFooterText'] : 'By clicking "Sign Up", you agree to our terms of service and privacy policy.';
  options['signupEnterpriseEmailWarningText'] = options['signupEnterpriseEmailWarningText'] || 'This domain {domain} has been configured for Single Sign On and you can\'t create an account. Try signing in instead.';
  options['signupServerErrorText'] = options['signupServerErrorText'] || 'There was an error processing the sign up.';

  // reset
  options['resetTitle'] = options['resetTitle'] || 'Reset Password';
  options['resetButtonText'] = options['resetButtonText'] || 'Send';
  options['resetEmailPlaceholder'] = options['resetEmailPlaceholder'] || 'Email';
  options['resetPasswordPlaceholder'] = options['resetPasswordPlaceholder'] || 'New Password';
  options['resetRepeatPasswordPlaceholder'] = options['resetRepeatPasswordPlaceholder'] || 'Confirm New Password';
  options['resetCancelButtonText'] = options['resetCancelButtonText'] || 'Cancel';
  options['resetSuccessText'] = options['resetSuccessText'] || 'We\'ve just sent you an email to reset your password.';
  options['resetEnterSamePasswordText'] = options['resetEnterSamePasswordText'] || 'Please enter the same password.';
  options['resetHeaderText'] = typeof options['resetHeaderText'] !== 'undefined' ? options['resetHeaderText'] : 'Please enter your email and the new password. We will send you an email to confirm the password change.';
  options['resetServerErrorText'] = options['resetServerErrorText'] || 'There was an error processing the reset password.';

  this._signinOptions = options;

  // theme
  if (options.theme) {
    $().addClass('theme-' + options.theme);
  }

  $('.panel a.close').css('display', options.standalone ? 'none' : 'block');

  // show icon
  if (options.showIcon) {
    $('.panel .image img').attr('src', options.icon);
    $('.panel .image').css('display', options.showIcon ? 'block' : 'none');
  }

  // show signup/forgot links
  var auth0Conn = this._getAuth0Connection();
  if (auth0Conn) {
    options.showSignup = auth0Conn.showSignup;
    options.showForgot = auth0Conn.showForgot;
  }
  
  $('.panel .create-account .sign-up')
    .css('display', options.showSignup ? '' : 'none')
    .html(options.signupText);

  $('.panel .create-account .forgot-pass')
    .css('display', options.showForgot ? '' : 'none')
    .html(options.forgotText);

  if (options.signupLink) {
    $('.panel .create-account .sign-up')
      .attr('href', options.signupLink)
      .attr('target', '_parent');
  } 
  else {
    bean.on($('.panel .create-account .sign-up')[0], 'click', function (e) { self._showSignUpExperience(e); });
  }

  if (options.forgotLink) {
    $('.panel .create-account .forgot-pass')
      .attr('href', options.forgotLink)
      .attr('target', '_parent');
  } 
  else {
    $('.panel .create-account .forgot-pass').each(function (elem) {
      bean.on(elem, 'click', function (e) { self._showResetExperience(e); });
    });
  }

  // hide divider dot if there are one of two
  $('.panel .create-account .divider')
    .css('display', options.showEmail && options.showSignup && options.showForgot ? '' : 'none');

  $('div.panel input').each(function (e) { e.value = ''; });

  // placeholders and buttons
  $('.panel .zocial.primary').html(options.signInButtonText);
  $('.panel .email input').attr('placeholder', options.emailPlaceholder);
  $('.panel .password input').attr('placeholder', options.passwordPlaceholder);
  $('.panel .separator span').html(options.separatorText);

  // signup
  $('.panel .signup .zocial.primary').html(options.signupButtonText);

  $('.panel .signup .email input').each(function (i) { 
      i.setAttribute('placeholder', options.signupEmailPlaceholder);
      bean.on(i, 'input', function() {
        var output = {};
        if (self._isEnterpriseConnection(this.value, output)) {
          var warningText = options.signupEnterpriseEmailWarningText.replace(/{domain}/g, output.domain);
          this.setCustomValidity(warningText);
        } else {
          this.setCustomValidity('');
        }
      });
  });

  $('.panel .signup .password input').attr('placeholder', options.signupPasswordPlaceholder);

  $('.panel .signup .options .cancel').html(options['signupCancelButtonText']);
  bean.on($('.panel .signup .options .cancel')[0], 'click', function () { self._setLoginView(); });

  $('.panel .signup .header')
    .html(options.signupHeaderText)
    .attr('display', options.signupHeaderText ? '' : 'none');

  $('.panel .signup .footer')
    .html(options.signupFooterText)
    .attr('display', options.signupFooterText ? '' : 'none');

  // reset
  $('.panel .reset .zocial.primary').html(options.resetButtonText);
  $('.panel .reset .email input').attr('placeholder', options.resetEmailPlaceholder);
  $('.panel .reset .password input').attr('placeholder', options.resetPasswordPlaceholder);

  $('.panel .reset .repeatPassword input').each(function (i) { 
      i.setAttribute('placeholder', options.resetRepeatPasswordPlaceholder);
      bean.on(i, 'input', function() {
        if ($('.panel .reset .password input').val() != this.value) {
          this.setCustomValidity(options.resetEnterSamePasswordText);
        } else {
          this.setCustomValidity('');
        }
      });
  });

  $('.panel .reset .options .cancel').html(options.resetCancelButtonText);
  bean.on($('.panel .reset .options .cancel')[0], 'click', function () { self._setLoginView(); });

  $('.panel .reset .header')
    .html(options.resetHeaderText)
    .attr('display', options.resetHeaderText ? '' : 'none');

  // show email, password, separator and button if there are enterprise/db connections
  var anyEnterpriseOrDbConnection = this._areThereAnyEnterpriseOrDbConn();
  var anySocialConnection = this._areThereAnySocialConn();

  $('.panel .email input').css('display', options.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .zocial.primary').css('display', options.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .password input').css('display', options.showEmail && options.showPassword && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .create-account .forgot-pass').css('display', options.showEmail && options.showForgot && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .create-account .sign-up').css('display', options.showEmail && options.showSignup && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .separator').css('display', options.showEmail && anyEnterpriseOrDbConnection && anySocialConnection ? '' : 'none');
  $('.panel .last-time').html(options.returnUserLabel);

  // activate panel
  $('div.panel').removeClass('active');
  $('div.overlay').addClass('active');
  $('div.panel.onestep').addClass('active');

  $('.popup h1').html(options.title);
  $('.popup .invalid').removeClass('invalid');

  // if user logged in show logged in experience
  if (this._ssoData.sso && options['enableReturnUserExperience']) {
    this._showLoggedInExperience();
  }

  if (options['socialBigButtons']) {
    $('.popup .panel.onestep .iconlist span').removeClass('icon').addClass('block');
  } else {
    $('.popup .panel.onestep .iconlist span').addClass('icon').removeClass('block');
  }

  $('div.panel.onestep h1').html(options['title']);

  // TODO: support _signinOptions.container

  if (this._ssoData.sso && this._ssoData.lastUsedUsername) {
    $('div.panel.onestep input').val(this._ssoData.lastUsedUsername);
    this._showOrHidePassword();
  }

  this._setTop(options.top, $('div.panel.onestep'));
  this._setLoginView({ isReturningUser: this._ssoData.sso });
};

Auth0Widget.prototype._getConfiguredStrategies = function (conns) {
  var strategies = [];
  for (var conn in conns) {
    if (typeof(conns[conn].status) !== 'undefined' && !conns[conn].status) continue;

    var strategy = strategies.filter(function (s) { 
      return s.name === conns[conn].strategy; 
    })[0];

    if (!strategy) {
      strategy = {
        name: conns[conn].strategy,
        connections: []
      };

      strategies.push(strategy);
    }

    var connData = {
      name: conns[conn].name,
      domain: conns[conn].domain,
      showSignup: conns[conn].showSignup,
      showForgot: conns[conn].showForgot
    };

    strategy.connections.push(connData);
  }

  return strategies;
};

Auth0Widget.prototype.getClient = function () {
  return this._auth0;
};

Auth0Widget.prototype.show = function (signinOptions) {
  var self = this;
  this._signinOptions = xtend(this._options, signinOptions);
  this._auth0 = new Auth0({
    clientID:     this._signinOptions.clientID, 
    callbackURL:  this._signinOptions.callbackURL,
    domain:       this._signinOptions.domain
  });

  // TODO: set auth0 connection parameters
  this._auth0ConnectionParams = null;

  // get configured strategies/connections
  this._auth0.getConnections(function (err, connections) {
    var allowedConnections = [];

    // use only specified connections
    if (self._signinOptions.connections) {
      for (var i in connections) {
        if (self._signinOptions.connections.indexOf(connections[i].name) > -1) {
          allowedConnections.push(connections[i]);
        }
      }
    }
    else {
      allowedConnections = connections;
    }

    self._client = {
      strategies: self._getConfiguredStrategies(allowedConnections)
    };

    // get SSO data
    self._auth0.getSSOData(function (err, ssoData) {
      self._ssoData = ssoData;
      
      // remove widget container (if exist)
      $().parent().remove();

      // widget container
      var div = document.createElement('div');
      div.innerHTML = mainTmpl();
      document.body.appendChild(div);
      
      self._initialize();
    });
  });
};

module.exports = Auth0Widget;

},{"./html/main.html":24,"auth0-js":1,"bean":12,"bonzo":13,"qwery":15,"xtend":17}],26:[function(require,module,exports){
// indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    'use strict';
    if (this == null) {
      throw new TypeError();
    }
    var n, k, t = Object(this),
        len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

// filter
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun /*, thisp*/) {
    'use strict';

    if (!this) {
      throw new TypeError();
    }

    var objects = Object(this);
    var len = objects.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisp = arguments[1];
    for (var i in objects) {
      if (objects.hasOwnProperty(i)) {
        if (fun.call(thisp, objects[i], i, objects)) {
          res.push(objects[i]);
        }
      }
    }

    return res;
  };
}

},{}],27:[function(require,module,exports){
/* Placeholders.js v3.0.0 */
(function (global) {

    "use strict";

    // Cross-browser DOM event binding
    function addEventListener(elem, event, fn) {
        if (elem.addEventListener) {
            return elem.addEventListener(event, fn, false);
        }
        if (elem.attachEvent) {
            return elem.attachEvent("on" + event, fn);
        }
    }

    // Check whether an item is in an array (we don't use Array.prototype.indexOf so we don't clobber any existing polyfills - this is a really simple alternative)
    function inArray(arr, item) {
        var i, len;
        for (i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return true;
            }
        }
        return false;
    }

    // Move the caret to the index position specified. Assumes that the element has focus
    function moveCaret(elem, index) {
        var range;
        if (elem.createTextRange) {
            range = elem.createTextRange();
            range.move("character", index);
            range.select();
        } else if (elem.selectionStart) {
            elem.focus();
            elem.setSelectionRange(index, index);
        }
    }

    // Attempt to change the type property of an input element
    function changeType(elem, type) {
        try {
            elem.type = type;
            return true;
        } catch (e) {
            // You can't change input type in IE8 and below
            return false;
        }
    }

    // Expose public methods
    global.Placeholders = {
        Utils: {
            addEventListener: addEventListener,
            inArray: inArray,
            moveCaret: moveCaret,
            changeType: changeType
        }
    };

}(this));

(function (global) {

    "use strict";

    var validTypes = [
            "text",
            "search",
            "url",
            "tel",
            "email",
            "password",
            "number",
            "textarea"
        ],

        // The list of keycodes that are not allowed when the polyfill is configured to hide-on-input
        badKeys = [

            // The following keys all cause the caret to jump to the end of the input value
            27, // Escape
            33, // Page up
            34, // Page down
            35, // End
            36, // Home

            // Arrow keys allow you to move the caret manually, which should be prevented when the placeholder is visible
            37, // Left
            38, // Up
            39, // Right
            40, // Down

            // The following keys allow you to modify the placeholder text by removing characters, which should be prevented when the placeholder is visible
            8, // Backspace
            46 // Delete
        ],

        // Styling variables
        placeholderStyleColor = "#ccc",
        placeholderClassName = "placeholdersjs",
        classNameRegExp = new RegExp("(?:^|\\s)" + placeholderClassName + "(?!\\S)"),

        // These will hold references to all elements that can be affected. NodeList objects are live, so we only need to get those references once
        inputs, textareas,

        // The various data-* attributes used by the polyfill
        ATTR_CURRENT_VAL = "data-placeholder-value",
        ATTR_ACTIVE = "data-placeholder-active",
        ATTR_INPUT_TYPE = "data-placeholder-type",
        ATTR_FORM_HANDLED = "data-placeholder-submit",
        ATTR_EVENTS_BOUND = "data-placeholder-bound",
        ATTR_OPTION_FOCUS = "data-placeholder-focus",
        ATTR_OPTION_LIVE = "data-placeholder-live",
        ATTR_MAXLENGTH = "data-placeholder-maxlength",

        // Various other variables used throughout the rest of the script
        test = document.createElement("input"),
        head = document.getElementsByTagName("head")[0],
        root = document.documentElement,
        Placeholders = global.Placeholders,
        Utils = Placeholders.Utils,
        hideOnInput, liveUpdates, keydownVal, styleElem, styleRules, placeholder, timer, form, elem, len, i;

    // No-op (used in place of public methods when native support is detected)
    function noop() {}

    // Hide the placeholder value on a single element. Returns true if the placeholder was hidden and false if it was not (because it wasn't visible in the first place)
    function hidePlaceholder(elem, keydownValue) {
        var type,
            maxLength,
            valueChanged = (!!keydownValue && elem.value !== keydownValue),
            isPlaceholderValue = (elem.value === elem.getAttribute(ATTR_CURRENT_VAL));

        if ((valueChanged || isPlaceholderValue) && elem.getAttribute(ATTR_ACTIVE) === "true") {
            elem.removeAttribute(ATTR_ACTIVE);
            elem.value = elem.value.replace(elem.getAttribute(ATTR_CURRENT_VAL), "");
            elem.className = elem.className.replace(classNameRegExp, "");

            // Restore the maxlength value
            maxLength = elem.getAttribute(ATTR_MAXLENGTH);
            if (maxLength) {
                elem.setAttribute("maxLength", maxLength);
                elem.removeAttribute(ATTR_MAXLENGTH);
            }

            // If the polyfill has changed the type of the element we need to change it back
            type = elem.getAttribute(ATTR_INPUT_TYPE);
            if (type) {
                elem.type = type;
            }
            return true;
        }
        return false;
    }

    // Show the placeholder value on a single element. Returns true if the placeholder was shown and false if it was not (because it was already visible)
    function showPlaceholder(elem) {
        var type,
            maxLength,
            val = elem.getAttribute(ATTR_CURRENT_VAL);
        if (elem.value === "" && val) {
            elem.setAttribute(ATTR_ACTIVE, "true");
            elem.value = val;
            elem.className += " " + placeholderClassName;

            // Store and remove the maxlength value
            maxLength = elem.getAttribute(ATTR_MAXLENGTH);
            if (!maxLength) {
                elem.setAttribute(ATTR_MAXLENGTH, elem.maxLength);
                elem.removeAttribute("maxLength");
            }

            // If the type of element needs to change, change it (e.g. password inputs)
            type = elem.getAttribute(ATTR_INPUT_TYPE);
            if (type) {
                elem.type = "text";
            } else if (elem.type === "password") {
                if (Utils.changeType(elem, "text")) {
                    elem.setAttribute(ATTR_INPUT_TYPE, "password");
                }
            }
            return true;
        }
        return false;
    }

    function handleElem(node, callback) {

        var handleInputs, handleTextareas, elem, len, i;

        // Check if the passed in node is an input/textarea (in which case it can't have any affected descendants)
        if (node && node.getAttribute(ATTR_CURRENT_VAL)) {
            callback(node);
        } else {

            // If an element was passed in, get all affected descendants. Otherwise, get all affected elements in document
            handleInputs = node ? node.getElementsByTagName("input") : inputs;
            handleTextareas = node ? node.getElementsByTagName("textarea") : textareas;

            // Run the callback for each element
            for (i = 0, len = handleInputs.length + handleTextareas.length; i < len; i++) {
                elem = i < handleInputs.length ? handleInputs[i] : handleTextareas[i - handleInputs.length];
                callback(elem);
            }
        }
    }

    // Return all affected elements to their normal state (remove placeholder value if present)
    function disablePlaceholders(node) {
        handleElem(node, hidePlaceholder);
    }

    // Show the placeholder value on all appropriate elements
    function enablePlaceholders(node) {
        handleElem(node, showPlaceholder);
    }

    // Returns a function that is used as a focus event handler
    function makeFocusHandler(elem) {
        return function () {

            // Only hide the placeholder value if the (default) hide-on-focus behaviour is enabled
            if (hideOnInput && elem.value === elem.getAttribute(ATTR_CURRENT_VAL) && elem.getAttribute(ATTR_ACTIVE) === "true") {

                // Move the caret to the start of the input (this mimics the behaviour of all browsers that do not hide the placeholder on focus)
                Utils.moveCaret(elem, 0);

            } else {

                // Remove the placeholder
                hidePlaceholder(elem);
            }
        };
    }

    // Returns a function that is used as a blur event handler
    function makeBlurHandler(elem) {
        return function () {
            showPlaceholder(elem);
        };
    }

    // Functions that are used as a event handlers when the hide-on-input behaviour has been activated - very basic implementation of the "input" event
    function makeKeydownHandler(elem) {
        return function (e) {
            keydownVal = elem.value;

            //Prevent the use of the arrow keys (try to keep the cursor before the placeholder)
            if (elem.getAttribute(ATTR_ACTIVE) === "true") {
                if (keydownVal === elem.getAttribute(ATTR_CURRENT_VAL) && Utils.inArray(badKeys, e.keyCode)) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    return false;
                }
            }
        };
    }
    function makeKeyupHandler(elem) {
        return function () {
            hidePlaceholder(elem, keydownVal);

            // If the element is now empty we need to show the placeholder
            if (elem.value === "") {
                elem.blur();
                Utils.moveCaret(elem, 0);
            }
        };
    }
    function makeClickHandler(elem) {
        return function () {
            if (elem === document.activeElement && elem.value === elem.getAttribute(ATTR_CURRENT_VAL) && elem.getAttribute(ATTR_ACTIVE) === "true") {
                Utils.moveCaret(elem, 0);
            }
        };
    }

    // Returns a function that is used as a submit event handler on form elements that have children affected by this polyfill
    function makeSubmitHandler(form) {
        return function () {

            // Turn off placeholders on all appropriate descendant elements
            disablePlaceholders(form);
        };
    }

    // Bind event handlers to an element that we need to affect with the polyfill
    function newElement(elem) {

        // If the element is part of a form, make sure the placeholder string is not submitted as a value
        if (elem.form) {
            form = elem.form;

            // Set a flag on the form so we know it's been handled (forms can contain multiple inputs)
            if (!form.getAttribute(ATTR_FORM_HANDLED)) {
                Utils.addEventListener(form, "submit", makeSubmitHandler(form));
                form.setAttribute(ATTR_FORM_HANDLED, "true");
            }
        }

        // Bind event handlers to the element so we can hide/show the placeholder as appropriate
        Utils.addEventListener(elem, "focus", makeFocusHandler(elem));
        Utils.addEventListener(elem, "blur", makeBlurHandler(elem));

        // If the placeholder should hide on input rather than on focus we need additional event handlers
        if (hideOnInput) {
            Utils.addEventListener(elem, "keydown", makeKeydownHandler(elem));
            Utils.addEventListener(elem, "keyup", makeKeyupHandler(elem));
            Utils.addEventListener(elem, "click", makeClickHandler(elem));
        }

        // Remember that we've bound event handlers to this element
        elem.setAttribute(ATTR_EVENTS_BOUND, "true");
        elem.setAttribute(ATTR_CURRENT_VAL, placeholder);

        // If the element doesn't have a value and is not focussed, set it to the placeholder string
        if (hideOnInput || elem !== document.activeElement) {
            showPlaceholder(elem);
        }
    }

    Placeholders.nativeSupport = test.placeholder !== void 0;

    if (!Placeholders.nativeSupport) {

        // Get references to all the input and textarea elements currently in the DOM (live NodeList objects to we only need to do this once)
        inputs = document.getElementsByTagName("input");
        textareas = document.getElementsByTagName("textarea");

        // Get any settings declared as data-* attributes on the root element (currently the only options are whether to hide the placeholder on focus or input and whether to auto-update)
        hideOnInput = root.getAttribute(ATTR_OPTION_FOCUS) === "false";
        liveUpdates = root.getAttribute(ATTR_OPTION_LIVE) !== "false";

        // Create style element for placeholder styles (instead of directly setting style properties on elements - allows for better flexibility alongside user-defined styles)
        styleElem = document.createElement("style");
        styleElem.type = "text/css";

        // Create style rules as text node
        styleRules = document.createTextNode("." + placeholderClassName + " { color:" + placeholderStyleColor + "; }");

        // Append style rules to newly created stylesheet
        if (styleElem.styleSheet) {
            styleElem.styleSheet.cssText = styleRules.nodeValue;
        } else {
            styleElem.appendChild(styleRules);
        }

        // Prepend new style element to the head (before any existing stylesheets, so user-defined rules take precedence)
        head.insertBefore(styleElem, head.firstChild);

        // Set up the placeholders
        for (i = 0, len = inputs.length + textareas.length; i < len; i++) {
            elem = i < inputs.length ? inputs[i] : textareas[i - inputs.length];

            // Get the value of the placeholder attribute, if any. IE10 emulating IE7 fails with getAttribute, hence the use of the attributes node
            placeholder = elem.attributes.placeholder;
            if (placeholder) {

                // IE returns an empty object instead of undefined if the attribute is not present
                placeholder = placeholder.nodeValue;

                // Only apply the polyfill if this element is of a type that supports placeholders, and has a placeholder attribute with a non-empty value
                if (placeholder && Utils.inArray(validTypes, elem.type)) {
                    newElement(elem);
                }
            }
        }

        // If enabled, the polyfill will repeatedly check for changed/added elements and apply to those as well
        timer = setInterval(function () {
            for (i = 0, len = inputs.length + textareas.length; i < len; i++) {
                elem = i < inputs.length ? inputs[i] : textareas[i - inputs.length];

                // Only apply the polyfill if this element is of a type that supports placeholders, and has a placeholder attribute with a non-empty value
                placeholder = elem.attributes.placeholder;
                if (placeholder) {
                    placeholder = placeholder.nodeValue;
                    if (placeholder && Utils.inArray(validTypes, elem.type)) {

                        // If the element hasn't had event handlers bound to it then add them
                        if (!elem.getAttribute(ATTR_EVENTS_BOUND)) {
                            newElement(elem);
                        }

                        // If the placeholder value has changed or not been initialised yet we need to update the display
                        if (placeholder !== elem.getAttribute(ATTR_CURRENT_VAL) || (elem.type === "password" && !elem.getAttribute(ATTR_INPUT_TYPE))) {

                            // Attempt to change the type of password inputs (fails in IE < 9)
                            if (elem.type === "password" && !elem.getAttribute(ATTR_INPUT_TYPE) && Utils.changeType(elem, "text")) {
                                elem.setAttribute(ATTR_INPUT_TYPE, "password");
                            }

                            // If the placeholder value has changed and the placeholder is currently on display we need to change it
                            if (elem.value === elem.getAttribute(ATTR_CURRENT_VAL)) {
                                elem.value = placeholder;
                            }

                            // Keep a reference to the current placeholder value in case it changes via another script
                            elem.setAttribute(ATTR_CURRENT_VAL, placeholder);
                        }
                    }
                } else if (elem.getAttribute(ATTR_ACTIVE)) {
                    hidePlaceholder(elem);
                    elem.removeAttribute(ATTR_CURRENT_VAL);
                }
            }

            // If live updates are not enabled cancel the timer
            if (!liveUpdates) {
                clearInterval(timer);
            }
        }, 100);
    }

    // Expose public methods
    Placeholders.disable = Placeholders.nativeSupport ? noop : disablePlaceholders;
    Placeholders.enable = Placeholders.nativeSupport ? noop : enablePlaceholders;

}(this));
},{}]},{},[26,27,22])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvYXV0aDAtanMvaW5kZXguanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvYXV0aDAtanMvbGliL0xvZ2luRXJyb3IuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvYXV0aDAtanMvbGliL2Fzc2VydF9yZXF1aXJlZC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvYmFzZTY0X3VybF9kZWNvZGUuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvYXV0aDAtanMvbGliL2pzb25fcGFyc2UuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvYXV0aDAtanMvbGliL3VzZV9qc29ucC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvQmFzZTY0L2Jhc2U2NC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvanNvbnAvaW5kZXguanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvYXV0aDAtanMvbm9kZV9tb2R1bGVzL2pzb25wL25vZGVfbW9kdWxlcy9kZWJ1Zy9kZWJ1Zy5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvcXMvaW5kZXguanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvYXV0aDAtanMvbm9kZV9tb2R1bGVzL3JlcXdlc3QvcmVxd2VzdC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9iZWFuL2JlYW4uanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvYm9uem8vYm9uem8uanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL2ZzLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3F3ZXJ5L3F3ZXJ5LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL2hhcy1rZXlzLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL2luZGV4LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9mb3JlYWNoLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9ub2RlX21vZHVsZXMvb2JqZWN0LWtleXMvaXNBcmd1bWVudHMuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMveHRlbmQvbm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL3NoaW0uanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9zdGFuZGFsb25lLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvdmVuZG9yL2luc2VydC1jc3MuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy93aWRnZXQvaHRtbC9tYWluLmh0bWwiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy93aWRnZXQvaW5kZXguanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy93aWRnZXQvanMvYXJyYXlzLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvd2lkZ2V0L2pzL3BsYWNlaG9sZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcHVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdsb2JhbD10eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge307dmFyIGFzc2VydF9yZXF1aXJlZCAgID0gcmVxdWlyZSgnLi9saWIvYXNzZXJ0X3JlcXVpcmVkJyk7XG52YXIgYmFzZTY0X3VybF9kZWNvZGUgPSByZXF1aXJlKCcuL2xpYi9iYXNlNjRfdXJsX2RlY29kZScpO1xudmFyIHFzICAgICAgICAgICAgICAgID0gcmVxdWlyZSgncXMnKTtcbnZhciByZXF3ZXN0ICAgICAgICAgICA9IHJlcXVpcmUoJ3JlcXdlc3QnKTtcblxudmFyIGpzb25wICAgICAgICAgICAgID0gcmVxdWlyZSgnanNvbnAnKTtcblxudmFyIHVzZV9qc29ucCAgICAgICAgID0gcmVxdWlyZSgnLi9saWIvdXNlX2pzb25wJyk7XG52YXIgTG9naW5FcnJvciAgICAgICAgPSByZXF1aXJlKCcuL2xpYi9Mb2dpbkVycm9yJyk7XG52YXIganNvbl9wYXJzZSAgICAgICAgPSByZXF1aXJlKCcuL2xpYi9qc29uX3BhcnNlJyk7XG5cbmZ1bmN0aW9uIEF1dGgwIChvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBdXRoMCkpIHtcbiAgICByZXR1cm4gbmV3IEF1dGgwKG9wdGlvbnMpO1xuICB9XG5cbiAgYXNzZXJ0X3JlcXVpcmVkKG9wdGlvbnMsICdjbGllbnRJRCcpO1xuICBhc3NlcnRfcmVxdWlyZWQob3B0aW9ucywgJ2NhbGxiYWNrVVJMJyk7XG4gIGFzc2VydF9yZXF1aXJlZChvcHRpb25zLCAnZG9tYWluJyk7XG5cbiAgdGhpcy5fY2xpZW50SUQgPSBvcHRpb25zLmNsaWVudElEO1xuICB0aGlzLl9jYWxsYmFja1VSTCA9IG9wdGlvbnMuY2FsbGJhY2tVUkw7XG4gIHRoaXMuX2RvbWFpbiA9IG9wdGlvbnMuZG9tYWluO1xuICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgdGhpcy5wYXJzZUhhc2gob3B0aW9ucy5zdWNjZXNzKTtcbiAgfVxuICB0aGlzLl9mYWlsdXJlID0gb3B0aW9ucy5mYWlsdXJlO1xufVxuXG5BdXRoMC5wcm90b3R5cGUuX3JlZGlyZWN0ID0gZnVuY3Rpb24gKHVybCkge1xuICBnbG9iYWwud2luZG93LmxvY2F0aW9uID0gdXJsO1xufTtcblxuQXV0aDAucHJvdG90eXBlLl9yZW5kZXJBbmRTdWJtaXRXU0ZlZEZvcm0gPSBmdW5jdGlvbiAoZm9ybUh0bWwpIHtcbiAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gZm9ybUh0bWw7XG4gIHZhciBmb3JtID0gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpLmNoaWxkcmVuWzBdO1xuICBmb3JtLnN1Ym1pdCgpO1xufTtcblxuQXV0aDAucHJvdG90eXBlLnBhcnNlSGFzaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBpZighd2luZG93LmxvY2F0aW9uLmhhc2gubWF0Y2goL2FjY2Vzc190b2tlbi8pKSByZXR1cm47XG4gIHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpO1xuICB2YXIgcGFyc2VkX3FzID0gcXMucGFyc2UoaGFzaCk7XG4gIHZhciBpZF90b2tlbiA9IHBhcnNlZF9xcy5pZF90b2tlbjtcbiAgdmFyIGVuY29kZWQgPSBpZF90b2tlbi5zcGxpdCgnLicpWzFdO1xuICB2YXIgcHJvZiA9IGpzb25fcGFyc2UoYmFzZTY0X3VybF9kZWNvZGUoZW5jb2RlZCkpO1xuICBjYWxsYmFjayhwcm9mLCBpZF90b2tlbiwgcGFyc2VkX3FzLmFjY2Vzc190b2tlbiwgcGFyc2VkX3FzLnN0YXRlKTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5zaWdudXAgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBxdWVyeSA9IHtcbiAgICByZXNwb25zZV90eXBlOiAndG9rZW4nLFxuICAgIGNsaWVudF9pZDogICAgIHRoaXMuX2NsaWVudElELFxuICAgIGNvbm5lY3Rpb246ICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICByZWRpcmVjdF91cmk6ICB0aGlzLl9jYWxsYmFja1VSTCxcbiAgICBzY29wZTogICAgICAgICAnb3BlbmlkIHByb2ZpbGUnXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuc3RhdGUpIHtcbiAgICBxdWVyeS5zdGF0ZSA9IG9wdGlvbnMuc3RhdGU7XG4gIH1cblxuICBxdWVyeS5lbWFpbCA9IG9wdGlvbnMudXNlcm5hbWUgfHwgb3B0aW9ucy5lbWFpbDtcbiAgcXVlcnkucGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkO1xuXG4gIHF1ZXJ5LnRlbmFudCA9IHRoaXMuX2RvbWFpbi5zcGxpdCgnLicpWzBdO1xuXG4gIGZ1bmN0aW9uIHN1Y2Nlc3MgKCkge1xuICAgIGlmICgnYXV0b19sb2dpbicgaW4gb3B0aW9ucyAmJiAhb3B0aW9ucy5hdXRvX2xvZ2luKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYubG9naW4ob3B0aW9ucywgY2FsbGJhY2spO1xuICB9XG5cbiAgZnVuY3Rpb24gZmFpbCAoc3RhdHVzLCByZXNwKSB7XG4gICAgdmFyIGVycm9yID0gbmV3IExvZ2luRXJyb3Ioc3RhdHVzLCByZXNwKTtcbiAgICBpZiAoY2FsbGJhY2spICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICBpZiAoc2VsZi5fZmFpbHVyZSkgcmV0dXJuIHNlbGYuX2ZhaWx1cmUoZXJyb3IpO1xuICB9XG5cbiAgaWYgKHVzZV9qc29ucCgpKSB7XG4gICAgcmV0dXJuIGpzb25wKCdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL2RiY29ubmVjdGlvbnMvc2lnbnVwPycgKyBxcy5zdHJpbmdpZnkocXVlcnkpLCB7XG4gICAgICBwYXJhbTogJ2NieCcsXG4gICAgICB0aW1lb3V0OiAxNTAwMFxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGZhaWwoMCwgZXJyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwLnN0YXR1cyA9PSAyMDAgP1xuICAgICAgICAgICAgICBzdWNjZXNzKCkgOlxuICAgICAgICAgICAgICBmYWlsKHJlc3Auc3RhdHVzLCByZXNwLmVycik7XG4gICAgfSk7XG4gIH1cblxuICByZXF3ZXN0KHtcbiAgICB1cmw6ICAgICAnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL3NpZ251cCcsXG4gICAgbWV0aG9kOiAgJ3Bvc3QnLFxuICAgIHR5cGU6ICAgICdodG1sJyxcbiAgICBkYXRhOiAgICBxdWVyeSxcbiAgICBzdWNjZXNzOiBzdWNjZXNzLFxuICAgIGNyb3NzT3JpZ2luOiB0cnVlXG4gIH0pLmZhaWwoZnVuY3Rpb24gKGVycikge1xuICAgIGZhaWwoZXJyLnN0YXR1cywgZXJyLnJlc3BvbnNlVGV4dCk7XG4gIH0pO1xufTtcblxuQXV0aDAucHJvdG90eXBlLmNoYW5nZVBhc3N3b3JkID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHF1ZXJ5ID0ge1xuICAgIHRlbmFudDogICAgICAgICB0aGlzLl9kb21haW4uc3BsaXQoJy4nKVswXSxcbiAgICBjb25uZWN0aW9uOiAgICAgb3B0aW9ucy5jb25uZWN0aW9uLFxuICAgIGVtYWlsOiAgICAgICAgICBvcHRpb25zLnVzZXJuYW1lIHx8IG9wdGlvbnMuZW1haWwsXG4gICAgcGFzc3dvcmQ6ICAgICAgIG9wdGlvbnMucGFzc3dvcmRcbiAgfTtcblxuICBmdW5jdGlvbiBzdWNjZXNzICgpIHtcbiAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gIH1cblxuICBmdW5jdGlvbiBmYWlsIChzdGF0dXMsIHJlc3ApIHtcbiAgICB2YXIgZXJyb3IgPSBuZXcgTG9naW5FcnJvcihzdGF0dXMsIHJlc3ApO1xuICAgIGlmIChjYWxsYmFjaykgICAgICByZXR1cm4gY2FsbGJhY2soZXJyb3IpO1xuICAgIGlmIChzZWxmLl9mYWlsdXJlKSByZXR1cm4gc2VsZi5fZmFpbHVyZShlcnJvcik7XG4gIH1cblxuICBpZiAodXNlX2pzb25wKCkpIHtcbiAgICByZXR1cm4ganNvbnAoJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvZGJjb25uZWN0aW9ucy9jaGFuZ2VfcGFzc3dvcmQ/JyArIHFzLnN0cmluZ2lmeShxdWVyeSksIHtcbiAgICAgIHBhcmFtOiAnY2J4JyxcbiAgICAgIHRpbWVvdXQ6IDE1MDAwXG4gICAgfSwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gZmFpbCgwLCBlcnIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3Auc3RhdHVzID09IDIwMCA/XG4gICAgICAgICAgICAgIHN1Y2Nlc3MoKSA6XG4gICAgICAgICAgICAgIGZhaWwocmVzcC5zdGF0dXMsIHJlc3AuZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcXdlc3Qoe1xuICAgIHVybDogICAgICdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL2RiY29ubmVjdGlvbnMvY2hhbmdlX3Bhc3N3b3JkJyxcbiAgICBtZXRob2Q6ICAncG9zdCcsXG4gICAgdHlwZTogICAgJ2h0bWwnLFxuICAgIGRhdGE6ICAgIHF1ZXJ5LFxuICAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gICAgY3Jvc3NPcmlnaW46IHRydWVcbiAgfSkuZmFpbChmdW5jdGlvbiAoZXJyKSB7XG4gICAgZmFpbChlcnIuc3RhdHVzLCBlcnIucmVzcG9uc2VUZXh0KTtcbiAgfSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUubG9naW4gPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKG9wdGlvbnMudXNlcm5hbWUgfHwgb3B0aW9ucy5lbWFpbCkge1xuICAgIHJldHVybiB0aGlzLmxvZ2luV2l0aERiQ29ubmVjdGlvbihvcHRpb25zLCBjYWxsYmFjayk7XG4gIH1cblxuICB2YXIgcXVlcnkgPSB7XG4gICAgcmVzcG9uc2VfdHlwZTogJ3Rva2VuJyxcbiAgICBjbGllbnRfaWQ6ICAgICB0aGlzLl9jbGllbnRJRCxcbiAgICBjb25uZWN0aW9uOiAgICBvcHRpb25zLmNvbm5lY3Rpb24sXG4gICAgcmVkaXJlY3RfdXJpOiAgdGhpcy5fY2FsbGJhY2tVUkwsXG4gICAgc2NvcGU6ICAgICAgICAgJ29wZW5pZCBwcm9maWxlJ1xuICB9O1xuXG4gIGlmIChvcHRpb25zLnN0YXRlKSB7XG4gICAgcXVlcnkuc3RhdGUgPSBvcHRpb25zLnN0YXRlO1xuICB9XG5cbiAgdGhpcy5fcmVkaXJlY3QoJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvYXV0aG9yaXplPycgKyBxcy5zdHJpbmdpZnkocXVlcnkpKTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5sb2dpbldpdGhEYkNvbm5lY3Rpb24gPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBxdWVyeSA9IHtcbiAgICByZXNwb25zZV90eXBlOiAndG9rZW4nLFxuICAgIGNsaWVudF9pZDogICAgIHRoaXMuX2NsaWVudElELFxuICAgIGNvbm5lY3Rpb246ICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICByZWRpcmVjdF91cmk6ICB0aGlzLl9jYWxsYmFja1VSTCxcbiAgICBzY29wZTogICAgICAgICAnb3BlbmlkIHByb2ZpbGUnXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuc3RhdGUpIHtcbiAgICBxdWVyeS5zdGF0ZSA9IG9wdGlvbnMuc3RhdGU7XG4gIH1cblxuICBxdWVyeS51c2VybmFtZSA9IG9wdGlvbnMudXNlcm5hbWUgfHwgb3B0aW9ucy5lbWFpbDtcbiAgcXVlcnkucGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkO1xuXG4gIHF1ZXJ5LnRlbmFudCA9IHRoaXMuX2RvbWFpbi5zcGxpdCgnLicpWzBdO1xuXG4gIGZ1bmN0aW9uIHJldHVybl9lcnJvciAoZXJyb3IpIHtcbiAgICBpZiAoY2FsbGJhY2spICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICBpZiAoc2VsZi5fZmFpbHVyZSkgcmV0dXJuIHNlbGYuX2ZhaWx1cmUoZXJyb3IpO1xuICB9XG5cbiAgaWYgKHVzZV9qc29ucCgpKSB7XG4gICAgcmV0dXJuIGpzb25wKCdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL2RiY29ubmVjdGlvbnMvbG9naW4/JyArIHFzLnN0cmluZ2lmeShxdWVyeSksIHtcbiAgICAgIHBhcmFtOiAnY2J4JyxcbiAgICAgIHRpbWVvdXQ6IDE1MDAwXG4gICAgfSwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gcmV0dXJuX2Vycm9yKGVycik7XG4gICAgICB9XG4gICAgICBpZignZXJyb3InIGluIHJlc3ApIHtcbiAgICAgICAgdmFyIGVycm9yID0gbmV3IExvZ2luRXJyb3IocmVzcC5zdGF0dXMsIHJlc3AuZXJyb3IpO1xuICAgICAgICByZXR1cm4gcmV0dXJuX2Vycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuX3JlbmRlckFuZFN1Ym1pdFdTRmVkRm9ybShyZXNwLmZvcm0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVxd2VzdCh7XG4gICAgdXJsOiAgICAgJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvZGJjb25uZWN0aW9ucy9sb2dpbicsXG4gICAgbWV0aG9kOiAgJ3Bvc3QnLFxuICAgIHR5cGU6ICAgICdodG1sJyxcbiAgICBkYXRhOiAgICBxdWVyeSxcbiAgICBjcm9zc09yaWdpbjogdHJ1ZSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcCkge1xuICAgICAgc2VsZi5fcmVuZGVyQW5kU3VibWl0V1NGZWRGb3JtKHJlc3ApO1xuICAgIH1cbiAgfSkuZmFpbChmdW5jdGlvbiAoZXJyKSB7XG4gICAgdmFyIGVyID0gZXJyO1xuICAgIGlmICghZXIuc3RhdHVzIHx8IGVyLnN0YXR1cyA9PT0gMCkgeyAvL2llMTAgdHJpY2tcbiAgICAgIGVyID0ge307XG4gICAgICBlci5zdGF0dXMgPSA0MDE7XG4gICAgICBlci5yZXNwb25zZVRleHQgPSB7XG4gICAgICAgIGNvZGU6ICdpbnZhbGlkX3VzZXJfcGFzc3dvcmQnXG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgZXJyb3IgPSBuZXcgTG9naW5FcnJvcihlci5zdGF0dXMsIGVyLnJlc3BvbnNlVGV4dCk7XG4gICAgcmV0dXJuIHJldHVybl9lcnJvcihlcnJvcik7XG4gIH0pO1xufTtcblxuQXV0aDAucHJvdG90eXBlLmdldFNTT0RhdGEgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGpzb25wKCdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL3VzZXIvc3NvZGF0YScsIHtcbiAgICBwYXJhbTogJ2NieCcsXG4gICAgdGltZW91dDogMTUwMDBcbiAgfSwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgIGNhbGxiYWNrKG51bGwsIGVyciA/wqB7fSA6IHJlc3ApOyAvLyBBbHdheXMgcmV0dXJuIE9LLCByZWdhcmRsZXNzIG9mIGFueSBlcnJvcnNcbiAgfSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuZ2V0Q29ubmVjdGlvbnMgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGpzb25wKCdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL3B1YmxpYy9hcGkvJyArIHRoaXMuX2NsaWVudElEICsgJy9jb25uZWN0aW9ucycsIHtcbiAgICBwYXJhbTogJ2NieCcsXG4gICAgdGltZW91dDogMTUwMDBcbiAgfSwgY2FsbGJhY2spO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDtcbiIsInZhciBqc29uX3BhcnNlID0gcmVxdWlyZSgnLi9qc29uX3BhcnNlJyk7XG5cbmZ1bmN0aW9uIExvZ2luRXJyb3Ioc3RhdHVzLCBkZXRhaWxzKSB7XG4gIHZhciBvYmo7XG5cbiAgaWYgKHR5cGVvZiBkZXRhaWxzID09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIG9iaiA9IGpzb25fcGFyc2UoZGV0YWlscyk7XG4gICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgIG9iaiA9IHttZXNzYWdlOiBkZXRhaWxzfTsgICAgICBcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb2JqID0gZGV0YWlscztcbiAgfVxuXG4gIHZhciBlcnIgPSBFcnJvci5jYWxsKHRoaXMsIG9iai5kZXNjcmlwdGlvbiB8fCBvYmoubWVzc2FnZSB8fCBvYmouZXJyb3IpO1xuXG4gIGVyci5zdGF0dXMgPSBzdGF0dXM7XG4gIGVyci5uYW1lID0gb2JqLmNvZGU7XG4gIGVyci5jb2RlID0gb2JqLmNvZGU7XG4gIGVyci5kZXRhaWxzID0gb2JqO1xuICBcbiAgaWYgKHN0YXR1cyA9PT0gMCkge1xuICAgIGVyci5jb2RlID0gXCJVbmtub3duXCI7XG4gICAgZXJyLm1lc3NhZ2UgPSBcIlVua25vd24gZXJyb3IuXCI7XG4gIH1cblxuICByZXR1cm4gZXJyO1xufVxuXG5pZiAoT2JqZWN0ICYmIE9iamVjdC5jcmVhdGUpIHtcbiAgTG9naW5FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSwgeyBcbiAgICBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogTG9naW5FcnJvciB9IFxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2dpbkVycm9yOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaiwgcHJvcCkge1xuICBpZiAoIW9ialtwcm9wXSkge1xuICAgIHRocm93IG5ldyBFcnJvcihwcm9wICsgJyBpcyByZXF1aXJlZC4nKTtcbiAgfVxufTsiLCJ2YXIgQmFzZTY0ID0gcmVxdWlyZSgnQmFzZTY0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RyKSB7XG4gIHZhciBvdXRwdXQgPSBzdHIucmVwbGFjZShcIi1cIiwgXCIrXCIpLnJlcGxhY2UoXCJfXCIsIFwiL1wiKTtcbiAgc3dpdGNoIChvdXRwdXQubGVuZ3RoICUgNCkge1xuICAgIGNhc2UgMDpcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMjpcbiAgICAgIG91dHB1dCArPSBcIj09XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDM6XG4gICAgICBvdXRwdXQgKz0gXCI9XCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgXCJJbGxlZ2FsIGJhc2U2NHVybCBzdHJpbmchXCI7XG4gIH1cbiAgcmV0dXJuIEJhc2U2NC5hdG9iKG91dHB1dCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gd2luZG93LkpTT04gPyB3aW5kb3cuSlNPTi5wYXJzZShzdHIpIDogZXZhbCgnKCcgKyBzdHIgKyAnKScpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHhociA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbnVsbDtcbiAgXG4gIGlmICh4aHIgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuICdYRG9tYWluUmVxdWVzdCcgaW4gd2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6Jztcbn07IiwiOyhmdW5jdGlvbiAoKSB7XG5cbiAgdmFyXG4gICAgb2JqZWN0ID0gdHlwZW9mIGV4cG9ydHMgIT0gJ3VuZGVmaW5lZCcgPyBleHBvcnRzIDogdGhpcywgLy8gIzg6IHdlYiB3b3JrZXJzXG4gICAgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nLFxuICAgIElOVkFMSURfQ0hBUkFDVEVSX0VSUiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBmYWJyaWNhdGUgYSBzdWl0YWJsZSBlcnJvciBvYmplY3RcbiAgICAgIHRyeSB7IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJyQnKTsgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7IHJldHVybiBlcnJvcjsgfX0oKSk7XG5cbiAgLy8gZW5jb2RlclxuICAvLyBbaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vOTk5MTY2XSBieSBbaHR0cHM6Ly9naXRodWIuY29tL25pZ25hZ11cbiAgb2JqZWN0LmJ0b2EgfHwgKFxuICBvYmplY3QuYnRvYSA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGZvciAoXG4gICAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuICAgICAgdmFyIGJsb2NrLCBjaGFyQ29kZSwgaWR4ID0gMCwgbWFwID0gY2hhcnMsIG91dHB1dCA9ICcnO1xuICAgICAgLy8gaWYgdGhlIG5leHQgaW5wdXQgaW5kZXggZG9lcyBub3QgZXhpc3Q6XG4gICAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuICAgICAgLy8gICBjaGVjayBpZiBkIGhhcyBubyBmcmFjdGlvbmFsIGRpZ2l0c1xuICAgICAgaW5wdXQuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuICAgICAgLy8gXCI4IC0gaWR4ICUgMSAqIDhcIiBnZW5lcmF0ZXMgdGhlIHNlcXVlbmNlIDIsIDQsIDYsIDhcbiAgICAgIG91dHB1dCArPSBtYXAuY2hhckF0KDYzICYgYmxvY2sgPj4gOCAtIGlkeCAlIDEgKiA4KVxuICAgICkge1xuICAgICAgY2hhckNvZGUgPSBpbnB1dC5jaGFyQ29kZUF0KGlkeCArPSAzLzQpO1xuICAgICAgaWYgKGNoYXJDb2RlID4gMHhGRikgdGhyb3cgSU5WQUxJRF9DSEFSQUNURVJfRVJSO1xuICAgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH0pO1xuXG4gIC8vIGRlY29kZXJcbiAgLy8gW2h0dHBzOi8vZ2lzdC5naXRodWIuY29tLzEwMjAzOTZdIGJ5IFtodHRwczovL2dpdGh1Yi5jb20vYXRrXVxuICBvYmplY3QuYXRvYiB8fCAoXG4gIG9iamVjdC5hdG9iID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKC89KyQvLCAnJylcbiAgICBpZiAoaW5wdXQubGVuZ3RoICUgNCA9PSAxKSB0aHJvdyBJTlZBTElEX0NIQVJBQ1RFUl9FUlI7XG4gICAgZm9yIChcbiAgICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyc1xuICAgICAgdmFyIGJjID0gMCwgYnMsIGJ1ZmZlciwgaWR4ID0gMCwgb3V0cHV0ID0gJyc7XG4gICAgICAvLyBnZXQgbmV4dCBjaGFyYWN0ZXJcbiAgICAgIGJ1ZmZlciA9IGlucHV0LmNoYXJBdChpZHgrKyk7XG4gICAgICAvLyBjaGFyYWN0ZXIgZm91bmQgaW4gdGFibGU/IGluaXRpYWxpemUgYml0IHN0b3JhZ2UgYW5kIGFkZCBpdHMgYXNjaWkgdmFsdWU7XG4gICAgICB+YnVmZmVyICYmIChicyA9IGJjICUgNCA/IGJzICogNjQgKyBidWZmZXIgOiBidWZmZXIsXG4gICAgICAgIC8vIGFuZCBpZiBub3QgZmlyc3Qgb2YgZWFjaCA0IGNoYXJhY3RlcnMsXG4gICAgICAgIC8vIGNvbnZlcnQgdGhlIGZpcnN0IDggYml0cyB0byBvbmUgYXNjaWkgY2hhcmFjdGVyXG4gICAgICAgIGJjKysgJSA0KSA/IG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDI1NSAmIGJzID4+ICgtMiAqIGJjICYgNikpIDogMFxuICAgICkge1xuICAgICAgLy8gdHJ5IHRvIGZpbmQgY2hhcmFjdGVyIGluIHRhYmxlICgwLTYzLCBub3QgZm91bmQgPT4gLTEpXG4gICAgICBidWZmZXIgPSBjaGFycy5pbmRleE9mKGJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH0pO1xuXG59KCkpO1xuIiwiXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdqc29ucCcpO1xuXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ganNvbnA7XG5cbi8qKlxuICogQ2FsbGJhY2sgaW5kZXguXG4gKi9cblxudmFyIGNvdW50ID0gMDtcblxuLyoqXG4gKiBOb29wIGZ1bmN0aW9uLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuXG4vKipcbiAqIEpTT05QIGhhbmRsZXJcbiAqXG4gKiBPcHRpb25zOlxuICogIC0gcGFyYW0ge1N0cmluZ30gcXMgcGFyYW1ldGVyIChgY2FsbGJhY2tgKVxuICogIC0gdGltZW91dCB7TnVtYmVyfSBob3cgbG9uZyBhZnRlciBhIHRpbWVvdXQgZXJyb3IgaXMgZW1pdHRlZCAoYDYwMDAwYClcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge09iamVjdHxGdW5jdGlvbn0gb3B0aW9uYWwgb3B0aW9ucyAvIGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25hbCBjYWxsYmFja1xuICovXG5cbmZ1bmN0aW9uIGpzb25wKHVybCwgb3B0cywgZm4pe1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygb3B0cykge1xuICAgIGZuID0gb3B0cztcbiAgICBvcHRzID0ge307XG4gIH1cblxuICB2YXIgb3B0cyA9IG9wdHMgfHwge307XG4gIHZhciBwYXJhbSA9IG9wdHMucGFyYW0gfHwgJ2NhbGxiYWNrJztcbiAgdmFyIHRpbWVvdXQgPSBudWxsICE9IG9wdHMudGltZW91dCA/IG9wdHMudGltZW91dCA6IDYwMDAwO1xuICB2YXIgZW5jID0gZW5jb2RlVVJJQ29tcG9uZW50O1xuICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICB2YXIgc2NyaXB0O1xuICB2YXIgdGltZXI7XG5cbiAgLy8gZ2VuZXJhdGUgYSB1bmlxdWUgaWQgZm9yIHRoaXMgcmVxdWVzdFxuICB2YXIgaWQgPSBjb3VudCsrO1xuXG4gIGlmICh0aW1lb3V0KSB7XG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBjbGVhbnVwKCk7XG4gICAgICBmbiAmJiBmbihuZXcgRXJyb3IoJ1RpbWVvdXQnKSk7XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhbnVwKCl7XG4gICAgdGFyZ2V0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICB3aW5kb3dbJ19fanAnICsgaWRdID0gbm9vcDtcbiAgfVxuXG4gIHdpbmRvd1snX19qcCcgKyBpZF0gPSBmdW5jdGlvbihkYXRhKXtcbiAgICBkZWJ1ZygnanNvbnAgZ290JywgZGF0YSk7XG4gICAgaWYgKHRpbWVyKSBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIGNsZWFudXAoKTtcbiAgICBmbiAmJiBmbihudWxsLCBkYXRhKTtcbiAgfTtcblxuICAvLyBhZGQgcXMgY29tcG9uZW50XG4gIHVybCArPSAofnVybC5pbmRleE9mKCc/JykgPyAnJicgOiAnPycpICsgcGFyYW0gKyAnPScgKyBlbmMoJ19fanAnICsgaWQgKyAnJyk7XG4gIHVybCA9IHVybC5yZXBsYWNlKCc/JicsICc/Jyk7XG5cbiAgZGVidWcoJ2pzb25wIHJlcSBcIiVzXCInLCB1cmwpO1xuXG4gIC8vIGNyZWF0ZSBzY3JpcHRcbiAgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHNjcmlwdC5zcmMgPSB1cmw7XG4gIHRhcmdldC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHRhcmdldCk7XG59O1xuIiwiXG4vKipcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYnVnO1xuXG4vKipcbiAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7VHlwZX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGVidWcobmFtZSkge1xuICBpZiAoIWRlYnVnLmVuYWJsZWQobmFtZSkpIHJldHVybiBmdW5jdGlvbigpe307XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGZtdCl7XG4gICAgdmFyIGN1cnIgPSBuZXcgRGF0ZTtcbiAgICB2YXIgbXMgPSBjdXJyIC0gKGRlYnVnW25hbWVdIHx8IGN1cnIpO1xuICAgIGRlYnVnW25hbWVdID0gY3VycjtcblxuICAgIGZtdCA9IG5hbWVcbiAgICAgICsgJyAnXG4gICAgICArIGZtdFxuICAgICAgKyAnICsnICsgZGVidWcuaHVtYW5pemUobXMpO1xuXG4gICAgLy8gVGhpcyBoYWNrZXJ5IGlzIHJlcXVpcmVkIGZvciBJRThcbiAgICAvLyB3aGVyZSBgY29uc29sZS5sb2dgIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG4gICAgd2luZG93LmNvbnNvbGVcbiAgICAgICYmIGNvbnNvbGUubG9nXG4gICAgICAmJiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlLmxvZywgY29uc29sZSwgYXJndW1lbnRzKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMuXG4gKi9cblxuZGVidWcubmFtZXMgPSBbXTtcbmRlYnVnLnNraXBzID0gW107XG5cbi8qKlxuICogRW5hYmxlcyBhIGRlYnVnIG1vZGUgYnkgbmFtZS4gVGhpcyBjYW4gaW5jbHVkZSBtb2Rlc1xuICogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5kZWJ1Zy5lbmFibGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHRyeSB7XG4gICAgbG9jYWxTdG9yYWdlLmRlYnVnID0gbmFtZTtcbiAgfSBjYXRjaChlKXt9XG5cbiAgdmFyIHNwbGl0ID0gKG5hbWUgfHwgJycpLnNwbGl0KC9bXFxzLF0rLylcbiAgICAsIGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgbmFtZSA9IHNwbGl0W2ldLnJlcGxhY2UoJyonLCAnLio/Jyk7XG4gICAgaWYgKG5hbWVbMF0gPT09ICctJykge1xuICAgICAgZGVidWcuc2tpcHMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWUuc3Vic3RyKDEpICsgJyQnKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZGVidWcubmFtZXMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWUgKyAnJCcpKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5kZWJ1Zy5kaXNhYmxlID0gZnVuY3Rpb24oKXtcbiAgZGVidWcuZW5hYmxlKCcnKTtcbn07XG5cbi8qKlxuICogSHVtYW5pemUgdGhlIGdpdmVuIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmRlYnVnLmh1bWFuaXplID0gZnVuY3Rpb24obXMpIHtcbiAgdmFyIHNlYyA9IDEwMDBcbiAgICAsIG1pbiA9IDYwICogMTAwMFxuICAgICwgaG91ciA9IDYwICogbWluO1xuXG4gIGlmIChtcyA+PSBob3VyKSByZXR1cm4gKG1zIC8gaG91cikudG9GaXhlZCgxKSArICdoJztcbiAgaWYgKG1zID49IG1pbikgcmV0dXJuIChtcyAvIG1pbikudG9GaXhlZCgxKSArICdtJztcbiAgaWYgKG1zID49IHNlYykgcmV0dXJuIChtcyAvIHNlYyB8IDApICsgJ3MnO1xuICByZXR1cm4gbXMgKyAnbXMnO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG1vZGUgbmFtZSBpcyBlbmFibGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmRlYnVnLmVuYWJsZWQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkZWJ1Zy5za2lwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChkZWJ1Zy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkZWJ1Zy5uYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChkZWJ1Zy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gcGVyc2lzdFxuXG5pZiAod2luZG93LmxvY2FsU3RvcmFnZSkgZGVidWcuZW5hYmxlKGxvY2FsU3RvcmFnZS5kZWJ1Zyk7XG4iLCIvKipcbiAqIE9iamVjdCN0b1N0cmluZygpIHJlZiBmb3Igc3RyaW5naWZ5KCkuXG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBPYmplY3QjaGFzT3duUHJvcGVydHkgcmVmXG4gKi9cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBzZWUgaXNzdWUgIzcwXG4gKi9cbnZhciBpc1Jlc3RvcmFibGVQcm90byA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBvO1xuXG4gIGlmICghT2JqZWN0LmNyZWF0ZSkgcmV0dXJuIGZhbHNlO1xuXG4gIG8gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBvLl9fcHJvdG9fXyA9IE9iamVjdC5wcm90b3R5cGU7XG5cbiAgcmV0dXJuIG8uaGFzT3duUHJvcGVydHkgPT09IGhhc093blByb3BlcnR5O1xufSkoKTtcblxuLyoqXG4gKiBBcnJheSNpbmRleE9mIHNoaW0uXG4gKi9cblxudmFyIGluZGV4T2YgPSB0eXBlb2YgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbidcbiAgPyBmdW5jdGlvbihhcnIsIGVsKSB7IHJldHVybiBhcnIuaW5kZXhPZihlbCk7IH1cbiAgOiBmdW5jdGlvbihhcnIsIGVsKSB7XG4gICAgICBpZiAodHlwZW9mIGFyciA9PSAnc3RyaW5nJyAmJiB0eXBlb2YgXCJhXCJbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgYXJyID0gYXJyLnNwbGl0KCcnKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhcnJbaV0gPT09IGVsKSByZXR1cm4gaTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuXG4vKipcbiAqIEFycmF5LmlzQXJyYXkgc2hpbS5cbiAqL1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24oYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbi8qKlxuICogT2JqZWN0LmtleXMgc2hpbS5cbiAqL1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHJldC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG4vKipcbiAqIEFycmF5I2ZvckVhY2ggc2hpbS5cbiAqL1xuXG52YXIgZm9yRWFjaCA9IHR5cGVvZiBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9PT0gJ2Z1bmN0aW9uJ1xuICA/IGZ1bmN0aW9uKGFyciwgZm4pIHsgcmV0dXJuIGFyci5mb3JFYWNoKGZuKTsgfVxuICA6IGZ1bmN0aW9uKGFyciwgZm4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBmbihhcnJbaV0pO1xuICAgIH07XG5cbi8qKlxuICogQXJyYXkjcmVkdWNlIHNoaW0uXG4gKi9cblxudmFyIHJlZHVjZSA9IGZ1bmN0aW9uKGFyciwgZm4sIGluaXRpYWwpIHtcbiAgaWYgKHR5cGVvZiBhcnIucmVkdWNlID09PSAnZnVuY3Rpb24nKSByZXR1cm4gYXJyLnJlZHVjZShmbiwgaW5pdGlhbCk7XG4gIHZhciByZXMgPSBpbml0aWFsO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgcmVzID0gZm4ocmVzLCBhcnJbaV0pO1xuICByZXR1cm4gcmVzO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBudWxsYXJ5IG9iamVjdCBpZiBwb3NzaWJsZVxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdCgpIHtcbiAgcmV0dXJuIGlzUmVzdG9yYWJsZVByb3RvXG4gICAgPyBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgOiB7fTtcbn1cblxuLyoqXG4gKiBDYWNoZSBub24taW50ZWdlciB0ZXN0IHJlZ2V4cC5cbiAqL1xuXG52YXIgaXNpbnQgPSAvXlswLTldKyQvO1xuXG5mdW5jdGlvbiBwcm9tb3RlKHBhcmVudCwga2V5KSB7XG4gIGlmIChwYXJlbnRba2V5XS5sZW5ndGggPT0gMCkgcmV0dXJuIHBhcmVudFtrZXldID0gY3JlYXRlT2JqZWN0KCk7XG4gIHZhciB0ID0gY3JlYXRlT2JqZWN0KCk7XG4gIGZvciAodmFyIGkgaW4gcGFyZW50W2tleV0pIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnRba2V5XSwgaSkpIHtcbiAgICAgIHRbaV0gPSBwYXJlbnRba2V5XVtpXTtcbiAgICB9XG4gIH1cbiAgcGFyZW50W2tleV0gPSB0O1xuICByZXR1cm4gdDtcbn1cblxuZnVuY3Rpb24gcGFyc2UocGFydHMsIHBhcmVudCwga2V5LCB2YWwpIHtcbiAgdmFyIHBhcnQgPSBwYXJ0cy5zaGlmdCgpO1xuICAvLyBlbmRcbiAgaWYgKCFwYXJ0KSB7XG4gICAgaWYgKGlzQXJyYXkocGFyZW50W2tleV0pKSB7XG4gICAgICBwYXJlbnRba2V5XS5wdXNoKHZhbCk7XG4gICAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgcGFyZW50W2tleV0pIHtcbiAgICAgIHBhcmVudFtrZXldID0gdmFsO1xuICAgIH0gZWxzZSBpZiAoJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHBhcmVudFtrZXldKSB7XG4gICAgICBwYXJlbnRba2V5XSA9IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50W2tleV0gPSBbcGFyZW50W2tleV0sIHZhbF07XG4gICAgfVxuICAgIC8vIGFycmF5XG4gIH0gZWxzZSB7XG4gICAgdmFyIG9iaiA9IHBhcmVudFtrZXldID0gcGFyZW50W2tleV0gfHwgW107XG4gICAgaWYgKCddJyA9PSBwYXJ0KSB7XG4gICAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIGlmICgnJyAhPSB2YWwpIG9iai5wdXNoKHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBvYmopIHtcbiAgICAgICAgb2JqW29iamVjdEtleXMob2JqKS5sZW5ndGhdID0gdmFsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqID0gcGFyZW50W2tleV0gPSBbcGFyZW50W2tleV0sIHZhbF07XG4gICAgICB9XG4gICAgICAvLyBwcm9wXG4gICAgfSBlbHNlIGlmICh+aW5kZXhPZihwYXJ0LCAnXScpKSB7XG4gICAgICBwYXJ0ID0gcGFydC5zdWJzdHIoMCwgcGFydC5sZW5ndGggLSAxKTtcbiAgICAgIGlmICghaXNpbnQudGVzdChwYXJ0KSAmJiBpc0FycmF5KG9iaikpIG9iaiA9IHByb21vdGUocGFyZW50LCBrZXkpO1xuICAgICAgcGFyc2UocGFydHMsIG9iaiwgcGFydCwgdmFsKTtcbiAgICAgIC8vIGtleVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWlzaW50LnRlc3QocGFydCkgJiYgaXNBcnJheShvYmopKSBvYmogPSBwcm9tb3RlKHBhcmVudCwga2V5KTtcbiAgICAgIHBhcnNlKHBhcnRzLCBvYmosIHBhcnQsIHZhbCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWVyZ2UgcGFyZW50IGtleS92YWwgcGFpci5cbiAqL1xuXG5mdW5jdGlvbiBtZXJnZShwYXJlbnQsIGtleSwgdmFsKXtcbiAgaWYgKH5pbmRleE9mKGtleSwgJ10nKSkge1xuICAgIHZhciBwYXJ0cyA9IGtleS5zcGxpdCgnWycpXG4gICAgICAsIGxlbiA9IHBhcnRzLmxlbmd0aFxuICAgICAgLCBsYXN0ID0gbGVuIC0gMTtcbiAgICBwYXJzZShwYXJ0cywgcGFyZW50LCAnYmFzZScsIHZhbCk7XG4gICAgLy8gb3B0aW1pemVcbiAgfSBlbHNlIHtcbiAgICBpZiAoIWlzaW50LnRlc3Qoa2V5KSAmJiBpc0FycmF5KHBhcmVudC5iYXNlKSkge1xuICAgICAgdmFyIHQgPSBjcmVhdGVPYmplY3QoKTtcbiAgICAgIGZvciAodmFyIGsgaW4gcGFyZW50LmJhc2UpIHRba10gPSBwYXJlbnQuYmFzZVtrXTtcbiAgICAgIHBhcmVudC5iYXNlID0gdDtcbiAgICB9XG4gICAgc2V0KHBhcmVudC5iYXNlLCBrZXksIHZhbCk7XG4gIH1cblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vKipcbiAqIENvbXBhY3Qgc3BhcnNlIGFycmF5cy5cbiAqL1xuXG5mdW5jdGlvbiBjb21wYWN0KG9iaikge1xuICBpZiAoJ29iamVjdCcgIT0gdHlwZW9mIG9iaikgcmV0dXJuIG9iajtcblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgdmFyIHJldCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSBpbiBvYmopIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIHtcbiAgICAgICAgcmV0LnB1c2gob2JqW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIG9ialtrZXldID0gY29tcGFjdChvYmpba2V5XSk7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIFJlc3RvcmUgT2JqZWN0LnByb3RvdHlwZS5cbiAqIHNlZSBwdWxsLXJlcXVlc3QgIzU4XG4gKi9cblxuZnVuY3Rpb24gcmVzdG9yZVByb3RvKG9iaikge1xuICBpZiAoIWlzUmVzdG9yYWJsZVByb3RvKSByZXR1cm4gb2JqO1xuICBpZiAoaXNBcnJheShvYmopKSByZXR1cm4gb2JqO1xuICBpZiAob2JqICYmICdvYmplY3QnICE9IHR5cGVvZiBvYmopIHJldHVybiBvYmo7XG5cbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgb2JqW2tleV0gPSByZXN0b3JlUHJvdG8ob2JqW2tleV0pO1xuICAgIH1cbiAgfVxuXG4gIG9iai5fX3Byb3RvX18gPSBPYmplY3QucHJvdG90eXBlO1xuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBvYmouXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VPYmplY3Qob2JqKXtcbiAgdmFyIHJldCA9IHsgYmFzZToge30gfTtcblxuICBmb3JFYWNoKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24obmFtZSl7XG4gICAgbWVyZ2UocmV0LCBuYW1lLCBvYmpbbmFtZV0pO1xuICB9KTtcblxuICByZXR1cm4gY29tcGFjdChyZXQuYmFzZSk7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIHN0ci5cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpe1xuICB2YXIgcmV0ID0gcmVkdWNlKFN0cmluZyhzdHIpLnNwbGl0KCcmJyksIGZ1bmN0aW9uKHJldCwgcGFpcil7XG4gICAgdmFyIGVxbCA9IGluZGV4T2YocGFpciwgJz0nKVxuICAgICAgLCBicmFjZSA9IGxhc3RCcmFjZUluS2V5KHBhaXIpXG4gICAgICAsIGtleSA9IHBhaXIuc3Vic3RyKDAsIGJyYWNlIHx8IGVxbClcbiAgICAgICwgdmFsID0gcGFpci5zdWJzdHIoYnJhY2UgfHwgZXFsLCBwYWlyLmxlbmd0aClcbiAgICAgICwgdmFsID0gdmFsLnN1YnN0cihpbmRleE9mKHZhbCwgJz0nKSArIDEsIHZhbC5sZW5ndGgpO1xuXG4gICAgLy8gP2Zvb1xuICAgIGlmICgnJyA9PSBrZXkpIGtleSA9IHBhaXIsIHZhbCA9ICcnO1xuICAgIGlmICgnJyA9PSBrZXkpIHJldHVybiByZXQ7XG5cbiAgICByZXR1cm4gbWVyZ2UocmV0LCBkZWNvZGUoa2V5KSwgZGVjb2RlKHZhbCkpO1xuICB9LCB7IGJhc2U6IGNyZWF0ZU9iamVjdCgpIH0pLmJhc2U7XG5cbiAgcmV0dXJuIHJlc3RvcmVQcm90byhjb21wYWN0KHJldCkpO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBxdWVyeSBgc3RyYCBvciBgb2JqYCwgcmV0dXJuaW5nIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIHwge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbihzdHIpe1xuICBpZiAobnVsbCA9PSBzdHIgfHwgJycgPT0gc3RyKSByZXR1cm4ge307XG4gIHJldHVybiAnb2JqZWN0JyA9PSB0eXBlb2Ygc3RyXG4gICAgPyBwYXJzZU9iamVjdChzdHIpXG4gICAgOiBwYXJzZVN0cmluZyhzdHIpO1xufTtcblxuLyoqXG4gKiBUdXJuIHRoZSBnaXZlbiBgb2JqYCBpbnRvIGEgcXVlcnkgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG52YXIgc3RyaW5naWZ5ID0gZXhwb3J0cy5zdHJpbmdpZnkgPSBmdW5jdGlvbihvYmosIHByZWZpeCkge1xuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeUFycmF5KG9iaiwgcHJlZml4KTtcbiAgfSBlbHNlIGlmICgnW29iamVjdCBPYmplY3RdJyA9PSB0b1N0cmluZy5jYWxsKG9iaikpIHtcbiAgICByZXR1cm4gc3RyaW5naWZ5T2JqZWN0KG9iaiwgcHJlZml4KTtcbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygb2JqKSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeVN0cmluZyhvYmosIHByZWZpeCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByZWZpeCArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob2JqKSk7XG4gIH1cbn07XG5cbi8qKlxuICogU3RyaW5naWZ5IHRoZSBnaXZlbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzdHJpbmdpZnlTdHJpbmcoc3RyLCBwcmVmaXgpIHtcbiAgaWYgKCFwcmVmaXgpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZ2lmeSBleHBlY3RzIGFuIG9iamVjdCcpO1xuICByZXR1cm4gcHJlZml4ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cik7XG59XG5cbi8qKlxuICogU3RyaW5naWZ5IHRoZSBnaXZlbiBgYXJyYC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUFycmF5KGFyciwgcHJlZml4KSB7XG4gIHZhciByZXQgPSBbXTtcbiAgaWYgKCFwcmVmaXgpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZ2lmeSBleHBlY3RzIGFuIG9iamVjdCcpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIHJldC5wdXNoKHN0cmluZ2lmeShhcnJbaV0sIHByZWZpeCArICdbJyArIGkgKyAnXScpKTtcbiAgfVxuICByZXR1cm4gcmV0LmpvaW4oJyYnKTtcbn1cblxuLyoqXG4gKiBTdHJpbmdpZnkgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ2lmeU9iamVjdChvYmosIHByZWZpeCkge1xuICB2YXIgcmV0ID0gW11cbiAgICAsIGtleXMgPSBvYmplY3RLZXlzKG9iailcbiAgICAsIGtleTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGtleSA9IGtleXNbaV07XG4gICAgaWYgKCcnID09IGtleSkgY29udGludWU7XG4gICAgaWYgKG51bGwgPT0gb2JqW2tleV0pIHtcbiAgICAgIHJldC5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0LnB1c2goc3RyaW5naWZ5KG9ialtrZXldLCBwcmVmaXhcbiAgICAgICAgPyBwcmVmaXggKyAnWycgKyBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICddJ1xuICAgICAgICA6IGVuY29kZVVSSUNvbXBvbmVudChrZXkpKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldC5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogU2V0IGBvYmpgJ3MgYGtleWAgdG8gYHZhbGAgcmVzcGVjdGluZ1xuICogdGhlIHdlaXJkIGFuZCB3b25kZXJmdWwgc3ludGF4IG9mIGEgcXMsXG4gKiB3aGVyZSBcImZvbz1iYXImZm9vPWJhelwiIGJlY29tZXMgYW4gYXJyYXkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2V0KG9iaiwga2V5LCB2YWwpIHtcbiAgdmFyIHYgPSBvYmpba2V5XTtcbiAgaWYgKHVuZGVmaW5lZCA9PT0gdikge1xuICAgIG9ialtrZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodikpIHtcbiAgICB2LnB1c2godmFsKTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IFt2LCB2YWxdO1xuICB9XG59XG5cbi8qKlxuICogTG9jYXRlIGxhc3QgYnJhY2UgaW4gYHN0cmAgd2l0aGluIHRoZSBrZXkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbGFzdEJyYWNlSW5LZXkoc3RyKSB7XG4gIHZhciBsZW4gPSBzdHIubGVuZ3RoXG4gICAgLCBicmFjZVxuICAgICwgYztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGMgPSBzdHJbaV07XG4gICAgaWYgKCddJyA9PSBjKSBicmFjZSA9IGZhbHNlO1xuICAgIGlmICgnWycgPT0gYykgYnJhY2UgPSB0cnVlO1xuICAgIGlmICgnPScgPT0gYyAmJiAhYnJhY2UpIHJldHVybiBpO1xuICB9XG59XG5cbi8qKlxuICogRGVjb2RlIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGRlY29kZShzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cbiIsIi8qISB2ZXJzaW9uOiAwLjkuMSAqL1xuLyohXG4gICogUmVxd2VzdCEgQSBnZW5lcmFsIHB1cnBvc2UgWEhSIGNvbm5lY3Rpb24gbWFuYWdlclxuICAqIChjKSBEdXN0aW4gRGlheiAyMDEzXG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9yZXF3ZXN0XG4gICogbGljZW5zZSBNSVRcbiAgKi9cbiFmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0oJ3JlcXdlc3QnLCB0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIHdpbiA9IHdpbmRvd1xuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIHR3b0h1bmRvID0gL14yMFxcZCQvXG4gICAgLCBieVRhZyA9ICdnZXRFbGVtZW50c0J5VGFnTmFtZSdcbiAgICAsIHJlYWR5U3RhdGUgPSAncmVhZHlTdGF0ZSdcbiAgICAsIGNvbnRlbnRUeXBlID0gJ0NvbnRlbnQtVHlwZSdcbiAgICAsIHJlcXVlc3RlZFdpdGggPSAnWC1SZXF1ZXN0ZWQtV2l0aCdcbiAgICAsIGhlYWQgPSBkb2NbYnlUYWddKCdoZWFkJylbMF1cbiAgICAsIHVuaXFpZCA9IDBcbiAgICAsIGNhbGxiYWNrUHJlZml4ID0gJ3JlcXdlc3RfJyArICgrbmV3IERhdGUoKSlcbiAgICAsIGxhc3RWYWx1ZSAvLyBkYXRhIHN0b3JlZCBieSB0aGUgbW9zdCByZWNlbnQgSlNPTlAgY2FsbGJhY2tcbiAgICAsIHhtbEh0dHBSZXF1ZXN0ID0gJ1hNTEh0dHBSZXF1ZXN0J1xuICAgICwgeERvbWFpblJlcXVlc3QgPSAnWERvbWFpblJlcXVlc3QnXG4gICAgLCBub29wID0gZnVuY3Rpb24gKCkge31cblxuICAgICwgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBBcnJheS5pc0FycmF5XG4gICAgICAgIDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICB9XG5cbiAgICAsIGRlZmF1bHRIZWFkZXJzID0ge1xuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAsIHJlcXVlc3RlZFdpdGg6IHhtbEh0dHBSZXF1ZXN0XG4gICAgICAgICwgYWNjZXB0OiB7XG4gICAgICAgICAgICAgICcqJzogICd0ZXh0L2phdmFzY3JpcHQsIHRleHQvaHRtbCwgYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCwgKi8qJ1xuICAgICAgICAgICAgLCB4bWw6ICAnYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCdcbiAgICAgICAgICAgICwgaHRtbDogJ3RleHQvaHRtbCdcbiAgICAgICAgICAgICwgdGV4dDogJ3RleHQvcGxhaW4nXG4gICAgICAgICAgICAsIGpzb246ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQnXG4gICAgICAgICAgICAsIGpzOiAgICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCB0ZXh0L2phdmFzY3JpcHQnXG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLCB4aHIgPSBmdW5jdGlvbihvKSB7XG4gICAgICAgIC8vIGlzIGl0IHgtZG9tYWluXG4gICAgICAgIGlmIChvLmNyb3NzT3JpZ2luID09PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHhociA9IHdpblt4bWxIdHRwUmVxdWVzdF0gPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG51bGxcbiAgICAgICAgICBpZiAoeGhyICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIHhocikge1xuICAgICAgICAgICAgcmV0dXJuIHhoclxuICAgICAgICAgIH0gZWxzZSBpZiAod2luW3hEb21haW5SZXF1ZXN0XSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdCgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGNyb3NzLW9yaWdpbiByZXF1ZXN0cycpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHdpblt4bWxIdHRwUmVxdWVzdF0pIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICwgZ2xvYmFsU2V0dXBPcHRpb25zID0ge1xuICAgICAgICBkYXRhRmlsdGVyOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHJldHVybiBkYXRhXG4gICAgICAgIH1cbiAgICAgIH1cblxuICBmdW5jdGlvbiBoYW5kbGVSZWFkeVN0YXRlKHIsIHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHVzZSBfYWJvcnRlZCB0byBtaXRpZ2F0ZSBhZ2FpbnN0IElFIGVyciBjMDBjMDIzZlxuICAgICAgLy8gKGNhbid0IHJlYWQgcHJvcHMgb24gYWJvcnRlZCByZXF1ZXN0IG9iamVjdHMpXG4gICAgICBpZiAoci5fYWJvcnRlZCkgcmV0dXJuIGVycm9yKHIucmVxdWVzdClcbiAgICAgIGlmIChyLnJlcXVlc3QgJiYgci5yZXF1ZXN0W3JlYWR5U3RhdGVdID09IDQpIHtcbiAgICAgICAgci5yZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG5vb3BcbiAgICAgICAgaWYgKHR3b0h1bmRvLnRlc3Qoci5yZXF1ZXN0LnN0YXR1cykpXG4gICAgICAgICAgc3VjY2VzcyhyLnJlcXVlc3QpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlcnJvcihyLnJlcXVlc3QpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0SGVhZGVycyhodHRwLCBvKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBvLmhlYWRlcnMgfHwge31cbiAgICAgICwgaFxuXG4gICAgaGVhZGVycy5BY2NlcHQgPSBoZWFkZXJzLkFjY2VwdFxuICAgICAgfHwgZGVmYXVsdEhlYWRlcnMuYWNjZXB0W28udHlwZV1cbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzLmFjY2VwdFsnKiddXG5cbiAgICAvLyBicmVha3MgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzIHdpdGggbGVnYWN5IGJyb3dzZXJzXG4gICAgaWYgKCFvLmNyb3NzT3JpZ2luICYmICFoZWFkZXJzW3JlcXVlc3RlZFdpdGhdKSBoZWFkZXJzW3JlcXVlc3RlZFdpdGhdID0gZGVmYXVsdEhlYWRlcnMucmVxdWVzdGVkV2l0aFxuICAgIGlmICghaGVhZGVyc1tjb250ZW50VHlwZV0pIGhlYWRlcnNbY29udGVudFR5cGVdID0gby5jb250ZW50VHlwZSB8fCBkZWZhdWx0SGVhZGVycy5jb250ZW50VHlwZVxuICAgIGZvciAoaCBpbiBoZWFkZXJzKVxuICAgICAgaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShoKSAmJiAnc2V0UmVxdWVzdEhlYWRlcicgaW4gaHR0cCAmJiBodHRwLnNldFJlcXVlc3RIZWFkZXIoaCwgaGVhZGVyc1toXSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pIHtcbiAgICBpZiAodHlwZW9mIG8ud2l0aENyZWRlbnRpYWxzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaHR0cC53aXRoQ3JlZGVudGlhbHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBodHRwLndpdGhDcmVkZW50aWFscyA9ICEhby53aXRoQ3JlZGVudGlhbHNcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmFsQ2FsbGJhY2soZGF0YSkge1xuICAgIGxhc3RWYWx1ZSA9IGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIHVybGFwcGVuZCAodXJsLCBzKSB7XG4gICAgcmV0dXJuIHVybCArICgvXFw/Ly50ZXN0KHVybCkgPyAnJicgOiAnPycpICsgc1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKSB7XG4gICAgdmFyIHJlcUlkID0gdW5pcWlkKytcbiAgICAgICwgY2JrZXkgPSBvLmpzb25wQ2FsbGJhY2sgfHwgJ2NhbGxiYWNrJyAvLyB0aGUgJ2NhbGxiYWNrJyBrZXlcbiAgICAgICwgY2J2YWwgPSBvLmpzb25wQ2FsbGJhY2tOYW1lIHx8IHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXgocmVxSWQpXG4gICAgICAvLyAsIGNidmFsID0gby5qc29ucENhbGxiYWNrTmFtZSB8fCAoJ3JlcXdlc3RfJyArIHJlcUlkKSAvLyB0aGUgJ2NhbGxiYWNrJyB2YWx1ZVxuICAgICAgLCBjYnJlZyA9IG5ldyBSZWdFeHAoJygoXnxcXFxcP3wmKScgKyBjYmtleSArICcpPShbXiZdKyknKVxuICAgICAgLCBtYXRjaCA9IHVybC5tYXRjaChjYnJlZylcbiAgICAgICwgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgICAsIGxvYWRlZCA9IDBcbiAgICAgICwgaXNJRTEwID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFIDEwLjAnKSAhPT0gLTFcblxuICAgIGlmIChtYXRjaCkge1xuICAgICAgaWYgKG1hdGNoWzNdID09PSAnPycpIHtcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoY2JyZWcsICckMT0nICsgY2J2YWwpIC8vIHdpbGRjYXJkIGNhbGxiYWNrIGZ1bmMgbmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2J2YWwgPSBtYXRjaFszXSAvLyBwcm92aWRlZCBjYWxsYmFjayBmdW5jIG5hbWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gdXJsYXBwZW5kKHVybCwgY2JrZXkgKyAnPScgKyBjYnZhbCkgLy8gbm8gY2FsbGJhY2sgZGV0YWlscywgYWRkICdlbVxuICAgIH1cblxuICAgIHdpbltjYnZhbF0gPSBnZW5lcmFsQ2FsbGJhY2tcblxuICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCdcbiAgICBzY3JpcHQuc3JjID0gdXJsXG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZVxuICAgIGlmICh0eXBlb2Ygc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSAhPT0gJ3VuZGVmaW5lZCcgJiYgIWlzSUUxMCkge1xuICAgICAgLy8gbmVlZCB0aGlzIGZvciBJRSBkdWUgdG8gb3V0LW9mLW9yZGVyIG9ucmVhZHlzdGF0ZWNoYW5nZSgpLCBiaW5kaW5nIHNjcmlwdFxuICAgICAgLy8gZXhlY3V0aW9uIHRvIGFuIGV2ZW50IGxpc3RlbmVyIGdpdmVzIHVzIGNvbnRyb2wgb3ZlciB3aGVuIHRoZSBzY3JpcHRcbiAgICAgIC8vIGlzIGV4ZWN1dGVkLiBTZWUgaHR0cDovL2phdWJvdXJnLm5ldC8yMDEwLzA3L2xvYWRpbmctc2NyaXB0LWFzLW9uY2xpY2staGFuZGxlci1vZi5odG1sXG4gICAgICAvL1xuICAgICAgLy8gaWYgdGhpcyBoYWNrIGlzIHVzZWQgaW4gSUUxMCBqc29ucCBjYWxsYmFjayBhcmUgbmV2ZXIgY2FsbGVkXG4gICAgICBzY3JpcHQuZXZlbnQgPSAnb25jbGljaydcbiAgICAgIHNjcmlwdC5odG1sRm9yID0gc2NyaXB0LmlkID0gJ19yZXF3ZXN0XycgKyByZXFJZFxuICAgIH1cblxuICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKChzY3JpcHRbcmVhZHlTdGF0ZV0gJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnY29tcGxldGUnICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2xvYWRlZCcpIHx8IGxvYWRlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgc2NyaXB0Lm9uY2xpY2sgJiYgc2NyaXB0Lm9uY2xpY2soKVxuICAgICAgLy8gQ2FsbCB0aGUgdXNlciBjYWxsYmFjayB3aXRoIHRoZSBsYXN0IHZhbHVlIHN0b3JlZCBhbmQgY2xlYW4gdXAgdmFsdWVzIGFuZCBzY3JpcHRzLlxuICAgICAgZm4obGFzdFZhbHVlKVxuICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgIGxvYWRlZCA9IDFcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIHNjcmlwdCB0byB0aGUgRE9NIGhlYWRcbiAgICBoZWFkLmFwcGVuZENoaWxkKHNjcmlwdClcblxuICAgIC8vIEVuYWJsZSBKU09OUCB0aW1lb3V0XG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgICBlcnIoe30sICdSZXF1ZXN0IGlzIGFib3J0ZWQ6IHRpbWVvdXQnLCB7fSlcbiAgICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgICBsb2FkZWQgPSAxXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVxdWVzdChmbiwgZXJyKSB7XG4gICAgdmFyIG8gPSB0aGlzLm9cbiAgICAgICwgbWV0aG9kID0gKG8ubWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAsIHVybCA9IHR5cGVvZiBvID09PSAnc3RyaW5nJyA/IG8gOiBvLnVybFxuICAgICAgLy8gY29udmVydCBub24tc3RyaW5nIG9iamVjdHMgdG8gcXVlcnktc3RyaW5nIGZvcm0gdW5sZXNzIG8ucHJvY2Vzc0RhdGEgaXMgZmFsc2VcbiAgICAgICwgZGF0YSA9IChvLnByb2Nlc3NEYXRhICE9PSBmYWxzZSAmJiBvLmRhdGEgJiYgdHlwZW9mIG8uZGF0YSAhPT0gJ3N0cmluZycpXG4gICAgICAgID8gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKG8uZGF0YSlcbiAgICAgICAgOiAoby5kYXRhIHx8IG51bGwpXG4gICAgICAsIGh0dHBcbiAgICAgICwgc2VuZFdhaXQgPSBmYWxzZVxuXG4gICAgLy8gaWYgd2UncmUgd29ya2luZyBvbiBhIEdFVCByZXF1ZXN0IGFuZCB3ZSBoYXZlIGRhdGEgdGhlbiB3ZSBzaG91bGQgYXBwZW5kXG4gICAgLy8gcXVlcnkgc3RyaW5nIHRvIGVuZCBvZiBVUkwgYW5kIG5vdCBwb3N0IGRhdGFcbiAgICBpZiAoKG8udHlwZSA9PSAnanNvbnAnIHx8IG1ldGhvZCA9PSAnR0VUJykgJiYgZGF0YSkge1xuICAgICAgdXJsID0gdXJsYXBwZW5kKHVybCwgZGF0YSlcbiAgICAgIGRhdGEgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKG8udHlwZSA9PSAnanNvbnAnKSByZXR1cm4gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKVxuXG4gICAgaHR0cCA9IHhocihvKVxuICAgIGh0dHAub3BlbihtZXRob2QsIHVybCwgby5hc3luYyA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWUpXG4gICAgc2V0SGVhZGVycyhodHRwLCBvKVxuICAgIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pXG4gICAgaWYgKHdpblt4RG9tYWluUmVxdWVzdF0gJiYgaHR0cCBpbnN0YW5jZW9mIHdpblt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgaHR0cC5vbmxvYWQgPSBmblxuICAgICAgICBodHRwLm9uZXJyb3IgPSBlcnJcbiAgICAgICAgLy8gTk9URTogc2VlXG4gICAgICAgIC8vIGh0dHA6Ly9zb2NpYWwubXNkbi5taWNyb3NvZnQuY29tL0ZvcnVtcy9lbi1VUy9pZXdlYmRldmVsb3BtZW50L3RocmVhZC8zMGVmM2FkZC03NjdjLTQ0MzYtYjhhOS1mMWNhMTliNDgxMmVcbiAgICAgICAgaHR0cC5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7fVxuICAgICAgICBzZW5kV2FpdCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVSZWFkeVN0YXRlKHRoaXMsIGZuLCBlcnIpXG4gICAgfVxuICAgIG8uYmVmb3JlICYmIG8uYmVmb3JlKGh0dHApXG4gICAgaWYgKHNlbmRXYWl0KSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaHR0cC5zZW5kKGRhdGEpXG4gICAgICB9LCAyMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgIH1cbiAgICByZXR1cm4gaHR0cFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxd2VzdChvLCBmbikge1xuICAgIHRoaXMubyA9IG9cbiAgICB0aGlzLmZuID0gZm5cblxuICAgIGluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHlwZSh1cmwpIHtcbiAgICB2YXIgbSA9IHVybC5tYXRjaCgvXFwuKGpzb258anNvbnB8aHRtbHx4bWwpKFxcP3wkKS8pXG4gICAgcmV0dXJuIG0gPyBtWzFdIDogJ2pzJ1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdChvLCBmbikge1xuXG4gICAgdGhpcy51cmwgPSB0eXBlb2YgbyA9PSAnc3RyaW5nJyA/IG8gOiBvLnVybFxuICAgIHRoaXMudGltZW91dCA9IG51bGxcblxuICAgIC8vIHdoZXRoZXIgcmVxdWVzdCBoYXMgYmVlbiBmdWxmaWxsZWQgZm9yIHB1cnBvc2VcbiAgICAvLyBvZiB0cmFja2luZyB0aGUgUHJvbWlzZXNcbiAgICB0aGlzLl9mdWxmaWxsZWQgPSBmYWxzZVxuICAgIC8vIHN1Y2Nlc3MgaGFuZGxlcnNcbiAgICB0aGlzLl9zdWNjZXNzSGFuZGxlciA9IGZ1bmN0aW9uKCl7fVxuICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMgPSBbXVxuICAgIC8vIGVycm9yIGhhbmRsZXJzXG4gICAgdGhpcy5fZXJyb3JIYW5kbGVycyA9IFtdXG4gICAgLy8gY29tcGxldGUgKGJvdGggc3VjY2VzcyBhbmQgZmFpbCkgaGFuZGxlcnNcbiAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzID0gW11cbiAgICB0aGlzLl9lcnJlZCA9IGZhbHNlXG4gICAgdGhpcy5fcmVzcG9uc2VBcmdzID0ge31cblxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLCB0eXBlID0gby50eXBlIHx8IHNldFR5cGUodGhpcy51cmwpXG5cbiAgICBmbiA9IGZuIHx8IGZ1bmN0aW9uICgpIHt9XG5cbiAgICBpZiAoby50aW1lb3V0KSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5hYm9ydCgpXG4gICAgICB9LCBvLnRpbWVvdXQpXG4gICAgfVxuXG4gICAgaWYgKG8uc3VjY2Vzcykge1xuICAgICAgdGhpcy5fc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG8uc3VjY2Vzcy5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG8uZXJyb3IpIHtcbiAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG8uZXJyb3IuYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoby5jb21wbGV0ZSkge1xuICAgICAgdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgby5jb21wbGV0ZS5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlIChyZXNwKSB7XG4gICAgICBvLnRpbWVvdXQgJiYgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcbiAgICAgIHNlbGYudGltZW91dCA9IG51bGxcbiAgICAgIHdoaWxlIChzZWxmLl9jb21wbGV0ZUhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fY29tcGxldGVIYW5kbGVycy5zaGlmdCgpKHJlc3ApXG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VjY2VzcyAocmVzcCkge1xuICAgICAgcmVzcCA9ICh0eXBlICE9PSAnanNvbnAnKSA/IHNlbGYucmVxdWVzdCA6IHJlc3BcbiAgICAgIC8vIHVzZSBnbG9iYWwgZGF0YSBmaWx0ZXIgb24gcmVzcG9uc2UgdGV4dFxuICAgICAgdmFyIGZpbHRlcmVkUmVzcG9uc2UgPSBnbG9iYWxTZXR1cE9wdGlvbnMuZGF0YUZpbHRlcihyZXNwLnJlc3BvbnNlVGV4dCwgdHlwZSlcbiAgICAgICAgLCByID0gZmlsdGVyZWRSZXNwb25zZVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzcC5yZXNwb25zZVRleHQgPSByXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNhbid0IGFzc2lnbiB0aGlzIGluIElFPD04LCBqdXN0IGlnbm9yZVxuICAgICAgfVxuICAgICAgaWYgKHIpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwID0gd2luLkpTT04gPyB3aW4uSlNPTi5wYXJzZShyKSA6IGV2YWwoJygnICsgciArICcpJylcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcihyZXNwLCAnQ291bGQgbm90IHBhcnNlIEpTT04gaW4gcmVzcG9uc2UnLCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2pzJzpcbiAgICAgICAgICByZXNwID0gZXZhbChyKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICAgIHJlc3AgPSByXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgICByZXNwID0gcmVzcC5yZXNwb25zZVhNTFxuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IgLy8gSUUgdHJvbG9sb1xuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IuZXJyb3JDb2RlXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5yZWFzb25cbiAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgOiByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MucmVzcCA9IHJlc3BcbiAgICAgIHNlbGYuX2Z1bGZpbGxlZCA9IHRydWVcbiAgICAgIGZuKHJlc3ApXG4gICAgICBzZWxmLl9zdWNjZXNzSGFuZGxlcihyZXNwKVxuICAgICAgd2hpbGUgKHNlbGYuX2Z1bGZpbGxtZW50SGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXNwID0gc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5zaGlmdCgpKHJlc3ApXG4gICAgICB9XG5cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IocmVzcCwgbXNnLCB0KSB7XG4gICAgICByZXNwID0gc2VsZi5yZXF1ZXN0XG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MucmVzcCA9IHJlc3BcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5tc2cgPSBtc2dcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy50ID0gdFxuICAgICAgc2VsZi5fZXJyZWQgPSB0cnVlXG4gICAgICB3aGlsZSAoc2VsZi5fZXJyb3JIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2Vycm9ySGFuZGxlcnMuc2hpZnQoKShyZXNwLCBtc2csIHQpXG4gICAgICB9XG4gICAgICBjb21wbGV0ZShyZXNwKVxuICAgIH1cblxuICAgIHRoaXMucmVxdWVzdCA9IGdldFJlcXVlc3QuY2FsbCh0aGlzLCBzdWNjZXNzLCBlcnJvcilcbiAgfVxuXG4gIFJlcXdlc3QucHJvdG90eXBlID0ge1xuICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9hYm9ydGVkID0gdHJ1ZVxuICAgICAgdGhpcy5yZXF1ZXN0LmFib3J0KClcbiAgICB9XG5cbiAgLCByZXRyeTogZnVuY3Rpb24gKCkge1xuICAgICAgaW5pdC5jYWxsKHRoaXMsIHRoaXMubywgdGhpcy5mbilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTbWFsbCBkZXZpYXRpb24gZnJvbSB0aGUgUHJvbWlzZXMgQSBDb21tb25KcyBzcGVjaWZpY2F0aW9uXG4gICAgICogaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvUHJvbWlzZXMvQVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogYHRoZW5gIHdpbGwgZXhlY3V0ZSB1cG9uIHN1Y2Nlc3NmdWwgcmVxdWVzdHNcbiAgICAgKi9cbiAgLCB0aGVuOiBmdW5jdGlvbiAoc3VjY2VzcywgZmFpbCkge1xuICAgICAgc3VjY2VzcyA9IHN1Y2Nlc3MgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGZhaWwgPSBmYWlsIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgICBpZiAodGhpcy5fZnVsZmlsbGVkKSB7XG4gICAgICAgIHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwID0gc3VjY2Vzcyh0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZmFpbCh0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCwgdGhpcy5fcmVzcG9uc2VBcmdzLm1zZywgdGhpcy5fcmVzcG9uc2VBcmdzLnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9mdWxmaWxsbWVudEhhbmRsZXJzLnB1c2goc3VjY2VzcylcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZhaWwpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGBhbHdheXNgIHdpbGwgZXhlY3V0ZSB3aGV0aGVyIHRoZSByZXF1ZXN0IHN1Y2NlZWRzIG9yIGZhaWxzXG4gICAgICovXG4gICwgYWx3YXlzOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQgfHwgdGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3ApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzLnB1c2goZm4pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGBmYWlsYCB3aWxsIGV4ZWN1dGUgd2hlbiB0aGUgcmVxdWVzdCBmYWlsc1xuICAgICAqL1xuICAsIGZhaWw6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVxd2VzdChvLCBmbikge1xuICAgIHJldHVybiBuZXcgUmVxd2VzdChvLCBmbilcbiAgfVxuXG4gIC8vIG5vcm1hbGl6ZSBuZXdsaW5lIHZhcmlhbnRzIGFjY29yZGluZyB0byBzcGVjIC0+IENSTEZcbiAgZnVuY3Rpb24gbm9ybWFsaXplKHMpIHtcbiAgICByZXR1cm4gcyA/IHMucmVwbGFjZSgvXFxyP1xcbi9nLCAnXFxyXFxuJykgOiAnJ1xuICB9XG5cbiAgZnVuY3Rpb24gc2VyaWFsKGVsLCBjYikge1xuICAgIHZhciBuID0gZWwubmFtZVxuICAgICAgLCB0ID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAsIG9wdENiID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAvLyBJRSBnaXZlcyB2YWx1ZT1cIlwiIGV2ZW4gd2hlcmUgdGhlcmUgaXMgbm8gdmFsdWUgYXR0cmlidXRlXG4gICAgICAgICAgLy8gJ3NwZWNpZmllZCcgcmVmOiBodHRwOi8vd3d3LnczLm9yZy9UUi9ET00tTGV2ZWwtMy1Db3JlL2NvcmUuaHRtbCNJRC04NjI1MjkyNzNcbiAgICAgICAgICBpZiAobyAmJiAhby5kaXNhYmxlZClcbiAgICAgICAgICAgIGNiKG4sIG5vcm1hbGl6ZShvLmF0dHJpYnV0ZXMudmFsdWUgJiYgby5hdHRyaWJ1dGVzLnZhbHVlLnNwZWNpZmllZCA/IG8udmFsdWUgOiBvLnRleHQpKVxuICAgICAgICB9XG4gICAgICAsIGNoLCByYSwgdmFsLCBpXG5cbiAgICAvLyBkb24ndCBzZXJpYWxpemUgZWxlbWVudHMgdGhhdCBhcmUgZGlzYWJsZWQgb3Igd2l0aG91dCBhIG5hbWVcbiAgICBpZiAoZWwuZGlzYWJsZWQgfHwgIW4pIHJldHVyblxuXG4gICAgc3dpdGNoICh0KSB7XG4gICAgY2FzZSAnaW5wdXQnOlxuICAgICAgaWYgKCEvcmVzZXR8YnV0dG9ufGltYWdlfGZpbGUvaS50ZXN0KGVsLnR5cGUpKSB7XG4gICAgICAgIGNoID0gL2NoZWNrYm94L2kudGVzdChlbC50eXBlKVxuICAgICAgICByYSA9IC9yYWRpby9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgdmFsID0gZWwudmFsdWVcbiAgICAgICAgLy8gV2ViS2l0IGdpdmVzIHVzIFwiXCIgaW5zdGVhZCBvZiBcIm9uXCIgaWYgYSBjaGVja2JveCBoYXMgbm8gdmFsdWUsIHNvIGNvcnJlY3QgaXQgaGVyZVxuICAgICAgICA7KCEoY2ggfHwgcmEpIHx8IGVsLmNoZWNrZWQpICYmIGNiKG4sIG5vcm1hbGl6ZShjaCAmJiB2YWwgPT09ICcnID8gJ29uJyA6IHZhbCkpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgIGNiKG4sIG5vcm1hbGl6ZShlbC52YWx1ZSkpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBpZiAoZWwudHlwZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0LW9uZScpIHtcbiAgICAgICAgb3B0Q2IoZWwuc2VsZWN0ZWRJbmRleCA+PSAwID8gZWwub3B0aW9uc1tlbC5zZWxlY3RlZEluZGV4XSA6IG51bGwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSAwOyBlbC5sZW5ndGggJiYgaSA8IGVsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZWwub3B0aW9uc1tpXS5zZWxlY3RlZCAmJiBvcHRDYihlbC5vcHRpb25zW2ldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbGxlY3QgdXAgYWxsIGZvcm0gZWxlbWVudHMgZm91bmQgZnJvbSB0aGUgcGFzc2VkIGFyZ3VtZW50IGVsZW1lbnRzIGFsbFxuICAvLyB0aGUgd2F5IGRvd24gdG8gY2hpbGQgZWxlbWVudHM7IHBhc3MgYSAnPGZvcm0+JyBvciBmb3JtIGZpZWxkcy5cbiAgLy8gY2FsbGVkIHdpdGggJ3RoaXMnPWNhbGxiYWNrIHRvIHVzZSBmb3Igc2VyaWFsKCkgb24gZWFjaCBlbGVtZW50XG4gIGZ1bmN0aW9uIGVhY2hGb3JtRWxlbWVudCgpIHtcbiAgICB2YXIgY2IgPSB0aGlzXG4gICAgICAsIGUsIGlcbiAgICAgICwgc2VyaWFsaXplU3VidGFncyA9IGZ1bmN0aW9uIChlLCB0YWdzKSB7XG4gICAgICAgICAgdmFyIGksIGosIGZhXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZhID0gZVtieVRhZ10odGFnc1tpXSlcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBmYS5sZW5ndGg7IGorKykgc2VyaWFsKGZhW2pdLCBjYilcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGUgPSBhcmd1bWVudHNbaV1cbiAgICAgIGlmICgvaW5wdXR8c2VsZWN0fHRleHRhcmVhL2kudGVzdChlLnRhZ05hbWUpKSBzZXJpYWwoZSwgY2IpXG4gICAgICBzZXJpYWxpemVTdWJ0YWdzKGUsIFsgJ2lucHV0JywgJ3NlbGVjdCcsICd0ZXh0YXJlYScgXSlcbiAgICB9XG4gIH1cblxuICAvLyBzdGFuZGFyZCBxdWVyeSBzdHJpbmcgc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVRdWVyeVN0cmluZygpIHtcbiAgICByZXR1cm4gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKHJlcXdlc3Quc2VyaWFsaXplQXJyYXkuYXBwbHkobnVsbCwgYXJndW1lbnRzKSlcbiAgfVxuXG4gIC8vIHsgJ25hbWUnOiAndmFsdWUnLCAuLi4gfSBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZUhhc2goKSB7XG4gICAgdmFyIGhhc2ggPSB7fVxuICAgIGVhY2hGb3JtRWxlbWVudC5hcHBseShmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgIGlmIChuYW1lIGluIGhhc2gpIHtcbiAgICAgICAgaGFzaFtuYW1lXSAmJiAhaXNBcnJheShoYXNoW25hbWVdKSAmJiAoaGFzaFtuYW1lXSA9IFtoYXNoW25hbWVdXSlcbiAgICAgICAgaGFzaFtuYW1lXS5wdXNoKHZhbHVlKVxuICAgICAgfSBlbHNlIGhhc2hbbmFtZV0gPSB2YWx1ZVxuICAgIH0sIGFyZ3VtZW50cylcbiAgICByZXR1cm4gaGFzaFxuICB9XG5cbiAgLy8gWyB7IG5hbWU6ICduYW1lJywgdmFsdWU6ICd2YWx1ZScgfSwgLi4uIF0gc3R5bGUgc2VyaWFsaXphdGlvblxuICByZXF3ZXN0LnNlcmlhbGl6ZUFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnIgPSBbXVxuICAgIGVhY2hGb3JtRWxlbWVudC5hcHBseShmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgIGFyci5wdXNoKHtuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWV9KVxuICAgIH0sIGFyZ3VtZW50cylcbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICByZXF3ZXN0LnNlcmlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gICAgdmFyIG9wdCwgZm5cbiAgICAgICwgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMClcblxuICAgIG9wdCA9IGFyZ3MucG9wKClcbiAgICBvcHQgJiYgb3B0Lm5vZGVUeXBlICYmIGFyZ3MucHVzaChvcHQpICYmIChvcHQgPSBudWxsKVxuICAgIG9wdCAmJiAob3B0ID0gb3B0LnR5cGUpXG5cbiAgICBpZiAob3B0ID09ICdtYXAnKSBmbiA9IHNlcmlhbGl6ZUhhc2hcbiAgICBlbHNlIGlmIChvcHQgPT0gJ2FycmF5JykgZm4gPSByZXF3ZXN0LnNlcmlhbGl6ZUFycmF5XG4gICAgZWxzZSBmbiA9IHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nXG5cbiAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJncylcbiAgfVxuXG4gIHJlcXdlc3QudG9RdWVyeVN0cmluZyA9IGZ1bmN0aW9uIChvLCB0cmFkKSB7XG4gICAgdmFyIHByZWZpeCwgaVxuICAgICAgLCB0cmFkaXRpb25hbCA9IHRyYWQgfHwgZmFsc2VcbiAgICAgICwgcyA9IFtdXG4gICAgICAsIGVuYyA9IGVuY29kZVVSSUNvbXBvbmVudFxuICAgICAgLCBhZGQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgIC8vIElmIHZhbHVlIGlzIGEgZnVuY3Rpb24sIGludm9rZSBpdCBhbmQgcmV0dXJuIGl0cyB2YWx1ZVxuICAgICAgICAgIHZhbHVlID0gKCdmdW5jdGlvbicgPT09IHR5cGVvZiB2YWx1ZSkgPyB2YWx1ZSgpIDogKHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlKVxuICAgICAgICAgIHNbcy5sZW5ndGhdID0gZW5jKGtleSkgKyAnPScgKyBlbmModmFsdWUpXG4gICAgICAgIH1cbiAgICAvLyBJZiBhbiBhcnJheSB3YXMgcGFzc2VkIGluLCBhc3N1bWUgdGhhdCBpdCBpcyBhbiBhcnJheSBvZiBmb3JtIGVsZW1lbnRzLlxuICAgIGlmIChpc0FycmF5KG8pKSB7XG4gICAgICBmb3IgKGkgPSAwOyBvICYmIGkgPCBvLmxlbmd0aDsgaSsrKSBhZGQob1tpXS5uYW1lLCBvW2ldLnZhbHVlKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0cmFkaXRpb25hbCwgZW5jb2RlIHRoZSBcIm9sZFwiIHdheSAodGhlIHdheSAxLjMuMiBvciBvbGRlclxuICAgICAgLy8gZGlkIGl0KSwgb3RoZXJ3aXNlIGVuY29kZSBwYXJhbXMgcmVjdXJzaXZlbHkuXG4gICAgICBmb3IgKHByZWZpeCBpbiBvKSB7XG4gICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCwgb1twcmVmaXhdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNwYWNlcyBzaG91bGQgYmUgKyBhY2NvcmRpbmcgdG8gc3BlY1xuICAgIHJldHVybiBzLmpvaW4oJyYnKS5yZXBsYWNlKC8lMjAvZywgJysnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRQYXJhbXMocHJlZml4LCBvYmosIHRyYWRpdGlvbmFsLCBhZGQpIHtcbiAgICB2YXIgbmFtZSwgaSwgdlxuICAgICAgLCByYnJhY2tldCA9IC9cXFtcXF0kL1xuXG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgLy8gU2VyaWFsaXplIGFycmF5IGl0ZW0uXG4gICAgICBmb3IgKGkgPSAwOyBvYmogJiYgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgICB2ID0gb2JqW2ldXG4gICAgICAgIGlmICh0cmFkaXRpb25hbCB8fCByYnJhY2tldC50ZXN0KHByZWZpeCkpIHtcbiAgICAgICAgICAvLyBUcmVhdCBlYWNoIGFycmF5IGl0ZW0gYXMgYSBzY2FsYXIuXG4gICAgICAgICAgYWRkKHByZWZpeCwgdilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyAodHlwZW9mIHYgPT09ICdvYmplY3QnID8gaSA6ICcnKSArICddJywgdiwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2JqICYmIG9iai50b1N0cmluZygpID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgLy8gU2VyaWFsaXplIG9iamVjdCBpdGVtLlxuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyBuYW1lICsgJ10nLCBvYmpbbmFtZV0sIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VyaWFsaXplIHNjYWxhciBpdGVtLlxuICAgICAgYWRkKHByZWZpeCwgb2JqKVxuICAgIH1cbiAgfVxuXG4gIHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrUHJlZml4XG4gIH1cblxuICAvLyBqUXVlcnkgYW5kIFplcHRvIGNvbXBhdGliaWxpdHksIGRpZmZlcmVuY2VzIGNhbiBiZSByZW1hcHBlZCBoZXJlIHNvIHlvdSBjYW4gY2FsbFxuICAvLyAuYWpheC5jb21wYXQob3B0aW9ucywgY2FsbGJhY2spXG4gIHJlcXdlc3QuY29tcGF0ID0gZnVuY3Rpb24gKG8sIGZuKSB7XG4gICAgaWYgKG8pIHtcbiAgICAgIG8udHlwZSAmJiAoby5tZXRob2QgPSBvLnR5cGUpICYmIGRlbGV0ZSBvLnR5cGVcbiAgICAgIG8uZGF0YVR5cGUgJiYgKG8udHlwZSA9IG8uZGF0YVR5cGUpXG4gICAgICBvLmpzb25wQ2FsbGJhY2sgJiYgKG8uanNvbnBDYWxsYmFja05hbWUgPSBvLmpzb25wQ2FsbGJhY2spICYmIGRlbGV0ZSBvLmpzb25wQ2FsbGJhY2tcbiAgICAgIG8uanNvbnAgJiYgKG8uanNvbnBDYWxsYmFjayA9IG8uanNvbnApXG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVxd2VzdChvLCBmbilcbiAgfVxuXG4gIHJlcXdlc3QuYWpheFNldHVwID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIGZvciAodmFyIGsgaW4gb3B0aW9ucykge1xuICAgICAgZ2xvYmFsU2V0dXBPcHRpb25zW2tdID0gb3B0aW9uc1trXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXF3ZXN0XG59KTtcbiIsIi8qIVxuICAqIEJlYW4gLSBjb3B5cmlnaHQgKGMpIEphY29iIFRob3JudG9uIDIwMTEtMjAxMlxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYXQvYmVhblxuICAqIE1JVCBsaWNlbnNlXG4gICovXG4oZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KSgnYmVhbicsIHRoaXMsIGZ1bmN0aW9uIChuYW1lLCBjb250ZXh0KSB7XG4gIG5hbWUgICAgPSBuYW1lICAgIHx8ICdiZWFuJ1xuICBjb250ZXh0ID0gY29udGV4dCB8fCB0aGlzXG5cbiAgdmFyIHdpbiAgICAgICAgICAgID0gd2luZG93XG4gICAgLCBvbGQgICAgICAgICAgICA9IGNvbnRleHRbbmFtZV1cbiAgICAsIG5hbWVzcGFjZVJlZ2V4ID0gL1teXFwuXSooPz1cXC4uKilcXC58LiovXG4gICAgLCBuYW1lUmVnZXggICAgICA9IC9cXC4uKi9cbiAgICAsIGFkZEV2ZW50ICAgICAgID0gJ2FkZEV2ZW50TGlzdGVuZXInXG4gICAgLCByZW1vdmVFdmVudCAgICA9ICdyZW1vdmVFdmVudExpc3RlbmVyJ1xuICAgICwgZG9jICAgICAgICAgICAgPSBkb2N1bWVudCB8fCB7fVxuICAgICwgcm9vdCAgICAgICAgICAgPSBkb2MuZG9jdW1lbnRFbGVtZW50IHx8IHt9XG4gICAgLCBXM0NfTU9ERUwgICAgICA9IHJvb3RbYWRkRXZlbnRdXG4gICAgLCBldmVudFN1cHBvcnQgICA9IFczQ19NT0RFTCA/IGFkZEV2ZW50IDogJ2F0dGFjaEV2ZW50J1xuICAgICwgT05FICAgICAgICAgICAgPSB7fSAvLyBzaW5nbGV0b24gZm9yIHF1aWNrIG1hdGNoaW5nIG1ha2luZyBhZGQoKSBkbyBvbmUoKVxuXG4gICAgLCBzbGljZSAgICAgICAgICA9IEFycmF5LnByb3RvdHlwZS5zbGljZVxuICAgICwgc3RyMmFyciAgICAgICAgPSBmdW5jdGlvbiAocywgZCkgeyByZXR1cm4gcy5zcGxpdChkIHx8ICcgJykgfVxuICAgICwgaXNTdHJpbmcgICAgICAgPSBmdW5jdGlvbiAobykgeyByZXR1cm4gdHlwZW9mIG8gPT0gJ3N0cmluZycgfVxuICAgICwgaXNGdW5jdGlvbiAgICAgPSBmdW5jdGlvbiAobykgeyByZXR1cm4gdHlwZW9mIG8gPT0gJ2Z1bmN0aW9uJyB9XG5cbiAgICAgIC8vIGV2ZW50cyB0aGF0IHdlIGNvbnNpZGVyIHRvIGJlICduYXRpdmUnLCBhbnl0aGluZyBub3QgaW4gdGhpcyBsaXN0IHdpbGxcbiAgICAgIC8vIGJlIHRyZWF0ZWQgYXMgYSBjdXN0b20gZXZlbnRcbiAgICAsIHN0YW5kYXJkTmF0aXZlRXZlbnRzID1cbiAgICAgICAgJ2NsaWNrIGRibGNsaWNrIG1vdXNldXAgbW91c2Vkb3duIGNvbnRleHRtZW51ICcgICAgICAgICAgICAgICAgICArIC8vIG1vdXNlIGJ1dHRvbnNcbiAgICAgICAgJ21vdXNld2hlZWwgbW91c2VtdWx0aXdoZWVsIERPTU1vdXNlU2Nyb2xsICcgICAgICAgICAgICAgICAgICAgICArIC8vIG1vdXNlIHdoZWVsXG4gICAgICAgICdtb3VzZW92ZXIgbW91c2VvdXQgbW91c2Vtb3ZlIHNlbGVjdHN0YXJ0IHNlbGVjdGVuZCAnICAgICAgICAgICAgKyAvLyBtb3VzZSBtb3ZlbWVudFxuICAgICAgICAna2V5ZG93biBrZXlwcmVzcyBrZXl1cCAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8ga2V5Ym9hcmRcbiAgICAgICAgJ29yaWVudGF0aW9uY2hhbmdlICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIG1vYmlsZVxuICAgICAgICAnZm9jdXMgYmx1ciBjaGFuZ2UgcmVzZXQgc2VsZWN0IHN1Ym1pdCAnICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gZm9ybSBlbGVtZW50c1xuICAgICAgICAnbG9hZCB1bmxvYWQgYmVmb3JldW5sb2FkIHJlc2l6ZSBtb3ZlIERPTUNvbnRlbnRMb2FkZWQgJyAgICAgICAgICsgLy8gd2luZG93XG4gICAgICAgICdyZWFkeXN0YXRlY2hhbmdlIG1lc3NhZ2UgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyB3aW5kb3dcbiAgICAgICAgJ2Vycm9yIGFib3J0IHNjcm9sbCAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1pc2NcbiAgICAgIC8vIGVsZW1lbnQuZmlyZUV2ZW50KCdvblhZWicuLi4gaXMgbm90IGZvcmdpdmluZyBpZiB3ZSB0cnkgdG8gZmlyZSBhbiBldmVudFxuICAgICAgLy8gdGhhdCBkb2Vzbid0IGFjdHVhbGx5IGV4aXN0LCBzbyBtYWtlIHN1cmUgd2Ugb25seSBkbyB0aGVzZSBvbiBuZXdlciBicm93c2Vyc1xuICAgICwgdzNjTmF0aXZlRXZlbnRzID1cbiAgICAgICAgJ3Nob3cgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIG1vdXNlIGJ1dHRvbnNcbiAgICAgICAgJ2lucHV0IGludmFsaWQgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIGZvcm0gZWxlbWVudHNcbiAgICAgICAgJ3RvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsICcgICAgICAgICAgICAgICAgICAgICArIC8vIHRvdWNoXG4gICAgICAgICdnZXN0dXJlc3RhcnQgZ2VzdHVyZWNoYW5nZSBnZXN0dXJlZW5kICcgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBnZXN0dXJlXG4gICAgICAgICd0ZXh0aW5wdXQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBUZXh0RXZlbnRcbiAgICAgICAgJ3JlYWR5c3RhdGVjaGFuZ2UgcGFnZXNob3cgcGFnZWhpZGUgcG9wc3RhdGUgJyAgICAgICAgICAgICAgICAgICArIC8vIHdpbmRvd1xuICAgICAgICAnaGFzaGNoYW5nZSBvZmZsaW5lIG9ubGluZSAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gd2luZG93XG4gICAgICAgICdhZnRlcnByaW50IGJlZm9yZXByaW50ICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBwcmludGluZ1xuICAgICAgICAnZHJhZ3N0YXJ0IGRyYWdlbnRlciBkcmFnb3ZlciBkcmFnbGVhdmUgZHJhZyBkcm9wIGRyYWdlbmQgJyAgICAgICsgLy8gZG5kXG4gICAgICAgICdsb2Fkc3RhcnQgcHJvZ3Jlc3Mgc3VzcGVuZCBlbXB0aWVkIHN0YWxsZWQgbG9hZG1ldGFkYXRhICcgICAgICAgKyAvLyBtZWRpYVxuICAgICAgICAnbG9hZGVkZGF0YSBjYW5wbGF5IGNhbnBsYXl0aHJvdWdoIHBsYXlpbmcgd2FpdGluZyBzZWVraW5nICcgICAgICsgLy8gbWVkaWFcbiAgICAgICAgJ3NlZWtlZCBlbmRlZCBkdXJhdGlvbmNoYW5nZSB0aW1ldXBkYXRlIHBsYXkgcGF1c2UgcmF0ZWNoYW5nZSAnICArIC8vIG1lZGlhXG4gICAgICAgICd2b2x1bWVjaGFuZ2UgY3VlY2hhbmdlICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBtZWRpYVxuICAgICAgICAnY2hlY2tpbmcgbm91cGRhdGUgZG93bmxvYWRpbmcgY2FjaGVkIHVwZGF0ZXJlYWR5IG9ic29sZXRlICcgICAgICAgLy8gYXBwY2FjaGVcblxuICAgICAgLy8gY29udmVydCB0byBhIGhhc2ggZm9yIHF1aWNrIGxvb2t1cHNcbiAgICAsIG5hdGl2ZUV2ZW50cyA9IChmdW5jdGlvbiAoaGFzaCwgZXZlbnRzLCBpKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIGV2ZW50c1tpXSAmJiAoaGFzaFtldmVudHNbaV1dID0gMSlcbiAgICAgICAgcmV0dXJuIGhhc2hcbiAgICAgIH0oe30sIHN0cjJhcnIoc3RhbmRhcmROYXRpdmVFdmVudHMgKyAoVzNDX01PREVMID8gdzNjTmF0aXZlRXZlbnRzIDogJycpKSkpXG5cbiAgICAgIC8vIGN1c3RvbSBldmVudHMgYXJlIGV2ZW50cyB0aGF0IHdlICpmYWtlKiwgdGhleSBhcmUgbm90IHByb3ZpZGVkIG5hdGl2ZWx5IGJ1dFxuICAgICAgLy8gd2UgY2FuIHVzZSBuYXRpdmUgZXZlbnRzIHRvIGdlbmVyYXRlIHRoZW1cbiAgICAsIGN1c3RvbUV2ZW50cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpc0FuY2VzdG9yID0gJ2NvbXBhcmVEb2N1bWVudFBvc2l0aW9uJyBpbiByb290XG4gICAgICAgICAgICAgID8gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAmJiAoY29udGFpbmVyLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGVsZW1lbnQpICYgMTYpID09PSAxNlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgOiAnY29udGFpbnMnIGluIHJvb3RcbiAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyID0gY29udGFpbmVyLm5vZGVUeXBlID09PSA5IHx8IGNvbnRhaW5lciA9PT0gd2luZG93ID8gcm9vdCA6IGNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyICE9PSBlbGVtZW50ICYmIGNvbnRhaW5lci5jb250YWlucyhlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkgaWYgKGVsZW1lbnQgPT09IGNvbnRhaW5lcikgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAsIGNoZWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgIHZhciByZWxhdGVkID0gZXZlbnQucmVsYXRlZFRhcmdldFxuICAgICAgICAgICAgICByZXR1cm4gIXJlbGF0ZWRcbiAgICAgICAgICAgICAgICA/IHJlbGF0ZWQgPT0gbnVsbFxuICAgICAgICAgICAgICAgIDogKHJlbGF0ZWQgIT09IHRoaXMgJiYgcmVsYXRlZC5wcmVmaXggIT09ICd4dWwnICYmICEvZG9jdW1lbnQvLnRlc3QodGhpcy50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICAgICAmJiAhaXNBbmNlc3RvcihyZWxhdGVkLCB0aGlzKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbW91c2VlbnRlcjogeyBiYXNlOiAnbW91c2VvdmVyJywgY29uZGl0aW9uOiBjaGVjayB9XG4gICAgICAgICAgLCBtb3VzZWxlYXZlOiB7IGJhc2U6ICdtb3VzZW91dCcsIGNvbmRpdGlvbjogY2hlY2sgfVxuICAgICAgICAgICwgbW91c2V3aGVlbDogeyBiYXNlOiAvRmlyZWZveC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSA/ICdET01Nb3VzZVNjcm9sbCcgOiAnbW91c2V3aGVlbCcgfVxuICAgICAgICB9XG4gICAgICB9KCkpXG5cbiAgICAgIC8vIHdlIHByb3ZpZGUgYSBjb25zaXN0ZW50IEV2ZW50IG9iamVjdCBhY3Jvc3MgYnJvd3NlcnMgYnkgdGFraW5nIHRoZSBhY3R1YWwgRE9NXG4gICAgICAvLyBldmVudCBvYmplY3QgYW5kIGdlbmVyYXRpbmcgYSBuZXcgb25lIGZyb20gaXRzIHByb3BlcnRpZXMuXG4gICAgLCBFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBhIHdoaXRlbGlzdCBvZiBwcm9wZXJ0aWVzIChmb3IgZGlmZmVyZW50IGV2ZW50IHR5cGVzKSB0ZWxscyB1cyB3aGF0IHRvIGNoZWNrIGZvciBhbmQgY29weVxuICAgICAgICB2YXIgY29tbW9uUHJvcHMgID0gc3RyMmFycignYWx0S2V5IGF0dHJDaGFuZ2UgYXR0ck5hbWUgYnViYmxlcyBjYW5jZWxhYmxlIGN0cmxLZXkgY3VycmVudFRhcmdldCAnICtcbiAgICAgICAgICAgICAgJ2RldGFpbCBldmVudFBoYXNlIGdldE1vZGlmaWVyU3RhdGUgaXNUcnVzdGVkIG1ldGFLZXkgcmVsYXRlZE5vZGUgcmVsYXRlZFRhcmdldCBzaGlmdEtleSAnICArXG4gICAgICAgICAgICAgICdzcmNFbGVtZW50IHRhcmdldCB0aW1lU3RhbXAgdHlwZSB2aWV3IHdoaWNoIHByb3BlcnR5TmFtZScpXG4gICAgICAgICAgLCBtb3VzZVByb3BzICAgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycignYnV0dG9uIGJ1dHRvbnMgY2xpZW50WCBjbGllbnRZIGRhdGFUcmFuc2ZlciAnICAgICAgK1xuICAgICAgICAgICAgICAnZnJvbUVsZW1lbnQgb2Zmc2V0WCBvZmZzZXRZIHBhZ2VYIHBhZ2VZIHNjcmVlblggc2NyZWVuWSB0b0VsZW1lbnQnKSlcbiAgICAgICAgICAsIG1vdXNlV2hlZWxQcm9wcyA9IG1vdXNlUHJvcHMuY29uY2F0KHN0cjJhcnIoJ3doZWVsRGVsdGEgd2hlZWxEZWx0YVggd2hlZWxEZWx0YVkgd2hlZWxEZWx0YVogJyArXG4gICAgICAgICAgICAgICdheGlzJykpIC8vICdheGlzJyBpcyBGRiBzcGVjaWZpY1xuICAgICAgICAgICwga2V5UHJvcHMgICAgID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ2NoYXIgY2hhckNvZGUga2V5IGtleUNvZGUga2V5SWRlbnRpZmllciAnICAgICAgICAgICtcbiAgICAgICAgICAgICAgJ2tleUxvY2F0aW9uIGxvY2F0aW9uJykpXG4gICAgICAgICAgLCB0ZXh0UHJvcHMgICAgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycignZGF0YScpKVxuICAgICAgICAgICwgdG91Y2hQcm9wcyAgID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ3RvdWNoZXMgdGFyZ2V0VG91Y2hlcyBjaGFuZ2VkVG91Y2hlcyBzY2FsZSByb3RhdGlvbicpKVxuICAgICAgICAgICwgbWVzc2FnZVByb3BzID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ2RhdGEgb3JpZ2luIHNvdXJjZScpKVxuICAgICAgICAgICwgc3RhdGVQcm9wcyAgID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ3N0YXRlJykpXG4gICAgICAgICAgLCBvdmVyT3V0UmVnZXggPSAvb3ZlcnxvdXQvXG4gICAgICAgICAgICAvLyBzb21lIGV2ZW50IHR5cGVzIG5lZWQgc3BlY2lhbCBoYW5kbGluZyBhbmQgc29tZSBuZWVkIHNwZWNpYWwgcHJvcGVydGllcywgZG8gdGhhdCBhbGwgaGVyZVxuICAgICAgICAgICwgdHlwZUZpeGVycyAgID0gW1xuICAgICAgICAgICAgICAgIHsgLy8ga2V5IGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9rZXkvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uIChldmVudCwgbmV3RXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5rZXlDb2RlID0gZXZlbnQua2V5Q29kZSB8fCBldmVudC53aGljaFxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlQcm9wc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gbW91c2UgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL2NsaWNrfG1vdXNlKD8hKC4qd2hlZWx8c2Nyb2xsKSl8bWVudXxkcmFnfGRyb3AvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uIChldmVudCwgbmV3RXZlbnQsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5yaWdodENsaWNrID0gZXZlbnQud2hpY2ggPT09IDMgfHwgZXZlbnQuYnV0dG9uID09PSAyXG4gICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQucG9zID0geyB4OiAwLCB5OiAwIH1cbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQucGFnZVggfHwgZXZlbnQucGFnZVkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LmNsaWVudFggPSBldmVudC5wYWdlWFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQuY2xpZW50WSA9IGV2ZW50LnBhZ2VZXG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5jbGllbnRYIHx8IGV2ZW50LmNsaWVudFkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LmNsaWVudFggPSBldmVudC5jbGllbnRYICsgZG9jLmJvZHkuc2Nyb2xsTGVmdCArIHJvb3Quc2Nyb2xsTGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQuY2xpZW50WSA9IGV2ZW50LmNsaWVudFkgKyBkb2MuYm9keS5zY3JvbGxUb3AgKyByb290LnNjcm9sbFRvcFxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBpZiAob3Zlck91dFJlZ2V4LnRlc3QodHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LnJlbGF0ZWRUYXJnZXQgPSBldmVudC5yZWxhdGVkVGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGV2ZW50Wyh0eXBlID09ICdtb3VzZW92ZXInID8gJ2Zyb20nIDogJ3RvJykgKyAnRWxlbWVudCddXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtb3VzZVByb3BzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBtb3VzZSB3aGVlbCBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvbW91c2UuKih3aGVlbHxzY3JvbGwpL2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiBtb3VzZVdoZWVsUHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIFRleHRFdmVudFxuICAgICAgICAgICAgICAgICAgICByZWc6IC9edGV4dC9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGV4dFByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyB0b3VjaCBhbmQgZ2VzdHVyZSBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvXnRvdWNofF5nZXN0dXJlL2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0b3VjaFByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBtZXNzYWdlIGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9ebWVzc2FnZSQvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1lc3NhZ2VQcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gcG9wc3RhdGUgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL15wb3BzdGF0ZSQvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN0YXRlUHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgICAgICByZWc6IC8uKi9cbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiBjb21tb25Qcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgICwgdHlwZUZpeGVyTWFwID0ge30gLy8gdXNlZCB0byBtYXAgZXZlbnQgdHlwZXMgdG8gZml4ZXIgZnVuY3Rpb25zIChhYm92ZSksIGEgYmFzaWMgY2FjaGUgbWVjaGFuaXNtXG5cbiAgICAgICAgICAsIEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50LCBlbGVtZW50LCBpc05hdGl2ZSkge1xuICAgICAgICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVyblxuICAgICAgICAgICAgICBldmVudCA9IGV2ZW50IHx8ICgoZWxlbWVudC5vd25lckRvY3VtZW50IHx8IGVsZW1lbnQuZG9jdW1lbnQgfHwgZWxlbWVudCkucGFyZW50V2luZG93IHx8IHdpbikuZXZlbnRcbiAgICAgICAgICAgICAgdGhpcy5vcmlnaW5hbEV2ZW50ID0gZXZlbnRcbiAgICAgICAgICAgICAgdGhpcy5pc05hdGl2ZSAgICAgICA9IGlzTmF0aXZlXG4gICAgICAgICAgICAgIHRoaXMuaXNCZWFuICAgICAgICAgPSB0cnVlXG5cbiAgICAgICAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuXG5cbiAgICAgICAgICAgICAgdmFyIHR5cGUgICA9IGV2ZW50LnR5cGVcbiAgICAgICAgICAgICAgICAsIHRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50XG4gICAgICAgICAgICAgICAgLCBpLCBsLCBwLCBwcm9wcywgZml4ZXJcblxuICAgICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldCAmJiB0YXJnZXQubm9kZVR5cGUgPT09IDMgPyB0YXJnZXQucGFyZW50Tm9kZSA6IHRhcmdldFxuXG4gICAgICAgICAgICAgIGlmIChpc05hdGl2ZSkgeyAvLyB3ZSBvbmx5IG5lZWQgYmFzaWMgYXVnbWVudGF0aW9uIG9uIGN1c3RvbSBldmVudHMsIHRoZSByZXN0IGV4cGVuc2l2ZSAmIHBvaW50bGVzc1xuICAgICAgICAgICAgICAgIGZpeGVyID0gdHlwZUZpeGVyTWFwW3R5cGVdXG4gICAgICAgICAgICAgICAgaWYgKCFmaXhlcikgeyAvLyBoYXZlbid0IGVuY291bnRlcmVkIHRoaXMgZXZlbnQgdHlwZSBiZWZvcmUsIG1hcCBhIGZpeGVyIGZ1bmN0aW9uIGZvciBpdFxuICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IHR5cGVGaXhlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlRml4ZXJzW2ldLnJlZy50ZXN0KHR5cGUpKSB7IC8vIGd1YXJhbnRlZWQgdG8gbWF0Y2ggYXQgbGVhc3Qgb25lLCBsYXN0IGlzIC4qXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZUZpeGVyTWFwW3R5cGVdID0gZml4ZXIgPSB0eXBlRml4ZXJzW2ldLmZpeFxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwcm9wcyA9IGZpeGVyKGV2ZW50LCB0aGlzLCB0eXBlKVxuICAgICAgICAgICAgICAgIGZvciAoaSA9IHByb3BzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgICAgICAgICAgaWYgKCEoKHAgPSBwcm9wc1tpXSkgaW4gdGhpcykgJiYgcCBpbiBldmVudCkgdGhpc1twXSA9IGV2ZW50W3BdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgLy8gcHJldmVudERlZmF1bHQoKSBhbmQgc3RvcFByb3BhZ2F0aW9uKCkgYXJlIGEgY29uc2lzdGVudCBpbnRlcmZhY2UgdG8gdGhvc2UgZnVuY3Rpb25zXG4gICAgICAgIC8vIG9uIHRoZSBET00sIHN0b3AoKSBpcyBhbiBhbGlhcyBmb3IgYm90aCBvZiB0aGVtIHRvZ2V0aGVyXG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KSB0aGlzLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIGVsc2UgdGhpcy5vcmlnaW5hbEV2ZW50LnJldHVyblZhbHVlID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBFdmVudC5wcm90b3R5cGUuc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBlbHNlIHRoaXMub3JpZ2luYWxFdmVudC5jYW5jZWxCdWJibGUgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgRXZlbnQucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgdGhpcy5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIHRoaXMuc3RvcHBlZCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICAvLyBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSBoYXMgdG8gYmUgaGFuZGxlZCBpbnRlcm5hbGx5IGJlY2F1c2Ugd2UgbWFuYWdlIHRoZSBldmVudCBsaXN0IGZvclxuICAgICAgICAvLyBlYWNoIGVsZW1lbnRcbiAgICAgICAgLy8gbm90ZSB0aGF0IG9yaWdpbmFsRWxlbWVudCBtYXkgYmUgYSBCZWFuI0V2ZW50IG9iamVjdCBpbiBzb21lIHNpdHVhdGlvbnNcbiAgICAgICAgRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikgdGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgICAgICAgdGhpcy5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWUgfVxuICAgICAgICB9XG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbEV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkICYmIHRoaXMub3JpZ2luYWxFdmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpXG4gICAgICAgIH1cbiAgICAgICAgRXZlbnQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKGN1cnJlbnRUYXJnZXQpIHtcbiAgICAgICAgICAvL1RPRE86IHRoaXMgaXMgcmlwZSBmb3Igb3B0aW1pc2F0aW9uLCBuZXcgZXZlbnRzIGFyZSAqZXhwZW5zaXZlKlxuICAgICAgICAgIC8vIGltcHJvdmluZyB0aGlzIHdpbGwgc3BlZWQgdXAgZGVsZWdhdGVkIGV2ZW50c1xuICAgICAgICAgIHZhciBuZSA9IG5ldyBFdmVudCh0aGlzLCB0aGlzLmVsZW1lbnQsIHRoaXMuaXNOYXRpdmUpXG4gICAgICAgICAgbmUuY3VycmVudFRhcmdldCA9IGN1cnJlbnRUYXJnZXRcbiAgICAgICAgICByZXR1cm4gbmVcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBFdmVudFxuICAgICAgfSgpKVxuXG4gICAgICAvLyBpZiB3ZSdyZSBpbiBvbGQgSUUgd2UgY2FuJ3QgZG8gb25wcm9wZXJ0eWNoYW5nZSBvbiBkb2Mgb3Igd2luIHNvIHdlIHVzZSBkb2MuZG9jdW1lbnRFbGVtZW50IGZvciBib3RoXG4gICAgLCB0YXJnZXRFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQsIGlzTmF0aXZlKSB7XG4gICAgICAgIHJldHVybiAhVzNDX01PREVMICYmICFpc05hdGl2ZSAmJiAoZWxlbWVudCA9PT0gZG9jIHx8IGVsZW1lbnQgPT09IHdpbikgPyByb290IDogZWxlbWVudFxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBCZWFuIG1haW50YWlucyBhbiBpbnRlcm5hbCByZWdpc3RyeSBmb3IgZXZlbnQgbGlzdGVuZXJzLiBXZSBkb24ndCB0b3VjaCBlbGVtZW50cywgb2JqZWN0c1xuICAgICAgICAqIG9yIGZ1bmN0aW9ucyB0byBpZGVudGlmeSB0aGVtLCBpbnN0ZWFkIHdlIHN0b3JlIGV2ZXJ5dGhpbmcgaW4gdGhlIHJlZ2lzdHJ5LlxuICAgICAgICAqIEVhY2ggZXZlbnQgbGlzdGVuZXIgaGFzIGEgUmVnRW50cnkgb2JqZWN0LCB3ZSBoYXZlIG9uZSAncmVnaXN0cnknIGZvciB0aGUgd2hvbGUgaW5zdGFuY2UuXG4gICAgICAgICovXG4gICAgLCBSZWdFbnRyeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGVhY2ggaGFuZGxlciBpcyB3cmFwcGVkIHNvIHdlIGNhbiBoYW5kbGUgZGVsZWdhdGlvbiBhbmQgY3VzdG9tIGV2ZW50c1xuICAgICAgICB2YXIgd3JhcHBlZEhhbmRsZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgZm4sIGNvbmRpdGlvbiwgYXJncykge1xuICAgICAgICAgICAgdmFyIGNhbGwgPSBmdW5jdGlvbiAoZXZlbnQsIGVhcmdzKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkoZWxlbWVudCwgYXJncyA/IHNsaWNlLmNhbGwoZWFyZ3MsIGV2ZW50ID8gMCA6IDEpLmNvbmNhdChhcmdzKSA6IGVhcmdzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCBmaW5kVGFyZ2V0ID0gZnVuY3Rpb24gKGV2ZW50LCBldmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmbi5fX2JlYW5EZWwgPyBmbi5fX2JlYW5EZWwuZnQoZXZlbnQudGFyZ2V0LCBlbGVtZW50KSA6IGV2ZW50RWxlbWVudFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCBoYW5kbGVyID0gY29uZGl0aW9uXG4gICAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBmaW5kVGFyZ2V0KGV2ZW50LCB0aGlzKSAvLyBkZWxlYXRlZCBldmVudFxuICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb24uYXBwbHkodGFyZ2V0LCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQpIGV2ZW50LmN1cnJlbnRUYXJnZXQgPSB0YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsKGV2ZW50LCBhcmd1bWVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChmbi5fX2JlYW5EZWwpIGV2ZW50ID0gZXZlbnQuY2xvbmUoZmluZFRhcmdldChldmVudCkpIC8vIGRlbGVnYXRlZCBldmVudCwgZml4IHRoZSBmaXhcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbChldmVudCwgYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBoYW5kbGVyLl9fYmVhbkRlbCA9IGZuLl9fYmVhbkRlbFxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXJcbiAgICAgICAgICB9XG5cbiAgICAgICAgLCBSZWdFbnRyeSA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBoYW5kbGVyLCBvcmlnaW5hbCwgbmFtZXNwYWNlcywgYXJncywgcm9vdCkge1xuICAgICAgICAgICAgdmFyIGN1c3RvbVR5cGUgICAgID0gY3VzdG9tRXZlbnRzW3R5cGVdXG4gICAgICAgICAgICAgICwgaXNOYXRpdmVcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ3VubG9hZCcpIHtcbiAgICAgICAgICAgICAgLy8gc2VsZiBjbGVhbi11cFxuICAgICAgICAgICAgICBoYW5kbGVyID0gb25jZShyZW1vdmVMaXN0ZW5lciwgZWxlbWVudCwgdHlwZSwgaGFuZGxlciwgb3JpZ2luYWwpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXN0b21UeXBlKSB7XG4gICAgICAgICAgICAgIGlmIChjdXN0b21UeXBlLmNvbmRpdGlvbikge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIgPSB3cmFwcGVkSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBjdXN0b21UeXBlLmNvbmRpdGlvbiwgYXJncylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0eXBlID0gY3VzdG9tVHlwZS5iYXNlIHx8IHR5cGVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pc05hdGl2ZSAgICAgID0gaXNOYXRpdmUgPSBuYXRpdmVFdmVudHNbdHlwZV0gJiYgISFlbGVtZW50W2V2ZW50U3VwcG9ydF1cbiAgICAgICAgICAgIHRoaXMuY3VzdG9tVHlwZSAgICA9ICFXM0NfTU9ERUwgJiYgIWlzTmF0aXZlICYmIHR5cGVcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCAgICAgICA9IGVsZW1lbnRcbiAgICAgICAgICAgIHRoaXMudHlwZSAgICAgICAgICA9IHR5cGVcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWwgICAgICA9IG9yaWdpbmFsXG4gICAgICAgICAgICB0aGlzLm5hbWVzcGFjZXMgICAgPSBuYW1lc3BhY2VzXG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSAgICAgPSBXM0NfTU9ERUwgfHwgaXNOYXRpdmUgPyB0eXBlIDogJ3Byb3BlcnR5Y2hhbmdlJ1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgICAgICAgID0gdGFyZ2V0RWxlbWVudChlbGVtZW50LCBpc05hdGl2ZSlcbiAgICAgICAgICAgIHRoaXNbZXZlbnRTdXBwb3J0XSA9ICEhdGhpcy50YXJnZXRbZXZlbnRTdXBwb3J0XVxuICAgICAgICAgICAgdGhpcy5yb290ICAgICAgICAgID0gcm9vdFxuICAgICAgICAgICAgdGhpcy5oYW5kbGVyICAgICAgID0gd3JhcHBlZEhhbmRsZXIoZWxlbWVudCwgaGFuZGxlciwgbnVsbCwgYXJncylcbiAgICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2l2ZW4gYSBsaXN0IG9mIG5hbWVzcGFjZXMsIGlzIG91ciBlbnRyeSBpbiBhbnkgb2YgdGhlbT9cbiAgICAgICAgUmVnRW50cnkucHJvdG90eXBlLmluTmFtZXNwYWNlcyA9IGZ1bmN0aW9uIChjaGVja05hbWVzcGFjZXMpIHtcbiAgICAgICAgICB2YXIgaSwgaiwgYyA9IDBcbiAgICAgICAgICBpZiAoIWNoZWNrTmFtZXNwYWNlcykgcmV0dXJuIHRydWVcbiAgICAgICAgICBpZiAoIXRoaXMubmFtZXNwYWNlcykgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgZm9yIChpID0gY2hlY2tOYW1lc3BhY2VzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgICAgZm9yIChqID0gdGhpcy5uYW1lc3BhY2VzLmxlbmd0aDsgai0tOykge1xuICAgICAgICAgICAgICBpZiAoY2hlY2tOYW1lc3BhY2VzW2ldID09IHRoaXMubmFtZXNwYWNlc1tqXSkgYysrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGVja05hbWVzcGFjZXMubGVuZ3RoID09PSBjXG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYXRjaCBieSBlbGVtZW50LCBvcmlnaW5hbCBmbiAob3B0KSwgaGFuZGxlciBmbiAob3B0KVxuICAgICAgICBSZWdFbnRyeS5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uIChjaGVja0VsZW1lbnQsIGNoZWNrT3JpZ2luYWwsIGNoZWNrSGFuZGxlcikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQgPT09IGNoZWNrRWxlbWVudCAmJlxuICAgICAgICAgICAgKCFjaGVja09yaWdpbmFsIHx8IHRoaXMub3JpZ2luYWwgPT09IGNoZWNrT3JpZ2luYWwpICYmXG4gICAgICAgICAgICAoIWNoZWNrSGFuZGxlciB8fCB0aGlzLmhhbmRsZXIgPT09IGNoZWNrSGFuZGxlcilcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBSZWdFbnRyeVxuICAgICAgfSgpKVxuXG4gICAgLCByZWdpc3RyeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIG91ciBtYXAgc3RvcmVzIGFycmF5cyBieSBldmVudCB0eXBlLCBqdXN0IGJlY2F1c2UgaXQncyBiZXR0ZXIgdGhhbiBzdG9yaW5nXG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgaW4gYSBzaW5nbGUgYXJyYXkuXG4gICAgICAgIC8vIHVzZXMgJyQnIGFzIGEgcHJlZml4IGZvciB0aGUga2V5cyBmb3Igc2FmZXR5IGFuZCAncicgYXMgYSBzcGVjaWFsIHByZWZpeCBmb3JcbiAgICAgICAgLy8gcm9vdExpc3RlbmVycyBzbyB3ZSBjYW4gbG9vayB0aGVtIHVwIGZhc3RcbiAgICAgICAgdmFyIG1hcCA9IHt9XG5cbiAgICAgICAgICAvLyBnZW5lcmljIGZ1bmN0aW9uYWwgc2VhcmNoIG9mIG91ciByZWdpc3RyeSBmb3IgbWF0Y2hpbmcgbGlzdGVuZXJzLFxuICAgICAgICAgIC8vIGBmbmAgcmV0dXJucyBmYWxzZSB0byBicmVhayBvdXQgb2YgdGhlIGxvb3BcbiAgICAgICAgICAsIGZvckFsbCA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBvcmlnaW5hbCwgaGFuZGxlciwgcm9vdCwgZm4pIHtcbiAgICAgICAgICAgICAgdmFyIHBmeCA9IHJvb3QgPyAncicgOiAnJCdcbiAgICAgICAgICAgICAgaWYgKCF0eXBlIHx8IHR5cGUgPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgLy8gc2VhcmNoIHRoZSB3aG9sZSByZWdpc3RyeVxuICAgICAgICAgICAgICAgIGZvciAodmFyIHQgaW4gbWFwKSB7XG4gICAgICAgICAgICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gcGZ4KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvckFsbChlbGVtZW50LCB0LnN1YnN0cigxKSwgb3JpZ2luYWwsIGhhbmRsZXIsIHJvb3QsIGZuKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDAsIGwsIGxpc3QgPSBtYXBbcGZ4ICsgdHlwZV0sIGFsbCA9IGVsZW1lbnQgPT0gJyonXG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0KSByZXR1cm5cbiAgICAgICAgICAgICAgICBmb3IgKGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgaWYgKChhbGwgfHwgbGlzdFtpXS5tYXRjaGVzKGVsZW1lbnQsIG9yaWdpbmFsLCBoYW5kbGVyKSkgJiYgIWZuKGxpc3RbaV0sIGxpc3QsIGksIHR5cGUpKSByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICwgaGFzID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIG9yaWdpbmFsLCByb290KSB7XG4gICAgICAgICAgICAgIC8vIHdlJ3JlIG5vdCB1c2luZyBmb3JBbGwgaGVyZSBzaW1wbHkgYmVjYXVzZSBpdCdzIGEgYml0IHNsb3dlciBhbmQgdGhpc1xuICAgICAgICAgICAgICAvLyBuZWVkcyB0byBiZSBmYXN0XG4gICAgICAgICAgICAgIHZhciBpLCBsaXN0ID0gbWFwWyhyb290ID8gJ3InIDogJyQnKSArIHR5cGVdXG4gICAgICAgICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gbGlzdC5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgICAgICAgIGlmICghbGlzdFtpXS5yb290ICYmIGxpc3RbaV0ubWF0Y2hlcyhlbGVtZW50LCBvcmlnaW5hbCwgbnVsbCkpIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgLCBnZXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgb3JpZ2luYWwsIHJvb3QpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJpZXMgPSBbXVxuICAgICAgICAgICAgICBmb3JBbGwoZWxlbWVudCwgdHlwZSwgb3JpZ2luYWwsIG51bGwsIHJvb3QsIGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyaWVzLnB1c2goZW50cnkpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHJldHVybiBlbnRyaWVzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAsIHB1dCA9IGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICB2YXIgaGFzID0gIWVudHJ5LnJvb3QgJiYgIXRoaXMuaGFzKGVudHJ5LmVsZW1lbnQsIGVudHJ5LnR5cGUsIG51bGwsIGZhbHNlKVxuICAgICAgICAgICAgICAgICwga2V5ID0gKGVudHJ5LnJvb3QgPyAncicgOiAnJCcpICsgZW50cnkudHlwZVxuICAgICAgICAgICAgICA7KG1hcFtrZXldIHx8IChtYXBba2V5XSA9IFtdKSkucHVzaChlbnRyeSlcbiAgICAgICAgICAgICAgcmV0dXJuIGhhc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgLCBkZWwgPSBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgZm9yQWxsKGVudHJ5LmVsZW1lbnQsIGVudHJ5LnR5cGUsIG51bGwsIGVudHJ5LmhhbmRsZXIsIGVudHJ5LnJvb3QsIGZ1bmN0aW9uIChlbnRyeSwgbGlzdCwgaSkge1xuICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgZW50cnkucmVtb3ZlZCA9IHRydWVcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIGRlbGV0ZSBtYXBbKGVudHJ5LnJvb3QgPyAncicgOiAnJCcpICsgZW50cnkudHlwZV1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZHVtcCBhbGwgZW50cmllcywgdXNlZCBmb3Igb251bmxvYWRcbiAgICAgICAgICAsIGVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciB0LCBlbnRyaWVzID0gW11cbiAgICAgICAgICAgICAgZm9yICh0IGluIG1hcCkge1xuICAgICAgICAgICAgICAgIGlmICh0LmNoYXJBdCgwKSA9PSAnJCcpIGVudHJpZXMgPSBlbnRyaWVzLmNvbmNhdChtYXBbdF0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGVudHJpZXNcbiAgICAgICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBoYXM6IGhhcywgZ2V0OiBnZXQsIHB1dDogcHV0LCBkZWw6IGRlbCwgZW50cmllczogZW50cmllcyB9XG4gICAgICB9KCkpXG5cbiAgICAgIC8vIHdlIG5lZWQgYSBzZWxlY3RvciBlbmdpbmUgZm9yIGRlbGVnYXRlZCBldmVudHMsIHVzZSBxdWVyeVNlbGVjdG9yQWxsIGlmIGl0IGV4aXN0c1xuICAgICAgLy8gYnV0IGZvciBvbGRlciBicm93c2VycyB3ZSBuZWVkIFF3ZXJ5LCBTaXp6bGUgb3Igc2ltaWxhclxuICAgICwgc2VsZWN0b3JFbmdpbmVcbiAgICAsIHNldFNlbGVjdG9yRW5naW5lID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgc2VsZWN0b3JFbmdpbmUgPSBkb2MucXVlcnlTZWxlY3RvckFsbFxuICAgICAgICAgICAgPyBmdW5jdGlvbiAocywgcikge1xuICAgICAgICAgICAgICAgIHJldHVybiByLnF1ZXJ5U2VsZWN0b3JBbGwocylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCZWFuOiBObyBzZWxlY3RvciBlbmdpbmUgaW5zdGFsbGVkJykgLy8gZWVla1xuICAgICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZWN0b3JFbmdpbmUgPSBlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gd2UgYXR0YWNoIHRoaXMgbGlzdGVuZXIgdG8gZWFjaCBET00gZXZlbnQgdGhhdCB3ZSBuZWVkIHRvIGxpc3RlbiB0bywgb25seSBvbmNlXG4gICAgICAvLyBwZXIgZXZlbnQgdHlwZSBwZXIgRE9NIGVsZW1lbnRcbiAgICAsIHJvb3RMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCwgdHlwZSkge1xuICAgICAgICBpZiAoIVczQ19NT0RFTCAmJiB0eXBlICYmIGV2ZW50ICYmIGV2ZW50LnByb3BlcnR5TmFtZSAhPSAnX29uJyArIHR5cGUpIHJldHVyblxuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSByZWdpc3RyeS5nZXQodGhpcywgdHlwZSB8fCBldmVudC50eXBlLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoXG4gICAgICAgICAgLCBpID0gMFxuXG4gICAgICAgIGV2ZW50ID0gbmV3IEV2ZW50KGV2ZW50LCB0aGlzLCB0cnVlKVxuICAgICAgICBpZiAodHlwZSkgZXZlbnQudHlwZSA9IHR5cGVcblxuICAgICAgICAvLyBpdGVyYXRlIHRocm91Z2ggYWxsIGhhbmRsZXJzIHJlZ2lzdGVyZWQgZm9yIHRoaXMgdHlwZSwgY2FsbGluZyB0aGVtIHVubGVzcyB0aGV5IGhhdmVcbiAgICAgICAgLy8gYmVlbiByZW1vdmVkIGJ5IGEgcHJldmlvdXMgaGFuZGxlciBvciBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSBoYXMgYmVlbiBjYWxsZWRcbiAgICAgICAgZm9yICg7IGkgPCBsICYmICFldmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpOyBpKyspIHtcbiAgICAgICAgICBpZiAoIWxpc3RlbmVyc1tpXS5yZW1vdmVkKSBsaXN0ZW5lcnNbaV0uaGFuZGxlci5jYWxsKHRoaXMsIGV2ZW50KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhbmQgcmVtb3ZlIGxpc3RlbmVycyB0byBET00gZWxlbWVudHNcbiAgICAsIGxpc3RlbmVyID0gVzNDX01PREVMXG4gICAgICAgID8gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIGFkZCkge1xuICAgICAgICAgICAgLy8gbmV3IGJyb3dzZXJzXG4gICAgICAgICAgICBlbGVtZW50W2FkZCA/IGFkZEV2ZW50IDogcmVtb3ZlRXZlbnRdKHR5cGUsIHJvb3RMaXN0ZW5lciwgZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBhZGQsIGN1c3RvbSkge1xuICAgICAgICAgICAgLy8gSUU4IGFuZCBiZWxvdywgdXNlIGF0dGFjaEV2ZW50L2RldGFjaEV2ZW50IGFuZCB3ZSBoYXZlIHRvIHBpZ2d5LWJhY2sgcHJvcGVydHljaGFuZ2UgZXZlbnRzXG4gICAgICAgICAgICAvLyB0byBzaW11bGF0ZSBldmVudCBidWJibGluZyBldGMuXG4gICAgICAgICAgICB2YXIgZW50cnlcbiAgICAgICAgICAgIGlmIChhZGQpIHtcbiAgICAgICAgICAgICAgcmVnaXN0cnkucHV0KGVudHJ5ID0gbmV3IFJlZ0VudHJ5KFxuICAgICAgICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAgICwgY3VzdG9tIHx8IHR5cGVcbiAgICAgICAgICAgICAgICAsIGZ1bmN0aW9uIChldmVudCkgeyAvLyBoYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgIHJvb3RMaXN0ZW5lci5jYWxsKGVsZW1lbnQsIGV2ZW50LCBjdXN0b20pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLCByb290TGlzdGVuZXJcbiAgICAgICAgICAgICAgICAsIG51bGxcbiAgICAgICAgICAgICAgICAsIG51bGxcbiAgICAgICAgICAgICAgICAsIHRydWUgLy8gaXMgcm9vdFxuICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICBpZiAoY3VzdG9tICYmIGVsZW1lbnRbJ19vbicgKyBjdXN0b21dID09IG51bGwpIGVsZW1lbnRbJ19vbicgKyBjdXN0b21dID0gMFxuICAgICAgICAgICAgICBlbnRyeS50YXJnZXQuYXR0YWNoRXZlbnQoJ29uJyArIGVudHJ5LmV2ZW50VHlwZSwgZW50cnkuaGFuZGxlcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVudHJ5ID0gcmVnaXN0cnkuZ2V0KGVsZW1lbnQsIGN1c3RvbSB8fCB0eXBlLCByb290TGlzdGVuZXIsIHRydWUpWzBdXG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5kZXRhY2hFdmVudCgnb24nICsgZW50cnkuZXZlbnRUeXBlLCBlbnRyeS5oYW5kbGVyKVxuICAgICAgICAgICAgICAgIHJlZ2lzdHJ5LmRlbChlbnRyeSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICwgb25jZSA9IGZ1bmN0aW9uIChybSwgZWxlbWVudCwgdHlwZSwgZm4sIG9yaWdpbmFsRm4pIHtcbiAgICAgICAgLy8gd3JhcCB0aGUgaGFuZGxlciBpbiBhIGhhbmRsZXIgdGhhdCBkb2VzIGEgcmVtb3ZlIGFzIHdlbGxcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgcm0oZWxlbWVudCwgdHlwZSwgb3JpZ2luYWxGbilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLCByZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcmdUeXBlLCBoYW5kbGVyLCBuYW1lc3BhY2VzKSB7XG4gICAgICAgIHZhciB0eXBlICAgICA9IG9yZ1R5cGUgJiYgb3JnVHlwZS5yZXBsYWNlKG5hbWVSZWdleCwgJycpXG4gICAgICAgICAgLCBoYW5kbGVycyA9IHJlZ2lzdHJ5LmdldChlbGVtZW50LCB0eXBlLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICAsIHJlbW92ZWQgID0ge31cbiAgICAgICAgICAsIGksIGxcblxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gaGFuZGxlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCghaGFuZGxlciB8fCBoYW5kbGVyc1tpXS5vcmlnaW5hbCA9PT0gaGFuZGxlcikgJiYgaGFuZGxlcnNbaV0uaW5OYW1lc3BhY2VzKG5hbWVzcGFjZXMpKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiB0aGlzIGlzIHByb2JsZW1hdGljLCB3ZSBoYXZlIGEgcmVnaXN0cnkuZ2V0KCkgYW5kIHJlZ2lzdHJ5LmRlbCgpIHRoYXRcbiAgICAgICAgICAgIC8vIGJvdGggZG8gcmVnaXN0cnkgc2VhcmNoZXMgc28gd2Ugd2FzdGUgY3ljbGVzIGRvaW5nIHRoaXMuIE5lZWRzIHRvIGJlIHJvbGxlZCBpbnRvXG4gICAgICAgICAgICAvLyBhIHNpbmdsZSByZWdpc3RyeS5mb3JBbGwoZm4pIHRoYXQgcmVtb3ZlcyB3aGlsZSBmaW5kaW5nLCBidXQgdGhlIGNhdGNoIGlzIHRoYXRcbiAgICAgICAgICAgIC8vIHdlJ2xsIGJlIHNwbGljaW5nIHRoZSBhcnJheXMgdGhhdCB3ZSdyZSBpdGVyYXRpbmcgb3Zlci4gTmVlZHMgZXh0cmEgdGVzdHMgdG9cbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCBzY3JldyBpdCB1cC4gQHJ2YWdnXG4gICAgICAgICAgICByZWdpc3RyeS5kZWwoaGFuZGxlcnNbaV0pXG4gICAgICAgICAgICBpZiAoIXJlbW92ZWRbaGFuZGxlcnNbaV0uZXZlbnRUeXBlXSAmJiBoYW5kbGVyc1tpXVtldmVudFN1cHBvcnRdKVxuICAgICAgICAgICAgICByZW1vdmVkW2hhbmRsZXJzW2ldLmV2ZW50VHlwZV0gPSB7IHQ6IGhhbmRsZXJzW2ldLmV2ZW50VHlwZSwgYzogaGFuZGxlcnNbaV0udHlwZSB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIGVhY2ggdHlwZS9lbGVtZW50IGZvciByZW1vdmVkIGxpc3RlbmVycyBhbmQgcmVtb3ZlIHRoZSByb290TGlzdGVuZXIgd2hlcmUgaXQncyBubyBsb25nZXIgbmVlZGVkXG4gICAgICAgIGZvciAoaSBpbiByZW1vdmVkKSB7XG4gICAgICAgICAgaWYgKCFyZWdpc3RyeS5oYXMoZWxlbWVudCwgcmVtb3ZlZFtpXS50LCBudWxsLCBmYWxzZSkpIHtcbiAgICAgICAgICAgIC8vIGxhc3QgbGlzdGVuZXIgb2YgdGhpcyB0eXBlLCByZW1vdmUgdGhlIHJvb3RMaXN0ZW5lclxuICAgICAgICAgICAgbGlzdGVuZXIoZWxlbWVudCwgcmVtb3ZlZFtpXS50LCBmYWxzZSwgcmVtb3ZlZFtpXS5jKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBzZXQgdXAgYSBkZWxlZ2F0ZSBoZWxwZXIgdXNpbmcgdGhlIGdpdmVuIHNlbGVjdG9yLCB3cmFwIHRoZSBoYW5kbGVyIGZ1bmN0aW9uXG4gICAgLCBkZWxlZ2F0ZSA9IGZ1bmN0aW9uIChzZWxlY3RvciwgZm4pIHtcbiAgICAgICAgLy9UT0RPOiBmaW5kVGFyZ2V0ICh0aGVyZWZvcmUgJCkgaXMgY2FsbGVkIHR3aWNlLCBvbmNlIGZvciBtYXRjaCBhbmQgb25jZSBmb3JcbiAgICAgICAgLy8gc2V0dGluZyBlLmN1cnJlbnRUYXJnZXQsIGZpeCB0aGlzIHNvIGl0J3Mgb25seSBuZWVkZWQgb25jZVxuICAgICAgICB2YXIgZmluZFRhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXQsIHJvb3QpIHtcbiAgICAgICAgICAgICAgdmFyIGksIGFycmF5ID0gaXNTdHJpbmcoc2VsZWN0b3IpID8gc2VsZWN0b3JFbmdpbmUoc2VsZWN0b3IsIHJvb3QpIDogc2VsZWN0b3JcbiAgICAgICAgICAgICAgZm9yICg7IHRhcmdldCAmJiB0YXJnZXQgIT09IHJvb3Q7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gYXJyYXkubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgICAgICAgICBpZiAoYXJyYXlbaV0gPT09IHRhcmdldCkgcmV0dXJuIHRhcmdldFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICwgaGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgIHZhciBtYXRjaCA9IGZpbmRUYXJnZXQoZS50YXJnZXQsIHRoaXMpXG4gICAgICAgICAgICAgIGlmIChtYXRjaCkgZm4uYXBwbHkobWF0Y2gsIGFyZ3VtZW50cylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAvLyBfX2JlYW5EZWwgaXNuJ3QgcGxlYXNhbnQgYnV0IGl0J3MgYSBwcml2YXRlIGZ1bmN0aW9uLCBub3QgZXhwb3NlZCBvdXRzaWRlIG9mIEJlYW5cbiAgICAgICAgaGFuZGxlci5fX2JlYW5EZWwgPSB7XG4gICAgICAgICAgICBmdCAgICAgICA6IGZpbmRUYXJnZXQgLy8gYXR0YWNoIGl0IGhlcmUgZm9yIGN1c3RvbUV2ZW50cyB0byB1c2UgdG9vXG4gICAgICAgICAgLCBzZWxlY3RvciA6IHNlbGVjdG9yXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhbmRsZXJcbiAgICAgIH1cblxuICAgICwgZmlyZUxpc3RlbmVyID0gVzNDX01PREVMID8gZnVuY3Rpb24gKGlzTmF0aXZlLCB0eXBlLCBlbGVtZW50KSB7XG4gICAgICAgIC8vIG1vZGVybiBicm93c2VycywgZG8gYSBwcm9wZXIgZGlzcGF0Y2hFdmVudCgpXG4gICAgICAgIHZhciBldnQgPSBkb2MuY3JlYXRlRXZlbnQoaXNOYXRpdmUgPyAnSFRNTEV2ZW50cycgOiAnVUlFdmVudHMnKVxuICAgICAgICBldnRbaXNOYXRpdmUgPyAnaW5pdEV2ZW50JyA6ICdpbml0VUlFdmVudCddKHR5cGUsIHRydWUsIHRydWUsIHdpbiwgMSlcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2dClcbiAgICAgIH0gOiBmdW5jdGlvbiAoaXNOYXRpdmUsIHR5cGUsIGVsZW1lbnQpIHtcbiAgICAgICAgLy8gb2xkIGJyb3dzZXIgdXNlIG9ucHJvcGVydHljaGFuZ2UsIGp1c3QgaW5jcmVtZW50IGEgY3VzdG9tIHByb3BlcnR5IHRvIHRyaWdnZXIgdGhlIGV2ZW50XG4gICAgICAgIGVsZW1lbnQgPSB0YXJnZXRFbGVtZW50KGVsZW1lbnQsIGlzTmF0aXZlKVxuICAgICAgICBpc05hdGl2ZSA/IGVsZW1lbnQuZmlyZUV2ZW50KCdvbicgKyB0eXBlLCBkb2MuY3JlYXRlRXZlbnRPYmplY3QoKSkgOiBlbGVtZW50Wydfb24nICsgdHlwZV0rK1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBQdWJsaWMgQVBJOiBvZmYoKSwgb24oKSwgYWRkKCksIChyZW1vdmUoKSksIG9uZSgpLCBmaXJlKCksIGNsb25lKClcbiAgICAgICAgKi9cblxuICAgICAgLyoqXG4gICAgICAgICogb2ZmKGVsZW1lbnRbLCBldmVudFR5cGUocylbLCBoYW5kbGVyIF1dKVxuICAgICAgICAqL1xuICAgICwgb2ZmID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGVTcGVjLCBmbikge1xuICAgICAgICB2YXIgaXNUeXBlU3RyID0gaXNTdHJpbmcodHlwZVNwZWMpXG4gICAgICAgICAgLCBrLCB0eXBlLCBuYW1lc3BhY2VzLCBpXG5cbiAgICAgICAgaWYgKGlzVHlwZVN0ciAmJiB0eXBlU3BlYy5pbmRleE9mKCcgJykgPiAwKSB7XG4gICAgICAgICAgLy8gb2ZmKGVsLCAndDEgdDIgdDMnLCBmbikgb3Igb2ZmKGVsLCAndDEgdDIgdDMnKVxuICAgICAgICAgIHR5cGVTcGVjID0gc3RyMmFycih0eXBlU3BlYylcbiAgICAgICAgICBmb3IgKGkgPSB0eXBlU3BlYy5sZW5ndGg7IGktLTspXG4gICAgICAgICAgICBvZmYoZWxlbWVudCwgdHlwZVNwZWNbaV0sIGZuKVxuICAgICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICB0eXBlID0gaXNUeXBlU3RyICYmIHR5cGVTcGVjLnJlcGxhY2UobmFtZVJlZ2V4LCAnJylcbiAgICAgICAgaWYgKHR5cGUgJiYgY3VzdG9tRXZlbnRzW3R5cGVdKSB0eXBlID0gY3VzdG9tRXZlbnRzW3R5cGVdLmJhc2VcblxuICAgICAgICBpZiAoIXR5cGVTcGVjIHx8IGlzVHlwZVN0cikge1xuICAgICAgICAgIC8vIG9mZihlbCkgb3Igb2ZmKGVsLCB0MS5ucykgb3Igb2ZmKGVsLCAubnMpIG9yIG9mZihlbCwgLm5zMS5uczIubnMzKVxuICAgICAgICAgIGlmIChuYW1lc3BhY2VzID0gaXNUeXBlU3RyICYmIHR5cGVTcGVjLnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSkgbmFtZXNwYWNlcyA9IHN0cjJhcnIobmFtZXNwYWNlcywgJy4nKVxuICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGVsZW1lbnQsIHR5cGUsIGZuLCBuYW1lc3BhY2VzKVxuICAgICAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odHlwZVNwZWMpKSB7XG4gICAgICAgICAgLy8gb2ZmKGVsLCBmbilcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcihlbGVtZW50LCBudWxsLCB0eXBlU3BlYylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBvZmYoZWwsIHsgdDE6IGZuMSwgdDIsIGZuMiB9KVxuICAgICAgICAgIGZvciAoayBpbiB0eXBlU3BlYykge1xuICAgICAgICAgICAgaWYgKHR5cGVTcGVjLmhhc093blByb3BlcnR5KGspKSBvZmYoZWxlbWVudCwgaywgdHlwZVNwZWNba10pXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogb24oZWxlbWVudCwgZXZlbnRUeXBlKHMpWywgc2VsZWN0b3JdLCBoYW5kbGVyWywgYXJncyBdKVxuICAgICAgICAqL1xuICAgICwgb24gPSBmdW5jdGlvbihlbGVtZW50LCBldmVudHMsIHNlbGVjdG9yLCBmbikge1xuICAgICAgICB2YXIgb3JpZ2luYWxGbiwgdHlwZSwgdHlwZXMsIGksIGFyZ3MsIGVudHJ5LCBmaXJzdFxuXG4gICAgICAgIC8vVE9ETzogdGhlIHVuZGVmaW5lZCBjaGVjayBtZWFucyB5b3UgY2FuJ3QgcGFzcyBhbiAnYXJncycgYXJndW1lbnQsIGZpeCB0aGlzIHBlcmhhcHM/XG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBldmVudHMgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAvL1RPRE86IHRoaXMgY2FuJ3QgaGFuZGxlIGRlbGVnYXRlZCBldmVudHNcbiAgICAgICAgICBmb3IgKHR5cGUgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG4gICAgICAgICAgICAgIG9uLmNhbGwodGhpcywgZWxlbWVudCwgdHlwZSwgZXZlbnRzW3R5cGVdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNGdW5jdGlvbihzZWxlY3RvcikpIHtcbiAgICAgICAgICAvLyBkZWxlZ2F0ZWQgZXZlbnRcbiAgICAgICAgICBvcmlnaW5hbEZuID0gZm5cbiAgICAgICAgICBhcmdzICAgICAgID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDQpXG4gICAgICAgICAgZm4gICAgICAgICA9IGRlbGVnYXRlKHNlbGVjdG9yLCBvcmlnaW5hbEZuLCBzZWxlY3RvckVuZ2luZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzICAgICAgID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpXG4gICAgICAgICAgZm4gICAgICAgICA9IG9yaWdpbmFsRm4gPSBzZWxlY3RvclxuICAgICAgICB9XG5cbiAgICAgICAgdHlwZXMgPSBzdHIyYXJyKGV2ZW50cylcblxuICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIG9uZSgpLCB3cmFwIGluIGEgc2VsZi1yZW1vdmluZyBoYW5kbGVyXG4gICAgICAgIGlmICh0aGlzID09PSBPTkUpIHtcbiAgICAgICAgICBmbiA9IG9uY2Uob2ZmLCBlbGVtZW50LCBldmVudHMsIGZuLCBvcmlnaW5hbEZuKVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gdHlwZXMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgLy8gYWRkIG5ldyBoYW5kbGVyIHRvIHRoZSByZWdpc3RyeSBhbmQgY2hlY2sgaWYgaXQncyB0aGUgZmlyc3QgZm9yIHRoaXMgZWxlbWVudC90eXBlXG4gICAgICAgICAgZmlyc3QgPSByZWdpc3RyeS5wdXQoZW50cnkgPSBuZXcgUmVnRW50cnkoXG4gICAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICwgdHlwZXNbaV0ucmVwbGFjZShuYW1lUmVnZXgsICcnKSAvLyBldmVudCB0eXBlXG4gICAgICAgICAgICAsIGZuXG4gICAgICAgICAgICAsIG9yaWdpbmFsRm5cbiAgICAgICAgICAgICwgc3RyMmFycih0eXBlc1tpXS5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJyksICcuJykgLy8gbmFtZXNwYWNlc1xuICAgICAgICAgICAgLCBhcmdzXG4gICAgICAgICAgICAsIGZhbHNlIC8vIG5vdCByb290XG4gICAgICAgICAgKSlcbiAgICAgICAgICBpZiAoZW50cnlbZXZlbnRTdXBwb3J0XSAmJiBmaXJzdCkge1xuICAgICAgICAgICAgLy8gZmlyc3QgZXZlbnQgb2YgdGhpcyB0eXBlIG9uIHRoaXMgZWxlbWVudCwgYWRkIHJvb3QgbGlzdGVuZXJcbiAgICAgICAgICAgIGxpc3RlbmVyKGVsZW1lbnQsIGVudHJ5LmV2ZW50VHlwZSwgdHJ1ZSwgZW50cnkuY3VzdG9tVHlwZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBhZGQoZWxlbWVudFssIHNlbGVjdG9yXSwgZXZlbnRUeXBlKHMpLCBoYW5kbGVyWywgYXJncyBdKVxuICAgICAgICAqXG4gICAgICAgICogRGVwcmVjYXRlZDoga2VwdCAoZm9yIG5vdykgZm9yIGJhY2t3YXJkLWNvbXBhdGliaWxpdHlcbiAgICAgICAgKi9cbiAgICAsIGFkZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBldmVudHMsIGZuLCBkZWxmbikge1xuICAgICAgICByZXR1cm4gb24uYXBwbHkoXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgLCAhaXNTdHJpbmcoZm4pXG4gICAgICAgICAgICAgID8gc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgICAgICAgICAgIDogWyBlbGVtZW50LCBmbiwgZXZlbnRzLCBkZWxmbiBdLmNvbmNhdChhcmd1bWVudHMubGVuZ3RoID4gMyA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCA1KSA6IFtdKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIG9uZShlbGVtZW50LCBldmVudFR5cGUocylbLCBzZWxlY3Rvcl0sIGhhbmRsZXJbLCBhcmdzIF0pXG4gICAgICAgICovXG4gICAgLCBvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvbi5hcHBseShPTkUsIGFyZ3VtZW50cylcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogZmlyZShlbGVtZW50LCBldmVudFR5cGUocylbLCBhcmdzIF0pXG4gICAgICAgICpcbiAgICAgICAgKiBUaGUgb3B0aW9uYWwgJ2FyZ3MnIGFyZ3VtZW50IG11c3QgYmUgYW4gYXJyYXksIGlmIG5vICdhcmdzJyBhcmd1bWVudCBpcyBwcm92aWRlZFxuICAgICAgICAqIHRoZW4gd2UgY2FuIHVzZSB0aGUgYnJvd3NlcidzIERPTSBldmVudCBzeXN0ZW0sIG90aGVyd2lzZSB3ZSB0cmlnZ2VyIGhhbmRsZXJzIG1hbnVhbGx5XG4gICAgICAgICovXG4gICAgLCBmaXJlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIGFyZ3MpIHtcbiAgICAgICAgdmFyIHR5cGVzID0gc3RyMmFycih0eXBlKVxuICAgICAgICAgICwgaSwgaiwgbCwgbmFtZXMsIGhhbmRsZXJzXG5cbiAgICAgICAgZm9yIChpID0gdHlwZXMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgdHlwZSA9IHR5cGVzW2ldLnJlcGxhY2UobmFtZVJlZ2V4LCAnJylcbiAgICAgICAgICBpZiAobmFtZXMgPSB0eXBlc1tpXS5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpIG5hbWVzID0gc3RyMmFycihuYW1lcywgJy4nKVxuICAgICAgICAgIGlmICghbmFtZXMgJiYgIWFyZ3MgJiYgZWxlbWVudFtldmVudFN1cHBvcnRdKSB7XG4gICAgICAgICAgICBmaXJlTGlzdGVuZXIobmF0aXZlRXZlbnRzW3R5cGVdLCB0eXBlLCBlbGVtZW50KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBub24tbmF0aXZlIGV2ZW50LCBlaXRoZXIgYmVjYXVzZSBvZiBhIG5hbWVzcGFjZSwgYXJndW1lbnRzIG9yIGEgbm9uIERPTSBlbGVtZW50XG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgYWxsIGxpc3RlbmVycyBhbmQgbWFudWFsbHkgJ2ZpcmUnXG4gICAgICAgICAgICBoYW5kbGVycyA9IHJlZ2lzdHJ5LmdldChlbGVtZW50LCB0eXBlLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICAgIGFyZ3MgPSBbZmFsc2VdLmNvbmNhdChhcmdzKVxuICAgICAgICAgICAgZm9yIChqID0gMCwgbCA9IGhhbmRsZXJzLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICBpZiAoaGFuZGxlcnNbal0uaW5OYW1lc3BhY2VzKG5hbWVzKSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzW2pdLmhhbmRsZXIuYXBwbHkoZWxlbWVudCwgYXJncylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBjbG9uZShkc3RFbGVtZW50LCBzcmNFbGVtZW50WywgZXZlbnRUeXBlIF0pXG4gICAgICAgICpcbiAgICAgICAgKiBUT0RPOiBwZXJoYXBzIGZvciBjb25zaXN0ZW5jeSB3ZSBzaG91bGQgYWxsb3cgdGhlIHNhbWUgZmxleGliaWxpdHkgaW4gdHlwZSBzcGVjaWZpZXJzP1xuICAgICAgICAqL1xuICAgICwgY2xvbmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgZnJvbSwgdHlwZSkge1xuICAgICAgICB2YXIgaGFuZGxlcnMgPSByZWdpc3RyeS5nZXQoZnJvbSwgdHlwZSwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgLCBsID0gaGFuZGxlcnMubGVuZ3RoXG4gICAgICAgICAgLCBpID0gMFxuICAgICAgICAgICwgYXJncywgYmVhbkRlbFxuXG4gICAgICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGhhbmRsZXJzW2ldLm9yaWdpbmFsKSB7XG4gICAgICAgICAgICBhcmdzID0gWyBlbGVtZW50LCBoYW5kbGVyc1tpXS50eXBlIF1cbiAgICAgICAgICAgIGlmIChiZWFuRGVsID0gaGFuZGxlcnNbaV0uaGFuZGxlci5fX2JlYW5EZWwpIGFyZ3MucHVzaChiZWFuRGVsLnNlbGVjdG9yKVxuICAgICAgICAgICAgYXJncy5wdXNoKGhhbmRsZXJzW2ldLm9yaWdpbmFsKVxuICAgICAgICAgICAgb24uYXBwbHkobnVsbCwgYXJncylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgIH1cblxuICAgICwgYmVhbiA9IHtcbiAgICAgICAgICBvbiAgICAgICAgICAgICAgICA6IG9uXG4gICAgICAgICwgYWRkICAgICAgICAgICAgICAgOiBhZGRcbiAgICAgICAgLCBvbmUgICAgICAgICAgICAgICA6IG9uZVxuICAgICAgICAsIG9mZiAgICAgICAgICAgICAgIDogb2ZmXG4gICAgICAgICwgcmVtb3ZlICAgICAgICAgICAgOiBvZmZcbiAgICAgICAgLCBjbG9uZSAgICAgICAgICAgICA6IGNsb25lXG4gICAgICAgICwgZmlyZSAgICAgICAgICAgICAgOiBmaXJlXG4gICAgICAgICwgRXZlbnQgICAgICAgICAgICAgOiBFdmVudFxuICAgICAgICAsIHNldFNlbGVjdG9yRW5naW5lIDogc2V0U2VsZWN0b3JFbmdpbmVcbiAgICAgICAgLCBub0NvbmZsaWN0ICAgICAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnRleHRbbmFtZV0gPSBvbGRcbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gIC8vIGZvciBJRSwgY2xlYW4gdXAgb24gdW5sb2FkIHRvIGF2b2lkIGxlYWtzXG4gIGlmICh3aW4uYXR0YWNoRXZlbnQpIHtcbiAgICB2YXIgY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpLCBlbnRyaWVzID0gcmVnaXN0cnkuZW50cmllcygpXG4gICAgICBmb3IgKGkgaW4gZW50cmllcykge1xuICAgICAgICBpZiAoZW50cmllc1tpXS50eXBlICYmIGVudHJpZXNbaV0udHlwZSAhPT0gJ3VubG9hZCcpIG9mZihlbnRyaWVzW2ldLmVsZW1lbnQsIGVudHJpZXNbaV0udHlwZSlcbiAgICAgIH1cbiAgICAgIHdpbi5kZXRhY2hFdmVudCgnb251bmxvYWQnLCBjbGVhbnVwKVxuICAgICAgd2luLkNvbGxlY3RHYXJiYWdlICYmIHdpbi5Db2xsZWN0R2FyYmFnZSgpXG4gICAgfVxuICAgIHdpbi5hdHRhY2hFdmVudCgnb251bmxvYWQnLCBjbGVhbnVwKVxuICB9XG5cbiAgLy8gaW5pdGlhbGl6ZSBzZWxlY3RvciBlbmdpbmUgdG8gaW50ZXJuYWwgZGVmYXVsdCAocVNBIG9yIHRocm93IEVycm9yKVxuICBzZXRTZWxlY3RvckVuZ2luZSgpXG5cbiAgcmV0dXJuIGJlYW5cbn0pOyIsIi8qIVxuICAqIEJvbnpvOiBET00gVXRpbGl0eSAoYykgRHVzdGluIERpYXogMjAxMlxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvYm9uem9cbiAgKiBMaWNlbnNlIE1JVFxuICAqL1xuKGZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSkoJ2JvbnpvJywgdGhpcywgZnVuY3Rpb24oKSB7XG4gIHZhciB3aW4gPSB3aW5kb3dcbiAgICAsIGRvYyA9IHdpbi5kb2N1bWVudFxuICAgICwgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnRcbiAgICAsIHBhcmVudE5vZGUgPSAncGFyZW50Tm9kZSdcbiAgICAsIHNwZWNpYWxBdHRyaWJ1dGVzID0gL14oY2hlY2tlZHx2YWx1ZXxzZWxlY3RlZHxkaXNhYmxlZCkkL2lcbiAgICAgIC8vIHRhZ3MgdGhhdCB3ZSBoYXZlIHRyb3VibGUgaW5zZXJ0aW5nICppbnRvKlxuICAgICwgc3BlY2lhbFRhZ3MgPSAvXihzZWxlY3R8ZmllbGRzZXR8dGFibGV8dGJvZHl8dGZvb3R8dGR8dHJ8Y29sZ3JvdXApJC9pXG4gICAgLCBzaW1wbGVTY3JpcHRUYWdSZSA9IC9cXHMqPHNjcmlwdCArc3JjPVsnXCJdKFteJ1wiXSspWydcIl0+L1xuICAgICwgdGFibGUgPSBbJzx0YWJsZT4nLCAnPC90YWJsZT4nLCAxXVxuICAgICwgdGQgPSBbJzx0YWJsZT48dGJvZHk+PHRyPicsICc8L3RyPjwvdGJvZHk+PC90YWJsZT4nLCAzXVxuICAgICwgb3B0aW9uID0gWyc8c2VsZWN0PicsICc8L3NlbGVjdD4nLCAxXVxuICAgICwgbm9zY29wZSA9IFsnXycsICcnLCAwLCAxXVxuICAgICwgdGFnTWFwID0geyAvLyB0YWdzIHRoYXQgd2UgaGF2ZSB0cm91YmxlICppbnNlcnRpbmcqXG4gICAgICAgICAgdGhlYWQ6IHRhYmxlLCB0Ym9keTogdGFibGUsIHRmb290OiB0YWJsZSwgY29sZ3JvdXA6IHRhYmxlLCBjYXB0aW9uOiB0YWJsZVxuICAgICAgICAsIHRyOiBbJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nLCAyXVxuICAgICAgICAsIHRoOiB0ZCAsIHRkOiB0ZFxuICAgICAgICAsIGNvbDogWyc8dGFibGU+PGNvbGdyb3VwPicsICc8L2NvbGdyb3VwPjwvdGFibGU+JywgMl1cbiAgICAgICAgLCBmaWVsZHNldDogWyc8Zm9ybT4nLCAnPC9mb3JtPicsIDFdXG4gICAgICAgICwgbGVnZW5kOiBbJzxmb3JtPjxmaWVsZHNldD4nLCAnPC9maWVsZHNldD48L2Zvcm0+JywgMl1cbiAgICAgICAgLCBvcHRpb246IG9wdGlvbiwgb3B0Z3JvdXA6IG9wdGlvblxuICAgICAgICAsIHNjcmlwdDogbm9zY29wZSwgc3R5bGU6IG5vc2NvcGUsIGxpbms6IG5vc2NvcGUsIHBhcmFtOiBub3Njb3BlLCBiYXNlOiBub3Njb3BlXG4gICAgICB9XG4gICAgLCBzdGF0ZUF0dHJpYnV0ZXMgPSAvXihjaGVja2VkfHNlbGVjdGVkfGRpc2FibGVkKSQvXG4gICAgLCBpZSA9IC9tc2llL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KVxuICAgICwgaGFzQ2xhc3MsIGFkZENsYXNzLCByZW1vdmVDbGFzc1xuICAgICwgdWlkTWFwID0ge31cbiAgICAsIHV1aWRzID0gMFxuICAgICwgZGlnaXQgPSAvXi0/W1xcZFxcLl0rJC9cbiAgICAsIGRhdHRyID0gL15kYXRhLSguKykkL1xuICAgICwgcHggPSAncHgnXG4gICAgLCBzZXRBdHRyaWJ1dGUgPSAnc2V0QXR0cmlidXRlJ1xuICAgICwgZ2V0QXR0cmlidXRlID0gJ2dldEF0dHJpYnV0ZSdcbiAgICAsIGJ5VGFnID0gJ2dldEVsZW1lbnRzQnlUYWdOYW1lJ1xuICAgICwgZmVhdHVyZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGUgPSBkb2MuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICAgIGUuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjeFwiPng8L2E+PHRhYmxlIHN0eWxlPVwiZmxvYXQ6bGVmdDtcIj48L3RhYmxlPidcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBocmVmRXh0ZW5kZWQ6IGVbYnlUYWddKCdhJylbMF1bZ2V0QXR0cmlidXRlXSgnaHJlZicpICE9ICcjeCcgLy8gSUUgPCA4XG4gICAgICAgICwgYXV0b1Rib2R5OiBlW2J5VGFnXSgndGJvZHknKS5sZW5ndGggIT09IDAgLy8gSUUgPCA4XG4gICAgICAgICwgY29tcHV0ZWRTdHlsZTogZG9jLmRlZmF1bHRWaWV3ICYmIGRvYy5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlXG4gICAgICAgICwgY3NzRmxvYXQ6IGVbYnlUYWddKCd0YWJsZScpWzBdLnN0eWxlLnN0eWxlRmxvYXQgPyAnc3R5bGVGbG9hdCcgOiAnY3NzRmxvYXQnXG4gICAgICAgICwgdHJhbnNmb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvcHMgPSBbJ3RyYW5zZm9ybScsICd3ZWJraXRUcmFuc2Zvcm0nLCAnTW96VHJhbnNmb3JtJywgJ09UcmFuc2Zvcm0nLCAnbXNUcmFuc2Zvcm0nXSwgaVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9wc1tpXSBpbiBlLnN0eWxlKSByZXR1cm4gcHJvcHNbaV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KClcbiAgICAgICAgLCBjbGFzc0xpc3Q6ICdjbGFzc0xpc3QnIGluIGVcbiAgICAgICAgLCBvcGFzaXR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGRvYy5jcmVhdGVFbGVtZW50KCdhJykuc3R5bGUub3BhY2l0eSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICB9KClcbiAgICAgICAgfVxuICAgICAgfSgpXG4gICAgLCB0cmltUmVwbGFjZSA9IC8oXlxccyp8XFxzKiQpL2dcbiAgICAsIHdoaXRlc3BhY2VSZWdleCA9IC9cXHMrL1xuICAgICwgdG9TdHJpbmcgPSBTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgLCB1bml0bGVzcyA9IHsgbGluZUhlaWdodDogMSwgem9vbTogMSwgekluZGV4OiAxLCBvcGFjaXR5OiAxLCBib3hGbGV4OiAxLCBXZWJraXRCb3hGbGV4OiAxLCBNb3pCb3hGbGV4OiAxIH1cbiAgICAsIHF1ZXJ5ID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwgJiYgZnVuY3Rpb24gKHNlbGVjdG9yKSB7IHJldHVybiBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikgfVxuICAgICwgdHJpbSA9IFN0cmluZy5wcm90b3R5cGUudHJpbSA/XG4gICAgICAgIGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgcmV0dXJuIHMudHJpbSgpXG4gICAgICAgIH0gOlxuICAgICAgICBmdW5jdGlvbiAocykge1xuICAgICAgICAgIHJldHVybiBzLnJlcGxhY2UodHJpbVJlcGxhY2UsICcnKVxuICAgICAgICB9XG5cbiAgICAsIGdldFN0eWxlID0gZmVhdHVyZXMuY29tcHV0ZWRTdHlsZVxuICAgICAgICA/IGZ1bmN0aW9uIChlbCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG51bGxcbiAgICAgICAgICAgICAgLCBjb21wdXRlZCA9IGRvYy5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsLCAnJylcbiAgICAgICAgICAgIGNvbXB1dGVkICYmICh2YWx1ZSA9IGNvbXB1dGVkW3Byb3BlcnR5XSlcbiAgICAgICAgICAgIHJldHVybiBlbC5zdHlsZVtwcm9wZXJ0eV0gfHwgdmFsdWVcbiAgICAgICAgICB9XG4gICAgICAgIDogIShpZSAmJiBodG1sLmN1cnJlbnRTdHlsZSlcbiAgICAgICAgICA/IGZ1bmN0aW9uIChlbCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsLnN0eWxlW3Byb3BlcnR5XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDpcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5XG4gICAgICAgICAgICogQHJldHVybiB7c3RyaW5nfG51bWJlcn1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBmdW5jdGlvbiAoZWwsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICB2YXIgdmFsLCB2YWx1ZVxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdvcGFjaXR5JyAmJiAhZmVhdHVyZXMub3Bhc2l0eSkge1xuICAgICAgICAgICAgICB2YWwgPSAxMDBcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YWwgPSBlbFsnZmlsdGVycyddWydEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5BbHBoYSddLm9wYWNpdHlcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZTEpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgdmFsID0gZWxbJ2ZpbHRlcnMnXSgnYWxwaGEnKS5vcGFjaXR5XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZTIpIHt9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHZhbCAvIDEwMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSBlbC5jdXJyZW50U3R5bGUgPyBlbC5jdXJyZW50U3R5bGVbcHJvcGVydHldIDogbnVsbFxuICAgICAgICAgICAgcmV0dXJuIGVsLnN0eWxlW3Byb3BlcnR5XSB8fCB2YWx1ZVxuICAgICAgICAgIH1cblxuICBmdW5jdGlvbiBpc05vZGUobm9kZSkge1xuICAgIHJldHVybiBub2RlICYmIG5vZGUubm9kZU5hbWUgJiYgKG5vZGUubm9kZVR5cGUgPT0gMSB8fCBub2RlLm5vZGVUeXBlID09IDExKVxuICB9XG5cblxuICBmdW5jdGlvbiBub3JtYWxpemUobm9kZSwgaG9zdCwgY2xvbmUpIHtcbiAgICB2YXIgaSwgbCwgcmV0XG4gICAgaWYgKHR5cGVvZiBub2RlID09ICdzdHJpbmcnKSByZXR1cm4gYm9uem8uY3JlYXRlKG5vZGUpXG4gICAgaWYgKGlzTm9kZShub2RlKSkgbm9kZSA9IFsgbm9kZSBdXG4gICAgaWYgKGNsb25lKSB7XG4gICAgICByZXQgPSBbXSAvLyBkb24ndCBjaGFuZ2Ugb3JpZ2luYWwgYXJyYXlcbiAgICAgIGZvciAoaSA9IDAsIGwgPSBub2RlLmxlbmd0aDsgaSA8IGw7IGkrKykgcmV0W2ldID0gY2xvbmVOb2RlKGhvc3QsIG5vZGVbaV0pXG4gICAgICByZXR1cm4gcmV0XG4gICAgfVxuICAgIHJldHVybiBub2RlXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGMgYSBjbGFzcyBuYW1lIHRvIHRlc3RcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIGNsYXNzUmVnKGMpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnKF58XFxcXHMrKScgKyBjICsgJyhcXFxccyt8JCknKVxuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtCb256b3xBcnJheX0gYXJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsIG51bWJlciwgKEJvbnpvfEFycmF5KSl9IGZuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3Njb3BlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG9wdF9yZXZcbiAgICogQHJldHVybiB7Qm9uem98QXJyYXl9XG4gICAqL1xuICBmdW5jdGlvbiBlYWNoKGFyLCBmbiwgb3B0X3Njb3BlLCBvcHRfcmV2KSB7XG4gICAgdmFyIGluZCwgaSA9IDAsIGwgPSBhci5sZW5ndGhcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgaW5kID0gb3B0X3JldiA/IGFyLmxlbmd0aCAtIGkgLSAxIDogaVxuICAgICAgZm4uY2FsbChvcHRfc2NvcGUgfHwgYXJbaW5kXSwgYXJbaW5kXSwgaW5kLCBhcilcbiAgICB9XG4gICAgcmV0dXJuIGFyXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0JvbnpvfEFycmF5fSBhclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCwgbnVtYmVyLCAoQm9uem98QXJyYXkpKX0gZm5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfc2NvcGVcbiAgICogQHJldHVybiB7Qm9uem98QXJyYXl9XG4gICAqL1xuICBmdW5jdGlvbiBkZWVwRWFjaChhciwgZm4sIG9wdF9zY29wZSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoaXNOb2RlKGFyW2ldKSkge1xuICAgICAgICBkZWVwRWFjaChhcltpXS5jaGlsZE5vZGVzLCBmbiwgb3B0X3Njb3BlKVxuICAgICAgICBmbi5jYWxsKG9wdF9zY29wZSB8fCBhcltpXSwgYXJbaV0sIGksIGFyKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGNhbWVsaXplKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKC8tKC4pL2csIGZ1bmN0aW9uIChtLCBtMSkge1xuICAgICAgcmV0dXJuIG0xLnRvVXBwZXJDYXNlKClcbiAgICB9KVxuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZGVjYW1lbGl6ZShzKSB7XG4gICAgcmV0dXJuIHMgPyBzLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCkgOiBzXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBmdW5jdGlvbiBkYXRhKGVsKSB7XG4gICAgZWxbZ2V0QXR0cmlidXRlXSgnZGF0YS1ub2RlLXVpZCcpIHx8IGVsW3NldEF0dHJpYnV0ZV0oJ2RhdGEtbm9kZS11aWQnLCArK3V1aWRzKVxuICAgIHZhciB1aWQgPSBlbFtnZXRBdHRyaWJ1dGVdKCdkYXRhLW5vZGUtdWlkJylcbiAgICByZXR1cm4gdWlkTWFwW3VpZF0gfHwgKHVpZE1hcFt1aWRdID0ge30pXG4gIH1cblxuXG4gIC8qKlxuICAgKiByZW1vdmVzIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBhbiBlbGVtZW50XG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICovXG4gIGZ1bmN0aW9uIGNsZWFyRGF0YShlbCkge1xuICAgIHZhciB1aWQgPSBlbFtnZXRBdHRyaWJ1dGVdKCdkYXRhLW5vZGUtdWlkJylcbiAgICBpZiAodWlkKSBkZWxldGUgdWlkTWFwW3VpZF1cbiAgfVxuXG5cbiAgZnVuY3Rpb24gZGF0YVZhbHVlKGQpIHtcbiAgICB2YXIgZlxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGQgPT09IG51bGwgfHwgZCA9PT0gdW5kZWZpbmVkKSA/IHVuZGVmaW5lZCA6XG4gICAgICAgIGQgPT09ICd0cnVlJyA/IHRydWUgOlxuICAgICAgICAgIGQgPT09ICdmYWxzZScgPyBmYWxzZSA6XG4gICAgICAgICAgICBkID09PSAnbnVsbCcgPyBudWxsIDpcbiAgICAgICAgICAgICAgKGYgPSBwYXJzZUZsb2F0KGQpKSA9PSBkID8gZiA6IGQ7XG4gICAgfSBjYXRjaChlKSB7fVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Qm9uem98QXJyYXl9IGFyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LCBudW1iZXIsIChCb256b3xBcnJheSkpfSBmblxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9zY29wZVxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIGBzb21lYHRoaW5nIHdhcyBmb3VuZFxuICAgKi9cbiAgZnVuY3Rpb24gc29tZShhciwgZm4sIG9wdF9zY29wZSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXIubGVuZ3RoOyBpIDwgajsgKytpKSBpZiAoZm4uY2FsbChvcHRfc2NvcGUgfHwgbnVsbCwgYXJbaV0sIGksIGFyKSkgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG5cbiAgLyoqXG4gICAqIHRoaXMgY291bGQgYmUgYSBnaWFudCBlbnVtIG9mIENTUyBwcm9wZXJ0aWVzXG4gICAqIGJ1dCBpbiBmYXZvciBvZiBmaWxlIHNpemUgc2Fucy1jbG9zdXJlIGRlYWRjb2RlIG9wdGltaXphdGlvbnNcbiAgICogd2UncmUganVzdCBhc2tpbmcgZm9yIGFueSBvbCBzdHJpbmdcbiAgICogdGhlbiBpdCBnZXRzIHRyYW5zZm9ybWVkIGludG8gdGhlIGFwcHJvcHJpYXRlIHN0eWxlIHByb3BlcnR5IGZvciBKUyBhY2Nlc3NcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gc3R5bGVQcm9wZXJ0eShwKSB7XG4gICAgICAocCA9PSAndHJhbnNmb3JtJyAmJiAocCA9IGZlYXR1cmVzLnRyYW5zZm9ybSkpIHx8XG4gICAgICAgICgvXnRyYW5zZm9ybS0/W09vXXJpZ2luJC8udGVzdChwKSAmJiAocCA9IGZlYXR1cmVzLnRyYW5zZm9ybSArICdPcmlnaW4nKSkgfHxcbiAgICAgICAgKHAgPT0gJ2Zsb2F0JyAmJiAocCA9IGZlYXR1cmVzLmNzc0Zsb2F0KSlcbiAgICAgIHJldHVybiBwID8gY2FtZWxpemUocCkgOiBudWxsXG4gIH1cblxuICAvLyB0aGlzIGluc2VydCBtZXRob2QgaXMgaW50ZW5zZVxuICBmdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBob3N0LCBmbiwgcmV2KSB7XG4gICAgdmFyIGkgPSAwLCBzZWxmID0gaG9zdCB8fCB0aGlzLCByID0gW11cbiAgICAgIC8vIHRhcmdldCBub2RlcyBjb3VsZCBiZSBhIGNzcyBzZWxlY3RvciBpZiBpdCdzIGEgc3RyaW5nIGFuZCBhIHNlbGVjdG9yIGVuZ2luZSBpcyBwcmVzZW50XG4gICAgICAvLyBvdGhlcndpc2UsIGp1c3QgdXNlIHRhcmdldFxuICAgICAgLCBub2RlcyA9IHF1ZXJ5ICYmIHR5cGVvZiB0YXJnZXQgPT0gJ3N0cmluZycgJiYgdGFyZ2V0LmNoYXJBdCgwKSAhPSAnPCcgPyBxdWVyeSh0YXJnZXQpIDogdGFyZ2V0XG4gICAgLy8gbm9ybWFsaXplIGVhY2ggbm9kZSBpbiBjYXNlIGl0J3Mgc3RpbGwgYSBzdHJpbmcgYW5kIHdlIG5lZWQgdG8gY3JlYXRlIG5vZGVzIG9uIHRoZSBmbHlcbiAgICBlYWNoKG5vcm1hbGl6ZShub2RlcyksIGZ1bmN0aW9uICh0LCBqKSB7XG4gICAgICBlYWNoKHNlbGYsIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBmbih0LCByW2krK10gPSBqID4gMCA/IGNsb25lTm9kZShzZWxmLCBlbCkgOiBlbClcbiAgICAgIH0sIG51bGwsIHJldilcbiAgICB9LCB0aGlzLCByZXYpXG4gICAgc2VsZi5sZW5ndGggPSBpXG4gICAgZWFjaChyLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZlstLWldID0gZVxuICAgIH0sIG51bGwsICFyZXYpXG4gICAgcmV0dXJuIHNlbGZcbiAgfVxuXG5cbiAgLyoqXG4gICAqIHNldHMgYW4gZWxlbWVudCB0byBhbiBleHBsaWNpdCB4L3kgcG9zaXRpb24gb24gdGhlIHBhZ2VcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgKiBAcGFyYW0gez9udW1iZXJ9IHhcbiAgICogQHBhcmFtIHs/bnVtYmVyfSB5XG4gICAqL1xuICBmdW5jdGlvbiB4eShlbCwgeCwgeSkge1xuICAgIHZhciAkZWwgPSBib256byhlbClcbiAgICAgICwgc3R5bGUgPSAkZWwuY3NzKCdwb3NpdGlvbicpXG4gICAgICAsIG9mZnNldCA9ICRlbC5vZmZzZXQoKVxuICAgICAgLCByZWwgPSAncmVsYXRpdmUnXG4gICAgICAsIGlzUmVsID0gc3R5bGUgPT0gcmVsXG4gICAgICAsIGRlbHRhID0gW3BhcnNlSW50KCRlbC5jc3MoJ2xlZnQnKSwgMTApLCBwYXJzZUludCgkZWwuY3NzKCd0b3AnKSwgMTApXVxuXG4gICAgaWYgKHN0eWxlID09ICdzdGF0aWMnKSB7XG4gICAgICAkZWwuY3NzKCdwb3NpdGlvbicsIHJlbClcbiAgICAgIHN0eWxlID0gcmVsXG4gICAgfVxuXG4gICAgaXNOYU4oZGVsdGFbMF0pICYmIChkZWx0YVswXSA9IGlzUmVsID8gMCA6IGVsLm9mZnNldExlZnQpXG4gICAgaXNOYU4oZGVsdGFbMV0pICYmIChkZWx0YVsxXSA9IGlzUmVsID8gMCA6IGVsLm9mZnNldFRvcClcblxuICAgIHggIT0gbnVsbCAmJiAoZWwuc3R5bGUubGVmdCA9IHggLSBvZmZzZXQubGVmdCArIGRlbHRhWzBdICsgcHgpXG4gICAgeSAhPSBudWxsICYmIChlbC5zdHlsZS50b3AgPSB5IC0gb2Zmc2V0LnRvcCArIGRlbHRhWzFdICsgcHgpXG5cbiAgfVxuXG4gIC8vIGNsYXNzTGlzdCBzdXBwb3J0IGZvciBjbGFzcyBtYW5hZ2VtZW50XG4gIC8vIGFsdGhvIHRvIGJlIGZhaXIsIHRoZSBhcGkgc3Vja3MgYmVjYXVzZSBpdCB3b24ndCBhY2NlcHQgbXVsdGlwbGUgY2xhc3NlcyBhdCBvbmNlXG4gIGlmIChmZWF0dXJlcy5jbGFzc0xpc3QpIHtcbiAgICBoYXNDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhjKVxuICAgIH1cbiAgICBhZGRDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjKVxuICAgIH1cbiAgICByZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjKVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBoYXNDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgcmV0dXJuIGNsYXNzUmVnKGMpLnRlc3QoZWwuY2xhc3NOYW1lKVxuICAgIH1cbiAgICBhZGRDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgZWwuY2xhc3NOYW1lID0gdHJpbShlbC5jbGFzc05hbWUgKyAnICcgKyBjKVxuICAgIH1cbiAgICByZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgZWwuY2xhc3NOYW1lID0gdHJpbShlbC5jbGFzc05hbWUucmVwbGFjZShjbGFzc1JlZyhjKSwgJyAnKSlcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiB0aGlzIGFsbG93cyBtZXRob2QgY2FsbGluZyBmb3Igc2V0dGluZyB2YWx1ZXNcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYm9uem8oZWxlbWVudHMpLmNzcygnY29sb3InLCBmdW5jdGlvbiAoZWwpIHtcbiAgICogICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLWNvbG9yJylcbiAgICogfSlcbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uIChFbGVtZW50KXxzdHJpbmd9XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHNldHRlcihlbCwgdikge1xuICAgIHJldHVybiB0eXBlb2YgdiA9PSAnZnVuY3Rpb24nID8gdihlbCkgOiB2XG4gIH1cblxuICBmdW5jdGlvbiBzY3JvbGwoeCwgeSwgdHlwZSkge1xuICAgIHZhciBlbCA9IHRoaXNbMF1cbiAgICBpZiAoIWVsKSByZXR1cm4gdGhpc1xuICAgIGlmICh4ID09IG51bGwgJiYgeSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gKGlzQm9keShlbCkgPyBnZXRXaW5kb3dTY3JvbGwoKSA6IHsgeDogZWwuc2Nyb2xsTGVmdCwgeTogZWwuc2Nyb2xsVG9wIH0pW3R5cGVdXG4gICAgfVxuICAgIGlmIChpc0JvZHkoZWwpKSB7XG4gICAgICB3aW4uc2Nyb2xsVG8oeCwgeSlcbiAgICB9IGVsc2Uge1xuICAgICAgeCAhPSBudWxsICYmIChlbC5zY3JvbGxMZWZ0ID0geClcbiAgICAgIHkgIT0gbnVsbCAmJiAoZWwuc2Nyb2xsVG9wID0geSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtBcnJheS48RWxlbWVudD58RWxlbWVudHxOb2RlfHN0cmluZ30gZWxlbWVudHNcbiAgICovXG4gIGZ1bmN0aW9uIEJvbnpvKGVsZW1lbnRzKSB7XG4gICAgdGhpcy5sZW5ndGggPSAwXG4gICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICBlbGVtZW50cyA9IHR5cGVvZiBlbGVtZW50cyAhPT0gJ3N0cmluZycgJiZcbiAgICAgICAgIWVsZW1lbnRzLm5vZGVUeXBlICYmXG4gICAgICAgIHR5cGVvZiBlbGVtZW50cy5sZW5ndGggIT09ICd1bmRlZmluZWQnID9cbiAgICAgICAgICBlbGVtZW50cyA6XG4gICAgICAgICAgW2VsZW1lbnRzXVxuICAgICAgdGhpcy5sZW5ndGggPSBlbGVtZW50cy5sZW5ndGhcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHRoaXNbaV0gPSBlbGVtZW50c1tpXVxuICAgIH1cbiAgfVxuXG4gIEJvbnpvLnByb3RvdHlwZSA9IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbaW5kZXhdIHx8IG51bGxcbiAgICAgIH1cblxuICAgICAgLy8gaXRldGF0b3JzXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oRWxlbWVudHxOb2RlKX0gZm5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3Njb3BlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgZWFjaDogZnVuY3Rpb24gKGZuLCBvcHRfc2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIGVhY2godGhpcywgZm4sIG9wdF9zY29wZSlcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfc2NvcGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBkZWVwRWFjaDogZnVuY3Rpb24gKGZuLCBvcHRfc2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIGRlZXBFYWNoKHRoaXMsIGZuLCBvcHRfc2NvcGUpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9yZWplY3RcbiAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICovXG4gICAgLCBtYXA6IGZ1bmN0aW9uIChmbiwgb3B0X3JlamVjdCkge1xuICAgICAgICB2YXIgbSA9IFtdLCBuLCBpXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbiA9IGZuLmNhbGwodGhpcywgdGhpc1tpXSwgaSlcbiAgICAgICAgICBvcHRfcmVqZWN0ID8gKG9wdF9yZWplY3QobikgJiYgbS5wdXNoKG4pKSA6IG0ucHVzaChuKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtXG4gICAgICB9XG5cbiAgICAvLyB0ZXh0IGFuZCBodG1sIGluc2VydGVycyFcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBoIHRoZSBIVE1MIHRvIGluc2VydFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG9wdF90ZXh0IHdoZXRoZXIgdG8gc2V0IG9yIGdldCB0ZXh0IGNvbnRlbnRcbiAgICAgKiBAcmV0dXJuIHtCb256b3xzdHJpbmd9XG4gICAgICovXG4gICAgLCBodG1sOiBmdW5jdGlvbiAoaCwgb3B0X3RleHQpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9wdF90ZXh0XG4gICAgICAgICAgICAgID8gaHRtbC50ZXh0Q29udGVudCA9PT0gdW5kZWZpbmVkID8gJ2lubmVyVGV4dCcgOiAndGV4dENvbnRlbnQnXG4gICAgICAgICAgICAgIDogJ2lubmVySFRNTCdcbiAgICAgICAgICAsIHRoYXQgPSB0aGlzXG4gICAgICAgICAgLCBhcHBlbmQgPSBmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICAgICAgZWFjaChub3JtYWxpemUoaCwgdGhhdCwgaSksIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQobm9kZSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAsIHVwZGF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAob3B0X3RleHQgfHwgKHR5cGVvZiBoID09ICdzdHJpbmcnICYmICFzcGVjaWFsVGFncy50ZXN0KGVsLnRhZ05hbWUpKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsW21ldGhvZF0gPSBoXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICBhcHBlbmQoZWwsIGkpXG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlb2YgaCAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgID8gdGhpcy5lbXB0eSgpLmVhY2godXBkYXRlRWxlbWVudClcbiAgICAgICAgICA6IHRoaXNbMF0gPyB0aGlzWzBdW21ldGhvZF0gOiAnJ1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3RleHQgdGhlIHRleHQgdG8gc2V0LCBvdGhlcndpc2UgdGhpcyBpcyBhIGdldHRlclxuICAgICAgICogQHJldHVybiB7Qm9uem98c3RyaW5nfVxuICAgICAgICovXG4gICAgLCB0ZXh0OiBmdW5jdGlvbiAob3B0X3RleHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHRtbChvcHRfdGV4dCwgdHJ1ZSlcbiAgICAgIH1cblxuICAgICAgLy8gbW9yZSByZWxhdGVkIGluc2VydGlvbiBtZXRob2RzXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gbm9kZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGFwcGVuZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgZWFjaChub3JtYWxpemUobm9kZSwgdGhhdCwgaSksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSBub2RlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcHJlcGVuZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgdmFyIGZpcnN0ID0gZWwuZmlyc3RDaGlsZFxuICAgICAgICAgIGVhY2gobm9ybWFsaXplKG5vZGUsIHRoYXQsIGkpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgZWwuaW5zZXJ0QmVmb3JlKGksIGZpcnN0KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSB0YXJnZXQgdGhlIGxvY2F0aW9uIGZvciB3aGljaCB5b3UnbGwgaW5zZXJ0IHlvdXIgbmV3IGNvbnRlbnRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2hvc3QgYW4gb3B0aW9uYWwgaG9zdCBzY29wZSAocHJpbWFyaWx5IHVzZWQgd2hlbiBpbnRlZ3JhdGVkIHdpdGggRW5kZXIpXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYXBwZW5kVG86IGZ1bmN0aW9uICh0YXJnZXQsIG9wdF9ob3N0KSB7XG4gICAgICAgIHJldHVybiBpbnNlcnQuY2FsbCh0aGlzLCB0YXJnZXQsIG9wdF9ob3N0LCBmdW5jdGlvbiAodCwgZWwpIHtcbiAgICAgICAgICB0LmFwcGVuZENoaWxkKGVsKVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gdGFyZ2V0IHRoZSBsb2NhdGlvbiBmb3Igd2hpY2ggeW91J2xsIGluc2VydCB5b3VyIG5ldyBjb250ZW50XG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9ob3N0IGFuIG9wdGlvbmFsIGhvc3Qgc2NvcGUgKHByaW1hcmlseSB1c2VkIHdoZW4gaW50ZWdyYXRlZCB3aXRoIEVuZGVyKVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHByZXBlbmRUbzogZnVuY3Rpb24gKHRhcmdldCwgb3B0X2hvc3QpIHtcbiAgICAgICAgcmV0dXJuIGluc2VydC5jYWxsKHRoaXMsIHRhcmdldCwgb3B0X2hvc3QsIGZ1bmN0aW9uICh0LCBlbCkge1xuICAgICAgICAgIHQuaW5zZXJ0QmVmb3JlKGVsLCB0LmZpcnN0Q2hpbGQpXG4gICAgICAgIH0sIDEpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSBub2RlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYmVmb3JlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICBlYWNoKG5vcm1hbGl6ZShub2RlLCB0aGF0LCBpKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIGVsW3BhcmVudE5vZGVdLmluc2VydEJlZm9yZShpLCBlbClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gbm9kZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGFmdGVyOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICBlYWNoKG5vcm1hbGl6ZShub2RlLCB0aGF0LCBpKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIGVsW3BhcmVudE5vZGVdLmluc2VydEJlZm9yZShpLCBlbC5uZXh0U2libGluZylcbiAgICAgICAgICB9LCBudWxsLCAxKVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gdGFyZ2V0IHRoZSBsb2NhdGlvbiBmb3Igd2hpY2ggeW91J2xsIGluc2VydCB5b3VyIG5ldyBjb250ZW50XG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9ob3N0IGFuIG9wdGlvbmFsIGhvc3Qgc2NvcGUgKHByaW1hcmlseSB1c2VkIHdoZW4gaW50ZWdyYXRlZCB3aXRoIEVuZGVyKVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGluc2VydEJlZm9yZTogZnVuY3Rpb24gKHRhcmdldCwgb3B0X2hvc3QpIHtcbiAgICAgICAgcmV0dXJuIGluc2VydC5jYWxsKHRoaXMsIHRhcmdldCwgb3B0X2hvc3QsIGZ1bmN0aW9uICh0LCBlbCkge1xuICAgICAgICAgIHRbcGFyZW50Tm9kZV0uaW5zZXJ0QmVmb3JlKGVsLCB0KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gdGFyZ2V0IHRoZSBsb2NhdGlvbiBmb3Igd2hpY2ggeW91J2xsIGluc2VydCB5b3VyIG5ldyBjb250ZW50XG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9ob3N0IGFuIG9wdGlvbmFsIGhvc3Qgc2NvcGUgKHByaW1hcmlseSB1c2VkIHdoZW4gaW50ZWdyYXRlZCB3aXRoIEVuZGVyKVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGluc2VydEFmdGVyOiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRfaG9zdCkge1xuICAgICAgICByZXR1cm4gaW5zZXJ0LmNhbGwodGhpcywgdGFyZ2V0LCBvcHRfaG9zdCwgZnVuY3Rpb24gKHQsIGVsKSB7XG4gICAgICAgICAgdmFyIHNpYmxpbmcgPSB0Lm5leHRTaWJsaW5nXG4gICAgICAgICAgc2libGluZyA/XG4gICAgICAgICAgICB0W3BhcmVudE5vZGVdLmluc2VydEJlZm9yZShlbCwgc2libGluZykgOlxuICAgICAgICAgICAgdFtwYXJlbnROb2RlXS5hcHBlbmRDaGlsZChlbClcbiAgICAgICAgfSwgMSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IG5vZGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCByZXBsYWNlV2l0aDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgYm9uem8obm9ybWFsaXplKG5vZGUpKS5pbnNlcnRBZnRlcih0aGlzKVxuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmUoKVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2hvc3QgYW4gb3B0aW9uYWwgaG9zdCBzY29wZSAocHJpbWFyaWx5IHVzZWQgd2hlbiBpbnRlZ3JhdGVkIHdpdGggRW5kZXIpXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgY2xvbmU6IGZ1bmN0aW9uIChvcHRfaG9zdCkge1xuICAgICAgICB2YXIgcmV0ID0gW10gLy8gZG9uJ3QgY2hhbmdlIG9yaWdpbmFsIGFycmF5XG4gICAgICAgICAgLCBsLCBpXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgcmV0W2ldID0gY2xvbmVOb2RlKG9wdF9ob3N0IHx8IHRoaXMsIHRoaXNbaV0pXG4gICAgICAgIHJldHVybiBib256byhyZXQpXG4gICAgICB9XG5cbiAgICAgIC8vIGNsYXNzIG1hbmFnZW1lbnRcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY1xuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGFkZENsYXNzOiBmdW5jdGlvbiAoYykge1xuICAgICAgICBjID0gdG9TdHJpbmcuY2FsbChjKS5zcGxpdCh3aGl0ZXNwYWNlUmVnZXgpXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgLy8gd2UgYGVhY2hgIGhlcmUgc28geW91IGNhbiBkbyAkZWwuYWRkQ2xhc3MoJ2ZvbyBiYXInKVxuICAgICAgICAgIGVhY2goYywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIGlmIChjICYmICFoYXNDbGFzcyhlbCwgc2V0dGVyKGVsLCBjKSkpXG4gICAgICAgICAgICAgIGFkZENsYXNzKGVsLCBzZXR0ZXIoZWwsIGMpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY1xuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoYykge1xuICAgICAgICBjID0gdG9TdHJpbmcuY2FsbChjKS5zcGxpdCh3aGl0ZXNwYWNlUmVnZXgpXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWFjaChjLCBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgaWYgKGMgJiYgaGFzQ2xhc3MoZWwsIHNldHRlcihlbCwgYykpKVxuICAgICAgICAgICAgICByZW1vdmVDbGFzcyhlbCwgc2V0dGVyKGVsLCBjKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNcbiAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAsIGhhc0NsYXNzOiBmdW5jdGlvbiAoYykge1xuICAgICAgICBjID0gdG9TdHJpbmcuY2FsbChjKS5zcGxpdCh3aGl0ZXNwYWNlUmVnZXgpXG4gICAgICAgIHJldHVybiBzb21lKHRoaXMsIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIHJldHVybiBzb21lKGMsIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICByZXR1cm4gYyAmJiBoYXNDbGFzcyhlbCwgYylcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGMgY2xhc3NuYW1lIHRvIHRvZ2dsZVxuICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gb3B0X2NvbmRpdGlvbiB3aGV0aGVyIHRvIGFkZCBvciByZW1vdmUgdGhlIGNsYXNzIHN0cmFpZ2h0IGF3YXlcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCB0b2dnbGVDbGFzczogZnVuY3Rpb24gKGMsIG9wdF9jb25kaXRpb24pIHtcbiAgICAgICAgYyA9IHRvU3RyaW5nLmNhbGwoYykuc3BsaXQod2hpdGVzcGFjZVJlZ2V4KVxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVhY2goYywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIGlmIChjKSB7XG4gICAgICAgICAgICAgIHR5cGVvZiBvcHRfY29uZGl0aW9uICE9PSAndW5kZWZpbmVkJyA/XG4gICAgICAgICAgICAgICAgb3B0X2NvbmRpdGlvbiA/ICFoYXNDbGFzcyhlbCwgYykgJiYgYWRkQ2xhc3MoZWwsIGMpIDogcmVtb3ZlQ2xhc3MoZWwsIGMpIDpcbiAgICAgICAgICAgICAgICBoYXNDbGFzcyhlbCwgYykgPyByZW1vdmVDbGFzcyhlbCwgYykgOiBhZGRDbGFzcyhlbCwgYylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBkaXNwbGF5IHRvZ2dsZXJzXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfdHlwZSB1c2VmdWwgdG8gc2V0IGJhY2sgdG8gYW55dGhpbmcgb3RoZXIgdGhhbiBhbiBlbXB0eSBzdHJpbmdcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBzaG93OiBmdW5jdGlvbiAob3B0X3R5cGUpIHtcbiAgICAgICAgb3B0X3R5cGUgPSB0eXBlb2Ygb3B0X3R5cGUgPT0gJ3N0cmluZycgPyBvcHRfdHlwZSA6ICcnXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IG9wdF90eXBlXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb249fSBvcHRfY2FsbGJhY2tcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3R5cGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCB0b2dnbGU6IGZ1bmN0aW9uIChvcHRfY2FsbGJhY2ssIG9wdF90eXBlKSB7XG4gICAgICAgIG9wdF90eXBlID0gdHlwZW9mIG9wdF90eXBlID09ICdzdHJpbmcnID8gb3B0X3R5cGUgOiAnJztcbiAgICAgICAgdHlwZW9mIG9wdF9jYWxsYmFjayAhPSAnZnVuY3Rpb24nICYmIChvcHRfY2FsbGJhY2sgPSBudWxsKVxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAoZWwub2Zmc2V0V2lkdGggfHwgZWwub2Zmc2V0SGVpZ2h0KSA/ICdub25lJyA6IG9wdF90eXBlO1xuICAgICAgICAgIG9wdF9jYWxsYmFjayAmJiBvcHRfY2FsbGJhY2suY2FsbChlbClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvLyBET00gV2Fsa2VycyAmIGdldHRlcnNcblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIGZpcnN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBib256byh0aGlzLmxlbmd0aCA/IHRoaXNbMF0gOiBbXSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgbGFzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYm9uem8odGhpcy5sZW5ndGggPyB0aGlzW3RoaXMubGVuZ3RoIC0gMV0gOiBbXSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWxhdGVkKCduZXh0U2libGluZycpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIHByZXZpb3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbGF0ZWQoJ3ByZXZpb3VzU2libGluZycpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIHBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbGF0ZWQocGFyZW50Tm9kZSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIHRoZSBkaXJlY3Rpb25hbCBET00gbWV0aG9kXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIHJlbGF0ZWQ6IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGJvbnpvKHRoaXMubWFwKFxuICAgICAgICAgIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgZWwgPSBlbFttZXRob2RdXG4gICAgICAgICAgICB3aGlsZSAoZWwgJiYgZWwubm9kZVR5cGUgIT09IDEpIHtcbiAgICAgICAgICAgICAgZWwgPSBlbFttZXRob2RdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZWwgfHwgMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgICB9XG4gICAgICAgICkpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgZm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggJiYgdGhpc1swXS5mb2N1cygpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYmx1cjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxlbmd0aCAmJiB0aGlzWzBdLmJsdXIoKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuXG4gICAgICAvLyBzdHlsZSBnZXR0ZXIgc2V0dGVyICYgcmVsYXRlZCBtZXRob2RzXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBvXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF92XG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xzdHJpbmd9XG4gICAgICAgKi9cbiAgICAsIGNzczogZnVuY3Rpb24gKG8sIG9wdF92KSB7XG4gICAgICAgIHZhciBwLCBpdGVyID0gb1xuICAgICAgICAvLyBpcyB0aGlzIGEgcmVxdWVzdCBmb3IganVzdCBnZXR0aW5nIGEgc3R5bGU/XG4gICAgICAgIGlmIChvcHRfdiA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gcmVwdXJwb3NlICd2J1xuICAgICAgICAgIG9wdF92ID0gdGhpc1swXVxuICAgICAgICAgIGlmICghb3B0X3YpIHJldHVybiBudWxsXG4gICAgICAgICAgaWYgKG9wdF92ID09PSBkb2MgfHwgb3B0X3YgPT09IHdpbikge1xuICAgICAgICAgICAgcCA9IChvcHRfdiA9PT0gZG9jKSA/IGJvbnpvLmRvYygpIDogYm9uem8udmlld3BvcnQoKVxuICAgICAgICAgICAgcmV0dXJuIG8gPT0gJ3dpZHRoJyA/IHAud2lkdGggOiBvID09ICdoZWlnaHQnID8gcC5oZWlnaHQgOiAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKG8gPSBzdHlsZVByb3BlcnR5KG8pKSA/IGdldFN0eWxlKG9wdF92LCBvKSA6IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgIGl0ZXIgPSB7fVxuICAgICAgICAgIGl0ZXJbb10gPSBvcHRfdlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmZWF0dXJlcy5vcGFzaXR5ICYmICdvcGFjaXR5JyBpbiBpdGVyKSB7XG4gICAgICAgICAgLy8gb2ggdGhpcyAnb2wgZ2FtdXRcbiAgICAgICAgICBpdGVyLmZpbHRlciA9IGl0ZXIub3BhY2l0eSAhPSBudWxsICYmIGl0ZXIub3BhY2l0eSAhPT0gJydcbiAgICAgICAgICAgID8gJ2FscGhhKG9wYWNpdHk9JyArIChpdGVyLm9wYWNpdHkgKiAxMDApICsgJyknXG4gICAgICAgICAgICA6ICcnXG4gICAgICAgICAgLy8gZ2l2ZSBpdCBsYXlvdXRcbiAgICAgICAgICBpdGVyLnpvb20gPSBvLnpvb20gfHwgMVxuICAgICAgICAgIDtkZWxldGUgaXRlci5vcGFjaXR5XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmbihlbCwgcCwgdikge1xuICAgICAgICAgIGZvciAodmFyIGsgaW4gaXRlcikge1xuICAgICAgICAgICAgaWYgKGl0ZXIuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgdiA9IGl0ZXJba107XG4gICAgICAgICAgICAgIC8vIGNoYW5nZSBcIjVcIiB0byBcIjVweFwiIC0gdW5sZXNzIHlvdSdyZSBsaW5lLWhlaWdodCwgd2hpY2ggaXMgYWxsb3dlZFxuICAgICAgICAgICAgICAocCA9IHN0eWxlUHJvcGVydHkoaykpICYmIGRpZ2l0LnRlc3QodikgJiYgIShwIGluIHVuaXRsZXNzKSAmJiAodiArPSBweClcbiAgICAgICAgICAgICAgdHJ5IHsgZWwuc3R5bGVbcF0gPSBzZXR0ZXIoZWwsIHYpIH0gY2F0Y2goZSkge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmbilcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gb3B0X3hcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gb3B0X3lcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfG51bWJlcn1cbiAgICAgICAqL1xuICAgICwgb2Zmc2V0OiBmdW5jdGlvbiAob3B0X3gsIG9wdF95KSB7XG4gICAgICAgIGlmIChvcHRfeCAmJiB0eXBlb2Ygb3B0X3ggPT0gJ29iamVjdCcgJiYgKHR5cGVvZiBvcHRfeC50b3AgPT0gJ251bWJlcicgfHwgdHlwZW9mIG9wdF94LmxlZnQgPT0gJ251bWJlcicpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHh5KGVsLCBvcHRfeC5sZWZ0LCBvcHRfeC50b3ApXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0X3ggPT0gJ251bWJlcicgfHwgdHlwZW9mIG9wdF95ID09ICdudW1iZXInKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHh5KGVsLCBvcHRfeCwgb3B0X3kpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXNbMF0pIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAsIGxlZnQ6IDBcbiAgICAgICAgICAsIGhlaWdodDogMFxuICAgICAgICAgICwgd2lkdGg6IDBcbiAgICAgICAgfVxuICAgICAgICB2YXIgZWwgPSB0aGlzWzBdXG4gICAgICAgICAgLCBkZSA9IGVsLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgICAgICAgLCBiY3IgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICwgc2Nyb2xsID0gZ2V0V2luZG93U2Nyb2xsKClcbiAgICAgICAgICAsIHdpZHRoID0gZWwub2Zmc2V0V2lkdGhcbiAgICAgICAgICAsIGhlaWdodCA9IGVsLm9mZnNldEhlaWdodFxuICAgICAgICAgICwgdG9wID0gYmNyLnRvcCArIHNjcm9sbC55IC0gTWF0aC5tYXgoMCwgZGUgJiYgZGUuY2xpZW50VG9wLCBkb2MuYm9keS5jbGllbnRUb3ApXG4gICAgICAgICAgLCBsZWZ0ID0gYmNyLmxlZnQgKyBzY3JvbGwueCAtIE1hdGgubWF4KDAsIGRlICYmIGRlLmNsaWVudExlZnQsIGRvYy5ib2R5LmNsaWVudExlZnQpXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogdG9wXG4gICAgICAgICAgLCBsZWZ0OiBsZWZ0XG4gICAgICAgICAgLCBoZWlnaHQ6IGhlaWdodFxuICAgICAgICAgICwgd2lkdGg6IHdpZHRoXG4gICAgICAgIH1cbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgICAqL1xuICAgICwgZGltOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5sZW5ndGgpIHJldHVybiB7IGhlaWdodDogMCwgd2lkdGg6IDAgfVxuICAgICAgICB2YXIgZWwgPSB0aGlzWzBdXG4gICAgICAgICAgLCBkZSA9IGVsLm5vZGVUeXBlID09IDkgJiYgZWwuZG9jdW1lbnRFbGVtZW50IC8vIGRvY3VtZW50XG4gICAgICAgICAgLCBvcmlnID0gIWRlICYmICEhZWwuc3R5bGUgJiYgIWVsLm9mZnNldFdpZHRoICYmICFlbC5vZmZzZXRIZWlnaHQgP1xuICAgICAgICAgICAgIC8vIGVsIGlzbid0IHZpc2libGUsIGNhbid0IGJlIG1lYXN1cmVkIHByb3Blcmx5LCBzbyBmaXggdGhhdFxuICAgICAgICAgICAgIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICB2YXIgcyA9IHtcbiAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogZWwuc3R5bGUucG9zaXRpb24gfHwgJydcbiAgICAgICAgICAgICAgICAgLCB2aXNpYmlsaXR5OiBlbC5zdHlsZS52aXNpYmlsaXR5IHx8ICcnXG4gICAgICAgICAgICAgICAgICwgZGlzcGxheTogZWwuc3R5bGUuZGlzcGxheSB8fCAnJ1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgdC5maXJzdCgpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgICAgICAgICAgLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgICAsIGRpc3BsYXk6ICdibG9jaydcbiAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICByZXR1cm4gc1xuICAgICAgICAgICAgfSh0aGlzKSA6IG51bGxcbiAgICAgICAgICAsIHdpZHRoID0gZGVcbiAgICAgICAgICAgICAgPyBNYXRoLm1heChlbC5ib2R5LnNjcm9sbFdpZHRoLCBlbC5ib2R5Lm9mZnNldFdpZHRoLCBkZS5zY3JvbGxXaWR0aCwgZGUub2Zmc2V0V2lkdGgsIGRlLmNsaWVudFdpZHRoKVxuICAgICAgICAgICAgICA6IGVsLm9mZnNldFdpZHRoXG4gICAgICAgICAgLCBoZWlnaHQgPSBkZVxuICAgICAgICAgICAgICA/IE1hdGgubWF4KGVsLmJvZHkuc2Nyb2xsSGVpZ2h0LCBlbC5ib2R5Lm9mZnNldEhlaWdodCwgZGUuc2Nyb2xsSGVpZ2h0LCBkZS5vZmZzZXRIZWlnaHQsIGRlLmNsaWVudEhlaWdodClcbiAgICAgICAgICAgICAgOiBlbC5vZmZzZXRIZWlnaHRcblxuICAgICAgICBvcmlnICYmIHRoaXMuZmlyc3QoKS5jc3Mob3JpZylcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgLCB3aWR0aDogd2lkdGhcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBhdHRyaWJ1dGVzIGFyZSBoYXJkLiBnbyBzaG9wcGluZ1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrIGFuIGF0dHJpYnV0ZSB0byBnZXQgb3Igc2V0XG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF92IHRoZSB2YWx1ZSB0byBzZXRcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfHN0cmluZ31cbiAgICAgICAqL1xuICAgICwgYXR0cjogZnVuY3Rpb24gKGssIG9wdF92KSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXNbMF1cbiAgICAgICAgICAsIG5cblxuICAgICAgICBpZiAodHlwZW9mIGsgIT0gJ3N0cmluZycgJiYgIShrIGluc3RhbmNlb2YgU3RyaW5nKSkge1xuICAgICAgICAgIGZvciAobiBpbiBrKSB7XG4gICAgICAgICAgICBrLmhhc093blByb3BlcnR5KG4pICYmIHRoaXMuYXR0cihuLCBrW25dKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvcHRfdiA9PSAndW5kZWZpbmVkJyA/XG4gICAgICAgICAgIWVsID8gbnVsbCA6IHNwZWNpYWxBdHRyaWJ1dGVzLnRlc3QoaykgP1xuICAgICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzLnRlc3QoaykgJiYgdHlwZW9mIGVsW2tdID09ICdzdHJpbmcnID9cbiAgICAgICAgICAgICAgdHJ1ZSA6IGVsW2tdIDogKGsgPT0gJ2hyZWYnIHx8IGsgPT0nc3JjJykgJiYgZmVhdHVyZXMuaHJlZkV4dGVuZGVkID9cbiAgICAgICAgICAgICAgICBlbFtnZXRBdHRyaWJ1dGVdKGssIDIpIDogZWxbZ2V0QXR0cmlidXRlXShrKSA6XG4gICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgc3BlY2lhbEF0dHJpYnV0ZXMudGVzdChrKSA/IChlbFtrXSA9IHNldHRlcihlbCwgb3B0X3YpKSA6IGVsW3NldEF0dHJpYnV0ZV0oaywgc2V0dGVyKGVsLCBvcHRfdikpXG4gICAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcmVtb3ZlQXR0cjogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXMudGVzdChrKSA/IChlbFtrXSA9IGZhbHNlKSA6IGVsLnJlbW92ZUF0dHJpYnV0ZShrKVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfc1xuICAgICAgICogQHJldHVybiB7Qm9uem98c3RyaW5nfVxuICAgICAgICovXG4gICAgLCB2YWw6IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIHMgPT0gJ3N0cmluZycgfHwgdHlwZW9mIHMgPT0gJ251bWJlcicpID9cbiAgICAgICAgICB0aGlzLmF0dHIoJ3ZhbHVlJywgcykgOlxuICAgICAgICAgIHRoaXMubGVuZ3RoID8gdGhpc1swXS52YWx1ZSA6IG51bGxcbiAgICAgIH1cblxuICAgICAgLy8gdXNlIHdpdGggY2FyZSBhbmQga25vd2xlZGdlLiB0aGlzIGRhdGEoKSBtZXRob2QgdXNlcyBkYXRhIGF0dHJpYnV0ZXMgb24gdGhlIERPTSBub2Rlc1xuICAgICAgLy8gdG8gZG8gdGhpcyBkaWZmZXJlbnRseSBjb3N0cyBhIGxvdCBtb3JlIGNvZGUuIGMnZXN0IGxhIHZpZVxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3Q9fSBvcHRfayB0aGUga2V5IGZvciB3aGljaCB0byBnZXQgb3Igc2V0IGRhdGFcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3ZcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfE9iamVjdH1cbiAgICAgICAqL1xuICAgICwgZGF0YTogZnVuY3Rpb24gKG9wdF9rLCBvcHRfdikge1xuICAgICAgICB2YXIgZWwgPSB0aGlzWzBdLCBvLCBtXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0X3YgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgaWYgKCFlbCkgcmV0dXJuIG51bGxcbiAgICAgICAgICBvID0gZGF0YShlbClcbiAgICAgICAgICBpZiAodHlwZW9mIG9wdF9rID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWFjaChlbC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAobSA9ICgnJyArIGEubmFtZSkubWF0Y2goZGF0dHIpKSAmJiAob1tjYW1lbGl6ZShtWzFdKV0gPSBkYXRhVmFsdWUoYS52YWx1ZSkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIG9cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvW29wdF9rXSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgIG9bb3B0X2tdID0gZGF0YVZhbHVlKHRoaXMuYXR0cignZGF0YS0nICsgZGVjYW1lbGl6ZShvcHRfaykpKVxuICAgICAgICAgICAgcmV0dXJuIG9bb3B0X2tdXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7IGRhdGEoZWwpW29wdF9rXSA9IG9wdF92IH0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRE9NIGRldGFjaG1lbnQgJiByZWxhdGVkXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRlZXBFYWNoKGNsZWFyRGF0YSlcbiAgICAgICAgcmV0dXJuIHRoaXMuZGV0YWNoKClcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBlbXB0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGRlZXBFYWNoKGVsLmNoaWxkTm9kZXMsIGNsZWFyRGF0YSlcblxuICAgICAgICAgIHdoaWxlIChlbC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBkZXRhY2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlbFtwYXJlbnROb2RlXSAmJiBlbFtwYXJlbnROb2RlXS5yZW1vdmVDaGlsZChlbClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gd2hvIHVzZXMgYSBtb3VzZSBhbnl3YXk/IG9oIHJpZ2h0LlxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICAgICAgKi9cbiAgICAsIHNjcm9sbFRvcDogZnVuY3Rpb24gKHkpIHtcbiAgICAgICAgcmV0dXJuIHNjcm9sbC5jYWxsKHRoaXMsIG51bGwsIHksICd5JylcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICAgICAgKi9cbiAgICAsIHNjcm9sbExlZnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHJldHVybiBzY3JvbGwuY2FsbCh0aGlzLCB4LCBudWxsLCAneCcpXG4gICAgICB9XG5cbiAgfVxuXG5cbiAgZnVuY3Rpb24gY2xvbmVOb2RlKGhvc3QsIGVsKSB7XG4gICAgdmFyIGMgPSBlbC5jbG9uZU5vZGUodHJ1ZSlcbiAgICAgICwgY2xvbmVFbGVtc1xuICAgICAgLCBlbEVsZW1zXG4gICAgICAsIGlcblxuICAgIC8vIGNoZWNrIGZvciBleGlzdGVuY2Ugb2YgYW4gZXZlbnQgY2xvbmVyXG4gICAgLy8gcHJlZmVyYWJseSBodHRwczovL2dpdGh1Yi5jb20vZmF0L2JlYW5cbiAgICAvLyBvdGhlcndpc2UgQm9uem8gd29uJ3QgZG8gdGhpcyBmb3IgeW91XG4gICAgaWYgKGhvc3QuJCAmJiB0eXBlb2YgaG9zdC5jbG9uZUV2ZW50cyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBob3N0LiQoYykuY2xvbmVFdmVudHMoZWwpXG5cbiAgICAgIC8vIGNsb25lIGV2ZW50cyBmcm9tIGV2ZXJ5IGNoaWxkIG5vZGVcbiAgICAgIGNsb25lRWxlbXMgPSBob3N0LiQoYykuZmluZCgnKicpXG4gICAgICBlbEVsZW1zID0gaG9zdC4kKGVsKS5maW5kKCcqJylcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGVsRWxlbXMubGVuZ3RoOyBpKyspXG4gICAgICAgIGhvc3QuJChjbG9uZUVsZW1zW2ldKS5jbG9uZUV2ZW50cyhlbEVsZW1zW2ldKVxuICAgIH1cbiAgICByZXR1cm4gY1xuICB9XG5cbiAgZnVuY3Rpb24gaXNCb2R5KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudCA9PT0gd2luIHx8ICgvXig/OmJvZHl8aHRtbCkkL2kpLnRlc3QoZWxlbWVudC50YWdOYW1lKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V2luZG93U2Nyb2xsKCkge1xuICAgIHJldHVybiB7IHg6IHdpbi5wYWdlWE9mZnNldCB8fCBodG1sLnNjcm9sbExlZnQsIHk6IHdpbi5wYWdlWU9mZnNldCB8fCBodG1sLnNjcm9sbFRvcCB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTY3JpcHRGcm9tSHRtbChodG1sKSB7XG4gICAgdmFyIHNjcmlwdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgICwgbWF0Y2hlcyA9IGh0bWwubWF0Y2goc2ltcGxlU2NyaXB0VGFnUmUpXG4gICAgc2NyaXB0RWwuc3JjID0gbWF0Y2hlc1sxXVxuICAgIHJldHVybiBzY3JpcHRFbFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXkuPEVsZW1lbnQ+fEVsZW1lbnR8Tm9kZXxzdHJpbmd9IGVsc1xuICAgKiBAcmV0dXJuIHtCb256b31cbiAgICovXG4gIGZ1bmN0aW9uIGJvbnpvKGVscykge1xuICAgIHJldHVybiBuZXcgQm9uem8oZWxzKVxuICB9XG5cbiAgYm9uem8uc2V0UXVlcnlFbmdpbmUgPSBmdW5jdGlvbiAocSkge1xuICAgIHF1ZXJ5ID0gcTtcbiAgICBkZWxldGUgYm9uem8uc2V0UXVlcnlFbmdpbmVcbiAgfVxuXG4gIGJvbnpvLmF1ZyA9IGZ1bmN0aW9uIChvLCB0YXJnZXQpIHtcbiAgICAvLyBmb3IgdGhvc2Ugc3RhbmRhbG9uZSBib256byB1c2Vycy4gdGhpcyBsb3ZlIGlzIGZvciB5b3UuXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICBvLmhhc093blByb3BlcnR5KGspICYmICgodGFyZ2V0IHx8IEJvbnpvLnByb3RvdHlwZSlba10gPSBvW2tdKVxuICAgIH1cbiAgfVxuXG4gIGJvbnpvLmNyZWF0ZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgLy8gaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhcbiAgICByZXR1cm4gdHlwZW9mIG5vZGUgPT0gJ3N0cmluZycgJiYgbm9kZSAhPT0gJycgP1xuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2ltcGxlU2NyaXB0VGFnUmUudGVzdChub2RlKSkgcmV0dXJuIFtjcmVhdGVTY3JpcHRGcm9tSHRtbChub2RlKV1cbiAgICAgICAgdmFyIHRhZyA9IG5vZGUubWF0Y2goL15cXHMqPChbXlxccz5dKykvKVxuICAgICAgICAgICwgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAsIGVscyA9IFtdXG4gICAgICAgICAgLCBwID0gdGFnID8gdGFnTWFwW3RhZ1sxXS50b0xvd2VyQ2FzZSgpXSA6IG51bGxcbiAgICAgICAgICAsIGRlcCA9IHAgPyBwWzJdICsgMSA6IDFcbiAgICAgICAgICAsIG5zID0gcCAmJiBwWzNdXG4gICAgICAgICAgLCBwbiA9IHBhcmVudE5vZGVcbiAgICAgICAgICAsIHRiID0gZmVhdHVyZXMuYXV0b1Rib2R5ICYmIHAgJiYgcFswXSA9PSAnPHRhYmxlPicgJiYgISgvPHRib2R5L2kpLnRlc3Qobm9kZSlcblxuICAgICAgICBlbC5pbm5lckhUTUwgPSBwID8gKHBbMF0gKyBub2RlICsgcFsxXSkgOiBub2RlXG4gICAgICAgIHdoaWxlIChkZXAtLSkgZWwgPSBlbC5maXJzdENoaWxkXG4gICAgICAgIC8vIGZvciBJRSBOb1Njb3BlLCB3ZSBtYXkgaW5zZXJ0IGNydWZ0IGF0IHRoZSBiZWdpbmluZyBqdXN0IHRvIGdldCBpdCB0byB3b3JrXG4gICAgICAgIGlmIChucyAmJiBlbCAmJiBlbC5ub2RlVHlwZSAhPT0gMSkgZWwgPSBlbC5uZXh0U2libGluZ1xuICAgICAgICBkbyB7XG4gICAgICAgICAgLy8gdGJvZHkgc3BlY2lhbCBjYXNlIGZvciBJRTw4LCBjcmVhdGVzIHRib2R5IG9uIGFueSBlbXB0eSB0YWJsZVxuICAgICAgICAgIC8vIHdlIGRvbid0IHdhbnQgaXQgaWYgd2UncmUganVzdCBhZnRlciBhIDx0aGVhZD4sIDxjYXB0aW9uPiwgZXRjLlxuICAgICAgICAgIGlmICgoIXRhZyB8fCBlbC5ub2RlVHlwZSA9PSAxKSAmJiAoIXRiIHx8IChlbC50YWdOYW1lICYmIGVsLnRhZ05hbWUgIT0gJ1RCT0RZJykpKSB7XG4gICAgICAgICAgICBlbHMucHVzaChlbClcbiAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKGVsID0gZWwubmV4dFNpYmxpbmcpXG4gICAgICAgIC8vIElFIDwgOSBnaXZlcyB1cyBhIHBhcmVudE5vZGUgd2hpY2ggbWVzc2VzIHVwIGluc2VydCgpIGNoZWNrIGZvciBjbG9uaW5nXG4gICAgICAgIC8vIGBkZXBgID4gMSBjYW4gYWxzbyBjYXVzZSBwcm9ibGVtcyB3aXRoIHRoZSBpbnNlcnQoKSBjaGVjayAobXVzdCBkbyB0aGlzIGxhc3QpXG4gICAgICAgIGVhY2goZWxzLCBmdW5jdGlvbihlbCkgeyBlbFtwbl0gJiYgZWxbcG5dLnJlbW92ZUNoaWxkKGVsKSB9KVxuICAgICAgICByZXR1cm4gZWxzXG4gICAgICB9KCkgOiBpc05vZGUobm9kZSkgPyBbbm9kZS5jbG9uZU5vZGUodHJ1ZSldIDogW11cbiAgfVxuXG4gIGJvbnpvLmRvYyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdnAgPSBib256by52aWV3cG9ydCgpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IE1hdGgubWF4KGRvYy5ib2R5LnNjcm9sbFdpZHRoLCBodG1sLnNjcm9sbFdpZHRoLCB2cC53aWR0aClcbiAgICAgICwgaGVpZ2h0OiBNYXRoLm1heChkb2MuYm9keS5zY3JvbGxIZWlnaHQsIGh0bWwuc2Nyb2xsSGVpZ2h0LCB2cC5oZWlnaHQpXG4gICAgfVxuICB9XG5cbiAgYm9uem8uZmlyc3RDaGlsZCA9IGZ1bmN0aW9uIChlbCkge1xuICAgIGZvciAodmFyIGMgPSBlbC5jaGlsZE5vZGVzLCBpID0gMCwgaiA9IChjICYmIGMubGVuZ3RoKSB8fCAwLCBlOyBpIDwgajsgaSsrKSB7XG4gICAgICBpZiAoY1tpXS5ub2RlVHlwZSA9PT0gMSkgZSA9IGNbaiA9IGldXG4gICAgfVxuICAgIHJldHVybiBlXG4gIH1cblxuICBib256by52aWV3cG9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogaWUgPyBodG1sLmNsaWVudFdpZHRoIDogd2luLmlubmVyV2lkdGhcbiAgICAgICwgaGVpZ2h0OiBpZSA/IGh0bWwuY2xpZW50SGVpZ2h0IDogd2luLmlubmVySGVpZ2h0XG4gICAgfVxuICB9XG5cbiAgYm9uem8uaXNBbmNlc3RvciA9ICdjb21wYXJlRG9jdW1lbnRQb3NpdGlvbicgaW4gaHRtbCA/XG4gICAgZnVuY3Rpb24gKGNvbnRhaW5lciwgZWxlbWVudCkge1xuICAgICAgcmV0dXJuIChjb250YWluZXIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZWxlbWVudCkgJiAxNikgPT0gMTZcbiAgICB9IDogJ2NvbnRhaW5zJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoY29udGFpbmVyLCBlbGVtZW50KSB7XG4gICAgICByZXR1cm4gY29udGFpbmVyICE9PSBlbGVtZW50ICYmIGNvbnRhaW5lci5jb250YWlucyhlbGVtZW50KTtcbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoY29udGFpbmVyLCBlbGVtZW50KSB7XG4gICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnRbcGFyZW50Tm9kZV0pIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgPT09IGNvbnRhaW5lcikge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICByZXR1cm4gYm9uem9cbn0pOyAvLyB0aGUgb25seSBsaW5lIHdlIGNhcmUgYWJvdXQgdXNpbmcgYSBzZW1pLWNvbG9uLiBwbGFjZWQgaGVyZSBmb3IgY29uY2F0ZW5hdGlvbiB0b29sc1xuIiwiXG4vLyBub3QgaW1wbGVtZW50ZWRcbi8vIFRoZSByZWFzb24gZm9yIGhhdmluZyBhbiBlbXB0eSBmaWxlIGFuZCBub3QgdGhyb3dpbmcgaXMgdG8gYWxsb3dcbi8vIHVudHJhZGl0aW9uYWwgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtb2R1bGUuXG4iLCIvKiFcbiAgKiBAcHJlc2VydmUgUXdlcnkgLSBBIEJsYXppbmcgRmFzdCBxdWVyeSBzZWxlY3RvciBlbmdpbmVcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL3F3ZXJ5XG4gICogY29weXJpZ2h0IER1c3RpbiBEaWF6IDIwMTJcbiAgKiBNSVQgTGljZW5zZVxuICAqL1xuXG4oZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KSgncXdlcnknLCB0aGlzLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudFxuICAgICwgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnRcbiAgICAsIGJ5Q2xhc3MgPSAnZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSdcbiAgICAsIGJ5VGFnID0gJ2dldEVsZW1lbnRzQnlUYWdOYW1lJ1xuICAgICwgcVNBID0gJ3F1ZXJ5U2VsZWN0b3JBbGwnXG4gICAgLCB1c2VOYXRpdmVRU0EgPSAndXNlTmF0aXZlUVNBJ1xuICAgICwgdGFnTmFtZSA9ICd0YWdOYW1lJ1xuICAgICwgbm9kZVR5cGUgPSAnbm9kZVR5cGUnXG4gICAgLCBzZWxlY3QgLy8gbWFpbiBzZWxlY3QoKSBtZXRob2QsIGFzc2lnbiBsYXRlclxuXG4gICAgLCBpZCA9IC8jKFtcXHdcXC1dKykvXG4gICAgLCBjbGFzID0gL1xcLltcXHdcXC1dKy9nXG4gICAgLCBpZE9ubHkgPSAvXiMoW1xcd1xcLV0rKSQvXG4gICAgLCBjbGFzc09ubHkgPSAvXlxcLihbXFx3XFwtXSspJC9cbiAgICAsIHRhZ09ubHkgPSAvXihbXFx3XFwtXSspJC9cbiAgICAsIHRhZ0FuZE9yQ2xhc3MgPSAvXihbXFx3XSspP1xcLihbXFx3XFwtXSspJC9cbiAgICAsIHNwbGl0dGFibGUgPSAvKF58LClcXHMqWz5+K10vXG4gICAgLCBub3JtYWxpenIgPSAvXlxccyt8XFxzKihbLFxcc1xcK1xcfj5dfCQpXFxzKi9nXG4gICAgLCBzcGxpdHRlcnMgPSAvW1xcc1xcPlxcK1xcfl0vXG4gICAgLCBzcGxpdHRlcnNNb3JlID0gLyg/IVtcXHNcXHdcXC1cXC9cXD9cXCZcXD1cXDpcXC5cXChcXClcXCEsQCMlPD5cXHtcXH1cXCRcXCpcXF4nXCJdKlxcXXxbXFxzXFx3XFwrXFwtXSpcXCkpL1xuICAgICwgc3BlY2lhbENoYXJzID0gLyhbLiorP1xcXj0hOiR7fSgpfFxcW1xcXVxcL1xcXFxdKS9nXG4gICAgLCBzaW1wbGUgPSAvXihcXCp8W2EtejAtOV0rKT8oPzooW1xcLlxcI10rW1xcd1xcLVxcLiNdKyk/KS9cbiAgICAsIGF0dHIgPSAvXFxbKFtcXHdcXC1dKykoPzooW1xcfFxcXlxcJFxcKlxcfl0/XFw9KVsnXCJdPyhbIFxcd1xcLVxcL1xcP1xcJlxcPVxcOlxcLlxcKFxcKVxcISxAIyU8Plxce1xcfVxcJFxcKlxcXl0rKVtcIiddPyk/XFxdL1xuICAgICwgcHNldWRvID0gLzooW1xcd1xcLV0rKShcXChbJ1wiXT8oW14oKV0rKVsnXCJdP1xcKSk/L1xuICAgICwgZWFzeSA9IG5ldyBSZWdFeHAoaWRPbmx5LnNvdXJjZSArICd8JyArIHRhZ09ubHkuc291cmNlICsgJ3wnICsgY2xhc3NPbmx5LnNvdXJjZSlcbiAgICAsIGRpdmlkZXJzID0gbmV3IFJlZ0V4cCgnKCcgKyBzcGxpdHRlcnMuc291cmNlICsgJyknICsgc3BsaXR0ZXJzTW9yZS5zb3VyY2UsICdnJylcbiAgICAsIHRva2VuaXpyID0gbmV3IFJlZ0V4cChzcGxpdHRlcnMuc291cmNlICsgc3BsaXR0ZXJzTW9yZS5zb3VyY2UpXG4gICAgLCBjaHVua2VyID0gbmV3IFJlZ0V4cChzaW1wbGUuc291cmNlICsgJygnICsgYXR0ci5zb3VyY2UgKyAnKT8nICsgJygnICsgcHNldWRvLnNvdXJjZSArICcpPycpXG5cbiAgdmFyIHdhbGtlciA9IHtcbiAgICAgICcgJzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZSAhPT0gaHRtbCAmJiBub2RlLnBhcmVudE5vZGVcbiAgICAgIH1cbiAgICAsICc+JzogZnVuY3Rpb24gKG5vZGUsIGNvbnRlc3RhbnQpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlID09IGNvbnRlc3RhbnQucGFyZW50Tm9kZSAmJiBub2RlLnBhcmVudE5vZGVcbiAgICAgIH1cbiAgICAsICd+JzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5wcmV2aW91c1NpYmxpbmdcbiAgICAgIH1cbiAgICAsICcrJzogZnVuY3Rpb24gKG5vZGUsIGNvbnRlc3RhbnQsIHAxLCBwMikge1xuICAgICAgICBpZiAoIW5vZGUpIHJldHVybiBmYWxzZVxuICAgICAgICByZXR1cm4gKHAxID0gcHJldmlvdXMobm9kZSkpICYmIChwMiA9IHByZXZpb3VzKGNvbnRlc3RhbnQpKSAmJiBwMSA9PSBwMiAmJiBwMVxuICAgICAgfVxuICAgIH1cblxuICBmdW5jdGlvbiBjYWNoZSgpIHtcbiAgICB0aGlzLmMgPSB7fVxuICB9XG4gIGNhY2hlLnByb3RvdHlwZSA9IHtcbiAgICBnOiBmdW5jdGlvbiAoaykge1xuICAgICAgcmV0dXJuIHRoaXMuY1trXSB8fCB1bmRlZmluZWRcbiAgICB9XG4gICwgczogZnVuY3Rpb24gKGssIHYsIHIpIHtcbiAgICAgIHYgPSByID8gbmV3IFJlZ0V4cCh2KSA6IHZcbiAgICAgIHJldHVybiAodGhpcy5jW2tdID0gdilcbiAgICB9XG4gIH1cblxuICB2YXIgY2xhc3NDYWNoZSA9IG5ldyBjYWNoZSgpXG4gICAgLCBjbGVhbkNhY2hlID0gbmV3IGNhY2hlKClcbiAgICAsIGF0dHJDYWNoZSA9IG5ldyBjYWNoZSgpXG4gICAgLCB0b2tlbkNhY2hlID0gbmV3IGNhY2hlKClcblxuICBmdW5jdGlvbiBjbGFzc1JlZ2V4KGMpIHtcbiAgICByZXR1cm4gY2xhc3NDYWNoZS5nKGMpIHx8IGNsYXNzQ2FjaGUucyhjLCAnKF58XFxcXHMrKScgKyBjICsgJyhcXFxccyt8JCknLCAxKVxuICB9XG5cbiAgLy8gbm90IHF1aXRlIGFzIGZhc3QgYXMgaW5saW5lIGxvb3BzIGluIG9sZGVyIGJyb3dzZXJzIHNvIGRvbid0IHVzZSBsaWJlcmFsbHlcbiAgZnVuY3Rpb24gZWFjaChhLCBmbikge1xuICAgIHZhciBpID0gMCwgbCA9IGEubGVuZ3RoXG4gICAgZm9yICg7IGkgPCBsOyBpKyspIGZuKGFbaV0pXG4gIH1cblxuICBmdW5jdGlvbiBmbGF0dGVuKGFyKSB7XG4gICAgZm9yICh2YXIgciA9IFtdLCBpID0gMCwgbCA9IGFyLmxlbmd0aDsgaSA8IGw7ICsraSkgYXJyYXlMaWtlKGFyW2ldKSA/IChyID0gci5jb25jYXQoYXJbaV0pKSA6IChyW3IubGVuZ3RoXSA9IGFyW2ldKVxuICAgIHJldHVybiByXG4gIH1cblxuICBmdW5jdGlvbiBhcnJheWlmeShhcikge1xuICAgIHZhciBpID0gMCwgbCA9IGFyLmxlbmd0aCwgciA9IFtdXG4gICAgZm9yICg7IGkgPCBsOyBpKyspIHJbaV0gPSBhcltpXVxuICAgIHJldHVybiByXG4gIH1cblxuICBmdW5jdGlvbiBwcmV2aW91cyhuKSB7XG4gICAgd2hpbGUgKG4gPSBuLnByZXZpb3VzU2libGluZykgaWYgKG5bbm9kZVR5cGVdID09IDEpIGJyZWFrO1xuICAgIHJldHVybiBuXG4gIH1cblxuICBmdW5jdGlvbiBxKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lm1hdGNoKGNodW5rZXIpXG4gIH1cblxuICAvLyBjYWxsZWQgdXNpbmcgYHRoaXNgIGFzIGVsZW1lbnQgYW5kIGFyZ3VtZW50cyBmcm9tIHJlZ2V4IGdyb3VwIHJlc3VsdHMuXG4gIC8vIGdpdmVuID0+IGRpdi5oZWxsb1t0aXRsZT1cIndvcmxkXCJdOmZvbygnYmFyJylcbiAgLy8gZGl2LmhlbGxvW3RpdGxlPVwid29ybGRcIl06Zm9vKCdiYXInKSwgZGl2LCAuaGVsbG8sIFt0aXRsZT1cIndvcmxkXCJdLCB0aXRsZSwgPSwgd29ybGQsIDpmb28oJ2JhcicpLCBmb28sICgnYmFyJyksIGJhcl1cbiAgZnVuY3Rpb24gaW50ZXJwcmV0KHdob2xlLCB0YWcsIGlkc0FuZENsYXNzZXMsIHdob2xlQXR0cmlidXRlLCBhdHRyaWJ1dGUsIHF1YWxpZmllciwgdmFsdWUsIHdob2xlUHNldWRvLCBwc2V1ZG8sIHdob2xlUHNldWRvVmFsLCBwc2V1ZG9WYWwpIHtcbiAgICB2YXIgaSwgbSwgaywgbywgY2xhc3Nlc1xuICAgIGlmICh0aGlzW25vZGVUeXBlXSAhPT0gMSkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKHRhZyAmJiB0YWcgIT09ICcqJyAmJiB0aGlzW3RhZ05hbWVdICYmIHRoaXNbdGFnTmFtZV0udG9Mb3dlckNhc2UoKSAhPT0gdGFnKSByZXR1cm4gZmFsc2VcbiAgICBpZiAoaWRzQW5kQ2xhc3NlcyAmJiAobSA9IGlkc0FuZENsYXNzZXMubWF0Y2goaWQpKSAmJiBtWzFdICE9PSB0aGlzLmlkKSByZXR1cm4gZmFsc2VcbiAgICBpZiAoaWRzQW5kQ2xhc3NlcyAmJiAoY2xhc3NlcyA9IGlkc0FuZENsYXNzZXMubWF0Y2goY2xhcykpKSB7XG4gICAgICBmb3IgKGkgPSBjbGFzc2VzLmxlbmd0aDsgaS0tOykgaWYgKCFjbGFzc1JlZ2V4KGNsYXNzZXNbaV0uc2xpY2UoMSkpLnRlc3QodGhpcy5jbGFzc05hbWUpKSByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgaWYgKHBzZXVkbyAmJiBxd2VyeS5wc2V1ZG9zW3BzZXVkb10gJiYgIXF3ZXJ5LnBzZXVkb3NbcHNldWRvXSh0aGlzLCBwc2V1ZG9WYWwpKSByZXR1cm4gZmFsc2VcbiAgICBpZiAod2hvbGVBdHRyaWJ1dGUgJiYgIXZhbHVlKSB7IC8vIHNlbGVjdCBpcyBqdXN0IGZvciBleGlzdGFuY2Ugb2YgYXR0cmliXG4gICAgICBvID0gdGhpcy5hdHRyaWJ1dGVzXG4gICAgICBmb3IgKGsgaW4gbykge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGspICYmIChvW2tdLm5hbWUgfHwgaykgPT0gYXR0cmlidXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAod2hvbGVBdHRyaWJ1dGUgJiYgIWNoZWNrQXR0cihxdWFsaWZpZXIsIGdldEF0dHIodGhpcywgYXR0cmlidXRlKSB8fCAnJywgdmFsdWUpKSB7XG4gICAgICAvLyBzZWxlY3QgaXMgZm9yIGF0dHJpYiBlcXVhbGl0eVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhbihzKSB7XG4gICAgcmV0dXJuIGNsZWFuQ2FjaGUuZyhzKSB8fCBjbGVhbkNhY2hlLnMocywgcy5yZXBsYWNlKHNwZWNpYWxDaGFycywgJ1xcXFwkMScpKVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tBdHRyKHF1YWxpZnksIGFjdHVhbCwgdmFsKSB7XG4gICAgc3dpdGNoIChxdWFsaWZ5KSB7XG4gICAgY2FzZSAnPSc6XG4gICAgICByZXR1cm4gYWN0dWFsID09IHZhbFxuICAgIGNhc2UgJ149JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcoJ149JyArIHZhbCkgfHwgYXR0ckNhY2hlLnMoJ149JyArIHZhbCwgJ14nICsgY2xlYW4odmFsKSwgMSkpXG4gICAgY2FzZSAnJD0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZygnJD0nICsgdmFsKSB8fCBhdHRyQ2FjaGUucygnJD0nICsgdmFsLCBjbGVhbih2YWwpICsgJyQnLCAxKSlcbiAgICBjYXNlICcqPSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKHZhbCkgfHwgYXR0ckNhY2hlLnModmFsLCBjbGVhbih2YWwpLCAxKSlcbiAgICBjYXNlICd+PSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKCd+PScgKyB2YWwpIHx8IGF0dHJDYWNoZS5zKCd+PScgKyB2YWwsICcoPzpefFxcXFxzKyknICsgY2xlYW4odmFsKSArICcoPzpcXFxccyt8JCknLCAxKSlcbiAgICBjYXNlICd8PSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKCd8PScgKyB2YWwpIHx8IGF0dHJDYWNoZS5zKCd8PScgKyB2YWwsICdeJyArIGNsZWFuKHZhbCkgKyAnKC18JCknLCAxKSlcbiAgICB9XG4gICAgcmV0dXJuIDBcbiAgfVxuXG4gIC8vIGdpdmVuIGEgc2VsZWN0b3IsIGZpcnN0IGNoZWNrIGZvciBzaW1wbGUgY2FzZXMgdGhlbiBjb2xsZWN0IGFsbCBiYXNlIGNhbmRpZGF0ZSBtYXRjaGVzIGFuZCBmaWx0ZXJcbiAgZnVuY3Rpb24gX3F3ZXJ5KHNlbGVjdG9yLCBfcm9vdCkge1xuICAgIHZhciByID0gW10sIHJldCA9IFtdLCBpLCBsLCBtLCB0b2tlbiwgdGFnLCBlbHMsIGludHIsIGl0ZW0sIHJvb3QgPSBfcm9vdFxuICAgICAgLCB0b2tlbnMgPSB0b2tlbkNhY2hlLmcoc2VsZWN0b3IpIHx8IHRva2VuQ2FjaGUucyhzZWxlY3Rvciwgc2VsZWN0b3Iuc3BsaXQodG9rZW5penIpKVxuICAgICAgLCBkaXZpZGVkVG9rZW5zID0gc2VsZWN0b3IubWF0Y2goZGl2aWRlcnMpXG5cbiAgICBpZiAoIXRva2Vucy5sZW5ndGgpIHJldHVybiByXG5cbiAgICB0b2tlbiA9ICh0b2tlbnMgPSB0b2tlbnMuc2xpY2UoMCkpLnBvcCgpIC8vIGNvcHkgY2FjaGVkIHRva2VucywgdGFrZSB0aGUgbGFzdCBvbmVcbiAgICBpZiAodG9rZW5zLmxlbmd0aCAmJiAobSA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0ubWF0Y2goaWRPbmx5KSkpIHJvb3QgPSBieUlkKF9yb290LCBtWzFdKVxuICAgIGlmICghcm9vdCkgcmV0dXJuIHJcblxuICAgIGludHIgPSBxKHRva2VuKVxuICAgIC8vIGNvbGxlY3QgYmFzZSBjYW5kaWRhdGVzIHRvIGZpbHRlclxuICAgIGVscyA9IHJvb3QgIT09IF9yb290ICYmIHJvb3Rbbm9kZVR5cGVdICE9PSA5ICYmIGRpdmlkZWRUb2tlbnMgJiYgL15bK35dJC8udGVzdChkaXZpZGVkVG9rZW5zW2RpdmlkZWRUb2tlbnMubGVuZ3RoIC0gMV0pID9cbiAgICAgIGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHdoaWxlIChyb290ID0gcm9vdC5uZXh0U2libGluZykge1xuICAgICAgICAgIHJvb3Rbbm9kZVR5cGVdID09IDEgJiYgKGludHJbMV0gPyBpbnRyWzFdID09IHJvb3RbdGFnTmFtZV0udG9Mb3dlckNhc2UoKSA6IDEpICYmIChyW3IubGVuZ3RoXSA9IHJvb3QpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJcbiAgICAgIH0oW10pIDpcbiAgICAgIHJvb3RbYnlUYWddKGludHJbMV0gfHwgJyonKVxuICAgIC8vIGZpbHRlciBlbGVtZW50cyBhY2NvcmRpbmcgdG8gdGhlIHJpZ2h0LW1vc3QgcGFydCBvZiB0aGUgc2VsZWN0b3JcbiAgICBmb3IgKGkgPSAwLCBsID0gZWxzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGl0ZW0gPSBpbnRlcnByZXQuYXBwbHkoZWxzW2ldLCBpbnRyKSkgcltyLmxlbmd0aF0gPSBpdGVtXG4gICAgfVxuICAgIGlmICghdG9rZW5zLmxlbmd0aCkgcmV0dXJuIHJcblxuICAgIC8vIGZpbHRlciBmdXJ0aGVyIGFjY29yZGluZyB0byB0aGUgcmVzdCBvZiB0aGUgc2VsZWN0b3IgKHRoZSBsZWZ0IHNpZGUpXG4gICAgZWFjaChyLCBmdW5jdGlvbiAoZSkgeyBpZiAoYW5jZXN0b3JNYXRjaChlLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnMpKSByZXRbcmV0Lmxlbmd0aF0gPSBlIH0pXG4gICAgcmV0dXJuIHJldFxuICB9XG5cbiAgLy8gY29tcGFyZSBlbGVtZW50IHRvIGEgc2VsZWN0b3JcbiAgZnVuY3Rpb24gaXMoZWwsIHNlbGVjdG9yLCByb290KSB7XG4gICAgaWYgKGlzTm9kZShzZWxlY3RvcikpIHJldHVybiBlbCA9PSBzZWxlY3RvclxuICAgIGlmIChhcnJheUxpa2Uoc2VsZWN0b3IpKSByZXR1cm4gISF+ZmxhdHRlbihzZWxlY3RvcikuaW5kZXhPZihlbCkgLy8gaWYgc2VsZWN0b3IgaXMgYW4gYXJyYXksIGlzIGVsIGEgbWVtYmVyP1xuXG4gICAgdmFyIHNlbGVjdG9ycyA9IHNlbGVjdG9yLnNwbGl0KCcsJyksIHRva2VucywgZGl2aWRlZFRva2Vuc1xuICAgIHdoaWxlIChzZWxlY3RvciA9IHNlbGVjdG9ycy5wb3AoKSkge1xuICAgICAgdG9rZW5zID0gdG9rZW5DYWNoZS5nKHNlbGVjdG9yKSB8fCB0b2tlbkNhY2hlLnMoc2VsZWN0b3IsIHNlbGVjdG9yLnNwbGl0KHRva2VuaXpyKSlcbiAgICAgIGRpdmlkZWRUb2tlbnMgPSBzZWxlY3Rvci5tYXRjaChkaXZpZGVycylcbiAgICAgIHRva2VucyA9IHRva2Vucy5zbGljZSgwKSAvLyBjb3B5IGFycmF5XG4gICAgICBpZiAoaW50ZXJwcmV0LmFwcGx5KGVsLCBxKHRva2Vucy5wb3AoKSkpICYmICghdG9rZW5zLmxlbmd0aCB8fCBhbmNlc3Rvck1hdGNoKGVsLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnMsIHJvb3QpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIGdpdmVuIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSByaWdodC1tb3N0IHBhcnQgb2YgYSBzZWxlY3RvciwgZmlsdGVyIG91dCBhbnkgdGhhdCBkb24ndCBtYXRjaCB0aGUgcmVzdFxuICBmdW5jdGlvbiBhbmNlc3Rvck1hdGNoKGVsLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnMsIHJvb3QpIHtcbiAgICB2YXIgY2FuZFxuICAgIC8vIHJlY3Vyc2l2ZWx5IHdvcmsgYmFja3dhcmRzIHRocm91Z2ggdGhlIHRva2VucyBhbmQgdXAgdGhlIGRvbSwgY292ZXJpbmcgYWxsIG9wdGlvbnNcbiAgICBmdW5jdGlvbiBjcmF3bChlLCBpLCBwKSB7XG4gICAgICB3aGlsZSAocCA9IHdhbGtlcltkaXZpZGVkVG9rZW5zW2ldXShwLCBlKSkge1xuICAgICAgICBpZiAoaXNOb2RlKHApICYmIChpbnRlcnByZXQuYXBwbHkocCwgcSh0b2tlbnNbaV0pKSkpIHtcbiAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgaWYgKGNhbmQgPSBjcmF3bChwLCBpIC0gMSwgcCkpIHJldHVybiBjYW5kXG4gICAgICAgICAgfSBlbHNlIHJldHVybiBwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChjYW5kID0gY3Jhd2woZWwsIHRva2Vucy5sZW5ndGggLSAxLCBlbCkpICYmICghcm9vdCB8fCBpc0FuY2VzdG9yKGNhbmQsIHJvb3QpKVxuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKGVsLCB0KSB7XG4gICAgcmV0dXJuIGVsICYmIHR5cGVvZiBlbCA9PT0gJ29iamVjdCcgJiYgKHQgPSBlbFtub2RlVHlwZV0pICYmICh0ID09IDEgfHwgdCA9PSA5KVxuICB9XG5cbiAgZnVuY3Rpb24gdW5pcShhcikge1xuICAgIHZhciBhID0gW10sIGksIGo7XG4gICAgbzpcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXIubGVuZ3RoOyArK2kpIHtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBhLmxlbmd0aDsgKytqKSBpZiAoYVtqXSA9PSBhcltpXSkgY29udGludWUgb1xuICAgICAgYVthLmxlbmd0aF0gPSBhcltpXVxuICAgIH1cbiAgICByZXR1cm4gYVxuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlMaWtlKG8pIHtcbiAgICByZXR1cm4gKHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBpc0Zpbml0ZShvLmxlbmd0aCkpXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVSb290KHJvb3QpIHtcbiAgICBpZiAoIXJvb3QpIHJldHVybiBkb2NcbiAgICBpZiAodHlwZW9mIHJvb3QgPT0gJ3N0cmluZycpIHJldHVybiBxd2VyeShyb290KVswXVxuICAgIGlmICghcm9vdFtub2RlVHlwZV0gJiYgYXJyYXlMaWtlKHJvb3QpKSByZXR1cm4gcm9vdFswXVxuICAgIHJldHVybiByb290XG4gIH1cblxuICBmdW5jdGlvbiBieUlkKHJvb3QsIGlkLCBlbCkge1xuICAgIC8vIGlmIGRvYywgcXVlcnkgb24gaXQsIGVsc2UgcXVlcnkgdGhlIHBhcmVudCBkb2Mgb3IgaWYgYSBkZXRhY2hlZCBmcmFnbWVudCByZXdyaXRlIHRoZSBxdWVyeSBhbmQgcnVuIG9uIHRoZSBmcmFnbWVudFxuICAgIHJldHVybiByb290W25vZGVUeXBlXSA9PT0gOSA/IHJvb3QuZ2V0RWxlbWVudEJ5SWQoaWQpIDpcbiAgICAgIHJvb3Qub3duZXJEb2N1bWVudCAmJlxuICAgICAgICAoKChlbCA9IHJvb3Qub3duZXJEb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpICYmIGlzQW5jZXN0b3IoZWwsIHJvb3QpICYmIGVsKSB8fFxuICAgICAgICAgICghaXNBbmNlc3Rvcihyb290LCByb290Lm93bmVyRG9jdW1lbnQpICYmIHNlbGVjdCgnW2lkPVwiJyArIGlkICsgJ1wiXScsIHJvb3QpWzBdKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHF3ZXJ5KHNlbGVjdG9yLCBfcm9vdCkge1xuICAgIHZhciBtLCBlbCwgcm9vdCA9IG5vcm1hbGl6ZVJvb3QoX3Jvb3QpXG5cbiAgICAvLyBlYXN5LCBmYXN0IGNhc2VzIHRoYXQgd2UgY2FuIGRpc3BhdGNoIHdpdGggc2ltcGxlIERPTSBjYWxsc1xuICAgIGlmICghcm9vdCB8fCAhc2VsZWN0b3IpIHJldHVybiBbXVxuICAgIGlmIChzZWxlY3RvciA9PT0gd2luZG93IHx8IGlzTm9kZShzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiAhX3Jvb3QgfHwgKHNlbGVjdG9yICE9PSB3aW5kb3cgJiYgaXNOb2RlKHJvb3QpICYmIGlzQW5jZXN0b3Ioc2VsZWN0b3IsIHJvb3QpKSA/IFtzZWxlY3Rvcl0gOiBbXVxuICAgIH1cbiAgICBpZiAoc2VsZWN0b3IgJiYgYXJyYXlMaWtlKHNlbGVjdG9yKSkgcmV0dXJuIGZsYXR0ZW4oc2VsZWN0b3IpXG4gICAgaWYgKG0gPSBzZWxlY3Rvci5tYXRjaChlYXN5KSkge1xuICAgICAgaWYgKG1bMV0pIHJldHVybiAoZWwgPSBieUlkKHJvb3QsIG1bMV0pKSA/IFtlbF0gOiBbXVxuICAgICAgaWYgKG1bMl0pIHJldHVybiBhcnJheWlmeShyb290W2J5VGFnXShtWzJdKSlcbiAgICAgIGlmIChoYXNCeUNsYXNzICYmIG1bM10pIHJldHVybiBhcnJheWlmeShyb290W2J5Q2xhc3NdKG1bM10pKVxuICAgIH1cblxuICAgIHJldHVybiBzZWxlY3Qoc2VsZWN0b3IsIHJvb3QpXG4gIH1cblxuICAvLyB3aGVyZSB0aGUgcm9vdCBpcyBub3QgZG9jdW1lbnQgYW5kIGEgcmVsYXRpb25zaGlwIHNlbGVjdG9yIGlzIGZpcnN0IHdlIGhhdmUgdG9cbiAgLy8gZG8gc29tZSBhd2t3YXJkIGFkanVzdG1lbnRzIHRvIGdldCBpdCB0byB3b3JrLCBldmVuIHdpdGggcVNBXG4gIGZ1bmN0aW9uIGNvbGxlY3RTZWxlY3Rvcihyb290LCBjb2xsZWN0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHMpIHtcbiAgICAgIHZhciBvaWQsIG5pZFxuICAgICAgaWYgKHNwbGl0dGFibGUudGVzdChzKSkge1xuICAgICAgICBpZiAocm9vdFtub2RlVHlwZV0gIT09IDkpIHtcbiAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGVsIGhhcyBhbiBpZCwgcmV3cml0ZSB0aGUgcXVlcnksIHNldCByb290IHRvIGRvYyBhbmQgcnVuIGl0XG4gICAgICAgICAgaWYgKCEobmlkID0gb2lkID0gcm9vdC5nZXRBdHRyaWJ1dGUoJ2lkJykpKSByb290LnNldEF0dHJpYnV0ZSgnaWQnLCBuaWQgPSAnX19xd2VyeW1ldXBzY290dHknKVxuICAgICAgICAgIHMgPSAnW2lkPVwiJyArIG5pZCArICdcIl0nICsgcyAvLyBhdm9pZCBieUlkIGFuZCBhbGxvdyB1cyB0byBtYXRjaCBjb250ZXh0IGVsZW1lbnRcbiAgICAgICAgICBjb2xsZWN0b3Iocm9vdC5wYXJlbnROb2RlIHx8IHJvb3QsIHMsIHRydWUpXG4gICAgICAgICAgb2lkIHx8IHJvb3QucmVtb3ZlQXR0cmlidXRlKCdpZCcpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcy5sZW5ndGggJiYgY29sbGVjdG9yKHJvb3QsIHMsIGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpc0FuY2VzdG9yID0gJ2NvbXBhcmVEb2N1bWVudFBvc2l0aW9uJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gKGNvbnRhaW5lci5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlbGVtZW50KSAmIDE2KSA9PSAxNlxuICAgIH0gOiAnY29udGFpbnMnIGluIGh0bWwgP1xuICAgIGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lcltub2RlVHlwZV0gPT09IDkgfHwgY29udGFpbmVyID09IHdpbmRvdyA/IGh0bWwgOiBjb250YWluZXJcbiAgICAgIHJldHVybiBjb250YWluZXIgIT09IGVsZW1lbnQgJiYgY29udGFpbmVyLmNvbnRhaW5zKGVsZW1lbnQpXG4gICAgfSA6XG4gICAgZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIGlmIChlbGVtZW50ID09PSBjb250YWluZXIpIHJldHVybiAxXG4gICAgICByZXR1cm4gMFxuICAgIH1cbiAgLCBnZXRBdHRyID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZGV0ZWN0IGJ1Z2d5IElFIHNyYy9ocmVmIGdldEF0dHJpYnV0ZSgpIGNhbGxcbiAgICAgIHZhciBlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgcmV0dXJuICgoZS5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiN4XCI+eDwvYT4nKSAmJiBlLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKCdocmVmJykgIT0gJyN4JykgP1xuICAgICAgICBmdW5jdGlvbiAoZSwgYSkge1xuICAgICAgICAgIHJldHVybiBhID09PSAnY2xhc3MnID8gZS5jbGFzc05hbWUgOiAoYSA9PT0gJ2hyZWYnIHx8IGEgPT09ICdzcmMnKSA/XG4gICAgICAgICAgICBlLmdldEF0dHJpYnV0ZShhLCAyKSA6IGUuZ2V0QXR0cmlidXRlKGEpXG4gICAgICAgIH0gOlxuICAgICAgICBmdW5jdGlvbiAoZSwgYSkgeyByZXR1cm4gZS5nZXRBdHRyaWJ1dGUoYSkgfVxuICAgIH0oKVxuICAsIGhhc0J5Q2xhc3MgPSAhIWRvY1tieUNsYXNzXVxuICAgIC8vIGhhcyBuYXRpdmUgcVNBIHN1cHBvcnRcbiAgLCBoYXNRU0EgPSBkb2MucXVlcnlTZWxlY3RvciAmJiBkb2NbcVNBXVxuICAgIC8vIHVzZSBuYXRpdmUgcVNBXG4gICwgc2VsZWN0UVNBID0gZnVuY3Rpb24gKHNlbGVjdG9yLCByb290KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW10sIHNzLCBlXG4gICAgICB0cnkge1xuICAgICAgICBpZiAocm9vdFtub2RlVHlwZV0gPT09IDkgfHwgIXNwbGl0dGFibGUudGVzdChzZWxlY3RvcikpIHtcbiAgICAgICAgICAvLyBtb3N0IHdvcmsgaXMgZG9uZSByaWdodCBoZXJlLCBkZWZlciB0byBxU0FcbiAgICAgICAgICByZXR1cm4gYXJyYXlpZnkocm9vdFtxU0FdKHNlbGVjdG9yKSlcbiAgICAgICAgfVxuICAgICAgICAvLyBzcGVjaWFsIGNhc2Ugd2hlcmUgd2UgbmVlZCB0aGUgc2VydmljZXMgb2YgYGNvbGxlY3RTZWxlY3RvcigpYFxuICAgICAgICBlYWNoKHNzID0gc2VsZWN0b3Iuc3BsaXQoJywnKSwgY29sbGVjdFNlbGVjdG9yKHJvb3QsIGZ1bmN0aW9uIChjdHgsIHMpIHtcbiAgICAgICAgICBlID0gY3R4W3FTQV0ocylcbiAgICAgICAgICBpZiAoZS5sZW5ndGggPT0gMSkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gZS5pdGVtKDApXG4gICAgICAgICAgZWxzZSBpZiAoZS5sZW5ndGgpIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoYXJyYXlpZnkoZSkpXG4gICAgICAgIH0pKVxuICAgICAgICByZXR1cm4gc3MubGVuZ3RoID4gMSAmJiByZXN1bHQubGVuZ3RoID4gMSA/IHVuaXEocmVzdWx0KSA6IHJlc3VsdFxuICAgICAgfSBjYXRjaCAoZXgpIHsgfVxuICAgICAgcmV0dXJuIHNlbGVjdE5vbk5hdGl2ZShzZWxlY3Rvciwgcm9vdClcbiAgICB9XG4gICAgLy8gbm8gbmF0aXZlIHNlbGVjdG9yIHN1cHBvcnRcbiAgLCBzZWxlY3ROb25OYXRpdmUgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIHJvb3QpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXSwgaXRlbXMsIG0sIGksIGwsIHIsIHNzXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2Uobm9ybWFsaXpyLCAnJDEnKVxuICAgICAgaWYgKG0gPSBzZWxlY3Rvci5tYXRjaCh0YWdBbmRPckNsYXNzKSkge1xuICAgICAgICByID0gY2xhc3NSZWdleChtWzJdKVxuICAgICAgICBpdGVtcyA9IHJvb3RbYnlUYWddKG1bMV0gfHwgJyonKVxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHIudGVzdChpdGVtc1tpXS5jbGFzc05hbWUpKSByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBpdGVtc1tpXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICAgIC8vIG1vcmUgY29tcGxleCBzZWxlY3RvciwgZ2V0IGBfcXdlcnkoKWAgdG8gZG8gdGhlIHdvcmsgZm9yIHVzXG4gICAgICBlYWNoKHNzID0gc2VsZWN0b3Iuc3BsaXQoJywnKSwgY29sbGVjdFNlbGVjdG9yKHJvb3QsIGZ1bmN0aW9uIChjdHgsIHMsIHJld3JpdGUpIHtcbiAgICAgICAgciA9IF9xd2VyeShzLCBjdHgpXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSByLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmIChjdHhbbm9kZVR5cGVdID09PSA5IHx8IHJld3JpdGUgfHwgaXNBbmNlc3RvcihyW2ldLCByb290KSkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gcltpXVxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICAgIHJldHVybiBzcy5sZW5ndGggPiAxICYmIHJlc3VsdC5sZW5ndGggPiAxID8gdW5pcShyZXN1bHQpIDogcmVzdWx0XG4gICAgfVxuICAsIGNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAvLyBjb25maWdOYXRpdmVRU0E6IHVzZSBmdWxseS1pbnRlcm5hbCBzZWxlY3RvciBvciBuYXRpdmUgcVNBIHdoZXJlIHByZXNlbnRcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uc1t1c2VOYXRpdmVRU0FdICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgc2VsZWN0ID0gIW9wdGlvbnNbdXNlTmF0aXZlUVNBXSA/IHNlbGVjdE5vbk5hdGl2ZSA6IGhhc1FTQSA/IHNlbGVjdFFTQSA6IHNlbGVjdE5vbk5hdGl2ZVxuICAgIH1cblxuICBjb25maWd1cmUoeyB1c2VOYXRpdmVRU0E6IHRydWUgfSlcblxuICBxd2VyeS5jb25maWd1cmUgPSBjb25maWd1cmVcbiAgcXdlcnkudW5pcSA9IHVuaXFcbiAgcXdlcnkuaXMgPSBpc1xuICBxd2VyeS5wc2V1ZG9zID0ge31cblxuICByZXR1cm4gcXdlcnlcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBoYXNLZXlzXG5cbmZ1bmN0aW9uIGhhc0tleXMoc291cmNlKSB7XG4gICAgcmV0dXJuIHNvdXJjZSAhPT0gbnVsbCAmJlxuICAgICAgICAodHlwZW9mIHNvdXJjZSA9PT0gXCJvYmplY3RcIiB8fFxuICAgICAgICB0eXBlb2Ygc291cmNlID09PSBcImZ1bmN0aW9uXCIpXG59XG4iLCJ2YXIgS2V5cyA9IHJlcXVpcmUoXCJvYmplY3Qta2V5c1wiKVxudmFyIGhhc0tleXMgPSByZXF1aXJlKFwiLi9oYXMta2V5c1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgaWYgKCFoYXNLZXlzKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IEtleXMoc291cmNlKVxuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwga2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBrZXlzW2pdXG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBzb3VyY2VbbmFtZV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRcbn1cbiIsInZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIGlzRnVuYyA9ICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgJiYgIShmbiBpbnN0YW5jZW9mIFJlZ0V4cCkpIHx8IHRvU3RyaW5nLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHRpZiAoIWlzRnVuYyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdGlzRnVuYyA9IGZuID09PSB3aW5kb3cuc2V0VGltZW91dCB8fCBmbiA9PT0gd2luZG93LmFsZXJ0IHx8IGZuID09PSB3aW5kb3cuY29uZmlybSB8fCBmbiA9PT0gd2luZG93LnByb21wdDtcblx0fVxuXHRyZXR1cm4gaXNGdW5jO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcblx0aWYgKCFpc0Z1bmN0aW9uKGZuKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2l0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXHR9XG5cdHZhciBpLCBrLFxuXHRcdGlzU3RyaW5nID0gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycsXG5cdFx0bCA9IG9iai5sZW5ndGgsXG5cdFx0Y29udGV4dCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogbnVsbDtcblx0aWYgKGwgPT09ICtsKSB7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0aWYgKGNvbnRleHQgPT09IG51bGwpIHtcblx0XHRcdFx0Zm4oaXNTdHJpbmcgPyBvYmouY2hhckF0KGkpIDogb2JqW2ldLCBpLCBvYmopO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm4uY2FsbChjb250ZXh0LCBpc1N0cmluZyA/IG9iai5jaGFyQXQoaSkgOiBvYmpbaV0sIGksIG9iaik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZvciAoayBpbiBvYmopIHtcblx0XHRcdGlmIChoYXNPd24uY2FsbChvYmosIGspKSB7XG5cdFx0XHRcdGlmIChjb250ZXh0ID09PSBudWxsKSB7XG5cdFx0XHRcdFx0Zm4ob2JqW2tdLCBrLCBvYmopO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZuLmNhbGwoY29udGV4dCwgb2JqW2tdLCBrLCBvYmopO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IHJlcXVpcmUoJy4vc2hpbScpO1xuXG4iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG5cdHZhciBzdHIgPSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcblx0dmFyIGlzQXJndW1lbnRzID0gc3RyID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcblx0aWYgKCFpc0FyZ3VtZW50cykge1xuXHRcdGlzQXJndW1lbnRzID0gc3RyICE9PSAnW29iamVjdCBBcnJheV0nXG5cdFx0XHQmJiB2YWx1ZSAhPT0gbnVsbFxuXHRcdFx0JiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xuXHRcdFx0JiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcblx0XHRcdCYmIHZhbHVlLmxlbmd0aCA+PSAwXG5cdFx0XHQmJiB0b1N0cmluZy5jYWxsKHZhbHVlLmNhbGxlZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdH1cblx0cmV0dXJuIGlzQXJndW1lbnRzO1xufTtcblxuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Ly8gbW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL2VzNS1zaGltXG5cdHZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuXHRcdHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcblx0XHRmb3JFYWNoID0gcmVxdWlyZSgnLi9mb3JlYWNoJyksXG5cdFx0aXNBcmdzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuXHRcdGhhc0RvbnRFbnVtQnVnID0gISh7J3RvU3RyaW5nJzogbnVsbH0pLnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpLFxuXHRcdGhhc1Byb3RvRW51bUJ1ZyA9IChmdW5jdGlvbiAoKSB7fSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3Byb3RvdHlwZScpLFxuXHRcdGRvbnRFbnVtcyA9IFtcblx0XHRcdFwidG9TdHJpbmdcIixcblx0XHRcdFwidG9Mb2NhbGVTdHJpbmdcIixcblx0XHRcdFwidmFsdWVPZlwiLFxuXHRcdFx0XCJoYXNPd25Qcm9wZXJ0eVwiLFxuXHRcdFx0XCJpc1Byb3RvdHlwZU9mXCIsXG5cdFx0XHRcInByb3BlcnR5SXNFbnVtZXJhYmxlXCIsXG5cdFx0XHRcImNvbnN0cnVjdG9yXCJcblx0XHRdLFxuXHRcdGtleXNTaGltO1xuXG5cdGtleXNTaGltID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblx0XHR2YXIgaXNPYmplY3QgPSBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcsXG5cdFx0XHRpc0Z1bmN0aW9uID0gdG9TdHJpbmcuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBGdW5jdGlvbl0nLFxuXHRcdFx0aXNBcmd1bWVudHMgPSBpc0FyZ3Mob2JqZWN0KSxcblx0XHRcdHRoZUtleXMgPSBbXTtcblxuXHRcdGlmICghaXNPYmplY3QgJiYgIWlzRnVuY3Rpb24gJiYgIWlzQXJndW1lbnRzKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0LmtleXMgY2FsbGVkIG9uIGEgbm9uLW9iamVjdFwiKTtcblx0XHR9XG5cblx0XHRpZiAoaXNBcmd1bWVudHMpIHtcblx0XHRcdGZvckVhY2gob2JqZWN0LCBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0dGhlS2V5cy5wdXNoKHZhbHVlKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgbmFtZSxcblx0XHRcdFx0c2tpcFByb3RvID0gaGFzUHJvdG9FbnVtQnVnICYmIGlzRnVuY3Rpb247XG5cblx0XHRcdGZvciAobmFtZSBpbiBvYmplY3QpIHtcblx0XHRcdFx0aWYgKCEoc2tpcFByb3RvICYmIG5hbWUgPT09ICdwcm90b3R5cGUnKSAmJiBoYXMuY2FsbChvYmplY3QsIG5hbWUpKSB7XG5cdFx0XHRcdFx0dGhlS2V5cy5wdXNoKG5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGhhc0RvbnRFbnVtQnVnKSB7XG5cdFx0XHR2YXIgY3RvciA9IG9iamVjdC5jb25zdHJ1Y3Rvcixcblx0XHRcdFx0c2tpcENvbnN0cnVjdG9yID0gY3RvciAmJiBjdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0O1xuXG5cdFx0XHRmb3JFYWNoKGRvbnRFbnVtcywgZnVuY3Rpb24gKGRvbnRFbnVtKSB7XG5cdFx0XHRcdGlmICghKHNraXBDb25zdHJ1Y3RvciAmJiBkb250RW51bSA9PT0gJ2NvbnN0cnVjdG9yJykgJiYgaGFzLmNhbGwob2JqZWN0LCBkb250RW51bSkpIHtcblx0XHRcdFx0XHR0aGVLZXlzLnB1c2goZG9udEVudW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoZUtleXM7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBrZXlzU2hpbTtcbn0oKSk7XG5cbiIsInZhciBnbG9iYWw9dHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9Oy8qXG4gKlxuICogVGhpcyBpcyB1c2VkIHRvIGJ1aWxkIHRoZSBidW5kbGUgd2l0aCBicm93c2VyaWZ5LlxuICpcbiAqIFRoZSBidW5kbGUgaXMgdXNlZCBieSBwZW9wbGUgd2hvIGRvZXNuJ3QgdXNlIGJyb3dzZXJpZnkucmVxdWlyZVxuICogVGhvc2Ugd2hvIHVzZSBicm93c2VyaWZ5IHdpbGwgaW5zdGFsbCB3aXRoIG5wbSBhbmQgcmVxdWlyZSB0aGUgbW9kdWxlLFxuICogdGhlIHBhY2thZ2UuanNvbiBmaWxlIHBvaW50cyB0byBpbmRleC5qcy5cbiAqL1xudmFyIEF1dGgwV2lkZ2V0ID0gcmVxdWlyZSgnLi93aWRnZXQnKTtcbnZhciBpbnNlcnRDc3MgICA9IHJlcXVpcmUoJy4vdmVuZG9yL2luc2VydC1jc3MnKTtcbnZhciBmcyAgICAgICAgICA9IHJlcXVpcmUoJ2ZzJyk7XG5cbmluc2VydENzcyhcIkBjaGFyc2V0IFxcXCJVVEYtOFxcXCI7I2F1dGgwLXdpZGdldHsvKiFcXG4qIENsZWFuU2xhdGVcXG4qICAgZ2l0aHViLmNvbS9wcmVtYXNhZ2FyL2NsZWFuc2xhdGVcXG4qXFxuKi8vKiFcXG5cXHRab2NpYWwgQnV0b25zXFxuXFx0aHR0cDovL3pvY2lhbC5zbWNsbG5zLmNvbVxcblxcdGJ5IFNhbSBDb2xsaW5zIChAc21jbGxucylcXG5cXHRMaWNlbnNlOiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXFxuXFx0XFxuXFx0WW91IGFyZSBmcmVlIHRvIHVzZSBhbmQgbW9kaWZ5LCBhcyBsb25nIGFzIHlvdSBrZWVwIHRoaXMgbGljZW5zZSBjb21tZW50IGludGFjdCBvciBsaW5rIGJhY2sgdG8gem9jaWFsLnNtY2xsbnMuY29tIG9uIHlvdXIgc2l0ZS5cXG4qLy8qISBub3JtYWxpemUuY3NzIHYxLjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0LmlvL25vcm1hbGl6ZSAqL30jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoMiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGgzLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoNSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGR0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb3JtLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VsZWN0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb3B0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcHJlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGl2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGFibGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0aCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRib2R5LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGZvb3QsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjYXB0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGhlYWQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxpLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYWRkcmVzcywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJsb2NrcXVvdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGZpZWxkc2V0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbGksI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpZnJhbWUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzdHJvbmcsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsZWdlbmQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBlbSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHMsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjaXRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc3BhbiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc3VwLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbGFiZWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkZm4sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvYmplY3QsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBiaWcsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBxLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZm9udCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNhbXAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhY3JvbnltLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc21hbGwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbWcsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzdHJpa2UsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjb2RlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc3ViLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5zLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGV4dGFyZWEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB2YXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYWJiciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFwcGxldCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRlbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGtiZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHR0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGksI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBociwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFydGljbGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhc2lkZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRpYWxvZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGZpZ3VyZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGZvb3RlciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGhlYWRlciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGhncm91cCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBuYXYsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzZWN0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGltZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1hcmssI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhdWRpbywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHZpZGVve2JhY2tncm91bmQtYXR0YWNobWVudDpzY3JvbGwhaW1wb3J0YW50O2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQhaW1wb3J0YW50O2JhY2tncm91bmQtaW1hZ2U6bm9uZSFpbXBvcnRhbnQ7YmFja2dyb3VuZC1wb3NpdGlvbjowIDAhaW1wb3J0YW50O2JhY2tncm91bmQtcmVwZWF0OnJlcGVhdCFpbXBvcnRhbnQ7Ym9yZGVyLWNvbG9yOmJsYWNrIWltcG9ydGFudDtib3JkZXItY29sb3I6Y3VycmVudENvbG9yIWltcG9ydGFudDtib3JkZXItcmFkaXVzOjAhaW1wb3J0YW50O2JvcmRlci1zdHlsZTpub25lIWltcG9ydGFudDtib3JkZXItd2lkdGg6bWVkaXVtIWltcG9ydGFudDtib3R0b206YXV0byFpbXBvcnRhbnQ7Y2xlYXI6bm9uZSFpbXBvcnRhbnQ7Y2xpcDphdXRvIWltcG9ydGFudDtjb2xvcjppbmhlcml0IWltcG9ydGFudDtjb3VudGVyLWluY3JlbWVudDpub25lIWltcG9ydGFudDtjb3VudGVyLXJlc2V0Om5vbmUhaW1wb3J0YW50O2N1cnNvcjphdXRvIWltcG9ydGFudDtkaXJlY3Rpb246aW5oZXJpdCFpbXBvcnRhbnQ7ZGlzcGxheTppbmxpbmUhaW1wb3J0YW50O2Zsb2F0Om5vbmUhaW1wb3J0YW50O2ZvbnQtZmFtaWx5OmluaGVyaXQhaW1wb3J0YW50O2ZvbnQtc2l6ZTppbmhlcml0IWltcG9ydGFudDtmb250LXN0eWxlOmluaGVyaXQhaW1wb3J0YW50O2ZvbnQtdmFyaWFudDpub3JtYWwhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0OmluaGVyaXQhaW1wb3J0YW50O2hlaWdodDphdXRvIWltcG9ydGFudDtsZWZ0OmF1dG8haW1wb3J0YW50O2xldHRlci1zcGFjaW5nOm5vcm1hbCFpbXBvcnRhbnQ7bGluZS1oZWlnaHQ6aW5oZXJpdCFpbXBvcnRhbnQ7bGlzdC1zdHlsZS10eXBlOmluaGVyaXQhaW1wb3J0YW50O2xpc3Qtc3R5bGUtcG9zaXRpb246b3V0c2lkZSFpbXBvcnRhbnQ7bGlzdC1zdHlsZS1pbWFnZTpub25lIWltcG9ydGFudDttYXJnaW46MCFpbXBvcnRhbnQ7bWF4LWhlaWdodDpub25lIWltcG9ydGFudDttYXgtd2lkdGg6bm9uZSFpbXBvcnRhbnQ7bWluLWhlaWdodDowIWltcG9ydGFudDttaW4td2lkdGg6MCFpbXBvcnRhbnQ7b3BhY2l0eToxO291dGxpbmU6aW52ZXJ0IG5vbmUgbWVkaXVtIWltcG9ydGFudDtvdmVyZmxvdzp2aXNpYmxlIWltcG9ydGFudDtwYWRkaW5nOjAhaW1wb3J0YW50O3Bvc2l0aW9uOnN0YXRpYyFpbXBvcnRhbnQ7cXVvdGVzOlxcXCJcXFwiIFxcXCJcXFwiIWltcG9ydGFudDtyaWdodDphdXRvIWltcG9ydGFudDt0YWJsZS1sYXlvdXQ6YXV0byFpbXBvcnRhbnQ7dGV4dC1hbGlnbjppbmhlcml0IWltcG9ydGFudDt0ZXh0LWRlY29yYXRpb246aW5oZXJpdCFpbXBvcnRhbnQ7dGV4dC1pbmRlbnQ6MCFpbXBvcnRhbnQ7dGV4dC10cmFuc2Zvcm06bm9uZSFpbXBvcnRhbnQ7dG9wOmF1dG8haW1wb3J0YW50O3VuaWNvZGUtYmlkaTpub3JtYWwhaW1wb3J0YW50O3ZlcnRpY2FsLWFsaWduOmJhc2VsaW5lIWltcG9ydGFudDt2aXNpYmlsaXR5OmluaGVyaXQhaW1wb3J0YW50O3doaXRlLXNwYWNlOm5vcm1hbCFpbXBvcnRhbnQ7d2lkdGg6YXV0byFpbXBvcnRhbnQ7d29yZC1zcGFjaW5nOm5vcm1hbCFpbXBvcnRhbnQ7ei1pbmRleDphdXRvIWltcG9ydGFudDstbW96LWJvcmRlci1yYWRpdXM6MCFpbXBvcnRhbnQ7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjAhaW1wb3J0YW50Oy1tb3otYm94LXNpemluZzpjb250ZW50LWJveCFpbXBvcnRhbnQ7LXdlYmtpdC1ib3gtc2l6aW5nOmNvbnRlbnQtYm94IWltcG9ydGFudDtib3gtc2l6aW5nOmNvbnRlbnQtYm94IWltcG9ydGFudDt0ZXh0LXNoYWRvdzpub25lIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDMsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoNSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoMSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZHQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoNiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZm9ybSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlbGVjdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9wdGlvbiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHByZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRpdiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGgyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgY2FwdGlvbiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhZGRyZXNzLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYmxvY2txdW90ZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZmllbGRzZXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ZXh0YXJlYSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGhyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXJ0aWNsZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFzaWRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGlhbG9nLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZmlndXJlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZm9vdGVyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaGVhZGVyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaGdyb3VwLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG5hdiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlY3Rpb257ZGlzcGxheTpibG9jayFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0YWJsZXtkaXNwbGF5OnRhYmxlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRoZWFke2Rpc3BsYXk6dGFibGUtaGVhZGVyLWdyb3VwIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRib2R5e2Rpc3BsYXk6dGFibGUtcm93LWdyb3VwIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRmb290e2Rpc3BsYXk6dGFibGUtZm9vdGVyLWdyb3VwIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRye2Rpc3BsYXk6dGFibGUtcm93IWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRoLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGR7ZGlzcGxheTp0YWJsZS1jZWxsIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG5hdiB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG5hdiBvbHtsaXN0LXN0eWxlLXR5cGU6bm9uZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnV7bGlzdC1zdHlsZS10eXBlOmRpc2MhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2x7bGlzdC1zdHlsZS10eXBlOmRlY2ltYWwhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgbWVudXtsaXN0LXN0eWxlLXR5cGU6Y2lyY2xlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG9sIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgdWwgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCBtZW51IHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgb2wgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIHVsIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCBtZW51IG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBvbCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIHVsIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgbWVudSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIG9sIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCB1bCBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgbWVudSBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSBvbCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgdWwgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IG1lbnUgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IG9sIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IHVsIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IG1lbnUgbWVudXtsaXN0LXN0eWxlLXR5cGU6c3F1YXJlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxpe2Rpc3BsYXk6bGlzdC1pdGVtIWltcG9ydGFudDttaW4taGVpZ2h0OmF1dG8haW1wb3J0YW50O21pbi13aWR0aDphdXRvIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHN0cm9uZ3tmb250LXdlaWdodDpib2xkIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGVte2ZvbnQtc3R5bGU6aXRhbGljIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGtiZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNhbXAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjb2Rle2ZvbnQtZmFtaWx5Om1vbm9zcGFjZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYSAqLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXRbdHlwZT1zdWJtaXRdLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXRbdHlwZT1yYWRpb10sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPWNoZWNrYm94XSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlbGVjdHtjdXJzb3I6cG9pbnRlciFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYnV0dG9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXRbdHlwZT1zdWJtaXRde3RleHQtYWxpZ246Y2VudGVyIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0W3R5cGU9aGlkZGVuXXtkaXNwbGF5Om5vbmUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYWJiclt0aXRsZV0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhY3JvbnltW3RpdGxlXSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRmblt0aXRsZV17Y3Vyc29yOmhlbHAhaW1wb3J0YW50O2JvcmRlci1ib3R0b20td2lkdGg6MXB4IWltcG9ydGFudDtib3JkZXItYm90dG9tLXN0eWxlOmRvdHRlZCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnN7YmFja2dyb3VuZC1jb2xvcjojZmY5IWltcG9ydGFudDtjb2xvcjpibGFjayFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkZWx7dGV4dC1kZWNvcmF0aW9uOmxpbmUtdGhyb3VnaCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBibG9ja3F1b3RlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcXtxdW90ZXM6bm9uZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBibG9ja3F1b3RlOmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJsb2NrcXVvdGU6YWZ0ZXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBxOmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHE6YWZ0ZXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsaTpiZWZvcmUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsaTphZnRlcntjb250ZW50OlxcXCJcXFwiIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VsZWN0e3ZlcnRpY2FsLWFsaWduOm1pZGRsZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzZWxlY3QsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ZXh0YXJlYSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0e2JvcmRlcjoxcHggc29saWQgI2NjYyFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0YWJsZXtib3JkZXItY29sbGFwc2U6Y29sbGFwc2UhaW1wb3J0YW50O2JvcmRlci1zcGFjaW5nOjAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaHJ7ZGlzcGxheTpibG9jayFpbXBvcnRhbnQ7aGVpZ2h0OjFweCFpbXBvcnRhbnQ7Ym9yZGVyOjAhaW1wb3J0YW50O2JvcmRlci10b3A6MXB4IHNvbGlkICNjY2MhaW1wb3J0YW50O21hcmdpbjoxZW0gMCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSAqW2Rpcj1ydGxde2RpcmVjdGlvbjpydGwhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWFya3tiYWNrZ3JvdW5kLWNvbG9yOiNmZjkhaW1wb3J0YW50O2NvbG9yOmJsYWNrIWltcG9ydGFudDtmb250LXN0eWxlOml0YWxpYyFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6Ym9sZCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZXtmb250LXNpemU6bWVkaXVtIWltcG9ydGFudDtsaW5lLWhlaWdodDoxIWltcG9ydGFudDtkaXJlY3Rpb246bHRyIWltcG9ydGFudDt0ZXh0LWFsaWduOmxlZnQhaW1wb3J0YW50O2ZvbnQtZmFtaWx5OlxcXCJUaW1lcyBOZXcgUm9tYW5cXFwiLFRpbWVzLHNlcmlmIWltcG9ydGFudDtjb2xvcjpibGFjayFpbXBvcnRhbnQ7Zm9udC1zdHlsZTpub3JtYWwhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0Om5vcm1hbCFpbXBvcnRhbnQ7dGV4dC1kZWNvcmF0aW9uOm5vbmUhaW1wb3J0YW50O2xpc3Qtc3R5bGUtdHlwZTpkaXNjIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwsI2F1dGgwLXdpZGdldCBhLnpvY2lhbHtib3JkZXI6MXB4IHNvbGlkICM3Nzc7Ym9yZGVyLWNvbG9yOnJnYmEoMCwwLDAsMC4yKTtib3JkZXItYm90dG9tLWNvbG9yOiMzMzM7Ym9yZGVyLWJvdHRvbS1jb2xvcjpyZ2JhKDAsMCwwLDAuNCk7Y29sb3I6I2ZmZjstbW96LWJveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC40KSxpbnNldCAwIDAgLjFlbSByZ2JhKDI1NSwyNTUsMjU1LDAuOSk7LXdlYmtpdC1ib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpO2JveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC40KSxpbnNldCAwIDAgLjFlbSByZ2JhKDI1NSwyNTUsMjU1LDAuOSk7Y3Vyc29yOnBvaW50ZXI7ZGlzcGxheTppbmxpbmUtYmxvY2s7Zm9udDpib2xkIDEwMCUvMi4xIFxcXCJMdWNpZGEgR3JhbmRlXFxcIixUYWhvbWEsc2Fucy1zZXJpZjtwYWRkaW5nOjAgLjk1ZW0gMCAwO3RleHQtYWxpZ246Y2VudGVyO3RleHQtZGVjb3JhdGlvbjpub25lO3RleHQtc2hhZG93OjAgMXB4IDAgcmdiYSgwLDAsMCwwLjUpO3doaXRlLXNwYWNlOm5vd3JhcDstbW96LXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmU7cG9zaXRpb246cmVsYXRpdmU7LW1vei1ib3JkZXItcmFkaXVzOi4zZW07LXdlYmtpdC1ib3JkZXItcmFkaXVzOi4zZW07Ym9yZGVyLXJhZGl1czouM2VtfSNhdXRoMC13aWRnZXQgLnpvY2lhbDpiZWZvcmV7Y29udGVudDpcXFwiXFxcIjtib3JkZXItcmlnaHQ6LjA3NWVtIHNvbGlkIHJnYmEoMCwwLDAsMC4xKTtmbG9hdDpsZWZ0O2ZvbnQ6MTIwJS8xLjY1IHpvY2lhbDtmb250LXN0eWxlOm5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7bWFyZ2luOjAgLjVlbSAwIDA7cGFkZGluZzowIC41ZW07dGV4dC1hbGlnbjpjZW50ZXI7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC10cmFuc2Zvcm06bm9uZTstbW96LWJveC1zaGFkb3c6LjA3NWVtIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDAuMjUpOy13ZWJraXQtYm94LXNoYWRvdzouMDc1ZW0gMCAwIHJnYmEoMjU1LDI1NSwyNTUsMC4yNSk7Ym94LXNoYWRvdzouMDc1ZW0gMCAwIHJnYmEoMjU1LDI1NSwyNTUsMC4yNSk7LW1vei1mb250LXNtb290aGluZzphbnRpYWxpYXNlZDstd2Via2l0LWZvbnQtc21vb3RoaW5nOmFudGlhbGlhc2VkO2ZvbnQtc21vb3RoaW5nOmFudGlhbGlhc2VkfSNhdXRoMC13aWRnZXQgLnpvY2lhbDphY3RpdmV7b3V0bGluZTowfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5pY29ue292ZXJmbG93OmhpZGRlbjttYXgtd2lkdGg6Mi40ZW07cGFkZGluZy1sZWZ0OjA7cGFkZGluZy1yaWdodDowO21heC1oZWlnaHQ6Mi4xNWVtO3doaXRlLXNwYWNlOm5vd3JhcH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuaWNvbjpiZWZvcmV7cGFkZGluZzowO3dpZHRoOjJlbTtoZWlnaHQ6MmVtO2JveC1zaGFkb3c6bm9uZTtib3JkZXI6MH0jYXV0aDAtd2lkZ2V0IC56b2NpYWx7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwLjA1KSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMC4wNSkgNDklLHJnYmEoMCwwLDAsMC4wNSkgNTElLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotby1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMC4wNSkgNDklLHJnYmEoMCwwLDAsMC4wNSkgNTElLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWdyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxsZWZ0IGJvdHRvbSxmcm9tKHJnYmEoMjU1LDI1NSwyNTUsMC4xKSksY29sb3Itc3RvcCg0OSUscmdiYSgyNTUsMjU1LDI1NSwwLjA1KSksY29sb3Itc3RvcCg1MSUscmdiYSgwLDAsMCwwLjA1KSksdG8ocmdiYSgwLDAsMCwwLjEpKSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwLjA1KSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwLjA1KSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjEpKX0jYXV0aDAtd2lkZ2V0IC56b2NpYWw6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsOmZvY3Vze2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjE1KSA0OSUscmdiYSgwLDAsMCwwLjEpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjE1KSA0OSUscmdiYSgwLDAsMCwwLjEpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1ncmFkaWVudChsaW5lYXIsbGVmdCB0b3AsbGVmdCBib3R0b20sZnJvbShyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpKSxjb2xvci1zdG9wKDQ5JSxyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpKSxjb2xvci1zdG9wKDUxJSxyZ2JhKDAsMCwwLDAuMSkpLHRvKHJnYmEoMCwwLDAsMC4xNSkpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkgNDklLHJnYmEoMCwwLDAsMC4xKSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjE1KSA0OSUscmdiYSgwLDAsMCwwLjEpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKX0jYXV0aDAtd2lkZ2V0IC56b2NpYWw6YWN0aXZle2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSx0cmFuc3BhcmVudCA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSx0cmFuc3BhcmVudCA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1ncmFkaWVudChsaW5lYXIsbGVmdCB0b3AsbGVmdCBib3R0b20sZnJvbShyZ2JhKDI1NSwyNTUsMjU1LDAuMSkpLGNvbG9yLXN0b3AoMzAlLHJnYmEoMjU1LDI1NSwyNTUsMCkpLGNvbG9yLXN0b3AoNTAlLHRyYW5zcGFyZW50KSx0byhyZ2JhKDAsMCwwLDAuMSkpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsdHJhbnNwYXJlbnQgNTAlLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSx0cmFuc3BhcmVudCA1MCUscmdiYSgwLDAsMCwwLjEpKX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZHJvcGJveCwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ2l0aHViLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5nbWFpbCwjYXV0aDAtd2lkZ2V0IC56b2NpYWwub3BlbmlkLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnksI2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3csI2F1dGgwLXdpZGdldCAuem9jaWFsLnNhbGVzZm9yY2V7Ym9yZGVyOjFweCBzb2xpZCAjYWFhO2JvcmRlci1jb2xvcjpyZ2JhKDAsMCwwLDAuMyk7Ym9yZGVyLWJvdHRvbS1jb2xvcjojNzc3O2JvcmRlci1ib3R0b20tY29sb3I6cmdiYSgwLDAsMCwwLjUpOy1tb3otYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjcpLGluc2V0IDAgMCAuMDhlbSByZ2JhKDI1NSwyNTUsMjU1LDAuNSk7LXdlYmtpdC1ib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNyksaW5zZXQgMCAwIC4wOGVtIHJnYmEoMjU1LDI1NSwyNTUsMC41KTtib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNyksaW5zZXQgMCAwIC4wOGVtIHJnYmEoMjU1LDI1NSwyNTUsMC41KTt0ZXh0LXNoYWRvdzowIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsMC44KX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZHJvcGJveDpmb2N1cywjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZHJvcGJveDpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ2l0aHViOmZvY3VzLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWI6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsOmZvY3VzLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5nbWFpbDpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwub3BlbmlkOmZvY3VzLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5vcGVuaWQ6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeTpmb2N1cywjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5OmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zdGFja292ZXJmbG93OmZvY3VzLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zdGFja292ZXJmbG93OmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC50d2l0dGVyOmZvY3VzIC56b2NpYWwudHdpdHRlcjpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZTpmb2N1cyAuem9jaWFsLnNhbGVzZm9yY2U6aG92ZXJ7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWdyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxsZWZ0IGJvdHRvbSxmcm9tKHJnYmEoMjU1LDI1NSwyNTUsMC41KSksY29sb3Itc3RvcCg0OSUscmdiYSgyNTUsMjU1LDI1NSwwLjIpKSxjb2xvci1zdG9wKDUxJSxyZ2JhKDAsMCwwLDAuMDUpKSx0byhyZ2JhKDAsMCwwLDAuMTUpKSk7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudCh0b3AscmdiYSgyNTUsMjU1LDI1NSwwLjUpLHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AscmdiYSgyNTUsMjU1LDI1NSwwLjUpLHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTotby1saW5lYXItZ3JhZGllbnQodG9wLHJnYmEoMjU1LDI1NSwyNTUsMC41KSxyZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDklLHJnYmEoMCwwLDAsMC4wNSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudCh0b3AscmdiYSgyNTUsMjU1LDI1NSwwLjUpLHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQodG9wLHJnYmEoMjU1LDI1NSwyNTUsMC41KSxyZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDklLHJnYmEoMCwwLDAsMC4wNSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94OmFjdGl2ZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ2l0aHViOmFjdGl2ZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ21haWw6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5vcGVuaWQ6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnk6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zdGFja292ZXJmbG93OmFjdGl2ZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwud2lraXBlZGlhOmFjdGl2ZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZTphY3RpdmV7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWdyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxsZWZ0IGJvdHRvbSxmcm9tKHJnYmEoMjU1LDI1NSwyNTUsMCkpLGNvbG9yLXN0b3AoMzAlLHJnYmEoMjU1LDI1NSwyNTUsMCkpLGNvbG9yLXN0b3AoNTAlLHJnYmEoMCwwLDAsMCkpLHRvKHJnYmEoMCwwLDAsMC4xKSkpO2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMCkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUscmdiYSgwLDAsMCwwKSA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDApLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHJnYmEoMCwwLDAsMCkgNTAlLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotby1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMCkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUscmdiYSgwLDAsMCwwKSA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMCkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUscmdiYSgwLDAsMCwwKSA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5hbWF6b246YmVmb3Jle2NvbnRlbnQ6XFxcImFcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94OmJlZm9yZXtjb250ZW50OlxcXCJkXFxcIjtjb2xvcjojMWY3NWNjfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5mYWNlYm9vazpiZWZvcmV7Y29udGVudDpcXFwiZlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmdpdGh1YjpiZWZvcmV7Y29udGVudDpcXFwiXFxcXDAwRThcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nbWFpbDpiZWZvcmV7Y29udGVudDpcXFwibVxcXCI7Y29sb3I6I2YwMH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ29vZ2xlOmJlZm9yZXtjb250ZW50OlxcXCJHXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ29vZ2xlcGx1czpiZWZvcmV7Y29udGVudDpcXFwiK1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmd1ZXN0OmJlZm9yZXtjb250ZW50OlxcXCI/XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuaWU6YmVmb3Jle2NvbnRlbnQ6XFxcIjZcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5saW5rZWRpbjpiZWZvcmV7Y29udGVudDpcXFwiTFxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZDpiZWZvcmV7Y29udGVudDpcXFwib1xcXCI7Y29sb3I6I2ZmOTIxZH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucGF5cGFsOmJlZm9yZXtjb250ZW50OlxcXCIkXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc3RhY2tvdmVyZmxvdzpiZWZvcmV7Y29udGVudDpcXFwiXFxcXDAwRUNcXFwiO2NvbG9yOiNmZjdhMTV9I2F1dGgwLXdpZGdldCAuem9jaWFsLnR3aXR0ZXI6YmVmb3Jle2NvbnRlbnQ6XFxcIlRcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC52azpiZWZvcmV7Y29udGVudDpcXFwiTlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndpbmRvd3M6YmVmb3Jle2NvbnRlbnQ6XFxcIldcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC55YWhvbzpiZWZvcmV7Y29udGVudDpcXFwiWVxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9mZmljZTM2NTpiZWZvcmV7Y29udGVudDpcXFwielxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsczpiZWZvcmV7Y29udGVudDpcXFwiYlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnNhbGVzZm9yY2U6YmVmb3Jle2NvbnRlbnQ6XFxcIipcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC53YWFkOmJlZm9yZXtjb250ZW50OlxcXCJ6XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94OmJlZm9yZXtjb250ZW50OlxcXCJ4XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYW1hem9ue2JhY2tncm91bmQtY29sb3I6I2ZmYWQxZDtjb2xvcjojMDMwMDM3O3RleHQtc2hhZG93OjAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjUpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94e2JhY2tncm91bmQtY29sb3I6I2ZmZjtjb2xvcjojMzEyYzJhfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5mYWNlYm9va3tiYWNrZ3JvdW5kLWNvbG9yOiM0ODYzYWV9I2F1dGgwLXdpZGdldCAuem9jaWFsLmdpdGh1YntiYWNrZ3JvdW5kLWNvbG9yOiNmYmZiZmI7Y29sb3I6IzA1MDUwNX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ21haWx7YmFja2dyb3VuZC1jb2xvcjojZWZlZmVmO2NvbG9yOiMyMjJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmdvb2dsZXtiYWNrZ3JvdW5kLWNvbG9yOiM0ZTZjZjd9I2F1dGgwLXdpZGdldCAuem9jaWFsLmdvb2dsZXBsdXN7YmFja2dyb3VuZC1jb2xvcjojZGQ0YjM5fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5ndWVzdHtiYWNrZ3JvdW5kLWNvbG9yOiMxYjRkNmR9I2F1dGgwLXdpZGdldCAuem9jaWFsLmlle2JhY2tncm91bmQtY29sb3I6IzAwYTFkOX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwubGlua2VkaW57YmFja2dyb3VuZC1jb2xvcjojMDA4M2E4fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5vcGVuaWR7YmFja2dyb3VuZC1jb2xvcjojZjVmNWY1O2NvbG9yOiMzMzN9I2F1dGgwLXdpZGdldCAuem9jaWFsLnBheXBhbHtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Y29sb3I6IzMyNjg5YTt0ZXh0LXNoYWRvdzowIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsMC41KX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudHdpdHRlcntiYWNrZ3JvdW5kLWNvbG9yOiM0NmMwZmJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnZre2JhY2tncm91bmQtY29sb3I6IzQ1Njg4ZX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2luZG93c3tiYWNrZ3JvdW5kLWNvbG9yOiMwMDUyYTQ7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwub2ZmaWNlMzY1e2JhY2tncm91bmQtY29sb3I6IzAwYWNlZDtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC53YWFke2JhY2tncm91bmQtY29sb3I6IzAwYWRlZjtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC50aGlydHlzZXZlbnNpZ25hbHN7YmFja2dyb3VuZC1jb2xvcjojNmFjMDcxO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmJveHtiYWNrZ3JvdW5kLWNvbG9yOiMyNjdiYjY7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZXtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Y29sb3I6I2YwMH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2luZG93c3tiYWNrZ3JvdW5kLWNvbG9yOiMyNjcyZWM7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5e21hcmdpbjouMWVtIDA7cGFkZGluZzowIDFlbX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeTpiZWZvcmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeTpiZWZvcmV7ZGlzcGxheTpub25lfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wcmltYXJ5e2JhY2tncm91bmQtY29sb3I6IzMzM30jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5e2JhY2tncm91bmQtY29sb3I6I2YwZjBlYjtjb2xvcjojMjIyO3RleHQtc2hhZG93OjAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjgpfSNhdXRoMC13aWRnZXQgYnV0dG9uOi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjA7cGFkZGluZzowfUBmb250LWZhY2V7Zm9udC1mYW1pbHk6J3pvY2lhbCc7c3JjOnVybCgnaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2Fzc2V0cy5hdXRoMC5jb20vdzIvZm9udC96b2NpYWwtcmVndWxhci13ZWJmb250LmVvdCcpfUBmb250LWZhY2V7Zm9udC1mYW1pbHk6J3pvY2lhbCc7c3JjOnVybChkYXRhOmFwcGxpY2F0aW9uL2ZvbnQtd29mZjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxkMDlHUmdBQkFBQUFBQmVRQUEwQUFBQUFJR2dBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQkdSbFJOQUFBQk1BQUFBQm9BQUFBY1pudUF5a2RFUlVZQUFBRk1BQUFBSHdBQUFDQUFUZ0FHVDFNdk1nQUFBV3dBQUFCSUFBQUFWay9sM0VCamJXRndBQUFCdEFBQUFQWUFBQUlLbmw1NjdHZGhjM0FBQUFLc0FBQUFDQUFBQUFqLy93QURaMng1WmdBQUFyUUFBQktMQUFBWnNBTXBKckJvWldGa0FBQVZRQUFBQURBQUFBQTIvM0pTV1dob1pXRUFBQlZ3QUFBQUlBQUFBQ1FGZlFINWFHMTBlQUFBRlpBQUFBQmpBQUFBZ0R0T0FiZHNiMk5oQUFBVjlBQUFBRVFBQUFCRVdaWmYrRzFoZUhBQUFCWTRBQUFBSGdBQUFDQUFjQUMrYm1GdFpRQUFGbGdBQUFEZUFBQUJobGJEOS9Kd2IzTjBBQUFYT0FBQUFGWUFBQUJzVWVtaGhIaWNZMkJnWUdRQWdwT2QrWVlnK2x3bHh4a1lEUUJBK1FZcUFBQjRuR05nWkdCZzRBTmlDUVlRWUdKZ1pHQm1VQUNTTEdBZUF3QUZ4QUJWQUhpY1kyQmtFbU9jd01ES3dNSG93NWpHd01EZ0RxVy9Na2d5dERBd01ER3dNalBBQUxNQUF3SUVwTG1tTURnd0tINWdZSHp3L3dHREh1TnJCdlVHQmdaR2tCd0FqNllMU0hpY3RaQzlMa1JSRklXL082N3h6eDJHWVF3ekVsSE1OQk12b0JLTnFJUW9pVkJLSkJMeE1sU2ltbkpvS0dpOGd4ZVFVQ2gxeTdvL2padXJ0Sk8xOTE3bjdIV3kxd0VHU05FZ2NDWUl6WUtFaDd5N3J0TnlOKzF1bFRVNmRObGdreTIyMldHWGZRNDQ0cGhUempqbmdrdXVyUHI4UW9wZlk4V2FkazZ6WjgyaE5TZkZHbjNyVFI5NjFZdWU5YVJIUGVoZWZaLzNqRnYxZEtjYlhhdWpkcFJ1MnFVNFdobnlVYmUzcGoxRjFLaFF0ZWN5cWZuWWY4bXBsRlBFbC9WR00yVFp6V0E1UGxyOFBUR1U1R0ZHNGpMS1dFTEhtWmhrS3B1SWF2N0VTalZqczhscVN6RFBRdEh1TThiY0g3NytKWDRBNi9ZN053QUFBQUFBQWYvL0FBSjRuSjFZZVl3a1YzMnUzM3RWNzlWOUgzMTNUL2YwTWRNelBkTm56ZUdaMldOMnZZZnRYWGJYRjJ2dnJ0YzJ1dzdHRGtaQURBUkkyQkNoaUZoMmhMMUJjc0FLaWNMaGtFZ0pSSkV3UkVGS0xNY1JvQkFuVWtLd0VzRmk1QUFTT0lxVHpPVDNxbWNka3Y5STEvVDBPNnBldlhydiszM2Y5eXNKSkduMzIwU0NiMHRFa2p5WUlkSU9WbllrOFpHeDc3dndBN2dtV1ZKRjZrakxralFPaG9NSzRUWjBnVGVTWVRvY1ROSkpPOTVyQ0VSRDBzTnlzZ25wYURKdTNQdHlmcm50cU01YnRzL1ZyZ3l2MU00ZHV0KzFaMTNkZWN1aHUyY2Vldjk4dkErNG5IUDN6ZWE2Q2xtdnd2TkJhNzE5K09UVjlLbVRodzUxVy8xREo1OEM2eHh4L1BkQm93QXlTR1IzZC9jYXp2ZDdVazNheEJtUEpsdkFvakNwMENoa2pYcXJ6ZVBFSnFKQVcrTmtOQmtPNGlSdHRRZWJJRXBCakdjNU1CbVBXdTJXYTkxZit5V25VUFliU1dWL05GZGVWR0pQdFNKNkJsNXFSUGt0dTlycncwS1paeTJ1ZFN4M2RPMTJlQWhydVdiLzNGQ3hvNklUNTVMZ3JPc0NrejBUTGpDYUJKSHYzSkZUVGVaYU81OWtGRS8yWnVkWGpnVVZTY1o1ZjRlY2grOUtiZWtHNmJCMEN0ZHlORm1IMW5pVWlubG5GZDZvUUJUaVlrWmhuSWhpMXBPR01TN3plTlR1c1hhcjBXSnBCWWJ4cEVlWU1oNk9oOUV3YWtTTjhkbjl4VWhWOVBIMm1ja25aZ2U1NG1KZ2xPeHE3c3lSN1hPck55eHVwQlJrbFZ1cUw0ZkIwcUU2RzFRcnMvcHdZeFptTHVVdlhjcHZMeHdPYzQ0REI1ZVhEaGUwWVcxcDF2WXRyYUxIdlVadmV6anZ6ZllYbXpwWGRKMFppa2taOVA5emJnM1NONjJReVVoY2Z1bVNCQklnVm40Vi9oaHhJcVdqRlBkZlBOTUFGNXhuRDhXNExUZnFyQXU0TmRreEJtYnU3M2IyM2JHdk16bmFKQXIxYTBFTFFJSE53a2xGa3kwdE9HWEVDMGU5Mm1CaFkyTmhVQXZ1U3BkVVJWVXRWVmJBc3pXVHFtcERvb2pSYS9BczR1RWg2ZjNTUndRaVVvVGtPb2dWMjRDOVNwekV5UUNoR1UrUE42YURVOFNKaXJOam0rQ2lzeTUxbExCQ3BwZFBwem1xUjZFRGpEZnEyYng3MEc2bDQzVFU1d0oySVQ0UFo4cGtHQ2VqZGdPTHFxeHB6ckpxTU82elNLK0VJYldOWXREM0lxYklsS2cyZDZ4Y0dLWnRQV2VxbGswQWdCQ2dpdmpJV0pKbGgzcGxMd2dYM1NMUlpjV21wck8vYVhJMW9JU2VBd2JLc205U21ESE1KS2dTaDZ0d0xOUTVWUXpWTUN1V1ppZ1VWRFVoakxOUzZVU3ZFdHQzek1kRmw1UENmRkkwOEY1VVZxbXNVMUZTR05jVVl1ZmJSYnk5UGdTb0Z5MFRVZUl5eHo4ZmVZZmhMcUNHYmN3ckRKNGtvSFpCTjVBVHFNQXhITTl3dlBuL1JuRzJhb2hqWE9jMGE0TnM4YUx3WjRBeFhhZzNCSkJKMmJOQkdWWkl4Yk4vUmh6bmNvampRbHhXdGJrVktFUmxWVHpmZisyK1FsejREbktlSjgxTEVoRWNNb1VNenBwNlEyOGR4Z0xmdzBFWmhnZ1NuSGpVMzRCR0hOTFpjc24zUEw4TXBkSWpXMitYMVhLOCtzaVI5UVBOdHdNOFBweHh2V0xlOVhiZUM3ZnRmT2JMdnU3bGJ2N2lWMis2WlFWZzJmMHNSczkvU0czeU5uaE1laEluTVVXd2dHeTZoc0dPN0lhd3JUQUU4MGlzRm1sdndqcXQwamhCQk9LeUNTUWl3RGZwZUxJbFoxZUt0UjVVSUp1M2pYeE5rekFiSTNzT2dXU2NkUVBCVEVXdmFNQXhzU29qS0JET0NrY2dJUmNxQnFOYzRSQ1dnRkdtTUVadG9sTE5sWG16YXRtV2JlaGN6Z0FNeE1MSXBIb3VoeWVwcXFIb2xzZVZ3SFoxUW56Tkx5bGdNZ2FVeVRvMG83Q0FWeHE2WnVtMDNxU1dabk9URTVuWDdhQ3p2NVdNbDBHVkdZVjNpM0FBb0VUWFBEby9SMVNGeXpLR3lxcXV0bXdtcHFJaG1ybHVJcDY5U0RGTlRVOVVxc29XVkVlbWxVME15VVNtc2xOMmNnME9ydW93bVd1eUJqUEZvdUhKWXRKS2wzaWFDcVRRNENhUloyYkwyL2RRVDNOc3hQbFVGOStGdXRoSGpPTnlwc2hiNHFjSEd4QVBld0lEdUw0QzhRaVBTY3E0K0VhaFRYRXhIZmZOaCtjT21ycnR1NHZyeFZxeDZpLy8yZ2w2ZkxMU1dtemE4ODFtdmwzWnZPM1JRMjg5V3lBcmd6WlIxQ005NG5xck00M0sraEhaczhZM3pXbkpVbDV4MnlWdmRQbjgwWVcxNlh5dWtlUEljL3VSNHpicEZvajdWaFFNc0V5REVSYXRiRmV4UEJ3TXB6dHR5NXpWQldFUjNGOGJlR2xsZmtiVkdOTlZ5N00wcGxJdk5NeUZnZ1Z5ckhBL2I2NHVMREkyRGpTcWo3YU9Ub0s0V1U5VTdaUXFlQ0N4NGU2WlVjbWxncTN5MVc1endkNDNXZTNuWTZZVU9iRVBkcXJ5ZkpoM3ZOR0RaNDR2V2lhU1RnQ0dqalJEVGYyNmw3aEdmZ0huSHlCenJFc25jRlV4aUxZRVZoUGVneVhBeWR0WVJ6NGUvdSsyQUJlNmltdU9HcDRpcXppQThQMC9iUTJPYlJOLzZQbjUwaWllK0l1bTdibHFjWDB3OWtlZVZ5aU80ckcvYUZtK2cyMHZqZ01zWnQzTzJCKzdYcUUwYkkrRGhheXR0SVp0STk4dEZrYlY1M1JrVEVXUG5uTThnaC96ZTgvcFpsYTNmUUZOYytjSFg3SjlSRDh4ak9tcEJxaGYydXN6eExsTWs0UStTWWZJVnhCSHgvR1pUK1BlNFk1VnlUQ0p5eEFLVWVIMU1zd2dqWFJKZlFOYTZHWW0rUHo0SDdXcjFVZFRGY1pWT3VSdDBiYThDYUlWeitSUk02RnRuaWFjRWdTNnR2b2JHREZrMVdHZ0liY2Zrd0ZyeWk5dks3SkdLZnlUaUNSVFcvKzVkMFpjYmxDc2tOZGxJUGVjbjYvWlpJWEE3K2tVeDFEK2dQR0xzaWlVeW9Ud3k0QVJ3dDRqYTdLaWlsM2srSmp5ZlI4akJzaVVDeDFKNmM2MzRPSUtXWkV5YjNPTkRIRnZjOUx0MG1YcG8rZ0FKb0tDaEF1WXhFSnJRVGd5REpZdEdFMkVKS2NDcjExQVRESXUyc2ZUYmE4b1pScnUwUlpxR1BKVG13bDZhazNWWXpoSk44bUcwSTVrT2txbTZObENacVEyRFFPaEpCd1ZaeGtJKytDVDk5OURkY0kxcmprTEQ0NU8vdnFLVEQ1ZXJ4Ym43Q28zRXRuTFU2S3RhZHAyejFxYlVUU1VZT0RJWTNLWE1nMDVVQ2Zsb3AvdkRPNElQWlRleUdRS1ZKekZsNUR0ak5CWGxFUWhvWWNCZ1NRVkVKWm9wbWxRY2xhV2o3WFFxVkpMWVZxaHZESWt1QmRQTkFhV3FSQ2l6UmdPQk1pS0hBL1NXeUFWeGRSOEZoUFhQbWZGT3JLdVRKdFVrVkdlSEZyanluSWE1b0RGV3VLNGxteDlIUWVnQ3ZJV2tqSDErdzdlV1Y3MHNBSzRwU0E0NGpIMFFyK2R4WmlVb2prVWFoeWhTS0pRWlNieHNST0graWRPY1BQaXhYdS9lYkUvUG43UnRRWVhYMzAxaTgvZGY5LzlJZUdvZXdicVhpUVZKYW1kdHRNRUlaYnd0Z1BqSkMwRFRkSTJNaytTUnV4dGIvdkU1YmQrL1A3N243NThlYkI4K2NtbnJqNkZzN2swZXVuMDZjdDMzbm52bWR2UG56eFpMNWRPd2hkZy9keDl0KzA4OEFVNFdhM2hmVERMMkgwRmR1SDdPRWQwRHplQTJNZHNHN01kRng0ckZXS0c5THBudjlMV2xCQW1nbVluR1BSOER4MGNkLzRONXR2YmRqekN1Zk5MRHl5ZG00dWl1WE5ZT0Q4WGR1Y1BSWVpkOEpjS3BtMG9hcEN2YmxSRDMrWGNNZ29sTng4Vm9vUGRlYzhybHp0ejNibjVkcVhzZVYrOHZIeStFMFdkOC8zNyt4Zm13bkR1d3IxSFZsZVN1YXFGOUdlVWo3YUxsUVpobm9xR2pnRTBLc1gyYWhtbGhOaVZ1V1IxOWNhRkRvN2krcjVicnJRN0Vzczg2c3U0TDIxVWszWHBvSFNqOUFEeVh4aG5Mck14RDQyV2NCVDRKQmdZYURQd1daZ3dUMExYYlpoa1dZeHdVWHhxcUZtOTVZc1NGaWdtQU9rdzZxTzRaMTVxaTJTQnNBU2pOdTUvWTR5N3ZuVjIzNzVGeElkcE5nZXlvK2FyTkZkcVQvS2hiU1dsemRoeFl2eEd4V1lSL3o2VGErUnlEWHM3VnlaT0dEQ08zaFhsRldJVDJROXBZMmxwczV6TzlIb3p0WjVSY01obzFqYW92TzY2NDFadXp2SkRQelRxWDZ6bmN2WGNIMWxCWU5sQkFGZkVlTG1kYjczMjJwODk3c1k2UTMrcnlFTU93UEg3NkhocGFlcmZTUmZYWmhZemh4UlhwYlVwYjBGa0s4NDByNU9yRVBXVXNlS2xYaUJrclFvOEdXZmlBTVg1MGFocldlVitKV2R5NFJWWXNUNWIxdlRCeWY2c3E0RjgxS05CR0J0Rzk1T1Q2Rml4K0hRdG5TMjVCcEF0NHNiNUhENGZWdzNkejBVV2t1WllLZFNhamJMNk9manJ3VTRIdU9BQjFldjhZalV1RXNIaFhQZ0JlQUo1bkdPRU9JamVCR09rS2tuUk9PRXp1QXRORExFeFJrdjdwNzRZS3J5TmNkSForZEh6enl2UHkxODIvOXg2T240MnViM3hybG16TzlPdC9TMTg3ck4vOC9Qenh4ZkM3b1B6NmZ4dk5TKzN2cEgvVlA2ZitWL3dMRlo4U1NjSi9JbTBJWDBBSXpxK25yK2trNzFqRC9yL2M2QTJYSStENndmU1l4TEc2ZWlOaTVBMkp4VlpqRE44b3lrUlZuSTZ1cURmNjlmdURidmNDaGt6M1VwM2JyUTZUaGZtNnpyaktERklSVlkrcmxhYllXSmFDbEZkUlFnRk04MGtidGNxVWFqaG85ZFJJTGxIRFkzN0xsTU1xbE1WYkkxemJtQUNyZHNLVXloVndzaHhmWTJGNEdzQWZyKzdpa3pmNnFLMWdBZFY3cGc1eTBaanlqeXZvcW02cWprc1VPU1ZmbmUyRVJwYytEamNlVVZ6aXZPZDBXQVZzMExSRUtNMTVHRko4V3cxcDZCZ29hVUJSNmFnbWFXR1lSUEJ5U0E3a1J2RXJ0YWtWWjlBTFhBUm5JcmpsYmhHaFY5NVFxclF5L0I1M09PMnRDU1VHK29NY1lmTE8rNlBXaGlnZlF5N3pIeGwvMGN0dWQ3S29qTGUrMDNhNlhqU3c4eXh6OXY5SG1wZDBrOTRuMVdRdFBwcGd0ZHVRcHZrT3dkOS8wQm5xZVVtSHB4YTZ4encvWU9kdFZPbmRuNTRlREE0M1AvTDdQOXJSNDV3MlUvNDVoWlBmTXFPSEVINlIzUnRZazNtc0RKWHI4K1YzbTI0cnZISzJwdEU1ZlE3VDczY3o2N00vbTljdUFCYVlsSHQ5R21OV29sMnp3VTl0cWMxTzBaM3BpQzIvd0hqKzl1WlQxTWxVM0xScC9UVGlDZFJlNXcySXd1aTV2Z2IrUGsrSkR2Znk3NVBsVitBK0lYeTUvOWw3c2MwLytQT1gwMDluaW41OEJOY3M1NjBMZDBsUFN4SkFlWkpFd0VwZ2JKTndOSWIwT3BsMUI4UDQ2eG5DbVZsZ2dpOGZrSjkzTm9ENTJCNnBRM3QraDRpczNZK21VS1doM3RJN1lGSkhNM25iSjhQY0ZTVEEwM1RhTzV1eDNiaWZGMHpDSHBnSDJMTDFGSE42VmxIaGljMER6ZWR0NXA1MStZSWFEVk1xc1VSMFJWRk13bmlkSEdtN0tNb0U2S2F1ZWE3Wkc3bE9uMExYRU1MWm11dXl1QTNOUXM4KzFOZEFsL0phYXBNQTMzdFd0c0x1S3FBcXpraUJUSDBQTFhRVmZ6anJCWlRwQlJmQ1YyUnBSTjBHSjRmKzc4aTBPcHBPQTVGN2NmMEZqTVdtWjlHUWRmY0F2TmNKak96a0hOVXRKS1NzdnY2N3QvalByMk1IS1FqTnhTa3VpUTFHN3lSRHBQR0V2QlpvUXdJUFZablFsb0VTTE5mbUR0dEhML3o1SjAzRndzRktGMTk2ZXJWbC9MUFBQTElNNCs4NTRsTGw1NjQ5RXo3MVZmUDNucnJPMFQ3MVFPUGlKNExsMFNQdEhmUGY0Ti9oYTlMTVdyWERaaDkzSWlSMEFPeDRnd1hQb3FqQ21RK0w1MVFocHVRYlRQdUZQWXkzSnU5NmlSN041Q1p3YmFnOVhRaWNuNTRKVG5XcVJRZWVLYW9HL0hqRjg2OGswTFVmVzNmQjVvdGRhSHp2aFNjK01ZSE5QWFdqY01QR05Rb3d5Mkh6bXhzZGpvSEFONnh2WjAvcHBCbUJUNWRDU3lkeGZkZXhqU2hCRysrVDFldjNGbXIzN1R6aDBGL2RlM0twTjlJUW9mcXR4NWJlNnVxdituR2hNT0poNzU2dzF4bkg4Q0J1ZmxIemYwSExCSnNvWmFMWjFVem5mNG1hbEZKdWxXNlQzcFFlbFQ2aVBTTTlLY0N4M1E0dFNIQ2JncmJLbkptRVA1RTVJQlpKck5KcG5ETlRxc1FSS3g0MTJoVGdkbEdYYnhDRWthNG5iMUhTcWNwKzNEY0Z2Nk1YNWR6THNiQ0JDQVNkaGxadXdwREllRjRvdzFvQkQrVjJrVmlzR2t3akpLUmVDZUx4dGxXdWlBeWVTQ203YURReGw2SVhqRkJvVE4xMTZHa2pwbG1ZdG1RcitpYTY0V0s3Q0lBWlhkVVJuNUY2TEc0UEtvR01mY01TOUcwdkJscWtQTjhkaEM0VWQ1ZmJqZzVxdFo2dFZyUFJycDFTZ1hWSk9jY1ZUMVdxOG9NcWtVYUJ6NlZZOWRVUWk5SDVaTEI0YTRWcjJCaHBDbXE0V2swdEN5VHdtSlF0Rlh3dzFCRlNxN25aWnhTMmRGVTVjY2E1dDF4SHZPb3FPYTdocEZSTlFzbnNWNHA1ZEdTYTVHQjlvR0k1RVZrN3A3bkgrYmNkV0wyTkhRakE5aitYbS8vMHVzWU9wb3Q3ek1VUzdjb2VmZ01vT2MrQmtvdUh5bjVFRldqbklUb21XTTNWajk2c3hPTE9GV29hOWc2Wmprc0gwcVo1bjV3OTNVNEMxOURmWjlCcEdkT0xFRW9vNzNhUWhzZDR1L1lHOUhyTDdzaU9ITjRjdVNXdXpFajZqSnlwaXEzNUY1aHB0ZXRWdUZycDQ2ZmJ6d3JNK1hUbjFZVWVJSHRTdU54bXY2ZEpGbVNzL3NhL0FoZXhEajIwRVcwTUxJMk1LNU9TM2RMYjVIZUxyMVh1aUpKc3dJU050VFRFSmt3RTVUMm5nK3N0NVRyanBDMW1xSllnZXpWZDlhUVpuM3Buay9FbUt0UDMxR0lPcDBPaEtYSnRITTQ0RytZeTlhMEJ3c2p2cWRnREE2R2xSaWk4dFhJZHFLb0dqd2JPWFlVbGFPZEYwTTBqYUlDUTFHQ0dJc2Z4cFB3Wk1jSkR6cFJYTTY2STl1TzhJUXdLb2Y0d1RiYnVScG03VTc0bmtvWVRrK09zUFJ3T1l4SzRZZHh4QkRQdlEwdktVWGhiVzRRbGlJYzB3N3hON1R0RUdMYkNYQW8wVklPcjJCVEZGbE91UE13OXVQTndvL2hUeWxzT0tJM2VGMWNFWmFXQXl4WEF0UTVTN29MWG9XTG1LZFdwYTQwa05Zd3NqRlNZOHhVQ2FhWWRxWXhRa2NtcVBSSWFuRmFJVk50R1UwNHFoaHJUN0NLSFJYNHJGcjB1ZW1hcWxmRWZOaDI4ODJpWjZneStWQ2l4Nk5HOHBQZXVwSm96a1FsVURLNmREV3RmbWl5WnJRNGE4RkZSQ2ZUOGMrU25ZUDFmakJESzJFaFhOajNZdm5JeHBMeU83K3JiNStlZC9YbXBqdTc5UHZXU003blc2MWN6bHBTMVo0ay9UYy90WGlQQUhpY1kyQmtZR0FBNHFvb1k1NTRmcHV2RE54TURDQndycExqREl6Ky8vUC9UZVlNeHRkQUxnY0RXQm9BS2xrTUtYaWNZMkJrWUdCOC9mOG1neDRMdy8rZi94aVlNeGlBSWloQUhnQ2sxQVo1ZUp4allvQ0NWUkNLOFJNREF4T1Fab29Ec2pzWUdCblhBR2t2SUYvay96K20zUDkvbUVxQmJCQy9ISWdQQWJFUlVINFJRejhUMi85ZklIMk1ENEJpV2tCNkl0Z2NJUllHaGtsZzh4Z1llSmdZL3Y4R1ljWXJZSDREQXo4REx3RGNBQlV1QUFBQUFBQUFBQUFBQUE0QVdBQzBBU1FCWUFJWUFvZ0N4QU9NQTlRRU5BU3dCU0lGNWdZRUJqZ0dzZ2RBQjVRSHpnaU1DUUlKSmduV0NoQUtoZ3VJQzdvTWRnelllSnhqWUdSZ1lGQmsyTTNBeXdBQ1RFRE15QUFTY3dEekdRQVpJZ0V2QUFCNG5IV09NV29ETVJCRjM5cHJoK0FRVW9XVWdqUnBkcEUyamZFQjlnQXAzQnNqbGdYYkF0a0dueVJWanBBeXg4Z0Jjb1FjSTkvcmFWSllNT2pOMTUvNUF1NTRwK0I4Q201NE1CNkpYNHpIUEhNeUxxVi9HaytZOFcwOGxmNHJaMUhlU3JrZnBzNDhFajhaajJueHhxWDBEK01KajN3WlQ2WC8wTE1tc1ZVbGR0Q3Ywellsd1J1UmppTWJWbVMxc1R0dVZvSjI4QjJHTzhzUmNUVFVTbk1zVlAvM1hiUTVGVUdPU2s0dmV0V2F0RHUwS1hmUk5iVjNDMmU1b25rVmZOWDRJTk8xdnkyVm10bnIvWklSaG55V01lOTc3UWkxdnpyN0J3RHZPZE1BQUhpY1kyQml3QThVZ1ppUmdZbVJpWUdkZ1plQmowR0pRWU5CaTBHZndaREJuTUdTd1lyQmhzR0Z3WlBCbmFHUXdZc2hpS0dVd1pVaG1pR1dnWVZCbUlHVklZS0JrNEdOSVpTOU5DL1R6Y0RBQUFEcGh3aGFBQUE9KSBmb3JtYXQoJ3dvZmYnKSx1cmwoJ2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9hc3NldHMuYXV0aDAuY29tL3cyL2ZvbnQvem9jaWFsLXJlZ3VsYXItd2ViZm9udC50dGYnKSBmb3JtYXQoJ3RydWV0eXBlJyksdXJsKCdodHRwczovL3MzLmFtYXpvbmF3cy5jb20vYXNzZXRzLmF1dGgwLmNvbS93Mi9mb250L3pvY2lhbC1yZWd1bGFyLXdlYmZvbnQuc3ZnI3pvY2lhbHJlZ3VsYXInKSBmb3JtYXQoJ3N2ZycpO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0eWxlOm5vcm1hbH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYXV0aDA6YmVmb3Jle2NvbnRlbnQ6XFxcIj9cXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5hdXRoMHtiYWNrZ3JvdW5kLWNvbG9yOiNmZjQ1MDA7d2lkdGg6YXV0b30jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYmxvY2t7ZGlzcGxheTpibG9jazttYXJnaW46MTBweCAwO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7b3ZlcmZsb3c6aGlkZGVufSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wcmltYXJ5LCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnl7bWFyZ2luOjA7cGFkZGluZzowIDFlbTtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDo0MnB4fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wcmltYXJ5OmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5OmJlZm9yZXtkaXNwbGF5Om5vbmV9I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnl7YmFja2dyb3VuZC1jb2xvcjojNzQ3ZTg1fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnl7YmFja2dyb3VuZC1jb2xvcjojZjBmMGViO2NvbG9yOiMyMjI7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuOCl9I2F1dGgwLXdpZGdldCAuem9jaWFsey13ZWJraXQtZm9udC1zbW9vdGhpbmc6YW50aWFsaWFzZWR9I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXl7cG9zaXRpb246Zml4ZWQ7bGVmdDowO3RvcDowO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7b3ZlcmZsb3c6aGlkZGVuO3otaW5kZXg6OTk5OTtmb250LXdlaWdodDoyMDA7LW1vei11c2VyLXNlbGVjdDpub25lOy1raHRtbC11c2VyLXNlbGVjdDpub25lOy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTstby11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmU7YmFja2dyb3VuZDojMDAwO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwwLjgpO2JhY2tncm91bmQ6LXdlYmtpdC1yYWRpYWwtZ3JhZGllbnQoNTAlIDUwJSxlbGxpcHNlIGNsb3Nlc3QtY29ybmVyLHJnYmEoMCwwLDAsMC40NSkgMSUscmdiYSgwLDAsMCwwLjgpIDEwMCUpO2JhY2tncm91bmQ6LW1vei1yYWRpYWwtZ3JhZGllbnQoNTAlIDUwJSxlbGxpcHNlIGNsb3Nlc3QtY29ybmVyLHJnYmEoMCwwLDAsMC40NSkgMSUscmdiYSgwLDAsMCwwLjgpIDEwMCUpO2JhY2tncm91bmQ6LW1zLXJhZGlhbC1ncmFkaWVudCg1MCUgNTAlLGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIscmdiYSgwLDAsMCwwLjQ1KSAxJSxyZ2JhKDAsMCwwLDAuOCkgMTAwJSk7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoNTAlIDUwJSxlbGxpcHNlIGNsb3Nlc3QtY29ybmVyLHJnYmEoMCwwLDAsMC40NSkgMSUscmdiYSgwLDAsMCwwLjgpIDEwMCUpO29wYWNpdHk6MDstd2Via2l0LXRyYW5zaXRpb246NDAwbXMgb3BhY2l0eSBlYXNlOy1tb3otdHJhbnNpdGlvbjo0MDBtcyBvcGFjaXR5IGVhc2U7dHJhbnNpdGlvbjo0MDBtcyBvcGFjaXR5IGVhc2U7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApOy1tb3otdHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDAsMCwwKTstbXMtdHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDAsMCwwKTstby10cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApO3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCl9I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkuYWN0aXZle29wYWNpdHk6MX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucGFuZWx7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7LW1vei1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6NTAlO2Rpc3BsYXk6bm9uZX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucGFuZWwuYWN0aXZle2Rpc3BsYXk6YmxvY2s7LXdlYmtpdC1hbmltYXRpb24tZHVyYXRpb246NDAwbXM7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2U7LXdlYmtpdC1hbmltYXRpb24tbmFtZTpzaG93UGFuZWx9I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLnBhbmVsey13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uOjQwMG1zOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlOy13ZWJraXQtYW5pbWF0aW9uLW5hbWU6aGlkZVBhbmVsO3dpZHRoOjI4MHB4O21hcmdpbjowIDAgMCAtMTQwcHh9I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLmVtYWlse21hcmdpbi1ib3R0b206MTRweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucGFzc3dvcmQsI2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLnJlcGVhdFBhc3N3b3Jke21hcmdpbi1ib3R0b206MTRweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAuZW1haWwtcmVhZG9ubHl7dGV4dC1hbGlnbjpjZW50ZXI7ZGlzcGxheTppbmhlcml0O2NvbG9yOiM0MTQ0NGE7Zm9udC13ZWlnaHQ6Ym9sZDttYXJnaW4tYm90dG9tOjI1cHh9I2F1dGgwLXdpZGdldCAucGFuZWwgLnNpZ251cCAuaGVhZGVyLCNhdXRoMC13aWRnZXQgLnBhbmVsIC5yZXNldCAuaGVhZGVye21hcmdpbi1ib3R0b206MTVweDtmb250LXNpemU6MTRweDtjb2xvcjojNDE0NDRhfSNhdXRoMC13aWRnZXQgLnBhbmVsIC5zaWdudXAgLmZvb3RlcnttYXJnaW4tYm90dG9tOjE1cHg7Zm9udC1zaXplOjEycHg7Y29sb3I6IzQxNDQ0YTt0ZXh0LWFsaWduOmxlZnQ7bWFyZ2luLXRvcDoxMHB4fUAtbW96LWtleWZyYW1lcyBzaG93UGFuZWx7MCV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsMTAwJSwwKX0xMDAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtd2Via2l0LWtleWZyYW1lcyBzaG93UGFuZWx7MCV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsMTAwJSwwKX0xMDAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtby1rZXlmcmFtZXMgc2hvd1BhbmVsezAle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk1KSB0cmFuc2xhdGUzZCgwLDEwMCUsMCl9MTAwJXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALW1zLWtleWZyYW1lcyBzaG93UGFuZWx7MCV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsMTAwJSwwKX0xMDAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9fUBrZXlmcmFtZXMgc2hvd1BhbmVsezAle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk1KSB0cmFuc2xhdGUzZCgwLDEwMCUsMCl9MTAwJXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALW1vei1rZXlmcmFtZXMgaGlkZVBhbmVsezAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX0xMDAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTgpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC13ZWJraXQta2V5ZnJhbWVzIGhpZGVQYW5lbHswJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk4KSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtby1rZXlmcmFtZXMgaGlkZVBhbmVsezAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX0xMDAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTgpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC1tcy1rZXlmcmFtZXMgaGlkZVBhbmVsezAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX0xMDAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTgpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QGtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWx7YmFja2dyb3VuZDojZmFmYWZhO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQoI2ZmZiwjZmFmYWZhKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KCNmZmYsI2ZhZmFmYSk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KCNmZmYsI2ZhZmFmYSk7YmFja2dyb3VuZC1pbWFnZTotby1saW5lYXItZ3JhZGllbnQoI2ZmZiwjZmFmYWZhKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCgjZmZmLCNmYWZhZmEpO3otaW5kZXg6MTA7LW1vei1ib3gtc2hhZG93OjAgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4yKSwwIDEwcHggMjdweCByZ2JhKDAsMCwwLDAuNyk7LXdlYmtpdC1ib3gtc2hhZG93OjAgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4yKSwwIDEwcHggMjdweCByZ2JhKDAsMCwwLDAuNyk7Ym94LXNoYWRvdzowIDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMiksMCAxMHB4IDI3cHggcmdiYSgwLDAsMCwwLjcpOy1tb3otYm9yZGVyLXJhZGl1czo2cHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjZweDtib3JkZXItcmFkaXVzOjZweDstd2Via2l0LXRvdWNoLWNhbGxvdXQ6bm9uZX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWw6YWZ0ZXJ7Y29udGVudDpcXFwiXFxcIjtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7cmlnaHQ6MDt0b3A6MDtib3R0b206MDt6LWluZGV4OjE7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgLTFweCAycHggcmdiYSg4Miw5MywxMTIsMC40KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAtMXB4IDJweCByZ2JhKDgyLDkzLDExMiwwLjQpO2JveC1zaGFkb3c6aW5zZXQgMCAtMXB4IDJweCByZ2JhKDgyLDkzLDExMiwwLjQpfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXJ7ZGlzcGxheTpibG9jaztwb3NpdGlvbjpyZWxhdGl2ZTttaW4taGVpZ2h0OjY1cHg7b3ZlcmZsb3c6aGlkZGVuOy1tb3otYm9yZGVyLXJhZGl1czo2cHggNnB4IDAgMDstd2Via2l0LWJvcmRlci1yYWRpdXM6NnB4IDZweCAwIDA7Ym9yZGVyLXJhZGl1czo2cHggNnB4IDAgMDtiYWNrZ3JvdW5kOiNmMWY0ZjY7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudCgjZjFmNGY2LCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQoI2YxZjRmNiwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQoI2YxZjRmNiwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudCgjZjFmNGY2LCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KCNmMWY0ZjYsI2U5ZWRmMCk7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgcmdiYSg0MCw2OSw4NSwwLjExKX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyOmJlZm9yZXtjb250ZW50OicnO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDo1cHg7Ym90dG9tOi0xcHg7bGVmdDowO3JpZ2h0OjA7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudChyZ2JhKDQwLDY5LDg1LDApLHJnYmEoNDAsNjksODUsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChyZ2JhKDQwLDY5LDg1LDApLHJnYmEoNDAsNjksODUsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChyZ2JhKDQwLDY5LDg1LDApLHJnYmEoNDAsNjksODUsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSg0MCw2OSw4NSwwKSxyZ2JhKDQwLDY5LDg1LDAuMSkpfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXI6YWZ0ZXJ7Y29udGVudDonJztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6NHB4O2JvdHRvbTowO2xlZnQ6MDtyaWdodDowO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQobGVmdCwjZTllZGYwLHJnYmEoMjQxLDI0NCwyNDYsMCksI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQobGVmdCwjZTllZGYwLHJnYmEoMjQxLDI0NCwyNDYsMCksI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTotby1saW5lYXItZ3JhZGllbnQobGVmdCwjZTllZGYwLHJnYmEoMjQxLDI0NCwyNDYsMCksI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQobGVmdCwjZTllZGYwLHJnYmEoMjQxLDI0NCwyNDYsMCksI2U5ZWRmMCl9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBoMXtwYWRkaW5nOjIxcHggMjBweDttYXJnaW46MDtmb250LXNpemU6MThweDtjb2xvcjojNDE0NDRhO2ZvbnQtd2VpZ2h0OmJvbGQ7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RkZTNlNn0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGF7ZGlzcGxheTpibG9jaztvdmVyZmxvdzpoaWRkZW47dGV4dC1pbmRlbnQ6MjAwJTtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxMnB4O29wYWNpdHk6LjQ7cGFkZGluZzo1cHg7ei1pbmRleDo1fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYTpob3ZlcntvcGFjaXR5Oi42Nn0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGE6YWN0aXZle29wYWNpdHk6MX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGEuY2xvc2V7aGVpZ2h0OjEycHg7YmFja2dyb3VuZDp1cmwoXFxcImh0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9hc3NldHMuYXV0aDAuY29tL3cyL2ltZy9jbG9zZS5wbmdcXFwiKSA1MCUgNTAlIG5vLXJlcGVhdDtiYWNrZ3JvdW5kLXNpemU6MTJweCAxMnB4O3JpZ2h0OjE5cHg7dG9wOjIxcHg7Y3Vyc29yOnBvaW50ZXJ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBhLmNsb3NlOmhvdmVye29wYWNpdHk6LjY2fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgaW1ne2hlaWdodDozMnB4O21hcmdpbjoxNnB4IDEwcHggMTBweCAyMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO2Zsb2F0OmxlZnR9I2F1dGgwLXdpZGdldCAuYWN0aW9uIC5zcGlubmVye3dpZHRoOjEwMCU7YmFja2dyb3VuZC1jb2xvcjojNmE3NzdmO2JhY2tncm91bmQtaW1hZ2U6dXJsKCdodHRwczovL3MzLmFtYXpvbmF3cy5jb20vYXNzZXRzLmF1dGgwLmNvbS93Mi9pbWcvc3Bpbm5lci5naWYnKTtiYWNrZ3JvdW5kLXJlcGVhdDpuby1yZXBlYXQ7YmFja2dyb3VuZC1wb3NpdGlvbjpjZW50ZXI7bWFyZ2luOjA7aGVpZ2h0OjQ0cHg7Ym9yZGVyOjFweCBzb2xpZCAjNzc3O2JvcmRlci1jb2xvcjpyZ2JhKDAsMCwwLDAuMik7Ym9yZGVyLWJvdHRvbS1jb2xvcjojMzMzO2JvcmRlci1ib3R0b20tY29sb3I6cmdiYSgwLDAsMCwwLjQpOy1tb3otYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC40KSxpbnNldCAwIDAgLjFlbSByZ2JhKDI1NSwyNTUsMjU1LDAuOSk7Ym94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTstbW96LXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTstbW96LWJvcmRlci1yYWRpdXM6LjNlbTstd2Via2l0LWJvcmRlci1yYWRpdXM6LjNlbTtib3JkZXItcmFkaXVzOi4zZW19I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGZvb3RlcntkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlOy1tb3otYm9yZGVyLXJhZGl1czowIDAgNXB4IDVweDstd2Via2l0LWJvcmRlci1yYWRpdXM6MCAwIDVweCA1cHg7Ym9yZGVyLXJhZGl1czowIDAgNXB4IDVweDtoZWlnaHQ6MjVweDtsaW5lLWhlaWdodDoyNXB4O3ZlcnRpY2FsLWFsaWduOm1pZGRsZTttYXJnaW46MCAxNXB4O2JvcmRlci10b3A6MXB4IHNvbGlkICNkZGUzZTY7ei1pbmRleDo1fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBmb290ZXIgc3Bhbntmb250LXNpemU6MTBweDtjb2xvcjojNjY2fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBmb290ZXIgYXtmb250LXNpemU6OXB4O2NvbG9yOiMzMzM7Zm9udC13ZWlnaHQ6Ym9sZDt0ZXh0LWRlY29yYXRpb246bm9uZTtjdXJzb3I6cG9pbnRlcn0jYXV0aDAtd2lkZ2V0IC5saXN0LCNhdXRoMC13aWRnZXQgLmljb25saXN0e21hcmdpbjoyNXB4IDA7cG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDo1fSNhdXRoMC13aWRnZXQgLmxpc3Q6YmVmb3JlLCNhdXRoMC13aWRnZXQgLmxpc3Q6YWZ0ZXIsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3Q6YmVmb3JlLCNhdXRoMC13aWRnZXQgLmljb25saXN0OmFmdGVye2Rpc3BsYXk6dGFibGU7Y29udGVudDpcXFwiXFxcIn0jYXV0aDAtd2lkZ2V0IC5saXN0OmFmdGVyLCNhdXRoMC13aWRnZXQgLmljb25saXN0OmFmdGVye2NsZWFyOmJvdGh9I2F1dGgwLXdpZGdldCAubGlzdCBzcGFue2Rpc3BsYXk6YmxvY2s7bWFyZ2luOjEwcHggMDtjdXJzb3I6cG9pbnRlcn0jYXV0aDAtd2lkZ2V0IC5pY29ubGlzdHt0ZXh0LWFsaWduOmNlbnRlcn0jYXV0aDAtd2lkZ2V0IC5pY29ubGlzdCBzcGFue21hcmdpbjowIDJweH0jYXV0aDAtd2lkZ2V0IC5mb3Jnb3QtcGFzc3tmb250LXNpemU6MTJweDtjb2xvcjojNjY2O2ZvbnQtd2VpZ2h0Om5vcm1hbH0jYXV0aDAtd2lkZ2V0IC5jcmVhdGUtYWNjb3VudHtkaXNwbGF5Om5vbmU7bWFyZ2luLXRvcDoyMHB4O3RleHQtYWxpZ246Y2VudGVyfSNhdXRoMC13aWRnZXQgLmNyZWF0ZS1hY2NvdW50IGF7Zm9udC1zaXplOjEycHg7Y29sb3I6IzZkNmQ2ZDt0ZXh0LWRlY29yYXRpb246bm9uZX0jYXV0aDAtd2lkZ2V0IC5jcmVhdGUtYWNjb3VudCBhOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAubG9nZ2VkaW4gc3Bhbi5jZW50ZXJlZC5hbGx7Y29sb3I6IzAwOGNkZDtjdXJzb3I6cG9pbnRlcn0jYXV0aDAtd2lkZ2V0IC5sb2dnZWRpbiBzcGFuLmNlbnRlcmVke3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6NXB4IDA7bWFyZ2luOjE1cHggMCA1cHg7Zm9udC1zaXplOjEzcHg7ZGlzcGxheTpibG9ja30jYXV0aDAtd2lkZ2V0IC5sb2dnZWRpbiBzcGFuLmNlbnRlcmVkLmFsbDpob3Zlcnt0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lfSNhdXRoMC13aWRnZXQgLnNpZ251cCAub3B0aW9ucyBhLmNhbmNlbCwjYXV0aDAtd2lkZ2V0IC5yZXNldCAub3B0aW9ucyBhLmNhbmNlbHtjb2xvcjojMDA4Y2RkO2N1cnNvcjpwb2ludGVyO3RleHQtZGVjb3JhdGlvbjpub25lfSNhdXRoMC13aWRnZXQgLnNpZ251cCAub3B0aW9ucyBhLmNhbmNlbDpob3ZlciwjYXV0aDAtd2lkZ2V0IC5yZXNldCAub3B0aW9ucyBhLmNhbmNlbDpob3Zlcnt0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lfSNhdXRoMC13aWRnZXQgLnNpZ251cCAub3B0aW9ucywjYXV0aDAtd2lkZ2V0IC5yZXNldCAub3B0aW9uc3t0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nOjVweCAwO21hcmdpbjoxNXB4IDAgNXB4O2ZvbnQtc2l6ZToxM3B4O2Rpc3BsYXk6YmxvY2t9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjozMHB4IWltcG9ydGFudDttYXJnaW4tYm90dG9tOjIycHg7cG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDo1fSNhdXRoMC13aWRnZXQgZm9ybSBsYWJlbHtkaXNwbGF5OmJsb2NrO2NvbG9yOiM3Zjg4OTk7Zm9udC1zaXplOjEzcHg7Zm9udC13ZWlnaHQ6Ym9sZDttYXJnaW46MCAwIDdweCAwO3RleHQtc2hhZG93OjAgMXB4IDAgd2hpdGU7LW1vei11c2VyLXNlbGVjdDpub25lOy1raHRtbC11c2VyLXNlbGVjdDpub25lOy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTstby11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9I2F1dGgwLXdpZGdldCBmb3JtIGlucHV0ey13ZWJraXQtYm94LXNpemluZzpib3JkZXItYm94Oy1tb3otYm94LXNpemluZzpib3JkZXItYm94O2JveC1zaXppbmc6Ym9yZGVyLWJveDt3aWR0aDoxMDAlO2ZvbnQtc2l6ZToxOHB4O3BhZGRpbmc6MTBweCAxMnB4O2JvcmRlcjoxcHggc29saWQgI2I0YmVjZDtib3JkZXItdG9wLWNvbG9yOiNiMGJhY2E7Ym9yZGVyLWJvdHRvbS1jb2xvcjojZDNkOWUyOy1tb3otYm94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSgxMzAsMTM3LDE1MCwwLjIzKSwwIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsMC44NSk7LXdlYmtpdC1ib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDEzMCwxMzcsMTUwLDAuMjMpLDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjg1KTtib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDEzMCwxMzcsMTUwLDAuMjMpLDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjg1KTstbW96LWJvcmRlci1yYWRpdXM6NHB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czo0cHg7Ym9yZGVyLXJhZGl1czo0cHg7Y29sb3I6YmxhY2s7bWFyZ2luOjA7Zm9udC1mYW1pbHk6J0hlbHZldGljYSBOZXVlJyxIZWx2ZXRpY2EsQXJpYWwgR2VuZXZhLHNhbnMtc2VyaWZ9I2F1dGgwLXdpZGdldCAucGxhY2Vob2xkZXJ7Y29sb3I6I2NjY30jYXV0aDAtd2lkZ2V0IGZvcm0gaW5wdXQ6Zm9jdXN7Ym9yZGVyLWNvbG9yOiM1Njk1ZGIgIzcwYTdlNCAjODliOGVjICM3MGE3ZTQ7b3V0bGluZTowOy1tb3otYm94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSg3MCwxMjMsMTgxLDAuMzUpLDAgMCA0cHggIzU2OTVkYjstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoNzAsMTIzLDE4MSwwLjM1KSwwIDAgNHB4ICM1Njk1ZGI7Ym94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSg3MCwxMjMsMTgxLDAuMzUpLDAgMCA0cHggIzU2OTVkYn0jYXV0aDAtd2lkZ2V0IGZvcm0gLmludmFsaWQgaW5wdXR7b3V0bGluZTowO2JvcmRlci1jb2xvcjojZmY3MDc2O2JvcmRlci10b3AtY29sb3I6I2ZmNWM2MTstbW96LWJveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4yKSwwIDAgNHB4IDAgcmdiYSgyNTUsMCwwLDAuNSk7LXdlYmtpdC1ib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDAsMCwwLDAuMiksMCAwIDRweCAwIHJnYmEoMjU1LDAsMCwwLjUpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4yKSwwIDAgNHB4IDAgcmdiYSgyNTUsMCwwLDAuNSl9I2F1dGgwLXdpZGdldCBoZWFkZXIgLmVycm9ye3BhZGRpbmc6OXB4IDA7bWFyZ2luOjEwcHggYXV0bzt3aWR0aDo3MCU7Zm9udC1zaXplOjE0cHg7bGluZS1oZWlnaHQ6MTNweDtjb2xvcjojYjk1MzUzO3RleHQtYWxpZ246Y2VudGVyfSNhdXRoMC13aWRnZXQgaGVhZGVyIC5zdWNjZXNze3BhZGRpbmc6OXB4IDA7bWFyZ2luOjEwcHggYXV0bzt3aWR0aDo3MCU7Zm9udC1zaXplOjE0cHg7bGluZS1oZWlnaHQ6MTNweDtjb2xvcjojMGZhZDI5O3RleHQtYWxpZ246Y2VudGVyfSNhdXRoMC13aWRnZXQgZm9ybSAubm90ZXtkaXNwbGF5OmJsb2NrO2NvbG9yOiM3Zjg4OTk7Zm9udC1zaXplOjEzcHg7Zm9udC13ZWlnaHQ6Ym9sZDttYXJnaW46MCAwIDdweCAwO3RleHQtc2hhZG93OjAgMXB4IDAgd2hpdGU7LW1vei11c2VyLXNlbGVjdDpub25lOy1raHRtbC11c2VyLXNlbGVjdDpub25lOy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTstby11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9I2F1dGgwLXdpZGdldCBmb3JtIC5ub3RlIGF7Y29sb3I6IzAwOGNkZDt0ZXh0LWRlY29yYXRpb246bm9uZX0jYXV0aDAtd2lkZ2V0IGZvcm0gLmludmFsaWQgLmVycm9ye3Zpc2liaWxpdHk6dmlzaWJsZX0jYXV0aDAtd2lkZ2V0IGZvcm0gYnV0dG9ue2Rpc3BsYXk6YmxvY2s7bWFyZ2luOjIwcHggMCAwIDA7Y3Vyc29yOnBvaW50ZXI7d2lkdGg6MTAwJX0jYXV0aDAtd2lkZ2V0IC5hY3Rpb257dGV4dC1hbGlnbjpyaWdodDttYXJnaW46MCAzMHB4IDMwcHggMzBweDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCBmb3JtIC5hY3Rpb257bWFyZ2luOjB9I2F1dGgwLXdpZGdldCAuYWN0aW9uIGJ1dHRvbnt3aWR0aDphdXRvfSNhdXRoMC13aWRnZXQgLnNlcGFyYXRvcntwb3NpdGlvbjpyZWxhdGl2ZTt0ZXh0LWFsaWduOmNlbnRlcjttYXJnaW46MCAwIDI1cHggMH0jYXV0aDAtd2lkZ2V0IC5zZXBhcmF0b3I6YmVmb3Jle2NvbnRlbnQ6XFxcIlxcXCI7ZGlzcGxheTpibG9jaztib3JkZXItdG9wOjFweCBzb2xpZCAjN2Y4ODk5O3dpZHRoOjIwMHB4O2xlZnQ6NTAlO21hcmdpbi1sZWZ0Oi0xMDBweDtoZWlnaHQ6MXB4O3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7ei1pbmRleDoxfSNhdXRoMC13aWRnZXQgLnNlcGFyYXRvciBzcGFue2JhY2tncm91bmQ6I2ZhZmFmYTtwYWRkaW5nOjAgMTBweDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjU7Y29sb3I6IzdmODg5OTtmb250LXNpemU6MTNweDtmb250LXdlaWdodDpib2xkO3RleHQtc2hhZG93OjAgMXB4IDAgd2hpdGV9I2F1dGgwLXdpZGdldCBzcGFuLmJhY2t7ZGlzcGxheTpibG9jaztjb2xvcjojMDA4Y2RkO3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6NXB4IDA7bWFyZ2luOjE1cHggMCA1cHg7Zm9udC1zaXplOjEzcHg7Y3Vyc29yOnBvaW50ZXI7cG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDo1O291dGxpbmU6MH0jYXV0aDAtd2lkZ2V0IHNwYW4uYmFjazpob3Zlcnt0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lfSNhdXRoMC13aWRnZXQgLnNpZ25pbiAucGFuZWwuc3RyYXRlZ2llcyAubGlzdCAuZW1haWx7ZGlzcGxheTpibG9jaztjb2xvcjojN2Y4ODk5O2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OmJvbGQ7bWFyZ2luOjAgMCA3cHggMDt0ZXh0LXNoYWRvdzowIDFweCAwIHdoaXRlO3RleHQtYWxpZ246Y2VudGVyfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5vZmZpY2UzNjU6YmVmb3Jle2NvbnRlbnQ6XFxcIldcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5vZmZpY2UzNjV7YmFja2dyb3VuZC1jb2xvcjojMDBhY2VkO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWQ6YmVmb3Jle2NvbnRlbnQ6XFxcInpcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC53YWFke2JhY2tncm91bmQtY29sb3I6IzAwYWRlZjtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC50aGlydHlzZXZlbnNpZ25hbHM6YmVmb3Jle2NvbnRlbnQ6XFxcImJcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC50aGlydHlzZXZlbnNpZ25hbHN7YmFja2dyb3VuZC1jb2xvcjojNmFjMDcxO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmJveDpiZWZvcmV7Y29udGVudDpcXFwieFxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmJveHtiYWNrZ3JvdW5kLWNvbG9yOiMyNjdiYjY7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZTpiZWZvcmV7Y29udGVudDpcXFwiKlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnNhbGVzZm9yY2V7YmFja2dyb3VuZC1jb2xvcjojZmZmO2NvbG9yOiNmMDB9I2F1dGgwLXdpZGdldCAuem9jaWFsLndpbmRvd3N7YmFja2dyb3VuZC1jb2xvcjojMjY3MmVjO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmZpdGJpdDpiZWZvcmV7Y29udGVudDpcXFwiI1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmZpdGJpdHtiYWNrZ3JvdW5kLWNvbG9yOiM0NWMyYzU7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwueWFuZGV4OmJlZm9yZXtjb250ZW50OlxcXCImXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwueWFuZGV4e2JhY2tncm91bmQtY29sb3I6I2YwMDtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5yZW5yZW46YmVmb3Jle2NvbnRlbnQ6XFxcInJcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5yZW5yZW57YmFja2dyb3VuZC1jb2xvcjojMDA1NmI1O2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmJhaWR1OmJlZm9yZXtjb250ZW50OlxcXCJ1XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYmFpZHV7YmFja2dyb3VuZC1jb2xvcjojMjgzMmUxO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLm9uZXN0ZXB7d2lkdGg6MzQ1cHg7bWFyZ2luOjAgMCAwIC0xNzJweH1AbWVkaWEobWF4LXdpZHRoOjI4MHB4KXsjYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucGFuZWx7d2lkdGg6MjQwcHg7bWFyZ2luOjAgMCAwIC0xMjBweH0jYXV0aDAtd2lkZ2V0IC5zaWduaW4gLnBvcHVwIC5wYW5lbC5zdHJhdGVnaWVzIC5saXN0e21hcmdpbjoxMnB4fSNhdXRoMC13aWRnZXQgZm9ybXttYXJnaW46MTJweH0jYXV0aDAtd2lkZ2V0IGZvcm0gaW5wdXR7cGFkZGluZzo1cHh9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlcnttYXJnaW46MDtwYWRkaW5nOjB9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBoMXtwYWRkaW5nOjE0cHggMTZweDttYXJnaW46MDtmb250LXNpemU6MjJweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGEuY2xvc2V7cmlnaHQ6MTRweDt0b3A6MTZweH19QG1lZGlhKG1pbi13aWR0aDoyODFweCkgYW5kIChtYXgtd2lkdGg6MzQwcHgpeyNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbHttYXJnaW46MDtsZWZ0OjA7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtib3JkZXItcmFkaXVzOjB9I2F1dGgwLXdpZGdldCAucG9wdXAgLnpvY2lhbCwjYXV0aDAtd2lkZ2V0IC5wb3B1cCBhLnpvY2lhbHtmb250LXNpemU6MThweH0jYXV0aDAtd2lkZ2V0IC5zaWduaW4gLnBvcHVwIC5wYW5lbC5zdHJhdGVnaWVzIC5saXN0e21hcmdpbjoxNXB4fSNhdXRoMC13aWRnZXQgZm9ybXttYXJnaW46MTVweCAyNXB4fSNhdXRoMC13aWRnZXQgZm9ybSBpbnB1dHtwYWRkaW5nOjZweDtmb250LXNpemU6MThweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVye21hcmdpbjowO3BhZGRpbmc6MDttaW4taGVpZ2h0OjMycHh9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBoMXtwYWRkaW5nOjEycHggMTZweDttYXJnaW4tdG9wOjFweDtmb250LXNpemU6MjBweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGltZ3toZWlnaHQ6MzJweDttYXJnaW46OXB4IDEwcHggNnB4IDE4cHh9I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnl7bGluZS1oZWlnaHQ6MzRweH0jYXV0aDAtd2lkZ2V0IC5hY3Rpb24gLnNwaW5uZXJ7aGVpZ2h0OjM0cHh9I2F1dGgwLXdpZGdldCAuY3JlYXRlLWFjY291bnR7bWFyZ2luLXRvcDoyMHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5lbWFpbHttYXJnaW4tYm90dG9tOjVweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucGFzc3dvcmQsI2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLnJlcGVhdFBhc3N3b3Jke21hcmdpbi1ib3R0b206NXB4fX0jYXV0aDAtd2lkZ2V0IC5sb2FkaW5ne2Rpc3BsYXk6bm9uZTtib3JkZXI6MDtvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246Zml4ZWQ7dmlzaWJpbGl0eTp2aXNpYmxlO21hcmdpbjowO3BhZGRpbmc6MDtsZWZ0OjA7dG9wOjA7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTt6LWluZGV4OjEwMDAwMDtmb250LXdlaWdodDoyMDA7LW1vei11c2VyLXNlbGVjdDpub25lOy1raHRtbC11c2VyLXNlbGVjdDpub25lOy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTstby11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmU7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LDAuNSl9I2F1dGgwLXdpZGdldCAubG9hZGluZyAubWVzc2FnZXtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO21hcmdpbi10b3A6LTExMHB4O3dpZHRoOjEwMCU7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjIycHg7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLGFyaWFsLGZyZWVzYW5zLGNsZWFuLHNhbnMtc2VyaWY7Y29sb3I6IzMzM30jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxsc3twb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjUwJTt0b3A6NTAlO21hcmdpbi1sZWZ0Oi00NXB4O21hcmdpbi10b3A6LTQ1cHg7d2lkdGg6OTBweDtoZWlnaHQ6OTBweH0jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscz5kaXZ7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6ODZweDtoZWlnaHQ6ODZweDtvcGFjaXR5OjA7LW1vei10cmFuc2Zvcm06cm90YXRlKDIyNWRlZyk7LW1vei1hbmltYXRpb246b3JiaXQgNy4xNXMgaW5maW5pdGU7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDIyNWRlZyk7LXdlYmtpdC1hbmltYXRpb246b3JiaXQgNy4xNXMgaW5maW5pdGU7LW1zLXRyYW5zZm9ybTpyb3RhdGUoMjI1ZGVnKTstbXMtYW5pbWF0aW9uOm9yYml0IDcuMTVzIGluZmluaXRlOy1vLXRyYW5zZm9ybTpyb3RhdGUoMjI1ZGVnKTstby1hbmltYXRpb246b3JiaXQgNy4xNXMgaW5maW5pdGU7dHJhbnNmb3JtOnJvdGF0ZSgyMjVkZWcpO2FuaW1hdGlvbjpvcmJpdCA3LjE1cyBpbmZpbml0ZX0jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscz5kaXY+ZGl2e3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjExcHg7aGVpZ2h0OjExcHg7YmFja2dyb3VuZDojMzMzO2xlZnQ6MDt0b3A6MDstbW96LWJvcmRlci1yYWRpdXM6MTFweDstd2Via2l0LWJvcmRlci1yYWRpdXM6MTFweDstbXMtYm9yZGVyLXJhZGl1czoxMXB4Oy1vLWJvcmRlci1yYWRpdXM6MTFweDtib3JkZXItcmFkaXVzOjExcHh9I2F1dGgwLXdpZGdldCAubG9hZGluZyAuYmFsbHMgLmJhbGwwMXstbW96LWFuaW1hdGlvbi1kZWxheToxLjU2czstd2Via2l0LWFuaW1hdGlvbi1kZWxheToxLjU2czstbXMtYW5pbWF0aW9uLWRlbGF5OjEuNTZzOy1vLWFuaW1hdGlvbi1kZWxheToxLjU2czthbmltYXRpb24tZGVsYXk6MS41NnN9I2F1dGgwLXdpZGdldCAubG9hZGluZyAuYmFsbHMgLmJhbGwwMnstbW96LWFuaW1hdGlvbi1kZWxheTouMzFzOy13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi4zMXM7LW1zLWFuaW1hdGlvbi1kZWxheTouMzFzOy1vLWFuaW1hdGlvbi1kZWxheTouMzFzO2FuaW1hdGlvbi1kZWxheTouMzFzfSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxzIC5iYWxsMDN7LW1vei1hbmltYXRpb24tZGVsYXk6LjYyczstd2Via2l0LWFuaW1hdGlvbi1kZWxheTouNjJzOy1tcy1hbmltYXRpb24tZGVsYXk6LjYyczstby1hbmltYXRpb24tZGVsYXk6LjYyczthbmltYXRpb24tZGVsYXk6LjYyc30jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscyAuYmFsbDA0ey1tb3otYW5pbWF0aW9uLWRlbGF5Oi45NHM7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6Ljk0czstbXMtYW5pbWF0aW9uLWRlbGF5Oi45NHM7LW8tYW5pbWF0aW9uLWRlbGF5Oi45NHM7YW5pbWF0aW9uLWRlbGF5Oi45NHN9I2F1dGgwLXdpZGdldCAubG9hZGluZyAuYmFsbHMgLmJhbGwwNXstbW96LWFuaW1hdGlvbi1kZWxheToxLjI1czstd2Via2l0LWFuaW1hdGlvbi1kZWxheToxLjI1czstbXMtYW5pbWF0aW9uLWRlbGF5OjEuMjVzOy1vLWFuaW1hdGlvbi1kZWxheToxLjI1czthbmltYXRpb24tZGVsYXk6MS4yNXN9QC1tb3ota2V5ZnJhbWVzIG9yYml0ezAle29wYWNpdHk6MTt6LWluZGV4Ojk5Oy1tb3otdHJhbnNmb3JtOnJvdGF0ZSgxODBkZWcpOy1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dH03JXtvcGFjaXR5OjE7LW1vei10cmFuc2Zvcm06cm90YXRlKDMwMGRlZyk7LW1vei1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjstbW96LW9yaWdpbjowfTMwJXtvcGFjaXR5OjE7LW1vei10cmFuc2Zvcm06cm90YXRlKDQxMGRlZyk7LW1vei1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2UtaW4tb3V0Oy1tb3otb3JpZ2luOjclfTM5JXtvcGFjaXR5OjE7LW1vei10cmFuc2Zvcm06cm90YXRlKDY0NWRlZyk7LW1vei1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjstbW96LW9yaWdpbjozMCV9NzAle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoNzcwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LW1vei1vcmlnaW46MzklfTc1JXtvcGFjaXR5OjE7LW1vei10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyk7LW1vei1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy1tb3otb3JpZ2luOjcwJX03NiV7b3BhY2l0eTowOy1tb3otdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfTEwMCV7b3BhY2l0eTowOy1tb3otdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfX1ALXdlYmtpdC1rZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0fTcle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy13ZWJraXQtb3JpZ2luOjB9MzAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1pbi1vdXQ7LXdlYmtpdC1vcmlnaW46NyV9Mzkle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy13ZWJraXQtb3JpZ2luOjMwJX03MCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstd2Via2l0LW9yaWdpbjozOSV9NzUle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LXdlYmtpdC1vcmlnaW46NzAlfTc2JXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9fUAtbXMta2V5ZnJhbWVzIG9yYml0ezAle29wYWNpdHk6MTt6LWluZGV4Ojk5Oy1tcy10cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7LW1zLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXR9NyV7b3BhY2l0eToxOy1tcy10cmFuc2Zvcm06cm90YXRlKDMwMGRlZyk7LW1zLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1tcy1vcmlnaW46MH0zMCV7b3BhY2l0eToxOy1tcy10cmFuc2Zvcm06cm90YXRlKDQxMGRlZyk7LW1zLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1pbi1vdXQ7LW1zLW9yaWdpbjo3JX0zOSV7b3BhY2l0eToxOy1tcy10cmFuc2Zvcm06cm90YXRlKDY0NWRlZyk7LW1zLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1tcy1vcmlnaW46MzAlfTcwJXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoNzcwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstbXMtb3JpZ2luOjM5JX03NSV7b3BhY2l0eToxOy1tcy10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyk7LW1zLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LW1zLW9yaWdpbjo3MCV9NzYle29wYWNpdHk6MDstbXMtdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfTEwMCV7b3BhY2l0eTowOy1tcy10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9fUAtby1rZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7LW8tdHJhbnNmb3JtOnJvdGF0ZSgxODBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXR9NyV7b3BhY2l0eToxOy1vLXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTstby1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjstby1vcmlnaW46MH0zMCV7b3BhY2l0eToxOy1vLXRyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTstby1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2UtaW4tb3V0Oy1vLW9yaWdpbjo3JX0zOSV7b3BhY2l0eToxOy1vLXRyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTstby1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjstby1vcmlnaW46MzAlfTcwJXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LW8tb3JpZ2luOjM5JX03NSV7b3BhY2l0eToxOy1vLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTstby1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy1vLW9yaWdpbjo3MCV9NzYle29wYWNpdHk6MDstby10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7LW8tdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfX1Aa2V5ZnJhbWVzIG9yYml0ezAle29wYWNpdHk6MTt6LWluZGV4Ojk5O3RyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0fTcle29wYWNpdHk6MTt0cmFuc2Zvcm06cm90YXRlKDMwMGRlZyk7YW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7b3JpZ2luOjB9MzAle29wYWNpdHk6MTt0cmFuc2Zvcm06cm90YXRlKDQxMGRlZyk7YW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLWluLW91dDtvcmlnaW46NyV9Mzkle29wYWNpdHk6MTt0cmFuc2Zvcm06cm90YXRlKDY0NWRlZyk7YW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7b3JpZ2luOjMwJX03MCV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoNzcwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0O29yaWdpbjozOSV9NzUle29wYWNpdHk6MTt0cmFuc2Zvcm06cm90YXRlKDkwMGRlZyk7YW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDtvcmlnaW46NzAlfTc2JXtvcGFjaXR5OjA7dHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfTEwMCV7b3BhY2l0eTowO3RyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX19I2F1dGgwLXdpZGdldCBpbnB1dFtkaXNhYmxlZF17YmFja2dyb3VuZC1jb2xvcjojZDlkZWUwfSNhdXRoMC13aWRnZXQgYXJ0aWNsZSwjYXV0aDAtd2lkZ2V0IGFzaWRlLCNhdXRoMC13aWRnZXQgZGV0YWlscywjYXV0aDAtd2lkZ2V0IGZpZ2NhcHRpb24sI2F1dGgwLXdpZGdldCBmaWd1cmUsI2F1dGgwLXdpZGdldCBmb290ZXIsI2F1dGgwLXdpZGdldCBoZWFkZXIsI2F1dGgwLXdpZGdldCBoZ3JvdXAsI2F1dGgwLXdpZGdldCBuYXYsI2F1dGgwLXdpZGdldCBzZWN0aW9uLCNhdXRoMC13aWRnZXQgc3VtbWFyeXtkaXNwbGF5OmJsb2NrfSNhdXRoMC13aWRnZXQgYXVkaW8sI2F1dGgwLXdpZGdldCBjYW52YXMsI2F1dGgwLXdpZGdldCB2aWRlb3tkaXNwbGF5OmlubGluZS1ibG9jazsqZGlzcGxheTppbmxpbmU7Knpvb206MX0jYXV0aDAtd2lkZ2V0IGF1ZGlvOm5vdChbY29udHJvbHNdKXtkaXNwbGF5Om5vbmU7aGVpZ2h0OjB9I2F1dGgwLXdpZGdldCBbaGlkZGVuXXtkaXNwbGF5Om5vbmV9I2F1dGgwLXdpZGdldCBodG1se2ZvbnQtc2l6ZToxMDAlOy13ZWJraXQtdGV4dC1zaXplLWFkanVzdDoxMDAlOy1tcy10ZXh0LXNpemUtYWRqdXN0OjEwMCV9I2F1dGgwLXdpZGdldCBodG1sLCNhdXRoMC13aWRnZXQgYnV0dG9uLCNhdXRoMC13aWRnZXQgaW5wdXQsI2F1dGgwLXdpZGdldCBzZWxlY3QsI2F1dGgwLXdpZGdldCB0ZXh0YXJlYSwjYXV0aDAtd2lkZ2V0IGgxLCNhdXRoMC13aWRnZXQgaDIsI2F1dGgwLXdpZGdldCBkaXYsI2F1dGgwLXdpZGdldCBzcGFuLCNhdXRoMC13aWRnZXQgYXtmb250LWZhbWlseTpzYW5zLXNlcmlmfSNhdXRoMC13aWRnZXQgYm9keXttYXJnaW46MH0jYXV0aDAtd2lkZ2V0IGE6Zm9jdXN7b3V0bGluZTp0aGluIGRvdHRlZH0jYXV0aDAtd2lkZ2V0IGE6YWN0aXZlLCNhdXRoMC13aWRnZXQgYTpob3ZlcntvdXRsaW5lOjB9I2F1dGgwLXdpZGdldCBoMXtmb250LXNpemU6MmVtO21hcmdpbjouNjdlbSAwfSNhdXRoMC13aWRnZXQgaDJ7Zm9udC1zaXplOjEuNWVtO21hcmdpbjouODNlbSAwfSNhdXRoMC13aWRnZXQgaDN7Zm9udC1zaXplOjEuMTdlbTttYXJnaW46MWVtIDB9I2F1dGgwLXdpZGdldCBoNHtmb250LXNpemU6MWVtO21hcmdpbjoxLjMzZW0gMH0jYXV0aDAtd2lkZ2V0IGg1e2ZvbnQtc2l6ZTouODNlbTttYXJnaW46MS42N2VtIDB9I2F1dGgwLXdpZGdldCBoNntmb250LXNpemU6Ljc1ZW07bWFyZ2luOjIuMzNlbSAwfSNhdXRoMC13aWRnZXQgYWJiclt0aXRsZV17Ym9yZGVyLWJvdHRvbToxcHggZG90dGVkfSNhdXRoMC13aWRnZXQgYiwjYXV0aDAtd2lkZ2V0IHN0cm9uZ3tmb250LXdlaWdodDpib2xkfSNhdXRoMC13aWRnZXQgYmxvY2txdW90ZXttYXJnaW46MWVtIDQwcHh9I2F1dGgwLXdpZGdldCBkZm57Zm9udC1zdHlsZTppdGFsaWN9I2F1dGgwLXdpZGdldCBtYXJre2JhY2tncm91bmQ6I2ZmMDtjb2xvcjojMDAwfSNhdXRoMC13aWRnZXQgcCwjYXV0aDAtd2lkZ2V0IHByZXttYXJnaW46MWVtIDB9I2F1dGgwLXdpZGdldCBjb2RlLCNhdXRoMC13aWRnZXQga2JkLCNhdXRoMC13aWRnZXQgcHJlLCNhdXRoMC13aWRnZXQgc2FtcHtmb250LWZhbWlseTptb25vc3BhY2Usc2VyaWY7X2ZvbnQtZmFtaWx5Oidjb3VyaWVyIG5ldycsbW9ub3NwYWNlO2ZvbnQtc2l6ZToxZW19I2F1dGgwLXdpZGdldCBwcmV7d2hpdGUtc3BhY2U6cHJlO3doaXRlLXNwYWNlOnByZS13cmFwO3dvcmQtd3JhcDpicmVhay13b3JkfSNhdXRoMC13aWRnZXQgcXtxdW90ZXM6bm9uZX0jYXV0aDAtd2lkZ2V0IHE6YmVmb3JlLCNhdXRoMC13aWRnZXQgcTphZnRlcntjb250ZW50OicnO2NvbnRlbnQ6bm9uZX0jYXV0aDAtd2lkZ2V0IHNtYWxse2ZvbnQtc2l6ZTo4MCV9I2F1dGgwLXdpZGdldCBzdWIsI2F1dGgwLXdpZGdldCBzdXB7Zm9udC1zaXplOjc1JTtsaW5lLWhlaWdodDowO3Bvc2l0aW9uOnJlbGF0aXZlO3ZlcnRpY2FsLWFsaWduOmJhc2VsaW5lfSNhdXRoMC13aWRnZXQgc3Vwe3RvcDotMC41ZW19I2F1dGgwLXdpZGdldCBzdWJ7Ym90dG9tOi0wLjI1ZW19I2F1dGgwLXdpZGdldCBkbCwjYXV0aDAtd2lkZ2V0IG1lbnUsI2F1dGgwLXdpZGdldCBvbCwjYXV0aDAtd2lkZ2V0IHVse21hcmdpbjoxZW0gMH0jYXV0aDAtd2lkZ2V0IGRke21hcmdpbjowIDAgMCA0MHB4fSNhdXRoMC13aWRnZXQgbWVudSwjYXV0aDAtd2lkZ2V0IG9sLCNhdXRoMC13aWRnZXQgdWx7cGFkZGluZzowIDAgMCA0MHB4fSNhdXRoMC13aWRnZXQgbmF2IHVsLCNhdXRoMC13aWRnZXQgbmF2IG9se2xpc3Qtc3R5bGU6bm9uZTtsaXN0LXN0eWxlLWltYWdlOm5vbmV9I2F1dGgwLXdpZGdldCBpbWd7Ym9yZGVyOjA7LW1zLWludGVycG9sYXRpb24tbW9kZTpiaWN1YmljfSNhdXRoMC13aWRnZXQgc3ZnOm5vdCg6cm9vdCl7b3ZlcmZsb3c6aGlkZGVufSNhdXRoMC13aWRnZXQgZmlndXJle21hcmdpbjowfSNhdXRoMC13aWRnZXQgZm9ybXttYXJnaW46MH0jYXV0aDAtd2lkZ2V0IGZpZWxkc2V0e2JvcmRlcjoxcHggc29saWQgI2MwYzBjMDttYXJnaW46MCAycHg7cGFkZGluZzouMzVlbSAuNjI1ZW0gLjc1ZW19I2F1dGgwLXdpZGdldCBsZWdlbmR7Ym9yZGVyOjA7cGFkZGluZzowO3doaXRlLXNwYWNlOm5vcm1hbDsqbWFyZ2luLWxlZnQ6LTdweH0jYXV0aDAtd2lkZ2V0IGJ1dHRvbiwjYXV0aDAtd2lkZ2V0IGlucHV0LCNhdXRoMC13aWRnZXQgc2VsZWN0LCNhdXRoMC13aWRnZXQgdGV4dGFyZWF7Zm9udC1zaXplOjEwMCU7bWFyZ2luOjA7dmVydGljYWwtYWxpZ246YmFzZWxpbmU7KnZlcnRpY2FsLWFsaWduOm1pZGRsZX0jYXV0aDAtd2lkZ2V0IGJ1dHRvbiwjYXV0aDAtd2lkZ2V0IGlucHV0e2xpbmUtaGVpZ2h0Om5vcm1hbH0jYXV0aDAtd2lkZ2V0IGJ1dHRvbiwjYXV0aDAtd2lkZ2V0IGh0bWwgaW5wdXRbdHlwZT1cXFwiYnV0dG9uXFxcIl0sI2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJyZXNldFxcXCJdLCNhdXRoMC13aWRnZXQgaW5wdXRbdHlwZT1cXFwic3VibWl0XFxcIl17LXdlYmtpdC1hcHBlYXJhbmNlOmJ1dHRvbjtjdXJzb3I6cG9pbnRlcjsqb3ZlcmZsb3c6dmlzaWJsZX0jYXV0aDAtd2lkZ2V0IGJ1dHRvbltkaXNhYmxlZF0sI2F1dGgwLXdpZGdldCBpbnB1dFtkaXNhYmxlZF17Y3Vyc29yOmRlZmF1bHR9I2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJjaGVja2JveFxcXCJdLCNhdXRoMC13aWRnZXQgaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXXtib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzowOypoZWlnaHQ6MTNweDsqd2lkdGg6MTNweH0jYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcInNlYXJjaFxcXCJdey13ZWJraXQtYXBwZWFyYW5jZTp0ZXh0ZmllbGQ7LW1vei1ib3gtc2l6aW5nOmNvbnRlbnQtYm94Oy13ZWJraXQtYm94LXNpemluZzpjb250ZW50LWJveDtib3gtc2l6aW5nOmNvbnRlbnQtYm94fSNhdXRoMC13aWRnZXQgaW5wdXRbdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24sI2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbnstd2Via2l0LWFwcGVhcmFuY2U6bm9uZX0jYXV0aDAtd2lkZ2V0IGJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lciwjYXV0aDAtd2lkZ2V0IGlucHV0OjotbW96LWZvY3VzLWlubmVye2JvcmRlcjowO3BhZGRpbmc6MH0jYXV0aDAtd2lkZ2V0IHRleHRhcmVhe292ZXJmbG93OmF1dG87dmVydGljYWwtYWxpZ246dG9wfSNhdXRoMC13aWRnZXQgdGFibGV7Ym9yZGVyLWNvbGxhcHNlOmNvbGxhcHNlO2JvcmRlci1zcGFjaW5nOjB9XCIpO1xuXG4vLyB1c2UgYW1kIG9yIGp1c3QgdGhyb3VnaHQgdG8gd2luZG93IG9iamVjdC5cbmlmICh0eXBlb2YgZ2xvYmFsLndpbmRvdy5kZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBnbG9iYWwud2luZG93LmRlZmluZS5hbWQpIHtcbiAgZ2xvYmFsLndpbmRvdy5kZWZpbmUoJ2F1dGgwLXdpZGdldCcsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIEF1dGgwV2lkZ2V0OyB9KTtcbn0gZWxzZSBpZiAoZ2xvYmFsLndpbmRvdykge1xuICBnbG9iYWwud2luZG93LkF1dGgwV2lkZ2V0ID0gQXV0aDBXaWRnZXQ7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICAgIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICAgIH1cblxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzPShmdW5jdGlvbigpIHt2YXIgdCA9IGZ1bmN0aW9uIGFub255bW91cyhsb2NhbHMsIGZpbHRlcnMsIGVzY2FwZSkge1xuZXNjYXBlID0gZXNjYXBlIHx8IGZ1bmN0aW9uIChodG1sKXtcbiAgcmV0dXJuIFN0cmluZyhodG1sKVxuICAgIC5yZXBsYWNlKC8mKD8hXFx3KzspL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xufTtcbnZhciBidWYgPSBbXTtcbndpdGggKGxvY2FscyB8fCB7fSkgeyAoZnVuY3Rpb24oKXsgXG4gYnVmLnB1c2goJzxkaXYgaWQ9XCJhdXRoMC13aWRnZXRcIiBjbGFzcz1cImNsZWFuc2xhdGVcIj5cXG5cdDxkaXYgY2xhc3M9XCJzaWduaW5cIj5cXG5cdCAgICA8ZGl2IGNsYXNzPVwicG9wdXBcIj5cXG5cdCAgICAgIFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIj5cXG5cdCAgICAgICAgXHQ8ZGl2IGlkPVwib25lc3RlcFwiIGNsYXNzPVwicGFuZWwgb25lc3RlcFwiPlxcblx0ICAgICAgICAgIFx0XHQ8aGVhZGVyIGNsYXNzPVwiaGVhZGVyXCI+XFxuXHQgICAgICAgICAgICBcdFx0PGRpdiBjbGFzcz1cImltYWdlXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+XFxuXHQgICAgICAgICAgICBcdFx0XHQ8aW1nIHNyYz1cIlwiPlxcblx0ICAgICAgICAgICAgXHRcdDwvZGl2Plxcblx0ICAgICAgICAgICAgXHRcdDxoMT5TaWduIEluPC9oMT5cXG5cdFx0XHQgICAgICAgICAgICA8aDIgY2xhc3M9XCJlcnJvclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPiZuYnNwOzwvaDI+XFxuXHRcdFx0ICAgICAgICAgICAgPGgyIGNsYXNzPVwic3VjY2Vzc1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPiZuYnNwOzwvaDI+XFxuXHRcdFx0ICAgICAgICAgICAgPGEgY2xhc3M9XCJjbG9zZVwiPkNsb3NlPC9hPlxcblx0ICAgICAgICAgIFx0XHQ8L2hlYWRlcj5cXG5cXG5cdCAgICAgICAgICBcdFx0PGRpdiBjbGFzcz1cImxvZ2dlZGluXCI+XFxuXHRcdFx0ICAgICAgICAgICAgPGZvcm0+XFxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImNlbnRlcmVkIGxhc3QtdGltZVwiPjwvc3Bhbj5cXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzdHJhdGVneVwiPjwvZGl2Plxcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVtYWlsUGFzc3dvcmRcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZW1haWxcIj5cXG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImVtYWlsLXJlYWRvbmx5XCI+PC9zcGFuPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwiZW1haWxcIiB0eXBlPVwiZW1haWxcIiB2YWx1ZT1cIlwiIGRpc2FibGVkIHBsYWNlaG9sZGVyPVwiRW1haWxcIiB0aXRsZT1cIkVtYWlsXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj5cXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwicGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiB2YWx1ZT1cIlwiIGF1dG9mb2N1cyBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkXCIgdGl0bGU9XCJQYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiem9jaWFsIHByaW1hcnkgbmV4dFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCI+U2lnbiBJbjwvYnV0dG9uPlxcblx0XHRcdFx0XHRcdFx0XHQgIFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJzcGlubmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PC9idXR0b24+XFxuXHRcdFx0XHRcdFx0XHRcdCAgXHQ8bGFiZWwgY2xhc3M9XCJjcmVhdGUtYWNjb3VudFwiPjxhIGhyZWY9XCJqYXZhc2NyaXB0OiB7fVwiIGNsYXNzPVwiZm9yZ290LXBhc3NcIj5Gb3Jnb3QgeW91ciBwYXNzd29yZD88L2E+PC9sYWJlbD5cXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2VudGVyZWQgYWxsXCI+U2hvdyBhbGw8L3NwYW4+XFxuXHRcdFx0ICAgICAgICAgICAgPC9mb3JtPlxcblx0ICAgICAgICAgIFx0XHQ8L2Rpdj5cXG5cXG5cdFx0ICAgICAgICAgIFx0PGRpdiBjbGFzcz1cIm5vdGxvZ2dlZGluXCI+XFxuXHRcdFx0ICAgICAgICAgICAgPGZvcm0+XFxuXHRcdFx0ICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiaWNvbmxpc3RcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48cCBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPi4uLiBvciBzaWduIGluIHVzaW5nPC9wPjwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwic2VwYXJhdG9yXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PHNwYW4+b3I8L3NwYW4+PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJlbWFpbFBhc3N3b3JkXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImVtYWlsXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgXHRcdDxpbnB1dCBuYW1lPVwiZW1haWxcIiBpZD1cInNpZ25pbl9lYXN5X2VtYWlsXCIgdHlwZT1cImVtYWlsXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwicGFzc3dvcmRcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgaWQ9XCJzaWduaW5fZWFzeV9wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIiB0aXRsZT1cIlBhc3N3b3JkXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvblwiPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNpZ24gSW48L2J1dHRvbj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJzcGlubmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PC9idXR0b24+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxsYWJlbCBjbGFzcz1cImNyZWF0ZS1hY2NvdW50XCI+PGEgaHJlZj1cImphdmFzY3JpcHQ6IHt9XCIgY2xhc3M9XCJzaWduLXVwXCI+U2lnbiBVcDwvYT48c3BhbiBjbGFzcz1cImRpdmlkZXJcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPiZuYnNwO+KAoiZuYnNwOzwvc3Bhbj48YSBocmVmPVwiamF2YXNjcmlwdDoge31cIiBjbGFzcz1cImZvcmdvdC1wYXNzXCI+Rm9yZ290IHlvdXIgcGFzc3dvcmQ/PC9hPjwvbGFiZWw+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgPC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgIDwvZm9ybT5cXG5cdFx0ICAgICAgICAgIFx0PC9kaXY+XFxuXFxuXHRcdCAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJzaWdudXBcIj5cXG5cdFx0XHQgICAgICAgICAgICA8Zm9ybT5cXG5cdFx0XHQgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPjwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxQYXNzd29yZFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJlbWFpbFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cImVtYWlsXCIgaWQ9XCJzaWdudXBfZWFzeV9lbWFpbFwiIHR5cGU9XCJlbWFpbFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwicGFzc3dvcmRcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgICBcdFx0PGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIGlkPVwic2lnbnVwX2Vhc3lfcGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiB2YWx1ZT1cIlwiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPVwiQ3JlYXRlIGEgUGFzc3dvcmRcIiB0aXRsZT1cIlBhc3N3b3JkXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvblwiPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNpZ24gVXA8L2J1dHRvbj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJzcGlubmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PC9idXR0b24+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJmb290ZXJcIj48L2Rpdj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cIm9wdGlvbnNcIj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgICAgXHQ8YSBocmVmPVwiamF2YXNjcmlwdDoge31cIiBjbGFzcz1cImNlbnRlcmVkIGNhbmNlbFwiPkNhbmNlbDwvYT5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgPC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgIDwvZm9ybT5cXG5cdFx0ICAgICAgICAgIFx0PC9kaXY+XFxuXFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyZXNldFwiPlxcblx0XHRcdFx0XHRcdDxmb3JtIGlkPVwiY2hhbmdlX3Bhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0ICBcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj48L2Rpdj5cXG5cdFx0XHRcdFx0XHQgIFx0PGRpdiBjbGFzcz1cImVtYWlsUGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxcIj5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PGlucHV0IG5hbWU9XCJlbWFpbFwiIGlkPVwicmVzZXRfZWFzeV9lbWFpbFwiIHR5cGU9XCJlbWFpbFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8ZGl2IGNsYXNzPVwicGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIGlkPVwicmVzZXRfZWFzeV9wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJOZXcgUGFzc3dvcmRcIiB0aXRsZT1cIk5ldyBQYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdCAgICBcdDwvZGl2Plxcblx0XHRcdFx0XHRcdCAgICBcdDxkaXYgY2xhc3M9XCJyZXBlYXRQYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cInJlcGVhdF9wYXNzd29yZFwiIGlkPVwicmVzZXRfZWFzeV9yZXBlYXRfcGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiB2YWx1ZT1cIlwiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPVwiQ29uZmlybSBOZXcgUGFzc3dvcmRcIiB0aXRsZT1cIkNvbmZpcm0gTmV3IFBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNlbmQ8L2J1dHRvbj5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJzcGlubmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PC9idXR0b24+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDxkaXYgY2xhc3M9XCJvcHRpb25zXCI+XFxuXHRcdFx0XHRcdFx0ICAgICAgICBcdFx0PGEgaHJlZj1cImphdmFzY3JpcHQ6IHt9XCIgY2xhc3M9XCJjZW50ZXJlZCBjYW5jZWxcIj5DYW5jZWw8L2E+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdCAgICBcdDwvZGl2Plxcblx0XHRcdFx0XHRcdCAgXHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHQ8L2Zvcm0+XFxuXHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcXG5cdCAgICAgICAgICBcdFx0PGZvb3Rlcj5cXG5cdCAgICAgICAgICAgIFx0XHQ8c3Bhbj5Qb3dlcmVkIGJ5IDxhIGhyZWY9XCJodHRwOi8vYXV0aDAuY29tXCIgdGFyZ2V0PVwiX25ld1wiPkF1dGgwPC9hPjwvc3Bhbj5cXG5cdCAgICAgICAgICBcdFx0PC9mb290ZXI+XFxuXHQgICAgICAgIFx0PC9kaXY+XFxuXHQgICAgICBcdDwvZGl2Plxcblx0ICAgIDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJyk7IH0pKCk7XG59IFxucmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07IHJldHVybiBmdW5jdGlvbihsKSB7IHJldHVybiB0KGwpIH19KCkpIiwidmFyIEF1dGgwICAgICA9IHJlcXVpcmUoJ2F1dGgwLWpzJyk7XG52YXIgcXdlcnkgICAgID0gcmVxdWlyZSgncXdlcnknKTtcbnZhciBib256byAgICAgPSByZXF1aXJlKCdib256bycpO1xudmFyIGJlYW4gICAgICA9IHJlcXVpcmUoJ2JlYW4nKTtcbnZhciB4dGVuZCAgICAgPSByZXF1aXJlKCd4dGVuZCcpO1xuXG52YXIgbWFpblRtcGwgPSByZXF1aXJlKCcuL2h0bWwvbWFpbi5odG1sJyk7XG5cbnZhciAkID0gZnVuY3Rpb24gKHNlbGVjdG9yLCByb290KSB7XG4gIHJldHVybiBib256byhxd2VyeSgnI2F1dGgwLXdpZGdldCAnICsgKHNlbGVjdG9yIHx8ICcnKSwgcm9vdCkpO1xufTtcblxuZnVuY3Rpb24gQXV0aDBXaWRnZXQgKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEF1dGgwV2lkZ2V0KSkge1xuICAgIHJldHVybiBuZXcgQXV0aDBXaWRnZXQob3B0aW9ucyk7XG4gIH1cblxuICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy5fYXV0aDAgPSBuZXcgQXV0aDAoe1xuICAgIGNsaWVudElEOiAgICAgdGhpcy5fb3B0aW9ucy5jbGllbnRJRCwgXG4gICAgY2FsbGJhY2tVUkw6ICB0aGlzLl9vcHRpb25zLmNhbGxiYWNrVVJMLFxuICAgIGRvbWFpbjogICAgICAgdGhpcy5fb3B0aW9ucy5kb21haW5cbiAgfSk7XG4gIFxuICB0aGlzLl9zdHJhdGVnaWVzID0ge1xuICAgICdnb29nbGUtb3BlbmlkJzogeyBjc3M6ICdnb29nbGUnLCBuYW1lOiAnR29vZ2xlIE9wZW5JZCcsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdnb29nbGUtYXBwcyc6IHsgY3NzOiAnZ29vZ2xlJywgbmFtZTogJ0dvb2dsZSBBcHBzJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdnb29nbGUtb2F1dGgyJzogeyBjc3M6ICdnb29nbGVwbHVzJywgbmFtZTogJ0dvb2dsZScsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdmYWNlYm9vayc6IHsgY3NzOiAnZmFjZWJvb2snLCBuYW1lOiAnRmFjZWJvb2snLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnd2luZG93c2xpdmUnOiB7IGNzczogJ3dpbmRvd3MnLCBuYW1lOiAnTWljcm9zb2Z0IEFjY291bnQnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnbGlua2VkaW4nOiB7IGNzczogJ2xpbmtlZGluJywgbmFtZTogJ0xpbmtlZEluJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2dpdGh1Yic6IHsgY3NzOiAnZ2l0aHViJywgbmFtZTogJ0dpdEh1YicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdwYXlwYWwnOiB7IGNzczogJ3BheXBhbCcsIG5hbWU6ICdQYXlQYWwnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAndHdpdHRlcic6IHsgY3NzOiAndHdpdHRlcicsIG5hbWU6ICdUd2l0dGVyJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2FtYXpvbic6IHsgY3NzOiAnYW1hem9uJywgbmFtZTogJ0FtYXpvbicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICd2a29udGFrdGUnOiB7IGNzczogJ3ZrJywgbmFtZTogJ3ZLb250YWt0ZScsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICd5YW5kZXgnOiB7IGNzczogJ3lhbmRleCcsIG5hbWU6ICdZYW5kZXgnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnb2ZmaWNlMzY1JzogeyBjc3M6ICdvZmZpY2UzNjUnLCBuYW1lOiAnT2ZmaWNlMzY1Jywgc29jaWFsOiBmYWxzZSB9LFxuICAgICd3YWFkJzogeyBjc3M6ICd3YWFkJywgbmFtZTogJ1dpbmRvd3MgQXp1cmUgQUQnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2FkZnMnOiB7IGNzczogJ3dpbmRvd3MnLCBuYW1lOiAnQURGUycsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnc2FtbHAnOiB7IGNzczogJ2d1ZXN0JywgbmFtZTogJ1NBTUwnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ21zY3JtJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdEeW5hbWljcyBDUk0nLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2FkJzogeyBjc3M6ICd3aW5kb3dzJywgbmFtZTogJ0FEIC8gTERBUCcsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnY3VzdG9tJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdDdXN0b20gQXV0aCcsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnYXV0aDAnOiB7IGNzczogJ2d1ZXN0JywgbmFtZTogJ0F1dGgwJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdhdXRoMC1hZGxkYXAnOiB7IGNzczogJ2d1ZXN0JywgbmFtZTogJ0FEL0xEQVAnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ3RoaXJ0eXNldmVuc2lnbmFscyc6IHsgY3NzOiAndGhpcnR5c2V2ZW5zaWduYWxzJywgbmFtZTogJzM3IFNpZ25hbHMnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnYm94JzogeyBjc3M6ICdib3gnLCBuYW1lOiAnQm94Jywgc29jaWFsOiB0cnVlLCBpbWFnZWljb246IHRydWUgfSxcbiAgICAnc2FsZXNmb3JjZSc6IHsgY3NzOiAnc2FsZXNmb3JjZScsIG5hbWU6ICdTYWxlc2ZvcmNlJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2ZpdGJpdCc6IHsgY3NzOiAnZml0Yml0JywgbmFtZTogJ0ZpdGJpdCcsIHNvY2lhbDogdHJ1ZSB9XG4gIH07XG59XG5cbi8vIGhlbHBlciBtZXRob2RzXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NldFRvcCA9IGZ1bmN0aW9uIChvblRvcCwgZWxlbWVudCkge1xuICBpZiAoIW9uVG9wKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGVsZW1lbnQuY3NzKHtcbiAgICAgICAgJ21hcmdpblRvcCc6ICctJyArIChlbGVtZW50Lm9mZnNldCgpLmhlaWdodCAvIDIpICsgJ3B4JyxcbiAgICAgICAgJ3RvcCc6ICc1MCUnXG4gICAgICB9KTtcbiAgICB9LCAxKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmNzcyh7XG4gICAgICAnbWFyZ2luVG9wJzogJzJweCcsXG4gICAgICAndG9wJzogJzAnXG4gICAgfSk7XG4gIH1cbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2hvd0Vycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gIGlmICghZXJyb3IpIHJldHVybjtcbiAgJCgnLnNpZ25pbiBoMScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gLnN1Y2Nlc3MnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbmluIC5lcnJvcicpLmh0bWwoZXJyb3IpLmNzcygnZGlzcGxheScsICcnKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2hvd1N1Y2Nlc3MgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICBpZiAoIW1lc3NhZ2UpIHJldHVybjtcbiAgJCgnLnNpZ25pbiBoMScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gLmVycm9yJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiAuc3VjY2VzcycpLmh0bWwobWVzc2FnZSkuY3NzKCdkaXNwbGF5JywgJycpO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9pc0F1dGgwQ29ubiA9IGZ1bmN0aW9uIChzdHJhdGVneSkge1xuICByZXR1cm4gc3RyYXRlZ3kgPT09ICdhdXRoMCcgfHwgc3RyYXRlZ3kgPT09ICdhdXRoMC1hZGxkYXAnO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zZXRUaXRsZSA9IGZ1bmN0aW9uKHRpdGxlKSB7XG4gICQoJy5zaWduaW4gLmVycm9yJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiAuc3VjY2VzcycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gaDEnKS5odG1sKHRpdGxlKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3BhcnNlUmVzcG9uc2VNZXNzYWdlID0gZnVuY3Rpb24gKHJlc3BvbnNlT2JqLCBkZWZhdWx0VmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX3NpZ25pbk9wdGlvbnNbcmVzcG9uc2VPYmouY29kZV0gfHwgcmVzcG9uc2VPYmoubWVzc2FnZSB8fCBkZWZhdWx0VmFsdWU7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2lzQWRMZGFwQ29ubiA9IGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4gIHJldHVybiBjb25uZWN0aW9uID09PSAnYWRsZGFwJztcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fYXJlVGhlcmVBbnlTb2NpYWxDb25uID0gZnVuY3Rpb24gKCkge1xuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgaWYgKHRoaXMuX3N0cmF0ZWdpZXNbdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZV0gJiYgdGhpcy5fc3RyYXRlZ2llc1t0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXS5uYW1lXS5zb2NpYWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fYXJlVGhlcmVBbnlFbnRlcnByaXNlT3JEYkNvbm4gPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgcyBpbiB0aGlzLl9jbGllbnQuc3RyYXRlZ2llcykge1xuICAgIGlmICh0aGlzLl9zdHJhdGVnaWVzW3RoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdLm5hbWVdICYmIFxuICAgICAgICAhdGhpcy5fc3RyYXRlZ2llc1t0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXS5uYW1lXS5zb2NpYWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5faXNFbnRlcnByaXNlQ29ubmVjdGlvbiA9IGZ1bmN0aW9uIChlbWFpbCwgb3V0cHV0KSB7XG4gIHZhciBlbWFpbE0gPSAvXigoW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKyhcXC5bXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKSopfChcXFwiLitcXFwiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFxdKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkL1xuICAgICAgICAgICAgICAgICAgICAuZXhlYyhlbWFpbC50b0xvd2VyQ2FzZSgpKTtcblxuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgdmFyIHN0cmF0ZWd5ID0gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc107XG4gICAgaWYgKHRoaXMuX2lzQXV0aDBDb25uKHN0cmF0ZWd5Lm5hbWUpKSBjb250aW51ZTtcblxuICAgIGZvciAodmFyIGMgaW4gc3RyYXRlZ3kuY29ubmVjdGlvbnMpIHtcbiAgICAgIGlmIChlbWFpbE0gJiYgZW1haWxNLnNsaWNlKC0yKVswXSA9PSBzdHJhdGVneS5jb25uZWN0aW9uc1tjXS5kb21haW4pIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0IHx8wqB7fTtcbiAgICAgICAgb3V0cHV0LmRvbWFpbiA9IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbjtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9pc0VudGVycHJpc2VTdHJhdGVneSA9IGZ1bmN0aW9uIChzdHJhdGVneSkgeyBcbiAgZm9yICh2YXIgcyBpbiB0aGlzLl9zdHJhdGVnaWVzKSB7XG4gICAgaWYgKHMgPT09IHN0cmF0ZWd5ICYmICF0aGlzLl9zdHJhdGVnaWVzW3NdLnNvY2lhbCkgeyBcbiAgICAgIHJldHVybiB0cnVlOyBcbiAgICB9IFxuICB9IFxuXG4gIHJldHVybiBmYWxzZTsgXG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2dldENvbmZpZ3VyZWRTdHJhdGVneSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICBpZiAodGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10gJiYgdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdO1xuICAgIH1cbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9nZXRBdXRoMENvbm5lY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgLy8gaWYgc3BlY2lmaWVkLCB1c2UgaXQsIG90aGVyd2lzZSByZXR1cm4gZmlyc3RcbiAgaWYgKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3VzZXJQd2RDb25uZWN0aW9uTmFtZSddKSB7XG4gICAgZm9yICh2YXIgaSBpbiB0aGlzLl9hdXRoMFN0cmF0ZWd5LmNvbm5lY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5fYXV0aDBTdHJhdGVneS5jb25uZWN0aW9uc1tpXS5uYW1lID09PSB0aGlzLl9zaWduaW5PcHRpb25zWyd1c2VyUHdkQ29ubmVjdGlvbk5hbWUnXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXV0aDBTdHJhdGVneS5jb25uZWN0aW9uc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcy5fYXV0aDBTdHJhdGVneSA/IHRoaXMuX2F1dGgwU3RyYXRlZ3kuY29ubmVjdGlvbnNbMF0gOiBudWxsO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93T3JIaWRlUGFzc3dvcmQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtYWlsRmllbGQgPSAkKCcubm90bG9nZ2VkaW4gLmVtYWlsIGlucHV0Jyk7XG4gIHZhciBwd2RGaWVsZCAgPSAkKCcubm90bG9nZ2VkaW4gLnBhc3N3b3JkIGlucHV0JykuZmlyc3QoKTtcbiAgXG4gIHZhciBpc0VudGVycHJpc2VDb25uZWN0aW9uID0gdGhpcy5faXNFbnRlcnByaXNlQ29ubmVjdGlvbihtYWlsRmllbGQudmFsKCkpO1xuXG4gIGlmIChpc0VudGVycHJpc2VDb25uZWN0aW9uKSB7XG4gICAgcHdkRmllbGQuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcbiAgICBwd2RGaWVsZC5hdHRyKCdwbGFjZWhvbGRlcicsICcnKTtcbiAgICBwd2RGaWVsZC5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpO1xuICB9IGVsc2Uge1xuICAgIHB3ZEZpZWxkLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgcHdkRmllbGQuYXR0cigncGxhY2Vob2xkZXInLCB0aGlzLl9zaWduaW5PcHRpb25zWydwYXNzd29yZFBsYWNlaG9sZGVyJ10pO1xuICAgIHB3ZEZpZWxkLmF0dHIoJ3JlcXVpcmVkJywgdHJ1ZSk7XG4gIH1cbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5faGlkZVNpZ25JbiA9IGZ1bmN0aW9uIChjYikge1xuICAkKCdkaXYub3ZlcmxheScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkKCkucmVtb3ZlQ2xhc3MoJ21vZGUtc2lnbmluJyk7XG4gICAgJCgpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgaWYgKGNiKSBjYigpO1xuICB9LCA1MDApO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9nZXRBY3RpdmVMb2dpblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2hhc0xvZ2dlZEluQmVmb3JlID8gJCgnLmxvZ2dlZGluJykgOiAkKCcubm90bG9nZ2VkaW4nKTtcbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fdG9nZ2xlU3Bpbm5lciA9IGZ1bmN0aW9uIChjb250YWluZXIpIHtcbiAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IHRoaXMuX2dldEFjdGl2ZUxvZ2luVmlldygpO1xuICB2YXIgc3Bpbm5lciA9ICQoJy5zcGlubmVyJywgY29udGFpbmVyKTtcbiAgdmFyIHNpZ25pbiA9ICQoJy56b2NpYWwucHJpbWFyeScsIGNvbnRhaW5lcik7XG5cbiAgc3Bpbm5lci5jc3MoJ2Rpc3BsYXknLCBzcGlubmVyLmNzcygnZGlzcGxheScpID09PSAnbm9uZScgPyAnJyA6ICdub25lJyk7XG4gIHNpZ25pbi5jc3MoJ2Rpc3BsYXknLCBzaWduaW4uY3NzKCdkaXNwbGF5JykgPT09ICdub25lJyA/ICcnIDogJ25vbmUnKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2hvd1NpZ25VcEV4cGVyaWVuY2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2V0TG9naW5WaWV3KHsgbW9kZTogJ3NpZ251cCcgfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Nob3dSZXNldEV4cGVyaWVuY2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2V0TG9naW5WaWV3KHsgbW9kZTogJ3Jlc2V0JyB9KTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2V0TG9naW5WaWV3ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fMKge307XG5cbiAgJCgnLmxvZ2dlZGluJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLm5vdGxvZ2dlZGluJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ251cCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5yZXNldCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gaW5wdXRbdHlwZT1wYXNzd29yZF0nKS52YWwoJycpO1xuXG4gIGlmICghb3B0aW9ucy5tb2RlKSB7XG4gICAgdGhpcy5faGFzTG9nZ2VkSW5CZWZvcmUgPSAhIW9wdGlvbnMuaXNSZXR1cm5pbmdVc2VyO1xuICAgIHRoaXMuX3NldFRpdGxlKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3RpdGxlJ10pO1xuXG4gICAgJCgnLmxvZ2dlZGluJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5pc1JldHVybmluZ1VzZXIgPyAnJyA6ICdub25lJyk7XG4gICAgJCgnLm5vdGxvZ2dlZGluJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5pc1JldHVybmluZ1VzZXIgPyAnbm9uZScgOiAnJyk7XG5cbiAgICB0aGlzLl9zZXRUb3AodGhpcy5fc2lnbmluT3B0aW9ucy50b3AsICQoJy5zaWduaW4gZGl2LnBhbmVsLm9uZXN0ZXAnKSk7XG5cbiAgICB0cnkgeyBcbiAgICAgIGlmIChvcHRpb25zLmlzUmV0dXJuaW5nVXNlcikgJCgnLmxvZ2dlZGluIC5wYXNzd29yZCBpbnB1dCcpLmZpcnN0KCkuZm9jdXMoKTtcbiAgICAgIGVsc2UgJCgnLm5vdGxvZ2dlZGluIC5lbWFpbCBpbnB1dCcpLmZpcnN0KCkuZm9jdXMoKTtcbiAgICB9IGNhdGNoKGUpIHt9XG4gICAgXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNvbnRhaW5lcjtcblxuICBzd2l0Y2ggKG9wdGlvbnMubW9kZSkge1xuICAgIGNhc2UgJ3NpZ251cCc6XG4gICAgICB0aGlzLl9zZXRUaXRsZSh0aGlzLl9zaWduaW5PcHRpb25zWydzaWdudXBUaXRsZSddKTtcbiAgICAgIGNvbnRhaW5lciA9ICQoJy5zaWdudXAnKS5maXJzdCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmVzZXQnOlxuICAgICAgdGhpcy5fc2V0VGl0bGUodGhpcy5fc2lnbmluT3B0aW9uc1sncmVzZXRUaXRsZSddKTtcbiAgICAgIGNvbnRhaW5lciA9ICQoJy5yZXNldCcpLmZpcnN0KCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGlmIChjb250YWluZXIpIHtcbiAgICB0aGlzLl9zZXRUb3AodGhpcy5fc2lnbmluT3B0aW9ucy50b3AsICQoJy5zaWduaW4gZGl2LnBhbmVsLm9uZXN0ZXAnKSk7XG4gICAgY29udGFpbmVyLmNzcygnZGlzcGxheScsICcnKTtcblxuICAgIHRyeSB7IFxuICAgICAgdmFyIGVtYWlsID0gJCgnLm5vdGxvZ2dlZGluIC5lbWFpbCBpbnB1dCcpLnZhbCgpO1xuICAgICAgJCgnLmVtYWlsIGlucHV0JywgY29udGFpbmVyKS52YWwoZW1haWwpO1xuICAgICAgJCgnLmVtYWlsIGlucHV0JywgY29udGFpbmVyKS5maXJzdCgpLmZvY3VzKCk7XG4gICAgfSBjYXRjaChlKSB7fVxuICB9XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Nob3dMb2dnZWRJbkV4cGVyaWVuY2UgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgc3RyYXRlZ3kgPSB0aGlzLl9zc29EYXRhLmxhc3RVc2VkQ29ubmVjdGlvbi5zdHJhdGVneTtcbiAgdGhpcy5fc2V0TG9naW5WaWV3KHsgaXNSZXR1cm5pbmdVc2VyOiAhIXN0cmF0ZWd5IH0pO1xuXG4gIGlmICghc3RyYXRlZ3kpIHJldHVybjtcblxuICB2YXIgbG9naW5WaWV3ID0gdGhpcy5fZ2V0QWN0aXZlTG9naW5WaWV3KCk7XG4gIGJlYW4ub24oJCgnZm9ybScsIGxvZ2luVmlldylbMF0sICdzdWJtaXQnLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9zaWduSW5FbnRlcnByaXNlKGUpOyB9KTtcbiAgXG4gIHZhciBidXR0b247XG4gIGlmIChzdHJhdGVneSAhPT0gJ2F1dGgwJykge1xuICAgIGJ1dHRvbiA9IGJvbnpvKGJvbnpvLmNyZWF0ZSgnPHNwYW4+PC9zcGFuPicpKVxuICAgICAgLmF0dHIoJ3RhYmluZGV4JywgMClcbiAgICAgIC5hdHRyKCdkYXRhLXN0cmF0ZWd5Jywgc3RyYXRlZ3kpXG4gICAgICAuYXR0cigndGl0bGUnLCB0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5uYW1lKVxuICAgICAgLmFkZENsYXNzKCd6b2NpYWwnKS5hZGRDbGFzcygnYmxvY2snKVxuICAgICAgLmFkZENsYXNzKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLmNzcylcbiAgICAgIC5hZGRDbGFzcyh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5pbWFnZWljb24gPyAnaW1hZ2UtaWNvbicgOiAnJylcbiAgICAgIC5odG1sKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLm5hbWUpO1xuICAgIFxuICAgIGJlYW4ub24oYnV0dG9uWzBdLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9zaWduSW5Tb2NpYWwoZS50YXJnZXQpOyB9KTtcblxuICAgICQoJy5zdHJhdGVneSBzcGFuJywgbG9naW5WaWV3KS5lYWNoKGZ1bmN0aW9uIChlbCkgeyBpZiAoZWwpIGVsLnJlbW92ZSgpOyB9KTtcbiAgICAkKCcuc3RyYXRlZ3knLCBsb2dpblZpZXcpLmFwcGVuZChidXR0b24pO1xuICB9XG5cbiAgJCgnLmFsbCcsIGxvZ2luVmlldykuaHRtbCh0aGlzLl9zaWduaW5PcHRpb25zWydhbGxCdXR0b25UZW1wbGF0ZSddKTtcblxuICBiZWFuLm9uKCQoJy5hbGwnLCBsb2dpblZpZXcpWzBdLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fc2V0TG9naW5WaWV3KCk7XG4gIH0pO1xuXG4gIGlmICh0aGlzLl9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUpIHtcbiAgICBpZiAoc3RyYXRlZ3kgPT09ICdhdXRoMCcpIHtcbiAgICAgICQoJy5lbWFpbC1yZWFkb25seScsIGxvZ2luVmlldykuaHRtbCh0aGlzLl9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUpOyBcbiAgICAgICQoJy5lbWFpbCBpbnB1dCcsIGxvZ2luVmlldykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICQoJy5lbWFpbFBhc3N3b3JkJywgbG9naW5WaWV3KS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gICAgfSBcbiAgICBlbHNlIGlmICh0aGlzLl9pc0VudGVycHJpc2VTdHJhdGVneShzdHJhdGVneSkpIHtcbiAgICAgIGJ1dHRvbi5odG1sKHRoaXMuX3Nzb0RhdGEubGFzdFVzZWRVc2VybmFtZSB8fCB0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5uYW1lKVxuICAgICAgICAgICAgLmF0dHIoJ3RpdGxlJywgdGhpcy5fc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lIHx8IHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLm5hbWUpO1xuICAgIH1cbiAgfVxufTtcblxuLy8gc2lnbiBpbiBtZXRob2RzXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NpZ25JblNvY2lhbCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgdmFyIHN0cmF0ZWd5TmFtZSA9IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID8gdGFyZ2V0IDogdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zdHJhdGVneScpO1xuICB2YXIgc3RyYXRlZ3kgPSB0aGlzLl9nZXRDb25maWd1cmVkU3RyYXRlZ3koc3RyYXRlZ3lOYW1lKTtcblxuICBpZiAoc3RyYXRlZ3kpIHtcbiAgICB0aGlzLl9hdXRoMC5sb2dpbih7XG4gICAgICBjb25uZWN0aW9uOiBzdHJhdGVneS5jb25uZWN0aW9uc1swXS5uYW1lXG4gICAgfSk7XG4gIH1cbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2lnbkluRW50ZXJwcmlzZSA9IGZ1bmN0aW9uIChlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICB2YXIgY29udGFpbmVyID0gdGhpcy5fZ2V0QWN0aXZlTG9naW5WaWV3KCk7XG4gIHZhciBmb3JtID0gJCgnZm9ybScsIGNvbnRhaW5lcik7XG4gIHZhciB2YWxpZCA9IHRydWU7XG5cbiAgdmFyIGVtYWlsRCA9ICQoJy5lbWFpbCcsIGZvcm0pLFxuICAgICAgZW1haWxFID0gJCgnaW5wdXRbbmFtZT1lbWFpbF0nLCBmb3JtKSxcbiAgICAgIGVtYWlsTSA9IC9eKChbXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXF0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvLmV4ZWMoZW1haWxFLnZhbCgpLnRvTG93ZXJDYXNlKCkpLFxuICAgICAgZW1haWxQID0gL15cXHMqJC8udGVzdChlbWFpbEUudmFsKCkpLFxuICAgICAgZG9tYWluLCBjb25uZWN0aW9uLCBlbWFpbCA9IG51bGwsIHN0cmF0ZWd5O1xuXG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICBzdHJhdGVneSA9IHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdO1xuXG4gICAgaWYgKHRoaXMuX2lzQXV0aDBDb25uKHN0cmF0ZWd5Lm5hbWUpKSBjb250aW51ZTtcblxuICAgIGZvciAodmFyIGMgaW4gc3RyYXRlZ3kuY29ubmVjdGlvbnMpIHtcbiAgICAgIGlmKCFlbWFpbFAgJiYgZW1haWxNICYmIGVtYWlsTS5zbGljZSgtMilbMF0gPT0gc3RyYXRlZ3kuY29ubmVjdGlvbnNbY10uZG9tYWluKSB7XG4gICAgICAgIGRvbWFpbiA9IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbjtcbiAgICAgICAgY29ubmVjdGlvbiA9IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLm5hbWU7XG4gICAgICAgIGVtYWlsID0gZW1haWxFLnZhbCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZG9tYWluKSBicmVhaztcbiAgfVxuXG4gIGlmIChlbWFpbFApIHtcbiAgICB0aGlzLl9zaG93RXJyb3IodGhpcy5fc2lnbmluT3B0aW9uc1snc3RyYXRlZ3lFbWFpbEVtcHR5J10pO1xuICB9IFxuICBlbHNlIGlmICghZW1haWxNKSB7XG4gICAgdGhpcy5fc2hvd0Vycm9yKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxJbnZhbGlkJ10pO1xuICB9IFxuICBlbHNlIGlmICghZG9tYWluKSB7XG4gICAgaWYgKHRoaXMuX2F1dGgwU3RyYXRlZ3kpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zaWduSW5XaXRoQXV0aDAoZW1haWxFLnZhbCgpKTtcbiAgICB9XG5cbiAgICBpZiAoZW1haWxNICYmIGVtYWlsTS5zbGljZSgtMilbMF0gPT09ICdnbWFpbC5jb20nKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2lnbkluU29jaWFsKCdnb29nbGUtb2F1dGgyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2hvd0Vycm9yKFxuICAgICAgdGhpcy5fc2lnbmluT3B0aW9uc1snc3RyYXRlZ3lEb21haW5JbnZhbGlkJ11cbiAgICAgICAgICAucmVwbGFjZSgne2RvbWFpbn0nLCBlbWFpbE0gPyBlbWFpbE0uc2xpY2UoLTIpWzBdIDogJycpKTtcbiAgfVxuXG4gIHZhbGlkICY9ICghZG9tYWluICYmICFlbWFpbEQuYWRkQ2xhc3MoJ2ludmFsaWQnKSkgfHwgKCEhZG9tYWluICYmICEhZW1haWxELnJlbW92ZUNsYXNzKCdpbnZhbGlkJykpO1xuXG4gIGlmICh2YWxpZCkge1xuICAgIHRoaXMuX2F1dGgwLmxvZ2luKHtcbiAgICAgIGNvbm5lY3Rpb246IGNvbm5lY3Rpb25cbiAgICB9KTtcbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaWduSW5XaXRoQXV0aDAgPSBmdW5jdGlvbiAodXNlck5hbWUsIHNpZ25JblBhc3N3b3JkKSB7XG4gIHRoaXMuX3RvZ2dsZVNwaW5uZXIoKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjb250YWluZXIgPSB0aGlzLl9nZXRBY3RpdmVMb2dpblZpZXcoKTtcbiAgdmFyIGNvbm5lY3Rpb24gID0gdGhpcy5fZ2V0QXV0aDBDb25uZWN0aW9uKCk7XG4gIFxuICAvLyBUT0RPOiBzdXBwb3J0IGF1dGgwLWFkbGRhcFxuICB2YXIgbG9naW5PcHRpb25zID0ge1xuICAgIGNvbm5lY3Rpb246IGNvbm5lY3Rpb24ubmFtZSxcbiAgICB1c2VybmFtZTogdGhpcy5faXNBZExkYXBDb25uKGNvbm5lY3Rpb24ubmFtZSkgPyB1c2VyTmFtZS5yZXBsYWNlKCdAJyArIGNvbm5lY3Rpb24uZG9tYWluLCAnJykgOiB1c2VyTmFtZSxcbiAgICBwYXNzd29yZDogc2lnbkluUGFzc3dvcmQgfHzCoCQoJy5wYXNzd29yZCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKClcbiAgfTtcblxuICBmb3IgKHZhciBrIGluIHRoaXMuX2F1dGgwQ29ubmVjdGlvblBhcmFtcykge1xuICAgIGxvZ2luT3B0aW9uc1trXSA9IHRoaXMuX2F1dGgwQ29ubmVjdGlvblBhcmFtc1trXTtcbiAgfVxuXG4gIHRoaXMuX2F1dGgwLmxvZ2luKGxvZ2luT3B0aW9ucywgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHNlbGYuX3Nob3dFcnJvcihzZWxmLl9wYXJzZVJlc3BvbnNlTWVzc2FnZShlcnIsIHNlbGYuX3NpZ25pbk9wdGlvbnNbJ3dyb25nRW1haWxQYXNzd29yZEVycm9yVGV4dCddKSk7XG4gICAgfVxuXG4gICAgc2VsZi5fdG9nZ2xlU3Bpbm5lcigpO1xuICB9KTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2lnblVwV2l0aEF1dGgwID0gZnVuY3Rpb24gKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGNvbnRhaW5lciA9ICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuc2lnbnVwJyk7XG4gIHZhciBlbWFpbCA9ICQoJy5lbWFpbCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKCk7XG4gIHZhciBwYXNzd29yZCA9ICQoJy5wYXNzd29yZCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKCk7XG4gIHZhciBjb25uZWN0aW9uICA9IHRoaXMuX2dldEF1dGgwQ29ubmVjdGlvbigpO1xuXG4gIHRoaXMuX3RvZ2dsZVNwaW5uZXIoY29udGFpbmVyKTtcblxuICB0aGlzLl9hdXRoMC5zaWdudXAoe1xuICAgIGNvbm5lY3Rpb246IGNvbm5lY3Rpb24ubmFtZSxcbiAgICB1c2VybmFtZTogICBlbWFpbCxcbiAgICBwYXNzd29yZDogICBwYXNzd29yZFxuICB9LCBcbiAgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHNlbGYuX3Nob3dFcnJvcihzZWxmLl9wYXJzZVJlc3BvbnNlTWVzc2FnZShlcnIsIHNlbGYuX3NpZ25pbk9wdGlvbnNbJ3NpZ251cFNlcnZlckVycm9yVGV4dCddKSk7XG4gICAgICBzZWxmLl90b2dnbGVTcGlubmVyKGNvbnRhaW5lcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGYuX3NpZ25JbldpdGhBdXRoMChlbWFpbCwgcGFzc3dvcmQpO1xuICB9KTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fcmVzZXRQYXNzd29yZFdpdGhBdXRoMCA9IGZ1bmN0aW9uIChlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjb250YWluZXIgPSAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLnJlc2V0Jyk7XG4gIHZhciBlbWFpbCA9ICQoJy5lbWFpbCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKCk7XG4gIHZhciBwYXNzd29yZCA9ICQoJy5wYXNzd29yZCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKCk7XG4gIHZhciBjb25uZWN0aW9uICA9IHRoaXMuX2dldEF1dGgwQ29ubmVjdGlvbigpO1xuXG4gIHRoaXMuX3RvZ2dsZVNwaW5uZXIoY29udGFpbmVyKTtcblxuICB0aGlzLl9hdXRoMC5jaGFuZ2VQYXNzd29yZCh7XG4gICAgY29ubmVjdGlvbjogY29ubmVjdGlvbi5uYW1lLFxuICAgIHVzZXJuYW1lOiAgIGVtYWlsLFxuICAgIHBhc3N3b3JkOiAgIHBhc3N3b3JkXG4gIH0sIFxuICBmdW5jdGlvbiAoZXJyKSB7XG4gICAgc2VsZi5fdG9nZ2xlU3Bpbm5lcihjb250YWluZXIpO1xuXG4gICAgJCgnLnBhc3N3b3JkIGlucHV0JywgY29udGFpbmVyKS52YWwoJycpO1xuICAgICQoJy5yZXBlYXRQYXNzd29yZCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKCcnKTtcblxuICAgIGlmIChlcnIpIHtcbiAgICAgIHNlbGYuX3Nob3dFcnJvcihzZWxmLl9wYXJzZVJlc3BvbnNlTWVzc2FnZShlcnIsIHNlbGYuX3NpZ25pbk9wdGlvbnNbJ3Jlc2V0U2VydmVyRXJyb3JUZXh0J10pKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLnZhbCgnJyk7XG5cbiAgICB0cnkgeyBcbiAgICAgICQoJy5lbWFpbCBpbnB1dCcsIGNvbnRhaW5lcikuZmlyc3QoKS5mb2N1cygpOyBcbiAgICB9IGNhdGNoKGUpIHt9ICBcblxuICAgIHNlbGYuX3NldExvZ2luVmlldygpO1xuICAgIHNlbGYuX3Nob3dTdWNjZXNzKHNlbGYuX3NpZ25pbk9wdGlvbnNbJ3Jlc2V0U3VjY2Vzc1RleHQnXSk7XG4gIH0pO1xufTtcblxuLy8gaW5pdGlhbGl6ZVxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAvLyBUT0RPOiBzdXBwb3J0IGNzcyBvcHRpb24gZm9yIG5vbiBmcmVlIHN1YnNjcmlwdGlvbnNcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGJlYW4ub24oJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIGEuY2xvc2UnKVswXSwgJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyBzZWxmLl9oaWRlU2lnbkluKCk7IH0pO1xuICBiZWFuLm9uKCQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAubm90bG9nZ2VkaW4gZm9ybScpWzBdLCAnc3VibWl0JywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2lnbkluRW50ZXJwcmlzZShlKTsgfSk7XG4gIGJlYW4ub24oJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5zaWdudXAgZm9ybScpWzBdLCAnc3VibWl0JywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2lnblVwV2l0aEF1dGgwKGUpOyB9KTtcbiAgYmVhbi5vbigkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLnJlc2V0IGZvcm0nKVswXSwgJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3Jlc2V0UGFzc3dvcmRXaXRoQXV0aDAoZSk7IH0pO1xuICBiZWFuLm9uKHF3ZXJ5KCdodG1sJylbMF0sICdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCQoKS5oYXNDbGFzcygnbW9kZS1zaWduaW4nKSkge1xuICAgICAgaWYgKChlLndoaWNoID09IDI3IHx8IGUua2V5Y29kZSA9PSAyNykgJiYgIXNlbGYuX3NpZ25pbk9wdGlvbnMuc3RhbmRhbG9uZSkge1xuICAgICAgICBzZWxmLl9oaWRlU2lnbkluKCk7IC8vIGNsb3NlIHBvcHVwIHdpdGggRVNDIGtleVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gbG9hZCBzb2NpYWwgYnV0dG9uc1xuICB2YXIgbGlzdCA9ICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3QnKTtcbiAgZm9yICh2YXIgcyBpbiB0aGlzLl9jbGllbnQuc3RyYXRlZ2llcykge1xuICAgIHZhciBzdHJhdGVneSA9IHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdO1xuXG4gICAgaWYgKHRoaXMuX2lzQXV0aDBDb25uKHN0cmF0ZWd5Lm5hbWUpICYmIHN0cmF0ZWd5LmNvbm5lY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2F1dGgwU3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgICAgICQoJy5jcmVhdGUtYWNjb3VudCwgLnBhc3N3b3JkJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAgIGJlYW4ub24oJCgnLm5vdGxvZ2dlZGluIC5lbWFpbCBpbnB1dCcpWzBdLCAnaW5wdXQnLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9zaG93T3JIaWRlUGFzc3dvcmQoZSk7IH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdICYmIHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0uc29jaWFsKSB7XG4gICAgICB2YXIgYnV0dG9uID0gYm9uem8oYm9uem8uY3JlYXRlKCc8c3Bhbj48L3NwYW4+JykpXG4gICAgICAgIC5hdHRyKCd0YWJpbmRleCcsIDApXG4gICAgICAgIC5hdHRyKCdkYXRhLXN0cmF0ZWd5Jywgc3RyYXRlZ3kubmFtZSlcbiAgICAgICAgLmF0dHIoJ3RpdGxlJywgdGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneS5uYW1lXS5uYW1lKVxuICAgICAgICAuYWRkQ2xhc3MoJ3pvY2lhbCcpLmFkZENsYXNzKCdpY29uJylcbiAgICAgICAgLmFkZENsYXNzKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0uY3NzKVxuICAgICAgICAuYWRkQ2xhc3ModGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneS5uYW1lXS5pbWFnZWljb24gPyAnaW1hZ2UtaWNvbicgOiAnJylcbiAgICAgICAgLmh0bWwodGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneS5uYW1lXS5uYW1lKTtcblxuICAgICAgbGlzdC5hcHBlbmQoYnV0dG9uKTtcbiAgICAgIGxpc3QuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAgICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuc2VwYXJhdG9yJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgfVxuICB9XG5cbiAgJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5pY29ubGlzdCBzcGFuJykuZWFjaChmdW5jdGlvbiAoYnV0dG9uKSB7XG4gICAgYmVhbi5vbihidXR0b24sICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmLl9zaWduSW5Tb2NpYWwoZS50YXJnZXQpO1xuICAgIH0pO1xuICB9KTtcblxuICB0aGlzLl9zaG93U2lnbkluKCk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Nob3dTaWduSW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJCgpLmFkZENsYXNzKCdtb2RlLXNpZ25pbicpO1xuXG4gIC8vIGlmIG5vIHNvY2lhbCBjb25uZWN0aW9ucyBhbmQgb25lIGVudGVycHJpc2UgY29ubmVjdGlvbiBvbmx5LCByZWRpcmVjdFxuICBpZiAoIXRoaXMuX2FyZVRoZXJlQW55U29jaWFsQ29ubigpICYmIFxuICAgIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzLmxlbmd0aCA9PT0gMSAmJlxuICAgIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzWzBdLm5hbWUgIT09ICdhdXRoMCcgJiZcbiAgICB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1swXS5jb25uZWN0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICBcbiAgICB0aGlzLl9hdXRoMC5sb2dpbih7XG4gICAgICBjb25uZWN0aW9uOiB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1swXS5jb25uZWN0aW9uc1swXS5uYW1lXG4gICAgfSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBsYWJlbHMgdGV4dFxuICB2YXIgb3B0aW9ucyA9IHh0ZW5kKHRoaXMuX3NpZ25pbk9wdGlvbnMsIHRoaXMuX3NpZ25pbk9wdGlvbnMucmVzb3VyY2VzKTtcbiAgb3B0aW9uc1snb25lc3RlcCddID0gdHlwZW9mIG9wdGlvbnNbJ29uZXN0ZXAnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydvbmVzdGVwJ10gOiBmYWxzZTtcbiAgb3B0aW9uc1sndG9wJ10gPSBvcHRpb25zWyd0b3AnXSB8fCBmYWxzZTtcbiAgb3B0aW9uc1sndGl0bGUnXSA9IG9wdGlvbnNbJ3RpdGxlJ10gfHwgJ1NpZ24gSW4nO1xuICBvcHRpb25zWydhbGxCdXR0b25UZW1wbGF0ZSddID0gb3B0aW9uc1snYWxsQnV0dG9uVGVtcGxhdGUnXSB8fCBcIlNob3cgYWxsXCI7XG4gIG9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxFbXB0eSddID0gb3B0aW9uc1snc3RyYXRlZ3lFbWFpbEVtcHR5J10gfHwgXCJUaGUgZW1haWwgaXMgZW1wdHkuXCI7XG4gIG9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxJbnZhbGlkJ10gPSBvcHRpb25zWydzdHJhdGVneUVtYWlsSW52YWxpZCddIHx8IFwiVGhlIGVtYWlsIGlzIGludmFsaWQuXCI7XG4gIG9wdGlvbnNbJ3N0cmF0ZWd5RG9tYWluSW52YWxpZCddID0gb3B0aW9uc1snc3RyYXRlZ3lEb21haW5JbnZhbGlkJ10gfHwgXCJUaGUgZG9tYWluIHtkb21haW59IGhhcyBub3QgYmVlbiBzZXR1cC5cIjtcblxuICBvcHRpb25zWydpY29uJ10gPSBvcHRpb25zWydpY29uJ10gfHwgXCJodHRwczovL3MzLmFtYXpvbmF3cy5jb20vYXNzZXRzLmF1dGgwLmNvbS93Mi9pbWcvbG9nby0zMi5wbmdcIjtcbiAgb3B0aW9uc1snc2hvd0ljb24nXSA9IHR5cGVvZiBvcHRpb25zWydzaG93SWNvbiddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3Nob3dJY29uJ10gOiBmYWxzZTtcbiAgb3B0aW9uc1snc2hvd1NpZ251cCddID0gdHlwZW9mIG9wdGlvbnNbJ3Nob3dTaWdudXAnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93U2lnbnVwJ10gOiB0cnVlO1xuICBvcHRpb25zWydzaG93Rm9yZ290J10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd0ZvcmdvdCddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3Nob3dGb3Jnb3QnXSA6IHRydWU7XG4gIG9wdGlvbnNbJ3NpZ251cFRleHQnXSA9IG9wdGlvbnNbJ3NpZ251cFRleHQnXSB8fCAnU2lnbiBVcCc7XG4gIG9wdGlvbnNbJ2ZvcmdvdFRleHQnXSA9IG9wdGlvbnNbJ2ZvcmdvdFRleHQnXSB8fCAnRm9yZ290IHlvdXIgcGFzc3dvcmQ/JztcbiAgb3B0aW9uc1snc2lnbkluQnV0dG9uVGV4dCddID0gb3B0aW9uc1snc2lnbkluQnV0dG9uVGV4dCddIHx8ICdTaWduIEluJztcbiAgb3B0aW9uc1snZW1haWxQbGFjZWhvbGRlciddID0gb3B0aW9uc1snZW1haWxQbGFjZWhvbGRlciddIHx8ICdFbWFpbCc7XG4gIG9wdGlvbnNbJ3Bhc3N3b3JkUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ3Bhc3N3b3JkUGxhY2Vob2xkZXInXSB8fCAnUGFzc3dvcmQnO1xuICBvcHRpb25zWydzZXBhcmF0b3JUZXh0J10gPSBvcHRpb25zWydzZXBhcmF0b3JUZXh0J10gfHwgJ29yJztcbiAgb3B0aW9uc1snc2VydmVyRXJyb3JUZXh0J10gPSBvcHRpb25zWydzZXJ2ZXJFcnJvclRleHQnXSB8fCAnVGhlcmUgd2FzIGFuIGVycm9yIHByb2Nlc3NpbmcgdGhlIHNpZ24gaW4uJztcbiAgb3B0aW9uc1snc2hvd0VtYWlsJ10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd0VtYWlsJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2hvd0VtYWlsJ10gOiB0cnVlO1xuICBvcHRpb25zWydzaG93UGFzc3dvcmQnXSA9IHR5cGVvZiBvcHRpb25zWydzaG93UGFzc3dvcmQnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93UGFzc3dvcmQnXSA6IHRydWU7XG4gIG9wdGlvbnNbJ3NvY2lhbEJpZ0J1dHRvbnMnXSA9IHR5cGVvZiBvcHRpb25zWydzb2NpYWxCaWdCdXR0b25zJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc29jaWFsQmlnQnV0dG9ucyddIDogIXRoaXMuX2FyZVRoZXJlQW55RW50ZXJwcmlzZU9yRGJDb25uKCk7XG4gIG9wdGlvbnNbJ2VuYWJsZVJldHVyblVzZXJFeHBlcmllbmNlJ10gPSB0eXBlb2Ygb3B0aW9uc1snZW5hYmxlUmV0dXJuVXNlckV4cGVyaWVuY2UnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydlbmFibGVSZXR1cm5Vc2VyRXhwZXJpZW5jZSddIDogdHJ1ZTtcbiAgb3B0aW9uc1sncmV0dXJuVXNlckxhYmVsJ10gPSBvcHRpb25zWydyZXR1cm5Vc2VyTGFiZWwnXSB8fCAnTGFzdCB0aW1lIHlvdSBzaWduZWQgaW4gdXNpbmcuLi4nO1xuICBvcHRpb25zWyd3cm9uZ0VtYWlsUGFzc3dvcmRFcnJvclRleHQnXSA9IG9wdGlvbnNbJ3dyb25nRW1haWxQYXNzd29yZEVycm9yVGV4dCddIHx8ICdXcm9uZyBlbWFpbCBvciBwYXNzd29yZC4nO1xuXG4gIC8vIHNpZ251cFxuICBvcHRpb25zWydzaWdudXBUaXRsZSddID0gb3B0aW9uc1snc2lnbnVwVGl0bGUnXSB8fCAnU2lnbiBVcCc7XG4gIG9wdGlvbnNbJ3NpZ251cEJ1dHRvblRleHQnXSA9IG9wdGlvbnNbJ3NpZ251cEJ1dHRvblRleHQnXSB8fCAnU2lnbiBVcCc7XG4gIG9wdGlvbnNbJ3NpZ251cEVtYWlsUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ3NpZ251cEVtYWlsUGxhY2Vob2xkZXInXSB8fCAnRW1haWwnO1xuICBvcHRpb25zWydzaWdudXBQYXNzd29yZFBsYWNlaG9sZGVyJ10gPSBvcHRpb25zWydzaWdudXBQYXNzd29yZFBsYWNlaG9sZGVyJ10gfHwgJ0NyZWF0ZSBhIFBhc3N3b3JkJztcbiAgb3B0aW9uc1snc2lnbnVwQ2FuY2VsQnV0dG9uVGV4dCddID0gb3B0aW9uc1snc2lnbnVwQ2FuY2VsQnV0dG9uVGV4dCddIHx8ICdDYW5jZWwnO1xuICBvcHRpb25zWydzaWdudXBIZWFkZXJUZXh0J10gPSB0eXBlb2Ygb3B0aW9uc1snc2lnbnVwSGVhZGVyVGV4dCddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3NpZ251cEhlYWRlclRleHQnXSA6ICdQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQnO1xuICBvcHRpb25zWydzaWdudXBGb290ZXJUZXh0J10gPSB0eXBlb2Ygb3B0aW9uc1snc2lnbnVwRm9vdGVyVGV4dCddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3NpZ251cEZvb3RlclRleHQnXSA6ICdCeSBjbGlja2luZyBcIlNpZ24gVXBcIiwgeW91IGFncmVlIHRvIG91ciB0ZXJtcyBvZiBzZXJ2aWNlIGFuZCBwcml2YWN5IHBvbGljeS4nO1xuICBvcHRpb25zWydzaWdudXBFbnRlcnByaXNlRW1haWxXYXJuaW5nVGV4dCddID0gb3B0aW9uc1snc2lnbnVwRW50ZXJwcmlzZUVtYWlsV2FybmluZ1RleHQnXSB8fCAnVGhpcyBkb21haW4ge2RvbWFpbn0gaGFzIGJlZW4gY29uZmlndXJlZCBmb3IgU2luZ2xlIFNpZ24gT24gYW5kIHlvdSBjYW5cXCd0IGNyZWF0ZSBhbiBhY2NvdW50LiBUcnkgc2lnbmluZyBpbiBpbnN0ZWFkLic7XG4gIG9wdGlvbnNbJ3NpZ251cFNlcnZlckVycm9yVGV4dCddID0gb3B0aW9uc1snc2lnbnVwU2VydmVyRXJyb3JUZXh0J10gfHwgJ1RoZXJlIHdhcyBhbiBlcnJvciBwcm9jZXNzaW5nIHRoZSBzaWduIHVwLic7XG5cbiAgLy8gcmVzZXRcbiAgb3B0aW9uc1sncmVzZXRUaXRsZSddID0gb3B0aW9uc1sncmVzZXRUaXRsZSddIHx8ICdSZXNldCBQYXNzd29yZCc7XG4gIG9wdGlvbnNbJ3Jlc2V0QnV0dG9uVGV4dCddID0gb3B0aW9uc1sncmVzZXRCdXR0b25UZXh0J10gfHwgJ1NlbmQnO1xuICBvcHRpb25zWydyZXNldEVtYWlsUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ3Jlc2V0RW1haWxQbGFjZWhvbGRlciddIHx8ICdFbWFpbCc7XG4gIG9wdGlvbnNbJ3Jlc2V0UGFzc3dvcmRQbGFjZWhvbGRlciddID0gb3B0aW9uc1sncmVzZXRQYXNzd29yZFBsYWNlaG9sZGVyJ10gfHwgJ05ldyBQYXNzd29yZCc7XG4gIG9wdGlvbnNbJ3Jlc2V0UmVwZWF0UGFzc3dvcmRQbGFjZWhvbGRlciddID0gb3B0aW9uc1sncmVzZXRSZXBlYXRQYXNzd29yZFBsYWNlaG9sZGVyJ10gfHwgJ0NvbmZpcm0gTmV3IFBhc3N3b3JkJztcbiAgb3B0aW9uc1sncmVzZXRDYW5jZWxCdXR0b25UZXh0J10gPSBvcHRpb25zWydyZXNldENhbmNlbEJ1dHRvblRleHQnXSB8fCAnQ2FuY2VsJztcbiAgb3B0aW9uc1sncmVzZXRTdWNjZXNzVGV4dCddID0gb3B0aW9uc1sncmVzZXRTdWNjZXNzVGV4dCddIHx8ICdXZVxcJ3ZlIGp1c3Qgc2VudCB5b3UgYW4gZW1haWwgdG8gcmVzZXQgeW91ciBwYXNzd29yZC4nO1xuICBvcHRpb25zWydyZXNldEVudGVyU2FtZVBhc3N3b3JkVGV4dCddID0gb3B0aW9uc1sncmVzZXRFbnRlclNhbWVQYXNzd29yZFRleHQnXSB8fCAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHBhc3N3b3JkLic7XG4gIG9wdGlvbnNbJ3Jlc2V0SGVhZGVyVGV4dCddID0gdHlwZW9mIG9wdGlvbnNbJ3Jlc2V0SGVhZGVyVGV4dCddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3Jlc2V0SGVhZGVyVGV4dCddIDogJ1BsZWFzZSBlbnRlciB5b3VyIGVtYWlsIGFuZCB0aGUgbmV3IHBhc3N3b3JkLiBXZSB3aWxsIHNlbmQgeW91IGFuIGVtYWlsIHRvIGNvbmZpcm0gdGhlIHBhc3N3b3JkIGNoYW5nZS4nO1xuICBvcHRpb25zWydyZXNldFNlcnZlckVycm9yVGV4dCddID0gb3B0aW9uc1sncmVzZXRTZXJ2ZXJFcnJvclRleHQnXSB8fCAnVGhlcmUgd2FzIGFuIGVycm9yIHByb2Nlc3NpbmcgdGhlIHJlc2V0IHBhc3N3b3JkLic7XG5cbiAgdGhpcy5fc2lnbmluT3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgLy8gdGhlbWVcbiAgaWYgKG9wdGlvbnMudGhlbWUpIHtcbiAgICAkKCkuYWRkQ2xhc3MoJ3RoZW1lLScgKyBvcHRpb25zLnRoZW1lKTtcbiAgfVxuXG4gICQoJy5wYW5lbCBhLmNsb3NlJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zdGFuZGFsb25lID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG5cbiAgLy8gc2hvdyBpY29uXG4gIGlmIChvcHRpb25zLnNob3dJY29uKSB7XG4gICAgJCgnLnBhbmVsIC5pbWFnZSBpbWcnKS5hdHRyKCdzcmMnLCBvcHRpb25zLmljb24pO1xuICAgICQoJy5wYW5lbCAuaW1hZ2UnKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dJY29uID8gJ2Jsb2NrJyA6ICdub25lJyk7XG4gIH1cblxuICAvLyBzaG93IHNpZ251cC9mb3Jnb3QgbGlua3NcbiAgdmFyIGF1dGgwQ29ubiA9IHRoaXMuX2dldEF1dGgwQ29ubmVjdGlvbigpO1xuICBpZiAoYXV0aDBDb25uKSB7XG4gICAgb3B0aW9ucy5zaG93U2lnbnVwID0gYXV0aDBDb25uLnNob3dTaWdudXA7XG4gICAgb3B0aW9ucy5zaG93Rm9yZ290ID0gYXV0aDBDb25uLnNob3dGb3Jnb3Q7XG4gIH1cbiAgXG4gICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLnNpZ24tdXAnKVxuICAgIC5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dTaWdudXAgPyAnJyA6ICdub25lJylcbiAgICAuaHRtbChvcHRpb25zLnNpZ251cFRleHQpO1xuXG4gICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLmZvcmdvdC1wYXNzJylcbiAgICAuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93Rm9yZ290ID8gJycgOiAnbm9uZScpXG4gICAgLmh0bWwob3B0aW9ucy5mb3Jnb3RUZXh0KTtcblxuICBpZiAob3B0aW9ucy5zaWdudXBMaW5rKSB7XG4gICAgJCgnLnBhbmVsIC5jcmVhdGUtYWNjb3VudCAuc2lnbi11cCcpXG4gICAgICAuYXR0cignaHJlZicsIG9wdGlvbnMuc2lnbnVwTGluaylcbiAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX3BhcmVudCcpO1xuICB9IFxuICBlbHNlIHtcbiAgICBiZWFuLm9uKCQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLnNpZ24tdXAnKVswXSwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2hvd1NpZ25VcEV4cGVyaWVuY2UoZSk7IH0pO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZm9yZ290TGluaykge1xuICAgICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLmZvcmdvdC1wYXNzJylcbiAgICAgIC5hdHRyKCdocmVmJywgb3B0aW9ucy5mb3Jnb3RMaW5rKVxuICAgICAgLmF0dHIoJ3RhcmdldCcsICdfcGFyZW50Jyk7XG4gIH0gXG4gIGVsc2Uge1xuICAgICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLmZvcmdvdC1wYXNzJykuZWFjaChmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgYmVhbi5vbihlbGVtLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9zaG93UmVzZXRFeHBlcmllbmNlKGUpOyB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGhpZGUgZGl2aWRlciBkb3QgaWYgdGhlcmUgYXJlIG9uZSBvZiB0d29cbiAgJCgnLnBhbmVsIC5jcmVhdGUtYWNjb3VudCAuZGl2aWRlcicpXG4gICAgLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIG9wdGlvbnMuc2hvd1NpZ251cCAmJiBvcHRpb25zLnNob3dGb3Jnb3QgPyAnJyA6ICdub25lJyk7XG5cbiAgJCgnZGl2LnBhbmVsIGlucHV0JykuZWFjaChmdW5jdGlvbiAoZSkgeyBlLnZhbHVlID0gJyc7IH0pO1xuXG4gIC8vIHBsYWNlaG9sZGVycyBhbmQgYnV0dG9uc1xuICAkKCcucGFuZWwgLnpvY2lhbC5wcmltYXJ5JykuaHRtbChvcHRpb25zLnNpZ25JbkJ1dHRvblRleHQpO1xuICAkKCcucGFuZWwgLmVtYWlsIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBvcHRpb25zLmVtYWlsUGxhY2Vob2xkZXIpO1xuICAkKCcucGFuZWwgLnBhc3N3b3JkIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBvcHRpb25zLnBhc3N3b3JkUGxhY2Vob2xkZXIpO1xuICAkKCcucGFuZWwgLnNlcGFyYXRvciBzcGFuJykuaHRtbChvcHRpb25zLnNlcGFyYXRvclRleHQpO1xuXG4gIC8vIHNpZ251cFxuICAkKCcucGFuZWwgLnNpZ251cCAuem9jaWFsLnByaW1hcnknKS5odG1sKG9wdGlvbnMuc2lnbnVwQnV0dG9uVGV4dCk7XG5cbiAgJCgnLnBhbmVsIC5zaWdudXAgLmVtYWlsIGlucHV0JykuZWFjaChmdW5jdGlvbiAoaSkgeyBcbiAgICAgIGkuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIG9wdGlvbnMuc2lnbnVwRW1haWxQbGFjZWhvbGRlcik7XG4gICAgICBiZWFuLm9uKGksICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0ge307XG4gICAgICAgIGlmIChzZWxmLl9pc0VudGVycHJpc2VDb25uZWN0aW9uKHRoaXMudmFsdWUsIG91dHB1dCkpIHtcbiAgICAgICAgICB2YXIgd2FybmluZ1RleHQgPSBvcHRpb25zLnNpZ251cEVudGVycHJpc2VFbWFpbFdhcm5pbmdUZXh0LnJlcGxhY2UoL3tkb21haW59L2csIG91dHB1dC5kb21haW4pO1xuICAgICAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkod2FybmluZ1RleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkoJycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfSk7XG5cbiAgJCgnLnBhbmVsIC5zaWdudXAgLnBhc3N3b3JkIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBvcHRpb25zLnNpZ251cFBhc3N3b3JkUGxhY2Vob2xkZXIpO1xuXG4gICQoJy5wYW5lbCAuc2lnbnVwIC5vcHRpb25zIC5jYW5jZWwnKS5odG1sKG9wdGlvbnNbJ3NpZ251cENhbmNlbEJ1dHRvblRleHQnXSk7XG4gIGJlYW4ub24oJCgnLnBhbmVsIC5zaWdudXAgLm9wdGlvbnMgLmNhbmNlbCcpWzBdLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7IHNlbGYuX3NldExvZ2luVmlldygpOyB9KTtcblxuICAkKCcucGFuZWwgLnNpZ251cCAuaGVhZGVyJylcbiAgICAuaHRtbChvcHRpb25zLnNpZ251cEhlYWRlclRleHQpXG4gICAgLmF0dHIoJ2Rpc3BsYXknLCBvcHRpb25zLnNpZ251cEhlYWRlclRleHQgPyAnJyA6ICdub25lJyk7XG5cbiAgJCgnLnBhbmVsIC5zaWdudXAgLmZvb3RlcicpXG4gICAgLmh0bWwob3B0aW9ucy5zaWdudXBGb290ZXJUZXh0KVxuICAgIC5hdHRyKCdkaXNwbGF5Jywgb3B0aW9ucy5zaWdudXBGb290ZXJUZXh0ID8gJycgOiAnbm9uZScpO1xuXG4gIC8vIHJlc2V0XG4gICQoJy5wYW5lbCAucmVzZXQgLnpvY2lhbC5wcmltYXJ5JykuaHRtbChvcHRpb25zLnJlc2V0QnV0dG9uVGV4dCk7XG4gICQoJy5wYW5lbCAucmVzZXQgLmVtYWlsIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBvcHRpb25zLnJlc2V0RW1haWxQbGFjZWhvbGRlcik7XG4gICQoJy5wYW5lbCAucmVzZXQgLnBhc3N3b3JkIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBvcHRpb25zLnJlc2V0UGFzc3dvcmRQbGFjZWhvbGRlcik7XG5cbiAgJCgnLnBhbmVsIC5yZXNldCAucmVwZWF0UGFzc3dvcmQgaW5wdXQnKS5lYWNoKGZ1bmN0aW9uIChpKSB7IFxuICAgICAgaS5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5yZXNldFJlcGVhdFBhc3N3b3JkUGxhY2Vob2xkZXIpO1xuICAgICAgYmVhbi5vbihpLCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQoJy5wYW5lbCAucmVzZXQgLnBhc3N3b3JkIGlucHV0JykudmFsKCkgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkob3B0aW9ucy5yZXNldEVudGVyU2FtZVBhc3N3b3JkVGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRDdXN0b21WYWxpZGl0eSgnJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9KTtcblxuICAkKCcucGFuZWwgLnJlc2V0IC5vcHRpb25zIC5jYW5jZWwnKS5odG1sKG9wdGlvbnMucmVzZXRDYW5jZWxCdXR0b25UZXh0KTtcbiAgYmVhbi5vbigkKCcucGFuZWwgLnJlc2V0IC5vcHRpb25zIC5jYW5jZWwnKVswXSwgJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyBzZWxmLl9zZXRMb2dpblZpZXcoKTsgfSk7XG5cbiAgJCgnLnBhbmVsIC5yZXNldCAuaGVhZGVyJylcbiAgICAuaHRtbChvcHRpb25zLnJlc2V0SGVhZGVyVGV4dClcbiAgICAuYXR0cignZGlzcGxheScsIG9wdGlvbnMucmVzZXRIZWFkZXJUZXh0ID8gJycgOiAnbm9uZScpO1xuXG4gIC8vIHNob3cgZW1haWwsIHBhc3N3b3JkLCBzZXBhcmF0b3IgYW5kIGJ1dHRvbiBpZiB0aGVyZSBhcmUgZW50ZXJwcmlzZS9kYiBjb25uZWN0aW9uc1xuICB2YXIgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID0gdGhpcy5fYXJlVGhlcmVBbnlFbnRlcnByaXNlT3JEYkNvbm4oKTtcbiAgdmFyIGFueVNvY2lhbENvbm5lY3Rpb24gPSB0aGlzLl9hcmVUaGVyZUFueVNvY2lhbENvbm4oKTtcblxuICAkKCcucGFuZWwgLmVtYWlsIGlucHV0JykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLnpvY2lhbC5wcmltYXJ5JykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLnBhc3N3b3JkIGlucHV0JykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgb3B0aW9ucy5zaG93UGFzc3dvcmQgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5mb3Jnb3QtcGFzcycpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIG9wdGlvbnMuc2hvd0ZvcmdvdCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLnNpZ24tdXAnKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBvcHRpb25zLnNob3dTaWdudXAgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLnNlcGFyYXRvcicpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIGFueUVudGVycHJpc2VPckRiQ29ubmVjdGlvbiAmJiBhbnlTb2NpYWxDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLmxhc3QtdGltZScpLmh0bWwob3B0aW9ucy5yZXR1cm5Vc2VyTGFiZWwpO1xuXG4gIC8vIGFjdGl2YXRlIHBhbmVsXG4gICQoJ2Rpdi5wYW5lbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJCgnZGl2Lm92ZXJsYXknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICQoJ2Rpdi5wYW5lbC5vbmVzdGVwJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICQoJy5wb3B1cCBoMScpLmh0bWwob3B0aW9ucy50aXRsZSk7XG4gICQoJy5wb3B1cCAuaW52YWxpZCcpLnJlbW92ZUNsYXNzKCdpbnZhbGlkJyk7XG5cbiAgLy8gaWYgdXNlciBsb2dnZWQgaW4gc2hvdyBsb2dnZWQgaW4gZXhwZXJpZW5jZVxuICBpZiAodGhpcy5fc3NvRGF0YS5zc28gJiYgb3B0aW9uc1snZW5hYmxlUmV0dXJuVXNlckV4cGVyaWVuY2UnXSkge1xuICAgIHRoaXMuX3Nob3dMb2dnZWRJbkV4cGVyaWVuY2UoKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zWydzb2NpYWxCaWdCdXR0b25zJ10pIHtcbiAgICAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLmljb25saXN0IHNwYW4nKS5yZW1vdmVDbGFzcygnaWNvbicpLmFkZENsYXNzKCdibG9jaycpO1xuICB9IGVsc2Uge1xuICAgICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3Qgc3BhbicpLmFkZENsYXNzKCdpY29uJykucmVtb3ZlQ2xhc3MoJ2Jsb2NrJyk7XG4gIH1cblxuICAkKCdkaXYucGFuZWwub25lc3RlcCBoMScpLmh0bWwob3B0aW9uc1sndGl0bGUnXSk7XG5cbiAgLy8gVE9ETzogc3VwcG9ydCBfc2lnbmluT3B0aW9ucy5jb250YWluZXJcblxuICBpZiAodGhpcy5fc3NvRGF0YS5zc28gJiYgdGhpcy5fc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lKSB7XG4gICAgJCgnZGl2LnBhbmVsLm9uZXN0ZXAgaW5wdXQnKS52YWwodGhpcy5fc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lKTtcbiAgICB0aGlzLl9zaG93T3JIaWRlUGFzc3dvcmQoKTtcbiAgfVxuXG4gIHRoaXMuX3NldFRvcChvcHRpb25zLnRvcCwgJCgnZGl2LnBhbmVsLm9uZXN0ZXAnKSk7XG4gIHRoaXMuX3NldExvZ2luVmlldyh7IGlzUmV0dXJuaW5nVXNlcjogdGhpcy5fc3NvRGF0YS5zc28gfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2dldENvbmZpZ3VyZWRTdHJhdGVnaWVzID0gZnVuY3Rpb24gKGNvbm5zKSB7XG4gIHZhciBzdHJhdGVnaWVzID0gW107XG4gIGZvciAodmFyIGNvbm4gaW4gY29ubnMpIHtcbiAgICBpZiAodHlwZW9mKGNvbm5zW2Nvbm5dLnN0YXR1cykgIT09ICd1bmRlZmluZWQnICYmICFjb25uc1tjb25uXS5zdGF0dXMpIGNvbnRpbnVlO1xuXG4gICAgdmFyIHN0cmF0ZWd5ID0gc3RyYXRlZ2llcy5maWx0ZXIoZnVuY3Rpb24gKHMpIHsgXG4gICAgICByZXR1cm4gcy5uYW1lID09PSBjb25uc1tjb25uXS5zdHJhdGVneTsgXG4gICAgfSlbMF07XG5cbiAgICBpZiAoIXN0cmF0ZWd5KSB7XG4gICAgICBzdHJhdGVneSA9IHtcbiAgICAgICAgbmFtZTogY29ubnNbY29ubl0uc3RyYXRlZ3ksXG4gICAgICAgIGNvbm5lY3Rpb25zOiBbXVxuICAgICAgfTtcblxuICAgICAgc3RyYXRlZ2llcy5wdXNoKHN0cmF0ZWd5KTtcbiAgICB9XG5cbiAgICB2YXIgY29ubkRhdGEgPSB7XG4gICAgICBuYW1lOiBjb25uc1tjb25uXS5uYW1lLFxuICAgICAgZG9tYWluOiBjb25uc1tjb25uXS5kb21haW4sXG4gICAgICBzaG93U2lnbnVwOiBjb25uc1tjb25uXS5zaG93U2lnbnVwLFxuICAgICAgc2hvd0ZvcmdvdDogY29ubnNbY29ubl0uc2hvd0ZvcmdvdFxuICAgIH07XG5cbiAgICBzdHJhdGVneS5jb25uZWN0aW9ucy5wdXNoKGNvbm5EYXRhKTtcbiAgfVxuXG4gIHJldHVybiBzdHJhdGVnaWVzO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLmdldENsaWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2F1dGgwO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoc2lnbmluT3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX3NpZ25pbk9wdGlvbnMgPSB4dGVuZCh0aGlzLl9vcHRpb25zLCBzaWduaW5PcHRpb25zKTtcbiAgdGhpcy5fYXV0aDAgPSBuZXcgQXV0aDAoe1xuICAgIGNsaWVudElEOiAgICAgdGhpcy5fc2lnbmluT3B0aW9ucy5jbGllbnRJRCwgXG4gICAgY2FsbGJhY2tVUkw6ICB0aGlzLl9zaWduaW5PcHRpb25zLmNhbGxiYWNrVVJMLFxuICAgIGRvbWFpbjogICAgICAgdGhpcy5fc2lnbmluT3B0aW9ucy5kb21haW5cbiAgfSk7XG5cbiAgLy8gVE9ETzogc2V0IGF1dGgwIGNvbm5lY3Rpb24gcGFyYW1ldGVyc1xuICB0aGlzLl9hdXRoMENvbm5lY3Rpb25QYXJhbXMgPSBudWxsO1xuXG4gIC8vIGdldCBjb25maWd1cmVkIHN0cmF0ZWdpZXMvY29ubmVjdGlvbnNcbiAgdGhpcy5fYXV0aDAuZ2V0Q29ubmVjdGlvbnMoZnVuY3Rpb24gKGVyciwgY29ubmVjdGlvbnMpIHtcbiAgICB2YXIgYWxsb3dlZENvbm5lY3Rpb25zID0gW107XG5cbiAgICAvLyB1c2Ugb25seSBzcGVjaWZpZWQgY29ubmVjdGlvbnNcbiAgICBpZiAoc2VsZi5fc2lnbmluT3B0aW9ucy5jb25uZWN0aW9ucykge1xuICAgICAgZm9yICh2YXIgaSBpbiBjb25uZWN0aW9ucykge1xuICAgICAgICBpZiAoc2VsZi5fc2lnbmluT3B0aW9ucy5jb25uZWN0aW9ucy5pbmRleE9mKGNvbm5lY3Rpb25zW2ldLm5hbWUpID4gLTEpIHtcbiAgICAgICAgICBhbGxvd2VkQ29ubmVjdGlvbnMucHVzaChjb25uZWN0aW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBhbGxvd2VkQ29ubmVjdGlvbnMgPSBjb25uZWN0aW9ucztcbiAgICB9XG5cbiAgICBzZWxmLl9jbGllbnQgPSB7XG4gICAgICBzdHJhdGVnaWVzOiBzZWxmLl9nZXRDb25maWd1cmVkU3RyYXRlZ2llcyhhbGxvd2VkQ29ubmVjdGlvbnMpXG4gICAgfTtcblxuICAgIC8vIGdldCBTU08gZGF0YVxuICAgIHNlbGYuX2F1dGgwLmdldFNTT0RhdGEoZnVuY3Rpb24gKGVyciwgc3NvRGF0YSkge1xuICAgICAgc2VsZi5fc3NvRGF0YSA9IHNzb0RhdGE7XG4gICAgICBcbiAgICAgIC8vIHJlbW92ZSB3aWRnZXQgY29udGFpbmVyIChpZiBleGlzdClcbiAgICAgICQoKS5wYXJlbnQoKS5yZW1vdmUoKTtcblxuICAgICAgLy8gd2lkZ2V0IGNvbnRhaW5lclxuICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmlubmVySFRNTCA9IG1haW5UbXBsKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICBcbiAgICAgIHNlbGYuX2luaXRpYWxpemUoKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwV2lkZ2V0O1xuIiwiLy8gaW5kZXhPZlxuaWYgKCFBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIChzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXggKi8gKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIG4sIGssIHQgPSBPYmplY3QodGhpcyksXG4gICAgICAgIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xuXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBuID0gMDtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIG4gPSBOdW1iZXIoYXJndW1lbnRzWzFdKTtcbiAgICAgIGlmIChuICE9IG4pIHsgLy8gc2hvcnRjdXQgZm9yIHZlcmlmeWluZyBpZiBpdCdzIE5hTlxuICAgICAgICBuID0gMDtcbiAgICAgIH0gZWxzZSBpZiAobiAhPSAwICYmIG4gIT0gSW5maW5pdHkgJiYgbiAhPSAtSW5maW5pdHkpIHtcbiAgICAgICAgbiA9IChuID4gMCB8fCAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKG4pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG4gPj0gbGVuKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGZvciAoayA9IG4gPj0gMCA/IG4gOiBNYXRoLm1heChsZW4gLSBNYXRoLmFicyhuKSwgMCk7IGsgPCBsZW47IGsrKykge1xuICAgICAgaWYgKGsgaW4gdCAmJiB0W2tdID09PSBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH07XG59XG5cbi8vIGZpbHRlclxuaWYgKCFBcnJheS5wcm90b3R5cGUuZmlsdGVyKSB7XG4gIEFycmF5LnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmdW4gLyosIHRoaXNwKi8pIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBpZiAoIXRoaXMpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB2YXIgb2JqZWN0cyA9IE9iamVjdCh0aGlzKTtcbiAgICB2YXIgbGVuID0gb2JqZWN0cy5sZW5ndGggPj4+IDA7XG4gICAgaWYgKHR5cGVvZiBmdW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzID0gW107XG4gICAgdmFyIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuICAgIGZvciAodmFyIGkgaW4gb2JqZWN0cykge1xuICAgICAgaWYgKG9iamVjdHMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgaWYgKGZ1bi5jYWxsKHRoaXNwLCBvYmplY3RzW2ldLCBpLCBvYmplY3RzKSkge1xuICAgICAgICAgIHJlcy5wdXNoKG9iamVjdHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfTtcbn1cbiIsIi8qIFBsYWNlaG9sZGVycy5qcyB2My4wLjAgKi9cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vIENyb3NzLWJyb3dzZXIgRE9NIGV2ZW50IGJpbmRpbmdcbiAgICBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKGVsZW0sIGV2ZW50LCBmbikge1xuICAgICAgICBpZiAoZWxlbS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmbiwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS5hdHRhY2hFdmVudChcIm9uXCIgKyBldmVudCwgZm4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgd2hldGhlciBhbiBpdGVtIGlzIGluIGFuIGFycmF5ICh3ZSBkb24ndCB1c2UgQXJyYXkucHJvdG90eXBlLmluZGV4T2Ygc28gd2UgZG9uJ3QgY2xvYmJlciBhbnkgZXhpc3RpbmcgcG9seWZpbGxzIC0gdGhpcyBpcyBhIHJlYWxseSBzaW1wbGUgYWx0ZXJuYXRpdmUpXG4gICAgZnVuY3Rpb24gaW5BcnJheShhcnIsIGl0ZW0pIHtcbiAgICAgICAgdmFyIGksIGxlbjtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYXJyW2ldID09PSBpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIE1vdmUgdGhlIGNhcmV0IHRvIHRoZSBpbmRleCBwb3NpdGlvbiBzcGVjaWZpZWQuIEFzc3VtZXMgdGhhdCB0aGUgZWxlbWVudCBoYXMgZm9jdXNcbiAgICBmdW5jdGlvbiBtb3ZlQ2FyZXQoZWxlbSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIHJhbmdlO1xuICAgICAgICBpZiAoZWxlbS5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgICAgIHJhbmdlID0gZWxlbS5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICAgIHJhbmdlLm1vdmUoXCJjaGFyYWN0ZXJcIiwgaW5kZXgpO1xuICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbS5zZWxlY3Rpb25TdGFydCkge1xuICAgICAgICAgICAgZWxlbS5mb2N1cygpO1xuICAgICAgICAgICAgZWxlbS5zZXRTZWxlY3Rpb25SYW5nZShpbmRleCwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXR0ZW1wdCB0byBjaGFuZ2UgdGhlIHR5cGUgcHJvcGVydHkgb2YgYW4gaW5wdXQgZWxlbWVudFxuICAgIGZ1bmN0aW9uIGNoYW5nZVR5cGUoZWxlbSwgdHlwZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZWxlbS50eXBlID0gdHlwZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBZb3UgY2FuJ3QgY2hhbmdlIGlucHV0IHR5cGUgaW4gSUU4IGFuZCBiZWxvd1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXhwb3NlIHB1YmxpYyBtZXRob2RzXG4gICAgZ2xvYmFsLlBsYWNlaG9sZGVycyA9IHtcbiAgICAgICAgVXRpbHM6IHtcbiAgICAgICAgICAgIGFkZEV2ZW50TGlzdGVuZXI6IGFkZEV2ZW50TGlzdGVuZXIsXG4gICAgICAgICAgICBpbkFycmF5OiBpbkFycmF5LFxuICAgICAgICAgICAgbW92ZUNhcmV0OiBtb3ZlQ2FyZXQsXG4gICAgICAgICAgICBjaGFuZ2VUeXBlOiBjaGFuZ2VUeXBlXG4gICAgICAgIH1cbiAgICB9O1xuXG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uIChnbG9iYWwpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHZhbGlkVHlwZXMgPSBbXG4gICAgICAgICAgICBcInRleHRcIixcbiAgICAgICAgICAgIFwic2VhcmNoXCIsXG4gICAgICAgICAgICBcInVybFwiLFxuICAgICAgICAgICAgXCJ0ZWxcIixcbiAgICAgICAgICAgIFwiZW1haWxcIixcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCIsXG4gICAgICAgICAgICBcInRleHRhcmVhXCJcbiAgICAgICAgXSxcblxuICAgICAgICAvLyBUaGUgbGlzdCBvZiBrZXljb2RlcyB0aGF0IGFyZSBub3QgYWxsb3dlZCB3aGVuIHRoZSBwb2x5ZmlsbCBpcyBjb25maWd1cmVkIHRvIGhpZGUtb24taW5wdXRcbiAgICAgICAgYmFkS2V5cyA9IFtcblxuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBrZXlzIGFsbCBjYXVzZSB0aGUgY2FyZXQgdG8ganVtcCB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dCB2YWx1ZVxuICAgICAgICAgICAgMjcsIC8vIEVzY2FwZVxuICAgICAgICAgICAgMzMsIC8vIFBhZ2UgdXBcbiAgICAgICAgICAgIDM0LCAvLyBQYWdlIGRvd25cbiAgICAgICAgICAgIDM1LCAvLyBFbmRcbiAgICAgICAgICAgIDM2LCAvLyBIb21lXG5cbiAgICAgICAgICAgIC8vIEFycm93IGtleXMgYWxsb3cgeW91IHRvIG1vdmUgdGhlIGNhcmV0IG1hbnVhbGx5LCB3aGljaCBzaG91bGQgYmUgcHJldmVudGVkIHdoZW4gdGhlIHBsYWNlaG9sZGVyIGlzIHZpc2libGVcbiAgICAgICAgICAgIDM3LCAvLyBMZWZ0XG4gICAgICAgICAgICAzOCwgLy8gVXBcbiAgICAgICAgICAgIDM5LCAvLyBSaWdodFxuICAgICAgICAgICAgNDAsIC8vIERvd25cblxuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBrZXlzIGFsbG93IHlvdSB0byBtb2RpZnkgdGhlIHBsYWNlaG9sZGVyIHRleHQgYnkgcmVtb3ZpbmcgY2hhcmFjdGVycywgd2hpY2ggc2hvdWxkIGJlIHByZXZlbnRlZCB3aGVuIHRoZSBwbGFjZWhvbGRlciBpcyB2aXNpYmxlXG4gICAgICAgICAgICA4LCAvLyBCYWNrc3BhY2VcbiAgICAgICAgICAgIDQ2IC8vIERlbGV0ZVxuICAgICAgICBdLFxuXG4gICAgICAgIC8vIFN0eWxpbmcgdmFyaWFibGVzXG4gICAgICAgIHBsYWNlaG9sZGVyU3R5bGVDb2xvciA9IFwiI2NjY1wiLFxuICAgICAgICBwbGFjZWhvbGRlckNsYXNzTmFtZSA9IFwicGxhY2Vob2xkZXJzanNcIixcbiAgICAgICAgY2xhc3NOYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChcIig/Ol58XFxcXHMpXCIgKyBwbGFjZWhvbGRlckNsYXNzTmFtZSArIFwiKD8hXFxcXFMpXCIpLFxuXG4gICAgICAgIC8vIFRoZXNlIHdpbGwgaG9sZCByZWZlcmVuY2VzIHRvIGFsbCBlbGVtZW50cyB0aGF0IGNhbiBiZSBhZmZlY3RlZC4gTm9kZUxpc3Qgb2JqZWN0cyBhcmUgbGl2ZSwgc28gd2Ugb25seSBuZWVkIHRvIGdldCB0aG9zZSByZWZlcmVuY2VzIG9uY2VcbiAgICAgICAgaW5wdXRzLCB0ZXh0YXJlYXMsXG5cbiAgICAgICAgLy8gVGhlIHZhcmlvdXMgZGF0YS0qIGF0dHJpYnV0ZXMgdXNlZCBieSB0aGUgcG9seWZpbGxcbiAgICAgICAgQVRUUl9DVVJSRU5UX1ZBTCA9IFwiZGF0YS1wbGFjZWhvbGRlci12YWx1ZVwiLFxuICAgICAgICBBVFRSX0FDVElWRSA9IFwiZGF0YS1wbGFjZWhvbGRlci1hY3RpdmVcIixcbiAgICAgICAgQVRUUl9JTlBVVF9UWVBFID0gXCJkYXRhLXBsYWNlaG9sZGVyLXR5cGVcIixcbiAgICAgICAgQVRUUl9GT1JNX0hBTkRMRUQgPSBcImRhdGEtcGxhY2Vob2xkZXItc3VibWl0XCIsXG4gICAgICAgIEFUVFJfRVZFTlRTX0JPVU5EID0gXCJkYXRhLXBsYWNlaG9sZGVyLWJvdW5kXCIsXG4gICAgICAgIEFUVFJfT1BUSU9OX0ZPQ1VTID0gXCJkYXRhLXBsYWNlaG9sZGVyLWZvY3VzXCIsXG4gICAgICAgIEFUVFJfT1BUSU9OX0xJVkUgPSBcImRhdGEtcGxhY2Vob2xkZXItbGl2ZVwiLFxuICAgICAgICBBVFRSX01BWExFTkdUSCA9IFwiZGF0YS1wbGFjZWhvbGRlci1tYXhsZW5ndGhcIixcblxuICAgICAgICAvLyBWYXJpb3VzIG90aGVyIHZhcmlhYmxlcyB1c2VkIHRocm91Z2hvdXQgdGhlIHJlc3Qgb2YgdGhlIHNjcmlwdFxuICAgICAgICB0ZXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLFxuICAgICAgICBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLFxuICAgICAgICByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICBQbGFjZWhvbGRlcnMgPSBnbG9iYWwuUGxhY2Vob2xkZXJzLFxuICAgICAgICBVdGlscyA9IFBsYWNlaG9sZGVycy5VdGlscyxcbiAgICAgICAgaGlkZU9uSW5wdXQsIGxpdmVVcGRhdGVzLCBrZXlkb3duVmFsLCBzdHlsZUVsZW0sIHN0eWxlUnVsZXMsIHBsYWNlaG9sZGVyLCB0aW1lciwgZm9ybSwgZWxlbSwgbGVuLCBpO1xuXG4gICAgLy8gTm8tb3AgKHVzZWQgaW4gcGxhY2Ugb2YgcHVibGljIG1ldGhvZHMgd2hlbiBuYXRpdmUgc3VwcG9ydCBpcyBkZXRlY3RlZClcbiAgICBmdW5jdGlvbiBub29wKCkge31cblxuICAgIC8vIEhpZGUgdGhlIHBsYWNlaG9sZGVyIHZhbHVlIG9uIGEgc2luZ2xlIGVsZW1lbnQuIFJldHVybnMgdHJ1ZSBpZiB0aGUgcGxhY2Vob2xkZXIgd2FzIGhpZGRlbiBhbmQgZmFsc2UgaWYgaXQgd2FzIG5vdCAoYmVjYXVzZSBpdCB3YXNuJ3QgdmlzaWJsZSBpbiB0aGUgZmlyc3QgcGxhY2UpXG4gICAgZnVuY3Rpb24gaGlkZVBsYWNlaG9sZGVyKGVsZW0sIGtleWRvd25WYWx1ZSkge1xuICAgICAgICB2YXIgdHlwZSxcbiAgICAgICAgICAgIG1heExlbmd0aCxcbiAgICAgICAgICAgIHZhbHVlQ2hhbmdlZCA9ICghIWtleWRvd25WYWx1ZSAmJiBlbGVtLnZhbHVlICE9PSBrZXlkb3duVmFsdWUpLFxuICAgICAgICAgICAgaXNQbGFjZWhvbGRlclZhbHVlID0gKGVsZW0udmFsdWUgPT09IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpKTtcblxuICAgICAgICBpZiAoKHZhbHVlQ2hhbmdlZCB8fCBpc1BsYWNlaG9sZGVyVmFsdWUpICYmIGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQUNUSVZFKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKEFUVFJfQUNUSVZFKTtcbiAgICAgICAgICAgIGVsZW0udmFsdWUgPSBlbGVtLnZhbHVlLnJlcGxhY2UoZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCksIFwiXCIpO1xuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5yZXBsYWNlKGNsYXNzTmFtZVJlZ0V4cCwgXCJcIik7XG5cbiAgICAgICAgICAgIC8vIFJlc3RvcmUgdGhlIG1heGxlbmd0aCB2YWx1ZVxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9NQVhMRU5HVEgpO1xuICAgICAgICAgICAgaWYgKG1heExlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwibWF4TGVuZ3RoXCIsIG1heExlbmd0aCk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoQVRUUl9NQVhMRU5HVEgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgcG9seWZpbGwgaGFzIGNoYW5nZWQgdGhlIHR5cGUgb2YgdGhlIGVsZW1lbnQgd2UgbmVlZCB0byBjaGFuZ2UgaXQgYmFja1xuICAgICAgICAgICAgdHlwZSA9IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfSU5QVVRfVFlQRSk7XG4gICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICAgIGVsZW0udHlwZSA9IHR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gU2hvdyB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgb24gYSBzaW5nbGUgZWxlbWVudC4gUmV0dXJucyB0cnVlIGlmIHRoZSBwbGFjZWhvbGRlciB3YXMgc2hvd24gYW5kIGZhbHNlIGlmIGl0IHdhcyBub3QgKGJlY2F1c2UgaXQgd2FzIGFscmVhZHkgdmlzaWJsZSlcbiAgICBmdW5jdGlvbiBzaG93UGxhY2Vob2xkZXIoZWxlbSkge1xuICAgICAgICB2YXIgdHlwZSxcbiAgICAgICAgICAgIG1heExlbmd0aCxcbiAgICAgICAgICAgIHZhbCA9IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpO1xuICAgICAgICBpZiAoZWxlbS52YWx1ZSA9PT0gXCJcIiAmJiB2YWwpIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfQUNUSVZFLCBcInRydWVcIik7XG4gICAgICAgICAgICBlbGVtLnZhbHVlID0gdmFsO1xuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgKz0gXCIgXCIgKyBwbGFjZWhvbGRlckNsYXNzTmFtZTtcblxuICAgICAgICAgICAgLy8gU3RvcmUgYW5kIHJlbW92ZSB0aGUgbWF4bGVuZ3RoIHZhbHVlXG4gICAgICAgICAgICBtYXhMZW5ndGggPSBlbGVtLmdldEF0dHJpYnV0ZShBVFRSX01BWExFTkdUSCk7XG4gICAgICAgICAgICBpZiAoIW1heExlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfTUFYTEVOR1RILCBlbGVtLm1heExlbmd0aCk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJtYXhMZW5ndGhcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSB0eXBlIG9mIGVsZW1lbnQgbmVlZHMgdG8gY2hhbmdlLCBjaGFuZ2UgaXQgKGUuZy4gcGFzc3dvcmQgaW5wdXRzKVxuICAgICAgICAgICAgdHlwZSA9IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfSU5QVVRfVFlQRSk7XG4gICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICAgIGVsZW0udHlwZSA9IFwidGV4dFwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtLnR5cGUgPT09IFwicGFzc3dvcmRcIikge1xuICAgICAgICAgICAgICAgIGlmIChVdGlscy5jaGFuZ2VUeXBlKGVsZW0sIFwidGV4dFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShBVFRSX0lOUFVUX1RZUEUsIFwicGFzc3dvcmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZUVsZW0obm9kZSwgY2FsbGJhY2spIHtcblxuICAgICAgICB2YXIgaGFuZGxlSW5wdXRzLCBoYW5kbGVUZXh0YXJlYXMsIGVsZW0sIGxlbiwgaTtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGFzc2VkIGluIG5vZGUgaXMgYW4gaW5wdXQvdGV4dGFyZWEgKGluIHdoaWNoIGNhc2UgaXQgY2FuJ3QgaGF2ZSBhbnkgYWZmZWN0ZWQgZGVzY2VuZGFudHMpXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3YXMgcGFzc2VkIGluLCBnZXQgYWxsIGFmZmVjdGVkIGRlc2NlbmRhbnRzLiBPdGhlcndpc2UsIGdldCBhbGwgYWZmZWN0ZWQgZWxlbWVudHMgaW4gZG9jdW1lbnRcbiAgICAgICAgICAgIGhhbmRsZUlucHV0cyA9IG5vZGUgPyBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIikgOiBpbnB1dHM7XG4gICAgICAgICAgICBoYW5kbGVUZXh0YXJlYXMgPSBub2RlID8gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRleHRhcmVhXCIpIDogdGV4dGFyZWFzO1xuXG4gICAgICAgICAgICAvLyBSdW4gdGhlIGNhbGxiYWNrIGZvciBlYWNoIGVsZW1lbnRcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGhhbmRsZUlucHV0cy5sZW5ndGggKyBoYW5kbGVUZXh0YXJlYXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gaSA8IGhhbmRsZUlucHV0cy5sZW5ndGggPyBoYW5kbGVJbnB1dHNbaV0gOiBoYW5kbGVUZXh0YXJlYXNbaSAtIGhhbmRsZUlucHV0cy5sZW5ndGhdO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVsZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFsbCBhZmZlY3RlZCBlbGVtZW50cyB0byB0aGVpciBub3JtYWwgc3RhdGUgKHJlbW92ZSBwbGFjZWhvbGRlciB2YWx1ZSBpZiBwcmVzZW50KVxuICAgIGZ1bmN0aW9uIGRpc2FibGVQbGFjZWhvbGRlcnMobm9kZSkge1xuICAgICAgICBoYW5kbGVFbGVtKG5vZGUsIGhpZGVQbGFjZWhvbGRlcik7XG4gICAgfVxuXG4gICAgLy8gU2hvdyB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgb24gYWxsIGFwcHJvcHJpYXRlIGVsZW1lbnRzXG4gICAgZnVuY3Rpb24gZW5hYmxlUGxhY2Vob2xkZXJzKG5vZGUpIHtcbiAgICAgICAgaGFuZGxlRWxlbShub2RlLCBzaG93UGxhY2Vob2xkZXIpO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgYXMgYSBmb2N1cyBldmVudCBoYW5kbGVyXG4gICAgZnVuY3Rpb24gbWFrZUZvY3VzSGFuZGxlcihlbGVtKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIE9ubHkgaGlkZSB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgaWYgdGhlIChkZWZhdWx0KSBoaWRlLW9uLWZvY3VzIGJlaGF2aW91ciBpcyBlbmFibGVkXG4gICAgICAgICAgICBpZiAoaGlkZU9uSW5wdXQgJiYgZWxlbS52YWx1ZSA9PT0gZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCkgJiYgZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9BQ1RJVkUpID09PSBcInRydWVcIikge1xuXG4gICAgICAgICAgICAgICAgLy8gTW92ZSB0aGUgY2FyZXQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBpbnB1dCAodGhpcyBtaW1pY3MgdGhlIGJlaGF2aW91ciBvZiBhbGwgYnJvd3NlcnMgdGhhdCBkbyBub3QgaGlkZSB0aGUgcGxhY2Vob2xkZXIgb24gZm9jdXMpXG4gICAgICAgICAgICAgICAgVXRpbHMubW92ZUNhcmV0KGVsZW0sIDApO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAgIGhpZGVQbGFjZWhvbGRlcihlbGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIGFzIGEgYmx1ciBldmVudCBoYW5kbGVyXG4gICAgZnVuY3Rpb24gbWFrZUJsdXJIYW5kbGVyKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNob3dQbGFjZWhvbGRlcihlbGVtKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBGdW5jdGlvbnMgdGhhdCBhcmUgdXNlZCBhcyBhIGV2ZW50IGhhbmRsZXJzIHdoZW4gdGhlIGhpZGUtb24taW5wdXQgYmVoYXZpb3VyIGhhcyBiZWVuIGFjdGl2YXRlZCAtIHZlcnkgYmFzaWMgaW1wbGVtZW50YXRpb24gb2YgdGhlIFwiaW5wdXRcIiBldmVudFxuICAgIGZ1bmN0aW9uIG1ha2VLZXlkb3duSGFuZGxlcihlbGVtKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAga2V5ZG93blZhbCA9IGVsZW0udmFsdWU7XG5cbiAgICAgICAgICAgIC8vUHJldmVudCB0aGUgdXNlIG9mIHRoZSBhcnJvdyBrZXlzICh0cnkgdG8ga2VlcCB0aGUgY3Vyc29yIGJlZm9yZSB0aGUgcGxhY2Vob2xkZXIpXG4gICAgICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9BQ1RJVkUpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgIGlmIChrZXlkb3duVmFsID09PSBlbGVtLmdldEF0dHJpYnV0ZShBVFRSX0NVUlJFTlRfVkFMKSAmJiBVdGlscy5pbkFycmF5KGJhZEtleXMsIGUua2V5Q29kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBtYWtlS2V5dXBIYW5kbGVyKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGhpZGVQbGFjZWhvbGRlcihlbGVtLCBrZXlkb3duVmFsKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgbm93IGVtcHR5IHdlIG5lZWQgdG8gc2hvdyB0aGUgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgIGlmIChlbGVtLnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZWxlbS5ibHVyKCk7XG4gICAgICAgICAgICAgICAgVXRpbHMubW92ZUNhcmV0KGVsZW0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBtYWtlQ2xpY2tIYW5kbGVyKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChlbGVtID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGVsZW0udmFsdWUgPT09IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpICYmIGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQUNUSVZFKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICBVdGlscy5tb3ZlQ2FyZXQoZWxlbSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCBhcyBhIHN1Ym1pdCBldmVudCBoYW5kbGVyIG9uIGZvcm0gZWxlbWVudHMgdGhhdCBoYXZlIGNoaWxkcmVuIGFmZmVjdGVkIGJ5IHRoaXMgcG9seWZpbGxcbiAgICBmdW5jdGlvbiBtYWtlU3VibWl0SGFuZGxlcihmb3JtKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIFR1cm4gb2ZmIHBsYWNlaG9sZGVycyBvbiBhbGwgYXBwcm9wcmlhdGUgZGVzY2VuZGFudCBlbGVtZW50c1xuICAgICAgICAgICAgZGlzYWJsZVBsYWNlaG9sZGVycyhmb3JtKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzIHRvIGFuIGVsZW1lbnQgdGhhdCB3ZSBuZWVkIHRvIGFmZmVjdCB3aXRoIHRoZSBwb2x5ZmlsbFxuICAgIGZ1bmN0aW9uIG5ld0VsZW1lbnQoZWxlbSkge1xuXG4gICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIHBhcnQgb2YgYSBmb3JtLCBtYWtlIHN1cmUgdGhlIHBsYWNlaG9sZGVyIHN0cmluZyBpcyBub3Qgc3VibWl0dGVkIGFzIGEgdmFsdWVcbiAgICAgICAgaWYgKGVsZW0uZm9ybSkge1xuICAgICAgICAgICAgZm9ybSA9IGVsZW0uZm9ybTtcblxuICAgICAgICAgICAgLy8gU2V0IGEgZmxhZyBvbiB0aGUgZm9ybSBzbyB3ZSBrbm93IGl0J3MgYmVlbiBoYW5kbGVkIChmb3JtcyBjYW4gY29udGFpbiBtdWx0aXBsZSBpbnB1dHMpXG4gICAgICAgICAgICBpZiAoIWZvcm0uZ2V0QXR0cmlidXRlKEFUVFJfRk9STV9IQU5ETEVEKSkge1xuICAgICAgICAgICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZm9ybSwgXCJzdWJtaXRcIiwgbWFrZVN1Ym1pdEhhbmRsZXIoZm9ybSkpO1xuICAgICAgICAgICAgICAgIGZvcm0uc2V0QXR0cmlidXRlKEFUVFJfRk9STV9IQU5ETEVELCBcInRydWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBlbGVtZW50IHNvIHdlIGNhbiBoaWRlL3Nob3cgdGhlIHBsYWNlaG9sZGVyIGFzIGFwcHJvcHJpYXRlXG4gICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZWxlbSwgXCJmb2N1c1wiLCBtYWtlRm9jdXNIYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgVXRpbHMuYWRkRXZlbnRMaXN0ZW5lcihlbGVtLCBcImJsdXJcIiwgbWFrZUJsdXJIYW5kbGVyKGVsZW0pKTtcblxuICAgICAgICAvLyBJZiB0aGUgcGxhY2Vob2xkZXIgc2hvdWxkIGhpZGUgb24gaW5wdXQgcmF0aGVyIHRoYW4gb24gZm9jdXMgd2UgbmVlZCBhZGRpdGlvbmFsIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIGlmIChoaWRlT25JbnB1dCkge1xuICAgICAgICAgICAgVXRpbHMuYWRkRXZlbnRMaXN0ZW5lcihlbGVtLCBcImtleWRvd25cIiwgbWFrZUtleWRvd25IYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZWxlbSwgXCJrZXl1cFwiLCBtYWtlS2V5dXBIYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZWxlbSwgXCJjbGlja1wiLCBtYWtlQ2xpY2tIYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbWVtYmVyIHRoYXQgd2UndmUgYm91bmQgZXZlbnQgaGFuZGxlcnMgdG8gdGhpcyBlbGVtZW50XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfRVZFTlRTX0JPVU5ELCBcInRydWVcIik7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwsIHBsYWNlaG9sZGVyKTtcblxuICAgICAgICAvLyBJZiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgYSB2YWx1ZSBhbmQgaXMgbm90IGZvY3Vzc2VkLCBzZXQgaXQgdG8gdGhlIHBsYWNlaG9sZGVyIHN0cmluZ1xuICAgICAgICBpZiAoaGlkZU9uSW5wdXQgfHwgZWxlbSAhPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgc2hvd1BsYWNlaG9sZGVyKGVsZW0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUGxhY2Vob2xkZXJzLm5hdGl2ZVN1cHBvcnQgPSB0ZXN0LnBsYWNlaG9sZGVyICE9PSB2b2lkIDA7XG5cbiAgICBpZiAoIVBsYWNlaG9sZGVycy5uYXRpdmVTdXBwb3J0KSB7XG5cbiAgICAgICAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gYWxsIHRoZSBpbnB1dCBhbmQgdGV4dGFyZWEgZWxlbWVudHMgY3VycmVudGx5IGluIHRoZSBET00gKGxpdmUgTm9kZUxpc3Qgb2JqZWN0cyB0byB3ZSBvbmx5IG5lZWQgdG8gZG8gdGhpcyBvbmNlKVxuICAgICAgICBpbnB1dHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpO1xuICAgICAgICB0ZXh0YXJlYXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRleHRhcmVhXCIpO1xuXG4gICAgICAgIC8vIEdldCBhbnkgc2V0dGluZ3MgZGVjbGFyZWQgYXMgZGF0YS0qIGF0dHJpYnV0ZXMgb24gdGhlIHJvb3QgZWxlbWVudCAoY3VycmVudGx5IHRoZSBvbmx5IG9wdGlvbnMgYXJlIHdoZXRoZXIgdG8gaGlkZSB0aGUgcGxhY2Vob2xkZXIgb24gZm9jdXMgb3IgaW5wdXQgYW5kIHdoZXRoZXIgdG8gYXV0by11cGRhdGUpXG4gICAgICAgIGhpZGVPbklucHV0ID0gcm9vdC5nZXRBdHRyaWJ1dGUoQVRUUl9PUFRJT05fRk9DVVMpID09PSBcImZhbHNlXCI7XG4gICAgICAgIGxpdmVVcGRhdGVzID0gcm9vdC5nZXRBdHRyaWJ1dGUoQVRUUl9PUFRJT05fTElWRSkgIT09IFwiZmFsc2VcIjtcblxuICAgICAgICAvLyBDcmVhdGUgc3R5bGUgZWxlbWVudCBmb3IgcGxhY2Vob2xkZXIgc3R5bGVzIChpbnN0ZWFkIG9mIGRpcmVjdGx5IHNldHRpbmcgc3R5bGUgcHJvcGVydGllcyBvbiBlbGVtZW50cyAtIGFsbG93cyBmb3IgYmV0dGVyIGZsZXhpYmlsaXR5IGFsb25nc2lkZSB1c2VyLWRlZmluZWQgc3R5bGVzKVxuICAgICAgICBzdHlsZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgIHN0eWxlRWxlbS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG4gICAgICAgIC8vIENyZWF0ZSBzdHlsZSBydWxlcyBhcyB0ZXh0IG5vZGVcbiAgICAgICAgc3R5bGVSdWxlcyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiLlwiICsgcGxhY2Vob2xkZXJDbGFzc05hbWUgKyBcIiB7IGNvbG9yOlwiICsgcGxhY2Vob2xkZXJTdHlsZUNvbG9yICsgXCI7IH1cIik7XG5cbiAgICAgICAgLy8gQXBwZW5kIHN0eWxlIHJ1bGVzIHRvIG5ld2x5IGNyZWF0ZWQgc3R5bGVzaGVldFxuICAgICAgICBpZiAoc3R5bGVFbGVtLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgICAgIHN0eWxlRWxlbS5zdHlsZVNoZWV0LmNzc1RleHQgPSBzdHlsZVJ1bGVzLm5vZGVWYWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0eWxlRWxlbS5hcHBlbmRDaGlsZChzdHlsZVJ1bGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFByZXBlbmQgbmV3IHN0eWxlIGVsZW1lbnQgdG8gdGhlIGhlYWQgKGJlZm9yZSBhbnkgZXhpc3Rpbmcgc3R5bGVzaGVldHMsIHNvIHVzZXItZGVmaW5lZCBydWxlcyB0YWtlIHByZWNlZGVuY2UpXG4gICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbSwgaGVhZC5maXJzdENoaWxkKTtcblxuICAgICAgICAvLyBTZXQgdXAgdGhlIHBsYWNlaG9sZGVyc1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBpbnB1dHMubGVuZ3RoICsgdGV4dGFyZWFzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBlbGVtID0gaSA8IGlucHV0cy5sZW5ndGggPyBpbnB1dHNbaV0gOiB0ZXh0YXJlYXNbaSAtIGlucHV0cy5sZW5ndGhdO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHZhbHVlIG9mIHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUsIGlmIGFueS4gSUUxMCBlbXVsYXRpbmcgSUU3IGZhaWxzIHdpdGggZ2V0QXR0cmlidXRlLCBoZW5jZSB0aGUgdXNlIG9mIHRoZSBhdHRyaWJ1dGVzIG5vZGVcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gZWxlbS5hdHRyaWJ1dGVzLnBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBJRSByZXR1cm5zIGFuIGVtcHR5IG9iamVjdCBpbnN0ZWFkIG9mIHVuZGVmaW5lZCBpZiB0aGUgYXR0cmlidXRlIGlzIG5vdCBwcmVzZW50XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlci5ub2RlVmFsdWU7XG5cbiAgICAgICAgICAgICAgICAvLyBPbmx5IGFwcGx5IHRoZSBwb2x5ZmlsbCBpZiB0aGlzIGVsZW1lbnQgaXMgb2YgYSB0eXBlIHRoYXQgc3VwcG9ydHMgcGxhY2Vob2xkZXJzLCBhbmQgaGFzIGEgcGxhY2Vob2xkZXIgYXR0cmlidXRlIHdpdGggYSBub24tZW1wdHkgdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIgJiYgVXRpbHMuaW5BcnJheSh2YWxpZFR5cGVzLCBlbGVtLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0VsZW1lbnQoZWxlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgZW5hYmxlZCwgdGhlIHBvbHlmaWxsIHdpbGwgcmVwZWF0ZWRseSBjaGVjayBmb3IgY2hhbmdlZC9hZGRlZCBlbGVtZW50cyBhbmQgYXBwbHkgdG8gdGhvc2UgYXMgd2VsbFxuICAgICAgICB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGlucHV0cy5sZW5ndGggKyB0ZXh0YXJlYXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gaSA8IGlucHV0cy5sZW5ndGggPyBpbnB1dHNbaV0gOiB0ZXh0YXJlYXNbaSAtIGlucHV0cy5sZW5ndGhdO1xuXG4gICAgICAgICAgICAgICAgLy8gT25seSBhcHBseSB0aGUgcG9seWZpbGwgaWYgdGhpcyBlbGVtZW50IGlzIG9mIGEgdHlwZSB0aGF0IHN1cHBvcnRzIHBsYWNlaG9sZGVycywgYW5kIGhhcyBhIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSB3aXRoIGEgbm9uLWVtcHR5IHZhbHVlXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBlbGVtLmF0dHJpYnV0ZXMucGxhY2Vob2xkZXI7XG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXIubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIgJiYgVXRpbHMuaW5BcnJheSh2YWxpZFR5cGVzLCBlbGVtLnR5cGUpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGhhc24ndCBoYWQgZXZlbnQgaGFuZGxlcnMgYm91bmQgdG8gaXQgdGhlbiBhZGQgdGhlbVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtLmdldEF0dHJpYnV0ZShBVFRSX0VWRU5UU19CT1VORCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdFbGVtZW50KGVsZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgaGFzIGNoYW5nZWQgb3Igbm90IGJlZW4gaW5pdGlhbGlzZWQgeWV0IHdlIG5lZWQgdG8gdXBkYXRlIHRoZSBkaXNwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIgIT09IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpIHx8IChlbGVtLnR5cGUgPT09IFwicGFzc3dvcmRcIiAmJiAhZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9JTlBVVF9UWVBFKSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF0dGVtcHQgdG8gY2hhbmdlIHRoZSB0eXBlIG9mIHBhc3N3b3JkIGlucHV0cyAoZmFpbHMgaW4gSUUgPCA5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLnR5cGUgPT09IFwicGFzc3dvcmRcIiAmJiAhZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9JTlBVVF9UWVBFKSAmJiBVdGlscy5jaGFuZ2VUeXBlKGVsZW0sIFwidGV4dFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShBVFRSX0lOUFVUX1RZUEUsIFwicGFzc3dvcmRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHBsYWNlaG9sZGVyIHZhbHVlIGhhcyBjaGFuZ2VkIGFuZCB0aGUgcGxhY2Vob2xkZXIgaXMgY3VycmVudGx5IG9uIGRpc3BsYXkgd2UgbmVlZCB0byBjaGFuZ2UgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS52YWx1ZSA9PT0gZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS52YWx1ZSA9IHBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgcGxhY2Vob2xkZXIgdmFsdWUgaW4gY2FzZSBpdCBjaGFuZ2VzIHZpYSBhbm90aGVyIHNjcmlwdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9BQ1RJVkUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGVQbGFjZWhvbGRlcihlbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBsaXZlIHVwZGF0ZXMgYXJlIG5vdCBlbmFibGVkIGNhbmNlbCB0aGUgdGltZXJcbiAgICAgICAgICAgIGlmICghbGl2ZVVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgICAvLyBFeHBvc2UgcHVibGljIG1ldGhvZHNcbiAgICBQbGFjZWhvbGRlcnMuZGlzYWJsZSA9IFBsYWNlaG9sZGVycy5uYXRpdmVTdXBwb3J0ID8gbm9vcCA6IGRpc2FibGVQbGFjZWhvbGRlcnM7XG4gICAgUGxhY2Vob2xkZXJzLmVuYWJsZSA9IFBsYWNlaG9sZGVycy5uYXRpdmVTdXBwb3J0ID8gbm9vcCA6IGVuYWJsZVBsYWNlaG9sZGVycztcblxufSh0aGlzKSk7Il19
;