import { stub } from 'sinon';
import Auth0Lock from '../../src/index';
import * as ClientSettings from '../../src/core/client/settings';
import clientSettings from './client_settings';
import * as SSOData from '../../src/core/sso/data';
import ssoData from './sso_data';

// stub, mock and spy

export const stubWebApis = () => {
  stub(ClientSettings, "fetchClientSettings", (...args) => {
    args[args.length - 1](null, clientSettings);
  });
  stub(SSOData, "fetchSSOData", (id, withAD, cb) => {
    cb(null, withAD ? { connection: {}, ...ssoData } : ssoData);
  });
}

export const restoreWebApis = () => {
  ClientSettings.fetchClientSettings.restore();
  SSOData.fetchSSOData.restore();
}

// rendering

export const displayLock = (name, opts = {}, done = () => {}) => {
  switch(name) {
  case "single database":
    opts.connections = ["Username-Password-Authentication"];
    break;
  case "single enterprise":
    opts.connections = ["auth0.com"];
    break;
  case "multiple enterprise":
    opts.connections = ["auth0.com", "auth10.com"];
    break;
  case "single corporate":
    opts.connections = ["rolodato"];
    break;
  case "multiple corporate, one without domain":
    opts.connections = ["rolodato", "ad-no-domain"];
    break;
  case "multiple social":
    opts.connections = ["facebook", "twitter", "github"];
    break;
  case "kerberos":
    opts.connections = ["rolodato"];
    break;
  }

  const lock = new Auth0Lock("cid", "domain", opts);
  setTimeout(() => lock.show(), 1);
  setTimeout(done, 10);
  return lock;
};


// queries

const q = (lock, query, all = false) => {
  query = `#auth0-lock-container-${lock.id} ${query}`;
  const method = all ? "querySelectorAll" : "querySelector";
  return global.document[method](query);
};

const qView = (lock, query, all = false) => {
  // NOTE: When an animation is running, two views will be in the
  // DOM. Both are siblings, and the one that is entering (that is,
  // the one that will remain visible) is always the first sibling.
  const view = q(lock, ".auth0-lock-view-content");
  const method = all ? "querySelectorAll" : "querySelector";
  return view ? view[method](query) : null;
};

const hasFn = query => lock => !!q(lock, query);
const hasViewFn = query => lock => !!qView(lock, query);
const hasOneViewFn = query => lock => qView(lock, query, true).length == 1;

const isTabCurrent = (lock, regexp) => {
  // TODO: this won't work with translations, we need another
  // mechanism.
  const currentTabs = qView(lock, ".auth0-lock-tabs-current", true);
  return currentTabs.length === 1
    && currentTabs[0].innerText.match(regexp);
};

export const hasAlternativeLink = hasViewFn(".auth0-lock-alternative-link");
export const hasBackButton = hasFn(".auth0-lock-back-button");
export const hasEmailInput = hasViewFn(".auth0-lock-input-email");
export const hasLoginSignUpTabs = hasViewFn(".auth0-lock-tabs");
export const hasOneSocialButton = hasOneViewFn(".auth0-lock-social-button");
export const hasOneSocialBigButton = hasOneViewFn(".auth0-lock-social-button.auth0-lock-social-big-button");
export const hasPasswordInput = hasViewFn(".auth0-lock-input-password");
export const hasSocialButtons = hasViewFn(".auth0-lock-social-button");
export const hasSubmitButton = hasFn("button.auth0-lock-submit");
export const hasUsernameInput = hasViewFn(".auth0-lock-input-username");
export const isLoginTabCurrent = lock => isTabCurrent(lock, /login/i);
export const isSignUpTabCurrent = lock => isTabCurrent(lock, /sign up/i);
