import React from 'react';
import ReactDOM from 'react-dom';
import Auth0LockPasswordless from '../../src/index';
import Control, { store } from './control';
import browser from '../../src/browser';
import webAPI from '../../src/lock/web_api';
const WebAPI = webAPI.constructor;

webAPI.constructor.prototype.constructor = function() {};

WebAPI.prototype.setupClient = function() {};

WebAPI.prototype.signIn = function(lockID, options, cb) {
  const state = store.deref();
  const args = state.getIn(["signIn", "response"]) == "success" ?
    [null] :
    [{description: "Wrong email or verification code.", error: "invalid_user_password"}];
  setTimeout(() => cb(...args), state.get("latency"));
};

WebAPI.prototype.signOut = function() {};

WebAPI.prototype.startPasswordless = function(lockID, options, cb) {
  const state = store.deref();
  const args = state.getIn(["startPasswordless", "response"]) == "success" ? [null] : [{}];
  setTimeout(() => cb(...args), state.get("latency"));
};

WebAPI.prototype.getUserCountry = function(lockID, cb) {
  setTimeout(() => cb(null, "AR"), 17);
}

ReactDOM.render(React.createElement(Control), document.getElementById("control-container"));
