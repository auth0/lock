import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import _ from '../../src/browser';
import Control, { store } from './control';
import * as ClientSettings from '../../src/core/client/settings';
import webAPI from '../../src/core/web_api';
const WebAPI = webAPI.constructor;

webAPI.constructor.prototype.constructor = function() {};

WebAPI.prototype.setupClient = function() {};

WebAPI.prototype.logIn = function(lockID, options, authParams, cb) {
  const state = store.deref();
  const args = state.getIn(["logIn", "response"]) == "success" ?
    [null] :
    [{description: "Wrong email or verification code.", error: "invalid_user_password"}];
  setTimeout(() => cb(...args), state.get("latency"));
};

WebAPI.prototype.logout = function() {};

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


WebAPI.prototype.getSSOData = function(lockID, withAD, cb) {
  // TODO: consider SSO data for other connections
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

  if (withAD) {
    ssoData.connection = {};
  }

  setTimeout(() => cb(null, ssoData), 180);
}

WebAPI.prototype.getUserCountry = function(lockID, cb) {
  setTimeout(() => cb(null, "AR"), 17);
}

WebAPI.prototype.parseHash = function(lockID, ...args) {
  return null;
}

ClientSettings.fetchClientSettings = function(clientID, clientBaseUrl, cb) {
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
            name: "Username-Password-Authentication",
            passwordPolicy: "fair"
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
            name: "rolodato",
            domain: "rolodato.com",
            domain_aliases: [
              "rolodato.com"
            ]
          },
          {
            name: "ad-no-domain",
            domain: null
          },
        ],
        name: "ad"
      },
      {
        connections: [
          {
            name: "benjimon.com",
            domain: "benjimon.com",
            domain_aliases: [
              "benjimon.com"
            ]
          },
        ],
        name: "office365"
      },
      {
        connections: [
          {
            name: "evilrabbit.com",
            domain: "evilrabbit.com",
            domain_aliases: [
              "evilrabbit.com"
            ]
          },
        ],
        name: "samlp"
      },
      {
        connections: [
          {
            name: "auth0.com",
            domain: "auth0.com",
            domain_aliases: [
              "auth0.com"
            ],
            scope: [
              "email",
              "profile"
            ]
          },
        ],
        name: "google-apps",
      },
      {
        connections: [
          {
            name: "auth10.com",
            domain: "auth10.com",
            domain_aliases: [
              "auth10.com"
            ],
            scope: [
              "email",
              "profile"
            ]
          },
        ],
        name: "google-apps",
      },
      {
        connections: [
          {
            name: "exact"
          }
        ],
        name: "exact"
      },
      {
        connections: [
          {
            name: "facebook"
          }
        ],
        name: "facebook"
      },
      {
        connections: [
          {
            name: "fitbit"
          }
        ],
        name: "fitbit"
      },
      {
        connections: [
          {
            name: "thirtysevensignals"
          }
        ],
        name: "thirtysevensignals"
      },
      {
        connections: [
          {
            name: "twitter"
          }
        ],
        name: "twitter"
      },
      {
        connections: [
          {
            name: "windowslive"
          }
        ],
        name: "windowslive"
      },
      {
        connections: [
          {
            name: "wordpress"
          }
        ],
        name: "wordpress"
      },
      {
        connections: [
          {
            name: "github"
          }
        ],
        name: "github"
      },
      {
        connections: [
          {
            name: "email"
          }
        ],
        name: "email"
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

  setTimeout(() => cb(null, settings), 180);
}

ReactDOM.render(React.createElement(Control), document.getElementById("control-container"));
