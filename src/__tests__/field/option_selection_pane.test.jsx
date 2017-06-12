import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/list', () => mockComponent('list'));

const getComponent = () => require('field/option_selection_pane').default;

describe('OptionSelectionPane', () => {
  const defaultProps = {
    iconUrl: 'iconUrl',
    icon: 'icon',
    items: 'items',
    name: 'option_selection_pane',
    model: {
      get: () => 'id'
    }
  };

  beforeEach(() => {
    jest.resetModules();

    jest.mock('field/actions', () => ({
      cancelOptionSelection: jest.fn(),
      selectOption: jest.fn()
    }));
  });
  it('renders correctly', () => {
    const OptionSelectionPane = getComponent();
    expectComponent(<OptionSelectionPane {...defaultProps} />).toMatchSnapshot();
  });
  it('calls `selectOption` when selected', () => {
    let OptionSelectionPane = getComponent();

    const wrapper = mount(<OptionSelectionPane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper);

    props.onSelect('selected');

    const { mock } = require('field/actions').selectOption;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('calls `cancelOptionSelection` when cancelled', () => {
    let OptionSelectionPane = getComponent();

    const wrapper = mount(<OptionSelectionPane {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper);

    props.onCancel();

    const { mock } = require('field/actions').cancelOptionSelection;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
