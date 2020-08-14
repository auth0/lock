import React from 'react';
import { mockComponent, expectComponent } from 'testUtils';
import I from 'immutable';
import { dataFns } from '../../../utils/data_utils';
import * as i18n from '../../../i18n';

const { set } = dataFns(['i18n']);

jest.mock('engine/classic');
jest.mock('connection/enterprise/hrd_pane', () => mockComponent('hrd_pane'));
jest.mock('connection/enterprise', () => ({
  enterpriseDomain: jest.fn(() => 'domain.com')
}));

const getComponent = () => {
  const HRDScreen = require('connection/enterprise/hrd_screen').default;
  const screen = new HRDScreen();
  return screen.render();
};

describe('HRDScreen Component', () => {
  let i18nProp;
  let lock;

  beforeEach(() => {
    lock = I.fromJS({ id: '__lock-id__' });

    jest.resetModules();

    const lang = I.fromJS({
      enterpriseLoginIntructions: 'Login with your corporate credentials.',
      enterpriseActiveLoginInstructions: 'Please enter your corporate credentials at %s.'
    });

    lock = set(lock, 'strings', lang);

    i18nProp = {
      str: (keypath, ...args) => i18n.str(lock, keypath, args)
    };
  });

  it('renders correctly when there is an enterprise domain', () => {
    const Component = getComponent();
    expectComponent(<Component model={lock} i18n={i18nProp} />).toMatchSnapshot();
  });

  it('renders correctly when there is no enterprise domain', () => {
    require('connection/enterprise').enterpriseDomain.mockImplementation(() => null);
    const Component = getComponent();
    expectComponent(<Component model={lock} i18n={i18nProp} />).toMatchSnapshot();
  });
});
