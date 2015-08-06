import { Map } from 'immutable';
import trim from 'trim';
import * as cc from './country_codes';


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
  return `${phoneDialingCode(lock) || ""}${phoneNumber(lock) || ""}`;
}

export function fullHumanPhoneNumber(m) {
  const code = phoneDialingCode(m);
  const number = phoneNumber(m);
  return `${code} ${number}`;
}


export function setPhoneLocation(m, value) {
  console.log(m.toJS());
  return m.setIn(["credentials", "phoneNumber", "location"], value);
}

function phoneLocation(m) {
  return m.getIn(["credentials", "phoneNumber", "location"], cc.defaultLocation);
}

export function phoneLocationString(m) {
  return cc.locationString(phoneLocation(m));
}

export function phoneDialingCode(m) {
  return cc.dialingCode(phoneLocation(m));
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
