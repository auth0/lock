import React from 'react';
import Immutable from 'immutable';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/input/email_input', () => mockComponent('email_input'));

const getComponent = () => require('field/email/email_pane').default;

describe('EmailPane', () => {
  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(',')
    },
    lock: Immutable.fromJS({
      client: {
        connections: 'connections',
        id: 'id'
      }
    }),
    placeholder: 'placeholder'
  };

  beforeEach(() => {
    jest.resetModules();

    const mockEmail = 'user@example.com';
    const mockEmailField = Immutable.fromJS({
      value: mockEmail
    });
    jest.mock('field/index', () => ({
      email: () => mockEmail,
      getField: () => mockEmailField,
      getFieldValue: () => mockEmail,
      isFieldVisiblyInvalid: () => true
    }));

    jest.mock('field/email', () => ({
      setEmail: 'setEmail'
    }));

    jest.mock('core/index', () => ({
      id: () => 1,
      ui: {
        avatar: () => false,
        allowAutocomplete: () => false
      },
      connectionResolver: () => undefined
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
    const EmailPane = getComponent();
    expectComponent(<EmailPane {...defaultProps} />).toMatchSnapshot();
  });
  it('sets `blankErrorHint` when username is empty', () => {
    const fieldIndexMock = require('field/index');
    fieldIndexMock.username = () => undefined;
    fieldIndexMock.getFieldValue = () => undefined;
    fieldIndexMock.getField = () =>
      Immutable.fromJS({
        value: undefined
      });
    const EmailPane = getComponent();

    expectComponent(<EmailPane {...defaultProps} />).toMatchSnapshot();
  });
  it('sets isValid as true when `isFieldVisiblyInvalid` is false', () => {
    require('field/index').isFieldVisiblyInvalid = () => false;
    let EmailPane = getComponent();

    expectComponent(<EmailPane {...defaultProps} />).toMatchSnapshot();
  });
  it('sets autoComplete to true when `allowAutocomplete` is true', () => {
    require('core/index').ui.allowAutocomplete = () => true;
    let EmailPane = getComponent();

    expectComponent(<EmailPane {...defaultProps} />).toMatchSnapshot();
  });
  it('fetches the avatar on componentDidMount if ui.avatar is true and there is a username', () => {
    require('core/index').ui.avatar = () => true;
    let EmailPane = getComponent();

    mount(<EmailPane {...defaultProps} />);

    const { mock } = require('avatar').requestAvatar;
    expect(mock.calls.length).toBe(1);
  });
  it('fetches the avatar onChange if ui.avatar is true', () => {
    require('core/index').ui.avatar = () => true;
    let EmailPane = getComponent();

    const wrapper = mount(<EmailPane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper);
    props.onChange({ target: { value: 'newUser@example.com' } });

    const { mock } = require('avatar').debouncedRequestAvatar;
    expect(mock.calls.length).toBe(1);
  });
  it('calls `swap` onChange', () => {
    let EmailPane = getComponent();

    const wrapper = mount(<EmailPane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper);
    props.onChange({ target: { value: 'newUser@example.com' } });

    const { mock } = require('store/index').swap;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('does nothing on blur when there is no custom `connectionResolver`', () => {
    let EmailPane = getComponent();

    const wrapper = mount(<EmailPane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper);
    props.onBlur({ target: { value: 'newUser@example.com' } });

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
    it('calls `connectionResolver` onBlur', () => {
      let EmailPane = getComponent();

      const wrapper = mount(<EmailPane {...defaultProps} />);
      const props = extractPropsFromWrapper(wrapper);
      props.onBlur({ target: { value: 'newUser@example.com' } });

      const { mock } = connectionResolverMock;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
    it('calls `swap` in the `connectionResolver` callback', () => {
      let EmailPane = getComponent();

      const wrapper = mount(<EmailPane {...defaultProps} />);
      const props = extractPropsFromWrapper(wrapper);
      props.onBlur({ target: { value: 'newUser@example.com' } });
      connectionResolverMock.mock.calls[0][2]('resolvedConnection');
      const { mock } = require('store/index').swap;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
    it.only('`swap` calls `setResolvedConnection`', () => {
      let EmailPane = getComponent();

      const wrapper = mount(<EmailPane {...defaultProps} />);
      const props = extractPropsFromWrapper(wrapper);
      props.onBlur({ target: { value: 'newUser@example.com' } });
      connectionResolverMock.mock.calls[0][2]('resolvedConnection');
      require('store/index').swap.mock.calls[0][3]('model');

      const { mock } = setResolvedConnectionMock;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
  });
});
