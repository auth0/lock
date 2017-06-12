import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/input/vcode_input', () => mockComponent('vcode_input'));

const getComponent = () => require('field/vcode/vcode_pane').default;

describe('VcodePane', () => {
  const defaultProps = {
    lock: {},
    placeholder: 'placeholder',
    resendLabel: 'resendLabel',
    onRestart: jest.fn()
  };
  beforeEach(() => {
    jest.resetModules();

    jest.mock('field/index', () => ({
      vcode: () => 'vcode',
      isFieldVisiblyInvalid: () => true
    }));

    jest.mock('field/phone_number', () => ({
      setVcode: 'setVcode'
    }));

    jest.mock('core/index', () => ({
      id: () => 1,
      submitting: () => false,
      globalError: () => true
    }));

    jest.mock('utils/media_utils', () => ({
      isSmallScreen: () => true
    }));

    jest.mock('store/index', () => ({
      swap: jest.fn(),
      updateEntity: 'updateEntity'
    }));
  });

  it('renders correctly', () => {
    const VcodePane = getComponent();

    expectComponent(<VcodePane {...defaultProps} />).toMatchSnapshot();
  });
  it('shows header when instructions are available', () => {
    const VcodePane = getComponent();

    expectComponent(
      <VcodePane {...defaultProps} instructions={<span>instructions</span>} />
    ).toMatchSnapshot();
  });
  it('disable input when submitting', () => {
    require('core/index').submitting = () => true;
    const VcodePane = getComponent();

    expectComponent(<VcodePane {...defaultProps} />).toMatchSnapshot();
  });
  it('sets isValid as true when `isFieldVisiblyInvalid` is false and globalError() is false', () => {
    require('field/index').isFieldVisiblyInvalid = () => false;
    require('core/index').globalError = () => false;
    let VcodePane = getComponent();

    expectComponent(<VcodePane {...defaultProps} />).toMatchSnapshot();
  });
  it('sets autoFocus as true when `isSmallScreen` is false', () => {
    require('utils/media_utils').isSmallScreen = () => false;
    let VcodePane = getComponent();

    expectComponent(<VcodePane {...defaultProps} />).toMatchSnapshot();
  });
  it('calls `onRestart` when alternative link is clicked', () => {
    let VcodePane = getComponent();

    const wrapper = mount(<VcodePane {...defaultProps} />);
    wrapper.find('.auth0-lock-alternative-link').simulate('click');

    const { mock } = defaultProps.onRestart;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('calls `swap` when VcodeInput changes', () => {
    let VcodePane = getComponent();

    const wrapper = mount(<VcodePane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper, 1);

    props.onChange({ preventDefault: jest.fn(), target: { value: 'newCode' } });

    const { mock } = require('store/index').swap;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
