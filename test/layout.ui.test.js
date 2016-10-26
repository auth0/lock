import React from 'react';
import {shallow} from 'enzyme';

import * as l from '../src/core/index';
import { initClient } from '../src/core/client/index';

import client_settings from './fixtures/client_settings';
import {mockModule, es6Exports} from './helpers/mock';

jest.mock('../src/ui/box', () => {
  let container;
  return es6Exports({
    render: (containerId, props) => {
      container = shallow(
        <Container {...props} />
      );
    },
    remove: (...args) => {},
    getContainer: () => container
  })
});

jest.mock('../src/core/client/settings', () => {
  return es6Exports({
    fetchClientSettings: (clientID, clientBaseUrl, cb) => cb(client_settings),
    syncClientSettingsSuccess: function (m, result) {
      m = initClient(m, result);
      m = l.filterConnections(m);
      m = l.runHook(m, "didReceiveClientSettings");
      return m;
    }
  })
});

import Auth0Lock from '../src/index';
import Container from '../src/ui/box/container';
import * as Box from '../src/ui/box';

describe("layout", function() {

  it("with all connection types", function() {

    const opts = {
      rememberLastLogin: false
    };
    const lock = new Auth0Lock("cid", "domain", opts);

    var onShow = new Promise((resolve, reject) => {
      lock.on('show', () => resolve())
      lock.on('unrecoverable_error', () => reject())
    });

    lock.show();

    return onShow.then(() => {
      const container = Box.getContainer();
      const name = 'username';
      const selector = `.auth0-lock-input-${name} input`;
console.log(container.html())
      const ele = container.find(selector);

      return ;//expect(ele.length).toBe(1);
    })

  });
});