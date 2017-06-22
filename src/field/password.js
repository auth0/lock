import createPolicy from 'password-sheriff';
import { setField } from './index';

export function validatePassword(password, policy) {
  return createPolicy(policy).check(password);
}

export function setPassword(m, password, policy) {
  return setField(m, 'password', password, validatePassword, policy);
}

export function setShowPassword(m, checked) {
  return setField(m, 'showPassword', checked, () => true);
}
