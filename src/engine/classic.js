import Base from '../index';
import Login from './classic/login';
import SignUp from './classic/sign_up_screen';
import ResetPassword from '../connection/database/reset_password';
import { renderSSOScreens } from '../core/sso/index';
import {
  additionalSignUpFields,
  authWithUsername,
  databaseUsernameValue,
  defaultDatabaseConnection,
  defaultDatabaseConnectionName,
  getScreen,
  hasInitialScreen,
  hasScreen,
  initDatabase,
  overrideDatabaseOptions
} from '../connection/database/index';
import {
  defaultEnterpriseConnection,
  defaultEnterpriseConnectionName,
  initEnterprise,
  isEnterpriseDomain,
  isHRDActive,
  isInCorpNetwork,
  quickAuthConnection
} from '../connection/enterprise';
import { initSocial, useBigButtons } from '../connection/social/index';
import { setEmail } from '../field/email';
import { setUsername } from '../field/username';
import * as l from '../core/index';
import KerberosScreen from '../connection/enterprise/kerberos_screen';
import HRDScreen from '../connection/enterprise/hrd_screen';
import EnterpriseQuickAuthScreen from '../connection/enterprise/quick_auth_screen';
import { hasSkippedQuickAuth } from '../quick_auth';
import { lastUsedConnection } from '../core/sso/index';
import LoadingScreen from '../core/loading_screen';
import ErrorScreen from '../core/error_screen';
import LastLoginScreen from '../core/sso/last_login_screen';
import { hasError, isDone, isSuccess } from '../sync';
import { getFieldValue } from '../field/index';
import { swap, updateEntity } from '../store/index';

export function isSSOEnabled(m) {
  return isEnterpriseDomain(m, databaseUsernameValue(m));
}

export function usernameStyle(m) {
  return authWithUsername(m) && !isADEnabled(m) ? "username" : "email";
}

export function hasOnlyClassicConnections(m, type = undefined, ...strategies) {
  return l.hasOnlyConnections(m, type, ...strategies)
    && !l.hasSomeConnections(m, "passwordless");
}

export function useBigSocialButtons(m) {
  return useBigButtons(m, hasOnlyClassicConnections(m, "social") ? 5 : 3);
}

function validateAllowedConnections(m) {
  const anyDBConnection = l.hasSomeConnections(m, "database");
  const anySocialConnection = l.hasSomeConnections(m, "social");
  const anyEnterpriseConnection = l.hasSomeConnections(m, "enterprise");

  if (!anyDBConnection && !anySocialConnection && !anyEnterpriseConnection) {
    const error = new Error("At least one database, enterprise or social connection needs to be available.");
    error.code = "no_connection";
    m = l.stop(m, error);
  } else if (!anyDBConnection && hasInitialScreen(m, "forgotPassword")) {
    const error = new Error("The `initialScreen` option was set to \"forgotPassword\" but no database connection is available.");
    error.code = "unavailable_initial_screen";
    m = l.stop(m, error);
  } else if (!anyDBConnection && !anySocialConnection && hasInitialScreen(m, "signUp")) {
    const error = new Error("The `initialScreen` option was set to \"signUp\" but no database or social connection is available.");
    error.code = "unavailable_initial_screen";
    m = l.stop(m, error);
  }

  if (defaultDatabaseConnectionName(m) && !defaultDatabaseConnection(m)) {
    l.warn(m, `The provided default database connection "${defaultDatabaseConnectionName(m)}" is not enabled.`);
  }

  if (defaultEnterpriseConnectionName(m) && !defaultEnterpriseConnection(m)) {
    l.warn(m, `The provided default enterprise connection "${defaultEnterpriseConnectionName(m)}" is not enabled or does not allow email/password authentication.`);
  }

  return m;
}

class Classic {

  static SCREENS = {
    login: Login,
    forgotPassword: ResetPassword,
    signUp: SignUp
  };

  didInitialize(model, options) {
    model = initSocial(model, options);
    model = initDatabase(model, options);
    model = initEnterprise(model, options);

    const { email, username } = options.prefill || {};
    if (typeof email === "string") model = setEmail(model, email);
    if (typeof username === "string") model = setUsername(model, username);

    return model;
  }

  didReceiveClientSettings(m) {
    return validateAllowedConnections(m);
  }

  willShow(m, opts) {
    m = overrideDatabaseOptions(m, opts);
    if (isSuccess(m, "client")) {
      m = validateAllowedConnections(m);
    }
    return m;
  }

  render(m) {
    // TODO: remove the detail about the loading pane being pinned,
    // sticky screens should be handled at the box module.
    if (!isDone(m) || m.get("isLoadingPanePinned")) {
      return new LoadingScreen();
    }

    if (l.hasStopped(m)) {
      return new ErrorScreen();
    }

    if (hasScreen(m, "login")) {
      if (!hasSkippedQuickAuth(m)
           && l.ui.rememberLastLogin(m)
           && hasInitialScreen(m, "login")) {
        if (isInCorpNetwork(m)) {
          return new KerberosScreen();
        }

        const conn = lastUsedConnection(m);
        if (conn && isSuccess(m, "sso")) {
          if (l.hasConnection(m, conn.get("name"))) {
            return new LastLoginScreen();
          }
        }
      }

      if (quickAuthConnection(m)) {
        return new EnterpriseQuickAuthScreen();
      }

      if (isHRDActive(m)) {
        return new HRDScreen();
      }
    }

    const Screen = Classic.SCREENS[getScreen(m)];
    if (Screen) return new Screen();

    setTimeout(() => {
      const stopError = new Error("Internal error");
      stopError.code = "internal_error";
      stopError.description = `Couldn't find a screen "${getScreen(m)}"`;
      swap(updateEntity, "lock", l.id(m), l.stop, stopError);
    }, 0);

    return new ErrorScreen();
  }

}

export default new Classic();
