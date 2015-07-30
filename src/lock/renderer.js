import React from 'react';
import Auth0Lock from './auth0_lock';
import ContainerManager from './container_manager';
import Lock from './lock';
import * as l from './index';

export default class Renderer {
  constructor() {
    this.containerManager = new ContainerManager();
  }

  render(locks) {
    locks.filter(l.render).forEach(lock => {
      const container = this.containerManager.ensure(l.ui.containerID(lock), l.ui.appendContainer(lock));

      if (l.show(lock)) {
        const spec = this.spec(lock);
        React.render(<Lock lock={lock} {...spec} />, container);
      } else if (container) {
        React.unmountComponentAtNode(container);
      }
    });
  }

  spec(lock) {
    // TODO: this class should not depend on Auth0Lock
    const modeRender = Auth0Lock.modeRender(l.mode(lock));
    if (typeof modeRender != "function") {
      throw new Error(`unknown lock mode ${mode}`);
    }
    return modeRender(lock);
  }
}
