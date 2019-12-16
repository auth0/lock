import { setField, setFieldShowInvalid } from './index';

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
