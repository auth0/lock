import React from 'react';
import { mockComponent } from 'testUtils';
import I from 'immutable';
import { setField } from '../../../field';
import * as i18n from '../../../i18n';
import { expectComponent } from '../../testUtils';
import { dataFns } from '../../../utils/data_utils';
import { setPhoneNumber, initLocation } from '../../../field/phone_number';

const { set } = dataFns(['i18n']);

jest.mock('engine/classic');
jest.mock('field/vcode/vcode_pane', () => mockComponent('vcode_pane'));
jest.mock('field/phone-number/locations', () => ({
  __esModule: true,
  default: [['United Kingdom', 'UK', '+44']]
}));

jest.mock('connection/passwordless/index', () => ({
  isEmail: jest.fn()
}));

const getComponent = () => {
  const VCodeScreen = require('connection/passwordless/ask_vcode').default;
  const screen = new VCodeScreen();
  return screen.render();
};

describe('AskVCode', () => {
  let lock;
  let i18nProp;

  beforeEach(() => {
    lock = I.fromJS({ id: '__lock-id__' });

    jest.resetModules();

    const lang = I.fromJS({
      passwordlessEmailCodeInstructions: 'An email with the code has been sent to %s.',
      passwordlessSMSCodeInstructions: 'An SMS with the code has been sent to %s.'
    });

    lock = set(lock, 'strings', lang);

    i18nProp = {
      str: (keypath, ...args) => i18n.str(lock, keypath, args)
    };
  });

  it('renders correctly when logging in with email', () => {
    require('connection/passwordless/index').isEmail.mockImplementation(() => true);

    const Component = getComponent();
    const l = setField(lock, 'email', 'test@user.com');

    expectComponent(<Component model={l} i18n={i18nProp} />).toMatchSnapshot();
  });

  it('renders correctly when logging in with a phone number', () => {
    require('connection/passwordless/index').isEmail.mockImplementation(() => false);

    const Component = getComponent();
    let l = setPhoneNumber(lock, '456 789');
    l = initLocation(l, 'UK');

    expectComponent(<Component model={l} i18n={i18nProp} />).toMatchSnapshot();
  });
});
