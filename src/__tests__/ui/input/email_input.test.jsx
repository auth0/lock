import React from 'react';
import { render } from '@testing-library/react';

import { mockComponent } from 'testUtils';

jest.mock('ui/input/input_wrap', () => mockComponent('input_wrap'));

const getComponent = () => require('ui/input/email_input').default;

describe('EmailInput', () => {
  const defaultProps = {
    autoComplete: false,
    invalidHint: 'invalidHint',
    isValid: true,
    onChange: jest.fn(),
    value: 'value',
    lockId: 1
  };

  test('renders without issue', () => {
    const Input = getComponent();
    const { container } = render(<Input {...defaultProps} />);

    expect(container.innerHTML).toMatchSnapshot();
  });
});
