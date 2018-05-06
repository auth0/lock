import React from 'react';
import ReactDOM from 'react-dom';
import CSSCore from 'fbjs/lib/CSSCore';
import Container from './box/container';

class ContainerManager {
  ensure(containerOption, shouldAppend) {
    let container =
      containerOption instanceof HTMLElement
        ? containerOption
        : typeof containerOption === 'string'
          ? global.document.getElementById(containerOption)
          : null;

    if (!container && shouldAppend) {
      container = global.document.createElement('div');
      container.id = containerOption || 'auth0-lock-container';
      container.className = 'auth0-lock-container';
      global.document.body.appendChild(container);
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

  render(containerOption, props) {
    const { isModal } = props;
    const container = this.containerManager.ensure(containerOption, isModal);
    const containerId = container.id;

    if (isModal && !this.modals[containerId]) {
      CSSCore.addClass(global.document.getElementsByTagName('html')[0], 'auth0-lock-html');
    }
    // eslint-disable-next-line
    const component = ReactDOM.render(<Container {...props} />, container);

    if (isModal) {
      this.modals[containerId] = component;
    }

    return component;
  }

  remove(containerOption) {
    const container = this.containerManager.ensure(containerOption, isModal);
    const containerId = container.id;
    if (this.modals[containerId]) {
      this.modals[containerId].hide();
      setTimeout(() => this.unmount(containerOption), 1000);
    } else {
      this.unmount(containerOption);
    }
  }

  unmount(containerOption) {
    try {
      const container = this.containerManager.ensure(containerOption);
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
      }
    } catch (e) {
      // do nothing if container doesn't exist
    }

    const container = this.containerManager.ensure(containerOption, isModal);
    const containerId = container.id;
    if (this.modals[containerId]) {
      delete this.modals[containerId];

      CSSCore.removeClass(global.document.getElementsByTagName('html')[0], 'auth0-lock-html');
    }
  }
}

const renderer = new Renderer();

export const render = (...args) => renderer.render(...args);
export const remove = (...args) => renderer.remove(...args);
