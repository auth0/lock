import { getEntity, read } from './store/index';

export function id(model) {
  return model.get("id");
}

export function readModel(id) {
  return read(getEntity, "lock", id);
}
