import React from 'react';

import { expectComponent } from 'testUtils';
import InputWrap from '../../../ui/input/input_wrap';

describe('InputWrap', () => {
  const defaultProps = {
    after: <span>after</span>,
    isValid: true,
    name: 'name'
  };

  test('renders correctly with the `after` prop', () => {
    expectComponent(<InputWrap {...defaultProps} />).toMatchSnapshot();
  });
});
