(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Auth0Lock = (function () {
  function Auth0Lock(clientID, domain, options) {
    _classCallCheck(this, Auth0Lock);
  }

  _createClass(Auth0Lock, [{
    key: "showSignin",
    value: function showSignin() {}
  }, {
    key: "hide",
    value: function hide() {}
  }, {
    key: "logout",
    value: function logout() {}
  }]);

  return Auth0Lock;
})();

exports["default"] = Auth0Lock;

global.window.Auth0Lock = Auth0Lock;
module.exports = exports["default"];
// TODO
// TODO
// TODO
// TODO

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ25hbmRyZXR0YS9Db2RlL2F1dGgwL2xvY2stcmVmYWN0b3Ivc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7OztJQ0FxQixTQUFTO0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFEcEIsU0FBUztHQUUzQjs7ZUFGa0IsU0FBUzs7V0FJbEIsc0JBQUcsRUFDWjs7O1dBRUcsZ0JBQUcsRUFDTjs7O1dBRUssa0JBQUcsRUFDUjs7O1NBWGtCLFNBQVM7OztxQkFBVCxTQUFTOztBQWM5QixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0aDBMb2NrIHtcbiAgY29uc3RydWN0b3IoY2xpZW50SUQsIGRvbWFpbiwgb3B0aW9ucykgeyAvLyBUT0RPXG4gIH1cblxuICBzaG93U2lnbmluKCkgeyAvLyBUT0RPXG4gIH1cblxuICBoaWRlKCkgeyAvLyBUT0RPXG4gIH1cblxuICBsb2dvdXQoKSB7IC8vIFRPRE9cbiAgfVxufVxuXG5nbG9iYWwud2luZG93LkF1dGgwTG9jayA9IEF1dGgwTG9jaztcbiJdfQ==
