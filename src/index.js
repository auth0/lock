import Core, { injectStyles, css } from './core';
import classic from './engine/classic';

export default class Auth0Lock extends Core {
  constructor(clientID, domain, options) {
    super(clientID, domain, options, classic);
    injectStyles();
  }
}

// telemetry
Auth0Lock.version = __VERSION__;

// TODO: should we have different telemetry for classic/passwordless?
// TODO: should we set telemetry info before each request?
// TODO: should we inject styles here?
