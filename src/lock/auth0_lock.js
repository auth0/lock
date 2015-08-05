import IDUtils from '../utils/id_utils';
import { closeLock, setupLock } from './actions';
import WebAPI from './web_api';

export default class Auth0Lock {
  static registerMode(spec) {
    this.modes = this.modes || {};
    this.modes[spec.name] = spec;
    if (typeof spec.openMethods == "object") {
      Object.keys(spec.openMethods).forEach(function(methodName) {
        Auth0Lock.prototype[methodName] = function(...args) {
          return spec.openMethods[methodName](this.id, ...args);
        }
      });
    }
  }

  static modeRender(name) {
    return (this.modes || {})[name].render;
  }

  static modeOpen(name) {
    return (this.modes || {})[name].open;
  }

  constructor(clientID, domain) {
    if (typeof clientID != "string") {
      throw new Error("A `clientID` string must be provided as first argument.");
    }
    if (typeof domain != "string") {
      throw new Error("A `domain` string must be provided as second argument.");
    }

    this.id = IDUtils.random();
    setupLock(this.id, clientID, domain);
  }

  close() {
    closeLock(this.id);
  }

  logout(query = {}) {
    // TODO: create action
    WebAPI.signOut(this.id, query);
  }
}
