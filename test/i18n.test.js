"use strict";

import enDictionary from '../src/i18n/en';
import esDictionary from '../src/i18n/es';
import Immutable from 'immutable';
import flatten from 'flat';
import {mockModule, es6Exports} from './helpers/mock';

mockModule('sync', () => {
  return es6Exports({
    default: (m, key, opts) => {
      m = opts.successFn(m, esDictionary);
      return m;
    }
  });
});

import {initI18n} from '../src/i18n';

test("load i18n configuration", () => {

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
    return Promise.all(
      Object.keys(en).map( (key) => {
        return Promise.all([
            expect(language[key]).toBeDefined(),
            expect([en[key], es[key]]).toContain(language[key])
          ]);
      })
    );
  });
});
