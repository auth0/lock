import React from 'react'; // eslint-disable-line
import renderer from 'react-test-renderer';

export const expectComponent = children => {
  const component = renderer.create(children);
  return expect(component);
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

export const mockComponent = (type, domElement = 'div') => props =>
  React.createElement(domElement, {
    'data-__type': type,
    ...addDataToProps(props)
  });

export const extractPropsFromWrapper = (wrapper, index = 0) =>
  removeDataFromProps(
    wrapper
      .find('div')
      .at(index)
      .props()
  );

//set urls with jest: https://github.com/facebook/jest/issues/890#issuecomment-298594389
export const setURL = (url, options = {}) => {
  const parser = document.createElement('a');
  parser.href = url;
  [
    'href',
    'protocol',
    'host',
    'hostname',
    'origin',
    'port',
    'pathname',
    'search',
    'hash'
  ].forEach(prop => {
    let value = parser[prop];
    if (prop === 'origin' && options.noOrigin) {
      value = null;
    }
    Object.defineProperty(window.location, prop, {
      value,
      writable: true
    });
  });
};

export const expectMockToMatch = ({ mock }, numberOfCalls) => {
  expect(mock.calls.length).toBe(numberOfCalls);
  for (var i = 0; i < numberOfCalls; i++) {
    expect(mock.calls[i]).toMatchSnapshot();
  }
};
