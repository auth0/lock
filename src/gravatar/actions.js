import { read, swap, getEntity, updateEntity } from '../store/index';
import * as g from './index';
import * as webAPI from './web_api';
import * as f from '../utils/fn_utils';

export function requestGravatar(email) {
  email = g.normalizeGravatarEmail(email);

  if (!read(getEntity, "gravatar", email)) {
    requestGravatarImage(email);
    requestGravatarDisplayName(email);
  }
}

export const debouncedRequestGravatar = f.debounce(requestGravatar, 300);

function requestGravatarDisplayName(email) {
  const success = (email, entry) => requestGravatarDisplayNameSuccess(email, entry.displayName);
  const error = email => requestGravatarDisplayNameError(email);
  webAPI.profile(email, success, error);
}

function requestGravatarImage(email) {
  const success = (email, img) => requestGravatarImageSuccess(email, img.src);
  const error = email => requestGravatarImageError(email);
  webAPI.img(email, success, error);
}


function requestGravatarDisplayNameSuccess(email, displayName) {
  swap(updateEntity, "gravatar", email, g.setDisplayName, displayName);
}

function requestGravatarDisplayNameError(email) {}

function requestGravatarImageSuccess(email, imageUrl) {
  swap(updateEntity, "gravatar", email, g.setImageUrl, imageUrl);
}

function requestGravatarImageError(email) {}
