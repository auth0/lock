import Immutable from 'immutable';
import flatten from 'flat';

import enDictionary from '../i18n/en';
import esDictionary from '../i18n/es';

import * as sync from '../sync';
import * as l from '../core/index';
import { initSanitizer } from '../sanitizer';

describe('i18n', () => {
  let syncSpy;
  let langSpy;

  beforeEach(() => {
    syncSpy = jest.spyOn(sync, 'default');

    langSpy = jest.spyOn(l.ui, 'language').mockImplementation(() => {
      return 'en';
    });
  });

  afterEach(() => {
    syncSpy.mockRestore();
    langSpy.mockRestore();
  });

  describe('load i18n configuration', () => {
    it('should have a defaultDictionary', () => {
      const i18n = require('../i18n');

      // We need to initialize the state
      var m = Immutable.fromJS({});

      // Initialize i18n.
      const initialized = i18n.initI18n(m);

      let language = flatten(initialized.getIn(['i18n', 'strings']).toJS());
      const en = flatten(enDictionary);

      expect(language).toEqual(en);
    });
  });

  describe('when en language is selected', () => {
    it('should allow check for external en dictionaries', () => {
      const i18n = require('../i18n');

      i18n.initI18n(Immutable.fromJS({}));
      expect(syncSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when html is called', () => {
    it('should sanitize the input and not allow for javascript to be passed through', () => {
      const i18n = require('../i18n');
      const strings = {
        test: '<img src=1 href=1 onerror="javascript:alert(1)"></img>'
      };
      const m = Immutable.fromJS({ i18n: { strings } });
      const html = i18n.html(m, 'test');
      expect(html.props.dangerouslySetInnerHTML.__html).not.toMatch(/javascript:alert/);
      expect(html.props.dangerouslySetInnerHTML.__html).toEqual('<img href="1" src="1">');
    });

    it('should allow target=_blank with noopener noreferrer attributes', () => {
      initSanitizer();

      const i18n = require('../i18n');

      const strings = {
        test: '<a href="#" target="_blank">link</a>'
      };

      const m = Immutable.fromJS({ i18n: { strings } });
      const html = i18n.html(m, 'test');

      expect(html.props.dangerouslySetInnerHTML.__html).toEqual(
        '<a href="#" target="_blank" rel="noopener noreferrer">link</a>'
      );
    });
  });
});
