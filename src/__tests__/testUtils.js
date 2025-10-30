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
// but can use `jsdom.reconfigure` when `jsdom` is exposed globally.
// This replaces the functionality from jest-environment-jsdom-global
export const setURL = url => {
  if (global.jsdom && global.jsdom.reconfigure) {
    global.jsdom.reconfigure({
      url
    });
  } else {
    // Fallback for cases where jsdom might not be available
    const mockURL = new URL(url);
    const mockLocation = {
      href: mockURL.href,
      protocol: mockURL.protocol,
      host: mockURL.host,
      hostname: mockURL.hostname,
      port: mockURL.port,
      pathname: mockURL.pathname,
      search: mockURL.search,
      hash: mockURL.hash,
      origin: mockURL.origin,
      toString: () => mockURL.href,
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };
    
    // Force override window.location
    try {
      delete window.location;
      window.location = mockLocation;
    } catch (error) {
      try {
        Object.defineProperty(window, 'location', {
          value: mockLocation,
          writable: true,
          configurable: true
        });
      } catch (e) {
        // Store in global for fallback access
        global.mockLocation = mockLocation;
      }
    }
  }
};

export const expectMockToMatch = ({ mock }, numberOfCalls) => {
  expect(mock.calls.length).toBe(numberOfCalls);
  for (var i = 0; i < numberOfCalls; i++) {
    expect(mock.calls[i]).toMatchSnapshot();
  }
};
