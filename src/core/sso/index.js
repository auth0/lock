import { Map } from 'immutable';

export function lastUsedConnection(m) {
  return m.getIn(['sso', 'lastUsedConnection']);
}

export function lastUsedUsername(m) {
  return m.getIn(['sso', 'lastUsedUsername'], '');
}
