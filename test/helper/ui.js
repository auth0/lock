import { Simulate } from 'react-addons-test-utils';
import { stub } from 'sinon';
import { Map } from 'immutable';
import Auth0Lock from '../../src/index';
import webApi from '../../src/core/web_api';
import * as gravatarProvider from '../../src/avatar/gravatar_provider';
import * as ClientSettings from '../../src/core/client/settings';
import clientSettings from './client_settings';
import * as SSOData from '../../src/core/sso/data';
import ssoData from './sso_data';

// stub, mock and spy

export const stubWebApis = () => {
  stub(webApi, "logIn").returns(undefined);
  stub(gravatarProvider, "displayName", (email, cb) => {
    cb(null, "someone");
  });
  stub(gravatarProvider, "url", (email, cb) => {
    cb(null, "https://www.gravatar.com/avatar/35b47dce0e2c9ced8b500dca20e1a657.png?size=160");
  });
  stub(ClientSettings, "fetchClientSettings", (...args) => {
    args[args.length - 1](null, clientSettings);
  });
  stub(SSOData, "fetchSSOData", (id, withAD, cb) => {
    cb(null, withAD ? { connection: {}, ...ssoData } : ssoData);
  });
}

export const stubWebApisForKerberos = () => {
  SSOData.fetchSSOData.restore();
  stub(SSOData, "fetchSSOData", (id, withAD, cb) => {
    cb(null, withAD ? { connection: {}, strategy: 'ad', ...ssoData } : ssoData);
  });
}
export const unStubWebApisForKerberos = () => {
  SSOData.fetchSSOData.restore();
  stub(SSOData, "fetchSSOData", (id, withAD, cb) => {
    cb(null, withAD ? { connection: {}, ...ssoData } : ssoData);
  });
}

export const assertAuthorizeRedirection = (cb) => {
  if (webApi.logIn.restore) {
    webApi.logIn.restore();
  }
  stub(webApi, "logIn", cb);
};

export const restoreWebApis = () => {
  webApi.logIn.restore();
  gravatarProvider.displayName.restore();
  gravatarProvider.url.restore();
  ClientSettings.fetchClientSettings.restore();
  SSOData.fetchSSOData.restore();
}

// api call checks

export const wasLoginAttemptedWith = params => {
  const lastCall = webApi.logIn.lastCall;
  if (!lastCall) return false;
  const paramsFromLastCall = lastCall.args[1];

  return Map(params).reduce(
    (r, v, k) => r && paramsFromLastCall[k] === v,
    true
  );
};

// rendering

export const displayLock = (name, opts = {}, done = () => {}, show_ops = {}) => {
  switch(name) {
  case "enterprise and corporate":
    opts.allowedConnections = ["auth0.com", "rolodato.com"];
    break;
  case "single database":
    opts.allowedConnections = ["db"];
    break;
  case "single enterprise":
    opts.allowedConnections = ["auth0.com"];
    break;
  case "multiple enterprise":
    opts.allowedConnections = ["auth0.com", "auth10.com"];
    break;
  case "single corporate":
    opts.allowedConnections = ["rolodato.com"];
    break;
  case "multiple corporate, one without domain":
    opts.allowedConnections = ["rolodato.com", "corporate-no-domain"];
    break;
  case "multiple social":
    opts.allowedConnections = ["facebook", "twitter", "github"];
    break;
  case "kerberos":
    opts.allowedConnections = ["rolodato.com"];
    break;
  }

  const lock = new Auth0Lock("cid", "domain", opts);
  setTimeout(() => lock.show(show_ops), 175);
  setTimeout(done, 200);
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

export function qInput(lock, name, ensure = false) {
  const input = qView(lock, `.auth0-lock-input-${name} input`);
  if (ensure && !input) {
    throw new Error(`Unable to query the '${name}' input value: can't find the input`);
  }
  return input;
}

const hasFn = query => lock => !!q(lock, query);
const hasInputFn = (name, str) => lock => {
  const input = qInput(lock, name);
  return str ? input.value === str : !!input;
};
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
export const hasEmailInput = hasInputFn("email");
export const hasLoginSignUpTabs = hasViewFn(".auth0-lock-tabs");
export const hasNoQuickAuthButton = lock => {
  return !qView(lock, ".auth0-lock-socia-button");
};

const hasFlashMessage = (query, lock, message) => {
  const message_ele = q(lock, query);

  if (! message_ele) {
    return false;
  }

  const span = message_ele.querySelector('span');

  if (! span) {
    return false;
  }

  return span.innerText.toLowerCase() === message.toLowerCase();
}
export const hasErrorMessage = (lock, message) => {
  return hasFlashMessage(".auth0-global-message-error", lock, message);
};
export const hasSuccessMessage = (lock, message) => {
  return hasFlashMessage(".auth0-global-message-success", lock, message);
};

export const hasOneSocialButton = hasOneViewFn(".auth0-lock-social-button");
export const hasOneSocialBigButton = hasOneViewFn(".auth0-lock-social-button.auth0-lock-social-big-button");
export const hasPasswordInput = hasInputFn("password");
export const hasTermsCheckbox = hasFn(".auth0-lock-sign-up-terms-agreement label input[type='checkbox']");
export const hasQuickAuthButton = (lock, icon, domain) => {
  // TODO: we should actually check that there's just a single button
  const xs = qView(lock, `.auth0-lock-social-button[data-provider^="${icon}"]`, true);
  return xs.length === 1 && xs[0].innerText.toLowerCase().indexOf(domain) !== -1;
};
export const hasSocialButtons = hasViewFn(".auth0-lock-social-button");
export const hasSSONotice = hasViewFn(".auth0-sso-notice-container");
export const hasSubmitButton = hasFn("button.auth0-lock-submit");
export const hasUsernameInput = hasInputFn("username");
export const isLoginTabCurrent = lock => isTabCurrent(lock, /log in/i);
export const isSignUpTabCurrent = lock => isTabCurrent(lock, /sign up/i);
export const isSubmitButtonDisabled = hasFn("button.auth0-lock-submit[disabled]");
export const haveShownError = (lock, msg) => {
  const errorElement = q(lock, ".auth0-global-message-error span");

  return errorElement.innerText.toLowerCase() === msg.toLowerCase();
};
// interactions

const check = (lock, query) => {
  Simulate.change(q(lock, query), {});
};
const click = (lock, query) => {
  Simulate.click(q(lock, query));
};
const checkFn = query => lock => check(lock, query);
const clickFn = (lock, query) => click(lock, query);
export const clickTermsCheckbox = checkFn(".auth0-lock-sign-up-terms-agreement label input[type='checkbox']");
export const clickSocialConnectionButton = (lock, connection) => clickFn(lock, `.auth0-lock-social-button[data-provider='${connection}']`);
const fillInput = (lock, name, str) => {
  Simulate.change(qInput(lock, name, true), {target: {value: str}});
};
const fillInputFn = name => (lock, str) => fillInput(lock, name, str);

export const fillEmailInput = fillInputFn("email");
export const fillPasswordInput = fillInputFn("password");
export const fillUsernameInput = fillInputFn("username");
export const fillMFACodeInput = fillInputFn("mfa_code");

export const submit = (lock) => {
  // reset web apis
  restoreWebApis();
  stubWebApis();

  submitForm(lock);
}

export const submitForm = (lock) => {
  const form = q(lock, ".auth0-lock-widget");
  if (!form || form.tagName.toUpperCase() !== "FORM") {
    throw new Error("Unable to submit form: can't find the element");
  }

  Simulate.submit(form, {});
}

export const waitUntilExists = (lock, selector, cb, timeout = 1000) => {
  const startedAt = Date.now();

  const interval = setInterval(() => {
    if (Date.now() - startedAt >= timeout) {
      clearInterval(interval);
      throw new Error(`Timeout waiting for ${selector} to become available`);
    }

    const el = q(lock, selector);

    if (el) {
      clearInterval(interval);
      cb(null, el);
    }
  }, 10);
};

export const waitUntilInputExists = (lock, name, cb, timeout) =>
  waitUntilExists(lock, `.auth0-lock-input-${name} input`, cb, timeout);

export const waitUntilErrorExists = (lock, cb, timeout) =>
  waitUntilExists(lock, ".auth0-global-message-error span", cb, timeout);

// login

export const logInWithEmailAndPassword = lock => {
  fillEmailInput(lock, "someone@example.com");
  fillPasswordInput(lock, "mypass");
  submit(lock);
};

export const logInWithUsernameAndPassword = lock => {
  fillUsernameInput(lock, "someone");
  fillPasswordInput(lock, "mypass");
  submit(lock);
};

// Helps to keep the context of what happened on a test that
// was executed as part of an async flow, the normal use
// case is to pass mocha done as the done param.
export const testAsync = (fn, done) => {
  try {
    fn();
    done();
  } catch (e) {
    done(e);
  }
};
