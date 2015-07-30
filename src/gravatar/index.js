import { md5 } from 'blueimp-md5';
import { validateEmail } from '../credentials/index';
import jsonp from 'jsonp';

export function setDisplayName(m, value) {
  return m.set("displayName", value);
}

export function displayName(m) {
  return m.get("displayName");
}

export function setImageUrl(m, value) {
  return m.set("imageUrl", value);
}

export function imageUrl(m) {
  return m.get("imageUrl");
}

export function loaded(m) {
  return !!(displayName(m) && imageUrl(m));
}

// TODO: the `profile` and `img` functions should be in another file.
export function profile(email, success, error) {
  email = validateEmail(email);
  if (email) {
    const url = `https://secure.gravatar.com/${md5(email)}.json`;
    jsonp(url, function (err, obj) {
      if (err) {
        error(email, err);
      } else if (obj && obj.entry) {
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
  email = validateEmail(email);
  if (email) {
    const url = `https://secure.gravatar.com/avatar/${md5(email)}?d=404`;
    const img = document.createElement("img");
    img.addEventListener("load", () => { success(email, img); });
    img.addEventListener("error", () => { error(email) });
    img.src = url;
    return img;
  } else {
    error(email);
  }
}
