require('dotenv').config()
const fs = require('fs');
const request = require('superagent');
const beautify = require('json-beautify');
const enDictionary = require('../lib/i18n/en').default;
const key = process.env.GOOGLE_TRANSLATOR;

const nonComunity = ['en', 'es', 'pt-br', 'it', 'de']

fs.readdir('lib/i18n/', (err, files) => {
  files.forEach(file => {
    const language = file.split('.')[0];
    if (language !== 'en') {
      processLanguage(language);
    }
  });
})

function processLanguage(lang) {
  console.log('-', lang, 'start:')
  const langDictionary = require('../lib/i18n/' + lang).default;
  const diff = getDiff(enDictionary, langDictionary);

  if (Object.keys(diff).length !== 0) {
    console.log('-', lang, 'processing differences')
    const arr = getFlatValues(diff);

    console.log('-', lang, 'fetching translations')
    fetchTranslations(arr, lang, (err, res) => {
      if (err) return;

      console.log('-', lang, 'updating dictionary')
      const updatedLangDictionary = updateLang(langDictionary, diff, res.data.translations);

      let json = "";

      if (nonComunity.indexOf(lang) === -1) {
        json += "// This file was automatically translated.\n"
        json += "// Feel free to submit a PR if you find a more accurate translation.\n\n"
      }

      json += 'export default ' + beautify(updatedLangDictionary, null, 2) + ";\n";

      console.log('-', lang, 'writing dictionrary')
      fs.writeFileSync('src/i18n/' + lang + '.js', json);
    })
  } else {
    console.log('-', lang, 'UP TO DATE!!')
  }
}

function updateLang(language, difference, translations) {
  Object.keys(difference).forEach( key => {
    if (typeof difference[key] === 'object') {
      language[key] = updateLang(language[key], difference[key], translations);
    } else {
      language[key] = unscapeAscii(restoreWildCards(translations.shift().translatedText));
    }
  })

  return language;
}

function getDiff(base, language) {
  return Object.keys(base).reduce( (diff, key) => {

    if (!language.hasOwnProperty(key)) {
      diff[key] = base[key];
    } else {
      if (typeof base[key] === 'object') {
        let subdiff = getDiff(base[key], language[key]);
        if (Object.keys(subdiff).length !== 0) {
          diff[key] = subdiff;
        }
      }
    }

    return diff;

  }, {});
}

function scapeWildCards(str) {
  return str.replace('%d', '<span>d</span>')
            .replace('%s', '<span>s</span>');
}

function restoreWildCards(str) {
  return str.replace('<span>d</span>', '%d')
            .replace('<span>D</span>', '%d')
            .replace('<span>D-nummer</span>', '%d')
            .replace('<span>S-nummer</span>', '%s')
            .replace('<span>s</span>', '%s')
            .replace('<span>S</span>', '%s');
}

function getFlatValues(obj, values) {
  values = values || [];

  for (var key in obj) {

    if (typeof obj[key] === 'object') {
      values = getFlatValues(obj[key], values)
    } else {
      values.push(scapeWildCards(obj[key]));
    }
  }

  return values;
}

function fetchTranslations(arr, lang, cb) {
  var req = request.get('https://translation.googleapis.com/language/translate/v2?key=' + key)
            .set('Content-Type', 'application/json')
            .query({ source: 'en' })
            .query({ target: lang })
            .query({ format: 'html' })
            .query({ q: arr })
            .end(function(err, res) {
              if (err) {
                console.error(err);
              }

              return cb(err, res.body);
            })
}

function unscapeAscii(str) {
  return str.replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(n); })
}