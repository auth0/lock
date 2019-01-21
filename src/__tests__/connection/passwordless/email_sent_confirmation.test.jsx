import React from 'react';
import I from 'immutable';

import { expectComponent } from 'testUtils';

import EmailSentConfirmation from '../../../connection/passwordless/email_sent_confirmation';

const lock = I.fromJS({ id: '__lock-id__' });

describe('EmailSentConfirmation', () => {
  it('renders correctly', async () => {
    expectComponent(<EmailSentConfirmation lock={lock} />).toMatchSnapshot();
  });
});
