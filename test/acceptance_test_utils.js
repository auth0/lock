import Immutable, { Set } from 'immutable';
import React from 'react/addons';
const { Simulate } = React.addons.TestUtils;
import Auth0LockPasswordless from '../src/lock/auth0_lock_passwordless';
import { spy, stub } from 'sinon';
import webApi from '../src/lock/web_api';
import * as gravatarActions from '../src/gravatar/actions';

function hasClass(element, str) {
  const classes = new Set(element.className.split(" "));
  return classes.has(str);
}

const PANE_PREFIX = ".auth0-lock-intro:not(.horizontal-fade-leave)";
const DEFAULT_ERROR_MESSAGE = "We're sorry, something went wrong when sending the email.";

export function constructLock(cid = "a", domain = "a") {
  return new Auth0LockPasswordless(cid, domain);
}

function q(lock, query) {
  query = `#auth0-lock-container-${lock.id} ${query}`;
  return global.document.querySelector(query);
}

export function isRendered(lock) {
  return !!q(lock, ".auth0-lock");
}

export function openLock(lock, method, options = {}) {
  const f = spy();
  lock[method](options, f);
  return f;
}

export function isOpened(lock) {
  return hasClass(q(lock, ".auth0-lock"), "auth0-lock-opened");
}

export function qInput(lock, str) {
  return q(lock, `${PANE_PREFIX} .auth0-lock-input-${str} input`);
}

export function qInputValue(lock, str) {
  return qInput(lock, str).value;
}

export function fillInput(lock, name, value) {
  Simulate.change(qInput(lock, name), {target: {value: value}});
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
  return q(lock, ".auth0-global-grobal-error").textContent === message;
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
  return q(lock, ".auth0-lock-sent-label").textContent === "Failed!";
}

export function isRetryAvailable(lock) {
  return q(lock, ".auth0-lock-resend-link").textContent.match(/Retry/);
}
