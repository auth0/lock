import { swap, updateEntity } from '../../store/index';
import { setField } from '../index';
import { validateEmail } from '../../utils/validation_utils';

export function changeEmail(id, str) {
  swap(updateEntity, "lock", id, setField, "email", str, validateEmail);
}
