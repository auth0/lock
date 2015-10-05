import { md5 } from 'blueimp-md5';
import { validateEmail } from '../cred/index';
import jsonp from '../utils/jsonp_utils';
import * as preload from '../preload/index';

export function profile(email, success, error) {
  if (validateEmail(email)) {
    const url = `https://secure.gravatar.com/${md5(email)}.json`;
    jsonp.get(url, function (err, obj) {
      if (err) {
        error(email, err);
      } else if (obj && obj.entry && obj.entry[0]) {
        success(email, obj.entry[0]);
      } else {
        error(email);
      }
    });
  } else {
    error(email);
  }
}

export function img(email, success, error) {
  if (validateEmail(email)) {
    const url = `https://secure.gravatar.com/avatar/${md5(email)}?d=404`;
    preload.img(url, function(err, img) {
      err ? error(email) : success(email, img);
    });
  } else {
    error(email);
  }
}
