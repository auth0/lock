'use strict';

var attributeName = process.argv[2] || 'name';
var path = process.argv[3] || '../../package.json';
var attributes = require(path);
var value = attributes[attributeName]
if (value !== undefined) {
  console.log(value);
}