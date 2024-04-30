import * as l from '../core/index';
import * as c from '../field/index';
import * as i18n from '../i18n';
import { swap, updateEntity } from '../store/index';
import webApi from '../core/web_api';

export const Flow = Object.freeze({
  DEFAULT: 'default',
  PASSWORDLESS: 'passwordless',
  PASSWORD_RESET: 'password_reset',
});

/**
 * Return the captcha config object based on the type of flow.
 * 
 * @param {Object} m model
 * @param {Flow} flow Which flow the captcha is being rendered in
 */
export function getCaptchaConfig(m, flow) {
  if (flow === Flow.PASSWORD_RESET) {
    return l.passwordResetCaptcha(m);
  } else if (flow === Flow.PASSWORDLESS) {
    return l.passwordlessCaptcha(m);
  } else {
    return l.captcha(m);
  }
}

/**
 * Display the error message of missing captcha in the header of lock.
 *
 * @param {Object} m model
 * @param {Number} id
 * @param {Flow} flow Which flow the captcha is being rendered in
 */
export function showMissingCaptcha(m, id, flow = Flow.DEFAULT) {
  const captchaConfig = getCaptchaConfig(m, flow);

  const captchaError = (
    captchaConfig.get('provider') === 'recaptcha_v2' ||
    captchaConfig.get('provider') === 'recaptcha_enterprise' ||
    captchaConfig.get('provider') === 'hcaptcha' ||
    captchaConfig.get('provider') === 'auth0_v2' ||
    captchaConfig.get('provider') === 'friendly_captcha' ||
    captchaConfig.get('provider') === 'arkose' 
  ) ? 'invalid_recaptcha' : 'invalid_captcha';

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
 * @param {Flow} flow Which flow the captcha is being rendered in
 * @param {Object} fields
 *
 * @returns {Boolean} returns true if is required and missing the response from the user
 */
export function setCaptchaParams(m, params, flow, fields) {
  const captchaConfig = getCaptchaConfig(m, flow);
  const isCaptchaRequired = captchaConfig && captchaConfig.get('required');

  if (!isCaptchaRequired) {
    return true;
  }
  const captcha = c.getFieldValue(m, 'captcha');
  // captcha required and missing
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
 * @param {Flow} flow Which flow the captcha is being rendered in.
 * @param {boolean} wasInvalid A boolean indicating if the previous captcha was invalid.
 * @param {Function} [next] A callback.
 */
export function swapCaptcha(id, flow, wasInvalid, next) {
  if (flow === Flow.PASSWORD_RESET) {
    return webApi.getPasswordResetChallenge(id, (err, newCaptcha) => {
      if (!err && newCaptcha) {
        swap(updateEntity, 'lock', id, l.setPasswordResetCaptcha, newCaptcha, wasInvalid);
      }
      if (next) {
        next();
      }
    });
  } else if (flow === Flow.PASSWORDLESS) {
    return webApi.getPasswordlessChallenge(id, (err, newCaptcha) => {
      if (!err && newCaptcha) {
        swap(updateEntity, 'lock', id, l.setPasswordlessCaptcha, newCaptcha, wasInvalid);
      }
      if (next) {
        next();
      }
    });
  } else {
    return webApi.getChallenge(id, (err, newCaptcha) => {
      if (!err && newCaptcha) {
        swap(updateEntity, 'lock', id, l.setCaptcha, newCaptcha, wasInvalid);
      }
      if (next) {
        next();
      }
    });
  }
}
