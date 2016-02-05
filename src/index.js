import RenderScheduler from './lock/render_scheduler';
import Renderer from './lock/renderer';
import PluginManager from './lock/plugin_manager';
import * as idu from './utils/id_utils';
import { closeLock, removeLock, setupLock, updateLock } from './lock/actions';
import { requestGravatar } from './gravatar/actions';
import webAPI from './lock/web_api';

// modes
import DatabaseMode from './database/mode';
import EmailcodeMode from './passwordless/emailcode/mode';
import MagiclinkMode from './passwordless/magiclink/mode';
import SmsMode from './passwordless/sms/mode';
import SocialMode from './social/mode';
import SocialOrDatabaseMode from './compound-mode/social-or-database/mode';
import SocialOrEmailcodeMode from './compound-mode/social-or-emailcode/mode';
import SocialOrMagiclinkMode from './compound-mode/social-or-magiclink/mode';
import SocialOrSmsMode from './compound-mode/social-or-sms/mode';

// telemetry
import Auth0 from 'auth0-js';

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

export default class Auth0LockPasswordless {
  constructor(clientID, domain, options = {}) {
    if (typeof clientID != "string") {
      throw new Error("A `clientID` string must be provided as first argument.");
    }
    if (typeof domain != "string") {
      throw new Error("A `domain` string must be provided as second argument.");
    }
    if (typeof options != "object") {
      throw new Error("When provided, the third argument must be an `options` object.");
    }

    this.id = idu.incremental();
    setupLock(this.id, clientID, domain, options);
    Auth0LockPasswordless.plugins.execHookAll("didInitialize", this.id);
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

// modes
Auth0LockPasswordless.plugins.register(DatabaseMode);
Auth0LockPasswordless.plugins.register(EmailcodeMode);
Auth0LockPasswordless.plugins.register(MagiclinkMode);
Auth0LockPasswordless.plugins.register(SmsMode);
Auth0LockPasswordless.plugins.register(SocialMode);
Auth0LockPasswordless.plugins.register(SocialOrDatabaseMode);
Auth0LockPasswordless.plugins.register(SocialOrEmailcodeMode);
Auth0LockPasswordless.plugins.register(SocialOrMagiclinkMode);
Auth0LockPasswordless.plugins.register(SocialOrSmsMode);


// telemetry
Auth0LockPasswordless.version = __VERSION__;
Auth0.clientInfo.name +=  " (LockPasswordless)";
Auth0.clientInfo.version += ` (${__VERSION__})`;
