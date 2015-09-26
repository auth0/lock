
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-query/index.js", function(exports, require, module){
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

});
require.register("component-matches-selector/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var query = require('query');

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

});
require.register("component-closest/index.js", function(exports, require, module){
/**
 * Module Dependencies
 */

var matches = require('matches-selector')

/**
 * Export `closest`
 */

module.exports = closest

/**
 * Closest
 *
 * @param {Element} el
 * @param {String} selector
 * @param {Element} scope (optional)
 */

function closest (el, selector, scope) {
  scope = scope || document.documentElement;

  // walk up the dom
  while (el && el !== scope) {
    if (matches(el, selector)) return el;
    el = el.parentNode;
  }

  // check scope for match
  return matches(el, selector) ? el : null;
}

});
require.register("component-event/index.js", function(exports, require, module){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
});
require.register("component-delegate/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var closest = require('closest')
  , event = require('event');

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, selector, type, fn, capture){
  return event.bind(el, type, function(e){
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  event.unbind(el, type, fn, capture);
};

});
require.register("marcuswestin-store.js/store.js", function(exports, require, module){
;(function(win){
	var store = {},
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage

	store.disabled = false
	store.version = '1.3.17'
	store.set = function(key, value) {}
	store.get = function(key, defaultVal) {}
	store.has = function(key) { return store.get(key) !== undefined }
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal)
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}
	store.forEach = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key))
			return (val === undefined ? defaultVal : val)
		}
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		function ieKeyFix(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key)
			var val = store.deserialize(storage.getAttribute(key))
			return (val === undefined ? defaultVal : val)
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr=attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
		store.getAll = function(storage) {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled

	if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { win.store = store }

})(Function('return this')());

});
require.register("yields-indexof/index.js", function(exports, require, module){

/**
 * indexof
 */

var indexof = [].indexOf;

/**
 * Get the index of the given `el`.
 *
 * @param {Element} el
 * @return {Number}
 */

module.exports = function(el){
  if (!el.parentNode) return -1;
  var list = el.parentNode.children;

  if (!list) return -1;
  var len = list.length;

  if (indexof) return indexof.call(list, el);
  for (var i = 0; i < len; ++i) {
    if (el == list[i]) return i;
  }
  return -1;
};

});
require.register("component-trim/index.js", function(exports, require, module){

exports = module.exports = trim;

function trim(str){
  if (str.trim) return str.trim();
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  if (str.trimLeft) return str.trimLeft();
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  if (str.trimRight) return str.trimRight();
  return str.replace(/\s*$/, '');
};

});
require.register("yields-uniq-selector/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');
var trim = require('trim');

/**
 * Export `uniq`
 */

module.exports = uniq;

/**
 * Generate unique selector of `el`.
 *
 * @param {Element} el
 * @return {String}
 * @api public
 */

function uniq(el, arr){
  arr = arr && arr.join ? arr : [];
  if (!el) return arr.join(' > ');
  if (9 == el.nodeType) return arr.join(' > ');
  if (1 != el.nodeType) return arr.join(' > ');
  arr.unshift(selector(el));
  if (el.id) return arr.join(' > ');
  return uniq(el.parentNode, arr);
}

/**
 * Generate a selector of the given `el`.
 *
 * @param {Element} el
 * @return {String}
 * @api private
 */

function selector(el){
  var classname = trim(el.className.baseVal ? el.className.baseVal : el.className);
  var i = el.parentNode && 9 == el.parentNode.nodeType ? -1 : index(el);

  return el.tagName.toLowerCase()
    + (el.id ? '#' + el.id : '')
    + (classname ? classname.replace(/^| +/g, '.') : '')
    + (~i ? ':nth-child(' + (i + 1) + ')' : '');
}

});
require.register("component-bind/index.js", function(exports, require, module){
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

});
require.register("remember/index.js", function(exports, require, module){
/**
 * Module Dependencies
 */

var unique = require('uniq-selector');
var delegate = require('delegate');
var store = require('store');
var query = require('query');
var bind = require('bind');

/**
 * Selectors
 */

var buttons = 'input[type=checkbox], input[type=radio]';
var inputs = 'input, textarea';

/**
 * Regex
 */

var rbutton = /radio|checkbox/;
var rclass = /\.[_\-A-Z][_\-A-Z0-9]*/ig;

/**
 * Expose `Remember`
 */

module.exports = Remember;

/**
 * Remember
 *
 * @param {Object} options
 * @return {Remember}
 * @api public
 */

function Remember(options) {
  if(!(this instanceof Remember)) return new Remember(options);
  options = options || {};
  this.excepts = [];
  this.ids = {};
  var self = this;

  // localstorage namespace
  this.namespace = options.namespace || 'remember:';

  // pull from storage
  this.pull();

  this.oninput = bind(this, this.input);
  this.onselect = bind(this, this.select);

  // bindings
  delegate.bind(document, inputs, 'input', this.oninput);
  delegate.bind(document, buttons, 'click', this.onselect);
}

/**
 * Except
 *
 * @param {String} str
 * @return {Remember}
 */

Remember.prototype.except = function(str) {
  var els = query.all(str);
  var excepts = this.excepts;

  for (var i = 0, len = els.length; i < len; i++) {
    this.excepts.push(els[i]);
  }

  return this;
};

/**
 * Manipulate each stored item
 *
 * @return {Remember}
 * @api private
 */

Remember.prototype.each = function(fn) {
  var obj = store.getAll(),
      ns = this.namespace;

  for(var key in obj) {
    if(~key.indexOf(ns)) fn.call(this, key);
  }

  return this;
};

/**
 * Clear remember
 *
 * @return {Remember}
 * @api public
 */

Remember.prototype.clear = function() {
  this.each(function(key) {
    store.remove(key);
  });
};

/**
 * Unbind all inputs
 *
 * @return {Remember}
 * @api public
 */

Remember.prototype.unbind = function() {
  delegate.unbind(document, inputs, this.oninput);
  delegate.unbind(document, buttons, this.onselect);
};

/**
 * Pull in values from localstorage
 *
 * @return {Remember}
 * @api private
 */

Remember.prototype.pull = function() {
  var self = this;
  var ns = this.namespace;

  this.each(function(key) {
    var k = key.slice(ns.length);
    var val = store.get(key);
    this.ids[key] = setInterval(function() {
      self.fill(k, val);
    }, 200);
  });

  return this;
};

/**
 * Find and fill in elements
 *
 * @return {Remember}
 * @api private
 */

Remember.prototype.fill = function(sel, val) {
  var el = document.querySelector(sel);
  if(!el) return;

  if (rbutton.test(el.type)) {
    if (val) el.setAttribute('checked', 'checked');
    else el.removeAttribute('checked');
    dispatch(el, 'change');
  } else if (el.value !== undefined) {
    el.value = val;
    dispatch(el, 'input');
  }

  clearInterval(this.ids[this.namespace + sel]);

  return this;
};

/**
 * input
 *
 * @param {Event} e
 * @return {Remember}
 * @api private
 */

Remember.prototype.input = function(e) {
  var el = e.target;
  if(~this.excepts.indexOf(el)) return this;

  var sel = unique(el);
  var val = el.value;
  var ns = this.namespace;

  // ignore classes, too transient
  sel = sel.replace(rclass, '');
  store.set(ns + sel, val);
};

/**
 * select
 *
 * @param {Event} e
 * @return {Remember}
 * @api private
 */

Remember.prototype.select = function(e) {
  var el = e.target;
  if(~this.excepts.indexOf(el)) return this;

  var sel = unique(el);
  var checked = el.checked;
  var ns = this.namespace;

  // ignore classes, too transient
  sel = sel.replace(rclass, '');

  // If it's a radio button, uncheck all the others
  if(el.name && 'radio' === el.type) {
    var set = query.all('input[type=radio][name=' + el.name + ']');
    for (var i = 0, len = set.length; i < len; i++) {
      if(set[i] !== el) {
        store.set(ns + unique(set[i]), !checked);
      }
    }
  }

  store.set(ns + sel, checked);
};

/**
 * Dispatch a synthetic event
 */

function dispatch(el, event) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(event, true, true);
  el.dispatchEvent(e);
}

});














require.alias("component-query/index.js", "remember/deps/query/index.js");
require.alias("component-query/index.js", "query/index.js");

require.alias("component-delegate/index.js", "remember/deps/delegate/index.js");
require.alias("component-delegate/index.js", "delegate/index.js");
require.alias("component-closest/index.js", "component-delegate/deps/closest/index.js");
require.alias("component-closest/index.js", "component-delegate/deps/closest/index.js");
require.alias("component-matches-selector/index.js", "component-closest/deps/matches-selector/index.js");
require.alias("component-query/index.js", "component-matches-selector/deps/query/index.js");

require.alias("component-closest/index.js", "component-closest/index.js");
require.alias("component-event/index.js", "component-delegate/deps/event/index.js");

require.alias("marcuswestin-store.js/store.js", "remember/deps/store/store.js");
require.alias("marcuswestin-store.js/store.js", "remember/deps/store/index.js");
require.alias("marcuswestin-store.js/store.js", "store/index.js");
require.alias("marcuswestin-store.js/store.js", "marcuswestin-store.js/index.js");
require.alias("yields-uniq-selector/index.js", "remember/deps/uniq-selector/index.js");
require.alias("yields-uniq-selector/index.js", "remember/deps/uniq-selector/index.js");
require.alias("yields-uniq-selector/index.js", "uniq-selector/index.js");
require.alias("yields-indexof/index.js", "yields-uniq-selector/deps/indexof/index.js");
require.alias("yields-indexof/index.js", "yields-uniq-selector/deps/indexof/index.js");
require.alias("yields-indexof/index.js", "yields-indexof/index.js");
require.alias("component-trim/index.js", "yields-uniq-selector/deps/trim/index.js");

require.alias("yields-uniq-selector/index.js", "yields-uniq-selector/index.js");
require.alias("component-bind/index.js", "remember/deps/bind/index.js");
require.alias("component-bind/index.js", "bind/index.js");
