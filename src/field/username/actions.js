import { swap, updateEntity } from '../../store/index';
import * as c from '../index';

export function changeUsername(id, str) {
  swap(updateEntity, "lock", id, c.setUsername, str);
}
