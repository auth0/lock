import Base from '../index';
import Login from './automatic/login';
import SignUp from './automatic/sign_up_screen';
import ResetPassword from '../database/reset_password';
import { renderSSOScreens } from '../core/sso/index';
import { getScreen, initDatabase } from '../database/index';
import {
  initEnterprise,
  isHRDActive,
  isInCorpNetwork,
  isSingleHRDConnection
} from '../connection/enterprise';
import { initSocial } from '../social/index';
import { setEmail } from '../field/email';
import { setUsername } from '../field/username';
import * as l from '../core/index';
import KerberosScreen from '../connection/enterprise/kerberos_screen';
import HRDScreen from '../connection/enterprise/hrd_screen';
import { hasSkippedQuickAuth } from '../quick_auth';

export default class Auth0Lock extends Base {

  static SCREENS = {
    login: Login,
    forgotPassword: ResetPassword,
    signUp: SignUp
  };

  constructor(...args) {
    super("classic", dict, ...args);
  }

  didInitialize(model, options) {
    model = initSocial(model, options);
    model = initDatabase(model, options);
    model = initEnterprise(model, options);

    const { email, username } = options.prefill || {};
    if (typeof email === "string") model = setEmail(model, email);
    if (typeof username === "string") model = setUsername(model, username);

    this.setModel(model);
  }

  didReceiveClientSettings(m) {
    const anyDBConnection = l.getEnabledConnections(m, "database").count() > 0;
    const anySocialConnection = l.getEnabledConnections(m, "social").count() > 0;
    const anyEnterpriseConnection = l.getEnabledConnections(m, "enterprise").count() > 0;

    if (!anyDBConnection && !anySocialConnection && !anyEnterpriseConnection) {
      // TODO: improve message
      throw new Error("At least one database, enterprise or social connection needs to be available.");
    }
  }

  render(m) {
    const ssoScreen = renderSSOScreens(m);
    if (ssoScreen) return ssoScreen;

    if (isInCorpNetwork(m) && !hasSkippedQuickAuth(m)) {
      return new KerberosScreen();
    }

    if (isHRDActive(m) || isSingleHRDConnection(m)) {
      return new HRDScreen();
    }

    const Screen = Auth0Lock.SCREENS[getScreen(m)];
    if (Screen) return new Screen();

    throw new Error("unknown screen");
  }

}

const dict = {
  forgotPassword: {
    emailInputPlaceholder: "yours@example.com",
    footerText: "",
    headerText: "Please enter your email and the new password. We will send you an email to confirm the password change.",
    usernameInputPlaceholder: "your username"
  },
  hrd: {
    headerText: "Please enter your coorporate credentials at {domain}.",
    passwordInputPlaceholder: "your password",
    usernameInputPlaceholder: "your username"
  },
  kerberos: {
    headerText: "You are connected from your corporate network&hellip;",
    skipLastLoginLabel: "Not your account?"
  },

  lastLogin: {
    headerText: "Last time you logged in with",
    skipLastLoginLabel: "Not your account?"
  },
  login: {
    emailInputPlaceholder: "yours@example.com",
    footerText: "",
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
    footerText: "",
    headerText: "",
    loginTabLabel: "Login",
    passwordInputPlaceholder: "your password",
    separatorText: "or",
    signUpTabLabel: "Sign Up",
    signUpWith: "Sign up with {idp}",
    usernameInputPlaceholder: "your username",
  },
  signedIn: {
    success: "Thanks for signing in."
  },
  signedUp: {
    success: "Thanks for signing up."
  }
};
