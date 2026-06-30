import React from 'react';
import { render } from '@testing-library/react';

import { expectComponent } from '../../testUtils';

import GlobalMessage from 'ui/box/global_message';

// Helper: render and get the instance via a callback ref (class component)
const renderWithInstance = (element) => {
  let instance = null;
  const elementWithRef = React.cloneElement(element, {
    ref: r => { instance = r; }
  });
  const result = render(elementWithRef);
  return { ...result, instance };
};

describe('GlobalMessage', () => {
  it('renders correctly given a success type', () => {
    expectComponent(<GlobalMessage type="success" message="Success!" />).toMatchSnapshot();
  });
  it('renders correctly given an error type', () => {
    expectComponent(<GlobalMessage type="error" message="An error occurred." />).toMatchSnapshot();
  });
  it('renders correctly given an info type', () => {
    expectComponent(
      <GlobalMessage type="info" message="Some additional information." />
    ).toMatchSnapshot();
  });
  it('should call scrollIntoView if parameter is set and top < 0', () => {
    const { container, instance } = renderWithInstance(
      <GlobalMessage type="success" message="foo" scrollIntoView={true} />
    );
    const el = container.firstChild;
    const getBoundingClientRectSpy = jest.fn().mockReturnValue({ top: -1 });
    const scrollIntoViewSpy = jest.fn();
    el.getBoundingClientRect = getBoundingClientRectSpy;
    el.scrollIntoView = scrollIntoViewSpy;

    instance.componentDidMount();

    expect(getBoundingClientRectSpy).toHaveBeenCalled();
    expect(scrollIntoViewSpy).toHaveBeenCalledWith(true);
  });
  it('should not call scrollIntoView if parameter is set and top >= 0', () => {
    const { container, instance } = renderWithInstance(
      <GlobalMessage type="success" message="foo" scrollIntoView={true} />
    );
    const el = container.firstChild;
    const getBoundingClientRectSpy = jest.fn().mockReturnValue({ top: 0 });
    const scrollIntoViewSpy = jest.fn();
    el.getBoundingClientRect = getBoundingClientRectSpy;
    el.scrollIntoView = scrollIntoViewSpy;

    instance.componentDidMount();

    expect(getBoundingClientRectSpy).toHaveBeenCalled();
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });
  it('should call scrollIntoView if parameter is not set (default is true)', () => {
    const { container, instance } = renderWithInstance(
      <GlobalMessage type="success" message="foo" />
    );
    const el = container.firstChild;
    const getBoundingClientRectSpy = jest.fn().mockReturnValue({ top: -1 });
    const scrollIntoViewSpy = jest.fn();
    el.getBoundingClientRect = getBoundingClientRectSpy;
    el.scrollIntoView = scrollIntoViewSpy;

    instance.componentDidMount();

    expect(getBoundingClientRectSpy).toHaveBeenCalled();
    expect(scrollIntoViewSpy).toHaveBeenCalledWith(true);
  });
  it('should not call scrollIntoView if parameter is set to false', () => {
    const { container, instance } = renderWithInstance(
      <GlobalMessage type="success" message="foo" scrollIntoView={false} />
    );
    const el = container.firstChild;
    const getBoundingClientRectSpy = jest.fn().mockReturnValue({ top: -1 });
    const scrollIntoViewSpy = jest.fn();
    el.getBoundingClientRect = getBoundingClientRectSpy;
    el.scrollIntoView = scrollIntoViewSpy;

    instance.componentDidMount();

    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });
  it('should NOT strip out HTML tags if given a React node', () => {
    const message = React.createElement('span', {
      dangerouslySetInnerHTML: { __html: '<b>Success!</b>' }
    });
    const { container } = render(<GlobalMessage type="success" message={message} />);
    expect(container.innerHTML).toBe(
      '<div class="auth0-global-message auth0-global-message-success"><span class="animated fadeInUp">' +
        '<span><b>Success!</b></span></span></div>'
    );
  });
  it('should strip out HTML tags if given a string', () => {
    const { container } = render(<GlobalMessage type="success" message="<b>Success!</b>" />);

    expect(container.innerHTML).toBe(
      '<div class="auth0-global-message auth0-global-message-success"><span class="animated fadeInUp">' +
        '&lt;b&gt;Success!&lt;/b&gt;</span></div>'
    );
  });
});
