import { swap, updateEntity } from '../../store/index';
import * as c from '../index';

export function changeEmail(id, email) {
  swap(updateEntity, "lock", id, c.setEmail, email);
}
