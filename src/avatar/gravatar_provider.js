import blueimp from 'blueimp-md5';
import trim from 'trim';
import jsonp from '../utils/jsonp_utils';
import { validateEmail } from '../field/email';

const md5 = blueimp.md5 || blueimp;

function normalize(str) {
  return typeof str === 'string' ? trim(str.toLowerCase()) : '';
}

export function displayName(email, cb) {
  email = normalize(email);
  if (!validateEmail(email)) return cb({});

  const url = `https://secure.gravatar.com/${md5(email)}.json`;
  jsonp.get(url, function(error, result) {
    if (!error && result && result.entry && result.entry[0]) {
      cb(null, result.entry[0].displayName);
    } else {
      cb({});
    }
  });
}

export function url(email, cb) {
  email = normalize(email);
  if (!validateEmail(email)) return cb({});

  cb(null, `https://secure.gravatar.com/avatar/${md5(email)}?d=404&s=160`);
}
