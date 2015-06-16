import IDUtils from './utils/id_utils';

export default class Auth0Lock {
  constructor(clientID, domain, options) { // TODO
    this.id = IDUtils.random();
  }

  showSignin() { // TODO
  }

  hide() { // TODO
  }

  logout() { // TODO
  }
}

global.window.Auth0Lock = Auth0Lock;
