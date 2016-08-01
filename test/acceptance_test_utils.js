import Immutable, { Map, Set } from 'immutable';
import React from 'react';
import CSSCore from 'fbjs/lib/CSSCore';
import { Simulate } from 'react-addons-test-utils';
import Auth0LockPasswordless from '../src/index';
import { spy, stub } from 'sinon';
import webApi from '../src/core/web_api';
import * as gravatarActions from '../src/gravatar/actions';
import browser from '../src/browser';

// TODO: remove once all references have been replaced by CSSCore.hasClass.
function hasClass(element, str) {
  const classes = new Set(element.className.split(" "));
  return classes.has(str);
}

// We don't remove credential panes immediately because we perform a animated
// transition between them. This means that two credential panes will coexist
// for a moment. We may want to perform a query without waiting until the
// transition is over (because is rather long).
const CURRENT_CRED_PANE_SELECTOR = ".auth0-lock-cred-pane:not(.horizontal-fade-leave):not(.reverse-horizontal-fade-leave)";
export const CRED_PANE_DELAY = 1850;

// We also perform an animated transition with auxiliary panes.
const AUXILIARY_PANE_SELECTOR_SUFFIX = ":not(.slide-leave)";
export const AUXILIARY_PANE_DELAY = 400;

export const SMS_GENERIC_ERROR = "We're sorry, something went wrong when sending the SMS."
export const EMAIL_GENERIC_ERROR = "We're sorry, something went wrong when sending the email."

export function constructLock(cid = "a", domain = "a") {
  return new Auth0LockPasswordless(cid, domain);
}

function q(lock, query, all = false) {
  query = `#auth0-lock-container-${lock.id} ${query}`;
  const method = all ? "querySelectorAll" : "querySelector";
  return global.document[method](query);
}

function qLock(lock, ensure = false) {
  const node = q(lock, ".auth0-lock");
  if (ensure && !node) {
    throw new Error("Unable to query the Lock: couldn't find the element");
  }

  return node;
}

export function isRendered(lock) {
  return !!qLock(lock);
}

export function openLock(lock, method, options = {}) {
  const f = spy();
  lock[method](options, f);
  return f;
}

export function isOpened(lock) {
  const node = qLock(lock);
  return node && CSSCore.hasClass(node, "auth0-lock-opened");
}

export function closeLock(lock) {
  const node = q(lock, ".auth0-lock-close-button");
  if (!node) {
    throw new Error("Unable to close the Lock: couldn't find the close button");
  }

  Simulate.click(node, {});

  if (isOpened(lock)) {
    throw new Error("Unable to close the Lock: clicking the close button didn't work");
  }
}

export function qInput(lock, name, ensure = false) {
  // NOTE: not sure about whether this check is actually necessary
  const currentCredPanes = q(lock, CURRENT_CRED_PANE_SELECTOR, true);
  if (currentCredPanes.length > 1) {
    throw new Error("Unable to query the current credential pane: there's more than one");
  }

  const input = q(lock, `${CURRENT_CRED_PANE_SELECTOR} .auth0-lock-input-${name} input`);
  if (ensure && !input) {
    throw new Error(`Unable to query the '${name}' input value: can't find the input`);
  }

  return input;
}

export function qInputValue(lock, name) {
  return qInput(lock, name, true).value;
}

export function fillInput(lock, name, value) {
  Simulate.change(qInput(lock, name, true), {target: {value: value}});
}

export function clickInput(lock, str) {
  Simulate.click(qInput(lock, str, true), {});
}

export function isInputInvalid(lock, name) {
  const input = qInput(lock, name, true);
  const node = input.parentNode && input.parentNode.parentNode;
  if (!node) {
    throw new Error(`Unable to tell whether '${name}' input is invalid: can't find container element responsible to indicate it`);
  }
  return CSSCore.hasClass(node, "auth0-lock-error");
}

export function submit(lock) {
  resetWebApis();
  const form = q(lock, ".auth0-lock-widget");
  if (!form || form.tagName.toUpperCase() !== "FORM") {
    throw new Error(`Unable to submit form: can't find the element`);
  }

  Simulate.submit(form, {});
}

export function stubWebApis() {
  stub(webApi, "logIn").returns(undefined);
  stub(webApi, "startPasswordless").returns(undefined);
  stub(gravatarActions, "debouncedRequestGravatar").returns(undefined);
  stub(gravatarActions, "requestGravatar").returns(undefined);
}

export function restoreWebApis() {
  global.localStorage.clear(); // TODO: This doesn't belong here
  webApi.signIn.restore();
  webApi.startPasswordless.restore();
  gravatarActions.debouncedRequestGravatar.restore();
  gravatarActions.requestGravatar.restore();
}

function resetWebApis() {
  restoreWebApis();
  stubWebApis();
}

// TODO: remove once all references have been replaced by something with a
// higher level.
export function startPasswordlessCallCount() {
  return webApi.startPasswordless.callCount;
}

export function isLoading(lock) {
  const node = qLock(lock, true);
  return CSSCore.hasClass(node, "auth0-lock-mode-loading");
}

export function simulateStartPasswordlessResponse(error = null) {
  const lastCall = webApi.startPasswordless.lastCall;
  if (!lastCall) {
    throw new Error("Unable to simulate start passwordless response: no request has been made");
  }

  lastCall.args[lastCall.args.length - 1].call(undefined, error);
}

export function hasStartedPasswordless(params) {
  if (params === false) {
    return webApi.startPasswordless.callCount === 0;
  }
  const lastCall = webApi.startPasswordless.lastCall;
  const paramsFromLastCall = lastCall && lastCall.args[1];
  return paramsFromLastCall &&
    Immutable.is(Immutable.fromJS(params), Immutable.fromJS(paramsFromLastCall));
}

export function isSomethingWrong(lock, expectedMessage) {
  const node = q(lock, ".auth0-global-grobal-error");
  if (!node) {
    return false;
  }

  const acutalMessage = node.textContent;
  return typeof expectedMessage.test === "function" ?
    expectedMessage.test(acutalMessage) : expectedMessage === acutalMessage;
}

export function simulateSingInResponse(error = null) {
  const lastCall = webApi.logIn.lastCall;
  if (!lastCall) {
    throw new Error("Unable to simulate sign in response: no request has been made");
  }

  const args = error ? [error] : [null, "fake arg"];
  lastCall.args[lastCall.args.length - 1].call(undefined, ...args);
}

export function hasSignedInWith(params) {
  const lastCall = webApi.logIn.lastCall;
  const paramsFromLastCall = lastCall && lastCall.args[1];
  return Map(params).reduce((r, v, k) => {
    return r && paramsFromLastCall[k] === v;
  }, true);
}

export function isShowingConfirmation(lock) {
  return !!q(lock, ".auth0-lock-confirmation:not(.slide-leave)");
}

function qResendLink(lock, ensure = false) {
  const node = q(lock, ".auth0-lock-resend-link");
  if (ensure && !node) {
    throw new Error("Unable to click the resend link: couldn't find element");
  }

  return node;
}

export function clickResendLink(lock) {
  resetWebApis();
  const node = qResendLink(lock, true);
  Simulate.click(node, {});
}

// TODO: name the next 4 functions properly

export function isResendingLink(lock) {
  const node = qResendLink(lock);
  return node && node.textContent === "Resending...";
}

export function hasLinkBeenResent(lock) {
  const node = q(lock, ".auth0-lock-sent-label")
  if (!node) {
    throw new Error(`Unable to tell whether the link has been resent: can't find the element responsible to indicate it`);
  }

  return node.textContent === "Sent!";
}

export function hasResendingFailed(lock) {
  const node = q(lock, ".auth0-lock-sent-failed-label")
  if (!node) {
    throw new Error(`Unable to tell whether the resending link has failed: can't find the element responsible to indicate it`);
  }

  return node.textContent === "Failed!";
}

export function isRetryAvailable(lock) {
  const node = qResendLink(lock);
  return node && node.textContent.match(/Retry/);
}

function isShowingAuxiliaryPane(lock, selector) {
  return !!q(lock, `${selector}${AUXILIARY_PANE_SELECTOR_SUFFIX}`);
}

export function isShowingLocationSelector(lock) {
  return isShowingAuxiliaryPane(lock, ".auth0-lock-select-country");
}

export function qLocations(lock) {
  // TODO: there are too many details here that are subject to change. It would
  // be nice to have some abstraction to query inside an active auxiliary pane.
  return q(lock, `.auth0-lock-select-country${AUXILIARY_PANE_SELECTOR_SUFFIX} .auth0-lock-list-code > ul > li`, true);
}

export function filterLocations(lock, value) {
  // TODO: there are too many details here that are subject to change. It would
  // be nice to have some abstraction to query inside an active auxiliary pane
  // or an input that doesn't belong to a credential pane.
  const input = q(lock, `.auth0-lock-select-country${AUXILIARY_PANE_SELECTOR_SUFFIX} .auth0-lock-search input`);
  if (!input) {
    throw new Error(`Unable to filter locations: can't find the location search input`);
  }

  Simulate.change(input, {target: {value: value}});
}

export function clickFirstLocation(lock) {
  const nodes = qLocations(lock);
  if (nodes.length === 0) {
    throw new Error("Unable to click the first location: couldn't find any location to click");
  }

  Simulate.click(nodes[0], {});
}
