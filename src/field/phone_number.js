import { getField, getFieldValue, setField } from './index';

export function validatePhoneNumber(str) {
  const regExp = /^[0-9]([0-9 -])*[0-9]$/;
  return regExp.test(str);
}

export function setPhoneNumber(m, str) {
  return setField(m, "phoneNumber", str, validatePhoneNumber);
}

export function phoneNumberWithDiallingCode(m) {
  return humanPhoneNumberWithDiallingCode(m).replace(/[\s-]+/g, '');
}

export function humanPhoneNumberWithDiallingCode(m) {
  const location = getField(m, "location");
  const code = location.get("diallingCode", "");
  const number = getFieldValue(m, "phoneNumber", "");
  return code ? `${code} ${number}` : number;
}
