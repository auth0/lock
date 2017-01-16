import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, noop } from './testUtils'

import AuthButton from 'ui/button/auth_button';

describe('AuthButton', () => {
  const defaultProps = {
    label: 'label',
    onClick: noop,
    strategy: 'strategy'
  };
  it('renders correctly', () => {
    expectComponent(
      <AuthButton {...defaultProps} />
    ).toMatchSnapshot();
  });
  it('renders with style customizations', () => {
    expectComponent(
      <AuthButton
        {...defaultProps}
        icon="test"
        primaryColor="primaryColor"
        foregroundColor="foregroundColor"
        />
    ).toMatchSnapshot();
  });
  it('renders when `big` is false', () => {
    expectComponent(
      <AuthButton
        {...defaultProps}
        isBig={false}
        />
    ).toMatchSnapshot();
  });
  it('should trigger onClick when clicked', () => {
    const onClick = jest.fn();
    const wrapper = mount(<AuthButton {...defaultProps} onClick={onClick} />);
    wrapper.find('button').simulate('click');
    expect(onClick.mock.calls.length).toBe(1);
  });
});
