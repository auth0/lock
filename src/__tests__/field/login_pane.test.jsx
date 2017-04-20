import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, mockComponent } from 'testUtils';

jest.mock('field/email/email_pane', () => mockComponent('email_pane'));
jest.mock('field/username/username_pane', () => mockComponent('username_pane'));
jest.mock('field/password/password_pane', () => mockComponent('password_pane'));

jest.mock('connection/database/index');
jest.mock('connection/database/actions');

const mockId = 1;
jest.mock('core/index', () => ({
  id: () => mockId
}));

import LoginPane from 'connection/database/login_pane';

describe('LoginPane', () => {
  const defaultProps = {
    emailInputPlaceholder: 'emailInputPlaceholder',
    forgotPasswordAction: 'forgotPasswordAction',
    i18n: {},
    lock: {},
    passwordInputPlaceholder: 'passwordInputPlaceholder',
    showForgotPasswordLink: true,
    showPassword: true,
    usernameInputPlaceholder: 'usernameInputPlaceholder'
  };
  const databaseIndexMock = require('connection/database/index');

  beforeEach(() => {
    databaseIndexMock.hasScreen.mockImplementation(() => true);
    databaseIndexMock.forgotPasswordLink.mockImplementation(() => 'forgotPasswordLink');
  });

  it('renders correctly', () => {
    expectComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  });
  it('shows header when instructions is not empty', () => {
    expectComponent(<LoginPane {...defaultProps} instructions="instructions" />).toMatchSnapshot();
  });
  it('shows email pane when user usernameStyle === email', () => {
    expectComponent(<LoginPane {...defaultProps} usernameStyle="email" />).toMatchSnapshot();
  });
  it('shows username pane when user usernameStyle !== email', () => {
    expectComponent(<LoginPane {...defaultProps} usernameStyle="any" />).toMatchSnapshot();
    expectComponent(<LoginPane {...defaultProps} usernameStyle="username" />).toMatchSnapshot();
  });
  it('hides password pane when showPassword===false', () => {
    expectComponent(<LoginPane {...defaultProps} showPassword={false} />).toMatchSnapshot();
  });
  describe('hides password link', () => {
    it('when showForgotPasswordLink === false', () => {
      expectComponent(
        <LoginPane {...defaultProps} showForgotPasswordLink={false} />
      ).toMatchSnapshot();
    });
    it('when lock does not have the screen `forgotPassword`', () => {
      databaseIndexMock.hasScreen.mockImplementation(
        (l, screenName) => (screenName === 'forgotPassword' ? false : true)
      );
      expectComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
    });
  });
  it('clicking password forgot link calls showResetPasswordActivity() when forgotPasswordLink() is undefined', () => {
    databaseIndexMock.forgotPasswordLink.mockImplementation(() => undefined);
    const wrapper = mount(<LoginPane {...defaultProps} />);
    wrapper.find('a.auth0-lock-alternative-link').simulate('click');

    const actions = require('connection/database/actions');
    const { calls } = actions.showResetPasswordActivity.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(mockId);
  });
});
