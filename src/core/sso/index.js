import { Map } from 'immutable';
import LastLoginScreen from './last_login_screen';
import LoadingScreen from '../loading_screen';
import { ui, hasConnection } from '../index';
import { hasSkippedQuickAuth } from '../../quick_auth';

export function renderSSOScreens(m) {
  // TODO: loading pin check belongs here?
  if (m.getIn(["sso", "syncStatus"], "loading") === "loading" || m.get("isLoadingPanePinned")) {
    return new LoadingScreen();
  }

  if (m.getIn(["sso", "syncStatus"]) == "error" || !ui.rememberLastLogin(m)) {
    return null;
  }

  const { name, strategy } = lastUsedConnection(m).toJS();

  return !hasSkippedQuickAuth(m) && hasConnection(m, name)
    ? new LastLoginScreen()
    : null;
}

export function lastUsedConnection(m) {
  // { name, strategy }
  return m.getIn(["sso", "lastUsedConnection"], Map());
}

export function lastUsedUsername(m) {
  return m.getIn(["sso", "lastUsedUsername"], "");
}
