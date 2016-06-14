import { getEntity, read, swap, updateEntity } from '../../store/index';
import {
  enterpriseConnection,
  isHRDActive,
  matchConnection,
  toggleHRD
} from '../enterprise';
import * as c from '../../field/index';
import { logIn as coreLogIn } from '../../core/actions';

export function startHRD(id, email) {
  swap(updateEntity, "lock", id, toggleHRD, email);
}

export function cancelHRD(id) {
  swap(updateEntity, "lock", id, toggleHRD, false);
}

export function logIn(id) {
  const m = read(getEntity, "lock", id);
  const email = c.email(m);
  const ssoConnection = matchConnection(m, email);

  if (ssoConnection && !isHRDActive(m)) {
    return logInSSO(id, ssoConnection);
  }

  logInActiveFlow(id);
}

function logInActiveFlow(id) {
  const m = read(getEntity, "lock", id);
  const usernameField = isHRDActive(m) ? "username" : "email";
  const username = c.getFieldValue(m, usernameField);

  coreLogIn(id, ["password", usernameField], {
    connection: enterpriseConnection(m).get("name"),
    username: username,
    password: c.getFieldValue(m, "password"),
    login_hint: username
  });
}

function logInSSO(id, connection) {
  const m = read(getEntity, "lock", id);

  coreLogIn(id, ["email"], {
    connection: connection.get("name"),
    login_hint: c.getFieldValue(m, "email")
  });
}
