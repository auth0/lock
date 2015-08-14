import PluginManager from './plugin_manager';
import IDUtils from '../utils/id_utils';
import { setupLock } from './actions';
import WebAPI from './web_api';

export default class Auth0LockPasswordless {
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
    var f = Auth0LockPasswordless.plugins.closeFn(this.plugin);
    f(this.id, true);
  }

  logout(query = {}) {
    // TODO: create action
    WebAPI.signOut(this.id, query);
  }
}

Auth0LockPasswordless.plugins = new PluginManager(Auth0LockPasswordless.prototype);
