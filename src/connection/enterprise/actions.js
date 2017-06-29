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

const throwIfOidcIsEnabledAndConnectionIsADAndHasUsername = (m, connection, hasUsername) => {
  const isOIDC = l.oidcConformant(m);
  const isAD = ['ad', 'adfs', 'office365', 'waad'].indexOf(connection.get('strategy')) >= 0;
  if (isOIDC && isAD && hasUsername) {
    throw new Error(
      'This connection does not support cross origin authentication. Please disable OIDC.'
    );
  }
};

export function logIn(id) {
  const m = read(getEntity, 'lock', id);
  const email = getFieldValue(m, databaseLogInWithEmail(m) ? 'email' : 'username');
  const ssoConnection = matchConnection(m, email);

  if (ssoConnection && !isHRDActive(m)) {
    return logInSSO(id, ssoConnection);
  }

  logInActiveFlow(id);
}

function logInActiveFlow(id) {
  const m = read(getEntity, 'lock', id);
  const usernameField = isHRDActive(m) || !databaseLogInWithEmail(m) ? 'username' : 'email';

  const originalUsername = getFieldValue(m, usernameField);
  const connection = enterpriseActiveFlowConnection(m);

  const username = l.defaultADUsernameFromEmailPrefix(m)
    ? emailLocalPart(originalUsername)
    : originalUsername;

  throwIfOidcIsEnabledAndConnectionIsADAndHasUsername(m, connection, !!username);

  coreLogIn(id, ['password', usernameField], {
    connection: connection ? connection.get('name') : null,
    username: username,
    password: getFieldValue(m, 'password'),
    login_hint: username
  });
}

function logInSSO(id, connection) {
  const m = read(getEntity, 'lock', id);
  const field = databaseLogInWithEmail(m) ? 'email' : 'username';
  coreLogIn(id, [field], {
    connection: connection.get('name'),
    login_hint: getFieldValue(m, field)
  });
}
