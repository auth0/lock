;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

Auth0.prototype._isAdLdapConnection = function (connection) {
  return connection === 'adldap';
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
    return this.loginWithUsernamePassword(options, callback);
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

Auth0.prototype.loginWithUsernamePassword = function (options, callback) {
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

  var endpoint = this._isAdLdapConnection(query.connection) ?
    '/adldap/login' : '/dbconnections/login';

  if (use_jsonp()) {
    return jsonp('https://' + this._domain + endpoint + '?' + qs.stringify(query), {
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
    url:     'https://' + this._domain + endpoint,
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

},{"./lib/LoginError":3,"./lib/assert_required":4,"./lib/base64_url_decode":5,"./lib/json_parse":6,"./lib/use_jsonp":7,"jsonp":9,"qs":11,"reqwest":12}],3:[function(require,module,exports){
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
},{"./json_parse":6}],4:[function(require,module,exports){
module.exports = function (obj, prop) {
  if (!obj[prop]) {
    throw new Error(prop + ' is required.');
  }
};
},{}],5:[function(require,module,exports){
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
},{"Base64":8}],6:[function(require,module,exports){
module.exports = function (str) {
  return window.JSON ? window.JSON.parse(str) : eval('(' + str + ')');
};
},{}],7:[function(require,module,exports){
module.exports = function () {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : null;
  
  if (xhr && 'withCredentials' in xhr) {
    return false;
  }

  return 'XDomainRequest' in window && window.location.protocol === 'http:';
};
},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){

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

},{"debug":10}],10:[function(require,module,exports){

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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
module.exports = hasKeys

function hasKeys(source) {
    return source !== null &&
        (typeof source === "object" ||
        typeof source === "function")
}

},{}],18:[function(require,module,exports){
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

},{"./has-keys":17,"object-keys":20}],19:[function(require,module,exports){
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


},{}],20:[function(require,module,exports){
module.exports = Object.keys || require('./shim');


},{"./shim":22}],21:[function(require,module,exports){
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


},{}],22:[function(require,module,exports){
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


},{"./foreach":19,"./isArguments":21}],23:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};/*
 *
 * This is used to build the bundle with browserify.
 *
 * The bundle is used by people who doesn't use browserify.require
 * Those who use browserify will install with npm and require the module,
 * the package.json file points to index.js.
 */
var Auth0Widget = require('./widget');
var insertCss   = require('./lib/insert-css');
var fs          = require('fs');

insertCss("@charset \"UTF-8\";#auth0-widget{/*!\n* CleanSlate\n*   github.com/premasagar/cleanslate\n*\n*//*!\n\tZocial Butons\n\thttp://zocial.smcllns.com\n\tby Sam Collins (@smcllns)\n\tLicense: http://opensource.org/licenses/mit-license.php\n\t\n\tYou are free to use and modify, as long as you keep this license comment intact or link back to zocial.smcllns.com on your site.\n*//*! normalize.css v1.0.1 | MIT License | git.io/normalize */}#auth0-widget .cleanslate,#auth0-widget .cleanslate h1,#auth0-widget .cleanslate h2,#auth0-widget .cleanslate h3,#auth0-widget .cleanslate h4,#auth0-widget .cleanslate h5,#auth0-widget .cleanslate h6,#auth0-widget .cleanslate p,#auth0-widget .cleanslate td,#auth0-widget .cleanslate dl,#auth0-widget .cleanslate tr,#auth0-widget .cleanslate dt,#auth0-widget .cleanslate ol,#auth0-widget .cleanslate form,#auth0-widget .cleanslate select,#auth0-widget .cleanslate option,#auth0-widget .cleanslate pre,#auth0-widget .cleanslate div,#auth0-widget .cleanslate table,#auth0-widget .cleanslate th,#auth0-widget .cleanslate tbody,#auth0-widget .cleanslate tfoot,#auth0-widget .cleanslate caption,#auth0-widget .cleanslate thead,#auth0-widget .cleanslate ul,#auth0-widget .cleanslate li,#auth0-widget .cleanslate address,#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate dd,#auth0-widget .cleanslate fieldset,#auth0-widget .cleanslate li,#auth0-widget .cleanslate iframe,#auth0-widget .cleanslate strong,#auth0-widget .cleanslate legend,#auth0-widget .cleanslate em,#auth0-widget .cleanslate s,#auth0-widget .cleanslate cite,#auth0-widget .cleanslate span,#auth0-widget .cleanslate input,#auth0-widget .cleanslate sup,#auth0-widget .cleanslate label,#auth0-widget .cleanslate dfn,#auth0-widget .cleanslate object,#auth0-widget .cleanslate big,#auth0-widget .cleanslate q,#auth0-widget .cleanslate font,#auth0-widget .cleanslate samp,#auth0-widget .cleanslate acronym,#auth0-widget .cleanslate small,#auth0-widget .cleanslate img,#auth0-widget .cleanslate strike,#auth0-widget .cleanslate code,#auth0-widget .cleanslate sub,#auth0-widget .cleanslate ins,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate var,#auth0-widget .cleanslate a,#auth0-widget .cleanslate abbr,#auth0-widget .cleanslate applet,#auth0-widget .cleanslate del,#auth0-widget .cleanslate kbd,#auth0-widget .cleanslate tt,#auth0-widget .cleanslate b,#auth0-widget .cleanslate i,#auth0-widget .cleanslate hr,#auth0-widget .cleanslate article,#auth0-widget .cleanslate aside,#auth0-widget .cleanslate dialog,#auth0-widget .cleanslate figure,#auth0-widget .cleanslate footer,#auth0-widget .cleanslate header,#auth0-widget .cleanslate hgroup,#auth0-widget .cleanslate menu,#auth0-widget .cleanslate nav,#auth0-widget .cleanslate section,#auth0-widget .cleanslate time,#auth0-widget .cleanslate mark,#auth0-widget .cleanslate audio,#auth0-widget .cleanslate video{background-attachment:scroll!important;background-color:transparent!important;background-image:none!important;background-position:0 0!important;background-repeat:repeat!important;border-color:black!important;border-color:currentColor!important;border-radius:0!important;border-style:none!important;border-width:medium!important;bottom:auto!important;clear:none!important;clip:auto!important;color:inherit!important;counter-increment:none!important;counter-reset:none!important;cursor:auto!important;direction:inherit!important;display:inline!important;float:none!important;font-family:inherit!important;font-size:inherit!important;font-style:inherit!important;font-variant:normal!important;font-weight:inherit!important;height:auto!important;left:auto!important;letter-spacing:normal!important;line-height:inherit!important;list-style-type:inherit!important;list-style-position:outside!important;list-style-image:none!important;margin:0!important;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:1;outline:invert none medium!important;overflow:visible!important;padding:0!important;position:static!important;quotes:\"\" \"\"!important;right:auto!important;table-layout:auto!important;text-align:inherit!important;text-decoration:inherit!important;text-indent:0!important;text-transform:none!important;top:auto!important;unicode-bidi:normal!important;vertical-align:baseline!important;visibility:inherit!important;white-space:normal!important;width:auto!important;word-spacing:normal!important;z-index:auto!important;-moz-border-radius:0!important;-webkit-border-radius:0!important;-moz-box-sizing:content-box!important;-webkit-box-sizing:content-box!important;box-sizing:content-box!important;text-shadow:none!important}#auth0-widget .cleanslate,#auth0-widget .cleanslate h3,#auth0-widget .cleanslate h5,#auth0-widget .cleanslate p,#auth0-widget .cleanslate h1,#auth0-widget .cleanslate dl,#auth0-widget .cleanslate dt,#auth0-widget .cleanslate h6,#auth0-widget .cleanslate ol,#auth0-widget .cleanslate form,#auth0-widget .cleanslate select,#auth0-widget .cleanslate option,#auth0-widget .cleanslate pre,#auth0-widget .cleanslate div,#auth0-widget .cleanslate h2,#auth0-widget .cleanslate caption,#auth0-widget .cleanslate h4,#auth0-widget .cleanslate ul,#auth0-widget .cleanslate address,#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate dd,#auth0-widget .cleanslate fieldset,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate hr,#auth0-widget .cleanslate article,#auth0-widget .cleanslate aside,#auth0-widget .cleanslate dialog,#auth0-widget .cleanslate figure,#auth0-widget .cleanslate footer,#auth0-widget .cleanslate header,#auth0-widget .cleanslate hgroup,#auth0-widget .cleanslate menu,#auth0-widget .cleanslate nav,#auth0-widget .cleanslate section{display:block!important}#auth0-widget .cleanslate table{display:table!important}#auth0-widget .cleanslate thead{display:table-header-group!important}#auth0-widget .cleanslate tbody{display:table-row-group!important}#auth0-widget .cleanslate tfoot{display:table-footer-group!important}#auth0-widget .cleanslate tr{display:table-row!important}#auth0-widget .cleanslate th,#auth0-widget .cleanslate td{display:table-cell!important}#auth0-widget .cleanslate nav ul,#auth0-widget .cleanslate nav ol{list-style-type:none!important}#auth0-widget .cleanslate ul,#auth0-widget .cleanslate menu{list-style-type:disc!important}#auth0-widget .cleanslate ol{list-style-type:decimal!important}#auth0-widget .cleanslate ol ul,#auth0-widget .cleanslate ul ul,#auth0-widget .cleanslate menu ul,#auth0-widget .cleanslate ol menu,#auth0-widget .cleanslate ul menu,#auth0-widget .cleanslate menu menu{list-style-type:circle!important}#auth0-widget .cleanslate ol ol ul,#auth0-widget .cleanslate ol ul ul,#auth0-widget .cleanslate ol menu ul,#auth0-widget .cleanslate ol ol menu,#auth0-widget .cleanslate ol ul menu,#auth0-widget .cleanslate ol menu menu,#auth0-widget .cleanslate ul ol ul,#auth0-widget .cleanslate ul ul ul,#auth0-widget .cleanslate ul menu ul,#auth0-widget .cleanslate ul ol menu,#auth0-widget .cleanslate ul ul menu,#auth0-widget .cleanslate ul menu menu,#auth0-widget .cleanslate menu ol ul,#auth0-widget .cleanslate menu ul ul,#auth0-widget .cleanslate menu menu ul,#auth0-widget .cleanslate menu ol menu,#auth0-widget .cleanslate menu ul menu,#auth0-widget .cleanslate menu menu menu{list-style-type:square!important}#auth0-widget .cleanslate li{display:list-item!important;min-height:auto!important;min-width:auto!important}#auth0-widget .cleanslate strong{font-weight:bold!important}#auth0-widget .cleanslate em{font-style:italic!important}#auth0-widget .cleanslate kbd,#auth0-widget .cleanslate samp,#auth0-widget .cleanslate code{font-family:monospace!important}#auth0-widget .cleanslate a,#auth0-widget .cleanslate a *,#auth0-widget .cleanslate input[type=submit],#auth0-widget .cleanslate input[type=radio],#auth0-widget .cleanslate input[type=checkbox],#auth0-widget .cleanslate select{cursor:pointer!important}#auth0-widget .cleanslate a:hover{text-decoration:underline!important}#auth0-widget .cleanslate button,#auth0-widget .cleanslate input[type=submit]{text-align:center!important}#auth0-widget .cleanslate input[type=hidden]{display:none!important}#auth0-widget .cleanslate abbr[title],#auth0-widget .cleanslate acronym[title],#auth0-widget .cleanslate dfn[title]{cursor:help!important;border-bottom-width:1px!important;border-bottom-style:dotted!important}#auth0-widget .cleanslate ins{background-color:#ff9!important;color:black!important}#auth0-widget .cleanslate del{text-decoration:line-through!important}#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate q{quotes:none!important}#auth0-widget .cleanslate blockquote:before,#auth0-widget .cleanslate blockquote:after,#auth0-widget .cleanslate q:before,#auth0-widget .cleanslate q:after,#auth0-widget .cleanslate li:before,#auth0-widget .cleanslate li:after{content:\"\"!important}#auth0-widget .cleanslate input,#auth0-widget .cleanslate select{vertical-align:middle!important}#auth0-widget .cleanslate select,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate input{border:1px solid #ccc!important}#auth0-widget .cleanslate table{border-collapse:collapse!important;border-spacing:0!important}#auth0-widget .cleanslate hr{display:block!important;height:1px!important;border:0!important;border-top:1px solid #ccc!important;margin:1em 0!important}#auth0-widget .cleanslate *[dir=rtl]{direction:rtl!important}#auth0-widget .cleanslate mark{background-color:#ff9!important;color:black!important;font-style:italic!important;font-weight:bold!important}#auth0-widget .cleanslate{font-size:medium!important;line-height:1!important;direction:ltr!important;text-align:left!important;font-family:\"Times New Roman\",Times,serif!important;color:black!important;font-style:normal!important;font-weight:normal!important;text-decoration:none!important;list-style-type:disc!important}#auth0-widget .zocial,#auth0-widget a.zocial{border:1px solid #777;border-color:rgba(0,0,0,0.2);border-bottom-color:#333;border-bottom-color:rgba(0,0,0,0.4);color:#fff;-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);cursor:pointer;display:inline-block;font:bold 100%/2.1 \"Lucida Grande\",Tahoma,sans-serif;padding:0 .95em 0 0;text-align:center;text-decoration:none;text-shadow:0 1px 0 rgba(0,0,0,0.5);white-space:nowrap;-moz-user-select:none;-webkit-user-select:none;user-select:none;position:relative;-moz-border-radius:.3em;-webkit-border-radius:.3em;border-radius:.3em}#auth0-widget .zocial:before{content:\"\";border-right:.075em solid rgba(0,0,0,0.1);float:left;font:120%/1.65 zocial;font-style:normal;font-weight:normal;margin:0 .5em 0 0;padding:0 .5em;text-align:center;text-decoration:none;text-transform:none;-moz-box-shadow:.075em 0 0 rgba(255,255,255,0.25);-webkit-box-shadow:.075em 0 0 rgba(255,255,255,0.25);box-shadow:.075em 0 0 rgba(255,255,255,0.25);-moz-font-smoothing:antialiased;-webkit-font-smoothing:antialiased;font-smoothing:antialiased}#auth0-widget .zocial:active{outline:0}#auth0-widget .zocial.icon{overflow:hidden;max-width:2.4em;padding-left:0;padding-right:0;max-height:2.15em;white-space:nowrap}#auth0-widget .zocial.icon:before{padding:0;width:2em;height:2em;box-shadow:none;border:0}#auth0-widget .zocial{background-image:-moz-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.1)),color-stop(49%,rgba(255,255,255,0.05)),color-stop(51%,rgba(0,0,0,0.05)),to(rgba(0,0,0,0.1)));background-image:-webkit-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1))}#auth0-widget .zocial:hover,#auth0-widget .zocial:focus{background-image:-moz-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-ms-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-o-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.15)),color-stop(49%,rgba(255,255,255,0.15)),color-stop(51%,rgba(0,0,0,0.1)),to(rgba(0,0,0,0.15)));background-image:-webkit-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15))}#auth0-widget .zocial:active{background-image:-moz-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.1)),color-stop(30%,rgba(255,255,255,0)),color-stop(50%,transparent),to(rgba(0,0,0,0.1)));background-image:-webkit-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1))}#auth0-widget .zocial.dropbox,#auth0-widget .zocial.github,#auth0-widget .zocial.gmail,#auth0-widget .zocial.openid,#auth0-widget .zocial.secondary,#auth0-widget .zocial.stackoverflow,#auth0-widget .zocial.salesforce{border:1px solid #aaa;border-color:rgba(0,0,0,0.3);border-bottom-color:#777;border-bottom-color:rgba(0,0,0,0.5);-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget .zocial.dropbox:focus,#auth0-widget .zocial.dropbox:hover,#auth0-widget .zocial.github:focus,#auth0-widget .zocial.github:hover,#auth0-widget .zocial.gmail:focus,#auth0-widget .zocial.gmail:hover,#auth0-widget .zocial.openid:focus,#auth0-widget .zocial.openid:hover,#auth0-widget .zocial.secondary:focus,#auth0-widget .zocial.secondary:hover,#auth0-widget .zocial.stackoverflow:focus,#auth0-widget .zocial.stackoverflow:hover,#auth0-widget .zocial.twitter:focus .zocial.twitter:hover,#auth0-widget .zocial.salesforce:focus .zocial.salesforce:hover{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.5)),color-stop(49%,rgba(255,255,255,0.2)),color-stop(51%,rgba(0,0,0,0.05)),to(rgba(0,0,0,0.15)));background-image:-moz-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-webkit-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-o-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-ms-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15))}#auth0-widget .zocial.dropbox:active,#auth0-widget .zocial.github:active,#auth0-widget .zocial.gmail:active,#auth0-widget .zocial.openid:active,#auth0-widget .zocial.secondary:active,#auth0-widget .zocial.stackoverflow:active,#auth0-widget .zocial.wikipedia:active,#auth0-widget .zocial.salesforce:active{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0)),color-stop(30%,rgba(255,255,255,0)),color-stop(50%,rgba(0,0,0,0)),to(rgba(0,0,0,0.1)));background-image:-moz-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-webkit-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1))}#auth0-widget .zocial.amazon:before{content:\"a\"}#auth0-widget .zocial.dropbox:before{content:\"d\";color:#1f75cc}#auth0-widget .zocial.facebook:before{content:\"f\"}#auth0-widget .zocial.github:before{content:\"\\00E8\"}#auth0-widget .zocial.gmail:before{content:\"m\";color:#f00}#auth0-widget .zocial.google:before{content:\"G\"}#auth0-widget .zocial.googleplus:before{content:\"+\"}#auth0-widget .zocial.guest:before{content:\"?\"}#auth0-widget .zocial.ie:before{content:\"6\"}#auth0-widget .zocial.linkedin:before{content:\"L\"}#auth0-widget .zocial.openid:before{content:\"o\";color:#ff921d}#auth0-widget .zocial.paypal:before{content:\"$\"}#auth0-widget .zocial.stackoverflow:before{content:\"\\00EC\";color:#ff7a15}#auth0-widget .zocial.twitter:before{content:\"T\"}#auth0-widget .zocial.vk:before{content:\"N\"}#auth0-widget .zocial.windows:before{content:\"W\"}#auth0-widget .zocial.yahoo:before{content:\"Y\"}#auth0-widget .zocial.office365:before{content:\"z\"}#auth0-widget .zocial.thirtysevensignals:before{content:\"b\"}#auth0-widget .zocial.salesforce:before{content:\"*\"}#auth0-widget .zocial.waad:before{content:\"z\"}#auth0-widget .zocial.box:before{content:\"x\"}#auth0-widget .zocial.amazon{background-color:#ffad1d;color:#030037;text-shadow:0 1px 0 rgba(255,255,255,0.5)}#auth0-widget .zocial.dropbox{background-color:#fff;color:#312c2a}#auth0-widget .zocial.facebook{background-color:#4863ae}#auth0-widget .zocial.github{background-color:#fbfbfb;color:#050505}#auth0-widget .zocial.gmail{background-color:#efefef;color:#222}#auth0-widget .zocial.google{background-color:#4e6cf7}#auth0-widget .zocial.googleplus{background-color:#dd4b39}#auth0-widget .zocial.guest{background-color:#1b4d6d}#auth0-widget .zocial.ie{background-color:#00a1d9}#auth0-widget .zocial.linkedin{background-color:#0083a8}#auth0-widget .zocial.openid{background-color:#f5f5f5;color:#333}#auth0-widget .zocial.paypal{background-color:#fff;color:#32689a;text-shadow:0 1px 0 rgba(255,255,255,0.5)}#auth0-widget .zocial.twitter{background-color:#46c0fb}#auth0-widget .zocial.vk{background-color:#45688e}#auth0-widget .zocial.windows{background-color:#0052a4;color:#fff}#auth0-widget .zocial.office365{background-color:#00aced;color:#fff}#auth0-widget .zocial.waad{background-color:#00adef;color:#fff}#auth0-widget .zocial.thirtysevensignals{background-color:#6ac071;color:#fff}#auth0-widget .zocial.box{background-color:#267bb6;color:#fff}#auth0-widget .zocial.salesforce{background-color:#fff;color:#f00}#auth0-widget .zocial.windows{background-color:#2672ec;color:#fff}#auth0-widget .zocial.primary,#auth0-widget .zocial.secondary{margin:.1em 0;padding:0 1em}#auth0-widget .zocial.primary:before,#auth0-widget .zocial.secondary:before{display:none}#auth0-widget .zocial.primary{background-color:#333}#auth0-widget .zocial.secondary{background-color:#f0f0eb;color:#222;text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget button:-moz-focus-inner{border:0;padding:0}@font-face{font-family:'zocial';src:url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.eot')}@font-face{font-family:'zocial';src:url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABeQAA0AAAAAIGgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABMAAAABoAAAAcZnuAykdERUYAAAFMAAAAHwAAACAATgAGT1MvMgAAAWwAAABIAAAAVk/l3EBjbWFwAAABtAAAAPYAAAIKnl567Gdhc3AAAAKsAAAACAAAAAj//wADZ2x5ZgAAArQAABKLAAAZsAMpJrBoZWFkAAAVQAAAADAAAAA2/3JSWWhoZWEAABVwAAAAIAAAACQFfQH5aG10eAAAFZAAAABjAAAAgDtOAbdsb2NhAAAV9AAAAEQAAABEWZZf+G1heHAAABY4AAAAHgAAACAAcAC+bmFtZQAAFlgAAADeAAABhlbD9/Jwb3N0AAAXOAAAAFYAAABsUemhhHicY2BgYGQAgpOd+YYg+lwlxxkYDQBA+QYqAAB4nGNgZGBg4ANiCQYQYGJgZGBmUACSLGAeAwAFxABVAHicY2BkEmOcwMDKwMHow5jGwMDgDqW/MkgytDAwMDGwMjPAALMAAwIEpLmmMDgwKH5gYHzw/wGDHuNrBvUGBgZGkBwAj6YLSHictZC9LkRRFIW/O67xzx2GYQwzElHMNBMvoBKNqIQoiVBKJBLxMlSimnJoKGi8gxeQUCh1y7o/jZurtJO1917n7HWy1wEGSNEgcCYIzYKEh7y7rtNyN+1ulTU6dNlgky222WGXfQ444phTzjjngkuurPr8QopfY8Wadk6zZ82hNSfFGn3rTR961Yue9aRHPehefZ/3jFv1dKcbXaujdpRu2qU4WhnyUbe3pj1F1KhQtecyqfnYf8mplFPEl/VGM2TZzWA5Plr8PTGU5GFG4jLKWELHmZhkKpuIav7ESjVjs8lqSzDPQtHuM8bcH77+JX4A6/Y7NwAAAAAAAf//AAJ4nJ1YeYwkV32u33tV79V9H313T/f0MdMzPdNnzeGZ2WN2vYftXXbXF2vvrtc2uw7GDkZADARI2BChiFh2hL1BcsAKicLhkEgJRJEwREFKLMcRoBAnUkKwEsFi5AASOIqTzOT3qmcdkv9I1/T0O6pevXrv+33f9ysJJGn320SCb0tEkjyYIdIOVnYk8ZGx77vwA7gmWVJF6kjLkjQOhoMK4TZ0gTeSYTocTNJJO95rCERD0sNysgnpaDJu3PtyfrntqM5bts/Vrgyv1M4dut+1Z13decuhu2ceev98vA+4nHP3zea6ClmvwvNBa719+OTV9KmThw51W/1DJ58C6xxx/PdBowAySGR3d/cazvd7Uk3axBmPJlvAojCp0ChkjXqrzePEJqJAW+NkNBkO4iRttQebIEpBjGc5MBmPWu2Wa91f+yWnUPYbSWV/NFdeVGJPtSJ6Bl5qRPktu9rrw0KZZy2udSx3dO12eAhruWb/3FCxo6IT55LgrOsCkz0TLjCaBJHv3JFTTeZaO59kFE/2ZudXjgUVScZ5f4ech+9KbekG6bB0CtdyNFmH1niUinlnFd6oQBTiYkZhnIhi1pOGMS7zeNTusXar0WJpBYbxpEeYMh6Oh9EwakSN8dn9xUhV9PH2mcknZge54mJglOxq7syR7XOrNyxupBRklVuqL4fB0qE6G1Qrs/pwYxZmLuUvXcpvLxwOc44DB5eXDhe0YW1p1vYtraLHvUZvezjvzfYXmzpXdJ0ZikkZ9P9zbg3SN62QyUhcfumSBBIgVn4V/hhxIqWjFPdfPNMAF5xnD8W4LTfqrAu4NdkxBmbu73b23bGvMznaJAr1a0ELQIHNwklFky0tOGXEC0e92mBhY2NhUAvuSpdURVUtVVbAszWTqmpDoojRa/As4uEh6f3SRwQiUoTkOogV24C9SpzEyQChGU+PN6aDU8SJirNjm+Cisy51lLBCppdPpzmqR6EDjDfq2bx70G6l43TU5wJ2IT4PZ8pkGCejdgOLqqxpzrJqMO6zSK+EIbWNYtD3IqbIlKg2d6xcGKZtPWeqlk0AgBCgivjIWJJlh3plLwgX3SLRZcWmprO/aXI1oISeAwbKsm9SmDHMJKgSh6twLNQ5VQzVMCuWZigUVDUhjLNS6USvEtt3zMdFl5PCfFI08F5UVqmsU1FSGNcUYufbRby9PgSoFy0TUeIyxz8feYfhLqCGbcwrDJ4koHZBN5ATqMAxHM9wvPn/RnG2aohjXOc0a4Ns8aLwZ4AxXag3BJBJ2bNBGVZIxbN/RhzncojjQlxWtbkVKERlVTzff+2+Qlz4DnKeJ81LEhEcMoUMzpp6Q28dxgLfw0EZhggSnHjU34BGHNLZcsn3PL8MpdIjW2+X1XK8+siR9QPNtwM8PpxxvWLe9XbeC7ftfObLvu7lbv7iV2+6ZQVg2f0sRs9/SG3yNnhMehInMUWwgGy6hsGO7IawrTAE80isFmlvwjqt0jhBBOKyCSQiwDfpeLIlZ1eKtR5UIJu3jXxNkzAbI3sOgWScdQPBTEWvaMAxsSojKBDOCkcgIRcqBqNc4RCWgFGmMEZtolLNlXmzatmWbehczgAMxMLIpHouhyepqqHolseVwHZ1QnzNLylgMgaUyTo0o7CAVxq6Zum03qSWZnOTE5nX7aCzv5WMl0GVGYV3i3AAoETXPDo/R1SFyzKGyqqutmwmpqIhmrluIp69SDFNTU9UqsoWVEemlU0MyUSmslN2cg0OruowmWuyBjPFouHJYtJKl3iaCqTQ4CaRZ2bL2/dQT3NsxPlUF9+FuthHjONypshb4qcHGxAPewIDuL4C8QiPScq4+EahTXExHffNh+cOmrrtu4vrxVqx6i//2gl6fLLSWmza881mvl3ZvO3RQ289WyArgzZR1CM94nqrM43K+hHZs8Y3zWnJUl5x2yVvdPn80YW16XyukePIc/uR4zbpFoj7VhQMsEyDERatbFexPBwMpztty5zVBWER3F8beGllfkbVGNNVy7M0plIvNMyFggVyrHA/b64uLDI2DjSqj7aOToK4WU9U7ZQqeCCx4e6ZUcmlgq3y1W5zwd43We3nY6YUObEPdqryfJh3vNGDZ44vWiaSTgCGjjRDTf26l7hGfgHnHyBzrEsncFUxiLYEVhPegyXAydtYRz4e/u+2ABe6imuOGp4iqziA8P0/bQ2ObRN/6Pn50iie+Ium7blqcX0w9keeVyiO4rG/aFm+g20vjgMsZt3O2B+7XqE0bI+DhayttIZtI98tFkbV53RkTEWPnnM8gh/ze8/pZla3fQFNc+cHX7J9RD8xjOmpBqhf2uszxLlMk4Q+SYfIVxBHx/GZT+Pe4Y5VyTCJyxAKUeH1MswgjXRJfQNa6GYm+Pz4H7Wr1UdTFcZVOuRt0ba8CaIVz+RRM6FtniacEgS6tvobGDFk1WGgIbcfkwFryi9vK7JGKfyTiCRTW/+5d0ZcblCskNdlIPecn6/ZZIXA7+kUx1D+gPGLsiiUyoTwy4ARwt4ja7Kiil3k+JjyfR8jBsiUCx1J6c634OIKWZEyb3ONDHFvc9Lt0mXpo+gAJoKChAuYxEJrQTgyDJYtGE2EJKcCr11ATDIu2sfTba8oZRru0RZqGPJTmwl6ak3VYzhJN8mG0I5kOkqm6NlCZqQ2DQOhJBwVZxkI++CT999DdcI1rjkLD45O/vqKTD5erxbn7Co3EtnLU6Ktadp2z1qbUTSUYODIY3KXMg05UCflop/vDO4IPZTeyGQKVJzFl5DtjNBXlEQhoYcBgSQVEJZopmlQclaWj7XQqVJLYVqhvDIkuBdPNAaWqRCizRgOBMiKHA/SWyAVxdR8FhPXPmfFOrKuTJtUkVGeHFrjynIa5oDFWuK4lmx9HQegCvIWkjH1+w7eWV70sAK4pSA44jH0Qr+dxZiUojkUahyhSKJQZSbxsROH+idOcPPixXu/ebE/Pn7RtQYXX301i8/df9/9IeGoewbqXiQVJamdttMEIZbwtgPjJC0DTdI2Mk+SRuxtb/vE5bd+/P77n758ebB8+cmnrj6Fs7k0eun06ct33nnvmdvPnzxZL5dOwhdg/dx9t+088AU4Wa3hfTDL2H0FduH7OEd0DzeA2MdsG7MdFx4rFWKG9Lpnv9LWlBAmgmYnGPR8Dx0cd/4N5tvbdjzCufNLDyydm4uiuXNYOD8XducPRYZd8JcKpm0oapCvblRD3+XcMgolNx8VooPdec8rlztz3bn5dqXseV+8vHy+E0Wd8/37+xfmwnDuwr1HVleSuaqF9GeUj7aLlQZhnoqGjgE0KsX2ahmlhNiVuWR19caFDo7i+r5brrQ7Ess86su4L21Uk3XpoHSj9ADyXxhnLrMxD42WcBT4JBgYaDPwWZgwT0LXbZhkWYxwUXxqqFm95YsSFigmAOkw6qO4Z15qi2SBsASjNu5/Y4y7vnV2375FxIdpNgeyo+arNFdqT/KhbSWlzdhxYvxGxWYR/z6Ta+RyDXs7VyZOGDCO3hXlFWIT2Q9pY2lps5zO9HoztZ5RcMho1jaovO6641ZuzvJDPzTqX6zncvXcH1lBYNlBAFfEeLmdb7322p897sY6Q3+ryEMOwPH76HhpaerfSRfXZhYzhxRXpbUpb0FkK840r5OrEPWUseKlXiBkrQo8GWfiAMX50ahrWeV+JWdy4RVYsT5b1vTByf6sq4F81KNBGBtG95OT6Fix+HQtnS25BpAt4sb5HD4fVw3dz0UWkuZYKdSajbL6OfjrwU4HuOAB1ev8YjUuEsHhXPgBeAJ5nGOEOIjeBGOkKknROOEzuAtNDLExRkv7p74YKryNcdHZ+dHzzyvPy182/9x6On42ub3xrlmzO9Ot/S187rN/8/PzxxfC7oPz6fxvNS+3vpH/VP6f+V/wLFZ8SScJ/Im0IX0AIzq+nr+kk71jD/r/c6A2XI+D6wfSYxLG6eiNi5A2JxVZjDN8oykRVnI6uqDf69fuDbvcChkz3Up3brQ6Thfm6zrjKDFIRVY+rlabYWJaClFdRQgFM80kbtcqUajho9dRILlHDY37LlMMqlMVbI1zbmACrdsKUyhVwshxfY2F4GsAfr+7ikzf6qK1gAdV7pg5y0Zjyjyvoqm6qjksUOSVfne2ERpc+DjceUVzivOd0WAVs0LREKM15GFJ8Ww1p6BgoaUBR6agmaWGYRPBySA7kRvErtakVZ9ALXARnIrjlbhGhV95QqrQy/B53OO2tCSUG+oMcYfLO+6PWhigfQy7zHxl/0ctud7KojLe+03a6XjSw8yxz9v9Hmpd0k94n1WQtPppgtduQpvkOwd9/0BnqeUmHpxa6xzw/YOdtVOndn54eDA43P/L7P9rR45w2U/45hZPfMqOHEH6R3RtYk3msDJXr8+V3m24rvHK2ptE5fQ7T73cz67M/m9cuABaYlHt9GmNWol2zwU9tqc1O0Z3piC2/wHj+9uZT1MlU3LRp/TTiCdRe5w2Iwui5vgb+Pk+JDvfy75PlV+A+IXy5/9l7sc0/+POX009nin58BNcs560Ld0lPSxJAeZJEwEpgbJNwNIb0Opl1B8P46xnCmVlggi8fkJ93NoD52B6pQ3t+h4is3Y+mUKWh3tI7YFJHM3nbJ8PcFSTA03TaO5ux3bifF0zCHpgH2LL1FHN6VlHhic0Dzedt5p51+YIaDVMqsUR0RVFMwnidHGm7KMoE6Kauea7ZG7lOn0LXEMLZmuuyuA3NQs8+1NdAl/JaapMA33tWtsLuKqAqzkiBTH0PLXQVfzjrBZTpBRfCV2RpRN0GJ4f+78i0OppOA5F7cf0FjMWmZ9GQdfcAvNcJjOzkHNUtJKSsvv67t/jPr2MHKQjNxSkuiQ1G7yRDpPGEvBZoQwIPVZnQloESLNfmDttHL/z5J03FwsFKF196erVl/LPPPLIM4+854lLl5649Ez71VfP3nrrO0T71QOPiJ4Ll0SPtHfPf4N/ha9LMWrXDZh93IiR0AOx4gwXPoqjCmQ+L51QhpuQbTPuFPYy3Ju96iR7N5CZwbag9XQicn54JTnWqRQeeKaoG/HjF868k0LUfW3fB5otdaHzvhSc+MYHNPXWjcMPGNQowy2HzmxsdjoHAN6xvZ0/ppBmBT5dCSydxfdexjShBG++T1ev3Fmr37Tzh0F/de3KpN9IQofqtx5be6uqv+nGhMOJh756w1xnH8CBuflHzf0HLBJsoZaLZ1Uznf4malFJulW6T3pQelT6iPSM9KcCx3Q4tSHCbgrbKnJmEP5E5IBZJrNJpnDNTqsQRKx412hTgdlGXbxCEka4nb1HSqcp+3DcFv6MX5dzLsbCBCASdhlZuwpDIeF4ow1oBD+V2kVisGkwjJKReCeLxtlWuiAyeSCm7aDQxl6IXjFBoTN116GkjplmYtmQr+ia64WK7CIAZXdURn5F6LG4PKoGMfcMS9G0vBlqkPN8dhC4Ud5fbjg5qtZ6tVrPRrp1SgXVJOccVT1Wq8oMqkUaBz6VY9dUQi9H5ZLB4a4Vr2BhpCmq4Wk0tCyTwmJQtFXww1BFSq7nZZxS2dFU5cca5t1xHvOoqOa7hpFRNQsnsV4p5dGSa5GB9oGI5EVk7p7nH+bcdWL2NHQjA9j+Xm//0usYOpot7zMUS7coefgMoOc+BkouHyn5EFWjnITomWM3Vj96sxOLOFWoa9g6ZjksH0qZ5n5w93U4C19DfZ9BpGdOLEEoo73aQhsd4u/YG9HrL7siOHN4cuSWuzEj6jJypiq35F5hptetVuFrp46fbzwrM+XTn1YUeIHtSuNxmv6dJFmSs/sa/AhexDj20EW0MLI2MK5OS3dLb5HeLr1XuiJJswISNtTTEJkwE5T2ng+st5TrjpC1mqJYgezVd9aQZn3pnk/EmKtP31GIOp0OhKXJtHM44G+Yy9a0BwsjvqdgDA6GlRii8tXIdqKoGjwbOXYUlaOdF0M0jaICQ1GCGIsfxpPwZMcJDzpRXM66I9uO8IQwKof4wTbbuRpm7U74nkoYTk+OsPRwOYxK4YdxxBDPvQ0vKUXhbW4QliIc0w7xN7TtEGLbCXAo0VIOr2BTFFlOuPMw9uPNwo/hTylsOKI3eF1cEZaWAyxXAtQ5S7oLXoWLmKdWpa40kNYwsjFSY8xUCaaYdqYxQkcmqPRIanFaIVNtGU04qhhrT7CKHRX4rFr0uemaqlfEfNh2882iZ6gy+VCix6NG8pPeupJozkQlUDK6dDWtfmiyZrQ4a8FFRCfT8c+SnYP1fjBDK2EhXNj3YvnIxpLyO7+rb5+ed/Xmpju79PvWSM7nW61czlpS1Z4k/Tc/tXiPAHicY2BkYGAA4qooY554fpuvDNxMDCBwrpLjDIz+//P/TeYMxtdALgcDWBoAKlkMKXicY2BkYGB8/f8mgx4Lw/+f/xiYMxiAIihAHgCk1AZ5eJxjYoCCVRCK8RMDAxOQZooDsjsYGBnXAGkvIF/k/z+m3P9/mEqBbBC/HIgPAbERUH4RQz8T2/9fIH2MD4BiWkB6ItgcIRYGhklg8xgYeJgY/v8GYcYrYH4DAz8DLwDcABUuAAAAAAAAAAAAAA4AWAC0ASQBYAIYAogCxAOMA9QENASwBSIF5gYEBjgGsgdAB5QHzgiMCQIJJgnWChAKhguIC7oMdgzYeJxjYGRgYFBk2M3AywACTEDMyAAScwDzGQAZIgEvAAB4nHWOMWoDMRBF39prh+AQUoWUgjRpdpE2jfEB9gAp3BsjlgXbAtkGnyRVjpAyx8gBcoQcI9/raVJYMOjN15/5Au54p+B8Cm54MB6JX4zHPHMyLqV/Gk+Y8W08lf4rZ1HeSrkfps48Ej8Zj2nxxqX0D+MJj3wZT6X/0LMmsVUldtCv0zYlwRuRjiMbVmS1sTtuVoJ28B2GO8sRcTTUSnMsVP/3XbQ5FUGOSk4vetWatDu0KXfRNbV3C2e5onkVfNX4INO1vy2Vmtnr/ZIRhnyWMe977Qi1vzr7BwDvOdMAAHicY2BiwA8UgZiRgYmRiYGdgZeBj0GJQYNBi0GfwZDBnMGSwYrBhsGFwZPBnaGQwYshiKGUwZUhmiGWgYVBmIGVIYKBk4GNIZS9NC/TzcDAAADphwhaAAA=) format('woff'),url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.ttf') format('truetype'),url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.svg#zocialregular') format('svg');font-weight:normal;font-style:normal}#auth0-widget .zocial.auth0:before{content:\"?\"}#auth0-widget .zocial.auth0{background-color:#ff4500;width:auto}#auth0-widget .zocial.block{display:block;margin:10px 0;text-overflow:ellipsis;overflow:hidden}#auth0-widget .zocial.primary,#auth0-widget .zocial.secondary{margin:0;padding:0 1em;font-size:14px;line-height:42px}#auth0-widget .zocial.primary:before,#auth0-widget .zocial.secondary:before{display:none}#auth0-widget .zocial.primary{background-color:#747e85}#auth0-widget .zocial.secondary{background-color:#f0f0eb;color:#222;text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget .zocial{-webkit-font-smoothing:antialiased}#auth0-widget .popup .overlay{position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;z-index:9999;font-weight:200;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;background:#000;background:rgba(0,0,0,0.8);background:-webkit-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:-moz-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:-ms-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);opacity:0;-webkit-transition:400ms opacity ease;-moz-transition:400ms opacity ease;transition:400ms opacity ease;-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}#auth0-widget .popup .overlay.active{opacity:1}#auth0-widget .popup .overlay .panel{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;left:50%;display:none}#auth0-widget .popup .overlay .panel.active{display:block;-webkit-animation-duration:400ms;-webkit-animation-timing-function:ease;-webkit-animation-name:showPanel}#auth0-widget .popup .overlay .panel{-webkit-animation-duration:400ms;-webkit-animation-timing-function:ease;-webkit-animation-name:hidePanel;width:280px;margin:0 0 0 -140px}#auth0-widget .popup .overlay .email{margin-bottom:14px}#auth0-widget .popup .overlay .password,#auth0-widget .popup .overlay .repeatPassword{margin-bottom:14px}#auth0-widget .popup .overlay .email-readonly{text-align:center;display:inherit;color:#41444a;font-weight:bold;margin-bottom:25px}#auth0-widget .panel .signup .header,#auth0-widget .panel .reset .header{margin-bottom:15px;font-size:14px;color:#41444a}#auth0-widget .panel .signup .footer{margin-bottom:15px;font-size:12px;color:#41444a;text-align:left;margin-top:10px}@-moz-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-webkit-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-o-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-ms-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-moz-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-webkit-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-o-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-ms-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}#auth0-widget .popup .panel{background:#fafafa;background-image:-webkit-linear-gradient(#fff,#fafafa);background-image:-moz-linear-gradient(#fff,#fafafa);background-image:-ms-linear-gradient(#fff,#fafafa);background-image:-o-linear-gradient(#fff,#fafafa);background-image:linear-gradient(#fff,#fafafa);z-index:10;-moz-box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);-webkit-box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;-webkit-touch-callout:none}#auth0-widget .popup .panel:after{content:\"\";position:absolute;left:0;right:0;top:0;bottom:0;z-index:1;-moz-box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4);-webkit-box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4);box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4)}#auth0-widget .popup .panel header{display:block;position:relative;min-height:65px;overflow:hidden;-moz-border-radius:6px 6px 0 0;-webkit-border-radius:6px 6px 0 0;border-radius:6px 6px 0 0;background:#f1f4f6;background-image:-webkit-linear-gradient(#f1f4f6,#e9edf0);background-image:-moz-linear-gradient(#f1f4f6,#e9edf0);background-image:-ms-linear-gradient(#f1f4f6,#e9edf0);background-image:-o-linear-gradient(#f1f4f6,#e9edf0);background-image:linear-gradient(#f1f4f6,#e9edf0);border-bottom:1px solid rgba(40,69,85,0.11)}#auth0-widget .popup .panel header:before{content:'';position:absolute;height:5px;bottom:-1px;left:0;right:0;background-image:-webkit-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-moz-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-ms-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-o-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1))}#auth0-widget .popup .panel header:after{content:'';position:absolute;height:4px;bottom:0;left:0;right:0;background-image:-webkit-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-moz-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-ms-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-o-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0)}#auth0-widget .popup .panel header h1{padding:21px 20px;margin:0;font-size:18px;color:#41444a;font-weight:bold;border-bottom:1px solid #dde3e6}#auth0-widget .popup .panel header a{display:block;overflow:hidden;text-indent:200%;position:absolute;width:12px;opacity:.4;padding:5px;z-index:5}#auth0-widget .popup .panel header a:hover{opacity:.66}#auth0-widget .popup .panel header a:active{opacity:1}#auth0-widget .popup .panel header a.close{height:12px;background:url(\"https://s3.amazonaws.com/assets.auth0.com/w2/img/close.png\") 50% 50% no-repeat;background-size:12px 12px;right:19px;top:21px;cursor:pointer}#auth0-widget .popup .panel header a.close:hover{opacity:.66}#auth0-widget .popup .panel header img{height:32px;margin:16px 10px 10px 20px;position:relative;float:left}#auth0-widget .action .spinner{width:100%;background-color:#6a777f;background-image:url('https://s3.amazonaws.com/assets.auth0.com/w2/img/spinner.gif');background-repeat:no-repeat;background-position:center;margin:0;height:44px;border:1px solid #777;border-color:rgba(0,0,0,0.2);border-bottom-color:#333;border-bottom-color:rgba(0,0,0,0.4);-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-moz-user-select:none;user-select:none;-moz-border-radius:.3em;-webkit-border-radius:.3em;border-radius:.3em}#auth0-widget .popup .panel footer{display:block;position:relative;-moz-border-radius:0 0 5px 5px;-webkit-border-radius:0 0 5px 5px;border-radius:0 0 5px 5px;height:25px;line-height:25px;vertical-align:middle;margin:0 15px;border-top:1px solid #dde3e6;z-index:5}#auth0-widget .popup .panel footer span{font-size:10px;color:#666}#auth0-widget .popup .panel footer a{font-size:9px;color:#333;font-weight:bold;text-decoration:none;cursor:pointer}#auth0-widget .list,#auth0-widget .iconlist{margin:25px 0;position:relative;z-index:5}#auth0-widget .list:before,#auth0-widget .list:after,#auth0-widget .iconlist:before,#auth0-widget .iconlist:after{display:table;content:\"\"}#auth0-widget .list:after,#auth0-widget .iconlist:after{clear:both}#auth0-widget .list span{display:block;margin:10px 0;cursor:pointer}#auth0-widget .iconlist{text-align:center}#auth0-widget .iconlist span{margin:0 2px}#auth0-widget .forgot-pass{font-size:12px;color:#666;font-weight:normal}#auth0-widget .create-account{display:none;margin-top:20px;text-align:center}#auth0-widget .create-account a{font-size:12px;color:#6d6d6d;text-decoration:none}#auth0-widget .create-account a:hover{text-decoration:underline}#auth0-widget .loggedin span.centered.all{color:#008cdd;cursor:pointer}#auth0-widget .loggedin span.centered{text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;display:block}#auth0-widget .loggedin span.centered.all:hover{text-decoration:underline}#auth0-widget .signup .options a.cancel,#auth0-widget .reset .options a.cancel{color:#008cdd;cursor:pointer;text-decoration:none}#auth0-widget .signup .options a.cancel:hover,#auth0-widget .reset .options a.cancel:hover{text-decoration:underline}#auth0-widget .signup .options,#auth0-widget .reset .options{text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;display:block}#auth0-widget form{margin:30px!important;margin-bottom:22px;position:relative;z-index:5}#auth0-widget form label{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}#auth0-widget form input{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;font-size:18px;padding:10px 12px;border:1px solid #b4becd;border-top-color:#b0baca;border-bottom-color:#d3d9e2;-moz-box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);-webkit-box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;margin:0;font-family:'Helvetica Neue',Helvetica,Arial Geneva,sans-serif}#auth0-widget .placeholder{color:#ccc}#auth0-widget form input:focus{border-color:#5695db #70a7e4 #89b8ec #70a7e4;outline:0;-moz-box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db;-webkit-box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db;box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db}#auth0-widget form .invalid input{outline:0;border-color:#ff7076;border-top-color:#ff5c61;-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5);box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5)}#auth0-widget header .error{padding:9px 0;margin:10px auto;width:70%;font-size:14px;line-height:13px;color:#b95353;text-align:center}#auth0-widget header .success{padding:9px 0;margin:10px auto;width:70%;font-size:14px;line-height:13px;color:#0fad29;text-align:center}#auth0-widget form .note{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}#auth0-widget form .note a{color:#008cdd;text-decoration:none}#auth0-widget form .invalid .error{visibility:visible}#auth0-widget form button{display:block;margin:20px 0 0 0;cursor:pointer;width:100%}#auth0-widget .action{text-align:right;margin:0 30px 30px 30px;position:relative;z-index:5}#auth0-widget form .action{margin:0}#auth0-widget .action button{width:auto}#auth0-widget .separator{position:relative;text-align:center;margin:0 0 25px 0}#auth0-widget .separator:before{content:\"\";display:block;border-top:1px solid #7f8899;width:200px;left:50%;margin-left:-100px;height:1px;position:absolute;top:50%;z-index:1}#auth0-widget .separator span{background:#fafafa;padding:0 10px;position:relative;z-index:5;color:#7f8899;font-size:13px;font-weight:bold;text-shadow:0 1px 0 white}#auth0-widget span.back{display:block;color:#008cdd;text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;cursor:pointer;position:relative;z-index:5;outline:0}#auth0-widget span.back:hover{text-decoration:underline}#auth0-widget .signin .panel.strategies .list .email{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;text-align:center}#auth0-widget .zocial.office365:before{content:\"W\"}#auth0-widget .zocial.office365{background-color:#00aced;color:#fff}#auth0-widget .zocial.waad:before{content:\"z\"}#auth0-widget .zocial.waad{background-color:#00adef;color:#fff}#auth0-widget .zocial.thirtysevensignals:before{content:\"b\"}#auth0-widget .zocial.thirtysevensignals{background-color:#6ac071;color:#fff}#auth0-widget .zocial.box:before{content:\"x\"}#auth0-widget .zocial.box{background-color:#267bb6;color:#fff}#auth0-widget .zocial.salesforce:before{content:\"*\"}#auth0-widget .zocial.salesforce{background-color:#fff;color:#f00}#auth0-widget .zocial.windows{background-color:#2672ec;color:#fff}#auth0-widget .zocial.fitbit:before{content:\"#\"}#auth0-widget .zocial.fitbit{background-color:#45c2c5;color:#fff}#auth0-widget .zocial.yandex:before{content:\"&\"}#auth0-widget .zocial.yandex{background-color:#f00;color:#fff}#auth0-widget .zocial.renren:before{content:\"r\"}#auth0-widget .zocial.renren{background-color:#0056b5;color:#fff}#auth0-widget .zocial.baidu:before{content:\"u\"}#auth0-widget .zocial.baidu{background-color:#2832e1;color:#fff}#auth0-widget .popup .overlay .onestep{width:345px;margin:0 0 0 -172px}@media(max-width:280px){#auth0-widget .popup .overlay .panel{width:240px;margin:0 0 0 -120px}#auth0-widget .signin .popup .panel.strategies .list{margin:12px}#auth0-widget form{margin:12px}#auth0-widget form input{padding:5px}#auth0-widget .popup .panel header{margin:0;padding:0}#auth0-widget .popup .panel header h1{padding:14px 16px;margin:0;font-size:22px}#auth0-widget .popup .panel header a.close{right:14px;top:16px}}@media(min-width:281px) and (max-width:340px){#auth0-widget .popup .overlay .panel{margin:0;left:0;height:100%;width:100%;border-radius:0}#auth0-widget .popup .zocial,#auth0-widget .popup a.zocial{font-size:18px}#auth0-widget .signin .popup .panel.strategies .list{margin:15px}#auth0-widget form{margin:15px 25px}#auth0-widget form input{padding:6px;font-size:18px}#auth0-widget .popup .panel header{margin:0;padding:0;min-height:32px}#auth0-widget .popup .panel header h1{padding:12px 16px;margin-top:1px;font-size:20px}#auth0-widget .popup .panel header img{height:32px;margin:9px 10px 6px 18px}#auth0-widget .zocial.primary{line-height:34px}#auth0-widget .action .spinner{height:34px}#auth0-widget .create-account{margin-top:20px}#auth0-widget .popup .overlay .email{margin-bottom:5px}#auth0-widget .popup .overlay .password,#auth0-widget .popup .overlay .repeatPassword{margin-bottom:5px}}#auth0-widget .loading{display:none;border:0;overflow:hidden;position:fixed;visibility:visible;margin:0;padding:0;left:0;top:0;width:100%;height:100%;z-index:100000;font-weight:200;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;background-color:rgba(255,255,255,0.5)}#auth0-widget .loading .message{position:absolute;top:50%;margin-top:-110px;width:100%;text-align:center;font-size:22px;font-family:Helvetica,arial,freesans,clean,sans-serif;color:#333}#auth0-widget .loading .balls{position:absolute;left:50%;top:50%;margin-left:-45px;margin-top:-45px;width:90px;height:90px}#auth0-widget .loading .balls>div{position:absolute;width:86px;height:86px;opacity:0;-moz-transform:rotate(225deg);-moz-animation:orbit 7.15s infinite;-webkit-transform:rotate(225deg);-webkit-animation:orbit 7.15s infinite;-ms-transform:rotate(225deg);-ms-animation:orbit 7.15s infinite;-o-transform:rotate(225deg);-o-animation:orbit 7.15s infinite;transform:rotate(225deg);animation:orbit 7.15s infinite}#auth0-widget .loading .balls>div>div{position:absolute;width:11px;height:11px;background:#333;left:0;top:0;-moz-border-radius:11px;-webkit-border-radius:11px;-ms-border-radius:11px;-o-border-radius:11px;border-radius:11px}#auth0-widget .loading .balls .ball01{-moz-animation-delay:1.56s;-webkit-animation-delay:1.56s;-ms-animation-delay:1.56s;-o-animation-delay:1.56s;animation-delay:1.56s}#auth0-widget .loading .balls .ball02{-moz-animation-delay:.31s;-webkit-animation-delay:.31s;-ms-animation-delay:.31s;-o-animation-delay:.31s;animation-delay:.31s}#auth0-widget .loading .balls .ball03{-moz-animation-delay:.62s;-webkit-animation-delay:.62s;-ms-animation-delay:.62s;-o-animation-delay:.62s;animation-delay:.62s}#auth0-widget .loading .balls .ball04{-moz-animation-delay:.94s;-webkit-animation-delay:.94s;-ms-animation-delay:.94s;-o-animation-delay:.94s;animation-delay:.94s}#auth0-widget .loading .balls .ball05{-moz-animation-delay:1.25s;-webkit-animation-delay:1.25s;-ms-animation-delay:1.25s;-o-animation-delay:1.25s;animation-delay:1.25s}@-moz-keyframes orbit{0%{opacity:1;z-index:99;-moz-transform:rotate(180deg);-moz-animation-timing-function:ease-out}7%{opacity:1;-moz-transform:rotate(300deg);-moz-animation-timing-function:linear;-moz-origin:0}30%{opacity:1;-moz-transform:rotate(410deg);-moz-animation-timing-function:ease-in-out;-moz-origin:7%}39%{opacity:1;-moz-transform:rotate(645deg);-moz-animation-timing-function:linear;-moz-origin:30%}70%{opacity:1;-moz-transform:rotate(770deg);-moz-animation-timing-function:ease-out;-moz-origin:39%}75%{opacity:1;-moz-transform:rotate(900deg);-moz-animation-timing-function:ease-out;-moz-origin:70%}76%{opacity:0;-moz-transform:rotate(900deg)}100%{opacity:0;-moz-transform:rotate(900deg)}}@-webkit-keyframes orbit{0%{opacity:1;z-index:99;-webkit-transform:rotate(180deg);-webkit-animation-timing-function:ease-out}7%{opacity:1;-webkit-transform:rotate(300deg);-webkit-animation-timing-function:linear;-webkit-origin:0}30%{opacity:1;-webkit-transform:rotate(410deg);-webkit-animation-timing-function:ease-in-out;-webkit-origin:7%}39%{opacity:1;-webkit-transform:rotate(645deg);-webkit-animation-timing-function:linear;-webkit-origin:30%}70%{opacity:1;-webkit-transform:rotate(770deg);-webkit-animation-timing-function:ease-out;-webkit-origin:39%}75%{opacity:1;-webkit-transform:rotate(900deg);-webkit-animation-timing-function:ease-out;-webkit-origin:70%}76%{opacity:0;-webkit-transform:rotate(900deg)}100%{opacity:0;-webkit-transform:rotate(900deg)}}@-ms-keyframes orbit{0%{opacity:1;z-index:99;-ms-transform:rotate(180deg);-ms-animation-timing-function:ease-out}7%{opacity:1;-ms-transform:rotate(300deg);-ms-animation-timing-function:linear;-ms-origin:0}30%{opacity:1;-ms-transform:rotate(410deg);-ms-animation-timing-function:ease-in-out;-ms-origin:7%}39%{opacity:1;-ms-transform:rotate(645deg);-ms-animation-timing-function:linear;-ms-origin:30%}70%{opacity:1;-ms-transform:rotate(770deg);-ms-animation-timing-function:ease-out;-ms-origin:39%}75%{opacity:1;-ms-transform:rotate(900deg);-ms-animation-timing-function:ease-out;-ms-origin:70%}76%{opacity:0;-ms-transform:rotate(900deg)}100%{opacity:0;-ms-transform:rotate(900deg)}}@-o-keyframes orbit{0%{opacity:1;z-index:99;-o-transform:rotate(180deg);-o-animation-timing-function:ease-out}7%{opacity:1;-o-transform:rotate(300deg);-o-animation-timing-function:linear;-o-origin:0}30%{opacity:1;-o-transform:rotate(410deg);-o-animation-timing-function:ease-in-out;-o-origin:7%}39%{opacity:1;-o-transform:rotate(645deg);-o-animation-timing-function:linear;-o-origin:30%}70%{opacity:1;-o-transform:rotate(770deg);-o-animation-timing-function:ease-out;-o-origin:39%}75%{opacity:1;-o-transform:rotate(900deg);-o-animation-timing-function:ease-out;-o-origin:70%}76%{opacity:0;-o-transform:rotate(900deg)}100%{opacity:0;-o-transform:rotate(900deg)}}@keyframes orbit{0%{opacity:1;z-index:99;transform:rotate(180deg);animation-timing-function:ease-out}7%{opacity:1;transform:rotate(300deg);animation-timing-function:linear;origin:0}30%{opacity:1;transform:rotate(410deg);animation-timing-function:ease-in-out;origin:7%}39%{opacity:1;transform:rotate(645deg);animation-timing-function:linear;origin:30%}70%{opacity:1;transform:rotate(770deg);animation-timing-function:ease-out;origin:39%}75%{opacity:1;transform:rotate(900deg);animation-timing-function:ease-out;origin:70%}76%{opacity:0;transform:rotate(900deg)}100%{opacity:0;transform:rotate(900deg)}}#auth0-widget input[disabled]{background-color:#d9dee0}#auth0-widget article,#auth0-widget aside,#auth0-widget details,#auth0-widget figcaption,#auth0-widget figure,#auth0-widget footer,#auth0-widget header,#auth0-widget hgroup,#auth0-widget nav,#auth0-widget section,#auth0-widget summary{display:block}#auth0-widget audio,#auth0-widget canvas,#auth0-widget video{display:inline-block;*display:inline;*zoom:1}#auth0-widget audio:not([controls]){display:none;height:0}#auth0-widget [hidden]{display:none}#auth0-widget html{font-size:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}#auth0-widget html,#auth0-widget button,#auth0-widget input,#auth0-widget select,#auth0-widget textarea,#auth0-widget h1,#auth0-widget h2,#auth0-widget div,#auth0-widget span,#auth0-widget a{font-family:sans-serif}#auth0-widget body{margin:0}#auth0-widget a:focus{outline:thin dotted}#auth0-widget a:active,#auth0-widget a:hover{outline:0}#auth0-widget h1{font-size:2em;margin:.67em 0}#auth0-widget h2{font-size:1.5em;margin:.83em 0}#auth0-widget h3{font-size:1.17em;margin:1em 0}#auth0-widget h4{font-size:1em;margin:1.33em 0}#auth0-widget h5{font-size:.83em;margin:1.67em 0}#auth0-widget h6{font-size:.75em;margin:2.33em 0}#auth0-widget abbr[title]{border-bottom:1px dotted}#auth0-widget b,#auth0-widget strong{font-weight:bold}#auth0-widget blockquote{margin:1em 40px}#auth0-widget dfn{font-style:italic}#auth0-widget mark{background:#ff0;color:#000}#auth0-widget p,#auth0-widget pre{margin:1em 0}#auth0-widget code,#auth0-widget kbd,#auth0-widget pre,#auth0-widget samp{font-family:monospace,serif;_font-family:'courier new',monospace;font-size:1em}#auth0-widget pre{white-space:pre;white-space:pre-wrap;word-wrap:break-word}#auth0-widget q{quotes:none}#auth0-widget q:before,#auth0-widget q:after{content:'';content:none}#auth0-widget small{font-size:80%}#auth0-widget sub,#auth0-widget sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}#auth0-widget sup{top:-0.5em}#auth0-widget sub{bottom:-0.25em}#auth0-widget dl,#auth0-widget menu,#auth0-widget ol,#auth0-widget ul{margin:1em 0}#auth0-widget dd{margin:0 0 0 40px}#auth0-widget menu,#auth0-widget ol,#auth0-widget ul{padding:0 0 0 40px}#auth0-widget nav ul,#auth0-widget nav ol{list-style:none;list-style-image:none}#auth0-widget img{border:0;-ms-interpolation-mode:bicubic}#auth0-widget svg:not(:root){overflow:hidden}#auth0-widget figure{margin:0}#auth0-widget form{margin:0}#auth0-widget fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:.35em .625em .75em}#auth0-widget legend{border:0;padding:0;white-space:normal;*margin-left:-7px}#auth0-widget button,#auth0-widget input,#auth0-widget select,#auth0-widget textarea{font-size:100%;margin:0;vertical-align:baseline;*vertical-align:middle}#auth0-widget button,#auth0-widget input{line-height:normal}#auth0-widget button,#auth0-widget html input[type=\"button\"],#auth0-widget input[type=\"reset\"],#auth0-widget input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer;*overflow:visible}#auth0-widget button[disabled],#auth0-widget input[disabled]{cursor:default}#auth0-widget input[type=\"checkbox\"],#auth0-widget input[type=\"radio\"]{box-sizing:border-box;padding:0;*height:13px;*width:13px}#auth0-widget input[type=\"search\"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}#auth0-widget input[type=\"search\"]::-webkit-search-cancel-button,#auth0-widget input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}#auth0-widget button::-moz-focus-inner,#auth0-widget input::-moz-focus-inner{border:0;padding:0}#auth0-widget textarea{overflow:auto;vertical-align:top}#auth0-widget table{border-collapse:collapse;border-spacing:0}");

// use amd or just throught to window object.
if (typeof global.window.define == 'function' && global.window.define.amd) {
  global.window.define('auth0-widget', function () { return Auth0Widget; });
} else if (global.window) {
  global.window.Auth0Widget = Auth0Widget;
}

},{"./lib/insert-css":1,"./widget":25,"fs":15}],24:[function(require,module,exports){
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
    for (var i in this._auth0Strategies) {
      for (var j in this._auth0Strategies[i].connections) {
        if (this._auth0Strategies[j].connections[j].name === this._signinOptions['userPwdConnectionName']) {
          return this._auth0Strategies[i].connections[j];
        }
      }
    }
  }

  // By default, if exists, return auth0 connection (db-conn)
  var defaultStrategy = this._auth0Strategies.filter(function (s) { return s.name === 'auth0'; })[0];
  return this._auth0Strategies.length > 0 ? 
    (defaultStrategy ? defaultStrategy.connections[0] : this._auth0Strategies[0].connections[0]) :
    null;
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
    if (this._auth0Strategies.length > 0) {
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
      this._auth0Strategies.push(strategy);
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

Auth0Widget.prototype.show = function (signinOptions, callback) {
  if (typeof signinOptions === 'function') {
    callback = signinOptions;
    signinOptions = {};
  }

  var self = this;
  this._signinOptions = xtend(this._options, signinOptions);
  this._auth0Strategies = [];

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

      if (callback && typeof callback === 'function') callback();
    });
  });
};

module.exports = Auth0Widget;

},{"./html/main.html":24,"auth0-js":2,"bean":13,"bonzo":14,"qwery":16,"xtend":18}],26:[function(require,module,exports){
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
},{}]},{},[26,27,23])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9saWIvaW5zZXJ0LWNzcy5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvTG9naW5FcnJvci5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvYXNzZXJ0X3JlcXVpcmVkLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL2xpYi9iYXNlNjRfdXJsX2RlY29kZS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvanNvbl9wYXJzZS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvdXNlX2pzb25wLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9CYXNlNjQvYmFzZTY0LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9qc29ucC9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvanNvbnAvbm9kZV9tb2R1bGVzL2RlYnVnL2RlYnVnLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9xcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2JlYW4vYmVhbi5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9ib256by9ib256by5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZnMuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvcXdlcnkvcXdlcnkuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMveHRlbmQvaGFzLWtleXMuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMveHRlbmQvaW5kZXguanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMveHRlbmQvbm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL2ZvcmVhY2guanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMveHRlbmQvbm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL2luZGV4LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9pc0FyZ3VtZW50cy5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9ub2RlX21vZHVsZXMvb2JqZWN0LWtleXMvc2hpbS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL3N0YW5kYWxvbmUuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy93aWRnZXQvaHRtbC9tYWluLmh0bWwiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy93aWRnZXQvaW5kZXguanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy93aWRnZXQvanMvYXJyYXlzLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvd2lkZ2V0L2pzL3BsYWNlaG9sZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqb0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1MUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gICAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgICB9XG5cbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbn07XG4iLCJ2YXIgZ2xvYmFsPXR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fTt2YXIgYXNzZXJ0X3JlcXVpcmVkICAgPSByZXF1aXJlKCcuL2xpYi9hc3NlcnRfcmVxdWlyZWQnKTtcbnZhciBiYXNlNjRfdXJsX2RlY29kZSA9IHJlcXVpcmUoJy4vbGliL2Jhc2U2NF91cmxfZGVjb2RlJyk7XG52YXIgcXMgICAgICAgICAgICAgICAgPSByZXF1aXJlKCdxcycpO1xudmFyIHJlcXdlc3QgICAgICAgICAgID0gcmVxdWlyZSgncmVxd2VzdCcpO1xuXG52YXIganNvbnAgICAgICAgICAgICAgPSByZXF1aXJlKCdqc29ucCcpO1xuXG52YXIgdXNlX2pzb25wICAgICAgICAgPSByZXF1aXJlKCcuL2xpYi91c2VfanNvbnAnKTtcbnZhciBMb2dpbkVycm9yICAgICAgICA9IHJlcXVpcmUoJy4vbGliL0xvZ2luRXJyb3InKTtcbnZhciBqc29uX3BhcnNlICAgICAgICA9IHJlcXVpcmUoJy4vbGliL2pzb25fcGFyc2UnKTtcblxuZnVuY3Rpb24gQXV0aDAgKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEF1dGgwKSkge1xuICAgIHJldHVybiBuZXcgQXV0aDAob3B0aW9ucyk7XG4gIH1cblxuICBhc3NlcnRfcmVxdWlyZWQob3B0aW9ucywgJ2NsaWVudElEJyk7XG4gIGFzc2VydF9yZXF1aXJlZChvcHRpb25zLCAnY2FsbGJhY2tVUkwnKTtcbiAgYXNzZXJ0X3JlcXVpcmVkKG9wdGlvbnMsICdkb21haW4nKTtcblxuICB0aGlzLl9jbGllbnRJRCA9IG9wdGlvbnMuY2xpZW50SUQ7XG4gIHRoaXMuX2NhbGxiYWNrVVJMID0gb3B0aW9ucy5jYWxsYmFja1VSTDtcbiAgdGhpcy5fZG9tYWluID0gb3B0aW9ucy5kb21haW47XG4gIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICB0aGlzLnBhcnNlSGFzaChvcHRpb25zLnN1Y2Nlc3MpO1xuICB9XG4gIHRoaXMuX2ZhaWx1cmUgPSBvcHRpb25zLmZhaWx1cmU7XG59XG5cbkF1dGgwLnByb3RvdHlwZS5fcmVkaXJlY3QgPSBmdW5jdGlvbiAodXJsKSB7XG4gIGdsb2JhbC53aW5kb3cubG9jYXRpb24gPSB1cmw7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuX3JlbmRlckFuZFN1Ym1pdFdTRmVkRm9ybSA9IGZ1bmN0aW9uIChmb3JtSHRtbCkge1xuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBmb3JtSHRtbDtcbiAgdmFyIGZvcm0gPSBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdikuY2hpbGRyZW5bMF07XG4gIGZvcm0uc3VibWl0KCk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuX2lzQWRMZGFwQ29ubmVjdGlvbiA9IGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4gIHJldHVybiBjb25uZWN0aW9uID09PSAnYWRsZGFwJztcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5wYXJzZUhhc2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYoIXdpbmRvdy5sb2NhdGlvbi5oYXNoLm1hdGNoKC9hY2Nlc3NfdG9rZW4vKSkgcmV0dXJuO1xuICB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcbiAgdmFyIHBhcnNlZF9xcyA9IHFzLnBhcnNlKGhhc2gpO1xuICB2YXIgaWRfdG9rZW4gPSBwYXJzZWRfcXMuaWRfdG9rZW47XG4gIHZhciBlbmNvZGVkID0gaWRfdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgdmFyIHByb2YgPSBqc29uX3BhcnNlKGJhc2U2NF91cmxfZGVjb2RlKGVuY29kZWQpKTtcbiAgY2FsbGJhY2socHJvZiwgaWRfdG9rZW4sIHBhcnNlZF9xcy5hY2Nlc3NfdG9rZW4sIHBhcnNlZF9xcy5zdGF0ZSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuc2lnbnVwID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgcXVlcnkgPSB7XG4gICAgcmVzcG9uc2VfdHlwZTogJ3Rva2VuJyxcbiAgICBjbGllbnRfaWQ6ICAgICB0aGlzLl9jbGllbnRJRCxcbiAgICBjb25uZWN0aW9uOiAgICBvcHRpb25zLmNvbm5lY3Rpb24sXG4gICAgcmVkaXJlY3RfdXJpOiAgdGhpcy5fY2FsbGJhY2tVUkwsXG4gICAgc2NvcGU6ICAgICAgICAgJ29wZW5pZCBwcm9maWxlJ1xuICB9O1xuXG4gIGlmIChvcHRpb25zLnN0YXRlKSB7XG4gICAgcXVlcnkuc3RhdGUgPSBvcHRpb25zLnN0YXRlO1xuICB9XG5cbiAgcXVlcnkuZW1haWwgPSBvcHRpb25zLnVzZXJuYW1lIHx8IG9wdGlvbnMuZW1haWw7XG4gIHF1ZXJ5LnBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZDtcblxuICBxdWVyeS50ZW5hbnQgPSB0aGlzLl9kb21haW4uc3BsaXQoJy4nKVswXTtcblxuICBmdW5jdGlvbiBzdWNjZXNzICgpIHtcbiAgICBpZiAoJ2F1dG9fbG9naW4nIGluIG9wdGlvbnMgJiYgIW9wdGlvbnMuYXV0b19sb2dpbikge1xuICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLmxvZ2luKG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZhaWwgKHN0YXR1cywgcmVzcCkge1xuICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKHN0YXR1cywgcmVzcCk7XG4gICAgaWYgKGNhbGxiYWNrKSAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcik7XG4gICAgaWYgKHNlbGYuX2ZhaWx1cmUpIHJldHVybiBzZWxmLl9mYWlsdXJlKGVycm9yKTtcbiAgfVxuXG4gIGlmICh1c2VfanNvbnAoKSkge1xuICAgIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL3NpZ251cD8nICsgcXMuc3RyaW5naWZ5KHF1ZXJ5KSwge1xuICAgICAgcGFyYW06ICdjYngnLFxuICAgICAgdGltZW91dDogMTUwMDBcbiAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBmYWlsKDAsIGVycik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcC5zdGF0dXMgPT0gMjAwID9cbiAgICAgICAgICAgICAgc3VjY2VzcygpIDpcbiAgICAgICAgICAgICAgZmFpbChyZXNwLnN0YXR1cywgcmVzcC5lcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVxd2VzdCh7XG4gICAgdXJsOiAgICAgJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvZGJjb25uZWN0aW9ucy9zaWdudXAnLFxuICAgIG1ldGhvZDogICdwb3N0JyxcbiAgICB0eXBlOiAgICAnaHRtbCcsXG4gICAgZGF0YTogICAgcXVlcnksXG4gICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICBjcm9zc09yaWdpbjogdHJ1ZVxuICB9KS5mYWlsKGZ1bmN0aW9uIChlcnIpIHtcbiAgICBmYWlsKGVyci5zdGF0dXMsIGVyci5yZXNwb25zZVRleHQpO1xuICB9KTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5jaGFuZ2VQYXNzd29yZCA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBxdWVyeSA9IHtcbiAgICB0ZW5hbnQ6ICAgICAgICAgdGhpcy5fZG9tYWluLnNwbGl0KCcuJylbMF0sXG4gICAgY29ubmVjdGlvbjogICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICBlbWFpbDogICAgICAgICAgb3B0aW9ucy51c2VybmFtZSB8fCBvcHRpb25zLmVtYWlsLFxuICAgIHBhc3N3b3JkOiAgICAgICBvcHRpb25zLnBhc3N3b3JkXG4gIH07XG5cbiAgZnVuY3Rpb24gc3VjY2VzcyAoKSB7XG4gICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmFpbCAoc3RhdHVzLCByZXNwKSB7XG4gICAgdmFyIGVycm9yID0gbmV3IExvZ2luRXJyb3Ioc3RhdHVzLCByZXNwKTtcbiAgICBpZiAoY2FsbGJhY2spICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICBpZiAoc2VsZi5fZmFpbHVyZSkgcmV0dXJuIHNlbGYuX2ZhaWx1cmUoZXJyb3IpO1xuICB9XG5cbiAgaWYgKHVzZV9qc29ucCgpKSB7XG4gICAgcmV0dXJuIGpzb25wKCdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL2RiY29ubmVjdGlvbnMvY2hhbmdlX3Bhc3N3b3JkPycgKyBxcy5zdHJpbmdpZnkocXVlcnkpLCB7XG4gICAgICBwYXJhbTogJ2NieCcsXG4gICAgICB0aW1lb3V0OiAxNTAwMFxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGZhaWwoMCwgZXJyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwLnN0YXR1cyA9PSAyMDAgP1xuICAgICAgICAgICAgICBzdWNjZXNzKCkgOlxuICAgICAgICAgICAgICBmYWlsKHJlc3Auc3RhdHVzLCByZXNwLmVycik7XG4gICAgfSk7XG4gIH1cblxuICByZXF3ZXN0KHtcbiAgICB1cmw6ICAgICAnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL2NoYW5nZV9wYXNzd29yZCcsXG4gICAgbWV0aG9kOiAgJ3Bvc3QnLFxuICAgIHR5cGU6ICAgICdodG1sJyxcbiAgICBkYXRhOiAgICBxdWVyeSxcbiAgICBzdWNjZXNzOiBzdWNjZXNzLFxuICAgIGNyb3NzT3JpZ2luOiB0cnVlXG4gIH0pLmZhaWwoZnVuY3Rpb24gKGVycikge1xuICAgIGZhaWwoZXJyLnN0YXR1cywgZXJyLnJlc3BvbnNlVGV4dCk7XG4gIH0pO1xufTtcblxuQXV0aDAucHJvdG90eXBlLmxvZ2luID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmIChvcHRpb25zLnVzZXJuYW1lIHx8IG9wdGlvbnMuZW1haWwpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbldpdGhVc2VybmFtZVBhc3N3b3JkKG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHZhciBxdWVyeSA9IHtcbiAgICByZXNwb25zZV90eXBlOiAndG9rZW4nLFxuICAgIGNsaWVudF9pZDogICAgIHRoaXMuX2NsaWVudElELFxuICAgIGNvbm5lY3Rpb246ICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICByZWRpcmVjdF91cmk6ICB0aGlzLl9jYWxsYmFja1VSTCxcbiAgICBzY29wZTogICAgICAgICAnb3BlbmlkIHByb2ZpbGUnXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuc3RhdGUpIHtcbiAgICBxdWVyeS5zdGF0ZSA9IG9wdGlvbnMuc3RhdGU7XG4gIH1cblxuICB0aGlzLl9yZWRpcmVjdCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9hdXRob3JpemU/JyArIHFzLnN0cmluZ2lmeShxdWVyeSkpO1xufTtcblxuQXV0aDAucHJvdG90eXBlLmxvZ2luV2l0aFVzZXJuYW1lUGFzc3dvcmQgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBxdWVyeSA9IHtcbiAgICByZXNwb25zZV90eXBlOiAndG9rZW4nLFxuICAgIGNsaWVudF9pZDogICAgIHRoaXMuX2NsaWVudElELFxuICAgIGNvbm5lY3Rpb246ICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICByZWRpcmVjdF91cmk6ICB0aGlzLl9jYWxsYmFja1VSTCxcbiAgICBzY29wZTogICAgICAgICAnb3BlbmlkIHByb2ZpbGUnXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuc3RhdGUpIHtcbiAgICBxdWVyeS5zdGF0ZSA9IG9wdGlvbnMuc3RhdGU7XG4gIH1cblxuICBxdWVyeS51c2VybmFtZSA9IG9wdGlvbnMudXNlcm5hbWUgfHwgb3B0aW9ucy5lbWFpbDtcbiAgcXVlcnkucGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkO1xuXG4gIHF1ZXJ5LnRlbmFudCA9IHRoaXMuX2RvbWFpbi5zcGxpdCgnLicpWzBdO1xuXG4gIGZ1bmN0aW9uIHJldHVybl9lcnJvciAoZXJyb3IpIHtcbiAgICBpZiAoY2FsbGJhY2spICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICBpZiAoc2VsZi5fZmFpbHVyZSkgcmV0dXJuIHNlbGYuX2ZhaWx1cmUoZXJyb3IpO1xuICB9XG5cbiAgdmFyIGVuZHBvaW50ID0gdGhpcy5faXNBZExkYXBDb25uZWN0aW9uKHF1ZXJ5LmNvbm5lY3Rpb24pID9cbiAgICAnL2FkbGRhcC9sb2dpbicgOiAnL2RiY29ubmVjdGlvbnMvbG9naW4nO1xuXG4gIGlmICh1c2VfanNvbnAoKSkge1xuICAgIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgZW5kcG9pbnQgKyAnPycgKyBxcy5zdHJpbmdpZnkocXVlcnkpLCB7XG4gICAgICBwYXJhbTogJ2NieCcsXG4gICAgICB0aW1lb3V0OiAxNTAwMFxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHJldHVybl9lcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgaWYoJ2Vycm9yJyBpbiByZXNwKSB7XG4gICAgICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKHJlc3Auc3RhdHVzLCByZXNwLmVycm9yKTtcbiAgICAgICAgcmV0dXJuIHJldHVybl9lcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgICBzZWxmLl9yZW5kZXJBbmRTdWJtaXRXU0ZlZEZvcm0ocmVzcC5mb3JtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcXdlc3Qoe1xuICAgIHVybDogICAgICdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyBlbmRwb2ludCxcbiAgICBtZXRob2Q6ICAncG9zdCcsXG4gICAgdHlwZTogICAgJ2h0bWwnLFxuICAgIGRhdGE6ICAgIHF1ZXJ5LFxuICAgIGNyb3NzT3JpZ2luOiB0cnVlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICBzZWxmLl9yZW5kZXJBbmRTdWJtaXRXU0ZlZEZvcm0ocmVzcCk7XG4gICAgfVxuICB9KS5mYWlsKGZ1bmN0aW9uIChlcnIpIHtcbiAgICB2YXIgZXIgPSBlcnI7XG4gICAgaWYgKCFlci5zdGF0dXMgfHwgZXIuc3RhdHVzID09PSAwKSB7IC8vaWUxMCB0cmlja1xuICAgICAgZXIgPSB7fTtcbiAgICAgIGVyLnN0YXR1cyA9IDQwMTtcbiAgICAgIGVyLnJlc3BvbnNlVGV4dCA9IHtcbiAgICAgICAgY29kZTogJ2ludmFsaWRfdXNlcl9wYXNzd29yZCdcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKGVyLnN0YXR1cywgZXIucmVzcG9uc2VUZXh0KTtcbiAgICByZXR1cm4gcmV0dXJuX2Vycm9yKGVycm9yKTtcbiAgfSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuZ2V0U1NPRGF0YSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4ganNvbnAoJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvdXNlci9zc29kYXRhJywge1xuICAgIHBhcmFtOiAnY2J4JyxcbiAgICB0aW1lb3V0OiAxNTAwMFxuICB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgY2FsbGJhY2sobnVsbCwgZXJyID/CoHt9IDogcmVzcCk7IC8vIEFsd2F5cyByZXR1cm4gT0ssIHJlZ2FyZGxlc3Mgb2YgYW55IGVycm9yc1xuICB9KTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5nZXRDb25uZWN0aW9ucyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4ganNvbnAoJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvcHVibGljL2FwaS8nICsgdGhpcy5fY2xpZW50SUQgKyAnL2Nvbm5lY3Rpb25zJywge1xuICAgIHBhcmFtOiAnY2J4JyxcbiAgICB0aW1lb3V0OiAxNTAwMFxuICB9LCBjYWxsYmFjayk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xuIiwidmFyIGpzb25fcGFyc2UgPSByZXF1aXJlKCcuL2pzb25fcGFyc2UnKTtcblxuZnVuY3Rpb24gTG9naW5FcnJvcihzdGF0dXMsIGRldGFpbHMpIHtcbiAgdmFyIG9iajtcblxuICBpZiAodHlwZW9mIGRldGFpbHMgPT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgb2JqID0ganNvbl9wYXJzZShkZXRhaWxzKTtcbiAgICB9IGNhdGNoIChlcikge1xuICAgICAgb2JqID0ge21lc3NhZ2U6IGRldGFpbHN9OyAgICAgIFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvYmogPSBkZXRhaWxzO1xuICB9XG5cbiAgdmFyIGVyciA9IEVycm9yLmNhbGwodGhpcywgb2JqLmRlc2NyaXB0aW9uIHx8IG9iai5tZXNzYWdlIHx8IG9iai5lcnJvcik7XG5cbiAgZXJyLnN0YXR1cyA9IHN0YXR1cztcbiAgZXJyLm5hbWUgPSBvYmouY29kZTtcbiAgZXJyLmNvZGUgPSBvYmouY29kZTtcbiAgZXJyLmRldGFpbHMgPSBvYmo7XG4gIFxuICBpZiAoc3RhdHVzID09PSAwKSB7XG4gICAgZXJyLmNvZGUgPSBcIlVua25vd25cIjtcbiAgICBlcnIubWVzc2FnZSA9IFwiVW5rbm93biBlcnJvci5cIjtcbiAgfVxuXG4gIHJldHVybiBlcnI7XG59XG5cbmlmIChPYmplY3QgJiYgT2JqZWN0LmNyZWF0ZSkge1xuICBMb2dpbkVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlLCB7IFxuICAgIGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBMb2dpbkVycm9yIH0gXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2luRXJyb3I7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqLCBwcm9wKSB7XG4gIGlmICghb2JqW3Byb3BdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHByb3AgKyAnIGlzIHJlcXVpcmVkLicpO1xuICB9XG59OyIsInZhciBCYXNlNjQgPSByZXF1aXJlKCdCYXNlNjQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpIHtcbiAgdmFyIG91dHB1dCA9IHN0ci5yZXBsYWNlKFwiLVwiLCBcIitcIikucmVwbGFjZShcIl9cIiwgXCIvXCIpO1xuICBzd2l0Y2ggKG91dHB1dC5sZW5ndGggJSA0KSB7XG4gICAgY2FzZSAwOlxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgb3V0cHV0ICs9IFwiPT1cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzpcbiAgICAgIG91dHB1dCArPSBcIj1cIjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBcIklsbGVnYWwgYmFzZTY0dXJsIHN0cmluZyFcIjtcbiAgfVxuICByZXR1cm4gQmFzZTY0LmF0b2Iob3V0cHV0KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiB3aW5kb3cuSlNPTiA/IHdpbmRvdy5KU09OLnBhcnNlKHN0cikgOiBldmFsKCcoJyArIHN0ciArICcpJyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgeGhyID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0ID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBudWxsO1xuICBcbiAgaWYgKHhociAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gJ1hEb21haW5SZXF1ZXN0JyBpbiB3aW5kb3cgJiYgd2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cDonO1xufTsiLCI7KGZ1bmN0aW9uICgpIHtcblxuICB2YXJcbiAgICBvYmplY3QgPSB0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiB0aGlzLCAvLyAjODogd2ViIHdvcmtlcnNcbiAgICBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPScsXG4gICAgSU5WQUxJRF9DSEFSQUNURVJfRVJSID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGZhYnJpY2F0ZSBhIHN1aXRhYmxlIGVycm9yIG9iamVjdFxuICAgICAgdHJ5IHsgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnJCcpOyB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHsgcmV0dXJuIGVycm9yOyB9fSgpKTtcblxuICAvLyBlbmNvZGVyXG4gIC8vIFtodHRwczovL2dpc3QuZ2l0aHViLmNvbS85OTkxNjZdIGJ5IFtodHRwczovL2dpdGh1Yi5jb20vbmlnbmFnXVxuICBvYmplY3QuYnRvYSB8fCAoXG4gIG9iamVjdC5idG9hID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgZm9yIChcbiAgICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG4gICAgICB2YXIgYmxvY2ssIGNoYXJDb2RlLCBpZHggPSAwLCBtYXAgPSBjaGFycywgb3V0cHV0ID0gJyc7XG4gICAgICAvLyBpZiB0aGUgbmV4dCBpbnB1dCBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG4gICAgICAvLyAgIGNoZWNrIGlmIGQgaGFzIG5vIGZyYWN0aW9uYWwgZGlnaXRzXG4gICAgICBpbnB1dC5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG4gICAgICAvLyBcIjggLSBpZHggJSAxICogOFwiIGdlbmVyYXRlcyB0aGUgc2VxdWVuY2UgMiwgNCwgNiwgOFxuICAgICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICAgKSB7XG4gICAgICBjaGFyQ29kZSA9IGlucHV0LmNoYXJDb2RlQXQoaWR4ICs9IDMvNCk7XG4gICAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB0aHJvdyBJTlZBTElEX0NIQVJBQ1RFUl9FUlI7XG4gICAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSk7XG5cbiAgLy8gZGVjb2RlclxuICAvLyBbaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTAyMDM5Nl0gYnkgW2h0dHBzOi8vZ2l0aHViLmNvbS9hdGtdXG4gIG9iamVjdC5hdG9iIHx8IChcbiAgb2JqZWN0LmF0b2IgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoLz0rJC8sICcnKVxuICAgIGlmIChpbnB1dC5sZW5ndGggJSA0ID09IDEpIHRocm93IElOVkFMSURfQ0hBUkFDVEVSX0VSUjtcbiAgICBmb3IgKFxuICAgICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJzXG4gICAgICB2YXIgYmMgPSAwLCBicywgYnVmZmVyLCBpZHggPSAwLCBvdXRwdXQgPSAnJztcbiAgICAgIC8vIGdldCBuZXh0IGNoYXJhY3RlclxuICAgICAgYnVmZmVyID0gaW5wdXQuY2hhckF0KGlkeCsrKTtcbiAgICAgIC8vIGNoYXJhY3RlciBmb3VuZCBpbiB0YWJsZT8gaW5pdGlhbGl6ZSBiaXQgc3RvcmFnZSBhbmQgYWRkIGl0cyBhc2NpaSB2YWx1ZTtcbiAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgLy8gYW5kIGlmIG5vdCBmaXJzdCBvZiBlYWNoIDQgY2hhcmFjdGVycyxcbiAgICAgICAgLy8gY29udmVydCB0aGUgZmlyc3QgOCBiaXRzIHRvIG9uZSBhc2NpaSBjaGFyYWN0ZXJcbiAgICAgICAgYmMrKyAlIDQpID8gb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMjU1ICYgYnMgPj4gKC0yICogYmMgJiA2KSkgOiAwXG4gICAgKSB7XG4gICAgICAvLyB0cnkgdG8gZmluZCBjaGFyYWN0ZXIgaW4gdGFibGUgKDAtNjMsIG5vdCBmb3VuZCA9PiAtMSlcbiAgICAgIGJ1ZmZlciA9IGNoYXJzLmluZGV4T2YoYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSk7XG5cbn0oKSk7XG4iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llc1xuICovXG5cbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2pzb25wJyk7XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBqc29ucDtcblxuLyoqXG4gKiBDYWxsYmFjayBpbmRleC5cbiAqL1xuXG52YXIgY291bnQgPSAwO1xuXG4vKipcbiAqIE5vb3AgZnVuY3Rpb24uXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogSlNPTlAgaGFuZGxlclxuICpcbiAqIE9wdGlvbnM6XG4gKiAgLSBwYXJhbSB7U3RyaW5nfSBxcyBwYXJhbWV0ZXIgKGBjYWxsYmFja2ApXG4gKiAgLSB0aW1lb3V0IHtOdW1iZXJ9IGhvdyBsb25nIGFmdGVyIGEgdGltZW91dCBlcnJvciBpcyBlbWl0dGVkIChgNjAwMDBgKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufSBvcHRpb25hbCBvcHRpb25zIC8gY2FsbGJhY2tcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbmFsIGNhbGxiYWNrXG4gKi9cblxuZnVuY3Rpb24ganNvbnAodXJsLCBvcHRzLCBmbil7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBvcHRzKSB7XG4gICAgZm4gPSBvcHRzO1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIHZhciBvcHRzID0gb3B0cyB8fCB7fTtcbiAgdmFyIHBhcmFtID0gb3B0cy5wYXJhbSB8fCAnY2FsbGJhY2snO1xuICB2YXIgdGltZW91dCA9IG51bGwgIT0gb3B0cy50aW1lb3V0ID8gb3B0cy50aW1lb3V0IDogNjAwMDA7XG4gIHZhciBlbmMgPSBlbmNvZGVVUklDb21wb25lbnQ7XG4gIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gIHZhciBzY3JpcHQ7XG4gIHZhciB0aW1lcjtcblxuICAvLyBnZW5lcmF0ZSBhIHVuaXF1ZSBpZCBmb3IgdGhpcyByZXF1ZXN0XG4gIHZhciBpZCA9IGNvdW50Kys7XG5cbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIGNsZWFudXAoKTtcbiAgICAgIGZuICYmIGZuKG5ldyBFcnJvcignVGltZW91dCcpKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFudXAoKXtcbiAgICB0YXJnZXQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgIHdpbmRvd1snX19qcCcgKyBpZF0gPSBub29wO1xuICB9XG5cbiAgd2luZG93WydfX2pwJyArIGlkXSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIGRlYnVnKCdqc29ucCBnb3QnLCBkYXRhKTtcbiAgICBpZiAodGltZXIpIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgY2xlYW51cCgpO1xuICAgIGZuICYmIGZuKG51bGwsIGRhdGEpO1xuICB9O1xuXG4gIC8vIGFkZCBxcyBjb21wb25lbnRcbiAgdXJsICs9ICh+dXJsLmluZGV4T2YoJz8nKSA/ICcmJyA6ICc/JykgKyBwYXJhbSArICc9JyArIGVuYygnX19qcCcgKyBpZCArICcnKTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoJz8mJywgJz8nKTtcblxuICBkZWJ1ZygnanNvbnAgcmVxIFwiJXNcIicsIHVybCk7XG5cbiAgLy8gY3JlYXRlIHNjcmlwdFxuICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LnNyYyA9IHVybDtcbiAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgdGFyZ2V0KTtcbn07XG4iLCJcbi8qKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZGVidWc7XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtUeXBlfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZWJ1ZyhuYW1lKSB7XG4gIGlmICghZGVidWcuZW5hYmxlZChuYW1lKSkgcmV0dXJuIGZ1bmN0aW9uKCl7fTtcblxuICByZXR1cm4gZnVuY3Rpb24oZm10KXtcbiAgICB2YXIgY3VyciA9IG5ldyBEYXRlO1xuICAgIHZhciBtcyA9IGN1cnIgLSAoZGVidWdbbmFtZV0gfHwgY3Vycik7XG4gICAgZGVidWdbbmFtZV0gPSBjdXJyO1xuXG4gICAgZm10ID0gbmFtZVxuICAgICAgKyAnICdcbiAgICAgICsgZm10XG4gICAgICArICcgKycgKyBkZWJ1Zy5odW1hbml6ZShtcyk7XG5cbiAgICAvLyBUaGlzIGhhY2tlcnkgaXMgcmVxdWlyZWQgZm9yIElFOFxuICAgIC8vIHdoZXJlIGBjb25zb2xlLmxvZ2AgZG9lc24ndCBoYXZlICdhcHBseSdcbiAgICB3aW5kb3cuY29uc29sZVxuICAgICAgJiYgY29uc29sZS5sb2dcbiAgICAgICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHMpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcy5cbiAqL1xuXG5kZWJ1Zy5uYW1lcyA9IFtdO1xuZGVidWcuc2tpcHMgPSBbXTtcblxuLyoqXG4gKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gKiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmRlYnVnLmVuYWJsZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdHJ5IHtcbiAgICBsb2NhbFN0b3JhZ2UuZGVidWcgPSBuYW1lO1xuICB9IGNhdGNoKGUpe31cblxuICB2YXIgc3BsaXQgPSAobmFtZSB8fCAnJykuc3BsaXQoL1tcXHMsXSsvKVxuICAgICwgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBuYW1lID0gc3BsaXRbaV0ucmVwbGFjZSgnKicsICcuKj8nKTtcbiAgICBpZiAobmFtZVswXSA9PT0gJy0nKSB7XG4gICAgICBkZWJ1Zy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZS5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBkZWJ1Zy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZSArICckJykpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBEaXNhYmxlIGRlYnVnIG91dHB1dC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmRlYnVnLmRpc2FibGUgPSBmdW5jdGlvbigpe1xuICBkZWJ1Zy5lbmFibGUoJycpO1xufTtcblxuLyoqXG4gKiBIdW1hbml6ZSB0aGUgZ2l2ZW4gYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbVxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZGVidWcuaHVtYW5pemUgPSBmdW5jdGlvbihtcykge1xuICB2YXIgc2VjID0gMTAwMFxuICAgICwgbWluID0gNjAgKiAxMDAwXG4gICAgLCBob3VyID0gNjAgKiBtaW47XG5cbiAgaWYgKG1zID49IGhvdXIpIHJldHVybiAobXMgLyBob3VyKS50b0ZpeGVkKDEpICsgJ2gnO1xuICBpZiAobXMgPj0gbWluKSByZXR1cm4gKG1zIC8gbWluKS50b0ZpeGVkKDEpICsgJ20nO1xuICBpZiAobXMgPj0gc2VjKSByZXR1cm4gKG1zIC8gc2VjIHwgMCkgKyAncyc7XG4gIHJldHVybiBtcyArICdtcyc7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZGVidWcuZW5hYmxlZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRlYnVnLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGRlYnVnLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRlYnVnLm5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGRlYnVnLm5hbWVzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBwZXJzaXN0XG5cbmlmICh3aW5kb3cubG9jYWxTdG9yYWdlKSBkZWJ1Zy5lbmFibGUobG9jYWxTdG9yYWdlLmRlYnVnKTtcbiIsIi8qKlxuICogT2JqZWN0I3RvU3RyaW5nKCkgcmVmIGZvciBzdHJpbmdpZnkoKS5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIE9iamVjdCNoYXNPd25Qcm9wZXJ0eSByZWZcbiAqL1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIHNlZSBpc3N1ZSAjNzBcbiAqL1xudmFyIGlzUmVzdG9yYWJsZVByb3RvID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIG87XG5cbiAgaWYgKCFPYmplY3QuY3JlYXRlKSByZXR1cm4gZmFsc2U7XG5cbiAgbyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIG8uX19wcm90b19fID0gT2JqZWN0LnByb3RvdHlwZTtcblxuICByZXR1cm4gby5oYXNPd25Qcm9wZXJ0eSA9PT0gaGFzT3duUHJvcGVydHk7XG59KSgpO1xuXG4vKipcbiAqIEFycmF5I2luZGV4T2Ygc2hpbS5cbiAqL1xuXG52YXIgaW5kZXhPZiA9IHR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJ1xuICA/IGZ1bmN0aW9uKGFyciwgZWwpIHsgcmV0dXJuIGFyci5pbmRleE9mKGVsKTsgfVxuICA6IGZ1bmN0aW9uKGFyciwgZWwpIHtcbiAgICAgIGlmICh0eXBlb2YgYXJyID09ICdzdHJpbmcnICYmIHR5cGVvZiBcImFcIlswXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBhcnIgPSBhcnIuc3BsaXQoJycpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFycltpXSA9PT0gZWwpIHJldHVybiBpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbi8qKlxuICogQXJyYXkuaXNBcnJheSBzaGltLlxuICovXG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuLyoqXG4gKiBPYmplY3Qua2V5cyBzaGltLlxuICovXG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gIHZhciByZXQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbi8qKlxuICogQXJyYXkjZm9yRWFjaCBzaGltLlxuICovXG5cbnZhciBmb3JFYWNoID0gdHlwZW9mIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID09PSAnZnVuY3Rpb24nXG4gID8gZnVuY3Rpb24oYXJyLCBmbikgeyByZXR1cm4gYXJyLmZvckVhY2goZm4pOyB9XG4gIDogZnVuY3Rpb24oYXJyLCBmbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGZuKGFycltpXSk7XG4gICAgfTtcblxuLyoqXG4gKiBBcnJheSNyZWR1Y2Ugc2hpbS5cbiAqL1xuXG52YXIgcmVkdWNlID0gZnVuY3Rpb24oYXJyLCBmbiwgaW5pdGlhbCkge1xuICBpZiAodHlwZW9mIGFyci5yZWR1Y2UgPT09ICdmdW5jdGlvbicpIHJldHVybiBhcnIucmVkdWNlKGZuLCBpbml0aWFsKTtcbiAgdmFyIHJlcyA9IGluaXRpYWw7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSByZXMgPSBmbihyZXMsIGFycltpXSk7XG4gIHJldHVybiByZXM7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIG51bGxhcnkgb2JqZWN0IGlmIHBvc3NpYmxlXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0KCkge1xuICByZXR1cm4gaXNSZXN0b3JhYmxlUHJvdG9cbiAgICA/IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICA6IHt9O1xufVxuXG4vKipcbiAqIENhY2hlIG5vbi1pbnRlZ2VyIHRlc3QgcmVnZXhwLlxuICovXG5cbnZhciBpc2ludCA9IC9eWzAtOV0rJC87XG5cbmZ1bmN0aW9uIHByb21vdGUocGFyZW50LCBrZXkpIHtcbiAgaWYgKHBhcmVudFtrZXldLmxlbmd0aCA9PSAwKSByZXR1cm4gcGFyZW50W2tleV0gPSBjcmVhdGVPYmplY3QoKTtcbiAgdmFyIHQgPSBjcmVhdGVPYmplY3QoKTtcbiAgZm9yICh2YXIgaSBpbiBwYXJlbnRba2V5XSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudFtrZXldLCBpKSkge1xuICAgICAgdFtpXSA9IHBhcmVudFtrZXldW2ldO1xuICAgIH1cbiAgfVxuICBwYXJlbnRba2V5XSA9IHQ7XG4gIHJldHVybiB0O1xufVxuXG5mdW5jdGlvbiBwYXJzZShwYXJ0cywgcGFyZW50LCBrZXksIHZhbCkge1xuICB2YXIgcGFydCA9IHBhcnRzLnNoaWZ0KCk7XG4gIC8vIGVuZFxuICBpZiAoIXBhcnQpIHtcbiAgICBpZiAoaXNBcnJheShwYXJlbnRba2V5XSkpIHtcbiAgICAgIHBhcmVudFtrZXldLnB1c2godmFsKTtcbiAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBwYXJlbnRba2V5XSkge1xuICAgICAgcGFyZW50W2tleV0gPSB2YWw7XG4gICAgfSBlbHNlIGlmICgndW5kZWZpbmVkJyA9PSB0eXBlb2YgcGFyZW50W2tleV0pIHtcbiAgICAgIHBhcmVudFtrZXldID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRba2V5XSA9IFtwYXJlbnRba2V5XSwgdmFsXTtcbiAgICB9XG4gICAgLy8gYXJyYXlcbiAgfSBlbHNlIHtcbiAgICB2YXIgb2JqID0gcGFyZW50W2tleV0gPSBwYXJlbnRba2V5XSB8fCBbXTtcbiAgICBpZiAoJ10nID09IHBhcnQpIHtcbiAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgaWYgKCcnICE9IHZhbCkgb2JqLnB1c2godmFsKTtcbiAgICAgIH0gZWxzZSBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIG9iaikge1xuICAgICAgICBvYmpbb2JqZWN0S2V5cyhvYmopLmxlbmd0aF0gPSB2YWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmogPSBwYXJlbnRba2V5XSA9IFtwYXJlbnRba2V5XSwgdmFsXTtcbiAgICAgIH1cbiAgICAgIC8vIHByb3BcbiAgICB9IGVsc2UgaWYgKH5pbmRleE9mKHBhcnQsICddJykpIHtcbiAgICAgIHBhcnQgPSBwYXJ0LnN1YnN0cigwLCBwYXJ0Lmxlbmd0aCAtIDEpO1xuICAgICAgaWYgKCFpc2ludC50ZXN0KHBhcnQpICYmIGlzQXJyYXkob2JqKSkgb2JqID0gcHJvbW90ZShwYXJlbnQsIGtleSk7XG4gICAgICBwYXJzZShwYXJ0cywgb2JqLCBwYXJ0LCB2YWwpO1xuICAgICAgLy8ga2V5XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghaXNpbnQudGVzdChwYXJ0KSAmJiBpc0FycmF5KG9iaikpIG9iaiA9IHByb21vdGUocGFyZW50LCBrZXkpO1xuICAgICAgcGFyc2UocGFydHMsIG9iaiwgcGFydCwgdmFsKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZSBwYXJlbnQga2V5L3ZhbCBwYWlyLlxuICovXG5cbmZ1bmN0aW9uIG1lcmdlKHBhcmVudCwga2V5LCB2YWwpe1xuICBpZiAofmluZGV4T2Yoa2V5LCAnXScpKSB7XG4gICAgdmFyIHBhcnRzID0ga2V5LnNwbGl0KCdbJylcbiAgICAgICwgbGVuID0gcGFydHMubGVuZ3RoXG4gICAgICAsIGxhc3QgPSBsZW4gLSAxO1xuICAgIHBhcnNlKHBhcnRzLCBwYXJlbnQsICdiYXNlJywgdmFsKTtcbiAgICAvLyBvcHRpbWl6ZVxuICB9IGVsc2Uge1xuICAgIGlmICghaXNpbnQudGVzdChrZXkpICYmIGlzQXJyYXkocGFyZW50LmJhc2UpKSB7XG4gICAgICB2YXIgdCA9IGNyZWF0ZU9iamVjdCgpO1xuICAgICAgZm9yICh2YXIgayBpbiBwYXJlbnQuYmFzZSkgdFtrXSA9IHBhcmVudC5iYXNlW2tdO1xuICAgICAgcGFyZW50LmJhc2UgPSB0O1xuICAgIH1cbiAgICBzZXQocGFyZW50LmJhc2UsIGtleSwgdmFsKTtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnQ7XG59XG5cbi8qKlxuICogQ29tcGFjdCBzcGFyc2UgYXJyYXlzLlxuICovXG5cbmZ1bmN0aW9uIGNvbXBhY3Qob2JqKSB7XG4gIGlmICgnb2JqZWN0JyAhPSB0eXBlb2Ygb2JqKSByZXR1cm4gb2JqO1xuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICB2YXIgcmV0ID0gW107XG5cbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkge1xuICAgICAgICByZXQucHVzaChvYmpbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgb2JqW2tleV0gPSBjb21wYWN0KG9ialtrZXldKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogUmVzdG9yZSBPYmplY3QucHJvdG90eXBlLlxuICogc2VlIHB1bGwtcmVxdWVzdCAjNThcbiAqL1xuXG5mdW5jdGlvbiByZXN0b3JlUHJvdG8ob2JqKSB7XG4gIGlmICghaXNSZXN0b3JhYmxlUHJvdG8pIHJldHVybiBvYmo7XG4gIGlmIChpc0FycmF5KG9iaikpIHJldHVybiBvYmo7XG4gIGlmIChvYmogJiYgJ29iamVjdCcgIT0gdHlwZW9mIG9iaikgcmV0dXJuIG9iajtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICBvYmpba2V5XSA9IHJlc3RvcmVQcm90byhvYmpba2V5XSk7XG4gICAgfVxuICB9XG5cbiAgb2JqLl9fcHJvdG9fXyA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIG9iai5cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZU9iamVjdChvYmope1xuICB2YXIgcmV0ID0geyBiYXNlOiB7fSB9O1xuXG4gIGZvckVhY2gob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihuYW1lKXtcbiAgICBtZXJnZShyZXQsIG5hbWUsIG9ialtuYW1lXSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb21wYWN0KHJldC5iYXNlKTtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gc3RyLlxuICovXG5cbmZ1bmN0aW9uIHBhcnNlU3RyaW5nKHN0cil7XG4gIHZhciByZXQgPSByZWR1Y2UoU3RyaW5nKHN0cikuc3BsaXQoJyYnKSwgZnVuY3Rpb24ocmV0LCBwYWlyKXtcbiAgICB2YXIgZXFsID0gaW5kZXhPZihwYWlyLCAnPScpXG4gICAgICAsIGJyYWNlID0gbGFzdEJyYWNlSW5LZXkocGFpcilcbiAgICAgICwga2V5ID0gcGFpci5zdWJzdHIoMCwgYnJhY2UgfHwgZXFsKVxuICAgICAgLCB2YWwgPSBwYWlyLnN1YnN0cihicmFjZSB8fCBlcWwsIHBhaXIubGVuZ3RoKVxuICAgICAgLCB2YWwgPSB2YWwuc3Vic3RyKGluZGV4T2YodmFsLCAnPScpICsgMSwgdmFsLmxlbmd0aCk7XG5cbiAgICAvLyA/Zm9vXG4gICAgaWYgKCcnID09IGtleSkga2V5ID0gcGFpciwgdmFsID0gJyc7XG4gICAgaWYgKCcnID09IGtleSkgcmV0dXJuIHJldDtcblxuICAgIHJldHVybiBtZXJnZShyZXQsIGRlY29kZShrZXkpLCBkZWNvZGUodmFsKSk7XG4gIH0sIHsgYmFzZTogY3JlYXRlT2JqZWN0KCkgfSkuYmFzZTtcblxuICByZXR1cm4gcmVzdG9yZVByb3RvKGNvbXBhY3QocmV0KSk7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIHF1ZXJ5IGBzdHJgIG9yIGBvYmpgLCByZXR1cm5pbmcgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgfCB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uKHN0cil7XG4gIGlmIChudWxsID09IHN0ciB8fCAnJyA9PSBzdHIpIHJldHVybiB7fTtcbiAgcmV0dXJuICdvYmplY3QnID09IHR5cGVvZiBzdHJcbiAgICA/IHBhcnNlT2JqZWN0KHN0cilcbiAgICA6IHBhcnNlU3RyaW5nKHN0cik7XG59O1xuXG4vKipcbiAqIFR1cm4gdGhlIGdpdmVuIGBvYmpgIGludG8gYSBxdWVyeSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnZhciBzdHJpbmdpZnkgPSBleHBvcnRzLnN0cmluZ2lmeSA9IGZ1bmN0aW9uKG9iaiwgcHJlZml4KSB7XG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICByZXR1cm4gc3RyaW5naWZ5QXJyYXkob2JqLCBwcmVmaXgpO1xuICB9IGVsc2UgaWYgKCdbb2JqZWN0IE9iamVjdF0nID09IHRvU3RyaW5nLmNhbGwob2JqKSkge1xuICAgIHJldHVybiBzdHJpbmdpZnlPYmplY3Qob2JqLCBwcmVmaXgpO1xuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBvYmopIHtcbiAgICByZXR1cm4gc3RyaW5naWZ5U3RyaW5nKG9iaiwgcHJlZml4KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhvYmopKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTdHJpbmdpZnkgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVN0cmluZyhzdHIsIHByZWZpeCkge1xuICBpZiAoIXByZWZpeCkgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5naWZ5IGV4cGVjdHMgYW4gb2JqZWN0Jyk7XG4gIHJldHVybiBwcmVmaXggKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyKTtcbn1cblxuLyoqXG4gKiBTdHJpbmdpZnkgdGhlIGdpdmVuIGBhcnJgLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc3RyaW5naWZ5QXJyYXkoYXJyLCBwcmVmaXgpIHtcbiAgdmFyIHJldCA9IFtdO1xuICBpZiAoIXByZWZpeCkgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5naWZ5IGV4cGVjdHMgYW4gb2JqZWN0Jyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgcmV0LnB1c2goc3RyaW5naWZ5KGFycltpXSwgcHJlZml4ICsgJ1snICsgaSArICddJykpO1xuICB9XG4gIHJldHVybiByZXQuam9pbignJicpO1xufVxuXG4vKipcbiAqIFN0cmluZ2lmeSB0aGUgZ2l2ZW4gYG9iamAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc3RyaW5naWZ5T2JqZWN0KG9iaiwgcHJlZml4KSB7XG4gIHZhciByZXQgPSBbXVxuICAgICwga2V5cyA9IG9iamVjdEtleXMob2JqKVxuICAgICwga2V5O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoJycgPT0ga2V5KSBjb250aW51ZTtcbiAgICBpZiAobnVsbCA9PSBvYmpba2V5XSkge1xuICAgICAgcmV0LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXQucHVzaChzdHJpbmdpZnkob2JqW2tleV0sIHByZWZpeFxuICAgICAgICA/IHByZWZpeCArICdbJyArIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJ10nXG4gICAgICAgIDogZW5jb2RlVVJJQ29tcG9uZW50KGtleSkpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0LmpvaW4oJyYnKTtcbn1cblxuLyoqXG4gKiBTZXQgYG9iamAncyBga2V5YCB0byBgdmFsYCByZXNwZWN0aW5nXG4gKiB0aGUgd2VpcmQgYW5kIHdvbmRlcmZ1bCBzeW50YXggb2YgYSBxcyxcbiAqIHdoZXJlIFwiZm9vPWJhciZmb289YmF6XCIgYmVjb21lcyBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZXQob2JqLCBrZXksIHZhbCkge1xuICB2YXIgdiA9IG9ialtrZXldO1xuICBpZiAodW5kZWZpbmVkID09PSB2KSB7XG4gICAgb2JqW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh2KSkge1xuICAgIHYucHVzaCh2YWwpO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gW3YsIHZhbF07XG4gIH1cbn1cblxuLyoqXG4gKiBMb2NhdGUgbGFzdCBicmFjZSBpbiBgc3RyYCB3aXRoaW4gdGhlIGtleS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsYXN0QnJhY2VJbktleShzdHIpIHtcbiAgdmFyIGxlbiA9IHN0ci5sZW5ndGhcbiAgICAsIGJyYWNlXG4gICAgLCBjO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYyA9IHN0cltpXTtcbiAgICBpZiAoJ10nID09IGMpIGJyYWNlID0gZmFsc2U7XG4gICAgaWYgKCdbJyA9PSBjKSBicmFjZSA9IHRydWU7XG4gICAgaWYgKCc9JyA9PSBjICYmICFicmFjZSkgcmV0dXJuIGk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWNvZGUgYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZGVjb2RlKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuIiwiLyohIHZlcnNpb246IDAuOS4xICovXG4vKiFcbiAgKiBSZXF3ZXN0ISBBIGdlbmVyYWwgcHVycG9zZSBYSFIgY29ubmVjdGlvbiBtYW5hZ2VyXG4gICogKGMpIER1c3RpbiBEaWF6IDIwMTNcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL3JlcXdlc3RcbiAgKiBsaWNlbnNlIE1JVFxuICAqL1xuIWZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSgncmVxd2VzdCcsIHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICB2YXIgd2luID0gd2luZG93XG4gICAgLCBkb2MgPSBkb2N1bWVudFxuICAgICwgdHdvSHVuZG8gPSAvXjIwXFxkJC9cbiAgICAsIGJ5VGFnID0gJ2dldEVsZW1lbnRzQnlUYWdOYW1lJ1xuICAgICwgcmVhZHlTdGF0ZSA9ICdyZWFkeVN0YXRlJ1xuICAgICwgY29udGVudFR5cGUgPSAnQ29udGVudC1UeXBlJ1xuICAgICwgcmVxdWVzdGVkV2l0aCA9ICdYLVJlcXVlc3RlZC1XaXRoJ1xuICAgICwgaGVhZCA9IGRvY1tieVRhZ10oJ2hlYWQnKVswXVxuICAgICwgdW5pcWlkID0gMFxuICAgICwgY2FsbGJhY2tQcmVmaXggPSAncmVxd2VzdF8nICsgKCtuZXcgRGF0ZSgpKVxuICAgICwgbGFzdFZhbHVlIC8vIGRhdGEgc3RvcmVkIGJ5IHRoZSBtb3N0IHJlY2VudCBKU09OUCBjYWxsYmFja1xuICAgICwgeG1sSHR0cFJlcXVlc3QgPSAnWE1MSHR0cFJlcXVlc3QnXG4gICAgLCB4RG9tYWluUmVxdWVzdCA9ICdYRG9tYWluUmVxdWVzdCdcbiAgICAsIG5vb3AgPSBmdW5jdGlvbiAoKSB7fVxuXG4gICAgLCBpc0FycmF5ID0gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IEFycmF5LmlzQXJyYXlcbiAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGEgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgIH1cblxuICAgICwgZGVmYXVsdEhlYWRlcnMgPSB7XG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICwgcmVxdWVzdGVkV2l0aDogeG1sSHR0cFJlcXVlc3RcbiAgICAgICAgLCBhY2NlcHQ6IHtcbiAgICAgICAgICAgICAgJyonOiAgJ3RleHQvamF2YXNjcmlwdCwgdGV4dC9odG1sLCBhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sLCAqLyonXG4gICAgICAgICAgICAsIHhtbDogICdhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sJ1xuICAgICAgICAgICAgLCBodG1sOiAndGV4dC9odG1sJ1xuICAgICAgICAgICAgLCB0ZXh0OiAndGV4dC9wbGFpbidcbiAgICAgICAgICAgICwganNvbjogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICAgICwganM6ICAgJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQsIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAsIHhociA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgLy8gaXMgaXQgeC1kb21haW5cbiAgICAgICAgaWYgKG8uY3Jvc3NPcmlnaW4gPT09IHRydWUpIHtcbiAgICAgICAgICB2YXIgeGhyID0gd2luW3htbEh0dHBSZXF1ZXN0XSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbnVsbFxuICAgICAgICAgIGlmICh4aHIgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgICAgICAgICByZXR1cm4geGhyXG4gICAgICAgICAgfSBlbHNlIGlmICh3aW5beERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0KClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCcm93c2VyIGRvZXMgbm90IHN1cHBvcnQgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzJylcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAod2luW3htbEh0dHBSZXF1ZXN0XSkge1xuICAgICAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgLCBnbG9iYWxTZXR1cE9wdGlvbnMgPSB7XG4gICAgICAgIGRhdGFGaWx0ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgfVxuICAgICAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlYWR5U3RhdGUociwgc3VjY2VzcywgZXJyb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdXNlIF9hYm9ydGVkIHRvIG1pdGlnYXRlIGFnYWluc3QgSUUgZXJyIGMwMGMwMjNmXG4gICAgICAvLyAoY2FuJ3QgcmVhZCBwcm9wcyBvbiBhYm9ydGVkIHJlcXVlc3Qgb2JqZWN0cylcbiAgICAgIGlmIChyLl9hYm9ydGVkKSByZXR1cm4gZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgaWYgKHIucmVxdWVzdCAmJiByLnJlcXVlc3RbcmVhZHlTdGF0ZV0gPT0gNCkge1xuICAgICAgICByLnJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gbm9vcFxuICAgICAgICBpZiAodHdvSHVuZG8udGVzdChyLnJlcXVlc3Quc3RhdHVzKSlcbiAgICAgICAgICBzdWNjZXNzKHIucmVxdWVzdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVycm9yKHIucmVxdWVzdClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRIZWFkZXJzKGh0dHAsIG8pIHtcbiAgICB2YXIgaGVhZGVycyA9IG8uaGVhZGVycyB8fCB7fVxuICAgICAgLCBoXG5cbiAgICBoZWFkZXJzLkFjY2VwdCA9IGhlYWRlcnMuQWNjZXB0XG4gICAgICB8fCBkZWZhdWx0SGVhZGVycy5hY2NlcHRbby50eXBlXVxuICAgICAgfHwgZGVmYXVsdEhlYWRlcnMuYWNjZXB0WycqJ11cblxuICAgIC8vIGJyZWFrcyBjcm9zcy1vcmlnaW4gcmVxdWVzdHMgd2l0aCBsZWdhY3kgYnJvd3NlcnNcbiAgICBpZiAoIW8uY3Jvc3NPcmlnaW4gJiYgIWhlYWRlcnNbcmVxdWVzdGVkV2l0aF0pIGhlYWRlcnNbcmVxdWVzdGVkV2l0aF0gPSBkZWZhdWx0SGVhZGVycy5yZXF1ZXN0ZWRXaXRoXG4gICAgaWYgKCFoZWFkZXJzW2NvbnRlbnRUeXBlXSkgaGVhZGVyc1tjb250ZW50VHlwZV0gPSBvLmNvbnRlbnRUeXBlIHx8IGRlZmF1bHRIZWFkZXJzLmNvbnRlbnRUeXBlXG4gICAgZm9yIChoIGluIGhlYWRlcnMpXG4gICAgICBoZWFkZXJzLmhhc093blByb3BlcnR5KGgpICYmICdzZXRSZXF1ZXN0SGVhZGVyJyBpbiBodHRwICYmIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihoLCBoZWFkZXJzW2hdKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q3JlZGVudGlhbHMoaHR0cCwgbykge1xuICAgIGlmICh0eXBlb2Ygby53aXRoQ3JlZGVudGlhbHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBodHRwLndpdGhDcmVkZW50aWFscyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGh0dHAud2l0aENyZWRlbnRpYWxzID0gISFvLndpdGhDcmVkZW50aWFsc1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYWxDYWxsYmFjayhkYXRhKSB7XG4gICAgbGFzdFZhbHVlID0gZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gdXJsYXBwZW5kICh1cmwsIHMpIHtcbiAgICByZXR1cm4gdXJsICsgKC9cXD8vLnRlc3QodXJsKSA/ICcmJyA6ICc/JykgKyBzXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpIHtcbiAgICB2YXIgcmVxSWQgPSB1bmlxaWQrK1xuICAgICAgLCBjYmtleSA9IG8uanNvbnBDYWxsYmFjayB8fCAnY2FsbGJhY2snIC8vIHRoZSAnY2FsbGJhY2snIGtleVxuICAgICAgLCBjYnZhbCA9IG8uanNvbnBDYWxsYmFja05hbWUgfHwgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeChyZXFJZClcbiAgICAgIC8vICwgY2J2YWwgPSBvLmpzb25wQ2FsbGJhY2tOYW1lIHx8ICgncmVxd2VzdF8nICsgcmVxSWQpIC8vIHRoZSAnY2FsbGJhY2snIHZhbHVlXG4gICAgICAsIGNicmVnID0gbmV3IFJlZ0V4cCgnKChefFxcXFw/fCYpJyArIGNia2V5ICsgJyk9KFteJl0rKScpXG4gICAgICAsIG1hdGNoID0gdXJsLm1hdGNoKGNicmVnKVxuICAgICAgLCBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgICwgbG9hZGVkID0gMFxuICAgICAgLCBpc0lFMTAgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgMTAuMCcpICE9PSAtMVxuXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBpZiAobWF0Y2hbM10gPT09ICc/Jykge1xuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShjYnJlZywgJyQxPScgKyBjYnZhbCkgLy8gd2lsZGNhcmQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYnZhbCA9IG1hdGNoWzNdIC8vIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmMgbmFtZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBjYmtleSArICc9JyArIGNidmFsKSAvLyBubyBjYWxsYmFjayBkZXRhaWxzLCBhZGQgJ2VtXG4gICAgfVxuXG4gICAgd2luW2NidmFsXSA9IGdlbmVyYWxDYWxsYmFja1xuXG4gICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICAgIHNjcmlwdC5zcmMgPSB1cmxcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlXG4gICAgaWYgKHR5cGVvZiBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlICE9PSAndW5kZWZpbmVkJyAmJiAhaXNJRTEwKSB7XG4gICAgICAvLyBuZWVkIHRoaXMgZm9yIElFIGR1ZSB0byBvdXQtb2Ytb3JkZXIgb25yZWFkeXN0YXRlY2hhbmdlKCksIGJpbmRpbmcgc2NyaXB0XG4gICAgICAvLyBleGVjdXRpb24gdG8gYW4gZXZlbnQgbGlzdGVuZXIgZ2l2ZXMgdXMgY29udHJvbCBvdmVyIHdoZW4gdGhlIHNjcmlwdFxuICAgICAgLy8gaXMgZXhlY3V0ZWQuIFNlZSBodHRwOi8vamF1Ym91cmcubmV0LzIwMTAvMDcvbG9hZGluZy1zY3JpcHQtYXMtb25jbGljay1oYW5kbGVyLW9mLmh0bWxcbiAgICAgIC8vXG4gICAgICAvLyBpZiB0aGlzIGhhY2sgaXMgdXNlZCBpbiBJRTEwIGpzb25wIGNhbGxiYWNrIGFyZSBuZXZlciBjYWxsZWRcbiAgICAgIHNjcmlwdC5ldmVudCA9ICdvbmNsaWNrJ1xuICAgICAgc2NyaXB0Lmh0bWxGb3IgPSBzY3JpcHQuaWQgPSAnX3JlcXdlc3RfJyArIHJlcUlkXG4gICAgfVxuXG4gICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoKHNjcmlwdFtyZWFkeVN0YXRlXSAmJiBzY3JpcHRbcmVhZHlTdGF0ZV0gIT09ICdjb21wbGV0ZScgJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnbG9hZGVkJykgfHwgbG9hZGVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgICBzY3JpcHQub25jbGljayAmJiBzY3JpcHQub25jbGljaygpXG4gICAgICAvLyBDYWxsIHRoZSB1c2VyIGNhbGxiYWNrIHdpdGggdGhlIGxhc3QgdmFsdWUgc3RvcmVkIGFuZCBjbGVhbiB1cCB2YWx1ZXMgYW5kIHNjcmlwdHMuXG4gICAgICBmbihsYXN0VmFsdWUpXG4gICAgICBsYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgbG9hZGVkID0gMVxuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgc2NyaXB0IHRvIHRoZSBET00gaGVhZFxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuXG4gICAgLy8gRW5hYmxlIEpTT05QIHRpbWVvdXRcbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgICAgIGVycih7fSwgJ1JlcXVlc3QgaXMgYWJvcnRlZDogdGltZW91dCcsIHt9KVxuICAgICAgICBsYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpXG4gICAgICAgIGxvYWRlZCA9IDFcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSZXF1ZXN0KGZuLCBlcnIpIHtcbiAgICB2YXIgbyA9IHRoaXMub1xuICAgICAgLCBtZXRob2QgPSAoby5tZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKClcbiAgICAgICwgdXJsID0gdHlwZW9mIG8gPT09ICdzdHJpbmcnID8gbyA6IG8udXJsXG4gICAgICAvLyBjb252ZXJ0IG5vbi1zdHJpbmcgb2JqZWN0cyB0byBxdWVyeS1zdHJpbmcgZm9ybSB1bmxlc3Mgby5wcm9jZXNzRGF0YSBpcyBmYWxzZVxuICAgICAgLCBkYXRhID0gKG8ucHJvY2Vzc0RhdGEgIT09IGZhbHNlICYmIG8uZGF0YSAmJiB0eXBlb2Ygby5kYXRhICE9PSAnc3RyaW5nJylcbiAgICAgICAgPyByZXF3ZXN0LnRvUXVlcnlTdHJpbmcoby5kYXRhKVxuICAgICAgICA6IChvLmRhdGEgfHwgbnVsbClcbiAgICAgICwgaHR0cFxuICAgICAgLCBzZW5kV2FpdCA9IGZhbHNlXG5cbiAgICAvLyBpZiB3ZSdyZSB3b3JraW5nIG9uIGEgR0VUIHJlcXVlc3QgYW5kIHdlIGhhdmUgZGF0YSB0aGVuIHdlIHNob3VsZCBhcHBlbmRcbiAgICAvLyBxdWVyeSBzdHJpbmcgdG8gZW5kIG9mIFVSTCBhbmQgbm90IHBvc3QgZGF0YVxuICAgIGlmICgoby50eXBlID09ICdqc29ucCcgfHwgbWV0aG9kID09ICdHRVQnKSAmJiBkYXRhKSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBkYXRhKVxuICAgICAgZGF0YSA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAoby50eXBlID09ICdqc29ucCcpIHJldHVybiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpXG5cbiAgICBodHRwID0geGhyKG8pXG4gICAgaHR0cC5vcGVuKG1ldGhvZCwgdXJsLCBvLmFzeW5jID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZSlcbiAgICBzZXRIZWFkZXJzKGh0dHAsIG8pXG4gICAgc2V0Q3JlZGVudGlhbHMoaHR0cCwgbylcbiAgICBpZiAod2luW3hEb21haW5SZXF1ZXN0XSAmJiBodHRwIGluc3RhbmNlb2Ygd2luW3hEb21haW5SZXF1ZXN0XSkge1xuICAgICAgICBodHRwLm9ubG9hZCA9IGZuXG4gICAgICAgIGh0dHAub25lcnJvciA9IGVyclxuICAgICAgICAvLyBOT1RFOiBzZWVcbiAgICAgICAgLy8gaHR0cDovL3NvY2lhbC5tc2RuLm1pY3Jvc29mdC5jb20vRm9ydW1zL2VuLVVTL2lld2ViZGV2ZWxvcG1lbnQvdGhyZWFkLzMwZWYzYWRkLTc2N2MtNDQzNi1iOGE5LWYxY2ExOWI0ODEyZVxuICAgICAgICBodHRwLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHt9XG4gICAgICAgIHNlbmRXYWl0ID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZVJlYWR5U3RhdGUodGhpcywgZm4sIGVycilcbiAgICB9XG4gICAgby5iZWZvcmUgJiYgby5iZWZvcmUoaHR0cClcbiAgICBpZiAoc2VuZFdhaXQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBodHRwLnNlbmQoZGF0YSlcbiAgICAgIH0sIDIwMClcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cC5zZW5kKGRhdGEpXG4gICAgfVxuICAgIHJldHVybiBodHRwXG4gIH1cblxuICBmdW5jdGlvbiBSZXF3ZXN0KG8sIGZuKSB7XG4gICAgdGhpcy5vID0gb1xuICAgIHRoaXMuZm4gPSBmblxuXG4gICAgaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRUeXBlKHVybCkge1xuICAgIHZhciBtID0gdXJsLm1hdGNoKC9cXC4oanNvbnxqc29ucHxodG1sfHhtbCkoXFw/fCQpLylcbiAgICByZXR1cm4gbSA/IG1bMV0gOiAnanMnXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KG8sIGZuKSB7XG5cbiAgICB0aGlzLnVybCA9IHR5cGVvZiBvID09ICdzdHJpbmcnID8gbyA6IG8udXJsXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuXG4gICAgLy8gd2hldGhlciByZXF1ZXN0IGhhcyBiZWVuIGZ1bGZpbGxlZCBmb3IgcHVycG9zZVxuICAgIC8vIG9mIHRyYWNraW5nIHRoZSBQcm9taXNlc1xuICAgIHRoaXMuX2Z1bGZpbGxlZCA9IGZhbHNlXG4gICAgLy8gc3VjY2VzcyBoYW5kbGVyc1xuICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24oKXt9XG4gICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycyA9IFtdXG4gICAgLy8gZXJyb3IgaGFuZGxlcnNcbiAgICB0aGlzLl9lcnJvckhhbmRsZXJzID0gW11cbiAgICAvLyBjb21wbGV0ZSAoYm90aCBzdWNjZXNzIGFuZCBmYWlsKSBoYW5kbGVyc1xuICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMgPSBbXVxuICAgIHRoaXMuX2VycmVkID0gZmFsc2VcbiAgICB0aGlzLl9yZXNwb25zZUFyZ3MgPSB7fVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAsIHR5cGUgPSBvLnR5cGUgfHwgc2V0VHlwZSh0aGlzLnVybClcblxuICAgIGZuID0gZm4gfHwgZnVuY3Rpb24gKCkge31cblxuICAgIGlmIChvLnRpbWVvdXQpIHtcbiAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLmFib3J0KClcbiAgICAgIH0sIG8udGltZW91dClcbiAgICB9XG5cbiAgICBpZiAoby5zdWNjZXNzKSB7XG4gICAgICB0aGlzLl9zdWNjZXNzSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgby5zdWNjZXNzLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoby5lcnJvcikge1xuICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgby5lcnJvci5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChvLmNvbXBsZXRlKSB7XG4gICAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvLmNvbXBsZXRlLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGxldGUgKHJlc3ApIHtcbiAgICAgIG8udGltZW91dCAmJiBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuICAgICAgc2VsZi50aW1lb3V0ID0gbnVsbFxuICAgICAgd2hpbGUgKHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxmLl9jb21wbGV0ZUhhbmRsZXJzLnNoaWZ0KCkocmVzcClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdWNjZXNzIChyZXNwKSB7XG4gICAgICByZXNwID0gKHR5cGUgIT09ICdqc29ucCcpID8gc2VsZi5yZXF1ZXN0IDogcmVzcFxuICAgICAgLy8gdXNlIGdsb2JhbCBkYXRhIGZpbHRlciBvbiByZXNwb25zZSB0ZXh0XG4gICAgICB2YXIgZmlsdGVyZWRSZXNwb25zZSA9IGdsb2JhbFNldHVwT3B0aW9ucy5kYXRhRmlsdGVyKHJlc3AucmVzcG9uc2VUZXh0LCB0eXBlKVxuICAgICAgICAsIHIgPSBmaWx0ZXJlZFJlc3BvbnNlXG4gICAgICB0cnkge1xuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dCA9IHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY2FuJ3QgYXNzaWduIHRoaXMgaW4gSUU8PTgsIGp1c3QgaWdub3JlXG4gICAgICB9XG4gICAgICBpZiAocikge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3AgPSB3aW4uSlNPTiA/IHdpbi5KU09OLnBhcnNlKHIpIDogZXZhbCgnKCcgKyByICsgJyknKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yKHJlc3AsICdDb3VsZCBub3QgcGFyc2UgSlNPTiBpbiByZXNwb25zZScsIGVycilcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnanMnOlxuICAgICAgICAgIHJlc3AgPSBldmFsKHIpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgcmVzcCA9IHJcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd4bWwnOlxuICAgICAgICAgIHJlc3AgPSByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvciAvLyBJRSB0cm9sb2xvXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5lcnJvckNvZGVcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLnJlYXNvblxuICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICA6IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fZnVsZmlsbGVkID0gdHJ1ZVxuICAgICAgZm4ocmVzcClcbiAgICAgIHNlbGYuX3N1Y2Nlc3NIYW5kbGVyKHJlc3ApXG4gICAgICB3aGlsZSAoc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3AgPSBzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLnNoaWZ0KCkocmVzcClcbiAgICAgIH1cblxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwLCBtc2csIHQpIHtcbiAgICAgIHJlc3AgPSBzZWxmLnJlcXVlc3RcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLm1zZyA9IG1zZ1xuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnQgPSB0XG4gICAgICBzZWxmLl9lcnJlZCA9IHRydWVcbiAgICAgIHdoaWxlIChzZWxmLl9lcnJvckhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fZXJyb3JIYW5kbGVycy5zaGlmdCgpKHJlc3AsIG1zZywgdClcbiAgICAgIH1cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0ID0gZ2V0UmVxdWVzdC5jYWxsKHRoaXMsIHN1Y2Nlc3MsIGVycm9yKVxuICB9XG5cbiAgUmVxd2VzdC5wcm90b3R5cGUgPSB7XG4gICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2Fib3J0ZWQgPSB0cnVlXG4gICAgICB0aGlzLnJlcXVlc3QuYWJvcnQoKVxuICAgIH1cblxuICAsIHJldHJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0LmNhbGwodGhpcywgdGhpcy5vLCB0aGlzLmZuKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNtYWxsIGRldmlhdGlvbiBmcm9tIHRoZSBQcm9taXNlcyBBIENvbW1vbkpzIHNwZWNpZmljYXRpb25cbiAgICAgKiBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Qcm9taXNlcy9BXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBgdGhlbmAgd2lsbCBleGVjdXRlIHVwb24gc3VjY2Vzc2Z1bCByZXF1ZXN0c1xuICAgICAqL1xuICAsIHRoZW46IGZ1bmN0aW9uIChzdWNjZXNzLCBmYWlsKSB7XG4gICAgICBzdWNjZXNzID0gc3VjY2VzcyB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgZmFpbCA9IGZhaWwgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQpIHtcbiAgICAgICAgdGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AgPSBzdWNjZXNzKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmYWlsKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMucHVzaChzdWNjZXNzKVxuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZmFpbClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGFsd2F5c2Agd2lsbCBleGVjdXRlIHdoZXRoZXIgdGhlIHJlcXVlc3Qgc3VjY2VlZHMgb3IgZmFpbHNcbiAgICAgKi9cbiAgLCBhbHdheXM6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCB8fCB0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGZhaWxgIHdpbGwgZXhlY3V0ZSB3aGVuIHRoZSByZXF1ZXN0IGZhaWxzXG4gICAgICovXG4gICwgZmFpbDogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXF3ZXN0KG8sIGZuKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF3ZXN0KG8sIGZuKVxuICB9XG5cbiAgLy8gbm9ybWFsaXplIG5ld2xpbmUgdmFyaWFudHMgYWNjb3JkaW5nIHRvIHNwZWMgLT4gQ1JMRlxuICBmdW5jdGlvbiBub3JtYWxpemUocykge1xuICAgIHJldHVybiBzID8gcy5yZXBsYWNlKC9cXHI/XFxuL2csICdcXHJcXG4nKSA6ICcnXG4gIH1cblxuICBmdW5jdGlvbiBzZXJpYWwoZWwsIGNiKSB7XG4gICAgdmFyIG4gPSBlbC5uYW1lXG4gICAgICAsIHQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICwgb3B0Q2IgPSBmdW5jdGlvbiAobykge1xuICAgICAgICAgIC8vIElFIGdpdmVzIHZhbHVlPVwiXCIgZXZlbiB3aGVyZSB0aGVyZSBpcyBubyB2YWx1ZSBhdHRyaWJ1dGVcbiAgICAgICAgICAvLyAnc3BlY2lmaWVkJyByZWY6IGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUNvcmUvY29yZS5odG1sI0lELTg2MjUyOTI3M1xuICAgICAgICAgIGlmIChvICYmICFvLmRpc2FibGVkKVxuICAgICAgICAgICAgY2Iobiwgbm9ybWFsaXplKG8uYXR0cmlidXRlcy52YWx1ZSAmJiBvLmF0dHJpYnV0ZXMudmFsdWUuc3BlY2lmaWVkID8gby52YWx1ZSA6IG8udGV4dCkpXG4gICAgICAgIH1cbiAgICAgICwgY2gsIHJhLCB2YWwsIGlcblxuICAgIC8vIGRvbid0IHNlcmlhbGl6ZSBlbGVtZW50cyB0aGF0IGFyZSBkaXNhYmxlZCBvciB3aXRob3V0IGEgbmFtZVxuICAgIGlmIChlbC5kaXNhYmxlZCB8fCAhbikgcmV0dXJuXG5cbiAgICBzd2l0Y2ggKHQpIHtcbiAgICBjYXNlICdpbnB1dCc6XG4gICAgICBpZiAoIS9yZXNldHxidXR0b258aW1hZ2V8ZmlsZS9pLnRlc3QoZWwudHlwZSkpIHtcbiAgICAgICAgY2ggPSAvY2hlY2tib3gvaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHJhID0gL3JhZGlvL2kudGVzdChlbC50eXBlKVxuICAgICAgICB2YWwgPSBlbC52YWx1ZVxuICAgICAgICAvLyBXZWJLaXQgZ2l2ZXMgdXMgXCJcIiBpbnN0ZWFkIG9mIFwib25cIiBpZiBhIGNoZWNrYm94IGhhcyBubyB2YWx1ZSwgc28gY29ycmVjdCBpdCBoZXJlXG4gICAgICAgIDsoIShjaCB8fCByYSkgfHwgZWwuY2hlY2tlZCkgJiYgY2Iobiwgbm9ybWFsaXplKGNoICYmIHZhbCA9PT0gJycgPyAnb24nIDogdmFsKSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgY2Iobiwgbm9ybWFsaXplKGVsLnZhbHVlKSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGlmIChlbC50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3Qtb25lJykge1xuICAgICAgICBvcHRDYihlbC5zZWxlY3RlZEluZGV4ID49IDAgPyBlbC5vcHRpb25zW2VsLnNlbGVjdGVkSW5kZXhdIDogbnVsbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGVsLmxlbmd0aCAmJiBpIDwgZWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlbC5vcHRpb25zW2ldLnNlbGVjdGVkICYmIG9wdENiKGVsLm9wdGlvbnNbaV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgLy8gY29sbGVjdCB1cCBhbGwgZm9ybSBlbGVtZW50cyBmb3VuZCBmcm9tIHRoZSBwYXNzZWQgYXJndW1lbnQgZWxlbWVudHMgYWxsXG4gIC8vIHRoZSB3YXkgZG93biB0byBjaGlsZCBlbGVtZW50czsgcGFzcyBhICc8Zm9ybT4nIG9yIGZvcm0gZmllbGRzLlxuICAvLyBjYWxsZWQgd2l0aCAndGhpcyc9Y2FsbGJhY2sgdG8gdXNlIGZvciBzZXJpYWwoKSBvbiBlYWNoIGVsZW1lbnRcbiAgZnVuY3Rpb24gZWFjaEZvcm1FbGVtZW50KCkge1xuICAgIHZhciBjYiA9IHRoaXNcbiAgICAgICwgZSwgaVxuICAgICAgLCBzZXJpYWxpemVTdWJ0YWdzID0gZnVuY3Rpb24gKGUsIHRhZ3MpIHtcbiAgICAgICAgICB2YXIgaSwgaiwgZmFcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZmEgPSBlW2J5VGFnXSh0YWdzW2ldKVxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGZhLmxlbmd0aDsgaisrKSBzZXJpYWwoZmFbal0sIGNiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgZSA9IGFyZ3VtZW50c1tpXVxuICAgICAgaWYgKC9pbnB1dHxzZWxlY3R8dGV4dGFyZWEvaS50ZXN0KGUudGFnTmFtZSkpIHNlcmlhbChlLCBjYilcbiAgICAgIHNlcmlhbGl6ZVN1YnRhZ3MoZSwgWyAnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJyBdKVxuICAgIH1cbiAgfVxuXG4gIC8vIHN0YW5kYXJkIHF1ZXJ5IHN0cmluZyBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nKCkge1xuICAgIHJldHVybiByZXF3ZXN0LnRvUXVlcnlTdHJpbmcocmVxd2VzdC5zZXJpYWxpemVBcnJheS5hcHBseShudWxsLCBhcmd1bWVudHMpKVxuICB9XG5cbiAgLy8geyAnbmFtZSc6ICd2YWx1ZScsIC4uLiB9IHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplSGFzaCgpIHtcbiAgICB2YXIgaGFzaCA9IHt9XG4gICAgZWFjaEZvcm1FbGVtZW50LmFwcGx5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgaWYgKG5hbWUgaW4gaGFzaCkge1xuICAgICAgICBoYXNoW25hbWVdICYmICFpc0FycmF5KGhhc2hbbmFtZV0pICYmIChoYXNoW25hbWVdID0gW2hhc2hbbmFtZV1dKVxuICAgICAgICBoYXNoW25hbWVdLnB1c2godmFsdWUpXG4gICAgICB9IGVsc2UgaGFzaFtuYW1lXSA9IHZhbHVlXG4gICAgfSwgYXJndW1lbnRzKVxuICAgIHJldHVybiBoYXNoXG4gIH1cblxuICAvLyBbIHsgbmFtZTogJ25hbWUnLCB2YWx1ZTogJ3ZhbHVlJyB9LCAuLi4gXSBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIHJlcXdlc3Quc2VyaWFsaXplQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyciA9IFtdXG4gICAgZWFjaEZvcm1FbGVtZW50LmFwcGx5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgYXJyLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZX0pXG4gICAgfSwgYXJndW1lbnRzKVxuICAgIHJldHVybiBhcnJcbiAgfVxuXG4gIHJlcXdlc3Quc2VyaWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgICB2YXIgb3B0LCBmblxuICAgICAgLCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxuXG4gICAgb3B0ID0gYXJncy5wb3AoKVxuICAgIG9wdCAmJiBvcHQubm9kZVR5cGUgJiYgYXJncy5wdXNoKG9wdCkgJiYgKG9wdCA9IG51bGwpXG4gICAgb3B0ICYmIChvcHQgPSBvcHQudHlwZSlcblxuICAgIGlmIChvcHQgPT0gJ21hcCcpIGZuID0gc2VyaWFsaXplSGFzaFxuICAgIGVsc2UgaWYgKG9wdCA9PSAnYXJyYXknKSBmbiA9IHJlcXdlc3Quc2VyaWFsaXplQXJyYXlcbiAgICBlbHNlIGZuID0gc2VyaWFsaXplUXVlcnlTdHJpbmdcblxuICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmdzKVxuICB9XG5cbiAgcmVxd2VzdC50b1F1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKG8sIHRyYWQpIHtcbiAgICB2YXIgcHJlZml4LCBpXG4gICAgICAsIHRyYWRpdGlvbmFsID0gdHJhZCB8fCBmYWxzZVxuICAgICAgLCBzID0gW11cbiAgICAgICwgZW5jID0gZW5jb2RlVVJJQ29tcG9uZW50XG4gICAgICAsIGFkZCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgLy8gSWYgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGFuZCByZXR1cm4gaXRzIHZhbHVlXG4gICAgICAgICAgdmFsdWUgPSAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHZhbHVlKSA/IHZhbHVlKCkgOiAodmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWUpXG4gICAgICAgICAgc1tzLmxlbmd0aF0gPSBlbmMoa2V5KSArICc9JyArIGVuYyh2YWx1ZSlcbiAgICAgICAgfVxuICAgIC8vIElmIGFuIGFycmF5IHdhcyBwYXNzZWQgaW4sIGFzc3VtZSB0aGF0IGl0IGlzIGFuIGFycmF5IG9mIGZvcm0gZWxlbWVudHMuXG4gICAgaWYgKGlzQXJyYXkobykpIHtcbiAgICAgIGZvciAoaSA9IDA7IG8gJiYgaSA8IG8ubGVuZ3RoOyBpKyspIGFkZChvW2ldLm5hbWUsIG9baV0udmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRyYWRpdGlvbmFsLCBlbmNvZGUgdGhlIFwib2xkXCIgd2F5ICh0aGUgd2F5IDEuMy4yIG9yIG9sZGVyXG4gICAgICAvLyBkaWQgaXQpLCBvdGhlcndpc2UgZW5jb2RlIHBhcmFtcyByZWN1cnNpdmVseS5cbiAgICAgIGZvciAocHJlZml4IGluIG8pIHtcbiAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4LCBvW3ByZWZpeF0sIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gc3BhY2VzIHNob3VsZCBiZSArIGFjY29yZGluZyB0byBzcGVjXG4gICAgcmV0dXJuIHMuam9pbignJicpLnJlcGxhY2UoLyUyMC9nLCAnKycpXG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFBhcmFtcyhwcmVmaXgsIG9iaiwgdHJhZGl0aW9uYWwsIGFkZCkge1xuICAgIHZhciBuYW1lLCBpLCB2XG4gICAgICAsIHJicmFja2V0ID0gL1xcW1xcXSQvXG5cbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAvLyBTZXJpYWxpemUgYXJyYXkgaXRlbS5cbiAgICAgIGZvciAoaSA9IDA7IG9iaiAmJiBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHYgPSBvYmpbaV1cbiAgICAgICAgaWYgKHRyYWRpdGlvbmFsIHx8IHJicmFja2V0LnRlc3QocHJlZml4KSkge1xuICAgICAgICAgIC8vIFRyZWF0IGVhY2ggYXJyYXkgaXRlbSBhcyBhIHNjYWxhci5cbiAgICAgICAgICBhZGQocHJlZml4LCB2KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArICh0eXBlb2YgdiA9PT0gJ29iamVjdCcgPyBpIDogJycpICsgJ10nLCB2LCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvYmogJiYgb2JqLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAvLyBTZXJpYWxpemUgb2JqZWN0IGl0ZW0uXG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArIG5hbWUgKyAnXScsIG9ialtuYW1lXSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZXJpYWxpemUgc2NhbGFyIGl0ZW0uXG4gICAgICBhZGQocHJlZml4LCBvYmopXG4gICAgfVxuICB9XG5cbiAgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2FsbGJhY2tQcmVmaXhcbiAgfVxuXG4gIC8vIGpRdWVyeSBhbmQgWmVwdG8gY29tcGF0aWJpbGl0eSwgZGlmZmVyZW5jZXMgY2FuIGJlIHJlbWFwcGVkIGhlcmUgc28geW91IGNhbiBjYWxsXG4gIC8vIC5hamF4LmNvbXBhdChvcHRpb25zLCBjYWxsYmFjaylcbiAgcmVxd2VzdC5jb21wYXQgPSBmdW5jdGlvbiAobywgZm4pIHtcbiAgICBpZiAobykge1xuICAgICAgby50eXBlICYmIChvLm1ldGhvZCA9IG8udHlwZSkgJiYgZGVsZXRlIG8udHlwZVxuICAgICAgby5kYXRhVHlwZSAmJiAoby50eXBlID0gby5kYXRhVHlwZSlcbiAgICAgIG8uanNvbnBDYWxsYmFjayAmJiAoby5qc29ucENhbGxiYWNrTmFtZSA9IG8uanNvbnBDYWxsYmFjaykgJiYgZGVsZXRlIG8uanNvbnBDYWxsYmFja1xuICAgICAgby5qc29ucCAmJiAoby5qc29ucENhbGxiYWNrID0gby5qc29ucClcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSZXF3ZXN0KG8sIGZuKVxuICB9XG5cbiAgcmVxd2VzdC5hamF4U2V0dXAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgZm9yICh2YXIgayBpbiBvcHRpb25zKSB7XG4gICAgICBnbG9iYWxTZXR1cE9wdGlvbnNba10gPSBvcHRpb25zW2tdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcXdlc3Rcbn0pO1xuIiwiLyohXG4gICogQmVhbiAtIGNvcHlyaWdodCAoYykgSmFjb2IgVGhvcm50b24gMjAxMS0yMDEyXG4gICogaHR0cHM6Ly9naXRodWIuY29tL2ZhdC9iZWFuXG4gICogTUlUIGxpY2Vuc2VcbiAgKi9cbihmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0pKCdiZWFuJywgdGhpcywgZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQpIHtcbiAgbmFtZSAgICA9IG5hbWUgICAgfHwgJ2JlYW4nXG4gIGNvbnRleHQgPSBjb250ZXh0IHx8IHRoaXNcblxuICB2YXIgd2luICAgICAgICAgICAgPSB3aW5kb3dcbiAgICAsIG9sZCAgICAgICAgICAgID0gY29udGV4dFtuYW1lXVxuICAgICwgbmFtZXNwYWNlUmVnZXggPSAvW15cXC5dKig/PVxcLi4qKVxcLnwuKi9cbiAgICAsIG5hbWVSZWdleCAgICAgID0gL1xcLi4qL1xuICAgICwgYWRkRXZlbnQgICAgICAgPSAnYWRkRXZlbnRMaXN0ZW5lcidcbiAgICAsIHJlbW92ZUV2ZW50ICAgID0gJ3JlbW92ZUV2ZW50TGlzdGVuZXInXG4gICAgLCBkb2MgICAgICAgICAgICA9IGRvY3VtZW50IHx8IHt9XG4gICAgLCByb290ICAgICAgICAgICA9IGRvYy5kb2N1bWVudEVsZW1lbnQgfHwge31cbiAgICAsIFczQ19NT0RFTCAgICAgID0gcm9vdFthZGRFdmVudF1cbiAgICAsIGV2ZW50U3VwcG9ydCAgID0gVzNDX01PREVMID8gYWRkRXZlbnQgOiAnYXR0YWNoRXZlbnQnXG4gICAgLCBPTkUgICAgICAgICAgICA9IHt9IC8vIHNpbmdsZXRvbiBmb3IgcXVpY2sgbWF0Y2hpbmcgbWFraW5nIGFkZCgpIGRvIG9uZSgpXG5cbiAgICAsIHNsaWNlICAgICAgICAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgLCBzdHIyYXJyICAgICAgICA9IGZ1bmN0aW9uIChzLCBkKSB7IHJldHVybiBzLnNwbGl0KGQgfHwgJyAnKSB9XG4gICAgLCBpc1N0cmluZyAgICAgICA9IGZ1bmN0aW9uIChvKSB7IHJldHVybiB0eXBlb2YgbyA9PSAnc3RyaW5nJyB9XG4gICAgLCBpc0Z1bmN0aW9uICAgICA9IGZ1bmN0aW9uIChvKSB7IHJldHVybiB0eXBlb2YgbyA9PSAnZnVuY3Rpb24nIH1cblxuICAgICAgLy8gZXZlbnRzIHRoYXQgd2UgY29uc2lkZXIgdG8gYmUgJ25hdGl2ZScsIGFueXRoaW5nIG5vdCBpbiB0aGlzIGxpc3Qgd2lsbFxuICAgICAgLy8gYmUgdHJlYXRlZCBhcyBhIGN1c3RvbSBldmVudFxuICAgICwgc3RhbmRhcmROYXRpdmVFdmVudHMgPVxuICAgICAgICAnY2xpY2sgZGJsY2xpY2sgbW91c2V1cCBtb3VzZWRvd24gY29udGV4dG1lbnUgJyAgICAgICAgICAgICAgICAgICsgLy8gbW91c2UgYnV0dG9uc1xuICAgICAgICAnbW91c2V3aGVlbCBtb3VzZW11bHRpd2hlZWwgRE9NTW91c2VTY3JvbGwgJyAgICAgICAgICAgICAgICAgICAgICsgLy8gbW91c2Ugd2hlZWxcbiAgICAgICAgJ21vdXNlb3ZlciBtb3VzZW91dCBtb3VzZW1vdmUgc2VsZWN0c3RhcnQgc2VsZWN0ZW5kICcgICAgICAgICAgICArIC8vIG1vdXNlIG1vdmVtZW50XG4gICAgICAgICdrZXlkb3duIGtleXByZXNzIGtleXVwICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBrZXlib2FyZFxuICAgICAgICAnb3JpZW50YXRpb25jaGFuZ2UgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gbW9iaWxlXG4gICAgICAgICdmb2N1cyBibHVyIGNoYW5nZSByZXNldCBzZWxlY3Qgc3VibWl0ICcgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBmb3JtIGVsZW1lbnRzXG4gICAgICAgICdsb2FkIHVubG9hZCBiZWZvcmV1bmxvYWQgcmVzaXplIG1vdmUgRE9NQ29udGVudExvYWRlZCAnICAgICAgICAgKyAvLyB3aW5kb3dcbiAgICAgICAgJ3JlYWR5c3RhdGVjaGFuZ2UgbWVzc2FnZSAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIHdpbmRvd1xuICAgICAgICAnZXJyb3IgYWJvcnQgc2Nyb2xsICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWlzY1xuICAgICAgLy8gZWxlbWVudC5maXJlRXZlbnQoJ29uWFlaJy4uLiBpcyBub3QgZm9yZ2l2aW5nIGlmIHdlIHRyeSB0byBmaXJlIGFuIGV2ZW50XG4gICAgICAvLyB0aGF0IGRvZXNuJ3QgYWN0dWFsbHkgZXhpc3QsIHNvIG1ha2Ugc3VyZSB3ZSBvbmx5IGRvIHRoZXNlIG9uIG5ld2VyIGJyb3dzZXJzXG4gICAgLCB3M2NOYXRpdmVFdmVudHMgPVxuICAgICAgICAnc2hvdyAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gbW91c2UgYnV0dG9uc1xuICAgICAgICAnaW5wdXQgaW52YWxpZCAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gZm9ybSBlbGVtZW50c1xuICAgICAgICAndG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgdG91Y2hjYW5jZWwgJyAgICAgICAgICAgICAgICAgICAgICsgLy8gdG91Y2hcbiAgICAgICAgJ2dlc3R1cmVzdGFydCBnZXN0dXJlY2hhbmdlIGdlc3R1cmVlbmQgJyAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIGdlc3R1cmVcbiAgICAgICAgJ3RleHRpbnB1dCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIFRleHRFdmVudFxuICAgICAgICAncmVhZHlzdGF0ZWNoYW5nZSBwYWdlc2hvdyBwYWdlaGlkZSBwb3BzdGF0ZSAnICAgICAgICAgICAgICAgICAgICsgLy8gd2luZG93XG4gICAgICAgICdoYXNoY2hhbmdlIG9mZmxpbmUgb25saW5lICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyB3aW5kb3dcbiAgICAgICAgJ2FmdGVycHJpbnQgYmVmb3JlcHJpbnQgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIHByaW50aW5nXG4gICAgICAgICdkcmFnc3RhcnQgZHJhZ2VudGVyIGRyYWdvdmVyIGRyYWdsZWF2ZSBkcmFnIGRyb3AgZHJhZ2VuZCAnICAgICAgKyAvLyBkbmRcbiAgICAgICAgJ2xvYWRzdGFydCBwcm9ncmVzcyBzdXNwZW5kIGVtcHRpZWQgc3RhbGxlZCBsb2FkbWV0YWRhdGEgJyAgICAgICArIC8vIG1lZGlhXG4gICAgICAgICdsb2FkZWRkYXRhIGNhbnBsYXkgY2FucGxheXRocm91Z2ggcGxheWluZyB3YWl0aW5nIHNlZWtpbmcgJyAgICAgKyAvLyBtZWRpYVxuICAgICAgICAnc2Vla2VkIGVuZGVkIGR1cmF0aW9uY2hhbmdlIHRpbWV1cGRhdGUgcGxheSBwYXVzZSByYXRlY2hhbmdlICcgICsgLy8gbWVkaWFcbiAgICAgICAgJ3ZvbHVtZWNoYW5nZSBjdWVjaGFuZ2UgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIG1lZGlhXG4gICAgICAgICdjaGVja2luZyBub3VwZGF0ZSBkb3dubG9hZGluZyBjYWNoZWQgdXBkYXRlcmVhZHkgb2Jzb2xldGUgJyAgICAgICAvLyBhcHBjYWNoZVxuXG4gICAgICAvLyBjb252ZXJ0IHRvIGEgaGFzaCBmb3IgcXVpY2sgbG9va3Vwc1xuICAgICwgbmF0aXZlRXZlbnRzID0gKGZ1bmN0aW9uIChoYXNoLCBldmVudHMsIGkpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKykgZXZlbnRzW2ldICYmIChoYXNoW2V2ZW50c1tpXV0gPSAxKVxuICAgICAgICByZXR1cm4gaGFzaFxuICAgICAgfSh7fSwgc3RyMmFycihzdGFuZGFyZE5hdGl2ZUV2ZW50cyArIChXM0NfTU9ERUwgPyB3M2NOYXRpdmVFdmVudHMgOiAnJykpKSlcblxuICAgICAgLy8gY3VzdG9tIGV2ZW50cyBhcmUgZXZlbnRzIHRoYXQgd2UgKmZha2UqLCB0aGV5IGFyZSBub3QgcHJvdmlkZWQgbmF0aXZlbHkgYnV0XG4gICAgICAvLyB3ZSBjYW4gdXNlIG5hdGl2ZSBldmVudHMgdG8gZ2VuZXJhdGUgdGhlbVxuICAgICwgY3VzdG9tRXZlbnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlzQW5jZXN0b3IgPSAnY29tcGFyZURvY3VtZW50UG9zaXRpb24nIGluIHJvb3RcbiAgICAgICAgICAgICAgPyBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICYmIChjb250YWluZXIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZWxlbWVudCkgJiAxNikgPT09IDE2XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA6ICdjb250YWlucycgaW4gcm9vdFxuICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIgPSBjb250YWluZXIubm9kZVR5cGUgPT09IDkgfHwgY29udGFpbmVyID09PSB3aW5kb3cgPyByb290IDogY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIgIT09IGVsZW1lbnQgJiYgY29udGFpbmVyLmNvbnRhaW5zKGVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSByZXR1cm4gMVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICwgY2hlY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgdmFyIHJlbGF0ZWQgPSBldmVudC5yZWxhdGVkVGFyZ2V0XG4gICAgICAgICAgICAgIHJldHVybiAhcmVsYXRlZFxuICAgICAgICAgICAgICAgID8gcmVsYXRlZCA9PSBudWxsXG4gICAgICAgICAgICAgICAgOiAocmVsYXRlZCAhPT0gdGhpcyAmJiByZWxhdGVkLnByZWZpeCAhPT0gJ3h1bCcgJiYgIS9kb2N1bWVudC8udGVzdCh0aGlzLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgICAgICYmICFpc0FuY2VzdG9yKHJlbGF0ZWQsIHRoaXMpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtb3VzZWVudGVyOiB7IGJhc2U6ICdtb3VzZW92ZXInLCBjb25kaXRpb246IGNoZWNrIH1cbiAgICAgICAgICAsIG1vdXNlbGVhdmU6IHsgYmFzZTogJ21vdXNlb3V0JywgY29uZGl0aW9uOiBjaGVjayB9XG4gICAgICAgICAgLCBtb3VzZXdoZWVsOiB7IGJhc2U6IC9GaXJlZm94Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpID8gJ0RPTU1vdXNlU2Nyb2xsJyA6ICdtb3VzZXdoZWVsJyB9XG4gICAgICAgIH1cbiAgICAgIH0oKSlcblxuICAgICAgLy8gd2UgcHJvdmlkZSBhIGNvbnNpc3RlbnQgRXZlbnQgb2JqZWN0IGFjcm9zcyBicm93c2VycyBieSB0YWtpbmcgdGhlIGFjdHVhbCBET01cbiAgICAgIC8vIGV2ZW50IG9iamVjdCBhbmQgZ2VuZXJhdGluZyBhIG5ldyBvbmUgZnJvbSBpdHMgcHJvcGVydGllcy5cbiAgICAsIEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGEgd2hpdGVsaXN0IG9mIHByb3BlcnRpZXMgKGZvciBkaWZmZXJlbnQgZXZlbnQgdHlwZXMpIHRlbGxzIHVzIHdoYXQgdG8gY2hlY2sgZm9yIGFuZCBjb3B5XG4gICAgICAgIHZhciBjb21tb25Qcm9wcyAgPSBzdHIyYXJyKCdhbHRLZXkgYXR0ckNoYW5nZSBhdHRyTmFtZSBidWJibGVzIGNhbmNlbGFibGUgY3RybEtleSBjdXJyZW50VGFyZ2V0ICcgK1xuICAgICAgICAgICAgICAnZGV0YWlsIGV2ZW50UGhhc2UgZ2V0TW9kaWZpZXJTdGF0ZSBpc1RydXN0ZWQgbWV0YUtleSByZWxhdGVkTm9kZSByZWxhdGVkVGFyZ2V0IHNoaWZ0S2V5ICcgICtcbiAgICAgICAgICAgICAgJ3NyY0VsZW1lbnQgdGFyZ2V0IHRpbWVTdGFtcCB0eXBlIHZpZXcgd2hpY2ggcHJvcGVydHlOYW1lJylcbiAgICAgICAgICAsIG1vdXNlUHJvcHMgICA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCdidXR0b24gYnV0dG9ucyBjbGllbnRYIGNsaWVudFkgZGF0YVRyYW5zZmVyICcgICAgICArXG4gICAgICAgICAgICAgICdmcm9tRWxlbWVudCBvZmZzZXRYIG9mZnNldFkgcGFnZVggcGFnZVkgc2NyZWVuWCBzY3JlZW5ZIHRvRWxlbWVudCcpKVxuICAgICAgICAgICwgbW91c2VXaGVlbFByb3BzID0gbW91c2VQcm9wcy5jb25jYXQoc3RyMmFycignd2hlZWxEZWx0YSB3aGVlbERlbHRhWCB3aGVlbERlbHRhWSB3aGVlbERlbHRhWiAnICtcbiAgICAgICAgICAgICAgJ2F4aXMnKSkgLy8gJ2F4aXMnIGlzIEZGIHNwZWNpZmljXG4gICAgICAgICAgLCBrZXlQcm9wcyAgICAgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycignY2hhciBjaGFyQ29kZSBrZXkga2V5Q29kZSBrZXlJZGVudGlmaWVyICcgICAgICAgICAgK1xuICAgICAgICAgICAgICAna2V5TG9jYXRpb24gbG9jYXRpb24nKSlcbiAgICAgICAgICAsIHRleHRQcm9wcyAgICA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCdkYXRhJykpXG4gICAgICAgICAgLCB0b3VjaFByb3BzICAgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycigndG91Y2hlcyB0YXJnZXRUb3VjaGVzIGNoYW5nZWRUb3VjaGVzIHNjYWxlIHJvdGF0aW9uJykpXG4gICAgICAgICAgLCBtZXNzYWdlUHJvcHMgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycignZGF0YSBvcmlnaW4gc291cmNlJykpXG4gICAgICAgICAgLCBzdGF0ZVByb3BzICAgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycignc3RhdGUnKSlcbiAgICAgICAgICAsIG92ZXJPdXRSZWdleCA9IC9vdmVyfG91dC9cbiAgICAgICAgICAgIC8vIHNvbWUgZXZlbnQgdHlwZXMgbmVlZCBzcGVjaWFsIGhhbmRsaW5nIGFuZCBzb21lIG5lZWQgc3BlY2lhbCBwcm9wZXJ0aWVzLCBkbyB0aGF0IGFsbCBoZXJlXG4gICAgICAgICAgLCB0eXBlRml4ZXJzICAgPSBbXG4gICAgICAgICAgICAgICAgeyAvLyBrZXkgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL2tleS9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKGV2ZW50LCBuZXdFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LmtleUNvZGUgPSBldmVudC5rZXlDb2RlIHx8IGV2ZW50LndoaWNoXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVByb3BzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBtb3VzZSBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvY2xpY2t8bW91c2UoPyEoLip3aGVlbHxzY3JvbGwpKXxtZW51fGRyYWd8ZHJvcC9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKGV2ZW50LCBuZXdFdmVudCwgdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LnJpZ2h0Q2xpY2sgPSBldmVudC53aGljaCA9PT0gMyB8fCBldmVudC5idXR0b24gPT09IDJcbiAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5wb3MgPSB7IHg6IDAsIHk6IDAgfVxuICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5wYWdlWCB8fCBldmVudC5wYWdlWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQuY2xpZW50WCA9IGV2ZW50LnBhZ2VYXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5jbGllbnRZID0gZXZlbnQucGFnZVlcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmNsaWVudFggfHwgZXZlbnQuY2xpZW50WSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQuY2xpZW50WCA9IGV2ZW50LmNsaWVudFggKyBkb2MuYm9keS5zY3JvbGxMZWZ0ICsgcm9vdC5zY3JvbGxMZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5jbGllbnRZID0gZXZlbnQuY2xpZW50WSArIGRvYy5ib2R5LnNjcm9sbFRvcCArIHJvb3Quc2Nyb2xsVG9wXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIGlmIChvdmVyT3V0UmVnZXgudGVzdCh0eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQucmVsYXRlZFRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgZXZlbnRbKHR5cGUgPT0gJ21vdXNlb3ZlcicgPyAnZnJvbScgOiAndG8nKSArICdFbGVtZW50J11cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vdXNlUHJvcHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIG1vdXNlIHdoZWVsIGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9tb3VzZS4qKHdoZWVsfHNjcm9sbCkvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vdXNlV2hlZWxQcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gVGV4dEV2ZW50XG4gICAgICAgICAgICAgICAgICAgIHJlZzogL150ZXh0L2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0ZXh0UHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIHRvdWNoIGFuZCBnZXN0dXJlIGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9edG91Y2h8Xmdlc3R1cmUvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRvdWNoUHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIG1lc3NhZ2UgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL15tZXNzYWdlJC9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbWVzc2FnZVByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBwb3BzdGF0ZSBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvXnBvcHN0YXRlJC9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc3RhdGVQcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJlZzogLy4qL1xuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvbW1vblByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgLCB0eXBlRml4ZXJNYXAgPSB7fSAvLyB1c2VkIHRvIG1hcCBldmVudCB0eXBlcyB0byBmaXhlciBmdW5jdGlvbnMgKGFib3ZlKSwgYSBiYXNpYyBjYWNoZSBtZWNoYW5pc21cblxuICAgICAgICAgICwgRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQsIGVsZW1lbnQsIGlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuXG4gICAgICAgICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgKChlbGVtZW50Lm93bmVyRG9jdW1lbnQgfHwgZWxlbWVudC5kb2N1bWVudCB8fCBlbGVtZW50KS5wYXJlbnRXaW5kb3cgfHwgd2luKS5ldmVudFxuICAgICAgICAgICAgICB0aGlzLm9yaWdpbmFsRXZlbnQgPSBldmVudFxuICAgICAgICAgICAgICB0aGlzLmlzTmF0aXZlICAgICAgID0gaXNOYXRpdmVcbiAgICAgICAgICAgICAgdGhpcy5pc0JlYW4gICAgICAgICA9IHRydWVcblxuICAgICAgICAgICAgICBpZiAoIWV2ZW50KSByZXR1cm5cblxuICAgICAgICAgICAgICB2YXIgdHlwZSAgID0gZXZlbnQudHlwZVxuICAgICAgICAgICAgICAgICwgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnRcbiAgICAgICAgICAgICAgICAsIGksIGwsIHAsIHByb3BzLCBmaXhlclxuXG4gICAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0ICYmIHRhcmdldC5ub2RlVHlwZSA9PT0gMyA/IHRhcmdldC5wYXJlbnROb2RlIDogdGFyZ2V0XG5cbiAgICAgICAgICAgICAgaWYgKGlzTmF0aXZlKSB7IC8vIHdlIG9ubHkgbmVlZCBiYXNpYyBhdWdtZW50YXRpb24gb24gY3VzdG9tIGV2ZW50cywgdGhlIHJlc3QgZXhwZW5zaXZlICYgcG9pbnRsZXNzXG4gICAgICAgICAgICAgICAgZml4ZXIgPSB0eXBlRml4ZXJNYXBbdHlwZV1cbiAgICAgICAgICAgICAgICBpZiAoIWZpeGVyKSB7IC8vIGhhdmVuJ3QgZW5jb3VudGVyZWQgdGhpcyBldmVudCB0eXBlIGJlZm9yZSwgbWFwIGEgZml4ZXIgZnVuY3Rpb24gZm9yIGl0XG4gICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gdHlwZUZpeGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVGaXhlcnNbaV0ucmVnLnRlc3QodHlwZSkpIHsgLy8gZ3VhcmFudGVlZCB0byBtYXRjaCBhdCBsZWFzdCBvbmUsIGxhc3QgaXMgLipcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlRml4ZXJNYXBbdHlwZV0gPSBmaXhlciA9IHR5cGVGaXhlcnNbaV0uZml4XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHByb3BzID0gZml4ZXIoZXZlbnQsIHRoaXMsIHR5cGUpXG4gICAgICAgICAgICAgICAgZm9yIChpID0gcHJvcHMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgICAgICAgICBpZiAoISgocCA9IHByb3BzW2ldKSBpbiB0aGlzKSAmJiBwIGluIGV2ZW50KSB0aGlzW3BdID0gZXZlbnRbcF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAvLyBwcmV2ZW50RGVmYXVsdCgpIGFuZCBzdG9wUHJvcGFnYXRpb24oKSBhcmUgYSBjb25zaXN0ZW50IGludGVyZmFjZSB0byB0aG9zZSBmdW5jdGlvbnNcbiAgICAgICAgLy8gb24gdGhlIERPTSwgc3RvcCgpIGlzIGFuIGFsaWFzIGZvciBib3RoIG9mIHRoZW0gdG9nZXRoZXJcbiAgICAgICAgRXZlbnQucHJvdG90eXBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0aGlzLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQpIHRoaXMub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgZWxzZSB0aGlzLm9yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxFdmVudC5zdG9wUHJvcGFnYXRpb24pIHRoaXMub3JpZ2luYWxFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGVsc2UgdGhpcy5vcmlnaW5hbEV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBFdmVudC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgdGhpcy5zdG9wcGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIC8vIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIGhhcyB0byBiZSBoYW5kbGVkIGludGVybmFsbHkgYmVjYXVzZSB3ZSBtYW5hZ2UgdGhlIGV2ZW50IGxpc3QgZm9yXG4gICAgICAgIC8vIGVhY2ggZWxlbWVudFxuICAgICAgICAvLyBub3RlIHRoYXQgb3JpZ2luYWxFbGVtZW50IG1heSBiZSBhIEJlYW4jRXZlbnQgb2JqZWN0IGluIHNvbWUgc2l0dWF0aW9uc1xuICAgICAgICBFdmVudC5wcm90b3R5cGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKClcbiAgICAgICAgICB0aGlzLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnQucHJvdG90eXBlLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRXZlbnQuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgJiYgdGhpcy5vcmlnaW5hbEV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKClcbiAgICAgICAgfVxuICAgICAgICBFdmVudC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoY3VycmVudFRhcmdldCkge1xuICAgICAgICAgIC8vVE9ETzogdGhpcyBpcyByaXBlIGZvciBvcHRpbWlzYXRpb24sIG5ldyBldmVudHMgYXJlICpleHBlbnNpdmUqXG4gICAgICAgICAgLy8gaW1wcm92aW5nIHRoaXMgd2lsbCBzcGVlZCB1cCBkZWxlZ2F0ZWQgZXZlbnRzXG4gICAgICAgICAgdmFyIG5lID0gbmV3IEV2ZW50KHRoaXMsIHRoaXMuZWxlbWVudCwgdGhpcy5pc05hdGl2ZSlcbiAgICAgICAgICBuZS5jdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldFxuICAgICAgICAgIHJldHVybiBuZVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEV2ZW50XG4gICAgICB9KCkpXG5cbiAgICAgIC8vIGlmIHdlJ3JlIGluIG9sZCBJRSB3ZSBjYW4ndCBkbyBvbnByb3BlcnR5Y2hhbmdlIG9uIGRvYyBvciB3aW4gc28gd2UgdXNlIGRvYy5kb2N1bWVudEVsZW1lbnQgZm9yIGJvdGhcbiAgICAsIHRhcmdldEVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgaXNOYXRpdmUpIHtcbiAgICAgICAgcmV0dXJuICFXM0NfTU9ERUwgJiYgIWlzTmF0aXZlICYmIChlbGVtZW50ID09PSBkb2MgfHwgZWxlbWVudCA9PT0gd2luKSA/IHJvb3QgOiBlbGVtZW50XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIEJlYW4gbWFpbnRhaW5zIGFuIGludGVybmFsIHJlZ2lzdHJ5IGZvciBldmVudCBsaXN0ZW5lcnMuIFdlIGRvbid0IHRvdWNoIGVsZW1lbnRzLCBvYmplY3RzXG4gICAgICAgICogb3IgZnVuY3Rpb25zIHRvIGlkZW50aWZ5IHRoZW0sIGluc3RlYWQgd2Ugc3RvcmUgZXZlcnl0aGluZyBpbiB0aGUgcmVnaXN0cnkuXG4gICAgICAgICogRWFjaCBldmVudCBsaXN0ZW5lciBoYXMgYSBSZWdFbnRyeSBvYmplY3QsIHdlIGhhdmUgb25lICdyZWdpc3RyeScgZm9yIHRoZSB3aG9sZSBpbnN0YW5jZS5cbiAgICAgICAgKi9cbiAgICAsIFJlZ0VudHJ5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gZWFjaCBoYW5kbGVyIGlzIHdyYXBwZWQgc28gd2UgY2FuIGhhbmRsZSBkZWxlZ2F0aW9uIGFuZCBjdXN0b20gZXZlbnRzXG4gICAgICAgIHZhciB3cmFwcGVkSGFuZGxlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBmbiwgY29uZGl0aW9uLCBhcmdzKSB7XG4gICAgICAgICAgICB2YXIgY2FsbCA9IGZ1bmN0aW9uIChldmVudCwgZWFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShlbGVtZW50LCBhcmdzID8gc2xpY2UuY2FsbChlYXJncywgZXZlbnQgPyAwIDogMSkuY29uY2F0KGFyZ3MpIDogZWFyZ3MpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIGZpbmRUYXJnZXQgPSBmdW5jdGlvbiAoZXZlbnQsIGV2ZW50RWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuLl9fYmVhbkRlbCA/IGZuLl9fYmVhbkRlbC5mdChldmVudC50YXJnZXQsIGVsZW1lbnQpIDogZXZlbnRFbGVtZW50XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIGhhbmRsZXIgPSBjb25kaXRpb25cbiAgICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGZpbmRUYXJnZXQoZXZlbnQsIHRoaXMpIC8vIGRlbGVhdGVkIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmRpdGlvbi5hcHBseSh0YXJnZXQsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudCkgZXZlbnQuY3VycmVudFRhcmdldCA9IHRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGwoZXZlbnQsIGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGZuLl9fYmVhbkRlbCkgZXZlbnQgPSBldmVudC5jbG9uZShmaW5kVGFyZ2V0KGV2ZW50KSkgLy8gZGVsZWdhdGVkIGV2ZW50LCBmaXggdGhlIGZpeFxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsKGV2ZW50LCBhcmd1bWVudHMpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhbmRsZXIuX19iZWFuRGVsID0gZm4uX19iZWFuRGVsXG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlclxuICAgICAgICAgIH1cblxuICAgICAgICAsIFJlZ0VudHJ5ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIGhhbmRsZXIsIG9yaWdpbmFsLCBuYW1lc3BhY2VzLCBhcmdzLCByb290KSB7XG4gICAgICAgICAgICB2YXIgY3VzdG9tVHlwZSAgICAgPSBjdXN0b21FdmVudHNbdHlwZV1cbiAgICAgICAgICAgICAgLCBpc05hdGl2ZVxuXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAndW5sb2FkJykge1xuICAgICAgICAgICAgICAvLyBzZWxmIGNsZWFuLXVwXG4gICAgICAgICAgICAgIGhhbmRsZXIgPSBvbmNlKHJlbW92ZUxpc3RlbmVyLCBlbGVtZW50LCB0eXBlLCBoYW5kbGVyLCBvcmlnaW5hbClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGUpIHtcbiAgICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGUuY29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlciA9IHdyYXBwZWRIYW5kbGVyKGVsZW1lbnQsIGhhbmRsZXIsIGN1c3RvbVR5cGUuY29uZGl0aW9uLCBhcmdzKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHR5cGUgPSBjdXN0b21UeXBlLmJhc2UgfHwgdHlwZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmlzTmF0aXZlICAgICAgPSBpc05hdGl2ZSA9IG5hdGl2ZUV2ZW50c1t0eXBlXSAmJiAhIWVsZW1lbnRbZXZlbnRTdXBwb3J0XVxuICAgICAgICAgICAgdGhpcy5jdXN0b21UeXBlICAgID0gIVczQ19NT0RFTCAmJiAhaXNOYXRpdmUgJiYgdHlwZVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50ICAgICAgID0gZWxlbWVudFxuICAgICAgICAgICAgdGhpcy50eXBlICAgICAgICAgID0gdHlwZVxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbCAgICAgID0gb3JpZ2luYWxcbiAgICAgICAgICAgIHRoaXMubmFtZXNwYWNlcyAgICA9IG5hbWVzcGFjZXNcbiAgICAgICAgICAgIHRoaXMuZXZlbnRUeXBlICAgICA9IFczQ19NT0RFTCB8fCBpc05hdGl2ZSA/IHR5cGUgOiAncHJvcGVydHljaGFuZ2UnXG4gICAgICAgICAgICB0aGlzLnRhcmdldCAgICAgICAgPSB0YXJnZXRFbGVtZW50KGVsZW1lbnQsIGlzTmF0aXZlKVxuICAgICAgICAgICAgdGhpc1tldmVudFN1cHBvcnRdID0gISF0aGlzLnRhcmdldFtldmVudFN1cHBvcnRdXG4gICAgICAgICAgICB0aGlzLnJvb3QgICAgICAgICAgPSByb290XG4gICAgICAgICAgICB0aGlzLmhhbmRsZXIgICAgICAgPSB3cmFwcGVkSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBudWxsLCBhcmdzKVxuICAgICAgICAgIH1cblxuICAgICAgICAvLyBnaXZlbiBhIGxpc3Qgb2YgbmFtZXNwYWNlcywgaXMgb3VyIGVudHJ5IGluIGFueSBvZiB0aGVtP1xuICAgICAgICBSZWdFbnRyeS5wcm90b3R5cGUuaW5OYW1lc3BhY2VzID0gZnVuY3Rpb24gKGNoZWNrTmFtZXNwYWNlcykge1xuICAgICAgICAgIHZhciBpLCBqLCBjID0gMFxuICAgICAgICAgIGlmICghY2hlY2tOYW1lc3BhY2VzKSByZXR1cm4gdHJ1ZVxuICAgICAgICAgIGlmICghdGhpcy5uYW1lc3BhY2VzKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICBmb3IgKGkgPSBjaGVja05hbWVzcGFjZXMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgICBmb3IgKGogPSB0aGlzLm5hbWVzcGFjZXMubGVuZ3RoOyBqLS07KSB7XG4gICAgICAgICAgICAgIGlmIChjaGVja05hbWVzcGFjZXNbaV0gPT0gdGhpcy5uYW1lc3BhY2VzW2pdKSBjKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoZWNrTmFtZXNwYWNlcy5sZW5ndGggPT09IGNcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1hdGNoIGJ5IGVsZW1lbnQsIG9yaWdpbmFsIGZuIChvcHQpLCBoYW5kbGVyIGZuIChvcHQpXG4gICAgICAgIFJlZ0VudHJ5LnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24gKGNoZWNrRWxlbWVudCwgY2hlY2tPcmlnaW5hbCwgY2hlY2tIYW5kbGVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudCA9PT0gY2hlY2tFbGVtZW50ICYmXG4gICAgICAgICAgICAoIWNoZWNrT3JpZ2luYWwgfHwgdGhpcy5vcmlnaW5hbCA9PT0gY2hlY2tPcmlnaW5hbCkgJiZcbiAgICAgICAgICAgICghY2hlY2tIYW5kbGVyIHx8IHRoaXMuaGFuZGxlciA9PT0gY2hlY2tIYW5kbGVyKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlZ0VudHJ5XG4gICAgICB9KCkpXG5cbiAgICAsIHJlZ2lzdHJ5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gb3VyIG1hcCBzdG9yZXMgYXJyYXlzIGJ5IGV2ZW50IHR5cGUsIGp1c3QgYmVjYXVzZSBpdCdzIGJldHRlciB0aGFuIHN0b3JpbmdcbiAgICAgICAgLy8gZXZlcnl0aGluZyBpbiBhIHNpbmdsZSBhcnJheS5cbiAgICAgICAgLy8gdXNlcyAnJCcgYXMgYSBwcmVmaXggZm9yIHRoZSBrZXlzIGZvciBzYWZldHkgYW5kICdyJyBhcyBhIHNwZWNpYWwgcHJlZml4IGZvclxuICAgICAgICAvLyByb290TGlzdGVuZXJzIHNvIHdlIGNhbiBsb29rIHRoZW0gdXAgZmFzdFxuICAgICAgICB2YXIgbWFwID0ge31cblxuICAgICAgICAgIC8vIGdlbmVyaWMgZnVuY3Rpb25hbCBzZWFyY2ggb2Ygb3VyIHJlZ2lzdHJ5IGZvciBtYXRjaGluZyBsaXN0ZW5lcnMsXG4gICAgICAgICAgLy8gYGZuYCByZXR1cm5zIGZhbHNlIHRvIGJyZWFrIG91dCBvZiB0aGUgbG9vcFxuICAgICAgICAgICwgZm9yQWxsID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIG9yaWdpbmFsLCBoYW5kbGVyLCByb290LCBmbikge1xuICAgICAgICAgICAgICB2YXIgcGZ4ID0gcm9vdCA/ICdyJyA6ICckJ1xuICAgICAgICAgICAgICBpZiAoIXR5cGUgfHwgdHlwZSA9PSAnKicpIHtcbiAgICAgICAgICAgICAgICAvLyBzZWFyY2ggdGhlIHdob2xlIHJlZ2lzdHJ5XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdCBpbiBtYXApIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0LmNoYXJBdCgwKSA9PSBwZngpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yQWxsKGVsZW1lbnQsIHQuc3Vic3RyKDEpLCBvcmlnaW5hbCwgaGFuZGxlciwgcm9vdCwgZm4pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpID0gMCwgbCwgbGlzdCA9IG1hcFtwZnggKyB0eXBlXSwgYWxsID0gZWxlbWVudCA9PSAnKidcbiAgICAgICAgICAgICAgICBpZiAoIWxpc3QpIHJldHVyblxuICAgICAgICAgICAgICAgIGZvciAobCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoKGFsbCB8fCBsaXN0W2ldLm1hdGNoZXMoZWxlbWVudCwgb3JpZ2luYWwsIGhhbmRsZXIpKSAmJiAhZm4obGlzdFtpXSwgbGlzdCwgaSwgdHlwZSkpIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgLCBoYXMgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgb3JpZ2luYWwsIHJvb3QpIHtcbiAgICAgICAgICAgICAgLy8gd2UncmUgbm90IHVzaW5nIGZvckFsbCBoZXJlIHNpbXBseSBiZWNhdXNlIGl0J3MgYSBiaXQgc2xvd2VyIGFuZCB0aGlzXG4gICAgICAgICAgICAgIC8vIG5lZWRzIHRvIGJlIGZhc3RcbiAgICAgICAgICAgICAgdmFyIGksIGxpc3QgPSBtYXBbKHJvb3QgPyAncicgOiAnJCcpICsgdHlwZV1cbiAgICAgICAgICAgICAgaWYgKGxpc3QpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgICAgICAgICAgaWYgKCFsaXN0W2ldLnJvb3QgJiYgbGlzdFtpXS5tYXRjaGVzKGVsZW1lbnQsIG9yaWdpbmFsLCBudWxsKSkgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAsIGdldCA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBvcmlnaW5hbCwgcm9vdCkge1xuICAgICAgICAgICAgICB2YXIgZW50cmllcyA9IFtdXG4gICAgICAgICAgICAgIGZvckFsbChlbGVtZW50LCB0eXBlLCBvcmlnaW5hbCwgbnVsbCwgcm9vdCwgZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudHJpZXMucHVzaChlbnRyeSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgcmV0dXJuIGVudHJpZXNcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICwgcHV0ID0gZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgIHZhciBoYXMgPSAhZW50cnkucm9vdCAmJiAhdGhpcy5oYXMoZW50cnkuZWxlbWVudCwgZW50cnkudHlwZSwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgICAgICAgLCBrZXkgPSAoZW50cnkucm9vdCA/ICdyJyA6ICckJykgKyBlbnRyeS50eXBlXG4gICAgICAgICAgICAgIDsobWFwW2tleV0gfHwgKG1hcFtrZXldID0gW10pKS5wdXNoKGVudHJ5KVxuICAgICAgICAgICAgICByZXR1cm4gaGFzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAsIGRlbCA9IGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICBmb3JBbGwoZW50cnkuZWxlbWVudCwgZW50cnkudHlwZSwgbnVsbCwgZW50cnkuaGFuZGxlciwgZW50cnkucm9vdCwgZnVuY3Rpb24gKGVudHJ5LCBsaXN0LCBpKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICBlbnRyeS5yZW1vdmVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkgZGVsZXRlIG1hcFsoZW50cnkucm9vdCA/ICdyJyA6ICckJykgKyBlbnRyeS50eXBlXVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkdW1wIGFsbCBlbnRyaWVzLCB1c2VkIGZvciBvbnVubG9hZFxuICAgICAgICAgICwgZW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIHQsIGVudHJpZXMgPSBbXVxuICAgICAgICAgICAgICBmb3IgKHQgaW4gbWFwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHQuY2hhckF0KDApID09ICckJykgZW50cmllcyA9IGVudHJpZXMuY29uY2F0KG1hcFt0XSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZW50cmllc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IGhhczogaGFzLCBnZXQ6IGdldCwgcHV0OiBwdXQsIGRlbDogZGVsLCBlbnRyaWVzOiBlbnRyaWVzIH1cbiAgICAgIH0oKSlcblxuICAgICAgLy8gd2UgbmVlZCBhIHNlbGVjdG9yIGVuZ2luZSBmb3IgZGVsZWdhdGVkIGV2ZW50cywgdXNlIHF1ZXJ5U2VsZWN0b3JBbGwgaWYgaXQgZXhpc3RzXG4gICAgICAvLyBidXQgZm9yIG9sZGVyIGJyb3dzZXJzIHdlIG5lZWQgUXdlcnksIFNpenpsZSBvciBzaW1pbGFyXG4gICAgLCBzZWxlY3RvckVuZ2luZVxuICAgICwgc2V0U2VsZWN0b3JFbmdpbmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBzZWxlY3RvckVuZ2luZSA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsXG4gICAgICAgICAgICA/IGZ1bmN0aW9uIChzLCByKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIucXVlcnlTZWxlY3RvckFsbChzKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlYW46IE5vIHNlbGVjdG9yIGVuZ2luZSBpbnN0YWxsZWQnKSAvLyBlZWVrXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxlY3RvckVuZ2luZSA9IGVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyB3ZSBhdHRhY2ggdGhpcyBsaXN0ZW5lciB0byBlYWNoIERPTSBldmVudCB0aGF0IHdlIG5lZWQgdG8gbGlzdGVuIHRvLCBvbmx5IG9uY2VcbiAgICAgIC8vIHBlciBldmVudCB0eXBlIHBlciBET00gZWxlbWVudFxuICAgICwgcm9vdExpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50LCB0eXBlKSB7XG4gICAgICAgIGlmICghVzNDX01PREVMICYmIHR5cGUgJiYgZXZlbnQgJiYgZXZlbnQucHJvcGVydHlOYW1lICE9ICdfb24nICsgdHlwZSkgcmV0dXJuXG5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHJlZ2lzdHJ5LmdldCh0aGlzLCB0eXBlIHx8IGV2ZW50LnR5cGUsIG51bGwsIGZhbHNlKVxuICAgICAgICAgICwgbCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICAgICAsIGkgPSAwXG5cbiAgICAgICAgZXZlbnQgPSBuZXcgRXZlbnQoZXZlbnQsIHRoaXMsIHRydWUpXG4gICAgICAgIGlmICh0eXBlKSBldmVudC50eXBlID0gdHlwZVxuXG4gICAgICAgIC8vIGl0ZXJhdGUgdGhyb3VnaCBhbGwgaGFuZGxlcnMgcmVnaXN0ZXJlZCBmb3IgdGhpcyB0eXBlLCBjYWxsaW5nIHRoZW0gdW5sZXNzIHRoZXkgaGF2ZVxuICAgICAgICAvLyBiZWVuIHJlbW92ZWQgYnkgYSBwcmV2aW91cyBoYW5kbGVyIG9yIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIGhhcyBiZWVuIGNhbGxlZFxuICAgICAgICBmb3IgKDsgaSA8IGwgJiYgIWV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCk7IGkrKykge1xuICAgICAgICAgIGlmICghbGlzdGVuZXJzW2ldLnJlbW92ZWQpIGxpc3RlbmVyc1tpXS5oYW5kbGVyLmNhbGwodGhpcywgZXZlbnQpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYWRkIGFuZCByZW1vdmUgbGlzdGVuZXJzIHRvIERPTSBlbGVtZW50c1xuICAgICwgbGlzdGVuZXIgPSBXM0NfTU9ERUxcbiAgICAgICAgPyBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgYWRkKSB7XG4gICAgICAgICAgICAvLyBuZXcgYnJvd3NlcnNcbiAgICAgICAgICAgIGVsZW1lbnRbYWRkID8gYWRkRXZlbnQgOiByZW1vdmVFdmVudF0odHlwZSwgcm9vdExpc3RlbmVyLCBmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIGFkZCwgY3VzdG9tKSB7XG4gICAgICAgICAgICAvLyBJRTggYW5kIGJlbG93LCB1c2UgYXR0YWNoRXZlbnQvZGV0YWNoRXZlbnQgYW5kIHdlIGhhdmUgdG8gcGlnZ3ktYmFjayBwcm9wZXJ0eWNoYW5nZSBldmVudHNcbiAgICAgICAgICAgIC8vIHRvIHNpbXVsYXRlIGV2ZW50IGJ1YmJsaW5nIGV0Yy5cbiAgICAgICAgICAgIHZhciBlbnRyeVxuICAgICAgICAgICAgaWYgKGFkZCkge1xuICAgICAgICAgICAgICByZWdpc3RyeS5wdXQoZW50cnkgPSBuZXcgUmVnRW50cnkoXG4gICAgICAgICAgICAgICAgICBlbGVtZW50XG4gICAgICAgICAgICAgICAgLCBjdXN0b20gfHwgdHlwZVxuICAgICAgICAgICAgICAgICwgZnVuY3Rpb24gKGV2ZW50KSB7IC8vIGhhbmRsZXJcbiAgICAgICAgICAgICAgICAgICAgcm9vdExpc3RlbmVyLmNhbGwoZWxlbWVudCwgZXZlbnQsIGN1c3RvbSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAsIHJvb3RMaXN0ZW5lclxuICAgICAgICAgICAgICAgICwgbnVsbFxuICAgICAgICAgICAgICAgICwgbnVsbFxuICAgICAgICAgICAgICAgICwgdHJ1ZSAvLyBpcyByb290XG4gICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgIGlmIChjdXN0b20gJiYgZWxlbWVudFsnX29uJyArIGN1c3RvbV0gPT0gbnVsbCkgZWxlbWVudFsnX29uJyArIGN1c3RvbV0gPSAwXG4gICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5hdHRhY2hFdmVudCgnb24nICsgZW50cnkuZXZlbnRUeXBlLCBlbnRyeS5oYW5kbGVyKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZW50cnkgPSByZWdpc3RyeS5nZXQoZWxlbWVudCwgY3VzdG9tIHx8IHR5cGUsIHJvb3RMaXN0ZW5lciwgdHJ1ZSlbMF1cbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LmRldGFjaEV2ZW50KCdvbicgKyBlbnRyeS5ldmVudFR5cGUsIGVudHJ5LmhhbmRsZXIpXG4gICAgICAgICAgICAgICAgcmVnaXN0cnkuZGVsKGVudHJ5KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgLCBvbmNlID0gZnVuY3Rpb24gKHJtLCBlbGVtZW50LCB0eXBlLCBmbiwgb3JpZ2luYWxGbikge1xuICAgICAgICAvLyB3cmFwIHRoZSBoYW5kbGVyIGluIGEgaGFuZGxlciB0aGF0IGRvZXMgYSByZW1vdmUgYXMgd2VsbFxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgICBybShlbGVtZW50LCB0eXBlLCBvcmlnaW5hbEZuKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAsIHJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9yZ1R5cGUsIGhhbmRsZXIsIG5hbWVzcGFjZXMpIHtcbiAgICAgICAgdmFyIHR5cGUgICAgID0gb3JnVHlwZSAmJiBvcmdUeXBlLnJlcGxhY2UobmFtZVJlZ2V4LCAnJylcbiAgICAgICAgICAsIGhhbmRsZXJzID0gcmVnaXN0cnkuZ2V0KGVsZW1lbnQsIHR5cGUsIG51bGwsIGZhbHNlKVxuICAgICAgICAgICwgcmVtb3ZlZCAgPSB7fVxuICAgICAgICAgICwgaSwgbFxuXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBoYW5kbGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoKCFoYW5kbGVyIHx8IGhhbmRsZXJzW2ldLm9yaWdpbmFsID09PSBoYW5kbGVyKSAmJiBoYW5kbGVyc1tpXS5pbk5hbWVzcGFjZXMobmFtZXNwYWNlcykpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IHRoaXMgaXMgcHJvYmxlbWF0aWMsIHdlIGhhdmUgYSByZWdpc3RyeS5nZXQoKSBhbmQgcmVnaXN0cnkuZGVsKCkgdGhhdFxuICAgICAgICAgICAgLy8gYm90aCBkbyByZWdpc3RyeSBzZWFyY2hlcyBzbyB3ZSB3YXN0ZSBjeWNsZXMgZG9pbmcgdGhpcy4gTmVlZHMgdG8gYmUgcm9sbGVkIGludG9cbiAgICAgICAgICAgIC8vIGEgc2luZ2xlIHJlZ2lzdHJ5LmZvckFsbChmbikgdGhhdCByZW1vdmVzIHdoaWxlIGZpbmRpbmcsIGJ1dCB0aGUgY2F0Y2ggaXMgdGhhdFxuICAgICAgICAgICAgLy8gd2UnbGwgYmUgc3BsaWNpbmcgdGhlIGFycmF5cyB0aGF0IHdlJ3JlIGl0ZXJhdGluZyBvdmVyLiBOZWVkcyBleHRyYSB0ZXN0cyB0b1xuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGRvbid0IHNjcmV3IGl0IHVwLiBAcnZhZ2dcbiAgICAgICAgICAgIHJlZ2lzdHJ5LmRlbChoYW5kbGVyc1tpXSlcbiAgICAgICAgICAgIGlmICghcmVtb3ZlZFtoYW5kbGVyc1tpXS5ldmVudFR5cGVdICYmIGhhbmRsZXJzW2ldW2V2ZW50U3VwcG9ydF0pXG4gICAgICAgICAgICAgIHJlbW92ZWRbaGFuZGxlcnNbaV0uZXZlbnRUeXBlXSA9IHsgdDogaGFuZGxlcnNbaV0uZXZlbnRUeXBlLCBjOiBoYW5kbGVyc1tpXS50eXBlIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgZWFjaCB0eXBlL2VsZW1lbnQgZm9yIHJlbW92ZWQgbGlzdGVuZXJzIGFuZCByZW1vdmUgdGhlIHJvb3RMaXN0ZW5lciB3aGVyZSBpdCdzIG5vIGxvbmdlciBuZWVkZWRcbiAgICAgICAgZm9yIChpIGluIHJlbW92ZWQpIHtcbiAgICAgICAgICBpZiAoIXJlZ2lzdHJ5LmhhcyhlbGVtZW50LCByZW1vdmVkW2ldLnQsIG51bGwsIGZhbHNlKSkge1xuICAgICAgICAgICAgLy8gbGFzdCBsaXN0ZW5lciBvZiB0aGlzIHR5cGUsIHJlbW92ZSB0aGUgcm9vdExpc3RlbmVyXG4gICAgICAgICAgICBsaXN0ZW5lcihlbGVtZW50LCByZW1vdmVkW2ldLnQsIGZhbHNlLCByZW1vdmVkW2ldLmMpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCB1cCBhIGRlbGVnYXRlIGhlbHBlciB1c2luZyB0aGUgZ2l2ZW4gc2VsZWN0b3IsIHdyYXAgdGhlIGhhbmRsZXIgZnVuY3Rpb25cbiAgICAsIGRlbGVnYXRlID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBmbikge1xuICAgICAgICAvL1RPRE86IGZpbmRUYXJnZXQgKHRoZXJlZm9yZSAkKSBpcyBjYWxsZWQgdHdpY2UsIG9uY2UgZm9yIG1hdGNoIGFuZCBvbmNlIGZvclxuICAgICAgICAvLyBzZXR0aW5nIGUuY3VycmVudFRhcmdldCwgZml4IHRoaXMgc28gaXQncyBvbmx5IG5lZWRlZCBvbmNlXG4gICAgICAgIHZhciBmaW5kVGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCwgcm9vdCkge1xuICAgICAgICAgICAgICB2YXIgaSwgYXJyYXkgPSBpc1N0cmluZyhzZWxlY3RvcikgPyBzZWxlY3RvckVuZ2luZShzZWxlY3Rvciwgcm9vdCkgOiBzZWxlY3RvclxuICAgICAgICAgICAgICBmb3IgKDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gcm9vdDsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBhcnJheS5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gdGFyZ2V0KSByZXR1cm4gdGFyZ2V0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgLCBoYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgdmFyIG1hdGNoID0gZmluZFRhcmdldChlLnRhcmdldCwgdGhpcylcbiAgICAgICAgICAgICAgaWYgKG1hdGNoKSBmbi5hcHBseShtYXRjaCwgYXJndW1lbnRzKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIC8vIF9fYmVhbkRlbCBpc24ndCBwbGVhc2FudCBidXQgaXQncyBhIHByaXZhdGUgZnVuY3Rpb24sIG5vdCBleHBvc2VkIG91dHNpZGUgb2YgQmVhblxuICAgICAgICBoYW5kbGVyLl9fYmVhbkRlbCA9IHtcbiAgICAgICAgICAgIGZ0ICAgICAgIDogZmluZFRhcmdldCAvLyBhdHRhY2ggaXQgaGVyZSBmb3IgY3VzdG9tRXZlbnRzIHRvIHVzZSB0b29cbiAgICAgICAgICAsIHNlbGVjdG9yIDogc2VsZWN0b3JcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlclxuICAgICAgfVxuXG4gICAgLCBmaXJlTGlzdGVuZXIgPSBXM0NfTU9ERUwgPyBmdW5jdGlvbiAoaXNOYXRpdmUsIHR5cGUsIGVsZW1lbnQpIHtcbiAgICAgICAgLy8gbW9kZXJuIGJyb3dzZXJzLCBkbyBhIHByb3BlciBkaXNwYXRjaEV2ZW50KClcbiAgICAgICAgdmFyIGV2dCA9IGRvYy5jcmVhdGVFdmVudChpc05hdGl2ZSA/ICdIVE1MRXZlbnRzJyA6ICdVSUV2ZW50cycpXG4gICAgICAgIGV2dFtpc05hdGl2ZSA/ICdpbml0RXZlbnQnIDogJ2luaXRVSUV2ZW50J10odHlwZSwgdHJ1ZSwgdHJ1ZSwgd2luLCAxKVxuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KVxuICAgICAgfSA6IGZ1bmN0aW9uIChpc05hdGl2ZSwgdHlwZSwgZWxlbWVudCkge1xuICAgICAgICAvLyBvbGQgYnJvd3NlciB1c2Ugb25wcm9wZXJ0eWNoYW5nZSwganVzdCBpbmNyZW1lbnQgYSBjdXN0b20gcHJvcGVydHkgdG8gdHJpZ2dlciB0aGUgZXZlbnRcbiAgICAgICAgZWxlbWVudCA9IHRhcmdldEVsZW1lbnQoZWxlbWVudCwgaXNOYXRpdmUpXG4gICAgICAgIGlzTmF0aXZlID8gZWxlbWVudC5maXJlRXZlbnQoJ29uJyArIHR5cGUsIGRvYy5jcmVhdGVFdmVudE9iamVjdCgpKSA6IGVsZW1lbnRbJ19vbicgKyB0eXBlXSsrXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIFB1YmxpYyBBUEk6IG9mZigpLCBvbigpLCBhZGQoKSwgKHJlbW92ZSgpKSwgb25lKCksIGZpcmUoKSwgY2xvbmUoKVxuICAgICAgICAqL1xuXG4gICAgICAvKipcbiAgICAgICAgKiBvZmYoZWxlbWVudFssIGV2ZW50VHlwZShzKVssIGhhbmRsZXIgXV0pXG4gICAgICAgICovXG4gICAgLCBvZmYgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZVNwZWMsIGZuKSB7XG4gICAgICAgIHZhciBpc1R5cGVTdHIgPSBpc1N0cmluZyh0eXBlU3BlYylcbiAgICAgICAgICAsIGssIHR5cGUsIG5hbWVzcGFjZXMsIGlcblxuICAgICAgICBpZiAoaXNUeXBlU3RyICYmIHR5cGVTcGVjLmluZGV4T2YoJyAnKSA+IDApIHtcbiAgICAgICAgICAvLyBvZmYoZWwsICd0MSB0MiB0MycsIGZuKSBvciBvZmYoZWwsICd0MSB0MiB0MycpXG4gICAgICAgICAgdHlwZVNwZWMgPSBzdHIyYXJyKHR5cGVTcGVjKVxuICAgICAgICAgIGZvciAoaSA9IHR5cGVTcGVjLmxlbmd0aDsgaS0tOylcbiAgICAgICAgICAgIG9mZihlbGVtZW50LCB0eXBlU3BlY1tpXSwgZm4pXG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGUgPSBpc1R5cGVTdHIgJiYgdHlwZVNwZWMucmVwbGFjZShuYW1lUmVnZXgsICcnKVxuICAgICAgICBpZiAodHlwZSAmJiBjdXN0b21FdmVudHNbdHlwZV0pIHR5cGUgPSBjdXN0b21FdmVudHNbdHlwZV0uYmFzZVxuXG4gICAgICAgIGlmICghdHlwZVNwZWMgfHwgaXNUeXBlU3RyKSB7XG4gICAgICAgICAgLy8gb2ZmKGVsKSBvciBvZmYoZWwsIHQxLm5zKSBvciBvZmYoZWwsIC5ucykgb3Igb2ZmKGVsLCAubnMxLm5zMi5uczMpXG4gICAgICAgICAgaWYgKG5hbWVzcGFjZXMgPSBpc1R5cGVTdHIgJiYgdHlwZVNwZWMucmVwbGFjZShuYW1lc3BhY2VSZWdleCwgJycpKSBuYW1lc3BhY2VzID0gc3RyMmFycihuYW1lc3BhY2VzLCAnLicpXG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoZWxlbWVudCwgdHlwZSwgZm4sIG5hbWVzcGFjZXMpXG4gICAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih0eXBlU3BlYykpIHtcbiAgICAgICAgICAvLyBvZmYoZWwsIGZuKVxuICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGVsZW1lbnQsIG51bGwsIHR5cGVTcGVjKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG9mZihlbCwgeyB0MTogZm4xLCB0MiwgZm4yIH0pXG4gICAgICAgICAgZm9yIChrIGluIHR5cGVTcGVjKSB7XG4gICAgICAgICAgICBpZiAodHlwZVNwZWMuaGFzT3duUHJvcGVydHkoaykpIG9mZihlbGVtZW50LCBrLCB0eXBlU3BlY1trXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBvbihlbGVtZW50LCBldmVudFR5cGUocylbLCBzZWxlY3Rvcl0sIGhhbmRsZXJbLCBhcmdzIF0pXG4gICAgICAgICovXG4gICAgLCBvbiA9IGZ1bmN0aW9uKGVsZW1lbnQsIGV2ZW50cywgc2VsZWN0b3IsIGZuKSB7XG4gICAgICAgIHZhciBvcmlnaW5hbEZuLCB0eXBlLCB0eXBlcywgaSwgYXJncywgZW50cnksIGZpcnN0XG5cbiAgICAgICAgLy9UT0RPOiB0aGUgdW5kZWZpbmVkIGNoZWNrIG1lYW5zIHlvdSBjYW4ndCBwYXNzIGFuICdhcmdzJyBhcmd1bWVudCwgZml4IHRoaXMgcGVyaGFwcz9cbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIGV2ZW50cyA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgIC8vVE9ETzogdGhpcyBjYW4ndCBoYW5kbGUgZGVsZWdhdGVkIGV2ZW50c1xuICAgICAgICAgIGZvciAodHlwZSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcbiAgICAgICAgICAgICAgb24uY2FsbCh0aGlzLCBlbGVtZW50LCB0eXBlLCBldmVudHNbdHlwZV0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHNlbGVjdG9yKSkge1xuICAgICAgICAgIC8vIGRlbGVnYXRlZCBldmVudFxuICAgICAgICAgIG9yaWdpbmFsRm4gPSBmblxuICAgICAgICAgIGFyZ3MgICAgICAgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgNClcbiAgICAgICAgICBmbiAgICAgICAgID0gZGVsZWdhdGUoc2VsZWN0b3IsIG9yaWdpbmFsRm4sIHNlbGVjdG9yRW5naW5lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MgICAgICAgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMylcbiAgICAgICAgICBmbiAgICAgICAgID0gb3JpZ2luYWxGbiA9IHNlbGVjdG9yXG4gICAgICAgIH1cblxuICAgICAgICB0eXBlcyA9IHN0cjJhcnIoZXZlbnRzKVxuXG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3Igb25lKCksIHdyYXAgaW4gYSBzZWxmLXJlbW92aW5nIGhhbmRsZXJcbiAgICAgICAgaWYgKHRoaXMgPT09IE9ORSkge1xuICAgICAgICAgIGZuID0gb25jZShvZmYsIGVsZW1lbnQsIGV2ZW50cywgZm4sIG9yaWdpbmFsRm4pXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSB0eXBlcy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAvLyBhZGQgbmV3IGhhbmRsZXIgdG8gdGhlIHJlZ2lzdHJ5IGFuZCBjaGVjayBpZiBpdCdzIHRoZSBmaXJzdCBmb3IgdGhpcyBlbGVtZW50L3R5cGVcbiAgICAgICAgICBmaXJzdCA9IHJlZ2lzdHJ5LnB1dChlbnRyeSA9IG5ldyBSZWdFbnRyeShcbiAgICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgLCB0eXBlc1tpXS5yZXBsYWNlKG5hbWVSZWdleCwgJycpIC8vIGV2ZW50IHR5cGVcbiAgICAgICAgICAgICwgZm5cbiAgICAgICAgICAgICwgb3JpZ2luYWxGblxuICAgICAgICAgICAgLCBzdHIyYXJyKHR5cGVzW2ldLnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSwgJy4nKSAvLyBuYW1lc3BhY2VzXG4gICAgICAgICAgICAsIGFyZ3NcbiAgICAgICAgICAgICwgZmFsc2UgLy8gbm90IHJvb3RcbiAgICAgICAgICApKVxuICAgICAgICAgIGlmIChlbnRyeVtldmVudFN1cHBvcnRdICYmIGZpcnN0KSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBldmVudCBvZiB0aGlzIHR5cGUgb24gdGhpcyBlbGVtZW50LCBhZGQgcm9vdCBsaXN0ZW5lclxuICAgICAgICAgICAgbGlzdGVuZXIoZWxlbWVudCwgZW50cnkuZXZlbnRUeXBlLCB0cnVlLCBlbnRyeS5jdXN0b21UeXBlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIGFkZChlbGVtZW50Wywgc2VsZWN0b3JdLCBldmVudFR5cGUocyksIGhhbmRsZXJbLCBhcmdzIF0pXG4gICAgICAgICpcbiAgICAgICAgKiBEZXByZWNhdGVkOiBrZXB0IChmb3Igbm93KSBmb3IgYmFja3dhcmQtY29tcGF0aWJpbGl0eVxuICAgICAgICAqL1xuICAgICwgYWRkID0gZnVuY3Rpb24gKGVsZW1lbnQsIGV2ZW50cywgZm4sIGRlbGZuKSB7XG4gICAgICAgIHJldHVybiBvbi5hcHBseShcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAsICFpc1N0cmluZyhmbilcbiAgICAgICAgICAgICAgPyBzbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgOiBbIGVsZW1lbnQsIGZuLCBldmVudHMsIGRlbGZuIF0uY29uY2F0KGFyZ3VtZW50cy5sZW5ndGggPiAzID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDUpIDogW10pXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogb25lKGVsZW1lbnQsIGV2ZW50VHlwZShzKVssIHNlbGVjdG9yXSwgaGFuZGxlclssIGFyZ3MgXSlcbiAgICAgICAgKi9cbiAgICAsIG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG9uLmFwcGx5KE9ORSwgYXJndW1lbnRzKVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBmaXJlKGVsZW1lbnQsIGV2ZW50VHlwZShzKVssIGFyZ3MgXSlcbiAgICAgICAgKlxuICAgICAgICAqIFRoZSBvcHRpb25hbCAnYXJncycgYXJndW1lbnQgbXVzdCBiZSBhbiBhcnJheSwgaWYgbm8gJ2FyZ3MnIGFyZ3VtZW50IGlzIHByb3ZpZGVkXG4gICAgICAgICogdGhlbiB3ZSBjYW4gdXNlIHRoZSBicm93c2VyJ3MgRE9NIGV2ZW50IHN5c3RlbSwgb3RoZXJ3aXNlIHdlIHRyaWdnZXIgaGFuZGxlcnMgbWFudWFsbHlcbiAgICAgICAgKi9cbiAgICAsIGZpcmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgYXJncykge1xuICAgICAgICB2YXIgdHlwZXMgPSBzdHIyYXJyKHR5cGUpXG4gICAgICAgICAgLCBpLCBqLCBsLCBuYW1lcywgaGFuZGxlcnNcblxuICAgICAgICBmb3IgKGkgPSB0eXBlcy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICB0eXBlID0gdHlwZXNbaV0ucmVwbGFjZShuYW1lUmVnZXgsICcnKVxuICAgICAgICAgIGlmIChuYW1lcyA9IHR5cGVzW2ldLnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSkgbmFtZXMgPSBzdHIyYXJyKG5hbWVzLCAnLicpXG4gICAgICAgICAgaWYgKCFuYW1lcyAmJiAhYXJncyAmJiBlbGVtZW50W2V2ZW50U3VwcG9ydF0pIHtcbiAgICAgICAgICAgIGZpcmVMaXN0ZW5lcihuYXRpdmVFdmVudHNbdHlwZV0sIHR5cGUsIGVsZW1lbnQpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG5vbi1uYXRpdmUgZXZlbnQsIGVpdGhlciBiZWNhdXNlIG9mIGEgbmFtZXNwYWNlLCBhcmd1bWVudHMgb3IgYSBub24gRE9NIGVsZW1lbnRcbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgbGlzdGVuZXJzIGFuZCBtYW51YWxseSAnZmlyZSdcbiAgICAgICAgICAgIGhhbmRsZXJzID0gcmVnaXN0cnkuZ2V0KGVsZW1lbnQsIHR5cGUsIG51bGwsIGZhbHNlKVxuICAgICAgICAgICAgYXJncyA9IFtmYWxzZV0uY29uY2F0KGFyZ3MpXG4gICAgICAgICAgICBmb3IgKGogPSAwLCBsID0gaGFuZGxlcnMubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChoYW5kbGVyc1tqXS5pbk5hbWVzcGFjZXMobmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcnNbal0uaGFuZGxlci5hcHBseShlbGVtZW50LCBhcmdzKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIGNsb25lKGRzdEVsZW1lbnQsIHNyY0VsZW1lbnRbLCBldmVudFR5cGUgXSlcbiAgICAgICAgKlxuICAgICAgICAqIFRPRE86IHBlcmhhcHMgZm9yIGNvbnNpc3RlbmN5IHdlIHNob3VsZCBhbGxvdyB0aGUgc2FtZSBmbGV4aWJpbGl0eSBpbiB0eXBlIHNwZWNpZmllcnM/XG4gICAgICAgICovXG4gICAgLCBjbG9uZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBmcm9tLCB0eXBlKSB7XG4gICAgICAgIHZhciBoYW5kbGVycyA9IHJlZ2lzdHJ5LmdldChmcm9tLCB0eXBlLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICAsIGwgPSBoYW5kbGVycy5sZW5ndGhcbiAgICAgICAgICAsIGkgPSAwXG4gICAgICAgICAgLCBhcmdzLCBiZWFuRGVsXG5cbiAgICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoaGFuZGxlcnNbaV0ub3JpZ2luYWwpIHtcbiAgICAgICAgICAgIGFyZ3MgPSBbIGVsZW1lbnQsIGhhbmRsZXJzW2ldLnR5cGUgXVxuICAgICAgICAgICAgaWYgKGJlYW5EZWwgPSBoYW5kbGVyc1tpXS5oYW5kbGVyLl9fYmVhbkRlbCkgYXJncy5wdXNoKGJlYW5EZWwuc2VsZWN0b3IpXG4gICAgICAgICAgICBhcmdzLnB1c2goaGFuZGxlcnNbaV0ub3JpZ2luYWwpXG4gICAgICAgICAgICBvbi5hcHBseShudWxsLCBhcmdzKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgfVxuXG4gICAgLCBiZWFuID0ge1xuICAgICAgICAgIG9uICAgICAgICAgICAgICAgIDogb25cbiAgICAgICAgLCBhZGQgICAgICAgICAgICAgICA6IGFkZFxuICAgICAgICAsIG9uZSAgICAgICAgICAgICAgIDogb25lXG4gICAgICAgICwgb2ZmICAgICAgICAgICAgICAgOiBvZmZcbiAgICAgICAgLCByZW1vdmUgICAgICAgICAgICA6IG9mZlxuICAgICAgICAsIGNsb25lICAgICAgICAgICAgIDogY2xvbmVcbiAgICAgICAgLCBmaXJlICAgICAgICAgICAgICA6IGZpcmVcbiAgICAgICAgLCBFdmVudCAgICAgICAgICAgICA6IEV2ZW50XG4gICAgICAgICwgc2V0U2VsZWN0b3JFbmdpbmUgOiBzZXRTZWxlY3RvckVuZ2luZVxuICAgICAgICAsIG5vQ29uZmxpY3QgICAgICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29udGV4dFtuYW1lXSA9IG9sZFxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgLy8gZm9yIElFLCBjbGVhbiB1cCBvbiB1bmxvYWQgdG8gYXZvaWQgbGVha3NcbiAgaWYgKHdpbi5hdHRhY2hFdmVudCkge1xuICAgIHZhciBjbGVhbnVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGksIGVudHJpZXMgPSByZWdpc3RyeS5lbnRyaWVzKClcbiAgICAgIGZvciAoaSBpbiBlbnRyaWVzKSB7XG4gICAgICAgIGlmIChlbnRyaWVzW2ldLnR5cGUgJiYgZW50cmllc1tpXS50eXBlICE9PSAndW5sb2FkJykgb2ZmKGVudHJpZXNbaV0uZWxlbWVudCwgZW50cmllc1tpXS50eXBlKVxuICAgICAgfVxuICAgICAgd2luLmRldGFjaEV2ZW50KCdvbnVubG9hZCcsIGNsZWFudXApXG4gICAgICB3aW4uQ29sbGVjdEdhcmJhZ2UgJiYgd2luLkNvbGxlY3RHYXJiYWdlKClcbiAgICB9XG4gICAgd2luLmF0dGFjaEV2ZW50KCdvbnVubG9hZCcsIGNsZWFudXApXG4gIH1cblxuICAvLyBpbml0aWFsaXplIHNlbGVjdG9yIGVuZ2luZSB0byBpbnRlcm5hbCBkZWZhdWx0IChxU0Egb3IgdGhyb3cgRXJyb3IpXG4gIHNldFNlbGVjdG9yRW5naW5lKClcblxuICByZXR1cm4gYmVhblxufSk7IiwiLyohXG4gICogQm9uem86IERPTSBVdGlsaXR5IChjKSBEdXN0aW4gRGlheiAyMDEyXG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9ib256b1xuICAqIExpY2Vuc2UgTUlUXG4gICovXG4oZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KSgnYm9uem8nLCB0aGlzLCBmdW5jdGlvbigpIHtcbiAgdmFyIHdpbiA9IHdpbmRvd1xuICAgICwgZG9jID0gd2luLmRvY3VtZW50XG4gICAgLCBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudFxuICAgICwgcGFyZW50Tm9kZSA9ICdwYXJlbnROb2RlJ1xuICAgICwgc3BlY2lhbEF0dHJpYnV0ZXMgPSAvXihjaGVja2VkfHZhbHVlfHNlbGVjdGVkfGRpc2FibGVkKSQvaVxuICAgICAgLy8gdGFncyB0aGF0IHdlIGhhdmUgdHJvdWJsZSBpbnNlcnRpbmcgKmludG8qXG4gICAgLCBzcGVjaWFsVGFncyA9IC9eKHNlbGVjdHxmaWVsZHNldHx0YWJsZXx0Ym9keXx0Zm9vdHx0ZHx0cnxjb2xncm91cCkkL2lcbiAgICAsIHNpbXBsZVNjcmlwdFRhZ1JlID0gL1xccyo8c2NyaXB0ICtzcmM9WydcIl0oW14nXCJdKylbJ1wiXT4vXG4gICAgLCB0YWJsZSA9IFsnPHRhYmxlPicsICc8L3RhYmxlPicsIDFdXG4gICAgLCB0ZCA9IFsnPHRhYmxlPjx0Ym9keT48dHI+JywgJzwvdHI+PC90Ym9keT48L3RhYmxlPicsIDNdXG4gICAgLCBvcHRpb24gPSBbJzxzZWxlY3Q+JywgJzwvc2VsZWN0PicsIDFdXG4gICAgLCBub3Njb3BlID0gWydfJywgJycsIDAsIDFdXG4gICAgLCB0YWdNYXAgPSB7IC8vIHRhZ3MgdGhhdCB3ZSBoYXZlIHRyb3VibGUgKmluc2VydGluZypcbiAgICAgICAgICB0aGVhZDogdGFibGUsIHRib2R5OiB0YWJsZSwgdGZvb3Q6IHRhYmxlLCBjb2xncm91cDogdGFibGUsIGNhcHRpb246IHRhYmxlXG4gICAgICAgICwgdHI6IFsnPHRhYmxlPjx0Ym9keT4nLCAnPC90Ym9keT48L3RhYmxlPicsIDJdXG4gICAgICAgICwgdGg6IHRkICwgdGQ6IHRkXG4gICAgICAgICwgY29sOiBbJzx0YWJsZT48Y29sZ3JvdXA+JywgJzwvY29sZ3JvdXA+PC90YWJsZT4nLCAyXVxuICAgICAgICAsIGZpZWxkc2V0OiBbJzxmb3JtPicsICc8L2Zvcm0+JywgMV1cbiAgICAgICAgLCBsZWdlbmQ6IFsnPGZvcm0+PGZpZWxkc2V0PicsICc8L2ZpZWxkc2V0PjwvZm9ybT4nLCAyXVxuICAgICAgICAsIG9wdGlvbjogb3B0aW9uLCBvcHRncm91cDogb3B0aW9uXG4gICAgICAgICwgc2NyaXB0OiBub3Njb3BlLCBzdHlsZTogbm9zY29wZSwgbGluazogbm9zY29wZSwgcGFyYW06IG5vc2NvcGUsIGJhc2U6IG5vc2NvcGVcbiAgICAgIH1cbiAgICAsIHN0YXRlQXR0cmlidXRlcyA9IC9eKGNoZWNrZWR8c2VsZWN0ZWR8ZGlzYWJsZWQpJC9cbiAgICAsIGllID0gL21zaWUvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpXG4gICAgLCBoYXNDbGFzcywgYWRkQ2xhc3MsIHJlbW92ZUNsYXNzXG4gICAgLCB1aWRNYXAgPSB7fVxuICAgICwgdXVpZHMgPSAwXG4gICAgLCBkaWdpdCA9IC9eLT9bXFxkXFwuXSskL1xuICAgICwgZGF0dHIgPSAvXmRhdGEtKC4rKSQvXG4gICAgLCBweCA9ICdweCdcbiAgICAsIHNldEF0dHJpYnV0ZSA9ICdzZXRBdHRyaWJ1dGUnXG4gICAgLCBnZXRBdHRyaWJ1dGUgPSAnZ2V0QXR0cmlidXRlJ1xuICAgICwgYnlUYWcgPSAnZ2V0RWxlbWVudHNCeVRhZ05hbWUnXG4gICAgLCBmZWF0dXJlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgZS5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiN4XCI+eDwvYT48dGFibGUgc3R5bGU9XCJmbG9hdDpsZWZ0O1wiPjwvdGFibGU+J1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWZFeHRlbmRlZDogZVtieVRhZ10oJ2EnKVswXVtnZXRBdHRyaWJ1dGVdKCdocmVmJykgIT0gJyN4JyAvLyBJRSA8IDhcbiAgICAgICAgLCBhdXRvVGJvZHk6IGVbYnlUYWddKCd0Ym9keScpLmxlbmd0aCAhPT0gMCAvLyBJRSA8IDhcbiAgICAgICAgLCBjb21wdXRlZFN0eWxlOiBkb2MuZGVmYXVsdFZpZXcgJiYgZG9jLmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGVcbiAgICAgICAgLCBjc3NGbG9hdDogZVtieVRhZ10oJ3RhYmxlJylbMF0uc3R5bGUuc3R5bGVGbG9hdCA/ICdzdHlsZUZsb2F0JyA6ICdjc3NGbG9hdCdcbiAgICAgICAgLCB0cmFuc2Zvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9wcyA9IFsndHJhbnNmb3JtJywgJ3dlYmtpdFRyYW5zZm9ybScsICdNb3pUcmFuc2Zvcm0nLCAnT1RyYW5zZm9ybScsICdtc1RyYW5zZm9ybSddLCBpXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHByb3BzW2ldIGluIGUuc3R5bGUpIHJldHVybiBwcm9wc1tpXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0oKVxuICAgICAgICAsIGNsYXNzTGlzdDogJ2NsYXNzTGlzdCcgaW4gZVxuICAgICAgICAsIG9wYXNpdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZG9jLmNyZWF0ZUVsZW1lbnQoJ2EnKS5zdHlsZS5vcGFjaXR5ICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgIH0oKVxuICAgICAgICB9XG4gICAgICB9KClcbiAgICAsIHRyaW1SZXBsYWNlID0gLyheXFxzKnxcXHMqJCkvZ1xuICAgICwgd2hpdGVzcGFjZVJlZ2V4ID0gL1xccysvXG4gICAgLCB0b1N0cmluZyA9IFN0cmluZy5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAsIHVuaXRsZXNzID0geyBsaW5lSGVpZ2h0OiAxLCB6b29tOiAxLCB6SW5kZXg6IDEsIG9wYWNpdHk6IDEsIGJveEZsZXg6IDEsIFdlYmtpdEJveEZsZXg6IDEsIE1vekJveEZsZXg6IDEgfVxuICAgICwgcXVlcnkgPSBkb2MucXVlcnlTZWxlY3RvckFsbCAmJiBmdW5jdGlvbiAoc2VsZWN0b3IpIHsgcmV0dXJuIGRvYy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSB9XG4gICAgLCB0cmltID0gU3RyaW5nLnByb3RvdHlwZS50cmltID9cbiAgICAgICAgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICByZXR1cm4gcy50cmltKClcbiAgICAgICAgfSA6XG4gICAgICAgIGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgcmV0dXJuIHMucmVwbGFjZSh0cmltUmVwbGFjZSwgJycpXG4gICAgICAgIH1cblxuICAgICwgZ2V0U3R5bGUgPSBmZWF0dXJlcy5jb21wdXRlZFN0eWxlXG4gICAgICAgID8gZnVuY3Rpb24gKGVsLCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gbnVsbFxuICAgICAgICAgICAgICAsIGNvbXB1dGVkID0gZG9jLmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWwsICcnKVxuICAgICAgICAgICAgY29tcHV0ZWQgJiYgKHZhbHVlID0gY29tcHV0ZWRbcHJvcGVydHldKVxuICAgICAgICAgICAgcmV0dXJuIGVsLnN0eWxlW3Byb3BlcnR5XSB8fCB2YWx1ZVxuICAgICAgICAgIH1cbiAgICAgICAgOiAhKGllICYmIGh0bWwuY3VycmVudFN0eWxlKVxuICAgICAgICAgID8gZnVuY3Rpb24gKGVsLCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWwuc3R5bGVbcHJvcGVydHldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOlxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlcbiAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd8bnVtYmVyfVxuICAgICAgICAgICAqL1xuICAgICAgICAgIGZ1bmN0aW9uIChlbCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgIHZhciB2YWwsIHZhbHVlXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gJ29wYWNpdHknICYmICFmZWF0dXJlcy5vcGFzaXR5KSB7XG4gICAgICAgICAgICAgIHZhbCA9IDEwMFxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhbCA9IGVsWydmaWx0ZXJzJ11bJ0RYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkFscGhhJ10ub3BhY2l0eVxuICAgICAgICAgICAgICB9IGNhdGNoIChlMSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICB2YWwgPSBlbFsnZmlsdGVycyddKCdhbHBoYScpLm9wYWNpdHlcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlMikge31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdmFsIC8gMTAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IGVsLmN1cnJlbnRTdHlsZSA/IGVsLmN1cnJlbnRTdHlsZVtwcm9wZXJ0eV0gOiBudWxsXG4gICAgICAgICAgICByZXR1cm4gZWwuc3R5bGVbcHJvcGVydHldIHx8IHZhbHVlXG4gICAgICAgICAgfVxuXG4gIGZ1bmN0aW9uIGlzTm9kZShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5ub2RlTmFtZSAmJiAobm9kZS5ub2RlVHlwZSA9PSAxIHx8IG5vZGUubm9kZVR5cGUgPT0gMTEpXG4gIH1cblxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShub2RlLCBob3N0LCBjbG9uZSkge1xuICAgIHZhciBpLCBsLCByZXRcbiAgICBpZiAodHlwZW9mIG5vZGUgPT0gJ3N0cmluZycpIHJldHVybiBib256by5jcmVhdGUobm9kZSlcbiAgICBpZiAoaXNOb2RlKG5vZGUpKSBub2RlID0gWyBub2RlIF1cbiAgICBpZiAoY2xvbmUpIHtcbiAgICAgIHJldCA9IFtdIC8vIGRvbid0IGNoYW5nZSBvcmlnaW5hbCBhcnJheVxuICAgICAgZm9yIChpID0gMCwgbCA9IG5vZGUubGVuZ3RoOyBpIDwgbDsgaSsrKSByZXRbaV0gPSBjbG9uZU5vZGUoaG9zdCwgbm9kZVtpXSlcbiAgICAgIHJldHVybiByZXRcbiAgICB9XG4gICAgcmV0dXJuIG5vZGVcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYyBhIGNsYXNzIG5hbWUgdG8gdGVzdFxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gY2xhc3NSZWcoYykge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCcoXnxcXFxccyspJyArIGMgKyAnKFxcXFxzK3wkKScpXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0JvbnpvfEFycmF5fSBhclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCwgbnVtYmVyLCAoQm9uem98QXJyYXkpKX0gZm5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfc2NvcGVcbiAgICogQHBhcmFtIHtib29sZWFuPX0gb3B0X3JldlxuICAgKiBAcmV0dXJuIHtCb256b3xBcnJheX1cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2goYXIsIGZuLCBvcHRfc2NvcGUsIG9wdF9yZXYpIHtcbiAgICB2YXIgaW5kLCBpID0gMCwgbCA9IGFyLmxlbmd0aFxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpbmQgPSBvcHRfcmV2ID8gYXIubGVuZ3RoIC0gaSAtIDEgOiBpXG4gICAgICBmbi5jYWxsKG9wdF9zY29wZSB8fCBhcltpbmRdLCBhcltpbmRdLCBpbmQsIGFyKVxuICAgIH1cbiAgICByZXR1cm4gYXJcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Qm9uem98QXJyYXl9IGFyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LCBudW1iZXIsIChCb256b3xBcnJheSkpfSBmblxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9zY29wZVxuICAgKiBAcmV0dXJuIHtCb256b3xBcnJheX1cbiAgICovXG4gIGZ1bmN0aW9uIGRlZXBFYWNoKGFyLCBmbiwgb3B0X3Njb3BlKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChpc05vZGUoYXJbaV0pKSB7XG4gICAgICAgIGRlZXBFYWNoKGFyW2ldLmNoaWxkTm9kZXMsIGZuLCBvcHRfc2NvcGUpXG4gICAgICAgIGZuLmNhbGwob3B0X3Njb3BlIHx8IGFyW2ldLCBhcltpXSwgaSwgYXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhclxuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gY2FtZWxpemUocykge1xuICAgIHJldHVybiBzLnJlcGxhY2UoLy0oLikvZywgZnVuY3Rpb24gKG0sIG0xKSB7XG4gICAgICByZXR1cm4gbTEudG9VcHBlckNhc2UoKVxuICAgIH0pXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBkZWNhbWVsaXplKHMpIHtcbiAgICByZXR1cm4gcyA/IHMucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKSA6IHNcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGZ1bmN0aW9uIGRhdGEoZWwpIHtcbiAgICBlbFtnZXRBdHRyaWJ1dGVdKCdkYXRhLW5vZGUtdWlkJykgfHwgZWxbc2V0QXR0cmlidXRlXSgnZGF0YS1ub2RlLXVpZCcsICsrdXVpZHMpXG4gICAgdmFyIHVpZCA9IGVsW2dldEF0dHJpYnV0ZV0oJ2RhdGEtbm9kZS11aWQnKVxuICAgIHJldHVybiB1aWRNYXBbdWlkXSB8fCAodWlkTWFwW3VpZF0gPSB7fSlcbiAgfVxuXG5cbiAgLyoqXG4gICAqIHJlbW92ZXMgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGFuIGVsZW1lbnRcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgKi9cbiAgZnVuY3Rpb24gY2xlYXJEYXRhKGVsKSB7XG4gICAgdmFyIHVpZCA9IGVsW2dldEF0dHJpYnV0ZV0oJ2RhdGEtbm9kZS11aWQnKVxuICAgIGlmICh1aWQpIGRlbGV0ZSB1aWRNYXBbdWlkXVxuICB9XG5cblxuICBmdW5jdGlvbiBkYXRhVmFsdWUoZCkge1xuICAgIHZhciBmXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZCA9PT0gbnVsbCB8fCBkID09PSB1bmRlZmluZWQpID8gdW5kZWZpbmVkIDpcbiAgICAgICAgZCA9PT0gJ3RydWUnID8gdHJ1ZSA6XG4gICAgICAgICAgZCA9PT0gJ2ZhbHNlJyA/IGZhbHNlIDpcbiAgICAgICAgICAgIGQgPT09ICdudWxsJyA/IG51bGwgOlxuICAgICAgICAgICAgICAoZiA9IHBhcnNlRmxvYXQoZCkpID09IGQgPyBmIDogZDtcbiAgICB9IGNhdGNoKGUpIHt9XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtCb256b3xBcnJheX0gYXJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsIG51bWJlciwgKEJvbnpvfEFycmF5KSl9IGZuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3Njb3BlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgYHNvbWVgdGhpbmcgd2FzIGZvdW5kXG4gICAqL1xuICBmdW5jdGlvbiBzb21lKGFyLCBmbiwgb3B0X3Njb3BlKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBhci5sZW5ndGg7IGkgPCBqOyArK2kpIGlmIChmbi5jYWxsKG9wdF9zY29wZSB8fCBudWxsLCBhcltpXSwgaSwgYXIpKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cblxuICAvKipcbiAgICogdGhpcyBjb3VsZCBiZSBhIGdpYW50IGVudW0gb2YgQ1NTIHByb3BlcnRpZXNcbiAgICogYnV0IGluIGZhdm9yIG9mIGZpbGUgc2l6ZSBzYW5zLWNsb3N1cmUgZGVhZGNvZGUgb3B0aW1pemF0aW9uc1xuICAgKiB3ZSdyZSBqdXN0IGFza2luZyBmb3IgYW55IG9sIHN0cmluZ1xuICAgKiB0aGVuIGl0IGdldHMgdHJhbnNmb3JtZWQgaW50byB0aGUgYXBwcm9wcmlhdGUgc3R5bGUgcHJvcGVydHkgZm9yIEpTIGFjY2Vzc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzdHlsZVByb3BlcnR5KHApIHtcbiAgICAgIChwID09ICd0cmFuc2Zvcm0nICYmIChwID0gZmVhdHVyZXMudHJhbnNmb3JtKSkgfHxcbiAgICAgICAgKC9edHJhbnNmb3JtLT9bT29dcmlnaW4kLy50ZXN0KHApICYmIChwID0gZmVhdHVyZXMudHJhbnNmb3JtICsgJ09yaWdpbicpKSB8fFxuICAgICAgICAocCA9PSAnZmxvYXQnICYmIChwID0gZmVhdHVyZXMuY3NzRmxvYXQpKVxuICAgICAgcmV0dXJuIHAgPyBjYW1lbGl6ZShwKSA6IG51bGxcbiAgfVxuXG4gIC8vIHRoaXMgaW5zZXJ0IG1ldGhvZCBpcyBpbnRlbnNlXG4gIGZ1bmN0aW9uIGluc2VydCh0YXJnZXQsIGhvc3QsIGZuLCByZXYpIHtcbiAgICB2YXIgaSA9IDAsIHNlbGYgPSBob3N0IHx8IHRoaXMsIHIgPSBbXVxuICAgICAgLy8gdGFyZ2V0IG5vZGVzIGNvdWxkIGJlIGEgY3NzIHNlbGVjdG9yIGlmIGl0J3MgYSBzdHJpbmcgYW5kIGEgc2VsZWN0b3IgZW5naW5lIGlzIHByZXNlbnRcbiAgICAgIC8vIG90aGVyd2lzZSwganVzdCB1c2UgdGFyZ2V0XG4gICAgICAsIG5vZGVzID0gcXVlcnkgJiYgdHlwZW9mIHRhcmdldCA9PSAnc3RyaW5nJyAmJiB0YXJnZXQuY2hhckF0KDApICE9ICc8JyA/IHF1ZXJ5KHRhcmdldCkgOiB0YXJnZXRcbiAgICAvLyBub3JtYWxpemUgZWFjaCBub2RlIGluIGNhc2UgaXQncyBzdGlsbCBhIHN0cmluZyBhbmQgd2UgbmVlZCB0byBjcmVhdGUgbm9kZXMgb24gdGhlIGZseVxuICAgIGVhY2gobm9ybWFsaXplKG5vZGVzKSwgZnVuY3Rpb24gKHQsIGopIHtcbiAgICAgIGVhY2goc2VsZiwgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGZuKHQsIHJbaSsrXSA9IGogPiAwID8gY2xvbmVOb2RlKHNlbGYsIGVsKSA6IGVsKVxuICAgICAgfSwgbnVsbCwgcmV2KVxuICAgIH0sIHRoaXMsIHJldilcbiAgICBzZWxmLmxlbmd0aCA9IGlcbiAgICBlYWNoKHIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmWy0taV0gPSBlXG4gICAgfSwgbnVsbCwgIXJldilcbiAgICByZXR1cm4gc2VsZlxuICB9XG5cblxuICAvKipcbiAgICogc2V0cyBhbiBlbGVtZW50IHRvIGFuIGV4cGxpY2l0IHgveSBwb3NpdGlvbiBvbiB0aGUgcGFnZVxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqIEBwYXJhbSB7P251bWJlcn0geFxuICAgKiBAcGFyYW0gez9udW1iZXJ9IHlcbiAgICovXG4gIGZ1bmN0aW9uIHh5KGVsLCB4LCB5KSB7XG4gICAgdmFyICRlbCA9IGJvbnpvKGVsKVxuICAgICAgLCBzdHlsZSA9ICRlbC5jc3MoJ3Bvc2l0aW9uJylcbiAgICAgICwgb2Zmc2V0ID0gJGVsLm9mZnNldCgpXG4gICAgICAsIHJlbCA9ICdyZWxhdGl2ZSdcbiAgICAgICwgaXNSZWwgPSBzdHlsZSA9PSByZWxcbiAgICAgICwgZGVsdGEgPSBbcGFyc2VJbnQoJGVsLmNzcygnbGVmdCcpLCAxMCksIHBhcnNlSW50KCRlbC5jc3MoJ3RvcCcpLCAxMCldXG5cbiAgICBpZiAoc3R5bGUgPT0gJ3N0YXRpYycpIHtcbiAgICAgICRlbC5jc3MoJ3Bvc2l0aW9uJywgcmVsKVxuICAgICAgc3R5bGUgPSByZWxcbiAgICB9XG5cbiAgICBpc05hTihkZWx0YVswXSkgJiYgKGRlbHRhWzBdID0gaXNSZWwgPyAwIDogZWwub2Zmc2V0TGVmdClcbiAgICBpc05hTihkZWx0YVsxXSkgJiYgKGRlbHRhWzFdID0gaXNSZWwgPyAwIDogZWwub2Zmc2V0VG9wKVxuXG4gICAgeCAhPSBudWxsICYmIChlbC5zdHlsZS5sZWZ0ID0geCAtIG9mZnNldC5sZWZ0ICsgZGVsdGFbMF0gKyBweClcbiAgICB5ICE9IG51bGwgJiYgKGVsLnN0eWxlLnRvcCA9IHkgLSBvZmZzZXQudG9wICsgZGVsdGFbMV0gKyBweClcblxuICB9XG5cbiAgLy8gY2xhc3NMaXN0IHN1cHBvcnQgZm9yIGNsYXNzIG1hbmFnZW1lbnRcbiAgLy8gYWx0aG8gdG8gYmUgZmFpciwgdGhlIGFwaSBzdWNrcyBiZWNhdXNlIGl0IHdvbid0IGFjY2VwdCBtdWx0aXBsZSBjbGFzc2VzIGF0IG9uY2VcbiAgaWYgKGZlYXR1cmVzLmNsYXNzTGlzdCkge1xuICAgIGhhc0NsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGMpXG4gICAgfVxuICAgIGFkZENsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGMpXG4gICAgfVxuICAgIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGMpXG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGhhc0NsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICByZXR1cm4gY2xhc3NSZWcoYykudGVzdChlbC5jbGFzc05hbWUpXG4gICAgfVxuICAgIGFkZENsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICBlbC5jbGFzc05hbWUgPSB0cmltKGVsLmNsYXNzTmFtZSArICcgJyArIGMpXG4gICAgfVxuICAgIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICBlbC5jbGFzc05hbWUgPSB0cmltKGVsLmNsYXNzTmFtZS5yZXBsYWNlKGNsYXNzUmVnKGMpLCAnICcpKVxuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIHRoaXMgYWxsb3dzIG1ldGhvZCBjYWxsaW5nIGZvciBzZXR0aW5nIHZhbHVlc1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBib256byhlbGVtZW50cykuY3NzKCdjb2xvcicsIGZ1bmN0aW9uIChlbCkge1xuICAgKiAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3JpZ2luYWwtY29sb3InKVxuICAgKiB9KVxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24gKEVsZW1lbnQpfHN0cmluZ31cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gc2V0dGVyKGVsLCB2KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2ID09ICdmdW5jdGlvbicgPyB2KGVsKSA6IHZcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjcm9sbCh4LCB5LCB0eXBlKSB7XG4gICAgdmFyIGVsID0gdGhpc1swXVxuICAgIGlmICghZWwpIHJldHVybiB0aGlzXG4gICAgaWYgKHggPT0gbnVsbCAmJiB5ID09IG51bGwpIHtcbiAgICAgIHJldHVybiAoaXNCb2R5KGVsKSA/IGdldFdpbmRvd1Njcm9sbCgpIDogeyB4OiBlbC5zY3JvbGxMZWZ0LCB5OiBlbC5zY3JvbGxUb3AgfSlbdHlwZV1cbiAgICB9XG4gICAgaWYgKGlzQm9keShlbCkpIHtcbiAgICAgIHdpbi5zY3JvbGxUbyh4LCB5KVxuICAgIH0gZWxzZSB7XG4gICAgICB4ICE9IG51bGwgJiYgKGVsLnNjcm9sbExlZnQgPSB4KVxuICAgICAgeSAhPSBudWxsICYmIChlbC5zY3JvbGxUb3AgPSB5KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0FycmF5LjxFbGVtZW50PnxFbGVtZW50fE5vZGV8c3RyaW5nfSBlbGVtZW50c1xuICAgKi9cbiAgZnVuY3Rpb24gQm9uem8oZWxlbWVudHMpIHtcbiAgICB0aGlzLmxlbmd0aCA9IDBcbiAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnRzID0gdHlwZW9mIGVsZW1lbnRzICE9PSAnc3RyaW5nJyAmJlxuICAgICAgICAhZWxlbWVudHMubm9kZVR5cGUgJiZcbiAgICAgICAgdHlwZW9mIGVsZW1lbnRzLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcgP1xuICAgICAgICAgIGVsZW1lbnRzIDpcbiAgICAgICAgICBbZWxlbWVudHNdXG4gICAgICB0aGlzLmxlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aFxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykgdGhpc1tpXSA9IGVsZW1lbnRzW2ldXG4gICAgfVxuICB9XG5cbiAgQm9uem8ucHJvdG90eXBlID0ge1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgICBnZXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpc1tpbmRleF0gfHwgbnVsbFxuICAgICAgfVxuXG4gICAgICAvLyBpdGV0YXRvcnNcbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbihFbGVtZW50fE5vZGUpfSBmblxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfc2NvcGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBlYWNoOiBmdW5jdGlvbiAoZm4sIG9wdF9zY29wZSkge1xuICAgICAgICByZXR1cm4gZWFjaCh0aGlzLCBmbiwgb3B0X3Njb3BlKVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9zY29wZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGRlZXBFYWNoOiBmdW5jdGlvbiAoZm4sIG9wdF9zY29wZSkge1xuICAgICAgICByZXR1cm4gZGVlcEVhY2godGhpcywgZm4sIG9wdF9zY29wZSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uPX0gb3B0X3JlamVjdFxuICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgKi9cbiAgICAsIG1hcDogZnVuY3Rpb24gKGZuLCBvcHRfcmVqZWN0KSB7XG4gICAgICAgIHZhciBtID0gW10sIG4sIGlcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBuID0gZm4uY2FsbCh0aGlzLCB0aGlzW2ldLCBpKVxuICAgICAgICAgIG9wdF9yZWplY3QgPyAob3B0X3JlamVjdChuKSAmJiBtLnB1c2gobikpIDogbS5wdXNoKG4pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1cbiAgICAgIH1cblxuICAgIC8vIHRleHQgYW5kIGh0bWwgaW5zZXJ0ZXJzIVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGggdGhlIEhUTUwgdG8gaW5zZXJ0XG4gICAgICogQHBhcmFtIHtib29sZWFuPX0gb3B0X3RleHQgd2hldGhlciB0byBzZXQgb3IgZ2V0IHRleHQgY29udGVudFxuICAgICAqIEByZXR1cm4ge0JvbnpvfHN0cmluZ31cbiAgICAgKi9cbiAgICAsIGh0bWw6IGZ1bmN0aW9uIChoLCBvcHRfdGV4dCkge1xuICAgICAgICB2YXIgbWV0aG9kID0gb3B0X3RleHRcbiAgICAgICAgICAgICAgPyBodG1sLnRleHRDb250ZW50ID09PSB1bmRlZmluZWQgPyAnaW5uZXJUZXh0JyA6ICd0ZXh0Q29udGVudCdcbiAgICAgICAgICAgICAgOiAnaW5uZXJIVE1MJ1xuICAgICAgICAgICwgdGhhdCA9IHRoaXNcbiAgICAgICAgICAsIGFwcGVuZCA9IGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgICAgICBlYWNoKG5vcm1hbGl6ZShoLCB0aGF0LCBpKSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChub2RlKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICwgdXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChvcHRfdGV4dCB8fCAodHlwZW9mIGggPT0gJ3N0cmluZycgJiYgIXNwZWNpYWxUYWdzLnRlc3QoZWwudGFnTmFtZSkpKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZWxbbWV0aG9kXSA9IGhcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICAgIGFwcGVuZChlbCwgaSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBoICE9ICd1bmRlZmluZWQnXG4gICAgICAgICAgPyB0aGlzLmVtcHR5KCkuZWFjaCh1cGRhdGVFbGVtZW50KVxuICAgICAgICAgIDogdGhpc1swXSA/IHRoaXNbMF1bbWV0aG9kXSA6ICcnXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfdGV4dCB0aGUgdGV4dCB0byBzZXQsIG90aGVyd2lzZSB0aGlzIGlzIGEgZ2V0dGVyXG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xzdHJpbmd9XG4gICAgICAgKi9cbiAgICAsIHRleHQ6IGZ1bmN0aW9uIChvcHRfdGV4dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5odG1sKG9wdF90ZXh0LCB0cnVlKVxuICAgICAgfVxuXG4gICAgICAvLyBtb3JlIHJlbGF0ZWQgaW5zZXJ0aW9uIG1ldGhvZHNcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSBub2RlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYXBwZW5kOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICBlYWNoKG5vcm1hbGl6ZShub2RlLCB0aGF0LCBpKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGkpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IG5vZGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBwcmVwZW5kOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICB2YXIgZmlyc3QgPSBlbC5maXJzdENoaWxkXG4gICAgICAgICAgZWFjaChub3JtYWxpemUobm9kZSwgdGhhdCwgaSksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBlbC5pbnNlcnRCZWZvcmUoaSwgZmlyc3QpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IHRhcmdldCB0aGUgbG9jYXRpb24gZm9yIHdoaWNoIHlvdSdsbCBpbnNlcnQgeW91ciBuZXcgY29udGVudFxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaG9zdCBhbiBvcHRpb25hbCBob3N0IHNjb3BlIChwcmltYXJpbHkgdXNlZCB3aGVuIGludGVncmF0ZWQgd2l0aCBFbmRlcilcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBhcHBlbmRUbzogZnVuY3Rpb24gKHRhcmdldCwgb3B0X2hvc3QpIHtcbiAgICAgICAgcmV0dXJuIGluc2VydC5jYWxsKHRoaXMsIHRhcmdldCwgb3B0X2hvc3QsIGZ1bmN0aW9uICh0LCBlbCkge1xuICAgICAgICAgIHQuYXBwZW5kQ2hpbGQoZWwpXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSB0YXJnZXQgdGhlIGxvY2F0aW9uIGZvciB3aGljaCB5b3UnbGwgaW5zZXJ0IHlvdXIgbmV3IGNvbnRlbnRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2hvc3QgYW4gb3B0aW9uYWwgaG9zdCBzY29wZSAocHJpbWFyaWx5IHVzZWQgd2hlbiBpbnRlZ3JhdGVkIHdpdGggRW5kZXIpXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcHJlcGVuZFRvOiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRfaG9zdCkge1xuICAgICAgICByZXR1cm4gaW5zZXJ0LmNhbGwodGhpcywgdGFyZ2V0LCBvcHRfaG9zdCwgZnVuY3Rpb24gKHQsIGVsKSB7XG4gICAgICAgICAgdC5pbnNlcnRCZWZvcmUoZWwsIHQuZmlyc3RDaGlsZClcbiAgICAgICAgfSwgMSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IG5vZGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBiZWZvcmU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgIGVhY2gobm9ybWFsaXplKG5vZGUsIHRoYXQsIGkpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgZWxbcGFyZW50Tm9kZV0uaW5zZXJ0QmVmb3JlKGksIGVsKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSBub2RlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYWZ0ZXI6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgIGVhY2gobm9ybWFsaXplKG5vZGUsIHRoYXQsIGkpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgZWxbcGFyZW50Tm9kZV0uaW5zZXJ0QmVmb3JlKGksIGVsLm5leHRTaWJsaW5nKVxuICAgICAgICAgIH0sIG51bGwsIDEpXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSB0YXJnZXQgdGhlIGxvY2F0aW9uIGZvciB3aGljaCB5b3UnbGwgaW5zZXJ0IHlvdXIgbmV3IGNvbnRlbnRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2hvc3QgYW4gb3B0aW9uYWwgaG9zdCBzY29wZSAocHJpbWFyaWx5IHVzZWQgd2hlbiBpbnRlZ3JhdGVkIHdpdGggRW5kZXIpXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRfaG9zdCkge1xuICAgICAgICByZXR1cm4gaW5zZXJ0LmNhbGwodGhpcywgdGFyZ2V0LCBvcHRfaG9zdCwgZnVuY3Rpb24gKHQsIGVsKSB7XG4gICAgICAgICAgdFtwYXJlbnROb2RlXS5pbnNlcnRCZWZvcmUoZWwsIHQpXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSB0YXJnZXQgdGhlIGxvY2F0aW9uIGZvciB3aGljaCB5b3UnbGwgaW5zZXJ0IHlvdXIgbmV3IGNvbnRlbnRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2hvc3QgYW4gb3B0aW9uYWwgaG9zdCBzY29wZSAocHJpbWFyaWx5IHVzZWQgd2hlbiBpbnRlZ3JhdGVkIHdpdGggRW5kZXIpXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgaW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uICh0YXJnZXQsIG9wdF9ob3N0KSB7XG4gICAgICAgIHJldHVybiBpbnNlcnQuY2FsbCh0aGlzLCB0YXJnZXQsIG9wdF9ob3N0LCBmdW5jdGlvbiAodCwgZWwpIHtcbiAgICAgICAgICB2YXIgc2libGluZyA9IHQubmV4dFNpYmxpbmdcbiAgICAgICAgICBzaWJsaW5nID9cbiAgICAgICAgICAgIHRbcGFyZW50Tm9kZV0uaW5zZXJ0QmVmb3JlKGVsLCBzaWJsaW5nKSA6XG4gICAgICAgICAgICB0W3BhcmVudE5vZGVdLmFwcGVuZENoaWxkKGVsKVxuICAgICAgICB9LCAxKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gbm9kZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHJlcGxhY2VXaXRoOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBib256byhub3JtYWxpemUobm9kZSkpLmluc2VydEFmdGVyKHRoaXMpXG4gICAgICAgIHJldHVybiB0aGlzLnJlbW92ZSgpXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaG9zdCBhbiBvcHRpb25hbCBob3N0IHNjb3BlIChwcmltYXJpbHkgdXNlZCB3aGVuIGludGVncmF0ZWQgd2l0aCBFbmRlcilcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBjbG9uZTogZnVuY3Rpb24gKG9wdF9ob3N0KSB7XG4gICAgICAgIHZhciByZXQgPSBbXSAvLyBkb24ndCBjaGFuZ2Ugb3JpZ2luYWwgYXJyYXlcbiAgICAgICAgICAsIGwsIGlcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSByZXRbaV0gPSBjbG9uZU5vZGUob3B0X2hvc3QgfHwgdGhpcywgdGhpc1tpXSlcbiAgICAgICAgcmV0dXJuIGJvbnpvKHJldClcbiAgICAgIH1cblxuICAgICAgLy8gY2xhc3MgbWFuYWdlbWVudFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYWRkQ2xhc3M6IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGMgPSB0b1N0cmluZy5jYWxsKGMpLnNwbGl0KHdoaXRlc3BhY2VSZWdleClcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAvLyB3ZSBgZWFjaGAgaGVyZSBzbyB5b3UgY2FuIGRvICRlbC5hZGRDbGFzcygnZm9vIGJhcicpXG4gICAgICAgICAgZWFjaChjLCBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgaWYgKGMgJiYgIWhhc0NsYXNzKGVsLCBzZXR0ZXIoZWwsIGMpKSlcbiAgICAgICAgICAgICAgYWRkQ2xhc3MoZWwsIHNldHRlcihlbCwgYykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGMgPSB0b1N0cmluZy5jYWxsKGMpLnNwbGl0KHdoaXRlc3BhY2VSZWdleClcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlYWNoKGMsIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICBpZiAoYyAmJiBoYXNDbGFzcyhlbCwgc2V0dGVyKGVsLCBjKSkpXG4gICAgICAgICAgICAgIHJlbW92ZUNsYXNzKGVsLCBzZXR0ZXIoZWwsIGMpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY1xuICAgICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgICAqL1xuICAgICwgaGFzQ2xhc3M6IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGMgPSB0b1N0cmluZy5jYWxsKGMpLnNwbGl0KHdoaXRlc3BhY2VSZWdleClcbiAgICAgICAgcmV0dXJuIHNvbWUodGhpcywgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgcmV0dXJuIHNvbWUoYywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIHJldHVybiBjICYmIGhhc0NsYXNzKGVsLCBjKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gYyBjbGFzc25hbWUgdG8gdG9nZ2xlXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfY29uZGl0aW9uIHdoZXRoZXIgdG8gYWRkIG9yIHJlbW92ZSB0aGUgY2xhc3Mgc3RyYWlnaHQgYXdheVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHRvZ2dsZUNsYXNzOiBmdW5jdGlvbiAoYywgb3B0X2NvbmRpdGlvbikge1xuICAgICAgICBjID0gdG9TdHJpbmcuY2FsbChjKS5zcGxpdCh3aGl0ZXNwYWNlUmVnZXgpXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWFjaChjLCBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgaWYgKGMpIHtcbiAgICAgICAgICAgICAgdHlwZW9mIG9wdF9jb25kaXRpb24gIT09ICd1bmRlZmluZWQnID9cbiAgICAgICAgICAgICAgICBvcHRfY29uZGl0aW9uID8gIWhhc0NsYXNzKGVsLCBjKSAmJiBhZGRDbGFzcyhlbCwgYykgOiByZW1vdmVDbGFzcyhlbCwgYykgOlxuICAgICAgICAgICAgICAgIGhhc0NsYXNzKGVsLCBjKSA/IHJlbW92ZUNsYXNzKGVsLCBjKSA6IGFkZENsYXNzKGVsLCBjKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIGRpc3BsYXkgdG9nZ2xlcnNcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF90eXBlIHVzZWZ1bCB0byBzZXQgYmFjayB0byBhbnl0aGluZyBvdGhlciB0aGFuIGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHNob3c6IGZ1bmN0aW9uIChvcHRfdHlwZSkge1xuICAgICAgICBvcHRfdHlwZSA9IHR5cGVvZiBvcHRfdHlwZSA9PSAnc3RyaW5nJyA/IG9wdF90eXBlIDogJydcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gb3B0X3R5cGVcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9jYWxsYmFja1xuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfdHlwZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHRvZ2dsZTogZnVuY3Rpb24gKG9wdF9jYWxsYmFjaywgb3B0X3R5cGUpIHtcbiAgICAgICAgb3B0X3R5cGUgPSB0eXBlb2Ygb3B0X3R5cGUgPT0gJ3N0cmluZycgPyBvcHRfdHlwZSA6ICcnO1xuICAgICAgICB0eXBlb2Ygb3B0X2NhbGxiYWNrICE9ICdmdW5jdGlvbicgJiYgKG9wdF9jYWxsYmFjayA9IG51bGwpXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IChlbC5vZmZzZXRXaWR0aCB8fCBlbC5vZmZzZXRIZWlnaHQpID8gJ25vbmUnIDogb3B0X3R5cGU7XG4gICAgICAgICAgb3B0X2NhbGxiYWNrICYmIG9wdF9jYWxsYmFjay5jYWxsKGVsKVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8vIERPTSBXYWxrZXJzICYgZ2V0dGVyc1xuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgZmlyc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGJvbnpvKHRoaXMubGVuZ3RoID8gdGhpc1swXSA6IFtdKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCBsYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBib256byh0aGlzLmxlbmd0aCA/IHRoaXNbdGhpcy5sZW5ndGggLSAxXSA6IFtdKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbGF0ZWQoJ25leHRTaWJsaW5nJylcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgcHJldmlvdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRlZCgncHJldmlvdXNTaWJsaW5nJylcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgcGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRlZChwYXJlbnROb2RlKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgdGhlIGRpcmVjdGlvbmFsIERPTSBtZXRob2RcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgcmVsYXRlZDogZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gYm9uem8odGhpcy5tYXAoXG4gICAgICAgICAgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBlbCA9IGVsW21ldGhvZF1cbiAgICAgICAgICAgIHdoaWxlIChlbCAmJiBlbC5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgICAgICAgICBlbCA9IGVsW21ldGhvZF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbCB8fCAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICAgIH1cbiAgICAgICAgKSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBmb2N1czogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxlbmd0aCAmJiB0aGlzWzBdLmZvY3VzKClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBibHVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGVuZ3RoICYmIHRoaXNbMF0uYmx1cigpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG5cbiAgICAgIC8vIHN0eWxlIGdldHRlciBzZXR0ZXIgJiByZWxhdGVkIG1ldGhvZHNcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IG9cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3ZcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfHN0cmluZ31cbiAgICAgICAqL1xuICAgICwgY3NzOiBmdW5jdGlvbiAobywgb3B0X3YpIHtcbiAgICAgICAgdmFyIHAsIGl0ZXIgPSBvXG4gICAgICAgIC8vIGlzIHRoaXMgYSByZXF1ZXN0IGZvciBqdXN0IGdldHRpbmcgYSBzdHlsZT9cbiAgICAgICAgaWYgKG9wdF92ID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG8gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvLyByZXB1cnBvc2UgJ3YnXG4gICAgICAgICAgb3B0X3YgPSB0aGlzWzBdXG4gICAgICAgICAgaWYgKCFvcHRfdikgcmV0dXJuIG51bGxcbiAgICAgICAgICBpZiAob3B0X3YgPT09IGRvYyB8fCBvcHRfdiA9PT0gd2luKSB7XG4gICAgICAgICAgICBwID0gKG9wdF92ID09PSBkb2MpID8gYm9uem8uZG9jKCkgOiBib256by52aWV3cG9ydCgpXG4gICAgICAgICAgICByZXR1cm4gbyA9PSAnd2lkdGgnID8gcC53aWR0aCA6IG8gPT0gJ2hlaWdodCcgPyBwLmhlaWdodCA6ICcnXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAobyA9IHN0eWxlUHJvcGVydHkobykpID8gZ2V0U3R5bGUob3B0X3YsIG8pIDogbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgaXRlciA9IHt9XG4gICAgICAgICAgaXRlcltvXSA9IG9wdF92XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZlYXR1cmVzLm9wYXNpdHkgJiYgJ29wYWNpdHknIGluIGl0ZXIpIHtcbiAgICAgICAgICAvLyBvaCB0aGlzICdvbCBnYW11dFxuICAgICAgICAgIGl0ZXIuZmlsdGVyID0gaXRlci5vcGFjaXR5ICE9IG51bGwgJiYgaXRlci5vcGFjaXR5ICE9PSAnJ1xuICAgICAgICAgICAgPyAnYWxwaGEob3BhY2l0eT0nICsgKGl0ZXIub3BhY2l0eSAqIDEwMCkgKyAnKSdcbiAgICAgICAgICAgIDogJydcbiAgICAgICAgICAvLyBnaXZlIGl0IGxheW91dFxuICAgICAgICAgIGl0ZXIuem9vbSA9IG8uem9vbSB8fCAxXG4gICAgICAgICAgO2RlbGV0ZSBpdGVyLm9wYWNpdHlcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZuKGVsLCBwLCB2KSB7XG4gICAgICAgICAgZm9yICh2YXIgayBpbiBpdGVyKSB7XG4gICAgICAgICAgICBpZiAoaXRlci5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICB2ID0gaXRlcltrXTtcbiAgICAgICAgICAgICAgLy8gY2hhbmdlIFwiNVwiIHRvIFwiNXB4XCIgLSB1bmxlc3MgeW91J3JlIGxpbmUtaGVpZ2h0LCB3aGljaCBpcyBhbGxvd2VkXG4gICAgICAgICAgICAgIChwID0gc3R5bGVQcm9wZXJ0eShrKSkgJiYgZGlnaXQudGVzdCh2KSAmJiAhKHAgaW4gdW5pdGxlc3MpICYmICh2ICs9IHB4KVxuICAgICAgICAgICAgICB0cnkgeyBlbC5zdHlsZVtwXSA9IHNldHRlcihlbCwgdikgfSBjYXRjaChlKSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZuKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtudW1iZXI9fSBvcHRfeFxuICAgICAgICogQHBhcmFtIHtudW1iZXI9fSBvcHRfeVxuICAgICAgICogQHJldHVybiB7Qm9uem98bnVtYmVyfVxuICAgICAgICovXG4gICAgLCBvZmZzZXQ6IGZ1bmN0aW9uIChvcHRfeCwgb3B0X3kpIHtcbiAgICAgICAgaWYgKG9wdF94ICYmIHR5cGVvZiBvcHRfeCA9PSAnb2JqZWN0JyAmJiAodHlwZW9mIG9wdF94LnRvcCA9PSAnbnVtYmVyJyB8fCB0eXBlb2Ygb3B0X3gubGVmdCA9PSAnbnVtYmVyJykpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgeHkoZWwsIG9wdF94LmxlZnQsIG9wdF94LnRvcClcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRfeCA9PSAnbnVtYmVyJyB8fCB0eXBlb2Ygb3B0X3kgPT0gJ251bWJlcicpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgeHkoZWwsIG9wdF94LCBvcHRfeSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpc1swXSkgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICwgbGVmdDogMFxuICAgICAgICAgICwgaGVpZ2h0OiAwXG4gICAgICAgICAgLCB3aWR0aDogMFxuICAgICAgICB9XG4gICAgICAgIHZhciBlbCA9IHRoaXNbMF1cbiAgICAgICAgICAsIGRlID0gZWwub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICAgICAgICAsIGJjciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgLCBzY3JvbGwgPSBnZXRXaW5kb3dTY3JvbGwoKVxuICAgICAgICAgICwgd2lkdGggPSBlbC5vZmZzZXRXaWR0aFxuICAgICAgICAgICwgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgLCB0b3AgPSBiY3IudG9wICsgc2Nyb2xsLnkgLSBNYXRoLm1heCgwLCBkZSAmJiBkZS5jbGllbnRUb3AsIGRvYy5ib2R5LmNsaWVudFRvcClcbiAgICAgICAgICAsIGxlZnQgPSBiY3IubGVmdCArIHNjcm9sbC54IC0gTWF0aC5tYXgoMCwgZGUgJiYgZGUuY2xpZW50TGVmdCwgZG9jLmJvZHkuY2xpZW50TGVmdClcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiB0b3BcbiAgICAgICAgICAsIGxlZnQ6IGxlZnRcbiAgICAgICAgICAsIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgLCB3aWR0aDogd2lkdGhcbiAgICAgICAgfVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAgICovXG4gICAgLCBkaW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxlbmd0aCkgcmV0dXJuIHsgaGVpZ2h0OiAwLCB3aWR0aDogMCB9XG4gICAgICAgIHZhciBlbCA9IHRoaXNbMF1cbiAgICAgICAgICAsIGRlID0gZWwubm9kZVR5cGUgPT0gOSAmJiBlbC5kb2N1bWVudEVsZW1lbnQgLy8gZG9jdW1lbnRcbiAgICAgICAgICAsIG9yaWcgPSAhZGUgJiYgISFlbC5zdHlsZSAmJiAhZWwub2Zmc2V0V2lkdGggJiYgIWVsLm9mZnNldEhlaWdodCA/XG4gICAgICAgICAgICAgLy8gZWwgaXNuJ3QgdmlzaWJsZSwgY2FuJ3QgYmUgbWVhc3VyZWQgcHJvcGVybHksIHNvIGZpeCB0aGF0XG4gICAgICAgICAgICAgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgIHZhciBzID0ge1xuICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBlbC5zdHlsZS5wb3NpdGlvbiB8fCAnJ1xuICAgICAgICAgICAgICAgICAsIHZpc2liaWxpdHk6IGVsLnN0eWxlLnZpc2liaWxpdHkgfHwgJydcbiAgICAgICAgICAgICAgICAgLCBkaXNwbGF5OiBlbC5zdHlsZS5kaXNwbGF5IHx8ICcnXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICB0LmZpcnN0KCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICAgICAgICAgICAsIHZpc2liaWxpdHk6ICdoaWRkZW4nXG4gICAgICAgICAgICAgICAgICwgZGlzcGxheTogJ2Jsb2NrJ1xuICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgIHJldHVybiBzXG4gICAgICAgICAgICB9KHRoaXMpIDogbnVsbFxuICAgICAgICAgICwgd2lkdGggPSBkZVxuICAgICAgICAgICAgICA/IE1hdGgubWF4KGVsLmJvZHkuc2Nyb2xsV2lkdGgsIGVsLmJvZHkub2Zmc2V0V2lkdGgsIGRlLnNjcm9sbFdpZHRoLCBkZS5vZmZzZXRXaWR0aCwgZGUuY2xpZW50V2lkdGgpXG4gICAgICAgICAgICAgIDogZWwub2Zmc2V0V2lkdGhcbiAgICAgICAgICAsIGhlaWdodCA9IGRlXG4gICAgICAgICAgICAgID8gTWF0aC5tYXgoZWwuYm9keS5zY3JvbGxIZWlnaHQsIGVsLmJvZHkub2Zmc2V0SGVpZ2h0LCBkZS5zY3JvbGxIZWlnaHQsIGRlLm9mZnNldEhlaWdodCwgZGUuY2xpZW50SGVpZ2h0KVxuICAgICAgICAgICAgICA6IGVsLm9mZnNldEhlaWdodFxuXG4gICAgICAgIG9yaWcgJiYgdGhpcy5maXJzdCgpLmNzcyhvcmlnKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAsIHdpZHRoOiB3aWR0aFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGF0dHJpYnV0ZXMgYXJlIGhhcmQuIGdvIHNob3BwaW5nXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGsgYW4gYXR0cmlidXRlIHRvIGdldCBvciBzZXRcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3YgdGhlIHZhbHVlIHRvIHNldFxuICAgICAgICogQHJldHVybiB7Qm9uem98c3RyaW5nfVxuICAgICAgICovXG4gICAgLCBhdHRyOiBmdW5jdGlvbiAoaywgb3B0X3YpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpc1swXVxuICAgICAgICAgICwgblxuXG4gICAgICAgIGlmICh0eXBlb2YgayAhPSAnc3RyaW5nJyAmJiAhKGsgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICAgICAgZm9yIChuIGluIGspIHtcbiAgICAgICAgICAgIGsuaGFzT3duUHJvcGVydHkobikgJiYgdGhpcy5hdHRyKG4sIGtbbl0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHlwZW9mIG9wdF92ID09ICd1bmRlZmluZWQnID9cbiAgICAgICAgICAhZWwgPyBudWxsIDogc3BlY2lhbEF0dHJpYnV0ZXMudGVzdChrKSA/XG4gICAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXMudGVzdChrKSAmJiB0eXBlb2YgZWxba10gPT0gJ3N0cmluZycgP1xuICAgICAgICAgICAgICB0cnVlIDogZWxba10gOiAoayA9PSAnaHJlZicgfHwgayA9PSdzcmMnKSAmJiBmZWF0dXJlcy5ocmVmRXh0ZW5kZWQgP1xuICAgICAgICAgICAgICAgIGVsW2dldEF0dHJpYnV0ZV0oaywgMikgOiBlbFtnZXRBdHRyaWJ1dGVdKGspIDpcbiAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBzcGVjaWFsQXR0cmlidXRlcy50ZXN0KGspID8gKGVsW2tdID0gc2V0dGVyKGVsLCBvcHRfdikpIDogZWxbc2V0QXR0cmlidXRlXShrLCBzZXR0ZXIoZWwsIG9wdF92KSlcbiAgICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCByZW1vdmVBdHRyOiBmdW5jdGlvbiAoaykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIHN0YXRlQXR0cmlidXRlcy50ZXN0KGspID8gKGVsW2tdID0gZmFsc2UpIDogZWwucmVtb3ZlQXR0cmlidXRlKGspXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF9zXG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xzdHJpbmd9XG4gICAgICAgKi9cbiAgICAsIHZhbDogZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgcyA9PSAnc3RyaW5nJyB8fCB0eXBlb2YgcyA9PSAnbnVtYmVyJykgP1xuICAgICAgICAgIHRoaXMuYXR0cigndmFsdWUnLCBzKSA6XG4gICAgICAgICAgdGhpcy5sZW5ndGggPyB0aGlzWzBdLnZhbHVlIDogbnVsbFxuICAgICAgfVxuXG4gICAgICAvLyB1c2Ugd2l0aCBjYXJlIGFuZCBrbm93bGVkZ2UuIHRoaXMgZGF0YSgpIG1ldGhvZCB1c2VzIGRhdGEgYXR0cmlidXRlcyBvbiB0aGUgRE9NIG5vZGVzXG4gICAgICAvLyB0byBkbyB0aGlzIGRpZmZlcmVudGx5IGNvc3RzIGEgbG90IG1vcmUgY29kZS4gYydlc3QgbGEgdmllXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdD19IG9wdF9rIHRoZSBrZXkgZm9yIHdoaWNoIHRvIGdldCBvciBzZXQgZGF0YVxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfdlxuICAgICAgICogQHJldHVybiB7Qm9uem98T2JqZWN0fVxuICAgICAgICovXG4gICAgLCBkYXRhOiBmdW5jdGlvbiAob3B0X2ssIG9wdF92KSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXNbMF0sIG8sIG1cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRfdiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBpZiAoIWVsKSByZXR1cm4gbnVsbFxuICAgICAgICAgIG8gPSBkYXRhKGVsKVxuICAgICAgICAgIGlmICh0eXBlb2Ygb3B0X2sgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlYWNoKGVsLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgIChtID0gKCcnICsgYS5uYW1lKS5tYXRjaChkYXR0cikpICYmIChvW2NhbWVsaXplKG1bMV0pXSA9IGRhdGFWYWx1ZShhLnZhbHVlKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gb1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9bb3B0X2tdID09PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgb1tvcHRfa10gPSBkYXRhVmFsdWUodGhpcy5hdHRyKCdkYXRhLScgKyBkZWNhbWVsaXplKG9wdF9rKSkpXG4gICAgICAgICAgICByZXR1cm4gb1tvcHRfa11cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHsgZGF0YShlbClbb3B0X2tdID0gb3B0X3YgfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBET00gZGV0YWNobWVudCAmIHJlbGF0ZWRcblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZGVlcEVhY2goY2xlYXJEYXRhKVxuICAgICAgICByZXR1cm4gdGhpcy5kZXRhY2goKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGVtcHR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZGVlcEVhY2goZWwuY2hpbGROb2RlcywgY2xlYXJEYXRhKVxuXG4gICAgICAgICAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGRldGFjaDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVsW3BhcmVudE5vZGVdICYmIGVsW3BhcmVudE5vZGVdLnJlbW92ZUNoaWxkKGVsKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyB3aG8gdXNlcyBhIG1vdXNlIGFueXdheT8gb2ggcmlnaHQuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgICAgICAqL1xuICAgICwgc2Nyb2xsVG9wOiBmdW5jdGlvbiAoeSkge1xuICAgICAgICByZXR1cm4gc2Nyb2xsLmNhbGwodGhpcywgbnVsbCwgeSwgJ3knKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgICAgICAqL1xuICAgICwgc2Nyb2xsTGVmdDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIHNjcm9sbC5jYWxsKHRoaXMsIHgsIG51bGwsICd4JylcbiAgICAgIH1cblxuICB9XG5cblxuICBmdW5jdGlvbiBjbG9uZU5vZGUoaG9zdCwgZWwpIHtcbiAgICB2YXIgYyA9IGVsLmNsb25lTm9kZSh0cnVlKVxuICAgICAgLCBjbG9uZUVsZW1zXG4gICAgICAsIGVsRWxlbXNcbiAgICAgICwgaVxuXG4gICAgLy8gY2hlY2sgZm9yIGV4aXN0ZW5jZSBvZiBhbiBldmVudCBjbG9uZXJcbiAgICAvLyBwcmVmZXJhYmx5IGh0dHBzOi8vZ2l0aHViLmNvbS9mYXQvYmVhblxuICAgIC8vIG90aGVyd2lzZSBCb256byB3b24ndCBkbyB0aGlzIGZvciB5b3VcbiAgICBpZiAoaG9zdC4kICYmIHR5cGVvZiBob3N0LmNsb25lRXZlbnRzID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGhvc3QuJChjKS5jbG9uZUV2ZW50cyhlbClcblxuICAgICAgLy8gY2xvbmUgZXZlbnRzIGZyb20gZXZlcnkgY2hpbGQgbm9kZVxuICAgICAgY2xvbmVFbGVtcyA9IGhvc3QuJChjKS5maW5kKCcqJylcbiAgICAgIGVsRWxlbXMgPSBob3N0LiQoZWwpLmZpbmQoJyonKVxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZWxFbGVtcy5sZW5ndGg7IGkrKylcbiAgICAgICAgaG9zdC4kKGNsb25lRWxlbXNbaV0pLmNsb25lRXZlbnRzKGVsRWxlbXNbaV0pXG4gICAgfVxuICAgIHJldHVybiBjXG4gIH1cblxuICBmdW5jdGlvbiBpc0JvZHkoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50ID09PSB3aW4gfHwgKC9eKD86Ym9keXxodG1sKSQvaSkudGVzdChlbGVtZW50LnRhZ05hbWUpXG4gIH1cblxuICBmdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGwoKSB7XG4gICAgcmV0dXJuIHsgeDogd2luLnBhZ2VYT2Zmc2V0IHx8IGh0bWwuc2Nyb2xsTGVmdCwgeTogd2luLnBhZ2VZT2Zmc2V0IHx8IGh0bWwuc2Nyb2xsVG9wIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNjcmlwdEZyb21IdG1sKGh0bWwpIHtcbiAgICB2YXIgc2NyaXB0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAgLCBtYXRjaGVzID0gaHRtbC5tYXRjaChzaW1wbGVTY3JpcHRUYWdSZSlcbiAgICBzY3JpcHRFbC5zcmMgPSBtYXRjaGVzWzFdXG4gICAgcmV0dXJuIHNjcmlwdEVsXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtBcnJheS48RWxlbWVudD58RWxlbWVudHxOb2RlfHN0cmluZ30gZWxzXG4gICAqIEByZXR1cm4ge0JvbnpvfVxuICAgKi9cbiAgZnVuY3Rpb24gYm9uem8oZWxzKSB7XG4gICAgcmV0dXJuIG5ldyBCb256byhlbHMpXG4gIH1cblxuICBib256by5zZXRRdWVyeUVuZ2luZSA9IGZ1bmN0aW9uIChxKSB7XG4gICAgcXVlcnkgPSBxO1xuICAgIGRlbGV0ZSBib256by5zZXRRdWVyeUVuZ2luZVxuICB9XG5cbiAgYm9uem8uYXVnID0gZnVuY3Rpb24gKG8sIHRhcmdldCkge1xuICAgIC8vIGZvciB0aG9zZSBzdGFuZGFsb25lIGJvbnpvIHVzZXJzLiB0aGlzIGxvdmUgaXMgZm9yIHlvdS5cbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIG8uaGFzT3duUHJvcGVydHkoaykgJiYgKCh0YXJnZXQgfHwgQm9uem8ucHJvdG90eXBlKVtrXSA9IG9ba10pXG4gICAgfVxuICB9XG5cbiAgYm9uem8uY3JlYXRlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAvLyBoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaFxuICAgIHJldHVybiB0eXBlb2Ygbm9kZSA9PSAnc3RyaW5nJyAmJiBub2RlICE9PSAnJyA/XG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzaW1wbGVTY3JpcHRUYWdSZS50ZXN0KG5vZGUpKSByZXR1cm4gW2NyZWF0ZVNjcmlwdEZyb21IdG1sKG5vZGUpXVxuICAgICAgICB2YXIgdGFnID0gbm9kZS5tYXRjaCgvXlxccyo8KFteXFxzPl0rKS8pXG4gICAgICAgICAgLCBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICwgZWxzID0gW11cbiAgICAgICAgICAsIHAgPSB0YWcgPyB0YWdNYXBbdGFnWzFdLnRvTG93ZXJDYXNlKCldIDogbnVsbFxuICAgICAgICAgICwgZGVwID0gcCA/IHBbMl0gKyAxIDogMVxuICAgICAgICAgICwgbnMgPSBwICYmIHBbM11cbiAgICAgICAgICAsIHBuID0gcGFyZW50Tm9kZVxuICAgICAgICAgICwgdGIgPSBmZWF0dXJlcy5hdXRvVGJvZHkgJiYgcCAmJiBwWzBdID09ICc8dGFibGU+JyAmJiAhKC88dGJvZHkvaSkudGVzdChub2RlKVxuXG4gICAgICAgIGVsLmlubmVySFRNTCA9IHAgPyAocFswXSArIG5vZGUgKyBwWzFdKSA6IG5vZGVcbiAgICAgICAgd2hpbGUgKGRlcC0tKSBlbCA9IGVsLmZpcnN0Q2hpbGRcbiAgICAgICAgLy8gZm9yIElFIE5vU2NvcGUsIHdlIG1heSBpbnNlcnQgY3J1ZnQgYXQgdGhlIGJlZ2luaW5nIGp1c3QgdG8gZ2V0IGl0IHRvIHdvcmtcbiAgICAgICAgaWYgKG5zICYmIGVsICYmIGVsLm5vZGVUeXBlICE9PSAxKSBlbCA9IGVsLm5leHRTaWJsaW5nXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAvLyB0Ym9keSBzcGVjaWFsIGNhc2UgZm9yIElFPDgsIGNyZWF0ZXMgdGJvZHkgb24gYW55IGVtcHR5IHRhYmxlXG4gICAgICAgICAgLy8gd2UgZG9uJ3Qgd2FudCBpdCBpZiB3ZSdyZSBqdXN0IGFmdGVyIGEgPHRoZWFkPiwgPGNhcHRpb24+LCBldGMuXG4gICAgICAgICAgaWYgKCghdGFnIHx8IGVsLm5vZGVUeXBlID09IDEpICYmICghdGIgfHwgKGVsLnRhZ05hbWUgJiYgZWwudGFnTmFtZSAhPSAnVEJPRFknKSkpIHtcbiAgICAgICAgICAgIGVscy5wdXNoKGVsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoZWwgPSBlbC5uZXh0U2libGluZylcbiAgICAgICAgLy8gSUUgPCA5IGdpdmVzIHVzIGEgcGFyZW50Tm9kZSB3aGljaCBtZXNzZXMgdXAgaW5zZXJ0KCkgY2hlY2sgZm9yIGNsb25pbmdcbiAgICAgICAgLy8gYGRlcGAgPiAxIGNhbiBhbHNvIGNhdXNlIHByb2JsZW1zIHdpdGggdGhlIGluc2VydCgpIGNoZWNrIChtdXN0IGRvIHRoaXMgbGFzdClcbiAgICAgICAgZWFjaChlbHMsIGZ1bmN0aW9uKGVsKSB7IGVsW3BuXSAmJiBlbFtwbl0ucmVtb3ZlQ2hpbGQoZWwpIH0pXG4gICAgICAgIHJldHVybiBlbHNcbiAgICAgIH0oKSA6IGlzTm9kZShub2RlKSA/IFtub2RlLmNsb25lTm9kZSh0cnVlKV0gOiBbXVxuICB9XG5cbiAgYm9uem8uZG9jID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2cCA9IGJvbnpvLnZpZXdwb3J0KClcbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogTWF0aC5tYXgoZG9jLmJvZHkuc2Nyb2xsV2lkdGgsIGh0bWwuc2Nyb2xsV2lkdGgsIHZwLndpZHRoKVxuICAgICAgLCBoZWlnaHQ6IE1hdGgubWF4KGRvYy5ib2R5LnNjcm9sbEhlaWdodCwgaHRtbC5zY3JvbGxIZWlnaHQsIHZwLmhlaWdodClcbiAgICB9XG4gIH1cblxuICBib256by5maXJzdENoaWxkID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgZm9yICh2YXIgYyA9IGVsLmNoaWxkTm9kZXMsIGkgPSAwLCBqID0gKGMgJiYgYy5sZW5ndGgpIHx8IDAsIGU7IGkgPCBqOyBpKyspIHtcbiAgICAgIGlmIChjW2ldLm5vZGVUeXBlID09PSAxKSBlID0gY1tqID0gaV1cbiAgICB9XG4gICAgcmV0dXJuIGVcbiAgfVxuXG4gIGJvbnpvLnZpZXdwb3J0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBpZSA/IGh0bWwuY2xpZW50V2lkdGggOiB3aW4uaW5uZXJXaWR0aFxuICAgICAgLCBoZWlnaHQ6IGllID8gaHRtbC5jbGllbnRIZWlnaHQgOiB3aW4uaW5uZXJIZWlnaHRcbiAgICB9XG4gIH1cblxuICBib256by5pc0FuY2VzdG9yID0gJ2NvbXBhcmVEb2N1bWVudFBvc2l0aW9uJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoY29udGFpbmVyLCBlbGVtZW50KSB7XG4gICAgICByZXR1cm4gKGNvbnRhaW5lci5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlbGVtZW50KSAmIDE2KSA9PSAxNlxuICAgIH0gOiAnY29udGFpbnMnIGluIGh0bWwgP1xuICAgIGZ1bmN0aW9uIChjb250YWluZXIsIGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBjb250YWluZXIgIT09IGVsZW1lbnQgJiYgY29udGFpbmVyLmNvbnRhaW5zKGVsZW1lbnQpO1xuICAgIH0gOlxuICAgIGZ1bmN0aW9uIChjb250YWluZXIsIGVsZW1lbnQpIHtcbiAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudFtwYXJlbnROb2RlXSkge1xuICAgICAgICBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gIHJldHVybiBib256b1xufSk7IC8vIHRoZSBvbmx5IGxpbmUgd2UgY2FyZSBhYm91dCB1c2luZyBhIHNlbWktY29sb24uIHBsYWNlZCBoZXJlIGZvciBjb25jYXRlbmF0aW9uIHRvb2xzXG4iLCJcbi8vIG5vdCBpbXBsZW1lbnRlZFxuLy8gVGhlIHJlYXNvbiBmb3IgaGF2aW5nIGFuIGVtcHR5IGZpbGUgYW5kIG5vdCB0aHJvd2luZyBpcyB0byBhbGxvd1xuLy8gdW50cmFkaXRpb25hbCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1vZHVsZS5cbiIsIi8qIVxuICAqIEBwcmVzZXJ2ZSBRd2VyeSAtIEEgQmxhemluZyBGYXN0IHF1ZXJ5IHNlbGVjdG9yIGVuZ2luZVxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvcXdlcnlcbiAgKiBjb3B5cmlnaHQgRHVzdGluIERpYXogMjAxMlxuICAqIE1JVCBMaWNlbnNlXG4gICovXG5cbihmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0pKCdxd2VyeScsIHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50XG4gICAgLCBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudFxuICAgICwgYnlDbGFzcyA9ICdnZXRFbGVtZW50c0J5Q2xhc3NOYW1lJ1xuICAgICwgYnlUYWcgPSAnZ2V0RWxlbWVudHNCeVRhZ05hbWUnXG4gICAgLCBxU0EgPSAncXVlcnlTZWxlY3RvckFsbCdcbiAgICAsIHVzZU5hdGl2ZVFTQSA9ICd1c2VOYXRpdmVRU0EnXG4gICAgLCB0YWdOYW1lID0gJ3RhZ05hbWUnXG4gICAgLCBub2RlVHlwZSA9ICdub2RlVHlwZSdcbiAgICAsIHNlbGVjdCAvLyBtYWluIHNlbGVjdCgpIG1ldGhvZCwgYXNzaWduIGxhdGVyXG5cbiAgICAsIGlkID0gLyMoW1xcd1xcLV0rKS9cbiAgICAsIGNsYXMgPSAvXFwuW1xcd1xcLV0rL2dcbiAgICAsIGlkT25seSA9IC9eIyhbXFx3XFwtXSspJC9cbiAgICAsIGNsYXNzT25seSA9IC9eXFwuKFtcXHdcXC1dKykkL1xuICAgICwgdGFnT25seSA9IC9eKFtcXHdcXC1dKykkL1xuICAgICwgdGFnQW5kT3JDbGFzcyA9IC9eKFtcXHddKyk/XFwuKFtcXHdcXC1dKykkL1xuICAgICwgc3BsaXR0YWJsZSA9IC8oXnwsKVxccypbPn4rXS9cbiAgICAsIG5vcm1hbGl6ciA9IC9eXFxzK3xcXHMqKFssXFxzXFwrXFx+Pl18JClcXHMqL2dcbiAgICAsIHNwbGl0dGVycyA9IC9bXFxzXFw+XFwrXFx+XS9cbiAgICAsIHNwbGl0dGVyc01vcmUgPSAvKD8hW1xcc1xcd1xcLVxcL1xcP1xcJlxcPVxcOlxcLlxcKFxcKVxcISxAIyU8Plxce1xcfVxcJFxcKlxcXidcIl0qXFxdfFtcXHNcXHdcXCtcXC1dKlxcKSkvXG4gICAgLCBzcGVjaWFsQ2hhcnMgPSAvKFsuKis/XFxePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2dcbiAgICAsIHNpbXBsZSA9IC9eKFxcKnxbYS16MC05XSspPyg/OihbXFwuXFwjXStbXFx3XFwtXFwuI10rKT8pL1xuICAgICwgYXR0ciA9IC9cXFsoW1xcd1xcLV0rKSg/OihbXFx8XFxeXFwkXFwqXFx+XT9cXD0pWydcIl0/KFsgXFx3XFwtXFwvXFw/XFwmXFw9XFw6XFwuXFwoXFwpXFwhLEAjJTw+XFx7XFx9XFwkXFwqXFxeXSspW1wiJ10/KT9cXF0vXG4gICAgLCBwc2V1ZG8gPSAvOihbXFx3XFwtXSspKFxcKFsnXCJdPyhbXigpXSspWydcIl0/XFwpKT8vXG4gICAgLCBlYXN5ID0gbmV3IFJlZ0V4cChpZE9ubHkuc291cmNlICsgJ3wnICsgdGFnT25seS5zb3VyY2UgKyAnfCcgKyBjbGFzc09ubHkuc291cmNlKVxuICAgICwgZGl2aWRlcnMgPSBuZXcgUmVnRXhwKCcoJyArIHNwbGl0dGVycy5zb3VyY2UgKyAnKScgKyBzcGxpdHRlcnNNb3JlLnNvdXJjZSwgJ2cnKVxuICAgICwgdG9rZW5penIgPSBuZXcgUmVnRXhwKHNwbGl0dGVycy5zb3VyY2UgKyBzcGxpdHRlcnNNb3JlLnNvdXJjZSlcbiAgICAsIGNodW5rZXIgPSBuZXcgUmVnRXhwKHNpbXBsZS5zb3VyY2UgKyAnKCcgKyBhdHRyLnNvdXJjZSArICcpPycgKyAnKCcgKyBwc2V1ZG8uc291cmNlICsgJyk/JylcblxuICB2YXIgd2Fsa2VyID0ge1xuICAgICAgJyAnOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZSAmJiBub2RlICE9PSBodG1sICYmIG5vZGUucGFyZW50Tm9kZVxuICAgICAgfVxuICAgICwgJz4nOiBmdW5jdGlvbiAobm9kZSwgY29udGVzdGFudCkge1xuICAgICAgICByZXR1cm4gbm9kZSAmJiBub2RlLnBhcmVudE5vZGUgPT0gY29udGVzdGFudC5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZVxuICAgICAgfVxuICAgICwgJ34nOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZSAmJiBub2RlLnByZXZpb3VzU2libGluZ1xuICAgICAgfVxuICAgICwgJysnOiBmdW5jdGlvbiAobm9kZSwgY29udGVzdGFudCwgcDEsIHAyKSB7XG4gICAgICAgIGlmICghbm9kZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiAocDEgPSBwcmV2aW91cyhub2RlKSkgJiYgKHAyID0gcHJldmlvdXMoY29udGVzdGFudCkpICYmIHAxID09IHAyICYmIHAxXG4gICAgICB9XG4gICAgfVxuXG4gIGZ1bmN0aW9uIGNhY2hlKCkge1xuICAgIHRoaXMuYyA9IHt9XG4gIH1cbiAgY2FjaGUucHJvdG90eXBlID0ge1xuICAgIGc6IGZ1bmN0aW9uIChrKSB7XG4gICAgICByZXR1cm4gdGhpcy5jW2tdIHx8IHVuZGVmaW5lZFxuICAgIH1cbiAgLCBzOiBmdW5jdGlvbiAoaywgdiwgcikge1xuICAgICAgdiA9IHIgPyBuZXcgUmVnRXhwKHYpIDogdlxuICAgICAgcmV0dXJuICh0aGlzLmNba10gPSB2KVxuICAgIH1cbiAgfVxuXG4gIHZhciBjbGFzc0NhY2hlID0gbmV3IGNhY2hlKClcbiAgICAsIGNsZWFuQ2FjaGUgPSBuZXcgY2FjaGUoKVxuICAgICwgYXR0ckNhY2hlID0gbmV3IGNhY2hlKClcbiAgICAsIHRva2VuQ2FjaGUgPSBuZXcgY2FjaGUoKVxuXG4gIGZ1bmN0aW9uIGNsYXNzUmVnZXgoYykge1xuICAgIHJldHVybiBjbGFzc0NhY2hlLmcoYykgfHwgY2xhc3NDYWNoZS5zKGMsICcoXnxcXFxccyspJyArIGMgKyAnKFxcXFxzK3wkKScsIDEpXG4gIH1cblxuICAvLyBub3QgcXVpdGUgYXMgZmFzdCBhcyBpbmxpbmUgbG9vcHMgaW4gb2xkZXIgYnJvd3NlcnMgc28gZG9uJ3QgdXNlIGxpYmVyYWxseVxuICBmdW5jdGlvbiBlYWNoKGEsIGZuKSB7XG4gICAgdmFyIGkgPSAwLCBsID0gYS5sZW5ndGhcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykgZm4oYVtpXSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsYXR0ZW4oYXIpIHtcbiAgICBmb3IgKHZhciByID0gW10sIGkgPSAwLCBsID0gYXIubGVuZ3RoOyBpIDwgbDsgKytpKSBhcnJheUxpa2UoYXJbaV0pID8gKHIgPSByLmNvbmNhdChhcltpXSkpIDogKHJbci5sZW5ndGhdID0gYXJbaV0pXG4gICAgcmV0dXJuIHJcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5aWZ5KGFyKSB7XG4gICAgdmFyIGkgPSAwLCBsID0gYXIubGVuZ3RoLCByID0gW11cbiAgICBmb3IgKDsgaSA8IGw7IGkrKykgcltpXSA9IGFyW2ldXG4gICAgcmV0dXJuIHJcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZXZpb3VzKG4pIHtcbiAgICB3aGlsZSAobiA9IG4ucHJldmlvdXNTaWJsaW5nKSBpZiAobltub2RlVHlwZV0gPT0gMSkgYnJlYWs7XG4gICAgcmV0dXJuIG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHEocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkubWF0Y2goY2h1bmtlcilcbiAgfVxuXG4gIC8vIGNhbGxlZCB1c2luZyBgdGhpc2AgYXMgZWxlbWVudCBhbmQgYXJndW1lbnRzIGZyb20gcmVnZXggZ3JvdXAgcmVzdWx0cy5cbiAgLy8gZ2l2ZW4gPT4gZGl2LmhlbGxvW3RpdGxlPVwid29ybGRcIl06Zm9vKCdiYXInKVxuICAvLyBkaXYuaGVsbG9bdGl0bGU9XCJ3b3JsZFwiXTpmb28oJ2JhcicpLCBkaXYsIC5oZWxsbywgW3RpdGxlPVwid29ybGRcIl0sIHRpdGxlLCA9LCB3b3JsZCwgOmZvbygnYmFyJyksIGZvbywgKCdiYXInKSwgYmFyXVxuICBmdW5jdGlvbiBpbnRlcnByZXQod2hvbGUsIHRhZywgaWRzQW5kQ2xhc3Nlcywgd2hvbGVBdHRyaWJ1dGUsIGF0dHJpYnV0ZSwgcXVhbGlmaWVyLCB2YWx1ZSwgd2hvbGVQc2V1ZG8sIHBzZXVkbywgd2hvbGVQc2V1ZG9WYWwsIHBzZXVkb1ZhbCkge1xuICAgIHZhciBpLCBtLCBrLCBvLCBjbGFzc2VzXG4gICAgaWYgKHRoaXNbbm9kZVR5cGVdICE9PSAxKSByZXR1cm4gZmFsc2VcbiAgICBpZiAodGFnICYmIHRhZyAhPT0gJyonICYmIHRoaXNbdGFnTmFtZV0gJiYgdGhpc1t0YWdOYW1lXS50b0xvd2VyQ2FzZSgpICE9PSB0YWcpIHJldHVybiBmYWxzZVxuICAgIGlmIChpZHNBbmRDbGFzc2VzICYmIChtID0gaWRzQW5kQ2xhc3Nlcy5tYXRjaChpZCkpICYmIG1bMV0gIT09IHRoaXMuaWQpIHJldHVybiBmYWxzZVxuICAgIGlmIChpZHNBbmRDbGFzc2VzICYmIChjbGFzc2VzID0gaWRzQW5kQ2xhc3Nlcy5tYXRjaChjbGFzKSkpIHtcbiAgICAgIGZvciAoaSA9IGNsYXNzZXMubGVuZ3RoOyBpLS07KSBpZiAoIWNsYXNzUmVnZXgoY2xhc3Nlc1tpXS5zbGljZSgxKSkudGVzdCh0aGlzLmNsYXNzTmFtZSkpIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAocHNldWRvICYmIHF3ZXJ5LnBzZXVkb3NbcHNldWRvXSAmJiAhcXdlcnkucHNldWRvc1twc2V1ZG9dKHRoaXMsIHBzZXVkb1ZhbCkpIHJldHVybiBmYWxzZVxuICAgIGlmICh3aG9sZUF0dHJpYnV0ZSAmJiAhdmFsdWUpIHsgLy8gc2VsZWN0IGlzIGp1c3QgZm9yIGV4aXN0YW5jZSBvZiBhdHRyaWJcbiAgICAgIG8gPSB0aGlzLmF0dHJpYnV0ZXNcbiAgICAgIGZvciAoayBpbiBvKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgaykgJiYgKG9ba10ubmFtZSB8fCBrKSA9PSBhdHRyaWJ1dGUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh3aG9sZUF0dHJpYnV0ZSAmJiAhY2hlY2tBdHRyKHF1YWxpZmllciwgZ2V0QXR0cih0aGlzLCBhdHRyaWJ1dGUpIHx8ICcnLCB2YWx1ZSkpIHtcbiAgICAgIC8vIHNlbGVjdCBpcyBmb3IgYXR0cmliIGVxdWFsaXR5XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFuKHMpIHtcbiAgICByZXR1cm4gY2xlYW5DYWNoZS5nKHMpIHx8IGNsZWFuQ2FjaGUucyhzLCBzLnJlcGxhY2Uoc3BlY2lhbENoYXJzLCAnXFxcXCQxJykpXG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0F0dHIocXVhbGlmeSwgYWN0dWFsLCB2YWwpIHtcbiAgICBzd2l0Y2ggKHF1YWxpZnkpIHtcbiAgICBjYXNlICc9JzpcbiAgICAgIHJldHVybiBhY3R1YWwgPT0gdmFsXG4gICAgY2FzZSAnXj0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZygnXj0nICsgdmFsKSB8fCBhdHRyQ2FjaGUucygnXj0nICsgdmFsLCAnXicgKyBjbGVhbih2YWwpLCAxKSlcbiAgICBjYXNlICckPSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKCckPScgKyB2YWwpIHx8IGF0dHJDYWNoZS5zKCckPScgKyB2YWwsIGNsZWFuKHZhbCkgKyAnJCcsIDEpKVxuICAgIGNhc2UgJyo9JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcodmFsKSB8fCBhdHRyQ2FjaGUucyh2YWwsIGNsZWFuKHZhbCksIDEpKVxuICAgIGNhc2UgJ349JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcoJ349JyArIHZhbCkgfHwgYXR0ckNhY2hlLnMoJ349JyArIHZhbCwgJyg/Ol58XFxcXHMrKScgKyBjbGVhbih2YWwpICsgJyg/OlxcXFxzK3wkKScsIDEpKVxuICAgIGNhc2UgJ3w9JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcoJ3w9JyArIHZhbCkgfHwgYXR0ckNhY2hlLnMoJ3w9JyArIHZhbCwgJ14nICsgY2xlYW4odmFsKSArICcoLXwkKScsIDEpKVxuICAgIH1cbiAgICByZXR1cm4gMFxuICB9XG5cbiAgLy8gZ2l2ZW4gYSBzZWxlY3RvciwgZmlyc3QgY2hlY2sgZm9yIHNpbXBsZSBjYXNlcyB0aGVuIGNvbGxlY3QgYWxsIGJhc2UgY2FuZGlkYXRlIG1hdGNoZXMgYW5kIGZpbHRlclxuICBmdW5jdGlvbiBfcXdlcnkoc2VsZWN0b3IsIF9yb290KSB7XG4gICAgdmFyIHIgPSBbXSwgcmV0ID0gW10sIGksIGwsIG0sIHRva2VuLCB0YWcsIGVscywgaW50ciwgaXRlbSwgcm9vdCA9IF9yb290XG4gICAgICAsIHRva2VucyA9IHRva2VuQ2FjaGUuZyhzZWxlY3RvcikgfHwgdG9rZW5DYWNoZS5zKHNlbGVjdG9yLCBzZWxlY3Rvci5zcGxpdCh0b2tlbml6cikpXG4gICAgICAsIGRpdmlkZWRUb2tlbnMgPSBzZWxlY3Rvci5tYXRjaChkaXZpZGVycylcblxuICAgIGlmICghdG9rZW5zLmxlbmd0aCkgcmV0dXJuIHJcblxuICAgIHRva2VuID0gKHRva2VucyA9IHRva2Vucy5zbGljZSgwKSkucG9wKCkgLy8gY29weSBjYWNoZWQgdG9rZW5zLCB0YWtlIHRoZSBsYXN0IG9uZVxuICAgIGlmICh0b2tlbnMubGVuZ3RoICYmIChtID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS5tYXRjaChpZE9ubHkpKSkgcm9vdCA9IGJ5SWQoX3Jvb3QsIG1bMV0pXG4gICAgaWYgKCFyb290KSByZXR1cm4gclxuXG4gICAgaW50ciA9IHEodG9rZW4pXG4gICAgLy8gY29sbGVjdCBiYXNlIGNhbmRpZGF0ZXMgdG8gZmlsdGVyXG4gICAgZWxzID0gcm9vdCAhPT0gX3Jvb3QgJiYgcm9vdFtub2RlVHlwZV0gIT09IDkgJiYgZGl2aWRlZFRva2VucyAmJiAvXlsrfl0kLy50ZXN0KGRpdmlkZWRUb2tlbnNbZGl2aWRlZFRva2Vucy5sZW5ndGggLSAxXSkgP1xuICAgICAgZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgd2hpbGUgKHJvb3QgPSByb290Lm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgcm9vdFtub2RlVHlwZV0gPT0gMSAmJiAoaW50clsxXSA/IGludHJbMV0gPT0gcm9vdFt0YWdOYW1lXS50b0xvd2VyQ2FzZSgpIDogMSkgJiYgKHJbci5sZW5ndGhdID0gcm9vdClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gclxuICAgICAgfShbXSkgOlxuICAgICAgcm9vdFtieVRhZ10oaW50clsxXSB8fCAnKicpXG4gICAgLy8gZmlsdGVyIGVsZW1lbnRzIGFjY29yZGluZyB0byB0aGUgcmlnaHQtbW9zdCBwYXJ0IG9mIHRoZSBzZWxlY3RvclxuICAgIGZvciAoaSA9IDAsIGwgPSBlbHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoaXRlbSA9IGludGVycHJldC5hcHBseShlbHNbaV0sIGludHIpKSByW3IubGVuZ3RoXSA9IGl0ZW1cbiAgICB9XG4gICAgaWYgKCF0b2tlbnMubGVuZ3RoKSByZXR1cm4gclxuXG4gICAgLy8gZmlsdGVyIGZ1cnRoZXIgYWNjb3JkaW5nIHRvIHRoZSByZXN0IG9mIHRoZSBzZWxlY3RvciAodGhlIGxlZnQgc2lkZSlcbiAgICBlYWNoKHIsIGZ1bmN0aW9uIChlKSB7IGlmIChhbmNlc3Rvck1hdGNoKGUsIHRva2VucywgZGl2aWRlZFRva2VucykpIHJldFtyZXQubGVuZ3RoXSA9IGUgfSlcbiAgICByZXR1cm4gcmV0XG4gIH1cblxuICAvLyBjb21wYXJlIGVsZW1lbnQgdG8gYSBzZWxlY3RvclxuICBmdW5jdGlvbiBpcyhlbCwgc2VsZWN0b3IsIHJvb3QpIHtcbiAgICBpZiAoaXNOb2RlKHNlbGVjdG9yKSkgcmV0dXJuIGVsID09IHNlbGVjdG9yXG4gICAgaWYgKGFycmF5TGlrZShzZWxlY3RvcikpIHJldHVybiAhIX5mbGF0dGVuKHNlbGVjdG9yKS5pbmRleE9mKGVsKSAvLyBpZiBzZWxlY3RvciBpcyBhbiBhcnJheSwgaXMgZWwgYSBtZW1iZXI/XG5cbiAgICB2YXIgc2VsZWN0b3JzID0gc2VsZWN0b3Iuc3BsaXQoJywnKSwgdG9rZW5zLCBkaXZpZGVkVG9rZW5zXG4gICAgd2hpbGUgKHNlbGVjdG9yID0gc2VsZWN0b3JzLnBvcCgpKSB7XG4gICAgICB0b2tlbnMgPSB0b2tlbkNhY2hlLmcoc2VsZWN0b3IpIHx8IHRva2VuQ2FjaGUucyhzZWxlY3Rvciwgc2VsZWN0b3Iuc3BsaXQodG9rZW5penIpKVxuICAgICAgZGl2aWRlZFRva2VucyA9IHNlbGVjdG9yLm1hdGNoKGRpdmlkZXJzKVxuICAgICAgdG9rZW5zID0gdG9rZW5zLnNsaWNlKDApIC8vIGNvcHkgYXJyYXlcbiAgICAgIGlmIChpbnRlcnByZXQuYXBwbHkoZWwsIHEodG9rZW5zLnBvcCgpKSkgJiYgKCF0b2tlbnMubGVuZ3RoIHx8IGFuY2VzdG9yTWF0Y2goZWwsIHRva2VucywgZGl2aWRlZFRva2Vucywgcm9vdCkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gZ2l2ZW4gZWxlbWVudHMgbWF0Y2hpbmcgdGhlIHJpZ2h0LW1vc3QgcGFydCBvZiBhIHNlbGVjdG9yLCBmaWx0ZXIgb3V0IGFueSB0aGF0IGRvbid0IG1hdGNoIHRoZSByZXN0XG4gIGZ1bmN0aW9uIGFuY2VzdG9yTWF0Y2goZWwsIHRva2VucywgZGl2aWRlZFRva2Vucywgcm9vdCkge1xuICAgIHZhciBjYW5kXG4gICAgLy8gcmVjdXJzaXZlbHkgd29yayBiYWNrd2FyZHMgdGhyb3VnaCB0aGUgdG9rZW5zIGFuZCB1cCB0aGUgZG9tLCBjb3ZlcmluZyBhbGwgb3B0aW9uc1xuICAgIGZ1bmN0aW9uIGNyYXdsKGUsIGksIHApIHtcbiAgICAgIHdoaWxlIChwID0gd2Fsa2VyW2RpdmlkZWRUb2tlbnNbaV1dKHAsIGUpKSB7XG4gICAgICAgIGlmIChpc05vZGUocCkgJiYgKGludGVycHJldC5hcHBseShwLCBxKHRva2Vuc1tpXSkpKSkge1xuICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICBpZiAoY2FuZCA9IGNyYXdsKHAsIGkgLSAxLCBwKSkgcmV0dXJuIGNhbmRcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIHBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKGNhbmQgPSBjcmF3bChlbCwgdG9rZW5zLmxlbmd0aCAtIDEsIGVsKSkgJiYgKCFyb290IHx8IGlzQW5jZXN0b3IoY2FuZCwgcm9vdCkpXG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGUoZWwsIHQpIHtcbiAgICByZXR1cm4gZWwgJiYgdHlwZW9mIGVsID09PSAnb2JqZWN0JyAmJiAodCA9IGVsW25vZGVUeXBlXSkgJiYgKHQgPT0gMSB8fCB0ID09IDkpXG4gIH1cblxuICBmdW5jdGlvbiB1bmlxKGFyKSB7XG4gICAgdmFyIGEgPSBbXSwgaSwgajtcbiAgICBvOlxuICAgIGZvciAoaSA9IDA7IGkgPCBhci5sZW5ndGg7ICsraSkge1xuICAgICAgZm9yIChqID0gMDsgaiA8IGEubGVuZ3RoOyArK2opIGlmIChhW2pdID09IGFyW2ldKSBjb250aW51ZSBvXG4gICAgICBhW2EubGVuZ3RoXSA9IGFyW2ldXG4gICAgfVxuICAgIHJldHVybiBhXG4gIH1cblxuICBmdW5jdGlvbiBhcnJheUxpa2Uobykge1xuICAgIHJldHVybiAodHlwZW9mIG8gPT09ICdvYmplY3QnICYmIGlzRmluaXRlKG8ubGVuZ3RoKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVJvb3Qocm9vdCkge1xuICAgIGlmICghcm9vdCkgcmV0dXJuIGRvY1xuICAgIGlmICh0eXBlb2Ygcm9vdCA9PSAnc3RyaW5nJykgcmV0dXJuIHF3ZXJ5KHJvb3QpWzBdXG4gICAgaWYgKCFyb290W25vZGVUeXBlXSAmJiBhcnJheUxpa2Uocm9vdCkpIHJldHVybiByb290WzBdXG4gICAgcmV0dXJuIHJvb3RcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ5SWQocm9vdCwgaWQsIGVsKSB7XG4gICAgLy8gaWYgZG9jLCBxdWVyeSBvbiBpdCwgZWxzZSBxdWVyeSB0aGUgcGFyZW50IGRvYyBvciBpZiBhIGRldGFjaGVkIGZyYWdtZW50IHJld3JpdGUgdGhlIHF1ZXJ5IGFuZCBydW4gb24gdGhlIGZyYWdtZW50XG4gICAgcmV0dXJuIHJvb3Rbbm9kZVR5cGVdID09PSA5ID8gcm9vdC5nZXRFbGVtZW50QnlJZChpZCkgOlxuICAgICAgcm9vdC5vd25lckRvY3VtZW50ICYmXG4gICAgICAgICgoKGVsID0gcm9vdC5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSkgJiYgaXNBbmNlc3RvcihlbCwgcm9vdCkgJiYgZWwpIHx8XG4gICAgICAgICAgKCFpc0FuY2VzdG9yKHJvb3QsIHJvb3Qub3duZXJEb2N1bWVudCkgJiYgc2VsZWN0KCdbaWQ9XCInICsgaWQgKyAnXCJdJywgcm9vdClbMF0pKVxuICB9XG5cbiAgZnVuY3Rpb24gcXdlcnkoc2VsZWN0b3IsIF9yb290KSB7XG4gICAgdmFyIG0sIGVsLCByb290ID0gbm9ybWFsaXplUm9vdChfcm9vdClcblxuICAgIC8vIGVhc3ksIGZhc3QgY2FzZXMgdGhhdCB3ZSBjYW4gZGlzcGF0Y2ggd2l0aCBzaW1wbGUgRE9NIGNhbGxzXG4gICAgaWYgKCFyb290IHx8ICFzZWxlY3RvcikgcmV0dXJuIFtdXG4gICAgaWYgKHNlbGVjdG9yID09PSB3aW5kb3cgfHwgaXNOb2RlKHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuICFfcm9vdCB8fCAoc2VsZWN0b3IgIT09IHdpbmRvdyAmJiBpc05vZGUocm9vdCkgJiYgaXNBbmNlc3RvcihzZWxlY3Rvciwgcm9vdCkpID8gW3NlbGVjdG9yXSA6IFtdXG4gICAgfVxuICAgIGlmIChzZWxlY3RvciAmJiBhcnJheUxpa2Uoc2VsZWN0b3IpKSByZXR1cm4gZmxhdHRlbihzZWxlY3RvcilcbiAgICBpZiAobSA9IHNlbGVjdG9yLm1hdGNoKGVhc3kpKSB7XG4gICAgICBpZiAobVsxXSkgcmV0dXJuIChlbCA9IGJ5SWQocm9vdCwgbVsxXSkpID8gW2VsXSA6IFtdXG4gICAgICBpZiAobVsyXSkgcmV0dXJuIGFycmF5aWZ5KHJvb3RbYnlUYWddKG1bMl0pKVxuICAgICAgaWYgKGhhc0J5Q2xhc3MgJiYgbVszXSkgcmV0dXJuIGFycmF5aWZ5KHJvb3RbYnlDbGFzc10obVszXSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdChzZWxlY3Rvciwgcm9vdClcbiAgfVxuXG4gIC8vIHdoZXJlIHRoZSByb290IGlzIG5vdCBkb2N1bWVudCBhbmQgYSByZWxhdGlvbnNoaXAgc2VsZWN0b3IgaXMgZmlyc3Qgd2UgaGF2ZSB0b1xuICAvLyBkbyBzb21lIGF3a3dhcmQgYWRqdXN0bWVudHMgdG8gZ2V0IGl0IHRvIHdvcmssIGV2ZW4gd2l0aCBxU0FcbiAgZnVuY3Rpb24gY29sbGVjdFNlbGVjdG9yKHJvb3QsIGNvbGxlY3Rvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAocykge1xuICAgICAgdmFyIG9pZCwgbmlkXG4gICAgICBpZiAoc3BsaXR0YWJsZS50ZXN0KHMpKSB7XG4gICAgICAgIGlmIChyb290W25vZGVUeXBlXSAhPT0gOSkge1xuICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgZWwgaGFzIGFuIGlkLCByZXdyaXRlIHRoZSBxdWVyeSwgc2V0IHJvb3QgdG8gZG9jIGFuZCBydW4gaXRcbiAgICAgICAgICBpZiAoIShuaWQgPSBvaWQgPSByb290LmdldEF0dHJpYnV0ZSgnaWQnKSkpIHJvb3Quc2V0QXR0cmlidXRlKCdpZCcsIG5pZCA9ICdfX3F3ZXJ5bWV1cHNjb3R0eScpXG4gICAgICAgICAgcyA9ICdbaWQ9XCInICsgbmlkICsgJ1wiXScgKyBzIC8vIGF2b2lkIGJ5SWQgYW5kIGFsbG93IHVzIHRvIG1hdGNoIGNvbnRleHQgZWxlbWVudFxuICAgICAgICAgIGNvbGxlY3Rvcihyb290LnBhcmVudE5vZGUgfHwgcm9vdCwgcywgdHJ1ZSlcbiAgICAgICAgICBvaWQgfHwgcm9vdC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzLmxlbmd0aCAmJiBjb2xsZWN0b3Iocm9vdCwgcywgZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlzQW5jZXN0b3IgPSAnY29tcGFyZURvY3VtZW50UG9zaXRpb24nIGluIGh0bWwgP1xuICAgIGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgIHJldHVybiAoY29udGFpbmVyLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGVsZW1lbnQpICYgMTYpID09IDE2XG4gICAgfSA6ICdjb250YWlucycgaW4gaHRtbCA/XG4gICAgZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgY29udGFpbmVyID0gY29udGFpbmVyW25vZGVUeXBlXSA9PT0gOSB8fCBjb250YWluZXIgPT0gd2luZG93ID8gaHRtbCA6IGNvbnRhaW5lclxuICAgICAgcmV0dXJuIGNvbnRhaW5lciAhPT0gZWxlbWVudCAmJiBjb250YWluZXIuY29udGFpbnMoZWxlbWVudClcbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkgaWYgKGVsZW1lbnQgPT09IGNvbnRhaW5lcikgcmV0dXJuIDFcbiAgICAgIHJldHVybiAwXG4gICAgfVxuICAsIGdldEF0dHIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBkZXRlY3QgYnVnZ3kgSUUgc3JjL2hyZWYgZ2V0QXR0cmlidXRlKCkgY2FsbFxuICAgICAgdmFyIGUgPSBkb2MuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICByZXR1cm4gKChlLmlubmVySFRNTCA9ICc8YSBocmVmPVwiI3hcIj54PC9hPicpICYmIGUuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSAhPSAnI3gnKSA/XG4gICAgICAgIGZ1bmN0aW9uIChlLCBhKSB7XG4gICAgICAgICAgcmV0dXJuIGEgPT09ICdjbGFzcycgPyBlLmNsYXNzTmFtZSA6IChhID09PSAnaHJlZicgfHwgYSA9PT0gJ3NyYycpID9cbiAgICAgICAgICAgIGUuZ2V0QXR0cmlidXRlKGEsIDIpIDogZS5nZXRBdHRyaWJ1dGUoYSlcbiAgICAgICAgfSA6XG4gICAgICAgIGZ1bmN0aW9uIChlLCBhKSB7IHJldHVybiBlLmdldEF0dHJpYnV0ZShhKSB9XG4gICAgfSgpXG4gICwgaGFzQnlDbGFzcyA9ICEhZG9jW2J5Q2xhc3NdXG4gICAgLy8gaGFzIG5hdGl2ZSBxU0Egc3VwcG9ydFxuICAsIGhhc1FTQSA9IGRvYy5xdWVyeVNlbGVjdG9yICYmIGRvY1txU0FdXG4gICAgLy8gdXNlIG5hdGl2ZSBxU0FcbiAgLCBzZWxlY3RRU0EgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIHJvb3QpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXSwgc3MsIGVcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChyb290W25vZGVUeXBlXSA9PT0gOSB8fCAhc3BsaXR0YWJsZS50ZXN0KHNlbGVjdG9yKSkge1xuICAgICAgICAgIC8vIG1vc3Qgd29yayBpcyBkb25lIHJpZ2h0IGhlcmUsIGRlZmVyIHRvIHFTQVxuICAgICAgICAgIHJldHVybiBhcnJheWlmeShyb290W3FTQV0oc2VsZWN0b3IpKVxuICAgICAgICB9XG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZSB3aGVyZSB3ZSBuZWVkIHRoZSBzZXJ2aWNlcyBvZiBgY29sbGVjdFNlbGVjdG9yKClgXG4gICAgICAgIGVhY2goc3MgPSBzZWxlY3Rvci5zcGxpdCgnLCcpLCBjb2xsZWN0U2VsZWN0b3Iocm9vdCwgZnVuY3Rpb24gKGN0eCwgcykge1xuICAgICAgICAgIGUgPSBjdHhbcVNBXShzKVxuICAgICAgICAgIGlmIChlLmxlbmd0aCA9PSAxKSByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBlLml0ZW0oMClcbiAgICAgICAgICBlbHNlIGlmIChlLmxlbmd0aCkgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdChhcnJheWlmeShlKSlcbiAgICAgICAgfSkpXG4gICAgICAgIHJldHVybiBzcy5sZW5ndGggPiAxICYmIHJlc3VsdC5sZW5ndGggPiAxID8gdW5pcShyZXN1bHQpIDogcmVzdWx0XG4gICAgICB9IGNhdGNoIChleCkgeyB9XG4gICAgICByZXR1cm4gc2VsZWN0Tm9uTmF0aXZlKHNlbGVjdG9yLCByb290KVxuICAgIH1cbiAgICAvLyBubyBuYXRpdmUgc2VsZWN0b3Igc3VwcG9ydFxuICAsIHNlbGVjdE5vbk5hdGl2ZSA9IGZ1bmN0aW9uIChzZWxlY3Rvciwgcm9vdCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdLCBpdGVtcywgbSwgaSwgbCwgciwgc3NcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZShub3JtYWxpenIsICckMScpXG4gICAgICBpZiAobSA9IHNlbGVjdG9yLm1hdGNoKHRhZ0FuZE9yQ2xhc3MpKSB7XG4gICAgICAgIHIgPSBjbGFzc1JlZ2V4KG1bMl0pXG4gICAgICAgIGl0ZW1zID0gcm9vdFtieVRhZ10obVsxXSB8fCAnKicpXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBpdGVtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoci50ZXN0KGl0ZW1zW2ldLmNsYXNzTmFtZSkpIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IGl0ZW1zW2ldXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfVxuICAgICAgLy8gbW9yZSBjb21wbGV4IHNlbGVjdG9yLCBnZXQgYF9xd2VyeSgpYCB0byBkbyB0aGUgd29yayBmb3IgdXNcbiAgICAgIGVhY2goc3MgPSBzZWxlY3Rvci5zcGxpdCgnLCcpLCBjb2xsZWN0U2VsZWN0b3Iocm9vdCwgZnVuY3Rpb24gKGN0eCwgcywgcmV3cml0ZSkge1xuICAgICAgICByID0gX3F3ZXJ5KHMsIGN0eClcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IHIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGN0eFtub2RlVHlwZV0gPT09IDkgfHwgcmV3cml0ZSB8fCBpc0FuY2VzdG9yKHJbaV0sIHJvb3QpKSByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSByW2ldXG4gICAgICAgIH1cbiAgICAgIH0pKVxuICAgICAgcmV0dXJuIHNzLmxlbmd0aCA+IDEgJiYgcmVzdWx0Lmxlbmd0aCA+IDEgPyB1bmlxKHJlc3VsdCkgOiByZXN1bHRcbiAgICB9XG4gICwgY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIC8vIGNvbmZpZ05hdGl2ZVFTQTogdXNlIGZ1bGx5LWludGVybmFsIHNlbGVjdG9yIG9yIG5hdGl2ZSBxU0Egd2hlcmUgcHJlc2VudFxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW3VzZU5hdGl2ZVFTQV0gIT09ICd1bmRlZmluZWQnKVxuICAgICAgICBzZWxlY3QgPSAhb3B0aW9uc1t1c2VOYXRpdmVRU0FdID8gc2VsZWN0Tm9uTmF0aXZlIDogaGFzUVNBID8gc2VsZWN0UVNBIDogc2VsZWN0Tm9uTmF0aXZlXG4gICAgfVxuXG4gIGNvbmZpZ3VyZSh7IHVzZU5hdGl2ZVFTQTogdHJ1ZSB9KVxuXG4gIHF3ZXJ5LmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZVxuICBxd2VyeS51bmlxID0gdW5pcVxuICBxd2VyeS5pcyA9IGlzXG4gIHF3ZXJ5LnBzZXVkb3MgPSB7fVxuXG4gIHJldHVybiBxd2VyeVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGhhc0tleXNcblxuZnVuY3Rpb24gaGFzS2V5cyhzb3VyY2UpIHtcbiAgICByZXR1cm4gc291cmNlICE9PSBudWxsICYmXG4gICAgICAgICh0eXBlb2Ygc291cmNlID09PSBcIm9iamVjdFwiIHx8XG4gICAgICAgIHR5cGVvZiBzb3VyY2UgPT09IFwiZnVuY3Rpb25cIilcbn1cbiIsInZhciBLZXlzID0gcmVxdWlyZShcIm9iamVjdC1rZXlzXCIpXG52YXIgaGFzS2V5cyA9IHJlcXVpcmUoXCIuL2hhcy1rZXlzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kXG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBpZiAoIWhhc0tleXMoc291cmNlKSkge1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzID0gS2V5cyhzb3VyY2UpXG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGtleXNbal1cbiAgICAgICAgICAgIHRhcmdldFtuYW1lXSA9IHNvdXJjZVtuYW1lXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIiwidmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChmbikge1xuXHR2YXIgaXNGdW5jID0gKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyAmJiAhKGZuIGluc3RhbmNlb2YgUmVnRXhwKSkgfHwgdG9TdHJpbmcuY2FsbChmbikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdGlmICghaXNGdW5jICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0aXNGdW5jID0gZm4gPT09IHdpbmRvdy5zZXRUaW1lb3V0IHx8IGZuID09PSB3aW5kb3cuYWxlcnQgfHwgZm4gPT09IHdpbmRvdy5jb25maXJtIHx8IGZuID09PSB3aW5kb3cucHJvbXB0O1xuXHR9XG5cdHJldHVybiBpc0Z1bmM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuXHRpZiAoIWlzRnVuY3Rpb24oZm4pKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignaXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cdH1cblx0dmFyIGksIGssXG5cdFx0aXNTdHJpbmcgPSB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyxcblx0XHRsID0gb2JqLmxlbmd0aCxcblx0XHRjb250ZXh0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuXHRpZiAobCA9PT0gK2wpIHtcblx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRpZiAoY29udGV4dCA9PT0gbnVsbCkge1xuXHRcdFx0XHRmbihpc1N0cmluZyA/IG9iai5jaGFyQXQoaSkgOiBvYmpbaV0sIGksIG9iaik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmbi5jYWxsKGNvbnRleHQsIGlzU3RyaW5nID8gb2JqLmNoYXJBdChpKSA6IG9ialtpXSwgaSwgb2JqKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Zm9yIChrIGluIG9iaikge1xuXHRcdFx0aWYgKGhhc093bi5jYWxsKG9iaiwgaykpIHtcblx0XHRcdFx0aWYgKGNvbnRleHQgPT09IG51bGwpIHtcblx0XHRcdFx0XHRmbihvYmpba10sIGssIG9iaik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm4uY2FsbChjb250ZXh0LCBvYmpba10sIGssIG9iaik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgcmVxdWlyZSgnLi9zaGltJyk7XG5cbiIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcblx0dmFyIHN0ciA9IHRvU3RyaW5nLmNhbGwodmFsdWUpO1xuXHR2YXIgaXNBcmd1bWVudHMgPSBzdHIgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXHRpZiAoIWlzQXJndW1lbnRzKSB7XG5cdFx0aXNBcmd1bWVudHMgPSBzdHIgIT09ICdbb2JqZWN0IEFycmF5XSdcblx0XHRcdCYmIHZhbHVlICE9PSBudWxsXG5cdFx0XHQmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG5cdFx0XHQmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJ1xuXHRcdFx0JiYgdmFsdWUubGVuZ3RoID49IDBcblx0XHRcdCYmIHRvU3RyaW5nLmNhbGwodmFsdWUuY2FsbGVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0fVxuXHRyZXR1cm4gaXNBcmd1bWVudHM7XG59O1xuXG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHQvLyBtb2RpZmllZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvZXM1LXNoaW1cblx0dmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG5cdFx0dG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuXHRcdGZvckVhY2ggPSByZXF1aXJlKCcuL2ZvcmVhY2gnKSxcblx0XHRpc0FyZ3MgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG5cdFx0aGFzRG9udEVudW1CdWcgPSAhKHsndG9TdHJpbmcnOiBudWxsfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyksXG5cdFx0aGFzUHJvdG9FbnVtQnVnID0gKGZ1bmN0aW9uICgpIHt9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgncHJvdG90eXBlJyksXG5cdFx0ZG9udEVudW1zID0gW1xuXHRcdFx0XCJ0b1N0cmluZ1wiLFxuXHRcdFx0XCJ0b0xvY2FsZVN0cmluZ1wiLFxuXHRcdFx0XCJ2YWx1ZU9mXCIsXG5cdFx0XHRcImhhc093blByb3BlcnR5XCIsXG5cdFx0XHRcImlzUHJvdG90eXBlT2ZcIixcblx0XHRcdFwicHJvcGVydHlJc0VudW1lcmFibGVcIixcblx0XHRcdFwiY29uc3RydWN0b3JcIlxuXHRcdF0sXG5cdFx0a2V5c1NoaW07XG5cblx0a2V5c1NoaW0gPSBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuXHRcdHZhciBpc09iamVjdCA9IG9iamVjdCAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0Jyxcblx0XHRcdGlzRnVuY3Rpb24gPSB0b1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG5cdFx0XHRpc0FyZ3VtZW50cyA9IGlzQXJncyhvYmplY3QpLFxuXHRcdFx0dGhlS2V5cyA9IFtdO1xuXG5cdFx0aWYgKCFpc09iamVjdCAmJiAhaXNGdW5jdGlvbiAmJiAhaXNBcmd1bWVudHMpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3Qua2V5cyBjYWxsZWQgb24gYSBub24tb2JqZWN0XCIpO1xuXHRcdH1cblxuXHRcdGlmIChpc0FyZ3VtZW50cykge1xuXHRcdFx0Zm9yRWFjaChvYmplY3QsIGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHR0aGVLZXlzLnB1c2godmFsdWUpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBuYW1lLFxuXHRcdFx0XHRza2lwUHJvdG8gPSBoYXNQcm90b0VudW1CdWcgJiYgaXNGdW5jdGlvbjtcblxuXHRcdFx0Zm9yIChuYW1lIGluIG9iamVjdCkge1xuXHRcdFx0XHRpZiAoIShza2lwUHJvdG8gJiYgbmFtZSA9PT0gJ3Byb3RvdHlwZScpICYmIGhhcy5jYWxsKG9iamVjdCwgbmFtZSkpIHtcblx0XHRcdFx0XHR0aGVLZXlzLnB1c2gobmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoaGFzRG9udEVudW1CdWcpIHtcblx0XHRcdHZhciBjdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuXHRcdFx0XHRza2lwQ29uc3RydWN0b3IgPSBjdG9yICYmIGN0b3IucHJvdG90eXBlID09PSBvYmplY3Q7XG5cblx0XHRcdGZvckVhY2goZG9udEVudW1zLCBmdW5jdGlvbiAoZG9udEVudW0pIHtcblx0XHRcdFx0aWYgKCEoc2tpcENvbnN0cnVjdG9yICYmIGRvbnRFbnVtID09PSAnY29uc3RydWN0b3InKSAmJiBoYXMuY2FsbChvYmplY3QsIGRvbnRFbnVtKSkge1xuXHRcdFx0XHRcdHRoZUtleXMucHVzaChkb250RW51bSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhlS2V5cztcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGtleXNTaGltO1xufSgpKTtcblxuIiwidmFyIGdsb2JhbD10eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge307LypcbiAqXG4gKiBUaGlzIGlzIHVzZWQgdG8gYnVpbGQgdGhlIGJ1bmRsZSB3aXRoIGJyb3dzZXJpZnkuXG4gKlxuICogVGhlIGJ1bmRsZSBpcyB1c2VkIGJ5IHBlb3BsZSB3aG8gZG9lc24ndCB1c2UgYnJvd3NlcmlmeS5yZXF1aXJlXG4gKiBUaG9zZSB3aG8gdXNlIGJyb3dzZXJpZnkgd2lsbCBpbnN0YWxsIHdpdGggbnBtIGFuZCByZXF1aXJlIHRoZSBtb2R1bGUsXG4gKiB0aGUgcGFja2FnZS5qc29uIGZpbGUgcG9pbnRzIHRvIGluZGV4LmpzLlxuICovXG52YXIgQXV0aDBXaWRnZXQgPSByZXF1aXJlKCcuL3dpZGdldCcpO1xudmFyIGluc2VydENzcyAgID0gcmVxdWlyZSgnLi9saWIvaW5zZXJ0LWNzcycpO1xudmFyIGZzICAgICAgICAgID0gcmVxdWlyZSgnZnMnKTtcblxuaW5zZXJ0Q3NzKFwiQGNoYXJzZXQgXFxcIlVURi04XFxcIjsjYXV0aDAtd2lkZ2V0ey8qIVxcbiogQ2xlYW5TbGF0ZVxcbiogICBnaXRodWIuY29tL3ByZW1hc2FnYXIvY2xlYW5zbGF0ZVxcbipcXG4qLy8qIVxcblxcdFpvY2lhbCBCdXRvbnNcXG5cXHRodHRwOi8vem9jaWFsLnNtY2xsbnMuY29tXFxuXFx0YnkgU2FtIENvbGxpbnMgKEBzbWNsbG5zKVxcblxcdExpY2Vuc2U6IGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcXG5cXHRcXG5cXHRZb3UgYXJlIGZyZWUgdG8gdXNlIGFuZCBtb2RpZnksIGFzIGxvbmcgYXMgeW91IGtlZXAgdGhpcyBsaWNlbnNlIGNvbW1lbnQgaW50YWN0IG9yIGxpbmsgYmFjayB0byB6b2NpYWwuc21jbGxucy5jb20gb24geW91ciBzaXRlLlxcbiovLyohIG5vcm1hbGl6ZS5jc3MgdjEuMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXQuaW8vbm9ybWFsaXplICovfSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoMSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGgyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDMsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoNCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg1LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDYsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBwLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZHQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGZvcm0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzZWxlY3QsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvcHRpb24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBwcmUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkaXYsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0YWJsZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRoLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGJvZHksI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0Zm9vdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNhcHRpb24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0aGVhZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbGksI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhZGRyZXNzLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYmxvY2txdW90ZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZmllbGRzZXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsaSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlmcmFtZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHN0cm9uZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxlZ2VuZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGVtLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNpdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzcGFuLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzdXAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsYWJlbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRmbiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9iamVjdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJpZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb250LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2FtcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFjcm9ueW0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzbWFsbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGltZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHN0cmlrZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNvZGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzdWIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnMsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ZXh0YXJlYSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHZhciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhYmJyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXBwbGV0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUga2JkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdHQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBiLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGhyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXJ0aWNsZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFzaWRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGlhbG9nLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZmlndXJlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZm9vdGVyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaGVhZGVyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaGdyb3VwLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG5hdiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlY3Rpb24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0aW1lLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWFyaywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGF1ZGlvLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdmlkZW97YmFja2dyb3VuZC1hdHRhY2htZW50OnNjcm9sbCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1pbWFnZTpub25lIWltcG9ydGFudDtiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgMCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1yZXBlYXQ6cmVwZWF0IWltcG9ydGFudDtib3JkZXItY29sb3I6YmxhY2shaW1wb3J0YW50O2JvcmRlci1jb2xvcjpjdXJyZW50Q29sb3IhaW1wb3J0YW50O2JvcmRlci1yYWRpdXM6MCFpbXBvcnRhbnQ7Ym9yZGVyLXN0eWxlOm5vbmUhaW1wb3J0YW50O2JvcmRlci13aWR0aDptZWRpdW0haW1wb3J0YW50O2JvdHRvbTphdXRvIWltcG9ydGFudDtjbGVhcjpub25lIWltcG9ydGFudDtjbGlwOmF1dG8haW1wb3J0YW50O2NvbG9yOmluaGVyaXQhaW1wb3J0YW50O2NvdW50ZXItaW5jcmVtZW50Om5vbmUhaW1wb3J0YW50O2NvdW50ZXItcmVzZXQ6bm9uZSFpbXBvcnRhbnQ7Y3Vyc29yOmF1dG8haW1wb3J0YW50O2RpcmVjdGlvbjppbmhlcml0IWltcG9ydGFudDtkaXNwbGF5OmlubGluZSFpbXBvcnRhbnQ7ZmxvYXQ6bm9uZSFpbXBvcnRhbnQ7Zm9udC1mYW1pbHk6aW5oZXJpdCFpbXBvcnRhbnQ7Zm9udC1zaXplOmluaGVyaXQhaW1wb3J0YW50O2ZvbnQtc3R5bGU6aW5oZXJpdCFpbXBvcnRhbnQ7Zm9udC12YXJpYW50Om5vcm1hbCFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6aW5oZXJpdCFpbXBvcnRhbnQ7aGVpZ2h0OmF1dG8haW1wb3J0YW50O2xlZnQ6YXV0byFpbXBvcnRhbnQ7bGV0dGVyLXNwYWNpbmc6bm9ybWFsIWltcG9ydGFudDtsaW5lLWhlaWdodDppbmhlcml0IWltcG9ydGFudDtsaXN0LXN0eWxlLXR5cGU6aW5oZXJpdCFpbXBvcnRhbnQ7bGlzdC1zdHlsZS1wb3NpdGlvbjpvdXRzaWRlIWltcG9ydGFudDtsaXN0LXN0eWxlLWltYWdlOm5vbmUhaW1wb3J0YW50O21hcmdpbjowIWltcG9ydGFudDttYXgtaGVpZ2h0Om5vbmUhaW1wb3J0YW50O21heC13aWR0aDpub25lIWltcG9ydGFudDttaW4taGVpZ2h0OjAhaW1wb3J0YW50O21pbi13aWR0aDowIWltcG9ydGFudDtvcGFjaXR5OjE7b3V0bGluZTppbnZlcnQgbm9uZSBtZWRpdW0haW1wb3J0YW50O292ZXJmbG93OnZpc2libGUhaW1wb3J0YW50O3BhZGRpbmc6MCFpbXBvcnRhbnQ7cG9zaXRpb246c3RhdGljIWltcG9ydGFudDtxdW90ZXM6XFxcIlxcXCIgXFxcIlxcXCIhaW1wb3J0YW50O3JpZ2h0OmF1dG8haW1wb3J0YW50O3RhYmxlLWxheW91dDphdXRvIWltcG9ydGFudDt0ZXh0LWFsaWduOmluaGVyaXQhaW1wb3J0YW50O3RleHQtZGVjb3JhdGlvbjppbmhlcml0IWltcG9ydGFudDt0ZXh0LWluZGVudDowIWltcG9ydGFudDt0ZXh0LXRyYW5zZm9ybTpub25lIWltcG9ydGFudDt0b3A6YXV0byFpbXBvcnRhbnQ7dW5pY29kZS1iaWRpOm5vcm1hbCFpbXBvcnRhbnQ7dmVydGljYWwtYWxpZ246YmFzZWxpbmUhaW1wb3J0YW50O3Zpc2liaWxpdHk6aW5oZXJpdCFpbXBvcnRhbnQ7d2hpdGUtc3BhY2U6bm9ybWFsIWltcG9ydGFudDt3aWR0aDphdXRvIWltcG9ydGFudDt3b3JkLXNwYWNpbmc6bm9ybWFsIWltcG9ydGFudDt6LWluZGV4OmF1dG8haW1wb3J0YW50Oy1tb3otYm9yZGVyLXJhZGl1czowIWltcG9ydGFudDstd2Via2l0LWJvcmRlci1yYWRpdXM6MCFpbXBvcnRhbnQ7LW1vei1ib3gtc2l6aW5nOmNvbnRlbnQtYm94IWltcG9ydGFudDstd2Via2l0LWJveC1zaXppbmc6Y29udGVudC1ib3ghaW1wb3J0YW50O2JveC1zaXppbmc6Y29udGVudC1ib3ghaW1wb3J0YW50O3RleHQtc2hhZG93Om5vbmUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoMywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg1LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGgxLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb3JtLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VsZWN0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb3B0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcHJlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGl2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjYXB0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFkZHJlc3MsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBibG9ja3F1b3RlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmaWVsZHNldCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRleHRhcmVhLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaHIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhcnRpY2xlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXNpZGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkaWFsb2csI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmaWd1cmUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb290ZXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoZWFkZXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoZ3JvdXAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbmF2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VjdGlvbntkaXNwbGF5OmJsb2NrIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRhYmxle2Rpc3BsYXk6dGFibGUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGhlYWR7ZGlzcGxheTp0YWJsZS1oZWFkZXItZ3JvdXAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGJvZHl7ZGlzcGxheTp0YWJsZS1yb3ctZ3JvdXAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGZvb3R7ZGlzcGxheTp0YWJsZS1mb290ZXItZ3JvdXAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdHJ7ZGlzcGxheTp0YWJsZS1yb3chaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGgsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ZHtkaXNwbGF5OnRhYmxlLWNlbGwhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbmF2IHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbmF2IG9se2xpc3Qtc3R5bGUtdHlwZTpub25lIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudXtsaXN0LXN0eWxlLXR5cGU6ZGlzYyFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbHtsaXN0LXN0eWxlLXR5cGU6ZGVjaW1hbCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSBtZW51e2xpc3Qtc3R5bGUtdHlwZTpjaXJjbGUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgb2wgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCB1bCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG1lbnUgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCBvbCBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgdWwgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG1lbnUgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIG9sIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgdWwgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBtZW51IHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgb2wgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIHVsIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBtZW51IG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IG9sIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSB1bCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgbWVudSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgb2wgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgdWwgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgbWVudSBtZW51e2xpc3Qtc3R5bGUtdHlwZTpzcXVhcmUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbGl7ZGlzcGxheTpsaXN0LWl0ZW0haW1wb3J0YW50O21pbi1oZWlnaHQ6YXV0byFpbXBvcnRhbnQ7bWluLXdpZHRoOmF1dG8haW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc3Ryb25ne2ZvbnQtd2VpZ2h0OmJvbGQhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZW17Zm9udC1zdHlsZTppdGFsaWMhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUga2JkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2FtcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNvZGV7Zm9udC1mYW1pbHk6bW9ub3NwYWNlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhICosI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPXN1Ym1pdF0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPXJhZGlvXSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0W3R5cGU9Y2hlY2tib3hdLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VsZWN0e2N1cnNvcjpwb2ludGVyIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGE6aG92ZXJ7dGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBidXR0b24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPXN1Ym1pdF17dGV4dC1hbGlnbjpjZW50ZXIhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXRbdHlwZT1oaWRkZW5de2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhYmJyW3RpdGxlXSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFjcm9ueW1bdGl0bGVdLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGZuW3RpdGxlXXtjdXJzb3I6aGVscCFpbXBvcnRhbnQ7Ym9yZGVyLWJvdHRvbS13aWR0aDoxcHghaW1wb3J0YW50O2JvcmRlci1ib3R0b20tc3R5bGU6ZG90dGVkIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGluc3tiYWNrZ3JvdW5kLWNvbG9yOiNmZjkhaW1wb3J0YW50O2NvbG9yOmJsYWNrIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRlbHt0ZXh0LWRlY29yYXRpb246bGluZS10aHJvdWdoIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJsb2NrcXVvdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBxe3F1b3Rlczpub25lIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJsb2NrcXVvdGU6YmVmb3JlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYmxvY2txdW90ZTphZnRlciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHE6YmVmb3JlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcTphZnRlciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxpOmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxpOmFmdGVye2NvbnRlbnQ6XFxcIlxcXCIhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzZWxlY3R7dmVydGljYWwtYWxpZ246bWlkZGxlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlbGVjdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRleHRhcmVhLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXR7Ym9yZGVyOjFweCBzb2xpZCAjY2NjIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRhYmxle2JvcmRlci1jb2xsYXBzZTpjb2xsYXBzZSFpbXBvcnRhbnQ7Ym9yZGVyLXNwYWNpbmc6MCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBocntkaXNwbGF5OmJsb2NrIWltcG9ydGFudDtoZWlnaHQ6MXB4IWltcG9ydGFudDtib3JkZXI6MCFpbXBvcnRhbnQ7Ym9yZGVyLXRvcDoxcHggc29saWQgI2NjYyFpbXBvcnRhbnQ7bWFyZ2luOjFlbSAwIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlICpbZGlyPXJ0bF17ZGlyZWN0aW9uOnJ0bCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtYXJre2JhY2tncm91bmQtY29sb3I6I2ZmOSFpbXBvcnRhbnQ7Y29sb3I6YmxhY2shaW1wb3J0YW50O2ZvbnQtc3R5bGU6aXRhbGljIWltcG9ydGFudDtmb250LXdlaWdodDpib2xkIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRle2ZvbnQtc2l6ZTptZWRpdW0haW1wb3J0YW50O2xpbmUtaGVpZ2h0OjEhaW1wb3J0YW50O2RpcmVjdGlvbjpsdHIhaW1wb3J0YW50O3RleHQtYWxpZ246bGVmdCFpbXBvcnRhbnQ7Zm9udC1mYW1pbHk6XFxcIlRpbWVzIE5ldyBSb21hblxcXCIsVGltZXMsc2VyaWYhaW1wb3J0YW50O2NvbG9yOmJsYWNrIWltcG9ydGFudDtmb250LXN0eWxlOm5vcm1hbCFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6bm9ybWFsIWltcG9ydGFudDt0ZXh0LWRlY29yYXRpb246bm9uZSFpbXBvcnRhbnQ7bGlzdC1zdHlsZS10eXBlOmRpc2MhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLnpvY2lhbCwjYXV0aDAtd2lkZ2V0IGEuem9jaWFse2JvcmRlcjoxcHggc29saWQgIzc3Nztib3JkZXItY29sb3I6cmdiYSgwLDAsMCwwLjIpO2JvcmRlci1ib3R0b20tY29sb3I6IzMzMztib3JkZXItYm90dG9tLWNvbG9yOnJnYmEoMCwwLDAsMC40KTtjb2xvcjojZmZmOy1tb3otYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC40KSxpbnNldCAwIDAgLjFlbSByZ2JhKDI1NSwyNTUsMjU1LDAuOSk7Ym94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTtjdXJzb3I6cG9pbnRlcjtkaXNwbGF5OmlubGluZS1ibG9jaztmb250OmJvbGQgMTAwJS8yLjEgXFxcIkx1Y2lkYSBHcmFuZGVcXFwiLFRhaG9tYSxzYW5zLXNlcmlmO3BhZGRpbmc6MCAuOTVlbSAwIDA7dGV4dC1hbGlnbjpjZW50ZXI7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDAsMCwwLDAuNSk7d2hpdGUtc3BhY2U6bm93cmFwOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTtwb3NpdGlvbjpyZWxhdGl2ZTstbW96LWJvcmRlci1yYWRpdXM6LjNlbTstd2Via2l0LWJvcmRlci1yYWRpdXM6LjNlbTtib3JkZXItcmFkaXVzOi4zZW19I2F1dGgwLXdpZGdldCAuem9jaWFsOmJlZm9yZXtjb250ZW50OlxcXCJcXFwiO2JvcmRlci1yaWdodDouMDc1ZW0gc29saWQgcmdiYSgwLDAsMCwwLjEpO2Zsb2F0OmxlZnQ7Zm9udDoxMjAlLzEuNjUgem9jaWFsO2ZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDttYXJnaW46MCAuNWVtIDAgMDtwYWRkaW5nOjAgLjVlbTt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LWRlY29yYXRpb246bm9uZTt0ZXh0LXRyYW5zZm9ybTpub25lOy1tb3otYm94LXNoYWRvdzouMDc1ZW0gMCAwIHJnYmEoMjU1LDI1NSwyNTUsMC4yNSk7LXdlYmtpdC1ib3gtc2hhZG93Oi4wNzVlbSAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjI1KTtib3gtc2hhZG93Oi4wNzVlbSAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjI1KTstbW96LWZvbnQtc21vb3RoaW5nOmFudGlhbGlhc2VkOy13ZWJraXQtZm9udC1zbW9vdGhpbmc6YW50aWFsaWFzZWQ7Zm9udC1zbW9vdGhpbmc6YW50aWFsaWFzZWR9I2F1dGgwLXdpZGdldCAuem9jaWFsOmFjdGl2ZXtvdXRsaW5lOjB9I2F1dGgwLXdpZGdldCAuem9jaWFsLmljb257b3ZlcmZsb3c6aGlkZGVuO21heC13aWR0aDoyLjRlbTtwYWRkaW5nLWxlZnQ6MDtwYWRkaW5nLXJpZ2h0OjA7bWF4LWhlaWdodDoyLjE1ZW07d2hpdGUtc3BhY2U6bm93cmFwfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5pY29uOmJlZm9yZXtwYWRkaW5nOjA7d2lkdGg6MmVtO2hlaWdodDoyZW07Ym94LXNoYWRvdzpub25lO2JvcmRlcjowfSNhdXRoMC13aWRnZXQgLnpvY2lhbHtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwLjA1KSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwLjA1KSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwLjEpKSxjb2xvci1zdG9wKDQ5JSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpKSxjb2xvci1zdG9wKDUxJSxyZ2JhKDAsMCwwLDAuMDUpKSx0byhyZ2JhKDAsMCwwLDAuMSkpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbDpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWw6Zm9jdXN7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkgNDklLHJnYmEoMCwwLDAsMC4xKSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWdyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxsZWZ0IGJvdHRvbSxmcm9tKHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkpLGNvbG9yLXN0b3AoNDklLHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkpLGNvbG9yLXN0b3AoNTElLHJnYmEoMCwwLDAsMC4xKSksdG8ocmdiYSgwLDAsMCwwLjE1KSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjE1KSA0OSUscmdiYSgwLDAsMCwwLjEpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbDphY3RpdmV7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsdHJhbnNwYXJlbnQgNTAlLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWdyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxsZWZ0IGJvdHRvbSxmcm9tKHJnYmEoMjU1LDI1NSwyNTUsMC4xKSksY29sb3Itc3RvcCgzMCUscmdiYSgyNTUsMjU1LDI1NSwwKSksY29sb3Itc3RvcCg1MCUsdHJhbnNwYXJlbnQpLHRvKHJnYmEoMCwwLDAsMC4xKSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSx0cmFuc3BhcmVudCA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94LCNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWIsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5vcGVuaWQsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc3RhY2tvdmVyZmxvdywjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZXtib3JkZXI6MXB4IHNvbGlkICNhYWE7Ym9yZGVyLWNvbG9yOnJnYmEoMCwwLDAsMC4zKTtib3JkZXItYm90dG9tLWNvbG9yOiM3Nzc7Ym9yZGVyLWJvdHRvbS1jb2xvcjpyZ2JhKDAsMCwwLDAuNSk7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNyksaW5zZXQgMCAwIC4wOGVtIHJnYmEoMjU1LDI1NSwyNTUsMC41KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC43KSxpbnNldCAwIDAgLjA4ZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjUpO2JveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC43KSxpbnNldCAwIDAgLjA4ZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjUpO3RleHQtc2hhZG93OjAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjgpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94OmZvY3VzLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94OmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWI6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdpdGh1Yjpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ21haWw6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsOmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5vcGVuaWQ6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZDpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5OmZvY3VzLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnk6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3c6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3c6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLnR3aXR0ZXI6Zm9jdXMgLnpvY2lhbC50d2l0dGVyOmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmZvY3VzIC56b2NpYWwuc2FsZXNmb3JjZTpob3ZlcntiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwLjUpKSxjb2xvci1zdG9wKDQ5JSxyZ2JhKDI1NSwyNTUsMjU1LDAuMikpLGNvbG9yLXN0b3AoNTElLHJnYmEoMCwwLDAsMC4wNSkpLHRvKHJnYmEoMCwwLDAsMC4xNSkpKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudCh0b3AscmdiYSgyNTUsMjU1LDI1NSwwLjUpLHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCh0b3AscmdiYSgyNTUsMjU1LDI1NSwwLjUpLHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjE1KSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3g6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWI6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5nbWFpbDphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZDphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeTphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3c6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC53aWtpcGVkaWE6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmFjdGl2ZXtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwKSksY29sb3Itc3RvcCgzMCUscmdiYSgyNTUsMjU1LDI1NSwwKSksY29sb3Itc3RvcCg1MCUscmdiYSgwLDAsMCwwKSksdG8ocmdiYSgwLDAsMCwwLjEpKSk7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMCkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUscmdiYSgwLDAsMCwwKSA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDApLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHJnYmEoMCwwLDAsMCkgNTAlLHJnYmEoMCwwLDAsMC4xKSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmFtYXpvbjpiZWZvcmV7Y29udGVudDpcXFwiYVxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3g6YmVmb3Jle2NvbnRlbnQ6XFxcImRcXFwiO2NvbG9yOiMxZjc1Y2N9I2F1dGgwLXdpZGdldCAuem9jaWFsLmZhY2Vib29rOmJlZm9yZXtjb250ZW50OlxcXCJmXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ2l0aHViOmJlZm9yZXtjb250ZW50OlxcXCJcXFxcMDBFOFxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsOmJlZm9yZXtjb250ZW50OlxcXCJtXFxcIjtjb2xvcjojZjAwfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nb29nbGU6YmVmb3Jle2NvbnRlbnQ6XFxcIkdcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nb29nbGVwbHVzOmJlZm9yZXtjb250ZW50OlxcXCIrXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ3Vlc3Q6YmVmb3Jle2NvbnRlbnQ6XFxcIj9cXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5pZTpiZWZvcmV7Y29udGVudDpcXFwiNlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmxpbmtlZGluOmJlZm9yZXtjb250ZW50OlxcXCJMXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwub3BlbmlkOmJlZm9yZXtjb250ZW50OlxcXCJvXFxcIjtjb2xvcjojZmY5MjFkfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wYXlwYWw6YmVmb3Jle2NvbnRlbnQ6XFxcIiRcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zdGFja292ZXJmbG93OmJlZm9yZXtjb250ZW50OlxcXCJcXFxcMDBFQ1xcXCI7Y29sb3I6I2ZmN2ExNX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudHdpdHRlcjpiZWZvcmV7Y29udGVudDpcXFwiVFxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnZrOmJlZm9yZXtjb250ZW50OlxcXCJOXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2luZG93czpiZWZvcmV7Y29udGVudDpcXFwiV1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnlhaG9vOmJlZm9yZXtjb250ZW50OlxcXCJZXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwub2ZmaWNlMzY1OmJlZm9yZXtjb250ZW50OlxcXCJ6XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudGhpcnR5c2V2ZW5zaWduYWxzOmJlZm9yZXtjb250ZW50OlxcXCJiXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZTpiZWZvcmV7Y29udGVudDpcXFwiKlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWQ6YmVmb3Jle2NvbnRlbnQ6XFxcInpcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5ib3g6YmVmb3Jle2NvbnRlbnQ6XFxcInhcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5hbWF6b257YmFja2dyb3VuZC1jb2xvcjojZmZhZDFkO2NvbG9yOiMwMzAwMzc7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuNSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3h7YmFja2dyb3VuZC1jb2xvcjojZmZmO2NvbG9yOiMzMTJjMmF9I2F1dGgwLXdpZGdldCAuem9jaWFsLmZhY2Vib29re2JhY2tncm91bmQtY29sb3I6IzQ4NjNhZX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ2l0aHVie2JhY2tncm91bmQtY29sb3I6I2ZiZmJmYjtjb2xvcjojMDUwNTA1fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nbWFpbHtiYWNrZ3JvdW5kLWNvbG9yOiNlZmVmZWY7Y29sb3I6IzIyMn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ29vZ2xle2JhY2tncm91bmQtY29sb3I6IzRlNmNmN30jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ29vZ2xlcGx1c3tiYWNrZ3JvdW5kLWNvbG9yOiNkZDRiMzl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmd1ZXN0e2JhY2tncm91bmQtY29sb3I6IzFiNGQ2ZH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuaWV7YmFja2dyb3VuZC1jb2xvcjojMDBhMWQ5fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5saW5rZWRpbntiYWNrZ3JvdW5kLWNvbG9yOiMwMDgzYTh9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZHtiYWNrZ3JvdW5kLWNvbG9yOiNmNWY1ZjU7Y29sb3I6IzMzM30jYXV0aDAtd2lkZ2V0IC56b2NpYWwucGF5cGFse2JhY2tncm91bmQtY29sb3I6I2ZmZjtjb2xvcjojMzI2ODlhO3RleHQtc2hhZG93OjAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjUpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC50d2l0dGVye2JhY2tncm91bmQtY29sb3I6IzQ2YzBmYn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudmt7YmFja2dyb3VuZC1jb2xvcjojNDU2ODhlfSNhdXRoMC13aWRnZXQgLnpvY2lhbC53aW5kb3dze2JhY2tncm91bmQtY29sb3I6IzAwNTJhNDtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5vZmZpY2UzNjV7YmFja2dyb3VuZC1jb2xvcjojMDBhY2VkO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWR7YmFja2dyb3VuZC1jb2xvcjojMDBhZGVmO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsc3tiYWNrZ3JvdW5kLWNvbG9yOiM2YWMwNzE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94e2JhY2tncm91bmQtY29sb3I6IzI2N2JiNjtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNle2JhY2tncm91bmQtY29sb3I6I2ZmZjtjb2xvcjojZjAwfSNhdXRoMC13aWRnZXQgLnpvY2lhbC53aW5kb3dze2JhY2tncm91bmQtY29sb3I6IzI2NzJlYztjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wcmltYXJ5LCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnl7bWFyZ2luOi4xZW0gMDtwYWRkaW5nOjAgMWVtfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wcmltYXJ5OmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5OmJlZm9yZXtkaXNwbGF5Om5vbmV9I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnl7YmFja2dyb3VuZC1jb2xvcjojMzMzfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnl7YmFja2dyb3VuZC1jb2xvcjojZjBmMGViO2NvbG9yOiMyMjI7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuOCl9I2F1dGgwLXdpZGdldCBidXR0b246LW1vei1mb2N1cy1pbm5lcntib3JkZXI6MDtwYWRkaW5nOjB9QGZvbnQtZmFjZXtmb250LWZhbWlseTonem9jaWFsJztzcmM6dXJsKCdodHRwczovL3MzLmFtYXpvbmF3cy5jb20vYXNzZXRzLmF1dGgwLmNvbS93Mi9mb250L3pvY2lhbC1yZWd1bGFyLXdlYmZvbnQuZW90Jyl9QGZvbnQtZmFjZXtmb250LWZhbWlseTonem9jaWFsJztzcmM6dXJsKGRhdGE6YXBwbGljYXRpb24vZm9udC13b2ZmO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGQwOUdSZ0FCQUFBQUFCZVFBQTBBQUFBQUlHZ0FBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCR1JsUk5BQUFCTUFBQUFCb0FBQUFjWm51QXlrZEVSVVlBQUFGTUFBQUFId0FBQUNBQVRnQUdUMU12TWdBQUFXd0FBQUJJQUFBQVZrL2wzRUJqYldGd0FBQUJ0QUFBQVBZQUFBSUtubDU2N0dkaGMzQUFBQUtzQUFBQUNBQUFBQWovL3dBRFoyeDVaZ0FBQXJRQUFCS0xBQUFac0FNcEpyQm9aV0ZrQUFBVlFBQUFBREFBQUFBMi8zSlNXV2hvWldFQUFCVndBQUFBSUFBQUFDUUZmUUg1YUcxMGVBQUFGWkFBQUFCakFBQUFnRHRPQWJkc2IyTmhBQUFWOUFBQUFFUUFBQUJFV1paZitHMWhlSEFBQUJZNEFBQUFIZ0FBQUNBQWNBQytibUZ0WlFBQUZsZ0FBQURlQUFBQmhsYkQ5L0p3YjNOMEFBQVhPQUFBQUZZQUFBQnNVZW1oaEhpY1kyQmdZR1FBZ3BPZCtZWWcrbHdseHhrWURRQkErUVlxQUFCNG5HTmdaR0JnNEFOaUNRWVFZR0pnWkdCbVVBQ1NMR0FlQXdBRnhBQlZBSGljWTJCa0VtT2N3TURLd01Ib3c1akd3TURnRHFXL01rZ3l0REF3TURHd01qUEFBTE1BQXdJRXBMbW1NRGd3S0g1Z1lIencvd0dESHVOckJ2VUdCZ1pHa0J3QWo2WUxTSGljdFpDOUxrUlJGSVcvTzY3eHp4MkdZUXd6RWxITU5CTXZvQktOcUlRb2lWQktKQkx4TWxTaW1uSm9LR2k4Z3hlUVVDaDF5N28valp1cnRKTzE5MTduN0hXeTF3RUdTTkVnY0NZSXpZS0VoN3k3cnROeU4rMXVsVFU2ZE5sZ2t5MjIyV0dYZlE0NDRwaFR6ampuZ2t1dXJQcjhRb3BmWThXYWRrNnpaODJoTlNmRkduM3JUUjk2MVl1ZTlhUkhQZWhlZlovM2pGdjFkS2NiWGF1amRwUnUycVU0V2hueVViZTNwajFGMUtoUXRlY3lxZm5ZZjhtcGxGUEVsL1ZHTTJUWnpXQTVQbHI4UFRHVTVHRkc0akxLV0VMSG1aaGtLcHVJYXY3RVNqVmpzOGxxU3pEUFF0SHVNOGJjSDc3K0pYNEE2L1k3TndBQUFBQUFBZi8vQUFKNG5KMVllWXdrVjMydTMzdFY3OVY5SDMxM1QvZjBNZE16UGRObnplR1oyV04ydllmdFhYYlhGMnZ2cnRjMnV3N0dEa1pBREFSSTJCQ2hpRmgyaEwxQmNzQUtpY0xoa0VnSlJKRXdSRUZLTE1jUm9CQW5Va0t3RXNGaTVBQVNPSXFUek9UM3FtY2RrdjlJMS9UME82cGV2WHJ2KzMzZjl5c0pKR24zMjBTQ2IwdEVranlZSWRJT1ZuWWs4Wkd4Nzd2d0E3Z21XVkpGNmtqTGtqUU9ob01LNFRaMGdUZVNZVG9jVE5KSk85NXJDRVJEMHNOeXNnbnBhREp1M1B0eWZybnRxTTVidHMvVnJneXYxTTRkdXQrMVoxM2RlY3VodTJjZWV2OTh2QSs0bkhQM3plYTZDbG12d3ZOQmE3MTkrT1RWOUttVGh3NTFXLzFESjU4QzZ4eHgvUGRCb3dBeVNHUjNkL2NhenZkN1VrM2F4Qm1QSmx2QW9qQ3AwQ2hralhxcnplUEVKcUpBVytOa05Ca080aVJ0dFFlYklFcEJqR2M1TUJtUFd1MldhOTFmK3lXblVQWWJTV1YvTkZkZVZHSlB0U0o2Qmw1cVJQa3R1OXJydzBLWlp5MnVkU3gzZE8xMmVBaHJ1V2IvM0ZDeG82SVQ1NUxnck9zQ2t6MFRMakNhQkpIdjNKRlRUZVphTzU5a0ZFLzJadWRYamdVVlNjWjVmNGVjaCs5S2Jla0c2YkIwQ3RkeU5GbUgxbmlVaW5sbkZkNm9RQlRpWWtaaG5JaGkxcE9HTVM3emVOVHVzWGFyMFdKcEJZYnhwRWVZTWg2T2g5RXdha1NOOGRuOXhVaFY5UEgybWNrblpnZTU0bUpnbE94cTdzeVI3WE9yTnl4dXBCUmtsVnVxTDRmQjBxRTZHMVFycy9wd1l4Wm1MdVV2WGNwdkx4d09jNDREQjVlWERoZTBZVzFwMXZZdHJhTEh2VVp2ZXpqdnpmWVhtenBYZEowWmlra1o5UDl6YmczU042MlF5VWhjZnVtU0JCSWdWbjRWL2hoeElxV2pGUGRmUE5NQUY1eG5EOFc0TFRmcXJBdTROZGt4Qm1idTczYjIzYkd2TXpuYUpBcjFhMEVMUUlITndrbEZreTB0T0dYRUMwZTkybUJoWTJOaFVBdnVTcGRVUlZVdFZWYkFzeldUcW1wRG9valJhL0FzNHVFaDZmM1NSd1FpVW9Ua09vZ1YyNEM5U3B6RXlRQ2hHVStQTjZhRFU4U0ppck5qbStDaXN5NTFsTEJDcHBkUHB6bXFSNkVEakRmcTJieDcwRzZsNDNUVTV3SjJJVDRQWjhwa0dDZWpkZ09McXF4cHpySnFNTzZ6U0srRUliV05ZdEQzSXFiSWxLZzJkNnhjR0tadFBXZXFsazBBZ0JDZ2l2aklXSkpsaDNwbEx3Z1gzU0xSWmNXbXByTy9hWEkxb0lTZUF3YktzbTlTbURITUpLZ1NoNnR3TE5RNVZRelZNQ3VXWmlnVVZEVWhqTE5TNlVTdkV0dDN6TWRGbDVQQ2ZGSTA4RjVVVnFtc1UxRlNHTmNVWXVmYlJieTlQZ1NvRnkwVFVlSXl4ejhmZVlmaExxQ0diY3dyREo0a29IWkJONUFUcU1BeEhNOXd2UG4vUm5HMmFvaGpYT2MwYTROczhhTHdaNEF4WGFnM0JKQkoyYk5CR1ZaSXhiTi9SaHpuY29qalFseFd0YmtWS0VSbFZUemZmKzIrUWx6NERuS2VKODFMRWhFY01vVU16cHA2UTI4ZHhnTGZ3MEVaaGdnU25IalUzNEJHSE5MWmNzbjNQTDhNcGRJalcyK1gxWEs4K3NpUjlRUE50d004UHB4eHZXTGU5WGJlQzdmdGZPYkx2dTdsYnY3aVYyKzZaUVZnMmYwc1JzOS9TRzN5Tm5oTWVoSW5NVVd3Z0d5NmhzR083SWF3clRBRTgwaXNGbWx2d2pxdDBqaEJCT0t5Q1NRaXdEZnBlTElsWjFlS3RSNVVJSnUzalh4Tmt6QWJJM3NPZ1dTY2RRUEJURVd2YU1BeHNTb2pLQkRPQ2tjZ0lSY3FCcU5jNFJDV2dGR21NRVp0b2xMTmxYbXphdG1XYmVoY3pnQU14TUxJcEhvdWh5ZXBxcUhvbHNlVndIWjFRbnpOTHlsZ01nYVV5VG8wbzdDQVZ4cTZadW0wM3FTV1puT1RFNW5YN2FDenY1V01sMEdWR1lWM2kzQUFvRVRYUERvL1IxU0Z5ektHeXFxdXRtd21wcUlobXJsdUlwNjlTREZOVFU5VXFzb1dWRWVtbFUwTXlVU21zbE4yY2cwT3J1b3dtV3V5QmpQRm91SEpZdEpLbDNpYUNxVFE0Q2FSWjJiTDIvZFFUM05zeFBsVUY5K0Z1dGhIak9OeXBzaGI0cWNIR3hBUGV3SUR1TDRDOFFpUFNjcTQrRWFoVFhFeEhmZk5oK2NPbXJydHU0dnJ4VnF4NmkvLzJnbDZmTExTV216YTg4MW12bDNadk8zUlEyODlXeUFyZ3paUjFDTTk0bnFyTTQzSytoSFpzOFkzelduSlVsNXgyeVZ2ZFBuODBZVzE2WHl1a2VQSWMvdVI0emJwRm9qN1ZoUU1zRXlERVJhdGJGZXhQQndNcHp0dHk1elZCV0VSM0Y4YmVHbGxma2JWR05OVnk3TTBwbEl2Tk15RmdnVnlySEEvYjY0dUxESTJEalNxajdhT1RvSzRXVTlVN1pRcWVDQ3g0ZTZaVWNtbGdxM3kxVzV6d2Q0M1dlM25ZNllVT2JFUGRxcnlmSmgzdk5HRFo0NHZXaWFTVGdDR2pqUkRUZjI2bDdoR2ZnSG5IeUJ6ckVzbmNGVXhpTFlFVmhQZWd5WEF5ZHRZUno0ZS91KzJBQmU2aW11T0dwNGlxemlBOFAwL2JRMk9iUk4vNlBuNTBpaWUrSXVtN2JscWNYMHc5a2VlVnlpTzRyRy9hRm0rZzIwdmpnTXNadDNPMkIrN1hxRTBiSStEaGF5dHRJWnRJOTh0RmtiVjUzUmtURVdQbm5NOGdoL3plOC9wWmxhM2ZRRk5jK2NIWDdKOVJEOHhqT21wQnFoZjJ1c3p4TGxNazRRK1NZZklWeEJIeC9HWlQrUGU0WTVWeVRDSnl4QUtVZUgxTXN3Z2pYUkpmUU5hNkdZbStQejRIN1dyMVVkVEZjWlZPdVJ0MGJhOENhSVZ6K1JSTTZGdG5pYWNFZ1M2dHZvYkdERmsxV0dnSWJjZmt3RnJ5aTl2SzdKR0tmeVRpQ1JUVy8rNWQwWmNibENza05kbElQZWNuNi9aWklYQTcra1V4MUQrZ1BHTHNpaVV5b1R3eTRBUnd0NGphN0tpaWwzaytKanlmUjhqQnNpVUN4MUo2YzYzNE9JS1daRXliM09OREhGdmM5THQwbVhwbytnQUpvS0NoQXVZeEVKclFUZ3lESll0R0UyRUpLY0NyMTFBVERJdTJzZlRiYThvWlJydTBSWnFHUEpUbXdsNmFrM1ZZemhKTjhtRzBJNWtPa3FtNk5sQ1pxUTJEUU9oSkJ3Vlp4a0krK0NUOTk5RGRjSTFyamtMRDQ1Ty92cUtURDVlcnhibjdDbzNFdG5MVTZLdGFkcDJ6MXFiVVRTVVlPRElZM0tYTWcwNVVDZmxvcC92RE80SVBaVGV5R1FLVkp6Rmw1RHRqTkJYbEVRaG9ZY0JnU1FWRUpab3BtbFFjbGFXajdYUXFWSkxZVnFodkRJa3VCZFBOQWFXcVJDaXpSZ09CTWlLSEEvU1d5QVZ4ZFI4RmhQWFBtZkZPckt1VEp0VWtWR2VIRnJqeW5JYTVvREZXdUs0bG14OUhRZWdDdklXa2pIMSt3N2VXVjcwc0FLNHBTQTQ0akgwUXIrZHhaaVVvamtVYWh5aFNLSlFaU2J4c1JPSCtpZE9jUFBpeFh1L2ViRS9QbjdSdFFZWFgzMDFpOC9kZjkvOUllR29ld2JxWGlRVkphbWR0dE1FSVpid3RnUGpKQzBEVGRJMk1rK1NSdXh0Yi92RTViZCsvUDc3bjc1OGViQjgrY21ucmo2RnM3azBldW4wNmN0MzNubnZtZHZQbnp4Wkw1ZE93aGRnL2R4OXQrMDg4QVU0V2EzaGZUREwySDBGZHVIN09FZDBEemVBMk1kc0c3TWRGeDRyRldLRzlMcG52OUxXbEJBbWdtWW5HUFI4RHgwY2QvNE41dHZiZGp6Q3VmTkxEeXlkbTR1aXVYTllPRDhYZHVjUFJZWmQ4SmNLcG0wb2FwQ3ZibFJEMytYY01nb2xOeDhWb29QZGVjOHJsenR6M2JuNWRxWHNlVis4dkh5K0UwV2Q4LzM3K3hmbXduRHV3cjFIVmxlU3VhcUY5R2VVajdhTGxRWmhub3FHamdFMEtzWDJhaG1saE5pVnVXUjE5Y2FGRG83aStyNWJyclE3RXNzODZzdTRMMjFVazNYcG9IU2o5QUR5WHhobkxyTXhENDJXY0JUNEpCZ1lhRFB3V1pnd1QwTFhiWmhrV1l4d1VYeHFxRm05NVlzU0ZpZ21BT2t3NnFPNFoxNXFpMlNCc0FTak51NS9ZNHk3dm5WMjM3NUZ4SWRwTmdleW8rYXJORmRxVC9LaGJTV2x6ZGh4WXZ4R3hXWVIvejZUYStSeURYczdWeVpPR0RDTzNoWGxGV0lUMlE5cFkybHBzNXpPOUhvenRaNVJjTWhvMWphb3ZPNjY0MVp1enZKRFB6VHFYNnpuY3ZYY0gxbEJZTmxCQUZmRWVMbWRiNzMyMnA4OTdzWTZRMytyeUVNT3dQSDc2SGhwYWVyZlNSZlhaaFl6aHhSWHBiVXBiMEZrSzg0MHI1T3JFUFdVc2VLbFhpQmtyUW84R1dmaUFNWDUwYWhyV2VWK0pXZHk0UlZZc1Q1YjF2VEJ5ZjZzcTRGODFLTkJHQnRHOTVPVDZGaXgrSFF0blMyNUJwQXQ0c2I1SEQ0ZlZ3M2R6MFVXa3VaWUtkU2FqYkw2T2ZqcndVNEh1T0FCMWV2OFlqVXVFc0hoWFBnQmVBSjVuR09FT0lqZUJHT2tLa25ST09FenVBdE5ETEV4Umt2N3A3NFlLcnlOY2RIWitkSHp6eXZQeTE4Mi85eDZPbjQydWIzeHJsbXpPOU90L1MxODdyTi84L1B6eHhmQzdvUHo2Znh2TlMrM3ZwSC9WUDZmK1Yvd0xGWjhTU2NKL0ltMElYMEFJenErbnIra2s3MWpEL3IvYzZBMlhJK0Q2d2ZTWXhMRzZlaU5pNUEySnhWWmpETjhveWtSVm5JNnVxRGY2OWZ1RGJ2Y0Noa3ozVXAzYnJRNlRoZm02enJqS0RGSVJWWStybGFiWVdKYUNsRmRSUWdGTTgwa2J0Y3FVYWpobzlkUklMbEhEWTM3TGxNTXFsTVZiSTF6Ym1BQ3Jkc0tVeWhWd3NoeGZZMkY0R3NBZnIrN2lremY2cUsxZ0FkVjdwZzV5MFpqeWp5dm9xbTZxamtzVU9TVmZuZTJFUnBjK0RqY2VVVnppdk9kMFdBVnMwTFJFS00xNUdGSjhXdzFwNkJnb2FVQlI2YWdtYVdHWVJQQnlTQTdrUnZFcnRha1ZaOUFMWEFSbklyamxiaEdoVjk1UXFyUXkvQjUzT08ydENTVUcrb01jWWZMTys2UFdoaWdmUXk3ekh4bC8wY3R1ZDdLb2pMZSswM2E2WGpTdzh5eHo5djlIbXBkMGs5NG4xV1F0UHBwZ3RkdVFwdmtPd2Q5LzBCbnFlVW1IcHhhNnh6dy9ZT2R0Vk9uZG41NGVEQTQzUC9MN1A5clI0NXcyVS80NWhaUGZNcU9IRUg2UjNSdFlrM21zREpYcjgrVjNtMjRydkhLMnB0RTVmUTdUNzNjejY3TS9tOWN1QUJhWWxIdDlHbU5Xb2wyendVOXRxYzFPMFozcGlDMi93SGorOXVaVDFNbFUzTFJwL1RUaUNkUmU1dzJJd3VpNXZnYitQaytKRHZmeTc1UGxWK0ErSVh5NS85bDdzYzAvK1BPWDAwOW5pbjU4Qk5jczU2MExkMGxQU3hKQWVaSkV3RXBnYkpOd05JYjBPcGwxQjhQNDZ4bkNtVmxnZ2k4ZmtKOTNOb0Q1MkI2cFEzdCtoNGlzM1krbVVLV2gzdEk3WUZKSE0zbmJKOFBjRlNUQTAzVGFPNXV4M2JpZkYwekNIcGdIMkxMMUZITjZWbEhoaWMwRHplZHQ1cDUxK1lJYURWTXFzVVIwUlZGTXduaWRIR203S01vRTZLYXVlYTdaRzdsT24wTFhFTUxabXV1eXVBM05RczgrMU5kQWwvSmFhcE1BMzN0V3RzTHVLcUFxemtpQlRIMFBMWFFWZnpqckJaVHBCUmZDVjJScFJOMEdKNGYrNzhpME9wcE9BNUY3Y2YwRmpNV21aOUdRZGZjQXZOY0pqT3prSE5VdEpLU3N2djY3dC9qUHIyTUhLUWpOeFNrdWlRMUc3eVJEcFBHRXZCWm9Rd0lQVlpuUWxvRVNMTmZtRHR0SEwvejVKMDNGd3NGS0YxOTZlclZsL0xQUFBMSU00Kzg1NGxMbDU2NDlFejcxVmZQM25yck8wVDcxUU9QaUo0TGwwU1B0SGZQZjROL2hhOUxNV3JYRFpoOTNJaVIwQU94NGd3WFBvcWpDbVErTDUxUWhwdVFiVFB1RlBZeTNKdTk2aVI3TjVDWndiYWc5WFFpY241NEpUbldxUlFlZUthb0cvSGpGODY4azBMVWZXM2ZCNW90ZGFIenZoU2MrTVlITlBYV2pjTVBHTlFvd3kySHpteHNkam9IQU42eHZaMC9wcEJtQlQ1ZENTeWR4ZmRleGpTaEJHKytUMWV2M0ZtcjM3VHpoMEYvZGUzS3BOOUlRb2ZxdHg1YmU2dXF2K25HaE1PSmg3NTZ3MXhuSDhDQnVmbEh6ZjBITEJKc29aYUxaMVV6bmY0bWFsRkp1bFc2VDNwUWVsVDZpUFNNOUtjQ3gzUTR0U0hDYmdyYktuSm1FUDVFNUlCWkpyTkpwbkROVHFzUVJLeDQxMmhUZ2RsR1hieENFa2E0bmIxSFNxY3ArM0RjRnY2TVg1ZHpMc2JDQkNBU2RobFp1d3BESWVGNG93MW9CRCtWMmtWaXNHa3dqSktSZUNlTHh0bFd1aUF5ZVNDbTdhRFF4bDZJWGpGQm9UTjExNkdranBsbVl0bVFyK2lhNjRXSzdDSUFaWGRVUm41RjZMRzRQS29HTWZjTVM5RzB2Qmxxa1BOOGRoQzRVZDVmYmpnNXF0WjZ0VnJQUnJwMVNnWFZKT2NjVlQxV3E4b01xa1VhQno2Vlk5ZFVRaTlINVpMQjRhNFZyMkJocENtcTRXazB0Q3lUd21KUXRGWHd3MUJGU3E3blpaeFMyZEZVNWNjYTV0MXhIdk9vcU9hN2hwRlJOUXNuc1Y0cDVkR1NhNUdCOW9HSTVFVms3cDduSCtiY2RXTDJOSFFqQTlqK1htLy8wdXNZT3BvdDd6TVVTN2NvZWZnTW9PYytCa291SHluNUVGV2puSVRvbVdNM1ZqOTZzeE9MT0ZXb2E5ZzZaamtzSDBxWjVuNXc5M1U0QzE5RGZaOUJwR2RPTEVFb283M2FRaHNkNHUvWUc5SHJMN3NpT0hONGN1U1d1ekVqNmpKeXBpcTM1RjVocHRldFZ1RnJwNDZmYnp3ck0rWFRuMVlVZUlIdFN1TnhtdjZkSkZtU3Mvc2EvQWhleERqMjBFVzBNTEkyTUs1T1MzZExiNUhlTHIxWHVpSkpzd0lTTnRUVEVKa3dFNVQybmcrc3Q1VHJqcEMxbXFKWWdlelZkOWFRWm4zcG5rL0VtS3RQMzFHSU9wME9oS1hKdEhNNDRHK1l5OWEwQndzanZxZGdEQTZHbFJpaTh0WElkcUtvR2p3Yk9YWVVsYU9kRjBNMGphSUNRMUdDR0lzZnhwUHdaTWNKRHpwUlhNNjZJOXVPOElRd0tvZjR3VGJidVJwbTdVNzRua29ZVGsrT3NQUndPWXhLNFlkeHhCRFB2UTB2S1VYaGJXNFFsaUljMHc3eE43VHRFR0xiQ1hBbzBWSU9yMkJURkZsT3VQTXc5dVBOd28vaFR5bHNPS0kzZUYxY0VaYVdBeXhYQXRRNVM3b0xYb1dMbUtkV3BhNDBrTll3c2pGU1k4eFVDYWFZZHFZeFFrY21xUFJJYW5GYUlWTnRHVTA0cWhoclQ3Q0tIUlg0ckZyMHVlbWFxbGZFZk5oMjg4MmlaNmd5K1ZDaXg2Tkc4cFBldXBKb3prUWxVREs2ZERXdGZtaXlaclE0YThGRlJDZlQ4YytTbllQMWZqQkRLMkVoWE5qM1l2bkl4cEx5TzcrcmI1K2VkL1htcGp1NzlQdldTTTduVzYxY3pscFMxWjRrL1RjL3RYaVBBSGljWTJCa1lHQUE0cW9vWTU1NGZwdXZETnhNRENCd3JwTGpESXorLy9QL1RlWU14dGRBTGdjRFdCb0FLbGtNS1hpY1kyQmtZR0I4L2Y4bWd4NEx3LytmL3hpWU14aUFJaWhBSGdDazFBWjVlSnhqWW9DQ1ZSQ0s4Uk1EQXhPUVpvb0RzanNZR0JuWEFHa3ZJRi9rL3orbTNQOS9tRXFCYkJDL0hJZ1BBYkVSVUg0UlF6OFQyLzlmSUgyTUQ0QmlXa0I2SXRnY0lSWUdoa2xnOHhnWWVKZ1kvdjhHWWNZcllINERBejhETHdEY0FCVXVBQUFBQUFBQUFBQUFBQTRBV0FDMEFTUUJZQUlZQW9nQ3hBT01BOVFFTkFTd0JTSUY1Z1lFQmpnR3NnZEFCNVFIemdpTUNRSUpKZ25XQ2hBS2hndUlDN29NZGd6WWVKeGpZR1JnWUZCazJNM0F5d0FDVEVETXlBQVNjd0R6R1FBWklnRXZBQUI0bkhXT01Xb0RNUkJGMzlwcmgrQVFVb1dVZ2pScGRwRTJqZkVCOWdBcDNCc2psZ1hiQXRrR255UlZqcEF5eDhnQmNvUWNJOS9yYVZKWU1Pak4xNS81QXU1NHArQjhDbTU0TUI2Slg0ekhQSE15THFWL0drK1k4VzA4bGY0cloxSGVTcmtmcHM0OEVqOFpqMm54eHFYMEQrTUpqM3daVDZYLzBMTW1zVlVsZHRDdjB6WWx3UnVSamlNYlZtUzFzVHR1Vm9KMjhCMkdPOHNSY1RUVVNuTXNWUC8zWGJRNUZVR09TazR2ZXRXYXREdTBLWGZSTmJWM0MyZTVvbmtWZk5YNElOTzF2eTJWbXRuci9aSVJobnlXTWU5NzdRaTF2enI3QndEdk9kTUFBSGljWTJCaXdBOFVnWmlSZ1ltUmlZR2RnWmVCajBHSlFZTkJpMEdmd1pEQm5NR1N3WXJCaHNHRndaUEJuYUdRd1lzaGlLR1V3WlVobWlHV2dZVkJtSUdWSVlLQms0R05JWlM5TkMvVHpjREFBQURwaHdoYUFBQT0pIGZvcm1hdCgnd29mZicpLHVybCgnaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2Fzc2V0cy5hdXRoMC5jb20vdzIvZm9udC96b2NpYWwtcmVndWxhci13ZWJmb250LnR0ZicpIGZvcm1hdCgndHJ1ZXR5cGUnKSx1cmwoJ2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9hc3NldHMuYXV0aDAuY29tL3cyL2ZvbnQvem9jaWFsLXJlZ3VsYXItd2ViZm9udC5zdmcjem9jaWFscmVndWxhcicpIGZvcm1hdCgnc3ZnJyk7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3R5bGU6bm9ybWFsfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5hdXRoMDpiZWZvcmV7Y29udGVudDpcXFwiP1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmF1dGgwe2JhY2tncm91bmQtY29sb3I6I2ZmNDUwMDt3aWR0aDphdXRvfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5ibG9ja3tkaXNwbGF5OmJsb2NrO21hcmdpbjoxMHB4IDA7dGV4dC1vdmVyZmxvdzplbGxpcHNpcztvdmVyZmxvdzpoaWRkZW59I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnksI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeXttYXJnaW46MDtwYWRkaW5nOjAgMWVtO2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjQycHh9I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnk6YmVmb3JlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnk6YmVmb3Jle2Rpc3BsYXk6bm9uZX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeXtiYWNrZ3JvdW5kLWNvbG9yOiM3NDdlODV9I2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeXtiYWNrZ3JvdW5kLWNvbG9yOiNmMGYwZWI7Y29sb3I6IzIyMjt0ZXh0LXNoYWRvdzowIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsMC44KX0jYXV0aDAtd2lkZ2V0IC56b2NpYWx7LXdlYmtpdC1mb250LXNtb290aGluZzphbnRpYWxpYXNlZH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheXtwb3NpdGlvbjpmaXhlZDtsZWZ0OjA7dG9wOjA7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtvdmVyZmxvdzpoaWRkZW47ei1pbmRleDo5OTk5O2ZvbnQtd2VpZ2h0OjIwMDstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTtiYWNrZ3JvdW5kOiMwMDA7YmFja2dyb3VuZDpyZ2JhKDAsMCwwLDAuOCk7YmFja2dyb3VuZDotd2Via2l0LXJhZGlhbC1ncmFkaWVudCg1MCUgNTAlLGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIscmdiYSgwLDAsMCwwLjQ1KSAxJSxyZ2JhKDAsMCwwLDAuOCkgMTAwJSk7YmFja2dyb3VuZDotbW96LXJhZGlhbC1ncmFkaWVudCg1MCUgNTAlLGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIscmdiYSgwLDAsMCwwLjQ1KSAxJSxyZ2JhKDAsMCwwLDAuOCkgMTAwJSk7YmFja2dyb3VuZDotbXMtcmFkaWFsLWdyYWRpZW50KDUwJSA1MCUsZWxsaXBzZSBjbG9zZXN0LWNvcm5lcixyZ2JhKDAsMCwwLDAuNDUpIDElLHJnYmEoMCwwLDAsMC44KSAxMDAlKTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg1MCUgNTAlLGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIscmdiYSgwLDAsMCwwLjQ1KSAxJSxyZ2JhKDAsMCwwLDAuOCkgMTAwJSk7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNpdGlvbjo0MDBtcyBvcGFjaXR5IGVhc2U7LW1vei10cmFuc2l0aW9uOjQwMG1zIG9wYWNpdHkgZWFzZTt0cmFuc2l0aW9uOjQwMG1zIG9wYWNpdHkgZWFzZTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCk7LW1vei10cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApOy1tcy10cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApOy1vLXRyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCk7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDAsMCwwKX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheS5hY3RpdmV7b3BhY2l0eToxfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbHstd2Via2l0LWJveC1zaXppbmc6Ym9yZGVyLWJveDstbW96LWJveC1zaXppbmc6Ym9yZGVyLWJveDtib3gtc2l6aW5nOmJvcmRlci1ib3g7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo1MCU7ZGlzcGxheTpub25lfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbC5hY3RpdmV7ZGlzcGxheTpibG9jazstd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbjo0MDBtczstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZTstd2Via2l0LWFuaW1hdGlvbi1uYW1lOnNob3dQYW5lbH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucGFuZWx7LXdlYmtpdC1hbmltYXRpb24tZHVyYXRpb246NDAwbXM7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2U7LXdlYmtpdC1hbmltYXRpb24tbmFtZTpoaWRlUGFuZWw7d2lkdGg6MjgwcHg7bWFyZ2luOjAgMCAwIC0xNDBweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAuZW1haWx7bWFyZ2luLWJvdHRvbToxNHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYXNzd29yZCwjYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucmVwZWF0UGFzc3dvcmR7bWFyZ2luLWJvdHRvbToxNHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5lbWFpbC1yZWFkb25seXt0ZXh0LWFsaWduOmNlbnRlcjtkaXNwbGF5OmluaGVyaXQ7Y29sb3I6IzQxNDQ0YTtmb250LXdlaWdodDpib2xkO21hcmdpbi1ib3R0b206MjVweH0jYXV0aDAtd2lkZ2V0IC5wYW5lbCAuc2lnbnVwIC5oZWFkZXIsI2F1dGgwLXdpZGdldCAucGFuZWwgLnJlc2V0IC5oZWFkZXJ7bWFyZ2luLWJvdHRvbToxNXB4O2ZvbnQtc2l6ZToxNHB4O2NvbG9yOiM0MTQ0NGF9I2F1dGgwLXdpZGdldCAucGFuZWwgLnNpZ251cCAuZm9vdGVye21hcmdpbi1ib3R0b206MTVweDtmb250LXNpemU6MTJweDtjb2xvcjojNDE0NDRhO3RleHQtYWxpZ246bGVmdDttYXJnaW4tdG9wOjEwcHh9QC1tb3ota2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwxMDAlLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC13ZWJraXQta2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwxMDAlLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC1vLWtleWZyYW1lcyBzaG93UGFuZWx7MCV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsMTAwJSwwKX0xMDAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtbXMta2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwxMDAlLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QGtleWZyYW1lcyBzaG93UGFuZWx7MCV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsMTAwJSwwKX0xMDAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtbW96LWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALXdlYmtpdC1rZXlmcmFtZXMgaGlkZVBhbmVsezAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX0xMDAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTgpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC1vLWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALW1zLWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX1Aa2V5ZnJhbWVzIGhpZGVQYW5lbHswJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk4KSB0cmFuc2xhdGUzZCgwLDAsMCl9fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbHtiYWNrZ3JvdW5kOiNmYWZhZmE7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudCgjZmZmLCNmYWZhZmEpO2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQoI2ZmZiwjZmFmYWZhKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQoI2ZmZiwjZmFmYWZhKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudCgjZmZmLCNmYWZhZmEpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KCNmZmYsI2ZhZmFmYSk7ei1pbmRleDoxMDstbW96LWJveC1zaGFkb3c6MCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjIpLDAgMTBweCAyN3B4IHJnYmEoMCwwLDAsMC43KTstd2Via2l0LWJveC1zaGFkb3c6MCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjIpLDAgMTBweCAyN3B4IHJnYmEoMCwwLDAsMC43KTtib3gtc2hhZG93OjAgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4yKSwwIDEwcHggMjdweCByZ2JhKDAsMCwwLDAuNyk7LW1vei1ib3JkZXItcmFkaXVzOjZweDstd2Via2l0LWJvcmRlci1yYWRpdXM6NnB4O2JvcmRlci1yYWRpdXM6NnB4Oy13ZWJraXQtdG91Y2gtY2FsbG91dDpub25lfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbDphZnRlcntjb250ZW50OlxcXCJcXFwiO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDtyaWdodDowO3RvcDowO2JvdHRvbTowO3otaW5kZXg6MTstbW96LWJveC1zaGFkb3c6aW5zZXQgMCAtMXB4IDJweCByZ2JhKDgyLDkzLDExMiwwLjQpOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIC0xcHggMnB4IHJnYmEoODIsOTMsMTEyLDAuNCk7Ym94LXNoYWRvdzppbnNldCAwIC0xcHggMnB4IHJnYmEoODIsOTMsMTEyLDAuNCl9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlcntkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlO21pbi1oZWlnaHQ6NjVweDtvdmVyZmxvdzpoaWRkZW47LW1vei1ib3JkZXItcmFkaXVzOjZweCA2cHggMCAwOy13ZWJraXQtYm9yZGVyLXJhZGl1czo2cHggNnB4IDAgMDtib3JkZXItcmFkaXVzOjZweCA2cHggMCAwO2JhY2tncm91bmQ6I2YxZjRmNjtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KCNmMWY0ZjYsI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudCgjZjFmNGY2LCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudCgjZjFmNGY2LCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KCNmMWY0ZjYsI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQoI2YxZjRmNiwjZTllZGYwKTtib3JkZXItYm90dG9tOjFweCBzb2xpZCByZ2JhKDQwLDY5LDg1LDAuMTEpfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXI6YmVmb3Jle2NvbnRlbnQ6Jyc7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjVweDtib3R0b206LTFweDtsZWZ0OjA7cmlnaHQ6MDtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQocmdiYSg0MCw2OSw4NSwwKSxyZ2JhKDQwLDY5LDg1LDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDQwLDY5LDg1LDApLHJnYmEoNDAsNjksODUsMC4xKSl9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlcjphZnRlcntjb250ZW50OicnO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDo0cHg7Ym90dG9tOjA7bGVmdDowO3JpZ2h0OjA7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KGxlZnQsI2U5ZWRmMCxyZ2JhKDI0MSwyNDQsMjQ2LDApLCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MjFweCAyMHB4O21hcmdpbjowO2ZvbnQtc2l6ZToxOHB4O2NvbG9yOiM0MTQ0NGE7Zm9udC13ZWlnaHQ6Ym9sZDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGRlM2U2fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYXtkaXNwbGF5OmJsb2NrO292ZXJmbG93OmhpZGRlbjt0ZXh0LWluZGVudDoyMDAlO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjEycHg7b3BhY2l0eTouNDtwYWRkaW5nOjVweDt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBhOmhvdmVye29wYWNpdHk6LjY2fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYTphY3RpdmV7b3BhY2l0eToxfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYS5jbG9zZXtoZWlnaHQ6MTJweDtiYWNrZ3JvdW5kOnVybChcXFwiaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2Fzc2V0cy5hdXRoMC5jb20vdzIvaW1nL2Nsb3NlLnBuZ1xcXCIpIDUwJSA1MCUgbm8tcmVwZWF0O2JhY2tncm91bmQtc2l6ZToxMnB4IDEycHg7cmlnaHQ6MTlweDt0b3A6MjFweDtjdXJzb3I6cG9pbnRlcn0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGEuY2xvc2U6aG92ZXJ7b3BhY2l0eTouNjZ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBpbWd7aGVpZ2h0OjMycHg7bWFyZ2luOjE2cHggMTBweCAxMHB4IDIwcHg7cG9zaXRpb246cmVsYXRpdmU7ZmxvYXQ6bGVmdH0jYXV0aDAtd2lkZ2V0IC5hY3Rpb24gLnNwaW5uZXJ7d2lkdGg6MTAwJTtiYWNrZ3JvdW5kLWNvbG9yOiM2YTc3N2Y7YmFja2dyb3VuZC1pbWFnZTp1cmwoJ2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9hc3NldHMuYXV0aDAuY29tL3cyL2ltZy9zcGlubmVyLmdpZicpO2JhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdDtiYWNrZ3JvdW5kLXBvc2l0aW9uOmNlbnRlcjttYXJnaW46MDtoZWlnaHQ6NDRweDtib3JkZXI6MXB4IHNvbGlkICM3Nzc7Ym9yZGVyLWNvbG9yOnJnYmEoMCwwLDAsMC4yKTtib3JkZXItYm90dG9tLWNvbG9yOiMzMzM7Ym9yZGVyLWJvdHRvbS1jb2xvcjpyZ2JhKDAsMCwwLDAuNCk7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTtib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpOy1tb3otdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lOy1tb3otYm9yZGVyLXJhZGl1czouM2VtOy13ZWJraXQtYm9yZGVyLXJhZGl1czouM2VtO2JvcmRlci1yYWRpdXM6LjNlbX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgZm9vdGVye2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246cmVsYXRpdmU7LW1vei1ib3JkZXItcmFkaXVzOjAgMCA1cHggNXB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czowIDAgNXB4IDVweDtib3JkZXItcmFkaXVzOjAgMCA1cHggNXB4O2hlaWdodDoyNXB4O2xpbmUtaGVpZ2h0OjI1cHg7dmVydGljYWwtYWxpZ246bWlkZGxlO21hcmdpbjowIDE1cHg7Ym9yZGVyLXRvcDoxcHggc29saWQgI2RkZTNlNjt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGZvb3RlciBzcGFue2ZvbnQtc2l6ZToxMHB4O2NvbG9yOiM2NjZ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGZvb3RlciBhe2ZvbnQtc2l6ZTo5cHg7Y29sb3I6IzMzMztmb250LXdlaWdodDpib2xkO3RleHQtZGVjb3JhdGlvbjpub25lO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmxpc3QsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3R7bWFyZ2luOjI1cHggMDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAubGlzdDpiZWZvcmUsI2F1dGgwLXdpZGdldCAubGlzdDphZnRlciwjYXV0aDAtd2lkZ2V0IC5pY29ubGlzdDpiZWZvcmUsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3Q6YWZ0ZXJ7ZGlzcGxheTp0YWJsZTtjb250ZW50OlxcXCJcXFwifSNhdXRoMC13aWRnZXQgLmxpc3Q6YWZ0ZXIsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3Q6YWZ0ZXJ7Y2xlYXI6Ym90aH0jYXV0aDAtd2lkZ2V0IC5saXN0IHNwYW57ZGlzcGxheTpibG9jazttYXJnaW46MTBweCAwO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmljb25saXN0e3RleHQtYWxpZ246Y2VudGVyfSNhdXRoMC13aWRnZXQgLmljb25saXN0IHNwYW57bWFyZ2luOjAgMnB4fSNhdXRoMC13aWRnZXQgLmZvcmdvdC1wYXNze2ZvbnQtc2l6ZToxMnB4O2NvbG9yOiM2NjY7Zm9udC13ZWlnaHQ6bm9ybWFsfSNhdXRoMC13aWRnZXQgLmNyZWF0ZS1hY2NvdW50e2Rpc3BsYXk6bm9uZTttYXJnaW4tdG9wOjIwcHg7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCAuY3JlYXRlLWFjY291bnQgYXtmb250LXNpemU6MTJweDtjb2xvcjojNmQ2ZDZkO3RleHQtZGVjb3JhdGlvbjpub25lfSNhdXRoMC13aWRnZXQgLmNyZWF0ZS1hY2NvdW50IGE6aG92ZXJ7dGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZX0jYXV0aDAtd2lkZ2V0IC5sb2dnZWRpbiBzcGFuLmNlbnRlcmVkLmFsbHtjb2xvcjojMDA4Y2RkO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmxvZ2dlZGluIHNwYW4uY2VudGVyZWR7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHggMDttYXJnaW46MTVweCAwIDVweDtmb250LXNpemU6MTNweDtkaXNwbGF5OmJsb2NrfSNhdXRoMC13aWRnZXQgLmxvZ2dlZGluIHNwYW4uY2VudGVyZWQuYWxsOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zIGEuY2FuY2VsLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25zIGEuY2FuY2Vse2NvbG9yOiMwMDhjZGQ7Y3Vyc29yOnBvaW50ZXI7dGV4dC1kZWNvcmF0aW9uOm5vbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zIGEuY2FuY2VsOmhvdmVyLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25zIGEuY2FuY2VsOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25ze3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6NXB4IDA7bWFyZ2luOjE1cHggMCA1cHg7Zm9udC1zaXplOjEzcHg7ZGlzcGxheTpibG9ja30jYXV0aDAtd2lkZ2V0IGZvcm17bWFyZ2luOjMwcHghaW1wb3J0YW50O21hcmdpbi1ib3R0b206MjJweDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCBmb3JtIGxhYmVse2Rpc3BsYXk6YmxvY2s7Y29sb3I6IzdmODg5OTtmb250LXNpemU6MTNweDtmb250LXdlaWdodDpib2xkO21hcmdpbjowIDAgN3B4IDA7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0jYXV0aDAtd2lkZ2V0IGZvcm0gaW5wdXR7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7LW1vei1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjEwMCU7Zm9udC1zaXplOjE4cHg7cGFkZGluZzoxMHB4IDEycHg7Ym9yZGVyOjFweCBzb2xpZCAjYjRiZWNkO2JvcmRlci10b3AtY29sb3I6I2IwYmFjYTtib3JkZXItYm90dG9tLWNvbG9yOiNkM2Q5ZTI7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDEzMCwxMzcsMTUwLDAuMjMpLDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjg1KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMTMwLDEzNywxNTAsMC4yMyksMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuODUpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMTMwLDEzNywxNTAsMC4yMyksMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuODUpOy1tb3otYm9yZGVyLXJhZGl1czo0cHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjRweDtib3JkZXItcmFkaXVzOjRweDttYXJnaW46MDtmb250LWZhbWlseTonSGVsdmV0aWNhIE5ldWUnLEhlbHZldGljYSxBcmlhbCBHZW5ldmEsc2Fucy1zZXJpZn0jYXV0aDAtd2lkZ2V0IC5wbGFjZWhvbGRlcntjb2xvcjojY2NjfSNhdXRoMC13aWRnZXQgZm9ybSBpbnB1dDpmb2N1c3tib3JkZXItY29sb3I6IzU2OTVkYiAjNzBhN2U0ICM4OWI4ZWMgIzcwYTdlNDtvdXRsaW5lOjA7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDcwLDEyMywxODEsMC4zNSksMCAwIDRweCAjNTY5NWRiOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSg3MCwxMjMsMTgxLDAuMzUpLDAgMCA0cHggIzU2OTVkYjtib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDcwLDEyMywxODEsMC4zNSksMCAwIDRweCAjNTY5NWRifSNhdXRoMC13aWRnZXQgZm9ybSAuaW52YWxpZCBpbnB1dHtvdXRsaW5lOjA7Ym9yZGVyLWNvbG9yOiNmZjcwNzY7Ym9yZGVyLXRvcC1jb2xvcjojZmY1YzYxOy1tb3otYm94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSgwLDAsMCwwLjIpLDAgMCA0cHggMCByZ2JhKDI1NSwwLDAsMC41KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4yKSwwIDAgNHB4IDAgcmdiYSgyNTUsMCwwLDAuNSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSgwLDAsMCwwLjIpLDAgMCA0cHggMCByZ2JhKDI1NSwwLDAsMC41KX0jYXV0aDAtd2lkZ2V0IGhlYWRlciAuZXJyb3J7cGFkZGluZzo5cHggMDttYXJnaW46MTBweCBhdXRvO3dpZHRoOjcwJTtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDoxM3B4O2NvbG9yOiNiOTUzNTM7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCBoZWFkZXIgLnN1Y2Nlc3N7cGFkZGluZzo5cHggMDttYXJnaW46MTBweCBhdXRvO3dpZHRoOjcwJTtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDoxM3B4O2NvbG9yOiMwZmFkMjk7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCBmb3JtIC5ub3Rle2Rpc3BsYXk6YmxvY2s7Y29sb3I6IzdmODg5OTtmb250LXNpemU6MTNweDtmb250LXdlaWdodDpib2xkO21hcmdpbjowIDAgN3B4IDA7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0jYXV0aDAtd2lkZ2V0IGZvcm0gLm5vdGUgYXtjb2xvcjojMDA4Y2RkO3RleHQtZGVjb3JhdGlvbjpub25lfSNhdXRoMC13aWRnZXQgZm9ybSAuaW52YWxpZCAuZXJyb3J7dmlzaWJpbGl0eTp2aXNpYmxlfSNhdXRoMC13aWRnZXQgZm9ybSBidXR0b257ZGlzcGxheTpibG9jazttYXJnaW46MjBweCAwIDAgMDtjdXJzb3I6cG9pbnRlcjt3aWR0aDoxMDAlfSNhdXRoMC13aWRnZXQgLmFjdGlvbnt0ZXh0LWFsaWduOnJpZ2h0O21hcmdpbjowIDMwcHggMzBweCAzMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6NX0jYXV0aDAtd2lkZ2V0IGZvcm0gLmFjdGlvbnttYXJnaW46MH0jYXV0aDAtd2lkZ2V0IC5hY3Rpb24gYnV0dG9ue3dpZHRoOmF1dG99I2F1dGgwLXdpZGdldCAuc2VwYXJhdG9ye3Bvc2l0aW9uOnJlbGF0aXZlO3RleHQtYWxpZ246Y2VudGVyO21hcmdpbjowIDAgMjVweCAwfSNhdXRoMC13aWRnZXQgLnNlcGFyYXRvcjpiZWZvcmV7Y29udGVudDpcXFwiXFxcIjtkaXNwbGF5OmJsb2NrO2JvcmRlci10b3A6MXB4IHNvbGlkICM3Zjg4OTk7d2lkdGg6MjAwcHg7bGVmdDo1MCU7bWFyZ2luLWxlZnQ6LTEwMHB4O2hlaWdodDoxcHg7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTt6LWluZGV4OjF9I2F1dGgwLXdpZGdldCAuc2VwYXJhdG9yIHNwYW57YmFja2dyb3VuZDojZmFmYWZhO3BhZGRpbmc6MCAxMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6NTtjb2xvcjojN2Y4ODk5O2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OmJvbGQ7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZX0jYXV0aDAtd2lkZ2V0IHNwYW4uYmFja3tkaXNwbGF5OmJsb2NrO2NvbG9yOiMwMDhjZGQ7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHggMDttYXJnaW46MTVweCAwIDVweDtmb250LXNpemU6MTNweDtjdXJzb3I6cG9pbnRlcjtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjU7b3V0bGluZTowfSNhdXRoMC13aWRnZXQgc3Bhbi5iYWNrOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbmluIC5wYW5lbC5zdHJhdGVnaWVzIC5saXN0IC5lbWFpbHtkaXNwbGF5OmJsb2NrO2NvbG9yOiM3Zjg4OTk7Zm9udC1zaXplOjEzcHg7Zm9udC13ZWlnaHQ6Ym9sZDttYXJnaW46MCAwIDdweCAwO3RleHQtc2hhZG93OjAgMXB4IDAgd2hpdGU7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9mZmljZTM2NTpiZWZvcmV7Y29udGVudDpcXFwiV1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9mZmljZTM2NXtiYWNrZ3JvdW5kLWNvbG9yOiMwMGFjZWQ7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2FhZDpiZWZvcmV7Y29udGVudDpcXFwielxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWR7YmFja2dyb3VuZC1jb2xvcjojMDBhZGVmO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsczpiZWZvcmV7Y29udGVudDpcXFwiYlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsc3tiYWNrZ3JvdW5kLWNvbG9yOiM2YWMwNzE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94OmJlZm9yZXtjb250ZW50OlxcXCJ4XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94e2JhY2tncm91bmQtY29sb3I6IzI2N2JiNjtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmJlZm9yZXtjb250ZW50OlxcXCIqXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZXtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Y29sb3I6I2YwMH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2luZG93c3tiYWNrZ3JvdW5kLWNvbG9yOiMyNjcyZWM7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZml0Yml0OmJlZm9yZXtjb250ZW50OlxcXCIjXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZml0Yml0e2JhY2tncm91bmQtY29sb3I6IzQ1YzJjNTtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC55YW5kZXg6YmVmb3Jle2NvbnRlbnQ6XFxcIiZcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC55YW5kZXh7YmFja2dyb3VuZC1jb2xvcjojZjAwO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnJlbnJlbjpiZWZvcmV7Y29udGVudDpcXFwiclxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnJlbnJlbntiYWNrZ3JvdW5kLWNvbG9yOiMwMDU2YjU7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYmFpZHU6YmVmb3Jle2NvbnRlbnQ6XFxcInVcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5iYWlkdXtiYWNrZ3JvdW5kLWNvbG9yOiMyODMyZTE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAub25lc3RlcHt3aWR0aDozNDVweDttYXJnaW46MCAwIDAgLTE3MnB4fUBtZWRpYShtYXgtd2lkdGg6MjgwcHgpeyNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbHt3aWR0aDoyNDBweDttYXJnaW46MCAwIDAgLTEyMHB4fSNhdXRoMC13aWRnZXQgLnNpZ25pbiAucG9wdXAgLnBhbmVsLnN0cmF0ZWdpZXMgLmxpc3R7bWFyZ2luOjEycHh9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjoxMnB4fSNhdXRoMC13aWRnZXQgZm9ybSBpbnB1dHtwYWRkaW5nOjVweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVye21hcmdpbjowO3BhZGRpbmc6MH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MTRweCAxNnB4O21hcmdpbjowO2ZvbnQtc2l6ZToyMnB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYS5jbG9zZXtyaWdodDoxNHB4O3RvcDoxNnB4fX1AbWVkaWEobWluLXdpZHRoOjI4MXB4KSBhbmQgKG1heC13aWR0aDozNDBweCl7I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLnBhbmVse21hcmdpbjowO2xlZnQ6MDtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO2JvcmRlci1yYWRpdXM6MH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAuem9jaWFsLCNhdXRoMC13aWRnZXQgLnBvcHVwIGEuem9jaWFse2ZvbnQtc2l6ZToxOHB4fSNhdXRoMC13aWRnZXQgLnNpZ25pbiAucG9wdXAgLnBhbmVsLnN0cmF0ZWdpZXMgLmxpc3R7bWFyZ2luOjE1cHh9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjoxNXB4IDI1cHh9I2F1dGgwLXdpZGdldCBmb3JtIGlucHV0e3BhZGRpbmc6NnB4O2ZvbnQtc2l6ZToxOHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXJ7bWFyZ2luOjA7cGFkZGluZzowO21pbi1oZWlnaHQ6MzJweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MTJweCAxNnB4O21hcmdpbi10b3A6MXB4O2ZvbnQtc2l6ZToyMHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgaW1ne2hlaWdodDozMnB4O21hcmdpbjo5cHggMTBweCA2cHggMThweH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeXtsaW5lLWhlaWdodDozNHB4fSNhdXRoMC13aWRnZXQgLmFjdGlvbiAuc3Bpbm5lcntoZWlnaHQ6MzRweH0jYXV0aDAtd2lkZ2V0IC5jcmVhdGUtYWNjb3VudHttYXJnaW4tdG9wOjIwcHh9I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLmVtYWlse21hcmdpbi1ib3R0b206NXB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYXNzd29yZCwjYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucmVwZWF0UGFzc3dvcmR7bWFyZ2luLWJvdHRvbTo1cHh9fSNhdXRoMC13aWRnZXQgLmxvYWRpbmd7ZGlzcGxheTpub25lO2JvcmRlcjowO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjpmaXhlZDt2aXNpYmlsaXR5OnZpc2libGU7bWFyZ2luOjA7cGFkZGluZzowO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3otaW5kZXg6MTAwMDAwO2ZvbnQtd2VpZ2h0OjIwMDstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsMC41KX0jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5tZXNzYWdle3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bWFyZ2luLXRvcDotMTEwcHg7d2lkdGg6MTAwJTt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MjJweDtmb250LWZhbWlseTpIZWx2ZXRpY2EsYXJpYWwsZnJlZXNhbnMsY2xlYW4sc2Fucy1zZXJpZjtjb2xvcjojMzMzfSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxze3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6NTAlO3RvcDo1MCU7bWFyZ2luLWxlZnQ6LTQ1cHg7bWFyZ2luLXRvcDotNDVweDt3aWR0aDo5MHB4O2hlaWdodDo5MHB4fSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxzPmRpdntwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDo4NnB4O2hlaWdodDo4NnB4O29wYWNpdHk6MDstbW96LXRyYW5zZm9ybTpyb3RhdGUoMjI1ZGVnKTstbW96LWFuaW1hdGlvbjpvcmJpdCA3LjE1cyBpbmZpbml0ZTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMjI1ZGVnKTstd2Via2l0LWFuaW1hdGlvbjpvcmJpdCA3LjE1cyBpbmZpbml0ZTstbXMtdHJhbnNmb3JtOnJvdGF0ZSgyMjVkZWcpOy1tcy1hbmltYXRpb246b3JiaXQgNy4xNXMgaW5maW5pdGU7LW8tdHJhbnNmb3JtOnJvdGF0ZSgyMjVkZWcpOy1vLWFuaW1hdGlvbjpvcmJpdCA3LjE1cyBpbmZpbml0ZTt0cmFuc2Zvcm06cm90YXRlKDIyNWRlZyk7YW5pbWF0aW9uOm9yYml0IDcuMTVzIGluZmluaXRlfSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxzPmRpdj5kaXZ7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MTFweDtoZWlnaHQ6MTFweDtiYWNrZ3JvdW5kOiMzMzM7bGVmdDowO3RvcDowOy1tb3otYm9yZGVyLXJhZGl1czoxMXB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czoxMXB4Oy1tcy1ib3JkZXItcmFkaXVzOjExcHg7LW8tYm9yZGVyLXJhZGl1czoxMXB4O2JvcmRlci1yYWRpdXM6MTFweH0jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscyAuYmFsbDAxey1tb3otYW5pbWF0aW9uLWRlbGF5OjEuNTZzOy13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OjEuNTZzOy1tcy1hbmltYXRpb24tZGVsYXk6MS41NnM7LW8tYW5pbWF0aW9uLWRlbGF5OjEuNTZzO2FuaW1hdGlvbi1kZWxheToxLjU2c30jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscyAuYmFsbDAyey1tb3otYW5pbWF0aW9uLWRlbGF5Oi4zMXM7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LjMxczstbXMtYW5pbWF0aW9uLWRlbGF5Oi4zMXM7LW8tYW5pbWF0aW9uLWRlbGF5Oi4zMXM7YW5pbWF0aW9uLWRlbGF5Oi4zMXN9I2F1dGgwLXdpZGdldCAubG9hZGluZyAuYmFsbHMgLmJhbGwwM3stbW96LWFuaW1hdGlvbi1kZWxheTouNjJzOy13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi42MnM7LW1zLWFuaW1hdGlvbi1kZWxheTouNjJzOy1vLWFuaW1hdGlvbi1kZWxheTouNjJzO2FuaW1hdGlvbi1kZWxheTouNjJzfSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxzIC5iYWxsMDR7LW1vei1hbmltYXRpb24tZGVsYXk6Ljk0czstd2Via2l0LWFuaW1hdGlvbi1kZWxheTouOTRzOy1tcy1hbmltYXRpb24tZGVsYXk6Ljk0czstby1hbmltYXRpb24tZGVsYXk6Ljk0czthbmltYXRpb24tZGVsYXk6Ljk0c30jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscyAuYmFsbDA1ey1tb3otYW5pbWF0aW9uLWRlbGF5OjEuMjVzOy13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OjEuMjVzOy1tcy1hbmltYXRpb24tZGVsYXk6MS4yNXM7LW8tYW5pbWF0aW9uLWRlbGF5OjEuMjVzO2FuaW1hdGlvbi1kZWxheToxLjI1c31ALW1vei1rZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7LW1vei10cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7LW1vei1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0fTcle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1tb3otb3JpZ2luOjB9MzAle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1pbi1vdXQ7LW1vei1vcmlnaW46NyV9Mzkle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1tb3otb3JpZ2luOjMwJX03MCV7b3BhY2l0eToxOy1tb3otdHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpOy1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstbW96LW9yaWdpbjozOSV9NzUle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LW1vei1vcmlnaW46NzAlfTc2JXtvcGFjaXR5OjA7LW1vei10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7LW1vei10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9fUAtd2Via2l0LWtleWZyYW1lcyBvcmJpdHswJXtvcGFjaXR5OjE7ei1pbmRleDo5OTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXR9NyV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LXdlYmtpdC1vcmlnaW46MH0zMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLWluLW91dDstd2Via2l0LW9yaWdpbjo3JX0zOSV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg2NDVkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LXdlYmtpdC1vcmlnaW46MzAlfTcwJXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDc3MGRlZyk7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy13ZWJraXQtb3JpZ2luOjM5JX03NSV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstd2Via2l0LW9yaWdpbjo3MCV9NzYle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX0xMDAle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX19QC1tcy1rZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7LW1zLXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dH03JXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LW1zLW9yaWdpbjowfTMwJXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLWluLW91dDstbXMtb3JpZ2luOjclfTM5JXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LW1zLW9yaWdpbjozMCV9NzAle29wYWNpdHk6MTstbXMtdHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpOy1tcy1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy1tcy1vcmlnaW46MzklfTc1JXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstbXMtb3JpZ2luOjcwJX03NiV7b3BhY2l0eTowOy1tcy10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7LW1zLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX19QC1vLWtleWZyYW1lcyBvcmJpdHswJXtvcGFjaXR5OjE7ei1pbmRleDo5OTstby10cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7LW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dH03JXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1vLW9yaWdpbjowfTMwJXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1pbi1vdXQ7LW8tb3JpZ2luOjclfTM5JXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSg2NDVkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1vLW9yaWdpbjozMCV9NzAle29wYWNpdHk6MTstby10cmFuc2Zvcm06cm90YXRlKDc3MGRlZyk7LW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstby1vcmlnaW46MzklfTc1JXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LW8tb3JpZ2luOjcwJX03NiV7b3BhY2l0eTowOy1vLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX0xMDAle29wYWNpdHk6MDstby10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9fUBrZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7dHJhbnNmb3JtOnJvdGF0ZSgxODBkZWcpO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXR9NyV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjtvcmlnaW46MH0zMCV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2UtaW4tb3V0O29yaWdpbjo3JX0zOSV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjtvcmlnaW46MzAlfTcwJXtvcGFjaXR5OjE7dHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7b3JpZ2luOjM5JX03NSV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0O29yaWdpbjo3MCV9NzYle29wYWNpdHk6MDt0cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfX0jYXV0aDAtd2lkZ2V0IGlucHV0W2Rpc2FibGVkXXtiYWNrZ3JvdW5kLWNvbG9yOiNkOWRlZTB9I2F1dGgwLXdpZGdldCBhcnRpY2xlLCNhdXRoMC13aWRnZXQgYXNpZGUsI2F1dGgwLXdpZGdldCBkZXRhaWxzLCNhdXRoMC13aWRnZXQgZmlnY2FwdGlvbiwjYXV0aDAtd2lkZ2V0IGZpZ3VyZSwjYXV0aDAtd2lkZ2V0IGZvb3RlciwjYXV0aDAtd2lkZ2V0IGhlYWRlciwjYXV0aDAtd2lkZ2V0IGhncm91cCwjYXV0aDAtd2lkZ2V0IG5hdiwjYXV0aDAtd2lkZ2V0IHNlY3Rpb24sI2F1dGgwLXdpZGdldCBzdW1tYXJ5e2Rpc3BsYXk6YmxvY2t9I2F1dGgwLXdpZGdldCBhdWRpbywjYXV0aDAtd2lkZ2V0IGNhbnZhcywjYXV0aDAtd2lkZ2V0IHZpZGVve2Rpc3BsYXk6aW5saW5lLWJsb2NrOypkaXNwbGF5OmlubGluZTsqem9vbToxfSNhdXRoMC13aWRnZXQgYXVkaW86bm90KFtjb250cm9sc10pe2Rpc3BsYXk6bm9uZTtoZWlnaHQ6MH0jYXV0aDAtd2lkZ2V0IFtoaWRkZW5de2Rpc3BsYXk6bm9uZX0jYXV0aDAtd2lkZ2V0IGh0bWx7Zm9udC1zaXplOjEwMCU7LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OjEwMCU7LW1zLXRleHQtc2l6ZS1hZGp1c3Q6MTAwJX0jYXV0aDAtd2lkZ2V0IGh0bWwsI2F1dGgwLXdpZGdldCBidXR0b24sI2F1dGgwLXdpZGdldCBpbnB1dCwjYXV0aDAtd2lkZ2V0IHNlbGVjdCwjYXV0aDAtd2lkZ2V0IHRleHRhcmVhLCNhdXRoMC13aWRnZXQgaDEsI2F1dGgwLXdpZGdldCBoMiwjYXV0aDAtd2lkZ2V0IGRpdiwjYXV0aDAtd2lkZ2V0IHNwYW4sI2F1dGgwLXdpZGdldCBhe2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWZ9I2F1dGgwLXdpZGdldCBib2R5e21hcmdpbjowfSNhdXRoMC13aWRnZXQgYTpmb2N1c3tvdXRsaW5lOnRoaW4gZG90dGVkfSNhdXRoMC13aWRnZXQgYTphY3RpdmUsI2F1dGgwLXdpZGdldCBhOmhvdmVye291dGxpbmU6MH0jYXV0aDAtd2lkZ2V0IGgxe2ZvbnQtc2l6ZToyZW07bWFyZ2luOi42N2VtIDB9I2F1dGgwLXdpZGdldCBoMntmb250LXNpemU6MS41ZW07bWFyZ2luOi44M2VtIDB9I2F1dGgwLXdpZGdldCBoM3tmb250LXNpemU6MS4xN2VtO21hcmdpbjoxZW0gMH0jYXV0aDAtd2lkZ2V0IGg0e2ZvbnQtc2l6ZToxZW07bWFyZ2luOjEuMzNlbSAwfSNhdXRoMC13aWRnZXQgaDV7Zm9udC1zaXplOi44M2VtO21hcmdpbjoxLjY3ZW0gMH0jYXV0aDAtd2lkZ2V0IGg2e2ZvbnQtc2l6ZTouNzVlbTttYXJnaW46Mi4zM2VtIDB9I2F1dGgwLXdpZGdldCBhYmJyW3RpdGxlXXtib3JkZXItYm90dG9tOjFweCBkb3R0ZWR9I2F1dGgwLXdpZGdldCBiLCNhdXRoMC13aWRnZXQgc3Ryb25ne2ZvbnQtd2VpZ2h0OmJvbGR9I2F1dGgwLXdpZGdldCBibG9ja3F1b3Rle21hcmdpbjoxZW0gNDBweH0jYXV0aDAtd2lkZ2V0IGRmbntmb250LXN0eWxlOml0YWxpY30jYXV0aDAtd2lkZ2V0IG1hcmt7YmFja2dyb3VuZDojZmYwO2NvbG9yOiMwMDB9I2F1dGgwLXdpZGdldCBwLCNhdXRoMC13aWRnZXQgcHJle21hcmdpbjoxZW0gMH0jYXV0aDAtd2lkZ2V0IGNvZGUsI2F1dGgwLXdpZGdldCBrYmQsI2F1dGgwLXdpZGdldCBwcmUsI2F1dGgwLXdpZGdldCBzYW1we2ZvbnQtZmFtaWx5Om1vbm9zcGFjZSxzZXJpZjtfZm9udC1mYW1pbHk6J2NvdXJpZXIgbmV3Jyxtb25vc3BhY2U7Zm9udC1zaXplOjFlbX0jYXV0aDAtd2lkZ2V0IHByZXt3aGl0ZS1zcGFjZTpwcmU7d2hpdGUtc3BhY2U6cHJlLXdyYXA7d29yZC13cmFwOmJyZWFrLXdvcmR9I2F1dGgwLXdpZGdldCBxe3F1b3Rlczpub25lfSNhdXRoMC13aWRnZXQgcTpiZWZvcmUsI2F1dGgwLXdpZGdldCBxOmFmdGVye2NvbnRlbnQ6Jyc7Y29udGVudDpub25lfSNhdXRoMC13aWRnZXQgc21hbGx7Zm9udC1zaXplOjgwJX0jYXV0aDAtd2lkZ2V0IHN1YiwjYXV0aDAtd2lkZ2V0IHN1cHtmb250LXNpemU6NzUlO2xpbmUtaGVpZ2h0OjA7cG9zaXRpb246cmVsYXRpdmU7dmVydGljYWwtYWxpZ246YmFzZWxpbmV9I2F1dGgwLXdpZGdldCBzdXB7dG9wOi0wLjVlbX0jYXV0aDAtd2lkZ2V0IHN1Yntib3R0b206LTAuMjVlbX0jYXV0aDAtd2lkZ2V0IGRsLCNhdXRoMC13aWRnZXQgbWVudSwjYXV0aDAtd2lkZ2V0IG9sLCNhdXRoMC13aWRnZXQgdWx7bWFyZ2luOjFlbSAwfSNhdXRoMC13aWRnZXQgZGR7bWFyZ2luOjAgMCAwIDQwcHh9I2F1dGgwLXdpZGdldCBtZW51LCNhdXRoMC13aWRnZXQgb2wsI2F1dGgwLXdpZGdldCB1bHtwYWRkaW5nOjAgMCAwIDQwcHh9I2F1dGgwLXdpZGdldCBuYXYgdWwsI2F1dGgwLXdpZGdldCBuYXYgb2x7bGlzdC1zdHlsZTpub25lO2xpc3Qtc3R5bGUtaW1hZ2U6bm9uZX0jYXV0aDAtd2lkZ2V0IGltZ3tib3JkZXI6MDstbXMtaW50ZXJwb2xhdGlvbi1tb2RlOmJpY3ViaWN9I2F1dGgwLXdpZGdldCBzdmc6bm90KDpyb290KXtvdmVyZmxvdzpoaWRkZW59I2F1dGgwLXdpZGdldCBmaWd1cmV7bWFyZ2luOjB9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjowfSNhdXRoMC13aWRnZXQgZmllbGRzZXR7Ym9yZGVyOjFweCBzb2xpZCAjYzBjMGMwO21hcmdpbjowIDJweDtwYWRkaW5nOi4zNWVtIC42MjVlbSAuNzVlbX0jYXV0aDAtd2lkZ2V0IGxlZ2VuZHtib3JkZXI6MDtwYWRkaW5nOjA7d2hpdGUtc3BhY2U6bm9ybWFsOyptYXJnaW4tbGVmdDotN3B4fSNhdXRoMC13aWRnZXQgYnV0dG9uLCNhdXRoMC13aWRnZXQgaW5wdXQsI2F1dGgwLXdpZGdldCBzZWxlY3QsI2F1dGgwLXdpZGdldCB0ZXh0YXJlYXtmb250LXNpemU6MTAwJTttYXJnaW46MDt2ZXJ0aWNhbC1hbGlnbjpiYXNlbGluZTsqdmVydGljYWwtYWxpZ246bWlkZGxlfSNhdXRoMC13aWRnZXQgYnV0dG9uLCNhdXRoMC13aWRnZXQgaW5wdXR7bGluZS1oZWlnaHQ6bm9ybWFsfSNhdXRoMC13aWRnZXQgYnV0dG9uLCNhdXRoMC13aWRnZXQgaHRtbCBpbnB1dFt0eXBlPVxcXCJidXR0b25cXFwiXSwjYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcInJlc2V0XFxcIl0sI2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJzdWJtaXRcXFwiXXstd2Via2l0LWFwcGVhcmFuY2U6YnV0dG9uO2N1cnNvcjpwb2ludGVyOypvdmVyZmxvdzp2aXNpYmxlfSNhdXRoMC13aWRnZXQgYnV0dG9uW2Rpc2FibGVkXSwjYXV0aDAtd2lkZ2V0IGlucHV0W2Rpc2FibGVkXXtjdXJzb3I6ZGVmYXVsdH0jYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcImNoZWNrYm94XFxcIl0sI2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJde2JveC1zaXppbmc6Ym9yZGVyLWJveDtwYWRkaW5nOjA7KmhlaWdodDoxM3B4Oyp3aWR0aDoxM3B4fSNhdXRoMC13aWRnZXQgaW5wdXRbdHlwZT1cXFwic2VhcmNoXFxcIl17LXdlYmtpdC1hcHBlYXJhbmNlOnRleHRmaWVsZDstbW96LWJveC1zaXppbmc6Y29udGVudC1ib3g7LXdlYmtpdC1ib3gtc2l6aW5nOmNvbnRlbnQtYm94O2JveC1zaXppbmc6Y29udGVudC1ib3h9I2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtY2FuY2VsLWJ1dHRvbiwjYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uey13ZWJraXQtYXBwZWFyYW5jZTpub25lfSNhdXRoMC13aWRnZXQgYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLCNhdXRoMC13aWRnZXQgaW5wdXQ6Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjA7cGFkZGluZzowfSNhdXRoMC13aWRnZXQgdGV4dGFyZWF7b3ZlcmZsb3c6YXV0bzt2ZXJ0aWNhbC1hbGlnbjp0b3B9I2F1dGgwLXdpZGdldCB0YWJsZXtib3JkZXItY29sbGFwc2U6Y29sbGFwc2U7Ym9yZGVyLXNwYWNpbmc6MH1cIik7XG5cbi8vIHVzZSBhbWQgb3IganVzdCB0aHJvdWdodCB0byB3aW5kb3cgb2JqZWN0LlxuaWYgKHR5cGVvZiBnbG9iYWwud2luZG93LmRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGdsb2JhbC53aW5kb3cuZGVmaW5lLmFtZCkge1xuICBnbG9iYWwud2luZG93LmRlZmluZSgnYXV0aDAtd2lkZ2V0JywgZnVuY3Rpb24gKCkgeyByZXR1cm4gQXV0aDBXaWRnZXQ7IH0pO1xufSBlbHNlIGlmIChnbG9iYWwud2luZG93KSB7XG4gIGdsb2JhbC53aW5kb3cuQXV0aDBXaWRnZXQgPSBBdXRoMFdpZGdldDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzPShmdW5jdGlvbigpIHt2YXIgdCA9IGZ1bmN0aW9uIGFub255bW91cyhsb2NhbHMsIGZpbHRlcnMsIGVzY2FwZSkge1xuZXNjYXBlID0gZXNjYXBlIHx8IGZ1bmN0aW9uIChodG1sKXtcbiAgcmV0dXJuIFN0cmluZyhodG1sKVxuICAgIC5yZXBsYWNlKC8mKD8hXFx3KzspL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xufTtcbnZhciBidWYgPSBbXTtcbndpdGggKGxvY2FscyB8fCB7fSkgeyAoZnVuY3Rpb24oKXsgXG4gYnVmLnB1c2goJzxkaXYgaWQ9XCJhdXRoMC13aWRnZXRcIiBjbGFzcz1cImNsZWFuc2xhdGVcIj5cXG5cdDxkaXYgY2xhc3M9XCJzaWduaW5cIj5cXG5cdCAgICA8ZGl2IGNsYXNzPVwicG9wdXBcIj5cXG5cdCAgICAgIFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIj5cXG5cdCAgICAgICAgXHQ8ZGl2IGlkPVwib25lc3RlcFwiIGNsYXNzPVwicGFuZWwgb25lc3RlcFwiPlxcblx0ICAgICAgICAgIFx0XHQ8aGVhZGVyIGNsYXNzPVwiaGVhZGVyXCI+XFxuXHQgICAgICAgICAgICBcdFx0PGRpdiBjbGFzcz1cImltYWdlXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+XFxuXHQgICAgICAgICAgICBcdFx0XHQ8aW1nIHNyYz1cIlwiPlxcblx0ICAgICAgICAgICAgXHRcdDwvZGl2Plxcblx0ICAgICAgICAgICAgXHRcdDxoMT5TaWduIEluPC9oMT5cXG5cdFx0XHQgICAgICAgICAgICA8aDIgY2xhc3M9XCJlcnJvclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPiZuYnNwOzwvaDI+XFxuXHRcdFx0ICAgICAgICAgICAgPGgyIGNsYXNzPVwic3VjY2Vzc1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPiZuYnNwOzwvaDI+XFxuXHRcdFx0ICAgICAgICAgICAgPGEgY2xhc3M9XCJjbG9zZVwiPkNsb3NlPC9hPlxcblx0ICAgICAgICAgIFx0XHQ8L2hlYWRlcj5cXG5cXG5cdCAgICAgICAgICBcdFx0PGRpdiBjbGFzcz1cImxvZ2dlZGluXCI+XFxuXHRcdFx0ICAgICAgICAgICAgPGZvcm0+XFxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImNlbnRlcmVkIGxhc3QtdGltZVwiPjwvc3Bhbj5cXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzdHJhdGVneVwiPjwvZGl2Plxcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVtYWlsUGFzc3dvcmRcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZW1haWxcIj5cXG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImVtYWlsLXJlYWRvbmx5XCI+PC9zcGFuPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwiZW1haWxcIiB0eXBlPVwiZW1haWxcIiB2YWx1ZT1cIlwiIGRpc2FibGVkIHBsYWNlaG9sZGVyPVwiRW1haWxcIiB0aXRsZT1cIkVtYWlsXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj5cXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwicGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiB2YWx1ZT1cIlwiIGF1dG9mb2N1cyBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkXCIgdGl0bGU9XCJQYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiem9jaWFsIHByaW1hcnkgbmV4dFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCI+U2lnbiBJbjwvYnV0dG9uPlxcblx0XHRcdFx0XHRcdFx0XHQgIFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJzcGlubmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PC9idXR0b24+XFxuXHRcdFx0XHRcdFx0XHRcdCAgXHQ8bGFiZWwgY2xhc3M9XCJjcmVhdGUtYWNjb3VudFwiPjxhIGhyZWY9XCJqYXZhc2NyaXB0OiB7fVwiIGNsYXNzPVwiZm9yZ290LXBhc3NcIj5Gb3Jnb3QgeW91ciBwYXNzd29yZD88L2E+PC9sYWJlbD5cXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2VudGVyZWQgYWxsXCI+U2hvdyBhbGw8L3NwYW4+XFxuXHRcdFx0ICAgICAgICAgICAgPC9mb3JtPlxcblx0ICAgICAgICAgIFx0XHQ8L2Rpdj5cXG5cXG5cdFx0ICAgICAgICAgIFx0PGRpdiBjbGFzcz1cIm5vdGxvZ2dlZGluXCI+XFxuXHRcdFx0ICAgICAgICAgICAgPGZvcm0+XFxuXHRcdFx0ICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiaWNvbmxpc3RcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48cCBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPi4uLiBvciBzaWduIGluIHVzaW5nPC9wPjwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwic2VwYXJhdG9yXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PHNwYW4+b3I8L3NwYW4+PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJlbWFpbFBhc3N3b3JkXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImVtYWlsXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgXHRcdDxpbnB1dCBuYW1lPVwiZW1haWxcIiBpZD1cInNpZ25pbl9lYXN5X2VtYWlsXCIgdHlwZT1cImVtYWlsXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwicGFzc3dvcmRcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgaWQ9XCJzaWduaW5fZWFzeV9wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIiB0aXRsZT1cIlBhc3N3b3JkXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvblwiPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNpZ24gSW48L2J1dHRvbj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJzcGlubmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PC9idXR0b24+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxsYWJlbCBjbGFzcz1cImNyZWF0ZS1hY2NvdW50XCI+PGEgaHJlZj1cImphdmFzY3JpcHQ6IHt9XCIgY2xhc3M9XCJzaWduLXVwXCI+U2lnbiBVcDwvYT48c3BhbiBjbGFzcz1cImRpdmlkZXJcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPiZuYnNwO+KAoiZuYnNwOzwvc3Bhbj48YSBocmVmPVwiamF2YXNjcmlwdDoge31cIiBjbGFzcz1cImZvcmdvdC1wYXNzXCI+Rm9yZ290IHlvdXIgcGFzc3dvcmQ/PC9hPjwvbGFiZWw+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgPC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgIDwvZm9ybT5cXG5cdFx0ICAgICAgICAgIFx0PC9kaXY+XFxuXFxuXHRcdCAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJzaWdudXBcIj5cXG5cdFx0XHQgICAgICAgICAgICA8Zm9ybT5cXG5cdFx0XHQgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPjwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxQYXNzd29yZFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJlbWFpbFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cImVtYWlsXCIgaWQ9XCJzaWdudXBfZWFzeV9lbWFpbFwiIHR5cGU9XCJlbWFpbFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwicGFzc3dvcmRcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgICBcdFx0PGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIGlkPVwic2lnbnVwX2Vhc3lfcGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiB2YWx1ZT1cIlwiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPVwiQ3JlYXRlIGEgUGFzc3dvcmRcIiB0aXRsZT1cIlBhc3N3b3JkXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvblwiPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNpZ24gVXA8L2J1dHRvbj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJzcGlubmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PC9idXR0b24+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJmb290ZXJcIj48L2Rpdj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cIm9wdGlvbnNcIj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgICAgXHQ8YSBocmVmPVwiamF2YXNjcmlwdDoge31cIiBjbGFzcz1cImNlbnRlcmVkIGNhbmNlbFwiPkNhbmNlbDwvYT5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgPC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgIDwvZm9ybT5cXG5cdFx0ICAgICAgICAgIFx0PC9kaXY+XFxuXFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyZXNldFwiPlxcblx0XHRcdFx0XHRcdDxmb3JtIGlkPVwiY2hhbmdlX3Bhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0ICBcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj48L2Rpdj5cXG5cdFx0XHRcdFx0XHQgIFx0PGRpdiBjbGFzcz1cImVtYWlsUGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxcIj5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PGlucHV0IG5hbWU9XCJlbWFpbFwiIGlkPVwicmVzZXRfZWFzeV9lbWFpbFwiIHR5cGU9XCJlbWFpbFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8ZGl2IGNsYXNzPVwicGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIGlkPVwicmVzZXRfZWFzeV9wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJOZXcgUGFzc3dvcmRcIiB0aXRsZT1cIk5ldyBQYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdCAgICBcdDwvZGl2Plxcblx0XHRcdFx0XHRcdCAgICBcdDxkaXYgY2xhc3M9XCJyZXBlYXRQYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cInJlcGVhdF9wYXNzd29yZFwiIGlkPVwicmVzZXRfZWFzeV9yZXBlYXRfcGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiB2YWx1ZT1cIlwiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPVwiQ29uZmlybSBOZXcgUGFzc3dvcmRcIiB0aXRsZT1cIkNvbmZpcm0gTmV3IFBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNlbmQ8L2J1dHRvbj5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJzcGlubmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PC9idXR0b24+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDxkaXYgY2xhc3M9XCJvcHRpb25zXCI+XFxuXHRcdFx0XHRcdFx0ICAgICAgICBcdFx0PGEgaHJlZj1cImphdmFzY3JpcHQ6IHt9XCIgY2xhc3M9XCJjZW50ZXJlZCBjYW5jZWxcIj5DYW5jZWw8L2E+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdCAgICBcdDwvZGl2Plxcblx0XHRcdFx0XHRcdCAgXHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHQ8L2Zvcm0+XFxuXHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcXG5cdCAgICAgICAgICBcdFx0PGZvb3Rlcj5cXG5cdCAgICAgICAgICAgIFx0XHQ8c3Bhbj5Qb3dlcmVkIGJ5IDxhIGhyZWY9XCJodHRwOi8vYXV0aDAuY29tXCIgdGFyZ2V0PVwiX25ld1wiPkF1dGgwPC9hPjwvc3Bhbj5cXG5cdCAgICAgICAgICBcdFx0PC9mb290ZXI+XFxuXHQgICAgICAgIFx0PC9kaXY+XFxuXHQgICAgICBcdDwvZGl2Plxcblx0ICAgIDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJyk7IH0pKCk7XG59IFxucmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07IHJldHVybiBmdW5jdGlvbihsKSB7IHJldHVybiB0KGwpIH19KCkpIiwidmFyIEF1dGgwICAgICA9IHJlcXVpcmUoJ2F1dGgwLWpzJyk7XG52YXIgcXdlcnkgICAgID0gcmVxdWlyZSgncXdlcnknKTtcbnZhciBib256byAgICAgPSByZXF1aXJlKCdib256bycpO1xudmFyIGJlYW4gICAgICA9IHJlcXVpcmUoJ2JlYW4nKTtcbnZhciB4dGVuZCAgICAgPSByZXF1aXJlKCd4dGVuZCcpO1xuXG52YXIgbWFpblRtcGwgPSByZXF1aXJlKCcuL2h0bWwvbWFpbi5odG1sJyk7XG5cbnZhciAkID0gZnVuY3Rpb24gKHNlbGVjdG9yLCByb290KSB7XG4gIHJldHVybiBib256byhxd2VyeSgnI2F1dGgwLXdpZGdldCAnICsgKHNlbGVjdG9yIHx8ICcnKSwgcm9vdCkpO1xufTtcblxuZnVuY3Rpb24gQXV0aDBXaWRnZXQgKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEF1dGgwV2lkZ2V0KSkge1xuICAgIHJldHVybiBuZXcgQXV0aDBXaWRnZXQob3B0aW9ucyk7XG4gIH1cblxuICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy5fYXV0aDAgPSBuZXcgQXV0aDAoe1xuICAgIGNsaWVudElEOiAgICAgdGhpcy5fb3B0aW9ucy5jbGllbnRJRCwgXG4gICAgY2FsbGJhY2tVUkw6ICB0aGlzLl9vcHRpb25zLmNhbGxiYWNrVVJMLFxuICAgIGRvbWFpbjogICAgICAgdGhpcy5fb3B0aW9ucy5kb21haW5cbiAgfSk7XG4gIFxuICB0aGlzLl9zdHJhdGVnaWVzID0ge1xuICAgICdnb29nbGUtb3BlbmlkJzogeyBjc3M6ICdnb29nbGUnLCBuYW1lOiAnR29vZ2xlIE9wZW5JZCcsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdnb29nbGUtYXBwcyc6IHsgY3NzOiAnZ29vZ2xlJywgbmFtZTogJ0dvb2dsZSBBcHBzJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdnb29nbGUtb2F1dGgyJzogeyBjc3M6ICdnb29nbGVwbHVzJywgbmFtZTogJ0dvb2dsZScsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdmYWNlYm9vayc6IHsgY3NzOiAnZmFjZWJvb2snLCBuYW1lOiAnRmFjZWJvb2snLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnd2luZG93c2xpdmUnOiB7IGNzczogJ3dpbmRvd3MnLCBuYW1lOiAnTWljcm9zb2Z0IEFjY291bnQnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnbGlua2VkaW4nOiB7IGNzczogJ2xpbmtlZGluJywgbmFtZTogJ0xpbmtlZEluJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2dpdGh1Yic6IHsgY3NzOiAnZ2l0aHViJywgbmFtZTogJ0dpdEh1YicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdwYXlwYWwnOiB7IGNzczogJ3BheXBhbCcsIG5hbWU6ICdQYXlQYWwnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAndHdpdHRlcic6IHsgY3NzOiAndHdpdHRlcicsIG5hbWU6ICdUd2l0dGVyJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2FtYXpvbic6IHsgY3NzOiAnYW1hem9uJywgbmFtZTogJ0FtYXpvbicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICd2a29udGFrdGUnOiB7IGNzczogJ3ZrJywgbmFtZTogJ3ZLb250YWt0ZScsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICd5YW5kZXgnOiB7IGNzczogJ3lhbmRleCcsIG5hbWU6ICdZYW5kZXgnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnb2ZmaWNlMzY1JzogeyBjc3M6ICdvZmZpY2UzNjUnLCBuYW1lOiAnT2ZmaWNlMzY1Jywgc29jaWFsOiBmYWxzZSB9LFxuICAgICd3YWFkJzogeyBjc3M6ICd3YWFkJywgbmFtZTogJ1dpbmRvd3MgQXp1cmUgQUQnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2FkZnMnOiB7IGNzczogJ3dpbmRvd3MnLCBuYW1lOiAnQURGUycsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnc2FtbHAnOiB7IGNzczogJ2d1ZXN0JywgbmFtZTogJ1NBTUwnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ21zY3JtJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdEeW5hbWljcyBDUk0nLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2FkJzogeyBjc3M6ICd3aW5kb3dzJywgbmFtZTogJ0FEIC8gTERBUCcsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnY3VzdG9tJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdDdXN0b20gQXV0aCcsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnYXV0aDAnOiB7IGNzczogJ2d1ZXN0JywgbmFtZTogJ0F1dGgwJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdhdXRoMC1hZGxkYXAnOiB7IGNzczogJ2d1ZXN0JywgbmFtZTogJ0FEL0xEQVAnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ3RoaXJ0eXNldmVuc2lnbmFscyc6IHsgY3NzOiAndGhpcnR5c2V2ZW5zaWduYWxzJywgbmFtZTogJzM3IFNpZ25hbHMnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnYm94JzogeyBjc3M6ICdib3gnLCBuYW1lOiAnQm94Jywgc29jaWFsOiB0cnVlLCBpbWFnZWljb246IHRydWUgfSxcbiAgICAnc2FsZXNmb3JjZSc6IHsgY3NzOiAnc2FsZXNmb3JjZScsIG5hbWU6ICdTYWxlc2ZvcmNlJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2ZpdGJpdCc6IHsgY3NzOiAnZml0Yml0JywgbmFtZTogJ0ZpdGJpdCcsIHNvY2lhbDogdHJ1ZSB9XG4gIH07XG59XG5cbi8vIGhlbHBlciBtZXRob2RzXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NldFRvcCA9IGZ1bmN0aW9uIChvblRvcCwgZWxlbWVudCkge1xuICBpZiAoIW9uVG9wKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGVsZW1lbnQuY3NzKHtcbiAgICAgICAgJ21hcmdpblRvcCc6ICctJyArIChlbGVtZW50Lm9mZnNldCgpLmhlaWdodCAvIDIpICsgJ3B4JyxcbiAgICAgICAgJ3RvcCc6ICc1MCUnXG4gICAgICB9KTtcbiAgICB9LCAxKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmNzcyh7XG4gICAgICAnbWFyZ2luVG9wJzogJzJweCcsXG4gICAgICAndG9wJzogJzAnXG4gICAgfSk7XG4gIH1cbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2hvd0Vycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gIGlmICghZXJyb3IpIHJldHVybjtcbiAgJCgnLnNpZ25pbiBoMScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gLnN1Y2Nlc3MnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbmluIC5lcnJvcicpLmh0bWwoZXJyb3IpLmNzcygnZGlzcGxheScsICcnKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2hvd1N1Y2Nlc3MgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICBpZiAoIW1lc3NhZ2UpIHJldHVybjtcbiAgJCgnLnNpZ25pbiBoMScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gLmVycm9yJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiAuc3VjY2VzcycpLmh0bWwobWVzc2FnZSkuY3NzKCdkaXNwbGF5JywgJycpO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9pc0F1dGgwQ29ubiA9IGZ1bmN0aW9uIChzdHJhdGVneSkge1xuICByZXR1cm4gc3RyYXRlZ3kgPT09ICdhdXRoMCcgfHwgc3RyYXRlZ3kgPT09ICdhdXRoMC1hZGxkYXAnO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zZXRUaXRsZSA9IGZ1bmN0aW9uKHRpdGxlKSB7XG4gICQoJy5zaWduaW4gLmVycm9yJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiAuc3VjY2VzcycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gaDEnKS5odG1sKHRpdGxlKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3BhcnNlUmVzcG9uc2VNZXNzYWdlID0gZnVuY3Rpb24gKHJlc3BvbnNlT2JqLCBkZWZhdWx0VmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX3NpZ25pbk9wdGlvbnNbcmVzcG9uc2VPYmouY29kZV0gfHwgcmVzcG9uc2VPYmoubWVzc2FnZSB8fCBkZWZhdWx0VmFsdWU7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2lzQWRMZGFwQ29ubiA9IGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4gIHJldHVybiBjb25uZWN0aW9uID09PSAnYWRsZGFwJztcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fYXJlVGhlcmVBbnlTb2NpYWxDb25uID0gZnVuY3Rpb24gKCkge1xuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgaWYgKHRoaXMuX3N0cmF0ZWdpZXNbdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZV0gJiYgdGhpcy5fc3RyYXRlZ2llc1t0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXS5uYW1lXS5zb2NpYWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fYXJlVGhlcmVBbnlFbnRlcnByaXNlT3JEYkNvbm4gPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgcyBpbiB0aGlzLl9jbGllbnQuc3RyYXRlZ2llcykge1xuICAgIGlmICh0aGlzLl9zdHJhdGVnaWVzW3RoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdLm5hbWVdICYmIFxuICAgICAgICAhdGhpcy5fc3RyYXRlZ2llc1t0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXS5uYW1lXS5zb2NpYWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5faXNFbnRlcnByaXNlQ29ubmVjdGlvbiA9IGZ1bmN0aW9uIChlbWFpbCwgb3V0cHV0KSB7XG4gIHZhciBlbWFpbE0gPSAvXigoW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKyhcXC5bXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKSopfChcXFwiLitcXFwiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFxdKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkL1xuICAgICAgICAgICAgICAgICAgICAuZXhlYyhlbWFpbC50b0xvd2VyQ2FzZSgpKTtcblxuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgdmFyIHN0cmF0ZWd5ID0gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc107XG4gICAgaWYgKHRoaXMuX2lzQXV0aDBDb25uKHN0cmF0ZWd5Lm5hbWUpKSBjb250aW51ZTtcblxuICAgIGZvciAodmFyIGMgaW4gc3RyYXRlZ3kuY29ubmVjdGlvbnMpIHtcbiAgICAgIGlmIChlbWFpbE0gJiYgZW1haWxNLnNsaWNlKC0yKVswXSA9PSBzdHJhdGVneS5jb25uZWN0aW9uc1tjXS5kb21haW4pIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0IHx8wqB7fTtcbiAgICAgICAgb3V0cHV0LmRvbWFpbiA9IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbjtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9pc0VudGVycHJpc2VTdHJhdGVneSA9IGZ1bmN0aW9uIChzdHJhdGVneSkgeyBcbiAgZm9yICh2YXIgcyBpbiB0aGlzLl9zdHJhdGVnaWVzKSB7XG4gICAgaWYgKHMgPT09IHN0cmF0ZWd5ICYmICF0aGlzLl9zdHJhdGVnaWVzW3NdLnNvY2lhbCkgeyBcbiAgICAgIHJldHVybiB0cnVlOyBcbiAgICB9IFxuICB9IFxuXG4gIHJldHVybiBmYWxzZTsgXG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2dldENvbmZpZ3VyZWRTdHJhdGVneSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICBpZiAodGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10gJiYgdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdO1xuICAgIH1cbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9nZXRBdXRoMENvbm5lY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgLy8gaWYgc3BlY2lmaWVkLCB1c2UgaXQsIG90aGVyd2lzZSByZXR1cm4gZmlyc3RcbiAgaWYgKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3VzZXJQd2RDb25uZWN0aW9uTmFtZSddKSB7XG4gICAgZm9yICh2YXIgaSBpbiB0aGlzLl9hdXRoMFN0cmF0ZWdpZXMpIHtcbiAgICAgIGZvciAodmFyIGogaW4gdGhpcy5fYXV0aDBTdHJhdGVnaWVzW2ldLmNvbm5lY3Rpb25zKSB7XG4gICAgICAgIGlmICh0aGlzLl9hdXRoMFN0cmF0ZWdpZXNbal0uY29ubmVjdGlvbnNbal0ubmFtZSA9PT0gdGhpcy5fc2lnbmluT3B0aW9uc1sndXNlclB3ZENvbm5lY3Rpb25OYW1lJ10pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fYXV0aDBTdHJhdGVnaWVzW2ldLmNvbm5lY3Rpb25zW2pdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQnkgZGVmYXVsdCwgaWYgZXhpc3RzLCByZXR1cm4gYXV0aDAgY29ubmVjdGlvbiAoZGItY29ubilcbiAgdmFyIGRlZmF1bHRTdHJhdGVneSA9IHRoaXMuX2F1dGgwU3RyYXRlZ2llcy5maWx0ZXIoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMubmFtZSA9PT0gJ2F1dGgwJzsgfSlbMF07XG4gIHJldHVybiB0aGlzLl9hdXRoMFN0cmF0ZWdpZXMubGVuZ3RoID4gMCA/IFxuICAgIChkZWZhdWx0U3RyYXRlZ3kgPyBkZWZhdWx0U3RyYXRlZ3kuY29ubmVjdGlvbnNbMF0gOiB0aGlzLl9hdXRoMFN0cmF0ZWdpZXNbMF0uY29ubmVjdGlvbnNbMF0pIDpcbiAgICBudWxsO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93T3JIaWRlUGFzc3dvcmQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtYWlsRmllbGQgPSAkKCcubm90bG9nZ2VkaW4gLmVtYWlsIGlucHV0Jyk7XG4gIHZhciBwd2RGaWVsZCAgPSAkKCcubm90bG9nZ2VkaW4gLnBhc3N3b3JkIGlucHV0JykuZmlyc3QoKTtcbiAgXG4gIHZhciBpc0VudGVycHJpc2VDb25uZWN0aW9uID0gdGhpcy5faXNFbnRlcnByaXNlQ29ubmVjdGlvbihtYWlsRmllbGQudmFsKCkpO1xuXG4gIGlmIChpc0VudGVycHJpc2VDb25uZWN0aW9uKSB7XG4gICAgcHdkRmllbGQuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcbiAgICBwd2RGaWVsZC5hdHRyKCdwbGFjZWhvbGRlcicsICcnKTtcbiAgICBwd2RGaWVsZC5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpO1xuICB9IGVsc2Uge1xuICAgIHB3ZEZpZWxkLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgcHdkRmllbGQuYXR0cigncGxhY2Vob2xkZXInLCB0aGlzLl9zaWduaW5PcHRpb25zWydwYXNzd29yZFBsYWNlaG9sZGVyJ10pO1xuICAgIHB3ZEZpZWxkLmF0dHIoJ3JlcXVpcmVkJywgdHJ1ZSk7XG4gIH1cbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5faGlkZVNpZ25JbiA9IGZ1bmN0aW9uIChjYikge1xuICAkKCdkaXYub3ZlcmxheScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkKCkucmVtb3ZlQ2xhc3MoJ21vZGUtc2lnbmluJyk7XG4gICAgJCgpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgaWYgKGNiKSBjYigpO1xuICB9LCA1MDApO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9nZXRBY3RpdmVMb2dpblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2hhc0xvZ2dlZEluQmVmb3JlID8gJCgnLmxvZ2dlZGluJykgOiAkKCcubm90bG9nZ2VkaW4nKTtcbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fdG9nZ2xlU3Bpbm5lciA9IGZ1bmN0aW9uIChjb250YWluZXIpIHtcbiAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IHRoaXMuX2dldEFjdGl2ZUxvZ2luVmlldygpO1xuICB2YXIgc3Bpbm5lciA9ICQoJy5zcGlubmVyJywgY29udGFpbmVyKTtcbiAgdmFyIHNpZ25pbiA9ICQoJy56b2NpYWwucHJpbWFyeScsIGNvbnRhaW5lcik7XG5cbiAgc3Bpbm5lci5jc3MoJ2Rpc3BsYXknLCBzcGlubmVyLmNzcygnZGlzcGxheScpID09PSAnbm9uZScgPyAnJyA6ICdub25lJyk7XG4gIHNpZ25pbi5jc3MoJ2Rpc3BsYXknLCBzaWduaW4uY3NzKCdkaXNwbGF5JykgPT09ICdub25lJyA/ICcnIDogJ25vbmUnKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2hvd1NpZ25VcEV4cGVyaWVuY2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2V0TG9naW5WaWV3KHsgbW9kZTogJ3NpZ251cCcgfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Nob3dSZXNldEV4cGVyaWVuY2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2V0TG9naW5WaWV3KHsgbW9kZTogJ3Jlc2V0JyB9KTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2V0TG9naW5WaWV3ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fMKge307XG5cbiAgJCgnLmxvZ2dlZGluJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLm5vdGxvZ2dlZGluJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ251cCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5yZXNldCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gaW5wdXRbdHlwZT1wYXNzd29yZF0nKS52YWwoJycpO1xuXG4gIGlmICghb3B0aW9ucy5tb2RlKSB7XG4gICAgdGhpcy5faGFzTG9nZ2VkSW5CZWZvcmUgPSAhIW9wdGlvbnMuaXNSZXR1cm5pbmdVc2VyO1xuICAgIHRoaXMuX3NldFRpdGxlKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3RpdGxlJ10pO1xuXG4gICAgJCgnLmxvZ2dlZGluJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5pc1JldHVybmluZ1VzZXIgPyAnJyA6ICdub25lJyk7XG4gICAgJCgnLm5vdGxvZ2dlZGluJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5pc1JldHVybmluZ1VzZXIgPyAnbm9uZScgOiAnJyk7XG5cbiAgICB0aGlzLl9zZXRUb3AodGhpcy5fc2lnbmluT3B0aW9ucy50b3AsICQoJy5zaWduaW4gZGl2LnBhbmVsLm9uZXN0ZXAnKSk7XG5cbiAgICB0cnkgeyBcbiAgICAgIGlmIChvcHRpb25zLmlzUmV0dXJuaW5nVXNlcikgJCgnLmxvZ2dlZGluIC5wYXNzd29yZCBpbnB1dCcpLmZpcnN0KCkuZm9jdXMoKTtcbiAgICAgIGVsc2UgJCgnLm5vdGxvZ2dlZGluIC5lbWFpbCBpbnB1dCcpLmZpcnN0KCkuZm9jdXMoKTtcbiAgICB9IGNhdGNoKGUpIHt9XG4gICAgXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNvbnRhaW5lcjtcblxuICBzd2l0Y2ggKG9wdGlvbnMubW9kZSkge1xuICAgIGNhc2UgJ3NpZ251cCc6XG4gICAgICB0aGlzLl9zZXRUaXRsZSh0aGlzLl9zaWduaW5PcHRpb25zWydzaWdudXBUaXRsZSddKTtcbiAgICAgIGNvbnRhaW5lciA9ICQoJy5zaWdudXAnKS5maXJzdCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmVzZXQnOlxuICAgICAgdGhpcy5fc2V0VGl0bGUodGhpcy5fc2lnbmluT3B0aW9uc1sncmVzZXRUaXRsZSddKTtcbiAgICAgIGNvbnRhaW5lciA9ICQoJy5yZXNldCcpLmZpcnN0KCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGlmIChjb250YWluZXIpIHtcbiAgICB0aGlzLl9zZXRUb3AodGhpcy5fc2lnbmluT3B0aW9ucy50b3AsICQoJy5zaWduaW4gZGl2LnBhbmVsLm9uZXN0ZXAnKSk7XG4gICAgY29udGFpbmVyLmNzcygnZGlzcGxheScsICcnKTtcblxuICAgIHRyeSB7IFxuICAgICAgdmFyIGVtYWlsID0gJCgnLm5vdGxvZ2dlZGluIC5lbWFpbCBpbnB1dCcpLnZhbCgpO1xuICAgICAgJCgnLmVtYWlsIGlucHV0JywgY29udGFpbmVyKS52YWwoZW1haWwpO1xuICAgICAgJCgnLmVtYWlsIGlucHV0JywgY29udGFpbmVyKS5maXJzdCgpLmZvY3VzKCk7XG4gICAgfSBjYXRjaChlKSB7fVxuICB9XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Nob3dMb2dnZWRJbkV4cGVyaWVuY2UgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgc3RyYXRlZ3kgPSB0aGlzLl9zc29EYXRhLmxhc3RVc2VkQ29ubmVjdGlvbi5zdHJhdGVneTtcbiAgdGhpcy5fc2V0TG9naW5WaWV3KHsgaXNSZXR1cm5pbmdVc2VyOiAhIXN0cmF0ZWd5IH0pO1xuXG4gIGlmICghc3RyYXRlZ3kpIHJldHVybjtcblxuICB2YXIgbG9naW5WaWV3ID0gdGhpcy5fZ2V0QWN0aXZlTG9naW5WaWV3KCk7XG4gIGJlYW4ub24oJCgnZm9ybScsIGxvZ2luVmlldylbMF0sICdzdWJtaXQnLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9zaWduSW5FbnRlcnByaXNlKGUpOyB9KTtcbiAgXG4gIHZhciBidXR0b247XG4gIGlmIChzdHJhdGVneSAhPT0gJ2F1dGgwJykge1xuICAgIGJ1dHRvbiA9IGJvbnpvKGJvbnpvLmNyZWF0ZSgnPHNwYW4+PC9zcGFuPicpKVxuICAgICAgLmF0dHIoJ3RhYmluZGV4JywgMClcbiAgICAgIC5hdHRyKCdkYXRhLXN0cmF0ZWd5Jywgc3RyYXRlZ3kpXG4gICAgICAuYXR0cigndGl0bGUnLCB0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5uYW1lKVxuICAgICAgLmFkZENsYXNzKCd6b2NpYWwnKS5hZGRDbGFzcygnYmxvY2snKVxuICAgICAgLmFkZENsYXNzKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLmNzcylcbiAgICAgIC5hZGRDbGFzcyh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5pbWFnZWljb24gPyAnaW1hZ2UtaWNvbicgOiAnJylcbiAgICAgIC5odG1sKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLm5hbWUpO1xuICAgIFxuICAgIGJlYW4ub24oYnV0dG9uWzBdLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9zaWduSW5Tb2NpYWwoZS50YXJnZXQpOyB9KTtcblxuICAgICQoJy5zdHJhdGVneSBzcGFuJywgbG9naW5WaWV3KS5lYWNoKGZ1bmN0aW9uIChlbCkgeyBpZiAoZWwpIGVsLnJlbW92ZSgpOyB9KTtcbiAgICAkKCcuc3RyYXRlZ3knLCBsb2dpblZpZXcpLmFwcGVuZChidXR0b24pO1xuICB9XG5cbiAgJCgnLmFsbCcsIGxvZ2luVmlldykuaHRtbCh0aGlzLl9zaWduaW5PcHRpb25zWydhbGxCdXR0b25UZW1wbGF0ZSddKTtcblxuICBiZWFuLm9uKCQoJy5hbGwnLCBsb2dpblZpZXcpWzBdLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fc2V0TG9naW5WaWV3KCk7XG4gIH0pO1xuXG4gIGlmICh0aGlzLl9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUpIHtcbiAgICBpZiAoc3RyYXRlZ3kgPT09ICdhdXRoMCcpIHtcbiAgICAgICQoJy5lbWFpbC1yZWFkb25seScsIGxvZ2luVmlldykuaHRtbCh0aGlzLl9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUpOyBcbiAgICAgICQoJy5lbWFpbCBpbnB1dCcsIGxvZ2luVmlldykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICQoJy5lbWFpbFBhc3N3b3JkJywgbG9naW5WaWV3KS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gICAgfSBcbiAgICBlbHNlIGlmICh0aGlzLl9pc0VudGVycHJpc2VTdHJhdGVneShzdHJhdGVneSkpIHtcbiAgICAgIGJ1dHRvbi5odG1sKHRoaXMuX3Nzb0RhdGEubGFzdFVzZWRVc2VybmFtZSB8fCB0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5uYW1lKVxuICAgICAgICAgICAgLmF0dHIoJ3RpdGxlJywgdGhpcy5fc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lIHx8IHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLm5hbWUpO1xuICAgIH1cbiAgfVxufTtcblxuLy8gc2lnbiBpbiBtZXRob2RzXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NpZ25JblNvY2lhbCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgdmFyIHN0cmF0ZWd5TmFtZSA9IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID8gdGFyZ2V0IDogdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zdHJhdGVneScpO1xuICB2YXIgc3RyYXRlZ3kgPSB0aGlzLl9nZXRDb25maWd1cmVkU3RyYXRlZ3koc3RyYXRlZ3lOYW1lKTtcblxuICBpZiAoc3RyYXRlZ3kpIHtcbiAgICB0aGlzLl9hdXRoMC5sb2dpbih7XG4gICAgICBjb25uZWN0aW9uOiBzdHJhdGVneS5jb25uZWN0aW9uc1swXS5uYW1lXG4gICAgfSk7XG4gIH1cbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2lnbkluRW50ZXJwcmlzZSA9IGZ1bmN0aW9uIChlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICB2YXIgY29udGFpbmVyID0gdGhpcy5fZ2V0QWN0aXZlTG9naW5WaWV3KCk7XG4gIHZhciBmb3JtID0gJCgnZm9ybScsIGNvbnRhaW5lcik7XG4gIHZhciB2YWxpZCA9IHRydWU7XG5cbiAgdmFyIGVtYWlsRCA9ICQoJy5lbWFpbCcsIGZvcm0pLFxuICAgICAgZW1haWxFID0gJCgnaW5wdXRbbmFtZT1lbWFpbF0nLCBmb3JtKSxcbiAgICAgIGVtYWlsTSA9IC9eKChbXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXF0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvLmV4ZWMoZW1haWxFLnZhbCgpLnRvTG93ZXJDYXNlKCkpLFxuICAgICAgZW1haWxQID0gL15cXHMqJC8udGVzdChlbWFpbEUudmFsKCkpLFxuICAgICAgZG9tYWluLCBjb25uZWN0aW9uLCBlbWFpbCA9IG51bGwsIHN0cmF0ZWd5O1xuXG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICBzdHJhdGVneSA9IHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdO1xuXG4gICAgaWYgKHRoaXMuX2lzQXV0aDBDb25uKHN0cmF0ZWd5Lm5hbWUpKSBjb250aW51ZTtcblxuICAgIGZvciAodmFyIGMgaW4gc3RyYXRlZ3kuY29ubmVjdGlvbnMpIHtcbiAgICAgIGlmKCFlbWFpbFAgJiYgZW1haWxNICYmIGVtYWlsTS5zbGljZSgtMilbMF0gPT0gc3RyYXRlZ3kuY29ubmVjdGlvbnNbY10uZG9tYWluKSB7XG4gICAgICAgIGRvbWFpbiA9IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbjtcbiAgICAgICAgY29ubmVjdGlvbiA9IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLm5hbWU7XG4gICAgICAgIGVtYWlsID0gZW1haWxFLnZhbCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZG9tYWluKSBicmVhaztcbiAgfVxuXG4gIGlmIChlbWFpbFApIHtcbiAgICB0aGlzLl9zaG93RXJyb3IodGhpcy5fc2lnbmluT3B0aW9uc1snc3RyYXRlZ3lFbWFpbEVtcHR5J10pO1xuICB9IFxuICBlbHNlIGlmICghZW1haWxNKSB7XG4gICAgdGhpcy5fc2hvd0Vycm9yKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxJbnZhbGlkJ10pO1xuICB9IFxuICBlbHNlIGlmICghZG9tYWluKSB7XG4gICAgaWYgKHRoaXMuX2F1dGgwU3RyYXRlZ2llcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2lnbkluV2l0aEF1dGgwKGVtYWlsRS52YWwoKSk7XG4gICAgfVxuXG4gICAgaWYgKGVtYWlsTSAmJiBlbWFpbE0uc2xpY2UoLTIpWzBdID09PSAnZ21haWwuY29tJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NpZ25JblNvY2lhbCgnZ29vZ2xlLW9hdXRoMicpO1xuICAgIH1cblxuICAgIHRoaXMuX3Nob3dFcnJvcihcbiAgICAgIHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3N0cmF0ZWd5RG9tYWluSW52YWxpZCddXG4gICAgICAgICAgLnJlcGxhY2UoJ3tkb21haW59JywgZW1haWxNID8gZW1haWxNLnNsaWNlKC0yKVswXSA6ICcnKSk7XG4gIH1cblxuICB2YWxpZCAmPSAoIWRvbWFpbiAmJiAhZW1haWxELmFkZENsYXNzKCdpbnZhbGlkJykpIHx8ICghIWRvbWFpbiAmJiAhIWVtYWlsRC5yZW1vdmVDbGFzcygnaW52YWxpZCcpKTtcblxuICBpZiAodmFsaWQpIHtcbiAgICB0aGlzLl9hdXRoMC5sb2dpbih7XG4gICAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uXG4gICAgfSk7XG4gIH1cbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2lnbkluV2l0aEF1dGgwID0gZnVuY3Rpb24gKHVzZXJOYW1lLCBzaWduSW5QYXNzd29yZCkge1xuICB0aGlzLl90b2dnbGVTcGlubmVyKCk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY29udGFpbmVyID0gdGhpcy5fZ2V0QWN0aXZlTG9naW5WaWV3KCk7XG4gIHZhciBjb25uZWN0aW9uICA9IHRoaXMuX2dldEF1dGgwQ29ubmVjdGlvbigpO1xuICBcbiAgdmFyIGxvZ2luT3B0aW9ucyA9IHtcbiAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uLm5hbWUsXG4gICAgdXNlcm5hbWU6IHRoaXMuX2lzQWRMZGFwQ29ubihjb25uZWN0aW9uLm5hbWUpID8gdXNlck5hbWUucmVwbGFjZSgnQCcgKyBjb25uZWN0aW9uLmRvbWFpbiwgJycpIDogdXNlck5hbWUsXG4gICAgcGFzc3dvcmQ6IHNpZ25JblBhc3N3b3JkIHx8wqAkKCcucGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpXG4gIH07XG5cbiAgZm9yICh2YXIgayBpbiB0aGlzLl9hdXRoMENvbm5lY3Rpb25QYXJhbXMpIHtcbiAgICBsb2dpbk9wdGlvbnNba10gPSB0aGlzLl9hdXRoMENvbm5lY3Rpb25QYXJhbXNba107XG4gIH1cblxuICB0aGlzLl9hdXRoMC5sb2dpbihsb2dpbk9wdGlvbnMsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBzZWxmLl9zaG93RXJyb3Ioc2VsZi5fcGFyc2VSZXNwb25zZU1lc3NhZ2UoZXJyLCBzZWxmLl9zaWduaW5PcHRpb25zWyd3cm9uZ0VtYWlsUGFzc3dvcmRFcnJvclRleHQnXSkpO1xuICAgIH1cblxuICAgIHNlbGYuX3RvZ2dsZVNwaW5uZXIoKTtcbiAgfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NpZ25VcFdpdGhBdXRoMCA9IGZ1bmN0aW9uIChlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjb250YWluZXIgPSAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLnNpZ251cCcpO1xuICB2YXIgZW1haWwgPSAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgcGFzc3dvcmQgPSAkKCcucGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgY29ubmVjdGlvbiAgPSB0aGlzLl9nZXRBdXRoMENvbm5lY3Rpb24oKTtcblxuICB0aGlzLl90b2dnbGVTcGlubmVyKGNvbnRhaW5lcik7XG5cbiAgdGhpcy5fYXV0aDAuc2lnbnVwKHtcbiAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uLm5hbWUsXG4gICAgdXNlcm5hbWU6ICAgZW1haWwsXG4gICAgcGFzc3dvcmQ6ICAgcGFzc3dvcmRcbiAgfSwgXG4gIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBzZWxmLl9zaG93RXJyb3Ioc2VsZi5fcGFyc2VSZXNwb25zZU1lc3NhZ2UoZXJyLCBzZWxmLl9zaWduaW5PcHRpb25zWydzaWdudXBTZXJ2ZXJFcnJvclRleHQnXSkpO1xuICAgICAgc2VsZi5fdG9nZ2xlU3Bpbm5lcihjb250YWluZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxmLl9zaWduSW5XaXRoQXV0aDAoZW1haWwsIHBhc3N3b3JkKTtcbiAgfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Jlc2V0UGFzc3dvcmRXaXRoQXV0aDAgPSBmdW5jdGlvbiAoZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY29udGFpbmVyID0gJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5yZXNldCcpO1xuICB2YXIgZW1haWwgPSAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgcGFzc3dvcmQgPSAkKCcucGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgY29ubmVjdGlvbiAgPSB0aGlzLl9nZXRBdXRoMENvbm5lY3Rpb24oKTtcblxuICB0aGlzLl90b2dnbGVTcGlubmVyKGNvbnRhaW5lcik7XG5cbiAgdGhpcy5fYXV0aDAuY2hhbmdlUGFzc3dvcmQoe1xuICAgIGNvbm5lY3Rpb246IGNvbm5lY3Rpb24ubmFtZSxcbiAgICB1c2VybmFtZTogICBlbWFpbCxcbiAgICBwYXNzd29yZDogICBwYXNzd29yZFxuICB9LCBcbiAgZnVuY3Rpb24gKGVycikge1xuICAgIHNlbGYuX3RvZ2dsZVNwaW5uZXIoY29udGFpbmVyKTtcblxuICAgICQoJy5wYXNzd29yZCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKCcnKTtcbiAgICAkKCcucmVwZWF0UGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgnJyk7XG5cbiAgICBpZiAoZXJyKSB7XG4gICAgICBzZWxmLl9zaG93RXJyb3Ioc2VsZi5fcGFyc2VSZXNwb25zZU1lc3NhZ2UoZXJyLCBzZWxmLl9zaWduaW5PcHRpb25zWydyZXNldFNlcnZlckVycm9yVGV4dCddKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJCgnLmVtYWlsIGlucHV0JywgY29udGFpbmVyKS52YWwoJycpO1xuXG4gICAgdHJ5IHsgXG4gICAgICAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLmZpcnN0KCkuZm9jdXMoKTsgXG4gICAgfSBjYXRjaChlKSB7fSAgXG5cbiAgICBzZWxmLl9zZXRMb2dpblZpZXcoKTtcbiAgICBzZWxmLl9zaG93U3VjY2VzcyhzZWxmLl9zaWduaW5PcHRpb25zWydyZXNldFN1Y2Nlc3NUZXh0J10pO1xuICB9KTtcbn07XG5cbi8vIGluaXRpYWxpemVcbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5faW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVE9ETzogc3VwcG9ydCBjc3Mgb3B0aW9uIGZvciBub24gZnJlZSBzdWJzY3JpcHRpb25zXG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBiZWFuLm9uKCQoJy5wb3B1cCAucGFuZWwub25lc3RlcCBhLmNsb3NlJylbMF0sICdjbGljaycsIGZ1bmN0aW9uICgpIHsgc2VsZi5faGlkZVNpZ25JbigpOyB9KTtcbiAgYmVhbi5vbigkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLm5vdGxvZ2dlZGluIGZvcm0nKVswXSwgJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3NpZ25JbkVudGVycHJpc2UoZSk7IH0pO1xuICBiZWFuLm9uKCQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuc2lnbnVwIGZvcm0nKVswXSwgJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3NpZ25VcFdpdGhBdXRoMChlKTsgfSk7XG4gIGJlYW4ub24oJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5yZXNldCBmb3JtJylbMF0sICdzdWJtaXQnLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9yZXNldFBhc3N3b3JkV2l0aEF1dGgwKGUpOyB9KTtcbiAgYmVhbi5vbihxd2VyeSgnaHRtbCcpWzBdLCAna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmICgkKCkuaGFzQ2xhc3MoJ21vZGUtc2lnbmluJykpIHtcbiAgICAgIGlmICgoZS53aGljaCA9PSAyNyB8fCBlLmtleWNvZGUgPT0gMjcpICYmICFzZWxmLl9zaWduaW5PcHRpb25zLnN0YW5kYWxvbmUpIHtcbiAgICAgICAgc2VsZi5faGlkZVNpZ25JbigpOyAvLyBjbG9zZSBwb3B1cCB3aXRoIEVTQyBrZXlcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIGxvYWQgc29jaWFsIGJ1dHRvbnNcbiAgdmFyIGxpc3QgPSAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLmljb25saXN0Jyk7XG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICB2YXIgc3RyYXRlZ3kgPSB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXTtcblxuICAgIGlmICh0aGlzLl9pc0F1dGgwQ29ubihzdHJhdGVneS5uYW1lKSAmJiBzdHJhdGVneS5jb25uZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9hdXRoMFN0cmF0ZWdpZXMucHVzaChzdHJhdGVneSk7XG4gICAgICAkKCcuY3JlYXRlLWFjY291bnQsIC5wYXNzd29yZCcpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG4gICAgICBiZWFuLm9uKCQoJy5ub3Rsb2dnZWRpbiAuZW1haWwgaW5wdXQnKVswXSwgJ2lucHV0JywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2hvd09ySGlkZVBhc3N3b3JkKGUpOyB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneS5uYW1lXSAmJiB0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLnNvY2lhbCkge1xuICAgICAgdmFyIGJ1dHRvbiA9IGJvbnpvKGJvbnpvLmNyZWF0ZSgnPHNwYW4+PC9zcGFuPicpKVxuICAgICAgICAuYXR0cigndGFiaW5kZXgnLCAwKVxuICAgICAgICAuYXR0cignZGF0YS1zdHJhdGVneScsIHN0cmF0ZWd5Lm5hbWUpXG4gICAgICAgIC5hdHRyKCd0aXRsZScsIHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0ubmFtZSlcbiAgICAgICAgLmFkZENsYXNzKCd6b2NpYWwnKS5hZGRDbGFzcygnaWNvbicpXG4gICAgICAgIC5hZGRDbGFzcyh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLmNzcylcbiAgICAgICAgLmFkZENsYXNzKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0uaW1hZ2VpY29uID8gJ2ltYWdlLWljb24nIDogJycpXG4gICAgICAgIC5odG1sKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0ubmFtZSk7XG5cbiAgICAgIGxpc3QuYXBwZW5kKGJ1dHRvbik7XG4gICAgICBsaXN0LmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG4gICAgICAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLnNlcGFyYXRvcicpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgIH1cbiAgfVxuXG4gICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3Qgc3BhbicpLmVhY2goZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgIGJlYW4ub24oYnV0dG9uLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5fc2lnbkluU29jaWFsKGUudGFyZ2V0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGhpcy5fc2hvd1NpZ25JbigpO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93U2lnbkluID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gICQoKS5hZGRDbGFzcygnbW9kZS1zaWduaW4nKTtcblxuICAvLyBpZiBubyBzb2NpYWwgY29ubmVjdGlvbnMgYW5kIG9uZSBlbnRlcnByaXNlIGNvbm5lY3Rpb24gb25seSwgcmVkaXJlY3RcbiAgaWYgKCF0aGlzLl9hcmVUaGVyZUFueVNvY2lhbENvbm4oKSAmJiBcbiAgICB0aGlzLl9jbGllbnQuc3RyYXRlZ2llcy5sZW5ndGggPT09IDEgJiZcbiAgICB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1swXS5uYW1lICE9PSAnYXV0aDAnICYmXG4gICAgdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbMF0uY29ubmVjdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgXG4gICAgdGhpcy5fYXV0aDAubG9naW4oe1xuICAgICAgY29ubmVjdGlvbjogdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbMF0uY29ubmVjdGlvbnNbMF0ubmFtZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gbGFiZWxzIHRleHRcbiAgdmFyIG9wdGlvbnMgPSB4dGVuZCh0aGlzLl9zaWduaW5PcHRpb25zLCB0aGlzLl9zaWduaW5PcHRpb25zLnJlc291cmNlcyk7XG4gIG9wdGlvbnNbJ29uZXN0ZXAnXSA9IHR5cGVvZiBvcHRpb25zWydvbmVzdGVwJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snb25lc3RlcCddIDogZmFsc2U7XG4gIG9wdGlvbnNbJ3RvcCddID0gb3B0aW9uc1sndG9wJ10gfHwgZmFsc2U7XG4gIG9wdGlvbnNbJ3RpdGxlJ10gPSBvcHRpb25zWyd0aXRsZSddIHx8ICdTaWduIEluJztcbiAgb3B0aW9uc1snYWxsQnV0dG9uVGVtcGxhdGUnXSA9IG9wdGlvbnNbJ2FsbEJ1dHRvblRlbXBsYXRlJ10gfHwgXCJTaG93IGFsbFwiO1xuICBvcHRpb25zWydzdHJhdGVneUVtYWlsRW1wdHknXSA9IG9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxFbXB0eSddIHx8IFwiVGhlIGVtYWlsIGlzIGVtcHR5LlwiO1xuICBvcHRpb25zWydzdHJhdGVneUVtYWlsSW52YWxpZCddID0gb3B0aW9uc1snc3RyYXRlZ3lFbWFpbEludmFsaWQnXSB8fCBcIlRoZSBlbWFpbCBpcyBpbnZhbGlkLlwiO1xuICBvcHRpb25zWydzdHJhdGVneURvbWFpbkludmFsaWQnXSA9IG9wdGlvbnNbJ3N0cmF0ZWd5RG9tYWluSW52YWxpZCddIHx8IFwiVGhlIGRvbWFpbiB7ZG9tYWlufSBoYXMgbm90IGJlZW4gc2V0dXAuXCI7XG5cbiAgb3B0aW9uc1snaWNvbiddID0gb3B0aW9uc1snaWNvbiddIHx8IFwiaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2Fzc2V0cy5hdXRoMC5jb20vdzIvaW1nL2xvZ28tMzIucG5nXCI7XG4gIG9wdGlvbnNbJ3Nob3dJY29uJ10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd0ljb24nXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93SWNvbiddIDogZmFsc2U7XG4gIG9wdGlvbnNbJ3Nob3dTaWdudXAnXSA9IHR5cGVvZiBvcHRpb25zWydzaG93U2lnbnVwJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2hvd1NpZ251cCddIDogdHJ1ZTtcbiAgb3B0aW9uc1snc2hvd0ZvcmdvdCddID0gdHlwZW9mIG9wdGlvbnNbJ3Nob3dGb3Jnb3QnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93Rm9yZ290J10gOiB0cnVlO1xuICBvcHRpb25zWydzaWdudXBUZXh0J10gPSBvcHRpb25zWydzaWdudXBUZXh0J10gfHwgJ1NpZ24gVXAnO1xuICBvcHRpb25zWydmb3Jnb3RUZXh0J10gPSBvcHRpb25zWydmb3Jnb3RUZXh0J10gfHwgJ0ZvcmdvdCB5b3VyIHBhc3N3b3JkPyc7XG4gIG9wdGlvbnNbJ3NpZ25JbkJ1dHRvblRleHQnXSA9IG9wdGlvbnNbJ3NpZ25JbkJ1dHRvblRleHQnXSB8fCAnU2lnbiBJbic7XG4gIG9wdGlvbnNbJ2VtYWlsUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ2VtYWlsUGxhY2Vob2xkZXInXSB8fCAnRW1haWwnO1xuICBvcHRpb25zWydwYXNzd29yZFBsYWNlaG9sZGVyJ10gPSBvcHRpb25zWydwYXNzd29yZFBsYWNlaG9sZGVyJ10gfHwgJ1Bhc3N3b3JkJztcbiAgb3B0aW9uc1snc2VwYXJhdG9yVGV4dCddID0gb3B0aW9uc1snc2VwYXJhdG9yVGV4dCddIHx8ICdvcic7XG4gIG9wdGlvbnNbJ3NlcnZlckVycm9yVGV4dCddID0gb3B0aW9uc1snc2VydmVyRXJyb3JUZXh0J10gfHwgJ1RoZXJlIHdhcyBhbiBlcnJvciBwcm9jZXNzaW5nIHRoZSBzaWduIGluLic7XG4gIG9wdGlvbnNbJ3Nob3dFbWFpbCddID0gdHlwZW9mIG9wdGlvbnNbJ3Nob3dFbWFpbCddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3Nob3dFbWFpbCddIDogdHJ1ZTtcbiAgb3B0aW9uc1snc2hvd1Bhc3N3b3JkJ10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd1Bhc3N3b3JkJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2hvd1Bhc3N3b3JkJ10gOiB0cnVlO1xuICBvcHRpb25zWydzb2NpYWxCaWdCdXR0b25zJ10gPSB0eXBlb2Ygb3B0aW9uc1snc29jaWFsQmlnQnV0dG9ucyddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3NvY2lhbEJpZ0J1dHRvbnMnXSA6ICF0aGlzLl9hcmVUaGVyZUFueUVudGVycHJpc2VPckRiQ29ubigpO1xuICBvcHRpb25zWydlbmFibGVSZXR1cm5Vc2VyRXhwZXJpZW5jZSddID0gdHlwZW9mIG9wdGlvbnNbJ2VuYWJsZVJldHVyblVzZXJFeHBlcmllbmNlJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snZW5hYmxlUmV0dXJuVXNlckV4cGVyaWVuY2UnXSA6IHRydWU7XG4gIG9wdGlvbnNbJ3JldHVyblVzZXJMYWJlbCddID0gb3B0aW9uc1sncmV0dXJuVXNlckxhYmVsJ10gfHwgJ0xhc3QgdGltZSB5b3Ugc2lnbmVkIGluIHVzaW5nLi4uJztcbiAgb3B0aW9uc1snd3JvbmdFbWFpbFBhc3N3b3JkRXJyb3JUZXh0J10gPSBvcHRpb25zWyd3cm9uZ0VtYWlsUGFzc3dvcmRFcnJvclRleHQnXSB8fCAnV3JvbmcgZW1haWwgb3IgcGFzc3dvcmQuJztcblxuICAvLyBzaWdudXBcbiAgb3B0aW9uc1snc2lnbnVwVGl0bGUnXSA9IG9wdGlvbnNbJ3NpZ251cFRpdGxlJ10gfHwgJ1NpZ24gVXAnO1xuICBvcHRpb25zWydzaWdudXBCdXR0b25UZXh0J10gPSBvcHRpb25zWydzaWdudXBCdXR0b25UZXh0J10gfHwgJ1NpZ24gVXAnO1xuICBvcHRpb25zWydzaWdudXBFbWFpbFBsYWNlaG9sZGVyJ10gPSBvcHRpb25zWydzaWdudXBFbWFpbFBsYWNlaG9sZGVyJ10gfHwgJ0VtYWlsJztcbiAgb3B0aW9uc1snc2lnbnVwUGFzc3dvcmRQbGFjZWhvbGRlciddID0gb3B0aW9uc1snc2lnbnVwUGFzc3dvcmRQbGFjZWhvbGRlciddIHx8ICdDcmVhdGUgYSBQYXNzd29yZCc7XG4gIG9wdGlvbnNbJ3NpZ251cENhbmNlbEJ1dHRvblRleHQnXSA9IG9wdGlvbnNbJ3NpZ251cENhbmNlbEJ1dHRvblRleHQnXSB8fCAnQ2FuY2VsJztcbiAgb3B0aW9uc1snc2lnbnVwSGVhZGVyVGV4dCddID0gdHlwZW9mIG9wdGlvbnNbJ3NpZ251cEhlYWRlclRleHQnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaWdudXBIZWFkZXJUZXh0J10gOiAnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkJztcbiAgb3B0aW9uc1snc2lnbnVwRm9vdGVyVGV4dCddID0gdHlwZW9mIG9wdGlvbnNbJ3NpZ251cEZvb3RlclRleHQnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaWdudXBGb290ZXJUZXh0J10gOiAnQnkgY2xpY2tpbmcgXCJTaWduIFVwXCIsIHlvdSBhZ3JlZSB0byBvdXIgdGVybXMgb2Ygc2VydmljZSBhbmQgcHJpdmFjeSBwb2xpY3kuJztcbiAgb3B0aW9uc1snc2lnbnVwRW50ZXJwcmlzZUVtYWlsV2FybmluZ1RleHQnXSA9IG9wdGlvbnNbJ3NpZ251cEVudGVycHJpc2VFbWFpbFdhcm5pbmdUZXh0J10gfHwgJ1RoaXMgZG9tYWluIHtkb21haW59IGhhcyBiZWVuIGNvbmZpZ3VyZWQgZm9yIFNpbmdsZSBTaWduIE9uIGFuZCB5b3UgY2FuXFwndCBjcmVhdGUgYW4gYWNjb3VudC4gVHJ5IHNpZ25pbmcgaW4gaW5zdGVhZC4nO1xuICBvcHRpb25zWydzaWdudXBTZXJ2ZXJFcnJvclRleHQnXSA9IG9wdGlvbnNbJ3NpZ251cFNlcnZlckVycm9yVGV4dCddIHx8ICdUaGVyZSB3YXMgYW4gZXJyb3IgcHJvY2Vzc2luZyB0aGUgc2lnbiB1cC4nO1xuXG4gIC8vIHJlc2V0XG4gIG9wdGlvbnNbJ3Jlc2V0VGl0bGUnXSA9IG9wdGlvbnNbJ3Jlc2V0VGl0bGUnXSB8fCAnUmVzZXQgUGFzc3dvcmQnO1xuICBvcHRpb25zWydyZXNldEJ1dHRvblRleHQnXSA9IG9wdGlvbnNbJ3Jlc2V0QnV0dG9uVGV4dCddIHx8ICdTZW5kJztcbiAgb3B0aW9uc1sncmVzZXRFbWFpbFBsYWNlaG9sZGVyJ10gPSBvcHRpb25zWydyZXNldEVtYWlsUGxhY2Vob2xkZXInXSB8fCAnRW1haWwnO1xuICBvcHRpb25zWydyZXNldFBhc3N3b3JkUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ3Jlc2V0UGFzc3dvcmRQbGFjZWhvbGRlciddIHx8ICdOZXcgUGFzc3dvcmQnO1xuICBvcHRpb25zWydyZXNldFJlcGVhdFBhc3N3b3JkUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ3Jlc2V0UmVwZWF0UGFzc3dvcmRQbGFjZWhvbGRlciddIHx8ICdDb25maXJtIE5ldyBQYXNzd29yZCc7XG4gIG9wdGlvbnNbJ3Jlc2V0Q2FuY2VsQnV0dG9uVGV4dCddID0gb3B0aW9uc1sncmVzZXRDYW5jZWxCdXR0b25UZXh0J10gfHwgJ0NhbmNlbCc7XG4gIG9wdGlvbnNbJ3Jlc2V0U3VjY2Vzc1RleHQnXSA9IG9wdGlvbnNbJ3Jlc2V0U3VjY2Vzc1RleHQnXSB8fCAnV2VcXCd2ZSBqdXN0IHNlbnQgeW91IGFuIGVtYWlsIHRvIHJlc2V0IHlvdXIgcGFzc3dvcmQuJztcbiAgb3B0aW9uc1sncmVzZXRFbnRlclNhbWVQYXNzd29yZFRleHQnXSA9IG9wdGlvbnNbJ3Jlc2V0RW50ZXJTYW1lUGFzc3dvcmRUZXh0J10gfHwgJ1BsZWFzZSBlbnRlciB0aGUgc2FtZSBwYXNzd29yZC4nO1xuICBvcHRpb25zWydyZXNldEhlYWRlclRleHQnXSA9IHR5cGVvZiBvcHRpb25zWydyZXNldEhlYWRlclRleHQnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydyZXNldEhlYWRlclRleHQnXSA6ICdQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCBhbmQgdGhlIG5ldyBwYXNzd29yZC4gV2Ugd2lsbCBzZW5kIHlvdSBhbiBlbWFpbCB0byBjb25maXJtIHRoZSBwYXNzd29yZCBjaGFuZ2UuJztcbiAgb3B0aW9uc1sncmVzZXRTZXJ2ZXJFcnJvclRleHQnXSA9IG9wdGlvbnNbJ3Jlc2V0U2VydmVyRXJyb3JUZXh0J10gfHwgJ1RoZXJlIHdhcyBhbiBlcnJvciBwcm9jZXNzaW5nIHRoZSByZXNldCBwYXNzd29yZC4nO1xuXG4gIHRoaXMuX3NpZ25pbk9wdGlvbnMgPSBvcHRpb25zO1xuXG4gIC8vIHRoZW1lXG4gIGlmIChvcHRpb25zLnRoZW1lKSB7XG4gICAgJCgpLmFkZENsYXNzKCd0aGVtZS0nICsgb3B0aW9ucy50aGVtZSk7XG4gIH1cblxuICAkKCcucGFuZWwgYS5jbG9zZScpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc3RhbmRhbG9uZSA/ICdub25lJyA6ICdibG9jaycpO1xuXG4gIC8vIHNob3cgaWNvblxuICBpZiAob3B0aW9ucy5zaG93SWNvbikge1xuICAgICQoJy5wYW5lbCAuaW1hZ2UgaW1nJykuYXR0cignc3JjJywgb3B0aW9ucy5pY29uKTtcbiAgICAkKCcucGFuZWwgLmltYWdlJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93SWNvbiA/ICdibG9jaycgOiAnbm9uZScpO1xuICB9XG5cbiAgLy8gc2hvdyBzaWdudXAvZm9yZ290IGxpbmtzXG4gIHZhciBhdXRoMENvbm4gPSB0aGlzLl9nZXRBdXRoMENvbm5lY3Rpb24oKTtcbiAgaWYgKGF1dGgwQ29ubikge1xuICAgIG9wdGlvbnMuc2hvd1NpZ251cCA9IGF1dGgwQ29ubi5zaG93U2lnbnVwO1xuICAgIG9wdGlvbnMuc2hvd0ZvcmdvdCA9IGF1dGgwQ29ubi5zaG93Rm9yZ290O1xuICB9XG4gIFxuICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5zaWduLXVwJylcbiAgICAuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93U2lnbnVwID8gJycgOiAnbm9uZScpXG4gICAgLmh0bWwob3B0aW9ucy5zaWdudXBUZXh0KTtcblxuICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5mb3Jnb3QtcGFzcycpXG4gICAgLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0ZvcmdvdCA/ICcnIDogJ25vbmUnKVxuICAgIC5odG1sKG9wdGlvbnMuZm9yZ290VGV4dCk7XG5cbiAgaWYgKG9wdGlvbnMuc2lnbnVwTGluaykge1xuICAgICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLnNpZ24tdXAnKVxuICAgICAgLmF0dHIoJ2hyZWYnLCBvcHRpb25zLnNpZ251cExpbmspXG4gICAgICAuYXR0cigndGFyZ2V0JywgJ19wYXJlbnQnKTtcbiAgfSBcbiAgZWxzZSB7XG4gICAgYmVhbi5vbigkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5zaWduLXVwJylbMF0sICdjbGljaycsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3Nob3dTaWduVXBFeHBlcmllbmNlKGUpOyB9KTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmZvcmdvdExpbmspIHtcbiAgICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5mb3Jnb3QtcGFzcycpXG4gICAgICAuYXR0cignaHJlZicsIG9wdGlvbnMuZm9yZ290TGluaylcbiAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX3BhcmVudCcpO1xuICB9IFxuICBlbHNlIHtcbiAgICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5mb3Jnb3QtcGFzcycpLmVhY2goZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgIGJlYW4ub24oZWxlbSwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2hvd1Jlc2V0RXhwZXJpZW5jZShlKTsgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBoaWRlIGRpdmlkZXIgZG90IGlmIHRoZXJlIGFyZSBvbmUgb2YgdHdvXG4gICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLmRpdmlkZXInKVxuICAgIC5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBvcHRpb25zLnNob3dTaWdudXAgJiYgb3B0aW9ucy5zaG93Rm9yZ290ID8gJycgOiAnbm9uZScpO1xuXG4gICQoJ2Rpdi5wYW5lbCBpbnB1dCcpLmVhY2goZnVuY3Rpb24gKGUpIHsgZS52YWx1ZSA9ICcnOyB9KTtcblxuICAvLyBwbGFjZWhvbGRlcnMgYW5kIGJ1dHRvbnNcbiAgJCgnLnBhbmVsIC56b2NpYWwucHJpbWFyeScpLmh0bWwob3B0aW9ucy5zaWduSW5CdXR0b25UZXh0KTtcbiAgJCgnLnBhbmVsIC5lbWFpbCBpbnB1dCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5lbWFpbFBsYWNlaG9sZGVyKTtcbiAgJCgnLnBhbmVsIC5wYXNzd29yZCBpbnB1dCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5wYXNzd29yZFBsYWNlaG9sZGVyKTtcbiAgJCgnLnBhbmVsIC5zZXBhcmF0b3Igc3BhbicpLmh0bWwob3B0aW9ucy5zZXBhcmF0b3JUZXh0KTtcblxuICAvLyBzaWdudXBcbiAgJCgnLnBhbmVsIC5zaWdudXAgLnpvY2lhbC5wcmltYXJ5JykuaHRtbChvcHRpb25zLnNpZ251cEJ1dHRvblRleHQpO1xuXG4gICQoJy5wYW5lbCAuc2lnbnVwIC5lbWFpbCBpbnB1dCcpLmVhY2goZnVuY3Rpb24gKGkpIHsgXG4gICAgICBpLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCBvcHRpb25zLnNpZ251cEVtYWlsUGxhY2Vob2xkZXIpO1xuICAgICAgYmVhbi5vbihpLCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHt9O1xuICAgICAgICBpZiAoc2VsZi5faXNFbnRlcnByaXNlQ29ubmVjdGlvbih0aGlzLnZhbHVlLCBvdXRwdXQpKSB7XG4gICAgICAgICAgdmFyIHdhcm5pbmdUZXh0ID0gb3B0aW9ucy5zaWdudXBFbnRlcnByaXNlRW1haWxXYXJuaW5nVGV4dC5yZXBsYWNlKC97ZG9tYWlufS9nLCBvdXRwdXQuZG9tYWluKTtcbiAgICAgICAgICB0aGlzLnNldEN1c3RvbVZhbGlkaXR5KHdhcm5pbmdUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEN1c3RvbVZhbGlkaXR5KCcnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH0pO1xuXG4gICQoJy5wYW5lbCAuc2lnbnVwIC5wYXNzd29yZCBpbnB1dCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5zaWdudXBQYXNzd29yZFBsYWNlaG9sZGVyKTtcblxuICAkKCcucGFuZWwgLnNpZ251cCAub3B0aW9ucyAuY2FuY2VsJykuaHRtbChvcHRpb25zWydzaWdudXBDYW5jZWxCdXR0b25UZXh0J10pO1xuICBiZWFuLm9uKCQoJy5wYW5lbCAuc2lnbnVwIC5vcHRpb25zIC5jYW5jZWwnKVswXSwgJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyBzZWxmLl9zZXRMb2dpblZpZXcoKTsgfSk7XG5cbiAgJCgnLnBhbmVsIC5zaWdudXAgLmhlYWRlcicpXG4gICAgLmh0bWwob3B0aW9ucy5zaWdudXBIZWFkZXJUZXh0KVxuICAgIC5hdHRyKCdkaXNwbGF5Jywgb3B0aW9ucy5zaWdudXBIZWFkZXJUZXh0ID8gJycgOiAnbm9uZScpO1xuXG4gICQoJy5wYW5lbCAuc2lnbnVwIC5mb290ZXInKVxuICAgIC5odG1sKG9wdGlvbnMuc2lnbnVwRm9vdGVyVGV4dClcbiAgICAuYXR0cignZGlzcGxheScsIG9wdGlvbnMuc2lnbnVwRm9vdGVyVGV4dCA/ICcnIDogJ25vbmUnKTtcblxuICAvLyByZXNldFxuICAkKCcucGFuZWwgLnJlc2V0IC56b2NpYWwucHJpbWFyeScpLmh0bWwob3B0aW9ucy5yZXNldEJ1dHRvblRleHQpO1xuICAkKCcucGFuZWwgLnJlc2V0IC5lbWFpbCBpbnB1dCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5yZXNldEVtYWlsUGxhY2Vob2xkZXIpO1xuICAkKCcucGFuZWwgLnJlc2V0IC5wYXNzd29yZCBpbnB1dCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5yZXNldFBhc3N3b3JkUGxhY2Vob2xkZXIpO1xuXG4gICQoJy5wYW5lbCAucmVzZXQgLnJlcGVhdFBhc3N3b3JkIGlucHV0JykuZWFjaChmdW5jdGlvbiAoaSkgeyBcbiAgICAgIGkuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIG9wdGlvbnMucmVzZXRSZXBlYXRQYXNzd29yZFBsYWNlaG9sZGVyKTtcbiAgICAgIGJlYW4ub24oaSwgJ2lucHV0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKCcucGFuZWwgLnJlc2V0IC5wYXNzd29yZCBpbnB1dCcpLnZhbCgpICE9IHRoaXMudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnNldEN1c3RvbVZhbGlkaXR5KG9wdGlvbnMucmVzZXRFbnRlclNhbWVQYXNzd29yZFRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkoJycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfSk7XG5cbiAgJCgnLnBhbmVsIC5yZXNldCAub3B0aW9ucyAuY2FuY2VsJykuaHRtbChvcHRpb25zLnJlc2V0Q2FuY2VsQnV0dG9uVGV4dCk7XG4gIGJlYW4ub24oJCgnLnBhbmVsIC5yZXNldCAub3B0aW9ucyAuY2FuY2VsJylbMF0sICdjbGljaycsIGZ1bmN0aW9uICgpIHsgc2VsZi5fc2V0TG9naW5WaWV3KCk7IH0pO1xuXG4gICQoJy5wYW5lbCAucmVzZXQgLmhlYWRlcicpXG4gICAgLmh0bWwob3B0aW9ucy5yZXNldEhlYWRlclRleHQpXG4gICAgLmF0dHIoJ2Rpc3BsYXknLCBvcHRpb25zLnJlc2V0SGVhZGVyVGV4dCA/ICcnIDogJ25vbmUnKTtcblxuICAvLyBzaG93IGVtYWlsLCBwYXNzd29yZCwgc2VwYXJhdG9yIGFuZCBidXR0b24gaWYgdGhlcmUgYXJlIGVudGVycHJpc2UvZGIgY29ubmVjdGlvbnNcbiAgdmFyIGFueUVudGVycHJpc2VPckRiQ29ubmVjdGlvbiA9IHRoaXMuX2FyZVRoZXJlQW55RW50ZXJwcmlzZU9yRGJDb25uKCk7XG4gIHZhciBhbnlTb2NpYWxDb25uZWN0aW9uID0gdGhpcy5fYXJlVGhlcmVBbnlTb2NpYWxDb25uKCk7XG5cbiAgJCgnLnBhbmVsIC5lbWFpbCBpbnB1dCcpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIGFueUVudGVycHJpc2VPckRiQ29ubmVjdGlvbiA/ICcnIDogJ25vbmUnKTtcbiAgJCgnLnBhbmVsIC56b2NpYWwucHJpbWFyeScpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIGFueUVudGVycHJpc2VPckRiQ29ubmVjdGlvbiA/ICcnIDogJ25vbmUnKTtcbiAgJCgnLnBhbmVsIC5wYXNzd29yZCBpbnB1dCcpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIG9wdGlvbnMuc2hvd1Bhc3N3b3JkICYmIGFueUVudGVycHJpc2VPckRiQ29ubmVjdGlvbiA/ICcnIDogJ25vbmUnKTtcbiAgJCgnLnBhbmVsIC5jcmVhdGUtYWNjb3VudCAuZm9yZ290LXBhc3MnKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBvcHRpb25zLnNob3dGb3Jnb3QgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5zaWduLXVwJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgb3B0aW9ucy5zaG93U2lnbnVwICYmIGFueUVudGVycHJpc2VPckRiQ29ubmVjdGlvbiA/ICcnIDogJ25vbmUnKTtcbiAgJCgnLnBhbmVsIC5zZXBhcmF0b3InKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gJiYgYW55U29jaWFsQ29ubmVjdGlvbiA/ICcnIDogJ25vbmUnKTtcbiAgJCgnLnBhbmVsIC5sYXN0LXRpbWUnKS5odG1sKG9wdGlvbnMucmV0dXJuVXNlckxhYmVsKTtcblxuICAvLyBhY3RpdmF0ZSBwYW5lbFxuICAkKCdkaXYucGFuZWwnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICQoJ2Rpdi5vdmVybGF5JykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAkKCdkaXYucGFuZWwub25lc3RlcCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAkKCcucG9wdXAgaDEnKS5odG1sKG9wdGlvbnMudGl0bGUpO1xuICAkKCcucG9wdXAgLmludmFsaWQnKS5yZW1vdmVDbGFzcygnaW52YWxpZCcpO1xuXG4gIC8vIGlmIHVzZXIgbG9nZ2VkIGluIHNob3cgbG9nZ2VkIGluIGV4cGVyaWVuY2VcbiAgaWYgKHRoaXMuX3Nzb0RhdGEuc3NvICYmIG9wdGlvbnNbJ2VuYWJsZVJldHVyblVzZXJFeHBlcmllbmNlJ10pIHtcbiAgICB0aGlzLl9zaG93TG9nZ2VkSW5FeHBlcmllbmNlKCk7XG4gIH1cblxuICBpZiAob3B0aW9uc1snc29jaWFsQmlnQnV0dG9ucyddKSB7XG4gICAgJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5pY29ubGlzdCBzcGFuJykucmVtb3ZlQ2xhc3MoJ2ljb24nKS5hZGRDbGFzcygnYmxvY2snKTtcbiAgfSBlbHNlIHtcbiAgICAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLmljb25saXN0IHNwYW4nKS5hZGRDbGFzcygnaWNvbicpLnJlbW92ZUNsYXNzKCdibG9jaycpO1xuICB9XG5cbiAgJCgnZGl2LnBhbmVsLm9uZXN0ZXAgaDEnKS5odG1sKG9wdGlvbnNbJ3RpdGxlJ10pO1xuXG4gIC8vIFRPRE86IHN1cHBvcnQgX3NpZ25pbk9wdGlvbnMuY29udGFpbmVyXG5cbiAgaWYgKHRoaXMuX3Nzb0RhdGEuc3NvICYmIHRoaXMuX3Nzb0RhdGEubGFzdFVzZWRVc2VybmFtZSkge1xuICAgICQoJ2Rpdi5wYW5lbC5vbmVzdGVwIGlucHV0JykudmFsKHRoaXMuX3Nzb0RhdGEubGFzdFVzZWRVc2VybmFtZSk7XG4gICAgdGhpcy5fc2hvd09ySGlkZVBhc3N3b3JkKCk7XG4gIH1cblxuICB0aGlzLl9zZXRUb3Aob3B0aW9ucy50b3AsICQoJ2Rpdi5wYW5lbC5vbmVzdGVwJykpO1xuICB0aGlzLl9zZXRMb2dpblZpZXcoeyBpc1JldHVybmluZ1VzZXI6IHRoaXMuX3Nzb0RhdGEuc3NvIH0pO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9nZXRDb25maWd1cmVkU3RyYXRlZ2llcyA9IGZ1bmN0aW9uIChjb25ucykge1xuICB2YXIgc3RyYXRlZ2llcyA9IFtdO1xuICBmb3IgKHZhciBjb25uIGluIGNvbm5zKSB7XG4gICAgaWYgKHR5cGVvZihjb25uc1tjb25uXS5zdGF0dXMpICE9PSAndW5kZWZpbmVkJyAmJiAhY29ubnNbY29ubl0uc3RhdHVzKSBjb250aW51ZTtcblxuICAgIHZhciBzdHJhdGVneSA9IHN0cmF0ZWdpZXMuZmlsdGVyKGZ1bmN0aW9uIChzKSB7IFxuICAgICAgcmV0dXJuIHMubmFtZSA9PT0gY29ubnNbY29ubl0uc3RyYXRlZ3k7IFxuICAgIH0pWzBdO1xuXG4gICAgaWYgKCFzdHJhdGVneSkge1xuICAgICAgc3RyYXRlZ3kgPSB7XG4gICAgICAgIG5hbWU6IGNvbm5zW2Nvbm5dLnN0cmF0ZWd5LFxuICAgICAgICBjb25uZWN0aW9uczogW11cbiAgICAgIH07XG5cbiAgICAgIHN0cmF0ZWdpZXMucHVzaChzdHJhdGVneSk7XG4gICAgfVxuXG4gICAgdmFyIGNvbm5EYXRhID0ge1xuICAgICAgbmFtZTogY29ubnNbY29ubl0ubmFtZSxcbiAgICAgIGRvbWFpbjogY29ubnNbY29ubl0uZG9tYWluLFxuICAgICAgc2hvd1NpZ251cDogY29ubnNbY29ubl0uc2hvd1NpZ251cCxcbiAgICAgIHNob3dGb3Jnb3Q6IGNvbm5zW2Nvbm5dLnNob3dGb3Jnb3RcbiAgICB9O1xuXG4gICAgc3RyYXRlZ3kuY29ubmVjdGlvbnMucHVzaChjb25uRGF0YSk7XG4gIH1cblxuICByZXR1cm4gc3RyYXRlZ2llcztcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5nZXRDbGllbnQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9hdXRoMDtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKHNpZ25pbk9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygc2lnbmluT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gc2lnbmluT3B0aW9ucztcbiAgICBzaWduaW5PcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX3NpZ25pbk9wdGlvbnMgPSB4dGVuZCh0aGlzLl9vcHRpb25zLCBzaWduaW5PcHRpb25zKTtcbiAgdGhpcy5fYXV0aDBTdHJhdGVnaWVzID0gW107XG5cbiAgLy8gVE9ETzogc2V0IGF1dGgwIGNvbm5lY3Rpb24gcGFyYW1ldGVyc1xuICB0aGlzLl9hdXRoMENvbm5lY3Rpb25QYXJhbXMgPSBudWxsO1xuXG4gIC8vIGdldCBjb25maWd1cmVkIHN0cmF0ZWdpZXMvY29ubmVjdGlvbnNcbiAgdGhpcy5fYXV0aDAuZ2V0Q29ubmVjdGlvbnMoZnVuY3Rpb24gKGVyciwgY29ubmVjdGlvbnMpIHtcbiAgICB2YXIgYWxsb3dlZENvbm5lY3Rpb25zID0gW107XG5cbiAgICAvLyB1c2Ugb25seSBzcGVjaWZpZWQgY29ubmVjdGlvbnNcbiAgICBpZiAoc2VsZi5fc2lnbmluT3B0aW9ucy5jb25uZWN0aW9ucykge1xuICAgICAgZm9yICh2YXIgaSBpbiBjb25uZWN0aW9ucykge1xuICAgICAgICBpZiAoc2VsZi5fc2lnbmluT3B0aW9ucy5jb25uZWN0aW9ucy5pbmRleE9mKGNvbm5lY3Rpb25zW2ldLm5hbWUpID4gLTEpIHtcbiAgICAgICAgICBhbGxvd2VkQ29ubmVjdGlvbnMucHVzaChjb25uZWN0aW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBhbGxvd2VkQ29ubmVjdGlvbnMgPSBjb25uZWN0aW9ucztcbiAgICB9XG5cbiAgICBzZWxmLl9jbGllbnQgPSB7XG4gICAgICBzdHJhdGVnaWVzOiBzZWxmLl9nZXRDb25maWd1cmVkU3RyYXRlZ2llcyhhbGxvd2VkQ29ubmVjdGlvbnMpXG4gICAgfTtcblxuICAgIC8vIGdldCBTU08gZGF0YVxuICAgIHNlbGYuX2F1dGgwLmdldFNTT0RhdGEoZnVuY3Rpb24gKGVyciwgc3NvRGF0YSkge1xuICAgICAgc2VsZi5fc3NvRGF0YSA9IHNzb0RhdGE7XG4gICAgICBcbiAgICAgIC8vIHJlbW92ZSB3aWRnZXQgY29udGFpbmVyIChpZiBleGlzdClcbiAgICAgICQoKS5wYXJlbnQoKS5yZW1vdmUoKTtcblxuICAgICAgLy8gd2lkZ2V0IGNvbnRhaW5lclxuICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmlubmVySFRNTCA9IG1haW5UbXBsKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICBcbiAgICAgIHNlbGYuX2luaXRpYWxpemUoKTtcblxuICAgICAgaWYgKGNhbGxiYWNrICYmIHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwV2lkZ2V0O1xuIiwiLy8gaW5kZXhPZlxuaWYgKCFBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIChzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXggKi8gKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIG4sIGssIHQgPSBPYmplY3QodGhpcyksXG4gICAgICAgIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xuXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBuID0gMDtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIG4gPSBOdW1iZXIoYXJndW1lbnRzWzFdKTtcbiAgICAgIGlmIChuICE9IG4pIHsgLy8gc2hvcnRjdXQgZm9yIHZlcmlmeWluZyBpZiBpdCdzIE5hTlxuICAgICAgICBuID0gMDtcbiAgICAgIH0gZWxzZSBpZiAobiAhPSAwICYmIG4gIT0gSW5maW5pdHkgJiYgbiAhPSAtSW5maW5pdHkpIHtcbiAgICAgICAgbiA9IChuID4gMCB8fCAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKG4pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG4gPj0gbGVuKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGZvciAoayA9IG4gPj0gMCA/IG4gOiBNYXRoLm1heChsZW4gLSBNYXRoLmFicyhuKSwgMCk7IGsgPCBsZW47IGsrKykge1xuICAgICAgaWYgKGsgaW4gdCAmJiB0W2tdID09PSBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH07XG59XG5cbi8vIGZpbHRlclxuaWYgKCFBcnJheS5wcm90b3R5cGUuZmlsdGVyKSB7XG4gIEFycmF5LnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmdW4gLyosIHRoaXNwKi8pIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBpZiAoIXRoaXMpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB2YXIgb2JqZWN0cyA9IE9iamVjdCh0aGlzKTtcbiAgICB2YXIgbGVuID0gb2JqZWN0cy5sZW5ndGggPj4+IDA7XG4gICAgaWYgKHR5cGVvZiBmdW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzID0gW107XG4gICAgdmFyIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuICAgIGZvciAodmFyIGkgaW4gb2JqZWN0cykge1xuICAgICAgaWYgKG9iamVjdHMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgaWYgKGZ1bi5jYWxsKHRoaXNwLCBvYmplY3RzW2ldLCBpLCBvYmplY3RzKSkge1xuICAgICAgICAgIHJlcy5wdXNoKG9iamVjdHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfTtcbn1cbiIsIi8qIFBsYWNlaG9sZGVycy5qcyB2My4wLjAgKi9cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vIENyb3NzLWJyb3dzZXIgRE9NIGV2ZW50IGJpbmRpbmdcbiAgICBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKGVsZW0sIGV2ZW50LCBmbikge1xuICAgICAgICBpZiAoZWxlbS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmbiwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS5hdHRhY2hFdmVudChcIm9uXCIgKyBldmVudCwgZm4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgd2hldGhlciBhbiBpdGVtIGlzIGluIGFuIGFycmF5ICh3ZSBkb24ndCB1c2UgQXJyYXkucHJvdG90eXBlLmluZGV4T2Ygc28gd2UgZG9uJ3QgY2xvYmJlciBhbnkgZXhpc3RpbmcgcG9seWZpbGxzIC0gdGhpcyBpcyBhIHJlYWxseSBzaW1wbGUgYWx0ZXJuYXRpdmUpXG4gICAgZnVuY3Rpb24gaW5BcnJheShhcnIsIGl0ZW0pIHtcbiAgICAgICAgdmFyIGksIGxlbjtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYXJyW2ldID09PSBpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIE1vdmUgdGhlIGNhcmV0IHRvIHRoZSBpbmRleCBwb3NpdGlvbiBzcGVjaWZpZWQuIEFzc3VtZXMgdGhhdCB0aGUgZWxlbWVudCBoYXMgZm9jdXNcbiAgICBmdW5jdGlvbiBtb3ZlQ2FyZXQoZWxlbSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIHJhbmdlO1xuICAgICAgICBpZiAoZWxlbS5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgICAgIHJhbmdlID0gZWxlbS5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICAgIHJhbmdlLm1vdmUoXCJjaGFyYWN0ZXJcIiwgaW5kZXgpO1xuICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbS5zZWxlY3Rpb25TdGFydCkge1xuICAgICAgICAgICAgZWxlbS5mb2N1cygpO1xuICAgICAgICAgICAgZWxlbS5zZXRTZWxlY3Rpb25SYW5nZShpbmRleCwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXR0ZW1wdCB0byBjaGFuZ2UgdGhlIHR5cGUgcHJvcGVydHkgb2YgYW4gaW5wdXQgZWxlbWVudFxuICAgIGZ1bmN0aW9uIGNoYW5nZVR5cGUoZWxlbSwgdHlwZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZWxlbS50eXBlID0gdHlwZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBZb3UgY2FuJ3QgY2hhbmdlIGlucHV0IHR5cGUgaW4gSUU4IGFuZCBiZWxvd1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXhwb3NlIHB1YmxpYyBtZXRob2RzXG4gICAgZ2xvYmFsLlBsYWNlaG9sZGVycyA9IHtcbiAgICAgICAgVXRpbHM6IHtcbiAgICAgICAgICAgIGFkZEV2ZW50TGlzdGVuZXI6IGFkZEV2ZW50TGlzdGVuZXIsXG4gICAgICAgICAgICBpbkFycmF5OiBpbkFycmF5LFxuICAgICAgICAgICAgbW92ZUNhcmV0OiBtb3ZlQ2FyZXQsXG4gICAgICAgICAgICBjaGFuZ2VUeXBlOiBjaGFuZ2VUeXBlXG4gICAgICAgIH1cbiAgICB9O1xuXG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uIChnbG9iYWwpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHZhbGlkVHlwZXMgPSBbXG4gICAgICAgICAgICBcInRleHRcIixcbiAgICAgICAgICAgIFwic2VhcmNoXCIsXG4gICAgICAgICAgICBcInVybFwiLFxuICAgICAgICAgICAgXCJ0ZWxcIixcbiAgICAgICAgICAgIFwiZW1haWxcIixcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCIsXG4gICAgICAgICAgICBcInRleHRhcmVhXCJcbiAgICAgICAgXSxcblxuICAgICAgICAvLyBUaGUgbGlzdCBvZiBrZXljb2RlcyB0aGF0IGFyZSBub3QgYWxsb3dlZCB3aGVuIHRoZSBwb2x5ZmlsbCBpcyBjb25maWd1cmVkIHRvIGhpZGUtb24taW5wdXRcbiAgICAgICAgYmFkS2V5cyA9IFtcblxuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBrZXlzIGFsbCBjYXVzZSB0aGUgY2FyZXQgdG8ganVtcCB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dCB2YWx1ZVxuICAgICAgICAgICAgMjcsIC8vIEVzY2FwZVxuICAgICAgICAgICAgMzMsIC8vIFBhZ2UgdXBcbiAgICAgICAgICAgIDM0LCAvLyBQYWdlIGRvd25cbiAgICAgICAgICAgIDM1LCAvLyBFbmRcbiAgICAgICAgICAgIDM2LCAvLyBIb21lXG5cbiAgICAgICAgICAgIC8vIEFycm93IGtleXMgYWxsb3cgeW91IHRvIG1vdmUgdGhlIGNhcmV0IG1hbnVhbGx5LCB3aGljaCBzaG91bGQgYmUgcHJldmVudGVkIHdoZW4gdGhlIHBsYWNlaG9sZGVyIGlzIHZpc2libGVcbiAgICAgICAgICAgIDM3LCAvLyBMZWZ0XG4gICAgICAgICAgICAzOCwgLy8gVXBcbiAgICAgICAgICAgIDM5LCAvLyBSaWdodFxuICAgICAgICAgICAgNDAsIC8vIERvd25cblxuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBrZXlzIGFsbG93IHlvdSB0byBtb2RpZnkgdGhlIHBsYWNlaG9sZGVyIHRleHQgYnkgcmVtb3ZpbmcgY2hhcmFjdGVycywgd2hpY2ggc2hvdWxkIGJlIHByZXZlbnRlZCB3aGVuIHRoZSBwbGFjZWhvbGRlciBpcyB2aXNpYmxlXG4gICAgICAgICAgICA4LCAvLyBCYWNrc3BhY2VcbiAgICAgICAgICAgIDQ2IC8vIERlbGV0ZVxuICAgICAgICBdLFxuXG4gICAgICAgIC8vIFN0eWxpbmcgdmFyaWFibGVzXG4gICAgICAgIHBsYWNlaG9sZGVyU3R5bGVDb2xvciA9IFwiI2NjY1wiLFxuICAgICAgICBwbGFjZWhvbGRlckNsYXNzTmFtZSA9IFwicGxhY2Vob2xkZXJzanNcIixcbiAgICAgICAgY2xhc3NOYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChcIig/Ol58XFxcXHMpXCIgKyBwbGFjZWhvbGRlckNsYXNzTmFtZSArIFwiKD8hXFxcXFMpXCIpLFxuXG4gICAgICAgIC8vIFRoZXNlIHdpbGwgaG9sZCByZWZlcmVuY2VzIHRvIGFsbCBlbGVtZW50cyB0aGF0IGNhbiBiZSBhZmZlY3RlZC4gTm9kZUxpc3Qgb2JqZWN0cyBhcmUgbGl2ZSwgc28gd2Ugb25seSBuZWVkIHRvIGdldCB0aG9zZSByZWZlcmVuY2VzIG9uY2VcbiAgICAgICAgaW5wdXRzLCB0ZXh0YXJlYXMsXG5cbiAgICAgICAgLy8gVGhlIHZhcmlvdXMgZGF0YS0qIGF0dHJpYnV0ZXMgdXNlZCBieSB0aGUgcG9seWZpbGxcbiAgICAgICAgQVRUUl9DVVJSRU5UX1ZBTCA9IFwiZGF0YS1wbGFjZWhvbGRlci12YWx1ZVwiLFxuICAgICAgICBBVFRSX0FDVElWRSA9IFwiZGF0YS1wbGFjZWhvbGRlci1hY3RpdmVcIixcbiAgICAgICAgQVRUUl9JTlBVVF9UWVBFID0gXCJkYXRhLXBsYWNlaG9sZGVyLXR5cGVcIixcbiAgICAgICAgQVRUUl9GT1JNX0hBTkRMRUQgPSBcImRhdGEtcGxhY2Vob2xkZXItc3VibWl0XCIsXG4gICAgICAgIEFUVFJfRVZFTlRTX0JPVU5EID0gXCJkYXRhLXBsYWNlaG9sZGVyLWJvdW5kXCIsXG4gICAgICAgIEFUVFJfT1BUSU9OX0ZPQ1VTID0gXCJkYXRhLXBsYWNlaG9sZGVyLWZvY3VzXCIsXG4gICAgICAgIEFUVFJfT1BUSU9OX0xJVkUgPSBcImRhdGEtcGxhY2Vob2xkZXItbGl2ZVwiLFxuICAgICAgICBBVFRSX01BWExFTkdUSCA9IFwiZGF0YS1wbGFjZWhvbGRlci1tYXhsZW5ndGhcIixcblxuICAgICAgICAvLyBWYXJpb3VzIG90aGVyIHZhcmlhYmxlcyB1c2VkIHRocm91Z2hvdXQgdGhlIHJlc3Qgb2YgdGhlIHNjcmlwdFxuICAgICAgICB0ZXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLFxuICAgICAgICBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLFxuICAgICAgICByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICBQbGFjZWhvbGRlcnMgPSBnbG9iYWwuUGxhY2Vob2xkZXJzLFxuICAgICAgICBVdGlscyA9IFBsYWNlaG9sZGVycy5VdGlscyxcbiAgICAgICAgaGlkZU9uSW5wdXQsIGxpdmVVcGRhdGVzLCBrZXlkb3duVmFsLCBzdHlsZUVsZW0sIHN0eWxlUnVsZXMsIHBsYWNlaG9sZGVyLCB0aW1lciwgZm9ybSwgZWxlbSwgbGVuLCBpO1xuXG4gICAgLy8gTm8tb3AgKHVzZWQgaW4gcGxhY2Ugb2YgcHVibGljIG1ldGhvZHMgd2hlbiBuYXRpdmUgc3VwcG9ydCBpcyBkZXRlY3RlZClcbiAgICBmdW5jdGlvbiBub29wKCkge31cblxuICAgIC8vIEhpZGUgdGhlIHBsYWNlaG9sZGVyIHZhbHVlIG9uIGEgc2luZ2xlIGVsZW1lbnQuIFJldHVybnMgdHJ1ZSBpZiB0aGUgcGxhY2Vob2xkZXIgd2FzIGhpZGRlbiBhbmQgZmFsc2UgaWYgaXQgd2FzIG5vdCAoYmVjYXVzZSBpdCB3YXNuJ3QgdmlzaWJsZSBpbiB0aGUgZmlyc3QgcGxhY2UpXG4gICAgZnVuY3Rpb24gaGlkZVBsYWNlaG9sZGVyKGVsZW0sIGtleWRvd25WYWx1ZSkge1xuICAgICAgICB2YXIgdHlwZSxcbiAgICAgICAgICAgIG1heExlbmd0aCxcbiAgICAgICAgICAgIHZhbHVlQ2hhbmdlZCA9ICghIWtleWRvd25WYWx1ZSAmJiBlbGVtLnZhbHVlICE9PSBrZXlkb3duVmFsdWUpLFxuICAgICAgICAgICAgaXNQbGFjZWhvbGRlclZhbHVlID0gKGVsZW0udmFsdWUgPT09IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpKTtcblxuICAgICAgICBpZiAoKHZhbHVlQ2hhbmdlZCB8fCBpc1BsYWNlaG9sZGVyVmFsdWUpICYmIGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQUNUSVZFKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKEFUVFJfQUNUSVZFKTtcbiAgICAgICAgICAgIGVsZW0udmFsdWUgPSBlbGVtLnZhbHVlLnJlcGxhY2UoZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCksIFwiXCIpO1xuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5yZXBsYWNlKGNsYXNzTmFtZVJlZ0V4cCwgXCJcIik7XG5cbiAgICAgICAgICAgIC8vIFJlc3RvcmUgdGhlIG1heGxlbmd0aCB2YWx1ZVxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9NQVhMRU5HVEgpO1xuICAgICAgICAgICAgaWYgKG1heExlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwibWF4TGVuZ3RoXCIsIG1heExlbmd0aCk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoQVRUUl9NQVhMRU5HVEgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgcG9seWZpbGwgaGFzIGNoYW5nZWQgdGhlIHR5cGUgb2YgdGhlIGVsZW1lbnQgd2UgbmVlZCB0byBjaGFuZ2UgaXQgYmFja1xuICAgICAgICAgICAgdHlwZSA9IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfSU5QVVRfVFlQRSk7XG4gICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICAgIGVsZW0udHlwZSA9IHR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gU2hvdyB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgb24gYSBzaW5nbGUgZWxlbWVudC4gUmV0dXJucyB0cnVlIGlmIHRoZSBwbGFjZWhvbGRlciB3YXMgc2hvd24gYW5kIGZhbHNlIGlmIGl0IHdhcyBub3QgKGJlY2F1c2UgaXQgd2FzIGFscmVhZHkgdmlzaWJsZSlcbiAgICBmdW5jdGlvbiBzaG93UGxhY2Vob2xkZXIoZWxlbSkge1xuICAgICAgICB2YXIgdHlwZSxcbiAgICAgICAgICAgIG1heExlbmd0aCxcbiAgICAgICAgICAgIHZhbCA9IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpO1xuICAgICAgICBpZiAoZWxlbS52YWx1ZSA9PT0gXCJcIiAmJiB2YWwpIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfQUNUSVZFLCBcInRydWVcIik7XG4gICAgICAgICAgICBlbGVtLnZhbHVlID0gdmFsO1xuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgKz0gXCIgXCIgKyBwbGFjZWhvbGRlckNsYXNzTmFtZTtcblxuICAgICAgICAgICAgLy8gU3RvcmUgYW5kIHJlbW92ZSB0aGUgbWF4bGVuZ3RoIHZhbHVlXG4gICAgICAgICAgICBtYXhMZW5ndGggPSBlbGVtLmdldEF0dHJpYnV0ZShBVFRSX01BWExFTkdUSCk7XG4gICAgICAgICAgICBpZiAoIW1heExlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfTUFYTEVOR1RILCBlbGVtLm1heExlbmd0aCk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJtYXhMZW5ndGhcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSB0eXBlIG9mIGVsZW1lbnQgbmVlZHMgdG8gY2hhbmdlLCBjaGFuZ2UgaXQgKGUuZy4gcGFzc3dvcmQgaW5wdXRzKVxuICAgICAgICAgICAgdHlwZSA9IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfSU5QVVRfVFlQRSk7XG4gICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICAgIGVsZW0udHlwZSA9IFwidGV4dFwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtLnR5cGUgPT09IFwicGFzc3dvcmRcIikge1xuICAgICAgICAgICAgICAgIGlmIChVdGlscy5jaGFuZ2VUeXBlKGVsZW0sIFwidGV4dFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShBVFRSX0lOUFVUX1RZUEUsIFwicGFzc3dvcmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZUVsZW0obm9kZSwgY2FsbGJhY2spIHtcblxuICAgICAgICB2YXIgaGFuZGxlSW5wdXRzLCBoYW5kbGVUZXh0YXJlYXMsIGVsZW0sIGxlbiwgaTtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGFzc2VkIGluIG5vZGUgaXMgYW4gaW5wdXQvdGV4dGFyZWEgKGluIHdoaWNoIGNhc2UgaXQgY2FuJ3QgaGF2ZSBhbnkgYWZmZWN0ZWQgZGVzY2VuZGFudHMpXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3YXMgcGFzc2VkIGluLCBnZXQgYWxsIGFmZmVjdGVkIGRlc2NlbmRhbnRzLiBPdGhlcndpc2UsIGdldCBhbGwgYWZmZWN0ZWQgZWxlbWVudHMgaW4gZG9jdW1lbnRcbiAgICAgICAgICAgIGhhbmRsZUlucHV0cyA9IG5vZGUgPyBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIikgOiBpbnB1dHM7XG4gICAgICAgICAgICBoYW5kbGVUZXh0YXJlYXMgPSBub2RlID8gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRleHRhcmVhXCIpIDogdGV4dGFyZWFzO1xuXG4gICAgICAgICAgICAvLyBSdW4gdGhlIGNhbGxiYWNrIGZvciBlYWNoIGVsZW1lbnRcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGhhbmRsZUlucHV0cy5sZW5ndGggKyBoYW5kbGVUZXh0YXJlYXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gaSA8IGhhbmRsZUlucHV0cy5sZW5ndGggPyBoYW5kbGVJbnB1dHNbaV0gOiBoYW5kbGVUZXh0YXJlYXNbaSAtIGhhbmRsZUlucHV0cy5sZW5ndGhdO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVsZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFsbCBhZmZlY3RlZCBlbGVtZW50cyB0byB0aGVpciBub3JtYWwgc3RhdGUgKHJlbW92ZSBwbGFjZWhvbGRlciB2YWx1ZSBpZiBwcmVzZW50KVxuICAgIGZ1bmN0aW9uIGRpc2FibGVQbGFjZWhvbGRlcnMobm9kZSkge1xuICAgICAgICBoYW5kbGVFbGVtKG5vZGUsIGhpZGVQbGFjZWhvbGRlcik7XG4gICAgfVxuXG4gICAgLy8gU2hvdyB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgb24gYWxsIGFwcHJvcHJpYXRlIGVsZW1lbnRzXG4gICAgZnVuY3Rpb24gZW5hYmxlUGxhY2Vob2xkZXJzKG5vZGUpIHtcbiAgICAgICAgaGFuZGxlRWxlbShub2RlLCBzaG93UGxhY2Vob2xkZXIpO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgYXMgYSBmb2N1cyBldmVudCBoYW5kbGVyXG4gICAgZnVuY3Rpb24gbWFrZUZvY3VzSGFuZGxlcihlbGVtKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIE9ubHkgaGlkZSB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgaWYgdGhlIChkZWZhdWx0KSBoaWRlLW9uLWZvY3VzIGJlaGF2aW91ciBpcyBlbmFibGVkXG4gICAgICAgICAgICBpZiAoaGlkZU9uSW5wdXQgJiYgZWxlbS52YWx1ZSA9PT0gZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCkgJiYgZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9BQ1RJVkUpID09PSBcInRydWVcIikge1xuXG4gICAgICAgICAgICAgICAgLy8gTW92ZSB0aGUgY2FyZXQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBpbnB1dCAodGhpcyBtaW1pY3MgdGhlIGJlaGF2aW91ciBvZiBhbGwgYnJvd3NlcnMgdGhhdCBkbyBub3QgaGlkZSB0aGUgcGxhY2Vob2xkZXIgb24gZm9jdXMpXG4gICAgICAgICAgICAgICAgVXRpbHMubW92ZUNhcmV0KGVsZW0sIDApO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAgIGhpZGVQbGFjZWhvbGRlcihlbGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIGFzIGEgYmx1ciBldmVudCBoYW5kbGVyXG4gICAgZnVuY3Rpb24gbWFrZUJsdXJIYW5kbGVyKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNob3dQbGFjZWhvbGRlcihlbGVtKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBGdW5jdGlvbnMgdGhhdCBhcmUgdXNlZCBhcyBhIGV2ZW50IGhhbmRsZXJzIHdoZW4gdGhlIGhpZGUtb24taW5wdXQgYmVoYXZpb3VyIGhhcyBiZWVuIGFjdGl2YXRlZCAtIHZlcnkgYmFzaWMgaW1wbGVtZW50YXRpb24gb2YgdGhlIFwiaW5wdXRcIiBldmVudFxuICAgIGZ1bmN0aW9uIG1ha2VLZXlkb3duSGFuZGxlcihlbGVtKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAga2V5ZG93blZhbCA9IGVsZW0udmFsdWU7XG5cbiAgICAgICAgICAgIC8vUHJldmVudCB0aGUgdXNlIG9mIHRoZSBhcnJvdyBrZXlzICh0cnkgdG8ga2VlcCB0aGUgY3Vyc29yIGJlZm9yZSB0aGUgcGxhY2Vob2xkZXIpXG4gICAgICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9BQ1RJVkUpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgIGlmIChrZXlkb3duVmFsID09PSBlbGVtLmdldEF0dHJpYnV0ZShBVFRSX0NVUlJFTlRfVkFMKSAmJiBVdGlscy5pbkFycmF5KGJhZEtleXMsIGUua2V5Q29kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBtYWtlS2V5dXBIYW5kbGVyKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGhpZGVQbGFjZWhvbGRlcihlbGVtLCBrZXlkb3duVmFsKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgbm93IGVtcHR5IHdlIG5lZWQgdG8gc2hvdyB0aGUgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgIGlmIChlbGVtLnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZWxlbS5ibHVyKCk7XG4gICAgICAgICAgICAgICAgVXRpbHMubW92ZUNhcmV0KGVsZW0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBtYWtlQ2xpY2tIYW5kbGVyKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChlbGVtID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGVsZW0udmFsdWUgPT09IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpICYmIGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQUNUSVZFKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICBVdGlscy5tb3ZlQ2FyZXQoZWxlbSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCBhcyBhIHN1Ym1pdCBldmVudCBoYW5kbGVyIG9uIGZvcm0gZWxlbWVudHMgdGhhdCBoYXZlIGNoaWxkcmVuIGFmZmVjdGVkIGJ5IHRoaXMgcG9seWZpbGxcbiAgICBmdW5jdGlvbiBtYWtlU3VibWl0SGFuZGxlcihmb3JtKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIFR1cm4gb2ZmIHBsYWNlaG9sZGVycyBvbiBhbGwgYXBwcm9wcmlhdGUgZGVzY2VuZGFudCBlbGVtZW50c1xuICAgICAgICAgICAgZGlzYWJsZVBsYWNlaG9sZGVycyhmb3JtKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzIHRvIGFuIGVsZW1lbnQgdGhhdCB3ZSBuZWVkIHRvIGFmZmVjdCB3aXRoIHRoZSBwb2x5ZmlsbFxuICAgIGZ1bmN0aW9uIG5ld0VsZW1lbnQoZWxlbSkge1xuXG4gICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIHBhcnQgb2YgYSBmb3JtLCBtYWtlIHN1cmUgdGhlIHBsYWNlaG9sZGVyIHN0cmluZyBpcyBub3Qgc3VibWl0dGVkIGFzIGEgdmFsdWVcbiAgICAgICAgaWYgKGVsZW0uZm9ybSkge1xuICAgICAgICAgICAgZm9ybSA9IGVsZW0uZm9ybTtcblxuICAgICAgICAgICAgLy8gU2V0IGEgZmxhZyBvbiB0aGUgZm9ybSBzbyB3ZSBrbm93IGl0J3MgYmVlbiBoYW5kbGVkIChmb3JtcyBjYW4gY29udGFpbiBtdWx0aXBsZSBpbnB1dHMpXG4gICAgICAgICAgICBpZiAoIWZvcm0uZ2V0QXR0cmlidXRlKEFUVFJfRk9STV9IQU5ETEVEKSkge1xuICAgICAgICAgICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZm9ybSwgXCJzdWJtaXRcIiwgbWFrZVN1Ym1pdEhhbmRsZXIoZm9ybSkpO1xuICAgICAgICAgICAgICAgIGZvcm0uc2V0QXR0cmlidXRlKEFUVFJfRk9STV9IQU5ETEVELCBcInRydWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBlbGVtZW50IHNvIHdlIGNhbiBoaWRlL3Nob3cgdGhlIHBsYWNlaG9sZGVyIGFzIGFwcHJvcHJpYXRlXG4gICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZWxlbSwgXCJmb2N1c1wiLCBtYWtlRm9jdXNIYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgVXRpbHMuYWRkRXZlbnRMaXN0ZW5lcihlbGVtLCBcImJsdXJcIiwgbWFrZUJsdXJIYW5kbGVyKGVsZW0pKTtcblxuICAgICAgICAvLyBJZiB0aGUgcGxhY2Vob2xkZXIgc2hvdWxkIGhpZGUgb24gaW5wdXQgcmF0aGVyIHRoYW4gb24gZm9jdXMgd2UgbmVlZCBhZGRpdGlvbmFsIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIGlmIChoaWRlT25JbnB1dCkge1xuICAgICAgICAgICAgVXRpbHMuYWRkRXZlbnRMaXN0ZW5lcihlbGVtLCBcImtleWRvd25cIiwgbWFrZUtleWRvd25IYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZWxlbSwgXCJrZXl1cFwiLCBtYWtlS2V5dXBIYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZWxlbSwgXCJjbGlja1wiLCBtYWtlQ2xpY2tIYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbWVtYmVyIHRoYXQgd2UndmUgYm91bmQgZXZlbnQgaGFuZGxlcnMgdG8gdGhpcyBlbGVtZW50XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfRVZFTlRTX0JPVU5ELCBcInRydWVcIik7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwsIHBsYWNlaG9sZGVyKTtcblxuICAgICAgICAvLyBJZiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgYSB2YWx1ZSBhbmQgaXMgbm90IGZvY3Vzc2VkLCBzZXQgaXQgdG8gdGhlIHBsYWNlaG9sZGVyIHN0cmluZ1xuICAgICAgICBpZiAoaGlkZU9uSW5wdXQgfHwgZWxlbSAhPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgc2hvd1BsYWNlaG9sZGVyKGVsZW0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUGxhY2Vob2xkZXJzLm5hdGl2ZVN1cHBvcnQgPSB0ZXN0LnBsYWNlaG9sZGVyICE9PSB2b2lkIDA7XG5cbiAgICBpZiAoIVBsYWNlaG9sZGVycy5uYXRpdmVTdXBwb3J0KSB7XG5cbiAgICAgICAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gYWxsIHRoZSBpbnB1dCBhbmQgdGV4dGFyZWEgZWxlbWVudHMgY3VycmVudGx5IGluIHRoZSBET00gKGxpdmUgTm9kZUxpc3Qgb2JqZWN0cyB0byB3ZSBvbmx5IG5lZWQgdG8gZG8gdGhpcyBvbmNlKVxuICAgICAgICBpbnB1dHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpO1xuICAgICAgICB0ZXh0YXJlYXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRleHRhcmVhXCIpO1xuXG4gICAgICAgIC8vIEdldCBhbnkgc2V0dGluZ3MgZGVjbGFyZWQgYXMgZGF0YS0qIGF0dHJpYnV0ZXMgb24gdGhlIHJvb3QgZWxlbWVudCAoY3VycmVudGx5IHRoZSBvbmx5IG9wdGlvbnMgYXJlIHdoZXRoZXIgdG8gaGlkZSB0aGUgcGxhY2Vob2xkZXIgb24gZm9jdXMgb3IgaW5wdXQgYW5kIHdoZXRoZXIgdG8gYXV0by11cGRhdGUpXG4gICAgICAgIGhpZGVPbklucHV0ID0gcm9vdC5nZXRBdHRyaWJ1dGUoQVRUUl9PUFRJT05fRk9DVVMpID09PSBcImZhbHNlXCI7XG4gICAgICAgIGxpdmVVcGRhdGVzID0gcm9vdC5nZXRBdHRyaWJ1dGUoQVRUUl9PUFRJT05fTElWRSkgIT09IFwiZmFsc2VcIjtcblxuICAgICAgICAvLyBDcmVhdGUgc3R5bGUgZWxlbWVudCBmb3IgcGxhY2Vob2xkZXIgc3R5bGVzIChpbnN0ZWFkIG9mIGRpcmVjdGx5IHNldHRpbmcgc3R5bGUgcHJvcGVydGllcyBvbiBlbGVtZW50cyAtIGFsbG93cyBmb3IgYmV0dGVyIGZsZXhpYmlsaXR5IGFsb25nc2lkZSB1c2VyLWRlZmluZWQgc3R5bGVzKVxuICAgICAgICBzdHlsZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgIHN0eWxlRWxlbS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG4gICAgICAgIC8vIENyZWF0ZSBzdHlsZSBydWxlcyBhcyB0ZXh0IG5vZGVcbiAgICAgICAgc3R5bGVSdWxlcyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiLlwiICsgcGxhY2Vob2xkZXJDbGFzc05hbWUgKyBcIiB7IGNvbG9yOlwiICsgcGxhY2Vob2xkZXJTdHlsZUNvbG9yICsgXCI7IH1cIik7XG5cbiAgICAgICAgLy8gQXBwZW5kIHN0eWxlIHJ1bGVzIHRvIG5ld2x5IGNyZWF0ZWQgc3R5bGVzaGVldFxuICAgICAgICBpZiAoc3R5bGVFbGVtLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgICAgIHN0eWxlRWxlbS5zdHlsZVNoZWV0LmNzc1RleHQgPSBzdHlsZVJ1bGVzLm5vZGVWYWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0eWxlRWxlbS5hcHBlbmRDaGlsZChzdHlsZVJ1bGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFByZXBlbmQgbmV3IHN0eWxlIGVsZW1lbnQgdG8gdGhlIGhlYWQgKGJlZm9yZSBhbnkgZXhpc3Rpbmcgc3R5bGVzaGVldHMsIHNvIHVzZXItZGVmaW5lZCBydWxlcyB0YWtlIHByZWNlZGVuY2UpXG4gICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbSwgaGVhZC5maXJzdENoaWxkKTtcblxuICAgICAgICAvLyBTZXQgdXAgdGhlIHBsYWNlaG9sZGVyc1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBpbnB1dHMubGVuZ3RoICsgdGV4dGFyZWFzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBlbGVtID0gaSA8IGlucHV0cy5sZW5ndGggPyBpbnB1dHNbaV0gOiB0ZXh0YXJlYXNbaSAtIGlucHV0cy5sZW5ndGhdO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHZhbHVlIG9mIHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUsIGlmIGFueS4gSUUxMCBlbXVsYXRpbmcgSUU3IGZhaWxzIHdpdGggZ2V0QXR0cmlidXRlLCBoZW5jZSB0aGUgdXNlIG9mIHRoZSBhdHRyaWJ1dGVzIG5vZGVcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gZWxlbS5hdHRyaWJ1dGVzLnBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBJRSByZXR1cm5zIGFuIGVtcHR5IG9iamVjdCBpbnN0ZWFkIG9mIHVuZGVmaW5lZCBpZiB0aGUgYXR0cmlidXRlIGlzIG5vdCBwcmVzZW50XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlci5ub2RlVmFsdWU7XG5cbiAgICAgICAgICAgICAgICAvLyBPbmx5IGFwcGx5IHRoZSBwb2x5ZmlsbCBpZiB0aGlzIGVsZW1lbnQgaXMgb2YgYSB0eXBlIHRoYXQgc3VwcG9ydHMgcGxhY2Vob2xkZXJzLCBhbmQgaGFzIGEgcGxhY2Vob2xkZXIgYXR0cmlidXRlIHdpdGggYSBub24tZW1wdHkgdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIgJiYgVXRpbHMuaW5BcnJheSh2YWxpZFR5cGVzLCBlbGVtLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0VsZW1lbnQoZWxlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgZW5hYmxlZCwgdGhlIHBvbHlmaWxsIHdpbGwgcmVwZWF0ZWRseSBjaGVjayBmb3IgY2hhbmdlZC9hZGRlZCBlbGVtZW50cyBhbmQgYXBwbHkgdG8gdGhvc2UgYXMgd2VsbFxuICAgICAgICB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGlucHV0cy5sZW5ndGggKyB0ZXh0YXJlYXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gaSA8IGlucHV0cy5sZW5ndGggPyBpbnB1dHNbaV0gOiB0ZXh0YXJlYXNbaSAtIGlucHV0cy5sZW5ndGhdO1xuXG4gICAgICAgICAgICAgICAgLy8gT25seSBhcHBseSB0aGUgcG9seWZpbGwgaWYgdGhpcyBlbGVtZW50IGlzIG9mIGEgdHlwZSB0aGF0IHN1cHBvcnRzIHBsYWNlaG9sZGVycywgYW5kIGhhcyBhIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSB3aXRoIGEgbm9uLWVtcHR5IHZhbHVlXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBlbGVtLmF0dHJpYnV0ZXMucGxhY2Vob2xkZXI7XG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXIubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIgJiYgVXRpbHMuaW5BcnJheSh2YWxpZFR5cGVzLCBlbGVtLnR5cGUpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGhhc24ndCBoYWQgZXZlbnQgaGFuZGxlcnMgYm91bmQgdG8gaXQgdGhlbiBhZGQgdGhlbVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtLmdldEF0dHJpYnV0ZShBVFRSX0VWRU5UU19CT1VORCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdFbGVtZW50KGVsZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgaGFzIGNoYW5nZWQgb3Igbm90IGJlZW4gaW5pdGlhbGlzZWQgeWV0IHdlIG5lZWQgdG8gdXBkYXRlIHRoZSBkaXNwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIgIT09IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpIHx8IChlbGVtLnR5cGUgPT09IFwicGFzc3dvcmRcIiAmJiAhZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9JTlBVVF9UWVBFKSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF0dGVtcHQgdG8gY2hhbmdlIHRoZSB0eXBlIG9mIHBhc3N3b3JkIGlucHV0cyAoZmFpbHMgaW4gSUUgPCA5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLnR5cGUgPT09IFwicGFzc3dvcmRcIiAmJiAhZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9JTlBVVF9UWVBFKSAmJiBVdGlscy5jaGFuZ2VUeXBlKGVsZW0sIFwidGV4dFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShBVFRSX0lOUFVUX1RZUEUsIFwicGFzc3dvcmRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHBsYWNlaG9sZGVyIHZhbHVlIGhhcyBjaGFuZ2VkIGFuZCB0aGUgcGxhY2Vob2xkZXIgaXMgY3VycmVudGx5IG9uIGRpc3BsYXkgd2UgbmVlZCB0byBjaGFuZ2UgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS52YWx1ZSA9PT0gZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS52YWx1ZSA9IHBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgcGxhY2Vob2xkZXIgdmFsdWUgaW4gY2FzZSBpdCBjaGFuZ2VzIHZpYSBhbm90aGVyIHNjcmlwdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9BQ1RJVkUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGVQbGFjZWhvbGRlcihlbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBsaXZlIHVwZGF0ZXMgYXJlIG5vdCBlbmFibGVkIGNhbmNlbCB0aGUgdGltZXJcbiAgICAgICAgICAgIGlmICghbGl2ZVVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgICAvLyBFeHBvc2UgcHVibGljIG1ldGhvZHNcbiAgICBQbGFjZWhvbGRlcnMuZGlzYWJsZSA9IFBsYWNlaG9sZGVycy5uYXRpdmVTdXBwb3J0ID8gbm9vcCA6IGRpc2FibGVQbGFjZWhvbGRlcnM7XG4gICAgUGxhY2Vob2xkZXJzLmVuYWJsZSA9IFBsYWNlaG9sZGVycy5uYXRpdmVTdXBwb3J0ID8gbm9vcCA6IGVuYWJsZVBsYWNlaG9sZGVycztcblxufSh0aGlzKSk7Il19
;