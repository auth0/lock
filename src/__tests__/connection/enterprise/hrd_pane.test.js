import React from 'react';
import { expectShallowComponent } from 'testUtils';
import I from 'immutable';
import * as i18n from '../../../i18n';
import HRDPane from '../../../connection/enterprise/hrd_pane';

const lock = I.fromJS({ id: '__lock-id__' });

jest.mock('core/index');

describe('HRDPane', () => {
  const defaultProps = {
    model: lock,
    header: <header></header>,
    i18n,
    passwordInputPlaceholder: 'password',
    usernameInputPlaceholder: 'username'
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    expectShallowComponent(<HRDPane {...defaultProps} />).toMatchSnapshot();
  });

  it('renders the captcha if required', () => {
    require('core/index').captcha.mockReturnValue({
      get() {
        return true;
      }
    });

    expectShallowComponent(<HRDPane {...defaultProps} />).toMatchSnapshot();
  });
});
