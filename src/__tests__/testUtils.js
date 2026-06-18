import React from 'react'; // eslint-disable-line
import { render } from '@testing-library/react';

export const expectComponent = (children) => {
  const { asFragment } = render(children);
  return expect(asFragment());
};

// WeakMap stores original props keyed by DOM element, populated by mockComponent via ref.
// This replaces both the data-* attribute approach (which loses types in snapshots)
// and the __reactProps$* fiber internals approach (which is an implementation detail).
const _mockProps = new WeakMap();

export const getMockProps = el => _mockProps.get(el) || {};

const addDataToProps = props => {
  const returnedProps = {};
  Object.keys(props).forEach(k => (returnedProps[`data-${k}`] = props[k]));
  return returnedProps;
};

export const mockComponent =
  (type, domElement = 'div') =>
  ({ children, ...props }) =>
    React.createElement(
      domElement,
      {
        'data-__type': type,
        ref: el => { if (el) _mockProps.set(el, props); }
      },
      children
    );

// Lookup by mock component type name: extractPropsFromWrapper(container, 'input_wrap')
// Lookup Nth of a type: extractPropsFromWrapper(container, 'auth_button', 1)
// Legacy positional (fragile, avoid): extractPropsFromWrapper(container, 2)
export const extractPropsFromWrapper = (container, typeOrIndex = 0, nth = 0) => {
  let el;
  if (typeof typeOrIndex === 'string') {
    el = container.querySelectorAll(`[data-__type="${typeOrIndex}"]`)[nth];
  } else {
    el = container.querySelectorAll('div')[typeOrIndex];
  }
  if (!el) return {};
  return getMockProps(el);
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
