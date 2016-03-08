var md5 = require('../md5');
var regex = require('../regex');
var trim = require('trim');

/**
 * Returns a function which sets the header image using the supplied
 * function to construct the URL for the avatar asociated with a
 * given mail.
 *
 * @param {Function} urlFunc
 *
 * @static
 * @public
 */
// TODO Change widget to header
module.exports = function(urlFunc) {
  return function (widget, mail) {
    var parseResult = regex.email_parser.exec(mail.toLowerCase());

    // valid email? Then construct a URL from it
    if (parseResult) {
      var parsedEmail = parseResult[0];

      widget.setImage(urlFunc(trim(parsedEmail)));

    } else {
      widget.restoreImage();
    }
  };
};
