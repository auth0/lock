import expect from 'expect.js';
import Immutable from 'immutable';
import {initI18n} from '../src/i18n';
import { go } from '../src/sync';
import { swap, setEntity, updateEntity, observe } from '../src/store/index';
import { dataFns } from '../src/utils/data_utils';

import enDictionary from '../src/i18n/en';
import esDictionary from '../src/i18n/es';

const core = dataFns(["core"]);

describe("load i18n configuration", function() {

  it("should merge and warn missing keys", function(done) {

    const id = 1;

    var m = Immutable.fromJS({
      languageBaseUrl: "https://cdn.auth0.com",
      ui: {
        disableWarnings: true,
        language: "es"
      }
    });
    
    go(id);

    observe("test", id, (m) => { 
      if (m.getIn(['sync', 'i18n', 'syncStatus']) === 'ok') {
        assertLanguage(m.getIn(['i18n', 'strings']).toJS(), enDictionary, esDictionary)
        done();
      }
    });
    
    m = core.init(id, m);

    m = initI18n(m);

    m = swap(setEntity, "lock", id, m);
  });
});

function assertLanguage(language, en, es) { 
  Object.keys(en).forEach( (key) => {
    expect(language).to.have.property(key);
    if (typeof en[key] === 'object') {
      assertLanguage(language[key], en[key], es[key]);
    }
    else {
      expect([en[key], es[key]]).to.contain(language[key]);
    }
  });
}