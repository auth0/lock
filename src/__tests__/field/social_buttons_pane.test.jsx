import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/button/auth_button', () => mockComponent('auth_button'));

const getComponent = () => require('field/social/social_buttons_pane').default;

describe('SocialButtonsPane', () => {
  const defaultProps = {
    lock: {
      get: p => {
        expect(p).toBe('id');
        return 'lock-id-1';
      }
    },
    labelFn: (...keys) => keys.join(','),
    showLoading: false,
    signUp: false,
    disabled: false
  };

  beforeEach(() => {
    jest.resetModules();

    jest.mock('quick-auth/actions', () => ({
      logIn: jest.fn()
    }));

    jest.mock('connection/social/index', () => ({
      displayName: () => 'displayName',
      socialConnections: () => [
        { item: 1, get: key => `socialConnections1-${key}` },
        { item: 2, get: key => `socialConnections2-${key}` }
      ],
      authButtonsTheme: () => ({
        get: () => ({
          get: key => `authButtonsTheme-${key}`
        })
      })
    }));

    jest.mock('connection/database/index', () => ({
      termsAccepted: () => false
    }));

    jest.mock('connection/database/actions', () => ({
      signUpError: jest.fn()
    }));

    jest.mock('core/index', () => ({
      id: () => 1,
      emitEvent: jest.fn()
    }));
  });

  it('renders correctly', () => {
    const SocialButtonsPane = getComponent();
    expectComponent(<SocialButtonsPane {...defaultProps} />).toMatchSnapshot();
  });
  it('calls signUpError when isSignUp===true and terms were not accepted', () => {
    const SocialButtonsPane = getComponent();

    const wrapper = mount(<SocialButtonsPane {...defaultProps} signUp={true} />);
    const props = extractPropsFromWrapper(wrapper, 2);

    props.onClick();

    const { mock } = require('connection/database/actions').signUpError;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('shows loading when showLoading === true', () => {
    const SocialButtonsPane = getComponent();
    expectComponent(<SocialButtonsPane {...defaultProps} showLoading />).toMatchSnapshot();
  });
  it('shows header when instructions are available', () => {
    const SocialButtonsPane = getComponent();
    expectComponent(
      <SocialButtonsPane {...defaultProps} instructions="instructions" />
    ).toMatchSnapshot();
  });
  it('calls `logIn` with social connection 1 when first button is clicked', () => {
    let SocialButtonsPane = getComponent();

    const wrapper = mount(<SocialButtonsPane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper, 2);

    props.onClick();

    const { mock } = require('quick-auth/actions').logIn;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('calls `logIn` with social connection 2 when second button is clicked', () => {
    let SocialButtonsPane = getComponent();

    const wrapper = mount(<SocialButtonsPane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper, 3);

    props.onClick();

    const { mock } = require('quick-auth/actions').logIn;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
