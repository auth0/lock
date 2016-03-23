import Base from './index';
import AskSocialNetworkOrLogin from './field/or/ask_social_network_or_login';
import SignUp from './classic/sign_up_screen';
import ResetPassword from './database/reset_password';
import { renderSSOScreens } from './lock/sso/index';
import { getScreen, initDatabase } from './database/index';
import { initSocial } from './social/index';
import { setEmail } from './field/email';
import { setUsername } from './field/username';
import * as l from './lock/index';

export default class Auth0Lock extends Base {

  static SCREENS = {
    login: AskSocialNetworkOrLogin,
    resetPassword: ResetPassword,
    signUp: SignUp
  };

  constructor(...args) {
    super("classic", dict, ...args);
  }

  didInitialize(model, options) {
    model = initSocial(model, options);
    model = initDatabase(model, options);

    const { email, username } = options.prefill || {};
    if (typeof email === "string") model = setEmail(model, email);
    if (typeof username === "string") model = setUsername(model, username);

    this.setModel(model);
  }

  didReceiveClientSettings(m) {
    const anyDBConnection = l.getEnabledConnections(m, "database").count() > 0;
    const anySocialConnection = l.getEnabledConnections(m, "social").count() > 0;

    if (!anyDBConnection && !anySocialConnection) {
      // TODO: improve message
      throw new Error("At least one database or social connection needs to be available.");
    }
  }

  render(m) {
    const ssoScreen = renderSSOScreens(m);
    if (ssoScreen) return ssoScreen;

    const Screen = Auth0Lock.SCREENS[getScreen(m)];
    if (Screen) return new Screen();

    throw new Error("unknown screen");
  }

}

const dict = {
  lastLogin: {
    headerText: "Last time you logged in with",
    skipLastLoginLabel: "Not your account?"
  },
  networkOrLogin: {
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
    usernameInputPlaceholder: "your username"
  },
  resetPassword: {
    emailInputPlaceholder: "yours@example.com",
    footerText: "",
    headerText: "Please enter your email and the new password. We will send you an email to confirm the password change.",
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
