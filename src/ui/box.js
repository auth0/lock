import React from 'react';
import { createRoot } from 'react-dom/client';
import CSSCore from '../CSSCore';
import Container from './box/container';

class ContainerManager {
  ensure(id, shouldAppend) {
    let container = window.document.getElementById(id);

    if (!container && shouldAppend) {
      container = window.document.createElement('main');
      container.id = id;
      container.className = 'auth0-lock-container';
      window.document.body.appendChild(container);
    }

    if (!container) {
      throw new Error(`Can't find element with id ${id}`);
    }

    return container;
  }
}

class Renderer {
  constructor() {
    this.containerManager = new ContainerManager();
    this.modals = {};
  }

  render(containerId, props) {
    const { isModal } = props;
    const container = this.containerManager.ensure(containerId, isModal);

    if (isModal && !this.modals[containerId]) {
      CSSCore.addClass(window.document.getElementsByTagName('html')[0], 'auth0-lock-html');
    }
    // eslint-disable-next-line
    const root = this.modals[containerId] ? this.modals[containerId].root : createRoot(container);

    if (!this.modals[containerId]) {
      this.modals[containerId] = { root };
    }

    root.render(
      <Container
        {...props}
        ref={component => {
          if (component && isModal) {
            this.modals[containerId].component = component;
          }
        }}
      />
    );
  }

  remove(containerId) {
    if (this.modals[containerId] && this.modals[containerId].component) {
      this.modals[containerId].component.hide();
      setTimeout(() => this.unmount(containerId), 1000);
    } else {
      this.unmount(containerId);
    }
  }

  unmount(containerId) {
    try {
      const container = this.containerManager.ensure(containerId);
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
      }
    } catch (e) {
      // do nothing if container doesn't exist
    }

    if (this.modals[containerId]) {
      this.modals[containerId].root.unmount();
      delete this.modals[containerId];

      CSSCore.removeClass(window.document.getElementsByTagName('html')[0], 'auth0-lock-html');
    }
  }
}

const renderer = new Renderer();

export const render = (...args) => renderer.render(...args);
export const remove = (...args) => renderer.remove(...args);
