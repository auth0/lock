import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, noop, mockComponent } from './testUtils';

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

    const mockId = 1;
    jest.mock('core/index', () => ({
      id: () => mockId,
      ui: {
        avatar: () => false
      }
    }));

    jest.mock('store/index', () => ({
      swap: () => { },
      updateEntity: () => { }
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
    jest.mock('field/index', () => ({
      username: () => undefined,
      getFieldValue: () => undefined,
      isFieldVisiblyInvalid: (noop) => { }
    }));
    const UsernamePane = getComponent();
    expectComponent(
      <UsernamePane
        {...defaultProps}
        />
    ).toMatchSnapshot();
  });
  it('sets `usernameFormatErrorHint` when usernameLooksLikeEmail() returns false and `validateFormat` is true', () => {
    jest.mock('field/username', () => ({
      getUsernameValidation: () => ({ min: 'min', max: 'max' }),
      usernameLooksLikeEmail: () => false,
      setUsername: () => { }
    }));
    const UsernamePane = getComponent();
    expectComponent(
      <UsernamePane
        {...defaultProps}
        validateFormat
        />
    ).toMatchSnapshot();
  });
  it('sets isValid as true when `isFieldVisiblyInvalid` is false', () => {
    jest.mock('field/index', () => ({
      username: () => undefined,
      getFieldValue: () => undefined,
      isFieldVisiblyInvalid: () => false
    }));
    let UsernamePane = getComponent();
    expectComponent(
      <UsernamePane
        {...defaultProps}
        />
    ).toMatchSnapshot();
  });
  it('fetches the avatar on componentDidMount if ui.avatar is true and there is a username', () => {
    const mockId = 1;
    jest.mock('core/index', () => ({
      id: () => mockId,
      ui: {
        avatar: () => true
      }
    }));
    const mockAvatar = jest.fn();
    jest.mock('avatar', () => ({
      requestAvatar: mockAvatar
    }));
    let UsernamePane = getComponent();

    mount(<UsernamePane {...defaultProps} />);

    expect(mockAvatar.mock.calls.length).toBe(1);
  });
  it('fetches the avatar onChange if ui.avatar is true', () => {
    const mockId = 1;
    jest.mock('core/index', () => ({
      id: () => mockId,
      ui: {
        avatar: () => true
      }
    }));
    const mockAvatar = jest.fn();
    jest.mock('avatar', () => ({
      requestAvatar: () => {},
      debouncedRequestAvatar: mockAvatar
    }));
    let UsernamePane = getComponent();

    const wrapper = mount(<UsernamePane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper)
    props.onChange({target: {value: 'newUser'}});
    
    expect(mockAvatar.mock.calls.length).toBe(1);
  });
  it('calls `swap` onChange', () => {
    const mockSwap = jest.fn();
    jest.mock('store/index', () => ({
      swap: mockSwap,
      updateEntity: 'updateEntity'
    }));

    let UsernamePane = getComponent();

    const wrapper = mount(<UsernamePane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper)
    props.onChange({target: {value: 'newUser'}});
    
    expect(mockSwap.mock.calls.length).toBe(1);
    expect(mockSwap.mock.calls[0]).toMatchSnapshot();
  });
});
