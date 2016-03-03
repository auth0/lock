import { EventEmitter } from 'events';
import RenderScheduler from './lock/render_scheduler';
import Renderer from './lock/renderer';
import PluginManager from './lock/plugin_manager';
import * as idu from './utils/id_utils';
import {
  closeLock,
  openLock,
  removeLock,
  setupLock,
  updateLock
} from './lock/actions';
import { requestGravatar } from './gravatar/actions';
import webAPI from './lock/web_api';

// modes
import ClassicPlugin from './plugin/classic/plugin.js';
import PasswordlessPlugin from './plugin/passwordless/plugin.js';

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

export default class Auth0LockPasswordless extends EventEmitter {
  constructor(clientID, domain, options = {}, signInCallback = () => {}) {
    if (typeof clientID != "string") {
      throw new Error("A `clientID` string must be provided as first argument.");
    }
    if (typeof domain != "string") {
      throw new Error("A `domain` string must be provided as second argument.");
    }
    if (typeof options != "object") {
      throw new Error("When provided, the third argument must be an `options` object.");
    }
    if (typeof signInCallback != "function") {
      // TODO: should this argument be mandatory?
      throw new Error("When provided, the fourth argument must be a function.");
    }

    super();

    this.id = idu.incremental();
    const { plugins } = Auth0LockPasswordless;
    const hookRunner = plugins.execHook.bind(plugins);
    const emitEventFn = this.emit.bind(this);
    setupLock(this.id, clientID, domain, options, signInCallback, hookRunner, emitEventFn);
  }

  show() {
    openLock(this.id);
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

  parseHash(hash = undefined) {
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
// TODO: do we need to store this stuff?
Auth0LockPasswordless.renderer = new Renderer();
Auth0LockPasswordless.renderScheduler = new RenderScheduler(Auth0LockPasswordless);

// modes
Auth0LockPasswordless.plugins.register(ClassicPlugin);
Auth0LockPasswordless.plugins.register(PasswordlessPlugin);

// telemetry
Auth0LockPasswordless.version = __VERSION__;
Auth0.clientInfo.name +=  " (LockPasswordless)";
Auth0.clientInfo.version += ` (${__VERSION__})`;
