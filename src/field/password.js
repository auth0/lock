import PasswordPolicy from 'password-sheriff/lib/policy';
import { setField } from './index';

export function validatePassword(password, policy) {
  if (!password) {
    return false;
  }
  if (!policy) {
    return true;
  }
  return new PasswordPolicy(policy.toJS()).check(password);
}

export function setPassword(m, password, policy) {
  return setField(m, 'password', password, validatePassword, policy);
}

export function setShowPassword(m, checked) {
  return setField(m, 'showPassword', checked, () => true);
}
