import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/input/phone_number_input', () => mockComponent('phone_number_input'));
jest.mock('ui/input/select_input', () => mockComponent('select_input'));

const getComponent = () => require('field/phone-number/phone_number_pane').default;

describe('PhoneNumberPane', () => {
  const defaultProps = {
    lock: {},
    placeholder: 'placeholder'
  };
  beforeEach(() => {
    jest.resetModules();

    jest.mock('field/index', () => ({
      phoneNumber: () => 'phoneNumber',
      isFieldVisiblyInvalid: () => true
    }));

    jest.mock('field/phone_number', () => ({
      humanLocation: () => 'humanLocation',
      setPhoneNumber: 'setPhoneNumber'
    }));

    jest.mock('core/index', () => ({
      id: () => 1,
      submitting: () => false
    }));

    jest.mock('field/actions', () => ({
      startOptionSelection: jest.fn()
    }));

    jest.mock('store/index', () => ({
      swap: jest.fn(),
      updateEntity: 'updateEntity'
    }));
  });

  it('renders correctly', () => {
    const PhoneNumberPane = getComponent();
    expectComponent(<PhoneNumberPane {...defaultProps} />).toMatchSnapshot();
  });
  it('shows header when instructions are available', () => {
    const PhoneNumberPane = getComponent();
    expectComponent(
      <PhoneNumberPane {...defaultProps} instructions={<span>instructions</span>} />
    ).toMatchSnapshot();
  });
  it('disables input when submitting', () => {
    require('core/index').submitting = () => true;
    const PhoneNumberPane = getComponent();

    expectComponent(<PhoneNumberPane {...defaultProps} />).toMatchSnapshot();
  });
  it('sets isValid as true when `isFieldVisiblyInvalid` is false', () => {
    require('field/index').isFieldVisiblyInvalid = () => false;
    let PhoneNumberPane = getComponent();

    expectComponent(<PhoneNumberPane {...defaultProps} />).toMatchSnapshot();
  });
  it('calls `startOptionSelection` when SelectInput is clicked', () => {
    let PhoneNumberPane = getComponent();

    const wrapper = mount(<PhoneNumberPane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper, 1);

    props.onClick();

    const { mock } = require('field/actions').startOptionSelection;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('calls `swap` when PhoneNumberInput changes', () => {
    let PhoneNumberPane = getComponent();

    const wrapper = mount(<PhoneNumberPane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper, 2);

    props.onChange({ target: { value: 'newPhoneNumber' } });

    const { mock } = require('store/index').swap;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
