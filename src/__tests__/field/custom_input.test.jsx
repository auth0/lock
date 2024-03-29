import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/input/text_input', () => mockComponent('text_input'));
jest.mock('ui/input/select_input', () => mockComponent('select_input'));

const getComponent = () => require('field/custom_input').default;

describe('CustomInput', () => {
  const defaultProps = {
    iconUrl: 'iconUrl',
    placeholder: 'placeholder',
    ariaLabel: 'Custom Input',
    name: 'custom_input',
    model: {},
    validator: 'validator'
  };

  beforeEach(() => {
    jest.resetModules();

    jest.mock('core/index', () => ({
      id: () => 1
    }));

    jest.mock('field/actions', () => ({
      changeField: jest.fn(),
      startOptionSelection: jest.fn()
    }));

    jest.mock('field/index', () => ({
      getFieldInvalidHint: (model, name) => `invalid-hint-${name}`,
      getFieldLabel: jest.fn(),
      getFieldValue: (model, name) => `field-value-${name}`,
      isFieldVisiblyInvalid: () => true
    }));

    jest.mock('store/index', () => ({
      swap: jest.fn(),
      updateEntity: 'updateEntity'
    }));
  });
  describe('when type === select', () => {
    beforeEach(() => (defaultProps.type = 'select'));
    it('renders correctly as a SelectInput', () => {
      const CustomInput = getComponent();

      expectComponent(<CustomInput {...defaultProps} />).toMatchSnapshot();
    });
    it('sets isValid as true when `isFieldVisiblyInvalid` is false', () => {
      require('field/index').isFieldVisiblyInvalid = () => false;
      let CustomInput = getComponent();

      expectComponent(<CustomInput {...defaultProps} />).toMatchSnapshot();
    });
    it('calls `startOptionSelection` when clicked', () => {
      let CustomInput = getComponent();

      const wrapper = mount(<CustomInput {...defaultProps} />);
      const props = extractPropsFromWrapper(wrapper);

      props.onClick();

      const { mock } = require('field/actions').startOptionSelection;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
  });
  describe('when type == input', () => {
    beforeEach(() => (defaultProps.type = 'input'));
    it('renders correctly as a TextInput', () => {
      const CustomInput = getComponent();

      expectComponent(<CustomInput {...defaultProps} />).toMatchSnapshot();
    });
    it('sets isValid as true when `isFieldVisiblyInvalid` is false', () => {
      require('field/index').isFieldVisiblyInvalid = () => false;
      let CustomInput = getComponent();

      expectComponent(<CustomInput {...defaultProps} />).toMatchSnapshot();
    });
    it('calls `changeField` when changed', () => {
      let CustomInput = getComponent();

      const wrapper = mount(<CustomInput {...defaultProps} />);
      const props = extractPropsFromWrapper(wrapper);

      props.onChange({ target: { value: 'newUser' } });

      const { mock } = require('field/actions').changeField;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
  });
  describe('when type == checkbox', () => {
    beforeEach(() => (defaultProps.type = 'checkbox'));
    it('renders correctly as a CheckBoxInput', () => {
      require('field/index').isFieldVisiblyInvalid = () => false;
      const CustomInput = getComponent();

      expectComponent(<CustomInput {...defaultProps} />).toMatchSnapshot();
    });

    describe('and when placeholderHTML is set', () => {
      it('renders correctly as a CheckBoxInput', () => {
        require('field/index').isFieldVisiblyInvalid = () => false;

        const CustomInput = getComponent();

        expectComponent(
          <CustomInput {...defaultProps} placeholderHTML={'<b>Placeholder</b>'} />
        ).toMatchSnapshot();
      });
    });

    it('shows an error when value is incorrect', () => {
      const CustomInput = getComponent();

      expectComponent(
        <CustomInput {...defaultProps} placeholderHTML={'<b>Placeholder</b>'} />
      ).toMatchSnapshot();
    });

    it('highlights placeholder text when no invalid hint is provided', () => {
      require('field/index').getFieldInvalidHint = () => undefined;

      const CustomInput = getComponent();

      expectComponent(
        <CustomInput {...defaultProps} placeholderHTML={'<b>Placeholder</b>'} />
      ).toMatchSnapshot();
    });
  });
  describe('when type == hidden', () => {
    beforeEach(() => {
      defaultProps.type = 'hidden';
      defaultProps.value = 'hidden_value';
    });
    it('renders correctly as a input[type=hidden]', () => {
      const CustomInput = getComponent();

      expectComponent(<CustomInput {...defaultProps} />).toMatchSnapshot();
    });
  });
});
