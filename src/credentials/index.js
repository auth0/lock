import { Map } from 'immutable';
import trim from 'trim';


function valid(lock, field) {
  return lock.getIn(["credentials", field, "valid"]);
}

function showInvalid(lock, credential) {
  return lock.getIn(["credentials", credential, "showInvalid"]);
}

function setShowInvalid(lock, credential, value) {
  return lock.setIn(["credentials", credential, "showInvalid"], value);
}

function visiblyInvalid(lock, credential) {
  return showInvalid(lock, credential) && !valid(lock, credential);
}

// phone number

export function fullPhoneNumber(lock) {
  return `${countryCode(lock) || ""}${phoneNumber(lock) || ""}`;
}

export function countryCode(lock) {
  return lock.getIn(["credentials", "phoneNumber", "countryCode"], "");
}

export function setCountryCode(lock, countryCode) {
  return lock.setIn(["credentials", "phoneNumber", "countryCode"], countryCode);
}

export function phoneNumber(lock) {
  return lock.getIn(["credentials", "phoneNumber", "number"], "");
}

export function setPhoneNumber(lock, phoneNumber) {
  const valid = validatePhoneNumber(phoneNumber);
  return lock.mergeIn(["credentials", "phoneNumber"], Map({
    number: phoneNumber,
    valid: valid,
    showInvalid: !!showInvalid(lock, "phoneNumber") && !valid
  }));
}

export function validatePhoneNumber(phoneNumber) {
  const regExp = /^[0-9]{1,14}$/;
  return regExp.test(phoneNumber);
}

export function validPhoneNumber(lock) {
  return valid(lock, "phoneNumber");
}

export function visiblyInvalidPhoneNumber(lock) {
  return visiblyInvalid(lock, "phoneNumber");
}

export function setShowInvalidPhoneNumber(lock, value) {
  return setShowInvalid(lock, "phoneNumber", value);
}

// email

export function email(lock) {
  return lock.getIn(["credentials", "email", "email"], "");
}

export function setEmail(lock, email) {
  const valid = !!validateEmail(email);
  return lock.mergeIn(["credentials", "email"], Map({
    email: email,
    valid: valid,
    showInvalid: !!showInvalid(lock, "email") && !valid
  }));
}

export function validateEmail(email) {
  const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = regExp.exec(trim(email.toLowerCase()));
  return result && result[0];
}

export function validEmail(lock) {
  return valid(lock, "email");
}

export function visiblyInvalidEmail(lock) {
  return visiblyInvalid(lock, "email");
}

export function setShowInvalidEmail(lock, value = true) {
  return setShowInvalid(lock, "email", value);
}

// verification code

export function verificationCode(lock) {
  return lock.getIn(["credentials", "verificationCode", "verificationCode"], "");
}

export function setVerificationCode(lock, verificationCode) {
  const valid = validateVerificationCode(verificationCode);
  return lock.mergeIn(["credentials", "verificationCode"], Map({
    verificationCode: verificationCode,
    valid: valid,
    showInvalid: !!showInvalid(lock, "verificationCode") && !valid
  }));
}

export function validateVerificationCode(verificationCode) {
  return trim(verificationCode).length > 0;
}

export function validVerificationCode(lock) {
  return valid(lock, "verificationCode");
}

export function visiblyInvalidVerificationCode(lock) {
  return visiblyInvalid(lock, "verificationCode");
}

export function setShowInvalidVerificationCode(lock, value = true) {
  return setShowInvalid(lock, "verificationCode", value);
}

// password

export function validatePassword(password) {
  const result = trim(password);
  return result.length > 3 ? result : null;
}
