"use strict";
import { stub } from 'sinon';

import expect from 'expect.js';
import Immutable from 'immutable';
import flatten from 'flat';

import enDictionary from '../src/i18n/en';
import esDictionary from '../src/i18n/es';

import * as sync from '../src/sync';

describe("load i18n configuration", () => {

  before(function() {
    stub(sync, "default", (m, key, opts) => {
      m = opts.successFn(m, esDictionary);
      return m;
    });
  });

  after(function() {
    sync.default.restore();
  });

  it('should merge and warn missing keys', () => {

    let i18n = require('../src/i18n');

    // We need to initialize the state
    var m = Immutable.fromJS({
      languageBaseUrl: "https://cdn.auth0.com",
      ui: {
        disableWarnings: true,
        language: "es"
      }
    });

    // Initialize i18n.
    m = i18n.initI18n(m);

    let language = flatten(m.getIn(['i18n', 'strings']).toJS());
    let en = flatten(enDictionary);
    let es = flatten(esDictionary);

    // We should check that the language has all the keys in the 
    // en language and its values should be either es or en.
    Object.keys(en).forEach( (key) => {
      expect(language).to.have.property(key);
      expect([en[key], es[key]]).to.contain(language[key]);
    })
  });
});