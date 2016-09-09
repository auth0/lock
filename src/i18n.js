import React from 'react';
import Immutable, { Map } from 'immutable';
import { format } from 'util';
import sync from './sync';
import * as l from './core/index';
import { dataFns } from './utils/data_utils';
const { get, set } = dataFns(["i18n"]);
import enDictionary from './i18n/en';
import { load, preload } from './utils/cdn_utils';

export function str(m, keyPath, ...args) {
  return format(get(m, ["strings"].concat(keyPath), ""), ...args);
}

export function html(m, keyPath, ...args) {
  const html = str(m, keyPath, ...args);

  return html
    ? React.createElement("span", {dangerouslySetInnerHTML: {__html: html}})
    : null;
}

export function group(m, keyPath) {
  return get(m, ["strings"].concat(keyPath), Map()).toJS();
}

export function initI18n(m) {
  const language = l.ui.language(m);
  const overrides = l.ui.dict(m);

  let base = languageDictionaries[language] || Map({});

  if (base.isEmpty()) {
    base = overrides;
    m = sync(m, "i18n", {
      syncFn: (_, cb) => syncLang(m, language, cb),
      successFn: (m, result) => {
        registerLanguageDictionary(language, result);

        return set(
          m,
          "strings",
          languageDictionaries[language].mergeDeep(overrides)
        );
      }
    });
  }

  if (!base.has("title")) {
    base = base.set("title", enDictionary.title);
  }

  if (!base.has("unrecoverableError")) {
    base = base.set("unrecoverableError", enDictionary.unrecoverableError);
  }

  return set(m, "strings", base.mergeDeep(overrides));
}

// sync

function syncLang(m, language, cb) {
  load({
    method: "registerLanguageDictionary",
    url: `${l.languageBaseUrl(m)}/js/lock/${__VERSION__}/${language}.js`,
    check: str => str && str === language,
    cb: (err, _, dictionary) => {
      cb(err, dictionary);
    }
  });
}

const languageDictionaries = [];

function registerLanguageDictionary(language, dictionary) {
  languageDictionaries[language] = Immutable.fromJS(dictionary);
}

registerLanguageDictionary("en", enDictionary);

preload({
  method: "registerLanguageDictionary",
  cb: registerLanguageDictionary
});
