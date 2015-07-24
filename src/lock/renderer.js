import ContainerManager from './container_manager';
import { LockModes } from '../control/constants';
import renderCrashed from '../crashed/render';
import renderPasswordlessEmail from '../passwordless-email/render';
import renderPasswordlessSMS from '../passwordless-sms/render';
import React from 'react';
import * as l from './index';

export default class Renderer {
  constructor() {
    this.containerManager = new ContainerManager();
  }

  render(locks) {
    locks.forEach(lock => {
      const container = this.containerManager.getLockContainer(
        lock.get("id"),
        l.ui.containerID(lock),
        !lock.get("show")
      );

      if (lock.get("show")) {
        React.render(this.element(lock), container);
      } else if (container) {
        React.unmountComponentAtNode(container);
      }
    });
  }

  element(lock) {
    // TODO: mode specific renderer specs should be passed to the constructor
    const mode = lock.get("mode");
    switch(mode) {
    case LockModes.CRASHED:
      return renderCrashed(lock);
    case LockModes.PASSWORDLESS_EMAIL:
      return renderPasswordlessEmail(lock);
    case LockModes.PASSWORDLESS_SMS:
      return renderPasswordlessSMS(lock);
    default:
      throw new Error(`unknown lock mode ${mode}`);
    }
  }
}
