import { swap, updateEntity } from '../store/index';
import { setField } from './index';

export function changeField(id, name, value, validationFn, ...validationExtraArgs) {
  swap(updateEntity, "lock", id, setField, name, value, validationFn, ...validationExtraArgs);
}
