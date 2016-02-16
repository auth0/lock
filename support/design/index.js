import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import Auth0LockPasswordless from '../../src/index';
import Control, { store } from './control';
import browser from '../../src/browser';
import * as ClientSettings from '../../src/lock/client/settings';
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

WebAPI.prototype.signUp = function(lockID, options, cb) {
  const state = store.deref();
  const args = state.getIn(["signUp", "response"]) == "success" ?
    [null] :
    [{description: "Wrong email.", error: "invalid_email"}];
  setTimeout(() => cb(...args), state.get("latency"));
};

WebAPI.prototype.startPasswordless = function(lockID, options, cb) {
  const state = store.deref();
  const args = state.getIn(["startPasswordless", "response"]) == "success" ? [null] : [{}];
  setTimeout(() => cb(...args), state.get("latency"));
};

WebAPI.prototype.resetPassword = function(lockID, options, cb) {
  const state = store.deref();
  const args = state.getIn(["resetPassword", "response"]) == "success" ? [null] : [{}];
  setTimeout(() => cb(...args), state.get("latency"));
};


WebAPI.prototype.getSSOData = function(lockID, ...args) {
  const cb = args[args.length - 1];
  // TODO: consider SSO data for other connections (for now, social is
  // the only one missing).
  const ssoData = {
    lastUsedConnection: {
      strategy: "auth0",
      name: "Username-Password-Authentication"
    },
    lastUsedUserID: "auth0|5676890e2a64397e7e0d773c",
    lastUsedUsername: "someone@auth0.com",
    lastUsedClientID: "L9kBZOpEbLizzCGv6N8n9wNfQhbvREw0",
    sessionClients: [
      "L9kBZOpEbLizzCGv6N8n9wNfQhbvREw0"
    ],
    sso: true
  };

  setTimeout(() => cb(null, ssoData), 180);
}

WebAPI.prototype.getUserCountry = function(lockID, cb) {
  setTimeout(() => cb(null, "AR"), 17);
}

WebAPI.prototype.parseHash = function(lockID, ...args) {
  return null;
}

ClientSettings.fetchClientSettings = function(clientID, domain, assetsUrl, cb) {
  // TODO: we should have propper settings for every configuration.
  const settings =  {
    strategies: [
      {
        connections: [
          {
            requires_username: false,
            showForgot: true,
            showSignup: true,
            signup_url: "https://signup.com",
            forgot_password_url: "https://forgotpassword.com",
            name: "Username-Password-Authentication"
          }
        ],
        name: "auth0"
      },
      {
        connections: [
          {
            scope: [
              "email",
              "profile"
            ],
            name: "google-oauth2"
          }
        ],
        name: "google-oauth2"
      },
      {
        connections: [
          {
            name: "sms"
          }
        ],
        name: "sms"
      }
    ],
    hasAllowedOrigins: true,
    callback: window.location.href,
    authorize: "https://authorize.com",
    subscription: "free",
    tenant: "example",
    id: "L9kBZOpEbLizzCGv6N8n9wNfQhbvREw0"
  };

  setTimeout(() => cb(null, Immutable.fromJS(settings)), 180);
}

ReactDOM.render(React.createElement(Control), document.getElementById("control-container"));
