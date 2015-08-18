import RenderScheduler from './lock/render_scheduler';
import Renderer from './lock/renderer';
import PluginManager from './lock/plugin_manager';
import IDUtils from './utils/id_utils';
import { setupLock } from './lock/actions';
import webAPI from './lock/web_api';
// import crashedSpec from '../crashed/mode_spec';
import passwordlessEmailSpec from './passwordless-email/mode_spec';
import passwordlessSMSSpec from './passwordless-sms/mode_spec';

// telemetry
import p from '../package';
import Auth0 from 'auth0-js';

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


// telemetry
Auth0LockPasswordless.version = p.version
Auth0.clientInfo.name +=  " (LockPasswordless)";
Auth0.clientInfo.version += ` (${Auth0LockPasswordless.version})`;
