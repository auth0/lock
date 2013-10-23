var fs          = require('fs');
var insertCss   = require('./vendor/insert-css');
var Auth0Widget = require('./widget');

insertCss(fs.readFileSync(__dirname + '/widget/css/main.css'));

if (global.window) {
  global.window.Auth0Widget = Auth0Widget;
}

module.exports = Auth0Widget;
