import { Map } from 'immutable';
import LastLoginScreen from './last_login_screen';
import LoadingScreen from '../loading_screen';
import { ui, isConnectionEnabled } from '../index';

export function renderSSOScreens(m) {
  // TODO: loading pin check belongs here?
  if (m.getIn(["sso", "syncStatus"]) != "ok" || m.get("isLoadingPanePinned")) {
    return new LoadingScreen();
  }

  if (!ui.rememberLastLogin(m)) return null;

  const { name, strategy } = lastUsedConnection(m);
  const skipped = m.getIn(["sso", "skipped"], false);

  return !skipped && isConnectionEnabled(m, name)
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
