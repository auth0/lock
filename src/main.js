import LockActionCreators from './actions/lock_action_creators';
import IDUtils from './utils/id_utils';

export default class Auth0Lock {
  constructor(clientID, domain, options = {}) { // TODO
    this.id = IDUtils.random();
    LockActionCreators.setup(this.id, clientID, domain, options);
  }

  showSignin() { // TODO
  }

  hide() { // TODO
  }

  logout() { // TODO
  }
}

global.window.Auth0Lock = Auth0Lock;

// SCRATCHPAD
import AppStore from './stores/app_store';

AppStore.addChangeListener(() => {
  console.log('something has changed', AppStore.state);
});

// new Auth0Lock('client id', 'domain');
