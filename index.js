var fs          = require('fs');
var insertCss   = require('insert-css');

var Auth0Widget = require('./widget');

insertCss(fs.readFileSync(__dirname + '/widget/css/login.css'));
insertCss(fs.readFileSync(__dirname + '/widget/css/zocial.css'));
insertCss(fs.readFileSync(__dirname + '/widget/css/common.css'));
insertCss(fs.readFileSync(__dirname + '/widget/css/normalize.css'));

if (global.window) {
  global.window.Auth0Widget = Auth0Widget;
}

module.exports = Auth0Widget;
