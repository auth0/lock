import { getEntity, read, swap, updateEntity } from '../../store/index';
import {
  enterpriseActiveFlowConnection,
  isHRDActive,
  matchConnection,
  toggleHRD
} from '../enterprise';
import { getFieldValue, hideInvalidFields } from '../../field/index';
import { emailLocalPart } from '../../field/email';
import { logIn as coreLogIn } from '../../core/actions';
import * as l from '../../core/index';
import { setCaptchaParams, showMissingCaptcha, swapCaptcha } from '../captcha';

// TODO: enterprise connections should not depend on database
// connections. However, we now allow a username input to contain also
// an email and this information is in the database module. We should
// make this information flow from the UI (like we do for the startHRD
// function). Including this dependency here allows us to do that
// incrementally.
import { databaseLogInWithEmail } from '../database/index';

export function startHRD(id, email) {
  swap(updateEntity, 'lock', id, toggleHRD, email);
}

export function cancelHRD(id) {
  swap(updateEntity, 'lock', id, m => {
    m = toggleHRD(m, false);
    m = hideInvalidFields(m);
    return m;
  });
}

function getConnectionScopesFrom(m, connection) {
  const connectionScopes = l.auth.connectionScopes(m);
  return connectionScopes.get(connection.get('name'));
}

export function logIn(id) {
  const m = read(getEntity, 'lock', id);
  const email = getFieldValue(m, databaseLogInWithEmail(m) ? 'email' : 'username');
  const ssoConnection = matchConnection(m, email);
  const enterpriseConnection = enterpriseActiveFlowConnection(m);
  const connectionScopes = getConnectionScopesFrom(m, ssoConnection || enterpriseConnection);
  const usernameField = databaseLogInWithEmail(m) ? 'email' : 'username';
  const fields = [usernameField, 'password'];

  const params = {
    connection_scope: connectionScopes ? connectionScopes.toJS() : undefined
  };

  if (ssoConnection && !isHRDActive(m)) {
    return logInSSO(id, ssoConnection, params);
  }

  const isCaptchaValid = setCaptchaParams(m, params, fields);

  if (!isCaptchaValid && !ssoConnection) {
    return showMissingCaptcha(m, id);
  }

  logInActiveFlow(id, params);
}

function logInActiveFlow(id, params) {
  const m = read(getEntity, 'lock', id);
  const usernameField = isHRDActive(m) || !databaseLogInWithEmail(m) ? 'username' : 'email';

  const originalUsername = getFieldValue(m, usernameField);
  const connection = enterpriseActiveFlowConnection(m);

  const username = l.defaultADUsernameFromEmailPrefix(m)
    ? emailLocalPart(originalUsername)
    : originalUsername;

  coreLogIn(
    id,
    ['password', usernameField],
    {
      ...params,
      connection: connection ? connection.get('name') : null,
      username: username,
      password: getFieldValue(m, 'password'),
      login_hint: username
    },
    (id, error, fields, next) => {
      const wasCaptchaInvalid = error && error.code === 'invalid captcha';
      swapCaptcha(id, wasCaptchaInvalid, next);
    }
  );
}

function logInSSO(id, connection, params) {
  const m = read(getEntity, 'lock', id);
  const field = databaseLogInWithEmail(m) ? 'email' : 'username';

  l.emitEvent(m, 'sso login', {
    lockID: id,
    connection: connection,
    field: field
  });

  coreLogIn(id, [field], {
    ...params,
    connection: connection.get('name'),
    login_hint: getFieldValue(m, field)
  });
}
