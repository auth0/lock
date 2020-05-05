import React from 'react';
import { expectComponent } from 'testUtils';

const getComponent = () => require('ui/box/header').default;

describe('Header', () => {
  let Header;

  beforeEach(() => {
    Header = getComponent();
  });

  it('renders correctly with basic props', () => {
    const props = {
      title: 'This is the header',
      name: 'Header',
      logoUrl: 'some-logo.png',
      backgroundUrl: 'some-image.png',
      backgroundColor: 'red'
    };

    expectComponent(<Header {...props} />).toMatchSnapshot();
  });

  it('shows the back button when there is a handler', () => {
    const props = {
      title: 'This is the header',
      name: 'Header',
      logoUrl: 'some-logo.png',
      backgroundUrl: 'some-image.png',
      backgroundColor: 'red',
      backHandler: () => jest.fn()
    };

    expectComponent(<Header {...props} />).toMatchSnapshot();
  });

  it('shows the logoUrl when there is no name', () => {
    const props = {
      title: 'This is the header',
      backgroundUrl: 'some-image.png',
      logoUrl: 'some-logo.png',
      backgroundColor: 'red'
    };

    expectComponent(<Header {...props} />).toMatchSnapshot();
  });
});
