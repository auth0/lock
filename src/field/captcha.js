import { setField, setFieldShowInvalid, getFieldValue } from './index';

const onResetCallbacks = [];

export function validate(captcha) {
  return !!captcha;
}

export function set(m, captcha, wasInvalid) {
  m = setField(m, 'captcha', captcha, validate);
  if (wasInvalid) {
    m = setFieldShowInvalid(m, 'captcha', true);
  }
  return m;
}

export function reset(m, wasInvalid) {
  return set(m, '', wasInvalid);
}

export function getValue(m) {
  return getFieldValue(m, 'captcha');
}
