import React from 'react';
import { mount } from 'enzyme';

import { expectComponent } from '../../testUtils';

import GlobalMessage from 'ui/box/global_message';

describe('GlobalMessage', () => {
  it('renders correctly given a success type', () => {
    expectComponent(<GlobalMessage type="success" message="Success!" />).toMatchSnapshot();
  });
  it('renders correctly given an error type', () => {
    expectComponent(<GlobalMessage type="error" message="An error occurred." />).toMatchSnapshot();
  });
  it('should NOT strip out HTML tags if given a React node', () => {
    const message = React.createElement('span', {
      dangerouslySetInnerHTML: { __html: '<b>Success!</b>' }
    });
    const wrapper = mount(<GlobalMessage type="success" message={message} />);
    expect(wrapper.html()).toBe(
      '<div class="auth0-global-message auth0-global-message-success"><span class="animated fadeInUp">' +
        '<span><b>Success!</b></span></span></div>'
    );
  });
  it('should strip out HTML tags if given a string', () => {
    const wrapper = mount(<GlobalMessage type="success" message="<b>Success!</b>" />);
    expect(wrapper.html()).toBe(
      '<div class="auth0-global-message auth0-global-message-success"><span class="animated fadeInUp">' +
        '&lt;b&gt;Success!&lt;/b&gt;</span></div>'
    );
  });
});
