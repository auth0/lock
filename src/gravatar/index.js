import { md5 } from 'blueimp-md5';
import EmailCredentials from '../lock/credentials/email';
import jsonp from 'jsonp';

class Gravatar {
  fetch(email, success, error) {
    email = EmailCredentials.validateEmail(email);
    if (email) {
      let url = `https://secure.gravatar.com/${md5(email)}.json`
      // TODO we should be caching this stuff
      jsonp(url, function (err, obj) {
        if (err) {
          error(email, err);
        } else if (obj && obj.entry) {
          success(email, obj.entry[0].thumbnailUrl, obj.entry[0].displayName);
        } else {
          error(email);
        }
      });
    } else {
      error(email);
    }
  }
}

export default new Gravatar();
