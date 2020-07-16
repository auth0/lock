if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
  console.error(`
In order to run this script you need to follow this procedure:

1. create a project in google cloud console https://console.cloud.google.com/
2. Go to APIs & Services -> Credentials, then create an API Key. Copy this API key you will need it later.
3. Go to APIs & Services -> Library, and then enable Google Translate.
4. run this command as follows:

$  GOOGLE_TRANSLATE_API_KEY=<api key> npm i18n:translate

note: leave an space on the beginning of the command so the key don't get stored in your history file.
`);

  process.exit(1);
}

const fs = require('fs');
const { promisify } = require('util');
const readdirAsync = promisify(fs.readdir);
const writeFileAsync = promisify(fs.writeFile);
const enDictionary = require('../lib/i18n/en').default;
const { Translate } = require('@google-cloud/translate').v2;

const translator = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

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
      if (!langNode[enKey] && enNode[enKey]) {
        console.log('translating ', enKey);
        const translation = await translateKey(enNode[enKey], lang);
        langNode[enKey] = translation;
      }
    }
  }
};

const translateKey = async (toTranslate, lang) => {
  if (lang == 'ua') {
    //Note: "ua" is not a valid language code, the actual lang code is uk-ua
    //which is Ukraine Ukrainian. Google Translate fails with ua and with uk-ua
    //so we default here to Ukrainian.
    lang = 'uk';
  }
  const input = escapeWildCards(toTranslate);
  const [translation] = await translator.translate(input, lang);
  return restoreWildCards(translation);
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
