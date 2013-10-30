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
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}],18:[function(require,module,exports){
module.exports = hasKeys

function hasKeys(source) {
    return source !== null &&
        (typeof source === "object" ||
        typeof source === "function")
}

},{}],19:[function(require,module,exports){
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

},{"./has-keys":18,"object-keys":21}],20:[function(require,module,exports){
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


},{}],21:[function(require,module,exports){
module.exports = Object.keys || require('./shim');


},{"./shim":23}],22:[function(require,module,exports){
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


},{}],23:[function(require,module,exports){
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


},{"./foreach":20,"./isArguments":22}],24:[function(require,module,exports){
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

insertCss("@charset \"UTF-8\";#auth0-widget{/*!\n* CleanSlate\n*   github.com/premasagar/cleanslate\n*\n*//*!\n\tZocial Butons\n\thttp://zocial.smcllns.com\n\tby Sam Collins (@smcllns)\n\tLicense: http://opensource.org/licenses/mit-license.php\n\t\n\tYou are free to use and modify, as long as you keep this license comment intact or link back to zocial.smcllns.com on your site.\n*//*! normalize.css v1.0.1 | MIT License | git.io/normalize */}#auth0-widget .cleanslate,#auth0-widget .cleanslate h1,#auth0-widget .cleanslate h2,#auth0-widget .cleanslate h3,#auth0-widget .cleanslate h4,#auth0-widget .cleanslate h5,#auth0-widget .cleanslate h6,#auth0-widget .cleanslate p,#auth0-widget .cleanslate td,#auth0-widget .cleanslate dl,#auth0-widget .cleanslate tr,#auth0-widget .cleanslate dt,#auth0-widget .cleanslate ol,#auth0-widget .cleanslate form,#auth0-widget .cleanslate select,#auth0-widget .cleanslate option,#auth0-widget .cleanslate pre,#auth0-widget .cleanslate div,#auth0-widget .cleanslate table,#auth0-widget .cleanslate th,#auth0-widget .cleanslate tbody,#auth0-widget .cleanslate tfoot,#auth0-widget .cleanslate caption,#auth0-widget .cleanslate thead,#auth0-widget .cleanslate ul,#auth0-widget .cleanslate li,#auth0-widget .cleanslate address,#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate dd,#auth0-widget .cleanslate fieldset,#auth0-widget .cleanslate li,#auth0-widget .cleanslate iframe,#auth0-widget .cleanslate strong,#auth0-widget .cleanslate legend,#auth0-widget .cleanslate em,#auth0-widget .cleanslate s,#auth0-widget .cleanslate cite,#auth0-widget .cleanslate span,#auth0-widget .cleanslate input,#auth0-widget .cleanslate sup,#auth0-widget .cleanslate label,#auth0-widget .cleanslate dfn,#auth0-widget .cleanslate object,#auth0-widget .cleanslate big,#auth0-widget .cleanslate q,#auth0-widget .cleanslate font,#auth0-widget .cleanslate samp,#auth0-widget .cleanslate acronym,#auth0-widget .cleanslate small,#auth0-widget .cleanslate img,#auth0-widget .cleanslate strike,#auth0-widget .cleanslate code,#auth0-widget .cleanslate sub,#auth0-widget .cleanslate ins,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate var,#auth0-widget .cleanslate a,#auth0-widget .cleanslate abbr,#auth0-widget .cleanslate applet,#auth0-widget .cleanslate del,#auth0-widget .cleanslate kbd,#auth0-widget .cleanslate tt,#auth0-widget .cleanslate b,#auth0-widget .cleanslate i,#auth0-widget .cleanslate hr,#auth0-widget .cleanslate article,#auth0-widget .cleanslate aside,#auth0-widget .cleanslate dialog,#auth0-widget .cleanslate figure,#auth0-widget .cleanslate footer,#auth0-widget .cleanslate header,#auth0-widget .cleanslate hgroup,#auth0-widget .cleanslate menu,#auth0-widget .cleanslate nav,#auth0-widget .cleanslate section,#auth0-widget .cleanslate time,#auth0-widget .cleanslate mark,#auth0-widget .cleanslate audio,#auth0-widget .cleanslate video{background-attachment:scroll!important;background-color:transparent!important;background-image:none!important;background-position:0 0!important;background-repeat:repeat!important;border-color:black!important;border-color:currentColor!important;border-radius:0!important;border-style:none!important;border-width:medium!important;bottom:auto!important;clear:none!important;clip:auto!important;color:inherit!important;counter-increment:none!important;counter-reset:none!important;cursor:auto!important;direction:inherit!important;display:inline!important;float:none!important;font-family:inherit!important;font-size:inherit!important;font-style:inherit!important;font-variant:normal!important;font-weight:inherit!important;height:auto!important;left:auto!important;letter-spacing:normal!important;line-height:inherit!important;list-style-type:inherit!important;list-style-position:outside!important;list-style-image:none!important;margin:0!important;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:1;outline:invert none medium!important;overflow:visible!important;padding:0!important;position:static!important;quotes:\"\" \"\"!important;right:auto!important;table-layout:auto!important;text-align:inherit!important;text-decoration:inherit!important;text-indent:0!important;text-transform:none!important;top:auto!important;unicode-bidi:normal!important;vertical-align:baseline!important;visibility:inherit!important;white-space:normal!important;width:auto!important;word-spacing:normal!important;z-index:auto!important;-moz-border-radius:0!important;-webkit-border-radius:0!important;-moz-box-sizing:content-box!important;-webkit-box-sizing:content-box!important;box-sizing:content-box!important;text-shadow:none!important}#auth0-widget .cleanslate,#auth0-widget .cleanslate h3,#auth0-widget .cleanslate h5,#auth0-widget .cleanslate p,#auth0-widget .cleanslate h1,#auth0-widget .cleanslate dl,#auth0-widget .cleanslate dt,#auth0-widget .cleanslate h6,#auth0-widget .cleanslate ol,#auth0-widget .cleanslate form,#auth0-widget .cleanslate select,#auth0-widget .cleanslate option,#auth0-widget .cleanslate pre,#auth0-widget .cleanslate div,#auth0-widget .cleanslate h2,#auth0-widget .cleanslate caption,#auth0-widget .cleanslate h4,#auth0-widget .cleanslate ul,#auth0-widget .cleanslate address,#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate dd,#auth0-widget .cleanslate fieldset,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate hr,#auth0-widget .cleanslate article,#auth0-widget .cleanslate aside,#auth0-widget .cleanslate dialog,#auth0-widget .cleanslate figure,#auth0-widget .cleanslate footer,#auth0-widget .cleanslate header,#auth0-widget .cleanslate hgroup,#auth0-widget .cleanslate menu,#auth0-widget .cleanslate nav,#auth0-widget .cleanslate section{display:block!important}#auth0-widget .cleanslate table{display:table!important}#auth0-widget .cleanslate thead{display:table-header-group!important}#auth0-widget .cleanslate tbody{display:table-row-group!important}#auth0-widget .cleanslate tfoot{display:table-footer-group!important}#auth0-widget .cleanslate tr{display:table-row!important}#auth0-widget .cleanslate th,#auth0-widget .cleanslate td{display:table-cell!important}#auth0-widget .cleanslate nav ul,#auth0-widget .cleanslate nav ol{list-style-type:none!important}#auth0-widget .cleanslate ul,#auth0-widget .cleanslate menu{list-style-type:disc!important}#auth0-widget .cleanslate ol{list-style-type:decimal!important}#auth0-widget .cleanslate ol ul,#auth0-widget .cleanslate ul ul,#auth0-widget .cleanslate menu ul,#auth0-widget .cleanslate ol menu,#auth0-widget .cleanslate ul menu,#auth0-widget .cleanslate menu menu{list-style-type:circle!important}#auth0-widget .cleanslate ol ol ul,#auth0-widget .cleanslate ol ul ul,#auth0-widget .cleanslate ol menu ul,#auth0-widget .cleanslate ol ol menu,#auth0-widget .cleanslate ol ul menu,#auth0-widget .cleanslate ol menu menu,#auth0-widget .cleanslate ul ol ul,#auth0-widget .cleanslate ul ul ul,#auth0-widget .cleanslate ul menu ul,#auth0-widget .cleanslate ul ol menu,#auth0-widget .cleanslate ul ul menu,#auth0-widget .cleanslate ul menu menu,#auth0-widget .cleanslate menu ol ul,#auth0-widget .cleanslate menu ul ul,#auth0-widget .cleanslate menu menu ul,#auth0-widget .cleanslate menu ol menu,#auth0-widget .cleanslate menu ul menu,#auth0-widget .cleanslate menu menu menu{list-style-type:square!important}#auth0-widget .cleanslate li{display:list-item!important;min-height:auto!important;min-width:auto!important}#auth0-widget .cleanslate strong{font-weight:bold!important}#auth0-widget .cleanslate em{font-style:italic!important}#auth0-widget .cleanslate kbd,#auth0-widget .cleanslate samp,#auth0-widget .cleanslate code{font-family:monospace!important}#auth0-widget .cleanslate a,#auth0-widget .cleanslate a *,#auth0-widget .cleanslate input[type=submit],#auth0-widget .cleanslate input[type=radio],#auth0-widget .cleanslate input[type=checkbox],#auth0-widget .cleanslate select{cursor:pointer!important}#auth0-widget .cleanslate a:hover{text-decoration:underline!important}#auth0-widget .cleanslate button,#auth0-widget .cleanslate input[type=submit]{text-align:center!important}#auth0-widget .cleanslate input[type=hidden]{display:none!important}#auth0-widget .cleanslate abbr[title],#auth0-widget .cleanslate acronym[title],#auth0-widget .cleanslate dfn[title]{cursor:help!important;border-bottom-width:1px!important;border-bottom-style:dotted!important}#auth0-widget .cleanslate ins{background-color:#ff9!important;color:black!important}#auth0-widget .cleanslate del{text-decoration:line-through!important}#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate q{quotes:none!important}#auth0-widget .cleanslate blockquote:before,#auth0-widget .cleanslate blockquote:after,#auth0-widget .cleanslate q:before,#auth0-widget .cleanslate q:after,#auth0-widget .cleanslate li:before,#auth0-widget .cleanslate li:after{content:\"\"!important}#auth0-widget .cleanslate input,#auth0-widget .cleanslate select{vertical-align:middle!important}#auth0-widget .cleanslate select,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate input{border:1px solid #ccc!important}#auth0-widget .cleanslate table{border-collapse:collapse!important;border-spacing:0!important}#auth0-widget .cleanslate hr{display:block!important;height:1px!important;border:0!important;border-top:1px solid #ccc!important;margin:1em 0!important}#auth0-widget .cleanslate *[dir=rtl]{direction:rtl!important}#auth0-widget .cleanslate mark{background-color:#ff9!important;color:black!important;font-style:italic!important;font-weight:bold!important}#auth0-widget .cleanslate{font-size:medium!important;line-height:1!important;direction:ltr!important;text-align:left!important;font-family:\"Times New Roman\",Times,serif!important;color:black!important;font-style:normal!important;font-weight:normal!important;text-decoration:none!important;list-style-type:disc!important}#auth0-widget .theme-static .popup .overlay{background:rgba(255,255,255,0);background-color:transparent}#auth0-widget .theme-static .popup .panel{background:0;-webkit-box-shadow:0 0 0 1px rgba(14,41,57,0.12),0 2px 5px rgba(14,41,57,0.44),inset 0 -1px 2px rgba(14,41,57,0.15);-moz-box-shadow:0 0 0 1px rgba(14,41,57,0.12),0 2px 5px rgba(14,41,57,0.44),inset 0 -1px 2px rgba(14,41,57,0.15);-ms-box-shadow:0 0 0 1px rgba(14,41,57,0.12),0 2px 5px rgba(14,41,57,0.44),inset 0 -1px 2px rgba(14,41,57,0.15);-o-box-shadow:0 0 0 1px rgba(14,41,57,0.12),0 2px 5px rgba(14,41,57,0.44),inset 0 -1px 2px rgba(14,41,57,0.15);box-shadow:0 0 0 1px rgba(14,41,57,0.12),0 2px 5px rgba(14,41,57,0.44),inset 0 -1px 2px rgba(14,41,57,0.15);background:#fff}#auth0-widget .theme-static .popup .panel:after{display:none}@-moz-keyframes showPanel{0%{opacity:0}100%{opacity:1}}@-webkit-keyframes showPanel{0%{opacity:0}100%{opacity:1}}@-o-keyframes showPanel{0%{opacity:0}100%{opacity:1}}@-ms-keyframes showPanel{0%{opacity:0}100%{opacity:1}}@keyframes showPanel{0%{opacity:0}100%{opacity:1}}@-moz-keyframes hidePanel{0%{opacity:1}100%{opacity:0}}@-webkit-keyframes hidePanel{0%{opacity:1}100%{opacity:0}}@-o-keyframes hidePanel{0%{opacity:1}100%{opacity:0}}@-ms-keyframes hidePanel{0%{opacity:1}100%{opacity:0}}@keyframes hidePanel{0%{opacity:1}100%{opacity:0}}#auth0-widget .theme-static .separator span{background:#fff}#auth0-widget .zocial,#auth0-widget a.zocial{border:1px solid #777;border-color:rgba(0,0,0,0.2);border-bottom-color:#333;border-bottom-color:rgba(0,0,0,0.4);color:#fff;-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);cursor:pointer;display:inline-block;font:bold 100%/2.1 \"Lucida Grande\",Tahoma,sans-serif;padding:0 .95em 0 0;text-align:center;text-decoration:none;text-shadow:0 1px 0 rgba(0,0,0,0.5);white-space:nowrap;-moz-user-select:none;-webkit-user-select:none;user-select:none;position:relative;-moz-border-radius:.3em;-webkit-border-radius:.3em;border-radius:.3em}#auth0-widget .zocial:before{content:\"\";border-right:.075em solid rgba(0,0,0,0.1);float:left;font:120%/1.65 zocial;font-style:normal;font-weight:normal;margin:0 .5em 0 0;padding:0 .5em;text-align:center;text-decoration:none;text-transform:none;-moz-box-shadow:.075em 0 0 rgba(255,255,255,0.25);-webkit-box-shadow:.075em 0 0 rgba(255,255,255,0.25);box-shadow:.075em 0 0 rgba(255,255,255,0.25);-moz-font-smoothing:antialiased;-webkit-font-smoothing:antialiased;font-smoothing:antialiased}#auth0-widget .zocial:active{outline:0}#auth0-widget .zocial.icon{overflow:hidden;max-width:2.4em;padding-left:0;padding-right:0;max-height:2.15em;white-space:nowrap}#auth0-widget .zocial.icon:before{padding:0;width:2em;height:2em;box-shadow:none;border:0}#auth0-widget .zocial{background-image:-moz-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.1)),color-stop(49%,rgba(255,255,255,0.05)),color-stop(51%,rgba(0,0,0,0.05)),to(rgba(0,0,0,0.1)));background-image:-webkit-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1))}#auth0-widget .zocial:hover,#auth0-widget .zocial:focus{background-image:-moz-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-ms-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-o-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.15)),color-stop(49%,rgba(255,255,255,0.15)),color-stop(51%,rgba(0,0,0,0.1)),to(rgba(0,0,0,0.15)));background-image:-webkit-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15))}#auth0-widget .zocial:active{background-image:-moz-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.1)),color-stop(30%,rgba(255,255,255,0)),color-stop(50%,transparent),to(rgba(0,0,0,0.1)));background-image:-webkit-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1))}#auth0-widget .zocial.dropbox,#auth0-widget .zocial.github,#auth0-widget .zocial.gmail,#auth0-widget .zocial.openid,#auth0-widget .zocial.secondary,#auth0-widget .zocial.stackoverflow,#auth0-widget .zocial.salesforce{border:1px solid #aaa;border-color:rgba(0,0,0,0.3);border-bottom-color:#777;border-bottom-color:rgba(0,0,0,0.5);-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget .zocial.dropbox:focus,#auth0-widget .zocial.dropbox:hover,#auth0-widget .zocial.github:focus,#auth0-widget .zocial.github:hover,#auth0-widget .zocial.gmail:focus,#auth0-widget .zocial.gmail:hover,#auth0-widget .zocial.openid:focus,#auth0-widget .zocial.openid:hover,#auth0-widget .zocial.secondary:focus,#auth0-widget .zocial.secondary:hover,#auth0-widget .zocial.stackoverflow:focus,#auth0-widget .zocial.stackoverflow:hover,#auth0-widget .zocial.twitter:focus .zocial.twitter:hover,#auth0-widget .zocial.salesforce:focus .zocial.salesforce:hover{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.5)),color-stop(49%,rgba(255,255,255,0.2)),color-stop(51%,rgba(0,0,0,0.05)),to(rgba(0,0,0,0.15)));background-image:-moz-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-webkit-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-o-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-ms-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15))}#auth0-widget .zocial.dropbox:active,#auth0-widget .zocial.github:active,#auth0-widget .zocial.gmail:active,#auth0-widget .zocial.openid:active,#auth0-widget .zocial.secondary:active,#auth0-widget .zocial.stackoverflow:active,#auth0-widget .zocial.wikipedia:active,#auth0-widget .zocial.salesforce:active{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0)),color-stop(30%,rgba(255,255,255,0)),color-stop(50%,rgba(0,0,0,0)),to(rgba(0,0,0,0.1)));background-image:-moz-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-webkit-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1))}#auth0-widget .zocial.amazon:before{content:\"a\"}#auth0-widget .zocial.dropbox:before{content:\"d\";color:#1f75cc}#auth0-widget .zocial.facebook:before{content:\"f\"}#auth0-widget .zocial.github:before{content:\"\\00E8\"}#auth0-widget .zocial.gmail:before{content:\"m\";color:#f00}#auth0-widget .zocial.google:before{content:\"G\"}#auth0-widget .zocial.googleplus:before{content:\"+\"}#auth0-widget .zocial.guest:before{content:\"?\"}#auth0-widget .zocial.ie:before{content:\"6\"}#auth0-widget .zocial.linkedin:before{content:\"L\"}#auth0-widget .zocial.openid:before{content:\"o\";color:#ff921d}#auth0-widget .zocial.paypal:before{content:\"$\"}#auth0-widget .zocial.stackoverflow:before{content:\"\\00EC\";color:#ff7a15}#auth0-widget .zocial.twitter:before{content:\"T\"}#auth0-widget .zocial.vk:before{content:\"N\"}#auth0-widget .zocial.windows:before{content:\"W\"}#auth0-widget .zocial.yahoo:before{content:\"Y\"}#auth0-widget .zocial.office365:before{content:\"z\"}#auth0-widget .zocial.thirtysevensignals:before{content:\"b\"}#auth0-widget .zocial.salesforce:before{content:\"*\"}#auth0-widget .zocial.waad:before{content:\"z\"}#auth0-widget .zocial.box:before{content:\"x\"}#auth0-widget .zocial.amazon{background-color:#ffad1d;color:#030037;text-shadow:0 1px 0 rgba(255,255,255,0.5)}#auth0-widget .zocial.dropbox{background-color:#fff;color:#312c2a}#auth0-widget .zocial.facebook{background-color:#4863ae}#auth0-widget .zocial.github{background-color:#fbfbfb;color:#050505}#auth0-widget .zocial.gmail{background-color:#efefef;color:#222}#auth0-widget .zocial.google{background-color:#4e6cf7}#auth0-widget .zocial.googleplus{background-color:#dd4b39}#auth0-widget .zocial.guest{background-color:#1b4d6d}#auth0-widget .zocial.ie{background-color:#00a1d9}#auth0-widget .zocial.linkedin{background-color:#0083a8}#auth0-widget .zocial.openid{background-color:#f5f5f5;color:#333}#auth0-widget .zocial.paypal{background-color:#fff;color:#32689a;text-shadow:0 1px 0 rgba(255,255,255,0.5)}#auth0-widget .zocial.twitter{background-color:#46c0fb}#auth0-widget .zocial.vk{background-color:#45688e}#auth0-widget .zocial.windows{background-color:#0052a4;color:#fff}#auth0-widget .zocial.office365{background-color:#00aced;color:#fff}#auth0-widget .zocial.waad{background-color:#00adef;color:#fff}#auth0-widget .zocial.thirtysevensignals{background-color:#6ac071;color:#fff}#auth0-widget .zocial.box{background-color:#267bb6;color:#fff}#auth0-widget .zocial.salesforce{background-color:#fff;color:#f00}#auth0-widget .zocial.windows{background-color:#2672ec;color:#fff}#auth0-widget .zocial.primary,#auth0-widget .zocial.secondary{margin:.1em 0;padding:0 1em}#auth0-widget .zocial.primary:before,#auth0-widget .zocial.secondary:before{display:none}#auth0-widget .zocial.primary{background-color:#333}#auth0-widget .zocial.secondary{background-color:#f0f0eb;color:#222;text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget button:-moz-focus-inner{border:0;padding:0}@font-face{font-family:'zocial';src:url('https://d19p4zemcycm7a.cloudfront.net/w2/font/zocial-regular-webfont.eot')}@font-face{font-family:'zocial';src:url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABeQAA0AAAAAIGgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABMAAAABoAAAAcZnuAykdERUYAAAFMAAAAHwAAACAATgAGT1MvMgAAAWwAAABIAAAAVk/l3EBjbWFwAAABtAAAAPYAAAIKnl567Gdhc3AAAAKsAAAACAAAAAj//wADZ2x5ZgAAArQAABKLAAAZsAMpJrBoZWFkAAAVQAAAADAAAAA2/3JSWWhoZWEAABVwAAAAIAAAACQFfQH5aG10eAAAFZAAAABjAAAAgDtOAbdsb2NhAAAV9AAAAEQAAABEWZZf+G1heHAAABY4AAAAHgAAACAAcAC+bmFtZQAAFlgAAADeAAABhlbD9/Jwb3N0AAAXOAAAAFYAAABsUemhhHicY2BgYGQAgpOd+YYg+lwlxxkYDQBA+QYqAAB4nGNgZGBg4ANiCQYQYGJgZGBmUACSLGAeAwAFxABVAHicY2BkEmOcwMDKwMHow5jGwMDgDqW/MkgytDAwMDGwMjPAALMAAwIEpLmmMDgwKH5gYHzw/wGDHuNrBvUGBgZGkBwAj6YLSHictZC9LkRRFIW/O67xzx2GYQwzElHMNBMvoBKNqIQoiVBKJBLxMlSimnJoKGi8gxeQUCh1y7o/jZurtJO1917n7HWy1wEGSNEgcCYIzYKEh7y7rtNyN+1ulTU6dNlgky222WGXfQ444phTzjjngkuurPr8QopfY8Wadk6zZ82hNSfFGn3rTR961Yue9aRHPehefZ/3jFv1dKcbXaujdpRu2qU4WhnyUbe3pj1F1KhQtecyqfnYf8mplFPEl/VGM2TZzWA5Plr8PTGU5GFG4jLKWELHmZhkKpuIav7ESjVjs8lqSzDPQtHuM8bcH77+JX4A6/Y7NwAAAAAAAf//AAJ4nJ1YeYwkV32u33tV79V9H313T/f0MdMzPdNnzeGZ2WN2vYftXXbXF2vvrtc2uw7GDkZADARI2BChiFh2hL1BcsAKicLhkEgJRJEwREFKLMcRoBAnUkKwEsFi5AASOIqTzOT3qmcdkv9I1/T0O6pevXrv+33f9ysJJGn320SCb0tEkjyYIdIOVnYk8ZGx77vwA7gmWVJF6kjLkjQOhoMK4TZ0gTeSYTocTNJJO95rCERD0sNysgnpaDJu3PtyfrntqM5bts/Vrgyv1M4dut+1Z13decuhu2ceev98vA+4nHP3zea6ClmvwvNBa719+OTV9KmThw51W/1DJ58C6xxx/PdBowAySGR3d/cazvd7Uk3axBmPJlvAojCp0ChkjXqrzePEJqJAW+NkNBkO4iRttQebIEpBjGc5MBmPWu2Wa91f+yWnUPYbSWV/NFdeVGJPtSJ6Bl5qRPktu9rrw0KZZy2udSx3dO12eAhruWb/3FCxo6IT55LgrOsCkz0TLjCaBJHv3JFTTeZaO59kFE/2ZudXjgUVScZ5f4ech+9KbekG6bB0CtdyNFmH1niUinlnFd6oQBTiYkZhnIhi1pOGMS7zeNTusXar0WJpBYbxpEeYMh6Oh9EwakSN8dn9xUhV9PH2mcknZge54mJglOxq7syR7XOrNyxupBRklVuqL4fB0qE6G1Qrs/pwYxZmLuUvXcpvLxwOc44DB5eXDhe0YW1p1vYtraLHvUZvezjvzfYXmzpXdJ0ZikkZ9P9zbg3SN62QyUhcfumSBBIgVn4V/hhxIqWjFPdfPNMAF5xnD8W4LTfqrAu4NdkxBmbu73b23bGvMznaJAr1a0ELQIHNwklFky0tOGXEC0e92mBhY2NhUAvuSpdURVUtVVbAszWTqmpDoojRa/As4uEh6f3SRwQiUoTkOogV24C9SpzEyQChGU+PN6aDU8SJirNjm+Cisy51lLBCppdPpzmqR6EDjDfq2bx70G6l43TU5wJ2IT4PZ8pkGCejdgOLqqxpzrJqMO6zSK+EIbWNYtD3IqbIlKg2d6xcGKZtPWeqlk0AgBCgivjIWJJlh3plLwgX3SLRZcWmprO/aXI1oISeAwbKsm9SmDHMJKgSh6twLNQ5VQzVMCuWZigUVDUhjLNS6USvEtt3zMdFl5PCfFI08F5UVqmsU1FSGNcUYufbRby9PgSoFy0TUeIyxz8feYfhLqCGbcwrDJ4koHZBN5ATqMAxHM9wvPn/RnG2aohjXOc0a4Ns8aLwZ4AxXag3BJBJ2bNBGVZIxbN/RhzncojjQlxWtbkVKERlVTzff+2+Qlz4DnKeJ81LEhEcMoUMzpp6Q28dxgLfw0EZhggSnHjU34BGHNLZcsn3PL8MpdIjW2+X1XK8+siR9QPNtwM8PpxxvWLe9XbeC7ftfObLvu7lbv7iV2+6ZQVg2f0sRs9/SG3yNnhMehInMUWwgGy6hsGO7IawrTAE80isFmlvwjqt0jhBBOKyCSQiwDfpeLIlZ1eKtR5UIJu3jXxNkzAbI3sOgWScdQPBTEWvaMAxsSojKBDOCkcgIRcqBqNc4RCWgFGmMEZtolLNlXmzatmWbehczgAMxMLIpHouhyepqqHolseVwHZ1QnzNLylgMgaUyTo0o7CAVxq6Zum03qSWZnOTE5nX7aCzv5WMl0GVGYV3i3AAoETXPDo/R1SFyzKGyqqutmwmpqIhmrluIp69SDFNTU9UqsoWVEemlU0MyUSmslN2cg0OruowmWuyBjPFouHJYtJKl3iaCqTQ4CaRZ2bL2/dQT3NsxPlUF9+FuthHjONypshb4qcHGxAPewIDuL4C8QiPScq4+EahTXExHffNh+cOmrrtu4vrxVqx6i//2gl6fLLSWmza881mvl3ZvO3RQ289WyArgzZR1CM94nqrM43K+hHZs8Y3zWnJUl5x2yVvdPn80YW16XyukePIc/uR4zbpFoj7VhQMsEyDERatbFexPBwMpztty5zVBWER3F8beGllfkbVGNNVy7M0plIvNMyFggVyrHA/b64uLDI2DjSqj7aOToK4WU9U7ZQqeCCx4e6ZUcmlgq3y1W5zwd43We3nY6YUObEPdqryfJh3vNGDZ44vWiaSTgCGjjRDTf26l7hGfgHnHyBzrEsncFUxiLYEVhPegyXAydtYRz4e/u+2ABe6imuOGp4iqziA8P0/bQ2ObRN/6Pn50iie+Ium7blqcX0w9keeVyiO4rG/aFm+g20vjgMsZt3O2B+7XqE0bI+DhayttIZtI98tFkbV53RkTEWPnnM8gh/ze8/pZla3fQFNc+cHX7J9RD8xjOmpBqhf2uszxLlMk4Q+SYfIVxBHx/GZT+Pe4Y5VyTCJyxAKUeH1MswgjXRJfQNa6GYm+Pz4H7Wr1UdTFcZVOuRt0ba8CaIVz+RRM6FtniacEgS6tvobGDFk1WGgIbcfkwFryi9vK7JGKfyTiCRTW/+5d0ZcblCskNdlIPecn6/ZZIXA7+kUx1D+gPGLsiiUyoTwy4ARwt4ja7Kiil3k+JjyfR8jBsiUCx1J6c634OIKWZEyb3ONDHFvc9Lt0mXpo+gAJoKChAuYxEJrQTgyDJYtGE2EJKcCr11ATDIu2sfTba8oZRru0RZqGPJTmwl6ak3VYzhJN8mG0I5kOkqm6NlCZqQ2DQOhJBwVZxkI++CT999DdcI1rjkLD45O/vqKTD5erxbn7Co3EtnLU6Ktadp2z1qbUTSUYODIY3KXMg05UCflop/vDO4IPZTeyGQKVJzFl5DtjNBXlEQhoYcBgSQVEJZopmlQclaWj7XQqVJLYVqhvDIkuBdPNAaWqRCizRgOBMiKHA/SWyAVxdR8FhPXPmfFOrKuTJtUkVGeHFrjynIa5oDFWuK4lmx9HQegCvIWkjH1+w7eWV70sAK4pSA44jH0Qr+dxZiUojkUahyhSKJQZSbxsROH+idOcPPixXu/ebE/Pn7RtQYXX301i8/df9/9IeGoewbqXiQVJamdttMEIZbwtgPjJC0DTdI2Mk+SRuxtb/vE5bd+/P77n758ebB8+cmnrj6Fs7k0eun06ct33nnvmdvPnzxZL5dOwhdg/dx9t+088AU4Wa3hfTDL2H0FduH7OEd0DzeA2MdsG7MdFx4rFWKG9Lpnv9LWlBAmgmYnGPR8Dx0cd/4N5tvbdjzCufNLDyydm4uiuXNYOD8XducPRYZd8JcKpm0oapCvblRD3+XcMgolNx8VooPdec8rlztz3bn5dqXseV+8vHy+E0Wd8/37+xfmwnDuwr1HVleSuaqF9GeUj7aLlQZhnoqGjgE0KsX2ahmlhNiVuWR19caFDo7i+r5brrQ7Ess86su4L21Uk3XpoHSj9ADyXxhnLrMxD42WcBT4JBgYaDPwWZgwT0LXbZhkWYxwUXxqqFm95YsSFigmAOkw6qO4Z15qi2SBsASjNu5/Y4y7vnV2375FxIdpNgeyo+arNFdqT/KhbSWlzdhxYvxGxWYR/z6Ta+RyDXs7VyZOGDCO3hXlFWIT2Q9pY2lps5zO9HoztZ5RcMho1jaovO6641ZuzvJDPzTqX6zncvXcH1lBYNlBAFfEeLmdb7322p897sY6Q3+ryEMOwPH76HhpaerfSRfXZhYzhxRXpbUpb0FkK840r5OrEPWUseKlXiBkrQo8GWfiAMX50ahrWeV+JWdy4RVYsT5b1vTByf6sq4F81KNBGBtG95OT6Fix+HQtnS25BpAt4sb5HD4fVw3dz0UWkuZYKdSajbL6OfjrwU4HuOAB1ev8YjUuEsHhXPgBeAJ5nGOEOIjeBGOkKknROOEzuAtNDLExRkv7p74YKryNcdHZ+dHzzyvPy182/9x6On42ub3xrlmzO9Ot/S187rN/8/PzxxfC7oPz6fxvNS+3vpH/VP6f+V/wLFZ8SScJ/Im0IX0AIzq+nr+kk71jD/r/c6A2XI+D6wfSYxLG6eiNi5A2JxVZjDN8oykRVnI6uqDf69fuDbvcChkz3Up3brQ6Thfm6zrjKDFIRVY+rlabYWJaClFdRQgFM80kbtcqUajho9dRILlHDY37LlMMqlMVbI1zbmACrdsKUyhVwshxfY2F4GsAfr+7ikzf6qK1gAdV7pg5y0Zjyjyvoqm6qjksUOSVfne2ERpc+DjceUVzivOd0WAVs0LREKM15GFJ8Ww1p6BgoaUBR6agmaWGYRPBySA7kRvErtakVZ9ALXARnIrjlbhGhV95QqrQy/B53OO2tCSUG+oMcYfLO+6PWhigfQy7zHxl/0ctud7KojLe+03a6XjSw8yxz9v9Hmpd0k94n1WQtPppgtduQpvkOwd9/0BnqeUmHpxa6xzw/YOdtVOndn54eDA43P/L7P9rR45w2U/45hZPfMqOHEH6R3RtYk3msDJXr8+V3m24rvHK2ptE5fQ7T73cz67M/m9cuABaYlHt9GmNWol2zwU9tqc1O0Z3piC2/wHj+9uZT1MlU3LRp/TTiCdRe5w2Iwui5vgb+Pk+JDvfy75PlV+A+IXy5/9l7sc0/+POX009nin58BNcs560Ld0lPSxJAeZJEwEpgbJNwNIb0Opl1B8P46xnCmVlggi8fkJ93NoD52B6pQ3t+h4is3Y+mUKWh3tI7YFJHM3nbJ8PcFSTA03TaO5ux3bifF0zCHpgH2LL1FHN6VlHhic0Dzedt5p51+YIaDVMqsUR0RVFMwnidHGm7KMoE6Kauea7ZG7lOn0LXEMLZmuuyuA3NQs8+1NdAl/JaapMA33tWtsLuKqAqzkiBTH0PLXQVfzjrBZTpBRfCV2RpRN0GJ4f+78i0OppOA5F7cf0FjMWmZ9GQdfcAvNcJjOzkHNUtJKSsvv67t/jPr2MHKQjNxSkuiQ1G7yRDpPGEvBZoQwIPVZnQloESLNfmDttHL/z5J03FwsFKF196erVl/LPPPLIM4+854lLl5649Ez71VfP3nrrO0T71QOPiJ4Ll0SPtHfPf4N/ha9LMWrXDZh93IiR0AOx4gwXPoqjCmQ+L51QhpuQbTPuFPYy3Ju96iR7N5CZwbag9XQicn54JTnWqRQeeKaoG/HjF868k0LUfW3fB5otdaHzvhSc+MYHNPXWjcMPGNQowy2HzmxsdjoHAN6xvZ0/ppBmBT5dCSydxfdexjShBG++T1ev3Fmr37Tzh0F/de3KpN9IQofqtx5be6uqv+nGhMOJh756w1xnH8CBuflHzf0HLBJsoZaLZ1Uznf4malFJulW6T3pQelT6iPSM9KcCx3Q4tSHCbgrbKnJmEP5E5IBZJrNJpnDNTqsQRKx412hTgdlGXbxCEka4nb1HSqcp+3DcFv6MX5dzLsbCBCASdhlZuwpDIeF4ow1oBD+V2kVisGkwjJKReCeLxtlWuiAyeSCm7aDQxl6IXjFBoTN116GkjplmYtmQr+ia64WK7CIAZXdURn5F6LG4PKoGMfcMS9G0vBlqkPN8dhC4Ud5fbjg5qtZ6tVrPRrp1SgXVJOccVT1Wq8oMqkUaBz6VY9dUQi9H5ZLB4a4Vr2BhpCmq4Wk0tCyTwmJQtFXww1BFSq7nZZxS2dFU5cca5t1xHvOoqOa7hpFRNQsnsV4p5dGSa5GB9oGI5EVk7p7nH+bcdWL2NHQjA9j+Xm//0usYOpot7zMUS7coefgMoOc+BkouHyn5EFWjnITomWM3Vj96sxOLOFWoa9g6ZjksH0qZ5n5w93U4C19DfZ9BpGdOLEEoo73aQhsd4u/YG9HrL7siOHN4cuSWuzEj6jJypiq35F5hptetVuFrp46fbzwrM+XTn1YUeIHtSuNxmv6dJFmSs/sa/AhexDj20EW0MLI2MK5OS3dLb5HeLr1XuiJJswISNtTTEJkwE5T2ng+st5TrjpC1mqJYgezVd9aQZn3pnk/EmKtP31GIOp0OhKXJtHM44G+Yy9a0BwsjvqdgDA6GlRii8tXIdqKoGjwbOXYUlaOdF0M0jaICQ1GCGIsfxpPwZMcJDzpRXM66I9uO8IQwKof4wTbbuRpm7U74nkoYTk+OsPRwOYxK4YdxxBDPvQ0vKUXhbW4QliIc0w7xN7TtEGLbCXAo0VIOr2BTFFlOuPMw9uPNwo/hTylsOKI3eF1cEZaWAyxXAtQ5S7oLXoWLmKdWpa40kNYwsjFSY8xUCaaYdqYxQkcmqPRIanFaIVNtGU04qhhrT7CKHRX4rFr0uemaqlfEfNh2882iZ6gy+VCix6NG8pPeupJozkQlUDK6dDWtfmiyZrQ4a8FFRCfT8c+SnYP1fjBDK2EhXNj3YvnIxpLyO7+rb5+ed/Xmpju79PvWSM7nW61czlpS1Z4k/Tc/tXiPAHicY2BkYGAA4qooY554fpuvDNxMDCBwrpLjDIz+//P/TeYMxtdALgcDWBoAKlkMKXicY2BkYGB8/f8mgx4Lw/+f/xiYMxiAIihAHgCk1AZ5eJxjYoCCVRCK8RMDAxOQZooDsjsYGBnXAGkvIF/k/z+m3P9/mEqBbBC/HIgPAbERUH4RQz8T2/9fIH2MD4BiWkB6ItgcIRYGhklg8xgYeJgY/v8GYcYrYH4DAz8DLwDcABUuAAAAAAAAAAAAAA4AWAC0ASQBYAIYAogCxAOMA9QENASwBSIF5gYEBjgGsgdAB5QHzgiMCQIJJgnWChAKhguIC7oMdgzYeJxjYGRgYFBk2M3AywACTEDMyAAScwDzGQAZIgEvAAB4nHWOMWoDMRBF39prh+AQUoWUgjRpdpE2jfEB9gAp3BsjlgXbAtkGnyRVjpAyx8gBcoQcI9/raVJYMOjN15/5Au54p+B8Cm54MB6JX4zHPHMyLqV/Gk+Y8W08lf4rZ1HeSrkfps48Ej8Zj2nxxqX0D+MJj3wZT6X/0LMmsVUldtCv0zYlwRuRjiMbVmS1sTtuVoJ28B2GO8sRcTTUSnMsVP/3XbQ5FUGOSk4vetWatDu0KXfRNbV3C2e5onkVfNX4INO1vy2Vmtnr/ZIRhnyWMe977Qi1vzr7BwDvOdMAAHicY2BiwA8UgZiRgYmRiYGdgZeBj0GJQYNBi0GfwZDBnMGSwYrBhsGFwZPBnaGQwYshiKGUwZUhmiGWgYVBmIGVIYKBk4GNIZS9NC/TzcDAAADphwhaAAA=) format('woff'),url('https://d19p4zemcycm7a.cloudfront.net/w2/font/zocial-regular-webfont.ttf') format('truetype'),url('https://d19p4zemcycm7a.cloudfront.net/w2/font/zocial-regular-webfont.svg#zocialregular') format('svg');font-weight:normal;font-style:normal}#auth0-widget .zocial.auth0:before{content:\"?\"}#auth0-widget .zocial.auth0{background-color:#ff4500;width:auto}#auth0-widget .zocial.block{display:block;margin:10px 0;text-overflow:ellipsis;overflow:hidden}#auth0-widget .zocial.primary,#auth0-widget .zocial.secondary{margin:0;padding:0 1em;font-size:14px;line-height:42px}#auth0-widget .zocial.primary:before,#auth0-widget .zocial.secondary:before{display:none}#auth0-widget .zocial.primary{background-color:#747e85}#auth0-widget .zocial.secondary{background-color:#f0f0eb;color:#222;text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget .zocial{-webkit-font-smoothing:antialiased}#auth0-widget .popup .overlay{position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;z-index:9999;font-weight:200;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;background:#000;background:rgba(0,0,0,0.8);background:-webkit-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:-moz-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:-ms-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);opacity:0;-webkit-transition:400ms opacity ease;-moz-transition:400ms opacity ease;transition:400ms opacity ease;-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}#auth0-widget .popup .overlay.active{opacity:1}#auth0-widget .popup .overlay .panel{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;left:50%;display:none}#auth0-widget .popup .overlay .panel.active{display:block;-webkit-animation-duration:400ms;-webkit-animation-timing-function:ease;-webkit-animation-name:showPanel}#auth0-widget .popup .overlay .panel{-webkit-animation-duration:400ms;-webkit-animation-timing-function:ease;-webkit-animation-name:hidePanel;width:280px;margin:0 0 0 -140px}#auth0-widget .popup .email{margin-bottom:14px}#auth0-widget .popup .password,#auth0-widget .popup .repeatPassword{margin-bottom:14px}#auth0-widget .popup .email-readonly{text-align:center;display:inherit;color:#41444a;font-weight:bold;margin-bottom:25px}#auth0-widget .panel .signup .header,#auth0-widget .panel .reset .header{margin-bottom:15px;font-size:14px;color:#41444a}#auth0-widget .panel .signup .footer{margin-bottom:15px;font-size:12px;color:#41444a;text-align:left;margin-top:10px}@-moz-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,0,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-webkit-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,0,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-o-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,0,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-ms-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,0,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,0,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-moz-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-webkit-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-o-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-ms-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}#auth0-widget .popup .panel{background:#fafafa;background-image:-webkit-linear-gradient(#fff,#fafafa);background-image:-moz-linear-gradient(#fff,#fafafa);background-image:-ms-linear-gradient(#fff,#fafafa);background-image:-o-linear-gradient(#fff,#fafafa);background-image:linear-gradient(#fff,#fafafa);z-index:10;-moz-box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);-webkit-box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;-webkit-touch-callout:none}#auth0-widget .popup .panel:after{content:\"\";position:absolute;left:0;right:0;top:0;bottom:0;z-index:1;-moz-box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4);-webkit-box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4);box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4)}#auth0-widget .popup .panel header{display:block;position:relative;min-height:65px;overflow:hidden;-moz-border-radius:6px 6px 0 0;-webkit-border-radius:6px 6px 0 0;border-radius:6px 6px 0 0;background:#f1f4f6;background-image:-webkit-linear-gradient(#f1f4f6,#e9edf0);background-image:-moz-linear-gradient(#f1f4f6,#e9edf0);background-image:-ms-linear-gradient(#f1f4f6,#e9edf0);background-image:-o-linear-gradient(#f1f4f6,#e9edf0);background-image:linear-gradient(#f1f4f6,#e9edf0);border-bottom:1px solid rgba(40,69,85,0.11)}#auth0-widget .popup .panel header:before{content:'';position:absolute;height:5px;bottom:-1px;left:0;right:0;background-image:-webkit-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-moz-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-ms-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-o-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1))}#auth0-widget .popup .panel header:after{content:'';position:absolute;height:4px;bottom:0;left:0;right:0;background-image:-webkit-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-moz-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-ms-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-o-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0)}#auth0-widget .popup .panel header h1{padding:21px 20px;margin:0;font-size:18px;color:#41444a;font-weight:bold;border-bottom:1px solid #dde3e6}#auth0-widget .popup .panel header a{display:block;overflow:hidden;text-indent:200%;position:absolute;width:12px;opacity:.4;padding:5px;z-index:5}#auth0-widget .popup .panel header a:hover{opacity:.66}#auth0-widget .popup .panel header a:active{opacity:1}#auth0-widget .popup .panel header a.close{height:12px;background:url(\"https://d19p4zemcycm7a.cloudfront.net/w2/img/close.png\") 50% 50% no-repeat;background-size:12px 12px;right:19px;top:21px;cursor:pointer}#auth0-widget .popup .panel header a.close:hover{opacity:.66}#auth0-widget .popup .panel header img{height:32px;margin:16px 10px 10px 20px;position:relative;float:left}#auth0-widget .action .spinner{width:100%;background-color:#6a777f;background-image:url('https://d19p4zemcycm7a.cloudfront.net/w2/img/spinner.gif');background-repeat:no-repeat;background-position:center;margin:0;height:44px;border:1px solid #777;border-color:rgba(0,0,0,0.2);border-bottom-color:#333;border-bottom-color:rgba(0,0,0,0.4);-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-moz-user-select:none;user-select:none;-moz-border-radius:.3em;-webkit-border-radius:.3em;border-radius:.3em}#auth0-widget .popup .panel footer{display:block;position:relative;-moz-border-radius:0 0 5px 5px;-webkit-border-radius:0 0 5px 5px;border-radius:0 0 5px 5px;height:25px;line-height:25px;vertical-align:middle;margin:0 15px;border-top:1px solid #dde3e6;z-index:5}#auth0-widget .popup .panel footer span{font-size:10px;color:#666}#auth0-widget .popup .panel footer a{font-size:9px;color:#333;font-weight:bold;text-decoration:none;cursor:pointer}#auth0-widget .list,#auth0-widget .iconlist{margin:25px 0;position:relative;z-index:5}#auth0-widget .list:before,#auth0-widget .list:after,#auth0-widget .iconlist:before,#auth0-widget .iconlist:after{display:table;content:\"\"}#auth0-widget .list:after,#auth0-widget .iconlist:after{clear:both}#auth0-widget .list span{display:block;margin:10px 0;cursor:pointer}#auth0-widget .iconlist{text-align:center}#auth0-widget .iconlist span{margin:0 2px}#auth0-widget .forgot-pass{font-size:12px;color:#666;font-weight:normal}#auth0-widget .create-account{display:none;margin-top:20px;text-align:center}#auth0-widget .create-account a{font-size:12px;color:#6d6d6d;text-decoration:none}#auth0-widget .create-account a:hover{text-decoration:underline}#auth0-widget .loggedin span.centered.all{color:#008cdd;cursor:pointer}#auth0-widget .loggedin span.centered{text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;display:block}#auth0-widget .loggedin span.centered.all:hover{text-decoration:underline}#auth0-widget .signup .options a.cancel,#auth0-widget .reset .options a.cancel{color:#008cdd;cursor:pointer;text-decoration:none}#auth0-widget .signup .options a.cancel:hover,#auth0-widget .reset .options a.cancel:hover{text-decoration:underline}#auth0-widget .signup .options,#auth0-widget .reset .options{text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;display:block}#auth0-widget form{margin:30px!important;margin-bottom:22px;position:relative;z-index:5}#auth0-widget form label{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}#auth0-widget form input{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;font-size:18px;padding:10px 12px;border:1px solid #b4becd;border-top-color:#b0baca;border-bottom-color:#d3d9e2;-moz-box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);-webkit-box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;margin:0;font-family:'Helvetica Neue',Helvetica,Arial Geneva,sans-serif}#auth0-widget .placeholder{color:#ccc}#auth0-widget form input:focus{border-color:#5695db #70a7e4 #89b8ec #70a7e4;outline:0;-moz-box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db;-webkit-box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db;box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db}#auth0-widget form .invalid input{outline:0;border-color:#ff7076;border-top-color:#ff5c61;-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5);box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5)}#auth0-widget header .error{padding:9px 0;margin:10px auto;width:70%;font-size:14px;line-height:13px;color:#b95353;text-align:center}#auth0-widget header .success{padding:9px 0;margin:10px auto;width:70%;font-size:14px;line-height:13px;color:#0fad29;text-align:center}#auth0-widget form .note{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}#auth0-widget form .note a{color:#008cdd;text-decoration:none}#auth0-widget form .invalid .error{visibility:visible}#auth0-widget form button{display:block;margin:20px 0 0 0;cursor:pointer;width:100%}#auth0-widget .action{text-align:right;margin:0 30px 30px 30px;position:relative;z-index:5}#auth0-widget form .action{margin:0}#auth0-widget .action button{width:auto}#auth0-widget .separator{position:relative;text-align:center;margin:0 0 25px 0}#auth0-widget .separator:before{content:\"\";display:block;border-top:1px solid #7f8899;width:200px;left:50%;margin-left:-100px;height:1px;position:absolute;top:50%;z-index:1}#auth0-widget .separator span{background:#fafafa;padding:0 10px;position:relative;z-index:5;color:#7f8899;font-size:13px;font-weight:bold;text-shadow:0 1px 0 white}#auth0-widget span.back{display:block;color:#008cdd;text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;cursor:pointer;position:relative;z-index:5;outline:0}#auth0-widget span.back:hover{text-decoration:underline}#auth0-widget .signin .panel.strategies .list .email{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;text-align:center}#auth0-widget .zocial.office365:before{content:\"W\"}#auth0-widget .zocial.office365{background-color:#00aced;color:#fff}#auth0-widget .zocial.waad:before{content:\"z\"}#auth0-widget .zocial.waad{background-color:#00adef;color:#fff}#auth0-widget .zocial.thirtysevensignals:before{content:\"b\"}#auth0-widget .zocial.thirtysevensignals{background-color:#6ac071;color:#fff}#auth0-widget .zocial.box:before{content:\"x\"}#auth0-widget .zocial.box{background-color:#267bb6;color:#fff}#auth0-widget .zocial.salesforce:before{content:\"*\"}#auth0-widget .zocial.salesforce{background-color:#fff;color:#f00}#auth0-widget .zocial.windows{background-color:#2672ec;color:#fff}#auth0-widget .zocial.fitbit:before{content:\"#\"}#auth0-widget .zocial.fitbit{background-color:#45c2c5;color:#fff}#auth0-widget .zocial.yandex:before{content:\"&\"}#auth0-widget .zocial.yandex{background-color:#f00;color:#fff}#auth0-widget .zocial.renren:before{content:\"r\"}#auth0-widget .zocial.renren{background-color:#0056b5;color:#fff}#auth0-widget .zocial.baidu:before{content:\"u\"}#auth0-widget .zocial.baidu{background-color:#2832e1;color:#fff}#auth0-widget .popup .overlay .onestep{width:345px;margin:0 0 0 -172px}@media(max-width:280px){#auth0-widget .popup .overlay .panel{width:240px;margin:0 0 0 -120px}#auth0-widget .signin .popup .panel.strategies .list{margin:12px}#auth0-widget form{margin:12px}#auth0-widget form input{padding:5px}#auth0-widget .popup .panel header{margin:0;padding:0}#auth0-widget .popup .panel header h1{padding:14px 16px;margin:0;font-size:22px}#auth0-widget .popup .panel header a.close{right:14px;top:16px}}@media(min-width:281px) and (max-width:340px){#auth0-widget .popup .overlay .panel{margin:0;left:0;height:100%;width:100%;border-radius:0}#auth0-widget .popup .zocial,#auth0-widget .popup a.zocial{font-size:18px}#auth0-widget .signin .popup .panel.strategies .list{margin:15px}#auth0-widget form{margin:15px 25px}#auth0-widget form input{padding:6px;font-size:18px}#auth0-widget .popup .panel header{margin:0;padding:0;min-height:32px}#auth0-widget .popup .panel header h1{padding:12px 16px;margin-top:1px;font-size:20px}#auth0-widget .popup .panel header img{height:32px;margin:9px 10px 6px 18px}#auth0-widget .zocial.primary{line-height:34px}#auth0-widget .action .spinner{height:34px}#auth0-widget .create-account{margin-top:20px}#auth0-widget .popup .email{margin-bottom:5px}#auth0-widget .popup .password,#auth0-widget .popup .repeatPassword{margin-bottom:5px}}@-moz-keyframes orbit{0%{opacity:1;z-index:99;-moz-transform:rotate(180deg);-moz-animation-timing-function:ease-out}7%{opacity:1;-moz-transform:rotate(300deg);-moz-animation-timing-function:linear;-moz-origin:0}30%{opacity:1;-moz-transform:rotate(410deg);-moz-animation-timing-function:ease-in-out;-moz-origin:7%}39%{opacity:1;-moz-transform:rotate(645deg);-moz-animation-timing-function:linear;-moz-origin:30%}70%{opacity:1;-moz-transform:rotate(770deg);-moz-animation-timing-function:ease-out;-moz-origin:39%}75%{opacity:1;-moz-transform:rotate(900deg);-moz-animation-timing-function:ease-out;-moz-origin:70%}76%{opacity:0;-moz-transform:rotate(900deg)}100%{opacity:0;-moz-transform:rotate(900deg)}}@-webkit-keyframes orbit{0%{opacity:1;z-index:99;-webkit-transform:rotate(180deg);-webkit-animation-timing-function:ease-out}7%{opacity:1;-webkit-transform:rotate(300deg);-webkit-animation-timing-function:linear;-webkit-origin:0}30%{opacity:1;-webkit-transform:rotate(410deg);-webkit-animation-timing-function:ease-in-out;-webkit-origin:7%}39%{opacity:1;-webkit-transform:rotate(645deg);-webkit-animation-timing-function:linear;-webkit-origin:30%}70%{opacity:1;-webkit-transform:rotate(770deg);-webkit-animation-timing-function:ease-out;-webkit-origin:39%}75%{opacity:1;-webkit-transform:rotate(900deg);-webkit-animation-timing-function:ease-out;-webkit-origin:70%}76%{opacity:0;-webkit-transform:rotate(900deg)}100%{opacity:0;-webkit-transform:rotate(900deg)}}@-ms-keyframes orbit{0%{opacity:1;z-index:99;-ms-transform:rotate(180deg);-ms-animation-timing-function:ease-out}7%{opacity:1;-ms-transform:rotate(300deg);-ms-animation-timing-function:linear;-ms-origin:0}30%{opacity:1;-ms-transform:rotate(410deg);-ms-animation-timing-function:ease-in-out;-ms-origin:7%}39%{opacity:1;-ms-transform:rotate(645deg);-ms-animation-timing-function:linear;-ms-origin:30%}70%{opacity:1;-ms-transform:rotate(770deg);-ms-animation-timing-function:ease-out;-ms-origin:39%}75%{opacity:1;-ms-transform:rotate(900deg);-ms-animation-timing-function:ease-out;-ms-origin:70%}76%{opacity:0;-ms-transform:rotate(900deg)}100%{opacity:0;-ms-transform:rotate(900deg)}}@-o-keyframes orbit{0%{opacity:1;z-index:99;-o-transform:rotate(180deg);-o-animation-timing-function:ease-out}7%{opacity:1;-o-transform:rotate(300deg);-o-animation-timing-function:linear;-o-origin:0}30%{opacity:1;-o-transform:rotate(410deg);-o-animation-timing-function:ease-in-out;-o-origin:7%}39%{opacity:1;-o-transform:rotate(645deg);-o-animation-timing-function:linear;-o-origin:30%}70%{opacity:1;-o-transform:rotate(770deg);-o-animation-timing-function:ease-out;-o-origin:39%}75%{opacity:1;-o-transform:rotate(900deg);-o-animation-timing-function:ease-out;-o-origin:70%}76%{opacity:0;-o-transform:rotate(900deg)}100%{opacity:0;-o-transform:rotate(900deg)}}@keyframes orbit{0%{opacity:1;z-index:99;transform:rotate(180deg);animation-timing-function:ease-out}7%{opacity:1;transform:rotate(300deg);animation-timing-function:linear;origin:0}30%{opacity:1;transform:rotate(410deg);animation-timing-function:ease-in-out;origin:7%}39%{opacity:1;transform:rotate(645deg);animation-timing-function:linear;origin:30%}70%{opacity:1;transform:rotate(770deg);animation-timing-function:ease-out;origin:39%}75%{opacity:1;transform:rotate(900deg);animation-timing-function:ease-out;origin:70%}76%{opacity:0;transform:rotate(900deg)}100%{opacity:0;transform:rotate(900deg)}}#auth0-widget input[disabled]{background-color:#d9dee0}#auth0-widget article,#auth0-widget aside,#auth0-widget details,#auth0-widget figcaption,#auth0-widget figure,#auth0-widget footer,#auth0-widget header,#auth0-widget hgroup,#auth0-widget nav,#auth0-widget section,#auth0-widget summary{display:block}#auth0-widget audio,#auth0-widget canvas,#auth0-widget video{display:inline-block;*display:inline;*zoom:1}#auth0-widget audio:not([controls]){display:none;height:0}#auth0-widget [hidden]{display:none}#auth0-widget html{font-size:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}#auth0-widget html,#auth0-widget button,#auth0-widget input,#auth0-widget select,#auth0-widget textarea,#auth0-widget h1,#auth0-widget h2,#auth0-widget div,#auth0-widget span,#auth0-widget a{font-family:sans-serif}#auth0-widget body{margin:0}#auth0-widget a:focus{outline:thin dotted}#auth0-widget a:active,#auth0-widget a:hover{outline:0}#auth0-widget h1{font-size:2em;margin:.67em 0}#auth0-widget h2{font-size:1.5em;margin:.83em 0}#auth0-widget h3{font-size:1.17em;margin:1em 0}#auth0-widget h4{font-size:1em;margin:1.33em 0}#auth0-widget h5{font-size:.83em;margin:1.67em 0}#auth0-widget h6{font-size:.75em;margin:2.33em 0}#auth0-widget abbr[title]{border-bottom:1px dotted}#auth0-widget b,#auth0-widget strong{font-weight:bold}#auth0-widget blockquote{margin:1em 40px}#auth0-widget dfn{font-style:italic}#auth0-widget mark{background:#ff0;color:#000}#auth0-widget p,#auth0-widget pre{margin:1em 0}#auth0-widget code,#auth0-widget kbd,#auth0-widget pre,#auth0-widget samp{font-family:monospace,serif;_font-family:'courier new',monospace;font-size:1em}#auth0-widget pre{white-space:pre;white-space:pre-wrap;word-wrap:break-word}#auth0-widget q{quotes:none}#auth0-widget q:before,#auth0-widget q:after{content:'';content:none}#auth0-widget small{font-size:80%}#auth0-widget sub,#auth0-widget sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}#auth0-widget sup{top:-0.5em}#auth0-widget sub{bottom:-0.25em}#auth0-widget dl,#auth0-widget menu,#auth0-widget ol,#auth0-widget ul{margin:1em 0}#auth0-widget dd{margin:0 0 0 40px}#auth0-widget menu,#auth0-widget ol,#auth0-widget ul{padding:0 0 0 40px}#auth0-widget nav ul,#auth0-widget nav ol{list-style:none;list-style-image:none}#auth0-widget img{border:0;-ms-interpolation-mode:bicubic}#auth0-widget svg:not(:root){overflow:hidden}#auth0-widget figure{margin:0}#auth0-widget form{margin:0}#auth0-widget fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:.35em .625em .75em}#auth0-widget legend{border:0;padding:0;white-space:normal;*margin-left:-7px}#auth0-widget button,#auth0-widget input,#auth0-widget select,#auth0-widget textarea{font-size:100%;margin:0;vertical-align:baseline;*vertical-align:middle}#auth0-widget button,#auth0-widget input{line-height:normal}#auth0-widget button,#auth0-widget html input[type=\"button\"],#auth0-widget input[type=\"reset\"],#auth0-widget input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer;*overflow:visible}#auth0-widget button[disabled],#auth0-widget input[disabled]{cursor:default}#auth0-widget input[type=\"checkbox\"],#auth0-widget input[type=\"radio\"]{box-sizing:border-box;padding:0;*height:13px;*width:13px}#auth0-widget input[type=\"search\"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}#auth0-widget input[type=\"search\"]::-webkit-search-cancel-button,#auth0-widget input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}#auth0-widget button::-moz-focus-inner,#auth0-widget input::-moz-focus-inner{border:0;padding:0}#auth0-widget textarea{overflow:auto;vertical-align:top}#auth0-widget table{border-collapse:collapse;border-spacing:0}");

// use amd or just throught to window object.
if (typeof global.window.define == 'function' && global.window.define.amd) {
  global.window.define('auth0-widget', function () { return Auth0Widget; });
} else if (global.window) {
  global.window.Auth0Widget = Auth0Widget;
}

},{"./lib/insert-css":1,"./widget":26,"fs":15}],25:[function(require,module,exports){
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
 buf.push('<div id="auth0-widget" class="cleanslate">\n	<div class="signin">\n	    <div class="popup">\n	      	<div class="overlay">\n	        	<div id="onestep" class="panel onestep">\n	          		<header class="header">\n	            		<div class="image" style="display: none">\n	            			<img src="">\n	            		</div>\n	            		<h1>Sign In</h1>\n			            <h2 class="error" style="display: none">&nbsp;</h2>\n			            <h2 class="success" style="display: none">&nbsp;</h2>\n			            <a class="close">Close</a>\n	          		</header>\n\n	          		<div class="loading"></div>\n\n	          		<div class="loggedin">\n			            <form>\n							<span class="centered last-time"></span>\n							<div class="strategy"></div>\n							<div class="emailPassword" style="display:none">\n								<div class="email">\n									<span class="email-readonly"></span>\n									<input name="email" type="email" value="" disabled placeholder="Email" title="Email" style="display:none">\n								</div>\n								<div class="password">\n									<input name="password" type="password" value="" autofocus placeholder="Password" title="Password">\n								</div>\n								<div class="action">\n									<button type="submit" class="zocial primary next" style="width: 100%;">Sign In</button>\n								  	<button type="submit" class="spinner" style="display: none"></button>\n								  	<label class="create-account"><a href="javascript: {}" class="forgot-pass">Forgot your password?</a></label>\n								</div>\n							</div>\n							<span class="centered all">Show all</span>\n			            </form>\n	          		</div>\n\n		          	<div class="notloggedin">\n			            <form>\n			            	<div class="iconlist" style="display: none"><p style="display:none">... or sign in using</p></div>\n			              	<div class="separator" style="display: none"><span>or</span></div>\n			              	<div class="emailPassword">\n			                	<div class="email">\n			                  		<input name="email" id="signin_easy_email" type="email" required placeholder="Email" title="Email">\n			                	</div>\n			                	<div class="password" style="display:none">\n			                  		<input name="password" id="signin_easy_password" type="password" placeholder="Password" title="Password">\n			                	</div>\n				                <div class="action">\n				                  	<button type="submit" class="zocial primary next" style="width: 100%;">Sign In</button>\n				                  	<button type="submit" class="spinner" style="display: none"></button>\n				                  	<label class="create-account"><a href="javascript: {}" class="sign-up">Sign Up</a><span class="divider" style="display:none">&nbsp;•&nbsp;</span><a href="javascript: {}" class="forgot-pass">Forgot your password?</a></label>\n				                </div>\n			              	</div>\n			            </form>\n		          	</div>\n\n		          	<div class="signup">\n			            <form>\n			              	<div class="header"></div>\n			              	<div class="emailPassword">\n			                	<div class="email">\n			                  		<input name="email" id="signup_easy_email" type="email" value="" required placeholder="Email" title="Email">\n			                	</div>\n			                	<div class="password">\n			                  		<input name="password" id="signup_easy_password" type="password" value="" required placeholder="Create a Password" title="Password">\n			                	</div>\n				                <div class="action">\n				                  	<button type="submit" class="zocial primary next" style="width: 100%;">Sign Up</button>\n				                  	<button type="submit" class="spinner" style="display: none"></button>\n				                  	<div class="footer"></div>\n				                  	<div class="options">\n				                    	<a href="javascript: {}" class="centered cancel">Cancel</a>\n				                  	</div>\n				                </div>\n			              	</div>\n			            </form>\n		          	</div>\n\n					<div class="reset">\n						<form id="change_password">\n						  	<div class="header"></div>\n						  	<div class="emailPassword">\n						    	<div class="email">\n						      		<input name="email" id="reset_easy_email" type="email" value="" required placeholder="Email" title="Email">\n						    	</div>\n						    	<div class="password">\n						      		<input name="password" id="reset_easy_password" type="password" value="" required placeholder="New Password" title="New Password">\n						    	</div>\n						    	<div class="repeatPassword">\n						      		<input name="repeat_password" id="reset_easy_repeat_password" type="password" value="" required placeholder="Confirm New Password" title="Confirm New Password">\n						    	</div>\n						    	<div class="action">\n						      		<button type="submit" class="zocial primary next" style="width: 100%;">Send</button>\n						      		<button type="submit" class="spinner" style="display: none"></button>\n						      		<div class="options">\n						        		<a href="javascript: {}" class="centered cancel">Cancel</a>\n						      		</div>\n						    	</div>\n						  	</div>\n						</form>\n					</div>\n					\n	          		<footer>\n	            		<span>Powered by <a href="http://auth0.com" target="_new">Auth0</a></span>\n	          		</footer>\n	        	</div>\n	      	</div>\n	    </div>\n	</div>\n</div>\n'); })();
} 
return buf.join('');
}; return function(l) { return t(l) }}())
},{}],26:[function(require,module,exports){
var Auth0     = require('auth0-js');
var qwery     = require('qwery');
var bonzo     = require('bonzo');
var bean      = require('bean');
var xtend     = require('xtend');
var _         = require('underscore');

var mainTmpl  = require('./html/main.html');

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
Auth0Widget.prototype._setTop = function () {
  var element = $('.signin div.panel.onestep');
  
  if (!this._signinOptions.top) {
    setTimeout(function() {
      element.css({ 
        //'marginTop': '-' + (element.offset().height / 2) + 'px',
        //'top': '50%'
        'marginTop': '2px', 
        'top': '15%' 
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
  var defaultStrategy = _.filter(this._auth0Strategies, function (s) { return s.name === 'auth0'; })[0];
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

Auth0Widget.prototype._showLoadingExperience = function() {
  this._setLoginView({ mode: 'loading' });
};

Auth0Widget.prototype._setLoginView = function(options) {
  var self = this;
  options = options || {};

  $('.loading').css('display', 'none');
  $('.loggedin').css('display', 'none');
  $('.notloggedin').css('display', 'none');
  $('.signup').css('display', 'none');
  $('.reset').css('display', 'none');
  $('.signin input[type=password]').val('');

  if (!options.mode) {
    this._hasLoggedInBefore = !!options.isReturningUser;
    this._setTitle(this._signinOptions['title']);

    $(options.isReturningUser ? '.loggedin' : '.notloggedin').css('display', '');
    self._setTop();

    try { 
      if (options.isReturningUser) $('.loggedin .password input').first().focus();
      else $('.notloggedin .email input').first().focus();
    } catch(e) {}
    
    return;
  }

  var container;

  switch (options.mode) {
    case 'loading':
      this._setTitle('Please wait...');
      container = $('.loading').first();
      break;
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
    this._setTop();
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
  var self = this;
  var strategyName = typeof target === 'string' ? target : target.getAttribute('data-strategy');
  var strategy = this._getConfiguredStrategy(strategyName);

  if (strategy) {
    var loginOptions = xtend({ connection: strategy.connections[0].name }, self._signinOptions.extraParameters);
    this._auth0.login(loginOptions);
  }
};

Auth0Widget.prototype._signInEnterprise = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var self = this;
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
    var loginOptions = xtend({ connection: connection }, self._signinOptions.extraParameters);
    this._auth0.login(loginOptions);
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

  loginOptions = xtend(loginOptions, self._signinOptions.extraParameters);

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
Auth0Widget.prototype._initialize = function (cb) {
  // TODO: support css option for non free subscriptions

  var self = this;
  $().addClass('mode-signin');

  // buttons actions
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

  // labels text
  var options = xtend(this._signinOptions, this._signinOptions.resources);
  options['title'] = options['title'] || 'Sign In';
  options['allButtonTemplate'] = options['allButtonTemplate'] || "Show all";
  options['strategyEmailEmpty'] = options['strategyEmailEmpty'] || "The email is empty.";
  options['strategyEmailInvalid'] = options['strategyEmailInvalid'] || "The email is invalid.";
  options['strategyDomainInvalid'] = options['strategyDomainInvalid'] || "The domain {domain} has not been setup.";

  options['icon'] = options['icon'] || "https://d19p4zemcycm7a.cloudfront.net/w2/img/logo-32.png";
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
  if (this._signinOptions.theme) {
    $('.signin').addClass('theme-' + this._signinOptions.theme);
  }

  $('.panel a.close').css('display', this._signinOptions.standalone ? 'none' : 'block');

  // show icon
  if (this._signinOptions.showIcon) {
    $('.panel .image img').attr('src', this._signinOptions.icon);
    $('.panel .image').css('display', this._signinOptions.showIcon ? 'block' : 'none');
  }

  // activate panel
  $('div.panel').removeClass('active');
  $('div.overlay').addClass('active');
  $('div.panel.onestep').addClass('active');

  if (self._signinOptions.container) {
    $('div.active').removeClass('overlay');
  }

  $('.popup h1').html(this._signinOptions.title);
  $('.popup .invalid').removeClass('invalid');

  $('div.panel.onestep h1').html(this._signinOptions['title']);

  // show loading
  self._showLoadingExperience();
 
  // get configured strategies/connections
  self._auth0.getConnections(function (err, connections) {
    var allowedConnections = [];

    // use only specified connections
    if (self._signinOptions.connections) {
      for (var i in connections) {
        if (_.contains(self._signinOptions.connections, connections[i].name)) {
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
      self._resolveLoginView();

      if (cb && typeof cb === 'function') cb();
    });
  });
};

Auth0Widget.prototype._resolveLoginView = function () {
  var self = this;

  // if no social connections and one enterprise connection only, redirect
  if (!this._areThereAnySocialConn() && 
    this._client.strategies.length === 1 &&
    this._client.strategies[0].name !== 'auth0' &&
    this._client.strategies[0].connections.length === 1) {
    
    var loginOptions = xtend({
      connection: self._client.strategies[0].connections[0].name
    }, 
    self._signinOptions.extraParameters);
    self._auth0.login(loginOptions);

    return;
  }

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

  this._signinOptions.socialBigButtons = typeof this._signinOptions['socialBigButtons'] !== 'undefined' ? this._signinOptions['socialBigButtons'] : !this._areThereAnyEnterpriseOrDbConn();
  if (this._signinOptions.socialBigButtons) {
    $('.popup .panel.onestep .iconlist span').removeClass('icon').addClass('block');
  } else {
    $('.popup .panel.onestep .iconlist span').addClass('icon').removeClass('block');
  }

  // show signup/forgot links
  var auth0Conn = this._getAuth0Connection();
  if (auth0Conn) {
    this._signinOptions.showSignup = auth0Conn.showSignup;
    this._signinOptions.showForgot = auth0Conn.showForgot;
  }
  
  $('.panel .create-account .sign-up')
    .css('display', this._signinOptions.showSignup ? '' : 'none')
    .html(this._signinOptions.signupText);

  $('.panel .create-account .forgot-pass')
    .css('display', this._signinOptions.showForgot ? '' : 'none')
    .html(this._signinOptions.forgotText);

  if (this._signinOptions.signupLink) {
    $('.panel .create-account .sign-up')
      .attr('href', this._signinOptions.signupLink)
      .attr('target', '_parent');
  } 
  else {
    bean.on($('.panel .create-account .sign-up')[0], 'click', function (e) { self._showSignUpExperience(e); });
  }

  if (this._signinOptions.forgotLink) {
    $('.panel .create-account .forgot-pass')
      .attr('href', this._signinOptions.forgotLink)
      .attr('target', '_parent');
  } 
  else {
    $('.panel .create-account .forgot-pass').each(function (elem) {
      bean.on(elem, 'click', function (e) { self._showResetExperience(e); });
    });
  }

  // hide divider dot if there are one of two
  $('.panel .create-account .divider')
    .css('display', self._signinOptions.showEmail && self._signinOptions.showSignup && self._signinOptions.showForgot ? '' : 'none');

  $('div.panel input').each(function (e) { e.value = ''; });

  // placeholders and buttons
  $('.panel .zocial.primary').html(self._signinOptions.signInButtonText);
  $('.panel .email input').attr('placeholder', self._signinOptions.emailPlaceholder);
  $('.panel .password input').attr('placeholder', self._signinOptions.passwordPlaceholder);
  $('.panel .separator span').html(self._signinOptions.separatorText);

  // signup
  $('.panel .signup .zocial.primary').html(self._signinOptions.signupButtonText);

  $('.panel .signup .email input').each(function (i) { 
      i.setAttribute('placeholder', self._signinOptions.signupEmailPlaceholder);
      bean.on(i, 'input', function() {
        var output = {};
        if (self._isEnterpriseConnection(this.value, output)) {
          var warningText = self._signinOptions.signupEnterpriseEmailWarningText.replace(/{domain}/g, output.domain);
          this.setCustomValidity(warningText);
        } else {
          this.setCustomValidity('');
        }
      });
  });

  $('.panel .signup .password input').attr('placeholder', self._signinOptions.signupPasswordPlaceholder);

  $('.panel .signup .options .cancel').html(self._signinOptions['signupCancelButtonText']);
  bean.on($('.panel .signup .options .cancel')[0], 'click', function () { self._setLoginView(); });

  $('.panel .signup .header')
    .html(self._signinOptions.signupHeaderText)
    .attr('display', self._signinOptions.signupHeaderText ? '' : 'none');

  $('.panel .signup .footer')
    .html(self._signinOptions.signupFooterText)
    .attr('display', self._signinOptions.signupFooterText ? '' : 'none');

  // reset
  $('.panel .reset .zocial.primary').html(self._signinOptions.resetButtonText);
  $('.panel .reset .email input').attr('placeholder', self._signinOptions.resetEmailPlaceholder);
  $('.panel .reset .password input').attr('placeholder', self._signinOptions.resetPasswordPlaceholder);

  $('.panel .reset .repeatPassword input').each(function (i) { 
      i.setAttribute('placeholder', self._signinOptions.resetRepeatPasswordPlaceholder);
      bean.on(i, 'input', function() {
        if ($('.panel .reset .password input').val() != this.value) {
          this.setCustomValidity(self._signinOptions.resetEnterSamePasswordText);
        } else {
          this.setCustomValidity('');
        }
      });
  });

  $('.panel .reset .options .cancel').html(self._signinOptions.resetCancelButtonText);
  bean.on($('.panel .reset .options .cancel')[0], 'click', function () { self._setLoginView(); });

  $('.panel .reset .header')
    .html(self._signinOptions.resetHeaderText)
    .attr('display', self._signinOptions.resetHeaderText ? '' : 'none');

  // show email, password, separator and button if there are enterprise/db connections
  var anyEnterpriseOrDbConnection = self._areThereAnyEnterpriseOrDbConn();
  var anySocialConnection = self._areThereAnySocialConn();

  $('.panel .email input').css('display', self._signinOptions.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .zocial.primary').css('display', self._signinOptions.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .password input').css('display', self._signinOptions.showEmail && self._signinOptions.showPassword && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .create-account .forgot-pass').css('display', self._signinOptions.showEmail && self._signinOptions.showForgot && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .create-account .sign-up').css('display', self._signinOptions.showEmail && this._signinOptions.showSignup && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .separator').css('display', self._signinOptions.showEmail && anyEnterpriseOrDbConnection && anySocialConnection ? '' : 'none');
  $('.panel .last-time').html(self._signinOptions.returnUserLabel);

  // if user logged in show logged in experience
  if (self._ssoData.sso) {
    if (self._ssoData.lastUsedUsername) {
      $('div.panel.onestep input').val(self._ssoData.lastUsedUsername);
      self._showOrHidePassword();
    }

    if (self._signinOptions['enableReturnUserExperience']) { 
      self._showLoggedInExperience();
      return;
    }
  }

  self._setLoginView({ isReturningUser: self._ssoData.sso });
};

Auth0Widget.prototype._getConfiguredStrategies = function (conns) {
  var strategies = [];
  for (var conn in conns) {
    if (typeof(conns[conn].status) !== 'undefined' && !conns[conn].status) continue;

    var strategy = _.filter(strategies, function (s) { 
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
  self._signinOptions = xtend(self._options, signinOptions);
  self._auth0Strategies = [];

  // widget container
  if (self._signinOptions.container) {
    self._signinOptions.theme = 'static';
    self._signinOptions.standalone = true;
    self._signinOptions.top = true;

    var specifiedContainer = document.getElementById(self._signinOptions.container);
    specifiedContainer.innerHTML = mainTmpl();
  }
  else {
    // remove widget container (if exist)
    $().parent().remove();

    var div = document.createElement('div');
    div.innerHTML = mainTmpl();
    document.body.appendChild(div);
  }
  
  self._initialize(callback);
};

module.exports = Auth0Widget;

},{"./html/main.html":25,"auth0-js":2,"bean":13,"bonzo":14,"qwery":16,"underscore":17,"xtend":19}],27:[function(require,module,exports){
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
},{}]},{},[27,24])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9saWIvaW5zZXJ0LWNzcy5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvTG9naW5FcnJvci5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvYXNzZXJ0X3JlcXVpcmVkLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL2xpYi9iYXNlNjRfdXJsX2RlY29kZS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvanNvbl9wYXJzZS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvdXNlX2pzb25wLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9CYXNlNjQvYmFzZTY0LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9qc29ucC9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvanNvbnAvbm9kZV9tb2R1bGVzL2RlYnVnL2RlYnVnLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9xcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2JlYW4vYmVhbi5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9ib256by9ib256by5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZnMuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvcXdlcnkvcXdlcnkuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL2hhcy1rZXlzLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL2luZGV4LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9mb3JlYWNoLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9ub2RlX21vZHVsZXMvb2JqZWN0LWtleXMvaXNBcmd1bWVudHMuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMveHRlbmQvbm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL3NoaW0uanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9zdGFuZGFsb25lLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvd2lkZ2V0L2h0bWwvbWFpbi5odG1sIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvd2lkZ2V0L2luZGV4LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvd2lkZ2V0L2pzL3BsYWNlaG9sZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqb0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3QzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gICAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgICB9XG5cbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbn07XG4iLCJ2YXIgZ2xvYmFsPXR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fTt2YXIgYXNzZXJ0X3JlcXVpcmVkICAgPSByZXF1aXJlKCcuL2xpYi9hc3NlcnRfcmVxdWlyZWQnKTtcbnZhciBiYXNlNjRfdXJsX2RlY29kZSA9IHJlcXVpcmUoJy4vbGliL2Jhc2U2NF91cmxfZGVjb2RlJyk7XG52YXIgcXMgICAgICAgICAgICAgICAgPSByZXF1aXJlKCdxcycpO1xudmFyIHJlcXdlc3QgICAgICAgICAgID0gcmVxdWlyZSgncmVxd2VzdCcpO1xuXG52YXIganNvbnAgICAgICAgICAgICAgPSByZXF1aXJlKCdqc29ucCcpO1xuXG52YXIgdXNlX2pzb25wICAgICAgICAgPSByZXF1aXJlKCcuL2xpYi91c2VfanNvbnAnKTtcbnZhciBMb2dpbkVycm9yICAgICAgICA9IHJlcXVpcmUoJy4vbGliL0xvZ2luRXJyb3InKTtcbnZhciBqc29uX3BhcnNlICAgICAgICA9IHJlcXVpcmUoJy4vbGliL2pzb25fcGFyc2UnKTtcblxuZnVuY3Rpb24gQXV0aDAgKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEF1dGgwKSkge1xuICAgIHJldHVybiBuZXcgQXV0aDAob3B0aW9ucyk7XG4gIH1cblxuICBhc3NlcnRfcmVxdWlyZWQob3B0aW9ucywgJ2NsaWVudElEJyk7XG4gIGFzc2VydF9yZXF1aXJlZChvcHRpb25zLCAnY2FsbGJhY2tVUkwnKTtcbiAgYXNzZXJ0X3JlcXVpcmVkKG9wdGlvbnMsICdkb21haW4nKTtcblxuICB0aGlzLl9jbGllbnRJRCA9IG9wdGlvbnMuY2xpZW50SUQ7XG4gIHRoaXMuX2NhbGxiYWNrVVJMID0gb3B0aW9ucy5jYWxsYmFja1VSTDtcbiAgdGhpcy5fZG9tYWluID0gb3B0aW9ucy5kb21haW47XG4gIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICB0aGlzLnBhcnNlSGFzaChvcHRpb25zLnN1Y2Nlc3MpO1xuICB9XG4gIHRoaXMuX2ZhaWx1cmUgPSBvcHRpb25zLmZhaWx1cmU7XG59XG5cbkF1dGgwLnByb3RvdHlwZS5fcmVkaXJlY3QgPSBmdW5jdGlvbiAodXJsKSB7XG4gIGdsb2JhbC53aW5kb3cubG9jYXRpb24gPSB1cmw7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuX3JlbmRlckFuZFN1Ym1pdFdTRmVkRm9ybSA9IGZ1bmN0aW9uIChmb3JtSHRtbCkge1xuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBmb3JtSHRtbDtcbiAgdmFyIGZvcm0gPSBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdikuY2hpbGRyZW5bMF07XG4gIGZvcm0uc3VibWl0KCk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuX2lzQWRMZGFwQ29ubmVjdGlvbiA9IGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4gIHJldHVybiBjb25uZWN0aW9uID09PSAnYWRsZGFwJztcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5wYXJzZUhhc2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYoIXdpbmRvdy5sb2NhdGlvbi5oYXNoLm1hdGNoKC9hY2Nlc3NfdG9rZW4vKSkgcmV0dXJuO1xuICB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcbiAgdmFyIHBhcnNlZF9xcyA9IHFzLnBhcnNlKGhhc2gpO1xuICB2YXIgaWRfdG9rZW4gPSBwYXJzZWRfcXMuaWRfdG9rZW47XG4gIHZhciBlbmNvZGVkID0gaWRfdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgdmFyIHByb2YgPSBqc29uX3BhcnNlKGJhc2U2NF91cmxfZGVjb2RlKGVuY29kZWQpKTtcbiAgY2FsbGJhY2socHJvZiwgaWRfdG9rZW4sIHBhcnNlZF9xcy5hY2Nlc3NfdG9rZW4sIHBhcnNlZF9xcy5zdGF0ZSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuc2lnbnVwID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgcXVlcnkgPSB7XG4gICAgcmVzcG9uc2VfdHlwZTogJ3Rva2VuJyxcbiAgICBjbGllbnRfaWQ6ICAgICB0aGlzLl9jbGllbnRJRCxcbiAgICBjb25uZWN0aW9uOiAgICBvcHRpb25zLmNvbm5lY3Rpb24sXG4gICAgcmVkaXJlY3RfdXJpOiAgdGhpcy5fY2FsbGJhY2tVUkwsXG4gICAgc2NvcGU6ICAgICAgICAgJ29wZW5pZCBwcm9maWxlJ1xuICB9O1xuXG4gIGlmIChvcHRpb25zLnN0YXRlKSB7XG4gICAgcXVlcnkuc3RhdGUgPSBvcHRpb25zLnN0YXRlO1xuICB9XG5cbiAgcXVlcnkuZW1haWwgPSBvcHRpb25zLnVzZXJuYW1lIHx8IG9wdGlvbnMuZW1haWw7XG4gIHF1ZXJ5LnBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZDtcblxuICBxdWVyeS50ZW5hbnQgPSB0aGlzLl9kb21haW4uc3BsaXQoJy4nKVswXTtcblxuICBmdW5jdGlvbiBzdWNjZXNzICgpIHtcbiAgICBpZiAoJ2F1dG9fbG9naW4nIGluIG9wdGlvbnMgJiYgIW9wdGlvbnMuYXV0b19sb2dpbikge1xuICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLmxvZ2luKG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZhaWwgKHN0YXR1cywgcmVzcCkge1xuICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKHN0YXR1cywgcmVzcCk7XG4gICAgaWYgKGNhbGxiYWNrKSAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcik7XG4gICAgaWYgKHNlbGYuX2ZhaWx1cmUpIHJldHVybiBzZWxmLl9mYWlsdXJlKGVycm9yKTtcbiAgfVxuXG4gIGlmICh1c2VfanNvbnAoKSkge1xuICAgIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL3NpZ251cD8nICsgcXMuc3RyaW5naWZ5KHF1ZXJ5KSwge1xuICAgICAgcGFyYW06ICdjYngnLFxuICAgICAgdGltZW91dDogMTUwMDBcbiAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBmYWlsKDAsIGVycik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcC5zdGF0dXMgPT0gMjAwID9cbiAgICAgICAgICAgICAgc3VjY2VzcygpIDpcbiAgICAgICAgICAgICAgZmFpbChyZXNwLnN0YXR1cywgcmVzcC5lcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVxd2VzdCh7XG4gICAgdXJsOiAgICAgJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvZGJjb25uZWN0aW9ucy9zaWdudXAnLFxuICAgIG1ldGhvZDogICdwb3N0JyxcbiAgICB0eXBlOiAgICAnaHRtbCcsXG4gICAgZGF0YTogICAgcXVlcnksXG4gICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICBjcm9zc09yaWdpbjogdHJ1ZVxuICB9KS5mYWlsKGZ1bmN0aW9uIChlcnIpIHtcbiAgICBmYWlsKGVyci5zdGF0dXMsIGVyci5yZXNwb25zZVRleHQpO1xuICB9KTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5jaGFuZ2VQYXNzd29yZCA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBxdWVyeSA9IHtcbiAgICB0ZW5hbnQ6ICAgICAgICAgdGhpcy5fZG9tYWluLnNwbGl0KCcuJylbMF0sXG4gICAgY29ubmVjdGlvbjogICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICBlbWFpbDogICAgICAgICAgb3B0aW9ucy51c2VybmFtZSB8fCBvcHRpb25zLmVtYWlsLFxuICAgIHBhc3N3b3JkOiAgICAgICBvcHRpb25zLnBhc3N3b3JkXG4gIH07XG5cbiAgZnVuY3Rpb24gc3VjY2VzcyAoKSB7XG4gICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmFpbCAoc3RhdHVzLCByZXNwKSB7XG4gICAgdmFyIGVycm9yID0gbmV3IExvZ2luRXJyb3Ioc3RhdHVzLCByZXNwKTtcbiAgICBpZiAoY2FsbGJhY2spICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICBpZiAoc2VsZi5fZmFpbHVyZSkgcmV0dXJuIHNlbGYuX2ZhaWx1cmUoZXJyb3IpO1xuICB9XG5cbiAgaWYgKHVzZV9qc29ucCgpKSB7XG4gICAgcmV0dXJuIGpzb25wKCdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL2RiY29ubmVjdGlvbnMvY2hhbmdlX3Bhc3N3b3JkPycgKyBxcy5zdHJpbmdpZnkocXVlcnkpLCB7XG4gICAgICBwYXJhbTogJ2NieCcsXG4gICAgICB0aW1lb3V0OiAxNTAwMFxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGZhaWwoMCwgZXJyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwLnN0YXR1cyA9PSAyMDAgP1xuICAgICAgICAgICAgICBzdWNjZXNzKCkgOlxuICAgICAgICAgICAgICBmYWlsKHJlc3Auc3RhdHVzLCByZXNwLmVycik7XG4gICAgfSk7XG4gIH1cblxuICByZXF3ZXN0KHtcbiAgICB1cmw6ICAgICAnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL2NoYW5nZV9wYXNzd29yZCcsXG4gICAgbWV0aG9kOiAgJ3Bvc3QnLFxuICAgIHR5cGU6ICAgICdodG1sJyxcbiAgICBkYXRhOiAgICBxdWVyeSxcbiAgICBzdWNjZXNzOiBzdWNjZXNzLFxuICAgIGNyb3NzT3JpZ2luOiB0cnVlXG4gIH0pLmZhaWwoZnVuY3Rpb24gKGVycikge1xuICAgIGZhaWwoZXJyLnN0YXR1cywgZXJyLnJlc3BvbnNlVGV4dCk7XG4gIH0pO1xufTtcblxuQXV0aDAucHJvdG90eXBlLmxvZ2luID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmIChvcHRpb25zLnVzZXJuYW1lIHx8IG9wdGlvbnMuZW1haWwpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbldpdGhVc2VybmFtZVBhc3N3b3JkKG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHZhciBxdWVyeSA9IHtcbiAgICByZXNwb25zZV90eXBlOiAndG9rZW4nLFxuICAgIGNsaWVudF9pZDogICAgIHRoaXMuX2NsaWVudElELFxuICAgIGNvbm5lY3Rpb246ICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICByZWRpcmVjdF91cmk6ICB0aGlzLl9jYWxsYmFja1VSTCxcbiAgICBzY29wZTogICAgICAgICAnb3BlbmlkIHByb2ZpbGUnXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuc3RhdGUpIHtcbiAgICBxdWVyeS5zdGF0ZSA9IG9wdGlvbnMuc3RhdGU7XG4gIH1cblxuICB0aGlzLl9yZWRpcmVjdCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9hdXRob3JpemU/JyArIHFzLnN0cmluZ2lmeShxdWVyeSkpO1xufTtcblxuQXV0aDAucHJvdG90eXBlLmxvZ2luV2l0aFVzZXJuYW1lUGFzc3dvcmQgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBxdWVyeSA9IHtcbiAgICByZXNwb25zZV90eXBlOiAndG9rZW4nLFxuICAgIGNsaWVudF9pZDogICAgIHRoaXMuX2NsaWVudElELFxuICAgIGNvbm5lY3Rpb246ICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICByZWRpcmVjdF91cmk6ICB0aGlzLl9jYWxsYmFja1VSTCxcbiAgICBzY29wZTogICAgICAgICAnb3BlbmlkIHByb2ZpbGUnXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuc3RhdGUpIHtcbiAgICBxdWVyeS5zdGF0ZSA9IG9wdGlvbnMuc3RhdGU7XG4gIH1cblxuICBxdWVyeS51c2VybmFtZSA9IG9wdGlvbnMudXNlcm5hbWUgfHwgb3B0aW9ucy5lbWFpbDtcbiAgcXVlcnkucGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkO1xuXG4gIHF1ZXJ5LnRlbmFudCA9IHRoaXMuX2RvbWFpbi5zcGxpdCgnLicpWzBdO1xuXG4gIGZ1bmN0aW9uIHJldHVybl9lcnJvciAoZXJyb3IpIHtcbiAgICBpZiAoY2FsbGJhY2spICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICBpZiAoc2VsZi5fZmFpbHVyZSkgcmV0dXJuIHNlbGYuX2ZhaWx1cmUoZXJyb3IpO1xuICB9XG5cbiAgdmFyIGVuZHBvaW50ID0gdGhpcy5faXNBZExkYXBDb25uZWN0aW9uKHF1ZXJ5LmNvbm5lY3Rpb24pID9cbiAgICAnL2FkbGRhcC9sb2dpbicgOiAnL2RiY29ubmVjdGlvbnMvbG9naW4nO1xuXG4gIGlmICh1c2VfanNvbnAoKSkge1xuICAgIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgZW5kcG9pbnQgKyAnPycgKyBxcy5zdHJpbmdpZnkocXVlcnkpLCB7XG4gICAgICBwYXJhbTogJ2NieCcsXG4gICAgICB0aW1lb3V0OiAxNTAwMFxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHJldHVybl9lcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgaWYoJ2Vycm9yJyBpbiByZXNwKSB7XG4gICAgICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKHJlc3Auc3RhdHVzLCByZXNwLmVycm9yKTtcbiAgICAgICAgcmV0dXJuIHJldHVybl9lcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgICBzZWxmLl9yZW5kZXJBbmRTdWJtaXRXU0ZlZEZvcm0ocmVzcC5mb3JtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcXdlc3Qoe1xuICAgIHVybDogICAgICdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyBlbmRwb2ludCxcbiAgICBtZXRob2Q6ICAncG9zdCcsXG4gICAgdHlwZTogICAgJ2h0bWwnLFxuICAgIGRhdGE6ICAgIHF1ZXJ5LFxuICAgIGNyb3NzT3JpZ2luOiB0cnVlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICBzZWxmLl9yZW5kZXJBbmRTdWJtaXRXU0ZlZEZvcm0ocmVzcCk7XG4gICAgfVxuICB9KS5mYWlsKGZ1bmN0aW9uIChlcnIpIHtcbiAgICB2YXIgZXIgPSBlcnI7XG4gICAgaWYgKCFlci5zdGF0dXMgfHwgZXIuc3RhdHVzID09PSAwKSB7IC8vaWUxMCB0cmlja1xuICAgICAgZXIgPSB7fTtcbiAgICAgIGVyLnN0YXR1cyA9IDQwMTtcbiAgICAgIGVyLnJlc3BvbnNlVGV4dCA9IHtcbiAgICAgICAgY29kZTogJ2ludmFsaWRfdXNlcl9wYXNzd29yZCdcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKGVyLnN0YXR1cywgZXIucmVzcG9uc2VUZXh0KTtcbiAgICByZXR1cm4gcmV0dXJuX2Vycm9yKGVycm9yKTtcbiAgfSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuZ2V0U1NPRGF0YSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4ganNvbnAoJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvdXNlci9zc29kYXRhJywge1xuICAgIHBhcmFtOiAnY2J4JyxcbiAgICB0aW1lb3V0OiAxNTAwMFxuICB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgY2FsbGJhY2sobnVsbCwgZXJyID/CoHt9IDogcmVzcCk7IC8vIEFsd2F5cyByZXR1cm4gT0ssIHJlZ2FyZGxlc3Mgb2YgYW55IGVycm9yc1xuICB9KTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5nZXRDb25uZWN0aW9ucyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4ganNvbnAoJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvcHVibGljL2FwaS8nICsgdGhpcy5fY2xpZW50SUQgKyAnL2Nvbm5lY3Rpb25zJywge1xuICAgIHBhcmFtOiAnY2J4JyxcbiAgICB0aW1lb3V0OiAxNTAwMFxuICB9LCBjYWxsYmFjayk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xuIiwidmFyIGpzb25fcGFyc2UgPSByZXF1aXJlKCcuL2pzb25fcGFyc2UnKTtcblxuZnVuY3Rpb24gTG9naW5FcnJvcihzdGF0dXMsIGRldGFpbHMpIHtcbiAgdmFyIG9iajtcblxuICBpZiAodHlwZW9mIGRldGFpbHMgPT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgb2JqID0ganNvbl9wYXJzZShkZXRhaWxzKTtcbiAgICB9IGNhdGNoIChlcikge1xuICAgICAgb2JqID0ge21lc3NhZ2U6IGRldGFpbHN9OyAgICAgIFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvYmogPSBkZXRhaWxzO1xuICB9XG5cbiAgdmFyIGVyciA9IEVycm9yLmNhbGwodGhpcywgb2JqLmRlc2NyaXB0aW9uIHx8IG9iai5tZXNzYWdlIHx8IG9iai5lcnJvcik7XG5cbiAgZXJyLnN0YXR1cyA9IHN0YXR1cztcbiAgZXJyLm5hbWUgPSBvYmouY29kZTtcbiAgZXJyLmNvZGUgPSBvYmouY29kZTtcbiAgZXJyLmRldGFpbHMgPSBvYmo7XG4gIFxuICBpZiAoc3RhdHVzID09PSAwKSB7XG4gICAgZXJyLmNvZGUgPSBcIlVua25vd25cIjtcbiAgICBlcnIubWVzc2FnZSA9IFwiVW5rbm93biBlcnJvci5cIjtcbiAgfVxuXG4gIHJldHVybiBlcnI7XG59XG5cbmlmIChPYmplY3QgJiYgT2JqZWN0LmNyZWF0ZSkge1xuICBMb2dpbkVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlLCB7IFxuICAgIGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBMb2dpbkVycm9yIH0gXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2luRXJyb3I7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqLCBwcm9wKSB7XG4gIGlmICghb2JqW3Byb3BdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHByb3AgKyAnIGlzIHJlcXVpcmVkLicpO1xuICB9XG59OyIsInZhciBCYXNlNjQgPSByZXF1aXJlKCdCYXNlNjQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpIHtcbiAgdmFyIG91dHB1dCA9IHN0ci5yZXBsYWNlKFwiLVwiLCBcIitcIikucmVwbGFjZShcIl9cIiwgXCIvXCIpO1xuICBzd2l0Y2ggKG91dHB1dC5sZW5ndGggJSA0KSB7XG4gICAgY2FzZSAwOlxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgb3V0cHV0ICs9IFwiPT1cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzpcbiAgICAgIG91dHB1dCArPSBcIj1cIjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBcIklsbGVnYWwgYmFzZTY0dXJsIHN0cmluZyFcIjtcbiAgfVxuICByZXR1cm4gQmFzZTY0LmF0b2Iob3V0cHV0KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiB3aW5kb3cuSlNPTiA/IHdpbmRvdy5KU09OLnBhcnNlKHN0cikgOiBldmFsKCcoJyArIHN0ciArICcpJyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgeGhyID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0ID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBudWxsO1xuICBcbiAgaWYgKHhociAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gJ1hEb21haW5SZXF1ZXN0JyBpbiB3aW5kb3cgJiYgd2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cDonO1xufTsiLCI7KGZ1bmN0aW9uICgpIHtcblxuICB2YXJcbiAgICBvYmplY3QgPSB0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiB0aGlzLCAvLyAjODogd2ViIHdvcmtlcnNcbiAgICBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPScsXG4gICAgSU5WQUxJRF9DSEFSQUNURVJfRVJSID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGZhYnJpY2F0ZSBhIHN1aXRhYmxlIGVycm9yIG9iamVjdFxuICAgICAgdHJ5IHsgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnJCcpOyB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHsgcmV0dXJuIGVycm9yOyB9fSgpKTtcblxuICAvLyBlbmNvZGVyXG4gIC8vIFtodHRwczovL2dpc3QuZ2l0aHViLmNvbS85OTkxNjZdIGJ5IFtodHRwczovL2dpdGh1Yi5jb20vbmlnbmFnXVxuICBvYmplY3QuYnRvYSB8fCAoXG4gIG9iamVjdC5idG9hID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgZm9yIChcbiAgICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG4gICAgICB2YXIgYmxvY2ssIGNoYXJDb2RlLCBpZHggPSAwLCBtYXAgPSBjaGFycywgb3V0cHV0ID0gJyc7XG4gICAgICAvLyBpZiB0aGUgbmV4dCBpbnB1dCBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG4gICAgICAvLyAgIGNoZWNrIGlmIGQgaGFzIG5vIGZyYWN0aW9uYWwgZGlnaXRzXG4gICAgICBpbnB1dC5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG4gICAgICAvLyBcIjggLSBpZHggJSAxICogOFwiIGdlbmVyYXRlcyB0aGUgc2VxdWVuY2UgMiwgNCwgNiwgOFxuICAgICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICAgKSB7XG4gICAgICBjaGFyQ29kZSA9IGlucHV0LmNoYXJDb2RlQXQoaWR4ICs9IDMvNCk7XG4gICAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB0aHJvdyBJTlZBTElEX0NIQVJBQ1RFUl9FUlI7XG4gICAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSk7XG5cbiAgLy8gZGVjb2RlclxuICAvLyBbaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTAyMDM5Nl0gYnkgW2h0dHBzOi8vZ2l0aHViLmNvbS9hdGtdXG4gIG9iamVjdC5hdG9iIHx8IChcbiAgb2JqZWN0LmF0b2IgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoLz0rJC8sICcnKVxuICAgIGlmIChpbnB1dC5sZW5ndGggJSA0ID09IDEpIHRocm93IElOVkFMSURfQ0hBUkFDVEVSX0VSUjtcbiAgICBmb3IgKFxuICAgICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJzXG4gICAgICB2YXIgYmMgPSAwLCBicywgYnVmZmVyLCBpZHggPSAwLCBvdXRwdXQgPSAnJztcbiAgICAgIC8vIGdldCBuZXh0IGNoYXJhY3RlclxuICAgICAgYnVmZmVyID0gaW5wdXQuY2hhckF0KGlkeCsrKTtcbiAgICAgIC8vIGNoYXJhY3RlciBmb3VuZCBpbiB0YWJsZT8gaW5pdGlhbGl6ZSBiaXQgc3RvcmFnZSBhbmQgYWRkIGl0cyBhc2NpaSB2YWx1ZTtcbiAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgLy8gYW5kIGlmIG5vdCBmaXJzdCBvZiBlYWNoIDQgY2hhcmFjdGVycyxcbiAgICAgICAgLy8gY29udmVydCB0aGUgZmlyc3QgOCBiaXRzIHRvIG9uZSBhc2NpaSBjaGFyYWN0ZXJcbiAgICAgICAgYmMrKyAlIDQpID8gb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMjU1ICYgYnMgPj4gKC0yICogYmMgJiA2KSkgOiAwXG4gICAgKSB7XG4gICAgICAvLyB0cnkgdG8gZmluZCBjaGFyYWN0ZXIgaW4gdGFibGUgKDAtNjMsIG5vdCBmb3VuZCA9PiAtMSlcbiAgICAgIGJ1ZmZlciA9IGNoYXJzLmluZGV4T2YoYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSk7XG5cbn0oKSk7XG4iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llc1xuICovXG5cbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2pzb25wJyk7XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBqc29ucDtcblxuLyoqXG4gKiBDYWxsYmFjayBpbmRleC5cbiAqL1xuXG52YXIgY291bnQgPSAwO1xuXG4vKipcbiAqIE5vb3AgZnVuY3Rpb24uXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogSlNPTlAgaGFuZGxlclxuICpcbiAqIE9wdGlvbnM6XG4gKiAgLSBwYXJhbSB7U3RyaW5nfSBxcyBwYXJhbWV0ZXIgKGBjYWxsYmFja2ApXG4gKiAgLSB0aW1lb3V0IHtOdW1iZXJ9IGhvdyBsb25nIGFmdGVyIGEgdGltZW91dCBlcnJvciBpcyBlbWl0dGVkIChgNjAwMDBgKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufSBvcHRpb25hbCBvcHRpb25zIC8gY2FsbGJhY2tcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbmFsIGNhbGxiYWNrXG4gKi9cblxuZnVuY3Rpb24ganNvbnAodXJsLCBvcHRzLCBmbil7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBvcHRzKSB7XG4gICAgZm4gPSBvcHRzO1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIHZhciBvcHRzID0gb3B0cyB8fCB7fTtcbiAgdmFyIHBhcmFtID0gb3B0cy5wYXJhbSB8fCAnY2FsbGJhY2snO1xuICB2YXIgdGltZW91dCA9IG51bGwgIT0gb3B0cy50aW1lb3V0ID8gb3B0cy50aW1lb3V0IDogNjAwMDA7XG4gIHZhciBlbmMgPSBlbmNvZGVVUklDb21wb25lbnQ7XG4gIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gIHZhciBzY3JpcHQ7XG4gIHZhciB0aW1lcjtcblxuICAvLyBnZW5lcmF0ZSBhIHVuaXF1ZSBpZCBmb3IgdGhpcyByZXF1ZXN0XG4gIHZhciBpZCA9IGNvdW50Kys7XG5cbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIGNsZWFudXAoKTtcbiAgICAgIGZuICYmIGZuKG5ldyBFcnJvcignVGltZW91dCcpKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFudXAoKXtcbiAgICB0YXJnZXQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgIHdpbmRvd1snX19qcCcgKyBpZF0gPSBub29wO1xuICB9XG5cbiAgd2luZG93WydfX2pwJyArIGlkXSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIGRlYnVnKCdqc29ucCBnb3QnLCBkYXRhKTtcbiAgICBpZiAodGltZXIpIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgY2xlYW51cCgpO1xuICAgIGZuICYmIGZuKG51bGwsIGRhdGEpO1xuICB9O1xuXG4gIC8vIGFkZCBxcyBjb21wb25lbnRcbiAgdXJsICs9ICh+dXJsLmluZGV4T2YoJz8nKSA/ICcmJyA6ICc/JykgKyBwYXJhbSArICc9JyArIGVuYygnX19qcCcgKyBpZCArICcnKTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoJz8mJywgJz8nKTtcblxuICBkZWJ1ZygnanNvbnAgcmVxIFwiJXNcIicsIHVybCk7XG5cbiAgLy8gY3JlYXRlIHNjcmlwdFxuICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LnNyYyA9IHVybDtcbiAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgdGFyZ2V0KTtcbn07XG4iLCJcbi8qKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZGVidWc7XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtUeXBlfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZWJ1ZyhuYW1lKSB7XG4gIGlmICghZGVidWcuZW5hYmxlZChuYW1lKSkgcmV0dXJuIGZ1bmN0aW9uKCl7fTtcblxuICByZXR1cm4gZnVuY3Rpb24oZm10KXtcbiAgICB2YXIgY3VyciA9IG5ldyBEYXRlO1xuICAgIHZhciBtcyA9IGN1cnIgLSAoZGVidWdbbmFtZV0gfHwgY3Vycik7XG4gICAgZGVidWdbbmFtZV0gPSBjdXJyO1xuXG4gICAgZm10ID0gbmFtZVxuICAgICAgKyAnICdcbiAgICAgICsgZm10XG4gICAgICArICcgKycgKyBkZWJ1Zy5odW1hbml6ZShtcyk7XG5cbiAgICAvLyBUaGlzIGhhY2tlcnkgaXMgcmVxdWlyZWQgZm9yIElFOFxuICAgIC8vIHdoZXJlIGBjb25zb2xlLmxvZ2AgZG9lc24ndCBoYXZlICdhcHBseSdcbiAgICB3aW5kb3cuY29uc29sZVxuICAgICAgJiYgY29uc29sZS5sb2dcbiAgICAgICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHMpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcy5cbiAqL1xuXG5kZWJ1Zy5uYW1lcyA9IFtdO1xuZGVidWcuc2tpcHMgPSBbXTtcblxuLyoqXG4gKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gKiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmRlYnVnLmVuYWJsZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdHJ5IHtcbiAgICBsb2NhbFN0b3JhZ2UuZGVidWcgPSBuYW1lO1xuICB9IGNhdGNoKGUpe31cblxuICB2YXIgc3BsaXQgPSAobmFtZSB8fCAnJykuc3BsaXQoL1tcXHMsXSsvKVxuICAgICwgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBuYW1lID0gc3BsaXRbaV0ucmVwbGFjZSgnKicsICcuKj8nKTtcbiAgICBpZiAobmFtZVswXSA9PT0gJy0nKSB7XG4gICAgICBkZWJ1Zy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZS5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBkZWJ1Zy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZSArICckJykpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBEaXNhYmxlIGRlYnVnIG91dHB1dC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmRlYnVnLmRpc2FibGUgPSBmdW5jdGlvbigpe1xuICBkZWJ1Zy5lbmFibGUoJycpO1xufTtcblxuLyoqXG4gKiBIdW1hbml6ZSB0aGUgZ2l2ZW4gYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbVxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZGVidWcuaHVtYW5pemUgPSBmdW5jdGlvbihtcykge1xuICB2YXIgc2VjID0gMTAwMFxuICAgICwgbWluID0gNjAgKiAxMDAwXG4gICAgLCBob3VyID0gNjAgKiBtaW47XG5cbiAgaWYgKG1zID49IGhvdXIpIHJldHVybiAobXMgLyBob3VyKS50b0ZpeGVkKDEpICsgJ2gnO1xuICBpZiAobXMgPj0gbWluKSByZXR1cm4gKG1zIC8gbWluKS50b0ZpeGVkKDEpICsgJ20nO1xuICBpZiAobXMgPj0gc2VjKSByZXR1cm4gKG1zIC8gc2VjIHwgMCkgKyAncyc7XG4gIHJldHVybiBtcyArICdtcyc7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZGVidWcuZW5hYmxlZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRlYnVnLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGRlYnVnLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRlYnVnLm5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGRlYnVnLm5hbWVzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBwZXJzaXN0XG5cbmlmICh3aW5kb3cubG9jYWxTdG9yYWdlKSBkZWJ1Zy5lbmFibGUobG9jYWxTdG9yYWdlLmRlYnVnKTtcbiIsIi8qKlxuICogT2JqZWN0I3RvU3RyaW5nKCkgcmVmIGZvciBzdHJpbmdpZnkoKS5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIE9iamVjdCNoYXNPd25Qcm9wZXJ0eSByZWZcbiAqL1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIHNlZSBpc3N1ZSAjNzBcbiAqL1xudmFyIGlzUmVzdG9yYWJsZVByb3RvID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIG87XG5cbiAgaWYgKCFPYmplY3QuY3JlYXRlKSByZXR1cm4gZmFsc2U7XG5cbiAgbyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIG8uX19wcm90b19fID0gT2JqZWN0LnByb3RvdHlwZTtcblxuICByZXR1cm4gby5oYXNPd25Qcm9wZXJ0eSA9PT0gaGFzT3duUHJvcGVydHk7XG59KSgpO1xuXG4vKipcbiAqIEFycmF5I2luZGV4T2Ygc2hpbS5cbiAqL1xuXG52YXIgaW5kZXhPZiA9IHR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJ1xuICA/IGZ1bmN0aW9uKGFyciwgZWwpIHsgcmV0dXJuIGFyci5pbmRleE9mKGVsKTsgfVxuICA6IGZ1bmN0aW9uKGFyciwgZWwpIHtcbiAgICAgIGlmICh0eXBlb2YgYXJyID09ICdzdHJpbmcnICYmIHR5cGVvZiBcImFcIlswXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBhcnIgPSBhcnIuc3BsaXQoJycpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFycltpXSA9PT0gZWwpIHJldHVybiBpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbi8qKlxuICogQXJyYXkuaXNBcnJheSBzaGltLlxuICovXG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuLyoqXG4gKiBPYmplY3Qua2V5cyBzaGltLlxuICovXG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gIHZhciByZXQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbi8qKlxuICogQXJyYXkjZm9yRWFjaCBzaGltLlxuICovXG5cbnZhciBmb3JFYWNoID0gdHlwZW9mIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID09PSAnZnVuY3Rpb24nXG4gID8gZnVuY3Rpb24oYXJyLCBmbikgeyByZXR1cm4gYXJyLmZvckVhY2goZm4pOyB9XG4gIDogZnVuY3Rpb24oYXJyLCBmbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGZuKGFycltpXSk7XG4gICAgfTtcblxuLyoqXG4gKiBBcnJheSNyZWR1Y2Ugc2hpbS5cbiAqL1xuXG52YXIgcmVkdWNlID0gZnVuY3Rpb24oYXJyLCBmbiwgaW5pdGlhbCkge1xuICBpZiAodHlwZW9mIGFyci5yZWR1Y2UgPT09ICdmdW5jdGlvbicpIHJldHVybiBhcnIucmVkdWNlKGZuLCBpbml0aWFsKTtcbiAgdmFyIHJlcyA9IGluaXRpYWw7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSByZXMgPSBmbihyZXMsIGFycltpXSk7XG4gIHJldHVybiByZXM7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIG51bGxhcnkgb2JqZWN0IGlmIHBvc3NpYmxlXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0KCkge1xuICByZXR1cm4gaXNSZXN0b3JhYmxlUHJvdG9cbiAgICA/IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICA6IHt9O1xufVxuXG4vKipcbiAqIENhY2hlIG5vbi1pbnRlZ2VyIHRlc3QgcmVnZXhwLlxuICovXG5cbnZhciBpc2ludCA9IC9eWzAtOV0rJC87XG5cbmZ1bmN0aW9uIHByb21vdGUocGFyZW50LCBrZXkpIHtcbiAgaWYgKHBhcmVudFtrZXldLmxlbmd0aCA9PSAwKSByZXR1cm4gcGFyZW50W2tleV0gPSBjcmVhdGVPYmplY3QoKTtcbiAgdmFyIHQgPSBjcmVhdGVPYmplY3QoKTtcbiAgZm9yICh2YXIgaSBpbiBwYXJlbnRba2V5XSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudFtrZXldLCBpKSkge1xuICAgICAgdFtpXSA9IHBhcmVudFtrZXldW2ldO1xuICAgIH1cbiAgfVxuICBwYXJlbnRba2V5XSA9IHQ7XG4gIHJldHVybiB0O1xufVxuXG5mdW5jdGlvbiBwYXJzZShwYXJ0cywgcGFyZW50LCBrZXksIHZhbCkge1xuICB2YXIgcGFydCA9IHBhcnRzLnNoaWZ0KCk7XG4gIC8vIGVuZFxuICBpZiAoIXBhcnQpIHtcbiAgICBpZiAoaXNBcnJheShwYXJlbnRba2V5XSkpIHtcbiAgICAgIHBhcmVudFtrZXldLnB1c2godmFsKTtcbiAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBwYXJlbnRba2V5XSkge1xuICAgICAgcGFyZW50W2tleV0gPSB2YWw7XG4gICAgfSBlbHNlIGlmICgndW5kZWZpbmVkJyA9PSB0eXBlb2YgcGFyZW50W2tleV0pIHtcbiAgICAgIHBhcmVudFtrZXldID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRba2V5XSA9IFtwYXJlbnRba2V5XSwgdmFsXTtcbiAgICB9XG4gICAgLy8gYXJyYXlcbiAgfSBlbHNlIHtcbiAgICB2YXIgb2JqID0gcGFyZW50W2tleV0gPSBwYXJlbnRba2V5XSB8fCBbXTtcbiAgICBpZiAoJ10nID09IHBhcnQpIHtcbiAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgaWYgKCcnICE9IHZhbCkgb2JqLnB1c2godmFsKTtcbiAgICAgIH0gZWxzZSBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIG9iaikge1xuICAgICAgICBvYmpbb2JqZWN0S2V5cyhvYmopLmxlbmd0aF0gPSB2YWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmogPSBwYXJlbnRba2V5XSA9IFtwYXJlbnRba2V5XSwgdmFsXTtcbiAgICAgIH1cbiAgICAgIC8vIHByb3BcbiAgICB9IGVsc2UgaWYgKH5pbmRleE9mKHBhcnQsICddJykpIHtcbiAgICAgIHBhcnQgPSBwYXJ0LnN1YnN0cigwLCBwYXJ0Lmxlbmd0aCAtIDEpO1xuICAgICAgaWYgKCFpc2ludC50ZXN0KHBhcnQpICYmIGlzQXJyYXkob2JqKSkgb2JqID0gcHJvbW90ZShwYXJlbnQsIGtleSk7XG4gICAgICBwYXJzZShwYXJ0cywgb2JqLCBwYXJ0LCB2YWwpO1xuICAgICAgLy8ga2V5XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghaXNpbnQudGVzdChwYXJ0KSAmJiBpc0FycmF5KG9iaikpIG9iaiA9IHByb21vdGUocGFyZW50LCBrZXkpO1xuICAgICAgcGFyc2UocGFydHMsIG9iaiwgcGFydCwgdmFsKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZSBwYXJlbnQga2V5L3ZhbCBwYWlyLlxuICovXG5cbmZ1bmN0aW9uIG1lcmdlKHBhcmVudCwga2V5LCB2YWwpe1xuICBpZiAofmluZGV4T2Yoa2V5LCAnXScpKSB7XG4gICAgdmFyIHBhcnRzID0ga2V5LnNwbGl0KCdbJylcbiAgICAgICwgbGVuID0gcGFydHMubGVuZ3RoXG4gICAgICAsIGxhc3QgPSBsZW4gLSAxO1xuICAgIHBhcnNlKHBhcnRzLCBwYXJlbnQsICdiYXNlJywgdmFsKTtcbiAgICAvLyBvcHRpbWl6ZVxuICB9IGVsc2Uge1xuICAgIGlmICghaXNpbnQudGVzdChrZXkpICYmIGlzQXJyYXkocGFyZW50LmJhc2UpKSB7XG4gICAgICB2YXIgdCA9IGNyZWF0ZU9iamVjdCgpO1xuICAgICAgZm9yICh2YXIgayBpbiBwYXJlbnQuYmFzZSkgdFtrXSA9IHBhcmVudC5iYXNlW2tdO1xuICAgICAgcGFyZW50LmJhc2UgPSB0O1xuICAgIH1cbiAgICBzZXQocGFyZW50LmJhc2UsIGtleSwgdmFsKTtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnQ7XG59XG5cbi8qKlxuICogQ29tcGFjdCBzcGFyc2UgYXJyYXlzLlxuICovXG5cbmZ1bmN0aW9uIGNvbXBhY3Qob2JqKSB7XG4gIGlmICgnb2JqZWN0JyAhPSB0eXBlb2Ygb2JqKSByZXR1cm4gb2JqO1xuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICB2YXIgcmV0ID0gW107XG5cbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkge1xuICAgICAgICByZXQucHVzaChvYmpbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgb2JqW2tleV0gPSBjb21wYWN0KG9ialtrZXldKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogUmVzdG9yZSBPYmplY3QucHJvdG90eXBlLlxuICogc2VlIHB1bGwtcmVxdWVzdCAjNThcbiAqL1xuXG5mdW5jdGlvbiByZXN0b3JlUHJvdG8ob2JqKSB7XG4gIGlmICghaXNSZXN0b3JhYmxlUHJvdG8pIHJldHVybiBvYmo7XG4gIGlmIChpc0FycmF5KG9iaikpIHJldHVybiBvYmo7XG4gIGlmIChvYmogJiYgJ29iamVjdCcgIT0gdHlwZW9mIG9iaikgcmV0dXJuIG9iajtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICBvYmpba2V5XSA9IHJlc3RvcmVQcm90byhvYmpba2V5XSk7XG4gICAgfVxuICB9XG5cbiAgb2JqLl9fcHJvdG9fXyA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIG9iai5cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZU9iamVjdChvYmope1xuICB2YXIgcmV0ID0geyBiYXNlOiB7fSB9O1xuXG4gIGZvckVhY2gob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihuYW1lKXtcbiAgICBtZXJnZShyZXQsIG5hbWUsIG9ialtuYW1lXSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb21wYWN0KHJldC5iYXNlKTtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gc3RyLlxuICovXG5cbmZ1bmN0aW9uIHBhcnNlU3RyaW5nKHN0cil7XG4gIHZhciByZXQgPSByZWR1Y2UoU3RyaW5nKHN0cikuc3BsaXQoJyYnKSwgZnVuY3Rpb24ocmV0LCBwYWlyKXtcbiAgICB2YXIgZXFsID0gaW5kZXhPZihwYWlyLCAnPScpXG4gICAgICAsIGJyYWNlID0gbGFzdEJyYWNlSW5LZXkocGFpcilcbiAgICAgICwga2V5ID0gcGFpci5zdWJzdHIoMCwgYnJhY2UgfHwgZXFsKVxuICAgICAgLCB2YWwgPSBwYWlyLnN1YnN0cihicmFjZSB8fCBlcWwsIHBhaXIubGVuZ3RoKVxuICAgICAgLCB2YWwgPSB2YWwuc3Vic3RyKGluZGV4T2YodmFsLCAnPScpICsgMSwgdmFsLmxlbmd0aCk7XG5cbiAgICAvLyA/Zm9vXG4gICAgaWYgKCcnID09IGtleSkga2V5ID0gcGFpciwgdmFsID0gJyc7XG4gICAgaWYgKCcnID09IGtleSkgcmV0dXJuIHJldDtcblxuICAgIHJldHVybiBtZXJnZShyZXQsIGRlY29kZShrZXkpLCBkZWNvZGUodmFsKSk7XG4gIH0sIHsgYmFzZTogY3JlYXRlT2JqZWN0KCkgfSkuYmFzZTtcblxuICByZXR1cm4gcmVzdG9yZVByb3RvKGNvbXBhY3QocmV0KSk7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIHF1ZXJ5IGBzdHJgIG9yIGBvYmpgLCByZXR1cm5pbmcgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgfCB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uKHN0cil7XG4gIGlmIChudWxsID09IHN0ciB8fCAnJyA9PSBzdHIpIHJldHVybiB7fTtcbiAgcmV0dXJuICdvYmplY3QnID09IHR5cGVvZiBzdHJcbiAgICA/IHBhcnNlT2JqZWN0KHN0cilcbiAgICA6IHBhcnNlU3RyaW5nKHN0cik7XG59O1xuXG4vKipcbiAqIFR1cm4gdGhlIGdpdmVuIGBvYmpgIGludG8gYSBxdWVyeSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnZhciBzdHJpbmdpZnkgPSBleHBvcnRzLnN0cmluZ2lmeSA9IGZ1bmN0aW9uKG9iaiwgcHJlZml4KSB7XG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICByZXR1cm4gc3RyaW5naWZ5QXJyYXkob2JqLCBwcmVmaXgpO1xuICB9IGVsc2UgaWYgKCdbb2JqZWN0IE9iamVjdF0nID09IHRvU3RyaW5nLmNhbGwob2JqKSkge1xuICAgIHJldHVybiBzdHJpbmdpZnlPYmplY3Qob2JqLCBwcmVmaXgpO1xuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBvYmopIHtcbiAgICByZXR1cm4gc3RyaW5naWZ5U3RyaW5nKG9iaiwgcHJlZml4KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhvYmopKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTdHJpbmdpZnkgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVN0cmluZyhzdHIsIHByZWZpeCkge1xuICBpZiAoIXByZWZpeCkgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5naWZ5IGV4cGVjdHMgYW4gb2JqZWN0Jyk7XG4gIHJldHVybiBwcmVmaXggKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyKTtcbn1cblxuLyoqXG4gKiBTdHJpbmdpZnkgdGhlIGdpdmVuIGBhcnJgLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc3RyaW5naWZ5QXJyYXkoYXJyLCBwcmVmaXgpIHtcbiAgdmFyIHJldCA9IFtdO1xuICBpZiAoIXByZWZpeCkgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5naWZ5IGV4cGVjdHMgYW4gb2JqZWN0Jyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgcmV0LnB1c2goc3RyaW5naWZ5KGFycltpXSwgcHJlZml4ICsgJ1snICsgaSArICddJykpO1xuICB9XG4gIHJldHVybiByZXQuam9pbignJicpO1xufVxuXG4vKipcbiAqIFN0cmluZ2lmeSB0aGUgZ2l2ZW4gYG9iamAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc3RyaW5naWZ5T2JqZWN0KG9iaiwgcHJlZml4KSB7XG4gIHZhciByZXQgPSBbXVxuICAgICwga2V5cyA9IG9iamVjdEtleXMob2JqKVxuICAgICwga2V5O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoJycgPT0ga2V5KSBjb250aW51ZTtcbiAgICBpZiAobnVsbCA9PSBvYmpba2V5XSkge1xuICAgICAgcmV0LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXQucHVzaChzdHJpbmdpZnkob2JqW2tleV0sIHByZWZpeFxuICAgICAgICA/IHByZWZpeCArICdbJyArIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJ10nXG4gICAgICAgIDogZW5jb2RlVVJJQ29tcG9uZW50KGtleSkpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0LmpvaW4oJyYnKTtcbn1cblxuLyoqXG4gKiBTZXQgYG9iamAncyBga2V5YCB0byBgdmFsYCByZXNwZWN0aW5nXG4gKiB0aGUgd2VpcmQgYW5kIHdvbmRlcmZ1bCBzeW50YXggb2YgYSBxcyxcbiAqIHdoZXJlIFwiZm9vPWJhciZmb289YmF6XCIgYmVjb21lcyBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZXQob2JqLCBrZXksIHZhbCkge1xuICB2YXIgdiA9IG9ialtrZXldO1xuICBpZiAodW5kZWZpbmVkID09PSB2KSB7XG4gICAgb2JqW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh2KSkge1xuICAgIHYucHVzaCh2YWwpO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gW3YsIHZhbF07XG4gIH1cbn1cblxuLyoqXG4gKiBMb2NhdGUgbGFzdCBicmFjZSBpbiBgc3RyYCB3aXRoaW4gdGhlIGtleS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsYXN0QnJhY2VJbktleShzdHIpIHtcbiAgdmFyIGxlbiA9IHN0ci5sZW5ndGhcbiAgICAsIGJyYWNlXG4gICAgLCBjO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYyA9IHN0cltpXTtcbiAgICBpZiAoJ10nID09IGMpIGJyYWNlID0gZmFsc2U7XG4gICAgaWYgKCdbJyA9PSBjKSBicmFjZSA9IHRydWU7XG4gICAgaWYgKCc9JyA9PSBjICYmICFicmFjZSkgcmV0dXJuIGk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWNvZGUgYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZGVjb2RlKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuIiwiLyohIHZlcnNpb246IDAuOS4xICovXG4vKiFcbiAgKiBSZXF3ZXN0ISBBIGdlbmVyYWwgcHVycG9zZSBYSFIgY29ubmVjdGlvbiBtYW5hZ2VyXG4gICogKGMpIER1c3RpbiBEaWF6IDIwMTNcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL3JlcXdlc3RcbiAgKiBsaWNlbnNlIE1JVFxuICAqL1xuIWZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSgncmVxd2VzdCcsIHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICB2YXIgd2luID0gd2luZG93XG4gICAgLCBkb2MgPSBkb2N1bWVudFxuICAgICwgdHdvSHVuZG8gPSAvXjIwXFxkJC9cbiAgICAsIGJ5VGFnID0gJ2dldEVsZW1lbnRzQnlUYWdOYW1lJ1xuICAgICwgcmVhZHlTdGF0ZSA9ICdyZWFkeVN0YXRlJ1xuICAgICwgY29udGVudFR5cGUgPSAnQ29udGVudC1UeXBlJ1xuICAgICwgcmVxdWVzdGVkV2l0aCA9ICdYLVJlcXVlc3RlZC1XaXRoJ1xuICAgICwgaGVhZCA9IGRvY1tieVRhZ10oJ2hlYWQnKVswXVxuICAgICwgdW5pcWlkID0gMFxuICAgICwgY2FsbGJhY2tQcmVmaXggPSAncmVxd2VzdF8nICsgKCtuZXcgRGF0ZSgpKVxuICAgICwgbGFzdFZhbHVlIC8vIGRhdGEgc3RvcmVkIGJ5IHRoZSBtb3N0IHJlY2VudCBKU09OUCBjYWxsYmFja1xuICAgICwgeG1sSHR0cFJlcXVlc3QgPSAnWE1MSHR0cFJlcXVlc3QnXG4gICAgLCB4RG9tYWluUmVxdWVzdCA9ICdYRG9tYWluUmVxdWVzdCdcbiAgICAsIG5vb3AgPSBmdW5jdGlvbiAoKSB7fVxuXG4gICAgLCBpc0FycmF5ID0gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IEFycmF5LmlzQXJyYXlcbiAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGEgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgIH1cblxuICAgICwgZGVmYXVsdEhlYWRlcnMgPSB7XG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICwgcmVxdWVzdGVkV2l0aDogeG1sSHR0cFJlcXVlc3RcbiAgICAgICAgLCBhY2NlcHQ6IHtcbiAgICAgICAgICAgICAgJyonOiAgJ3RleHQvamF2YXNjcmlwdCwgdGV4dC9odG1sLCBhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sLCAqLyonXG4gICAgICAgICAgICAsIHhtbDogICdhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sJ1xuICAgICAgICAgICAgLCBodG1sOiAndGV4dC9odG1sJ1xuICAgICAgICAgICAgLCB0ZXh0OiAndGV4dC9wbGFpbidcbiAgICAgICAgICAgICwganNvbjogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICAgICwganM6ICAgJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQsIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAsIHhociA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgLy8gaXMgaXQgeC1kb21haW5cbiAgICAgICAgaWYgKG8uY3Jvc3NPcmlnaW4gPT09IHRydWUpIHtcbiAgICAgICAgICB2YXIgeGhyID0gd2luW3htbEh0dHBSZXF1ZXN0XSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbnVsbFxuICAgICAgICAgIGlmICh4aHIgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgICAgICAgICByZXR1cm4geGhyXG4gICAgICAgICAgfSBlbHNlIGlmICh3aW5beERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0KClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCcm93c2VyIGRvZXMgbm90IHN1cHBvcnQgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzJylcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAod2luW3htbEh0dHBSZXF1ZXN0XSkge1xuICAgICAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgLCBnbG9iYWxTZXR1cE9wdGlvbnMgPSB7XG4gICAgICAgIGRhdGFGaWx0ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgfVxuICAgICAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlYWR5U3RhdGUociwgc3VjY2VzcywgZXJyb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdXNlIF9hYm9ydGVkIHRvIG1pdGlnYXRlIGFnYWluc3QgSUUgZXJyIGMwMGMwMjNmXG4gICAgICAvLyAoY2FuJ3QgcmVhZCBwcm9wcyBvbiBhYm9ydGVkIHJlcXVlc3Qgb2JqZWN0cylcbiAgICAgIGlmIChyLl9hYm9ydGVkKSByZXR1cm4gZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgaWYgKHIucmVxdWVzdCAmJiByLnJlcXVlc3RbcmVhZHlTdGF0ZV0gPT0gNCkge1xuICAgICAgICByLnJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gbm9vcFxuICAgICAgICBpZiAodHdvSHVuZG8udGVzdChyLnJlcXVlc3Quc3RhdHVzKSlcbiAgICAgICAgICBzdWNjZXNzKHIucmVxdWVzdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVycm9yKHIucmVxdWVzdClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRIZWFkZXJzKGh0dHAsIG8pIHtcbiAgICB2YXIgaGVhZGVycyA9IG8uaGVhZGVycyB8fCB7fVxuICAgICAgLCBoXG5cbiAgICBoZWFkZXJzLkFjY2VwdCA9IGhlYWRlcnMuQWNjZXB0XG4gICAgICB8fCBkZWZhdWx0SGVhZGVycy5hY2NlcHRbby50eXBlXVxuICAgICAgfHwgZGVmYXVsdEhlYWRlcnMuYWNjZXB0WycqJ11cblxuICAgIC8vIGJyZWFrcyBjcm9zcy1vcmlnaW4gcmVxdWVzdHMgd2l0aCBsZWdhY3kgYnJvd3NlcnNcbiAgICBpZiAoIW8uY3Jvc3NPcmlnaW4gJiYgIWhlYWRlcnNbcmVxdWVzdGVkV2l0aF0pIGhlYWRlcnNbcmVxdWVzdGVkV2l0aF0gPSBkZWZhdWx0SGVhZGVycy5yZXF1ZXN0ZWRXaXRoXG4gICAgaWYgKCFoZWFkZXJzW2NvbnRlbnRUeXBlXSkgaGVhZGVyc1tjb250ZW50VHlwZV0gPSBvLmNvbnRlbnRUeXBlIHx8IGRlZmF1bHRIZWFkZXJzLmNvbnRlbnRUeXBlXG4gICAgZm9yIChoIGluIGhlYWRlcnMpXG4gICAgICBoZWFkZXJzLmhhc093blByb3BlcnR5KGgpICYmICdzZXRSZXF1ZXN0SGVhZGVyJyBpbiBodHRwICYmIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihoLCBoZWFkZXJzW2hdKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q3JlZGVudGlhbHMoaHR0cCwgbykge1xuICAgIGlmICh0eXBlb2Ygby53aXRoQ3JlZGVudGlhbHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBodHRwLndpdGhDcmVkZW50aWFscyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGh0dHAud2l0aENyZWRlbnRpYWxzID0gISFvLndpdGhDcmVkZW50aWFsc1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYWxDYWxsYmFjayhkYXRhKSB7XG4gICAgbGFzdFZhbHVlID0gZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gdXJsYXBwZW5kICh1cmwsIHMpIHtcbiAgICByZXR1cm4gdXJsICsgKC9cXD8vLnRlc3QodXJsKSA/ICcmJyA6ICc/JykgKyBzXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpIHtcbiAgICB2YXIgcmVxSWQgPSB1bmlxaWQrK1xuICAgICAgLCBjYmtleSA9IG8uanNvbnBDYWxsYmFjayB8fCAnY2FsbGJhY2snIC8vIHRoZSAnY2FsbGJhY2snIGtleVxuICAgICAgLCBjYnZhbCA9IG8uanNvbnBDYWxsYmFja05hbWUgfHwgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeChyZXFJZClcbiAgICAgIC8vICwgY2J2YWwgPSBvLmpzb25wQ2FsbGJhY2tOYW1lIHx8ICgncmVxd2VzdF8nICsgcmVxSWQpIC8vIHRoZSAnY2FsbGJhY2snIHZhbHVlXG4gICAgICAsIGNicmVnID0gbmV3IFJlZ0V4cCgnKChefFxcXFw/fCYpJyArIGNia2V5ICsgJyk9KFteJl0rKScpXG4gICAgICAsIG1hdGNoID0gdXJsLm1hdGNoKGNicmVnKVxuICAgICAgLCBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgICwgbG9hZGVkID0gMFxuICAgICAgLCBpc0lFMTAgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgMTAuMCcpICE9PSAtMVxuXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBpZiAobWF0Y2hbM10gPT09ICc/Jykge1xuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShjYnJlZywgJyQxPScgKyBjYnZhbCkgLy8gd2lsZGNhcmQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYnZhbCA9IG1hdGNoWzNdIC8vIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmMgbmFtZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBjYmtleSArICc9JyArIGNidmFsKSAvLyBubyBjYWxsYmFjayBkZXRhaWxzLCBhZGQgJ2VtXG4gICAgfVxuXG4gICAgd2luW2NidmFsXSA9IGdlbmVyYWxDYWxsYmFja1xuXG4gICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICAgIHNjcmlwdC5zcmMgPSB1cmxcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlXG4gICAgaWYgKHR5cGVvZiBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlICE9PSAndW5kZWZpbmVkJyAmJiAhaXNJRTEwKSB7XG4gICAgICAvLyBuZWVkIHRoaXMgZm9yIElFIGR1ZSB0byBvdXQtb2Ytb3JkZXIgb25yZWFkeXN0YXRlY2hhbmdlKCksIGJpbmRpbmcgc2NyaXB0XG4gICAgICAvLyBleGVjdXRpb24gdG8gYW4gZXZlbnQgbGlzdGVuZXIgZ2l2ZXMgdXMgY29udHJvbCBvdmVyIHdoZW4gdGhlIHNjcmlwdFxuICAgICAgLy8gaXMgZXhlY3V0ZWQuIFNlZSBodHRwOi8vamF1Ym91cmcubmV0LzIwMTAvMDcvbG9hZGluZy1zY3JpcHQtYXMtb25jbGljay1oYW5kbGVyLW9mLmh0bWxcbiAgICAgIC8vXG4gICAgICAvLyBpZiB0aGlzIGhhY2sgaXMgdXNlZCBpbiBJRTEwIGpzb25wIGNhbGxiYWNrIGFyZSBuZXZlciBjYWxsZWRcbiAgICAgIHNjcmlwdC5ldmVudCA9ICdvbmNsaWNrJ1xuICAgICAgc2NyaXB0Lmh0bWxGb3IgPSBzY3JpcHQuaWQgPSAnX3JlcXdlc3RfJyArIHJlcUlkXG4gICAgfVxuXG4gICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoKHNjcmlwdFtyZWFkeVN0YXRlXSAmJiBzY3JpcHRbcmVhZHlTdGF0ZV0gIT09ICdjb21wbGV0ZScgJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnbG9hZGVkJykgfHwgbG9hZGVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgICBzY3JpcHQub25jbGljayAmJiBzY3JpcHQub25jbGljaygpXG4gICAgICAvLyBDYWxsIHRoZSB1c2VyIGNhbGxiYWNrIHdpdGggdGhlIGxhc3QgdmFsdWUgc3RvcmVkIGFuZCBjbGVhbiB1cCB2YWx1ZXMgYW5kIHNjcmlwdHMuXG4gICAgICBmbihsYXN0VmFsdWUpXG4gICAgICBsYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgbG9hZGVkID0gMVxuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgc2NyaXB0IHRvIHRoZSBET00gaGVhZFxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuXG4gICAgLy8gRW5hYmxlIEpTT05QIHRpbWVvdXRcbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgICAgIGVycih7fSwgJ1JlcXVlc3QgaXMgYWJvcnRlZDogdGltZW91dCcsIHt9KVxuICAgICAgICBsYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpXG4gICAgICAgIGxvYWRlZCA9IDFcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSZXF1ZXN0KGZuLCBlcnIpIHtcbiAgICB2YXIgbyA9IHRoaXMub1xuICAgICAgLCBtZXRob2QgPSAoby5tZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKClcbiAgICAgICwgdXJsID0gdHlwZW9mIG8gPT09ICdzdHJpbmcnID8gbyA6IG8udXJsXG4gICAgICAvLyBjb252ZXJ0IG5vbi1zdHJpbmcgb2JqZWN0cyB0byBxdWVyeS1zdHJpbmcgZm9ybSB1bmxlc3Mgby5wcm9jZXNzRGF0YSBpcyBmYWxzZVxuICAgICAgLCBkYXRhID0gKG8ucHJvY2Vzc0RhdGEgIT09IGZhbHNlICYmIG8uZGF0YSAmJiB0eXBlb2Ygby5kYXRhICE9PSAnc3RyaW5nJylcbiAgICAgICAgPyByZXF3ZXN0LnRvUXVlcnlTdHJpbmcoby5kYXRhKVxuICAgICAgICA6IChvLmRhdGEgfHwgbnVsbClcbiAgICAgICwgaHR0cFxuICAgICAgLCBzZW5kV2FpdCA9IGZhbHNlXG5cbiAgICAvLyBpZiB3ZSdyZSB3b3JraW5nIG9uIGEgR0VUIHJlcXVlc3QgYW5kIHdlIGhhdmUgZGF0YSB0aGVuIHdlIHNob3VsZCBhcHBlbmRcbiAgICAvLyBxdWVyeSBzdHJpbmcgdG8gZW5kIG9mIFVSTCBhbmQgbm90IHBvc3QgZGF0YVxuICAgIGlmICgoby50eXBlID09ICdqc29ucCcgfHwgbWV0aG9kID09ICdHRVQnKSAmJiBkYXRhKSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBkYXRhKVxuICAgICAgZGF0YSA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAoby50eXBlID09ICdqc29ucCcpIHJldHVybiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpXG5cbiAgICBodHRwID0geGhyKG8pXG4gICAgaHR0cC5vcGVuKG1ldGhvZCwgdXJsLCBvLmFzeW5jID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZSlcbiAgICBzZXRIZWFkZXJzKGh0dHAsIG8pXG4gICAgc2V0Q3JlZGVudGlhbHMoaHR0cCwgbylcbiAgICBpZiAod2luW3hEb21haW5SZXF1ZXN0XSAmJiBodHRwIGluc3RhbmNlb2Ygd2luW3hEb21haW5SZXF1ZXN0XSkge1xuICAgICAgICBodHRwLm9ubG9hZCA9IGZuXG4gICAgICAgIGh0dHAub25lcnJvciA9IGVyclxuICAgICAgICAvLyBOT1RFOiBzZWVcbiAgICAgICAgLy8gaHR0cDovL3NvY2lhbC5tc2RuLm1pY3Jvc29mdC5jb20vRm9ydW1zL2VuLVVTL2lld2ViZGV2ZWxvcG1lbnQvdGhyZWFkLzMwZWYzYWRkLTc2N2MtNDQzNi1iOGE5LWYxY2ExOWI0ODEyZVxuICAgICAgICBodHRwLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHt9XG4gICAgICAgIHNlbmRXYWl0ID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZVJlYWR5U3RhdGUodGhpcywgZm4sIGVycilcbiAgICB9XG4gICAgby5iZWZvcmUgJiYgby5iZWZvcmUoaHR0cClcbiAgICBpZiAoc2VuZFdhaXQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBodHRwLnNlbmQoZGF0YSlcbiAgICAgIH0sIDIwMClcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cC5zZW5kKGRhdGEpXG4gICAgfVxuICAgIHJldHVybiBodHRwXG4gIH1cblxuICBmdW5jdGlvbiBSZXF3ZXN0KG8sIGZuKSB7XG4gICAgdGhpcy5vID0gb1xuICAgIHRoaXMuZm4gPSBmblxuXG4gICAgaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRUeXBlKHVybCkge1xuICAgIHZhciBtID0gdXJsLm1hdGNoKC9cXC4oanNvbnxqc29ucHxodG1sfHhtbCkoXFw/fCQpLylcbiAgICByZXR1cm4gbSA/IG1bMV0gOiAnanMnXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KG8sIGZuKSB7XG5cbiAgICB0aGlzLnVybCA9IHR5cGVvZiBvID09ICdzdHJpbmcnID8gbyA6IG8udXJsXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuXG4gICAgLy8gd2hldGhlciByZXF1ZXN0IGhhcyBiZWVuIGZ1bGZpbGxlZCBmb3IgcHVycG9zZVxuICAgIC8vIG9mIHRyYWNraW5nIHRoZSBQcm9taXNlc1xuICAgIHRoaXMuX2Z1bGZpbGxlZCA9IGZhbHNlXG4gICAgLy8gc3VjY2VzcyBoYW5kbGVyc1xuICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24oKXt9XG4gICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycyA9IFtdXG4gICAgLy8gZXJyb3IgaGFuZGxlcnNcbiAgICB0aGlzLl9lcnJvckhhbmRsZXJzID0gW11cbiAgICAvLyBjb21wbGV0ZSAoYm90aCBzdWNjZXNzIGFuZCBmYWlsKSBoYW5kbGVyc1xuICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMgPSBbXVxuICAgIHRoaXMuX2VycmVkID0gZmFsc2VcbiAgICB0aGlzLl9yZXNwb25zZUFyZ3MgPSB7fVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAsIHR5cGUgPSBvLnR5cGUgfHwgc2V0VHlwZSh0aGlzLnVybClcblxuICAgIGZuID0gZm4gfHwgZnVuY3Rpb24gKCkge31cblxuICAgIGlmIChvLnRpbWVvdXQpIHtcbiAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLmFib3J0KClcbiAgICAgIH0sIG8udGltZW91dClcbiAgICB9XG5cbiAgICBpZiAoby5zdWNjZXNzKSB7XG4gICAgICB0aGlzLl9zdWNjZXNzSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgby5zdWNjZXNzLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoby5lcnJvcikge1xuICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgby5lcnJvci5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChvLmNvbXBsZXRlKSB7XG4gICAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvLmNvbXBsZXRlLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGxldGUgKHJlc3ApIHtcbiAgICAgIG8udGltZW91dCAmJiBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuICAgICAgc2VsZi50aW1lb3V0ID0gbnVsbFxuICAgICAgd2hpbGUgKHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxmLl9jb21wbGV0ZUhhbmRsZXJzLnNoaWZ0KCkocmVzcClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdWNjZXNzIChyZXNwKSB7XG4gICAgICByZXNwID0gKHR5cGUgIT09ICdqc29ucCcpID8gc2VsZi5yZXF1ZXN0IDogcmVzcFxuICAgICAgLy8gdXNlIGdsb2JhbCBkYXRhIGZpbHRlciBvbiByZXNwb25zZSB0ZXh0XG4gICAgICB2YXIgZmlsdGVyZWRSZXNwb25zZSA9IGdsb2JhbFNldHVwT3B0aW9ucy5kYXRhRmlsdGVyKHJlc3AucmVzcG9uc2VUZXh0LCB0eXBlKVxuICAgICAgICAsIHIgPSBmaWx0ZXJlZFJlc3BvbnNlXG4gICAgICB0cnkge1xuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dCA9IHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY2FuJ3QgYXNzaWduIHRoaXMgaW4gSUU8PTgsIGp1c3QgaWdub3JlXG4gICAgICB9XG4gICAgICBpZiAocikge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3AgPSB3aW4uSlNPTiA/IHdpbi5KU09OLnBhcnNlKHIpIDogZXZhbCgnKCcgKyByICsgJyknKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yKHJlc3AsICdDb3VsZCBub3QgcGFyc2UgSlNPTiBpbiByZXNwb25zZScsIGVycilcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnanMnOlxuICAgICAgICAgIHJlc3AgPSBldmFsKHIpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgcmVzcCA9IHJcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd4bWwnOlxuICAgICAgICAgIHJlc3AgPSByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvciAvLyBJRSB0cm9sb2xvXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5lcnJvckNvZGVcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLnJlYXNvblxuICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICA6IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fZnVsZmlsbGVkID0gdHJ1ZVxuICAgICAgZm4ocmVzcClcbiAgICAgIHNlbGYuX3N1Y2Nlc3NIYW5kbGVyKHJlc3ApXG4gICAgICB3aGlsZSAoc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3AgPSBzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLnNoaWZ0KCkocmVzcClcbiAgICAgIH1cblxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwLCBtc2csIHQpIHtcbiAgICAgIHJlc3AgPSBzZWxmLnJlcXVlc3RcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLm1zZyA9IG1zZ1xuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnQgPSB0XG4gICAgICBzZWxmLl9lcnJlZCA9IHRydWVcbiAgICAgIHdoaWxlIChzZWxmLl9lcnJvckhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fZXJyb3JIYW5kbGVycy5zaGlmdCgpKHJlc3AsIG1zZywgdClcbiAgICAgIH1cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0ID0gZ2V0UmVxdWVzdC5jYWxsKHRoaXMsIHN1Y2Nlc3MsIGVycm9yKVxuICB9XG5cbiAgUmVxd2VzdC5wcm90b3R5cGUgPSB7XG4gICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2Fib3J0ZWQgPSB0cnVlXG4gICAgICB0aGlzLnJlcXVlc3QuYWJvcnQoKVxuICAgIH1cblxuICAsIHJldHJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0LmNhbGwodGhpcywgdGhpcy5vLCB0aGlzLmZuKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNtYWxsIGRldmlhdGlvbiBmcm9tIHRoZSBQcm9taXNlcyBBIENvbW1vbkpzIHNwZWNpZmljYXRpb25cbiAgICAgKiBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Qcm9taXNlcy9BXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBgdGhlbmAgd2lsbCBleGVjdXRlIHVwb24gc3VjY2Vzc2Z1bCByZXF1ZXN0c1xuICAgICAqL1xuICAsIHRoZW46IGZ1bmN0aW9uIChzdWNjZXNzLCBmYWlsKSB7XG4gICAgICBzdWNjZXNzID0gc3VjY2VzcyB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgZmFpbCA9IGZhaWwgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQpIHtcbiAgICAgICAgdGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AgPSBzdWNjZXNzKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmYWlsKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMucHVzaChzdWNjZXNzKVxuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZmFpbClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGFsd2F5c2Agd2lsbCBleGVjdXRlIHdoZXRoZXIgdGhlIHJlcXVlc3Qgc3VjY2VlZHMgb3IgZmFpbHNcbiAgICAgKi9cbiAgLCBhbHdheXM6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCB8fCB0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGZhaWxgIHdpbGwgZXhlY3V0ZSB3aGVuIHRoZSByZXF1ZXN0IGZhaWxzXG4gICAgICovXG4gICwgZmFpbDogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXF3ZXN0KG8sIGZuKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF3ZXN0KG8sIGZuKVxuICB9XG5cbiAgLy8gbm9ybWFsaXplIG5ld2xpbmUgdmFyaWFudHMgYWNjb3JkaW5nIHRvIHNwZWMgLT4gQ1JMRlxuICBmdW5jdGlvbiBub3JtYWxpemUocykge1xuICAgIHJldHVybiBzID8gcy5yZXBsYWNlKC9cXHI/XFxuL2csICdcXHJcXG4nKSA6ICcnXG4gIH1cblxuICBmdW5jdGlvbiBzZXJpYWwoZWwsIGNiKSB7XG4gICAgdmFyIG4gPSBlbC5uYW1lXG4gICAgICAsIHQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICwgb3B0Q2IgPSBmdW5jdGlvbiAobykge1xuICAgICAgICAgIC8vIElFIGdpdmVzIHZhbHVlPVwiXCIgZXZlbiB3aGVyZSB0aGVyZSBpcyBubyB2YWx1ZSBhdHRyaWJ1dGVcbiAgICAgICAgICAvLyAnc3BlY2lmaWVkJyByZWY6IGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUNvcmUvY29yZS5odG1sI0lELTg2MjUyOTI3M1xuICAgICAgICAgIGlmIChvICYmICFvLmRpc2FibGVkKVxuICAgICAgICAgICAgY2Iobiwgbm9ybWFsaXplKG8uYXR0cmlidXRlcy52YWx1ZSAmJiBvLmF0dHJpYnV0ZXMudmFsdWUuc3BlY2lmaWVkID8gby52YWx1ZSA6IG8udGV4dCkpXG4gICAgICAgIH1cbiAgICAgICwgY2gsIHJhLCB2YWwsIGlcblxuICAgIC8vIGRvbid0IHNlcmlhbGl6ZSBlbGVtZW50cyB0aGF0IGFyZSBkaXNhYmxlZCBvciB3aXRob3V0IGEgbmFtZVxuICAgIGlmIChlbC5kaXNhYmxlZCB8fCAhbikgcmV0dXJuXG5cbiAgICBzd2l0Y2ggKHQpIHtcbiAgICBjYXNlICdpbnB1dCc6XG4gICAgICBpZiAoIS9yZXNldHxidXR0b258aW1hZ2V8ZmlsZS9pLnRlc3QoZWwudHlwZSkpIHtcbiAgICAgICAgY2ggPSAvY2hlY2tib3gvaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHJhID0gL3JhZGlvL2kudGVzdChlbC50eXBlKVxuICAgICAgICB2YWwgPSBlbC52YWx1ZVxuICAgICAgICAvLyBXZWJLaXQgZ2l2ZXMgdXMgXCJcIiBpbnN0ZWFkIG9mIFwib25cIiBpZiBhIGNoZWNrYm94IGhhcyBubyB2YWx1ZSwgc28gY29ycmVjdCBpdCBoZXJlXG4gICAgICAgIDsoIShjaCB8fCByYSkgfHwgZWwuY2hlY2tlZCkgJiYgY2Iobiwgbm9ybWFsaXplKGNoICYmIHZhbCA9PT0gJycgPyAnb24nIDogdmFsKSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgY2Iobiwgbm9ybWFsaXplKGVsLnZhbHVlKSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGlmIChlbC50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3Qtb25lJykge1xuICAgICAgICBvcHRDYihlbC5zZWxlY3RlZEluZGV4ID49IDAgPyBlbC5vcHRpb25zW2VsLnNlbGVjdGVkSW5kZXhdIDogbnVsbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGVsLmxlbmd0aCAmJiBpIDwgZWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlbC5vcHRpb25zW2ldLnNlbGVjdGVkICYmIG9wdENiKGVsLm9wdGlvbnNbaV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgLy8gY29sbGVjdCB1cCBhbGwgZm9ybSBlbGVtZW50cyBmb3VuZCBmcm9tIHRoZSBwYXNzZWQgYXJndW1lbnQgZWxlbWVudHMgYWxsXG4gIC8vIHRoZSB3YXkgZG93biB0byBjaGlsZCBlbGVtZW50czsgcGFzcyBhICc8Zm9ybT4nIG9yIGZvcm0gZmllbGRzLlxuICAvLyBjYWxsZWQgd2l0aCAndGhpcyc9Y2FsbGJhY2sgdG8gdXNlIGZvciBzZXJpYWwoKSBvbiBlYWNoIGVsZW1lbnRcbiAgZnVuY3Rpb24gZWFjaEZvcm1FbGVtZW50KCkge1xuICAgIHZhciBjYiA9IHRoaXNcbiAgICAgICwgZSwgaVxuICAgICAgLCBzZXJpYWxpemVTdWJ0YWdzID0gZnVuY3Rpb24gKGUsIHRhZ3MpIHtcbiAgICAgICAgICB2YXIgaSwgaiwgZmFcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZmEgPSBlW2J5VGFnXSh0YWdzW2ldKVxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGZhLmxlbmd0aDsgaisrKSBzZXJpYWwoZmFbal0sIGNiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgZSA9IGFyZ3VtZW50c1tpXVxuICAgICAgaWYgKC9pbnB1dHxzZWxlY3R8dGV4dGFyZWEvaS50ZXN0KGUudGFnTmFtZSkpIHNlcmlhbChlLCBjYilcbiAgICAgIHNlcmlhbGl6ZVN1YnRhZ3MoZSwgWyAnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJyBdKVxuICAgIH1cbiAgfVxuXG4gIC8vIHN0YW5kYXJkIHF1ZXJ5IHN0cmluZyBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nKCkge1xuICAgIHJldHVybiByZXF3ZXN0LnRvUXVlcnlTdHJpbmcocmVxd2VzdC5zZXJpYWxpemVBcnJheS5hcHBseShudWxsLCBhcmd1bWVudHMpKVxuICB9XG5cbiAgLy8geyAnbmFtZSc6ICd2YWx1ZScsIC4uLiB9IHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplSGFzaCgpIHtcbiAgICB2YXIgaGFzaCA9IHt9XG4gICAgZWFjaEZvcm1FbGVtZW50LmFwcGx5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgaWYgKG5hbWUgaW4gaGFzaCkge1xuICAgICAgICBoYXNoW25hbWVdICYmICFpc0FycmF5KGhhc2hbbmFtZV0pICYmIChoYXNoW25hbWVdID0gW2hhc2hbbmFtZV1dKVxuICAgICAgICBoYXNoW25hbWVdLnB1c2godmFsdWUpXG4gICAgICB9IGVsc2UgaGFzaFtuYW1lXSA9IHZhbHVlXG4gICAgfSwgYXJndW1lbnRzKVxuICAgIHJldHVybiBoYXNoXG4gIH1cblxuICAvLyBbIHsgbmFtZTogJ25hbWUnLCB2YWx1ZTogJ3ZhbHVlJyB9LCAuLi4gXSBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIHJlcXdlc3Quc2VyaWFsaXplQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyciA9IFtdXG4gICAgZWFjaEZvcm1FbGVtZW50LmFwcGx5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgYXJyLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZX0pXG4gICAgfSwgYXJndW1lbnRzKVxuICAgIHJldHVybiBhcnJcbiAgfVxuXG4gIHJlcXdlc3Quc2VyaWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgICB2YXIgb3B0LCBmblxuICAgICAgLCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxuXG4gICAgb3B0ID0gYXJncy5wb3AoKVxuICAgIG9wdCAmJiBvcHQubm9kZVR5cGUgJiYgYXJncy5wdXNoKG9wdCkgJiYgKG9wdCA9IG51bGwpXG4gICAgb3B0ICYmIChvcHQgPSBvcHQudHlwZSlcblxuICAgIGlmIChvcHQgPT0gJ21hcCcpIGZuID0gc2VyaWFsaXplSGFzaFxuICAgIGVsc2UgaWYgKG9wdCA9PSAnYXJyYXknKSBmbiA9IHJlcXdlc3Quc2VyaWFsaXplQXJyYXlcbiAgICBlbHNlIGZuID0gc2VyaWFsaXplUXVlcnlTdHJpbmdcblxuICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmdzKVxuICB9XG5cbiAgcmVxd2VzdC50b1F1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKG8sIHRyYWQpIHtcbiAgICB2YXIgcHJlZml4LCBpXG4gICAgICAsIHRyYWRpdGlvbmFsID0gdHJhZCB8fCBmYWxzZVxuICAgICAgLCBzID0gW11cbiAgICAgICwgZW5jID0gZW5jb2RlVVJJQ29tcG9uZW50XG4gICAgICAsIGFkZCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgLy8gSWYgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGFuZCByZXR1cm4gaXRzIHZhbHVlXG4gICAgICAgICAgdmFsdWUgPSAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHZhbHVlKSA/IHZhbHVlKCkgOiAodmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWUpXG4gICAgICAgICAgc1tzLmxlbmd0aF0gPSBlbmMoa2V5KSArICc9JyArIGVuYyh2YWx1ZSlcbiAgICAgICAgfVxuICAgIC8vIElmIGFuIGFycmF5IHdhcyBwYXNzZWQgaW4sIGFzc3VtZSB0aGF0IGl0IGlzIGFuIGFycmF5IG9mIGZvcm0gZWxlbWVudHMuXG4gICAgaWYgKGlzQXJyYXkobykpIHtcbiAgICAgIGZvciAoaSA9IDA7IG8gJiYgaSA8IG8ubGVuZ3RoOyBpKyspIGFkZChvW2ldLm5hbWUsIG9baV0udmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRyYWRpdGlvbmFsLCBlbmNvZGUgdGhlIFwib2xkXCIgd2F5ICh0aGUgd2F5IDEuMy4yIG9yIG9sZGVyXG4gICAgICAvLyBkaWQgaXQpLCBvdGhlcndpc2UgZW5jb2RlIHBhcmFtcyByZWN1cnNpdmVseS5cbiAgICAgIGZvciAocHJlZml4IGluIG8pIHtcbiAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4LCBvW3ByZWZpeF0sIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gc3BhY2VzIHNob3VsZCBiZSArIGFjY29yZGluZyB0byBzcGVjXG4gICAgcmV0dXJuIHMuam9pbignJicpLnJlcGxhY2UoLyUyMC9nLCAnKycpXG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFBhcmFtcyhwcmVmaXgsIG9iaiwgdHJhZGl0aW9uYWwsIGFkZCkge1xuICAgIHZhciBuYW1lLCBpLCB2XG4gICAgICAsIHJicmFja2V0ID0gL1xcW1xcXSQvXG5cbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAvLyBTZXJpYWxpemUgYXJyYXkgaXRlbS5cbiAgICAgIGZvciAoaSA9IDA7IG9iaiAmJiBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHYgPSBvYmpbaV1cbiAgICAgICAgaWYgKHRyYWRpdGlvbmFsIHx8IHJicmFja2V0LnRlc3QocHJlZml4KSkge1xuICAgICAgICAgIC8vIFRyZWF0IGVhY2ggYXJyYXkgaXRlbSBhcyBhIHNjYWxhci5cbiAgICAgICAgICBhZGQocHJlZml4LCB2KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArICh0eXBlb2YgdiA9PT0gJ29iamVjdCcgPyBpIDogJycpICsgJ10nLCB2LCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvYmogJiYgb2JqLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAvLyBTZXJpYWxpemUgb2JqZWN0IGl0ZW0uXG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArIG5hbWUgKyAnXScsIG9ialtuYW1lXSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZXJpYWxpemUgc2NhbGFyIGl0ZW0uXG4gICAgICBhZGQocHJlZml4LCBvYmopXG4gICAgfVxuICB9XG5cbiAgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2FsbGJhY2tQcmVmaXhcbiAgfVxuXG4gIC8vIGpRdWVyeSBhbmQgWmVwdG8gY29tcGF0aWJpbGl0eSwgZGlmZmVyZW5jZXMgY2FuIGJlIHJlbWFwcGVkIGhlcmUgc28geW91IGNhbiBjYWxsXG4gIC8vIC5hamF4LmNvbXBhdChvcHRpb25zLCBjYWxsYmFjaylcbiAgcmVxd2VzdC5jb21wYXQgPSBmdW5jdGlvbiAobywgZm4pIHtcbiAgICBpZiAobykge1xuICAgICAgby50eXBlICYmIChvLm1ldGhvZCA9IG8udHlwZSkgJiYgZGVsZXRlIG8udHlwZVxuICAgICAgby5kYXRhVHlwZSAmJiAoby50eXBlID0gby5kYXRhVHlwZSlcbiAgICAgIG8uanNvbnBDYWxsYmFjayAmJiAoby5qc29ucENhbGxiYWNrTmFtZSA9IG8uanNvbnBDYWxsYmFjaykgJiYgZGVsZXRlIG8uanNvbnBDYWxsYmFja1xuICAgICAgby5qc29ucCAmJiAoby5qc29ucENhbGxiYWNrID0gby5qc29ucClcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSZXF3ZXN0KG8sIGZuKVxuICB9XG5cbiAgcmVxd2VzdC5hamF4U2V0dXAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgZm9yICh2YXIgayBpbiBvcHRpb25zKSB7XG4gICAgICBnbG9iYWxTZXR1cE9wdGlvbnNba10gPSBvcHRpb25zW2tdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcXdlc3Rcbn0pO1xuIiwiLyohXG4gICogQmVhbiAtIGNvcHlyaWdodCAoYykgSmFjb2IgVGhvcm50b24gMjAxMS0yMDEyXG4gICogaHR0cHM6Ly9naXRodWIuY29tL2ZhdC9iZWFuXG4gICogTUlUIGxpY2Vuc2VcbiAgKi9cbihmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0pKCdiZWFuJywgdGhpcywgZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQpIHtcbiAgbmFtZSAgICA9IG5hbWUgICAgfHwgJ2JlYW4nXG4gIGNvbnRleHQgPSBjb250ZXh0IHx8IHRoaXNcblxuICB2YXIgd2luICAgICAgICAgICAgPSB3aW5kb3dcbiAgICAsIG9sZCAgICAgICAgICAgID0gY29udGV4dFtuYW1lXVxuICAgICwgbmFtZXNwYWNlUmVnZXggPSAvW15cXC5dKig/PVxcLi4qKVxcLnwuKi9cbiAgICAsIG5hbWVSZWdleCAgICAgID0gL1xcLi4qL1xuICAgICwgYWRkRXZlbnQgICAgICAgPSAnYWRkRXZlbnRMaXN0ZW5lcidcbiAgICAsIHJlbW92ZUV2ZW50ICAgID0gJ3JlbW92ZUV2ZW50TGlzdGVuZXInXG4gICAgLCBkb2MgICAgICAgICAgICA9IGRvY3VtZW50IHx8IHt9XG4gICAgLCByb290ICAgICAgICAgICA9IGRvYy5kb2N1bWVudEVsZW1lbnQgfHwge31cbiAgICAsIFczQ19NT0RFTCAgICAgID0gcm9vdFthZGRFdmVudF1cbiAgICAsIGV2ZW50U3VwcG9ydCAgID0gVzNDX01PREVMID8gYWRkRXZlbnQgOiAnYXR0YWNoRXZlbnQnXG4gICAgLCBPTkUgICAgICAgICAgICA9IHt9IC8vIHNpbmdsZXRvbiBmb3IgcXVpY2sgbWF0Y2hpbmcgbWFraW5nIGFkZCgpIGRvIG9uZSgpXG5cbiAgICAsIHNsaWNlICAgICAgICAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgLCBzdHIyYXJyICAgICAgICA9IGZ1bmN0aW9uIChzLCBkKSB7IHJldHVybiBzLnNwbGl0KGQgfHwgJyAnKSB9XG4gICAgLCBpc1N0cmluZyAgICAgICA9IGZ1bmN0aW9uIChvKSB7IHJldHVybiB0eXBlb2YgbyA9PSAnc3RyaW5nJyB9XG4gICAgLCBpc0Z1bmN0aW9uICAgICA9IGZ1bmN0aW9uIChvKSB7IHJldHVybiB0eXBlb2YgbyA9PSAnZnVuY3Rpb24nIH1cblxuICAgICAgLy8gZXZlbnRzIHRoYXQgd2UgY29uc2lkZXIgdG8gYmUgJ25hdGl2ZScsIGFueXRoaW5nIG5vdCBpbiB0aGlzIGxpc3Qgd2lsbFxuICAgICAgLy8gYmUgdHJlYXRlZCBhcyBhIGN1c3RvbSBldmVudFxuICAgICwgc3RhbmRhcmROYXRpdmVFdmVudHMgPVxuICAgICAgICAnY2xpY2sgZGJsY2xpY2sgbW91c2V1cCBtb3VzZWRvd24gY29udGV4dG1lbnUgJyAgICAgICAgICAgICAgICAgICsgLy8gbW91c2UgYnV0dG9uc1xuICAgICAgICAnbW91c2V3aGVlbCBtb3VzZW11bHRpd2hlZWwgRE9NTW91c2VTY3JvbGwgJyAgICAgICAgICAgICAgICAgICAgICsgLy8gbW91c2Ugd2hlZWxcbiAgICAgICAgJ21vdXNlb3ZlciBtb3VzZW91dCBtb3VzZW1vdmUgc2VsZWN0c3RhcnQgc2VsZWN0ZW5kICcgICAgICAgICAgICArIC8vIG1vdXNlIG1vdmVtZW50XG4gICAgICAgICdrZXlkb3duIGtleXByZXNzIGtleXVwICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBrZXlib2FyZFxuICAgICAgICAnb3JpZW50YXRpb25jaGFuZ2UgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gbW9iaWxlXG4gICAgICAgICdmb2N1cyBibHVyIGNoYW5nZSByZXNldCBzZWxlY3Qgc3VibWl0ICcgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBmb3JtIGVsZW1lbnRzXG4gICAgICAgICdsb2FkIHVubG9hZCBiZWZvcmV1bmxvYWQgcmVzaXplIG1vdmUgRE9NQ29udGVudExvYWRlZCAnICAgICAgICAgKyAvLyB3aW5kb3dcbiAgICAgICAgJ3JlYWR5c3RhdGVjaGFuZ2UgbWVzc2FnZSAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIHdpbmRvd1xuICAgICAgICAnZXJyb3IgYWJvcnQgc2Nyb2xsICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWlzY1xuICAgICAgLy8gZWxlbWVudC5maXJlRXZlbnQoJ29uWFlaJy4uLiBpcyBub3QgZm9yZ2l2aW5nIGlmIHdlIHRyeSB0byBmaXJlIGFuIGV2ZW50XG4gICAgICAvLyB0aGF0IGRvZXNuJ3QgYWN0dWFsbHkgZXhpc3QsIHNvIG1ha2Ugc3VyZSB3ZSBvbmx5IGRvIHRoZXNlIG9uIG5ld2VyIGJyb3dzZXJzXG4gICAgLCB3M2NOYXRpdmVFdmVudHMgPVxuICAgICAgICAnc2hvdyAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gbW91c2UgYnV0dG9uc1xuICAgICAgICAnaW5wdXQgaW52YWxpZCAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gZm9ybSBlbGVtZW50c1xuICAgICAgICAndG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgdG91Y2hjYW5jZWwgJyAgICAgICAgICAgICAgICAgICAgICsgLy8gdG91Y2hcbiAgICAgICAgJ2dlc3R1cmVzdGFydCBnZXN0dXJlY2hhbmdlIGdlc3R1cmVlbmQgJyAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIGdlc3R1cmVcbiAgICAgICAgJ3RleHRpbnB1dCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIFRleHRFdmVudFxuICAgICAgICAncmVhZHlzdGF0ZWNoYW5nZSBwYWdlc2hvdyBwYWdlaGlkZSBwb3BzdGF0ZSAnICAgICAgICAgICAgICAgICAgICsgLy8gd2luZG93XG4gICAgICAgICdoYXNoY2hhbmdlIG9mZmxpbmUgb25saW5lICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyB3aW5kb3dcbiAgICAgICAgJ2FmdGVycHJpbnQgYmVmb3JlcHJpbnQgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIHByaW50aW5nXG4gICAgICAgICdkcmFnc3RhcnQgZHJhZ2VudGVyIGRyYWdvdmVyIGRyYWdsZWF2ZSBkcmFnIGRyb3AgZHJhZ2VuZCAnICAgICAgKyAvLyBkbmRcbiAgICAgICAgJ2xvYWRzdGFydCBwcm9ncmVzcyBzdXNwZW5kIGVtcHRpZWQgc3RhbGxlZCBsb2FkbWV0YWRhdGEgJyAgICAgICArIC8vIG1lZGlhXG4gICAgICAgICdsb2FkZWRkYXRhIGNhbnBsYXkgY2FucGxheXRocm91Z2ggcGxheWluZyB3YWl0aW5nIHNlZWtpbmcgJyAgICAgKyAvLyBtZWRpYVxuICAgICAgICAnc2Vla2VkIGVuZGVkIGR1cmF0aW9uY2hhbmdlIHRpbWV1cGRhdGUgcGxheSBwYXVzZSByYXRlY2hhbmdlICcgICsgLy8gbWVkaWFcbiAgICAgICAgJ3ZvbHVtZWNoYW5nZSBjdWVjaGFuZ2UgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIG1lZGlhXG4gICAgICAgICdjaGVja2luZyBub3VwZGF0ZSBkb3dubG9hZGluZyBjYWNoZWQgdXBkYXRlcmVhZHkgb2Jzb2xldGUgJyAgICAgICAvLyBhcHBjYWNoZVxuXG4gICAgICAvLyBjb252ZXJ0IHRvIGEgaGFzaCBmb3IgcXVpY2sgbG9va3Vwc1xuICAgICwgbmF0aXZlRXZlbnRzID0gKGZ1bmN0aW9uIChoYXNoLCBldmVudHMsIGkpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKykgZXZlbnRzW2ldICYmIChoYXNoW2V2ZW50c1tpXV0gPSAxKVxuICAgICAgICByZXR1cm4gaGFzaFxuICAgICAgfSh7fSwgc3RyMmFycihzdGFuZGFyZE5hdGl2ZUV2ZW50cyArIChXM0NfTU9ERUwgPyB3M2NOYXRpdmVFdmVudHMgOiAnJykpKSlcblxuICAgICAgLy8gY3VzdG9tIGV2ZW50cyBhcmUgZXZlbnRzIHRoYXQgd2UgKmZha2UqLCB0aGV5IGFyZSBub3QgcHJvdmlkZWQgbmF0aXZlbHkgYnV0XG4gICAgICAvLyB3ZSBjYW4gdXNlIG5hdGl2ZSBldmVudHMgdG8gZ2VuZXJhdGUgdGhlbVxuICAgICwgY3VzdG9tRXZlbnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlzQW5jZXN0b3IgPSAnY29tcGFyZURvY3VtZW50UG9zaXRpb24nIGluIHJvb3RcbiAgICAgICAgICAgICAgPyBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICYmIChjb250YWluZXIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZWxlbWVudCkgJiAxNikgPT09IDE2XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA6ICdjb250YWlucycgaW4gcm9vdFxuICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIgPSBjb250YWluZXIubm9kZVR5cGUgPT09IDkgfHwgY29udGFpbmVyID09PSB3aW5kb3cgPyByb290IDogY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIgIT09IGVsZW1lbnQgJiYgY29udGFpbmVyLmNvbnRhaW5zKGVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSByZXR1cm4gMVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICwgY2hlY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgdmFyIHJlbGF0ZWQgPSBldmVudC5yZWxhdGVkVGFyZ2V0XG4gICAgICAgICAgICAgIHJldHVybiAhcmVsYXRlZFxuICAgICAgICAgICAgICAgID8gcmVsYXRlZCA9PSBudWxsXG4gICAgICAgICAgICAgICAgOiAocmVsYXRlZCAhPT0gdGhpcyAmJiByZWxhdGVkLnByZWZpeCAhPT0gJ3h1bCcgJiYgIS9kb2N1bWVudC8udGVzdCh0aGlzLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgICAgICYmICFpc0FuY2VzdG9yKHJlbGF0ZWQsIHRoaXMpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtb3VzZWVudGVyOiB7IGJhc2U6ICdtb3VzZW92ZXInLCBjb25kaXRpb246IGNoZWNrIH1cbiAgICAgICAgICAsIG1vdXNlbGVhdmU6IHsgYmFzZTogJ21vdXNlb3V0JywgY29uZGl0aW9uOiBjaGVjayB9XG4gICAgICAgICAgLCBtb3VzZXdoZWVsOiB7IGJhc2U6IC9GaXJlZm94Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpID8gJ0RPTU1vdXNlU2Nyb2xsJyA6ICdtb3VzZXdoZWVsJyB9XG4gICAgICAgIH1cbiAgICAgIH0oKSlcblxuICAgICAgLy8gd2UgcHJvdmlkZSBhIGNvbnNpc3RlbnQgRXZlbnQgb2JqZWN0IGFjcm9zcyBicm93c2VycyBieSB0YWtpbmcgdGhlIGFjdHVhbCBET01cbiAgICAgIC8vIGV2ZW50IG9iamVjdCBhbmQgZ2VuZXJhdGluZyBhIG5ldyBvbmUgZnJvbSBpdHMgcHJvcGVydGllcy5cbiAgICAsIEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGEgd2hpdGVsaXN0IG9mIHByb3BlcnRpZXMgKGZvciBkaWZmZXJlbnQgZXZlbnQgdHlwZXMpIHRlbGxzIHVzIHdoYXQgdG8gY2hlY2sgZm9yIGFuZCBjb3B5XG4gICAgICAgIHZhciBjb21tb25Qcm9wcyAgPSBzdHIyYXJyKCdhbHRLZXkgYXR0ckNoYW5nZSBhdHRyTmFtZSBidWJibGVzIGNhbmNlbGFibGUgY3RybEtleSBjdXJyZW50VGFyZ2V0ICcgK1xuICAgICAgICAgICAgICAnZGV0YWlsIGV2ZW50UGhhc2UgZ2V0TW9kaWZpZXJTdGF0ZSBpc1RydXN0ZWQgbWV0YUtleSByZWxhdGVkTm9kZSByZWxhdGVkVGFyZ2V0IHNoaWZ0S2V5ICcgICtcbiAgICAgICAgICAgICAgJ3NyY0VsZW1lbnQgdGFyZ2V0IHRpbWVTdGFtcCB0eXBlIHZpZXcgd2hpY2ggcHJvcGVydHlOYW1lJylcbiAgICAgICAgICAsIG1vdXNlUHJvcHMgICA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCdidXR0b24gYnV0dG9ucyBjbGllbnRYIGNsaWVudFkgZGF0YVRyYW5zZmVyICcgICAgICArXG4gICAgICAgICAgICAgICdmcm9tRWxlbWVudCBvZmZzZXRYIG9mZnNldFkgcGFnZVggcGFnZVkgc2NyZWVuWCBzY3JlZW5ZIHRvRWxlbWVudCcpKVxuICAgICAgICAgICwgbW91c2VXaGVlbFByb3BzID0gbW91c2VQcm9wcy5jb25jYXQoc3RyMmFycignd2hlZWxEZWx0YSB3aGVlbERlbHRhWCB3aGVlbERlbHRhWSB3aGVlbERlbHRhWiAnICtcbiAgICAgICAgICAgICAgJ2F4aXMnKSkgLy8gJ2F4aXMnIGlzIEZGIHNwZWNpZmljXG4gICAgICAgICAgLCBrZXlQcm9wcyAgICAgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycignY2hhciBjaGFyQ29kZSBrZXkga2V5Q29kZSBrZXlJZGVudGlmaWVyICcgICAgICAgICAgK1xuICAgICAgICAgICAgICAna2V5TG9jYXRpb24gbG9jYXRpb24nKSlcbiAgICAgICAgICAsIHRleHRQcm9wcyAgICA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCdkYXRhJykpXG4gICAgICAgICAgLCB0b3VjaFByb3BzICAgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycigndG91Y2hlcyB0YXJnZXRUb3VjaGVzIGNoYW5nZWRUb3VjaGVzIHNjYWxlIHJvdGF0aW9uJykpXG4gICAgICAgICAgLCBtZXNzYWdlUHJvcHMgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycignZGF0YSBvcmlnaW4gc291cmNlJykpXG4gICAgICAgICAgLCBzdGF0ZVByb3BzICAgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycignc3RhdGUnKSlcbiAgICAgICAgICAsIG92ZXJPdXRSZWdleCA9IC9vdmVyfG91dC9cbiAgICAgICAgICAgIC8vIHNvbWUgZXZlbnQgdHlwZXMgbmVlZCBzcGVjaWFsIGhhbmRsaW5nIGFuZCBzb21lIG5lZWQgc3BlY2lhbCBwcm9wZXJ0aWVzLCBkbyB0aGF0IGFsbCBoZXJlXG4gICAgICAgICAgLCB0eXBlRml4ZXJzICAgPSBbXG4gICAgICAgICAgICAgICAgeyAvLyBrZXkgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL2tleS9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKGV2ZW50LCBuZXdFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LmtleUNvZGUgPSBldmVudC5rZXlDb2RlIHx8IGV2ZW50LndoaWNoXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVByb3BzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBtb3VzZSBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvY2xpY2t8bW91c2UoPyEoLip3aGVlbHxzY3JvbGwpKXxtZW51fGRyYWd8ZHJvcC9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKGV2ZW50LCBuZXdFdmVudCwgdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LnJpZ2h0Q2xpY2sgPSBldmVudC53aGljaCA9PT0gMyB8fCBldmVudC5idXR0b24gPT09IDJcbiAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5wb3MgPSB7IHg6IDAsIHk6IDAgfVxuICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5wYWdlWCB8fCBldmVudC5wYWdlWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQuY2xpZW50WCA9IGV2ZW50LnBhZ2VYXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5jbGllbnRZID0gZXZlbnQucGFnZVlcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmNsaWVudFggfHwgZXZlbnQuY2xpZW50WSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQuY2xpZW50WCA9IGV2ZW50LmNsaWVudFggKyBkb2MuYm9keS5zY3JvbGxMZWZ0ICsgcm9vdC5zY3JvbGxMZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5jbGllbnRZID0gZXZlbnQuY2xpZW50WSArIGRvYy5ib2R5LnNjcm9sbFRvcCArIHJvb3Quc2Nyb2xsVG9wXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIGlmIChvdmVyT3V0UmVnZXgudGVzdCh0eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQucmVsYXRlZFRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgZXZlbnRbKHR5cGUgPT0gJ21vdXNlb3ZlcicgPyAnZnJvbScgOiAndG8nKSArICdFbGVtZW50J11cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vdXNlUHJvcHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIG1vdXNlIHdoZWVsIGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9tb3VzZS4qKHdoZWVsfHNjcm9sbCkvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vdXNlV2hlZWxQcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gVGV4dEV2ZW50XG4gICAgICAgICAgICAgICAgICAgIHJlZzogL150ZXh0L2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0ZXh0UHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIHRvdWNoIGFuZCBnZXN0dXJlIGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9edG91Y2h8Xmdlc3R1cmUvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRvdWNoUHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIG1lc3NhZ2UgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL15tZXNzYWdlJC9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbWVzc2FnZVByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBwb3BzdGF0ZSBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvXnBvcHN0YXRlJC9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc3RhdGVQcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJlZzogLy4qL1xuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvbW1vblByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgLCB0eXBlRml4ZXJNYXAgPSB7fSAvLyB1c2VkIHRvIG1hcCBldmVudCB0eXBlcyB0byBmaXhlciBmdW5jdGlvbnMgKGFib3ZlKSwgYSBiYXNpYyBjYWNoZSBtZWNoYW5pc21cblxuICAgICAgICAgICwgRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQsIGVsZW1lbnQsIGlzTmF0aXZlKSB7XG4gICAgICAgICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuXG4gICAgICAgICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgKChlbGVtZW50Lm93bmVyRG9jdW1lbnQgfHwgZWxlbWVudC5kb2N1bWVudCB8fCBlbGVtZW50KS5wYXJlbnRXaW5kb3cgfHwgd2luKS5ldmVudFxuICAgICAgICAgICAgICB0aGlzLm9yaWdpbmFsRXZlbnQgPSBldmVudFxuICAgICAgICAgICAgICB0aGlzLmlzTmF0aXZlICAgICAgID0gaXNOYXRpdmVcbiAgICAgICAgICAgICAgdGhpcy5pc0JlYW4gICAgICAgICA9IHRydWVcblxuICAgICAgICAgICAgICBpZiAoIWV2ZW50KSByZXR1cm5cblxuICAgICAgICAgICAgICB2YXIgdHlwZSAgID0gZXZlbnQudHlwZVxuICAgICAgICAgICAgICAgICwgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnRcbiAgICAgICAgICAgICAgICAsIGksIGwsIHAsIHByb3BzLCBmaXhlclxuXG4gICAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0ICYmIHRhcmdldC5ub2RlVHlwZSA9PT0gMyA/IHRhcmdldC5wYXJlbnROb2RlIDogdGFyZ2V0XG5cbiAgICAgICAgICAgICAgaWYgKGlzTmF0aXZlKSB7IC8vIHdlIG9ubHkgbmVlZCBiYXNpYyBhdWdtZW50YXRpb24gb24gY3VzdG9tIGV2ZW50cywgdGhlIHJlc3QgZXhwZW5zaXZlICYgcG9pbnRsZXNzXG4gICAgICAgICAgICAgICAgZml4ZXIgPSB0eXBlRml4ZXJNYXBbdHlwZV1cbiAgICAgICAgICAgICAgICBpZiAoIWZpeGVyKSB7IC8vIGhhdmVuJ3QgZW5jb3VudGVyZWQgdGhpcyBldmVudCB0eXBlIGJlZm9yZSwgbWFwIGEgZml4ZXIgZnVuY3Rpb24gZm9yIGl0XG4gICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gdHlwZUZpeGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVGaXhlcnNbaV0ucmVnLnRlc3QodHlwZSkpIHsgLy8gZ3VhcmFudGVlZCB0byBtYXRjaCBhdCBsZWFzdCBvbmUsIGxhc3QgaXMgLipcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlRml4ZXJNYXBbdHlwZV0gPSBmaXhlciA9IHR5cGVGaXhlcnNbaV0uZml4XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHByb3BzID0gZml4ZXIoZXZlbnQsIHRoaXMsIHR5cGUpXG4gICAgICAgICAgICAgICAgZm9yIChpID0gcHJvcHMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgICAgICAgICBpZiAoISgocCA9IHByb3BzW2ldKSBpbiB0aGlzKSAmJiBwIGluIGV2ZW50KSB0aGlzW3BdID0gZXZlbnRbcF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAvLyBwcmV2ZW50RGVmYXVsdCgpIGFuZCBzdG9wUHJvcGFnYXRpb24oKSBhcmUgYSBjb25zaXN0ZW50IGludGVyZmFjZSB0byB0aG9zZSBmdW5jdGlvbnNcbiAgICAgICAgLy8gb24gdGhlIERPTSwgc3RvcCgpIGlzIGFuIGFsaWFzIGZvciBib3RoIG9mIHRoZW0gdG9nZXRoZXJcbiAgICAgICAgRXZlbnQucHJvdG90eXBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0aGlzLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQpIHRoaXMub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgZWxzZSB0aGlzLm9yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxFdmVudC5zdG9wUHJvcGFnYXRpb24pIHRoaXMub3JpZ2luYWxFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGVsc2UgdGhpcy5vcmlnaW5hbEV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBFdmVudC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgdGhpcy5zdG9wcGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIC8vIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIGhhcyB0byBiZSBoYW5kbGVkIGludGVybmFsbHkgYmVjYXVzZSB3ZSBtYW5hZ2UgdGhlIGV2ZW50IGxpc3QgZm9yXG4gICAgICAgIC8vIGVhY2ggZWxlbWVudFxuICAgICAgICAvLyBub3RlIHRoYXQgb3JpZ2luYWxFbGVtZW50IG1heSBiZSBhIEJlYW4jRXZlbnQgb2JqZWN0IGluIHNvbWUgc2l0dWF0aW9uc1xuICAgICAgICBFdmVudC5wcm90b3R5cGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKClcbiAgICAgICAgICB0aGlzLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnQucHJvdG90eXBlLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRXZlbnQuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgJiYgdGhpcy5vcmlnaW5hbEV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKClcbiAgICAgICAgfVxuICAgICAgICBFdmVudC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoY3VycmVudFRhcmdldCkge1xuICAgICAgICAgIC8vVE9ETzogdGhpcyBpcyByaXBlIGZvciBvcHRpbWlzYXRpb24sIG5ldyBldmVudHMgYXJlICpleHBlbnNpdmUqXG4gICAgICAgICAgLy8gaW1wcm92aW5nIHRoaXMgd2lsbCBzcGVlZCB1cCBkZWxlZ2F0ZWQgZXZlbnRzXG4gICAgICAgICAgdmFyIG5lID0gbmV3IEV2ZW50KHRoaXMsIHRoaXMuZWxlbWVudCwgdGhpcy5pc05hdGl2ZSlcbiAgICAgICAgICBuZS5jdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldFxuICAgICAgICAgIHJldHVybiBuZVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEV2ZW50XG4gICAgICB9KCkpXG5cbiAgICAgIC8vIGlmIHdlJ3JlIGluIG9sZCBJRSB3ZSBjYW4ndCBkbyBvbnByb3BlcnR5Y2hhbmdlIG9uIGRvYyBvciB3aW4gc28gd2UgdXNlIGRvYy5kb2N1bWVudEVsZW1lbnQgZm9yIGJvdGhcbiAgICAsIHRhcmdldEVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgaXNOYXRpdmUpIHtcbiAgICAgICAgcmV0dXJuICFXM0NfTU9ERUwgJiYgIWlzTmF0aXZlICYmIChlbGVtZW50ID09PSBkb2MgfHwgZWxlbWVudCA9PT0gd2luKSA/IHJvb3QgOiBlbGVtZW50XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIEJlYW4gbWFpbnRhaW5zIGFuIGludGVybmFsIHJlZ2lzdHJ5IGZvciBldmVudCBsaXN0ZW5lcnMuIFdlIGRvbid0IHRvdWNoIGVsZW1lbnRzLCBvYmplY3RzXG4gICAgICAgICogb3IgZnVuY3Rpb25zIHRvIGlkZW50aWZ5IHRoZW0sIGluc3RlYWQgd2Ugc3RvcmUgZXZlcnl0aGluZyBpbiB0aGUgcmVnaXN0cnkuXG4gICAgICAgICogRWFjaCBldmVudCBsaXN0ZW5lciBoYXMgYSBSZWdFbnRyeSBvYmplY3QsIHdlIGhhdmUgb25lICdyZWdpc3RyeScgZm9yIHRoZSB3aG9sZSBpbnN0YW5jZS5cbiAgICAgICAgKi9cbiAgICAsIFJlZ0VudHJ5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gZWFjaCBoYW5kbGVyIGlzIHdyYXBwZWQgc28gd2UgY2FuIGhhbmRsZSBkZWxlZ2F0aW9uIGFuZCBjdXN0b20gZXZlbnRzXG4gICAgICAgIHZhciB3cmFwcGVkSGFuZGxlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBmbiwgY29uZGl0aW9uLCBhcmdzKSB7XG4gICAgICAgICAgICB2YXIgY2FsbCA9IGZ1bmN0aW9uIChldmVudCwgZWFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShlbGVtZW50LCBhcmdzID8gc2xpY2UuY2FsbChlYXJncywgZXZlbnQgPyAwIDogMSkuY29uY2F0KGFyZ3MpIDogZWFyZ3MpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIGZpbmRUYXJnZXQgPSBmdW5jdGlvbiAoZXZlbnQsIGV2ZW50RWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuLl9fYmVhbkRlbCA/IGZuLl9fYmVhbkRlbC5mdChldmVudC50YXJnZXQsIGVsZW1lbnQpIDogZXZlbnRFbGVtZW50XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIGhhbmRsZXIgPSBjb25kaXRpb25cbiAgICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGZpbmRUYXJnZXQoZXZlbnQsIHRoaXMpIC8vIGRlbGVhdGVkIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmRpdGlvbi5hcHBseSh0YXJnZXQsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudCkgZXZlbnQuY3VycmVudFRhcmdldCA9IHRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGwoZXZlbnQsIGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGZuLl9fYmVhbkRlbCkgZXZlbnQgPSBldmVudC5jbG9uZShmaW5kVGFyZ2V0KGV2ZW50KSkgLy8gZGVsZWdhdGVkIGV2ZW50LCBmaXggdGhlIGZpeFxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsKGV2ZW50LCBhcmd1bWVudHMpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhbmRsZXIuX19iZWFuRGVsID0gZm4uX19iZWFuRGVsXG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlclxuICAgICAgICAgIH1cblxuICAgICAgICAsIFJlZ0VudHJ5ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIGhhbmRsZXIsIG9yaWdpbmFsLCBuYW1lc3BhY2VzLCBhcmdzLCByb290KSB7XG4gICAgICAgICAgICB2YXIgY3VzdG9tVHlwZSAgICAgPSBjdXN0b21FdmVudHNbdHlwZV1cbiAgICAgICAgICAgICAgLCBpc05hdGl2ZVxuXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAndW5sb2FkJykge1xuICAgICAgICAgICAgICAvLyBzZWxmIGNsZWFuLXVwXG4gICAgICAgICAgICAgIGhhbmRsZXIgPSBvbmNlKHJlbW92ZUxpc3RlbmVyLCBlbGVtZW50LCB0eXBlLCBoYW5kbGVyLCBvcmlnaW5hbClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGUpIHtcbiAgICAgICAgICAgICAgaWYgKGN1c3RvbVR5cGUuY29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlciA9IHdyYXBwZWRIYW5kbGVyKGVsZW1lbnQsIGhhbmRsZXIsIGN1c3RvbVR5cGUuY29uZGl0aW9uLCBhcmdzKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHR5cGUgPSBjdXN0b21UeXBlLmJhc2UgfHwgdHlwZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmlzTmF0aXZlICAgICAgPSBpc05hdGl2ZSA9IG5hdGl2ZUV2ZW50c1t0eXBlXSAmJiAhIWVsZW1lbnRbZXZlbnRTdXBwb3J0XVxuICAgICAgICAgICAgdGhpcy5jdXN0b21UeXBlICAgID0gIVczQ19NT0RFTCAmJiAhaXNOYXRpdmUgJiYgdHlwZVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50ICAgICAgID0gZWxlbWVudFxuICAgICAgICAgICAgdGhpcy50eXBlICAgICAgICAgID0gdHlwZVxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbCAgICAgID0gb3JpZ2luYWxcbiAgICAgICAgICAgIHRoaXMubmFtZXNwYWNlcyAgICA9IG5hbWVzcGFjZXNcbiAgICAgICAgICAgIHRoaXMuZXZlbnRUeXBlICAgICA9IFczQ19NT0RFTCB8fCBpc05hdGl2ZSA/IHR5cGUgOiAncHJvcGVydHljaGFuZ2UnXG4gICAgICAgICAgICB0aGlzLnRhcmdldCAgICAgICAgPSB0YXJnZXRFbGVtZW50KGVsZW1lbnQsIGlzTmF0aXZlKVxuICAgICAgICAgICAgdGhpc1tldmVudFN1cHBvcnRdID0gISF0aGlzLnRhcmdldFtldmVudFN1cHBvcnRdXG4gICAgICAgICAgICB0aGlzLnJvb3QgICAgICAgICAgPSByb290XG4gICAgICAgICAgICB0aGlzLmhhbmRsZXIgICAgICAgPSB3cmFwcGVkSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBudWxsLCBhcmdzKVxuICAgICAgICAgIH1cblxuICAgICAgICAvLyBnaXZlbiBhIGxpc3Qgb2YgbmFtZXNwYWNlcywgaXMgb3VyIGVudHJ5IGluIGFueSBvZiB0aGVtP1xuICAgICAgICBSZWdFbnRyeS5wcm90b3R5cGUuaW5OYW1lc3BhY2VzID0gZnVuY3Rpb24gKGNoZWNrTmFtZXNwYWNlcykge1xuICAgICAgICAgIHZhciBpLCBqLCBjID0gMFxuICAgICAgICAgIGlmICghY2hlY2tOYW1lc3BhY2VzKSByZXR1cm4gdHJ1ZVxuICAgICAgICAgIGlmICghdGhpcy5uYW1lc3BhY2VzKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICBmb3IgKGkgPSBjaGVja05hbWVzcGFjZXMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgICBmb3IgKGogPSB0aGlzLm5hbWVzcGFjZXMubGVuZ3RoOyBqLS07KSB7XG4gICAgICAgICAgICAgIGlmIChjaGVja05hbWVzcGFjZXNbaV0gPT0gdGhpcy5uYW1lc3BhY2VzW2pdKSBjKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoZWNrTmFtZXNwYWNlcy5sZW5ndGggPT09IGNcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1hdGNoIGJ5IGVsZW1lbnQsIG9yaWdpbmFsIGZuIChvcHQpLCBoYW5kbGVyIGZuIChvcHQpXG4gICAgICAgIFJlZ0VudHJ5LnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24gKGNoZWNrRWxlbWVudCwgY2hlY2tPcmlnaW5hbCwgY2hlY2tIYW5kbGVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudCA9PT0gY2hlY2tFbGVtZW50ICYmXG4gICAgICAgICAgICAoIWNoZWNrT3JpZ2luYWwgfHwgdGhpcy5vcmlnaW5hbCA9PT0gY2hlY2tPcmlnaW5hbCkgJiZcbiAgICAgICAgICAgICghY2hlY2tIYW5kbGVyIHx8IHRoaXMuaGFuZGxlciA9PT0gY2hlY2tIYW5kbGVyKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlZ0VudHJ5XG4gICAgICB9KCkpXG5cbiAgICAsIHJlZ2lzdHJ5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gb3VyIG1hcCBzdG9yZXMgYXJyYXlzIGJ5IGV2ZW50IHR5cGUsIGp1c3QgYmVjYXVzZSBpdCdzIGJldHRlciB0aGFuIHN0b3JpbmdcbiAgICAgICAgLy8gZXZlcnl0aGluZyBpbiBhIHNpbmdsZSBhcnJheS5cbiAgICAgICAgLy8gdXNlcyAnJCcgYXMgYSBwcmVmaXggZm9yIHRoZSBrZXlzIGZvciBzYWZldHkgYW5kICdyJyBhcyBhIHNwZWNpYWwgcHJlZml4IGZvclxuICAgICAgICAvLyByb290TGlzdGVuZXJzIHNvIHdlIGNhbiBsb29rIHRoZW0gdXAgZmFzdFxuICAgICAgICB2YXIgbWFwID0ge31cblxuICAgICAgICAgIC8vIGdlbmVyaWMgZnVuY3Rpb25hbCBzZWFyY2ggb2Ygb3VyIHJlZ2lzdHJ5IGZvciBtYXRjaGluZyBsaXN0ZW5lcnMsXG4gICAgICAgICAgLy8gYGZuYCByZXR1cm5zIGZhbHNlIHRvIGJyZWFrIG91dCBvZiB0aGUgbG9vcFxuICAgICAgICAgICwgZm9yQWxsID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIG9yaWdpbmFsLCBoYW5kbGVyLCByb290LCBmbikge1xuICAgICAgICAgICAgICB2YXIgcGZ4ID0gcm9vdCA/ICdyJyA6ICckJ1xuICAgICAgICAgICAgICBpZiAoIXR5cGUgfHwgdHlwZSA9PSAnKicpIHtcbiAgICAgICAgICAgICAgICAvLyBzZWFyY2ggdGhlIHdob2xlIHJlZ2lzdHJ5XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdCBpbiBtYXApIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0LmNoYXJBdCgwKSA9PSBwZngpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yQWxsKGVsZW1lbnQsIHQuc3Vic3RyKDEpLCBvcmlnaW5hbCwgaGFuZGxlciwgcm9vdCwgZm4pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpID0gMCwgbCwgbGlzdCA9IG1hcFtwZnggKyB0eXBlXSwgYWxsID0gZWxlbWVudCA9PSAnKidcbiAgICAgICAgICAgICAgICBpZiAoIWxpc3QpIHJldHVyblxuICAgICAgICAgICAgICAgIGZvciAobCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoKGFsbCB8fCBsaXN0W2ldLm1hdGNoZXMoZWxlbWVudCwgb3JpZ2luYWwsIGhhbmRsZXIpKSAmJiAhZm4obGlzdFtpXSwgbGlzdCwgaSwgdHlwZSkpIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgLCBoYXMgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgb3JpZ2luYWwsIHJvb3QpIHtcbiAgICAgICAgICAgICAgLy8gd2UncmUgbm90IHVzaW5nIGZvckFsbCBoZXJlIHNpbXBseSBiZWNhdXNlIGl0J3MgYSBiaXQgc2xvd2VyIGFuZCB0aGlzXG4gICAgICAgICAgICAgIC8vIG5lZWRzIHRvIGJlIGZhc3RcbiAgICAgICAgICAgICAgdmFyIGksIGxpc3QgPSBtYXBbKHJvb3QgPyAncicgOiAnJCcpICsgdHlwZV1cbiAgICAgICAgICAgICAgaWYgKGxpc3QpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgICAgICAgICAgaWYgKCFsaXN0W2ldLnJvb3QgJiYgbGlzdFtpXS5tYXRjaGVzKGVsZW1lbnQsIG9yaWdpbmFsLCBudWxsKSkgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAsIGdldCA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBvcmlnaW5hbCwgcm9vdCkge1xuICAgICAgICAgICAgICB2YXIgZW50cmllcyA9IFtdXG4gICAgICAgICAgICAgIGZvckFsbChlbGVtZW50LCB0eXBlLCBvcmlnaW5hbCwgbnVsbCwgcm9vdCwgZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudHJpZXMucHVzaChlbnRyeSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgcmV0dXJuIGVudHJpZXNcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICwgcHV0ID0gZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgIHZhciBoYXMgPSAhZW50cnkucm9vdCAmJiAhdGhpcy5oYXMoZW50cnkuZWxlbWVudCwgZW50cnkudHlwZSwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgICAgICAgLCBrZXkgPSAoZW50cnkucm9vdCA/ICdyJyA6ICckJykgKyBlbnRyeS50eXBlXG4gICAgICAgICAgICAgIDsobWFwW2tleV0gfHwgKG1hcFtrZXldID0gW10pKS5wdXNoKGVudHJ5KVxuICAgICAgICAgICAgICByZXR1cm4gaGFzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAsIGRlbCA9IGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICBmb3JBbGwoZW50cnkuZWxlbWVudCwgZW50cnkudHlwZSwgbnVsbCwgZW50cnkuaGFuZGxlciwgZW50cnkucm9vdCwgZnVuY3Rpb24gKGVudHJ5LCBsaXN0LCBpKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICBlbnRyeS5yZW1vdmVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkgZGVsZXRlIG1hcFsoZW50cnkucm9vdCA/ICdyJyA6ICckJykgKyBlbnRyeS50eXBlXVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkdW1wIGFsbCBlbnRyaWVzLCB1c2VkIGZvciBvbnVubG9hZFxuICAgICAgICAgICwgZW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIHQsIGVudHJpZXMgPSBbXVxuICAgICAgICAgICAgICBmb3IgKHQgaW4gbWFwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHQuY2hhckF0KDApID09ICckJykgZW50cmllcyA9IGVudHJpZXMuY29uY2F0KG1hcFt0XSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZW50cmllc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IGhhczogaGFzLCBnZXQ6IGdldCwgcHV0OiBwdXQsIGRlbDogZGVsLCBlbnRyaWVzOiBlbnRyaWVzIH1cbiAgICAgIH0oKSlcblxuICAgICAgLy8gd2UgbmVlZCBhIHNlbGVjdG9yIGVuZ2luZSBmb3IgZGVsZWdhdGVkIGV2ZW50cywgdXNlIHF1ZXJ5U2VsZWN0b3JBbGwgaWYgaXQgZXhpc3RzXG4gICAgICAvLyBidXQgZm9yIG9sZGVyIGJyb3dzZXJzIHdlIG5lZWQgUXdlcnksIFNpenpsZSBvciBzaW1pbGFyXG4gICAgLCBzZWxlY3RvckVuZ2luZVxuICAgICwgc2V0U2VsZWN0b3JFbmdpbmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBzZWxlY3RvckVuZ2luZSA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsXG4gICAgICAgICAgICA/IGZ1bmN0aW9uIChzLCByKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIucXVlcnlTZWxlY3RvckFsbChzKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlYW46IE5vIHNlbGVjdG9yIGVuZ2luZSBpbnN0YWxsZWQnKSAvLyBlZWVrXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxlY3RvckVuZ2luZSA9IGVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyB3ZSBhdHRhY2ggdGhpcyBsaXN0ZW5lciB0byBlYWNoIERPTSBldmVudCB0aGF0IHdlIG5lZWQgdG8gbGlzdGVuIHRvLCBvbmx5IG9uY2VcbiAgICAgIC8vIHBlciBldmVudCB0eXBlIHBlciBET00gZWxlbWVudFxuICAgICwgcm9vdExpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50LCB0eXBlKSB7XG4gICAgICAgIGlmICghVzNDX01PREVMICYmIHR5cGUgJiYgZXZlbnQgJiYgZXZlbnQucHJvcGVydHlOYW1lICE9ICdfb24nICsgdHlwZSkgcmV0dXJuXG5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHJlZ2lzdHJ5LmdldCh0aGlzLCB0eXBlIHx8IGV2ZW50LnR5cGUsIG51bGwsIGZhbHNlKVxuICAgICAgICAgICwgbCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICAgICAsIGkgPSAwXG5cbiAgICAgICAgZXZlbnQgPSBuZXcgRXZlbnQoZXZlbnQsIHRoaXMsIHRydWUpXG4gICAgICAgIGlmICh0eXBlKSBldmVudC50eXBlID0gdHlwZVxuXG4gICAgICAgIC8vIGl0ZXJhdGUgdGhyb3VnaCBhbGwgaGFuZGxlcnMgcmVnaXN0ZXJlZCBmb3IgdGhpcyB0eXBlLCBjYWxsaW5nIHRoZW0gdW5sZXNzIHRoZXkgaGF2ZVxuICAgICAgICAvLyBiZWVuIHJlbW92ZWQgYnkgYSBwcmV2aW91cyBoYW5kbGVyIG9yIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIGhhcyBiZWVuIGNhbGxlZFxuICAgICAgICBmb3IgKDsgaSA8IGwgJiYgIWV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCk7IGkrKykge1xuICAgICAgICAgIGlmICghbGlzdGVuZXJzW2ldLnJlbW92ZWQpIGxpc3RlbmVyc1tpXS5oYW5kbGVyLmNhbGwodGhpcywgZXZlbnQpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYWRkIGFuZCByZW1vdmUgbGlzdGVuZXJzIHRvIERPTSBlbGVtZW50c1xuICAgICwgbGlzdGVuZXIgPSBXM0NfTU9ERUxcbiAgICAgICAgPyBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgYWRkKSB7XG4gICAgICAgICAgICAvLyBuZXcgYnJvd3NlcnNcbiAgICAgICAgICAgIGVsZW1lbnRbYWRkID8gYWRkRXZlbnQgOiByZW1vdmVFdmVudF0odHlwZSwgcm9vdExpc3RlbmVyLCBmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIGFkZCwgY3VzdG9tKSB7XG4gICAgICAgICAgICAvLyBJRTggYW5kIGJlbG93LCB1c2UgYXR0YWNoRXZlbnQvZGV0YWNoRXZlbnQgYW5kIHdlIGhhdmUgdG8gcGlnZ3ktYmFjayBwcm9wZXJ0eWNoYW5nZSBldmVudHNcbiAgICAgICAgICAgIC8vIHRvIHNpbXVsYXRlIGV2ZW50IGJ1YmJsaW5nIGV0Yy5cbiAgICAgICAgICAgIHZhciBlbnRyeVxuICAgICAgICAgICAgaWYgKGFkZCkge1xuICAgICAgICAgICAgICByZWdpc3RyeS5wdXQoZW50cnkgPSBuZXcgUmVnRW50cnkoXG4gICAgICAgICAgICAgICAgICBlbGVtZW50XG4gICAgICAgICAgICAgICAgLCBjdXN0b20gfHwgdHlwZVxuICAgICAgICAgICAgICAgICwgZnVuY3Rpb24gKGV2ZW50KSB7IC8vIGhhbmRsZXJcbiAgICAgICAgICAgICAgICAgICAgcm9vdExpc3RlbmVyLmNhbGwoZWxlbWVudCwgZXZlbnQsIGN1c3RvbSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAsIHJvb3RMaXN0ZW5lclxuICAgICAgICAgICAgICAgICwgbnVsbFxuICAgICAgICAgICAgICAgICwgbnVsbFxuICAgICAgICAgICAgICAgICwgdHJ1ZSAvLyBpcyByb290XG4gICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgIGlmIChjdXN0b20gJiYgZWxlbWVudFsnX29uJyArIGN1c3RvbV0gPT0gbnVsbCkgZWxlbWVudFsnX29uJyArIGN1c3RvbV0gPSAwXG4gICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5hdHRhY2hFdmVudCgnb24nICsgZW50cnkuZXZlbnRUeXBlLCBlbnRyeS5oYW5kbGVyKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZW50cnkgPSByZWdpc3RyeS5nZXQoZWxlbWVudCwgY3VzdG9tIHx8IHR5cGUsIHJvb3RMaXN0ZW5lciwgdHJ1ZSlbMF1cbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LmRldGFjaEV2ZW50KCdvbicgKyBlbnRyeS5ldmVudFR5cGUsIGVudHJ5LmhhbmRsZXIpXG4gICAgICAgICAgICAgICAgcmVnaXN0cnkuZGVsKGVudHJ5KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgLCBvbmNlID0gZnVuY3Rpb24gKHJtLCBlbGVtZW50LCB0eXBlLCBmbiwgb3JpZ2luYWxGbikge1xuICAgICAgICAvLyB3cmFwIHRoZSBoYW5kbGVyIGluIGEgaGFuZGxlciB0aGF0IGRvZXMgYSByZW1vdmUgYXMgd2VsbFxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgICBybShlbGVtZW50LCB0eXBlLCBvcmlnaW5hbEZuKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAsIHJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9yZ1R5cGUsIGhhbmRsZXIsIG5hbWVzcGFjZXMpIHtcbiAgICAgICAgdmFyIHR5cGUgICAgID0gb3JnVHlwZSAmJiBvcmdUeXBlLnJlcGxhY2UobmFtZVJlZ2V4LCAnJylcbiAgICAgICAgICAsIGhhbmRsZXJzID0gcmVnaXN0cnkuZ2V0KGVsZW1lbnQsIHR5cGUsIG51bGwsIGZhbHNlKVxuICAgICAgICAgICwgcmVtb3ZlZCAgPSB7fVxuICAgICAgICAgICwgaSwgbFxuXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBoYW5kbGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoKCFoYW5kbGVyIHx8IGhhbmRsZXJzW2ldLm9yaWdpbmFsID09PSBoYW5kbGVyKSAmJiBoYW5kbGVyc1tpXS5pbk5hbWVzcGFjZXMobmFtZXNwYWNlcykpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IHRoaXMgaXMgcHJvYmxlbWF0aWMsIHdlIGhhdmUgYSByZWdpc3RyeS5nZXQoKSBhbmQgcmVnaXN0cnkuZGVsKCkgdGhhdFxuICAgICAgICAgICAgLy8gYm90aCBkbyByZWdpc3RyeSBzZWFyY2hlcyBzbyB3ZSB3YXN0ZSBjeWNsZXMgZG9pbmcgdGhpcy4gTmVlZHMgdG8gYmUgcm9sbGVkIGludG9cbiAgICAgICAgICAgIC8vIGEgc2luZ2xlIHJlZ2lzdHJ5LmZvckFsbChmbikgdGhhdCByZW1vdmVzIHdoaWxlIGZpbmRpbmcsIGJ1dCB0aGUgY2F0Y2ggaXMgdGhhdFxuICAgICAgICAgICAgLy8gd2UnbGwgYmUgc3BsaWNpbmcgdGhlIGFycmF5cyB0aGF0IHdlJ3JlIGl0ZXJhdGluZyBvdmVyLiBOZWVkcyBleHRyYSB0ZXN0cyB0b1xuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGRvbid0IHNjcmV3IGl0IHVwLiBAcnZhZ2dcbiAgICAgICAgICAgIHJlZ2lzdHJ5LmRlbChoYW5kbGVyc1tpXSlcbiAgICAgICAgICAgIGlmICghcmVtb3ZlZFtoYW5kbGVyc1tpXS5ldmVudFR5cGVdICYmIGhhbmRsZXJzW2ldW2V2ZW50U3VwcG9ydF0pXG4gICAgICAgICAgICAgIHJlbW92ZWRbaGFuZGxlcnNbaV0uZXZlbnRUeXBlXSA9IHsgdDogaGFuZGxlcnNbaV0uZXZlbnRUeXBlLCBjOiBoYW5kbGVyc1tpXS50eXBlIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgZWFjaCB0eXBlL2VsZW1lbnQgZm9yIHJlbW92ZWQgbGlzdGVuZXJzIGFuZCByZW1vdmUgdGhlIHJvb3RMaXN0ZW5lciB3aGVyZSBpdCdzIG5vIGxvbmdlciBuZWVkZWRcbiAgICAgICAgZm9yIChpIGluIHJlbW92ZWQpIHtcbiAgICAgICAgICBpZiAoIXJlZ2lzdHJ5LmhhcyhlbGVtZW50LCByZW1vdmVkW2ldLnQsIG51bGwsIGZhbHNlKSkge1xuICAgICAgICAgICAgLy8gbGFzdCBsaXN0ZW5lciBvZiB0aGlzIHR5cGUsIHJlbW92ZSB0aGUgcm9vdExpc3RlbmVyXG4gICAgICAgICAgICBsaXN0ZW5lcihlbGVtZW50LCByZW1vdmVkW2ldLnQsIGZhbHNlLCByZW1vdmVkW2ldLmMpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCB1cCBhIGRlbGVnYXRlIGhlbHBlciB1c2luZyB0aGUgZ2l2ZW4gc2VsZWN0b3IsIHdyYXAgdGhlIGhhbmRsZXIgZnVuY3Rpb25cbiAgICAsIGRlbGVnYXRlID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBmbikge1xuICAgICAgICAvL1RPRE86IGZpbmRUYXJnZXQgKHRoZXJlZm9yZSAkKSBpcyBjYWxsZWQgdHdpY2UsIG9uY2UgZm9yIG1hdGNoIGFuZCBvbmNlIGZvclxuICAgICAgICAvLyBzZXR0aW5nIGUuY3VycmVudFRhcmdldCwgZml4IHRoaXMgc28gaXQncyBvbmx5IG5lZWRlZCBvbmNlXG4gICAgICAgIHZhciBmaW5kVGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCwgcm9vdCkge1xuICAgICAgICAgICAgICB2YXIgaSwgYXJyYXkgPSBpc1N0cmluZyhzZWxlY3RvcikgPyBzZWxlY3RvckVuZ2luZShzZWxlY3Rvciwgcm9vdCkgOiBzZWxlY3RvclxuICAgICAgICAgICAgICBmb3IgKDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gcm9vdDsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBhcnJheS5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gdGFyZ2V0KSByZXR1cm4gdGFyZ2V0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgLCBoYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgdmFyIG1hdGNoID0gZmluZFRhcmdldChlLnRhcmdldCwgdGhpcylcbiAgICAgICAgICAgICAgaWYgKG1hdGNoKSBmbi5hcHBseShtYXRjaCwgYXJndW1lbnRzKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIC8vIF9fYmVhbkRlbCBpc24ndCBwbGVhc2FudCBidXQgaXQncyBhIHByaXZhdGUgZnVuY3Rpb24sIG5vdCBleHBvc2VkIG91dHNpZGUgb2YgQmVhblxuICAgICAgICBoYW5kbGVyLl9fYmVhbkRlbCA9IHtcbiAgICAgICAgICAgIGZ0ICAgICAgIDogZmluZFRhcmdldCAvLyBhdHRhY2ggaXQgaGVyZSBmb3IgY3VzdG9tRXZlbnRzIHRvIHVzZSB0b29cbiAgICAgICAgICAsIHNlbGVjdG9yIDogc2VsZWN0b3JcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlclxuICAgICAgfVxuXG4gICAgLCBmaXJlTGlzdGVuZXIgPSBXM0NfTU9ERUwgPyBmdW5jdGlvbiAoaXNOYXRpdmUsIHR5cGUsIGVsZW1lbnQpIHtcbiAgICAgICAgLy8gbW9kZXJuIGJyb3dzZXJzLCBkbyBhIHByb3BlciBkaXNwYXRjaEV2ZW50KClcbiAgICAgICAgdmFyIGV2dCA9IGRvYy5jcmVhdGVFdmVudChpc05hdGl2ZSA/ICdIVE1MRXZlbnRzJyA6ICdVSUV2ZW50cycpXG4gICAgICAgIGV2dFtpc05hdGl2ZSA/ICdpbml0RXZlbnQnIDogJ2luaXRVSUV2ZW50J10odHlwZSwgdHJ1ZSwgdHJ1ZSwgd2luLCAxKVxuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KVxuICAgICAgfSA6IGZ1bmN0aW9uIChpc05hdGl2ZSwgdHlwZSwgZWxlbWVudCkge1xuICAgICAgICAvLyBvbGQgYnJvd3NlciB1c2Ugb25wcm9wZXJ0eWNoYW5nZSwganVzdCBpbmNyZW1lbnQgYSBjdXN0b20gcHJvcGVydHkgdG8gdHJpZ2dlciB0aGUgZXZlbnRcbiAgICAgICAgZWxlbWVudCA9IHRhcmdldEVsZW1lbnQoZWxlbWVudCwgaXNOYXRpdmUpXG4gICAgICAgIGlzTmF0aXZlID8gZWxlbWVudC5maXJlRXZlbnQoJ29uJyArIHR5cGUsIGRvYy5jcmVhdGVFdmVudE9iamVjdCgpKSA6IGVsZW1lbnRbJ19vbicgKyB0eXBlXSsrXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIFB1YmxpYyBBUEk6IG9mZigpLCBvbigpLCBhZGQoKSwgKHJlbW92ZSgpKSwgb25lKCksIGZpcmUoKSwgY2xvbmUoKVxuICAgICAgICAqL1xuXG4gICAgICAvKipcbiAgICAgICAgKiBvZmYoZWxlbWVudFssIGV2ZW50VHlwZShzKVssIGhhbmRsZXIgXV0pXG4gICAgICAgICovXG4gICAgLCBvZmYgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZVNwZWMsIGZuKSB7XG4gICAgICAgIHZhciBpc1R5cGVTdHIgPSBpc1N0cmluZyh0eXBlU3BlYylcbiAgICAgICAgICAsIGssIHR5cGUsIG5hbWVzcGFjZXMsIGlcblxuICAgICAgICBpZiAoaXNUeXBlU3RyICYmIHR5cGVTcGVjLmluZGV4T2YoJyAnKSA+IDApIHtcbiAgICAgICAgICAvLyBvZmYoZWwsICd0MSB0MiB0MycsIGZuKSBvciBvZmYoZWwsICd0MSB0MiB0MycpXG4gICAgICAgICAgdHlwZVNwZWMgPSBzdHIyYXJyKHR5cGVTcGVjKVxuICAgICAgICAgIGZvciAoaSA9IHR5cGVTcGVjLmxlbmd0aDsgaS0tOylcbiAgICAgICAgICAgIG9mZihlbGVtZW50LCB0eXBlU3BlY1tpXSwgZm4pXG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGUgPSBpc1R5cGVTdHIgJiYgdHlwZVNwZWMucmVwbGFjZShuYW1lUmVnZXgsICcnKVxuICAgICAgICBpZiAodHlwZSAmJiBjdXN0b21FdmVudHNbdHlwZV0pIHR5cGUgPSBjdXN0b21FdmVudHNbdHlwZV0uYmFzZVxuXG4gICAgICAgIGlmICghdHlwZVNwZWMgfHwgaXNUeXBlU3RyKSB7XG4gICAgICAgICAgLy8gb2ZmKGVsKSBvciBvZmYoZWwsIHQxLm5zKSBvciBvZmYoZWwsIC5ucykgb3Igb2ZmKGVsLCAubnMxLm5zMi5uczMpXG4gICAgICAgICAgaWYgKG5hbWVzcGFjZXMgPSBpc1R5cGVTdHIgJiYgdHlwZVNwZWMucmVwbGFjZShuYW1lc3BhY2VSZWdleCwgJycpKSBuYW1lc3BhY2VzID0gc3RyMmFycihuYW1lc3BhY2VzLCAnLicpXG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoZWxlbWVudCwgdHlwZSwgZm4sIG5hbWVzcGFjZXMpXG4gICAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih0eXBlU3BlYykpIHtcbiAgICAgICAgICAvLyBvZmYoZWwsIGZuKVxuICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGVsZW1lbnQsIG51bGwsIHR5cGVTcGVjKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG9mZihlbCwgeyB0MTogZm4xLCB0MiwgZm4yIH0pXG4gICAgICAgICAgZm9yIChrIGluIHR5cGVTcGVjKSB7XG4gICAgICAgICAgICBpZiAodHlwZVNwZWMuaGFzT3duUHJvcGVydHkoaykpIG9mZihlbGVtZW50LCBrLCB0eXBlU3BlY1trXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBvbihlbGVtZW50LCBldmVudFR5cGUocylbLCBzZWxlY3Rvcl0sIGhhbmRsZXJbLCBhcmdzIF0pXG4gICAgICAgICovXG4gICAgLCBvbiA9IGZ1bmN0aW9uKGVsZW1lbnQsIGV2ZW50cywgc2VsZWN0b3IsIGZuKSB7XG4gICAgICAgIHZhciBvcmlnaW5hbEZuLCB0eXBlLCB0eXBlcywgaSwgYXJncywgZW50cnksIGZpcnN0XG5cbiAgICAgICAgLy9UT0RPOiB0aGUgdW5kZWZpbmVkIGNoZWNrIG1lYW5zIHlvdSBjYW4ndCBwYXNzIGFuICdhcmdzJyBhcmd1bWVudCwgZml4IHRoaXMgcGVyaGFwcz9cbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIGV2ZW50cyA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgIC8vVE9ETzogdGhpcyBjYW4ndCBoYW5kbGUgZGVsZWdhdGVkIGV2ZW50c1xuICAgICAgICAgIGZvciAodHlwZSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcbiAgICAgICAgICAgICAgb24uY2FsbCh0aGlzLCBlbGVtZW50LCB0eXBlLCBldmVudHNbdHlwZV0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHNlbGVjdG9yKSkge1xuICAgICAgICAgIC8vIGRlbGVnYXRlZCBldmVudFxuICAgICAgICAgIG9yaWdpbmFsRm4gPSBmblxuICAgICAgICAgIGFyZ3MgICAgICAgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgNClcbiAgICAgICAgICBmbiAgICAgICAgID0gZGVsZWdhdGUoc2VsZWN0b3IsIG9yaWdpbmFsRm4sIHNlbGVjdG9yRW5naW5lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MgICAgICAgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMylcbiAgICAgICAgICBmbiAgICAgICAgID0gb3JpZ2luYWxGbiA9IHNlbGVjdG9yXG4gICAgICAgIH1cblxuICAgICAgICB0eXBlcyA9IHN0cjJhcnIoZXZlbnRzKVxuXG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3Igb25lKCksIHdyYXAgaW4gYSBzZWxmLXJlbW92aW5nIGhhbmRsZXJcbiAgICAgICAgaWYgKHRoaXMgPT09IE9ORSkge1xuICAgICAgICAgIGZuID0gb25jZShvZmYsIGVsZW1lbnQsIGV2ZW50cywgZm4sIG9yaWdpbmFsRm4pXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSB0eXBlcy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAvLyBhZGQgbmV3IGhhbmRsZXIgdG8gdGhlIHJlZ2lzdHJ5IGFuZCBjaGVjayBpZiBpdCdzIHRoZSBmaXJzdCBmb3IgdGhpcyBlbGVtZW50L3R5cGVcbiAgICAgICAgICBmaXJzdCA9IHJlZ2lzdHJ5LnB1dChlbnRyeSA9IG5ldyBSZWdFbnRyeShcbiAgICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgLCB0eXBlc1tpXS5yZXBsYWNlKG5hbWVSZWdleCwgJycpIC8vIGV2ZW50IHR5cGVcbiAgICAgICAgICAgICwgZm5cbiAgICAgICAgICAgICwgb3JpZ2luYWxGblxuICAgICAgICAgICAgLCBzdHIyYXJyKHR5cGVzW2ldLnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSwgJy4nKSAvLyBuYW1lc3BhY2VzXG4gICAgICAgICAgICAsIGFyZ3NcbiAgICAgICAgICAgICwgZmFsc2UgLy8gbm90IHJvb3RcbiAgICAgICAgICApKVxuICAgICAgICAgIGlmIChlbnRyeVtldmVudFN1cHBvcnRdICYmIGZpcnN0KSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBldmVudCBvZiB0aGlzIHR5cGUgb24gdGhpcyBlbGVtZW50LCBhZGQgcm9vdCBsaXN0ZW5lclxuICAgICAgICAgICAgbGlzdGVuZXIoZWxlbWVudCwgZW50cnkuZXZlbnRUeXBlLCB0cnVlLCBlbnRyeS5jdXN0b21UeXBlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIGFkZChlbGVtZW50Wywgc2VsZWN0b3JdLCBldmVudFR5cGUocyksIGhhbmRsZXJbLCBhcmdzIF0pXG4gICAgICAgICpcbiAgICAgICAgKiBEZXByZWNhdGVkOiBrZXB0IChmb3Igbm93KSBmb3IgYmFja3dhcmQtY29tcGF0aWJpbGl0eVxuICAgICAgICAqL1xuICAgICwgYWRkID0gZnVuY3Rpb24gKGVsZW1lbnQsIGV2ZW50cywgZm4sIGRlbGZuKSB7XG4gICAgICAgIHJldHVybiBvbi5hcHBseShcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAsICFpc1N0cmluZyhmbilcbiAgICAgICAgICAgICAgPyBzbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgOiBbIGVsZW1lbnQsIGZuLCBldmVudHMsIGRlbGZuIF0uY29uY2F0KGFyZ3VtZW50cy5sZW5ndGggPiAzID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDUpIDogW10pXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogb25lKGVsZW1lbnQsIGV2ZW50VHlwZShzKVssIHNlbGVjdG9yXSwgaGFuZGxlclssIGFyZ3MgXSlcbiAgICAgICAgKi9cbiAgICAsIG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG9uLmFwcGx5KE9ORSwgYXJndW1lbnRzKVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBmaXJlKGVsZW1lbnQsIGV2ZW50VHlwZShzKVssIGFyZ3MgXSlcbiAgICAgICAgKlxuICAgICAgICAqIFRoZSBvcHRpb25hbCAnYXJncycgYXJndW1lbnQgbXVzdCBiZSBhbiBhcnJheSwgaWYgbm8gJ2FyZ3MnIGFyZ3VtZW50IGlzIHByb3ZpZGVkXG4gICAgICAgICogdGhlbiB3ZSBjYW4gdXNlIHRoZSBicm93c2VyJ3MgRE9NIGV2ZW50IHN5c3RlbSwgb3RoZXJ3aXNlIHdlIHRyaWdnZXIgaGFuZGxlcnMgbWFudWFsbHlcbiAgICAgICAgKi9cbiAgICAsIGZpcmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgYXJncykge1xuICAgICAgICB2YXIgdHlwZXMgPSBzdHIyYXJyKHR5cGUpXG4gICAgICAgICAgLCBpLCBqLCBsLCBuYW1lcywgaGFuZGxlcnNcblxuICAgICAgICBmb3IgKGkgPSB0eXBlcy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICB0eXBlID0gdHlwZXNbaV0ucmVwbGFjZShuYW1lUmVnZXgsICcnKVxuICAgICAgICAgIGlmIChuYW1lcyA9IHR5cGVzW2ldLnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSkgbmFtZXMgPSBzdHIyYXJyKG5hbWVzLCAnLicpXG4gICAgICAgICAgaWYgKCFuYW1lcyAmJiAhYXJncyAmJiBlbGVtZW50W2V2ZW50U3VwcG9ydF0pIHtcbiAgICAgICAgICAgIGZpcmVMaXN0ZW5lcihuYXRpdmVFdmVudHNbdHlwZV0sIHR5cGUsIGVsZW1lbnQpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG5vbi1uYXRpdmUgZXZlbnQsIGVpdGhlciBiZWNhdXNlIG9mIGEgbmFtZXNwYWNlLCBhcmd1bWVudHMgb3IgYSBub24gRE9NIGVsZW1lbnRcbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgbGlzdGVuZXJzIGFuZCBtYW51YWxseSAnZmlyZSdcbiAgICAgICAgICAgIGhhbmRsZXJzID0gcmVnaXN0cnkuZ2V0KGVsZW1lbnQsIHR5cGUsIG51bGwsIGZhbHNlKVxuICAgICAgICAgICAgYXJncyA9IFtmYWxzZV0uY29uY2F0KGFyZ3MpXG4gICAgICAgICAgICBmb3IgKGogPSAwLCBsID0gaGFuZGxlcnMubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChoYW5kbGVyc1tqXS5pbk5hbWVzcGFjZXMobmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcnNbal0uaGFuZGxlci5hcHBseShlbGVtZW50LCBhcmdzKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIGNsb25lKGRzdEVsZW1lbnQsIHNyY0VsZW1lbnRbLCBldmVudFR5cGUgXSlcbiAgICAgICAgKlxuICAgICAgICAqIFRPRE86IHBlcmhhcHMgZm9yIGNvbnNpc3RlbmN5IHdlIHNob3VsZCBhbGxvdyB0aGUgc2FtZSBmbGV4aWJpbGl0eSBpbiB0eXBlIHNwZWNpZmllcnM/XG4gICAgICAgICovXG4gICAgLCBjbG9uZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBmcm9tLCB0eXBlKSB7XG4gICAgICAgIHZhciBoYW5kbGVycyA9IHJlZ2lzdHJ5LmdldChmcm9tLCB0eXBlLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICAsIGwgPSBoYW5kbGVycy5sZW5ndGhcbiAgICAgICAgICAsIGkgPSAwXG4gICAgICAgICAgLCBhcmdzLCBiZWFuRGVsXG5cbiAgICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoaGFuZGxlcnNbaV0ub3JpZ2luYWwpIHtcbiAgICAgICAgICAgIGFyZ3MgPSBbIGVsZW1lbnQsIGhhbmRsZXJzW2ldLnR5cGUgXVxuICAgICAgICAgICAgaWYgKGJlYW5EZWwgPSBoYW5kbGVyc1tpXS5oYW5kbGVyLl9fYmVhbkRlbCkgYXJncy5wdXNoKGJlYW5EZWwuc2VsZWN0b3IpXG4gICAgICAgICAgICBhcmdzLnB1c2goaGFuZGxlcnNbaV0ub3JpZ2luYWwpXG4gICAgICAgICAgICBvbi5hcHBseShudWxsLCBhcmdzKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgfVxuXG4gICAgLCBiZWFuID0ge1xuICAgICAgICAgIG9uICAgICAgICAgICAgICAgIDogb25cbiAgICAgICAgLCBhZGQgICAgICAgICAgICAgICA6IGFkZFxuICAgICAgICAsIG9uZSAgICAgICAgICAgICAgIDogb25lXG4gICAgICAgICwgb2ZmICAgICAgICAgICAgICAgOiBvZmZcbiAgICAgICAgLCByZW1vdmUgICAgICAgICAgICA6IG9mZlxuICAgICAgICAsIGNsb25lICAgICAgICAgICAgIDogY2xvbmVcbiAgICAgICAgLCBmaXJlICAgICAgICAgICAgICA6IGZpcmVcbiAgICAgICAgLCBFdmVudCAgICAgICAgICAgICA6IEV2ZW50XG4gICAgICAgICwgc2V0U2VsZWN0b3JFbmdpbmUgOiBzZXRTZWxlY3RvckVuZ2luZVxuICAgICAgICAsIG5vQ29uZmxpY3QgICAgICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29udGV4dFtuYW1lXSA9IG9sZFxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgLy8gZm9yIElFLCBjbGVhbiB1cCBvbiB1bmxvYWQgdG8gYXZvaWQgbGVha3NcbiAgaWYgKHdpbi5hdHRhY2hFdmVudCkge1xuICAgIHZhciBjbGVhbnVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGksIGVudHJpZXMgPSByZWdpc3RyeS5lbnRyaWVzKClcbiAgICAgIGZvciAoaSBpbiBlbnRyaWVzKSB7XG4gICAgICAgIGlmIChlbnRyaWVzW2ldLnR5cGUgJiYgZW50cmllc1tpXS50eXBlICE9PSAndW5sb2FkJykgb2ZmKGVudHJpZXNbaV0uZWxlbWVudCwgZW50cmllc1tpXS50eXBlKVxuICAgICAgfVxuICAgICAgd2luLmRldGFjaEV2ZW50KCdvbnVubG9hZCcsIGNsZWFudXApXG4gICAgICB3aW4uQ29sbGVjdEdhcmJhZ2UgJiYgd2luLkNvbGxlY3RHYXJiYWdlKClcbiAgICB9XG4gICAgd2luLmF0dGFjaEV2ZW50KCdvbnVubG9hZCcsIGNsZWFudXApXG4gIH1cblxuICAvLyBpbml0aWFsaXplIHNlbGVjdG9yIGVuZ2luZSB0byBpbnRlcm5hbCBkZWZhdWx0IChxU0Egb3IgdGhyb3cgRXJyb3IpXG4gIHNldFNlbGVjdG9yRW5naW5lKClcblxuICByZXR1cm4gYmVhblxufSk7IiwiLyohXG4gICogQm9uem86IERPTSBVdGlsaXR5IChjKSBEdXN0aW4gRGlheiAyMDEyXG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9ib256b1xuICAqIExpY2Vuc2UgTUlUXG4gICovXG4oZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KSgnYm9uem8nLCB0aGlzLCBmdW5jdGlvbigpIHtcbiAgdmFyIHdpbiA9IHdpbmRvd1xuICAgICwgZG9jID0gd2luLmRvY3VtZW50XG4gICAgLCBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudFxuICAgICwgcGFyZW50Tm9kZSA9ICdwYXJlbnROb2RlJ1xuICAgICwgc3BlY2lhbEF0dHJpYnV0ZXMgPSAvXihjaGVja2VkfHZhbHVlfHNlbGVjdGVkfGRpc2FibGVkKSQvaVxuICAgICAgLy8gdGFncyB0aGF0IHdlIGhhdmUgdHJvdWJsZSBpbnNlcnRpbmcgKmludG8qXG4gICAgLCBzcGVjaWFsVGFncyA9IC9eKHNlbGVjdHxmaWVsZHNldHx0YWJsZXx0Ym9keXx0Zm9vdHx0ZHx0cnxjb2xncm91cCkkL2lcbiAgICAsIHNpbXBsZVNjcmlwdFRhZ1JlID0gL1xccyo8c2NyaXB0ICtzcmM9WydcIl0oW14nXCJdKylbJ1wiXT4vXG4gICAgLCB0YWJsZSA9IFsnPHRhYmxlPicsICc8L3RhYmxlPicsIDFdXG4gICAgLCB0ZCA9IFsnPHRhYmxlPjx0Ym9keT48dHI+JywgJzwvdHI+PC90Ym9keT48L3RhYmxlPicsIDNdXG4gICAgLCBvcHRpb24gPSBbJzxzZWxlY3Q+JywgJzwvc2VsZWN0PicsIDFdXG4gICAgLCBub3Njb3BlID0gWydfJywgJycsIDAsIDFdXG4gICAgLCB0YWdNYXAgPSB7IC8vIHRhZ3MgdGhhdCB3ZSBoYXZlIHRyb3VibGUgKmluc2VydGluZypcbiAgICAgICAgICB0aGVhZDogdGFibGUsIHRib2R5OiB0YWJsZSwgdGZvb3Q6IHRhYmxlLCBjb2xncm91cDogdGFibGUsIGNhcHRpb246IHRhYmxlXG4gICAgICAgICwgdHI6IFsnPHRhYmxlPjx0Ym9keT4nLCAnPC90Ym9keT48L3RhYmxlPicsIDJdXG4gICAgICAgICwgdGg6IHRkICwgdGQ6IHRkXG4gICAgICAgICwgY29sOiBbJzx0YWJsZT48Y29sZ3JvdXA+JywgJzwvY29sZ3JvdXA+PC90YWJsZT4nLCAyXVxuICAgICAgICAsIGZpZWxkc2V0OiBbJzxmb3JtPicsICc8L2Zvcm0+JywgMV1cbiAgICAgICAgLCBsZWdlbmQ6IFsnPGZvcm0+PGZpZWxkc2V0PicsICc8L2ZpZWxkc2V0PjwvZm9ybT4nLCAyXVxuICAgICAgICAsIG9wdGlvbjogb3B0aW9uLCBvcHRncm91cDogb3B0aW9uXG4gICAgICAgICwgc2NyaXB0OiBub3Njb3BlLCBzdHlsZTogbm9zY29wZSwgbGluazogbm9zY29wZSwgcGFyYW06IG5vc2NvcGUsIGJhc2U6IG5vc2NvcGVcbiAgICAgIH1cbiAgICAsIHN0YXRlQXR0cmlidXRlcyA9IC9eKGNoZWNrZWR8c2VsZWN0ZWR8ZGlzYWJsZWQpJC9cbiAgICAsIGllID0gL21zaWUvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpXG4gICAgLCBoYXNDbGFzcywgYWRkQ2xhc3MsIHJlbW92ZUNsYXNzXG4gICAgLCB1aWRNYXAgPSB7fVxuICAgICwgdXVpZHMgPSAwXG4gICAgLCBkaWdpdCA9IC9eLT9bXFxkXFwuXSskL1xuICAgICwgZGF0dHIgPSAvXmRhdGEtKC4rKSQvXG4gICAgLCBweCA9ICdweCdcbiAgICAsIHNldEF0dHJpYnV0ZSA9ICdzZXRBdHRyaWJ1dGUnXG4gICAgLCBnZXRBdHRyaWJ1dGUgPSAnZ2V0QXR0cmlidXRlJ1xuICAgICwgYnlUYWcgPSAnZ2V0RWxlbWVudHNCeVRhZ05hbWUnXG4gICAgLCBmZWF0dXJlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgZS5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiN4XCI+eDwvYT48dGFibGUgc3R5bGU9XCJmbG9hdDpsZWZ0O1wiPjwvdGFibGU+J1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWZFeHRlbmRlZDogZVtieVRhZ10oJ2EnKVswXVtnZXRBdHRyaWJ1dGVdKCdocmVmJykgIT0gJyN4JyAvLyBJRSA8IDhcbiAgICAgICAgLCBhdXRvVGJvZHk6IGVbYnlUYWddKCd0Ym9keScpLmxlbmd0aCAhPT0gMCAvLyBJRSA8IDhcbiAgICAgICAgLCBjb21wdXRlZFN0eWxlOiBkb2MuZGVmYXVsdFZpZXcgJiYgZG9jLmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGVcbiAgICAgICAgLCBjc3NGbG9hdDogZVtieVRhZ10oJ3RhYmxlJylbMF0uc3R5bGUuc3R5bGVGbG9hdCA/ICdzdHlsZUZsb2F0JyA6ICdjc3NGbG9hdCdcbiAgICAgICAgLCB0cmFuc2Zvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9wcyA9IFsndHJhbnNmb3JtJywgJ3dlYmtpdFRyYW5zZm9ybScsICdNb3pUcmFuc2Zvcm0nLCAnT1RyYW5zZm9ybScsICdtc1RyYW5zZm9ybSddLCBpXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHByb3BzW2ldIGluIGUuc3R5bGUpIHJldHVybiBwcm9wc1tpXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0oKVxuICAgICAgICAsIGNsYXNzTGlzdDogJ2NsYXNzTGlzdCcgaW4gZVxuICAgICAgICAsIG9wYXNpdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZG9jLmNyZWF0ZUVsZW1lbnQoJ2EnKS5zdHlsZS5vcGFjaXR5ICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgIH0oKVxuICAgICAgICB9XG4gICAgICB9KClcbiAgICAsIHRyaW1SZXBsYWNlID0gLyheXFxzKnxcXHMqJCkvZ1xuICAgICwgd2hpdGVzcGFjZVJlZ2V4ID0gL1xccysvXG4gICAgLCB0b1N0cmluZyA9IFN0cmluZy5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAsIHVuaXRsZXNzID0geyBsaW5lSGVpZ2h0OiAxLCB6b29tOiAxLCB6SW5kZXg6IDEsIG9wYWNpdHk6IDEsIGJveEZsZXg6IDEsIFdlYmtpdEJveEZsZXg6IDEsIE1vekJveEZsZXg6IDEgfVxuICAgICwgcXVlcnkgPSBkb2MucXVlcnlTZWxlY3RvckFsbCAmJiBmdW5jdGlvbiAoc2VsZWN0b3IpIHsgcmV0dXJuIGRvYy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSB9XG4gICAgLCB0cmltID0gU3RyaW5nLnByb3RvdHlwZS50cmltID9cbiAgICAgICAgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICByZXR1cm4gcy50cmltKClcbiAgICAgICAgfSA6XG4gICAgICAgIGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgcmV0dXJuIHMucmVwbGFjZSh0cmltUmVwbGFjZSwgJycpXG4gICAgICAgIH1cblxuICAgICwgZ2V0U3R5bGUgPSBmZWF0dXJlcy5jb21wdXRlZFN0eWxlXG4gICAgICAgID8gZnVuY3Rpb24gKGVsLCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gbnVsbFxuICAgICAgICAgICAgICAsIGNvbXB1dGVkID0gZG9jLmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWwsICcnKVxuICAgICAgICAgICAgY29tcHV0ZWQgJiYgKHZhbHVlID0gY29tcHV0ZWRbcHJvcGVydHldKVxuICAgICAgICAgICAgcmV0dXJuIGVsLnN0eWxlW3Byb3BlcnR5XSB8fCB2YWx1ZVxuICAgICAgICAgIH1cbiAgICAgICAgOiAhKGllICYmIGh0bWwuY3VycmVudFN0eWxlKVxuICAgICAgICAgID8gZnVuY3Rpb24gKGVsLCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWwuc3R5bGVbcHJvcGVydHldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOlxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlcbiAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd8bnVtYmVyfVxuICAgICAgICAgICAqL1xuICAgICAgICAgIGZ1bmN0aW9uIChlbCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgIHZhciB2YWwsIHZhbHVlXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gJ29wYWNpdHknICYmICFmZWF0dXJlcy5vcGFzaXR5KSB7XG4gICAgICAgICAgICAgIHZhbCA9IDEwMFxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhbCA9IGVsWydmaWx0ZXJzJ11bJ0RYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkFscGhhJ10ub3BhY2l0eVxuICAgICAgICAgICAgICB9IGNhdGNoIChlMSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICB2YWwgPSBlbFsnZmlsdGVycyddKCdhbHBoYScpLm9wYWNpdHlcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlMikge31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdmFsIC8gMTAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IGVsLmN1cnJlbnRTdHlsZSA/IGVsLmN1cnJlbnRTdHlsZVtwcm9wZXJ0eV0gOiBudWxsXG4gICAgICAgICAgICByZXR1cm4gZWwuc3R5bGVbcHJvcGVydHldIHx8IHZhbHVlXG4gICAgICAgICAgfVxuXG4gIGZ1bmN0aW9uIGlzTm9kZShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5ub2RlTmFtZSAmJiAobm9kZS5ub2RlVHlwZSA9PSAxIHx8IG5vZGUubm9kZVR5cGUgPT0gMTEpXG4gIH1cblxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShub2RlLCBob3N0LCBjbG9uZSkge1xuICAgIHZhciBpLCBsLCByZXRcbiAgICBpZiAodHlwZW9mIG5vZGUgPT0gJ3N0cmluZycpIHJldHVybiBib256by5jcmVhdGUobm9kZSlcbiAgICBpZiAoaXNOb2RlKG5vZGUpKSBub2RlID0gWyBub2RlIF1cbiAgICBpZiAoY2xvbmUpIHtcbiAgICAgIHJldCA9IFtdIC8vIGRvbid0IGNoYW5nZSBvcmlnaW5hbCBhcnJheVxuICAgICAgZm9yIChpID0gMCwgbCA9IG5vZGUubGVuZ3RoOyBpIDwgbDsgaSsrKSByZXRbaV0gPSBjbG9uZU5vZGUoaG9zdCwgbm9kZVtpXSlcbiAgICAgIHJldHVybiByZXRcbiAgICB9XG4gICAgcmV0dXJuIG5vZGVcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYyBhIGNsYXNzIG5hbWUgdG8gdGVzdFxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gY2xhc3NSZWcoYykge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCcoXnxcXFxccyspJyArIGMgKyAnKFxcXFxzK3wkKScpXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0JvbnpvfEFycmF5fSBhclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCwgbnVtYmVyLCAoQm9uem98QXJyYXkpKX0gZm5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfc2NvcGVcbiAgICogQHBhcmFtIHtib29sZWFuPX0gb3B0X3JldlxuICAgKiBAcmV0dXJuIHtCb256b3xBcnJheX1cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2goYXIsIGZuLCBvcHRfc2NvcGUsIG9wdF9yZXYpIHtcbiAgICB2YXIgaW5kLCBpID0gMCwgbCA9IGFyLmxlbmd0aFxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpbmQgPSBvcHRfcmV2ID8gYXIubGVuZ3RoIC0gaSAtIDEgOiBpXG4gICAgICBmbi5jYWxsKG9wdF9zY29wZSB8fCBhcltpbmRdLCBhcltpbmRdLCBpbmQsIGFyKVxuICAgIH1cbiAgICByZXR1cm4gYXJcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Qm9uem98QXJyYXl9IGFyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LCBudW1iZXIsIChCb256b3xBcnJheSkpfSBmblxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9zY29wZVxuICAgKiBAcmV0dXJuIHtCb256b3xBcnJheX1cbiAgICovXG4gIGZ1bmN0aW9uIGRlZXBFYWNoKGFyLCBmbiwgb3B0X3Njb3BlKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChpc05vZGUoYXJbaV0pKSB7XG4gICAgICAgIGRlZXBFYWNoKGFyW2ldLmNoaWxkTm9kZXMsIGZuLCBvcHRfc2NvcGUpXG4gICAgICAgIGZuLmNhbGwob3B0X3Njb3BlIHx8IGFyW2ldLCBhcltpXSwgaSwgYXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhclxuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gY2FtZWxpemUocykge1xuICAgIHJldHVybiBzLnJlcGxhY2UoLy0oLikvZywgZnVuY3Rpb24gKG0sIG0xKSB7XG4gICAgICByZXR1cm4gbTEudG9VcHBlckNhc2UoKVxuICAgIH0pXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBkZWNhbWVsaXplKHMpIHtcbiAgICByZXR1cm4gcyA/IHMucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKSA6IHNcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGZ1bmN0aW9uIGRhdGEoZWwpIHtcbiAgICBlbFtnZXRBdHRyaWJ1dGVdKCdkYXRhLW5vZGUtdWlkJykgfHwgZWxbc2V0QXR0cmlidXRlXSgnZGF0YS1ub2RlLXVpZCcsICsrdXVpZHMpXG4gICAgdmFyIHVpZCA9IGVsW2dldEF0dHJpYnV0ZV0oJ2RhdGEtbm9kZS11aWQnKVxuICAgIHJldHVybiB1aWRNYXBbdWlkXSB8fCAodWlkTWFwW3VpZF0gPSB7fSlcbiAgfVxuXG5cbiAgLyoqXG4gICAqIHJlbW92ZXMgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGFuIGVsZW1lbnRcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgKi9cbiAgZnVuY3Rpb24gY2xlYXJEYXRhKGVsKSB7XG4gICAgdmFyIHVpZCA9IGVsW2dldEF0dHJpYnV0ZV0oJ2RhdGEtbm9kZS11aWQnKVxuICAgIGlmICh1aWQpIGRlbGV0ZSB1aWRNYXBbdWlkXVxuICB9XG5cblxuICBmdW5jdGlvbiBkYXRhVmFsdWUoZCkge1xuICAgIHZhciBmXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZCA9PT0gbnVsbCB8fCBkID09PSB1bmRlZmluZWQpID8gdW5kZWZpbmVkIDpcbiAgICAgICAgZCA9PT0gJ3RydWUnID8gdHJ1ZSA6XG4gICAgICAgICAgZCA9PT0gJ2ZhbHNlJyA/IGZhbHNlIDpcbiAgICAgICAgICAgIGQgPT09ICdudWxsJyA/IG51bGwgOlxuICAgICAgICAgICAgICAoZiA9IHBhcnNlRmxvYXQoZCkpID09IGQgPyBmIDogZDtcbiAgICB9IGNhdGNoKGUpIHt9XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtCb256b3xBcnJheX0gYXJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsIG51bWJlciwgKEJvbnpvfEFycmF5KSl9IGZuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3Njb3BlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgYHNvbWVgdGhpbmcgd2FzIGZvdW5kXG4gICAqL1xuICBmdW5jdGlvbiBzb21lKGFyLCBmbiwgb3B0X3Njb3BlKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBhci5sZW5ndGg7IGkgPCBqOyArK2kpIGlmIChmbi5jYWxsKG9wdF9zY29wZSB8fCBudWxsLCBhcltpXSwgaSwgYXIpKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cblxuICAvKipcbiAgICogdGhpcyBjb3VsZCBiZSBhIGdpYW50IGVudW0gb2YgQ1NTIHByb3BlcnRpZXNcbiAgICogYnV0IGluIGZhdm9yIG9mIGZpbGUgc2l6ZSBzYW5zLWNsb3N1cmUgZGVhZGNvZGUgb3B0aW1pemF0aW9uc1xuICAgKiB3ZSdyZSBqdXN0IGFza2luZyBmb3IgYW55IG9sIHN0cmluZ1xuICAgKiB0aGVuIGl0IGdldHMgdHJhbnNmb3JtZWQgaW50byB0aGUgYXBwcm9wcmlhdGUgc3R5bGUgcHJvcGVydHkgZm9yIEpTIGFjY2Vzc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzdHlsZVByb3BlcnR5KHApIHtcbiAgICAgIChwID09ICd0cmFuc2Zvcm0nICYmIChwID0gZmVhdHVyZXMudHJhbnNmb3JtKSkgfHxcbiAgICAgICAgKC9edHJhbnNmb3JtLT9bT29dcmlnaW4kLy50ZXN0KHApICYmIChwID0gZmVhdHVyZXMudHJhbnNmb3JtICsgJ09yaWdpbicpKSB8fFxuICAgICAgICAocCA9PSAnZmxvYXQnICYmIChwID0gZmVhdHVyZXMuY3NzRmxvYXQpKVxuICAgICAgcmV0dXJuIHAgPyBjYW1lbGl6ZShwKSA6IG51bGxcbiAgfVxuXG4gIC8vIHRoaXMgaW5zZXJ0IG1ldGhvZCBpcyBpbnRlbnNlXG4gIGZ1bmN0aW9uIGluc2VydCh0YXJnZXQsIGhvc3QsIGZuLCByZXYpIHtcbiAgICB2YXIgaSA9IDAsIHNlbGYgPSBob3N0IHx8IHRoaXMsIHIgPSBbXVxuICAgICAgLy8gdGFyZ2V0IG5vZGVzIGNvdWxkIGJlIGEgY3NzIHNlbGVjdG9yIGlmIGl0J3MgYSBzdHJpbmcgYW5kIGEgc2VsZWN0b3IgZW5naW5lIGlzIHByZXNlbnRcbiAgICAgIC8vIG90aGVyd2lzZSwganVzdCB1c2UgdGFyZ2V0XG4gICAgICAsIG5vZGVzID0gcXVlcnkgJiYgdHlwZW9mIHRhcmdldCA9PSAnc3RyaW5nJyAmJiB0YXJnZXQuY2hhckF0KDApICE9ICc8JyA/IHF1ZXJ5KHRhcmdldCkgOiB0YXJnZXRcbiAgICAvLyBub3JtYWxpemUgZWFjaCBub2RlIGluIGNhc2UgaXQncyBzdGlsbCBhIHN0cmluZyBhbmQgd2UgbmVlZCB0byBjcmVhdGUgbm9kZXMgb24gdGhlIGZseVxuICAgIGVhY2gobm9ybWFsaXplKG5vZGVzKSwgZnVuY3Rpb24gKHQsIGopIHtcbiAgICAgIGVhY2goc2VsZiwgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGZuKHQsIHJbaSsrXSA9IGogPiAwID8gY2xvbmVOb2RlKHNlbGYsIGVsKSA6IGVsKVxuICAgICAgfSwgbnVsbCwgcmV2KVxuICAgIH0sIHRoaXMsIHJldilcbiAgICBzZWxmLmxlbmd0aCA9IGlcbiAgICBlYWNoKHIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmWy0taV0gPSBlXG4gICAgfSwgbnVsbCwgIXJldilcbiAgICByZXR1cm4gc2VsZlxuICB9XG5cblxuICAvKipcbiAgICogc2V0cyBhbiBlbGVtZW50IHRvIGFuIGV4cGxpY2l0IHgveSBwb3NpdGlvbiBvbiB0aGUgcGFnZVxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqIEBwYXJhbSB7P251bWJlcn0geFxuICAgKiBAcGFyYW0gez9udW1iZXJ9IHlcbiAgICovXG4gIGZ1bmN0aW9uIHh5KGVsLCB4LCB5KSB7XG4gICAgdmFyICRlbCA9IGJvbnpvKGVsKVxuICAgICAgLCBzdHlsZSA9ICRlbC5jc3MoJ3Bvc2l0aW9uJylcbiAgICAgICwgb2Zmc2V0ID0gJGVsLm9mZnNldCgpXG4gICAgICAsIHJlbCA9ICdyZWxhdGl2ZSdcbiAgICAgICwgaXNSZWwgPSBzdHlsZSA9PSByZWxcbiAgICAgICwgZGVsdGEgPSBbcGFyc2VJbnQoJGVsLmNzcygnbGVmdCcpLCAxMCksIHBhcnNlSW50KCRlbC5jc3MoJ3RvcCcpLCAxMCldXG5cbiAgICBpZiAoc3R5bGUgPT0gJ3N0YXRpYycpIHtcbiAgICAgICRlbC5jc3MoJ3Bvc2l0aW9uJywgcmVsKVxuICAgICAgc3R5bGUgPSByZWxcbiAgICB9XG5cbiAgICBpc05hTihkZWx0YVswXSkgJiYgKGRlbHRhWzBdID0gaXNSZWwgPyAwIDogZWwub2Zmc2V0TGVmdClcbiAgICBpc05hTihkZWx0YVsxXSkgJiYgKGRlbHRhWzFdID0gaXNSZWwgPyAwIDogZWwub2Zmc2V0VG9wKVxuXG4gICAgeCAhPSBudWxsICYmIChlbC5zdHlsZS5sZWZ0ID0geCAtIG9mZnNldC5sZWZ0ICsgZGVsdGFbMF0gKyBweClcbiAgICB5ICE9IG51bGwgJiYgKGVsLnN0eWxlLnRvcCA9IHkgLSBvZmZzZXQudG9wICsgZGVsdGFbMV0gKyBweClcblxuICB9XG5cbiAgLy8gY2xhc3NMaXN0IHN1cHBvcnQgZm9yIGNsYXNzIG1hbmFnZW1lbnRcbiAgLy8gYWx0aG8gdG8gYmUgZmFpciwgdGhlIGFwaSBzdWNrcyBiZWNhdXNlIGl0IHdvbid0IGFjY2VwdCBtdWx0aXBsZSBjbGFzc2VzIGF0IG9uY2VcbiAgaWYgKGZlYXR1cmVzLmNsYXNzTGlzdCkge1xuICAgIGhhc0NsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGMpXG4gICAgfVxuICAgIGFkZENsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGMpXG4gICAgfVxuICAgIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGMpXG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGhhc0NsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICByZXR1cm4gY2xhc3NSZWcoYykudGVzdChlbC5jbGFzc05hbWUpXG4gICAgfVxuICAgIGFkZENsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICBlbC5jbGFzc05hbWUgPSB0cmltKGVsLmNsYXNzTmFtZSArICcgJyArIGMpXG4gICAgfVxuICAgIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGVsLCBjKSB7XG4gICAgICBlbC5jbGFzc05hbWUgPSB0cmltKGVsLmNsYXNzTmFtZS5yZXBsYWNlKGNsYXNzUmVnKGMpLCAnICcpKVxuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIHRoaXMgYWxsb3dzIG1ldGhvZCBjYWxsaW5nIGZvciBzZXR0aW5nIHZhbHVlc1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBib256byhlbGVtZW50cykuY3NzKCdjb2xvcicsIGZ1bmN0aW9uIChlbCkge1xuICAgKiAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3JpZ2luYWwtY29sb3InKVxuICAgKiB9KVxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24gKEVsZW1lbnQpfHN0cmluZ31cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gc2V0dGVyKGVsLCB2KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2ID09ICdmdW5jdGlvbicgPyB2KGVsKSA6IHZcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjcm9sbCh4LCB5LCB0eXBlKSB7XG4gICAgdmFyIGVsID0gdGhpc1swXVxuICAgIGlmICghZWwpIHJldHVybiB0aGlzXG4gICAgaWYgKHggPT0gbnVsbCAmJiB5ID09IG51bGwpIHtcbiAgICAgIHJldHVybiAoaXNCb2R5KGVsKSA/IGdldFdpbmRvd1Njcm9sbCgpIDogeyB4OiBlbC5zY3JvbGxMZWZ0LCB5OiBlbC5zY3JvbGxUb3AgfSlbdHlwZV1cbiAgICB9XG4gICAgaWYgKGlzQm9keShlbCkpIHtcbiAgICAgIHdpbi5zY3JvbGxUbyh4LCB5KVxuICAgIH0gZWxzZSB7XG4gICAgICB4ICE9IG51bGwgJiYgKGVsLnNjcm9sbExlZnQgPSB4KVxuICAgICAgeSAhPSBudWxsICYmIChlbC5zY3JvbGxUb3AgPSB5KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0FycmF5LjxFbGVtZW50PnxFbGVtZW50fE5vZGV8c3RyaW5nfSBlbGVtZW50c1xuICAgKi9cbiAgZnVuY3Rpb24gQm9uem8oZWxlbWVudHMpIHtcbiAgICB0aGlzLmxlbmd0aCA9IDBcbiAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnRzID0gdHlwZW9mIGVsZW1lbnRzICE9PSAnc3RyaW5nJyAmJlxuICAgICAgICAhZWxlbWVudHMubm9kZVR5cGUgJiZcbiAgICAgICAgdHlwZW9mIGVsZW1lbnRzLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcgP1xuICAgICAgICAgIGVsZW1lbnRzIDpcbiAgICAgICAgICBbZWxlbWVudHNdXG4gICAgICB0aGlzLmxlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aFxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykgdGhpc1tpXSA9IGVsZW1lbnRzW2ldXG4gICAgfVxuICB9XG5cbiAgQm9uem8ucHJvdG90eXBlID0ge1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgICBnZXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpc1tpbmRleF0gfHwgbnVsbFxuICAgICAgfVxuXG4gICAgICAvLyBpdGV0YXRvcnNcbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbihFbGVtZW50fE5vZGUpfSBmblxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfc2NvcGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBlYWNoOiBmdW5jdGlvbiAoZm4sIG9wdF9zY29wZSkge1xuICAgICAgICByZXR1cm4gZWFjaCh0aGlzLCBmbiwgb3B0X3Njb3BlKVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9zY29wZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGRlZXBFYWNoOiBmdW5jdGlvbiAoZm4sIG9wdF9zY29wZSkge1xuICAgICAgICByZXR1cm4gZGVlcEVhY2godGhpcywgZm4sIG9wdF9zY29wZSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uPX0gb3B0X3JlamVjdFxuICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgKi9cbiAgICAsIG1hcDogZnVuY3Rpb24gKGZuLCBvcHRfcmVqZWN0KSB7XG4gICAgICAgIHZhciBtID0gW10sIG4sIGlcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBuID0gZm4uY2FsbCh0aGlzLCB0aGlzW2ldLCBpKVxuICAgICAgICAgIG9wdF9yZWplY3QgPyAob3B0X3JlamVjdChuKSAmJiBtLnB1c2gobikpIDogbS5wdXNoKG4pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1cbiAgICAgIH1cblxuICAgIC8vIHRleHQgYW5kIGh0bWwgaW5zZXJ0ZXJzIVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGggdGhlIEhUTUwgdG8gaW5zZXJ0XG4gICAgICogQHBhcmFtIHtib29sZWFuPX0gb3B0X3RleHQgd2hldGhlciB0byBzZXQgb3IgZ2V0IHRleHQgY29udGVudFxuICAgICAqIEByZXR1cm4ge0JvbnpvfHN0cmluZ31cbiAgICAgKi9cbiAgICAsIGh0bWw6IGZ1bmN0aW9uIChoLCBvcHRfdGV4dCkge1xuICAgICAgICB2YXIgbWV0aG9kID0gb3B0X3RleHRcbiAgICAgICAgICAgICAgPyBodG1sLnRleHRDb250ZW50ID09PSB1bmRlZmluZWQgPyAnaW5uZXJUZXh0JyA6ICd0ZXh0Q29udGVudCdcbiAgICAgICAgICAgICAgOiAnaW5uZXJIVE1MJ1xuICAgICAgICAgICwgdGhhdCA9IHRoaXNcbiAgICAgICAgICAsIGFwcGVuZCA9IGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgICAgICBlYWNoKG5vcm1hbGl6ZShoLCB0aGF0LCBpKSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChub2RlKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICwgdXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChvcHRfdGV4dCB8fCAodHlwZW9mIGggPT0gJ3N0cmluZycgJiYgIXNwZWNpYWxUYWdzLnRlc3QoZWwudGFnTmFtZSkpKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZWxbbWV0aG9kXSA9IGhcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICAgIGFwcGVuZChlbCwgaSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBoICE9ICd1bmRlZmluZWQnXG4gICAgICAgICAgPyB0aGlzLmVtcHR5KCkuZWFjaCh1cGRhdGVFbGVtZW50KVxuICAgICAgICAgIDogdGhpc1swXSA/IHRoaXNbMF1bbWV0aG9kXSA6ICcnXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfdGV4dCB0aGUgdGV4dCB0byBzZXQsIG90aGVyd2lzZSB0aGlzIGlzIGEgZ2V0dGVyXG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xzdHJpbmd9XG4gICAgICAgKi9cbiAgICAsIHRleHQ6IGZ1bmN0aW9uIChvcHRfdGV4dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5odG1sKG9wdF90ZXh0LCB0cnVlKVxuICAgICAgfVxuXG4gICAgICAvLyBtb3JlIHJlbGF0ZWQgaW5zZXJ0aW9uIG1ldGhvZHNcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSBub2RlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYXBwZW5kOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICBlYWNoKG5vcm1hbGl6ZShub2RlLCB0aGF0LCBpKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGkpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IG5vZGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBwcmVwZW5kOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICB2YXIgZmlyc3QgPSBlbC5maXJzdENoaWxkXG4gICAgICAgICAgZWFjaChub3JtYWxpemUobm9kZSwgdGhhdCwgaSksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBlbC5pbnNlcnRCZWZvcmUoaSwgZmlyc3QpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IHRhcmdldCB0aGUgbG9jYXRpb24gZm9yIHdoaWNoIHlvdSdsbCBpbnNlcnQgeW91ciBuZXcgY29udGVudFxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaG9zdCBhbiBvcHRpb25hbCBob3N0IHNjb3BlIChwcmltYXJpbHkgdXNlZCB3aGVuIGludGVncmF0ZWQgd2l0aCBFbmRlcilcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBhcHBlbmRUbzogZnVuY3Rpb24gKHRhcmdldCwgb3B0X2hvc3QpIHtcbiAgICAgICAgcmV0dXJuIGluc2VydC5jYWxsKHRoaXMsIHRhcmdldCwgb3B0X2hvc3QsIGZ1bmN0aW9uICh0LCBlbCkge1xuICAgICAgICAgIHQuYXBwZW5kQ2hpbGQoZWwpXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSB0YXJnZXQgdGhlIGxvY2F0aW9uIGZvciB3aGljaCB5b3UnbGwgaW5zZXJ0IHlvdXIgbmV3IGNvbnRlbnRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2hvc3QgYW4gb3B0aW9uYWwgaG9zdCBzY29wZSAocHJpbWFyaWx5IHVzZWQgd2hlbiBpbnRlZ3JhdGVkIHdpdGggRW5kZXIpXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcHJlcGVuZFRvOiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRfaG9zdCkge1xuICAgICAgICByZXR1cm4gaW5zZXJ0LmNhbGwodGhpcywgdGFyZ2V0LCBvcHRfaG9zdCwgZnVuY3Rpb24gKHQsIGVsKSB7XG4gICAgICAgICAgdC5pbnNlcnRCZWZvcmUoZWwsIHQuZmlyc3RDaGlsZClcbiAgICAgICAgfSwgMSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IG5vZGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBiZWZvcmU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgIGVhY2gobm9ybWFsaXplKG5vZGUsIHRoYXQsIGkpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgZWxbcGFyZW50Tm9kZV0uaW5zZXJ0QmVmb3JlKGksIGVsKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSBub2RlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYWZ0ZXI6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgIGVhY2gobm9ybWFsaXplKG5vZGUsIHRoYXQsIGkpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgZWxbcGFyZW50Tm9kZV0uaW5zZXJ0QmVmb3JlKGksIGVsLm5leHRTaWJsaW5nKVxuICAgICAgICAgIH0sIG51bGwsIDEpXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSB0YXJnZXQgdGhlIGxvY2F0aW9uIGZvciB3aGljaCB5b3UnbGwgaW5zZXJ0IHlvdXIgbmV3IGNvbnRlbnRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2hvc3QgYW4gb3B0aW9uYWwgaG9zdCBzY29wZSAocHJpbWFyaWx5IHVzZWQgd2hlbiBpbnRlZ3JhdGVkIHdpdGggRW5kZXIpXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRfaG9zdCkge1xuICAgICAgICByZXR1cm4gaW5zZXJ0LmNhbGwodGhpcywgdGFyZ2V0LCBvcHRfaG9zdCwgZnVuY3Rpb24gKHQsIGVsKSB7XG4gICAgICAgICAgdFtwYXJlbnROb2RlXS5pbnNlcnRCZWZvcmUoZWwsIHQpXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSB0YXJnZXQgdGhlIGxvY2F0aW9uIGZvciB3aGljaCB5b3UnbGwgaW5zZXJ0IHlvdXIgbmV3IGNvbnRlbnRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2hvc3QgYW4gb3B0aW9uYWwgaG9zdCBzY29wZSAocHJpbWFyaWx5IHVzZWQgd2hlbiBpbnRlZ3JhdGVkIHdpdGggRW5kZXIpXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgaW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uICh0YXJnZXQsIG9wdF9ob3N0KSB7XG4gICAgICAgIHJldHVybiBpbnNlcnQuY2FsbCh0aGlzLCB0YXJnZXQsIG9wdF9ob3N0LCBmdW5jdGlvbiAodCwgZWwpIHtcbiAgICAgICAgICB2YXIgc2libGluZyA9IHQubmV4dFNpYmxpbmdcbiAgICAgICAgICBzaWJsaW5nID9cbiAgICAgICAgICAgIHRbcGFyZW50Tm9kZV0uaW5zZXJ0QmVmb3JlKGVsLCBzaWJsaW5nKSA6XG4gICAgICAgICAgICB0W3BhcmVudE5vZGVdLmFwcGVuZENoaWxkKGVsKVxuICAgICAgICB9LCAxKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gbm9kZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHJlcGxhY2VXaXRoOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBib256byhub3JtYWxpemUobm9kZSkpLmluc2VydEFmdGVyKHRoaXMpXG4gICAgICAgIHJldHVybiB0aGlzLnJlbW92ZSgpXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaG9zdCBhbiBvcHRpb25hbCBob3N0IHNjb3BlIChwcmltYXJpbHkgdXNlZCB3aGVuIGludGVncmF0ZWQgd2l0aCBFbmRlcilcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBjbG9uZTogZnVuY3Rpb24gKG9wdF9ob3N0KSB7XG4gICAgICAgIHZhciByZXQgPSBbXSAvLyBkb24ndCBjaGFuZ2Ugb3JpZ2luYWwgYXJyYXlcbiAgICAgICAgICAsIGwsIGlcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSByZXRbaV0gPSBjbG9uZU5vZGUob3B0X2hvc3QgfHwgdGhpcywgdGhpc1tpXSlcbiAgICAgICAgcmV0dXJuIGJvbnpvKHJldClcbiAgICAgIH1cblxuICAgICAgLy8gY2xhc3MgbWFuYWdlbWVudFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYWRkQ2xhc3M6IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGMgPSB0b1N0cmluZy5jYWxsKGMpLnNwbGl0KHdoaXRlc3BhY2VSZWdleClcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAvLyB3ZSBgZWFjaGAgaGVyZSBzbyB5b3UgY2FuIGRvICRlbC5hZGRDbGFzcygnZm9vIGJhcicpXG4gICAgICAgICAgZWFjaChjLCBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgaWYgKGMgJiYgIWhhc0NsYXNzKGVsLCBzZXR0ZXIoZWwsIGMpKSlcbiAgICAgICAgICAgICAgYWRkQ2xhc3MoZWwsIHNldHRlcihlbCwgYykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGMgPSB0b1N0cmluZy5jYWxsKGMpLnNwbGl0KHdoaXRlc3BhY2VSZWdleClcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlYWNoKGMsIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICBpZiAoYyAmJiBoYXNDbGFzcyhlbCwgc2V0dGVyKGVsLCBjKSkpXG4gICAgICAgICAgICAgIHJlbW92ZUNsYXNzKGVsLCBzZXR0ZXIoZWwsIGMpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY1xuICAgICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgICAqL1xuICAgICwgaGFzQ2xhc3M6IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGMgPSB0b1N0cmluZy5jYWxsKGMpLnNwbGl0KHdoaXRlc3BhY2VSZWdleClcbiAgICAgICAgcmV0dXJuIHNvbWUodGhpcywgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgcmV0dXJuIHNvbWUoYywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIHJldHVybiBjICYmIGhhc0NsYXNzKGVsLCBjKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gYyBjbGFzc25hbWUgdG8gdG9nZ2xlXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfY29uZGl0aW9uIHdoZXRoZXIgdG8gYWRkIG9yIHJlbW92ZSB0aGUgY2xhc3Mgc3RyYWlnaHQgYXdheVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHRvZ2dsZUNsYXNzOiBmdW5jdGlvbiAoYywgb3B0X2NvbmRpdGlvbikge1xuICAgICAgICBjID0gdG9TdHJpbmcuY2FsbChjKS5zcGxpdCh3aGl0ZXNwYWNlUmVnZXgpXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWFjaChjLCBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgaWYgKGMpIHtcbiAgICAgICAgICAgICAgdHlwZW9mIG9wdF9jb25kaXRpb24gIT09ICd1bmRlZmluZWQnID9cbiAgICAgICAgICAgICAgICBvcHRfY29uZGl0aW9uID8gIWhhc0NsYXNzKGVsLCBjKSAmJiBhZGRDbGFzcyhlbCwgYykgOiByZW1vdmVDbGFzcyhlbCwgYykgOlxuICAgICAgICAgICAgICAgIGhhc0NsYXNzKGVsLCBjKSA/IHJlbW92ZUNsYXNzKGVsLCBjKSA6IGFkZENsYXNzKGVsLCBjKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIGRpc3BsYXkgdG9nZ2xlcnNcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF90eXBlIHVzZWZ1bCB0byBzZXQgYmFjayB0byBhbnl0aGluZyBvdGhlciB0aGFuIGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHNob3c6IGZ1bmN0aW9uIChvcHRfdHlwZSkge1xuICAgICAgICBvcHRfdHlwZSA9IHR5cGVvZiBvcHRfdHlwZSA9PSAnc3RyaW5nJyA/IG9wdF90eXBlIDogJydcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gb3B0X3R5cGVcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9jYWxsYmFja1xuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfdHlwZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHRvZ2dsZTogZnVuY3Rpb24gKG9wdF9jYWxsYmFjaywgb3B0X3R5cGUpIHtcbiAgICAgICAgb3B0X3R5cGUgPSB0eXBlb2Ygb3B0X3R5cGUgPT0gJ3N0cmluZycgPyBvcHRfdHlwZSA6ICcnO1xuICAgICAgICB0eXBlb2Ygb3B0X2NhbGxiYWNrICE9ICdmdW5jdGlvbicgJiYgKG9wdF9jYWxsYmFjayA9IG51bGwpXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IChlbC5vZmZzZXRXaWR0aCB8fCBlbC5vZmZzZXRIZWlnaHQpID8gJ25vbmUnIDogb3B0X3R5cGU7XG4gICAgICAgICAgb3B0X2NhbGxiYWNrICYmIG9wdF9jYWxsYmFjay5jYWxsKGVsKVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8vIERPTSBXYWxrZXJzICYgZ2V0dGVyc1xuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgZmlyc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGJvbnpvKHRoaXMubGVuZ3RoID8gdGhpc1swXSA6IFtdKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCBsYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBib256byh0aGlzLmxlbmd0aCA/IHRoaXNbdGhpcy5sZW5ndGggLSAxXSA6IFtdKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbGF0ZWQoJ25leHRTaWJsaW5nJylcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgcHJldmlvdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRlZCgncHJldmlvdXNTaWJsaW5nJylcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgcGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRlZChwYXJlbnROb2RlKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgdGhlIGRpcmVjdGlvbmFsIERPTSBtZXRob2RcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgcmVsYXRlZDogZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gYm9uem8odGhpcy5tYXAoXG4gICAgICAgICAgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBlbCA9IGVsW21ldGhvZF1cbiAgICAgICAgICAgIHdoaWxlIChlbCAmJiBlbC5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgICAgICAgICBlbCA9IGVsW21ldGhvZF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbCB8fCAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICAgIH1cbiAgICAgICAgKSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBmb2N1czogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxlbmd0aCAmJiB0aGlzWzBdLmZvY3VzKClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBibHVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGVuZ3RoICYmIHRoaXNbMF0uYmx1cigpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG5cbiAgICAgIC8vIHN0eWxlIGdldHRlciBzZXR0ZXIgJiByZWxhdGVkIG1ldGhvZHNcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IG9cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3ZcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfHN0cmluZ31cbiAgICAgICAqL1xuICAgICwgY3NzOiBmdW5jdGlvbiAobywgb3B0X3YpIHtcbiAgICAgICAgdmFyIHAsIGl0ZXIgPSBvXG4gICAgICAgIC8vIGlzIHRoaXMgYSByZXF1ZXN0IGZvciBqdXN0IGdldHRpbmcgYSBzdHlsZT9cbiAgICAgICAgaWYgKG9wdF92ID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG8gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvLyByZXB1cnBvc2UgJ3YnXG4gICAgICAgICAgb3B0X3YgPSB0aGlzWzBdXG4gICAgICAgICAgaWYgKCFvcHRfdikgcmV0dXJuIG51bGxcbiAgICAgICAgICBpZiAob3B0X3YgPT09IGRvYyB8fCBvcHRfdiA9PT0gd2luKSB7XG4gICAgICAgICAgICBwID0gKG9wdF92ID09PSBkb2MpID8gYm9uem8uZG9jKCkgOiBib256by52aWV3cG9ydCgpXG4gICAgICAgICAgICByZXR1cm4gbyA9PSAnd2lkdGgnID8gcC53aWR0aCA6IG8gPT0gJ2hlaWdodCcgPyBwLmhlaWdodCA6ICcnXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAobyA9IHN0eWxlUHJvcGVydHkobykpID8gZ2V0U3R5bGUob3B0X3YsIG8pIDogbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgaXRlciA9IHt9XG4gICAgICAgICAgaXRlcltvXSA9IG9wdF92XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZlYXR1cmVzLm9wYXNpdHkgJiYgJ29wYWNpdHknIGluIGl0ZXIpIHtcbiAgICAgICAgICAvLyBvaCB0aGlzICdvbCBnYW11dFxuICAgICAgICAgIGl0ZXIuZmlsdGVyID0gaXRlci5vcGFjaXR5ICE9IG51bGwgJiYgaXRlci5vcGFjaXR5ICE9PSAnJ1xuICAgICAgICAgICAgPyAnYWxwaGEob3BhY2l0eT0nICsgKGl0ZXIub3BhY2l0eSAqIDEwMCkgKyAnKSdcbiAgICAgICAgICAgIDogJydcbiAgICAgICAgICAvLyBnaXZlIGl0IGxheW91dFxuICAgICAgICAgIGl0ZXIuem9vbSA9IG8uem9vbSB8fCAxXG4gICAgICAgICAgO2RlbGV0ZSBpdGVyLm9wYWNpdHlcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZuKGVsLCBwLCB2KSB7XG4gICAgICAgICAgZm9yICh2YXIgayBpbiBpdGVyKSB7XG4gICAgICAgICAgICBpZiAoaXRlci5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICB2ID0gaXRlcltrXTtcbiAgICAgICAgICAgICAgLy8gY2hhbmdlIFwiNVwiIHRvIFwiNXB4XCIgLSB1bmxlc3MgeW91J3JlIGxpbmUtaGVpZ2h0LCB3aGljaCBpcyBhbGxvd2VkXG4gICAgICAgICAgICAgIChwID0gc3R5bGVQcm9wZXJ0eShrKSkgJiYgZGlnaXQudGVzdCh2KSAmJiAhKHAgaW4gdW5pdGxlc3MpICYmICh2ICs9IHB4KVxuICAgICAgICAgICAgICB0cnkgeyBlbC5zdHlsZVtwXSA9IHNldHRlcihlbCwgdikgfSBjYXRjaChlKSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZuKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtudW1iZXI9fSBvcHRfeFxuICAgICAgICogQHBhcmFtIHtudW1iZXI9fSBvcHRfeVxuICAgICAgICogQHJldHVybiB7Qm9uem98bnVtYmVyfVxuICAgICAgICovXG4gICAgLCBvZmZzZXQ6IGZ1bmN0aW9uIChvcHRfeCwgb3B0X3kpIHtcbiAgICAgICAgaWYgKG9wdF94ICYmIHR5cGVvZiBvcHRfeCA9PSAnb2JqZWN0JyAmJiAodHlwZW9mIG9wdF94LnRvcCA9PSAnbnVtYmVyJyB8fCB0eXBlb2Ygb3B0X3gubGVmdCA9PSAnbnVtYmVyJykpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgeHkoZWwsIG9wdF94LmxlZnQsIG9wdF94LnRvcClcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRfeCA9PSAnbnVtYmVyJyB8fCB0eXBlb2Ygb3B0X3kgPT0gJ251bWJlcicpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgeHkoZWwsIG9wdF94LCBvcHRfeSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpc1swXSkgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICwgbGVmdDogMFxuICAgICAgICAgICwgaGVpZ2h0OiAwXG4gICAgICAgICAgLCB3aWR0aDogMFxuICAgICAgICB9XG4gICAgICAgIHZhciBlbCA9IHRoaXNbMF1cbiAgICAgICAgICAsIGRlID0gZWwub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICAgICAgICAsIGJjciA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgLCBzY3JvbGwgPSBnZXRXaW5kb3dTY3JvbGwoKVxuICAgICAgICAgICwgd2lkdGggPSBlbC5vZmZzZXRXaWR0aFxuICAgICAgICAgICwgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgLCB0b3AgPSBiY3IudG9wICsgc2Nyb2xsLnkgLSBNYXRoLm1heCgwLCBkZSAmJiBkZS5jbGllbnRUb3AsIGRvYy5ib2R5LmNsaWVudFRvcClcbiAgICAgICAgICAsIGxlZnQgPSBiY3IubGVmdCArIHNjcm9sbC54IC0gTWF0aC5tYXgoMCwgZGUgJiYgZGUuY2xpZW50TGVmdCwgZG9jLmJvZHkuY2xpZW50TGVmdClcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiB0b3BcbiAgICAgICAgICAsIGxlZnQ6IGxlZnRcbiAgICAgICAgICAsIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgLCB3aWR0aDogd2lkdGhcbiAgICAgICAgfVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAgICovXG4gICAgLCBkaW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxlbmd0aCkgcmV0dXJuIHsgaGVpZ2h0OiAwLCB3aWR0aDogMCB9XG4gICAgICAgIHZhciBlbCA9IHRoaXNbMF1cbiAgICAgICAgICAsIGRlID0gZWwubm9kZVR5cGUgPT0gOSAmJiBlbC5kb2N1bWVudEVsZW1lbnQgLy8gZG9jdW1lbnRcbiAgICAgICAgICAsIG9yaWcgPSAhZGUgJiYgISFlbC5zdHlsZSAmJiAhZWwub2Zmc2V0V2lkdGggJiYgIWVsLm9mZnNldEhlaWdodCA/XG4gICAgICAgICAgICAgLy8gZWwgaXNuJ3QgdmlzaWJsZSwgY2FuJ3QgYmUgbWVhc3VyZWQgcHJvcGVybHksIHNvIGZpeCB0aGF0XG4gICAgICAgICAgICAgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgIHZhciBzID0ge1xuICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBlbC5zdHlsZS5wb3NpdGlvbiB8fCAnJ1xuICAgICAgICAgICAgICAgICAsIHZpc2liaWxpdHk6IGVsLnN0eWxlLnZpc2liaWxpdHkgfHwgJydcbiAgICAgICAgICAgICAgICAgLCBkaXNwbGF5OiBlbC5zdHlsZS5kaXNwbGF5IHx8ICcnXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICB0LmZpcnN0KCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICAgICAgICAgICAsIHZpc2liaWxpdHk6ICdoaWRkZW4nXG4gICAgICAgICAgICAgICAgICwgZGlzcGxheTogJ2Jsb2NrJ1xuICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgIHJldHVybiBzXG4gICAgICAgICAgICB9KHRoaXMpIDogbnVsbFxuICAgICAgICAgICwgd2lkdGggPSBkZVxuICAgICAgICAgICAgICA/IE1hdGgubWF4KGVsLmJvZHkuc2Nyb2xsV2lkdGgsIGVsLmJvZHkub2Zmc2V0V2lkdGgsIGRlLnNjcm9sbFdpZHRoLCBkZS5vZmZzZXRXaWR0aCwgZGUuY2xpZW50V2lkdGgpXG4gICAgICAgICAgICAgIDogZWwub2Zmc2V0V2lkdGhcbiAgICAgICAgICAsIGhlaWdodCA9IGRlXG4gICAgICAgICAgICAgID8gTWF0aC5tYXgoZWwuYm9keS5zY3JvbGxIZWlnaHQsIGVsLmJvZHkub2Zmc2V0SGVpZ2h0LCBkZS5zY3JvbGxIZWlnaHQsIGRlLm9mZnNldEhlaWdodCwgZGUuY2xpZW50SGVpZ2h0KVxuICAgICAgICAgICAgICA6IGVsLm9mZnNldEhlaWdodFxuXG4gICAgICAgIG9yaWcgJiYgdGhpcy5maXJzdCgpLmNzcyhvcmlnKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAsIHdpZHRoOiB3aWR0aFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGF0dHJpYnV0ZXMgYXJlIGhhcmQuIGdvIHNob3BwaW5nXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGsgYW4gYXR0cmlidXRlIHRvIGdldCBvciBzZXRcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3YgdGhlIHZhbHVlIHRvIHNldFxuICAgICAgICogQHJldHVybiB7Qm9uem98c3RyaW5nfVxuICAgICAgICovXG4gICAgLCBhdHRyOiBmdW5jdGlvbiAoaywgb3B0X3YpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpc1swXVxuICAgICAgICAgICwgblxuXG4gICAgICAgIGlmICh0eXBlb2YgayAhPSAnc3RyaW5nJyAmJiAhKGsgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICAgICAgZm9yIChuIGluIGspIHtcbiAgICAgICAgICAgIGsuaGFzT3duUHJvcGVydHkobikgJiYgdGhpcy5hdHRyKG4sIGtbbl0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHlwZW9mIG9wdF92ID09ICd1bmRlZmluZWQnID9cbiAgICAgICAgICAhZWwgPyBudWxsIDogc3BlY2lhbEF0dHJpYnV0ZXMudGVzdChrKSA/XG4gICAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXMudGVzdChrKSAmJiB0eXBlb2YgZWxba10gPT0gJ3N0cmluZycgP1xuICAgICAgICAgICAgICB0cnVlIDogZWxba10gOiAoayA9PSAnaHJlZicgfHwgayA9PSdzcmMnKSAmJiBmZWF0dXJlcy5ocmVmRXh0ZW5kZWQgP1xuICAgICAgICAgICAgICAgIGVsW2dldEF0dHJpYnV0ZV0oaywgMikgOiBlbFtnZXRBdHRyaWJ1dGVdKGspIDpcbiAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBzcGVjaWFsQXR0cmlidXRlcy50ZXN0KGspID8gKGVsW2tdID0gc2V0dGVyKGVsLCBvcHRfdikpIDogZWxbc2V0QXR0cmlidXRlXShrLCBzZXR0ZXIoZWwsIG9wdF92KSlcbiAgICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCByZW1vdmVBdHRyOiBmdW5jdGlvbiAoaykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIHN0YXRlQXR0cmlidXRlcy50ZXN0KGspID8gKGVsW2tdID0gZmFsc2UpIDogZWwucmVtb3ZlQXR0cmlidXRlKGspXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF9zXG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xzdHJpbmd9XG4gICAgICAgKi9cbiAgICAsIHZhbDogZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgcyA9PSAnc3RyaW5nJyB8fCB0eXBlb2YgcyA9PSAnbnVtYmVyJykgP1xuICAgICAgICAgIHRoaXMuYXR0cigndmFsdWUnLCBzKSA6XG4gICAgICAgICAgdGhpcy5sZW5ndGggPyB0aGlzWzBdLnZhbHVlIDogbnVsbFxuICAgICAgfVxuXG4gICAgICAvLyB1c2Ugd2l0aCBjYXJlIGFuZCBrbm93bGVkZ2UuIHRoaXMgZGF0YSgpIG1ldGhvZCB1c2VzIGRhdGEgYXR0cmlidXRlcyBvbiB0aGUgRE9NIG5vZGVzXG4gICAgICAvLyB0byBkbyB0aGlzIGRpZmZlcmVudGx5IGNvc3RzIGEgbG90IG1vcmUgY29kZS4gYydlc3QgbGEgdmllXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdD19IG9wdF9rIHRoZSBrZXkgZm9yIHdoaWNoIHRvIGdldCBvciBzZXQgZGF0YVxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfdlxuICAgICAgICogQHJldHVybiB7Qm9uem98T2JqZWN0fVxuICAgICAgICovXG4gICAgLCBkYXRhOiBmdW5jdGlvbiAob3B0X2ssIG9wdF92KSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXNbMF0sIG8sIG1cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRfdiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBpZiAoIWVsKSByZXR1cm4gbnVsbFxuICAgICAgICAgIG8gPSBkYXRhKGVsKVxuICAgICAgICAgIGlmICh0eXBlb2Ygb3B0X2sgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlYWNoKGVsLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgIChtID0gKCcnICsgYS5uYW1lKS5tYXRjaChkYXR0cikpICYmIChvW2NhbWVsaXplKG1bMV0pXSA9IGRhdGFWYWx1ZShhLnZhbHVlKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gb1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9bb3B0X2tdID09PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgb1tvcHRfa10gPSBkYXRhVmFsdWUodGhpcy5hdHRyKCdkYXRhLScgKyBkZWNhbWVsaXplKG9wdF9rKSkpXG4gICAgICAgICAgICByZXR1cm4gb1tvcHRfa11cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHsgZGF0YShlbClbb3B0X2tdID0gb3B0X3YgfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBET00gZGV0YWNobWVudCAmIHJlbGF0ZWRcblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZGVlcEVhY2goY2xlYXJEYXRhKVxuICAgICAgICByZXR1cm4gdGhpcy5kZXRhY2goKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGVtcHR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZGVlcEVhY2goZWwuY2hpbGROb2RlcywgY2xlYXJEYXRhKVxuXG4gICAgICAgICAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGRldGFjaDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVsW3BhcmVudE5vZGVdICYmIGVsW3BhcmVudE5vZGVdLnJlbW92ZUNoaWxkKGVsKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyB3aG8gdXNlcyBhIG1vdXNlIGFueXdheT8gb2ggcmlnaHQuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgICAgICAqL1xuICAgICwgc2Nyb2xsVG9wOiBmdW5jdGlvbiAoeSkge1xuICAgICAgICByZXR1cm4gc2Nyb2xsLmNhbGwodGhpcywgbnVsbCwgeSwgJ3knKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgICAgICAqL1xuICAgICwgc2Nyb2xsTGVmdDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIHNjcm9sbC5jYWxsKHRoaXMsIHgsIG51bGwsICd4JylcbiAgICAgIH1cblxuICB9XG5cblxuICBmdW5jdGlvbiBjbG9uZU5vZGUoaG9zdCwgZWwpIHtcbiAgICB2YXIgYyA9IGVsLmNsb25lTm9kZSh0cnVlKVxuICAgICAgLCBjbG9uZUVsZW1zXG4gICAgICAsIGVsRWxlbXNcbiAgICAgICwgaVxuXG4gICAgLy8gY2hlY2sgZm9yIGV4aXN0ZW5jZSBvZiBhbiBldmVudCBjbG9uZXJcbiAgICAvLyBwcmVmZXJhYmx5IGh0dHBzOi8vZ2l0aHViLmNvbS9mYXQvYmVhblxuICAgIC8vIG90aGVyd2lzZSBCb256byB3b24ndCBkbyB0aGlzIGZvciB5b3VcbiAgICBpZiAoaG9zdC4kICYmIHR5cGVvZiBob3N0LmNsb25lRXZlbnRzID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGhvc3QuJChjKS5jbG9uZUV2ZW50cyhlbClcblxuICAgICAgLy8gY2xvbmUgZXZlbnRzIGZyb20gZXZlcnkgY2hpbGQgbm9kZVxuICAgICAgY2xvbmVFbGVtcyA9IGhvc3QuJChjKS5maW5kKCcqJylcbiAgICAgIGVsRWxlbXMgPSBob3N0LiQoZWwpLmZpbmQoJyonKVxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZWxFbGVtcy5sZW5ndGg7IGkrKylcbiAgICAgICAgaG9zdC4kKGNsb25lRWxlbXNbaV0pLmNsb25lRXZlbnRzKGVsRWxlbXNbaV0pXG4gICAgfVxuICAgIHJldHVybiBjXG4gIH1cblxuICBmdW5jdGlvbiBpc0JvZHkoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50ID09PSB3aW4gfHwgKC9eKD86Ym9keXxodG1sKSQvaSkudGVzdChlbGVtZW50LnRhZ05hbWUpXG4gIH1cblxuICBmdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGwoKSB7XG4gICAgcmV0dXJuIHsgeDogd2luLnBhZ2VYT2Zmc2V0IHx8IGh0bWwuc2Nyb2xsTGVmdCwgeTogd2luLnBhZ2VZT2Zmc2V0IHx8IGh0bWwuc2Nyb2xsVG9wIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNjcmlwdEZyb21IdG1sKGh0bWwpIHtcbiAgICB2YXIgc2NyaXB0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAgLCBtYXRjaGVzID0gaHRtbC5tYXRjaChzaW1wbGVTY3JpcHRUYWdSZSlcbiAgICBzY3JpcHRFbC5zcmMgPSBtYXRjaGVzWzFdXG4gICAgcmV0dXJuIHNjcmlwdEVsXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtBcnJheS48RWxlbWVudD58RWxlbWVudHxOb2RlfHN0cmluZ30gZWxzXG4gICAqIEByZXR1cm4ge0JvbnpvfVxuICAgKi9cbiAgZnVuY3Rpb24gYm9uem8oZWxzKSB7XG4gICAgcmV0dXJuIG5ldyBCb256byhlbHMpXG4gIH1cblxuICBib256by5zZXRRdWVyeUVuZ2luZSA9IGZ1bmN0aW9uIChxKSB7XG4gICAgcXVlcnkgPSBxO1xuICAgIGRlbGV0ZSBib256by5zZXRRdWVyeUVuZ2luZVxuICB9XG5cbiAgYm9uem8uYXVnID0gZnVuY3Rpb24gKG8sIHRhcmdldCkge1xuICAgIC8vIGZvciB0aG9zZSBzdGFuZGFsb25lIGJvbnpvIHVzZXJzLiB0aGlzIGxvdmUgaXMgZm9yIHlvdS5cbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIG8uaGFzT3duUHJvcGVydHkoaykgJiYgKCh0YXJnZXQgfHwgQm9uem8ucHJvdG90eXBlKVtrXSA9IG9ba10pXG4gICAgfVxuICB9XG5cbiAgYm9uem8uY3JlYXRlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAvLyBoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaFxuICAgIHJldHVybiB0eXBlb2Ygbm9kZSA9PSAnc3RyaW5nJyAmJiBub2RlICE9PSAnJyA/XG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzaW1wbGVTY3JpcHRUYWdSZS50ZXN0KG5vZGUpKSByZXR1cm4gW2NyZWF0ZVNjcmlwdEZyb21IdG1sKG5vZGUpXVxuICAgICAgICB2YXIgdGFnID0gbm9kZS5tYXRjaCgvXlxccyo8KFteXFxzPl0rKS8pXG4gICAgICAgICAgLCBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICwgZWxzID0gW11cbiAgICAgICAgICAsIHAgPSB0YWcgPyB0YWdNYXBbdGFnWzFdLnRvTG93ZXJDYXNlKCldIDogbnVsbFxuICAgICAgICAgICwgZGVwID0gcCA/IHBbMl0gKyAxIDogMVxuICAgICAgICAgICwgbnMgPSBwICYmIHBbM11cbiAgICAgICAgICAsIHBuID0gcGFyZW50Tm9kZVxuICAgICAgICAgICwgdGIgPSBmZWF0dXJlcy5hdXRvVGJvZHkgJiYgcCAmJiBwWzBdID09ICc8dGFibGU+JyAmJiAhKC88dGJvZHkvaSkudGVzdChub2RlKVxuXG4gICAgICAgIGVsLmlubmVySFRNTCA9IHAgPyAocFswXSArIG5vZGUgKyBwWzFdKSA6IG5vZGVcbiAgICAgICAgd2hpbGUgKGRlcC0tKSBlbCA9IGVsLmZpcnN0Q2hpbGRcbiAgICAgICAgLy8gZm9yIElFIE5vU2NvcGUsIHdlIG1heSBpbnNlcnQgY3J1ZnQgYXQgdGhlIGJlZ2luaW5nIGp1c3QgdG8gZ2V0IGl0IHRvIHdvcmtcbiAgICAgICAgaWYgKG5zICYmIGVsICYmIGVsLm5vZGVUeXBlICE9PSAxKSBlbCA9IGVsLm5leHRTaWJsaW5nXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAvLyB0Ym9keSBzcGVjaWFsIGNhc2UgZm9yIElFPDgsIGNyZWF0ZXMgdGJvZHkgb24gYW55IGVtcHR5IHRhYmxlXG4gICAgICAgICAgLy8gd2UgZG9uJ3Qgd2FudCBpdCBpZiB3ZSdyZSBqdXN0IGFmdGVyIGEgPHRoZWFkPiwgPGNhcHRpb24+LCBldGMuXG4gICAgICAgICAgaWYgKCghdGFnIHx8IGVsLm5vZGVUeXBlID09IDEpICYmICghdGIgfHwgKGVsLnRhZ05hbWUgJiYgZWwudGFnTmFtZSAhPSAnVEJPRFknKSkpIHtcbiAgICAgICAgICAgIGVscy5wdXNoKGVsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoZWwgPSBlbC5uZXh0U2libGluZylcbiAgICAgICAgLy8gSUUgPCA5IGdpdmVzIHVzIGEgcGFyZW50Tm9kZSB3aGljaCBtZXNzZXMgdXAgaW5zZXJ0KCkgY2hlY2sgZm9yIGNsb25pbmdcbiAgICAgICAgLy8gYGRlcGAgPiAxIGNhbiBhbHNvIGNhdXNlIHByb2JsZW1zIHdpdGggdGhlIGluc2VydCgpIGNoZWNrIChtdXN0IGRvIHRoaXMgbGFzdClcbiAgICAgICAgZWFjaChlbHMsIGZ1bmN0aW9uKGVsKSB7IGVsW3BuXSAmJiBlbFtwbl0ucmVtb3ZlQ2hpbGQoZWwpIH0pXG4gICAgICAgIHJldHVybiBlbHNcbiAgICAgIH0oKSA6IGlzTm9kZShub2RlKSA/IFtub2RlLmNsb25lTm9kZSh0cnVlKV0gOiBbXVxuICB9XG5cbiAgYm9uem8uZG9jID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2cCA9IGJvbnpvLnZpZXdwb3J0KClcbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogTWF0aC5tYXgoZG9jLmJvZHkuc2Nyb2xsV2lkdGgsIGh0bWwuc2Nyb2xsV2lkdGgsIHZwLndpZHRoKVxuICAgICAgLCBoZWlnaHQ6IE1hdGgubWF4KGRvYy5ib2R5LnNjcm9sbEhlaWdodCwgaHRtbC5zY3JvbGxIZWlnaHQsIHZwLmhlaWdodClcbiAgICB9XG4gIH1cblxuICBib256by5maXJzdENoaWxkID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgZm9yICh2YXIgYyA9IGVsLmNoaWxkTm9kZXMsIGkgPSAwLCBqID0gKGMgJiYgYy5sZW5ndGgpIHx8IDAsIGU7IGkgPCBqOyBpKyspIHtcbiAgICAgIGlmIChjW2ldLm5vZGVUeXBlID09PSAxKSBlID0gY1tqID0gaV1cbiAgICB9XG4gICAgcmV0dXJuIGVcbiAgfVxuXG4gIGJvbnpvLnZpZXdwb3J0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBpZSA/IGh0bWwuY2xpZW50V2lkdGggOiB3aW4uaW5uZXJXaWR0aFxuICAgICAgLCBoZWlnaHQ6IGllID8gaHRtbC5jbGllbnRIZWlnaHQgOiB3aW4uaW5uZXJIZWlnaHRcbiAgICB9XG4gIH1cblxuICBib256by5pc0FuY2VzdG9yID0gJ2NvbXBhcmVEb2N1bWVudFBvc2l0aW9uJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoY29udGFpbmVyLCBlbGVtZW50KSB7XG4gICAgICByZXR1cm4gKGNvbnRhaW5lci5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlbGVtZW50KSAmIDE2KSA9PSAxNlxuICAgIH0gOiAnY29udGFpbnMnIGluIGh0bWwgP1xuICAgIGZ1bmN0aW9uIChjb250YWluZXIsIGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBjb250YWluZXIgIT09IGVsZW1lbnQgJiYgY29udGFpbmVyLmNvbnRhaW5zKGVsZW1lbnQpO1xuICAgIH0gOlxuICAgIGZ1bmN0aW9uIChjb250YWluZXIsIGVsZW1lbnQpIHtcbiAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudFtwYXJlbnROb2RlXSkge1xuICAgICAgICBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gIHJldHVybiBib256b1xufSk7IC8vIHRoZSBvbmx5IGxpbmUgd2UgY2FyZSBhYm91dCB1c2luZyBhIHNlbWktY29sb24uIHBsYWNlZCBoZXJlIGZvciBjb25jYXRlbmF0aW9uIHRvb2xzXG4iLCJcbi8vIG5vdCBpbXBsZW1lbnRlZFxuLy8gVGhlIHJlYXNvbiBmb3IgaGF2aW5nIGFuIGVtcHR5IGZpbGUgYW5kIG5vdCB0aHJvd2luZyBpcyB0byBhbGxvd1xuLy8gdW50cmFkaXRpb25hbCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1vZHVsZS5cbiIsIi8qIVxuICAqIEBwcmVzZXJ2ZSBRd2VyeSAtIEEgQmxhemluZyBGYXN0IHF1ZXJ5IHNlbGVjdG9yIGVuZ2luZVxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvcXdlcnlcbiAgKiBjb3B5cmlnaHQgRHVzdGluIERpYXogMjAxMlxuICAqIE1JVCBMaWNlbnNlXG4gICovXG5cbihmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0pKCdxd2VyeScsIHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50XG4gICAgLCBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudFxuICAgICwgYnlDbGFzcyA9ICdnZXRFbGVtZW50c0J5Q2xhc3NOYW1lJ1xuICAgICwgYnlUYWcgPSAnZ2V0RWxlbWVudHNCeVRhZ05hbWUnXG4gICAgLCBxU0EgPSAncXVlcnlTZWxlY3RvckFsbCdcbiAgICAsIHVzZU5hdGl2ZVFTQSA9ICd1c2VOYXRpdmVRU0EnXG4gICAgLCB0YWdOYW1lID0gJ3RhZ05hbWUnXG4gICAgLCBub2RlVHlwZSA9ICdub2RlVHlwZSdcbiAgICAsIHNlbGVjdCAvLyBtYWluIHNlbGVjdCgpIG1ldGhvZCwgYXNzaWduIGxhdGVyXG5cbiAgICAsIGlkID0gLyMoW1xcd1xcLV0rKS9cbiAgICAsIGNsYXMgPSAvXFwuW1xcd1xcLV0rL2dcbiAgICAsIGlkT25seSA9IC9eIyhbXFx3XFwtXSspJC9cbiAgICAsIGNsYXNzT25seSA9IC9eXFwuKFtcXHdcXC1dKykkL1xuICAgICwgdGFnT25seSA9IC9eKFtcXHdcXC1dKykkL1xuICAgICwgdGFnQW5kT3JDbGFzcyA9IC9eKFtcXHddKyk/XFwuKFtcXHdcXC1dKykkL1xuICAgICwgc3BsaXR0YWJsZSA9IC8oXnwsKVxccypbPn4rXS9cbiAgICAsIG5vcm1hbGl6ciA9IC9eXFxzK3xcXHMqKFssXFxzXFwrXFx+Pl18JClcXHMqL2dcbiAgICAsIHNwbGl0dGVycyA9IC9bXFxzXFw+XFwrXFx+XS9cbiAgICAsIHNwbGl0dGVyc01vcmUgPSAvKD8hW1xcc1xcd1xcLVxcL1xcP1xcJlxcPVxcOlxcLlxcKFxcKVxcISxAIyU8Plxce1xcfVxcJFxcKlxcXidcIl0qXFxdfFtcXHNcXHdcXCtcXC1dKlxcKSkvXG4gICAgLCBzcGVjaWFsQ2hhcnMgPSAvKFsuKis/XFxePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2dcbiAgICAsIHNpbXBsZSA9IC9eKFxcKnxbYS16MC05XSspPyg/OihbXFwuXFwjXStbXFx3XFwtXFwuI10rKT8pL1xuICAgICwgYXR0ciA9IC9cXFsoW1xcd1xcLV0rKSg/OihbXFx8XFxeXFwkXFwqXFx+XT9cXD0pWydcIl0/KFsgXFx3XFwtXFwvXFw/XFwmXFw9XFw6XFwuXFwoXFwpXFwhLEAjJTw+XFx7XFx9XFwkXFwqXFxeXSspW1wiJ10/KT9cXF0vXG4gICAgLCBwc2V1ZG8gPSAvOihbXFx3XFwtXSspKFxcKFsnXCJdPyhbXigpXSspWydcIl0/XFwpKT8vXG4gICAgLCBlYXN5ID0gbmV3IFJlZ0V4cChpZE9ubHkuc291cmNlICsgJ3wnICsgdGFnT25seS5zb3VyY2UgKyAnfCcgKyBjbGFzc09ubHkuc291cmNlKVxuICAgICwgZGl2aWRlcnMgPSBuZXcgUmVnRXhwKCcoJyArIHNwbGl0dGVycy5zb3VyY2UgKyAnKScgKyBzcGxpdHRlcnNNb3JlLnNvdXJjZSwgJ2cnKVxuICAgICwgdG9rZW5penIgPSBuZXcgUmVnRXhwKHNwbGl0dGVycy5zb3VyY2UgKyBzcGxpdHRlcnNNb3JlLnNvdXJjZSlcbiAgICAsIGNodW5rZXIgPSBuZXcgUmVnRXhwKHNpbXBsZS5zb3VyY2UgKyAnKCcgKyBhdHRyLnNvdXJjZSArICcpPycgKyAnKCcgKyBwc2V1ZG8uc291cmNlICsgJyk/JylcblxuICB2YXIgd2Fsa2VyID0ge1xuICAgICAgJyAnOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZSAmJiBub2RlICE9PSBodG1sICYmIG5vZGUucGFyZW50Tm9kZVxuICAgICAgfVxuICAgICwgJz4nOiBmdW5jdGlvbiAobm9kZSwgY29udGVzdGFudCkge1xuICAgICAgICByZXR1cm4gbm9kZSAmJiBub2RlLnBhcmVudE5vZGUgPT0gY29udGVzdGFudC5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZVxuICAgICAgfVxuICAgICwgJ34nOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZSAmJiBub2RlLnByZXZpb3VzU2libGluZ1xuICAgICAgfVxuICAgICwgJysnOiBmdW5jdGlvbiAobm9kZSwgY29udGVzdGFudCwgcDEsIHAyKSB7XG4gICAgICAgIGlmICghbm9kZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiAocDEgPSBwcmV2aW91cyhub2RlKSkgJiYgKHAyID0gcHJldmlvdXMoY29udGVzdGFudCkpICYmIHAxID09IHAyICYmIHAxXG4gICAgICB9XG4gICAgfVxuXG4gIGZ1bmN0aW9uIGNhY2hlKCkge1xuICAgIHRoaXMuYyA9IHt9XG4gIH1cbiAgY2FjaGUucHJvdG90eXBlID0ge1xuICAgIGc6IGZ1bmN0aW9uIChrKSB7XG4gICAgICByZXR1cm4gdGhpcy5jW2tdIHx8IHVuZGVmaW5lZFxuICAgIH1cbiAgLCBzOiBmdW5jdGlvbiAoaywgdiwgcikge1xuICAgICAgdiA9IHIgPyBuZXcgUmVnRXhwKHYpIDogdlxuICAgICAgcmV0dXJuICh0aGlzLmNba10gPSB2KVxuICAgIH1cbiAgfVxuXG4gIHZhciBjbGFzc0NhY2hlID0gbmV3IGNhY2hlKClcbiAgICAsIGNsZWFuQ2FjaGUgPSBuZXcgY2FjaGUoKVxuICAgICwgYXR0ckNhY2hlID0gbmV3IGNhY2hlKClcbiAgICAsIHRva2VuQ2FjaGUgPSBuZXcgY2FjaGUoKVxuXG4gIGZ1bmN0aW9uIGNsYXNzUmVnZXgoYykge1xuICAgIHJldHVybiBjbGFzc0NhY2hlLmcoYykgfHwgY2xhc3NDYWNoZS5zKGMsICcoXnxcXFxccyspJyArIGMgKyAnKFxcXFxzK3wkKScsIDEpXG4gIH1cblxuICAvLyBub3QgcXVpdGUgYXMgZmFzdCBhcyBpbmxpbmUgbG9vcHMgaW4gb2xkZXIgYnJvd3NlcnMgc28gZG9uJ3QgdXNlIGxpYmVyYWxseVxuICBmdW5jdGlvbiBlYWNoKGEsIGZuKSB7XG4gICAgdmFyIGkgPSAwLCBsID0gYS5sZW5ndGhcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykgZm4oYVtpXSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsYXR0ZW4oYXIpIHtcbiAgICBmb3IgKHZhciByID0gW10sIGkgPSAwLCBsID0gYXIubGVuZ3RoOyBpIDwgbDsgKytpKSBhcnJheUxpa2UoYXJbaV0pID8gKHIgPSByLmNvbmNhdChhcltpXSkpIDogKHJbci5sZW5ndGhdID0gYXJbaV0pXG4gICAgcmV0dXJuIHJcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5aWZ5KGFyKSB7XG4gICAgdmFyIGkgPSAwLCBsID0gYXIubGVuZ3RoLCByID0gW11cbiAgICBmb3IgKDsgaSA8IGw7IGkrKykgcltpXSA9IGFyW2ldXG4gICAgcmV0dXJuIHJcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZXZpb3VzKG4pIHtcbiAgICB3aGlsZSAobiA9IG4ucHJldmlvdXNTaWJsaW5nKSBpZiAobltub2RlVHlwZV0gPT0gMSkgYnJlYWs7XG4gICAgcmV0dXJuIG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHEocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkubWF0Y2goY2h1bmtlcilcbiAgfVxuXG4gIC8vIGNhbGxlZCB1c2luZyBgdGhpc2AgYXMgZWxlbWVudCBhbmQgYXJndW1lbnRzIGZyb20gcmVnZXggZ3JvdXAgcmVzdWx0cy5cbiAgLy8gZ2l2ZW4gPT4gZGl2LmhlbGxvW3RpdGxlPVwid29ybGRcIl06Zm9vKCdiYXInKVxuICAvLyBkaXYuaGVsbG9bdGl0bGU9XCJ3b3JsZFwiXTpmb28oJ2JhcicpLCBkaXYsIC5oZWxsbywgW3RpdGxlPVwid29ybGRcIl0sIHRpdGxlLCA9LCB3b3JsZCwgOmZvbygnYmFyJyksIGZvbywgKCdiYXInKSwgYmFyXVxuICBmdW5jdGlvbiBpbnRlcnByZXQod2hvbGUsIHRhZywgaWRzQW5kQ2xhc3Nlcywgd2hvbGVBdHRyaWJ1dGUsIGF0dHJpYnV0ZSwgcXVhbGlmaWVyLCB2YWx1ZSwgd2hvbGVQc2V1ZG8sIHBzZXVkbywgd2hvbGVQc2V1ZG9WYWwsIHBzZXVkb1ZhbCkge1xuICAgIHZhciBpLCBtLCBrLCBvLCBjbGFzc2VzXG4gICAgaWYgKHRoaXNbbm9kZVR5cGVdICE9PSAxKSByZXR1cm4gZmFsc2VcbiAgICBpZiAodGFnICYmIHRhZyAhPT0gJyonICYmIHRoaXNbdGFnTmFtZV0gJiYgdGhpc1t0YWdOYW1lXS50b0xvd2VyQ2FzZSgpICE9PSB0YWcpIHJldHVybiBmYWxzZVxuICAgIGlmIChpZHNBbmRDbGFzc2VzICYmIChtID0gaWRzQW5kQ2xhc3Nlcy5tYXRjaChpZCkpICYmIG1bMV0gIT09IHRoaXMuaWQpIHJldHVybiBmYWxzZVxuICAgIGlmIChpZHNBbmRDbGFzc2VzICYmIChjbGFzc2VzID0gaWRzQW5kQ2xhc3Nlcy5tYXRjaChjbGFzKSkpIHtcbiAgICAgIGZvciAoaSA9IGNsYXNzZXMubGVuZ3RoOyBpLS07KSBpZiAoIWNsYXNzUmVnZXgoY2xhc3Nlc1tpXS5zbGljZSgxKSkudGVzdCh0aGlzLmNsYXNzTmFtZSkpIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAocHNldWRvICYmIHF3ZXJ5LnBzZXVkb3NbcHNldWRvXSAmJiAhcXdlcnkucHNldWRvc1twc2V1ZG9dKHRoaXMsIHBzZXVkb1ZhbCkpIHJldHVybiBmYWxzZVxuICAgIGlmICh3aG9sZUF0dHJpYnV0ZSAmJiAhdmFsdWUpIHsgLy8gc2VsZWN0IGlzIGp1c3QgZm9yIGV4aXN0YW5jZSBvZiBhdHRyaWJcbiAgICAgIG8gPSB0aGlzLmF0dHJpYnV0ZXNcbiAgICAgIGZvciAoayBpbiBvKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgaykgJiYgKG9ba10ubmFtZSB8fCBrKSA9PSBhdHRyaWJ1dGUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh3aG9sZUF0dHJpYnV0ZSAmJiAhY2hlY2tBdHRyKHF1YWxpZmllciwgZ2V0QXR0cih0aGlzLCBhdHRyaWJ1dGUpIHx8ICcnLCB2YWx1ZSkpIHtcbiAgICAgIC8vIHNlbGVjdCBpcyBmb3IgYXR0cmliIGVxdWFsaXR5XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFuKHMpIHtcbiAgICByZXR1cm4gY2xlYW5DYWNoZS5nKHMpIHx8IGNsZWFuQ2FjaGUucyhzLCBzLnJlcGxhY2Uoc3BlY2lhbENoYXJzLCAnXFxcXCQxJykpXG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0F0dHIocXVhbGlmeSwgYWN0dWFsLCB2YWwpIHtcbiAgICBzd2l0Y2ggKHF1YWxpZnkpIHtcbiAgICBjYXNlICc9JzpcbiAgICAgIHJldHVybiBhY3R1YWwgPT0gdmFsXG4gICAgY2FzZSAnXj0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZygnXj0nICsgdmFsKSB8fCBhdHRyQ2FjaGUucygnXj0nICsgdmFsLCAnXicgKyBjbGVhbih2YWwpLCAxKSlcbiAgICBjYXNlICckPSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKCckPScgKyB2YWwpIHx8IGF0dHJDYWNoZS5zKCckPScgKyB2YWwsIGNsZWFuKHZhbCkgKyAnJCcsIDEpKVxuICAgIGNhc2UgJyo9JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcodmFsKSB8fCBhdHRyQ2FjaGUucyh2YWwsIGNsZWFuKHZhbCksIDEpKVxuICAgIGNhc2UgJ349JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcoJ349JyArIHZhbCkgfHwgYXR0ckNhY2hlLnMoJ349JyArIHZhbCwgJyg/Ol58XFxcXHMrKScgKyBjbGVhbih2YWwpICsgJyg/OlxcXFxzK3wkKScsIDEpKVxuICAgIGNhc2UgJ3w9JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcoJ3w9JyArIHZhbCkgfHwgYXR0ckNhY2hlLnMoJ3w9JyArIHZhbCwgJ14nICsgY2xlYW4odmFsKSArICcoLXwkKScsIDEpKVxuICAgIH1cbiAgICByZXR1cm4gMFxuICB9XG5cbiAgLy8gZ2l2ZW4gYSBzZWxlY3RvciwgZmlyc3QgY2hlY2sgZm9yIHNpbXBsZSBjYXNlcyB0aGVuIGNvbGxlY3QgYWxsIGJhc2UgY2FuZGlkYXRlIG1hdGNoZXMgYW5kIGZpbHRlclxuICBmdW5jdGlvbiBfcXdlcnkoc2VsZWN0b3IsIF9yb290KSB7XG4gICAgdmFyIHIgPSBbXSwgcmV0ID0gW10sIGksIGwsIG0sIHRva2VuLCB0YWcsIGVscywgaW50ciwgaXRlbSwgcm9vdCA9IF9yb290XG4gICAgICAsIHRva2VucyA9IHRva2VuQ2FjaGUuZyhzZWxlY3RvcikgfHwgdG9rZW5DYWNoZS5zKHNlbGVjdG9yLCBzZWxlY3Rvci5zcGxpdCh0b2tlbml6cikpXG4gICAgICAsIGRpdmlkZWRUb2tlbnMgPSBzZWxlY3Rvci5tYXRjaChkaXZpZGVycylcblxuICAgIGlmICghdG9rZW5zLmxlbmd0aCkgcmV0dXJuIHJcblxuICAgIHRva2VuID0gKHRva2VucyA9IHRva2Vucy5zbGljZSgwKSkucG9wKCkgLy8gY29weSBjYWNoZWQgdG9rZW5zLCB0YWtlIHRoZSBsYXN0IG9uZVxuICAgIGlmICh0b2tlbnMubGVuZ3RoICYmIChtID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS5tYXRjaChpZE9ubHkpKSkgcm9vdCA9IGJ5SWQoX3Jvb3QsIG1bMV0pXG4gICAgaWYgKCFyb290KSByZXR1cm4gclxuXG4gICAgaW50ciA9IHEodG9rZW4pXG4gICAgLy8gY29sbGVjdCBiYXNlIGNhbmRpZGF0ZXMgdG8gZmlsdGVyXG4gICAgZWxzID0gcm9vdCAhPT0gX3Jvb3QgJiYgcm9vdFtub2RlVHlwZV0gIT09IDkgJiYgZGl2aWRlZFRva2VucyAmJiAvXlsrfl0kLy50ZXN0KGRpdmlkZWRUb2tlbnNbZGl2aWRlZFRva2Vucy5sZW5ndGggLSAxXSkgP1xuICAgICAgZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgd2hpbGUgKHJvb3QgPSByb290Lm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgcm9vdFtub2RlVHlwZV0gPT0gMSAmJiAoaW50clsxXSA/IGludHJbMV0gPT0gcm9vdFt0YWdOYW1lXS50b0xvd2VyQ2FzZSgpIDogMSkgJiYgKHJbci5sZW5ndGhdID0gcm9vdClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gclxuICAgICAgfShbXSkgOlxuICAgICAgcm9vdFtieVRhZ10oaW50clsxXSB8fCAnKicpXG4gICAgLy8gZmlsdGVyIGVsZW1lbnRzIGFjY29yZGluZyB0byB0aGUgcmlnaHQtbW9zdCBwYXJ0IG9mIHRoZSBzZWxlY3RvclxuICAgIGZvciAoaSA9IDAsIGwgPSBlbHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoaXRlbSA9IGludGVycHJldC5hcHBseShlbHNbaV0sIGludHIpKSByW3IubGVuZ3RoXSA9IGl0ZW1cbiAgICB9XG4gICAgaWYgKCF0b2tlbnMubGVuZ3RoKSByZXR1cm4gclxuXG4gICAgLy8gZmlsdGVyIGZ1cnRoZXIgYWNjb3JkaW5nIHRvIHRoZSByZXN0IG9mIHRoZSBzZWxlY3RvciAodGhlIGxlZnQgc2lkZSlcbiAgICBlYWNoKHIsIGZ1bmN0aW9uIChlKSB7IGlmIChhbmNlc3Rvck1hdGNoKGUsIHRva2VucywgZGl2aWRlZFRva2VucykpIHJldFtyZXQubGVuZ3RoXSA9IGUgfSlcbiAgICByZXR1cm4gcmV0XG4gIH1cblxuICAvLyBjb21wYXJlIGVsZW1lbnQgdG8gYSBzZWxlY3RvclxuICBmdW5jdGlvbiBpcyhlbCwgc2VsZWN0b3IsIHJvb3QpIHtcbiAgICBpZiAoaXNOb2RlKHNlbGVjdG9yKSkgcmV0dXJuIGVsID09IHNlbGVjdG9yXG4gICAgaWYgKGFycmF5TGlrZShzZWxlY3RvcikpIHJldHVybiAhIX5mbGF0dGVuKHNlbGVjdG9yKS5pbmRleE9mKGVsKSAvLyBpZiBzZWxlY3RvciBpcyBhbiBhcnJheSwgaXMgZWwgYSBtZW1iZXI/XG5cbiAgICB2YXIgc2VsZWN0b3JzID0gc2VsZWN0b3Iuc3BsaXQoJywnKSwgdG9rZW5zLCBkaXZpZGVkVG9rZW5zXG4gICAgd2hpbGUgKHNlbGVjdG9yID0gc2VsZWN0b3JzLnBvcCgpKSB7XG4gICAgICB0b2tlbnMgPSB0b2tlbkNhY2hlLmcoc2VsZWN0b3IpIHx8IHRva2VuQ2FjaGUucyhzZWxlY3Rvciwgc2VsZWN0b3Iuc3BsaXQodG9rZW5penIpKVxuICAgICAgZGl2aWRlZFRva2VucyA9IHNlbGVjdG9yLm1hdGNoKGRpdmlkZXJzKVxuICAgICAgdG9rZW5zID0gdG9rZW5zLnNsaWNlKDApIC8vIGNvcHkgYXJyYXlcbiAgICAgIGlmIChpbnRlcnByZXQuYXBwbHkoZWwsIHEodG9rZW5zLnBvcCgpKSkgJiYgKCF0b2tlbnMubGVuZ3RoIHx8IGFuY2VzdG9yTWF0Y2goZWwsIHRva2VucywgZGl2aWRlZFRva2Vucywgcm9vdCkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gZ2l2ZW4gZWxlbWVudHMgbWF0Y2hpbmcgdGhlIHJpZ2h0LW1vc3QgcGFydCBvZiBhIHNlbGVjdG9yLCBmaWx0ZXIgb3V0IGFueSB0aGF0IGRvbid0IG1hdGNoIHRoZSByZXN0XG4gIGZ1bmN0aW9uIGFuY2VzdG9yTWF0Y2goZWwsIHRva2VucywgZGl2aWRlZFRva2Vucywgcm9vdCkge1xuICAgIHZhciBjYW5kXG4gICAgLy8gcmVjdXJzaXZlbHkgd29yayBiYWNrd2FyZHMgdGhyb3VnaCB0aGUgdG9rZW5zIGFuZCB1cCB0aGUgZG9tLCBjb3ZlcmluZyBhbGwgb3B0aW9uc1xuICAgIGZ1bmN0aW9uIGNyYXdsKGUsIGksIHApIHtcbiAgICAgIHdoaWxlIChwID0gd2Fsa2VyW2RpdmlkZWRUb2tlbnNbaV1dKHAsIGUpKSB7XG4gICAgICAgIGlmIChpc05vZGUocCkgJiYgKGludGVycHJldC5hcHBseShwLCBxKHRva2Vuc1tpXSkpKSkge1xuICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICBpZiAoY2FuZCA9IGNyYXdsKHAsIGkgLSAxLCBwKSkgcmV0dXJuIGNhbmRcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIHBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKGNhbmQgPSBjcmF3bChlbCwgdG9rZW5zLmxlbmd0aCAtIDEsIGVsKSkgJiYgKCFyb290IHx8IGlzQW5jZXN0b3IoY2FuZCwgcm9vdCkpXG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGUoZWwsIHQpIHtcbiAgICByZXR1cm4gZWwgJiYgdHlwZW9mIGVsID09PSAnb2JqZWN0JyAmJiAodCA9IGVsW25vZGVUeXBlXSkgJiYgKHQgPT0gMSB8fCB0ID09IDkpXG4gIH1cblxuICBmdW5jdGlvbiB1bmlxKGFyKSB7XG4gICAgdmFyIGEgPSBbXSwgaSwgajtcbiAgICBvOlxuICAgIGZvciAoaSA9IDA7IGkgPCBhci5sZW5ndGg7ICsraSkge1xuICAgICAgZm9yIChqID0gMDsgaiA8IGEubGVuZ3RoOyArK2opIGlmIChhW2pdID09IGFyW2ldKSBjb250aW51ZSBvXG4gICAgICBhW2EubGVuZ3RoXSA9IGFyW2ldXG4gICAgfVxuICAgIHJldHVybiBhXG4gIH1cblxuICBmdW5jdGlvbiBhcnJheUxpa2Uobykge1xuICAgIHJldHVybiAodHlwZW9mIG8gPT09ICdvYmplY3QnICYmIGlzRmluaXRlKG8ubGVuZ3RoKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVJvb3Qocm9vdCkge1xuICAgIGlmICghcm9vdCkgcmV0dXJuIGRvY1xuICAgIGlmICh0eXBlb2Ygcm9vdCA9PSAnc3RyaW5nJykgcmV0dXJuIHF3ZXJ5KHJvb3QpWzBdXG4gICAgaWYgKCFyb290W25vZGVUeXBlXSAmJiBhcnJheUxpa2Uocm9vdCkpIHJldHVybiByb290WzBdXG4gICAgcmV0dXJuIHJvb3RcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ5SWQocm9vdCwgaWQsIGVsKSB7XG4gICAgLy8gaWYgZG9jLCBxdWVyeSBvbiBpdCwgZWxzZSBxdWVyeSB0aGUgcGFyZW50IGRvYyBvciBpZiBhIGRldGFjaGVkIGZyYWdtZW50IHJld3JpdGUgdGhlIHF1ZXJ5IGFuZCBydW4gb24gdGhlIGZyYWdtZW50XG4gICAgcmV0dXJuIHJvb3Rbbm9kZVR5cGVdID09PSA5ID8gcm9vdC5nZXRFbGVtZW50QnlJZChpZCkgOlxuICAgICAgcm9vdC5vd25lckRvY3VtZW50ICYmXG4gICAgICAgICgoKGVsID0gcm9vdC5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSkgJiYgaXNBbmNlc3RvcihlbCwgcm9vdCkgJiYgZWwpIHx8XG4gICAgICAgICAgKCFpc0FuY2VzdG9yKHJvb3QsIHJvb3Qub3duZXJEb2N1bWVudCkgJiYgc2VsZWN0KCdbaWQ9XCInICsgaWQgKyAnXCJdJywgcm9vdClbMF0pKVxuICB9XG5cbiAgZnVuY3Rpb24gcXdlcnkoc2VsZWN0b3IsIF9yb290KSB7XG4gICAgdmFyIG0sIGVsLCByb290ID0gbm9ybWFsaXplUm9vdChfcm9vdClcblxuICAgIC8vIGVhc3ksIGZhc3QgY2FzZXMgdGhhdCB3ZSBjYW4gZGlzcGF0Y2ggd2l0aCBzaW1wbGUgRE9NIGNhbGxzXG4gICAgaWYgKCFyb290IHx8ICFzZWxlY3RvcikgcmV0dXJuIFtdXG4gICAgaWYgKHNlbGVjdG9yID09PSB3aW5kb3cgfHwgaXNOb2RlKHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuICFfcm9vdCB8fCAoc2VsZWN0b3IgIT09IHdpbmRvdyAmJiBpc05vZGUocm9vdCkgJiYgaXNBbmNlc3RvcihzZWxlY3Rvciwgcm9vdCkpID8gW3NlbGVjdG9yXSA6IFtdXG4gICAgfVxuICAgIGlmIChzZWxlY3RvciAmJiBhcnJheUxpa2Uoc2VsZWN0b3IpKSByZXR1cm4gZmxhdHRlbihzZWxlY3RvcilcbiAgICBpZiAobSA9IHNlbGVjdG9yLm1hdGNoKGVhc3kpKSB7XG4gICAgICBpZiAobVsxXSkgcmV0dXJuIChlbCA9IGJ5SWQocm9vdCwgbVsxXSkpID8gW2VsXSA6IFtdXG4gICAgICBpZiAobVsyXSkgcmV0dXJuIGFycmF5aWZ5KHJvb3RbYnlUYWddKG1bMl0pKVxuICAgICAgaWYgKGhhc0J5Q2xhc3MgJiYgbVszXSkgcmV0dXJuIGFycmF5aWZ5KHJvb3RbYnlDbGFzc10obVszXSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdChzZWxlY3Rvciwgcm9vdClcbiAgfVxuXG4gIC8vIHdoZXJlIHRoZSByb290IGlzIG5vdCBkb2N1bWVudCBhbmQgYSByZWxhdGlvbnNoaXAgc2VsZWN0b3IgaXMgZmlyc3Qgd2UgaGF2ZSB0b1xuICAvLyBkbyBzb21lIGF3a3dhcmQgYWRqdXN0bWVudHMgdG8gZ2V0IGl0IHRvIHdvcmssIGV2ZW4gd2l0aCBxU0FcbiAgZnVuY3Rpb24gY29sbGVjdFNlbGVjdG9yKHJvb3QsIGNvbGxlY3Rvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAocykge1xuICAgICAgdmFyIG9pZCwgbmlkXG4gICAgICBpZiAoc3BsaXR0YWJsZS50ZXN0KHMpKSB7XG4gICAgICAgIGlmIChyb290W25vZGVUeXBlXSAhPT0gOSkge1xuICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgZWwgaGFzIGFuIGlkLCByZXdyaXRlIHRoZSBxdWVyeSwgc2V0IHJvb3QgdG8gZG9jIGFuZCBydW4gaXRcbiAgICAgICAgICBpZiAoIShuaWQgPSBvaWQgPSByb290LmdldEF0dHJpYnV0ZSgnaWQnKSkpIHJvb3Quc2V0QXR0cmlidXRlKCdpZCcsIG5pZCA9ICdfX3F3ZXJ5bWV1cHNjb3R0eScpXG4gICAgICAgICAgcyA9ICdbaWQ9XCInICsgbmlkICsgJ1wiXScgKyBzIC8vIGF2b2lkIGJ5SWQgYW5kIGFsbG93IHVzIHRvIG1hdGNoIGNvbnRleHQgZWxlbWVudFxuICAgICAgICAgIGNvbGxlY3Rvcihyb290LnBhcmVudE5vZGUgfHwgcm9vdCwgcywgdHJ1ZSlcbiAgICAgICAgICBvaWQgfHwgcm9vdC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzLmxlbmd0aCAmJiBjb2xsZWN0b3Iocm9vdCwgcywgZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlzQW5jZXN0b3IgPSAnY29tcGFyZURvY3VtZW50UG9zaXRpb24nIGluIGh0bWwgP1xuICAgIGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgIHJldHVybiAoY29udGFpbmVyLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGVsZW1lbnQpICYgMTYpID09IDE2XG4gICAgfSA6ICdjb250YWlucycgaW4gaHRtbCA/XG4gICAgZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgY29udGFpbmVyID0gY29udGFpbmVyW25vZGVUeXBlXSA9PT0gOSB8fCBjb250YWluZXIgPT0gd2luZG93ID8gaHRtbCA6IGNvbnRhaW5lclxuICAgICAgcmV0dXJuIGNvbnRhaW5lciAhPT0gZWxlbWVudCAmJiBjb250YWluZXIuY29udGFpbnMoZWxlbWVudClcbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkgaWYgKGVsZW1lbnQgPT09IGNvbnRhaW5lcikgcmV0dXJuIDFcbiAgICAgIHJldHVybiAwXG4gICAgfVxuICAsIGdldEF0dHIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBkZXRlY3QgYnVnZ3kgSUUgc3JjL2hyZWYgZ2V0QXR0cmlidXRlKCkgY2FsbFxuICAgICAgdmFyIGUgPSBkb2MuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICByZXR1cm4gKChlLmlubmVySFRNTCA9ICc8YSBocmVmPVwiI3hcIj54PC9hPicpICYmIGUuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSAhPSAnI3gnKSA/XG4gICAgICAgIGZ1bmN0aW9uIChlLCBhKSB7XG4gICAgICAgICAgcmV0dXJuIGEgPT09ICdjbGFzcycgPyBlLmNsYXNzTmFtZSA6IChhID09PSAnaHJlZicgfHwgYSA9PT0gJ3NyYycpID9cbiAgICAgICAgICAgIGUuZ2V0QXR0cmlidXRlKGEsIDIpIDogZS5nZXRBdHRyaWJ1dGUoYSlcbiAgICAgICAgfSA6XG4gICAgICAgIGZ1bmN0aW9uIChlLCBhKSB7IHJldHVybiBlLmdldEF0dHJpYnV0ZShhKSB9XG4gICAgfSgpXG4gICwgaGFzQnlDbGFzcyA9ICEhZG9jW2J5Q2xhc3NdXG4gICAgLy8gaGFzIG5hdGl2ZSBxU0Egc3VwcG9ydFxuICAsIGhhc1FTQSA9IGRvYy5xdWVyeVNlbGVjdG9yICYmIGRvY1txU0FdXG4gICAgLy8gdXNlIG5hdGl2ZSBxU0FcbiAgLCBzZWxlY3RRU0EgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIHJvb3QpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXSwgc3MsIGVcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChyb290W25vZGVUeXBlXSA9PT0gOSB8fCAhc3BsaXR0YWJsZS50ZXN0KHNlbGVjdG9yKSkge1xuICAgICAgICAgIC8vIG1vc3Qgd29yayBpcyBkb25lIHJpZ2h0IGhlcmUsIGRlZmVyIHRvIHFTQVxuICAgICAgICAgIHJldHVybiBhcnJheWlmeShyb290W3FTQV0oc2VsZWN0b3IpKVxuICAgICAgICB9XG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZSB3aGVyZSB3ZSBuZWVkIHRoZSBzZXJ2aWNlcyBvZiBgY29sbGVjdFNlbGVjdG9yKClgXG4gICAgICAgIGVhY2goc3MgPSBzZWxlY3Rvci5zcGxpdCgnLCcpLCBjb2xsZWN0U2VsZWN0b3Iocm9vdCwgZnVuY3Rpb24gKGN0eCwgcykge1xuICAgICAgICAgIGUgPSBjdHhbcVNBXShzKVxuICAgICAgICAgIGlmIChlLmxlbmd0aCA9PSAxKSByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBlLml0ZW0oMClcbiAgICAgICAgICBlbHNlIGlmIChlLmxlbmd0aCkgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdChhcnJheWlmeShlKSlcbiAgICAgICAgfSkpXG4gICAgICAgIHJldHVybiBzcy5sZW5ndGggPiAxICYmIHJlc3VsdC5sZW5ndGggPiAxID8gdW5pcShyZXN1bHQpIDogcmVzdWx0XG4gICAgICB9IGNhdGNoIChleCkgeyB9XG4gICAgICByZXR1cm4gc2VsZWN0Tm9uTmF0aXZlKHNlbGVjdG9yLCByb290KVxuICAgIH1cbiAgICAvLyBubyBuYXRpdmUgc2VsZWN0b3Igc3VwcG9ydFxuICAsIHNlbGVjdE5vbk5hdGl2ZSA9IGZ1bmN0aW9uIChzZWxlY3Rvciwgcm9vdCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdLCBpdGVtcywgbSwgaSwgbCwgciwgc3NcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZShub3JtYWxpenIsICckMScpXG4gICAgICBpZiAobSA9IHNlbGVjdG9yLm1hdGNoKHRhZ0FuZE9yQ2xhc3MpKSB7XG4gICAgICAgIHIgPSBjbGFzc1JlZ2V4KG1bMl0pXG4gICAgICAgIGl0ZW1zID0gcm9vdFtieVRhZ10obVsxXSB8fCAnKicpXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBpdGVtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoci50ZXN0KGl0ZW1zW2ldLmNsYXNzTmFtZSkpIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IGl0ZW1zW2ldXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfVxuICAgICAgLy8gbW9yZSBjb21wbGV4IHNlbGVjdG9yLCBnZXQgYF9xd2VyeSgpYCB0byBkbyB0aGUgd29yayBmb3IgdXNcbiAgICAgIGVhY2goc3MgPSBzZWxlY3Rvci5zcGxpdCgnLCcpLCBjb2xsZWN0U2VsZWN0b3Iocm9vdCwgZnVuY3Rpb24gKGN0eCwgcywgcmV3cml0ZSkge1xuICAgICAgICByID0gX3F3ZXJ5KHMsIGN0eClcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IHIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGN0eFtub2RlVHlwZV0gPT09IDkgfHwgcmV3cml0ZSB8fCBpc0FuY2VzdG9yKHJbaV0sIHJvb3QpKSByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSByW2ldXG4gICAgICAgIH1cbiAgICAgIH0pKVxuICAgICAgcmV0dXJuIHNzLmxlbmd0aCA+IDEgJiYgcmVzdWx0Lmxlbmd0aCA+IDEgPyB1bmlxKHJlc3VsdCkgOiByZXN1bHRcbiAgICB9XG4gICwgY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIC8vIGNvbmZpZ05hdGl2ZVFTQTogdXNlIGZ1bGx5LWludGVybmFsIHNlbGVjdG9yIG9yIG5hdGl2ZSBxU0Egd2hlcmUgcHJlc2VudFxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW3VzZU5hdGl2ZVFTQV0gIT09ICd1bmRlZmluZWQnKVxuICAgICAgICBzZWxlY3QgPSAhb3B0aW9uc1t1c2VOYXRpdmVRU0FdID8gc2VsZWN0Tm9uTmF0aXZlIDogaGFzUVNBID8gc2VsZWN0UVNBIDogc2VsZWN0Tm9uTmF0aXZlXG4gICAgfVxuXG4gIGNvbmZpZ3VyZSh7IHVzZU5hdGl2ZVFTQTogdHJ1ZSB9KVxuXG4gIHF3ZXJ5LmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZVxuICBxd2VyeS51bmlxID0gdW5pcVxuICBxd2VyeS5pcyA9IGlzXG4gIHF3ZXJ5LnBzZXVkb3MgPSB7fVxuXG4gIHJldHVybiBxd2VyeVxufSk7XG4iLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjUuMlxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZXhwb3J0c2Agb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gRXN0YWJsaXNoIHRoZSBvYmplY3QgdGhhdCBnZXRzIHJldHVybmVkIHRvIGJyZWFrIG91dCBvZiBhIGxvb3AgaXRlcmF0aW9uLlxuICB2YXIgYnJlYWtlciA9IHt9O1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICAvLyBDcmVhdGUgcXVpY2sgcmVmZXJlbmNlIHZhcmlhYmxlcyBmb3Igc3BlZWQgYWNjZXNzIHRvIGNvcmUgcHJvdG90eXBlcy5cbiAgdmFyXG4gICAgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICBjb25jYXQgICAgICAgICAgID0gQXJyYXlQcm90by5jb25jYXQsXG4gICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUZvckVhY2ggICAgICA9IEFycmF5UHJvdG8uZm9yRWFjaCxcbiAgICBuYXRpdmVNYXAgICAgICAgICAgPSBBcnJheVByb3RvLm1hcCxcbiAgICBuYXRpdmVSZWR1Y2UgICAgICAgPSBBcnJheVByb3RvLnJlZHVjZSxcbiAgICBuYXRpdmVSZWR1Y2VSaWdodCAgPSBBcnJheVByb3RvLnJlZHVjZVJpZ2h0LFxuICAgIG5hdGl2ZUZpbHRlciAgICAgICA9IEFycmF5UHJvdG8uZmlsdGVyLFxuICAgIG5hdGl2ZUV2ZXJ5ICAgICAgICA9IEFycmF5UHJvdG8uZXZlcnksXG4gICAgbmF0aXZlU29tZSAgICAgICAgID0gQXJyYXlQcm90by5zb21lLFxuICAgIG5hdGl2ZUluZGV4T2YgICAgICA9IEFycmF5UHJvdG8uaW5kZXhPZixcbiAgICBuYXRpdmVMYXN0SW5kZXhPZiAgPSBBcnJheVByb3RvLmxhc3RJbmRleE9mLFxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQ7XG5cbiAgLy8gQ3JlYXRlIGEgc2FmZSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciB1c2UgYmVsb3cuXG4gIHZhciBfID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8pKSByZXR1cm4gbmV3IF8ob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yICoqTm9kZS5qcyoqLCB3aXRoXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGUgb2xkIGByZXF1aXJlKClgIEFQSS4gSWYgd2UncmUgaW5cbiAgLy8gdGhlIGJyb3dzZXIsIGFkZCBgX2AgYXMgYSBnbG9iYWwgb2JqZWN0IHZpYSBhIHN0cmluZyBpZGVudGlmaWVyLFxuICAvLyBmb3IgQ2xvc3VyZSBDb21waWxlciBcImFkdmFuY2VkXCIgbW9kZS5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS41LjInO1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgb2JqZWN0cyB3aXRoIHRoZSBidWlsdC1pbiBgZm9yRWFjaGAsIGFycmF5cywgYW5kIHJhdyBvYmplY3RzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZm9yRWFjaGAgaWYgYXZhaWxhYmxlLlxuICB2YXIgZWFjaCA9IF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybjtcbiAgICBpZiAobmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCkge1xuICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRvciB0byBlYWNoIGVsZW1lbnQuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBtYXBgIGlmIGF2YWlsYWJsZS5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVNYXAgJiYgb2JqLm1hcCA9PT0gbmF0aXZlTWFwKSByZXR1cm4gb2JqLm1hcChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmVzdWx0cy5wdXNoKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgdmFyIHJlZHVjZUVycm9yID0gJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnO1xuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZWAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZSAmJiBvYmoucmVkdWNlID09PSBuYXRpdmVSZWR1Y2UpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZShpdGVyYXRvcik7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gdmFsdWU7XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlUmlnaHRgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2VSaWdodCAmJiBvYmoucmVkdWNlUmlnaHQgPT09IG5hdGl2ZVJlZHVjZVJpZ2h0KSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCAhPT0gK2xlbmd0aCkge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpbmRleCA9IGtleXMgPyBrZXlzWy0tbGVuZ3RoXSA6IC0tbGVuZ3RoO1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSBvYmpbaW5kZXhdO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIG9ialtpbmRleF0sIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlRmlsdGVyICYmIG9iai5maWx0ZXIgPT09IG5hdGl2ZUZpbHRlcikgcmV0dXJuIG9iai5maWx0ZXIoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4gIWl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9LCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGV2ZXJ5YCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZUV2ZXJ5ICYmIG9iai5ldmVyeSA9PT0gbmF0aXZlRXZlcnkpIHJldHVybiBvYmouZXZlcnkoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBzb21lYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIHZhciBhbnkgPSBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVTb21lICYmIG9iai5zb21lID09PSBuYXRpdmVTb21lKSByZXR1cm4gb2JqLnNvbWUoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChyZXN1bHQgfHwgKHJlc3VsdCA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gdmFsdWVba2V5XTsgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycywgZmlyc3QpIHtcbiAgICBpZiAoXy5pc0VtcHR5KGF0dHJzKSkgcmV0dXJuIGZpcnN0ID8gdm9pZCAwIDogW107XG4gICAgcmV0dXJuIF9bZmlyc3QgPyAnZmluZCcgOiAnZmlsdGVyJ10ob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG4gICAgICAgIGlmIChhdHRyc1trZXldICE9PSB2YWx1ZVtrZXldKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLndoZXJlKG9iaiwgYXR0cnMsIHRydWUpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IG9yIChlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgLy8gQ2FuJ3Qgb3B0aW1pemUgYXJyYXlzIG9mIGludGVnZXJzIGxvbmdlciB0aGFuIDY1LDUzNSBlbGVtZW50cy5cbiAgLy8gU2VlIFtXZWJLaXQgQnVnIDgwNzk3XShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9ODA3OTcpXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0VtcHR5KG9iaikpIHJldHVybiAtSW5maW5pdHk7XG4gICAgdmFyIHJlc3VsdCA9IHtjb21wdXRlZCA6IC1JbmZpbml0eSwgdmFsdWU6IC1JbmZpbml0eX07XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGNvbXB1dGVkID4gcmVzdWx0LmNvbXB1dGVkICYmIChyZXN1bHQgPSB7dmFsdWUgOiB2YWx1ZSwgY29tcHV0ZWQgOiBjb21wdXRlZH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopICYmIG9ialswXSA9PT0gK29ialswXSAmJiBvYmoubGVuZ3RoIDwgNjU1MzUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShNYXRoLCBvYmopO1xuICAgIH1cbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNFbXB0eShvYmopKSByZXR1cm4gSW5maW5pdHk7XG4gICAgdmFyIHJlc3VsdCA9IHtjb21wdXRlZCA6IEluZmluaXR5LCB2YWx1ZTogSW5maW5pdHl9O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBjb21wdXRlZCA8IHJlc3VsdC5jb21wdXRlZCAmJiAocmVzdWx0ID0ge3ZhbHVlIDogdmFsdWUsIGNvbXB1dGVkIDogY29tcHV0ZWR9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYW4gYXJyYXksIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGUgXG4gIC8vIFtGaXNoZXItWWF0ZXMgc2h1ZmZsZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXLigJNZYXRlc19zaHVmZmxlKS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJhbmQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBbXTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbShpbmRleCsrKTtcbiAgICAgIHNodWZmbGVkW2luZGV4IC0gMV0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQgZnJvbSB0aGUgYXJyYXkuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMiB8fCBndWFyZCkge1xuICAgICAgcmV0dXJuIG9ialtfLnJhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICByZXR1cm4gXy5zaHVmZmxlKG9iaikuc2xpY2UoMCwgTWF0aC5tYXgoMCwgbikpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGxvb2t1cCBpdGVyYXRvcnMuXG4gIHZhciBsb29rdXBJdGVyYXRvciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZSA6IGZ1bmN0aW9uKG9iail7IHJldHVybiBvYmpbdmFsdWVdOyB9O1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRvci5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IodmFsdWUpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IC0gcmlnaHQuaW5kZXg7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24oYmVoYXZpb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgdmFyIGl0ZXJhdG9yID0gdmFsdWUgPT0gbnVsbCA/IF8uaWRlbnRpdHkgOiBsb29rdXBJdGVyYXRvcih2YWx1ZSk7XG4gICAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCBrZXksIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwga2V5LCB2YWx1ZSkge1xuICAgIChfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSA6IChyZXN1bHRba2V5XSA9IFtdKSkucHVzaCh2YWx1ZSk7XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICBfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSsrIDogcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBpdGVyYXRvciA9PSBudWxsID8gXy5pZGVudGl0eSA6IGxvb2t1cEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4+IDE7XG4gICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W21pZF0pIDwgdmFsdWUgPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHJldHVybiAobiA9PSBudWxsKSB8fCBndWFyZCA/IGFycmF5WzBdIDogc2xpY2UuY2FsbChhcnJheSwgMCwgbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aFxuICAvLyBgXy5tYXBgLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgYXJyYXkubGVuZ3RoIC0gKChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQpIHtcbiAgICAgIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIE1hdGgubWF4KGFycmF5Lmxlbmd0aCAtIG4sIDApKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKipcbiAgLy8gY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgKG4gPT0gbnVsbCkgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBvdXRwdXQpIHtcbiAgICBpZiAoc2hhbGxvdyAmJiBfLmV2ZXJ5KGlucHV0LCBfLmlzQXJyYXkpKSB7XG4gICAgICByZXR1cm4gY29uY2F0LmFwcGx5KG91dHB1dCwgaW5wdXQpO1xuICAgIH1cbiAgICBlYWNoKGlucHV0LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkgfHwgXy5pc0FyZ3VtZW50cyh2YWx1ZSkpIHtcbiAgICAgICAgc2hhbGxvdyA/IHB1c2guYXBwbHkob3V0cHV0LCB2YWx1ZSkgOiBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBvdXRwdXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIGp1c3Qgb25lIGxldmVsLlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBbXSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0b3I7XG4gICAgICBpdGVyYXRvciA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluaXRpYWwgPSBpdGVyYXRvciA/IF8ubWFwKGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkgOiBhcnJheTtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZWFjaChpbml0aWFsLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGlmIChpc1NvcnRlZCA/ICghaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSB2YWx1ZSkgOiAhXy5jb250YWlucyhzZWVuLCB2YWx1ZSkpIHtcbiAgICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShfLmZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKF8udW5pcShhcnJheSksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBfLmV2ZXJ5KHJlc3QsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2Yob3RoZXIsIGl0ZW0pID49IDA7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTsgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuZ3RoID0gXy5tYXgoXy5wbHVjayhhcmd1bWVudHMsIFwibGVuZ3RoXCIpLmNvbmNhdCgwKSk7XG4gICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRzW2ldID0gXy5wbHVjayhhcmd1bWVudHMsICcnICsgaSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICBpZiAobGlzdCA9PSBudWxsKSByZXR1cm4ge307XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwbHkgdXMgd2l0aCBpbmRleE9mIChJJ20gbG9va2luZyBhdCB5b3UsICoqTVNJRSoqKSxcbiAgLy8gd2UgbmVlZCB0aGlzIGZ1bmN0aW9uLiBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuXG4gIC8vIGl0ZW0gaW4gYW4gYXJyYXksIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBpbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgaWYgKHR5cGVvZiBpc1NvcnRlZCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpID0gKGlzU29ydGVkIDwgMCA/IE1hdGgubWF4KDAsIGxlbmd0aCArIGlzU29ydGVkKSA6IGlzU29ydGVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkgPSBfLnNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2ldID09PSBpdGVtID8gaSA6IC0xO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBhcnJheS5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtLCBpc1NvcnRlZCk7XG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGxhc3RJbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIF8ubGFzdEluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgZnJvbSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGhhc0luZGV4ID0gZnJvbSAhPSBudWxsO1xuICAgIGlmIChuYXRpdmVMYXN0SW5kZXhPZiAmJiBhcnJheS5sYXN0SW5kZXhPZiA9PT0gbmF0aXZlTGFzdEluZGV4T2YpIHtcbiAgICAgIHJldHVybiBoYXNJbmRleCA/IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0sIGZyb20pIDogYXJyYXkubGFzdEluZGV4T2YoaXRlbSk7XG4gICAgfVxuICAgIHZhciBpID0gKGhhc0luZGV4ID8gZnJvbSA6IGFycmF5Lmxlbmd0aCk7XG4gICAgd2hpbGUgKGktLSkgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IGFyZ3VtZW50c1syXSB8fCAxO1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlKGlkeCA8IGxlbmd0aCkge1xuICAgICAgcmFuZ2VbaWR4KytdID0gc3RhcnQ7XG4gICAgICBzdGFydCArPSBzdGVwO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldXNhYmxlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciBwcm90b3R5cGUgc2V0dGluZy5cbiAgdmFyIGN0b3IgPSBmdW5jdGlvbigpe307XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgdmFyIGFyZ3MsIGJvdW5kO1xuICAgIGlmIChuYXRpdmVCaW5kICYmIGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihmdW5jKSkgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSkgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IGZ1bmMucHJvdG90eXBlO1xuICAgICAgdmFyIHNlbGYgPSBuZXcgY3RvcjtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHNlbGYsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHJldHVybiByZXN1bHQ7XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEJpbmQgYWxsIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdFxuICAvLyBhbGwgY2FsbGJhY2tzIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcihcImJpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXNcIik7XG4gICAgZWFjaChmdW5jcywgZnVuY3Rpb24oZikgeyBvYmpbZl0gPSBfLmJpbmQob2JqW2ZdLCBvYmopOyB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vID0ge307XG4gICAgaGFzaGVyIHx8IChoYXNoZXIgPSBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5ID0gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gXy5oYXMobWVtbywga2V5KSA/IG1lbW9ba2V5XSA6IChtZW1vW2tleV0gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7IH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiBfLmRlbGF5LmFwcGx5KF8sIFtmdW5jLCAxXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBuZXcgRGF0ZTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBsYXN0ID0gKG5ldyBEYXRlKCkpIC0gdGltZXN0YW1wO1xuICAgICAgICBpZiAobGFzdCA8IHdhaXQpIHtcbiAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgIGlmICghaW1tZWRpYXRlKSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxOb3cpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgcmFuID0gZmFsc2UsIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJhbikgcmV0dXJuIG1lbW87XG4gICAgICByYW4gPSB0cnVlO1xuICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbZnVuY107XG4gICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gd3JhcHBlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGZvciAodmFyIGkgPSBmdW5jcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcmdzID0gW2Z1bmNzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGFmdGVyIGJlaW5nIGNhbGxlZCBOIHRpbWVzLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IG5hdGl2ZUtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiAhPT0gT2JqZWN0KG9iaikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgb2JqZWN0Jyk7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHZhbHVlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBwYWlycyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZWFjaChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChrZXkgaW4gb2JqKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIV8uY29udGFpbnMoa2V5cywga2V5KSkgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gdm9pZCAwKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT0gMSAvIGI7XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gYSA9PT0gYjtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiBhID09IFN0cmluZyhiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3JcbiAgICAgICAgLy8gb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiBhICE9ICthID8gYiAhPSArYiA6IChhID09IDAgPyAxIC8gYSA9PSAxIC8gYiA6IGEgPT0gK2IpO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09ICtiO1xuICAgICAgLy8gUmVnRXhwcyBhcmUgY29tcGFyZWQgYnkgdGhlaXIgc291cmNlIHBhdHRlcm5zIGFuZCBmbGFncy5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAgIHJldHVybiBhLnNvdXJjZSA9PSBiLnNvdXJjZSAmJlxuICAgICAgICAgICAgICAgYS5nbG9iYWwgPT0gYi5nbG9iYWwgJiZcbiAgICAgICAgICAgICAgIGEubXVsdGlsaW5lID09IGIubXVsdGlsaW5lICYmXG4gICAgICAgICAgICAgICBhLmlnbm9yZUNhc2UgPT0gYi5pZ25vcmVDYXNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT0gYjtcbiAgICB9XG4gICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzXG4gICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgKGFDdG9yIGluc3RhbmNlb2YgYUN0b3IpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgKGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG4gICAgdmFyIHNpemUgPSAwLCByZXN1bHQgPSB0cnVlO1xuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChjbGFzc05hbWUgPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBzaXplID0gYS5sZW5ndGg7XG4gICAgICByZXN1bHQgPSBzaXplID09IGIubGVuZ3RoO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgICAgICAgaWYgKCEocmVzdWx0ID0gZXEoYVtzaXplXSwgYltzaXplXSwgYVN0YWNrLCBiU3RhY2spKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gYSkge1xuICAgICAgICBpZiAoXy5oYXMoYSwga2V5KSkge1xuICAgICAgICAgIC8vIENvdW50IHRoZSBleHBlY3RlZCBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgICAgICBzaXplKys7XG4gICAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyLlxuICAgICAgICAgIGlmICghKHJlc3VsdCA9IF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gYikge1xuICAgICAgICAgIGlmIChfLmhhcyhiLCBrZXkpICYmICEoc2l6ZS0tKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gIXNpemU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiLCBbXSwgW10pO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAuXG4gIGVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICEhKG9iaiAmJiBfLmhhcyhvYmosICdjYWxsZWUnKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS5cbiAgaWYgKHR5cGVvZiAoLy4vKSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0b3JzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLlxuICBfLnJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfTtcblxuICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZW50aXR5TWFwID0ge1xuICAgIGVzY2FwZToge1xuICAgICAgJyYnOiAnJmFtcDsnLFxuICAgICAgJzwnOiAnJmx0OycsXG4gICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgXCInXCI6ICcmI3gyNzsnXG4gICAgfVxuICB9O1xuICBlbnRpdHlNYXAudW5lc2NhcGUgPSBfLmludmVydChlbnRpdHlNYXAuZXNjYXBlKTtcblxuICAvLyBSZWdleGVzIGNvbnRhaW5pbmcgdGhlIGtleXMgYW5kIHZhbHVlcyBsaXN0ZWQgaW1tZWRpYXRlbHkgYWJvdmUuXG4gIHZhciBlbnRpdHlSZWdleGVzID0ge1xuICAgIGVzY2FwZTogICBuZXcgUmVnRXhwKCdbJyArIF8ua2V5cyhlbnRpdHlNYXAuZXNjYXBlKS5qb2luKCcnKSArICddJywgJ2cnKSxcbiAgICB1bmVzY2FwZTogbmV3IFJlZ0V4cCgnKCcgKyBfLmtleXMoZW50aXR5TWFwLnVuZXNjYXBlKS5qb2luKCd8JykgKyAnKScsICdnJylcbiAgfTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIF8uZWFjaChbJ2VzY2FwZScsICd1bmVzY2FwZSddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBfW21ldGhvZF0gPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIGlmIChzdHJpbmcgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuICgnJyArIHN0cmluZykucmVwbGFjZShlbnRpdHlSZWdleGVzW21ldGhvZF0sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHlNYXBbbWV0aG9kXVttYXRjaF07XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgdGVtcGxhdGVTZXR0aW5nc2AsIGlmIHlvdSBkb24ndCB3YW50IHRvIGRlZmluZSBhblxuICAvLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4gIC8vIGd1YXJhbnRlZWQgbm90IHRvIG1hdGNoLlxuICB2YXIgbm9NYXRjaCA9IC8oLileLztcblxuICAvLyBDZXJ0YWluIGNoYXJhY3RlcnMgbmVlZCB0byBiZSBlc2NhcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgcHV0IGludG8gYVxuICAvLyBzdHJpbmcgbGl0ZXJhbC5cbiAgdmFyIGVzY2FwZXMgPSB7XG4gICAgXCInXCI6ICAgICAgXCInXCIsXG4gICAgJ1xcXFwnOiAgICAgJ1xcXFwnLFxuICAgICdcXHInOiAgICAgJ3InLFxuICAgICdcXG4nOiAgICAgJ24nLFxuICAgICdcXHQnOiAgICAgJ3QnLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlciA9IC9cXFxcfCd8XFxyfFxcbnxcXHR8XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgXy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRleHQsIGRhdGEsIHNldHRpbmdzKSB7XG4gICAgdmFyIHJlbmRlcjtcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFtcbiAgICAgIChzZXR0aW5ncy5lc2NhcGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmludGVycG9sYXRlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VcbiAgICBdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7XG5cbiAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gICAgdGV4dC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGUsIGludGVycG9sYXRlLCBldmFsdWF0ZSwgb2Zmc2V0KSB7XG4gICAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KVxuICAgICAgICAucmVwbGFjZShlc2NhcGVyLCBmdW5jdGlvbihtYXRjaCkgeyByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07IH0pO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9XG4gICAgICBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9XG4gICAgICBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgXCJyZXR1cm4gX19wO1xcblwiO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlbmRlciA9IG5ldyBGdW5jdGlvbihzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJywgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSkgcmV0dXJuIHJlbmRlcihkYXRhLCBfKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIChzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJykgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbiwgd2hpY2ggd2lsbCBkZWxlZ2F0ZSB0byB0aGUgd3JhcHBlci5cbiAgXy5jaGFpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfKG9iaikuY2hhaW4oKTtcbiAgfTtcblxuICAvLyBPT1BcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0XG4gIC8vIGNhbiBiZSB1c2VkIE9PLXN0eWxlLiBUaGlzIHdyYXBwZXIgaG9sZHMgYWx0ZXJlZCB2ZXJzaW9ucyBvZiBhbGwgdGhlXG4gIC8vIHVuZGVyc2NvcmUgZnVuY3Rpb25zLiBXcmFwcGVkIG9iamVjdHMgbWF5IGJlIGNoYWluZWQuXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG4gIH07XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICBfLm1peGluKF8pO1xuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIGVhY2goWydwb3AnLCAncHVzaCcsICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIG1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoKG5hbWUgPT0gJ3NoaWZ0JyB8fCBuYW1lID09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIGVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgXy5leHRlbmQoXy5wcm90b3R5cGUsIHtcblxuICAgIC8vIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgICBjaGFpbjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9jaGFpbiA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gICAgfVxuXG4gIH0pO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBoYXNLZXlzXG5cbmZ1bmN0aW9uIGhhc0tleXMoc291cmNlKSB7XG4gICAgcmV0dXJuIHNvdXJjZSAhPT0gbnVsbCAmJlxuICAgICAgICAodHlwZW9mIHNvdXJjZSA9PT0gXCJvYmplY3RcIiB8fFxuICAgICAgICB0eXBlb2Ygc291cmNlID09PSBcImZ1bmN0aW9uXCIpXG59XG4iLCJ2YXIgS2V5cyA9IHJlcXVpcmUoXCJvYmplY3Qta2V5c1wiKVxudmFyIGhhc0tleXMgPSByZXF1aXJlKFwiLi9oYXMta2V5c1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgaWYgKCFoYXNLZXlzKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IEtleXMoc291cmNlKVxuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwga2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBrZXlzW2pdXG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBzb3VyY2VbbmFtZV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRcbn1cbiIsInZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIGlzRnVuYyA9ICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgJiYgIShmbiBpbnN0YW5jZW9mIFJlZ0V4cCkpIHx8IHRvU3RyaW5nLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHRpZiAoIWlzRnVuYyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdGlzRnVuYyA9IGZuID09PSB3aW5kb3cuc2V0VGltZW91dCB8fCBmbiA9PT0gd2luZG93LmFsZXJ0IHx8IGZuID09PSB3aW5kb3cuY29uZmlybSB8fCBmbiA9PT0gd2luZG93LnByb21wdDtcblx0fVxuXHRyZXR1cm4gaXNGdW5jO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcblx0aWYgKCFpc0Z1bmN0aW9uKGZuKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2l0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXHR9XG5cdHZhciBpLCBrLFxuXHRcdGlzU3RyaW5nID0gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycsXG5cdFx0bCA9IG9iai5sZW5ndGgsXG5cdFx0Y29udGV4dCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogbnVsbDtcblx0aWYgKGwgPT09ICtsKSB7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0aWYgKGNvbnRleHQgPT09IG51bGwpIHtcblx0XHRcdFx0Zm4oaXNTdHJpbmcgPyBvYmouY2hhckF0KGkpIDogb2JqW2ldLCBpLCBvYmopO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm4uY2FsbChjb250ZXh0LCBpc1N0cmluZyA/IG9iai5jaGFyQXQoaSkgOiBvYmpbaV0sIGksIG9iaik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZvciAoayBpbiBvYmopIHtcblx0XHRcdGlmIChoYXNPd24uY2FsbChvYmosIGspKSB7XG5cdFx0XHRcdGlmIChjb250ZXh0ID09PSBudWxsKSB7XG5cdFx0XHRcdFx0Zm4ob2JqW2tdLCBrLCBvYmopO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZuLmNhbGwoY29udGV4dCwgb2JqW2tdLCBrLCBvYmopO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IHJlcXVpcmUoJy4vc2hpbScpO1xuXG4iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG5cdHZhciBzdHIgPSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcblx0dmFyIGlzQXJndW1lbnRzID0gc3RyID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcblx0aWYgKCFpc0FyZ3VtZW50cykge1xuXHRcdGlzQXJndW1lbnRzID0gc3RyICE9PSAnW29iamVjdCBBcnJheV0nXG5cdFx0XHQmJiB2YWx1ZSAhPT0gbnVsbFxuXHRcdFx0JiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xuXHRcdFx0JiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcblx0XHRcdCYmIHZhbHVlLmxlbmd0aCA+PSAwXG5cdFx0XHQmJiB0b1N0cmluZy5jYWxsKHZhbHVlLmNhbGxlZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdH1cblx0cmV0dXJuIGlzQXJndW1lbnRzO1xufTtcblxuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Ly8gbW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL2VzNS1zaGltXG5cdHZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuXHRcdHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcblx0XHRmb3JFYWNoID0gcmVxdWlyZSgnLi9mb3JlYWNoJyksXG5cdFx0aXNBcmdzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuXHRcdGhhc0RvbnRFbnVtQnVnID0gISh7J3RvU3RyaW5nJzogbnVsbH0pLnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpLFxuXHRcdGhhc1Byb3RvRW51bUJ1ZyA9IChmdW5jdGlvbiAoKSB7fSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3Byb3RvdHlwZScpLFxuXHRcdGRvbnRFbnVtcyA9IFtcblx0XHRcdFwidG9TdHJpbmdcIixcblx0XHRcdFwidG9Mb2NhbGVTdHJpbmdcIixcblx0XHRcdFwidmFsdWVPZlwiLFxuXHRcdFx0XCJoYXNPd25Qcm9wZXJ0eVwiLFxuXHRcdFx0XCJpc1Byb3RvdHlwZU9mXCIsXG5cdFx0XHRcInByb3BlcnR5SXNFbnVtZXJhYmxlXCIsXG5cdFx0XHRcImNvbnN0cnVjdG9yXCJcblx0XHRdLFxuXHRcdGtleXNTaGltO1xuXG5cdGtleXNTaGltID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblx0XHR2YXIgaXNPYmplY3QgPSBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcsXG5cdFx0XHRpc0Z1bmN0aW9uID0gdG9TdHJpbmcuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBGdW5jdGlvbl0nLFxuXHRcdFx0aXNBcmd1bWVudHMgPSBpc0FyZ3Mob2JqZWN0KSxcblx0XHRcdHRoZUtleXMgPSBbXTtcblxuXHRcdGlmICghaXNPYmplY3QgJiYgIWlzRnVuY3Rpb24gJiYgIWlzQXJndW1lbnRzKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0LmtleXMgY2FsbGVkIG9uIGEgbm9uLW9iamVjdFwiKTtcblx0XHR9XG5cblx0XHRpZiAoaXNBcmd1bWVudHMpIHtcblx0XHRcdGZvckVhY2gob2JqZWN0LCBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0dGhlS2V5cy5wdXNoKHZhbHVlKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgbmFtZSxcblx0XHRcdFx0c2tpcFByb3RvID0gaGFzUHJvdG9FbnVtQnVnICYmIGlzRnVuY3Rpb247XG5cblx0XHRcdGZvciAobmFtZSBpbiBvYmplY3QpIHtcblx0XHRcdFx0aWYgKCEoc2tpcFByb3RvICYmIG5hbWUgPT09ICdwcm90b3R5cGUnKSAmJiBoYXMuY2FsbChvYmplY3QsIG5hbWUpKSB7XG5cdFx0XHRcdFx0dGhlS2V5cy5wdXNoKG5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGhhc0RvbnRFbnVtQnVnKSB7XG5cdFx0XHR2YXIgY3RvciA9IG9iamVjdC5jb25zdHJ1Y3Rvcixcblx0XHRcdFx0c2tpcENvbnN0cnVjdG9yID0gY3RvciAmJiBjdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0O1xuXG5cdFx0XHRmb3JFYWNoKGRvbnRFbnVtcywgZnVuY3Rpb24gKGRvbnRFbnVtKSB7XG5cdFx0XHRcdGlmICghKHNraXBDb25zdHJ1Y3RvciAmJiBkb250RW51bSA9PT0gJ2NvbnN0cnVjdG9yJykgJiYgaGFzLmNhbGwob2JqZWN0LCBkb250RW51bSkpIHtcblx0XHRcdFx0XHR0aGVLZXlzLnB1c2goZG9udEVudW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoZUtleXM7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBrZXlzU2hpbTtcbn0oKSk7XG5cbiIsInZhciBnbG9iYWw9dHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9Oy8qXG4gKlxuICogVGhpcyBpcyB1c2VkIHRvIGJ1aWxkIHRoZSBidW5kbGUgd2l0aCBicm93c2VyaWZ5LlxuICpcbiAqIFRoZSBidW5kbGUgaXMgdXNlZCBieSBwZW9wbGUgd2hvIGRvZXNuJ3QgdXNlIGJyb3dzZXJpZnkucmVxdWlyZVxuICogVGhvc2Ugd2hvIHVzZSBicm93c2VyaWZ5IHdpbGwgaW5zdGFsbCB3aXRoIG5wbSBhbmQgcmVxdWlyZSB0aGUgbW9kdWxlLFxuICogdGhlIHBhY2thZ2UuanNvbiBmaWxlIHBvaW50cyB0byBpbmRleC5qcy5cbiAqL1xudmFyIEF1dGgwV2lkZ2V0ID0gcmVxdWlyZSgnLi93aWRnZXQnKTtcbnZhciBpbnNlcnRDc3MgICA9IHJlcXVpcmUoJy4vbGliL2luc2VydC1jc3MnKTtcbnZhciBmcyAgICAgICAgICA9IHJlcXVpcmUoJ2ZzJyk7XG5cbmluc2VydENzcyhcIkBjaGFyc2V0IFxcXCJVVEYtOFxcXCI7I2F1dGgwLXdpZGdldHsvKiFcXG4qIENsZWFuU2xhdGVcXG4qICAgZ2l0aHViLmNvbS9wcmVtYXNhZ2FyL2NsZWFuc2xhdGVcXG4qXFxuKi8vKiFcXG5cXHRab2NpYWwgQnV0b25zXFxuXFx0aHR0cDovL3pvY2lhbC5zbWNsbG5zLmNvbVxcblxcdGJ5IFNhbSBDb2xsaW5zIChAc21jbGxucylcXG5cXHRMaWNlbnNlOiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXFxuXFx0XFxuXFx0WW91IGFyZSBmcmVlIHRvIHVzZSBhbmQgbW9kaWZ5LCBhcyBsb25nIGFzIHlvdSBrZWVwIHRoaXMgbGljZW5zZSBjb21tZW50IGludGFjdCBvciBsaW5rIGJhY2sgdG8gem9jaWFsLnNtY2xsbnMuY29tIG9uIHlvdXIgc2l0ZS5cXG4qLy8qISBub3JtYWxpemUuY3NzIHYxLjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0LmlvL25vcm1hbGl6ZSAqL30jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoMiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGgzLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoNSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGR0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb3JtLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VsZWN0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb3B0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcHJlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGl2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGFibGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0aCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRib2R5LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGZvb3QsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjYXB0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGhlYWQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxpLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYWRkcmVzcywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJsb2NrcXVvdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGZpZWxkc2V0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbGksI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpZnJhbWUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzdHJvbmcsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsZWdlbmQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBlbSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHMsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjaXRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc3BhbiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc3VwLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbGFiZWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkZm4sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvYmplY3QsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBiaWcsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBxLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZm9udCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNhbXAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhY3JvbnltLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc21hbGwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbWcsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzdHJpa2UsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjb2RlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc3ViLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5zLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGV4dGFyZWEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB2YXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYWJiciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFwcGxldCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRlbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGtiZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHR0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGksI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBociwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFydGljbGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhc2lkZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRpYWxvZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGZpZ3VyZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGZvb3RlciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGhlYWRlciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGhncm91cCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBuYXYsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzZWN0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGltZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1hcmssI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhdWRpbywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHZpZGVve2JhY2tncm91bmQtYXR0YWNobWVudDpzY3JvbGwhaW1wb3J0YW50O2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQhaW1wb3J0YW50O2JhY2tncm91bmQtaW1hZ2U6bm9uZSFpbXBvcnRhbnQ7YmFja2dyb3VuZC1wb3NpdGlvbjowIDAhaW1wb3J0YW50O2JhY2tncm91bmQtcmVwZWF0OnJlcGVhdCFpbXBvcnRhbnQ7Ym9yZGVyLWNvbG9yOmJsYWNrIWltcG9ydGFudDtib3JkZXItY29sb3I6Y3VycmVudENvbG9yIWltcG9ydGFudDtib3JkZXItcmFkaXVzOjAhaW1wb3J0YW50O2JvcmRlci1zdHlsZTpub25lIWltcG9ydGFudDtib3JkZXItd2lkdGg6bWVkaXVtIWltcG9ydGFudDtib3R0b206YXV0byFpbXBvcnRhbnQ7Y2xlYXI6bm9uZSFpbXBvcnRhbnQ7Y2xpcDphdXRvIWltcG9ydGFudDtjb2xvcjppbmhlcml0IWltcG9ydGFudDtjb3VudGVyLWluY3JlbWVudDpub25lIWltcG9ydGFudDtjb3VudGVyLXJlc2V0Om5vbmUhaW1wb3J0YW50O2N1cnNvcjphdXRvIWltcG9ydGFudDtkaXJlY3Rpb246aW5oZXJpdCFpbXBvcnRhbnQ7ZGlzcGxheTppbmxpbmUhaW1wb3J0YW50O2Zsb2F0Om5vbmUhaW1wb3J0YW50O2ZvbnQtZmFtaWx5OmluaGVyaXQhaW1wb3J0YW50O2ZvbnQtc2l6ZTppbmhlcml0IWltcG9ydGFudDtmb250LXN0eWxlOmluaGVyaXQhaW1wb3J0YW50O2ZvbnQtdmFyaWFudDpub3JtYWwhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0OmluaGVyaXQhaW1wb3J0YW50O2hlaWdodDphdXRvIWltcG9ydGFudDtsZWZ0OmF1dG8haW1wb3J0YW50O2xldHRlci1zcGFjaW5nOm5vcm1hbCFpbXBvcnRhbnQ7bGluZS1oZWlnaHQ6aW5oZXJpdCFpbXBvcnRhbnQ7bGlzdC1zdHlsZS10eXBlOmluaGVyaXQhaW1wb3J0YW50O2xpc3Qtc3R5bGUtcG9zaXRpb246b3V0c2lkZSFpbXBvcnRhbnQ7bGlzdC1zdHlsZS1pbWFnZTpub25lIWltcG9ydGFudDttYXJnaW46MCFpbXBvcnRhbnQ7bWF4LWhlaWdodDpub25lIWltcG9ydGFudDttYXgtd2lkdGg6bm9uZSFpbXBvcnRhbnQ7bWluLWhlaWdodDowIWltcG9ydGFudDttaW4td2lkdGg6MCFpbXBvcnRhbnQ7b3BhY2l0eToxO291dGxpbmU6aW52ZXJ0IG5vbmUgbWVkaXVtIWltcG9ydGFudDtvdmVyZmxvdzp2aXNpYmxlIWltcG9ydGFudDtwYWRkaW5nOjAhaW1wb3J0YW50O3Bvc2l0aW9uOnN0YXRpYyFpbXBvcnRhbnQ7cXVvdGVzOlxcXCJcXFwiIFxcXCJcXFwiIWltcG9ydGFudDtyaWdodDphdXRvIWltcG9ydGFudDt0YWJsZS1sYXlvdXQ6YXV0byFpbXBvcnRhbnQ7dGV4dC1hbGlnbjppbmhlcml0IWltcG9ydGFudDt0ZXh0LWRlY29yYXRpb246aW5oZXJpdCFpbXBvcnRhbnQ7dGV4dC1pbmRlbnQ6MCFpbXBvcnRhbnQ7dGV4dC10cmFuc2Zvcm06bm9uZSFpbXBvcnRhbnQ7dG9wOmF1dG8haW1wb3J0YW50O3VuaWNvZGUtYmlkaTpub3JtYWwhaW1wb3J0YW50O3ZlcnRpY2FsLWFsaWduOmJhc2VsaW5lIWltcG9ydGFudDt2aXNpYmlsaXR5OmluaGVyaXQhaW1wb3J0YW50O3doaXRlLXNwYWNlOm5vcm1hbCFpbXBvcnRhbnQ7d2lkdGg6YXV0byFpbXBvcnRhbnQ7d29yZC1zcGFjaW5nOm5vcm1hbCFpbXBvcnRhbnQ7ei1pbmRleDphdXRvIWltcG9ydGFudDstbW96LWJvcmRlci1yYWRpdXM6MCFpbXBvcnRhbnQ7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjAhaW1wb3J0YW50Oy1tb3otYm94LXNpemluZzpjb250ZW50LWJveCFpbXBvcnRhbnQ7LXdlYmtpdC1ib3gtc2l6aW5nOmNvbnRlbnQtYm94IWltcG9ydGFudDtib3gtc2l6aW5nOmNvbnRlbnQtYm94IWltcG9ydGFudDt0ZXh0LXNoYWRvdzpub25lIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDMsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoNSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoMSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZHQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoNiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZm9ybSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlbGVjdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9wdGlvbiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHByZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRpdiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGgyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgY2FwdGlvbiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhZGRyZXNzLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYmxvY2txdW90ZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZmllbGRzZXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ZXh0YXJlYSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGhyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXJ0aWNsZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFzaWRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGlhbG9nLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZmlndXJlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZm9vdGVyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaGVhZGVyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaGdyb3VwLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG5hdiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlY3Rpb257ZGlzcGxheTpibG9jayFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0YWJsZXtkaXNwbGF5OnRhYmxlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRoZWFke2Rpc3BsYXk6dGFibGUtaGVhZGVyLWdyb3VwIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRib2R5e2Rpc3BsYXk6dGFibGUtcm93LWdyb3VwIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRmb290e2Rpc3BsYXk6dGFibGUtZm9vdGVyLWdyb3VwIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRye2Rpc3BsYXk6dGFibGUtcm93IWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRoLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGR7ZGlzcGxheTp0YWJsZS1jZWxsIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG5hdiB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG5hdiBvbHtsaXN0LXN0eWxlLXR5cGU6bm9uZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnV7bGlzdC1zdHlsZS10eXBlOmRpc2MhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2x7bGlzdC1zdHlsZS10eXBlOmRlY2ltYWwhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgbWVudXtsaXN0LXN0eWxlLXR5cGU6Y2lyY2xlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG9sIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgdWwgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCBtZW51IHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgb2wgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIHVsIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCBtZW51IG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBvbCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIHVsIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgbWVudSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIG9sIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCB1bCBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgbWVudSBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSBvbCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgdWwgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IG1lbnUgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IG9sIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IHVsIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IG1lbnUgbWVudXtsaXN0LXN0eWxlLXR5cGU6c3F1YXJlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxpe2Rpc3BsYXk6bGlzdC1pdGVtIWltcG9ydGFudDttaW4taGVpZ2h0OmF1dG8haW1wb3J0YW50O21pbi13aWR0aDphdXRvIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHN0cm9uZ3tmb250LXdlaWdodDpib2xkIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGVte2ZvbnQtc3R5bGU6aXRhbGljIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGtiZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNhbXAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjb2Rle2ZvbnQtZmFtaWx5Om1vbm9zcGFjZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYSAqLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXRbdHlwZT1zdWJtaXRdLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXRbdHlwZT1yYWRpb10sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPWNoZWNrYm94XSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlbGVjdHtjdXJzb3I6cG9pbnRlciFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYnV0dG9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXRbdHlwZT1zdWJtaXRde3RleHQtYWxpZ246Y2VudGVyIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0W3R5cGU9aGlkZGVuXXtkaXNwbGF5Om5vbmUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYWJiclt0aXRsZV0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhY3JvbnltW3RpdGxlXSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRmblt0aXRsZV17Y3Vyc29yOmhlbHAhaW1wb3J0YW50O2JvcmRlci1ib3R0b20td2lkdGg6MXB4IWltcG9ydGFudDtib3JkZXItYm90dG9tLXN0eWxlOmRvdHRlZCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnN7YmFja2dyb3VuZC1jb2xvcjojZmY5IWltcG9ydGFudDtjb2xvcjpibGFjayFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkZWx7dGV4dC1kZWNvcmF0aW9uOmxpbmUtdGhyb3VnaCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBibG9ja3F1b3RlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcXtxdW90ZXM6bm9uZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBibG9ja3F1b3RlOmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJsb2NrcXVvdGU6YWZ0ZXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBxOmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHE6YWZ0ZXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsaTpiZWZvcmUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsaTphZnRlcntjb250ZW50OlxcXCJcXFwiIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VsZWN0e3ZlcnRpY2FsLWFsaWduOm1pZGRsZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzZWxlY3QsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ZXh0YXJlYSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0e2JvcmRlcjoxcHggc29saWQgI2NjYyFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0YWJsZXtib3JkZXItY29sbGFwc2U6Y29sbGFwc2UhaW1wb3J0YW50O2JvcmRlci1zcGFjaW5nOjAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaHJ7ZGlzcGxheTpibG9jayFpbXBvcnRhbnQ7aGVpZ2h0OjFweCFpbXBvcnRhbnQ7Ym9yZGVyOjAhaW1wb3J0YW50O2JvcmRlci10b3A6MXB4IHNvbGlkICNjY2MhaW1wb3J0YW50O21hcmdpbjoxZW0gMCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSAqW2Rpcj1ydGxde2RpcmVjdGlvbjpydGwhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWFya3tiYWNrZ3JvdW5kLWNvbG9yOiNmZjkhaW1wb3J0YW50O2NvbG9yOmJsYWNrIWltcG9ydGFudDtmb250LXN0eWxlOml0YWxpYyFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6Ym9sZCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZXtmb250LXNpemU6bWVkaXVtIWltcG9ydGFudDtsaW5lLWhlaWdodDoxIWltcG9ydGFudDtkaXJlY3Rpb246bHRyIWltcG9ydGFudDt0ZXh0LWFsaWduOmxlZnQhaW1wb3J0YW50O2ZvbnQtZmFtaWx5OlxcXCJUaW1lcyBOZXcgUm9tYW5cXFwiLFRpbWVzLHNlcmlmIWltcG9ydGFudDtjb2xvcjpibGFjayFpbXBvcnRhbnQ7Zm9udC1zdHlsZTpub3JtYWwhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0Om5vcm1hbCFpbXBvcnRhbnQ7dGV4dC1kZWNvcmF0aW9uOm5vbmUhaW1wb3J0YW50O2xpc3Qtc3R5bGUtdHlwZTpkaXNjIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC50aGVtZS1zdGF0aWMgLnBvcHVwIC5vdmVybGF5e2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwwKTtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50fSNhdXRoMC13aWRnZXQgLnRoZW1lLXN0YXRpYyAucG9wdXAgLnBhbmVse2JhY2tncm91bmQ6MDstd2Via2l0LWJveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTQsNDEsNTcsMC4xMiksMCAycHggNXB4IHJnYmEoMTQsNDEsNTcsMC40NCksaW5zZXQgMCAtMXB4IDJweCByZ2JhKDE0LDQxLDU3LDAuMTUpOy1tb3otYm94LXNoYWRvdzowIDAgMCAxcHggcmdiYSgxNCw0MSw1NywwLjEyKSwwIDJweCA1cHggcmdiYSgxNCw0MSw1NywwLjQ0KSxpbnNldCAwIC0xcHggMnB4IHJnYmEoMTQsNDEsNTcsMC4xNSk7LW1zLWJveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTQsNDEsNTcsMC4xMiksMCAycHggNXB4IHJnYmEoMTQsNDEsNTcsMC40NCksaW5zZXQgMCAtMXB4IDJweCByZ2JhKDE0LDQxLDU3LDAuMTUpOy1vLWJveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTQsNDEsNTcsMC4xMiksMCAycHggNXB4IHJnYmEoMTQsNDEsNTcsMC40NCksaW5zZXQgMCAtMXB4IDJweCByZ2JhKDE0LDQxLDU3LDAuMTUpO2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTQsNDEsNTcsMC4xMiksMCAycHggNXB4IHJnYmEoMTQsNDEsNTcsMC40NCksaW5zZXQgMCAtMXB4IDJweCByZ2JhKDE0LDQxLDU3LDAuMTUpO2JhY2tncm91bmQ6I2ZmZn0jYXV0aDAtd2lkZ2V0IC50aGVtZS1zdGF0aWMgLnBvcHVwIC5wYW5lbDphZnRlcntkaXNwbGF5Om5vbmV9QC1tb3ota2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjB9MTAwJXtvcGFjaXR5OjF9fUAtd2Via2l0LWtleWZyYW1lcyBzaG93UGFuZWx7MCV7b3BhY2l0eTowfTEwMCV7b3BhY2l0eToxfX1ALW8ta2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjB9MTAwJXtvcGFjaXR5OjF9fUAtbXMta2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjB9MTAwJXtvcGFjaXR5OjF9fUBrZXlmcmFtZXMgc2hvd1BhbmVsezAle29wYWNpdHk6MH0xMDAle29wYWNpdHk6MX19QC1tb3ota2V5ZnJhbWVzIGhpZGVQYW5lbHswJXtvcGFjaXR5OjF9MTAwJXtvcGFjaXR5OjB9fUAtd2Via2l0LWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7b3BhY2l0eToxfTEwMCV7b3BhY2l0eTowfX1ALW8ta2V5ZnJhbWVzIGhpZGVQYW5lbHswJXtvcGFjaXR5OjF9MTAwJXtvcGFjaXR5OjB9fUAtbXMta2V5ZnJhbWVzIGhpZGVQYW5lbHswJXtvcGFjaXR5OjF9MTAwJXtvcGFjaXR5OjB9fUBrZXlmcmFtZXMgaGlkZVBhbmVsezAle29wYWNpdHk6MX0xMDAle29wYWNpdHk6MH19I2F1dGgwLXdpZGdldCAudGhlbWUtc3RhdGljIC5zZXBhcmF0b3Igc3BhbntiYWNrZ3JvdW5kOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLCNhdXRoMC13aWRnZXQgYS56b2NpYWx7Ym9yZGVyOjFweCBzb2xpZCAjNzc3O2JvcmRlci1jb2xvcjpyZ2JhKDAsMCwwLDAuMik7Ym9yZGVyLWJvdHRvbS1jb2xvcjojMzMzO2JvcmRlci1ib3R0b20tY29sb3I6cmdiYSgwLDAsMCwwLjQpO2NvbG9yOiNmZmY7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTtib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpO2N1cnNvcjpwb2ludGVyO2Rpc3BsYXk6aW5saW5lLWJsb2NrO2ZvbnQ6Ym9sZCAxMDAlLzIuMSBcXFwiTHVjaWRhIEdyYW5kZVxcXCIsVGFob21hLHNhbnMtc2VyaWY7cGFkZGluZzowIC45NWVtIDAgMDt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LWRlY29yYXRpb246bm9uZTt0ZXh0LXNoYWRvdzowIDFweCAwIHJnYmEoMCwwLDAsMC41KTt3aGl0ZS1zcGFjZTpub3dyYXA7LW1vei11c2VyLXNlbGVjdDpub25lOy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lO3Bvc2l0aW9uOnJlbGF0aXZlOy1tb3otYm9yZGVyLXJhZGl1czouM2VtOy13ZWJraXQtYm9yZGVyLXJhZGl1czouM2VtO2JvcmRlci1yYWRpdXM6LjNlbX0jYXV0aDAtd2lkZ2V0IC56b2NpYWw6YmVmb3Jle2NvbnRlbnQ6XFxcIlxcXCI7Ym9yZGVyLXJpZ2h0Oi4wNzVlbSBzb2xpZCByZ2JhKDAsMCwwLDAuMSk7ZmxvYXQ6bGVmdDtmb250OjEyMCUvMS42NSB6b2NpYWw7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO21hcmdpbjowIC41ZW0gMCAwO3BhZGRpbmc6MCAuNWVtO3RleHQtYWxpZ246Y2VudGVyO3RleHQtZGVjb3JhdGlvbjpub25lO3RleHQtdHJhbnNmb3JtOm5vbmU7LW1vei1ib3gtc2hhZG93Oi4wNzVlbSAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjI1KTstd2Via2l0LWJveC1zaGFkb3c6LjA3NWVtIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDAuMjUpO2JveC1zaGFkb3c6LjA3NWVtIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDAuMjUpOy1tb3otZm9udC1zbW9vdGhpbmc6YW50aWFsaWFzZWQ7LXdlYmtpdC1mb250LXNtb290aGluZzphbnRpYWxpYXNlZDtmb250LXNtb290aGluZzphbnRpYWxpYXNlZH0jYXV0aDAtd2lkZ2V0IC56b2NpYWw6YWN0aXZle291dGxpbmU6MH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuaWNvbntvdmVyZmxvdzpoaWRkZW47bWF4LXdpZHRoOjIuNGVtO3BhZGRpbmctbGVmdDowO3BhZGRpbmctcmlnaHQ6MDttYXgtaGVpZ2h0OjIuMTVlbTt3aGl0ZS1zcGFjZTpub3dyYXB9I2F1dGgwLXdpZGdldCAuem9jaWFsLmljb246YmVmb3Jle3BhZGRpbmc6MDt3aWR0aDoyZW07aGVpZ2h0OjJlbTtib3gtc2hhZG93Om5vbmU7Ym9yZGVyOjB9I2F1dGgwLXdpZGdldCAuem9jaWFse2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMC4wNSkgNDklLHJnYmEoMCwwLDAsMC4wNSkgNTElLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1ncmFkaWVudChsaW5lYXIsbGVmdCB0b3AsbGVmdCBib3R0b20sZnJvbShyZ2JhKDI1NSwyNTUsMjU1LDAuMSkpLGNvbG9yLXN0b3AoNDklLHJnYmEoMjU1LDI1NSwyNTUsMC4wNSkpLGNvbG9yLXN0b3AoNTElLHJnYmEoMCwwLDAsMC4wNSkpLHRvKHJnYmEoMCwwLDAsMC4xKSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMC4wNSkgNDklLHJnYmEoMCwwLDAsMC4wNSkgNTElLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMC4wNSkgNDklLHJnYmEoMCwwLDAsMC4wNSkgNTElLHJnYmEoMCwwLDAsMC4xKSl9I2F1dGgwLXdpZGdldCAuem9jaWFsOmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbDpmb2N1c3tiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkgNDklLHJnYmEoMCwwLDAsMC4xKSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkgNDklLHJnYmEoMCwwLDAsMC4xKSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTotby1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjE1KSA0OSUscmdiYSgwLDAsMCwwLjEpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwLjE1KSksY29sb3Itc3RvcCg0OSUscmdiYSgyNTUsMjU1LDI1NSwwLjE1KSksY29sb3Itc3RvcCg1MSUscmdiYSgwLDAsMCwwLjEpKSx0byhyZ2JhKDAsMCwwLDAuMTUpKSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkgNDklLHJnYmEoMCwwLDAsMC4xKSA1MSUscmdiYSgwLDAsMCwwLjE1KSl9I2F1dGgwLXdpZGdldCAuem9jaWFsOmFjdGl2ZXtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsdHJhbnNwYXJlbnQgNTAlLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsdHJhbnNwYXJlbnQgNTAlLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotby1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSx0cmFuc3BhcmVudCA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwLjEpKSxjb2xvci1zdG9wKDMwJSxyZ2JhKDI1NSwyNTUsMjU1LDApKSxjb2xvci1zdG9wKDUwJSx0cmFuc3BhcmVudCksdG8ocmdiYSgwLDAsMCwwLjEpKSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsdHJhbnNwYXJlbnQgNTAlLHJnYmEoMCwwLDAsMC4xKSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3gsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdpdGh1YiwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ21haWwsI2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZCwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5LCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zdGFja292ZXJmbG93LCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNle2JvcmRlcjoxcHggc29saWQgI2FhYTtib3JkZXItY29sb3I6cmdiYSgwLDAsMCwwLjMpO2JvcmRlci1ib3R0b20tY29sb3I6Izc3Nztib3JkZXItYm90dG9tLWNvbG9yOnJnYmEoMCwwLDAsMC41KTstbW96LWJveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC43KSxpbnNldCAwIDAgLjA4ZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjUpOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjcpLGluc2V0IDAgMCAuMDhlbSByZ2JhKDI1NSwyNTUsMjU1LDAuNSk7Ym94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjcpLGluc2V0IDAgMCAuMDhlbSByZ2JhKDI1NSwyNTUsMjU1LDAuNSk7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuOCl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3g6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3g6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdpdGh1Yjpmb2N1cywjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ2l0aHViOmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5nbWFpbDpmb2N1cywjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ21haWw6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZDpmb2N1cywjYXV0aDAtd2lkZ2V0IC56b2NpYWwub3BlbmlkOmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnk6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeTpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc3RhY2tvdmVyZmxvdzpmb2N1cywjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc3RhY2tvdmVyZmxvdzpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwudHdpdHRlcjpmb2N1cyAuem9jaWFsLnR3aXR0ZXI6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNhbGVzZm9yY2U6Zm9jdXMgLnpvY2lhbC5zYWxlc2ZvcmNlOmhvdmVye2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1ncmFkaWVudChsaW5lYXIsbGVmdCB0b3AsbGVmdCBib3R0b20sZnJvbShyZ2JhKDI1NSwyNTUsMjU1LDAuNSkpLGNvbG9yLXN0b3AoNDklLHJnYmEoMjU1LDI1NSwyNTUsMC4yKSksY29sb3Itc3RvcCg1MSUscmdiYSgwLDAsMCwwLjA1KSksdG8ocmdiYSgwLDAsMCwwLjE1KSkpO2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQodG9wLHJnYmEoMjU1LDI1NSwyNTUsMC41KSxyZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDklLHJnYmEoMCwwLDAsMC4wNSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLHJnYmEoMjU1LDI1NSwyNTUsMC41KSxyZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDklLHJnYmEoMCwwLDAsMC4wNSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQodG9wLHJnYmEoMjU1LDI1NSwyNTUsMC41KSxyZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDklLHJnYmEoMCwwLDAsMC4wNSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZHJvcGJveDphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdpdGh1YjphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsOmFjdGl2ZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwub3BlbmlkOmFjdGl2ZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5OmFjdGl2ZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc3RhY2tvdmVyZmxvdzphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLndpa2lwZWRpYTphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNhbGVzZm9yY2U6YWN0aXZle2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1ncmFkaWVudChsaW5lYXIsbGVmdCB0b3AsbGVmdCBib3R0b20sZnJvbShyZ2JhKDI1NSwyNTUsMjU1LDApKSxjb2xvci1zdG9wKDMwJSxyZ2JhKDI1NSwyNTUsMjU1LDApKSxjb2xvci1zdG9wKDUwJSxyZ2JhKDAsMCwwLDApKSx0byhyZ2JhKDAsMCwwLDAuMSkpKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDApLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHJnYmEoMCwwLDAsMCkgNTAlLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDApLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHJnYmEoMCwwLDAsMCkgNTAlLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDApLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHJnYmEoMCwwLDAsMCkgNTAlLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMCkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUscmdiYSgwLDAsMCwwKSA1MCUscmdiYSgwLDAsMCwwLjEpKX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYW1hem9uOmJlZm9yZXtjb250ZW50OlxcXCJhXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZHJvcGJveDpiZWZvcmV7Y29udGVudDpcXFwiZFxcXCI7Y29sb3I6IzFmNzVjY30jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZmFjZWJvb2s6YmVmb3Jle2NvbnRlbnQ6XFxcImZcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWI6YmVmb3Jle2NvbnRlbnQ6XFxcIlxcXFwwMEU4XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ21haWw6YmVmb3Jle2NvbnRlbnQ6XFxcIm1cXFwiO2NvbG9yOiNmMDB9I2F1dGgwLXdpZGdldCAuem9jaWFsLmdvb2dsZTpiZWZvcmV7Y29udGVudDpcXFwiR1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmdvb2dsZXBsdXM6YmVmb3Jle2NvbnRlbnQ6XFxcIitcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5ndWVzdDpiZWZvcmV7Y29udGVudDpcXFwiP1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmllOmJlZm9yZXtjb250ZW50OlxcXCI2XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwubGlua2VkaW46YmVmb3Jle2NvbnRlbnQ6XFxcIkxcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5vcGVuaWQ6YmVmb3Jle2NvbnRlbnQ6XFxcIm9cXFwiO2NvbG9yOiNmZjkyMWR9I2F1dGgwLXdpZGdldCAuem9jaWFsLnBheXBhbDpiZWZvcmV7Y29udGVudDpcXFwiJFxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3c6YmVmb3Jle2NvbnRlbnQ6XFxcIlxcXFwwMEVDXFxcIjtjb2xvcjojZmY3YTE1fSNhdXRoMC13aWRnZXQgLnpvY2lhbC50d2l0dGVyOmJlZm9yZXtjb250ZW50OlxcXCJUXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudms6YmVmb3Jle2NvbnRlbnQ6XFxcIk5cXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC53aW5kb3dzOmJlZm9yZXtjb250ZW50OlxcXCJXXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwueWFob286YmVmb3Jle2NvbnRlbnQ6XFxcIllcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5vZmZpY2UzNjU6YmVmb3Jle2NvbnRlbnQ6XFxcInpcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC50aGlydHlzZXZlbnNpZ25hbHM6YmVmb3Jle2NvbnRlbnQ6XFxcImJcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmJlZm9yZXtjb250ZW50OlxcXCIqXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2FhZDpiZWZvcmV7Y29udGVudDpcXFwielxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmJveDpiZWZvcmV7Y29udGVudDpcXFwieFxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmFtYXpvbntiYWNrZ3JvdW5kLWNvbG9yOiNmZmFkMWQ7Y29sb3I6IzAzMDAzNzt0ZXh0LXNoYWRvdzowIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsMC41KX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZHJvcGJveHtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Y29sb3I6IzMxMmMyYX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZmFjZWJvb2t7YmFja2dyb3VuZC1jb2xvcjojNDg2M2FlfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWJ7YmFja2dyb3VuZC1jb2xvcjojZmJmYmZiO2NvbG9yOiMwNTA1MDV9I2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlse2JhY2tncm91bmQtY29sb3I6I2VmZWZlZjtjb2xvcjojMjIyfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nb29nbGV7YmFja2dyb3VuZC1jb2xvcjojNGU2Y2Y3fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nb29nbGVwbHVze2JhY2tncm91bmQtY29sb3I6I2RkNGIzOX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ3Vlc3R7YmFja2dyb3VuZC1jb2xvcjojMWI0ZDZkfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5pZXtiYWNrZ3JvdW5kLWNvbG9yOiMwMGExZDl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmxpbmtlZGlue2JhY2tncm91bmQtY29sb3I6IzAwODNhOH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwub3Blbmlke2JhY2tncm91bmQtY29sb3I6I2Y1ZjVmNTtjb2xvcjojMzMzfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wYXlwYWx7YmFja2dyb3VuZC1jb2xvcjojZmZmO2NvbG9yOiMzMjY4OWE7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuNSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLnR3aXR0ZXJ7YmFja2dyb3VuZC1jb2xvcjojNDZjMGZifSNhdXRoMC13aWRnZXQgLnpvY2lhbC52a3tiYWNrZ3JvdW5kLWNvbG9yOiM0NTY4OGV9I2F1dGgwLXdpZGdldCAuem9jaWFsLndpbmRvd3N7YmFja2dyb3VuZC1jb2xvcjojMDA1MmE0O2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9mZmljZTM2NXtiYWNrZ3JvdW5kLWNvbG9yOiMwMGFjZWQ7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2FhZHtiYWNrZ3JvdW5kLWNvbG9yOiMwMGFkZWY7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudGhpcnR5c2V2ZW5zaWduYWxze2JhY2tncm91bmQtY29sb3I6IzZhYzA3MTtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5ib3h7YmFja2dyb3VuZC1jb2xvcjojMjY3YmI2O2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnNhbGVzZm9yY2V7YmFja2dyb3VuZC1jb2xvcjojZmZmO2NvbG9yOiNmMDB9I2F1dGgwLXdpZGdldCAuem9jaWFsLndpbmRvd3N7YmFja2dyb3VuZC1jb2xvcjojMjY3MmVjO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnksI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeXttYXJnaW46LjFlbSAwO3BhZGRpbmc6MCAxZW19I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnk6YmVmb3JlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnk6YmVmb3Jle2Rpc3BsYXk6bm9uZX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeXtiYWNrZ3JvdW5kLWNvbG9yOiMzMzN9I2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeXtiYWNrZ3JvdW5kLWNvbG9yOiNmMGYwZWI7Y29sb3I6IzIyMjt0ZXh0LXNoYWRvdzowIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsMC44KX0jYXV0aDAtd2lkZ2V0IGJ1dHRvbjotbW96LWZvY3VzLWlubmVye2JvcmRlcjowO3BhZGRpbmc6MH1AZm9udC1mYWNle2ZvbnQtZmFtaWx5Oid6b2NpYWwnO3NyYzp1cmwoJ2h0dHBzOi8vZDE5cDR6ZW1jeWNtN2EuY2xvdWRmcm9udC5uZXQvdzIvZm9udC96b2NpYWwtcmVndWxhci13ZWJmb250LmVvdCcpfUBmb250LWZhY2V7Zm9udC1mYW1pbHk6J3pvY2lhbCc7c3JjOnVybChkYXRhOmFwcGxpY2F0aW9uL2ZvbnQtd29mZjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxkMDlHUmdBQkFBQUFBQmVRQUEwQUFBQUFJR2dBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQkdSbFJOQUFBQk1BQUFBQm9BQUFBY1pudUF5a2RFUlVZQUFBRk1BQUFBSHdBQUFDQUFUZ0FHVDFNdk1nQUFBV3dBQUFCSUFBQUFWay9sM0VCamJXRndBQUFCdEFBQUFQWUFBQUlLbmw1NjdHZGhjM0FBQUFLc0FBQUFDQUFBQUFqLy93QURaMng1WmdBQUFyUUFBQktMQUFBWnNBTXBKckJvWldGa0FBQVZRQUFBQURBQUFBQTIvM0pTV1dob1pXRUFBQlZ3QUFBQUlBQUFBQ1FGZlFINWFHMTBlQUFBRlpBQUFBQmpBQUFBZ0R0T0FiZHNiMk5oQUFBVjlBQUFBRVFBQUFCRVdaWmYrRzFoZUhBQUFCWTRBQUFBSGdBQUFDQUFjQUMrYm1GdFpRQUFGbGdBQUFEZUFBQUJobGJEOS9Kd2IzTjBBQUFYT0FBQUFGWUFBQUJzVWVtaGhIaWNZMkJnWUdRQWdwT2QrWVlnK2x3bHh4a1lEUUJBK1FZcUFBQjRuR05nWkdCZzRBTmlDUVlRWUdKZ1pHQm1VQUNTTEdBZUF3QUZ4QUJWQUhpY1kyQmtFbU9jd01ES3dNSG93NWpHd01EZ0RxVy9Na2d5dERBd01ER3dNalBBQUxNQUF3SUVwTG1tTURnd0tINWdZSHp3L3dHREh1TnJCdlVHQmdaR2tCd0FqNllMU0hpY3RaQzlMa1JSRklXL082N3h6eDJHWVF3ekVsSE1OQk12b0JLTnFJUW9pVkJLSkJMeE1sU2ltbkpvS0dpOGd4ZVFVQ2gxeTdvL2padXJ0Sk8xOTE3bjdIV3kxd0VHU05FZ2NDWUl6WUtFaDd5N3J0TnlOKzF1bFRVNmRObGdreTIyMldHWGZRNDQ0cGhUempqbmdrdXVyUHI4UW9wZlk4V2FkazZ6WjgyaE5TZkZHbjNyVFI5NjFZdWU5YVJIUGVoZWZaLzNqRnYxZEtjYlhhdWpkcFJ1MnFVNFdobnlVYmUzcGoxRjFLaFF0ZWN5cWZuWWY4bXBsRlBFbC9WR00yVFp6V0E1UGxyOFBUR1U1R0ZHNGpMS1dFTEhtWmhrS3B1SWF2N0VTalZqczhscVN6RFBRdEh1TThiY0g3NytKWDRBNi9ZN053QUFBQUFBQWYvL0FBSjRuSjFZZVl3a1YzMnUzM3RWNzlWOUgzMTNUL2YwTWRNelBkTm56ZUdaMldOMnZZZnRYWGJYRjJ2dnJ0YzJ1dzdHRGtaQURBUkkyQkNoaUZoMmhMMUJjc0FLaWNMaGtFZ0pSSkV3UkVGS0xNY1JvQkFuVWtLd0VzRmk1QUFTT0lxVHpPVDNxbWNka3Y5STEvVDBPNnBldlhydiszM2Y5eXNKSkduMzIwU0NiMHRFa2p5WUlkSU9WbllrOFpHeDc3dndBN2dtV1ZKRjZrakxralFPaG9NSzRUWjBnVGVTWVRvY1ROSkpPOTVyQ0VSRDBzTnlzZ25wYURKdTNQdHlmcm50cU01YnRzL1ZyZ3l2MU00ZHV0KzFaMTNkZWN1aHUyY2Vldjk4dkErNG5IUDN6ZWE2Q2xtdnd2TkJhNzE5K09UVjlLbVRodzUxVy8xREo1OEM2eHh4L1BkQm93QXlTR1IzZC9jYXp2ZDdVazNheEJtUEpsdkFvakNwMENoa2pYcXJ6ZVBFSnFKQVcrTmtOQmtPNGlSdHRRZWJJRXBCakdjNU1CbVBXdTJXYTkxZit5V25VUFliU1dWL05GZGVWR0pQdFNKNkJsNXFSUGt0dTlycncwS1paeTJ1ZFN4M2RPMTJlQWhydVdiLzNGQ3hvNklUNTVMZ3JPc0NrejBUTGpDYUJKSHYzSkZUVGVaYU81OWtGRS8yWnVkWGpnVVZTY1o1ZjRlY2grOUtiZWtHNmJCMEN0ZHlORm1IMW5pVWlubG5GZDZvUUJUaVlrWmhuSWhpMXBPR01TN3plTlR1c1hhcjBXSnBCWWJ4cEVlWU1oNk9oOUV3YWtTTjhkbjl4VWhWOVBIMm1ja25aZ2U1NG1KZ2xPeHE3c3lSN1hPck55eHVwQlJrbFZ1cUw0ZkIwcUU2RzFRcnMvcHdZeFptTHVVdlhjcHZMeHdPYzQ0REI1ZVhEaGUwWVcxcDF2WXRyYUxIdlVadmV6anZ6ZllYbXpwWGRKMFppa2taOVA5emJnM1NONjJReVVoY2Z1bVNCQklnVm40Vi9oaHhJcVdqRlBkZlBOTUFGNXhuRDhXNExUZnFyQXU0TmRreEJtYnU3M2IyM2JHdk16bmFKQXIxYTBFTFFJSE53a2xGa3kwdE9HWEVDMGU5Mm1CaFkyTmhVQXZ1U3BkVVJWVXRWVmJBc3pXVHFtcERvb2pSYS9BczR1RWg2ZjNTUndRaVVvVGtPb2dWMjRDOVNwekV5UUNoR1UrUE42YURVOFNKaXJOam0rQ2lzeTUxbExCQ3BwZFBwem1xUjZFRGpEZnEyYng3MEc2bDQzVFU1d0oySVQ0UFo4cGtHQ2VqZGdPTHFxeHB6ckpxTU82elNLK0VJYldOWXREM0lxYklsS2cyZDZ4Y0dLWnRQV2VxbGswQWdCQ2dpdmpJV0pKbGgzcGxMd2dYM1NMUlpjV21wck8vYVhJMW9JU2VBd2JLc205U21ESE1KS2dTaDZ0d0xOUTVWUXpWTUN1V1ppZ1VWRFVoakxOUzZVU3ZFdHQzek1kRmw1UENmRkkwOEY1VVZxbXNVMUZTR05jVVl1ZmJSYnk5UGdTb0Z5MFRVZUl5eHo4ZmVZZmhMcUNHYmN3ckRKNGtvSFpCTjVBVHFNQXhITTl3dlBuL1JuRzJhb2hqWE9jMGE0TnM4YUx3WjRBeFhhZzNCSkJKMmJOQkdWWkl4Yk4vUmh6bmNvampRbHhXdGJrVktFUmxWVHpmZisyK1FsejREbktlSjgxTEVoRWNNb1VNenBwNlEyOGR4Z0xmdzBFWmhnZ1NuSGpVMzRCR0hOTFpjc24zUEw4TXBkSWpXMitYMVhLOCtzaVI5UVBOdHdNOFBweHh2V0xlOVhiZUM3ZnRmT2JMdnU3bGJ2N2lWMis2WlFWZzJmMHNSczkvU0czeU5uaE1laEluTVVXd2dHeTZoc0dPN0lhd3JUQUU4MGlzRm1sdndqcXQwamhCQk9LeUNTUWl3RGZwZUxJbFoxZUt0UjVVSUp1M2pYeE5rekFiSTNzT2dXU2NkUVBCVEVXdmFNQXhzU29qS0JET0NrY2dJUmNxQnFOYzRSQ1dnRkdtTUVadG9sTE5sWG16YXRtV2JlaGN6Z0FNeE1MSXBIb3VoeWVwcXFIb2xzZVZ3SFoxUW56Tkx5bGdNZ2FVeVRvMG83Q0FWeHE2WnVtMDNxU1dabk9URTVuWDdhQ3p2NVdNbDBHVkdZVjNpM0FBb0VUWFBEby9SMVNGeXpLR3lxcXV0bXdtcHFJaG1ybHVJcDY5U0RGTlRVOVVxc29XVkVlbWxVME15VVNtc2xOMmNnME9ydW93bVd1eUJqUEZvdUhKWXRKS2wzaWFDcVRRNENhUloyYkwyL2RRVDNOc3hQbFVGOStGdXRoSGpPTnlwc2hiNHFjSEd4QVBld0lEdUw0QzhRaVBTY3E0K0VhaFRYRXhIZmZOaCtjT21ycnR1NHZyeFZxeDZpLy8yZ2w2ZkxMU1dtemE4ODFtdmwzWnZPM1JRMjg5V3lBcmd6WlIxQ005NG5xck00M0sraEhaczhZM3pXbkpVbDV4MnlWdmRQbjgwWVcxNlh5dWtlUEljL3VSNHpicEZvajdWaFFNc0V5REVSYXRiRmV4UEJ3TXB6dHR5NXpWQldFUjNGOGJlR2xsZmtiVkdOTlZ5N00wcGxJdk5NeUZnZ1Z5ckhBL2I2NHVMREkyRGpTcWo3YU9Ub0s0V1U5VTdaUXFlQ0N4NGU2WlVjbWxncTN5MVc1endkNDNXZTNuWTZZVU9iRVBkcXJ5ZkpoM3ZOR0RaNDR2V2lhU1RnQ0dqalJEVGYyNmw3aEdmZ0huSHlCenJFc25jRlV4aUxZRVZoUGVneVhBeWR0WVJ6NGUvdSsyQUJlNmltdU9HcDRpcXppQThQMC9iUTJPYlJOLzZQbjUwaWllK0l1bTdibHFjWDB3OWtlZVZ5aU80ckcvYUZtK2cyMHZqZ01zWnQzTzJCKzdYcUUwYkkrRGhheXR0SVp0STk4dEZrYlY1M1JrVEVXUG5uTThnaC96ZTgvcFpsYTNmUUZOYytjSFg3SjlSRDh4ak9tcEJxaGYydXN6eExsTWs0UStTWWZJVnhCSHgvR1pUK1BlNFk1VnlUQ0p5eEFLVWVIMU1zd2dqWFJKZlFOYTZHWW0rUHo0SDdXcjFVZFRGY1pWT3VSdDBiYThDYUlWeitSUk02RnRuaWFjRWdTNnR2b2JHREZrMVdHZ0liY2Zrd0ZyeWk5dks3SkdLZnlUaUNSVFcvKzVkMFpjYmxDc2tOZGxJUGVjbjYvWlpJWEE3K2tVeDFEK2dQR0xzaWlVeW9Ud3k0QVJ3dDRqYTdLaWlsM2srSmp5ZlI4akJzaVVDeDFKNmM2MzRPSUtXWkV5YjNPTkRIRnZjOUx0MG1YcG8rZ0FKb0tDaEF1WXhFSnJRVGd5REpZdEdFMkVKS2NDcjExQVRESXUyc2ZUYmE4b1pScnUwUlpxR1BKVG13bDZhazNWWXpoSk44bUcwSTVrT2txbTZObENacVEyRFFPaEpCd1ZaeGtJKytDVDk5OURkY0kxcmprTEQ0NU8vdnFLVEQ1ZXJ4Ym43Q28zRXRuTFU2S3RhZHAyejFxYlVUU1VZT0RJWTNLWE1nMDVVQ2Zsb3AvdkRPNElQWlRleUdRS1ZKekZsNUR0ak5CWGxFUWhvWWNCZ1NRVkVKWm9wbWxRY2xhV2o3WFFxVkpMWVZxaHZESWt1QmRQTkFhV3FSQ2l6UmdPQk1pS0hBL1NXeUFWeGRSOEZoUFhQbWZGT3JLdVRKdFVrVkdlSEZyanluSWE1b0RGV3VLNGxteDlIUWVnQ3ZJV2tqSDErdzdlV1Y3MHNBSzRwU0E0NGpIMFFyK2R4WmlVb2prVWFoeWhTS0pRWlNieHNST0graWRPY1BQaXhYdS9lYkUvUG43UnRRWVhYMzAxaTgvZGY5LzlJZUdvZXdicVhpUVZKYW1kdHRNRUlaYnd0Z1BqSkMwRFRkSTJNaytTUnV4dGIvdkU1YmQrL1A3N243NThlYkI4K2NtbnJqNkZzN2swZXVuMDZjdDMzbm52bWR2UG56eFpMNWRPd2hkZy9keDl0KzA4OEFVNFdhM2hmVERMMkgwRmR1SDdPRWQwRHplQTJNZHNHN01kRng0ckZXS0c5THBudjlMV2xCQW1nbVluR1BSOER4MGNkLzRONXR2YmRqekN1Zk5MRHl5ZG00dWl1WE5ZT0Q4WGR1Y1BSWVpkOEpjS3BtMG9hcEN2YmxSRDMrWGNNZ29sTng4Vm9vUGRlYzhybHp0ejNibjVkcVhzZVYrOHZIeStFMFdkOC8zNyt4Zm13bkR1d3IxSFZsZVN1YXFGOUdlVWo3YUxsUVpobm9xR2pnRTBLc1gyYWhtbGhOaVZ1V1IxOWNhRkRvN2krcjVicnJRN0Vzczg2c3U0TDIxVWszWHBvSFNqOUFEeVh4aG5Mck14RDQyV2NCVDRKQmdZYURQd1daZ3dUMExYYlpoa1dZeHdVWHhxcUZtOTVZc1NGaWdtQU9rdzZxTzRaMTVxaTJTQnNBU2pOdTUvWTR5N3ZuVjIzNzVGeElkcE5nZXlvK2FyTkZkcVQvS2hiU1dsemRoeFl2eEd4V1lSL3o2VGErUnlEWHM3VnlaT0dEQ08zaFhsRldJVDJROXBZMmxwczV6TzlIb3p0WjVSY01obzFqYW92TzY2NDFadXp2SkRQelRxWDZ6bmN2WGNIMWxCWU5sQkFGZkVlTG1kYjczMjJwODk3c1k2UTMrcnlFTU93UEg3NkhocGFlcmZTUmZYWmhZemh4UlhwYlVwYjBGa0s4NDByNU9yRVBXVXNlS2xYaUJrclFvOEdXZmlBTVg1MGFocldlVitKV2R5NFJWWXNUNWIxdlRCeWY2c3E0RjgxS05CR0J0Rzk1T1Q2Rml4K0hRdG5TMjVCcEF0NHNiNUhENGZWdzNkejBVV2t1WllLZFNhamJMNk9manJ3VTRIdU9BQjFldjhZalV1RXNIaFhQZ0JlQUo1bkdPRU9JamVCR09rS2tuUk9PRXp1QXRORExFeFJrdjdwNzRZS3J5TmNkSForZEh6enl2UHkxODIvOXg2T240MnViM3hybG16TzlPdC9TMTg3ck4vOC9Qenh4ZkM3b1B6NmZ4dk5TKzN2cEgvVlA2ZitWL3dMRlo4U1NjSi9JbTBJWDBBSXpxK25yK2trNzFqRC9yL2M2QTJYSStENndmU1l4TEc2ZWlOaTVBMkp4VlpqRE44b3lrUlZuSTZ1cURmNjlmdURidmNDaGt6M1VwM2JyUTZUaGZtNnpyaktERklSVlkrcmxhYllXSmFDbEZkUlFnRk04MGtidGNxVWFqaG85ZFJJTGxIRFkzN0xsTU1xbE1WYkkxemJtQUNyZHNLVXloVndzaHhmWTJGNEdzQWZyKzdpa3pmNnFLMWdBZFY3cGc1eTBaanlqeXZvcW02cWprc1VPU1ZmbmUyRVJwYytEamNlVVZ6aXZPZDBXQVZzMExSRUtNMTVHRko4V3cxcDZCZ29hVUJSNmFnbWFXR1lSUEJ5U0E3a1J2RXJ0YWtWWjlBTFhBUm5JcmpsYmhHaFY5NVFxclF5L0I1M09PMnRDU1VHK29NY1lmTE8rNlBXaGlnZlF5N3pIeGwvMGN0dWQ3S29qTGUrMDNhNlhqU3c4eXh6OXY5SG1wZDBrOTRuMVdRdFBwcGd0ZHVRcHZrT3dkOS8wQm5xZVVtSHB4YTZ4encvWU9kdFZPbmRuNTRlREE0M1AvTDdQOXJSNDV3MlUvNDVoWlBmTXFPSEVINlIzUnRZazNtc0RKWHI4K1YzbTI0cnZISzJwdEU1ZlE3VDczY3o2N00vbTljdUFCYVlsSHQ5R21OV29sMnp3VTl0cWMxTzBaM3BpQzIvd0hqKzl1WlQxTWxVM0xScC9UVGlDZFJlNXcySXd1aTV2Z2IrUGsrSkR2Znk3NVBsVitBK0lYeTUvOWw3c2MwLytQT1gwMDluaW41OEJOY3M1NjBMZDBsUFN4SkFlWkpFd0VwZ2JKTndOSWIwT3BsMUI4UDQ2eG5DbVZsZ2dpOGZrSjkzTm9ENTJCNnBRM3QraDRpczNZK21VS1doM3RJN1lGSkhNM25iSjhQY0ZTVEEwM1RhTzV1eDNiaWZGMHpDSHBnSDJMTDFGSE42VmxIaGljMER6ZWR0NXA1MStZSWFEVk1xc1VSMFJWRk13bmlkSEdtN0tNb0U2S2F1ZWE3Wkc3bE9uMExYRU1MWm11dXl1QTNOUXM4KzFOZEFsL0phYXBNQTMzdFd0c0x1S3FBcXpraUJUSDBQTFhRVmZ6anJCWlRwQlJmQ1YyUnBSTjBHSjRmKzc4aTBPcHBPQTVGN2NmMEZqTVdtWjlHUWRmY0F2TmNKak96a0hOVXRKS1NzdnY2N3QvalByMk1IS1FqTnhTa3VpUTFHN3lSRHBQR0V2QlpvUXdJUFZablFsb0VTTE5mbUR0dEhML3o1SjAzRndzRktGMTk2ZXJWbC9MUFBQTElNNCs4NTRsTGw1NjQ5RXo3MVZmUDNucnJPMFQ3MVFPUGlKNExsMFNQdEhmUGY0Ti9oYTlMTVdyWERaaDkzSWlSMEFPeDRnd1hQb3FqQ21RK0w1MVFocHVRYlRQdUZQWXkzSnU5NmlSN041Q1p3YmFnOVhRaWNuNTRKVG5XcVJRZWVLYW9HL0hqRjg2OGswTFVmVzNmQjVvdGRhSHp2aFNjK01ZSE5QWFdqY01QR05Rb3d5Mkh6bXhzZGpvSEFONnh2WjAvcHBCbUJUNWRDU3lkeGZkZXhqU2hCRysrVDFldjNGbXIzN1R6aDBGL2RlM0twTjlJUW9mcXR4NWJlNnVxdituR2hNT0poNzU2dzF4bkg4Q0J1ZmxIemYwSExCSnNvWmFMWjFVem5mNG1hbEZKdWxXNlQzcFFlbFQ2aVBTTTlLY0N4M1E0dFNIQ2JncmJLbkptRVA1RTVJQlpKck5KcG5ETlRxc1FSS3g0MTJoVGdkbEdYYnhDRWthNG5iMUhTcWNwKzNEY0Z2Nk1YNWR6THNiQ0JDQVNkaGxadXdwREllRjRvdzFvQkQrVjJrVmlzR2t3akpLUmVDZUx4dGxXdWlBeWVTQ203YURReGw2SVhqRkJvVE4xMTZHa2pwbG1ZdG1RcitpYTY0V0s3Q0lBWlhkVVJuNUY2TEc0UEtvR01mY01TOUcwdkJscWtQTjhkaEM0VWQ1ZmJqZzVxdFo2dFZyUFJycDFTZ1hWSk9jY1ZUMVdxOG9NcWtVYUJ6NlZZOWRVUWk5SDVaTEI0YTRWcjJCaHBDbXE0V2swdEN5VHdtSlF0Rlh3dzFCRlNxN25aWnhTMmRGVTVjY2E1dDF4SHZPb3FPYTdocEZSTlFzbnNWNHA1ZEdTYTVHQjlvR0k1RVZrN3A3bkgrYmNkV0wyTkhRakE5aitYbS8vMHVzWU9wb3Q3ek1VUzdjb2VmZ01vT2MrQmtvdUh5bjVFRldqbklUb21XTTNWajk2c3hPTE9GV29hOWc2Wmprc0gwcVo1bjV3OTNVNEMxOURmWjlCcEdkT0xFRW9vNzNhUWhzZDR1L1lHOUhyTDdzaU9ITjRjdVNXdXpFajZqSnlwaXEzNUY1aHB0ZXRWdUZycDQ2ZmJ6d3JNK1hUbjFZVWVJSHRTdU54bXY2ZEpGbVNzL3NhL0FoZXhEajIwRVcwTUxJMk1LNU9TM2RMYjVIZUxyMVh1aUpKc3dJU050VFRFSmt3RTVUMm5nK3N0NVRyanBDMW1xSllnZXpWZDlhUVpuM3Buay9FbUt0UDMxR0lPcDBPaEtYSnRITTQ0RytZeTlhMEJ3c2p2cWRnREE2R2xSaWk4dFhJZHFLb0dqd2JPWFlVbGFPZEYwTTBqYUlDUTFHQ0dJc2Z4cFB3Wk1jSkR6cFJYTTY2STl1TzhJUXdLb2Y0d1RiYnVScG03VTc0bmtvWVRrK09zUFJ3T1l4SzRZZHh4QkRQdlEwdktVWGhiVzRRbGlJYzB3N3hON1R0RUdMYkNYQW8wVklPcjJCVEZGbE91UE13OXVQTndvL2hUeWxzT0tJM2VGMWNFWmFXQXl4WEF0UTVTN29MWG9XTG1LZFdwYTQwa05Zd3NqRlNZOHhVQ2FhWWRxWXhRa2NtcVBSSWFuRmFJVk50R1UwNHFoaHJUN0NLSFJYNHJGcjB1ZW1hcWxmRWZOaDI4ODJpWjZneStWQ2l4Nk5HOHBQZXVwSm96a1FsVURLNmREV3RmbWl5WnJRNGE4RkZSQ2ZUOGMrU25ZUDFmakJESzJFaFhOajNZdm5JeHBMeU83K3JiNStlZC9YbXBqdTc5UHZXU003blc2MWN6bHBTMVo0ay9UYy90WGlQQUhpY1kyQmtZR0FBNHFvb1k1NTRmcHV2RE54TURDQndycExqREl6Ky8vUC9UZVlNeHRkQUxnY0RXQm9BS2xrTUtYaWNZMkJrWUdCOC9mOG1neDRMdy8rZi94aVlNeGlBSWloQUhnQ2sxQVo1ZUp4allvQ0NWUkNLOFJNREF4T1Fab29Ec2pzWUdCblhBR2t2SUYvay96K20zUDkvbUVxQmJCQy9ISWdQQWJFUlVINFJRejhUMi85ZklIMk1ENEJpV2tCNkl0Z2NJUllHaGtsZzh4Z1llSmdZL3Y4R1ljWXJZSDREQXo4REx3RGNBQlV1QUFBQUFBQUFBQUFBQUE0QVdBQzBBU1FCWUFJWUFvZ0N4QU9NQTlRRU5BU3dCU0lGNWdZRUJqZ0dzZ2RBQjVRSHpnaU1DUUlKSmduV0NoQUtoZ3VJQzdvTWRnelllSnhqWUdSZ1lGQmsyTTNBeXdBQ1RFRE15QUFTY3dEekdRQVpJZ0V2QUFCNG5IV09NV29ETVJCRjM5cHJoK0FRVW9XVWdqUnBkcEUyamZFQjlnQXAzQnNqbGdYYkF0a0dueVJWanBBeXg4Z0Jjb1FjSTkvcmFWSllNT2pOMTUvNUF1NTRwK0I4Q201NE1CNkpYNHpIUEhNeUxxVi9HaytZOFcwOGxmNHJaMUhlU3JrZnBzNDhFajhaajJueHhxWDBEK01KajN3WlQ2WC8wTE1tc1ZVbGR0Q3Ywellsd1J1UmppTWJWbVMxc1R0dVZvSjI4QjJHTzhzUmNUVFVTbk1zVlAvM1hiUTVGVUdPU2s0dmV0V2F0RHUwS1hmUk5iVjNDMmU1b25rVmZOWDRJTk8xdnkyVm10bnIvWklSaG55V01lOTc3UWkxdnpyN0J3RHZPZE1BQUhpY1kyQml3QThVZ1ppUmdZbVJpWUdkZ1plQmowR0pRWU5CaTBHZndaREJuTUdTd1lyQmhzR0Z3WlBCbmFHUXdZc2hpS0dVd1pVaG1pR1dnWVZCbUlHVklZS0JrNEdOSVpTOU5DL1R6Y0RBQUFEcGh3aGFBQUE9KSBmb3JtYXQoJ3dvZmYnKSx1cmwoJ2h0dHBzOi8vZDE5cDR6ZW1jeWNtN2EuY2xvdWRmcm9udC5uZXQvdzIvZm9udC96b2NpYWwtcmVndWxhci13ZWJmb250LnR0ZicpIGZvcm1hdCgndHJ1ZXR5cGUnKSx1cmwoJ2h0dHBzOi8vZDE5cDR6ZW1jeWNtN2EuY2xvdWRmcm9udC5uZXQvdzIvZm9udC96b2NpYWwtcmVndWxhci13ZWJmb250LnN2ZyN6b2NpYWxyZWd1bGFyJykgZm9ybWF0KCdzdmcnKTtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHlsZTpub3JtYWx9I2F1dGgwLXdpZGdldCAuem9jaWFsLmF1dGgwOmJlZm9yZXtjb250ZW50OlxcXCI/XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYXV0aDB7YmFja2dyb3VuZC1jb2xvcjojZmY0NTAwO3dpZHRoOmF1dG99I2F1dGgwLXdpZGdldCAuem9jaWFsLmJsb2Nre2Rpc3BsYXk6YmxvY2s7bWFyZ2luOjEwcHggMDt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO292ZXJmbG93OmhpZGRlbn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5e21hcmdpbjowO3BhZGRpbmc6MCAxZW07Zm9udC1zaXplOjE0cHg7bGluZS1oZWlnaHQ6NDJweH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeTpiZWZvcmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeTpiZWZvcmV7ZGlzcGxheTpub25lfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wcmltYXJ5e2JhY2tncm91bmQtY29sb3I6Izc0N2U4NX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5e2JhY2tncm91bmQtY29sb3I6I2YwZjBlYjtjb2xvcjojMjIyO3RleHQtc2hhZG93OjAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjgpfSNhdXRoMC13aWRnZXQgLnpvY2lhbHstd2Via2l0LWZvbnQtc21vb3RoaW5nOmFudGlhbGlhc2VkfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5e3Bvc2l0aW9uOmZpeGVkO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO292ZXJmbG93OmhpZGRlbjt6LWluZGV4Ojk5OTk7Zm9udC13ZWlnaHQ6MjAwOy1tb3otdXNlci1zZWxlY3Q6bm9uZTsta2h0bWwtdXNlci1zZWxlY3Q6bm9uZTstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7LW8tdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lO2JhY2tncm91bmQ6IzAwMDtiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsMC44KTtiYWNrZ3JvdW5kOi13ZWJraXQtcmFkaWFsLWdyYWRpZW50KDUwJSA1MCUsZWxsaXBzZSBjbG9zZXN0LWNvcm5lcixyZ2JhKDAsMCwwLDAuNDUpIDElLHJnYmEoMCwwLDAsMC44KSAxMDAlKTtiYWNrZ3JvdW5kOi1tb3otcmFkaWFsLWdyYWRpZW50KDUwJSA1MCUsZWxsaXBzZSBjbG9zZXN0LWNvcm5lcixyZ2JhKDAsMCwwLDAuNDUpIDElLHJnYmEoMCwwLDAsMC44KSAxMDAlKTtiYWNrZ3JvdW5kOi1tcy1yYWRpYWwtZ3JhZGllbnQoNTAlIDUwJSxlbGxpcHNlIGNsb3Nlc3QtY29ybmVyLHJnYmEoMCwwLDAsMC40NSkgMSUscmdiYSgwLDAsMCwwLjgpIDEwMCUpO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDUwJSA1MCUsZWxsaXBzZSBjbG9zZXN0LWNvcm5lcixyZ2JhKDAsMCwwLDAuNDUpIDElLHJnYmEoMCwwLDAsMC44KSAxMDAlKTtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2l0aW9uOjQwMG1zIG9wYWNpdHkgZWFzZTstbW96LXRyYW5zaXRpb246NDAwbXMgb3BhY2l0eSBlYXNlO3RyYW5zaXRpb246NDAwbXMgb3BhY2l0eSBlYXNlOy13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDAsMCwwKTstbW96LXRyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCk7LW1zLXRyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCk7LW8tdHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDAsMCwwKTt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5LmFjdGl2ZXtvcGFjaXR5OjF9I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLnBhbmVsey13ZWJraXQtYm94LXNpemluZzpib3JkZXItYm94Oy1tb3otYm94LXNpemluZzpib3JkZXItYm94O2JveC1zaXppbmc6Ym9yZGVyLWJveDtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjUwJTtkaXNwbGF5Om5vbmV9I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLnBhbmVsLmFjdGl2ZXtkaXNwbGF5OmJsb2NrOy13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uOjQwMG1zOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlOy13ZWJraXQtYW5pbWF0aW9uLW5hbWU6c2hvd1BhbmVsfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbHstd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbjo0MDBtczstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZTstd2Via2l0LWFuaW1hdGlvbi1uYW1lOmhpZGVQYW5lbDt3aWR0aDoyODBweDttYXJnaW46MCAwIDAgLTE0MHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5lbWFpbHttYXJnaW4tYm90dG9tOjE0cHh9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhc3N3b3JkLCNhdXRoMC13aWRnZXQgLnBvcHVwIC5yZXBlYXRQYXNzd29yZHttYXJnaW4tYm90dG9tOjE0cHh9I2F1dGgwLXdpZGdldCAucG9wdXAgLmVtYWlsLXJlYWRvbmx5e3RleHQtYWxpZ246Y2VudGVyO2Rpc3BsYXk6aW5oZXJpdDtjb2xvcjojNDE0NDRhO2ZvbnQtd2VpZ2h0OmJvbGQ7bWFyZ2luLWJvdHRvbToyNXB4fSNhdXRoMC13aWRnZXQgLnBhbmVsIC5zaWdudXAgLmhlYWRlciwjYXV0aDAtd2lkZ2V0IC5wYW5lbCAucmVzZXQgLmhlYWRlcnttYXJnaW4tYm90dG9tOjE1cHg7Zm9udC1zaXplOjE0cHg7Y29sb3I6IzQxNDQ0YX0jYXV0aDAtd2lkZ2V0IC5wYW5lbCAuc2lnbnVwIC5mb290ZXJ7bWFyZ2luLWJvdHRvbToxNXB4O2ZvbnQtc2l6ZToxMnB4O2NvbG9yOiM0MTQ0NGE7dGV4dC1hbGlnbjpsZWZ0O21hcmdpbi10b3A6MTBweH1ALW1vei1rZXlmcmFtZXMgc2hvd1BhbmVsezAle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk1KSB0cmFuc2xhdGUzZCgwLDAsMCl9MTAwJXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALXdlYmtpdC1rZXlmcmFtZXMgc2hvd1BhbmVsezAle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk1KSB0cmFuc2xhdGUzZCgwLDAsMCl9MTAwJXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALW8ta2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC1tcy1rZXlmcmFtZXMgc2hvd1BhbmVsezAle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk1KSB0cmFuc2xhdGUzZCgwLDAsMCl9MTAwJXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfX1Aa2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC1tb3ota2V5ZnJhbWVzIGhpZGVQYW5lbHswJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk4KSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtd2Via2l0LWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALW8ta2V5ZnJhbWVzIGhpZGVQYW5lbHswJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk4KSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtbXMta2V5ZnJhbWVzIGhpZGVQYW5lbHswJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk4KSB0cmFuc2xhdGUzZCgwLDAsMCl9fUBrZXlmcmFtZXMgaGlkZVBhbmVsezAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX0xMDAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTgpIHRyYW5zbGF0ZTNkKDAsMCwwKX19I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVse2JhY2tncm91bmQ6I2ZhZmFmYTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KCNmZmYsI2ZhZmFmYSk7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudCgjZmZmLCNmYWZhZmEpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudCgjZmZmLCNmYWZhZmEpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KCNmZmYsI2ZhZmFmYSk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQoI2ZmZiwjZmFmYWZhKTt6LWluZGV4OjEwOy1tb3otYm94LXNoYWRvdzowIDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMiksMCAxMHB4IDI3cHggcmdiYSgwLDAsMCwwLjcpOy13ZWJraXQtYm94LXNoYWRvdzowIDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMiksMCAxMHB4IDI3cHggcmdiYSgwLDAsMCwwLjcpO2JveC1zaGFkb3c6MCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjIpLDAgMTBweCAyN3B4IHJnYmEoMCwwLDAsMC43KTstbW96LWJvcmRlci1yYWRpdXM6NnB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czo2cHg7Ym9yZGVyLXJhZGl1czo2cHg7LXdlYmtpdC10b3VjaC1jYWxsb3V0Om5vbmV9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsOmFmdGVye2NvbnRlbnQ6XFxcIlxcXCI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3JpZ2h0OjA7dG9wOjA7Ym90dG9tOjA7ei1pbmRleDoxOy1tb3otYm94LXNoYWRvdzppbnNldCAwIC0xcHggMnB4IHJnYmEoODIsOTMsMTEyLDAuNCk7LXdlYmtpdC1ib3gtc2hhZG93Omluc2V0IDAgLTFweCAycHggcmdiYSg4Miw5MywxMTIsMC40KTtib3gtc2hhZG93Omluc2V0IDAgLTFweCAycHggcmdiYSg4Miw5MywxMTIsMC40KX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVye2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246cmVsYXRpdmU7bWluLWhlaWdodDo2NXB4O292ZXJmbG93OmhpZGRlbjstbW96LWJvcmRlci1yYWRpdXM6NnB4IDZweCAwIDA7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjZweCA2cHggMCAwO2JvcmRlci1yYWRpdXM6NnB4IDZweCAwIDA7YmFja2dyb3VuZDojZjFmNGY2O2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQoI2YxZjRmNiwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KCNmMWY0ZjYsI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KCNmMWY0ZjYsI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTotby1saW5lYXItZ3JhZGllbnQoI2YxZjRmNiwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCgjZjFmNGY2LCNlOWVkZjApO2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHJnYmEoNDAsNjksODUsMC4xMSl9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlcjpiZWZvcmV7Y29udGVudDonJztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6NXB4O2JvdHRvbTotMXB4O2xlZnQ6MDtyaWdodDowO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQocmdiYSg0MCw2OSw4NSwwKSxyZ2JhKDQwLDY5LDg1LDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQocmdiYSg0MCw2OSw4NSwwKSxyZ2JhKDQwLDY5LDg1LDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChyZ2JhKDQwLDY5LDg1LDApLHJnYmEoNDAsNjksODUsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotby1saW5lYXItZ3JhZGllbnQocmdiYSg0MCw2OSw4NSwwKSxyZ2JhKDQwLDY5LDg1LDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyOmFmdGVye2NvbnRlbnQ6Jyc7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjRweDtib3R0b206MDtsZWZ0OjA7cmlnaHQ6MDtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KGxlZnQsI2U5ZWRmMCxyZ2JhKDI0MSwyNDQsMjQ2LDApLCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQobGVmdCwjZTllZGYwLHJnYmEoMjQxLDI0NCwyNDYsMCksI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KGxlZnQsI2U5ZWRmMCxyZ2JhKDI0MSwyNDQsMjQ2LDApLCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KGxlZnQsI2U5ZWRmMCxyZ2JhKDI0MSwyNDQsMjQ2LDApLCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KGxlZnQsI2U5ZWRmMCxyZ2JhKDI0MSwyNDQsMjQ2LDApLCNlOWVkZjApfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgaDF7cGFkZGluZzoyMXB4IDIwcHg7bWFyZ2luOjA7Zm9udC1zaXplOjE4cHg7Y29sb3I6IzQxNDQ0YTtmb250LXdlaWdodDpib2xkO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkZGUzZTZ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBhe2Rpc3BsYXk6YmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3RleHQtaW5kZW50OjIwMCU7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MTJweDtvcGFjaXR5Oi40O3BhZGRpbmc6NXB4O3otaW5kZXg6NX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGE6aG92ZXJ7b3BhY2l0eTouNjZ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBhOmFjdGl2ZXtvcGFjaXR5OjF9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBhLmNsb3Nle2hlaWdodDoxMnB4O2JhY2tncm91bmQ6dXJsKFxcXCJodHRwczovL2QxOXA0emVtY3ljbTdhLmNsb3VkZnJvbnQubmV0L3cyL2ltZy9jbG9zZS5wbmdcXFwiKSA1MCUgNTAlIG5vLXJlcGVhdDtiYWNrZ3JvdW5kLXNpemU6MTJweCAxMnB4O3JpZ2h0OjE5cHg7dG9wOjIxcHg7Y3Vyc29yOnBvaW50ZXJ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBhLmNsb3NlOmhvdmVye29wYWNpdHk6LjY2fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgaW1ne2hlaWdodDozMnB4O21hcmdpbjoxNnB4IDEwcHggMTBweCAyMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO2Zsb2F0OmxlZnR9I2F1dGgwLXdpZGdldCAuYWN0aW9uIC5zcGlubmVye3dpZHRoOjEwMCU7YmFja2dyb3VuZC1jb2xvcjojNmE3NzdmO2JhY2tncm91bmQtaW1hZ2U6dXJsKCdodHRwczovL2QxOXA0emVtY3ljbTdhLmNsb3VkZnJvbnQubmV0L3cyL2ltZy9zcGlubmVyLmdpZicpO2JhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdDtiYWNrZ3JvdW5kLXBvc2l0aW9uOmNlbnRlcjttYXJnaW46MDtoZWlnaHQ6NDRweDtib3JkZXI6MXB4IHNvbGlkICM3Nzc7Ym9yZGVyLWNvbG9yOnJnYmEoMCwwLDAsMC4yKTtib3JkZXItYm90dG9tLWNvbG9yOiMzMzM7Ym9yZGVyLWJvdHRvbS1jb2xvcjpyZ2JhKDAsMCwwLDAuNCk7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTtib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpOy1tb3otdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lOy1tb3otYm9yZGVyLXJhZGl1czouM2VtOy13ZWJraXQtYm9yZGVyLXJhZGl1czouM2VtO2JvcmRlci1yYWRpdXM6LjNlbX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgZm9vdGVye2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246cmVsYXRpdmU7LW1vei1ib3JkZXItcmFkaXVzOjAgMCA1cHggNXB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czowIDAgNXB4IDVweDtib3JkZXItcmFkaXVzOjAgMCA1cHggNXB4O2hlaWdodDoyNXB4O2xpbmUtaGVpZ2h0OjI1cHg7dmVydGljYWwtYWxpZ246bWlkZGxlO21hcmdpbjowIDE1cHg7Ym9yZGVyLXRvcDoxcHggc29saWQgI2RkZTNlNjt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGZvb3RlciBzcGFue2ZvbnQtc2l6ZToxMHB4O2NvbG9yOiM2NjZ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGZvb3RlciBhe2ZvbnQtc2l6ZTo5cHg7Y29sb3I6IzMzMztmb250LXdlaWdodDpib2xkO3RleHQtZGVjb3JhdGlvbjpub25lO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmxpc3QsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3R7bWFyZ2luOjI1cHggMDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAubGlzdDpiZWZvcmUsI2F1dGgwLXdpZGdldCAubGlzdDphZnRlciwjYXV0aDAtd2lkZ2V0IC5pY29ubGlzdDpiZWZvcmUsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3Q6YWZ0ZXJ7ZGlzcGxheTp0YWJsZTtjb250ZW50OlxcXCJcXFwifSNhdXRoMC13aWRnZXQgLmxpc3Q6YWZ0ZXIsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3Q6YWZ0ZXJ7Y2xlYXI6Ym90aH0jYXV0aDAtd2lkZ2V0IC5saXN0IHNwYW57ZGlzcGxheTpibG9jazttYXJnaW46MTBweCAwO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmljb25saXN0e3RleHQtYWxpZ246Y2VudGVyfSNhdXRoMC13aWRnZXQgLmljb25saXN0IHNwYW57bWFyZ2luOjAgMnB4fSNhdXRoMC13aWRnZXQgLmZvcmdvdC1wYXNze2ZvbnQtc2l6ZToxMnB4O2NvbG9yOiM2NjY7Zm9udC13ZWlnaHQ6bm9ybWFsfSNhdXRoMC13aWRnZXQgLmNyZWF0ZS1hY2NvdW50e2Rpc3BsYXk6bm9uZTttYXJnaW4tdG9wOjIwcHg7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCAuY3JlYXRlLWFjY291bnQgYXtmb250LXNpemU6MTJweDtjb2xvcjojNmQ2ZDZkO3RleHQtZGVjb3JhdGlvbjpub25lfSNhdXRoMC13aWRnZXQgLmNyZWF0ZS1hY2NvdW50IGE6aG92ZXJ7dGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZX0jYXV0aDAtd2lkZ2V0IC5sb2dnZWRpbiBzcGFuLmNlbnRlcmVkLmFsbHtjb2xvcjojMDA4Y2RkO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmxvZ2dlZGluIHNwYW4uY2VudGVyZWR7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHggMDttYXJnaW46MTVweCAwIDVweDtmb250LXNpemU6MTNweDtkaXNwbGF5OmJsb2NrfSNhdXRoMC13aWRnZXQgLmxvZ2dlZGluIHNwYW4uY2VudGVyZWQuYWxsOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zIGEuY2FuY2VsLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25zIGEuY2FuY2Vse2NvbG9yOiMwMDhjZGQ7Y3Vyc29yOnBvaW50ZXI7dGV4dC1kZWNvcmF0aW9uOm5vbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zIGEuY2FuY2VsOmhvdmVyLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25zIGEuY2FuY2VsOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25ze3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6NXB4IDA7bWFyZ2luOjE1cHggMCA1cHg7Zm9udC1zaXplOjEzcHg7ZGlzcGxheTpibG9ja30jYXV0aDAtd2lkZ2V0IGZvcm17bWFyZ2luOjMwcHghaW1wb3J0YW50O21hcmdpbi1ib3R0b206MjJweDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCBmb3JtIGxhYmVse2Rpc3BsYXk6YmxvY2s7Y29sb3I6IzdmODg5OTtmb250LXNpemU6MTNweDtmb250LXdlaWdodDpib2xkO21hcmdpbjowIDAgN3B4IDA7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0jYXV0aDAtd2lkZ2V0IGZvcm0gaW5wdXR7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7LW1vei1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjEwMCU7Zm9udC1zaXplOjE4cHg7cGFkZGluZzoxMHB4IDEycHg7Ym9yZGVyOjFweCBzb2xpZCAjYjRiZWNkO2JvcmRlci10b3AtY29sb3I6I2IwYmFjYTtib3JkZXItYm90dG9tLWNvbG9yOiNkM2Q5ZTI7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDEzMCwxMzcsMTUwLDAuMjMpLDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjg1KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMTMwLDEzNywxNTAsMC4yMyksMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuODUpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMTMwLDEzNywxNTAsMC4yMyksMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuODUpOy1tb3otYm9yZGVyLXJhZGl1czo0cHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjRweDtib3JkZXItcmFkaXVzOjRweDttYXJnaW46MDtmb250LWZhbWlseTonSGVsdmV0aWNhIE5ldWUnLEhlbHZldGljYSxBcmlhbCBHZW5ldmEsc2Fucy1zZXJpZn0jYXV0aDAtd2lkZ2V0IC5wbGFjZWhvbGRlcntjb2xvcjojY2NjfSNhdXRoMC13aWRnZXQgZm9ybSBpbnB1dDpmb2N1c3tib3JkZXItY29sb3I6IzU2OTVkYiAjNzBhN2U0ICM4OWI4ZWMgIzcwYTdlNDtvdXRsaW5lOjA7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDcwLDEyMywxODEsMC4zNSksMCAwIDRweCAjNTY5NWRiOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSg3MCwxMjMsMTgxLDAuMzUpLDAgMCA0cHggIzU2OTVkYjtib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDcwLDEyMywxODEsMC4zNSksMCAwIDRweCAjNTY5NWRifSNhdXRoMC13aWRnZXQgZm9ybSAuaW52YWxpZCBpbnB1dHtvdXRsaW5lOjA7Ym9yZGVyLWNvbG9yOiNmZjcwNzY7Ym9yZGVyLXRvcC1jb2xvcjojZmY1YzYxOy1tb3otYm94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSgwLDAsMCwwLjIpLDAgMCA0cHggMCByZ2JhKDI1NSwwLDAsMC41KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4yKSwwIDAgNHB4IDAgcmdiYSgyNTUsMCwwLDAuNSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSgwLDAsMCwwLjIpLDAgMCA0cHggMCByZ2JhKDI1NSwwLDAsMC41KX0jYXV0aDAtd2lkZ2V0IGhlYWRlciAuZXJyb3J7cGFkZGluZzo5cHggMDttYXJnaW46MTBweCBhdXRvO3dpZHRoOjcwJTtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDoxM3B4O2NvbG9yOiNiOTUzNTM7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCBoZWFkZXIgLnN1Y2Nlc3N7cGFkZGluZzo5cHggMDttYXJnaW46MTBweCBhdXRvO3dpZHRoOjcwJTtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDoxM3B4O2NvbG9yOiMwZmFkMjk7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCBmb3JtIC5ub3Rle2Rpc3BsYXk6YmxvY2s7Y29sb3I6IzdmODg5OTtmb250LXNpemU6MTNweDtmb250LXdlaWdodDpib2xkO21hcmdpbjowIDAgN3B4IDA7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0jYXV0aDAtd2lkZ2V0IGZvcm0gLm5vdGUgYXtjb2xvcjojMDA4Y2RkO3RleHQtZGVjb3JhdGlvbjpub25lfSNhdXRoMC13aWRnZXQgZm9ybSAuaW52YWxpZCAuZXJyb3J7dmlzaWJpbGl0eTp2aXNpYmxlfSNhdXRoMC13aWRnZXQgZm9ybSBidXR0b257ZGlzcGxheTpibG9jazttYXJnaW46MjBweCAwIDAgMDtjdXJzb3I6cG9pbnRlcjt3aWR0aDoxMDAlfSNhdXRoMC13aWRnZXQgLmFjdGlvbnt0ZXh0LWFsaWduOnJpZ2h0O21hcmdpbjowIDMwcHggMzBweCAzMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6NX0jYXV0aDAtd2lkZ2V0IGZvcm0gLmFjdGlvbnttYXJnaW46MH0jYXV0aDAtd2lkZ2V0IC5hY3Rpb24gYnV0dG9ue3dpZHRoOmF1dG99I2F1dGgwLXdpZGdldCAuc2VwYXJhdG9ye3Bvc2l0aW9uOnJlbGF0aXZlO3RleHQtYWxpZ246Y2VudGVyO21hcmdpbjowIDAgMjVweCAwfSNhdXRoMC13aWRnZXQgLnNlcGFyYXRvcjpiZWZvcmV7Y29udGVudDpcXFwiXFxcIjtkaXNwbGF5OmJsb2NrO2JvcmRlci10b3A6MXB4IHNvbGlkICM3Zjg4OTk7d2lkdGg6MjAwcHg7bGVmdDo1MCU7bWFyZ2luLWxlZnQ6LTEwMHB4O2hlaWdodDoxcHg7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTt6LWluZGV4OjF9I2F1dGgwLXdpZGdldCAuc2VwYXJhdG9yIHNwYW57YmFja2dyb3VuZDojZmFmYWZhO3BhZGRpbmc6MCAxMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6NTtjb2xvcjojN2Y4ODk5O2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OmJvbGQ7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZX0jYXV0aDAtd2lkZ2V0IHNwYW4uYmFja3tkaXNwbGF5OmJsb2NrO2NvbG9yOiMwMDhjZGQ7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHggMDttYXJnaW46MTVweCAwIDVweDtmb250LXNpemU6MTNweDtjdXJzb3I6cG9pbnRlcjtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjU7b3V0bGluZTowfSNhdXRoMC13aWRnZXQgc3Bhbi5iYWNrOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbmluIC5wYW5lbC5zdHJhdGVnaWVzIC5saXN0IC5lbWFpbHtkaXNwbGF5OmJsb2NrO2NvbG9yOiM3Zjg4OTk7Zm9udC1zaXplOjEzcHg7Zm9udC13ZWlnaHQ6Ym9sZDttYXJnaW46MCAwIDdweCAwO3RleHQtc2hhZG93OjAgMXB4IDAgd2hpdGU7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9mZmljZTM2NTpiZWZvcmV7Y29udGVudDpcXFwiV1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9mZmljZTM2NXtiYWNrZ3JvdW5kLWNvbG9yOiMwMGFjZWQ7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2FhZDpiZWZvcmV7Y29udGVudDpcXFwielxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWR7YmFja2dyb3VuZC1jb2xvcjojMDBhZGVmO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsczpiZWZvcmV7Y29udGVudDpcXFwiYlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsc3tiYWNrZ3JvdW5kLWNvbG9yOiM2YWMwNzE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94OmJlZm9yZXtjb250ZW50OlxcXCJ4XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94e2JhY2tncm91bmQtY29sb3I6IzI2N2JiNjtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmJlZm9yZXtjb250ZW50OlxcXCIqXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZXtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Y29sb3I6I2YwMH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2luZG93c3tiYWNrZ3JvdW5kLWNvbG9yOiMyNjcyZWM7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZml0Yml0OmJlZm9yZXtjb250ZW50OlxcXCIjXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZml0Yml0e2JhY2tncm91bmQtY29sb3I6IzQ1YzJjNTtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC55YW5kZXg6YmVmb3Jle2NvbnRlbnQ6XFxcIiZcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC55YW5kZXh7YmFja2dyb3VuZC1jb2xvcjojZjAwO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnJlbnJlbjpiZWZvcmV7Y29udGVudDpcXFwiclxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnJlbnJlbntiYWNrZ3JvdW5kLWNvbG9yOiMwMDU2YjU7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYmFpZHU6YmVmb3Jle2NvbnRlbnQ6XFxcInVcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5iYWlkdXtiYWNrZ3JvdW5kLWNvbG9yOiMyODMyZTE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAub25lc3RlcHt3aWR0aDozNDVweDttYXJnaW46MCAwIDAgLTE3MnB4fUBtZWRpYShtYXgtd2lkdGg6MjgwcHgpeyNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbHt3aWR0aDoyNDBweDttYXJnaW46MCAwIDAgLTEyMHB4fSNhdXRoMC13aWRnZXQgLnNpZ25pbiAucG9wdXAgLnBhbmVsLnN0cmF0ZWdpZXMgLmxpc3R7bWFyZ2luOjEycHh9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjoxMnB4fSNhdXRoMC13aWRnZXQgZm9ybSBpbnB1dHtwYWRkaW5nOjVweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVye21hcmdpbjowO3BhZGRpbmc6MH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MTRweCAxNnB4O21hcmdpbjowO2ZvbnQtc2l6ZToyMnB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYS5jbG9zZXtyaWdodDoxNHB4O3RvcDoxNnB4fX1AbWVkaWEobWluLXdpZHRoOjI4MXB4KSBhbmQgKG1heC13aWR0aDozNDBweCl7I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLnBhbmVse21hcmdpbjowO2xlZnQ6MDtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO2JvcmRlci1yYWRpdXM6MH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAuem9jaWFsLCNhdXRoMC13aWRnZXQgLnBvcHVwIGEuem9jaWFse2ZvbnQtc2l6ZToxOHB4fSNhdXRoMC13aWRnZXQgLnNpZ25pbiAucG9wdXAgLnBhbmVsLnN0cmF0ZWdpZXMgLmxpc3R7bWFyZ2luOjE1cHh9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjoxNXB4IDI1cHh9I2F1dGgwLXdpZGdldCBmb3JtIGlucHV0e3BhZGRpbmc6NnB4O2ZvbnQtc2l6ZToxOHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXJ7bWFyZ2luOjA7cGFkZGluZzowO21pbi1oZWlnaHQ6MzJweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MTJweCAxNnB4O21hcmdpbi10b3A6MXB4O2ZvbnQtc2l6ZToyMHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgaW1ne2hlaWdodDozMnB4O21hcmdpbjo5cHggMTBweCA2cHggMThweH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeXtsaW5lLWhlaWdodDozNHB4fSNhdXRoMC13aWRnZXQgLmFjdGlvbiAuc3Bpbm5lcntoZWlnaHQ6MzRweH0jYXV0aDAtd2lkZ2V0IC5jcmVhdGUtYWNjb3VudHttYXJnaW4tdG9wOjIwcHh9I2F1dGgwLXdpZGdldCAucG9wdXAgLmVtYWlse21hcmdpbi1ib3R0b206NXB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYXNzd29yZCwjYXV0aDAtd2lkZ2V0IC5wb3B1cCAucmVwZWF0UGFzc3dvcmR7bWFyZ2luLWJvdHRvbTo1cHh9fUAtbW96LWtleWZyYW1lcyBvcmJpdHswJXtvcGFjaXR5OjE7ei1pbmRleDo5OTstbW96LXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXR9NyV7b3BhY2l0eToxOy1tb3otdHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpOy1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LW1vei1vcmlnaW46MH0zMCV7b3BhY2l0eToxOy1tb3otdHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpOy1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLWluLW91dDstbW96LW9yaWdpbjo3JX0zOSV7b3BhY2l0eToxOy1tb3otdHJhbnNmb3JtOnJvdGF0ZSg2NDVkZWcpOy1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LW1vei1vcmlnaW46MzAlfTcwJXtvcGFjaXR5OjE7LW1vei10cmFuc2Zvcm06cm90YXRlKDc3MGRlZyk7LW1vei1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy1tb3otb3JpZ2luOjM5JX03NSV7b3BhY2l0eToxOy1tb3otdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpOy1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstbW96LW9yaWdpbjo3MCV9NzYle29wYWNpdHk6MDstbW96LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX0xMDAle29wYWNpdHk6MDstbW96LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX19QC13ZWJraXQta2V5ZnJhbWVzIG9yYml0ezAle29wYWNpdHk6MTt6LWluZGV4Ojk5Oy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgxODBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dH03JXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDMwMGRlZyk7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjstd2Via2l0LW9yaWdpbjowfTMwJXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDQxMGRlZyk7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2UtaW4tb3V0Oy13ZWJraXQtb3JpZ2luOjclfTM5JXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDY0NWRlZyk7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjstd2Via2l0LW9yaWdpbjozMCV9NzAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoNzcwZGVnKTstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LXdlYmtpdC1vcmlnaW46MzklfTc1JXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyk7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy13ZWJraXQtb3JpZ2luOjcwJX03NiV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfTEwMCV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfX1ALW1zLWtleWZyYW1lcyBvcmJpdHswJXtvcGFjaXR5OjE7ei1pbmRleDo5OTstbXMtdHJhbnNmb3JtOnJvdGF0ZSgxODBkZWcpOy1tcy1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0fTcle29wYWNpdHk6MTstbXMtdHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpOy1tcy1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjstbXMtb3JpZ2luOjB9MzAle29wYWNpdHk6MTstbXMtdHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpOy1tcy1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2UtaW4tb3V0Oy1tcy1vcmlnaW46NyV9Mzkle29wYWNpdHk6MTstbXMtdHJhbnNmb3JtOnJvdGF0ZSg2NDVkZWcpOy1tcy1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjstbXMtb3JpZ2luOjMwJX03MCV7b3BhY2l0eToxOy1tcy10cmFuc2Zvcm06cm90YXRlKDc3MGRlZyk7LW1zLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LW1zLW9yaWdpbjozOSV9NzUle29wYWNpdHk6MTstbXMtdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpOy1tcy1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy1tcy1vcmlnaW46NzAlfTc2JXtvcGFjaXR5OjA7LW1zLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX0xMDAle29wYWNpdHk6MDstbXMtdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfX1ALW8ta2V5ZnJhbWVzIG9yYml0ezAle29wYWNpdHk6MTt6LWluZGV4Ojk5Oy1vLXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTstby1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0fTcle29wYWNpdHk6MTstby10cmFuc2Zvcm06cm90YXRlKDMwMGRlZyk7LW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LW8tb3JpZ2luOjB9MzAle29wYWNpdHk6MTstby10cmFuc2Zvcm06cm90YXRlKDQxMGRlZyk7LW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLWluLW91dDstby1vcmlnaW46NyV9Mzkle29wYWNpdHk6MTstby10cmFuc2Zvcm06cm90YXRlKDY0NWRlZyk7LW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LW8tb3JpZ2luOjMwJX03MCV7b3BhY2l0eToxOy1vLXRyYW5zZm9ybTpyb3RhdGUoNzcwZGVnKTstby1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy1vLW9yaWdpbjozOSV9NzUle29wYWNpdHk6MTstby10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyk7LW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstby1vcmlnaW46NzAlfTc2JXtvcGFjaXR5OjA7LW8tdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfTEwMCV7b3BhY2l0eTowOy1vLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX19QGtleWZyYW1lcyBvcmJpdHswJXtvcGFjaXR5OjE7ei1pbmRleDo5OTt0cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7YW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dH03JXtvcGFjaXR5OjE7dHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyO29yaWdpbjowfTMwJXtvcGFjaXR5OjE7dHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1pbi1vdXQ7b3JpZ2luOjclfTM5JXtvcGFjaXR5OjE7dHJhbnNmb3JtOnJvdGF0ZSg2NDVkZWcpO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyO29yaWdpbjozMCV9NzAle29wYWNpdHk6MTt0cmFuc2Zvcm06cm90YXRlKDc3MGRlZyk7YW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDtvcmlnaW46MzklfTc1JXtvcGFjaXR5OjE7dHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7b3JpZ2luOjcwJX03NiV7b3BhY2l0eTowO3RyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX0xMDAle29wYWNpdHk6MDt0cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9fSNhdXRoMC13aWRnZXQgaW5wdXRbZGlzYWJsZWRde2JhY2tncm91bmQtY29sb3I6I2Q5ZGVlMH0jYXV0aDAtd2lkZ2V0IGFydGljbGUsI2F1dGgwLXdpZGdldCBhc2lkZSwjYXV0aDAtd2lkZ2V0IGRldGFpbHMsI2F1dGgwLXdpZGdldCBmaWdjYXB0aW9uLCNhdXRoMC13aWRnZXQgZmlndXJlLCNhdXRoMC13aWRnZXQgZm9vdGVyLCNhdXRoMC13aWRnZXQgaGVhZGVyLCNhdXRoMC13aWRnZXQgaGdyb3VwLCNhdXRoMC13aWRnZXQgbmF2LCNhdXRoMC13aWRnZXQgc2VjdGlvbiwjYXV0aDAtd2lkZ2V0IHN1bW1hcnl7ZGlzcGxheTpibG9ja30jYXV0aDAtd2lkZ2V0IGF1ZGlvLCNhdXRoMC13aWRnZXQgY2FudmFzLCNhdXRoMC13aWRnZXQgdmlkZW97ZGlzcGxheTppbmxpbmUtYmxvY2s7KmRpc3BsYXk6aW5saW5lOyp6b29tOjF9I2F1dGgwLXdpZGdldCBhdWRpbzpub3QoW2NvbnRyb2xzXSl7ZGlzcGxheTpub25lO2hlaWdodDowfSNhdXRoMC13aWRnZXQgW2hpZGRlbl17ZGlzcGxheTpub25lfSNhdXRoMC13aWRnZXQgaHRtbHtmb250LXNpemU6MTAwJTstd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6MTAwJTstbXMtdGV4dC1zaXplLWFkanVzdDoxMDAlfSNhdXRoMC13aWRnZXQgaHRtbCwjYXV0aDAtd2lkZ2V0IGJ1dHRvbiwjYXV0aDAtd2lkZ2V0IGlucHV0LCNhdXRoMC13aWRnZXQgc2VsZWN0LCNhdXRoMC13aWRnZXQgdGV4dGFyZWEsI2F1dGgwLXdpZGdldCBoMSwjYXV0aDAtd2lkZ2V0IGgyLCNhdXRoMC13aWRnZXQgZGl2LCNhdXRoMC13aWRnZXQgc3BhbiwjYXV0aDAtd2lkZ2V0IGF7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZn0jYXV0aDAtd2lkZ2V0IGJvZHl7bWFyZ2luOjB9I2F1dGgwLXdpZGdldCBhOmZvY3Vze291dGxpbmU6dGhpbiBkb3R0ZWR9I2F1dGgwLXdpZGdldCBhOmFjdGl2ZSwjYXV0aDAtd2lkZ2V0IGE6aG92ZXJ7b3V0bGluZTowfSNhdXRoMC13aWRnZXQgaDF7Zm9udC1zaXplOjJlbTttYXJnaW46LjY3ZW0gMH0jYXV0aDAtd2lkZ2V0IGgye2ZvbnQtc2l6ZToxLjVlbTttYXJnaW46LjgzZW0gMH0jYXV0aDAtd2lkZ2V0IGgze2ZvbnQtc2l6ZToxLjE3ZW07bWFyZ2luOjFlbSAwfSNhdXRoMC13aWRnZXQgaDR7Zm9udC1zaXplOjFlbTttYXJnaW46MS4zM2VtIDB9I2F1dGgwLXdpZGdldCBoNXtmb250LXNpemU6LjgzZW07bWFyZ2luOjEuNjdlbSAwfSNhdXRoMC13aWRnZXQgaDZ7Zm9udC1zaXplOi43NWVtO21hcmdpbjoyLjMzZW0gMH0jYXV0aDAtd2lkZ2V0IGFiYnJbdGl0bGVde2JvcmRlci1ib3R0b206MXB4IGRvdHRlZH0jYXV0aDAtd2lkZ2V0IGIsI2F1dGgwLXdpZGdldCBzdHJvbmd7Zm9udC13ZWlnaHQ6Ym9sZH0jYXV0aDAtd2lkZ2V0IGJsb2NrcXVvdGV7bWFyZ2luOjFlbSA0MHB4fSNhdXRoMC13aWRnZXQgZGZue2ZvbnQtc3R5bGU6aXRhbGljfSNhdXRoMC13aWRnZXQgbWFya3tiYWNrZ3JvdW5kOiNmZjA7Y29sb3I6IzAwMH0jYXV0aDAtd2lkZ2V0IHAsI2F1dGgwLXdpZGdldCBwcmV7bWFyZ2luOjFlbSAwfSNhdXRoMC13aWRnZXQgY29kZSwjYXV0aDAtd2lkZ2V0IGtiZCwjYXV0aDAtd2lkZ2V0IHByZSwjYXV0aDAtd2lkZ2V0IHNhbXB7Zm9udC1mYW1pbHk6bW9ub3NwYWNlLHNlcmlmO19mb250LWZhbWlseTonY291cmllciBuZXcnLG1vbm9zcGFjZTtmb250LXNpemU6MWVtfSNhdXRoMC13aWRnZXQgcHJle3doaXRlLXNwYWNlOnByZTt3aGl0ZS1zcGFjZTpwcmUtd3JhcDt3b3JkLXdyYXA6YnJlYWstd29yZH0jYXV0aDAtd2lkZ2V0IHF7cXVvdGVzOm5vbmV9I2F1dGgwLXdpZGdldCBxOmJlZm9yZSwjYXV0aDAtd2lkZ2V0IHE6YWZ0ZXJ7Y29udGVudDonJztjb250ZW50Om5vbmV9I2F1dGgwLXdpZGdldCBzbWFsbHtmb250LXNpemU6ODAlfSNhdXRoMC13aWRnZXQgc3ViLCNhdXRoMC13aWRnZXQgc3Vwe2ZvbnQtc2l6ZTo3NSU7bGluZS1oZWlnaHQ6MDtwb3NpdGlvbjpyZWxhdGl2ZTt2ZXJ0aWNhbC1hbGlnbjpiYXNlbGluZX0jYXV0aDAtd2lkZ2V0IHN1cHt0b3A6LTAuNWVtfSNhdXRoMC13aWRnZXQgc3Vie2JvdHRvbTotMC4yNWVtfSNhdXRoMC13aWRnZXQgZGwsI2F1dGgwLXdpZGdldCBtZW51LCNhdXRoMC13aWRnZXQgb2wsI2F1dGgwLXdpZGdldCB1bHttYXJnaW46MWVtIDB9I2F1dGgwLXdpZGdldCBkZHttYXJnaW46MCAwIDAgNDBweH0jYXV0aDAtd2lkZ2V0IG1lbnUsI2F1dGgwLXdpZGdldCBvbCwjYXV0aDAtd2lkZ2V0IHVse3BhZGRpbmc6MCAwIDAgNDBweH0jYXV0aDAtd2lkZ2V0IG5hdiB1bCwjYXV0aDAtd2lkZ2V0IG5hdiBvbHtsaXN0LXN0eWxlOm5vbmU7bGlzdC1zdHlsZS1pbWFnZTpub25lfSNhdXRoMC13aWRnZXQgaW1ne2JvcmRlcjowOy1tcy1pbnRlcnBvbGF0aW9uLW1vZGU6YmljdWJpY30jYXV0aDAtd2lkZ2V0IHN2Zzpub3QoOnJvb3Qpe292ZXJmbG93OmhpZGRlbn0jYXV0aDAtd2lkZ2V0IGZpZ3VyZXttYXJnaW46MH0jYXV0aDAtd2lkZ2V0IGZvcm17bWFyZ2luOjB9I2F1dGgwLXdpZGdldCBmaWVsZHNldHtib3JkZXI6MXB4IHNvbGlkICNjMGMwYzA7bWFyZ2luOjAgMnB4O3BhZGRpbmc6LjM1ZW0gLjYyNWVtIC43NWVtfSNhdXRoMC13aWRnZXQgbGVnZW5ke2JvcmRlcjowO3BhZGRpbmc6MDt3aGl0ZS1zcGFjZTpub3JtYWw7Km1hcmdpbi1sZWZ0Oi03cHh9I2F1dGgwLXdpZGdldCBidXR0b24sI2F1dGgwLXdpZGdldCBpbnB1dCwjYXV0aDAtd2lkZ2V0IHNlbGVjdCwjYXV0aDAtd2lkZ2V0IHRleHRhcmVhe2ZvbnQtc2l6ZToxMDAlO21hcmdpbjowO3ZlcnRpY2FsLWFsaWduOmJhc2VsaW5lOyp2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9I2F1dGgwLXdpZGdldCBidXR0b24sI2F1dGgwLXdpZGdldCBpbnB1dHtsaW5lLWhlaWdodDpub3JtYWx9I2F1dGgwLXdpZGdldCBidXR0b24sI2F1dGgwLXdpZGdldCBodG1sIGlucHV0W3R5cGU9XFxcImJ1dHRvblxcXCJdLCNhdXRoMC13aWRnZXQgaW5wdXRbdHlwZT1cXFwicmVzZXRcXFwiXSwjYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcInN1Ym1pdFxcXCJdey13ZWJraXQtYXBwZWFyYW5jZTpidXR0b247Y3Vyc29yOnBvaW50ZXI7Km92ZXJmbG93OnZpc2libGV9I2F1dGgwLXdpZGdldCBidXR0b25bZGlzYWJsZWRdLCNhdXRoMC13aWRnZXQgaW5wdXRbZGlzYWJsZWRde2N1cnNvcjpkZWZhdWx0fSNhdXRoMC13aWRnZXQgaW5wdXRbdHlwZT1cXFwiY2hlY2tib3hcXFwiXSwjYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl17Ym94LXNpemluZzpib3JkZXItYm94O3BhZGRpbmc6MDsqaGVpZ2h0OjEzcHg7KndpZHRoOjEzcHh9I2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXXstd2Via2l0LWFwcGVhcmFuY2U6dGV4dGZpZWxkOy1tb3otYm94LXNpemluZzpjb250ZW50LWJveDstd2Via2l0LWJveC1zaXppbmc6Y29udGVudC1ib3g7Ym94LXNpemluZzpjb250ZW50LWJveH0jYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1jYW5jZWwtYnV0dG9uLCNhdXRoMC13aWRnZXQgaW5wdXRbdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb257LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmV9I2F1dGgwLXdpZGdldCBidXR0b246Oi1tb3otZm9jdXMtaW5uZXIsI2F1dGgwLXdpZGdldCBpbnB1dDo6LW1vei1mb2N1cy1pbm5lcntib3JkZXI6MDtwYWRkaW5nOjB9I2F1dGgwLXdpZGdldCB0ZXh0YXJlYXtvdmVyZmxvdzphdXRvO3ZlcnRpY2FsLWFsaWduOnRvcH0jYXV0aDAtd2lkZ2V0IHRhYmxle2JvcmRlci1jb2xsYXBzZTpjb2xsYXBzZTtib3JkZXItc3BhY2luZzowfVwiKTtcblxuLy8gdXNlIGFtZCBvciBqdXN0IHRocm91Z2h0IHRvIHdpbmRvdyBvYmplY3QuXG5pZiAodHlwZW9mIGdsb2JhbC53aW5kb3cuZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZ2xvYmFsLndpbmRvdy5kZWZpbmUuYW1kKSB7XG4gIGdsb2JhbC53aW5kb3cuZGVmaW5lKCdhdXRoMC13aWRnZXQnLCBmdW5jdGlvbiAoKSB7IHJldHVybiBBdXRoMFdpZGdldDsgfSk7XG59IGVsc2UgaWYgKGdsb2JhbC53aW5kb3cpIHtcbiAgZ2xvYmFsLndpbmRvdy5BdXRoMFdpZGdldCA9IEF1dGgwV2lkZ2V0O1xufVxuIiwibW9kdWxlLmV4cG9ydHM9KGZ1bmN0aW9uKCkge3ZhciB0ID0gZnVuY3Rpb24gYW5vbnltb3VzKGxvY2FscywgZmlsdGVycywgZXNjYXBlKSB7XG5lc2NhcGUgPSBlc2NhcGUgfHwgZnVuY3Rpb24gKGh0bWwpe1xuICByZXR1cm4gU3RyaW5nKGh0bWwpXG4gICAgLnJlcGxhY2UoLyYoPyFcXHcrOykvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG59O1xudmFyIGJ1ZiA9IFtdO1xud2l0aCAobG9jYWxzIHx8IHt9KSB7IChmdW5jdGlvbigpeyBcbiBidWYucHVzaCgnPGRpdiBpZD1cImF1dGgwLXdpZGdldFwiIGNsYXNzPVwiY2xlYW5zbGF0ZVwiPlxcblx0PGRpdiBjbGFzcz1cInNpZ25pblwiPlxcblx0ICAgIDxkaXYgY2xhc3M9XCJwb3B1cFwiPlxcblx0ICAgICAgXHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiPlxcblx0ICAgICAgICBcdDxkaXYgaWQ9XCJvbmVzdGVwXCIgY2xhc3M9XCJwYW5lbCBvbmVzdGVwXCI+XFxuXHQgICAgICAgICAgXHRcdDxoZWFkZXIgY2xhc3M9XCJoZWFkZXJcIj5cXG5cdCAgICAgICAgICAgIFx0XHQ8ZGl2IGNsYXNzPVwiaW1hZ2VcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj5cXG5cdCAgICAgICAgICAgIFx0XHRcdDxpbWcgc3JjPVwiXCI+XFxuXHQgICAgICAgICAgICBcdFx0PC9kaXY+XFxuXHQgICAgICAgICAgICBcdFx0PGgxPlNpZ24gSW48L2gxPlxcblx0XHRcdCAgICAgICAgICAgIDxoMiBjbGFzcz1cImVycm9yXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+Jm5ic3A7PC9oMj5cXG5cdFx0XHQgICAgICAgICAgICA8aDIgY2xhc3M9XCJzdWNjZXNzXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+Jm5ic3A7PC9oMj5cXG5cdFx0XHQgICAgICAgICAgICA8YSBjbGFzcz1cImNsb3NlXCI+Q2xvc2U8L2E+XFxuXHQgICAgICAgICAgXHRcdDwvaGVhZGVyPlxcblxcblx0ICAgICAgICAgIFx0XHQ8ZGl2IGNsYXNzPVwibG9hZGluZ1wiPjwvZGl2Plxcblxcblx0ICAgICAgICAgIFx0XHQ8ZGl2IGNsYXNzPVwibG9nZ2VkaW5cIj5cXG5cdFx0XHQgICAgICAgICAgICA8Zm9ybT5cXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2VudGVyZWQgbGFzdC10aW1lXCI+PC9zcGFuPlxcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInN0cmF0ZWd5XCI+PC9kaXY+XFxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZW1haWxQYXNzd29yZFwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+XFxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlbWFpbFwiPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZW1haWwtcmVhZG9ubHlcIj48L3NwYW4+XFxuXHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IG5hbWU9XCJlbWFpbFwiIHR5cGU9XCJlbWFpbFwiIHZhbHVlPVwiXCIgZGlzYWJsZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPVwiXCIgYXV0b2ZvY3VzIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIiB0aXRsZT1cIlBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJ6b2NpYWwgcHJpbWFyeSBuZXh0XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIj5TaWduIEluPC9idXR0b24+XFxuXHRcdFx0XHRcdFx0XHRcdCAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInNwaW5uZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2J1dHRvbj5cXG5cdFx0XHRcdFx0XHRcdFx0ICBcdDxsYWJlbCBjbGFzcz1cImNyZWF0ZS1hY2NvdW50XCI+PGEgaHJlZj1cImphdmFzY3JpcHQ6IHt9XCIgY2xhc3M9XCJmb3Jnb3QtcGFzc1wiPkZvcmdvdCB5b3VyIHBhc3N3b3JkPzwvYT48L2xhYmVsPlxcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjZW50ZXJlZCBhbGxcIj5TaG93IGFsbDwvc3Bhbj5cXG5cdFx0XHQgICAgICAgICAgICA8L2Zvcm0+XFxuXHQgICAgICAgICAgXHRcdDwvZGl2Plxcblxcblx0XHQgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwibm90bG9nZ2VkaW5cIj5cXG5cdFx0XHQgICAgICAgICAgICA8Zm9ybT5cXG5cdFx0XHQgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJpY29ubGlzdFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjxwIHN0eWxlPVwiZGlzcGxheTpub25lXCI+Li4uIG9yIHNpZ24gaW4gdXNpbmc8L3A+PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJzZXBhcmF0b3JcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48c3Bhbj5vcjwvc3Bhbj48L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImVtYWlsUGFzc3dvcmRcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgICBcdFx0PGlucHV0IG5hbWU9XCJlbWFpbFwiIGlkPVwic2lnbmluX2Vhc3lfZW1haWxcIiB0eXBlPVwiZW1haWxcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgdGl0bGU9XCJFbWFpbFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgXHRcdDxpbnB1dCBuYW1lPVwicGFzc3dvcmRcIiBpZD1cInNpZ25pbl9lYXN5X3Bhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIHRpdGxlPVwiUGFzc3dvcmRcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiem9jaWFsIHByaW1hcnkgbmV4dFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCI+U2lnbiBJbjwvYnV0dG9uPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInNwaW5uZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2J1dHRvbj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGxhYmVsIGNsYXNzPVwiY3JlYXRlLWFjY291bnRcIj48YSBocmVmPVwiamF2YXNjcmlwdDoge31cIiBjbGFzcz1cInNpZ24tdXBcIj5TaWduIFVwPC9hPjxzcGFuIGNsYXNzPVwiZGl2aWRlclwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+Jm5ic3A74oCiJm5ic3A7PC9zcGFuPjxhIGhyZWY9XCJqYXZhc2NyaXB0OiB7fVwiIGNsYXNzPVwiZm9yZ290LXBhc3NcIj5Gb3Jnb3QgeW91ciBwYXNzd29yZD88L2E+PC9sYWJlbD5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgPC9mb3JtPlxcblx0XHQgICAgICAgICAgXHQ8L2Rpdj5cXG5cXG5cdFx0ICAgICAgICAgIFx0PGRpdiBjbGFzcz1cInNpZ251cFwiPlxcblx0XHRcdCAgICAgICAgICAgIDxmb3JtPlxcblx0XHRcdCAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJlbWFpbFBhc3N3b3JkXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImVtYWlsXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgXHRcdDxpbnB1dCBuYW1lPVwiZW1haWxcIiBpZD1cInNpZ251cF9lYXN5X2VtYWlsXCIgdHlwZT1cImVtYWlsXCIgdmFsdWU9XCJcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgdGl0bGU9XCJFbWFpbFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgaWQ9XCJzaWdudXBfZWFzeV9wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJDcmVhdGUgYSBQYXNzd29yZFwiIHRpdGxlPVwiUGFzc3dvcmRcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiem9jaWFsIHByaW1hcnkgbmV4dFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCI+U2lnbiBVcDwvYnV0dG9uPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInNwaW5uZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2J1dHRvbj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImZvb3RlclwiPjwvZGl2Plxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwib3B0aW9uc1wiPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgICBcdDxhIGhyZWY9XCJqYXZhc2NyaXB0OiB7fVwiIGNsYXNzPVwiY2VudGVyZWQgY2FuY2VsXCI+Q2FuY2VsPC9hPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgPC9mb3JtPlxcblx0XHQgICAgICAgICAgXHQ8L2Rpdj5cXG5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlc2V0XCI+XFxuXHRcdFx0XHRcdFx0PGZvcm0gaWQ9XCJjaGFuZ2VfcGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHQgIFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPjwvZGl2Plxcblx0XHRcdFx0XHRcdCAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxQYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdCAgICBcdDxkaXYgY2xhc3M9XCJlbWFpbFwiPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cImVtYWlsXCIgaWQ9XCJyZXNldF9lYXN5X2VtYWlsXCIgdHlwZT1cImVtYWlsXCIgdmFsdWU9XCJcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgdGl0bGU9XCJFbWFpbFwiPlxcblx0XHRcdFx0XHRcdCAgICBcdDwvZGl2Plxcblx0XHRcdFx0XHRcdCAgICBcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgaWQ9XCJyZXNldF9lYXN5X3Bhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgdmFsdWU9XCJcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIk5ldyBQYXNzd29yZFwiIHRpdGxlPVwiTmV3IFBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PGRpdiBjbGFzcz1cInJlcGVhdFBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDxpbnB1dCBuYW1lPVwicmVwZWF0X3Bhc3N3b3JkXCIgaWQ9XCJyZXNldF9lYXN5X3JlcGVhdF9wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJDb25maXJtIE5ldyBQYXNzd29yZFwiIHRpdGxlPVwiQ29uZmlybSBOZXcgUGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiem9jaWFsIHByaW1hcnkgbmV4dFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCI+U2VuZDwvYnV0dG9uPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInNwaW5uZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2J1dHRvbj5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PGRpdiBjbGFzcz1cIm9wdGlvbnNcIj5cXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHQ8YSBocmVmPVwiamF2YXNjcmlwdDoge31cIiBjbGFzcz1cImNlbnRlcmVkIGNhbmNlbFwiPkNhbmNlbDwvYT5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0ICBcdDwvZGl2Plxcblx0XHRcdFx0XHRcdDwvZm9ybT5cXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFxcblx0ICAgICAgICAgIFx0XHQ8Zm9vdGVyPlxcblx0ICAgICAgICAgICAgXHRcdDxzcGFuPlBvd2VyZWQgYnkgPGEgaHJlZj1cImh0dHA6Ly9hdXRoMC5jb21cIiB0YXJnZXQ9XCJfbmV3XCI+QXV0aDA8L2E+PC9zcGFuPlxcblx0ICAgICAgICAgIFx0XHQ8L2Zvb3Rlcj5cXG5cdCAgICAgICAgXHQ8L2Rpdj5cXG5cdCAgICAgIFx0PC9kaXY+XFxuXHQgICAgPC9kaXY+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nKTsgfSkoKTtcbn0gXG5yZXR1cm4gYnVmLmpvaW4oJycpO1xufTsgcmV0dXJuIGZ1bmN0aW9uKGwpIHsgcmV0dXJuIHQobCkgfX0oKSkiLCJ2YXIgQXV0aDAgICAgID0gcmVxdWlyZSgnYXV0aDAtanMnKTtcbnZhciBxd2VyeSAgICAgPSByZXF1aXJlKCdxd2VyeScpO1xudmFyIGJvbnpvICAgICA9IHJlcXVpcmUoJ2JvbnpvJyk7XG52YXIgYmVhbiAgICAgID0gcmVxdWlyZSgnYmVhbicpO1xudmFyIHh0ZW5kICAgICA9IHJlcXVpcmUoJ3h0ZW5kJyk7XG52YXIgXyAgICAgICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG52YXIgbWFpblRtcGwgID0gcmVxdWlyZSgnLi9odG1sL21haW4uaHRtbCcpO1xuXG52YXIgJCA9IGZ1bmN0aW9uIChzZWxlY3Rvciwgcm9vdCkge1xuICByZXR1cm4gYm9uem8ocXdlcnkoJyNhdXRoMC13aWRnZXQgJyArIChzZWxlY3RvciB8fCAnJyksIHJvb3QpKTtcbn07XG5cbmZ1bmN0aW9uIEF1dGgwV2lkZ2V0IChvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBdXRoMFdpZGdldCkpIHtcbiAgICByZXR1cm4gbmV3IEF1dGgwV2lkZ2V0KG9wdGlvbnMpO1xuICB9XG5cbiAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMuX2F1dGgwID0gbmV3IEF1dGgwKHtcbiAgICBjbGllbnRJRDogICAgIHRoaXMuX29wdGlvbnMuY2xpZW50SUQsIFxuICAgIGNhbGxiYWNrVVJMOiAgdGhpcy5fb3B0aW9ucy5jYWxsYmFja1VSTCxcbiAgICBkb21haW46ICAgICAgIHRoaXMuX29wdGlvbnMuZG9tYWluXG4gIH0pO1xuICBcbiAgdGhpcy5fc3RyYXRlZ2llcyA9IHtcbiAgICAnZ29vZ2xlLW9wZW5pZCc6IHsgY3NzOiAnZ29vZ2xlJywgbmFtZTogJ0dvb2dsZSBPcGVuSWQnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnZ29vZ2xlLWFwcHMnOiB7IGNzczogJ2dvb2dsZScsIG5hbWU6ICdHb29nbGUgQXBwcycsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnZ29vZ2xlLW9hdXRoMic6IHsgY3NzOiAnZ29vZ2xlcGx1cycsIG5hbWU6ICdHb29nbGUnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnZmFjZWJvb2snOiB7IGNzczogJ2ZhY2Vib29rJywgbmFtZTogJ0ZhY2Vib29rJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ3dpbmRvd3NsaXZlJzogeyBjc3M6ICd3aW5kb3dzJywgbmFtZTogJ01pY3Jvc29mdCBBY2NvdW50Jywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2xpbmtlZGluJzogeyBjc3M6ICdsaW5rZWRpbicsIG5hbWU6ICdMaW5rZWRJbicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdnaXRodWInOiB7IGNzczogJ2dpdGh1YicsIG5hbWU6ICdHaXRIdWInLCBzb2NpYWw6IHRydWUgfSxcbiAgICAncGF5cGFsJzogeyBjc3M6ICdwYXlwYWwnLCBuYW1lOiAnUGF5UGFsJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ3R3aXR0ZXInOiB7IGNzczogJ3R3aXR0ZXInLCBuYW1lOiAnVHdpdHRlcicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdhbWF6b24nOiB7IGNzczogJ2FtYXpvbicsIG5hbWU6ICdBbWF6b24nLCBzb2NpYWw6IHRydWUgfSxcbiAgICAndmtvbnRha3RlJzogeyBjc3M6ICd2aycsIG5hbWU6ICd2S29udGFrdGUnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAneWFuZGV4JzogeyBjc3M6ICd5YW5kZXgnLCBuYW1lOiAnWWFuZGV4Jywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ29mZmljZTM2NSc6IHsgY3NzOiAnb2ZmaWNlMzY1JywgbmFtZTogJ09mZmljZTM2NScsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnd2FhZCc6IHsgY3NzOiAnd2FhZCcsIG5hbWU6ICdXaW5kb3dzIEF6dXJlIEFEJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdhZGZzJzogeyBjc3M6ICd3aW5kb3dzJywgbmFtZTogJ0FERlMnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ3NhbWxwJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdTQU1MJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdtc2NybSc6IHsgY3NzOiAnZ3Vlc3QnLCBuYW1lOiAnRHluYW1pY3MgQ1JNJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdhZCc6IHsgY3NzOiAnd2luZG93cycsIG5hbWU6ICdBRCAvIExEQVAnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2N1c3RvbSc6IHsgY3NzOiAnZ3Vlc3QnLCBuYW1lOiAnQ3VzdG9tIEF1dGgnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2F1dGgwJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdBdXRoMCcsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnYXV0aDAtYWRsZGFwJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdBRC9MREFQJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICd0aGlydHlzZXZlbnNpZ25hbHMnOiB7IGNzczogJ3RoaXJ0eXNldmVuc2lnbmFscycsIG5hbWU6ICczNyBTaWduYWxzJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2JveCc6IHsgY3NzOiAnYm94JywgbmFtZTogJ0JveCcsIHNvY2lhbDogdHJ1ZSwgaW1hZ2VpY29uOiB0cnVlIH0sXG4gICAgJ3NhbGVzZm9yY2UnOiB7IGNzczogJ3NhbGVzZm9yY2UnLCBuYW1lOiAnU2FsZXNmb3JjZScsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdmaXRiaXQnOiB7IGNzczogJ2ZpdGJpdCcsIG5hbWU6ICdGaXRiaXQnLCBzb2NpYWw6IHRydWUgfVxuICB9O1xufVxuXG4vLyBoZWxwZXIgbWV0aG9kc1xuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zZXRUb3AgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlbGVtZW50ID0gJCgnLnNpZ25pbiBkaXYucGFuZWwub25lc3RlcCcpO1xuICBcbiAgaWYgKCF0aGlzLl9zaWduaW5PcHRpb25zLnRvcCkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBlbGVtZW50LmNzcyh7IFxuICAgICAgICAvLydtYXJnaW5Ub3AnOiAnLScgKyAoZWxlbWVudC5vZmZzZXQoKS5oZWlnaHQgLyAyKSArICdweCcsXG4gICAgICAgIC8vJ3RvcCc6ICc1MCUnXG4gICAgICAgICdtYXJnaW5Ub3AnOiAnMnB4JywgXG4gICAgICAgICd0b3AnOiAnMTUlJyBcbiAgICAgIH0pO1xuICAgIH0sIDEpO1xuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuY3NzKHtcbiAgICAgICdtYXJnaW5Ub3AnOiAnMnB4JyxcbiAgICAgICd0b3AnOiAnMCdcbiAgICB9KTtcbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93RXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgaWYgKCFlcnJvcikgcmV0dXJuO1xuICAkKCcuc2lnbmluIGgxJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiAuc3VjY2VzcycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gLmVycm9yJykuaHRtbChlcnJvcikuY3NzKCdkaXNwbGF5JywgJycpO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93U3VjY2VzcyA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gIGlmICghbWVzc2FnZSkgcmV0dXJuO1xuICAkKCcuc2lnbmluIGgxJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiAuZXJyb3InKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbmluIC5zdWNjZXNzJykuaHRtbChtZXNzYWdlKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2lzQXV0aDBDb25uID0gZnVuY3Rpb24gKHN0cmF0ZWd5KSB7XG4gIHJldHVybiBzdHJhdGVneSA9PT0gJ2F1dGgwJyB8fCBzdHJhdGVneSA9PT0gJ2F1dGgwLWFkbGRhcCc7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NldFRpdGxlID0gZnVuY3Rpb24odGl0bGUpIHtcbiAgJCgnLnNpZ25pbiAuZXJyb3InKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbmluIC5zdWNjZXNzJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiBoMScpLmh0bWwodGl0bGUpLmNzcygnZGlzcGxheScsICcnKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fcGFyc2VSZXNwb25zZU1lc3NhZ2UgPSBmdW5jdGlvbiAocmVzcG9uc2VPYmosIGRlZmF1bHRWYWx1ZSkge1xuICByZXR1cm4gdGhpcy5fc2lnbmluT3B0aW9uc1tyZXNwb25zZU9iai5jb2RlXSB8fCByZXNwb25zZU9iai5tZXNzYWdlIHx8IGRlZmF1bHRWYWx1ZTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5faXNBZExkYXBDb25uID0gZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcbiAgcmV0dXJuIGNvbm5lY3Rpb24gPT09ICdhZGxkYXAnO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9hcmVUaGVyZUFueVNvY2lhbENvbm4gPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICBpZiAodGhpcy5fc3RyYXRlZ2llc1t0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXS5uYW1lXSAmJiB0aGlzLl9zdHJhdGVnaWVzW3RoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdLm5hbWVdLnNvY2lhbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9hcmVUaGVyZUFueUVudGVycHJpc2VPckRiQ29ubiA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgaWYgKHRoaXMuX3N0cmF0ZWdpZXNbdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZV0gJiYgXG4gICAgICAgICF0aGlzLl9zdHJhdGVnaWVzW3RoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdLm5hbWVdLnNvY2lhbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9pc0VudGVycHJpc2VDb25uZWN0aW9uID0gZnVuY3Rpb24gKGVtYWlsLCBvdXRwdXQpIHtcbiAgdmFyIGVtYWlsTSA9IC9eKChbXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXF0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvXG4gICAgICAgICAgICAgICAgICAgIC5leGVjKGVtYWlsLnRvTG93ZXJDYXNlKCkpO1xuXG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICB2YXIgc3RyYXRlZ3kgPSB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXTtcbiAgICBpZiAodGhpcy5faXNBdXRoMENvbm4oc3RyYXRlZ3kubmFtZSkpIGNvbnRpbnVlO1xuXG4gICAgZm9yICh2YXIgYyBpbiBzdHJhdGVneS5jb25uZWN0aW9ucykge1xuICAgICAgaWYgKGVtYWlsTSAmJiBlbWFpbE0uc2xpY2UoLTIpWzBdID09IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbikge1xuICAgICAgICBvdXRwdXQgPSBvdXRwdXQgfHzCoHt9O1xuICAgICAgICBvdXRwdXQuZG9tYWluID0gc3RyYXRlZ3kuY29ubmVjdGlvbnNbY10uZG9tYWluO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2lzRW50ZXJwcmlzZVN0cmF0ZWd5ID0gZnVuY3Rpb24gKHN0cmF0ZWd5KSB7IFxuICBmb3IgKHZhciBzIGluIHRoaXMuX3N0cmF0ZWdpZXMpIHtcbiAgICBpZiAocyA9PT0gc3RyYXRlZ3kgJiYgIXRoaXMuX3N0cmF0ZWdpZXNbc10uc29jaWFsKSB7IFxuICAgICAgcmV0dXJuIHRydWU7IFxuICAgIH0gXG4gIH0gXG5cbiAgcmV0dXJuIGZhbHNlOyBcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fZ2V0Q29uZmlndXJlZFN0cmF0ZWd5ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgZm9yICh2YXIgcyBpbiB0aGlzLl9jbGllbnQuc3RyYXRlZ2llcykge1xuICAgIGlmICh0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXSAmJiB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc107XG4gICAgfVxuICB9XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2dldEF1dGgwQ29ubmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAvLyBpZiBzcGVjaWZpZWQsIHVzZSBpdCwgb3RoZXJ3aXNlIHJldHVybiBmaXJzdFxuICBpZiAodGhpcy5fc2lnbmluT3B0aW9uc1sndXNlclB3ZENvbm5lY3Rpb25OYW1lJ10pIHtcbiAgICBmb3IgKHZhciBpIGluIHRoaXMuX2F1dGgwU3RyYXRlZ2llcykge1xuICAgICAgZm9yICh2YXIgaiBpbiB0aGlzLl9hdXRoMFN0cmF0ZWdpZXNbaV0uY29ubmVjdGlvbnMpIHtcbiAgICAgICAgaWYgKHRoaXMuX2F1dGgwU3RyYXRlZ2llc1tqXS5jb25uZWN0aW9uc1tqXS5uYW1lID09PSB0aGlzLl9zaWduaW5PcHRpb25zWyd1c2VyUHdkQ29ubmVjdGlvbk5hbWUnXSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9hdXRoMFN0cmF0ZWdpZXNbaV0uY29ubmVjdGlvbnNbal07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBCeSBkZWZhdWx0LCBpZiBleGlzdHMsIHJldHVybiBhdXRoMCBjb25uZWN0aW9uIChkYi1jb25uKVxuICB2YXIgZGVmYXVsdFN0cmF0ZWd5ID0gXy5maWx0ZXIodGhpcy5fYXV0aDBTdHJhdGVnaWVzLCBmdW5jdGlvbiAocykgeyByZXR1cm4gcy5uYW1lID09PSAnYXV0aDAnOyB9KVswXTtcbiAgcmV0dXJuIHRoaXMuX2F1dGgwU3RyYXRlZ2llcy5sZW5ndGggPiAwID8gXG4gICAgKGRlZmF1bHRTdHJhdGVneSA/IGRlZmF1bHRTdHJhdGVneS5jb25uZWN0aW9uc1swXSA6IHRoaXMuX2F1dGgwU3RyYXRlZ2llc1swXS5jb25uZWN0aW9uc1swXSkgOlxuICAgIG51bGw7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Nob3dPckhpZGVQYXNzd29yZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1haWxGaWVsZCA9ICQoJy5ub3Rsb2dnZWRpbiAuZW1haWwgaW5wdXQnKTtcbiAgdmFyIHB3ZEZpZWxkICA9ICQoJy5ub3Rsb2dnZWRpbiAucGFzc3dvcmQgaW5wdXQnKS5maXJzdCgpO1xuICBcbiAgdmFyIGlzRW50ZXJwcmlzZUNvbm5lY3Rpb24gPSB0aGlzLl9pc0VudGVycHJpc2VDb25uZWN0aW9uKG1haWxGaWVsZC52YWwoKSk7XG5cbiAgaWYgKGlzRW50ZXJwcmlzZUNvbm5lY3Rpb24pIHtcbiAgICBwd2RGaWVsZC5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIHB3ZEZpZWxkLmF0dHIoJ3BsYWNlaG9sZGVyJywgJycpO1xuICAgIHB3ZEZpZWxkLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJyk7XG4gIH0gZWxzZSB7XG4gICAgcHdkRmllbGQucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcbiAgICBwd2RGaWVsZC5hdHRyKCdwbGFjZWhvbGRlcicsIHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3Bhc3N3b3JkUGxhY2Vob2xkZXInXSk7XG4gICAgcHdkRmllbGQuYXR0cigncmVxdWlyZWQnLCB0cnVlKTtcbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9oaWRlU2lnbkluID0gZnVuY3Rpb24gKGNiKSB7XG4gICQoJ2Rpdi5vdmVybGF5JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICQoKS5yZW1vdmVDbGFzcygnbW9kZS1zaWduaW4nKTtcbiAgICAkKCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICBpZiAoY2IpIGNiKCk7XG4gIH0sIDUwMCk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2dldEFjdGl2ZUxvZ2luVmlldyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY29udGFpbmVyID0gdGhpcy5faGFzTG9nZ2VkSW5CZWZvcmUgPyAkKCcubG9nZ2VkaW4nKSA6ICQoJy5ub3Rsb2dnZWRpbicpO1xuICByZXR1cm4gY29udGFpbmVyO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl90b2dnbGVTcGlubmVyID0gZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuICBjb250YWluZXIgPSBjb250YWluZXIgfHwgdGhpcy5fZ2V0QWN0aXZlTG9naW5WaWV3KCk7XG4gIHZhciBzcGlubmVyID0gJCgnLnNwaW5uZXInLCBjb250YWluZXIpO1xuICB2YXIgc2lnbmluID0gJCgnLnpvY2lhbC5wcmltYXJ5JywgY29udGFpbmVyKTtcblxuICBzcGlubmVyLmNzcygnZGlzcGxheScsIHNwaW5uZXIuY3NzKCdkaXNwbGF5JykgPT09ICdub25lJyA/ICcnIDogJ25vbmUnKTtcbiAgc2lnbmluLmNzcygnZGlzcGxheScsIHNpZ25pbi5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnID8gJycgOiAnbm9uZScpO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93U2lnblVwRXhwZXJpZW5jZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zZXRMb2dpblZpZXcoeyBtb2RlOiAnc2lnbnVwJyB9KTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2hvd1Jlc2V0RXhwZXJpZW5jZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zZXRMb2dpblZpZXcoeyBtb2RlOiAncmVzZXQnIH0pO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93TG9hZGluZ0V4cGVyaWVuY2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2V0TG9naW5WaWV3KHsgbW9kZTogJ2xvYWRpbmcnIH0pO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zZXRMb2dpblZpZXcgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHzCoHt9O1xuXG4gICQoJy5sb2FkaW5nJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLmxvZ2dlZGluJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLm5vdGxvZ2dlZGluJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ251cCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5yZXNldCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gaW5wdXRbdHlwZT1wYXNzd29yZF0nKS52YWwoJycpO1xuXG4gIGlmICghb3B0aW9ucy5tb2RlKSB7XG4gICAgdGhpcy5faGFzTG9nZ2VkSW5CZWZvcmUgPSAhIW9wdGlvbnMuaXNSZXR1cm5pbmdVc2VyO1xuICAgIHRoaXMuX3NldFRpdGxlKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3RpdGxlJ10pO1xuXG4gICAgJChvcHRpb25zLmlzUmV0dXJuaW5nVXNlciA/ICcubG9nZ2VkaW4nIDogJy5ub3Rsb2dnZWRpbicpLmNzcygnZGlzcGxheScsICcnKTtcbiAgICBzZWxmLl9zZXRUb3AoKTtcblxuICAgIHRyeSB7IFxuICAgICAgaWYgKG9wdGlvbnMuaXNSZXR1cm5pbmdVc2VyKSAkKCcubG9nZ2VkaW4gLnBhc3N3b3JkIGlucHV0JykuZmlyc3QoKS5mb2N1cygpO1xuICAgICAgZWxzZSAkKCcubm90bG9nZ2VkaW4gLmVtYWlsIGlucHV0JykuZmlyc3QoKS5mb2N1cygpO1xuICAgIH0gY2F0Y2goZSkge31cbiAgICBcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgY29udGFpbmVyO1xuXG4gIHN3aXRjaCAob3B0aW9ucy5tb2RlKSB7XG4gICAgY2FzZSAnbG9hZGluZyc6XG4gICAgICB0aGlzLl9zZXRUaXRsZSgnUGxlYXNlIHdhaXQuLi4nKTtcbiAgICAgIGNvbnRhaW5lciA9ICQoJy5sb2FkaW5nJykuZmlyc3QoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3NpZ251cCc6XG4gICAgICB0aGlzLl9zZXRUaXRsZSh0aGlzLl9zaWduaW5PcHRpb25zWydzaWdudXBUaXRsZSddKTtcbiAgICAgIGNvbnRhaW5lciA9ICQoJy5zaWdudXAnKS5maXJzdCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmVzZXQnOlxuICAgICAgdGhpcy5fc2V0VGl0bGUodGhpcy5fc2lnbmluT3B0aW9uc1sncmVzZXRUaXRsZSddKTtcbiAgICAgIGNvbnRhaW5lciA9ICQoJy5yZXNldCcpLmZpcnN0KCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGlmIChjb250YWluZXIpIHtcbiAgICB0aGlzLl9zZXRUb3AoKTtcbiAgICBjb250YWluZXIuY3NzKCdkaXNwbGF5JywgJycpO1xuXG4gICAgdHJ5IHsgXG4gICAgICB2YXIgZW1haWwgPSAkKCcubm90bG9nZ2VkaW4gLmVtYWlsIGlucHV0JykudmFsKCk7XG4gICAgICAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLnZhbChlbWFpbCk7XG4gICAgICAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLmZpcnN0KCkuZm9jdXMoKTtcbiAgICB9IGNhdGNoKGUpIHt9XG4gIH1cbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2hvd0xvZ2dlZEluRXhwZXJpZW5jZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBzdHJhdGVneSA9IHRoaXMuX3Nzb0RhdGEubGFzdFVzZWRDb25uZWN0aW9uLnN0cmF0ZWd5O1xuICB0aGlzLl9zZXRMb2dpblZpZXcoeyBpc1JldHVybmluZ1VzZXI6ICEhc3RyYXRlZ3kgfSk7XG5cbiAgaWYgKCFzdHJhdGVneSkgcmV0dXJuO1xuXG4gIHZhciBsb2dpblZpZXcgPSB0aGlzLl9nZXRBY3RpdmVMb2dpblZpZXcoKTtcbiAgYmVhbi5vbigkKCdmb3JtJywgbG9naW5WaWV3KVswXSwgJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3NpZ25JbkVudGVycHJpc2UoZSk7IH0pO1xuICBcbiAgdmFyIGJ1dHRvbjtcbiAgaWYgKHN0cmF0ZWd5ICE9PSAnYXV0aDAnKSB7XG4gICAgYnV0dG9uID0gYm9uem8oYm9uem8uY3JlYXRlKCc8c3Bhbj48L3NwYW4+JykpXG4gICAgICAuYXR0cigndGFiaW5kZXgnLCAwKVxuICAgICAgLmF0dHIoJ2RhdGEtc3RyYXRlZ3knLCBzdHJhdGVneSlcbiAgICAgIC5hdHRyKCd0aXRsZScsIHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLm5hbWUpXG4gICAgICAuYWRkQ2xhc3MoJ3pvY2lhbCcpLmFkZENsYXNzKCdibG9jaycpXG4gICAgICAuYWRkQ2xhc3ModGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneV0uY3NzKVxuICAgICAgLmFkZENsYXNzKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLmltYWdlaWNvbiA/ICdpbWFnZS1pY29uJyA6ICcnKVxuICAgICAgLmh0bWwodGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneV0ubmFtZSk7XG4gICAgXG4gICAgYmVhbi5vbihidXR0b25bMF0sICdjbGljaycsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3NpZ25JblNvY2lhbChlLnRhcmdldCk7IH0pO1xuXG4gICAgJCgnLnN0cmF0ZWd5IHNwYW4nLCBsb2dpblZpZXcpLmVhY2goZnVuY3Rpb24gKGVsKSB7IGlmIChlbCkgZWwucmVtb3ZlKCk7IH0pO1xuICAgICQoJy5zdHJhdGVneScsIGxvZ2luVmlldykuYXBwZW5kKGJ1dHRvbik7XG4gIH1cblxuICAkKCcuYWxsJywgbG9naW5WaWV3KS5odG1sKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ2FsbEJ1dHRvblRlbXBsYXRlJ10pO1xuXG4gIGJlYW4ub24oJCgnLmFsbCcsIGxvZ2luVmlldylbMF0sICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9zZXRMb2dpblZpZXcoKTtcbiAgfSk7XG5cbiAgaWYgKHRoaXMuX3Nzb0RhdGEubGFzdFVzZWRVc2VybmFtZSkge1xuICAgIGlmIChzdHJhdGVneSA9PT0gJ2F1dGgwJykge1xuICAgICAgJCgnLmVtYWlsLXJlYWRvbmx5JywgbG9naW5WaWV3KS5odG1sKHRoaXMuX3Nzb0RhdGEubGFzdFVzZWRVc2VybmFtZSk7IFxuICAgICAgJCgnLmVtYWlsIGlucHV0JywgbG9naW5WaWV3KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgJCgnLmVtYWlsUGFzc3dvcmQnLCBsb2dpblZpZXcpLmNzcygnZGlzcGxheScsICcnKTtcbiAgICB9IFxuICAgIGVsc2UgaWYgKHRoaXMuX2lzRW50ZXJwcmlzZVN0cmF0ZWd5KHN0cmF0ZWd5KSkge1xuICAgICAgYnV0dG9uLmh0bWwodGhpcy5fc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lIHx8IHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLm5hbWUpXG4gICAgICAgICAgICAuYXR0cigndGl0bGUnLCB0aGlzLl9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUgfHwgdGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneV0ubmFtZSk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBzaWduIGluIG1ldGhvZHNcbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2lnbkluU29jaWFsID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBzdHJhdGVneU5hbWUgPSB0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyA/IHRhcmdldCA6IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RyYXRlZ3knKTtcbiAgdmFyIHN0cmF0ZWd5ID0gdGhpcy5fZ2V0Q29uZmlndXJlZFN0cmF0ZWd5KHN0cmF0ZWd5TmFtZSk7XG5cbiAgaWYgKHN0cmF0ZWd5KSB7XG4gICAgdmFyIGxvZ2luT3B0aW9ucyA9IHh0ZW5kKHsgY29ubmVjdGlvbjogc3RyYXRlZ3kuY29ubmVjdGlvbnNbMF0ubmFtZSB9LCBzZWxmLl9zaWduaW5PcHRpb25zLmV4dHJhUGFyYW1ldGVycyk7XG4gICAgdGhpcy5fYXV0aDAubG9naW4obG9naW5PcHRpb25zKTtcbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaWduSW5FbnRlcnByaXNlID0gZnVuY3Rpb24gKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2dldEFjdGl2ZUxvZ2luVmlldygpO1xuICB2YXIgZm9ybSA9ICQoJ2Zvcm0nLCBjb250YWluZXIpO1xuICB2YXIgdmFsaWQgPSB0cnVlO1xuXG4gIHZhciBlbWFpbEQgPSAkKCcuZW1haWwnLCBmb3JtKSxcbiAgICAgIGVtYWlsRSA9ICQoJ2lucHV0W25hbWU9ZW1haWxdJywgZm9ybSksXG4gICAgICBlbWFpbE0gPSAvXigoW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKyhcXC5bXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKSopfChcXFwiLitcXFwiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFxdKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkLy5leGVjKGVtYWlsRS52YWwoKS50b0xvd2VyQ2FzZSgpKSxcbiAgICAgIGVtYWlsUCA9IC9eXFxzKiQvLnRlc3QoZW1haWxFLnZhbCgpKSxcbiAgICAgIGRvbWFpbiwgY29ubmVjdGlvbiwgZW1haWwgPSBudWxsLCBzdHJhdGVneTtcblxuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgc3RyYXRlZ3kgPSB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXTtcblxuICAgIGlmICh0aGlzLl9pc0F1dGgwQ29ubihzdHJhdGVneS5uYW1lKSkgY29udGludWU7XG5cbiAgICBmb3IgKHZhciBjIGluIHN0cmF0ZWd5LmNvbm5lY3Rpb25zKSB7XG4gICAgICBpZighZW1haWxQICYmIGVtYWlsTSAmJiBlbWFpbE0uc2xpY2UoLTIpWzBdID09IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbikge1xuICAgICAgICBkb21haW4gPSBzdHJhdGVneS5jb25uZWN0aW9uc1tjXS5kb21haW47XG4gICAgICAgIGNvbm5lY3Rpb24gPSBzdHJhdGVneS5jb25uZWN0aW9uc1tjXS5uYW1lO1xuICAgICAgICBlbWFpbCA9IGVtYWlsRS52YWwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRvbWFpbikgYnJlYWs7XG4gIH1cblxuICBpZiAoZW1haWxQKSB7XG4gICAgdGhpcy5fc2hvd0Vycm9yKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxFbXB0eSddKTtcbiAgfSBcbiAgZWxzZSBpZiAoIWVtYWlsTSkge1xuICAgIHRoaXMuX3Nob3dFcnJvcih0aGlzLl9zaWduaW5PcHRpb25zWydzdHJhdGVneUVtYWlsSW52YWxpZCddKTtcbiAgfSBcbiAgZWxzZSBpZiAoIWRvbWFpbikge1xuICAgIGlmICh0aGlzLl9hdXRoMFN0cmF0ZWdpZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NpZ25JbldpdGhBdXRoMChlbWFpbEUudmFsKCkpO1xuICAgIH1cblxuICAgIGlmIChlbWFpbE0gJiYgZW1haWxNLnNsaWNlKC0yKVswXSA9PT0gJ2dtYWlsLmNvbScpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zaWduSW5Tb2NpYWwoJ2dvb2dsZS1vYXV0aDInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zaG93RXJyb3IoXG4gICAgICB0aGlzLl9zaWduaW5PcHRpb25zWydzdHJhdGVneURvbWFpbkludmFsaWQnXVxuICAgICAgICAgIC5yZXBsYWNlKCd7ZG9tYWlufScsIGVtYWlsTSA/IGVtYWlsTS5zbGljZSgtMilbMF0gOiAnJykpO1xuICB9XG5cbiAgdmFsaWQgJj0gKCFkb21haW4gJiYgIWVtYWlsRC5hZGRDbGFzcygnaW52YWxpZCcpKSB8fCAoISFkb21haW4gJiYgISFlbWFpbEQucmVtb3ZlQ2xhc3MoJ2ludmFsaWQnKSk7XG5cbiAgaWYgKHZhbGlkKSB7XG4gICAgdmFyIGxvZ2luT3B0aW9ucyA9IHh0ZW5kKHsgY29ubmVjdGlvbjogY29ubmVjdGlvbiB9LCBzZWxmLl9zaWduaW5PcHRpb25zLmV4dHJhUGFyYW1ldGVycyk7XG4gICAgdGhpcy5fYXV0aDAubG9naW4obG9naW5PcHRpb25zKTtcbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaWduSW5XaXRoQXV0aDAgPSBmdW5jdGlvbiAodXNlck5hbWUsIHNpZ25JblBhc3N3b3JkKSB7XG4gIHRoaXMuX3RvZ2dsZVNwaW5uZXIoKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjb250YWluZXIgPSB0aGlzLl9nZXRBY3RpdmVMb2dpblZpZXcoKTtcbiAgdmFyIGNvbm5lY3Rpb24gID0gdGhpcy5fZ2V0QXV0aDBDb25uZWN0aW9uKCk7XG4gIFxuICB2YXIgbG9naW5PcHRpb25zID0ge1xuICAgIGNvbm5lY3Rpb246IGNvbm5lY3Rpb24ubmFtZSxcbiAgICB1c2VybmFtZTogdGhpcy5faXNBZExkYXBDb25uKGNvbm5lY3Rpb24ubmFtZSkgPyB1c2VyTmFtZS5yZXBsYWNlKCdAJyArIGNvbm5lY3Rpb24uZG9tYWluLCAnJykgOiB1c2VyTmFtZSxcbiAgICBwYXNzd29yZDogc2lnbkluUGFzc3dvcmQgfHzCoCQoJy5wYXNzd29yZCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKClcbiAgfTtcblxuICBsb2dpbk9wdGlvbnMgPSB4dGVuZChsb2dpbk9wdGlvbnMsIHNlbGYuX3NpZ25pbk9wdGlvbnMuZXh0cmFQYXJhbWV0ZXJzKTtcblxuICB0aGlzLl9hdXRoMC5sb2dpbihsb2dpbk9wdGlvbnMsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBzZWxmLl9zaG93RXJyb3Ioc2VsZi5fcGFyc2VSZXNwb25zZU1lc3NhZ2UoZXJyLCBzZWxmLl9zaWduaW5PcHRpb25zWyd3cm9uZ0VtYWlsUGFzc3dvcmRFcnJvclRleHQnXSkpO1xuICAgIH1cblxuICAgIHNlbGYuX3RvZ2dsZVNwaW5uZXIoKTtcbiAgfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NpZ25VcFdpdGhBdXRoMCA9IGZ1bmN0aW9uIChlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjb250YWluZXIgPSAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLnNpZ251cCcpO1xuICB2YXIgZW1haWwgPSAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgcGFzc3dvcmQgPSAkKCcucGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgY29ubmVjdGlvbiAgPSB0aGlzLl9nZXRBdXRoMENvbm5lY3Rpb24oKTtcblxuICB0aGlzLl90b2dnbGVTcGlubmVyKGNvbnRhaW5lcik7XG5cbiAgdGhpcy5fYXV0aDAuc2lnbnVwKHtcbiAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uLm5hbWUsXG4gICAgdXNlcm5hbWU6ICAgZW1haWwsXG4gICAgcGFzc3dvcmQ6ICAgcGFzc3dvcmRcbiAgfSwgXG4gIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBzZWxmLl9zaG93RXJyb3Ioc2VsZi5fcGFyc2VSZXNwb25zZU1lc3NhZ2UoZXJyLCBzZWxmLl9zaWduaW5PcHRpb25zWydzaWdudXBTZXJ2ZXJFcnJvclRleHQnXSkpO1xuICAgICAgc2VsZi5fdG9nZ2xlU3Bpbm5lcihjb250YWluZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxmLl9zaWduSW5XaXRoQXV0aDAoZW1haWwsIHBhc3N3b3JkKTtcbiAgfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Jlc2V0UGFzc3dvcmRXaXRoQXV0aDAgPSBmdW5jdGlvbiAoZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY29udGFpbmVyID0gJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5yZXNldCcpO1xuICB2YXIgZW1haWwgPSAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgcGFzc3dvcmQgPSAkKCcucGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgY29ubmVjdGlvbiAgPSB0aGlzLl9nZXRBdXRoMENvbm5lY3Rpb24oKTtcblxuICB0aGlzLl90b2dnbGVTcGlubmVyKGNvbnRhaW5lcik7XG5cbiAgdGhpcy5fYXV0aDAuY2hhbmdlUGFzc3dvcmQoe1xuICAgIGNvbm5lY3Rpb246IGNvbm5lY3Rpb24ubmFtZSxcbiAgICB1c2VybmFtZTogICBlbWFpbCxcbiAgICBwYXNzd29yZDogICBwYXNzd29yZFxuICB9LCBcbiAgZnVuY3Rpb24gKGVycikge1xuICAgIHNlbGYuX3RvZ2dsZVNwaW5uZXIoY29udGFpbmVyKTtcblxuICAgICQoJy5wYXNzd29yZCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKCcnKTtcbiAgICAkKCcucmVwZWF0UGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgnJyk7XG5cbiAgICBpZiAoZXJyKSB7XG4gICAgICBzZWxmLl9zaG93RXJyb3Ioc2VsZi5fcGFyc2VSZXNwb25zZU1lc3NhZ2UoZXJyLCBzZWxmLl9zaWduaW5PcHRpb25zWydyZXNldFNlcnZlckVycm9yVGV4dCddKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJCgnLmVtYWlsIGlucHV0JywgY29udGFpbmVyKS52YWwoJycpO1xuXG4gICAgdHJ5IHsgXG4gICAgICAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLmZpcnN0KCkuZm9jdXMoKTsgXG4gICAgfSBjYXRjaChlKSB7fSAgXG5cbiAgICBzZWxmLl9zZXRMb2dpblZpZXcoKTtcbiAgICBzZWxmLl9zaG93U3VjY2VzcyhzZWxmLl9zaWduaW5PcHRpb25zWydyZXNldFN1Y2Nlc3NUZXh0J10pO1xuICB9KTtcbn07XG5cbi8vIGluaXRpYWxpemVcbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5faW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChjYikge1xuICAvLyBUT0RPOiBzdXBwb3J0IGNzcyBvcHRpb24gZm9yIG5vbiBmcmVlIHN1YnNjcmlwdGlvbnNcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gICQoKS5hZGRDbGFzcygnbW9kZS1zaWduaW4nKTtcblxuICAvLyBidXR0b25zIGFjdGlvbnNcbiAgYmVhbi5vbigkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgYS5jbG9zZScpWzBdLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7IHNlbGYuX2hpZGVTaWduSW4oKTsgfSk7XG4gIGJlYW4ub24oJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5ub3Rsb2dnZWRpbiBmb3JtJylbMF0sICdzdWJtaXQnLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9zaWduSW5FbnRlcnByaXNlKGUpOyB9KTtcbiAgYmVhbi5vbigkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLnNpZ251cCBmb3JtJylbMF0sICdzdWJtaXQnLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9zaWduVXBXaXRoQXV0aDAoZSk7IH0pO1xuICBiZWFuLm9uKCQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAucmVzZXQgZm9ybScpWzBdLCAnc3VibWl0JywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fcmVzZXRQYXNzd29yZFdpdGhBdXRoMChlKTsgfSk7XG4gIGJlYW4ub24ocXdlcnkoJ2h0bWwnKVswXSwgJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoJCgpLmhhc0NsYXNzKCdtb2RlLXNpZ25pbicpKSB7XG4gICAgICBpZiAoKGUud2hpY2ggPT0gMjcgfHwgZS5rZXljb2RlID09IDI3KSAmJiAhc2VsZi5fc2lnbmluT3B0aW9ucy5zdGFuZGFsb25lKSB7XG4gICAgICAgIHNlbGYuX2hpZGVTaWduSW4oKTsgLy8gY2xvc2UgcG9wdXAgd2l0aCBFU0Mga2V5XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBsYWJlbHMgdGV4dFxuICB2YXIgb3B0aW9ucyA9IHh0ZW5kKHRoaXMuX3NpZ25pbk9wdGlvbnMsIHRoaXMuX3NpZ25pbk9wdGlvbnMucmVzb3VyY2VzKTtcbiAgb3B0aW9uc1sndGl0bGUnXSA9IG9wdGlvbnNbJ3RpdGxlJ10gfHwgJ1NpZ24gSW4nO1xuICBvcHRpb25zWydhbGxCdXR0b25UZW1wbGF0ZSddID0gb3B0aW9uc1snYWxsQnV0dG9uVGVtcGxhdGUnXSB8fCBcIlNob3cgYWxsXCI7XG4gIG9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxFbXB0eSddID0gb3B0aW9uc1snc3RyYXRlZ3lFbWFpbEVtcHR5J10gfHwgXCJUaGUgZW1haWwgaXMgZW1wdHkuXCI7XG4gIG9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxJbnZhbGlkJ10gPSBvcHRpb25zWydzdHJhdGVneUVtYWlsSW52YWxpZCddIHx8IFwiVGhlIGVtYWlsIGlzIGludmFsaWQuXCI7XG4gIG9wdGlvbnNbJ3N0cmF0ZWd5RG9tYWluSW52YWxpZCddID0gb3B0aW9uc1snc3RyYXRlZ3lEb21haW5JbnZhbGlkJ10gfHwgXCJUaGUgZG9tYWluIHtkb21haW59IGhhcyBub3QgYmVlbiBzZXR1cC5cIjtcblxuICBvcHRpb25zWydpY29uJ10gPSBvcHRpb25zWydpY29uJ10gfHwgXCJodHRwczovL2QxOXA0emVtY3ljbTdhLmNsb3VkZnJvbnQubmV0L3cyL2ltZy9sb2dvLTMyLnBuZ1wiO1xuICBvcHRpb25zWydzaG93SWNvbiddID0gdHlwZW9mIG9wdGlvbnNbJ3Nob3dJY29uJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2hvd0ljb24nXSA6IGZhbHNlO1xuICBvcHRpb25zWydzaG93U2lnbnVwJ10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd1NpZ251cCddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3Nob3dTaWdudXAnXSA6IHRydWU7XG4gIG9wdGlvbnNbJ3Nob3dGb3Jnb3QnXSA9IHR5cGVvZiBvcHRpb25zWydzaG93Rm9yZ290J10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2hvd0ZvcmdvdCddIDogdHJ1ZTtcbiAgb3B0aW9uc1snc2lnbnVwVGV4dCddID0gb3B0aW9uc1snc2lnbnVwVGV4dCddIHx8ICdTaWduIFVwJztcbiAgb3B0aW9uc1snZm9yZ290VGV4dCddID0gb3B0aW9uc1snZm9yZ290VGV4dCddIHx8ICdGb3Jnb3QgeW91ciBwYXNzd29yZD8nO1xuICBvcHRpb25zWydzaWduSW5CdXR0b25UZXh0J10gPSBvcHRpb25zWydzaWduSW5CdXR0b25UZXh0J10gfHwgJ1NpZ24gSW4nO1xuICBvcHRpb25zWydlbWFpbFBsYWNlaG9sZGVyJ10gPSBvcHRpb25zWydlbWFpbFBsYWNlaG9sZGVyJ10gfHwgJ0VtYWlsJztcbiAgb3B0aW9uc1sncGFzc3dvcmRQbGFjZWhvbGRlciddID0gb3B0aW9uc1sncGFzc3dvcmRQbGFjZWhvbGRlciddIHx8ICdQYXNzd29yZCc7XG4gIG9wdGlvbnNbJ3NlcGFyYXRvclRleHQnXSA9IG9wdGlvbnNbJ3NlcGFyYXRvclRleHQnXSB8fCAnb3InO1xuICBvcHRpb25zWydzZXJ2ZXJFcnJvclRleHQnXSA9IG9wdGlvbnNbJ3NlcnZlckVycm9yVGV4dCddIHx8ICdUaGVyZSB3YXMgYW4gZXJyb3IgcHJvY2Vzc2luZyB0aGUgc2lnbiBpbi4nO1xuICBvcHRpb25zWydzaG93RW1haWwnXSA9IHR5cGVvZiBvcHRpb25zWydzaG93RW1haWwnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93RW1haWwnXSA6IHRydWU7XG4gIG9wdGlvbnNbJ3Nob3dQYXNzd29yZCddID0gdHlwZW9mIG9wdGlvbnNbJ3Nob3dQYXNzd29yZCddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3Nob3dQYXNzd29yZCddIDogdHJ1ZTtcbiAgb3B0aW9uc1snZW5hYmxlUmV0dXJuVXNlckV4cGVyaWVuY2UnXSA9IHR5cGVvZiBvcHRpb25zWydlbmFibGVSZXR1cm5Vc2VyRXhwZXJpZW5jZSddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ2VuYWJsZVJldHVyblVzZXJFeHBlcmllbmNlJ10gOiB0cnVlO1xuICBvcHRpb25zWydyZXR1cm5Vc2VyTGFiZWwnXSA9IG9wdGlvbnNbJ3JldHVyblVzZXJMYWJlbCddIHx8ICdMYXN0IHRpbWUgeW91IHNpZ25lZCBpbiB1c2luZy4uLic7XG4gIG9wdGlvbnNbJ3dyb25nRW1haWxQYXNzd29yZEVycm9yVGV4dCddID0gb3B0aW9uc1snd3JvbmdFbWFpbFBhc3N3b3JkRXJyb3JUZXh0J10gfHwgJ1dyb25nIGVtYWlsIG9yIHBhc3N3b3JkLic7XG5cbiAgLy8gc2lnbnVwXG4gIG9wdGlvbnNbJ3NpZ251cFRpdGxlJ10gPSBvcHRpb25zWydzaWdudXBUaXRsZSddIHx8ICdTaWduIFVwJztcbiAgb3B0aW9uc1snc2lnbnVwQnV0dG9uVGV4dCddID0gb3B0aW9uc1snc2lnbnVwQnV0dG9uVGV4dCddIHx8ICdTaWduIFVwJztcbiAgb3B0aW9uc1snc2lnbnVwRW1haWxQbGFjZWhvbGRlciddID0gb3B0aW9uc1snc2lnbnVwRW1haWxQbGFjZWhvbGRlciddIHx8ICdFbWFpbCc7XG4gIG9wdGlvbnNbJ3NpZ251cFBhc3N3b3JkUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ3NpZ251cFBhc3N3b3JkUGxhY2Vob2xkZXInXSB8fCAnQ3JlYXRlIGEgUGFzc3dvcmQnO1xuICBvcHRpb25zWydzaWdudXBDYW5jZWxCdXR0b25UZXh0J10gPSBvcHRpb25zWydzaWdudXBDYW5jZWxCdXR0b25UZXh0J10gfHwgJ0NhbmNlbCc7XG4gIG9wdGlvbnNbJ3NpZ251cEhlYWRlclRleHQnXSA9IHR5cGVvZiBvcHRpb25zWydzaWdudXBIZWFkZXJUZXh0J10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2lnbnVwSGVhZGVyVGV4dCddIDogJ1BsZWFzZSBlbnRlciB5b3VyIGVtYWlsIGFuZCBwYXNzd29yZCc7XG4gIG9wdGlvbnNbJ3NpZ251cEZvb3RlclRleHQnXSA9IHR5cGVvZiBvcHRpb25zWydzaWdudXBGb290ZXJUZXh0J10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2lnbnVwRm9vdGVyVGV4dCddIDogJ0J5IGNsaWNraW5nIFwiU2lnbiBVcFwiLCB5b3UgYWdyZWUgdG8gb3VyIHRlcm1zIG9mIHNlcnZpY2UgYW5kIHByaXZhY3kgcG9saWN5Lic7XG4gIG9wdGlvbnNbJ3NpZ251cEVudGVycHJpc2VFbWFpbFdhcm5pbmdUZXh0J10gPSBvcHRpb25zWydzaWdudXBFbnRlcnByaXNlRW1haWxXYXJuaW5nVGV4dCddIHx8ICdUaGlzIGRvbWFpbiB7ZG9tYWlufSBoYXMgYmVlbiBjb25maWd1cmVkIGZvciBTaW5nbGUgU2lnbiBPbiBhbmQgeW91IGNhblxcJ3QgY3JlYXRlIGFuIGFjY291bnQuIFRyeSBzaWduaW5nIGluIGluc3RlYWQuJztcbiAgb3B0aW9uc1snc2lnbnVwU2VydmVyRXJyb3JUZXh0J10gPSBvcHRpb25zWydzaWdudXBTZXJ2ZXJFcnJvclRleHQnXSB8fCAnVGhlcmUgd2FzIGFuIGVycm9yIHByb2Nlc3NpbmcgdGhlIHNpZ24gdXAuJztcblxuICAvLyByZXNldFxuICBvcHRpb25zWydyZXNldFRpdGxlJ10gPSBvcHRpb25zWydyZXNldFRpdGxlJ10gfHwgJ1Jlc2V0IFBhc3N3b3JkJztcbiAgb3B0aW9uc1sncmVzZXRCdXR0b25UZXh0J10gPSBvcHRpb25zWydyZXNldEJ1dHRvblRleHQnXSB8fCAnU2VuZCc7XG4gIG9wdGlvbnNbJ3Jlc2V0RW1haWxQbGFjZWhvbGRlciddID0gb3B0aW9uc1sncmVzZXRFbWFpbFBsYWNlaG9sZGVyJ10gfHwgJ0VtYWlsJztcbiAgb3B0aW9uc1sncmVzZXRQYXNzd29yZFBsYWNlaG9sZGVyJ10gPSBvcHRpb25zWydyZXNldFBhc3N3b3JkUGxhY2Vob2xkZXInXSB8fCAnTmV3IFBhc3N3b3JkJztcbiAgb3B0aW9uc1sncmVzZXRSZXBlYXRQYXNzd29yZFBsYWNlaG9sZGVyJ10gPSBvcHRpb25zWydyZXNldFJlcGVhdFBhc3N3b3JkUGxhY2Vob2xkZXInXSB8fCAnQ29uZmlybSBOZXcgUGFzc3dvcmQnO1xuICBvcHRpb25zWydyZXNldENhbmNlbEJ1dHRvblRleHQnXSA9IG9wdGlvbnNbJ3Jlc2V0Q2FuY2VsQnV0dG9uVGV4dCddIHx8ICdDYW5jZWwnO1xuICBvcHRpb25zWydyZXNldFN1Y2Nlc3NUZXh0J10gPSBvcHRpb25zWydyZXNldFN1Y2Nlc3NUZXh0J10gfHwgJ1dlXFwndmUganVzdCBzZW50IHlvdSBhbiBlbWFpbCB0byByZXNldCB5b3VyIHBhc3N3b3JkLic7XG4gIG9wdGlvbnNbJ3Jlc2V0RW50ZXJTYW1lUGFzc3dvcmRUZXh0J10gPSBvcHRpb25zWydyZXNldEVudGVyU2FtZVBhc3N3b3JkVGV4dCddIHx8ICdQbGVhc2UgZW50ZXIgdGhlIHNhbWUgcGFzc3dvcmQuJztcbiAgb3B0aW9uc1sncmVzZXRIZWFkZXJUZXh0J10gPSB0eXBlb2Ygb3B0aW9uc1sncmVzZXRIZWFkZXJUZXh0J10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1sncmVzZXRIZWFkZXJUZXh0J10gOiAnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYW5kIHRoZSBuZXcgcGFzc3dvcmQuIFdlIHdpbGwgc2VuZCB5b3UgYW4gZW1haWwgdG8gY29uZmlybSB0aGUgcGFzc3dvcmQgY2hhbmdlLic7XG4gIG9wdGlvbnNbJ3Jlc2V0U2VydmVyRXJyb3JUZXh0J10gPSBvcHRpb25zWydyZXNldFNlcnZlckVycm9yVGV4dCddIHx8ICdUaGVyZSB3YXMgYW4gZXJyb3IgcHJvY2Vzc2luZyB0aGUgcmVzZXQgcGFzc3dvcmQuJztcblxuICB0aGlzLl9zaWduaW5PcHRpb25zID0gb3B0aW9ucztcblxuICAvLyB0aGVtZVxuICBpZiAodGhpcy5fc2lnbmluT3B0aW9ucy50aGVtZSkge1xuICAgICQoJy5zaWduaW4nKS5hZGRDbGFzcygndGhlbWUtJyArIHRoaXMuX3NpZ25pbk9wdGlvbnMudGhlbWUpO1xuICB9XG5cbiAgJCgnLnBhbmVsIGEuY2xvc2UnKS5jc3MoJ2Rpc3BsYXknLCB0aGlzLl9zaWduaW5PcHRpb25zLnN0YW5kYWxvbmUgPyAnbm9uZScgOiAnYmxvY2snKTtcblxuICAvLyBzaG93IGljb25cbiAgaWYgKHRoaXMuX3NpZ25pbk9wdGlvbnMuc2hvd0ljb24pIHtcbiAgICAkKCcucGFuZWwgLmltYWdlIGltZycpLmF0dHIoJ3NyYycsIHRoaXMuX3NpZ25pbk9wdGlvbnMuaWNvbik7XG4gICAgJCgnLnBhbmVsIC5pbWFnZScpLmNzcygnZGlzcGxheScsIHRoaXMuX3NpZ25pbk9wdGlvbnMuc2hvd0ljb24gPyAnYmxvY2snIDogJ25vbmUnKTtcbiAgfVxuXG4gIC8vIGFjdGl2YXRlIHBhbmVsXG4gICQoJ2Rpdi5wYW5lbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJCgnZGl2Lm92ZXJsYXknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICQoJ2Rpdi5wYW5lbC5vbmVzdGVwJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gIGlmIChzZWxmLl9zaWduaW5PcHRpb25zLmNvbnRhaW5lcikge1xuICAgICQoJ2Rpdi5hY3RpdmUnKS5yZW1vdmVDbGFzcygnb3ZlcmxheScpO1xuICB9XG5cbiAgJCgnLnBvcHVwIGgxJykuaHRtbCh0aGlzLl9zaWduaW5PcHRpb25zLnRpdGxlKTtcbiAgJCgnLnBvcHVwIC5pbnZhbGlkJykucmVtb3ZlQ2xhc3MoJ2ludmFsaWQnKTtcblxuICAkKCdkaXYucGFuZWwub25lc3RlcCBoMScpLmh0bWwodGhpcy5fc2lnbmluT3B0aW9uc1sndGl0bGUnXSk7XG5cbiAgLy8gc2hvdyBsb2FkaW5nXG4gIHNlbGYuX3Nob3dMb2FkaW5nRXhwZXJpZW5jZSgpO1xuIFxuICAvLyBnZXQgY29uZmlndXJlZCBzdHJhdGVnaWVzL2Nvbm5lY3Rpb25zXG4gIHNlbGYuX2F1dGgwLmdldENvbm5lY3Rpb25zKGZ1bmN0aW9uIChlcnIsIGNvbm5lY3Rpb25zKSB7XG4gICAgdmFyIGFsbG93ZWRDb25uZWN0aW9ucyA9IFtdO1xuXG4gICAgLy8gdXNlIG9ubHkgc3BlY2lmaWVkIGNvbm5lY3Rpb25zXG4gICAgaWYgKHNlbGYuX3NpZ25pbk9wdGlvbnMuY29ubmVjdGlvbnMpIHtcbiAgICAgIGZvciAodmFyIGkgaW4gY29ubmVjdGlvbnMpIHtcbiAgICAgICAgaWYgKF8uY29udGFpbnMoc2VsZi5fc2lnbmluT3B0aW9ucy5jb25uZWN0aW9ucywgY29ubmVjdGlvbnNbaV0ubmFtZSkpIHtcbiAgICAgICAgICBhbGxvd2VkQ29ubmVjdGlvbnMucHVzaChjb25uZWN0aW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBhbGxvd2VkQ29ubmVjdGlvbnMgPSBjb25uZWN0aW9ucztcbiAgICB9XG5cbiAgICBzZWxmLl9jbGllbnQgPSB7XG4gICAgICBzdHJhdGVnaWVzOiBzZWxmLl9nZXRDb25maWd1cmVkU3RyYXRlZ2llcyhhbGxvd2VkQ29ubmVjdGlvbnMpXG4gICAgfTtcblxuICAgIC8vIGdldCBTU08gZGF0YVxuICAgIHNlbGYuX2F1dGgwLmdldFNTT0RhdGEoZnVuY3Rpb24gKGVyciwgc3NvRGF0YSkge1xuICAgICAgc2VsZi5fc3NvRGF0YSA9IHNzb0RhdGE7XG4gICAgICBzZWxmLl9yZXNvbHZlTG9naW5WaWV3KCk7XG5cbiAgICAgIGlmIChjYiAmJiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIGNiKCk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9yZXNvbHZlTG9naW5WaWV3ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gaWYgbm8gc29jaWFsIGNvbm5lY3Rpb25zIGFuZCBvbmUgZW50ZXJwcmlzZSBjb25uZWN0aW9uIG9ubHksIHJlZGlyZWN0XG4gIGlmICghdGhpcy5fYXJlVGhlcmVBbnlTb2NpYWxDb25uKCkgJiYgXG4gICAgdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMubGVuZ3RoID09PSAxICYmXG4gICAgdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbMF0ubmFtZSAhPT0gJ2F1dGgwJyAmJlxuICAgIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzWzBdLmNvbm5lY3Rpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgIFxuICAgIHZhciBsb2dpbk9wdGlvbnMgPSB4dGVuZCh7XG4gICAgICBjb25uZWN0aW9uOiBzZWxmLl9jbGllbnQuc3RyYXRlZ2llc1swXS5jb25uZWN0aW9uc1swXS5uYW1lXG4gICAgfSwgXG4gICAgc2VsZi5fc2lnbmluT3B0aW9ucy5leHRyYVBhcmFtZXRlcnMpO1xuICAgIHNlbGYuX2F1dGgwLmxvZ2luKGxvZ2luT3B0aW9ucyk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBsb2FkIHNvY2lhbCBidXR0b25zXG4gIHZhciBsaXN0ID0gJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5pY29ubGlzdCcpO1xuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgdmFyIHN0cmF0ZWd5ID0gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc107XG5cbiAgICBpZiAodGhpcy5faXNBdXRoMENvbm4oc3RyYXRlZ3kubmFtZSkgJiYgc3RyYXRlZ3kuY29ubmVjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fYXV0aDBTdHJhdGVnaWVzLnB1c2goc3RyYXRlZ3kpO1xuICAgICAgJCgnLmNyZWF0ZS1hY2NvdW50LCAucGFzc3dvcmQnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgICAgYmVhbi5vbigkKCcubm90bG9nZ2VkaW4gLmVtYWlsIGlucHV0JylbMF0sICdpbnB1dCcsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3Nob3dPckhpZGVQYXNzd29yZChlKTsgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0gJiYgdGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneS5uYW1lXS5zb2NpYWwpIHtcbiAgICAgIHZhciBidXR0b24gPSBib256byhib256by5jcmVhdGUoJzxzcGFuPjwvc3Bhbj4nKSlcbiAgICAgICAgLmF0dHIoJ3RhYmluZGV4JywgMClcbiAgICAgICAgLmF0dHIoJ2RhdGEtc3RyYXRlZ3knLCBzdHJhdGVneS5uYW1lKVxuICAgICAgICAuYXR0cigndGl0bGUnLCB0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLm5hbWUpXG4gICAgICAgIC5hZGRDbGFzcygnem9jaWFsJykuYWRkQ2xhc3MoJ2ljb24nKVxuICAgICAgICAuYWRkQ2xhc3ModGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneS5uYW1lXS5jc3MpXG4gICAgICAgIC5hZGRDbGFzcyh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLmltYWdlaWNvbiA/ICdpbWFnZS1pY29uJyA6ICcnKVxuICAgICAgICAuaHRtbCh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLm5hbWUpO1xuXG4gICAgICBsaXN0LmFwcGVuZChidXR0b24pO1xuICAgICAgbGlzdC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgICAgJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5zZXBhcmF0b3InKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9XG4gIH1cblxuICAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLmljb25saXN0IHNwYW4nKS5lYWNoKGZ1bmN0aW9uIChidXR0b24pIHtcbiAgICBiZWFuLm9uKGJ1dHRvbiwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGYuX3NpZ25JblNvY2lhbChlLnRhcmdldCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRoaXMuX3NpZ25pbk9wdGlvbnMuc29jaWFsQmlnQnV0dG9ucyA9IHR5cGVvZiB0aGlzLl9zaWduaW5PcHRpb25zWydzb2NpYWxCaWdCdXR0b25zJ10gIT09ICd1bmRlZmluZWQnID8gdGhpcy5fc2lnbmluT3B0aW9uc1snc29jaWFsQmlnQnV0dG9ucyddIDogIXRoaXMuX2FyZVRoZXJlQW55RW50ZXJwcmlzZU9yRGJDb25uKCk7XG4gIGlmICh0aGlzLl9zaWduaW5PcHRpb25zLnNvY2lhbEJpZ0J1dHRvbnMpIHtcbiAgICAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLmljb25saXN0IHNwYW4nKS5yZW1vdmVDbGFzcygnaWNvbicpLmFkZENsYXNzKCdibG9jaycpO1xuICB9IGVsc2Uge1xuICAgICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3Qgc3BhbicpLmFkZENsYXNzKCdpY29uJykucmVtb3ZlQ2xhc3MoJ2Jsb2NrJyk7XG4gIH1cblxuICAvLyBzaG93IHNpZ251cC9mb3Jnb3QgbGlua3NcbiAgdmFyIGF1dGgwQ29ubiA9IHRoaXMuX2dldEF1dGgwQ29ubmVjdGlvbigpO1xuICBpZiAoYXV0aDBDb25uKSB7XG4gICAgdGhpcy5fc2lnbmluT3B0aW9ucy5zaG93U2lnbnVwID0gYXV0aDBDb25uLnNob3dTaWdudXA7XG4gICAgdGhpcy5fc2lnbmluT3B0aW9ucy5zaG93Rm9yZ290ID0gYXV0aDBDb25uLnNob3dGb3Jnb3Q7XG4gIH1cbiAgXG4gICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLnNpZ24tdXAnKVxuICAgIC5jc3MoJ2Rpc3BsYXknLCB0aGlzLl9zaWduaW5PcHRpb25zLnNob3dTaWdudXAgPyAnJyA6ICdub25lJylcbiAgICAuaHRtbCh0aGlzLl9zaWduaW5PcHRpb25zLnNpZ251cFRleHQpO1xuXG4gICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLmZvcmdvdC1wYXNzJylcbiAgICAuY3NzKCdkaXNwbGF5JywgdGhpcy5fc2lnbmluT3B0aW9ucy5zaG93Rm9yZ290ID8gJycgOiAnbm9uZScpXG4gICAgLmh0bWwodGhpcy5fc2lnbmluT3B0aW9ucy5mb3Jnb3RUZXh0KTtcblxuICBpZiAodGhpcy5fc2lnbmluT3B0aW9ucy5zaWdudXBMaW5rKSB7XG4gICAgJCgnLnBhbmVsIC5jcmVhdGUtYWNjb3VudCAuc2lnbi11cCcpXG4gICAgICAuYXR0cignaHJlZicsIHRoaXMuX3NpZ25pbk9wdGlvbnMuc2lnbnVwTGluaylcbiAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX3BhcmVudCcpO1xuICB9IFxuICBlbHNlIHtcbiAgICBiZWFuLm9uKCQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLnNpZ24tdXAnKVswXSwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2hvd1NpZ25VcEV4cGVyaWVuY2UoZSk7IH0pO1xuICB9XG5cbiAgaWYgKHRoaXMuX3NpZ25pbk9wdGlvbnMuZm9yZ290TGluaykge1xuICAgICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLmZvcmdvdC1wYXNzJylcbiAgICAgIC5hdHRyKCdocmVmJywgdGhpcy5fc2lnbmluT3B0aW9ucy5mb3Jnb3RMaW5rKVxuICAgICAgLmF0dHIoJ3RhcmdldCcsICdfcGFyZW50Jyk7XG4gIH0gXG4gIGVsc2Uge1xuICAgICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLmZvcmdvdC1wYXNzJykuZWFjaChmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgYmVhbi5vbihlbGVtLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9zaG93UmVzZXRFeHBlcmllbmNlKGUpOyB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGhpZGUgZGl2aWRlciBkb3QgaWYgdGhlcmUgYXJlIG9uZSBvZiB0d29cbiAgJCgnLnBhbmVsIC5jcmVhdGUtYWNjb3VudCAuZGl2aWRlcicpXG4gICAgLmNzcygnZGlzcGxheScsIHNlbGYuX3NpZ25pbk9wdGlvbnMuc2hvd0VtYWlsICYmIHNlbGYuX3NpZ25pbk9wdGlvbnMuc2hvd1NpZ251cCAmJiBzZWxmLl9zaWduaW5PcHRpb25zLnNob3dGb3Jnb3QgPyAnJyA6ICdub25lJyk7XG5cbiAgJCgnZGl2LnBhbmVsIGlucHV0JykuZWFjaChmdW5jdGlvbiAoZSkgeyBlLnZhbHVlID0gJyc7IH0pO1xuXG4gIC8vIHBsYWNlaG9sZGVycyBhbmQgYnV0dG9uc1xuICAkKCcucGFuZWwgLnpvY2lhbC5wcmltYXJ5JykuaHRtbChzZWxmLl9zaWduaW5PcHRpb25zLnNpZ25JbkJ1dHRvblRleHQpO1xuICAkKCcucGFuZWwgLmVtYWlsIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBzZWxmLl9zaWduaW5PcHRpb25zLmVtYWlsUGxhY2Vob2xkZXIpO1xuICAkKCcucGFuZWwgLnBhc3N3b3JkIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBzZWxmLl9zaWduaW5PcHRpb25zLnBhc3N3b3JkUGxhY2Vob2xkZXIpO1xuICAkKCcucGFuZWwgLnNlcGFyYXRvciBzcGFuJykuaHRtbChzZWxmLl9zaWduaW5PcHRpb25zLnNlcGFyYXRvclRleHQpO1xuXG4gIC8vIHNpZ251cFxuICAkKCcucGFuZWwgLnNpZ251cCAuem9jaWFsLnByaW1hcnknKS5odG1sKHNlbGYuX3NpZ25pbk9wdGlvbnMuc2lnbnVwQnV0dG9uVGV4dCk7XG5cbiAgJCgnLnBhbmVsIC5zaWdudXAgLmVtYWlsIGlucHV0JykuZWFjaChmdW5jdGlvbiAoaSkgeyBcbiAgICAgIGkuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIHNlbGYuX3NpZ25pbk9wdGlvbnMuc2lnbnVwRW1haWxQbGFjZWhvbGRlcik7XG4gICAgICBiZWFuLm9uKGksICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0ge307XG4gICAgICAgIGlmIChzZWxmLl9pc0VudGVycHJpc2VDb25uZWN0aW9uKHRoaXMudmFsdWUsIG91dHB1dCkpIHtcbiAgICAgICAgICB2YXIgd2FybmluZ1RleHQgPSBzZWxmLl9zaWduaW5PcHRpb25zLnNpZ251cEVudGVycHJpc2VFbWFpbFdhcm5pbmdUZXh0LnJlcGxhY2UoL3tkb21haW59L2csIG91dHB1dC5kb21haW4pO1xuICAgICAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkod2FybmluZ1RleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkoJycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfSk7XG5cbiAgJCgnLnBhbmVsIC5zaWdudXAgLnBhc3N3b3JkIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBzZWxmLl9zaWduaW5PcHRpb25zLnNpZ251cFBhc3N3b3JkUGxhY2Vob2xkZXIpO1xuXG4gICQoJy5wYW5lbCAuc2lnbnVwIC5vcHRpb25zIC5jYW5jZWwnKS5odG1sKHNlbGYuX3NpZ25pbk9wdGlvbnNbJ3NpZ251cENhbmNlbEJ1dHRvblRleHQnXSk7XG4gIGJlYW4ub24oJCgnLnBhbmVsIC5zaWdudXAgLm9wdGlvbnMgLmNhbmNlbCcpWzBdLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7IHNlbGYuX3NldExvZ2luVmlldygpOyB9KTtcblxuICAkKCcucGFuZWwgLnNpZ251cCAuaGVhZGVyJylcbiAgICAuaHRtbChzZWxmLl9zaWduaW5PcHRpb25zLnNpZ251cEhlYWRlclRleHQpXG4gICAgLmF0dHIoJ2Rpc3BsYXknLCBzZWxmLl9zaWduaW5PcHRpb25zLnNpZ251cEhlYWRlclRleHQgPyAnJyA6ICdub25lJyk7XG5cbiAgJCgnLnBhbmVsIC5zaWdudXAgLmZvb3RlcicpXG4gICAgLmh0bWwoc2VsZi5fc2lnbmluT3B0aW9ucy5zaWdudXBGb290ZXJUZXh0KVxuICAgIC5hdHRyKCdkaXNwbGF5Jywgc2VsZi5fc2lnbmluT3B0aW9ucy5zaWdudXBGb290ZXJUZXh0ID8gJycgOiAnbm9uZScpO1xuXG4gIC8vIHJlc2V0XG4gICQoJy5wYW5lbCAucmVzZXQgLnpvY2lhbC5wcmltYXJ5JykuaHRtbChzZWxmLl9zaWduaW5PcHRpb25zLnJlc2V0QnV0dG9uVGV4dCk7XG4gICQoJy5wYW5lbCAucmVzZXQgLmVtYWlsIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBzZWxmLl9zaWduaW5PcHRpb25zLnJlc2V0RW1haWxQbGFjZWhvbGRlcik7XG4gICQoJy5wYW5lbCAucmVzZXQgLnBhc3N3b3JkIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBzZWxmLl9zaWduaW5PcHRpb25zLnJlc2V0UGFzc3dvcmRQbGFjZWhvbGRlcik7XG5cbiAgJCgnLnBhbmVsIC5yZXNldCAucmVwZWF0UGFzc3dvcmQgaW5wdXQnKS5lYWNoKGZ1bmN0aW9uIChpKSB7IFxuICAgICAgaS5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgc2VsZi5fc2lnbmluT3B0aW9ucy5yZXNldFJlcGVhdFBhc3N3b3JkUGxhY2Vob2xkZXIpO1xuICAgICAgYmVhbi5vbihpLCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQoJy5wYW5lbCAucmVzZXQgLnBhc3N3b3JkIGlucHV0JykudmFsKCkgIT0gdGhpcy52YWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkoc2VsZi5fc2lnbmluT3B0aW9ucy5yZXNldEVudGVyU2FtZVBhc3N3b3JkVGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRDdXN0b21WYWxpZGl0eSgnJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9KTtcblxuICAkKCcucGFuZWwgLnJlc2V0IC5vcHRpb25zIC5jYW5jZWwnKS5odG1sKHNlbGYuX3NpZ25pbk9wdGlvbnMucmVzZXRDYW5jZWxCdXR0b25UZXh0KTtcbiAgYmVhbi5vbigkKCcucGFuZWwgLnJlc2V0IC5vcHRpb25zIC5jYW5jZWwnKVswXSwgJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyBzZWxmLl9zZXRMb2dpblZpZXcoKTsgfSk7XG5cbiAgJCgnLnBhbmVsIC5yZXNldCAuaGVhZGVyJylcbiAgICAuaHRtbChzZWxmLl9zaWduaW5PcHRpb25zLnJlc2V0SGVhZGVyVGV4dClcbiAgICAuYXR0cignZGlzcGxheScsIHNlbGYuX3NpZ25pbk9wdGlvbnMucmVzZXRIZWFkZXJUZXh0ID8gJycgOiAnbm9uZScpO1xuXG4gIC8vIHNob3cgZW1haWwsIHBhc3N3b3JkLCBzZXBhcmF0b3IgYW5kIGJ1dHRvbiBpZiB0aGVyZSBhcmUgZW50ZXJwcmlzZS9kYiBjb25uZWN0aW9uc1xuICB2YXIgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID0gc2VsZi5fYXJlVGhlcmVBbnlFbnRlcnByaXNlT3JEYkNvbm4oKTtcbiAgdmFyIGFueVNvY2lhbENvbm5lY3Rpb24gPSBzZWxmLl9hcmVUaGVyZUFueVNvY2lhbENvbm4oKTtcblxuICAkKCcucGFuZWwgLmVtYWlsIGlucHV0JykuY3NzKCdkaXNwbGF5Jywgc2VsZi5fc2lnbmluT3B0aW9ucy5zaG93RW1haWwgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLnpvY2lhbC5wcmltYXJ5JykuY3NzKCdkaXNwbGF5Jywgc2VsZi5fc2lnbmluT3B0aW9ucy5zaG93RW1haWwgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLnBhc3N3b3JkIGlucHV0JykuY3NzKCdkaXNwbGF5Jywgc2VsZi5fc2lnbmluT3B0aW9ucy5zaG93RW1haWwgJiYgc2VsZi5fc2lnbmluT3B0aW9ucy5zaG93UGFzc3dvcmQgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5mb3Jnb3QtcGFzcycpLmNzcygnZGlzcGxheScsIHNlbGYuX3NpZ25pbk9wdGlvbnMuc2hvd0VtYWlsICYmIHNlbGYuX3NpZ25pbk9wdGlvbnMuc2hvd0ZvcmdvdCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLnNpZ24tdXAnKS5jc3MoJ2Rpc3BsYXknLCBzZWxmLl9zaWduaW5PcHRpb25zLnNob3dFbWFpbCAmJiB0aGlzLl9zaWduaW5PcHRpb25zLnNob3dTaWdudXAgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLnNlcGFyYXRvcicpLmNzcygnZGlzcGxheScsIHNlbGYuX3NpZ25pbk9wdGlvbnMuc2hvd0VtYWlsICYmIGFueUVudGVycHJpc2VPckRiQ29ubmVjdGlvbiAmJiBhbnlTb2NpYWxDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAkKCcucGFuZWwgLmxhc3QtdGltZScpLmh0bWwoc2VsZi5fc2lnbmluT3B0aW9ucy5yZXR1cm5Vc2VyTGFiZWwpO1xuXG4gIC8vIGlmIHVzZXIgbG9nZ2VkIGluIHNob3cgbG9nZ2VkIGluIGV4cGVyaWVuY2VcbiAgaWYgKHNlbGYuX3Nzb0RhdGEuc3NvKSB7XG4gICAgaWYgKHNlbGYuX3Nzb0RhdGEubGFzdFVzZWRVc2VybmFtZSkge1xuICAgICAgJCgnZGl2LnBhbmVsLm9uZXN0ZXAgaW5wdXQnKS52YWwoc2VsZi5fc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lKTtcbiAgICAgIHNlbGYuX3Nob3dPckhpZGVQYXNzd29yZCgpO1xuICAgIH1cblxuICAgIGlmIChzZWxmLl9zaWduaW5PcHRpb25zWydlbmFibGVSZXR1cm5Vc2VyRXhwZXJpZW5jZSddKSB7IFxuICAgICAgc2VsZi5fc2hvd0xvZ2dlZEluRXhwZXJpZW5jZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHNlbGYuX3NldExvZ2luVmlldyh7IGlzUmV0dXJuaW5nVXNlcjogc2VsZi5fc3NvRGF0YS5zc28gfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2dldENvbmZpZ3VyZWRTdHJhdGVnaWVzID0gZnVuY3Rpb24gKGNvbm5zKSB7XG4gIHZhciBzdHJhdGVnaWVzID0gW107XG4gIGZvciAodmFyIGNvbm4gaW4gY29ubnMpIHtcbiAgICBpZiAodHlwZW9mKGNvbm5zW2Nvbm5dLnN0YXR1cykgIT09ICd1bmRlZmluZWQnICYmICFjb25uc1tjb25uXS5zdGF0dXMpIGNvbnRpbnVlO1xuXG4gICAgdmFyIHN0cmF0ZWd5ID0gXy5maWx0ZXIoc3RyYXRlZ2llcywgZnVuY3Rpb24gKHMpIHsgXG4gICAgICByZXR1cm4gcy5uYW1lID09PSBjb25uc1tjb25uXS5zdHJhdGVneTsgXG4gICAgfSlbMF07XG5cbiAgICBpZiAoIXN0cmF0ZWd5KSB7XG4gICAgICBzdHJhdGVneSA9IHtcbiAgICAgICAgbmFtZTogY29ubnNbY29ubl0uc3RyYXRlZ3ksXG4gICAgICAgIGNvbm5lY3Rpb25zOiBbXVxuICAgICAgfTtcblxuICAgICAgc3RyYXRlZ2llcy5wdXNoKHN0cmF0ZWd5KTtcbiAgICB9XG5cbiAgICB2YXIgY29ubkRhdGEgPSB7XG4gICAgICBuYW1lOiBjb25uc1tjb25uXS5uYW1lLFxuICAgICAgZG9tYWluOiBjb25uc1tjb25uXS5kb21haW4sXG4gICAgICBzaG93U2lnbnVwOiBjb25uc1tjb25uXS5zaG93U2lnbnVwLFxuICAgICAgc2hvd0ZvcmdvdDogY29ubnNbY29ubl0uc2hvd0ZvcmdvdFxuICAgIH07XG5cbiAgICBzdHJhdGVneS5jb25uZWN0aW9ucy5wdXNoKGNvbm5EYXRhKTtcbiAgfVxuXG4gIHJldHVybiBzdHJhdGVnaWVzO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLmdldENsaWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2F1dGgwO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoc2lnbmluT3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBzaWduaW5PcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBzaWduaW5PcHRpb25zO1xuICAgIHNpZ25pbk9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5fc2lnbmluT3B0aW9ucyA9IHh0ZW5kKHNlbGYuX29wdGlvbnMsIHNpZ25pbk9wdGlvbnMpO1xuICBzZWxmLl9hdXRoMFN0cmF0ZWdpZXMgPSBbXTtcblxuICAvLyB3aWRnZXQgY29udGFpbmVyXG4gIGlmIChzZWxmLl9zaWduaW5PcHRpb25zLmNvbnRhaW5lcikge1xuICAgIHNlbGYuX3NpZ25pbk9wdGlvbnMudGhlbWUgPSAnc3RhdGljJztcbiAgICBzZWxmLl9zaWduaW5PcHRpb25zLnN0YW5kYWxvbmUgPSB0cnVlO1xuICAgIHNlbGYuX3NpZ25pbk9wdGlvbnMudG9wID0gdHJ1ZTtcblxuICAgIHZhciBzcGVjaWZpZWRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxmLl9zaWduaW5PcHRpb25zLmNvbnRhaW5lcik7XG4gICAgc3BlY2lmaWVkQ29udGFpbmVyLmlubmVySFRNTCA9IG1haW5UbXBsKCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gcmVtb3ZlIHdpZGdldCBjb250YWluZXIgKGlmIGV4aXN0KVxuICAgICQoKS5wYXJlbnQoKS5yZW1vdmUoKTtcblxuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gbWFpblRtcGwoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gIH1cbiAgXG4gIHNlbGYuX2luaXRpYWxpemUoY2FsbGJhY2spO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMFdpZGdldDtcbiIsIi8qIFBsYWNlaG9sZGVycy5qcyB2My4wLjAgKi9cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vIENyb3NzLWJyb3dzZXIgRE9NIGV2ZW50IGJpbmRpbmdcbiAgICBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKGVsZW0sIGV2ZW50LCBmbikge1xuICAgICAgICBpZiAoZWxlbS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmbiwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS5hdHRhY2hFdmVudChcIm9uXCIgKyBldmVudCwgZm4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgd2hldGhlciBhbiBpdGVtIGlzIGluIGFuIGFycmF5ICh3ZSBkb24ndCB1c2UgQXJyYXkucHJvdG90eXBlLmluZGV4T2Ygc28gd2UgZG9uJ3QgY2xvYmJlciBhbnkgZXhpc3RpbmcgcG9seWZpbGxzIC0gdGhpcyBpcyBhIHJlYWxseSBzaW1wbGUgYWx0ZXJuYXRpdmUpXG4gICAgZnVuY3Rpb24gaW5BcnJheShhcnIsIGl0ZW0pIHtcbiAgICAgICAgdmFyIGksIGxlbjtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYXJyW2ldID09PSBpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIE1vdmUgdGhlIGNhcmV0IHRvIHRoZSBpbmRleCBwb3NpdGlvbiBzcGVjaWZpZWQuIEFzc3VtZXMgdGhhdCB0aGUgZWxlbWVudCBoYXMgZm9jdXNcbiAgICBmdW5jdGlvbiBtb3ZlQ2FyZXQoZWxlbSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIHJhbmdlO1xuICAgICAgICBpZiAoZWxlbS5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgICAgIHJhbmdlID0gZWxlbS5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICAgIHJhbmdlLm1vdmUoXCJjaGFyYWN0ZXJcIiwgaW5kZXgpO1xuICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbS5zZWxlY3Rpb25TdGFydCkge1xuICAgICAgICAgICAgZWxlbS5mb2N1cygpO1xuICAgICAgICAgICAgZWxlbS5zZXRTZWxlY3Rpb25SYW5nZShpbmRleCwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXR0ZW1wdCB0byBjaGFuZ2UgdGhlIHR5cGUgcHJvcGVydHkgb2YgYW4gaW5wdXQgZWxlbWVudFxuICAgIGZ1bmN0aW9uIGNoYW5nZVR5cGUoZWxlbSwgdHlwZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZWxlbS50eXBlID0gdHlwZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBZb3UgY2FuJ3QgY2hhbmdlIGlucHV0IHR5cGUgaW4gSUU4IGFuZCBiZWxvd1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXhwb3NlIHB1YmxpYyBtZXRob2RzXG4gICAgZ2xvYmFsLlBsYWNlaG9sZGVycyA9IHtcbiAgICAgICAgVXRpbHM6IHtcbiAgICAgICAgICAgIGFkZEV2ZW50TGlzdGVuZXI6IGFkZEV2ZW50TGlzdGVuZXIsXG4gICAgICAgICAgICBpbkFycmF5OiBpbkFycmF5LFxuICAgICAgICAgICAgbW92ZUNhcmV0OiBtb3ZlQ2FyZXQsXG4gICAgICAgICAgICBjaGFuZ2VUeXBlOiBjaGFuZ2VUeXBlXG4gICAgICAgIH1cbiAgICB9O1xuXG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uIChnbG9iYWwpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHZhbGlkVHlwZXMgPSBbXG4gICAgICAgICAgICBcInRleHRcIixcbiAgICAgICAgICAgIFwic2VhcmNoXCIsXG4gICAgICAgICAgICBcInVybFwiLFxuICAgICAgICAgICAgXCJ0ZWxcIixcbiAgICAgICAgICAgIFwiZW1haWxcIixcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCIsXG4gICAgICAgICAgICBcInRleHRhcmVhXCJcbiAgICAgICAgXSxcblxuICAgICAgICAvLyBUaGUgbGlzdCBvZiBrZXljb2RlcyB0aGF0IGFyZSBub3QgYWxsb3dlZCB3aGVuIHRoZSBwb2x5ZmlsbCBpcyBjb25maWd1cmVkIHRvIGhpZGUtb24taW5wdXRcbiAgICAgICAgYmFkS2V5cyA9IFtcblxuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBrZXlzIGFsbCBjYXVzZSB0aGUgY2FyZXQgdG8ganVtcCB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dCB2YWx1ZVxuICAgICAgICAgICAgMjcsIC8vIEVzY2FwZVxuICAgICAgICAgICAgMzMsIC8vIFBhZ2UgdXBcbiAgICAgICAgICAgIDM0LCAvLyBQYWdlIGRvd25cbiAgICAgICAgICAgIDM1LCAvLyBFbmRcbiAgICAgICAgICAgIDM2LCAvLyBIb21lXG5cbiAgICAgICAgICAgIC8vIEFycm93IGtleXMgYWxsb3cgeW91IHRvIG1vdmUgdGhlIGNhcmV0IG1hbnVhbGx5LCB3aGljaCBzaG91bGQgYmUgcHJldmVudGVkIHdoZW4gdGhlIHBsYWNlaG9sZGVyIGlzIHZpc2libGVcbiAgICAgICAgICAgIDM3LCAvLyBMZWZ0XG4gICAgICAgICAgICAzOCwgLy8gVXBcbiAgICAgICAgICAgIDM5LCAvLyBSaWdodFxuICAgICAgICAgICAgNDAsIC8vIERvd25cblxuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBrZXlzIGFsbG93IHlvdSB0byBtb2RpZnkgdGhlIHBsYWNlaG9sZGVyIHRleHQgYnkgcmVtb3ZpbmcgY2hhcmFjdGVycywgd2hpY2ggc2hvdWxkIGJlIHByZXZlbnRlZCB3aGVuIHRoZSBwbGFjZWhvbGRlciBpcyB2aXNpYmxlXG4gICAgICAgICAgICA4LCAvLyBCYWNrc3BhY2VcbiAgICAgICAgICAgIDQ2IC8vIERlbGV0ZVxuICAgICAgICBdLFxuXG4gICAgICAgIC8vIFN0eWxpbmcgdmFyaWFibGVzXG4gICAgICAgIHBsYWNlaG9sZGVyU3R5bGVDb2xvciA9IFwiI2NjY1wiLFxuICAgICAgICBwbGFjZWhvbGRlckNsYXNzTmFtZSA9IFwicGxhY2Vob2xkZXJzanNcIixcbiAgICAgICAgY2xhc3NOYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChcIig/Ol58XFxcXHMpXCIgKyBwbGFjZWhvbGRlckNsYXNzTmFtZSArIFwiKD8hXFxcXFMpXCIpLFxuXG4gICAgICAgIC8vIFRoZXNlIHdpbGwgaG9sZCByZWZlcmVuY2VzIHRvIGFsbCBlbGVtZW50cyB0aGF0IGNhbiBiZSBhZmZlY3RlZC4gTm9kZUxpc3Qgb2JqZWN0cyBhcmUgbGl2ZSwgc28gd2Ugb25seSBuZWVkIHRvIGdldCB0aG9zZSByZWZlcmVuY2VzIG9uY2VcbiAgICAgICAgaW5wdXRzLCB0ZXh0YXJlYXMsXG5cbiAgICAgICAgLy8gVGhlIHZhcmlvdXMgZGF0YS0qIGF0dHJpYnV0ZXMgdXNlZCBieSB0aGUgcG9seWZpbGxcbiAgICAgICAgQVRUUl9DVVJSRU5UX1ZBTCA9IFwiZGF0YS1wbGFjZWhvbGRlci12YWx1ZVwiLFxuICAgICAgICBBVFRSX0FDVElWRSA9IFwiZGF0YS1wbGFjZWhvbGRlci1hY3RpdmVcIixcbiAgICAgICAgQVRUUl9JTlBVVF9UWVBFID0gXCJkYXRhLXBsYWNlaG9sZGVyLXR5cGVcIixcbiAgICAgICAgQVRUUl9GT1JNX0hBTkRMRUQgPSBcImRhdGEtcGxhY2Vob2xkZXItc3VibWl0XCIsXG4gICAgICAgIEFUVFJfRVZFTlRTX0JPVU5EID0gXCJkYXRhLXBsYWNlaG9sZGVyLWJvdW5kXCIsXG4gICAgICAgIEFUVFJfT1BUSU9OX0ZPQ1VTID0gXCJkYXRhLXBsYWNlaG9sZGVyLWZvY3VzXCIsXG4gICAgICAgIEFUVFJfT1BUSU9OX0xJVkUgPSBcImRhdGEtcGxhY2Vob2xkZXItbGl2ZVwiLFxuICAgICAgICBBVFRSX01BWExFTkdUSCA9IFwiZGF0YS1wbGFjZWhvbGRlci1tYXhsZW5ndGhcIixcblxuICAgICAgICAvLyBWYXJpb3VzIG90aGVyIHZhcmlhYmxlcyB1c2VkIHRocm91Z2hvdXQgdGhlIHJlc3Qgb2YgdGhlIHNjcmlwdFxuICAgICAgICB0ZXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLFxuICAgICAgICBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLFxuICAgICAgICByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICBQbGFjZWhvbGRlcnMgPSBnbG9iYWwuUGxhY2Vob2xkZXJzLFxuICAgICAgICBVdGlscyA9IFBsYWNlaG9sZGVycy5VdGlscyxcbiAgICAgICAgaGlkZU9uSW5wdXQsIGxpdmVVcGRhdGVzLCBrZXlkb3duVmFsLCBzdHlsZUVsZW0sIHN0eWxlUnVsZXMsIHBsYWNlaG9sZGVyLCB0aW1lciwgZm9ybSwgZWxlbSwgbGVuLCBpO1xuXG4gICAgLy8gTm8tb3AgKHVzZWQgaW4gcGxhY2Ugb2YgcHVibGljIG1ldGhvZHMgd2hlbiBuYXRpdmUgc3VwcG9ydCBpcyBkZXRlY3RlZClcbiAgICBmdW5jdGlvbiBub29wKCkge31cblxuICAgIC8vIEhpZGUgdGhlIHBsYWNlaG9sZGVyIHZhbHVlIG9uIGEgc2luZ2xlIGVsZW1lbnQuIFJldHVybnMgdHJ1ZSBpZiB0aGUgcGxhY2Vob2xkZXIgd2FzIGhpZGRlbiBhbmQgZmFsc2UgaWYgaXQgd2FzIG5vdCAoYmVjYXVzZSBpdCB3YXNuJ3QgdmlzaWJsZSBpbiB0aGUgZmlyc3QgcGxhY2UpXG4gICAgZnVuY3Rpb24gaGlkZVBsYWNlaG9sZGVyKGVsZW0sIGtleWRvd25WYWx1ZSkge1xuICAgICAgICB2YXIgdHlwZSxcbiAgICAgICAgICAgIG1heExlbmd0aCxcbiAgICAgICAgICAgIHZhbHVlQ2hhbmdlZCA9ICghIWtleWRvd25WYWx1ZSAmJiBlbGVtLnZhbHVlICE9PSBrZXlkb3duVmFsdWUpLFxuICAgICAgICAgICAgaXNQbGFjZWhvbGRlclZhbHVlID0gKGVsZW0udmFsdWUgPT09IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpKTtcblxuICAgICAgICBpZiAoKHZhbHVlQ2hhbmdlZCB8fCBpc1BsYWNlaG9sZGVyVmFsdWUpICYmIGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQUNUSVZFKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKEFUVFJfQUNUSVZFKTtcbiAgICAgICAgICAgIGVsZW0udmFsdWUgPSBlbGVtLnZhbHVlLnJlcGxhY2UoZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCksIFwiXCIpO1xuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5yZXBsYWNlKGNsYXNzTmFtZVJlZ0V4cCwgXCJcIik7XG5cbiAgICAgICAgICAgIC8vIFJlc3RvcmUgdGhlIG1heGxlbmd0aCB2YWx1ZVxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9NQVhMRU5HVEgpO1xuICAgICAgICAgICAgaWYgKG1heExlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwibWF4TGVuZ3RoXCIsIG1heExlbmd0aCk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoQVRUUl9NQVhMRU5HVEgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgcG9seWZpbGwgaGFzIGNoYW5nZWQgdGhlIHR5cGUgb2YgdGhlIGVsZW1lbnQgd2UgbmVlZCB0byBjaGFuZ2UgaXQgYmFja1xuICAgICAgICAgICAgdHlwZSA9IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfSU5QVVRfVFlQRSk7XG4gICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICAgIGVsZW0udHlwZSA9IHR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gU2hvdyB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgb24gYSBzaW5nbGUgZWxlbWVudC4gUmV0dXJucyB0cnVlIGlmIHRoZSBwbGFjZWhvbGRlciB3YXMgc2hvd24gYW5kIGZhbHNlIGlmIGl0IHdhcyBub3QgKGJlY2F1c2UgaXQgd2FzIGFscmVhZHkgdmlzaWJsZSlcbiAgICBmdW5jdGlvbiBzaG93UGxhY2Vob2xkZXIoZWxlbSkge1xuICAgICAgICB2YXIgdHlwZSxcbiAgICAgICAgICAgIG1heExlbmd0aCxcbiAgICAgICAgICAgIHZhbCA9IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpO1xuICAgICAgICBpZiAoZWxlbS52YWx1ZSA9PT0gXCJcIiAmJiB2YWwpIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfQUNUSVZFLCBcInRydWVcIik7XG4gICAgICAgICAgICBlbGVtLnZhbHVlID0gdmFsO1xuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgKz0gXCIgXCIgKyBwbGFjZWhvbGRlckNsYXNzTmFtZTtcblxuICAgICAgICAgICAgLy8gU3RvcmUgYW5kIHJlbW92ZSB0aGUgbWF4bGVuZ3RoIHZhbHVlXG4gICAgICAgICAgICBtYXhMZW5ndGggPSBlbGVtLmdldEF0dHJpYnV0ZShBVFRSX01BWExFTkdUSCk7XG4gICAgICAgICAgICBpZiAoIW1heExlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfTUFYTEVOR1RILCBlbGVtLm1heExlbmd0aCk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJtYXhMZW5ndGhcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSB0eXBlIG9mIGVsZW1lbnQgbmVlZHMgdG8gY2hhbmdlLCBjaGFuZ2UgaXQgKGUuZy4gcGFzc3dvcmQgaW5wdXRzKVxuICAgICAgICAgICAgdHlwZSA9IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfSU5QVVRfVFlQRSk7XG4gICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICAgIGVsZW0udHlwZSA9IFwidGV4dFwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtLnR5cGUgPT09IFwicGFzc3dvcmRcIikge1xuICAgICAgICAgICAgICAgIGlmIChVdGlscy5jaGFuZ2VUeXBlKGVsZW0sIFwidGV4dFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShBVFRSX0lOUFVUX1RZUEUsIFwicGFzc3dvcmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZUVsZW0obm9kZSwgY2FsbGJhY2spIHtcblxuICAgICAgICB2YXIgaGFuZGxlSW5wdXRzLCBoYW5kbGVUZXh0YXJlYXMsIGVsZW0sIGxlbiwgaTtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGFzc2VkIGluIG5vZGUgaXMgYW4gaW5wdXQvdGV4dGFyZWEgKGluIHdoaWNoIGNhc2UgaXQgY2FuJ3QgaGF2ZSBhbnkgYWZmZWN0ZWQgZGVzY2VuZGFudHMpXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3YXMgcGFzc2VkIGluLCBnZXQgYWxsIGFmZmVjdGVkIGRlc2NlbmRhbnRzLiBPdGhlcndpc2UsIGdldCBhbGwgYWZmZWN0ZWQgZWxlbWVudHMgaW4gZG9jdW1lbnRcbiAgICAgICAgICAgIGhhbmRsZUlucHV0cyA9IG5vZGUgPyBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIikgOiBpbnB1dHM7XG4gICAgICAgICAgICBoYW5kbGVUZXh0YXJlYXMgPSBub2RlID8gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRleHRhcmVhXCIpIDogdGV4dGFyZWFzO1xuXG4gICAgICAgICAgICAvLyBSdW4gdGhlIGNhbGxiYWNrIGZvciBlYWNoIGVsZW1lbnRcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGhhbmRsZUlucHV0cy5sZW5ndGggKyBoYW5kbGVUZXh0YXJlYXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gaSA8IGhhbmRsZUlucHV0cy5sZW5ndGggPyBoYW5kbGVJbnB1dHNbaV0gOiBoYW5kbGVUZXh0YXJlYXNbaSAtIGhhbmRsZUlucHV0cy5sZW5ndGhdO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVsZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFsbCBhZmZlY3RlZCBlbGVtZW50cyB0byB0aGVpciBub3JtYWwgc3RhdGUgKHJlbW92ZSBwbGFjZWhvbGRlciB2YWx1ZSBpZiBwcmVzZW50KVxuICAgIGZ1bmN0aW9uIGRpc2FibGVQbGFjZWhvbGRlcnMobm9kZSkge1xuICAgICAgICBoYW5kbGVFbGVtKG5vZGUsIGhpZGVQbGFjZWhvbGRlcik7XG4gICAgfVxuXG4gICAgLy8gU2hvdyB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgb24gYWxsIGFwcHJvcHJpYXRlIGVsZW1lbnRzXG4gICAgZnVuY3Rpb24gZW5hYmxlUGxhY2Vob2xkZXJzKG5vZGUpIHtcbiAgICAgICAgaGFuZGxlRWxlbShub2RlLCBzaG93UGxhY2Vob2xkZXIpO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgYXMgYSBmb2N1cyBldmVudCBoYW5kbGVyXG4gICAgZnVuY3Rpb24gbWFrZUZvY3VzSGFuZGxlcihlbGVtKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIE9ubHkgaGlkZSB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgaWYgdGhlIChkZWZhdWx0KSBoaWRlLW9uLWZvY3VzIGJlaGF2aW91ciBpcyBlbmFibGVkXG4gICAgICAgICAgICBpZiAoaGlkZU9uSW5wdXQgJiYgZWxlbS52YWx1ZSA9PT0gZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCkgJiYgZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9BQ1RJVkUpID09PSBcInRydWVcIikge1xuXG4gICAgICAgICAgICAgICAgLy8gTW92ZSB0aGUgY2FyZXQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBpbnB1dCAodGhpcyBtaW1pY3MgdGhlIGJlaGF2aW91ciBvZiBhbGwgYnJvd3NlcnMgdGhhdCBkbyBub3QgaGlkZSB0aGUgcGxhY2Vob2xkZXIgb24gZm9jdXMpXG4gICAgICAgICAgICAgICAgVXRpbHMubW92ZUNhcmV0KGVsZW0sIDApO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAgIGhpZGVQbGFjZWhvbGRlcihlbGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIGFzIGEgYmx1ciBldmVudCBoYW5kbGVyXG4gICAgZnVuY3Rpb24gbWFrZUJsdXJIYW5kbGVyKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNob3dQbGFjZWhvbGRlcihlbGVtKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBGdW5jdGlvbnMgdGhhdCBhcmUgdXNlZCBhcyBhIGV2ZW50IGhhbmRsZXJzIHdoZW4gdGhlIGhpZGUtb24taW5wdXQgYmVoYXZpb3VyIGhhcyBiZWVuIGFjdGl2YXRlZCAtIHZlcnkgYmFzaWMgaW1wbGVtZW50YXRpb24gb2YgdGhlIFwiaW5wdXRcIiBldmVudFxuICAgIGZ1bmN0aW9uIG1ha2VLZXlkb3duSGFuZGxlcihlbGVtKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAga2V5ZG93blZhbCA9IGVsZW0udmFsdWU7XG5cbiAgICAgICAgICAgIC8vUHJldmVudCB0aGUgdXNlIG9mIHRoZSBhcnJvdyBrZXlzICh0cnkgdG8ga2VlcCB0aGUgY3Vyc29yIGJlZm9yZSB0aGUgcGxhY2Vob2xkZXIpXG4gICAgICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9BQ1RJVkUpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgIGlmIChrZXlkb3duVmFsID09PSBlbGVtLmdldEF0dHJpYnV0ZShBVFRSX0NVUlJFTlRfVkFMKSAmJiBVdGlscy5pbkFycmF5KGJhZEtleXMsIGUua2V5Q29kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBtYWtlS2V5dXBIYW5kbGVyKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGhpZGVQbGFjZWhvbGRlcihlbGVtLCBrZXlkb3duVmFsKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgbm93IGVtcHR5IHdlIG5lZWQgdG8gc2hvdyB0aGUgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgIGlmIChlbGVtLnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZWxlbS5ibHVyKCk7XG4gICAgICAgICAgICAgICAgVXRpbHMubW92ZUNhcmV0KGVsZW0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBtYWtlQ2xpY2tIYW5kbGVyKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChlbGVtID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGVsZW0udmFsdWUgPT09IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpICYmIGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQUNUSVZFKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICBVdGlscy5tb3ZlQ2FyZXQoZWxlbSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCBhcyBhIHN1Ym1pdCBldmVudCBoYW5kbGVyIG9uIGZvcm0gZWxlbWVudHMgdGhhdCBoYXZlIGNoaWxkcmVuIGFmZmVjdGVkIGJ5IHRoaXMgcG9seWZpbGxcbiAgICBmdW5jdGlvbiBtYWtlU3VibWl0SGFuZGxlcihmb3JtKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIFR1cm4gb2ZmIHBsYWNlaG9sZGVycyBvbiBhbGwgYXBwcm9wcmlhdGUgZGVzY2VuZGFudCBlbGVtZW50c1xuICAgICAgICAgICAgZGlzYWJsZVBsYWNlaG9sZGVycyhmb3JtKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzIHRvIGFuIGVsZW1lbnQgdGhhdCB3ZSBuZWVkIHRvIGFmZmVjdCB3aXRoIHRoZSBwb2x5ZmlsbFxuICAgIGZ1bmN0aW9uIG5ld0VsZW1lbnQoZWxlbSkge1xuXG4gICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIHBhcnQgb2YgYSBmb3JtLCBtYWtlIHN1cmUgdGhlIHBsYWNlaG9sZGVyIHN0cmluZyBpcyBub3Qgc3VibWl0dGVkIGFzIGEgdmFsdWVcbiAgICAgICAgaWYgKGVsZW0uZm9ybSkge1xuICAgICAgICAgICAgZm9ybSA9IGVsZW0uZm9ybTtcblxuICAgICAgICAgICAgLy8gU2V0IGEgZmxhZyBvbiB0aGUgZm9ybSBzbyB3ZSBrbm93IGl0J3MgYmVlbiBoYW5kbGVkIChmb3JtcyBjYW4gY29udGFpbiBtdWx0aXBsZSBpbnB1dHMpXG4gICAgICAgICAgICBpZiAoIWZvcm0uZ2V0QXR0cmlidXRlKEFUVFJfRk9STV9IQU5ETEVEKSkge1xuICAgICAgICAgICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZm9ybSwgXCJzdWJtaXRcIiwgbWFrZVN1Ym1pdEhhbmRsZXIoZm9ybSkpO1xuICAgICAgICAgICAgICAgIGZvcm0uc2V0QXR0cmlidXRlKEFUVFJfRk9STV9IQU5ETEVELCBcInRydWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBlbGVtZW50IHNvIHdlIGNhbiBoaWRlL3Nob3cgdGhlIHBsYWNlaG9sZGVyIGFzIGFwcHJvcHJpYXRlXG4gICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZWxlbSwgXCJmb2N1c1wiLCBtYWtlRm9jdXNIYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgVXRpbHMuYWRkRXZlbnRMaXN0ZW5lcihlbGVtLCBcImJsdXJcIiwgbWFrZUJsdXJIYW5kbGVyKGVsZW0pKTtcblxuICAgICAgICAvLyBJZiB0aGUgcGxhY2Vob2xkZXIgc2hvdWxkIGhpZGUgb24gaW5wdXQgcmF0aGVyIHRoYW4gb24gZm9jdXMgd2UgbmVlZCBhZGRpdGlvbmFsIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIGlmIChoaWRlT25JbnB1dCkge1xuICAgICAgICAgICAgVXRpbHMuYWRkRXZlbnRMaXN0ZW5lcihlbGVtLCBcImtleWRvd25cIiwgbWFrZUtleWRvd25IYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZWxlbSwgXCJrZXl1cFwiLCBtYWtlS2V5dXBIYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgICAgIFV0aWxzLmFkZEV2ZW50TGlzdGVuZXIoZWxlbSwgXCJjbGlja1wiLCBtYWtlQ2xpY2tIYW5kbGVyKGVsZW0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbWVtYmVyIHRoYXQgd2UndmUgYm91bmQgZXZlbnQgaGFuZGxlcnMgdG8gdGhpcyBlbGVtZW50XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfRVZFTlRTX0JPVU5ELCBcInRydWVcIik7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwsIHBsYWNlaG9sZGVyKTtcblxuICAgICAgICAvLyBJZiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgYSB2YWx1ZSBhbmQgaXMgbm90IGZvY3Vzc2VkLCBzZXQgaXQgdG8gdGhlIHBsYWNlaG9sZGVyIHN0cmluZ1xuICAgICAgICBpZiAoaGlkZU9uSW5wdXQgfHwgZWxlbSAhPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgc2hvd1BsYWNlaG9sZGVyKGVsZW0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUGxhY2Vob2xkZXJzLm5hdGl2ZVN1cHBvcnQgPSB0ZXN0LnBsYWNlaG9sZGVyICE9PSB2b2lkIDA7XG5cbiAgICBpZiAoIVBsYWNlaG9sZGVycy5uYXRpdmVTdXBwb3J0KSB7XG5cbiAgICAgICAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gYWxsIHRoZSBpbnB1dCBhbmQgdGV4dGFyZWEgZWxlbWVudHMgY3VycmVudGx5IGluIHRoZSBET00gKGxpdmUgTm9kZUxpc3Qgb2JqZWN0cyB0byB3ZSBvbmx5IG5lZWQgdG8gZG8gdGhpcyBvbmNlKVxuICAgICAgICBpbnB1dHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpO1xuICAgICAgICB0ZXh0YXJlYXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRleHRhcmVhXCIpO1xuXG4gICAgICAgIC8vIEdldCBhbnkgc2V0dGluZ3MgZGVjbGFyZWQgYXMgZGF0YS0qIGF0dHJpYnV0ZXMgb24gdGhlIHJvb3QgZWxlbWVudCAoY3VycmVudGx5IHRoZSBvbmx5IG9wdGlvbnMgYXJlIHdoZXRoZXIgdG8gaGlkZSB0aGUgcGxhY2Vob2xkZXIgb24gZm9jdXMgb3IgaW5wdXQgYW5kIHdoZXRoZXIgdG8gYXV0by11cGRhdGUpXG4gICAgICAgIGhpZGVPbklucHV0ID0gcm9vdC5nZXRBdHRyaWJ1dGUoQVRUUl9PUFRJT05fRk9DVVMpID09PSBcImZhbHNlXCI7XG4gICAgICAgIGxpdmVVcGRhdGVzID0gcm9vdC5nZXRBdHRyaWJ1dGUoQVRUUl9PUFRJT05fTElWRSkgIT09IFwiZmFsc2VcIjtcblxuICAgICAgICAvLyBDcmVhdGUgc3R5bGUgZWxlbWVudCBmb3IgcGxhY2Vob2xkZXIgc3R5bGVzIChpbnN0ZWFkIG9mIGRpcmVjdGx5IHNldHRpbmcgc3R5bGUgcHJvcGVydGllcyBvbiBlbGVtZW50cyAtIGFsbG93cyBmb3IgYmV0dGVyIGZsZXhpYmlsaXR5IGFsb25nc2lkZSB1c2VyLWRlZmluZWQgc3R5bGVzKVxuICAgICAgICBzdHlsZUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgIHN0eWxlRWxlbS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG4gICAgICAgIC8vIENyZWF0ZSBzdHlsZSBydWxlcyBhcyB0ZXh0IG5vZGVcbiAgICAgICAgc3R5bGVSdWxlcyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiLlwiICsgcGxhY2Vob2xkZXJDbGFzc05hbWUgKyBcIiB7IGNvbG9yOlwiICsgcGxhY2Vob2xkZXJTdHlsZUNvbG9yICsgXCI7IH1cIik7XG5cbiAgICAgICAgLy8gQXBwZW5kIHN0eWxlIHJ1bGVzIHRvIG5ld2x5IGNyZWF0ZWQgc3R5bGVzaGVldFxuICAgICAgICBpZiAoc3R5bGVFbGVtLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgICAgIHN0eWxlRWxlbS5zdHlsZVNoZWV0LmNzc1RleHQgPSBzdHlsZVJ1bGVzLm5vZGVWYWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0eWxlRWxlbS5hcHBlbmRDaGlsZChzdHlsZVJ1bGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFByZXBlbmQgbmV3IHN0eWxlIGVsZW1lbnQgdG8gdGhlIGhlYWQgKGJlZm9yZSBhbnkgZXhpc3Rpbmcgc3R5bGVzaGVldHMsIHNvIHVzZXItZGVmaW5lZCBydWxlcyB0YWtlIHByZWNlZGVuY2UpXG4gICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbSwgaGVhZC5maXJzdENoaWxkKTtcblxuICAgICAgICAvLyBTZXQgdXAgdGhlIHBsYWNlaG9sZGVyc1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBpbnB1dHMubGVuZ3RoICsgdGV4dGFyZWFzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBlbGVtID0gaSA8IGlucHV0cy5sZW5ndGggPyBpbnB1dHNbaV0gOiB0ZXh0YXJlYXNbaSAtIGlucHV0cy5sZW5ndGhdO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHZhbHVlIG9mIHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUsIGlmIGFueS4gSUUxMCBlbXVsYXRpbmcgSUU3IGZhaWxzIHdpdGggZ2V0QXR0cmlidXRlLCBoZW5jZSB0aGUgdXNlIG9mIHRoZSBhdHRyaWJ1dGVzIG5vZGVcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gZWxlbS5hdHRyaWJ1dGVzLnBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBJRSByZXR1cm5zIGFuIGVtcHR5IG9iamVjdCBpbnN0ZWFkIG9mIHVuZGVmaW5lZCBpZiB0aGUgYXR0cmlidXRlIGlzIG5vdCBwcmVzZW50XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlci5ub2RlVmFsdWU7XG5cbiAgICAgICAgICAgICAgICAvLyBPbmx5IGFwcGx5IHRoZSBwb2x5ZmlsbCBpZiB0aGlzIGVsZW1lbnQgaXMgb2YgYSB0eXBlIHRoYXQgc3VwcG9ydHMgcGxhY2Vob2xkZXJzLCBhbmQgaGFzIGEgcGxhY2Vob2xkZXIgYXR0cmlidXRlIHdpdGggYSBub24tZW1wdHkgdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIgJiYgVXRpbHMuaW5BcnJheSh2YWxpZFR5cGVzLCBlbGVtLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0VsZW1lbnQoZWxlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgZW5hYmxlZCwgdGhlIHBvbHlmaWxsIHdpbGwgcmVwZWF0ZWRseSBjaGVjayBmb3IgY2hhbmdlZC9hZGRlZCBlbGVtZW50cyBhbmQgYXBwbHkgdG8gdGhvc2UgYXMgd2VsbFxuICAgICAgICB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGlucHV0cy5sZW5ndGggKyB0ZXh0YXJlYXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gaSA8IGlucHV0cy5sZW5ndGggPyBpbnB1dHNbaV0gOiB0ZXh0YXJlYXNbaSAtIGlucHV0cy5sZW5ndGhdO1xuXG4gICAgICAgICAgICAgICAgLy8gT25seSBhcHBseSB0aGUgcG9seWZpbGwgaWYgdGhpcyBlbGVtZW50IGlzIG9mIGEgdHlwZSB0aGF0IHN1cHBvcnRzIHBsYWNlaG9sZGVycywgYW5kIGhhcyBhIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSB3aXRoIGEgbm9uLWVtcHR5IHZhbHVlXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBlbGVtLmF0dHJpYnV0ZXMucGxhY2Vob2xkZXI7XG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXIubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIgJiYgVXRpbHMuaW5BcnJheSh2YWxpZFR5cGVzLCBlbGVtLnR5cGUpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGhhc24ndCBoYWQgZXZlbnQgaGFuZGxlcnMgYm91bmQgdG8gaXQgdGhlbiBhZGQgdGhlbVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtLmdldEF0dHJpYnV0ZShBVFRSX0VWRU5UU19CT1VORCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdFbGVtZW50KGVsZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgaGFzIGNoYW5nZWQgb3Igbm90IGJlZW4gaW5pdGlhbGlzZWQgeWV0IHdlIG5lZWQgdG8gdXBkYXRlIHRoZSBkaXNwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIgIT09IGVsZW0uZ2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwpIHx8IChlbGVtLnR5cGUgPT09IFwicGFzc3dvcmRcIiAmJiAhZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9JTlBVVF9UWVBFKSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF0dGVtcHQgdG8gY2hhbmdlIHRoZSB0eXBlIG9mIHBhc3N3b3JkIGlucHV0cyAoZmFpbHMgaW4gSUUgPCA5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLnR5cGUgPT09IFwicGFzc3dvcmRcIiAmJiAhZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9JTlBVVF9UWVBFKSAmJiBVdGlscy5jaGFuZ2VUeXBlKGVsZW0sIFwidGV4dFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShBVFRSX0lOUFVUX1RZUEUsIFwicGFzc3dvcmRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHBsYWNlaG9sZGVyIHZhbHVlIGhhcyBjaGFuZ2VkIGFuZCB0aGUgcGxhY2Vob2xkZXIgaXMgY3VycmVudGx5IG9uIGRpc3BsYXkgd2UgbmVlZCB0byBjaGFuZ2UgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS52YWx1ZSA9PT0gZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS52YWx1ZSA9IHBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgcGxhY2Vob2xkZXIgdmFsdWUgaW4gY2FzZSBpdCBjaGFuZ2VzIHZpYSBhbm90aGVyIHNjcmlwdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKEFUVFJfQ1VSUkVOVF9WQUwsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoQVRUUl9BQ1RJVkUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGVQbGFjZWhvbGRlcihlbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoQVRUUl9DVVJSRU5UX1ZBTCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBsaXZlIHVwZGF0ZXMgYXJlIG5vdCBlbmFibGVkIGNhbmNlbCB0aGUgdGltZXJcbiAgICAgICAgICAgIGlmICghbGl2ZVVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgICAvLyBFeHBvc2UgcHVibGljIG1ldGhvZHNcbiAgICBQbGFjZWhvbGRlcnMuZGlzYWJsZSA9IFBsYWNlaG9sZGVycy5uYXRpdmVTdXBwb3J0ID8gbm9vcCA6IGRpc2FibGVQbGFjZWhvbGRlcnM7XG4gICAgUGxhY2Vob2xkZXJzLmVuYWJsZSA9IFBsYWNlaG9sZGVycy5uYXRpdmVTdXBwb3J0ID8gbm9vcCA6IGVuYWJsZVBsYWNlaG9sZGVycztcblxufSh0aGlzKSk7Il19
;