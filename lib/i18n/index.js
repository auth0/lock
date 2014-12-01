var dics_data = {
  'ar': require('../../i18n/ar.json'),
  'de': require('../../i18n/de.json'),
  'en': require('../../i18n/en.json'),
  'es': require('../../i18n/es.json'),
  'fr': require('../../i18n/fr-FR.json'),
  'fr-FR': require('../../i18n/fr-FR.json'),
  'he': require('../../i18n/he.json'),
  'it': require('../../i18n/it.json'),
  'ja': require('../../i18n/ja.json'),
  'nb-NO': require('../../i18n/nb-NO.json'),
  'nl': require('../../i18n/nl-NL.json'),
  'nl-NL': require('../../i18n/nl-NL.json'),
  'pt': require('../../i18n/pt.json'),
  'pt-BR': require('../../i18n/pt-BR.json'),
  'ru': require('../../i18n/ru.json'),
  'tlh': require('../../i18n/tlh.json'),
  'tr': require('../../i18n/tr.json'),
  'zh': require('../../i18n/zh.json')
};

var default_dict = dics_data['en'];

function findProp(o, s) {
    s = s.replace(/\[(\w+)\]/g, ':$1'); // convert indexes to properties
    s = s.replace(/^\:/, '');           // strip a leading dot
    var a = s.split(':');
    while (a.length) {
        var n = a.shift();
        if (n in o) {
            o = o[n];
        } else {
            return;
        }
    }
    return o;
}

function Dictionary (data) {
  this._data = data;
}

Dictionary.prototype.t = function (key) {
  return findProp(this._data, key) || findProp(default_dict, key);
};

module.exports.getDict = function ( langOrDict ) {

  if (!langOrDict) {
    return new Dictionary(default_dict);
  }

  if ( typeof langOrDict === 'string' ) {
    var dict = dics_data[langOrDict] || dics_data[langOrDict.split('-')[0]];
    return new Dictionary(dict);
  } else {
    return new Dictionary(langOrDict);
  }
};
