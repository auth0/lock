import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { expectComponent } from 'testUtils';

import AuthButton from 'ui/button/auth_button';

describe('AuthButton', () => {
  const defaultProps = {
    label: 'label',
    onClick: jest.fn(),
    strategy: 'strategy'
  };
  it('renders correctly', () => {
    expectComponent(<AuthButton {...defaultProps} />).toMatchSnapshot();
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
  it('should trigger onClick when clicked', async () => {
    const { container } = render(<AuthButton {...defaultProps} />);
    await userEvent.click(container.querySelector('a'));
    expect(defaultProps.onClick.mock.calls.length).toBe(1);
  });
});
