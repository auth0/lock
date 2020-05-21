import React from 'react';
import immutable from 'immutable';
import { create } from 'react-test-renderer';

import { expectComponent, mockComponent } from 'testUtils';
const getComponent = () => require('ui/box/chrome').default;

jest.mock('ui/box/header', () => mockComponent('header'));
jest.mock('ui/box/multisize_slide', () => mockComponent('div'));
jest.mock('ui/box/global_message', () => mockComponent('div'));

let mockEventRegister = {};

const triggerEvent = name => {
  if (name in mockEventRegister) {
    return mockEventRegister[name]();
  }

  throw new Error(`Unknown event '${name}'`);
};

jest.mock('core/index', () => ({
  handleEvent: jest.fn((_, event, fn) => {
    mockEventRegister[event] = fn;
  })
}));

const defaultProps = {
  contentComponent: mockComponent('content'),
  contentProps: {
    model: immutable.fromJS({
      id: '__lock_id__'
    })
  },
  avatar: 'avatar',
  isSubmitting: false,
  logo: 'logo',
  primaryColor: 'white',
  screenName: 'screen name',
  classNames: '',
  color: 'black'
};

describe('Chrome', () => {
  let Chrome;

  beforeEach(() => {
    Chrome = getComponent();
    Chrome.prototype.getHeaderSize = jest.fn(() => 200);

    mockEventRegister = {};
  });

  it('renders correctly with basic props', () => {
    expectComponent(<Chrome {...defaultProps} />).toMatchSnapshot();
  });

  it('correctly sets the header size when the "signin ready" event is triggered', () => {
    const component = create(<Chrome {...defaultProps} />);
    const instance = component.getInstance();

    expect(instance.state.headerHeight).toBe(0);
    expect(component).toMatchSnapshot();

    triggerEvent('signin ready');

    expect(instance.state.headerHeight).toBe(200);
    expect(component).toMatchSnapshot();
  });

  it('correctly sets the header size when the "signup ready" event is triggered', () => {
    const component = create(<Chrome {...defaultProps} />);
    const instance = component.getInstance();

    expect(instance.state.headerHeight).toBe(0);
    expect(component).toMatchSnapshot();

    triggerEvent('signup ready');

    expect(instance.state.headerHeight).toBe(200);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when there is a global message', () => {
    const props = {
      ...defaultProps,
      error: 'There is an error'
    };

    expectComponent(<Chrome {...props} />).toMatchSnapshot();
  });

  it('renders correctly when there is a global success message', () => {
    const props = {
      ...defaultProps,
      success: 'This is a success message'
    };

    expectComponent(<Chrome {...props} />).toMatchSnapshot();
  });

  it('renders correctly when there is a global information message', () => {
    const props = {
      ...defaultProps,
      info: 'This is an information message'
    };

    expectComponent(<Chrome {...props} />).toMatchSnapshot();
  });

  it('can dislay all global messages together', () => {
    const props = {
      ...defaultProps,
      info: 'This is an information message',
      success: 'This is a success message',
      error: 'There is an error'
    };

    expectComponent(<Chrome {...props} />).toMatchSnapshot();
  });
});
