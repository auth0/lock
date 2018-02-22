import Core, { injectStyles, css } from './core';
import passwordless from './engine/passwordless';

export default class Auth0LockPasswordless extends Core {
  constructor(clientID, domain, options) {
    super(clientID, domain, options, passwordless);
    injectStyles();
  }
}

Auth0LockPasswordless.version = __VERSION__;
