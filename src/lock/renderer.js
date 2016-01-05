import React from 'react';
import ReactDOM from 'react-dom';
import CSSCore from 'fbjs/lib/CSSCore';
import ContainerManager from './container_manager';
import Lock from './lock';
import * as l from './index';
import * as c from '../cred/index';
import * as g from '../gravatar/index';
import { getCollection, getEntity } from '../store/index';

export default class Renderer {
  constructor() {
    this.containerManager = new ContainerManager();
  }

  render(state, fns) {
    const locks = getCollection(state, "lock");

    locks.forEach(lock => {
      if (l.rendering(lock)) {
        const gravatar = getEntity(state, "gravatar", g.normalizeGravatarEmail(c.email(lock)));
        lock = lock.set("gravatar", gravatar && g.loaded(gravatar) ? gravatar : null);
        const container = this.containerManager.ensure(l.ui.containerID(lock), l.ui.appendContainer(lock));
        const screen = fns.get(l.modeName(lock))(lock);
        const props = {
          auxiliaryPane: screen.renderAuxiliaryPane(lock),
          backHandler: screen.backHandler(lock),
          closeHandler: screen.closeHandler(lock),
          contentRender: ::screen.render,
          footerText: screen.renderFooterText(lock),
          headerText: screen.renderHeaderText(lock),
          lock: lock,
          screenName: screen.name,
          submitHandler: screen.submitHandler(lock)
        };
        ReactDOM.render(<Lock {...props} />, container);
      } else {
        let container;
        try {
          container = this.containerManager.ensure(l.ui.containerID(lock))
        } catch (e) {
          // do nothing if container doesn't exist
        }
        container && ReactDOM.unmountComponentAtNode(container);
      }
    });

    const node = global.document.getElementsByTagName("html")[0];
    const className = "auth0-lock-html";

    const includeClass = locks.some(m => l.rendering(m) && l.ui.appendContainer(m));

    if (includeClass) {
      CSSCore.addClass(node, className);
    } else {
      CSSCore.removeClass(node, className);
    }
  }
}
