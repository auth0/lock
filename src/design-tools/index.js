import Renderer from '../lock/renderer';
import { subscribe, getState } from '../store/index';
import Auth0Lock from '../lock/auth0_lock';
import crashedSpec from '../crashed/mode_spec';
import passwordlessEmailSpec from '../passwordless-email/mode_spec';

Auth0Lock.registerMode(crashedSpec);
Auth0Lock.registerMode(passwordlessEmailSpec);

// TODO temp for DEV only
global.window.Auth0Lock = Auth0Lock;

const renderer = new Renderer();
subscribe("main", () => renderer.render(getState()));

import webAPI from '../lock/web_api';
const WebAPI = webAPI.constructor;

webAPI.constructor.prototype.constructor = function() {};

WebAPI.prototype.setupClient = function() {};

WebAPI.prototype.setSignInResult = function(result) {
  this.signInResult = result == "success" ? result : "error";
};

WebAPI.prototype.setSignInDelay = function(delay) {
  this.signInDelay = delay;
};

WebAPI.prototype.signIn = function(lockID, options, cb) {
  const args = this.signInResult == "success" ?
    [null] :
    [{description: "Wrong email or verification code.", error: "invalid_user_password"}];
  setTimeout(() => cb(...args), this.singInDelay);
};

WebAPI.prototype.signOut = function() {};

WebAPI.prototype.setStartPasswordlessResult = function(result) {
  this.startPasswordlessResult = result == "success" ? result : "error";
};

WebAPI.prototype.setStartPasswordlessDelay = function(delay) {
  this.startPasswordlessDelay = delay;
};

WebAPI.prototype.startPasswordless = function(lockID, options, cb) {
  const args = this.startPasswordlessResult == "success" ? [null] : [{}];
  setTimeout(() => cb(...args), this.startPasswordlessDelay);
};


import React from 'react';
import Control from './control';

React.render(React.createElement(Control), document.getElementById("control"));
