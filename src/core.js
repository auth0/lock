import { EventEmitter } from 'events';
import { getEntity, read, subscribe } from './store/index';
import { remove, render } from './ui/box';
import webAPI from './core/web_api';
import {
  closeLock,
  openLock,
  removeLock,
  setupLock,
  updateLock
} from './core/actions';
import { termsAccepted } from './connection/database/index';
import * as l from './core/index';
import * as c from './field/index';
import * as idu from './utils/id_utils';

export default class Base extends EventEmitter {

  constructor(clientID, domain, options = {}, logInCallback = () => {}, engine) {
    if (typeof clientID != "string") {
      throw new Error("A `clientID` string must be provided as first argument.");
    }
    if (typeof domain != "string") {
      throw new Error("A `domain` string must be provided as second argument.");
    }
    if (typeof options != "object") {
      throw new Error("When provided, the third argument must be an `options` object.");
    }
    if (typeof logInCallback != "function") {
      // TODO: should this argument be mandatory?
      throw new Error("When provided, the fourth argument must be a function.");
    }

    super();

    this.id = idu.incremental();
    this.engine = engine;
    const hookRunner = ::this.runHook;
    const emitEventFn = this.emit.bind(this);

    setupLock(this.id, clientID, domain, options, logInCallback, hookRunner, emitEventFn);

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
          const screen = this.engine.render(m);

          // TODO: this is a temp hack because we need an unique name
          // for both screens when rendering the box to avoid the
          // transition between them and two different screen names to
          // distinguish translations. The latter constraint may
          // change when we revisit i18n, so wait until that is done
          // before properly fixing this.
          const screenName = ~["login", "signUp"].indexOf(screen.name)
            ? "loginSignUp"
            : screen.name;
          const disableSubmitButton = screen.name === "signUp"
            && !termsAccepted(m);

          const t = (keyPath, params) => l.ui.t(m, [keyPath], params);

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
            disableSubmitButton: disableSubmitButton,
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
            terms: screen.renderTerms(m, t),
            title: title,
            transitionName: screenName === "loading" ? "fade" : "horizontal-fade"
          };
          render(l.ui.containerID(m), props);

          // TODO: hack so we can start testing the beta
          if (!this.oldScreenName || this.oldScreenName != screen.name) {
            if (screen.name === "login") {
              l.emitEvent(m, "signin ready");
            } else if (screen.name === "signUp") {
              l.emitEvent(m, "signup ready");
            }
          }
          this.oldScreenName = screen.name;
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
    if (typeof this.engine[str] != "function") return;
    return this.engine[str](read(getEntity, "lock", this.id), ...args);
  }

}
