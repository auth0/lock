import trim from 'trim';
import { setField } from './index';

export function validateEmail(str) {
  const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = regExp.exec(trim(str.toLowerCase()));
  return result && result[0];
}

export function setEmail(m, str) {
  return setField(m, "email", str, validateEmail);
}
