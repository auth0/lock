import React from 'react';
import { closeLock, openLock, setupLock} from './lock/actions';
import IDUtils from './utils/id_utils';
import LockWebAPI from './lock/web_api';
import Renderer from './lock/renderer';
import RenderScheduler from './lock/render_scheduler';
import { LockModes } from './control/constants';
import { subscribe, getUIState } from './store/index';


export default class Auth0Lock {
  constructor(clientID, domain, options = {}) {
    this.id = IDUtils.random();
    setupLock(this.id, clientID, domain, options);
  }

  showPasswordlessEmail(options = {}, callback = () => {}) {
    options.signInCallback = callback;
    options.modeOptions = {send: options.send};
    const mode = LockModes.PASSWORDLESS_EMAIL;
    openLock(this.id, mode, options);
  }

  // showPasswordlessSMS(options = {}, callback = () => {}) {
  //   options.signInCallback = callback;
  //   options.mode = LockModes.PASSWORDLESS_SMS;
  //   openLock(this.id, options);
  // }

  hide() {
    closeLock(this.id);
  }

  logout(query = {}) {
    // TODO: create action
    LockWebAPI.signOut(this.id, query);
  }
}

// TODO temp for DEV only
global.window.Auth0Lock = Auth0Lock;

const renderer = new Renderer();
const renderScheduler = new RenderScheduler();
subscribe("renderScheduler", locks => {
  renderScheduler.schedule(() => renderer.render(getUIState()));
});

// TODO is it worth to follow the flux convention for naming things and
// organizing files? We can have just one dispatcher, store, constants ns and
// actions, but a lot of utils.
