import { swap, updateEntity } from '../../store/index';
import { setField } from '../index';
import { validatePassword } from '../../utils/validation_utils';

export function changePassword(id, str, policy) {
  swap(updateEntity, "lock", id, setField, "password", str, validatePassword, policy);
}
