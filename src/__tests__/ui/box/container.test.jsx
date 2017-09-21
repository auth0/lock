import React from 'react';
import { mount } from 'enzyme';
import immutable from 'immutable';
import { expectComponent, mockComponent } from '../../testUtils';
import sync from '../../../sync';
import { connections } from '../../../core/index';
import { email } from '../../../field/index';
import { img } from '../../../utils/preload_utils';

jest.mock('store/index', () => ({
  swap: jest.fn(),
  updateEntity: 'updateEntity'
}));

jest.mock('ui/box/chrome', () => mockComponent('chrome'));

const mockEvent = {
  preventDefault: () => {}
};

const getContainer = () => {
  const Container = require('ui/box/container').default;
  return new Container({
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
  });
};

describe('Container', () => {
  it('does not call `connectionResolver` on submit when there is no custom `connectionResolver`', () => {
    const c = getContainer();

    c.handleSubmit(mockEvent);
    const { mock } = require('store/index').swap;
    expect(mock.calls.length).toBe(0);
  });

  describe('with a custom `connectionResolver`', () => {
    let connectionResolverMock;
    let setResolvedConnectionMock;

    beforeEach(() => {
      connectionResolverMock = jest.fn();
      setResolvedConnectionMock = jest.fn();
      require('core/index').connectionResolver = () => connectionResolverMock;
      require('core/index').setResolvedConnection = setResolvedConnectionMock;
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
  });
});
