import { Map } from 'immutable';
import trim from 'trim';
import * as cc from './country_codes';

export function setField(m, field, value, validator = str => trim(str).length > 0, ...args) {
  const prevValue = m.getIn(["field", field, "value"]);
  const prevShowInvalid = m.getIn(["field", field, "showInvalid"], false);
  const valid = validator === null || !!validator(value, ...args);

  return m.mergeIn(["field", field], Map({
    value: value,
    valid: valid,
    showInvalid: prevShowInvalid && prevValue === value
  }));
}

export function isFieldValid(m, field) {
  return m.getIn(["field", field, "valid"]);
}

export function isFieldVisiblyInvalid(m, field) {
  return m.getIn(["field", field, "showInvalid"], false)
    && !m.getIn(["field", field, "valid"]);
}

export function setFieldShowInvalid(m, field, value) {
  return m.setIn(["field", field, "showInvalid"], value);
}

export function clearFields(m, fields) {
  let keyPaths;

  if (!fields || fields.length === 0) {
    keyPaths = ["field"];
  } else {
    keyPaths = fields.map(x => ["field", x]);
  }

 return keyPaths.reduce((r, v) => r.removeIn(v), m);
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
  return m.setIn(["field", "phoneNumber", "location"], value);
}

function phoneLocation(m) {
  return m.getIn(["field", "phoneNumber", "location"], cc.defaultLocation);
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
  return lock.getIn(["field", "phoneNumber", "value"], "");
}

// email

export function email(lock) {
  return lock.getIn(["field", "email", "value"], "");
}

// vcode

export function vcode(lock) {
  return lock.getIn(["field", "vcode", "value"], "");
}

// password

export function password(lock) {
  return lock.getIn(["field", "password", "value"], "");
}

// username

export function username(lock) {
  return lock.getIn(["field", "username", "value"], "");
}
