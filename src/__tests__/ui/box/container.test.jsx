import React from 'react';
import immutable from 'immutable';
import { expectComponent, mockComponent } from '../../testUtils';

jest.mock('store/index', () => ({
  swap: jest.fn(),
  updateEntity: 'updateEntity'
}));

jest.mock('ui/box/chrome', () => mockComponent('chrome'));

jest.mock('connection/database/index', () => ({
  databaseUsernameValue: jest.fn()
}));

const mockEvent = {
  preventDefault: () => {}
};

const getContainer = opts => {
  const Container = require('ui/box/container').default;

  const props = Object.assign(
    {},
    {
      contentProps: {
        i18n: {},
        model: immutable.fromJS({
          client: {
            connections: {
              database: [{ name: 'dbA' }, { name: 'dbB' }]
            },
            id: 'alksdkhasd__test-lock__alsdkhalkshd'
          },
          field: {
            email: {
              invalidHint: null,
              showInvalid: false,
              valid: true,
              value: 'peter_picked@pickledpepper.com'
            }
          }
        })
      }
    },
    opts
  );

  return new Container(props);
};

describe('Container', () => {
  it('does not call `connectionResolver` on submit when there is no custom `connectionResolver`', () => {
    const c = getContainer();

    c.handleSubmit(mockEvent);
    const { mock } = require('store/index').swap;
    expect(mock.calls.length).toBe(0);
  });

  it('should submit the form when the form is not yet submitting', () => {
    const c = getContainer({ isSubmitting: false });
    const connectionResolverMock = jest.fn();
    require('core/index').connectionResolver = () => connectionResolverMock;

    c.handleSubmit(mockEvent);
    expect(connectionResolverMock).toHaveBeenCalled();
  });

  it('should not submit the form when the form is already submitting', () => {
    const c = getContainer({ isSubmitting: true });
    const connectionResolverMock = jest.fn();
    require('core/index').connectionResolver = () => connectionResolverMock;

    c.handleSubmit(mockEvent);
    expect(connectionResolverMock).not.toHaveBeenCalled();
  });

  describe('with a custom `connectionResolver`', () => {
    let connectionResolverMock;
    let setResolvedConnectionMock;
    let databaseUsernameValueMock;

    beforeEach(() => {
      connectionResolverMock = jest.fn();
      setResolvedConnectionMock = jest.fn();
      databaseUsernameValueMock = require('connection/database/index').databaseUsernameValue;

      // Set default return value for databaseUsernameValue mock
      databaseUsernameValueMock.mockReturnValue('peter_picked@pickledpepper.com');

      require('core/index').connectionResolver = () => connectionResolverMock;
      require('core/index').setResolvedConnection = setResolvedConnectionMock;
    });

    afterEach(() => {
      // Reset mock between tests and restore default return value
      databaseUsernameValueMock.mockReset().mockReturnValue('peter_picked@pickledpepper.com');
    });

    it('calls `connectionResolver` onSubmit', () => {
      const c = getContainer();
      c.handleSubmit(mockEvent);

      const { mock } = connectionResolverMock;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
    it('calls `swap` in the `connectionResolver` callback', () => {
      const c = getContainer();
      c.handleSubmit(mockEvent);

      connectionResolverMock.mock.calls[0][2]('resolvedConnection');
      const { mock } = require('store/index').swap;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
    it('calls `setResolvedConnection` in the `swap` callback', () => {
      const c = getContainer();
      c.handleSubmit(mockEvent);

      connectionResolverMock.mock.calls[0][2]('resolvedConnection');
      require('store/index').swap.mock.calls[0][3]('model');
      const { mock } = setResolvedConnectionMock;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });

    it('prioritizes email over username on signUp screen', () => {
      databaseUsernameValueMock.mockReturnValue('test@example.com');

      const c = getContainer({ screenName: 'main.signUp' });
      c.handleSubmit(mockEvent);

      // Should call databaseUsernameValue with emailFirst: true
      expect(databaseUsernameValueMock).toHaveBeenCalledWith(
        expect.anything(),
        { emailFirst: true }
      );

      // connectionResolver should receive the email value
      const { mock } = connectionResolverMock;
      expect(mock.calls[0][0]).toBe('test@example.com');
    });

    it('prioritizes username over email on login screen', () => {
      databaseUsernameValueMock.mockReturnValue('testuser');

      const c = getContainer({ screenName: 'main.login' });
      c.handleSubmit(mockEvent);

      // Should call databaseUsernameValue with empty options (default behavior)
      expect(databaseUsernameValueMock).toHaveBeenCalledWith(
        expect.anything(),
        {}
      );

      // connectionResolver should receive the username value
      const { mock } = connectionResolverMock;
      expect(mock.calls[0][0]).toBe('testuser');
    });

    it('uses default behavior when screenName is not main.signUp', () => {
      databaseUsernameValueMock.mockReturnValue('defaultvalue');

      const c = getContainer({ screenName: 'forgotPassword' });
      c.handleSubmit(mockEvent);

      // Should call databaseUsernameValue with empty options (default behavior)
      expect(databaseUsernameValueMock).toHaveBeenCalledWith(
        expect.anything(),
        {}
      );
    });

  });

  describe('when suppressSubmitOverlay is true', () => {
    it('it does not display the overlay when submitting', () => {
      const Container = require('ui/box/container').default;

      const props = {
        autoFocus: false,
        badgeLink: 'http://badge.link',
        contentComponent: null,
        contentProps: {},
        disableSubmitButton: false,
        isMobile: false,
        isModal: false,
        isSubmitting: true,
        logo: '',
        primaryColor: '',
        screenName: 'Test',
        showBadge: false,
        classNames: '',
        suppressSubmitOverlay: true
      };

      // Emitted snapshot should not add 'auth0-lock-mode-loading' class to the container div
      expectComponent(<Container {...props} />).toMatchSnapshot();
    });
  });
});
