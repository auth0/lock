import RenderScheduler from './render_scheduler';
import Renderer from './renderer';
import PluginManager from './plugin_manager';
import IDUtils from '../utils/id_utils';
import { setupLock } from './actions';
import webAPI from './web_api';
// import crashedSpec from '../crashed/mode_spec';
import passwordlessEmailSpec from '../passwordless-email/mode_spec';
import passwordlessSMSSpec from '../passwordless-sms/mode_spec';

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
    webAPI.signOut(this.id, query);
  }
}

Auth0LockPasswordless.plugins = new PluginManager(Auth0LockPasswordless.prototype);
Auth0LockPasswordless.renderer = new Renderer();
Auth0LockPasswordless.renderScheduler = new RenderScheduler(Auth0LockPasswordless);

// Auth0LockPasswordless.plugins.register(crashedSpec);
Auth0LockPasswordless.plugins.register(passwordlessEmailSpec);
Auth0LockPasswordless.plugins.register(passwordlessSMSSpec);
