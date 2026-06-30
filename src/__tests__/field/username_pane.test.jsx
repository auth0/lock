import React from 'react';
import { render } from '@testing-library/react';

import { extractPropsFromWrapper, getMockProps, mockComponent } from 'testUtils';

jest.mock('ui/input/username_input', () => mockComponent('username_input'));

const getComponent = () => require('field/username/username_pane').default;

describe('UsernamePane', () => {
  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(',')
    },
    lock: {},
    placeholder: 'placeholder',
    validateFormat: false,
    usernameStyle: 'any',
    showForgotPasswordLink: true,
    showPassword: true,
    usernameInputPlaceholder: 'usernameInputPlaceholder',
    strictValidation: false
  };

  beforeEach(() => {
    jest.resetModules();

    const mockUsername = 'username';
    jest.mock('field/index', () => ({
      username: () => mockUsername,
      getFieldValue: () => mockUsername,
      isFieldVisiblyInvalid: () => true
    }));

    jest.mock('field/username', () => ({
      getUsernameValidation: () => undefined,
      usernameLooksLikeEmail: () => true,
      setUsername: 'setUsername'
    }));

    jest.mock('core/index', () => ({
      id: () => 1,
      submitting: () => false,
      ui: {
        avatar: () => false,
        allowAutocomplete: () => false
      }
    }));

    jest.mock('avatar', () => ({
      requestAvatar: jest.fn(),
      debouncedRequestAvatar: jest.fn()
    }));

    jest.mock('store/index', () => ({
      swap: jest.fn(),
      updateEntity: 'updateEntity'
    }));
  });

  it('renders correctly with isValid=false when `isFieldVisiblyInvalid` is true', () => {
    const UsernamePane = getComponent();
    const { container } = render(<UsernamePane {...defaultProps} />);
    const props = getMockProps(container.querySelector('[data-__type="username_input"]'));
    expect(props.isValid).toBe(false);
    expect(props.autoComplete).toBe(false);
  });
  it('sets `blankErrorHint` when username is empty', () => {
    const fieldIndexMock = require('field/index');
    fieldIndexMock.username = () => undefined;
    fieldIndexMock.getFieldValue = () => undefined;
    const UsernamePane = getComponent();
    const { container } = render(<UsernamePane {...defaultProps} />);
    const props = getMockProps(container.querySelector('[data-__type="username_input"]'));
    expect(props.isValid).toBe(false);
    expect(props.invalidHint).toContain('blankErrorHint');
  });
  it('sets `usernameFormatErrorHint` when usernameLooksLikeEmail() returns false and `validateFormat` is true', () => {
    const fieldUsernameMock = require('field/username');
    fieldUsernameMock.getUsernameValidation = () => ({ min: 'min', max: 'max' });
    fieldUsernameMock.usernameLooksLikeEmail = () => false;
    const UsernamePane = getComponent();
    const { container } = render(<UsernamePane {...defaultProps} validateFormat />);
    const props = getMockProps(container.querySelector('[data-__type="username_input"]'));
    expect(props.invalidHint).toContain('usernameFormatErrorHint');
  });
  it('sets isValid as true when `isFieldVisiblyInvalid` is false', () => {
    require('field/index').isFieldVisiblyInvalid = () => false;
    let UsernamePane = getComponent();
    const { container } = render(<UsernamePane {...defaultProps} />);
    const props = getMockProps(container.querySelector('[data-__type="username_input"]'));
    expect(props.isValid).toBe(true);
  });
  it('sets autoComplete to true when `allowAutocomplete` is true', () => {
    require('core/index').ui.allowAutocomplete = () => true;
    let UsernamePane = getComponent();
    const { container } = render(<UsernamePane {...defaultProps} />);
    const props = getMockProps(container.querySelector('[data-__type="username_input"]'));
    expect(props.autoComplete).toBe(true);
  });
  it('fetches the avatar on componentDidMount if ui.avatar is true and there is a username', () => {
    require('core/index').ui.avatar = () => true;
    let UsernamePane = getComponent();

    render(<UsernamePane {...defaultProps} />);

    const { mock } = require('avatar').requestAvatar;
    expect(mock.calls.length).toBe(1);
  });
  it('fetches the avatar onChange if ui.avatar is true', () => {
    require('core/index').ui.avatar = () => true;
    let UsernamePane = getComponent();

    const { container } = render(<UsernamePane {...defaultProps} />);
    const props = extractPropsFromWrapper(container, 'username_input');
    props.onChange({ target: { value: 'newUser' } });

    const { mock } = require('avatar').debouncedRequestAvatar;
    expect(mock.calls.length).toBe(1);
  });
  it('calls `swap` onChange', () => {
    let UsernamePane = getComponent();

    const { container } = render(<UsernamePane {...defaultProps} />);
    const props = extractPropsFromWrapper(container, 'username_input');
    props.onChange({ target: { value: 'newUser' } });

    const { mock } = require('store/index').swap;
    expect(mock.calls.length).toBe(2);
    expect(mock.calls[1]).toMatchSnapshot();
  });
});
