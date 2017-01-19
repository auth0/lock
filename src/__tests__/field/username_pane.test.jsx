import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

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
    usernameInputPlaceholder: 'usernameInputPlaceholder'
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
      ui: {
        avatar: () => false
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

  it('renders correctly', () => {
    const UsernamePane = getComponent();
    expectComponent(
      <UsernamePane
        {...defaultProps}
        />
    ).toMatchSnapshot();
  });
  it('sets `blankErrorHint` when username is empty', () => {
    const fieldIndexMock = require('field/index');
    fieldIndexMock.username = () => undefined;
    fieldIndexMock.getFieldValue = () => undefined;
    const UsernamePane = getComponent();

    expectComponent(
      <UsernamePane
        {...defaultProps}
        />
    ).toMatchSnapshot();
  });
  it('sets `usernameFormatErrorHint` when usernameLooksLikeEmail() returns false and `validateFormat` is true', () => {
    const fieldUsernameMock = require('field/username');
    fieldUsernameMock.getUsernameValidation = () => ({ min: 'min', max: 'max' });
    fieldUsernameMock.usernameLooksLikeEmail = () => false;
    const UsernamePane = getComponent();

    expectComponent(
      <UsernamePane
        {...defaultProps}
        validateFormat
        />
    ).toMatchSnapshot();
  });
  it('sets isValid as true when `isFieldVisiblyInvalid` is false', () => {
    require('field/index').isFieldVisiblyInvalid = () => false;
    let UsernamePane = getComponent();

    expectComponent(
      <UsernamePane
        {...defaultProps}
        />
    ).toMatchSnapshot();
  });
  it('fetches the avatar on componentDidMount if ui.avatar is true and there is a username', () => {
    require('core/index').ui.avatar = () => true;
    let UsernamePane = getComponent();

    mount(<UsernamePane {...defaultProps} />);

    const {mock} = require('avatar').requestAvatar;
    expect(mock.calls.length).toBe(1);
  });
  it('fetches the avatar onChange if ui.avatar is true', () => {
    require('core/index').ui.avatar = () => true;
    let UsernamePane = getComponent();

    const wrapper = mount(<UsernamePane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper)
    props.onChange({ target: { value: 'newUser' } });

    const {mock} = require('avatar').debouncedRequestAvatar;
    expect(mock.calls.length).toBe(1);
  });
  it('calls `swap` onChange', () => {
    let UsernamePane = getComponent();

    const wrapper = mount(<UsernamePane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper)
    props.onChange({ target: { value: 'newUser' } });

    const {mock} = require('store/index').swap;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
