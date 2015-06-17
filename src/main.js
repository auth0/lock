import React from 'react';
import LockActionCreators from './actions/lock_action_creators';
import IDUtils from './utils/id_utils';
import Lock from './components/lock';

export default class Auth0Lock {
  constructor(clientID, domain, options = {}) { // TODO
    this.id = IDUtils.random();
    LockActionCreators.setupLock(this.id, clientID, domain, options);
  }

  showSignin(options = {}) { // TODO
    var container = document.getElementById(options.container);
    if (container) {
      this.container = container;
      React.render(<Lock id={this.id}/>, container);
    } else {
      throw new Error('Not found element with \'id\' ' + cid);
    }
  }

  hide() { // TODO
    React.unmountComponentAtNode(this.container);
  }

  logout() { // TODO
  }
}

global.window.Auth0Lock = Auth0Lock;

// SCRATCHPAD
import AppStore from './stores/app_store';

AppStore.addChangeListener(() => {
  console.log('something has changed', AppStore.state.toJS());
});

// new Auth0Lock('client id', 'domain');
