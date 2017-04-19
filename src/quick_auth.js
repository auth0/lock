import { dataFns } from './utils/data_utils';

const { tget, tset } = dataFns(['quickAuth']);

export function skipQuickAuth(m, b) {
  return tset(m, 'skipped', b);
}

export function hasSkippedQuickAuth(m) {
  return tget(m, 'skipped', false);
}
