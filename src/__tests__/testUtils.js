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
// https://www.npmjs.com/package/jest-environment-jsdom-global
export const setURL = url => {
  jsdom.reconfigure({
    url
  });
};

export const expectMockToMatch = ({ mock }, numberOfCalls) => {
  expect(mock.calls.length).toBe(numberOfCalls);
  for (var i = 0; i < numberOfCalls; i++) {
    expect(mock.calls[i]).toMatchSnapshot();
  }
};
