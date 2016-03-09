import trim from 'trim';
import createPolicy from 'password-sheriff';

export function validateEmail(str) {
  const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = regExp.exec(trim(str.toLowerCase()));
  return result && result[0];
}

export function validateNotEmptyString(str) {
  return trim(str).length > 0;
}

export function validatePassword(password, policy) {
  return createPolicy(policy).check(password);
}

export function validatePhoneNumber(str) {
  const regExp = /^[0-9]([0-9 -])*[0-9]$/;
  return regExp.test(str);
}
