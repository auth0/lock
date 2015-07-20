import React from 'react';
import LockActionCreators, { hideLock, setupLock, showLock } from './lock/action_creators';
import IDUtils from './utils/id_utils';
import Lock from './lock/lock';
import LockWebAPI from './lock/web_api';
import LockContainerManager from './lock/container_manager';
import { LockModes } from './control/constants';
import { addWatch } from './store/index';

import renderCrashed from './crashed/render';
import renderLoading from './loading/render';
import renderPasswordlessEmail from './passwordless-email/render';

export default class Auth0Lock {
  constructor(clientID, domain, options = {}) {
    this.id = IDUtils.random();
    setupLock(this.id, clientID, domain, options);
  }

  showPasswordlessEmail(options = {}, callback = () => {}) {
    // TODO: with the option `send: "code"`, `Auth0.startPasswordless` and
    // `Auth0.login` will be called and both take a callback and a `authParams`
    // object. Should we take two values for each one? how? Something similar
    // happens in `showPasswordlessSMS`.
    options.signInCallback = callback;
    options.mode = LockModes.PASSWORDLESS_EMAIL;
    showLock(this.id, options);
  }

  showPasswordlessSMS(options = {}, callback = () => {}) {
    // TODO: both `Auth0.startPasswordless` and `Auth0.login` take a callback.
    // Should we take two values for each one? how? Something similar happens
    // in `showPasswordlessEmail`.
    options.signInCallback = callback;
    options.mode = LockModes.PASSWORDLESS_SMS;
    showLock(this.id, options);
  }

  showSignin(options = {}, callback = () => {}) {
    // options.mode = "signin";
    options.signInCallback = callback;
    options.mode = LockModes.SIGN_IN;
    showLock(this.id, options);
  }

  hide() {
    hideLock(this.id);
  }

  logout(query = {}) {
    // NOTE this perfroms a redirect, so there is no need to go through the
    // whole flux cycle
    LockWebAPI.signOut(this.id, query);
  }
}

// TODO temp for DEV only
global.window.Auth0Lock = Auth0Lock;

function element(lock) {
  const mode = lock.get("mode");
  switch(mode) {
  case LockModes.CRASHED:
    return renderCrashed(lock);
  case LockModes.LOADING:
    return renderLoading(lock);
  case LockModes.PASSWORDLESS_EMAIL:
    return renderPasswordlessEmail(lock);
  default:
    throw new Error(`unknown lock mode ${mode}`);
  }
}

addWatch("main", (key, oldState, newState) => {
  newState.get("locks").toList().forEach((lock) => {
    var container = LockContainerManager.getLockContainer(
      lock.get("id"),
      lock.getIn(["showOptions", "container"]),
      !lock.get("show")
    );

    if (lock.get("show")) {
      React.render(element(lock), container);
    } else if (container) {
      React.unmountComponentAtNode(container);
    }
  });
});

// TODO is it worth to follow the flux convention for naming things and
// organizing files? We can have just one dispatcher, store, constants ns and
// actions, but a lot of utils.
