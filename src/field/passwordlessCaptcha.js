import { setField, setFieldShowInvalid, getFieldValue } from './index';

function validate(captcha) {
  return !!captcha;
}

export function set(m, captcha, wasInvalid) {
  m = setField(m, 'passwordlessCaptcha', captcha, validate);
  if (wasInvalid) {
    m = setFieldShowInvalid(m, 'passwordlessCaptcha', true);
  }
  return m;
}

export function reset(m, wasInvalid) {
  return set(m, '', wasInvalid);
}

export function getValue(m) {
  return getFieldValue(m, 'passwordlessCaptcha');
}
