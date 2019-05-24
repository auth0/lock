const fs = require('fs');
const { promisify } = require('util');
const readdirAsync = promisify(fs.readdir);
const writeFileAsync = promisify(fs.writeFile);
const request = require('superagent');
const enDictionary = require('../lib/i18n/en').default;

const isSupportedByAuth0 = lang => ['en', 'es', 'pt-br', 'it', 'de'].includes(lang);
const escapeWildCards = str => str.replace(/\%d/gi, '__d__').replace(/\%s/gi, '__s__');
const restoreWildCards = str =>
  str.replace(/__( d|d |d)__/gi, '%d').replace(/__( s|s |s)__/gi, '%s');

const processLanguage = async lang => {
  try {
    console.log(`translating: ${lang}`);
    const langDictionary = require('../lib/i18n/' + lang).default;
    await processNode(enDictionary, langDictionary, lang);
    const communityAlert = `
  // This file was automatically translated.
  // Feel free to submit a PR if you find a more accurate translation.
`;
    const jsContent = `
  ${isSupportedByAuth0(lang) ? '' : communityAlert}
  export default ${JSON.stringify(langDictionary, null, 2)};
`;
    await writeFileAsync(`src/i18n/${lang}.js`, jsContent);
  } catch (error) {
    console.log(`Error translating ${lang}.`);
    console.log(error.message);
  }
};

const processNode = async (enNode, langNode, lang) => {
  for (enKey of Object.keys(enNode)) {
    if (typeof enNode[enKey] === 'object') {
      await processNode(enNode[enKey], langNode[enKey], lang);
    } else {
      if (!langNode[enKey]) {
        console.log('translating ', enKey);
        const translation = await translateKey(enNode[enKey], lang);
        langNode[enKey] = translation;
      }
    }
  }
};

const translateKey = async (toTranslate, lang) => {
  const result = await request
    .get('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t')
    .set('Content-Type', 'application/json')
    .query({ tl: lang })
    .query({ q: escapeWildCards(toTranslate) });
  const phrases = result.body[0].map(p => p[0]);
  const singlePhrase = phrases.join('');
  return restoreWildCards(singlePhrase);
};

const run = async () => {
  const files = await readdirAsync('lib/i18n/');
  for (file of files) {
    const language = file.split('.')[0];
    if (language !== 'en') {
      await processLanguage(language);
    }
  }
};

run();
