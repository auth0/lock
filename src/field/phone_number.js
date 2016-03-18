import { setField } from './index';

export function validatePhoneNumber(str) {
  const regExp = /^[0-9]([0-9 -])*[0-9]$/;
  return regExp.test(str);
}

export function setPhoneNumber(m, str) {
  return setField(m, "phoneNumber", str, validatePhoneNumber);
}
