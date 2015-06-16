(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsId_utils = require('./utils/id_utils');

var _utilsId_utils2 = _interopRequireDefault(_utilsId_utils);

var Auth0Lock = (function () {
  function Auth0Lock(clientID, domain, options) {
    _classCallCheck(this, Auth0Lock);

    // TODO
    this.id = _utilsId_utils2['default'].random();
  }

  _createClass(Auth0Lock, [{
    key: 'showSignin',
    value: function showSignin() {}
  }, {
    key: 'hide',
    value: function hide() {}
  }, {
    key: 'logout',
    value: function logout() {}
  }]);

  return Auth0Lock;
})();

exports['default'] = Auth0Lock;

global.window.Auth0Lock = Auth0Lock;
module.exports = exports['default'];
// TODO
// TODO
// TODO

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utils/id_utils":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  random: function random() {
    return (+new Date() + Math.floor(Math.random() * 10000000)).toString(36);
  }
};
module.exports = exports["default"];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ25hbmRyZXR0YS9Db2RlL2F1dGgwL2xvY2stcmVmYWN0b3Ivc3JjL21haW4uanMiLCIvVXNlcnMvZ25hbmRyZXR0YS9Db2RlL2F1dGgwL2xvY2stcmVmYWN0b3Ivc3JjL3V0aWxzL2lkX3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs2QkNBb0Isa0JBQWtCOzs7O0lBRWpCLFNBQVM7QUFDakIsV0FEUSxTQUFTLENBQ2hCLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOzBCQURwQixTQUFTOzs7QUFFMUIsUUFBSSxDQUFDLEVBQUUsR0FBRywyQkFBUSxNQUFNLEVBQUUsQ0FBQztHQUM1Qjs7ZUFIa0IsU0FBUzs7V0FLbEIsc0JBQUcsRUFDWjs7O1dBRUcsZ0JBQUcsRUFDTjs7O1dBRUssa0JBQUcsRUFDUjs7O1NBWmtCLFNBQVM7OztxQkFBVCxTQUFTOztBQWU5QixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7Ozs7Ozs7Ozs7Ozs7O3FCQ2pCckI7QUFDYixRQUFNLEVBQUUsa0JBQU07QUFDWixXQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFBLENBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQzFFO0NBQ0YiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IElEVXRpbHMgZnJvbSAnLi91dGlscy9pZF91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dGgwTG9jayB7XG4gIGNvbnN0cnVjdG9yKGNsaWVudElELCBkb21haW4sIG9wdGlvbnMpIHsgLy8gVE9ET1xuICAgIHRoaXMuaWQgPSBJRFV0aWxzLnJhbmRvbSgpO1xuICB9XG5cbiAgc2hvd1NpZ25pbigpIHsgLy8gVE9ET1xuICB9XG5cbiAgaGlkZSgpIHsgLy8gVE9ET1xuICB9XG5cbiAgbG9nb3V0KCkgeyAvLyBUT0RPXG4gIH1cbn1cblxuZ2xvYmFsLndpbmRvdy5BdXRoMExvY2sgPSBBdXRoMExvY2s7XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIHJhbmRvbTogKCkgPT4ge1xuICAgIHJldHVybiAoK25ldyBEYXRlKCkgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMCkpLnRvU3RyaW5nKDM2KTtcbiAgfVxufVxuIl19
