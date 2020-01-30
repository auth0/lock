const fs = require('fs');
const path_module = require('path');
const NodeESModuleLoader = require('node-es-module-loader');
const langs = {};
const missingLangs = {};

const directory = path_module.join(__dirname, '..', 'src', 'i18n');
const loader = new NodeESModuleLoader(directory);

function LoadModules(path) {
  fs.lstat(path, function(err, stat) {
    if (stat.isDirectory()) {
      // we have a directory: do a tree walk
      fs.readdir(path, function(err, files) {
        let f,
          l = files.length;

        for (let i = 0; i < l; i++) {
          if (/\.js$/.test(files[i])) {
            f = path_module.join(path, files[i]);
            LoadModules(f);
          }
        }
      });
    } else {
      // we have a file: load it
      // require(path)(module_holder);
      loader.import(path).then(r => console.log(r.default));
    }
  });
}

const processObject = obj => {
  // console.log(obj.default);

  for (key of Object.keys(obj)) {
    let objPath = key;
    console.log(key);

    if (typeof obj.default[key] === 'object') {
      const subPath = processObject(obj.default[key]);
      return `${objPath} -> ${subPath}`;
    } else {
      return `"${obj.default[key]}"`;
    }
  }
};

loader.import(path_module.join(directory, 'en.js')).then(en => {
  const p = processObject(en.default);
  console.log(p);

  // LoadModules(directory);
});
