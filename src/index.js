import { EventEmitter } from 'events';
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
import { getEntity, read, subscribe } from './store/index';
import * as l from './lock/index';
import * as c from './cred/index';
import * as g from './gravatar/index';
import { remove, render } from './widget/render';
import { registerDict } from './dict/index';

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

export default class Base extends EventEmitter {
  constructor(mode, dict, clientID, domain, options = {}, signInCallback = () => {}) {
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

    registerDict(mode, dict);
    this.id = idu.incremental();
    const { plugins } = Base;
    const hookRunner = ::this.runHook;
    const emitEventFn = this.emit.bind(this);
    options.mode = mode;
    setupLock(this.id, clientID, domain, options, signInCallback, hookRunner, emitEventFn);

    subscribe("widget-" + this.id, (key, oldState, newState) => {
      const newM = getEntity(newState, "lock", this.id);
      const oldM = getEntity(oldState, "lock", this.id);
      const newGravatar = getEntity(
        newState,
        "gravatar",
        g.normalizeGravatarEmail(c.email(newM))
      );
      const oldGravatar = getEntity(
        oldState,
        "gravatar",
        g.normalizeGravatarEmail(c.email(oldM))
      );

      if (newM != oldM || newGravatar != oldGravatar) {
        const gravatar = newGravatar && g.loaded(newGravatar)
              ? newGravatar
              : null;
        const m = newM.set("gravatar", gravatar);

        if (l.rendering(m)) {
          const screen = this.render(m);
          const props = {
            auxiliaryPane: screen.renderAuxiliaryPane(m),
            backHandler: screen.backHandler(m),
            closeHandler: screen.closeHandler(m),
            contentRender: ::screen.render,
            footerText: screen.renderFooterText(m),
            headerText: screen.renderHeaderText(m),
            lock: m,
            screenName: screen.name,
            submitHandler: screen.submitHandler(m),
            tabs: screen.renderTabs(m),
            transitionName: screen.transitionName(m)
          };
          render(props, l.ui.containerID(m), l.ui.appendContainer(m));
        } else {
          remove(l.ui.containerID(m));
        }
      }
    });
  }

  show() {
    openLock(this.id);
  }

  close() {
    closeLock(this.id, true);
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

  setModel(m) {
    return this.update(() => m);
  }

  requestGravatar(email) {
    return requestGravatar(email);
  }

  runHook(str, ...args) {
    if (typeof this[str] != "function") return;
    const model = read(getEntity, "lock", this.id);
    return this[str](model, ...args);
  }
}

Base.plugins = new PluginManager(Base.prototype);

// telemetry
Base.version = __VERSION__;
Auth0.clientInfo.name +=  " (LockPasswordless)";
Auth0.clientInfo.version += ` (${__VERSION__})`;
