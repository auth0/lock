import * as l from '../lock/index';

export function reset(m) {
  // TODO clear corresponding fields
  return m;
}

export function close(m) {
  return reset(l.close(m));
}
