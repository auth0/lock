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
    // TODO use a proper container
    if (lock.get("show")) {
      var container = document.getElementById("lock");
      if (container) {
        React.render(<Lock lock={lock}/>, container);
      } else {
        throw new Error('Not found element with \'id\' ' + cid);
      }
    } else {
      var container = document.getElementById("lock");
      React.unmountComponentAtNode(container);
    }
  });

  // DEV
  // console.log('something has changed', AppStore.state.toJS());
});
