import { Set } from 'immutable';
import * as l from '../../core/index';
import { swap, updateEntity } from '../../store';
import * as captcha from '../captcha';
import React from 'react';

function isScriptAvailable(scriptUrl) {
  //check the window object
  if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
    return true;
  }
  //check the scripts element, it might be loading
  const allScripts = new Set(document.scripts);
  const exists = allScripts.some(s => s.src === scriptUrl);
  if (exists) {
    return true;
  }
  return false;
}

function injectGoogleCaptchaIfMissing(lock) {
  const lang = l.ui.language(lock);
  const scriptUrl = `https://www.google.com/recaptcha/api.js?hl=${lang}`;
  if (isScriptAvailable(scriptUrl)) {
    return;
  }
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.async = true;
  document.body.appendChild(script);
}

/**
 * waits until google recaptcha is ready and renders
 */
function renderElement(lock, el, prop) {
  if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') {
    return setTimeout(() => renderElement(lock, el, prop), 100);
  }

  const id = l.id(lock);
  try {
    grecaptcha.render(el, {
      callback: value => {
        swap(updateEntity, 'lock', id, captcha.set, value, false);
      },
      'expired-callback': () => {
        swap(updateEntity, 'lock', id, captcha.reset);
      },
      ...prop
    });
  } catch (err) {}
}

export function render(lock, element, properties) {
  if (!element || element.innerHTML !== '') {
    return;
  }

  injectGoogleCaptchaIfMissing(lock);

  renderElement(lock, element, properties);
}

export default ({ lock, siteKey }) => (
  <div
    style={{ transform: 'scale(0.86)', transformOrigin: '0 0', position: 'relative' }}
    className="auth0-lock-recaptchav2"
    ref={el => render(lock, el, { siteKey })}
  />
);
