import React from 'react';
import I from 'immutable';

import { expectComponent, mockComponent } from 'testUtils';
const getComponent = () => require('ui/box/chrome').default;

jest.mock('ui/box/header', () => mockComponent('header'));

jest.mock('ui/box/multisize_slide', () => mockComponent('div'));
jest.mock('ui/box/global_message', () => mockComponent('div'));

const defaultProps = {
  contentComponent: mockComponent('content'),
  avatar: 'avatar',
  contentProps: {},
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
  });

  it('renders correctly with basic props', () => {
    expectComponent(<Chrome {...defaultProps} />).toMatchSnapshot();
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
