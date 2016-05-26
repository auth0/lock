import { skipQuickAuth as skip } from '../quick_auth';
import { getEntity, read, swap, updateEntity } from '../store/index';
import { logIn as coreLogIn } from '../core/actions';
import * as l from '../core/index';

export function skipQuickAuth(id) {
  swap(updateEntity, "lock", id, skip, true);
}

export function logIn(id, connection, loginHint) {
  const m = read(getEntity, "lock", id);
  const params = {connection: connection.get("name")};
  if (!l.auth.redirect(m) && connection.get("strategy") === "facebook") {
    params.display = "popup";
  }
  if (connection.get("strategy") === "google-oauth2" && loginHint) {
    params.login_hint = loginHint;
  }
  coreLogIn(id, [], params);
}
