import React from 'react';
import { expectComponent } from 'testUtils';
import { mount } from 'enzyme';

const getComponent = () => require('ui/box/header').default;

describe('Header', () => {
  let Header;

  beforeEach(() => {
    Header = getComponent();
  });

  it('sets --header-height', () => {
    const props = {
      title: 'This is the header',
      name: 'Header',
      logoUrl: 'some-logo.png',
      backgroundUrl: 'some-image.png',
      backgroundColor: 'red'
    };

    jest.spyOn(document.documentElement.style, 'setProperty');
    jest.spyOn(Header.prototype, 'getRef').mockImplementation(function() {
      this.elm = {
        clientHeight: 99
      };
    });
    mount(<Header {...props} />);
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      '--header-height',
      '99px'
    );
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
