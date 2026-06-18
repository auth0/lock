import React from 'react';
import { render } from '@testing-library/react';

import { extractPropsFromWrapper, getMockProps, mockComponent } from 'testUtils';

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
  it('renders correctly and passes props to List', () => {
    const OptionSelectionPane = getComponent();
    const { container } = render(<OptionSelectionPane {...defaultProps} />);
    const props = getMockProps(container.querySelector('[data-__type="list"]'));
    expect(props.icon).toBe('icon');
    expect(props.iconUrl).toBe('iconUrl');
    expect(props.items).toBe('items');
    expect(typeof props.onSelect).toBe('function');
    expect(typeof props.onCancel).toBe('function');
  });
  it('calls `selectOption` when selected', () => {
    let OptionSelectionPane = getComponent();

    const { container } = render(<OptionSelectionPane {...defaultProps} />);
    const props = extractPropsFromWrapper(container, 'list');

    props.onSelect('selected');

    const { mock } = require('field/actions').selectOption;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('calls `cancelOptionSelection` when cancelled', () => {
    let OptionSelectionPane = getComponent();

    const { container } = render(<OptionSelectionPane {...defaultProps} />);
    const props = extractPropsFromWrapper(container, 'list');

    props.onCancel();

    const { mock } = require('field/actions').cancelOptionSelection;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
