import { Map } from 'immutable';
import LastLoginScreen from './last_login_screen';
import LoadingScreen from '../loading_screen';
import { findConnection } from '../index';

export function renderSSOScreens(m) {
  if (!m.has("sso")) return new LoadingScreen();

  const { name, strategy } =
    m.getIn(["sso", "lastUsedConnection"], Map()).toJS();
  const skipped = m.getIn(["sso", "skipped"], false);

  return !skipped && findConnection(m, strategy, name)
    ? new LastLoginScreen()
    : null;
}
