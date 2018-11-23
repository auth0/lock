import React from 'react';
import I from 'immutable';

import { expectComponent } from 'testUtils';

import PasswordResetConfirmation from '../../../connection/database/password_reset_confirmation';

const lock = I.fromJS({ id: '__lock-id__' });

describe('PasswordResetConfirmation', () => {
  it('renders correctly', async () => {
    expectComponent(<PasswordResetConfirmation lock={lock} />).toMatchSnapshot();
  });
});
