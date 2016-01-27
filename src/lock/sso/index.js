import { Map } from 'immutable';
import LastLoginScreen from './last_login_screen';
import LoadingScreen from '../loading_screen';
import { findConnection } from '../index';

export function renderSSOScreens(m) {
  // TODO: client and pinned checks don't belong here
  if (!m.has("sso") || !m.has("client") || m.get("isLoadingPanePinned")) {
    return new LoadingScreen();
  }

  const { name, strategy } = lastUsedConnection(m);
  const skipped = m.getIn(["sso", "skipped"], false);

  return !skipped && findConnection(m, strategy, name)
    ? new LastLoginScreen()
    : null;
}

export function lastUsedConnection(m) {
  // { name, strategy }
  return m.getIn(["sso", "lastUsedConnection"], Map()).toJS();
}

export function lastUsedUsername(m) {
  return m.getIn(["sso", "lastUsedUsername"], "");
}

export function skipSSOLogin(m) {
  return m.setIn(["sso", "skipped"], true);
}
