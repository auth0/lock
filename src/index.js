import RenderScheduler from './lock/render_scheduler';
import Renderer from './lock/renderer';
import PluginManager from './lock/plugin_manager';
import * as idu from './utils/id_utils';
import { closeLock, removeLock, setupLock, updateLock } from './lock/actions';
import { requestGravatar } from './gravatar/actions';
import webAPI from './lock/web_api';
import emailcodeSpec from './mode/emailcode/spec';
import magiclinkSpec from './mode/magiclink/spec';
import smsSpec from './mode/sms/spec';
import socialSpec from './mode/social/spec';
import socialOrEmailcodeSpec from './mode/social-or-emailcode/spec';
import socialOrMagiclinkSpec from './mode/social-or-magiclink/spec';
import socialOrSmsSpec from './mode/social-or-sms/spec';

// styles
import styles from '../css/index.css';
// import transitions from '../css/transitions.css';

// telemetry
import version from 'package.version';
import Auth0 from 'auth0-js';

export default class Auth0LockPasswordless {
  constructor(clientID, domain) {
    if (typeof clientID != "string") {
      throw new Error("A `clientID` string must be provided as first argument.");
    }
    if (typeof domain != "string") {
      throw new Error("A `domain` string must be provided as second argument.");
    }

    this.id = idu.incremental();
    setupLock(this.id, clientID, domain);
  }

  close() {
    const f = Auth0LockPasswordless.plugins.closeFn(this.plugin);
    f(this.id, true);
  }

  destroy() {
    removeLock(this.id);
  }

  getProfile(token, cb) {
    return webAPI.getProfile(this.id, token, cb);
  }

  parseHash(hash) {
    return webAPI.parseHash(this.id, hash);
  }

  logout(query = {}) {
    webAPI.signOut(this.id, query);
  }

  update(f) {
    return updateLock(this.id, f);
  }

  requestGravatar(email) {
    return requestGravatar(email);
  }
}

Auth0LockPasswordless.plugins = new PluginManager(Auth0LockPasswordless.prototype);
Auth0LockPasswordless.renderer = new Renderer();
Auth0LockPasswordless.renderScheduler = new RenderScheduler(Auth0LockPasswordless);

Auth0LockPasswordless.plugins.register(emailcodeSpec);
Auth0LockPasswordless.plugins.register(magiclinkSpec);
Auth0LockPasswordless.plugins.register(smsSpec);
Auth0LockPasswordless.plugins.register(socialSpec);
Auth0LockPasswordless.plugins.register(socialOrEmailcodeSpec);
Auth0LockPasswordless.plugins.register(socialOrMagiclinkSpec);
Auth0LockPasswordless.plugins.register(socialOrSmsSpec);


// telemetry
Auth0LockPasswordless.version = version
Auth0.clientInfo.name +=  " (LockPasswordless)";
Auth0.clientInfo.version += ` (${version})`;
