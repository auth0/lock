import React from 'react';
import Immutable, { Map } from 'immutable';
import sync from './sync';
import * as l from './core/index';
import { dataFns } from './utils/data_utils';
const { get, set } = dataFns(["i18n"]);
import enDictionary from './i18n/en';
import { load } from './utils/cdn_utils';

export default function(m, keyPath, params = {}) {
  const strings = get(m, "strings");

  if (params.__raw) {
    return raw(strings, keyPath);
  }

  const html = entry(strings, keyPath, params);
  if (!html) {
    return null;
  }

  if (params.__textOnly) {
    return html;
  }

  return React.createElement("span", {dangerouslySetInnerHTML: {__html: html}});
}

function entry(strings, keyPath, params = {}) {
  return Immutable.fromJS(params).reduce((r, v, k) => {
    return r.replace(`{${k}}`, v);
  }, strings.getIn(keyPath, ""));
}

// TODO: this is a bad name because it's meant to be used in groups
function raw(strings, keyPath) {
  return strings.getIn(keyPath, Map()).toJS();
}

export function initI18n(m) {
  const language = l.ui.language(m);
  const overrides = l.ui.dict(m);

  let base = languageDictionaries[language] || Map({});

  if (base.isEmpty()) {
    base = overrides;
    m = sync(m, "i18n", {
      syncFn: (_, cb) => syncLang(m, language, cb),
      successFn: (m, result) => set(m, "strings", result.mergeDeep(overrides))
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
    url: `${l.assetsUrl(m)}/js/lock/${__VERSION__}/${language}.js`,
    check: str => str && str === language,
    cb: (err, _, dictionary) => {
      cb(err, dictionary && Immutable.fromJS(dictionary));
    }
  });
}

const languageDictionaries = [];

function registerLanguageDictionary(language, dictionary) {
  languageDictionaries[language] = Immutable.fromJS(dictionary);
}

registerLanguageDictionary("en", enDictionary);
