import { swap, updateEntity } from '../../store/index';
import * as c from '../index';

export function changePasswordConfirmation(id, str) {
  swap(updateEntity, "lock", id, c.setPasswordConfirmation, str);
}
