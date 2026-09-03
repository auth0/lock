import React from 'react';
import { mockComponent, renderShallowComponent } from 'testUtils';

jest.mock('ui/input/input_wrap', () => mockComponent('input_wrap'));

const getComponent = () => require('ui/input/select_input').default;

describe('SelectInput', () => {
  const defaultProps = {
    lockId: 'lock1',
    isValid: true,
    label: 'Select',
    name: 'phone',
    onClick: jest.fn(),
    placeholder: 'Select an option'
  };

  it('passes the dynamic name prop to InputWrap', () => {
    const SelectInput = getComponent();
    const rendered = renderShallowComponent(<SelectInput {...defaultProps} />);
    expect(rendered.props.name).toBe('phone');
  });

  it('does not pass the hardcoded "location" string as name to InputWrap', () => {
    const SelectInput = getComponent();
    const rendered = renderShallowComponent(<SelectInput {...defaultProps} />);
    expect(rendered.props.name).not.toBe('location');
  });

  it('reflects a different name value correctly in InputWrap', () => {
    const SelectInput = getComponent();
    const rendered = renderShallowComponent(<SelectInput {...defaultProps} name="country" />);
    expect(rendered.props.name).toBe('country');
    expect(rendered.props.name).not.toBe('location');
  });

  it('generates a dynamic CSS class based on the name prop', () => {
    const SelectInput = getComponent();
    const rendered = renderShallowComponent(<SelectInput {...defaultProps} name="country" />);
    const input = rendered.props.children[0];
    expect(input.props.className).toContain('auth0-lock-input-country');
    expect(input.props.className).not.toContain('auth0-lock-input-location');
  });

  it('does not hardcode auth0-lock-input-location as the CSS class', () => {
    const SelectInput = getComponent();
    const rendered = renderShallowComponent(<SelectInput {...defaultProps} name="phone" />);
    const input = rendered.props.children[0];
    expect(input.props.className).toContain('auth0-lock-input-phone');
    expect(input.props.className).not.toContain('auth0-lock-input-location');
  });
});
