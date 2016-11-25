"use strict";
import { stub } from 'sinon';

import expect from 'expect.js';
import Immutable from 'immutable';

import { overrideOptions } from '../src/core/index';
import * as i18n from '../src/i18n';

describe("Override state with options on show", () => {

  before(function() {
    stub(i18n, "initI18n", (m) => {
      return m;
    });
  });

  after(function() {
    i18n.initI18n.restore();
  });

  it('should merge and warn missing keys', () => {

    var m = Immutable.fromJS({});

    var new_options = {
      allowedConnections: 'facebook',
      languageDictionary: {
        title: 'new_title'
      },
      flashMessage: {
        type: 'success',
        text: 'test'
      },
      auth: {
        params: {
          state: '1234'
        }
      },
      language: 'es',
      theme: {
        primaryColor: 'red',
        logo: 'http://test.com/logo.png'
      }
    };

    m = overrideOptions(m, new_options);

    expect(m.toJS()).to.eql({
      core: {
        transient: {
          globalSuccess: 'test',
          allowedConnections: "facebook",
          ui: {
            primaryColor: 'red',
            logo: 'http://test.com/logo.png',
            language: 'es',
            dict: {
              title: "new_title"
            }
          },
          authParams: {
            state: '1234'
          }
        }
      }
    });

  });
});