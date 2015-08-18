
import React from 'react';
import Auth0LockPasswordless from '../lock/auth0_lock_passwordless';
import Control, { store } from './control';

// TODO temp for DEV only
global.window.Auth0LockPasswordless = Auth0LockPasswordless;

import styles from '../../css/index.css';
import transitions from '../../css/transitions.css';
import overwrites from '../../css/overwrites.css';

import webAPI from '../lock/web_api';
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

React.render(React.createElement(Control), document.getElementById("control-container"));
