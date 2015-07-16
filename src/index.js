import React from 'react';
import LockActionCreators from './lock/action_creators';
import IDUtils from './utils/id_utils';
import Lock from './lock/lock';
import LockWebAPI from './lock/web_api';
import LockContainerManager from './lock/container_manager';
import { LockModes } from './control/constants';

import {dispatch, getLocks, store} from './event-sourcing/index';

export default class Auth0Lock {
  constructor(clientID, domain, options = {}) {
    this.id = IDUtils.random();
    LockActionCreators.setupLock(this.id, clientID, domain, options);
  }

  showPasswordlessEmail(options = {}, callback = () => {}) {
    // TODO: with the option `send: "code"`, `Auth0.startPasswordless` and
    // `Auth0.login` will be called and both take a callback and a `authParams`
    // object. Should we take two values for each one? how? Something similar
    // happens in `showPasswordlessSMS`.
    options.signInCallback = callback;
    options.mode = LockModes.PASSWORDLESS_EMAIL;
    LockActionCreators.showLock(this.id, options);
  }

  showPasswordlessSMS(options = {}, callback = () => {}) {
    // TODO: both `Auth0.startPasswordless` and `Auth0.login` take a callback.
    // Should we take two values for each one? how? Something similar happens
    // in `showPasswordlessEmail`.
    options.signInCallback = callback;
    options.mode = LockModes.PASSWORDLESS_SMS;
    LockActionCreators.showLock(this.id, options);
  }

  showSignin(options = {}, callback = () => {}) {
    // options.mode = "signin";
    options.signInCallback = callback;
    options.mode = LockModes.SIGN_IN;
    LockActionCreators.showLock(this.id, options);
  }

  hide() {
    LockActionCreators.hideLock(this.id);
  }

  logout(query = {}) {
    // NOTE this perfroms a redirect, so there is no need to go through the
    // whole flux cycle
    LockWebAPI.signOut(this.id, query);
  }
}

// TODO temp for DEV only
global.window.Auth0Lock = Auth0Lock;

store.register(() => {
  getLocks().forEach((lock) => {
    var container = LockContainerManager.getLockContainer(
      lock.get("id"),
      lock.getIn(["showOptions", "container"])
    );

    if (lock.get("show")) {
      React.render(<Lock lock={lock}/>, container);
    } else {
      React.unmountComponentAtNode(container);
    }
  });

  // DEV
  // console.log('something has changed', store.getState().toJS());
  // global.window.appState = store.getState();
  // global.window.appStateJs = store.getState().toJS();
});

// TODO is it worth to follow the flux convention for naming things and
// organizing files? We can have just one dispatcher, store, constants ns and
// actions, but a lot of utils.
