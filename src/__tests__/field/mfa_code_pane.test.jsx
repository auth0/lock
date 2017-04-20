import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/input/mfa_code_input', () => mockComponent('mfa_code_input'));

const getComponent = () => require('field/mfa-code/mfa_code_pane').default;

describe('MFACodePane', () => {
  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(',')
    },
    lock: {},
    placeholder: 'placeholder'
  };

  beforeEach(() => {
    jest.resetModules();

    jest.mock('field/index', () => ({
      getFieldValue: () => 'mfa',
      isFieldVisiblyInvalid: () => true
    }));

    jest.mock('field/password', () => ({
      getMFACodeValidation: () => 'getMFACodeValidation',
      setMFACode: 'setMFACode'
    }));

    jest.mock('core/index', () => ({
      id: () => 1,
      submitting: () => false,
      ui: {
        avatar: () => false
      }
    }));

    jest.mock('store/index', () => ({
      swap: jest.fn(),
      updateEntity: 'updateEntity'
    }));
  });

  it('renders correctly', () => {
    const MFACodePane = getComponent();
    expectComponent(<MFACodePane {...defaultProps} />).toMatchSnapshot();
  });
  it('sets isValid as true when `isFieldVisiblyInvalid` is false', () => {
    require('field/index').isFieldVisiblyInvalid = () => false;
    let MFACodePane = getComponent();

    expectComponent(<MFACodePane {...defaultProps} />).toMatchSnapshot();
  });
  it('calls `swap` onChange', () => {
    let MFACodePane = getComponent();

    const wrapper = mount(<MFACodePane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper);
    props.onChange({ target: { value: 'newUser' } });

    const { mock } = require('store/index').swap;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
