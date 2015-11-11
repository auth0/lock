import { swap, updateEntity } from '../../store/index';
import * as c from '../index';

export function changePassword(id, str) {
  swap(updateEntity, "lock", id, c.setPassword, str);
}
