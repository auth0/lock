import React from 'react';
import LockActionCreators from './actions/lock_action_creators';
import IDUtils from './utils/id_utils';
import Lock from './components/lock';
import AppStore from './stores/app_store';
import WebAPIUtils from './utils/web_api_utils';
import LockContainerUtils from './utils/lock_container_utils';

export default class Auth0Lock {
  constructor(clientID, domain, options = {}) {
    this.id = IDUtils.random();
    LockActionCreators.setupLock(this.id, clientID, domain, options);
  }

  showSignin(options = {}, callback = () => {}) {
    // options.mode = "signin";
    options.signInCallback = callback;
    LockActionCreators.showLock(this.id, options);
  }

  hide() {
    LockActionCreators.hideLock(this.id);
  }

  logout(query = {}) {
    // NOTE this perfroms a redirect, so there is no need to go through the
    // whole flux cycle
    WebAPIUtils.signOut(this.id, query);
  }
}

// TODO temp for DEV only
global.window.Auth0Lock = Auth0Lock;

AppStore.addChangeListener(() => {
  AppStore.getLocks().forEach((lock) => {
    var container = LockContainerUtils.getLockContainer(
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
  // console.log('something has changed', AppStore.state.toJS());
  // global.window.appState = AppStore.state;
  // global.window.appStateJs = AppStore.state.toJS();
});

// TODO is it worth to follow the flux convention for naming things and
// organizing files? We can have just one dispatcher, store, constants ns and
// actions, but a lot of utils.
