import { setField } from './index';
import { validateEmail } from './email';
import { databaseConnection } from '../connection/database';
import trim from 'trim';

const DEFAULT_VALIDATION = { mfa_code: { length: 6 } };
const regExp = /^[0-9]+$/;

function validateMFACode(str, settings = DEFAULT_VALIDATION.mfa_code) {
  const value = trim(str);

  // check min value matched
  if (value.length < settings.length) {
    return false;
  }

  // check max value matched
  if (value.length > settings.length) {
    return false;
  }

  // check allowed characters matched
  const result = regExp.exec(value);
  return result && result[0];
}

export function setMFACode(m, str) {
  return setField(m, 'mfa_code', str, validateMFACode);
}

export function getMFACodeValidation(m) {
  return DEFAULT_VALIDATION.mfa_code;
}
