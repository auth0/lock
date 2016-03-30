import trim from 'trim';
import { setField } from './index';
import { endsWith } from '../utils/string_utils';

const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail(str) {
  const result = regExp.exec(trim(str.toLowerCase()));
  return result && result[0];
}

export function setEmail(m, str) {
  return setField(m, "email", str, validateEmail);
}

export function emailDomain(str) {
  const result = regExp.exec(trim(str.toLowerCase()));
  return result ? result.slice(-2)[0] : "";
}
