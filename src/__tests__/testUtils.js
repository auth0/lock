import React from 'react'; // eslint-disable-line
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import { JavascriptModulesPlugin } from 'webpack';

export const expectComponent = (children, opts) => {
  const component = renderer.create(children, opts);
  return expect(component);
};

export const expectShallowComponent = children => {
  const component = renderShallowComponent(children);
  return expect(component);
};

export const renderShallowComponent = children => {
  const renderer = new ShallowRenderer();

  renderer.render(children);
  return renderer.getRenderOutput();
};

const addDataToProps = props => {
  const returnedProps = {};
  Object.keys(props).forEach(k => (returnedProps[`data-${k}`] = props[k]));
  return returnedProps;
};

const removeDataFromProps = props => {
  const returnedProps = {};
  Object.keys(props).forEach(k => (returnedProps[k.replace('data-', '')] = props[k]));
  return returnedProps;
};

export const mockComponent =
  (type, domElement = 'div') =>
  ({ children, ...props }) =>
    React.createElement(
      domElement,
      {
        'data-__type': type,
        ...addDataToProps(props)
      },
      children
    );

export const extractPropsFromWrapper = (wrapper, index = 0) =>
  removeDataFromProps(wrapper.find('div').at(index).props());

// Newer (> Jest v22) versions don't allow modification of location.href
// Try jsdom.reconfigure() first (via custom environment), then fall back to property mocking
export const setURL = url => {
  // Approach 1: Use jsdom.reconfigure() if available (cleanest)
  if (global.jsdom && typeof global.jsdom.reconfigure === 'function') {
    global.jsdom.reconfigure({ url });
    return;
  }

  // Approach 2: Fallback - Mock location properties with Object.defineProperty
  const parsedUrl = new URL(url);

  delete window.location;
  Object.defineProperty(window, 'location', {
    value: {
      href: parsedUrl.href,
      origin: parsedUrl.origin,
      protocol: parsedUrl.protocol,
      host: parsedUrl.host,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      pathname: parsedUrl.pathname,
      search: parsedUrl.search,
      hash: parsedUrl.hash,
      // Add toString for debugging
      toString: () => parsedUrl.href
    },
    writable: true,
    configurable: true
  });
};

export const expectMockToMatch = ({ mock }, numberOfCalls) => {
  expect(mock.calls.length).toBe(numberOfCalls);
  for (var i = 0; i < numberOfCalls; i++) {
    expect(mock.calls[i]).toMatchSnapshot();
  }
};
