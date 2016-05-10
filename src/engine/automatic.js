import Base from '../index';
import Login from './automatic/login';
import SignUp from './automatic/sign_up_screen';
import ResetPassword from '../connection/database/reset_password';
import { renderSSOScreens } from '../core/sso/index';
import {
  authWithUsername,
  defaultDatabaseConnection,
  defaultDatabaseConnectionName,
  getScreen,
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
import { initSocial } from '../connection/social/index';
import { setEmail } from '../field/email';
import { setUsername } from '../field/username';
import * as l from '../core/index';
import KerberosScreen from '../connection/enterprise/kerberos_screen';
import HRDScreen from '../connection/enterprise/hrd_screen';
import EnterpriseQuickAuthScreen from '../connection/enterprise/quick_auth_screen';
import { hasSkippedQuickAuth } from '../quick_auth';
import { lastUsedConnection } from '../core/sso/index';
import LoadingScreen from '../core/loading_screen';
import LastLoginScreen from '../core/sso/last_login_screen';
import { hasSyncStatus, isLoading, isSuccess } from '../remote_data';
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

class Automatic {

  static SCREENS = {
    login: Login,
    forgotPassword: ResetPassword,
    signUp: SignUp
  };

  constructor(...args) {
    this.dict = dict;
    this.mode = "classic";
  }

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
    // TODO: remove some details
    if (!hasSyncStatus(m, "sso") || isLoading(m, "sso") || m.get("isLoadingPanePinned")) {
      return new LoadingScreen();
    }

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

    const Screen = Automatic.SCREENS[getScreen(m)];
    if (Screen) return new Screen();

    throw new Error("unknown screen");
  }

}

const dict = {
  enterpriseQuickAuth: {
    headerText: "Login with your corporate credentials.",
    loginTo: "Login at {domain}"
  },
  forgotPassword: {
    emailInputPlaceholder: "yours@example.com",
    headerText: "Please enter your email address. We will send you an email to reset your password."
  },
  hrd: {
    headerText: "Please enter your coorporate credentials at {domain}.",
    passwordInputPlaceholder: "your password",
    usernameInputPlaceholder: "your username"
  },
  kerberos: {
    headerText: "You are connected from your corporate network&hellip;",
    buttonLabel: "Windows Authentication",
    skipLastLoginLabel: "Not your account?"
  },
  lastLogin: {
    headerText: "Last time you logged in with",
    skipLastLoginLabel: "Not your account?"
  },
  login: {
    emailInputPlaceholder: "yours@example.com",
    forgotPasswordLabel: "Don't remember your password?",
    headerText: "",
    loginTabLabel: "Login",
    loginWith: "Login with {idp}",
    passwordInputPlaceholder: "your password",
    separatorText: "or",
    signUpTabLabel: "Sign Up",
    smallSocialButtonsHeader: "Login with",
    ssoEnabled: "Single Sign-on enabled",
    usernameInputPlaceholder: "your username"
  },
  signUp: {
    emailInputPlaceholder: "yours@example.com",
    headerText: "",
    loginTabLabel: "Login",
    passwordInputPlaceholder: "your password",
    passwordStrength: {
      containsAtLeast: "Contain at least %d of the following %d types of characters:",
      identicalChars: "No more than %d identical characters in a row (e.g., \"%s\" not allowed)",
      nonEmpty: "Non-empty password required",
      numbers: "Numbers (i.e. 0-9)",
      lengthAtLeast: "At least %d characters in length",
      lowerCase: "Lower case letters (a-z)",
      shouldContain: "Should contain:",
      specialCharacters: "Special characters (e.g. !@#$%^&*)",
      upperCase: "Upper case letters (A-Z)"
    },
    separatorText: "or",
    signUpTabLabel: "Sign Up",
    signUpWith: "Sign up with {idp}",
    ssoEnabled: "Single Sign-on enabled",
    terms: "",
    usernameInputPlaceholder: "your username",
  },
  signedIn: {
    success: "Thanks for logging in."
  },
  signedUp: {
    success: "Thanks for signing up."
  }
};

export default new Automatic();
