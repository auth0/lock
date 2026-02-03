import _isEmail from 'validator/lib/isEmail';

import { setField } from './index';
import { isHRDEmailValid } from '../connection/enterprise';
import * as i18n from '../i18n';

export function validateEmail(str, strictValidation = false) {
  return isEmail(str, strictValidation);
}

export function isEmail(str, strictValidation = false) {
  if (typeof str !== 'string') {
    return false;
  }
  const trimmed = str.trim();
  return strictValidation
    ? _isEmail(str)
    : trimmed.indexOf('@') >= 0 && trimmed.indexOf('.') >= 0 && trimmed.indexOf(' ') === -1;
}

export function setEmail(m, str, strictValidation = false) {
  return setField(m, 'email', str, str => {
    const validHRDEMail = isHRDEmailValid(m, str);

    return {
      valid: validateEmail(str, strictValidation) && validHRDEMail,
      hint: !validHRDEMail ? i18n.html(m, ['error', 'login', 'hrd.not_matching_email']) : undefined
    };
  });
}

export function emailDomain(str) {
  if (!isEmail(str)) {
    return '';
  }
  return str.split('@')[1].toLowerCase();
}

export function emailLocalPart(str) {
  const domain = emailDomain(str);
  return domain ? str.slice(0, -1 - domain.length) : str;
}
