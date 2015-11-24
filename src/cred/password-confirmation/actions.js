import { swap, updateEntity } from '../../store/index';
import * as c from '../index';

export function changePassword(id, str) {
  swap(updateEntity, "lock", id, m => {
    m = c.setPassword(m, str);
    return c.setPasswordConfirmation(m, c.passwordConfirmation(m));
  });
}

export function changePasswordConfirmation(id, str) {
  swap(updateEntity, "lock", id, c.setPasswordConfirmation, str);
}
