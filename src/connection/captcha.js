import * as l from '../core/index';
import * as c from '../field/index';
import * as i18n from '../i18n';
import { swap, updateEntity } from '../store/index';
import webApi from '../core/web_api';

/**
 * Display the error message of missing captcha in the header of lock.
 *
 * @param {Object} m model
 * @param {Number} id
 * @param {Boolean} isPasswordless Whether the captcha is being rendered in a passwordless flow
 */
export function showMissingCaptcha(m, id, isPasswordless = false) {
  const captchaConfig = isPasswordless ? l.passwordlessCaptcha(m) : l.captcha(m);

  const captchaError =
    captchaConfig.get('provider') === 'recaptcha_v2' ? 'invalid_recaptcha' : 'invalid_captcha';

  const errorMessage = i18n.html(m, ['error', 'login', captchaError]);

  swap(updateEntity, 'lock', id, m => {
    m = l.setSubmitting(m, false, errorMessage);
    return c.showInvalidField(m, 'captcha');
  });

  return m;
}

/**
 * Set the captcha value in the fields object before sending the request.
 *
 * @param {Object} m model
 * @param {Object} params
 * @param {Boolean} isPasswordless Whether the captcha is being rendered in a passwordless flow
 * @param {Object} fields
 *
 * @returns {Boolean} returns true if is required and missing the response from the user
 */
export function setCaptchaParams(m, params, isPasswordless, fields) {
  const captchaConfig = isPasswordless ? l.passwordlessCaptcha(m) : l.captcha(m);
  const isCaptchaRequired = captchaConfig && captchaConfig.get('required');

  if (!isCaptchaRequired) {
    return true;
  }
  const captcha = c.getFieldValue(m, 'captcha');
  //captcha required and missing
  if (!captcha) {
    return false;
  }

  params['captcha'] = captcha;
  fields.push('captcha');
  return true;
}

/**
 * Get a new challenge and display the new captcha image.
 *
 * @param {number} id The id of the Lock instance.
 * @param {Boolean} isPasswordless Whether the captcha is being rendered in a passwordless flow.
 * @param {boolean} wasInvalid A boolean indicating if the previous captcha was invalid.
 * @param {Function} [next] A callback.
 */
export function swapCaptcha(id, isPasswordless, wasInvalid, next) {
  if (isPasswordless) {
    return webApi.getPasswordlessChallenge(id, (err, newCaptcha) => {
      if (!err && newCaptcha) {
        swap(updateEntity, 'lock', id, l.setPasswordlessCaptcha, newCaptcha, wasInvalid);
      }
      if (next) {
        next();
      }
    });
  }
  return webApi.getChallenge(id, (err, newCaptcha) => {
    if (!err && newCaptcha) {
      swap(updateEntity, 'lock', id, l.setCaptcha, newCaptcha, wasInvalid);
    }
    if (next) {
      next();
    }
  });
}
