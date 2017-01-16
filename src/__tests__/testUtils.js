import React from 'react'; // eslint-disable-line
import renderer from 'react-test-renderer';

export const expectComponent = (children) => {
  const component = renderer.create(children);
  return expect(component);
};

export const noop = () => {};

export const mockComponent = type => (...props) => <div data-type={type}>{JSON.stringify(props)}</div>;
