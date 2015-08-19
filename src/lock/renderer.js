import React from 'react';
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

    locks.filter(l.rendering).forEach(lock => {
      const gravatar = getEntity(state, "gravatar", c.email(lock));
      lock = lock.set("gravatar", gravatar && g.loaded(gravatar) ? gravatar : null);
      const container = this.containerManager.ensure(l.ui.containerID(lock), l.ui.appendContainer(lock));
      const renderFn = fns.get(l.mode(lock));
      const spec = renderFn(lock)
      React.render(<Lock lock={lock} {...spec} />, container);
    });
  }
}
