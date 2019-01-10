import React from 'react';
import I from 'immutable';

import { expectComponent } from 'testUtils';

import SignedUpConfirmation from '../../../connection/database/signed_up_confirmation';

const lock = I.fromJS({ id: '__lock-id__' });

describe('SignedUpConfirmation', () => {
  it('renders correctly', async () => {
    expectComponent(<SignedUpConfirmation lock={lock} />).toMatchSnapshot();
  });
});
