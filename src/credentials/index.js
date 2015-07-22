import { Map } from 'immutable';
import trim from 'trim';


function valid(lock, field) {
  return lock.getIn(["credentials", field, "valid"]);
}

function showError(lock, field) {
  return lock.getIn(["credentials", field, "showError"]);
}

function setShowError(lock, field) {
  return lock.setIn(["credentials", field, "showError"], true);
}
export function countryCode(lock) {
  return lock.getIn(["credentials", "phoneNumber", "countryCode"]);
}

export function setCountryCode(lock, countryCode) {
  return lock.setIn(["credentials", "phoneNumber", "countryCode"], countryCode);
}

export function phoneNumber(lock) {
  return lock.getIn(["credentials", "phoneNumber", "number"]);
}

export function fullPhoneNumber(lock) {
  return `${countryCode(lock)}${phoneNumber(lock)}`;
}

export function setPhoneNumber(lock, phoneNumber) {
  const valid = validatePhoneNumber(phoneNumber);
  return lock.mergeIn(["credentials", "phoneNumber"], Map({
    number: phoneNumber,
    valid: valid,
    showError: showError(lock, "phoneNumber") && !valid
  }));
}

export function validatePhoneNumber(phoneNumber) {
  const regExp = /^[0-9]{1,14}$/;
  return regExp.test(phoneNumber);
}

export function showPhoneNumberError(lock) {
  return showError(lock, "phoneNumber") && !validPhoneNumber(lock);
}

export function validPhoneNumber(lock) {
  return valid(lock, "phoneNumber");
}

export function setShowPhoneNumberError(lock) {
  return setShowError(lock, "phoneNumber");
}

export function validateEmail(email) {
  const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = regExp.exec(trim(email.toLowerCase()));
  return result && result[0];
}
