import { EventEmitter } from 'events';
import * as idu from './utils/id_utils';
import {
  closeLock,
  openLock,
  removeLock,
  setupLock,
  updateLock
} from './lock/actions';
import webAPI from './lock/web_api';
import { getEntity, read, subscribe } from './store/index';
import * as l from './lock/index';
import * as c from './field/index';
import { remove, render } from './ui/box';
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
      const m = getEntity(newState, "lock", this.id);
      const oldM = getEntity(oldState, "lock", this.id);

      if (m != oldM) {
        const partialApplyId = (screen, handlerName) => {
          const handler = screen[handlerName](m);
          return handler
            ? (...args) => handler(l.id(m), ...args)
            : handler;
        };

        const avatar = l.ui.avatar(m) && m.getIn(["avatar", "transient", "syncStatus"]) === "ok" || null;
        const title = avatar
          ? l.ui.t(m, ["welcome"], {name: m.getIn(["avatar", "transient", "displayName"]), __textOnly: true})
          : l.ui.t(m, ["title"], {__textOnly: true});

        if (l.rendering(m)) {
          const screen = this.render(m);
          const props = {
            avatar: avatar && m.getIn(["avatar", "transient", "url"]),
            auxiliaryPane: screen.renderAuxiliaryPane(m),
            backHandler: partialApplyId(screen, "backHandler"),
            closeHandler: l.ui.closable(m)
              ? partialApplyId(screen, "closeHandler")
              : undefined,
            contentRender: ::screen.render,
            footerText: screen.renderFooterText(m),
            globalError: l.globalError(m),
            globalSuccess: l.globalSuccess(m),
            headerText: screen.renderHeaderText(m),
            icon: l.ui.icon(m),
            isMobile: l.ui.mobile(m),
            isModal: l.ui.appendContainer(m),
            isSubmitting: l.submitting(m),
            model: m,
            primaryColor: l.ui.primaryColor(m),
            screenName: screen.name,
            submitHandler: partialApplyId(screen, "submitHandler"),
            tabs: screen.renderTabs(m),
            title: title,
            transitionName: screen.transitionName(m)
          };
          render(l.ui.containerID(m), props);
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

  runHook(str, ...args) {
    if (typeof this[str] != "function") return;
    const model = read(getEntity, "lock", this.id);
    return this[str](model, ...args);
  }
}

// telemetry
Base.version = __VERSION__;
Auth0.clientInfo.name +=  " (LockPasswordless)";
Auth0.clientInfo.version += ` (${__VERSION__})`;
