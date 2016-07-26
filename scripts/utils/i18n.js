'use strict';

if (process.argv.length <= 1) {
    console.log("Usage: " + __filename + " <i18n filename>");
    process.exit(-1);
}

var path = require('path')  
var fs = require('fs');

var filePath = process.argv[2]

var file = path.basename(filePath);
var lang = path.basename(filePath, '.js');
var es = require("../../" + filePath).default || require("../../" + filePath);

var languages = {}

var Auth0 = {
  registerLanguageDictionary: function(lang, dict) {
    languages[lang] = dict;
  }
};

var transformation = "Auth0.registerLanguageDictionary(\"" + lang + "\", " + JSON.stringify(es) + ");"
eval(transformation);

if (languages[lang] === undefined) {
  process.exit(-1);
}

fs.writeFile("build/" + file, transformation, function(err) {
    if(err) {
        console.log(err);
    }
});