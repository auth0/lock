import { EventEmitter } from 'events';
import * as idu from './utils/id_utils';
import {
  closeLock,
  openLock,
  removeLock,
  setupLock,
  updateLock
} from './core/actions';
import webAPI from './core/web_api';
import { getEntity, read, subscribe } from './store/index';
import * as l from './core/index';
import * as c from './field/index';
import { remove, render } from './ui/box';
import { registerDict } from './core/i18n/index';

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

          // TODO: this is a temp hack because we need an unique name
          // for both screens when rendering the box to avoid the
          // transition between them and two different screen names to
          // distinguish translations. The latter constraint may
          // change when we revisit i18n, so wait until that is done
          // before properly fixing this.
          const screenName = ~["login", "signUp"].indexOf(screen.name)
            ? "loginSignUp"
            : screen.name;

          const t = (keyPath, params) => l.ui.t(m, [screen.name].concat(keyPath), params);

          const props = {
            avatar: avatar && m.getIn(["avatar", "transient", "url"]),
            auxiliaryPane: screen.renderAuxiliaryPane(m),
            backHandler: partialApplyId(screen, "backHandler"),
            badgeLink: "https://auth0.com/?utm_source=lock&utm_campaign=badge&utm_medium=widget",
            closeHandler: l.ui.closable(m)
              ? (...args) => closeLock(l.id(m), ...args)
              : undefined,
            contentComponent: screen.render(),
            contentProps: {model: m, t},
            error: l.globalError(m),
            isMobile: l.ui.mobile(m),
            isModal: l.ui.appendContainer(m),
            isSubmitting: l.submitting(m),
            logo: l.ui.logo(m),
            primaryColor: l.ui.primaryColor(m),
            screenName: screenName,
            success: l.globalSuccess(m),
            submitHandler: partialApplyId(screen, "submitHandler"),
            tabs: screen.renderTabs(m),
            terms: t("footerText"),
            title: title,
            transitionName: screenName === "loading" ? "fade" : "horizontal-fade"
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

  hide() {
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
//
// TODO: we should have different telemetry overrides for classic and
// passwordless.
Base.version = __VERSION__;
Auth0.clientInfo.lib_version = Auth0.clientInfo.version;
Auth0.clientInfo.name =  "lock.js";
Auth0.clientInfo.version = Base.version;
