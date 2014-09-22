var md5 = require('blueimp-md5').md5;
var regex = require('../regex');
var trim = require('trim');

/**
 * Create gravatar url
 *
 * @private
 */
function createURL(parsedEmail) {
  // Trim leading and trailing whitespace
  parsedEmail = trim(parsedEmail);

  // Force all characters to lower-case
  parsedEmail = parsedEmail.toLowerCase();

  // Apply MD5
  // We are not using:
  //  var createHash = require('crypto').createHash;
  //  var md5sum = createHash('md5').update(parsedEmail);
  // As it does not work in IE9 :(

  return 'http://www.gravatar.com/avatar/' + md5(parsedEmail) + '?d=404';

}

/**
 * Sets the header image using a Gravatar asociated with a
 * given mail.
 *
 * @param {Object} widget
 * @param {String} mail
 *
 * @static
 * @public
 */
// TODO Change widget to header
module.exports = function (widget, mail) {
    var parseResult = regex.email_parser.exec(mail.toLowerCase());

    // valid email? Then fetch it in Gravatar
    if (parseResult) {
      var parsedEmail = parseResult[0];

      widget.setImage(createURL(parsedEmail));

    } else {
      widget.restoreImage();
    }
};

