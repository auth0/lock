import React from 'react';
import { render } from '@testing-library/react';
import { act } from '@testing-library/react';

import { mockComponent, extractPropsFromWrapper } from 'testUtils';
import InputWrap from '../../../ui/input/input_wrap';

jest.mock('ui/input/input_wrap', () => mockComponent('input_wrap'));
jest.mock('ui/input/password/password_strength', () => mockComponent('password_strength'));

jest.mock('core/index', () => ({
  ui: {
    allowPasswordAutocomplete: () => false
  },
  id: jest.fn(() => 'lock')
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
    const { container } = render(<Input {...defaultProps} />);
    act(() => {
      const inputEl = container.querySelector('input');
      const fiberKey = Object.keys(inputEl).find(k => k.startsWith('__reactProps'));
      inputEl[fiberKey].onFocus();
      inputEl[fiberKey].onChange({ target: { value: 'pass' } });
    });
    const props = extractPropsFromWrapper(container);
    expect(props.after.props).toEqual({
      messages: { strengthMessages: 'strengthMessages' },
      password: 'value',
      policy: 'policy'
    });
  });
  test('`allowPasswordAutocomplete=true` sets `autoComplete` as on', () => {
    require('core/index').ui.allowPasswordAutocomplete = () => true;
    const Input = getComponent();
    const { container } = render(<Input {...defaultProps} />);
    expect(container.querySelector('input').getAttribute('autocomplete')).toBe('on');
  });
  test('`allowPasswordAutocomplete=false` sets `autoComplete` as off', () => {
    require('core/index').ui.allowPasswordAutocomplete = () => false;
    const Input = getComponent();
    const { container } = render(<Input {...defaultProps} />);
    expect(container.querySelector('input').getAttribute('autocomplete')).toBe('off');
  });
  test('shows invalid Hint', () => {
    const Input = getComponent();
    const { container } = render(<Input {...defaultProps} />);
    // InputWrap is mocked as mockComponent('input_wrap'), find it via fiber
    const divs = container.querySelectorAll('div');
    let invalidHint;
    for (const div of divs) {
      const fiberKey = Object.keys(div).find(k => k.startsWith('__reactProps'));
      if (fiberKey) {
        const props = div[fiberKey];
        if (props['data-__type'] === 'input_wrap') {
          invalidHint = props['data-invalidHint'];
          break;
        }
      }
    }
    expect(invalidHint).toBe('invalidHint');
  });
});
