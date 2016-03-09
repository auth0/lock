import { swap, updateEntity } from '../../store/index';
import * as c from '../index';

export function changeVcode(id, vcode) {
  swap(updateEntity, "lock", id, c.setVcode, vcode);
}
