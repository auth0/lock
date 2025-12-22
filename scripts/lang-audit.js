const path_module = require('path');
const emojic = require('emojic');
const chalk = require('chalk');
const glob = require('glob');
const { pathToFileURL } = require('url');
const directory = path_module.join(__dirname, '..', 'src', 'i18n');

/**
 * Flattens an object recursively so that any nested objects are referred to on the root object using
 * a key path.
 * e.g. turns:
 * {
 *    obj: {
 *      nestedObject: {
 *        someKey: 'string'
 *      }
 *    }
 * }
 *
 * into:
 *
 * {
 *  'obj.nestedObject.someKey': 'string'
 * }
 *
 * This makes it much easier to compare keys later.
 *
 * @param {string} obj The object to flatten
 * @param {*} keyPath A culmulative list of flattened keys
 */
const flattenObject = (obj, cumulative = []) => {
  let keys = {};

  for (key of Object.keys(obj)) {
    if (typeof obj[key] === 'object') {
      const subKeys = flattenObject(obj[key], cumulative.concat(key));
      keys = { ...keys, ...subKeys };
    } else {
      const prefix = cumulative.length ? `${cumulative.join('.')}.` : '';
      keys[`${prefix}${key}`] = obj[key];
    }
  }

  return keys;
};

/**
 * Compares two objects and returns some stats about which keys are missing
 * in obj2 compared to obj1
 * @param {*} obj1
 * @param {*} obj2
 */
const compareKeys = (obj1, obj2) => {
  const result = {
    matched: [],
    missing: [],
    total: Object.keys(obj1).length
  };

  for (key of Object.keys(obj1)) {
    if (!(key in obj2)) {
      result.missing.push({ key, text: obj1[key] });
    } else {
      result.matched.push({ key, original: obj1[key], translation: obj2[key] });
    }
  }

  return result;
};

/**
 * Validates a i18n language module compared to a reference object.
 * @param {string} reference The reference object. A lang file that has been loaded and flattened.
 * @param {string} path The full module path of the module to compare to the reference.
 */
const validateLangFile = async (reference, path, verbose) => {
  console.log(`Processing ${chalk.green(path_module.relative(process.cwd(), path))}`);

  const stats = {
    coverage: 0,
    total: 0,
    missing: 0
  };

  const lang = await import(pathToFileURL(path).href);
  const langFlattened = flattenObject(lang.default);

  const result = compareKeys(reference, langFlattened);

  if (verbose) {
    for (key of Object.keys(reference)) {
      if (key in langFlattened) {
        console.log(chalk.green(`${key}: ${langFlattened[key]}`));
      } else {
        console.log(chalk.red(`${key}: ${reference[key]}`));
      }
    }

    console.log();
  }

  console.log(emojic.whiteCheckMark + ` Found ${result.total} keys`);

  if (result.missing.length) {
    console.log(`${emojic.x} Found ${result.missing.length} missing keys`);

    for (missing of result.missing) {
      console.log(
        chalk.red(
          `Missing translation for ${path_module.basename(path)} -> ${missing.key} = "${
            missing.text
          }"`
        )
      );
    }
  }

  stats.total = result.total;
  stats.missing = result.missing.length;
  stats.coverage = stats.total / stats.missing;

  return stats;
};

const run = async () => {
  // Load the 'en' lang file to act as the reference for all others
  const enPath = path_module.join(directory, 'en.js');
  const en = await import(pathToFileURL(enPath).href);
  const enBenchmark = flattenObject(en.default, []);

  const args = process.argv.slice(2);
  let filePattern = args[0] ? args[0] : '*.js';

  const verbose = args.includes('-v');

  // Grab all the module files we want to compare to
  const modules = glob.sync(path_module.join(__dirname, '..', 'src', 'i18n', filePattern));
  let files = 0;
  let coverage = 0;
  let total = 0;
  let missing = 0;

  for (file of modules) {
    const stats = await validateLangFile(enBenchmark, file, verbose);
    console.log('');

    files++;
    total += stats.total;
    missing += stats.missing;
  }

  coverage = (1 - missing / total) * 100;

  // report
  console.log(chalk.green(`Processed ${total} keys across ${files} file/s`));

  if (missing > 0) {
    console.log(
      chalk.red(
        `Missing ${missing} translation keys (average ${(missing / files).toFixed(1)} per file)`
      )
    );
  }

  console.log(`Coverage: ${chalk.yellow(coverage.toFixed(2))}%`);

  return missing;
};

run().then(process.exit);
