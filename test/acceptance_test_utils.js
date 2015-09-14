import Immutable, { Set } from 'immutable';
import React from 'react/addons';
import CSSCore from 'react/lib/CSSCore';
const { Simulate } = React.addons.TestUtils;
import Auth0LockPasswordless from '../src/index';
import { spy, stub } from 'sinon';
import webApi from '../src/lock/web_api';
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

// We also perform an animated transition with auxiliary panes.
const AUXILIARY_PANE_SELECTOR_SUFFIX = ":not(.slide-leave)";

const DEFAULT_ERROR_MESSAGE = /We're sorry, something went wrong when sending the (email|SMS)\./;

export function constructLock(cid = "a", domain = "a") {
  return new Auth0LockPasswordless(cid, domain);
}

function q(lock, query, all = false) {
  query = `#auth0-lock-container-${lock.id} ${query}`;
  const method = all ? "querySelectorAll" : "querySelector";
  return global.document[method](query);
}

function qLock(lock) {
  return q(lock, ".auth0-lock");
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
  const svg = q(lock, ".auth0-lock-close");
  const node = svg && svg.parentNode; // node where the event handler has been attached
  if (!node) {
    throw new Error("Unable to close the Lock: couldn't find the close button");
  }

  Simulate.click(node, {});

  if (isOpened(lock)) {
    throw new Error("Unable to close the Lock: clicking the close button didn't work");
  }
}

export function qInput(lock, str, ensure = false) {
  // NOTE: not sure about whether this check is actually necessary
  const currentCredPanes = q(lock, CURRENT_CRED_PANE_SELECTOR, true);
  if (currentCredPanes.length > 1) {
    throw new Error("Unable to query the current credential pane: there's more than one");
  }

  const input = q(lock, `${CURRENT_CRED_PANE_SELECTOR} .auth0-lock-input-${str} input`);
  if (ensure && !input) {
    throw new Error(`Unable to query the '${str}' input value: can't find the input`);
  }

  return input;
}

export function qInputValue(lock, str) {
  return qInput(lock, str, true).value;
}

export function fillInput(lock, name, value) {
  Simulate.change(qInput(lock, name), {target: {value: value}});
}

export function clickInput(lock, str) {
  Simulate.click(qInput(lock, str, true), {});
}

export function isInputInvalid(lock, str) {
  const input = qInput(lock, str);
  return hasClass(input.parentNode.parentNode, "auth0-lock-error");
}

export function submit(lock) {
  resetWebApis();
  Simulate.submit(q(lock, ".auth0-lock-widget"), {});
}

export function stubWebApis() {
  stub(webApi, "signIn").returns(undefined);
  stub(webApi, "startPasswordless").returns(undefined);
  stub(gravatarActions, "requestGravatar").returns(undefined);
}

export function restoreWebApis() {
  webApi.signIn.restore();
  webApi.startPasswordless.restore();
  gravatarActions.requestGravatar.restore();
}

function resetWebApis() {
  restoreWebApis();
  stubWebApis();
}

export function startPasswordlessCallCount() {
  return webApi.startPasswordless.callCount;
}

export function isLoading(lock) {
  return hasClass(q(lock, ".auth0-lock"), "auth0-lock-mode-loading");
}

export function simulateStartPasswordlessResponse(error = null) {
  const lastCall = webApi.startPasswordless.lastCall;
  lastCall.args[lastCall.args.length - 1].call(undefined, error);
}

export function hasStartedPasswordless(ma) {
  const mb = webApi.startPasswordless.lastCall.args[1];
  return Immutable.is(Immutable.fromJS(ma), Immutable.fromJS(mb));
}

export function isSomethingWrong(lock, message = DEFAULT_ERROR_MESSAGE) {
  const error = q(lock, ".auth0-global-grobal-error").textContent;
  return typeof message.test === "function" ? message.test(error) : message === error;
}

export function simulateSingInResponse(error = null) {
  const lastCall = webApi.signIn.lastCall;
  const args = error ? [error] : [null, "fake arg"];
  lastCall.args[lastCall.args.length - 1].call(undefined, ...args);
}

export function hasSignedInWith(username, password) {
  const options = webApi.signIn.lastCall.args[1];
  return username === options.username && password === options.password;
}

export function isShowingConfirmation(lock) {
  return !!q(lock, ".auth0-lock-confirmation:not(.slide-leave)");
}

export function clickResendLink(lock) {
  resetWebApis();
  Simulate.click(q(lock, ".auth0-lock-resend-link"), {});
}

// TODO: name the next 4 functions properly

export function isResendingLink(lock) {
  const element = q(lock, ".auth0-lock-resend-link");
  return element && element.textContent === "resending...";
}

export function hasLinkBeenResent(lock) {
  return q(lock, ".auth0-lock-sent-label").textContent === "Sent!";
}

export function hasResendingFailed(lock) {
  return q(lock, ".auth0-lock-sent-failed-label").textContent === "Failed!";
}

export function isRetryAvailable(lock) {
  return q(lock, ".auth0-lock-resend-link").textContent.match(/Retry/);
}

function isShowingAuxiliaryPane(lock, selector) {
  return !!q(lock, `${selector}${AUXILIARY_PANE_SELECTOR_SUFFIX}`);
}

export function isShowingLocationSelector(lock) {
  return isShowingAuxiliaryPane(lock, ".auth0-lock-select-country");
}

export function qLocations(lock) {
  return q(lock, ".auth0-lock-list-code > ul > li", true);
}

function qLocationFilterInput(lock) {
  return q(lock, ".auth0-lock-select-country .auth0-lock-search input");
}

export function filterLocations(lock, value) {
  Simulate.change(qLocationFilterInput(lock), {target: {value: value}});
}

export function clickFirstLocation(lock) {
  const nodes = qLocations(lock);
  if (nodes.length === 0) {
    throw new Error("Unable to click the first location: couldn't find any location to click");
  }

  Simulate.click(nodes[0], {});
}
