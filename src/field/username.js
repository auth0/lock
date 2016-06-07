import { setField } from './index';
import trim from 'trim';

const regExp = /^[a-zA-Z0-9_]{1,15}$/;

function validateUsername(str) {
  const result = regExp.exec(trim(str.toLowerCase()));
  return result && result[0];
}

export function setUsername(m, str, validateFormat = true) {
  const validator = validateFormat
    ? validateUsername
    : undefined;

  return setField(m, "username", str, validator);
}
