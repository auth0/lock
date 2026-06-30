import React from 'react';
import { expectComponent } from 'testUtils';
import I from 'immutable';
import HRDPane from '../../../connection/enterprise/hrd_pane';

const lock = I.fromJS({ id: '__lock-id__' });

jest.mock('core/index');

describe('HRDPane', () => {
  const defaultProps = {
    model: lock,
    header: <header></header>,
    i18n: { str: (...keys) => keys.join(','), html: (...keys) => keys.join(',') },
    passwordInputPlaceholder: 'password',
    usernameInputPlaceholder: 'username'
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    expectComponent(<HRDPane {...defaultProps} />).toMatchSnapshot();
  });

  it('renders the captcha if required', () => {
    require('core/index').captcha.mockReturnValue({
      get() {
        return true;
      }
    });

    expectComponent(<HRDPane {...defaultProps} />).toMatchSnapshot();
  });
});
