import Base from '../index';
import Login from './automatic/login';
import SignUp from './automatic/sign_up_screen';
import ResetPassword from '../connection/database/reset_password';
import { renderSSOScreens } from '../core/sso/index';
import {
  additionalSignUpFields,
  authWithUsername,
  defaultDatabaseConnection,
  defaultDatabaseConnectionName,
  getScreen,
  hasScreen,
  initDatabase
} from '../connection/database/index';
import {
  defaultEnterpriseConnection,
  defaultEnterpriseConnectionName,
  initEnterprise,
  isADEnabled,
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
import * as c from '../field/index';
import { swap, updateEntity } from '../store/index';

export function isSSOEnabled(m) {
  return isEnterpriseDomain(
    m,
    usernameStyle(m) === "username"  ? c.username(m) : c.email(m)
  );
}

export function usernameStyle(m) {
  return authWithUsername(m) && !isADEnabled(m) ? "username" : "email";
}

export function hasOnlyClassicConnections(m, type = undefined, ...strategies) {
  return l.hasOnlyConnections(m, type, ...strategies)
    && !l.hasSomeConnections(m, "passwordless");
}

export function useBigSocialButtons(m) {
  const limit = l.hasOnlyConnections(m, "social") ? 5 : 3;
  const notFound = l.connections(m, "social").count() <= limit;
  return useBigButtons(m, notFound);
}

class Automatic {

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

    swap(updateEntity, "lock", l.id(model), _ => model);
  }

  didReceiveClientSettings(m) {
    const anyDBConnection = l.hasSomeConnections(m, "database");
    const anySocialConnection = l.hasSomeConnections(m, "social");
    const anyEnterpriseConnection = l.hasSomeConnections(m, "enterprise");

    if (!anyDBConnection && !anySocialConnection && !anyEnterpriseConnection) {
      // TODO: improve message
      throw new Error("At least one database, enterprise or social connection needs to be available.");
    }

    if (defaultDatabaseConnectionName(m) && !defaultDatabaseConnection(m)) {
      l.warn(m, `The provided default database connection "${defaultDatabaseConnectionName(m)}" is not enabled.`);
    }

    if (defaultEnterpriseConnectionName(m) && !defaultEnterpriseConnection(m)) {
      l.warn(m, `The provided default enterprise connection "${defaultEnterpriseConnectionName(m)}" is not enabled or does not allow email/password authentication.`);
    }
  }

  render(m) {
    // TODO: remove the detail about the loading pane being pinned,
    // sticky screens should be handled at the box module.
    if ((!isDone(m) && !hasError(m, ["sso"])) || m.get("isLoadingPanePinned")) {
      return new LoadingScreen();
    }

    const anyDBConnection = l.hasSomeConnections(m, "database");
    const anySocialConnection = l.hasSomeConnections(m, "social");
    const anyEnterpriseConnection = l.hasSomeConnections(m, "enterprise");
    const noConnection = !anyDBConnection && !anySocialConnection && !anyEnterpriseConnection;

    if (l.hasStopped(m) || hasError(m, ["sso"]) || noConnection) {
      return new ErrorScreen();
    }

    if (hasScreen(m, "login")) {
      if (!hasSkippedQuickAuth(m) && l.ui.rememberLastLogin(m)) {
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

    const Screen = Automatic.SCREENS[getScreen(m)];
    if (Screen) return new Screen();

    l.error(m, "At least one screen (\"login\", \"signUp\" or \"forgotPassword\") needs to be allowed.");
    return new ErrorScreen();
  }

}

export default new Automatic();
