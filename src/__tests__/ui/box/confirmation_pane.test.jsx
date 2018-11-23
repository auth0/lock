import React from 'react';
import I from 'immutable';

import { expectComponent } from 'testUtils';

import ConfirmationPane from '../../../ui/box/confirmation_pane';

const defaultProps = {
  lock: I.fromJS({ id: '__lock-id__' }),
  backHandler: () => {},
  closeHandler: () => {},
  children: <span>test</span>,
  svg: <svg>svg</svg>
};

describe('ConfirmationPane', () => {
  it('renders correctly', async () => {
    expectComponent(<ConfirmationPane {...defaultProps} />).toMatchSnapshot();
  });
});
