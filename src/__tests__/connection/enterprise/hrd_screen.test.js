import React from 'react';
import { render } from '@testing-library/react';
import { mockComponent, getMockProps } from 'testUtils';
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

const renderAndGetProps = (Component, props) => {
  const { container } = render(<Component {...props} />);
  return getMockProps(container.querySelector('[data-__type="hrd_pane"]'));
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

  it('passes domain-specific header when enterprise domain is present', () => {
    const Component = getComponent();
    const props = renderAndGetProps(Component, { model: lock, i18n: i18nProp });
    expect(props.header).not.toBeNull();
    expect(props.header.props.children).toContain('domain.com');
  });

  it('passes fallback header when there is no enterprise domain', () => {
    require('connection/enterprise').enterpriseDomain.mockImplementation(() => null);
    const Component = getComponent();
    const props = renderAndGetProps(Component, { model: lock, i18n: i18nProp });
    expect(props.header.props.children).toContain('Login with your corporate credentials.');
  });

  it('passes fallback header when enterprise domain is undefined', () => {
    require('connection/enterprise').enterpriseDomain.mockImplementation(() => undefined);
    const Component = getComponent();
    const props = renderAndGetProps(Component, { model: lock, i18n: i18nProp });
    expect(props.header.props.children).toContain('Login with your corporate credentials.');
  });

  it('does not show "undefined" in message when enterprise domain is undefined', () => {
    require('connection/enterprise').enterpriseDomain.mockImplementation(() => undefined);
    const { str } = i18nProp;
    const expectedMessage = str('enterpriseLoginIntructions');
    expect(expectedMessage).toContain('Login with your corporate credentials.');
    expect(expectedMessage).not.toContain('undefined');
  });

  it('does not show "undefined" in message when enterprise domain is null', () => {
    require('connection/enterprise').enterpriseDomain.mockImplementation(() => null);
    const { str } = i18nProp;
    const expectedMessage = str('enterpriseLoginIntructions');
    expect(expectedMessage).toContain('Login with your corporate credentials.');
    expect(expectedMessage).not.toContain('undefined');
  });

  it('passes fallback header when enterprise domain is empty string', () => {
    require('connection/enterprise').enterpriseDomain.mockImplementation(() => '');
    const Component = getComponent();
    const props = renderAndGetProps(Component, { model: lock, i18n: i18nProp });
    expect(props.header.props.children).toContain('Login with your corporate credentials.');
  });

  it('passes fallback header when enterprise domain is whitespace only', () => {
    require('connection/enterprise').enterpriseDomain.mockImplementation(() => '   ');
    const Component = getComponent();
    const props = renderAndGetProps(Component, { model: lock, i18n: i18nProp });
    expect(props.header.props.children).toContain('Login with your corporate credentials.');
  });
});
