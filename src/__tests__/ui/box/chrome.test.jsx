import React from 'react';
import { mount } from 'enzyme';
import immutable from 'immutable';
import { expectComponent } from '../../testUtils';
import { setResolvedConnection } from '../../../core/index';

jest.mock('store/index', () => ({
  swap: jest.fn(),
  updateEntity: 'updateEntity'
}));

const getComponent = () => require('ui/box/chrome').default;

describe('Chrome', () => {
  const defaultProps = {
    autofocus: true,
    contentComponent: () => {
      return <div>content component</div>;
    },
    contentProps: {
      i18n: {},
      model: immutable.fromJS({
        core: {
          connectionResolver: () => {}
        },
        sync: {
          client: {}
        },
        client: {
          connections: {
            database: [{ name: 'dbA' }, { name: 'dbB' }]
          },
          id: 'skjd2fhk27s2dyialk53js9dlf'
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
    },
    disableSubmitButton: false,
    isSubmitting: false,
    logo: 'https://cdn.auth0.com/styleguide/components/1.0.8/media/logos/img/badge.png',
    primaryColor: '"#ea5323',
    screenName: 'loading',
    showSubmitButton: true,
    submitButtonLabel: 'Submit',
    transitionName: 'fade'
  };

  it('renders correctly', () => {
    let Chrome = getComponent();
    expectComponent(<Chrome {...defaultProps} />).toMatchSnapshot();
  });

  it('does not call `connectionResolver` on submit when there is no custom `connectionResolver`', () => {
    let Chrome = getComponent();
    const wrapper = mount(<Chrome {...defaultProps} />);
    const submitButton = wrapper.ref('submit').find('button');
    submitButton.simulate('click');
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
      let Chrome = getComponent();

      const wrapper = mount(<Chrome {...defaultProps} />);
      const submitButton = wrapper.ref('submit').find('button');
      submitButton.simulate('click');

      const { mock } = connectionResolverMock;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
    it('calls `swap` in the `connectionResolver` callback', () => {
      let Chrome = getComponent();

      const wrapper = mount(<Chrome {...defaultProps} />);
      const submitButton = wrapper.ref('submit').find('button');
      submitButton.simulate('click');

      connectionResolverMock.mock.calls[0][2]('resolvedConnection');
      const { mock } = require('store/index').swap;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
    it('calls `setResolvedConnection` in the `swap` callback', () => {
      let Chrome = getComponent();

      const wrapper = mount(<Chrome {...defaultProps} />);
      const submitButton = wrapper.ref('submit').find('button');
      submitButton.simulate('click');

      connectionResolverMock.mock.calls[0][2]('resolvedConnection');
      require('store/index').swap.mock.calls[0][3]('model');
      const { mock } = setResolvedConnectionMock;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
  });
});
