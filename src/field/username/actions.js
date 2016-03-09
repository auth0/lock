import { swap, updateEntity } from '../../store/index';
import { setField } from '../index';
import { validateUsername } from '../../utils/validation_utils';

export function changeUsername(id, str) {
  swap(updateEntity, "lock", id, setField, "username", str, validateUsername);
}
