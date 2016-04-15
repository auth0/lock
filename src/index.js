import Auth0 from 'auth0-js';
import Core from './core';
import automatic from './engine/automatic';
import css from '../css/index.css';

const head = document.getElementsByTagName('head')[0];
const style = document.createElement('style');
style.type = 'text/css';
head.appendChild(style);
if (style.styleSheet) {
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

export default class Auth0Lock extends Core {

  constructor(clientID, domain, options, signInCallback) {
    super(clientID, domain, options, signInCallback, automatic);
  }

}

// telemetry
Auth0Lock.version = __VERSION__;
Auth0.clientInfo.lib_version = Auth0.clientInfo.version;
Auth0.clientInfo.name =  "lock.js";
Auth0.clientInfo.version = Auth0Lock.version;

// TODO: should we have different telemetry for classic/passwordless?
// TODO: should we set telemetry info before each request?
// TODO: should we inject styles here?
