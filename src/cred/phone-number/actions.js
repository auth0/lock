import { swap, updateEntity } from '../../store/index';
import * as c from '../index';

export function changePhoneNumber(id, phoneNumber) {
  swap(updateEntity, "lock", id, c.setPhoneNumber, phoneNumber);
}
