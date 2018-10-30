import React from 'react';
import { mount, shallow } from 'enzyme';

import { mockComponent } from 'testUtils';
import { extractPropsFromWrapper } from '../../testUtils';

jest.mock('ui/input/input_wrap', () => mockComponent('input_wrap'));
jest.mock('ui/input/password/password_strength', () => mockComponent('password_strength'));

jest.mock('core/index', () => ({
  ui: {
    allowPasswordAutocomplete: () => false
  }
}));

const getComponent = () => require('ui/input/password_input').default;

describe('PasswordInput', () => {
  const defaultProps = {
    invalidHint: 'invalidHint',
    showPasswordStrengthMessage: true,
    isValid: true,
    onChange: jest.fn(),
    policy: 'policy',
    strengthMessages: { strengthMessages: 'strengthMessages' },
    value: 'value',
    showPassword: false,
    lock: {}
  };
  test('sends PasswordStrength as the `after` param', () => {
    const Input = getComponent();
    const wrapper = mount(<Input {...defaultProps} />);
    wrapper.find('input').simulate('focus');
    wrapper.find('input').simulate('change', { target: { value: 'pass' } });
    const props = extractPropsFromWrapper(wrapper);
    expect(props.after.props).toEqual({
      messages: { strengthMessages: 'strengthMessages' },
      password: 'value',
      policy: 'policy'
    });
  });
  test('`allowPasswordAutocomplete=true` sets `autoComplete` as on', () => {
    require('core/index').ui.allowPasswordAutocomplete = () => true;
    const Input = getComponent();
    const wrapper = mount(<Input {...defaultProps} />);
    expect(wrapper.find('input').props().autoComplete).toBe('on');
  });
  test('`allowPasswordAutocomplete=false` sets `autoComplete` as off', () => {
    require('core/index').ui.allowPasswordAutocomplete = () => false;
    const Input = getComponent();
    const wrapper = mount(<Input {...defaultProps} />);
    expect(wrapper.find('input').props().autoComplete).toBe('off');
  });
});
