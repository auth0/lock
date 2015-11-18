import { Map } from 'immutable';
import trim from 'trim';
import * as cc from './country_codes';


function valid(lock, field) {
  return lock.getIn(["cred", field, "valid"]);
}

function showInvalid(lock, cred) {
  return lock.getIn(["cred", cred, "showInvalid"], false);
}

function setShowInvalid(lock, cred, value) {
  return lock.setIn(["cred", cred, "showInvalid"], value);
}

function visiblyInvalid(lock, cred) {
  return showInvalid(lock, cred) && !valid(lock, cred);
}

// phone number

export function fullPhoneNumber(lock) {
  return `${phoneDialingCode(lock) || ""}${phoneNumber(lock) || ""}`.replace(/[\s-]+/g, '');
}

export function fullHumanPhoneNumber(m) {
  const code = phoneDialingCode(m);
  const number = phoneNumber(m);
  return `${code} ${number}`;
}

export function setPhoneLocation(m, value) {
  return m.setIn(["cred", "phoneNumber", "location"], value);
}

function phoneLocation(m) {
  return m.getIn(["cred", "phoneNumber", "location"], cc.defaultLocation);
}

export function phoneLocationString(m) {
  return cc.locationString(phoneLocation(m));
}

export function phoneDialingCode(m) {
  return cc.dialingCode(phoneLocation(m));
}

export function phoneIsoCode(m) {
  return cc.isoCode(phoneLocation(m));
}

export function phoneNumber(lock) {
  return lock.getIn(["cred", "phoneNumber", "number"], "");
}

export function setPhoneNumber(lock, value) {
  const prevValue = phoneNumber(lock);
  const prevShowInvalid = showInvalid(lock, "phoneNumber");
  const valid = validatePhoneNumber(value);

  return lock.mergeIn(["cred", "phoneNumber"], Map({
    number: value,
    valid: valid,
    showInvalid: prevShowInvalid && prevValue === value
  }));
}

export function validatePhoneNumber(phoneNumber) {
  const regExp = /^[0-9]([0-9 -])*[0-9]$/;
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
  return lock.getIn(["cred", "email", "email"], "");
}

export function setEmail(lock, value) {
  const prevValue = email(lock);
  const prevShowInvalid = showInvalid(lock, "email");
  const valid = !!validateEmail(value);

  return lock.mergeIn(["cred", "email"], Map({
    email: value,
    valid: valid,
    showInvalid: prevShowInvalid && prevValue === value
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

// vcode

export function vcode(lock) {
  return lock.getIn(["cred", "vcode", "vcode"], "");
}

export function setVcode(lock, value) {
  const prevValue = vcode(lock);
  const prevShowInvalid = showInvalid(lock, "vcode");
  const valid = validateVcode(value);

  return lock.mergeIn(["cred", "vcode"], Map({
    vcode: value,
    valid: valid,
    showInvalid: prevShowInvalid && prevValue === value
  }));
}

export function validateVcode(vcode) {
  return trim(vcode).length > 0;
}

export function validVcode(lock) {
  return valid(lock, "vcode");
}

export function visiblyInvalidVcode(lock) {
  return visiblyInvalid(lock, "vcode");
}

export function setShowInvalidVcode(lock, value = true) {
  return setShowInvalid(lock, "vcode", value);
}

// password

export function password(lock) {
  return lock.getIn(["cred", "password", "password"], "");
}

export function setPassword(lock, value) {
  const prevValue = password(lock);
  const prevShowInvalid = showInvalid(lock, "password");
  const valid = validateVcode(value);

  return lock.mergeIn(["cred", "password"], Map({
    password: value,
    valid: valid,
    showInvalid: prevShowInvalid && prevValue === value
  }));
}

export function validatePassword(password) {
  return trim(password).length > 0;
}

export function validPassword(lock) {
  return valid(lock, "password");
}

export function visiblyInvalidPassword(lock) {
  return visiblyInvalid(lock, "password");
}

export function setShowInvalidPassword(lock, value = true) {
  return setShowInvalid(lock, "password", value);
}

// username

export function username(lock) {
  return lock.getIn(["cred", "username", "username"], "");
}

export function setUsername(lock, value) {
  const prevValue = password(lock);
  const prevShowInvalid = showInvalid(lock, "username");
  const valid = validateUsername(value);

  return lock.mergeIn(["cred", "username"], Map({
    username: value,
    valid: valid,
    showInvalid: prevShowInvalid && prevValue === value
  }));
}

export function validateUsername(username) {
  return trim(username).length > 0;
}

export function validUsername(lock) {
  return valid(lock, "username");
}

export function visiblyInvalidUsername(lock) {
  return visiblyInvalid(lock, "username");
}

export function setShowInvalidUsername(lock, value = true) {
  return setShowInvalid(lock, "username", value);
}
