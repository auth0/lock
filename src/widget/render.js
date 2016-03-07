import React from 'react';
import ReactDOM from 'react-dom';
import CSSCore from 'fbjs/lib/CSSCore';
import Container from './container';

class ContainerManager {

  constructor() {
    this.cache = {};
  }

  ensure(id, shouldAppend) {
    let container = this.cache[id];

    if (!container) {
      container = this.cache[id] = global.document.getElementById(id);
    }

    if (!container && shouldAppend) {
      container = global.document.createElement('div');
      container.id = id;
      container.className = "auth0-lock-container";
      this.cache[id] = global.document.body.appendChild(container);
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
    this.modalContainerIds = [];
  }

  render(props, containerId, isModal) {
    const container = this.containerManager.ensure(containerId, isModal);

    if (isModal && this.modalContainerIds.indexOf(containerId) === -1) {
      this.modalContainerIds.push(containerId);
      CSSCore.addClass(
        global.document.getElementsByTagName("html")[0],
        "auth0-lock-html"
      );
    }

    ReactDOM.render(<Container {...props} />, container);
  }

  remove(containerId) {
    try {
      const container = this.containerManager.ensure(containerId);
      ReactDOM.unmountComponentAtNode(container);
    } catch (e) {
      // do nothing if container doesn't exist
    }

    if (this.modalContainerIds.indexOf(containerId) > -1) {
      this.modalContainerIds.splice(
        this.modalContainerIds.indexOf(containerId),
        1
      );

      CSSCore.removeClass(
        global.document.getElementsByTagName("html")[0],
        "auth0-lock-html"
      );
    }
  }

}

const renderer = new Renderer();

export const render = (...args) => renderer.render(...args);
export const remove = (...args) => renderer.remove(...args);
