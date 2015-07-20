import * as g from './index';
import { updateGravatar, getGravatar } from '../store/index';

export function requestGravatar(email) {
  if (!getGravatar(email)) {
    requestGravatarImage(email);
    requestGravatarDisplayName(email);
  }
}

function requestGravatarDisplayName(email) {
  const success = (email, entry) => requestGravatarDisplayNameSuccess(email, entry.displayName);
  const error = email => requestGravatarDisplayNameError(email);
  g.profile(email, success, error);
}

function requestGravatarImage(email) {
  const success = (email, img) => requestGravatarImageSuccess(email, img.src);
  const error = email => requestGravatarImageError(email);
  g.img(email, success, error);
}


function requestGravatarDisplayNameSuccess(email, displayName) {
  updateGravatar(email, x => {
    return x.set("displayName", displayName).set("loaded", x.has("imageUrl"));
  });
}

function requestGravatarDisplayNameError(email) {}

function requestGravatarImageSuccess(email, imageUrl) {
  updateGravatar(email, x => {
    return x.set("imageUrl", imageUrl).set("loaded", x.has("displayName"));
  });
}

function requestGravatarImageError(email) {}
