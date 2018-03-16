import { skipQuickAuth as skip } from '../quick_auth';
import { getEntity, read, swap, updateEntity } from '../store/index';
import { logIn as coreLogIn, checkSession as coreCheckSession } from '../core/actions';
import * as l from '../core/index';

export function skipQuickAuth(id) {
  swap(updateEntity, 'lock', id, skip, true);
}

export function logIn(id, connection, loginHint, prompt) {
  const m = read(getEntity, 'lock', id);
  const connectionScopes = l.auth.connectionScopes(m);
  const scopes = connectionScopes.get(connection.get('name'));
  const params = {
    connection: connection.get('name'),
    connection_scope: scopes ? scopes.toJS() : undefined
  };
  if (!l.auth.redirect(m) && connection.get('strategy') === 'facebook') {
    params.display = 'popup';
  }
  if (loginHint) {
    params.login_hint = loginHint;
  }
  if (prompt) {
    params.prompt = prompt;
  }
  coreLogIn(id, [], params);
}

export function checkSession(id, connection, loginHint) {
  const m = read(getEntity, 'lock', id);
  if (l.auth.responseType(m).indexOf('code') >= 0) {
    // we need to force a redirect in this case
    // so we use login with prompt=none
    return logIn(id, connection, loginHint, 'none');
  } else {
    const connectionScopes = l.auth.connectionScopes(m);
    const scopes = connectionScopes.get(connection.get('name'));
    const params = {
      ...l.auth.params(m).toJS(),
      connection: connection.get('name')
    };

    coreCheckSession(id, params);
  }
}
