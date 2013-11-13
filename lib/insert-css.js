function insert (css) {
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    head.appendChild(style);

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
};

var fs = require('fs');
var style = fs.readFileSync(__dirname + '/../widget/css/main.min.css');
insert(style);