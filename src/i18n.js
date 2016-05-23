import React from 'react';
import Immutable, { Map } from 'immutable';
import sync from './sync';
import * as l from './core/index';
import { dataFns } from './utils/data_utils';
const { get, set } = dataFns(["i18n"]);
import baseDict from './i18n/base_dict';

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
  // const language = l.ui.language(m);
  const languageDictionary = l.ui.dict(m);
  const strings = Immutable.fromJS(baseDict).mergeDeep(languageDictionary);

  return set(m, "strings", strings);
}
