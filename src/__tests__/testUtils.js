import React from 'react'; // eslint-disable-line
import { render } from '@testing-library/react';

export const expectComponent = (children) => {
  const { asFragment } = render(children);
  return expect(asFragment());
};

export const expectShallowComponent = children => {
  const { asFragment } = render(children);
  return expect(asFragment());
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

// Access React internal fiber props from a DOM element (works with both React 18 and 19)
export const getReactProps = element => {
  const key = Object.keys(element).find(k => k.startsWith('__reactProps'));
  return key ? element[key] : {};
};

// RTL-compatible replacement for Enzyme's extractPropsFromWrapper.
// `container` is the HTMLElement returned by RTL render(). Uses React internal
// fiber props so function/ReactElement props are preserved (not DOM-serialised).
export const extractPropsFromWrapper = (container, index = 0) => {
  const divs = container.querySelectorAll('div');
  const el = divs[index];
  if (!el) return {};
  return removeDataFromProps(getReactProps(el));
};

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
