import React from 'react';
import { hideLock, setupLock, showLock } from './lock/actions';
import IDUtils from './utils/id_utils';
import LockWebAPI from './lock/web_api';
import Renderer from './lock/renderer';
import { LockModes } from './control/constants';
import { subscribe } from './store/index';


export default class Auth0Lock {
  constructor(clientID, domain, options = {}) {
    this.id = IDUtils.random();
    setupLock(this.id, clientID, domain, options);
  }

  showPasswordlessEmail(options = {}, callback = () => {}) {
    options.signInCallback = callback;
    options.mode = LockModes.PASSWORDLESS_EMAIL;
    showLock(this.id, options);
  }

  showPasswordlessSMS(options = {}, callback = () => {}) {
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

const renderer = new Renderer();
subscribe("main", locks => renderer.render(locks));

// TODO is it worth to follow the flux convention for naming things and
// organizing files? We can have just one dispatcher, store, constants ns and
// actions, but a lot of utils.
