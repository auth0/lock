import Core from './core';
import passwordless from './engine/passwordless';

export default class Auth0LockPasswordless extends Core {

  constructor(clientID, domain, options, logInCallback) {
    super(clientID, domain, options, logInCallback, passwordless);
  }

}
