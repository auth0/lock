"use strict";
import { stub } from 'sinon';

import expect from 'expect.js';
import Immutable from 'immutable';
import flatten from 'flat';

import enDictionary from '../src/i18n/en';
import esDictionary from '../src/i18n/es';

import * as sync from '../src/sync';

stub(sync, "default", (m, key, opts) => {
  m = opts.successFn(m, esDictionary);
  return m;
});

import { initI18n } from '../src/i18n';


describe.only("load i18n configuration", () => {

  after(function() {
    sync.default.restore();
  });

  it('should merge and warn missing keys', () => {

    // We need to initialize the state
    var m = Immutable.fromJS({
      languageBaseUrl: "https://cdn.auth0.com",
      ui: {
        disableWarnings: true,
        language: "es"
      }
    });

    // Initialize i18n.
    m = initI18n(m);

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