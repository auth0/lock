import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/input/password_input', () => mockComponent('password_input'));

const getComponent = () => require('field/password/password_pane').default;

describe('PasswordPane', () => {
  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(','),
      html: (...keys) => keys.join(',')
    },
    lock: {},
    placeholder: 'placeholder',
    policy: 'policy',
    strengthMessages: {}
  };

  beforeEach(() => {
    jest.resetModules();

    jest.mock('field/index', () => ({
      getFieldValue: (m, field) => field,
      isFieldVisiblyInvalid: () => true
    }));

    jest.mock('field/password', () => ({
      setPassword: 'setPassword'
    }));

    jest.mock('core/index', () => ({
      id: () => 1,
      submitting: () => false,
      ui: {
        allowShowPassword: () => false
      }
    }));

    jest.mock('store/index', () => ({
      swap: jest.fn(),
      updateEntity: 'updateEntity'
    }));
  });

  it('renders correctly', () => {
    const PasswordPane = getComponent();
    expectComponent(<PasswordPane {...defaultProps} />).toMatchSnapshot();
  });
  it('renders correctly when `allowShowPassword` is true', () => {
    require('core/index').ui.allowShowPassword = () => true;
    const PasswordPane = getComponent();
    expectComponent(<PasswordPane {...defaultProps} />).toMatchSnapshot();
  });
  it('disables input when submitting', () => {
    require('core/index').submitting = () => true;
    const PasswordPane = getComponent();

    expectComponent(<PasswordPane {...defaultProps} />).toMatchSnapshot();
  });
  it('sets isValid as true when `isFieldVisiblyInvalid` is false', () => {
    require('field/index').isFieldVisiblyInvalid = () => false;
    let PasswordPane = getComponent();

    expectComponent(<PasswordPane {...defaultProps} />).toMatchSnapshot();
  });
  it('calls `swap` when password changes', () => {
    let PasswordPane = getComponent();

    const wrapper = mount(<PasswordPane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper, 1);
    props.onChange({ target: { value: 'newPassword' } });

    const { mock } = require('store/index').swap;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('calls `swap` when checkbox is clicked', () => {
    require('core/index').ui.allowShowPassword = () => true;
    let PasswordPane = getComponent();

    const wrapper = mount(<PasswordPane {...defaultProps} />);
    const props = wrapper.find('div input').props();
    props.onChange({ target: { checked: true } });

    const { mock } = require('store/index').swap;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
