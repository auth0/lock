import Core, { injectStyles, setWindowHeightStyle } from './core';
import passwordless from './engine/passwordless';

export default class Auth0LockPasswordless extends Core {
  constructor(clientID, domain, options) {
    super(clientID, domain, options, passwordless);
    injectStyles();
    setWindowHeightStyle();

    window.addEventListener('resize', () => {
      setWindowHeightStyle();
    });
  }
}

Auth0LockPasswordless.version = __VERSION__;
