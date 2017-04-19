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
  removeDataFromProps(wrapper.find('div').at(index).props());
