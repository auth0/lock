import IDUtils from '../utils/id_utils';
import { closeLock, registerMode, setupLock } from './actions';
import WebAPI from './web_api';

export default class Auth0Lock {
  static registerMode(spec) {
    registerMode(spec);
    if (typeof spec.openMethods == "object") {
      Object.keys(spec.openMethods).forEach(function(methodName) {
        Auth0Lock.prototype[methodName] = function(...args) {
          return spec.openMethods[methodName](this.id, ...args);
        }
      });
    }
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
