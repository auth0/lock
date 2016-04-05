import { skipQuickAuth as skip } from '../quick_auth';
import { swap, updateEntity } from '../store/index';

export function skipQuickAuth(id) {
  swap(updateEntity, "lock", id, skip, true);
}
