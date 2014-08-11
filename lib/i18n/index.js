var dics_data = {
  'ar': require('./ar.json'),
  'de': require('./de.json'),
  'en': require('./en.json'),
  'es': require('./es.json'),
  'fr': require('./fr-FR.json'),
  'fr-FR': require('./fr-FR.json'),
  'he': require('./he.json'),
  'it': require('./it.json'),
  'ja': require('./ja.json'),
  'nl': require('./nl-NL.json'),
  'nl-NL': require('./nl-NL.json'),
  'pt': require('./pt.json'),
  'pt-BR': require('./pt-BR.json'),
  'ru': require('./ru.json'),
  'tlh': require('./tlh.json'),
  'tr': require('./tr.json'),
  'zh': require('./zh.json')
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
