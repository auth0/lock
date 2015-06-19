import React from 'react';
import LockActionCreators from './actions/lock_action_creators';
import IDUtils from './utils/id_utils';
import Lock from './components/lock';
import AppStore from './stores/app_store';

export default class Auth0Lock {
  constructor(clientID, domain, options = {}) { // TODO
    this.id = IDUtils.random();
    LockActionCreators.setupLock(this.id, clientID, domain, options);
  }

  showSignin(options = {}) { // TODO
    options.mode = "signin";
    LockActionCreators.showLock(this.id, options);
  }

  hide() { // TODO
    LockActionCreators.hideLock(this.id);
  }

  logout() { // TODO
  }
}

// TODO temp for DEV only
global.window.Auth0Lock = Auth0Lock;

AppStore.addChangeListener(() => {
  AppStore.getLocks().forEach((lock) => {
    // TODO refactor this mess :)
    var showOptions = lock.get("showOptions");
    var containerID = showOptions.get("container");
    var container;

    if (lock.get("show")) {
      if (containerID) {
         container = document.getElementById(containerID);
         if (!container) {
           throw new Error('Not found element with \'id\' ' + cid);
         }
      } else {
        containerID = `auth0-lock-container-${lock.get("id")}`;
        container = document.getElementById(containerID);
        if (!container) {
          container = document.createElement('div');
          container.id = containerID;
          document.body.appendChild(container);
        }
      }
      React.render(<Lock lock={lock}/>, container);
    } else {
      var containerID = showOptions.get("container") || `auth0-lock-container-${lock.get("id")}`;
      container = document.getElementById(containerID);
      if (container) {
        React.unmountComponentAtNode(container);
      }
    }
  });

  // DEV
  // console.log('something has changed', AppStore.state.toJS());
  // global.window.appState = AppStore.state;
  // global.window.appStateJs = AppStore.state.toJS();
});
