import { EventEmitter } from 'events';
import { getEntity, observe, read } from './store/index';
import { remove, render } from './ui/box';
import webAPI from './core/web_api';
import {
  closeLock,
  handleAuthCallback,
  openLock,
  removeLock,
  setupLock,
  updateLock
} from './core/actions';
import { termsAccepted } from './connection/database/index';
import * as l from './core/index';
import * as c from './field/index';
import * as idu from './utils/id_utils';
import * as i18n from './i18n';

import { go } from './sync';

export default class Base extends EventEmitter {

  constructor(clientID, domain, options = {}, engine) {
    if (typeof clientID != "string") {
      throw new Error("A `clientID` string must be provided as first argument.");
    }
    if (typeof domain != "string") {
      throw new Error("A `domain` string must be provided as second argument.");
    }
    if (typeof options != "object") {
      throw new Error("When provided, the third argument must be an `options` object.");
    }

    super();

    this.id = idu.incremental();
    this.engine = engine;
    const hookRunner = ::this.runHook;
    const emitEventFn = this.emit.bind(this);

    go(this.id);

    setupLock(this.id, clientID, domain, options, hookRunner, emitEventFn);

    if (!Base.hasScheduledAuthCallback) {
      Base.hasScheduledAuthCallback = true;
      setTimeout(handleAuthCallback, 0);
    }

    observe("render", this.id, m => {
      const partialApplyId = (screen, handlerName) => {
        const handler = screen[handlerName](m);
        return handler
          ? (...args) => handler(l.id(m), ...args)
          : handler;
      };

      const avatar = l.ui.avatar(m) && m.getIn(["avatar", "transient", "syncStatus"]) === "ok" || null;
      const title = avatar
        ? i18n.str(m, "welcome", m.getIn(["avatar", "transient", "displayName"]))
        : i18n.str(m, "title");

      if (l.rendering(m)) {
        const screen = this.engine.render(m);

        const disableSubmitButton = screen.name === "main.signUp"
          && !termsAccepted(m);

        const i18nProp = {
          group: keyPath => i18n.group(m, keyPath),
          html: (keyPath, ...args) => i18n.html(m, keyPath, ...args),
          str: (keyPath, ...args) => i18n.str(m, keyPath, ...args)
        };

        const props = {
          avatar: avatar && m.getIn(["avatar", "transient", "url"]),
          auxiliaryPane: screen.renderAuxiliaryPane(m),
          autofocus: l.ui.autofocus(m),
          backHandler: partialApplyId(screen, "backHandler"),
          badgeLink: "https://auth0.com/?utm_source=lock&utm_campaign=badge&utm_medium=widget",
          closeHandler: l.ui.closable(m)
            ? (...args) => closeLock(l.id(m), ...args)
            : undefined,
          contentComponent: screen.render(),
          contentProps: {i18n: i18nProp, model: m},
          disableSubmitButton: disableSubmitButton,
          error: l.globalError(m),
          isMobile: l.ui.mobile(m),
          isModal: l.ui.appendContainer(m),
          isSubmitting: l.submitting(m),
          logo: l.ui.logo(m),
          primaryColor: l.ui.primaryColor(m),
          screenName: screen.name,
          showBadge: l.showBadge(m) === true,
          success: l.globalSuccess(m),
          submitButtonLabel: l.ui.labeledSubmitButton(m)
            ? screen.submitButtonLabel(m)
            : null,
          submitHandler: partialApplyId(screen, "submitHandler"),
          tabs: screen.renderTabs(m),
          terms: screen.renderTerms(m, i18nProp.html("signUpTerms")),
          title: title,
          transitionName: screen.name === "loading" ? "fade" : "horizontal-fade"
        };
        render(l.ui.containerID(m), props);

        // TODO: hack so we can start testing the beta
        if (!this.oldScreenName || this.oldScreenName != screen.name) {
          if (screen.name === "main.login") {
            l.emitEvent(m, "signin ready");
          } else if (screen.name === "main.signUp") {
            l.emitEvent(m, "signup ready");
          }
        }
        this.oldScreenName = screen.name;
      } else {
        remove(l.ui.containerID(m));
      }
    });
  }

  show(opts = {}) {
    openLock(this.id, opts);
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

  logout(query = {}) {
    webAPI.signOut(this.id, query);
  }

  update(f) {
    return updateLock(this.id, f);
  }

  setModel(m) {
    return this.update(() => m);
  }

  runHook(str, m, ...args) {
    if (typeof this.engine[str] != "function") return m;
    return this.engine[str](m, ...args);
  }

}
