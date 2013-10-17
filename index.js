var fs        = require('fs');
var insertCss = require('insert-css');
var Auth0     = require('./widget');

insertCss(fs.readFileSync(__dirname + '/widget/css/login.css'));
insertCss(fs.readFileSync(__dirname + '/widget/css/zocial.css'));
insertCss(fs.readFileSync(__dirname + '/widget/css/common.css'));
insertCss(fs.readFileSync(__dirname + '/widget/css/button.css'));
insertCss(fs.readFileSync(__dirname + '/widget/css/normalize.css'));

if (global.window) {
  global.window.Auth0 = new Auth0();
}
