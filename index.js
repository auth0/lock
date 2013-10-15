var domready = require('domready');
var widget = require('./widget');

domready(function () {
    var w = widget();
    w.appendTo(document.body);
});
