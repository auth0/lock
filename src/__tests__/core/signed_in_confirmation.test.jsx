import React from 'react';
import I from 'immutable';

import { expectComponent } from 'testUtils';

import SignedInConfirmation from '../../core/signed_in_confirmation';

const lock = I.fromJS({ id: '__lock-id__' });

describe('SignedInConfirmation', () => {
  it('renders correctly', async () => {
    expectComponent(<SignedInConfirmation lock={lock} />).toMatchSnapshot();
  });
});
