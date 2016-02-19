import Immutable, { Map } from 'immutable';
import * as l from '../lock/index';
import * as client from '../lock/client/index';
import { clearCreds } from '../cred/index';

export function initDatabase(model, options) {
  return model.setIn(
    ["database", "opts"],
    Immutable.fromJS(processDatabaseOptions(options))
  );
}

function processDatabaseOptions(options) {
  let {
    disableResetAction,
    disableSignUpAction,
    initialScreen,
    loginAfterSignUp,
    resetLink,
    signUpLink,
    usernameStyle
   } = options;

  usernameStyle = usernameStyle === "username" ? "username" : "email";

  let screens = ["login", "signUp", "resetPassword"];

  if (initialScreen != undefined
      && (typeof initialScreen != "string" || screens.indexOf(initialScreen) === -1)) {
    l.warn(options, "The `initialScreen` option will be ignored, because it is not one of the following allowed strings \"login\", \"signUp\", \"resetPassword\".");
    initialScreen = undefined;
  }

  if (disableResetAction != undefined && typeof disableResetAction != "boolean") {
    l.warn(options, "The `disableResetAction` option will be ignored, because it is not a booelan.");
  } else if (disableResetAction) {
    screens = screens.filter(x => x != "resetPassword");
  }

  if (disableSignUpAction != undefined && typeof disableSignUpAction != "boolean") {
    l.warn(options, "The `disableSignUpAction` option will be ignored, because it is not a booelan.");
  } else if (disableSignUpAction) {
    screens = screens.filter(x => x != "signUp");
  }

  if (resetLink != undefined && typeof resetLink != "string") {
    l.warn(options, "The `resetLink` option will be ignored, because it is not a string");
    resetLink = undefined;
  }

  if (signUpLink != undefined && typeof signUpLink != "string") {
    l.warn(options, "The `signUpLink` option will be ignored, because it is not a string");
    signUpLink = undefined;
  }

  loginAfterSignUp = loginAfterSignUp === false ? false : true;

  return {
    initialScreen,
    loginAfterSignUp,
    resetLink,
    screens,
    signUpLink,
    usernameStyle
  };
}

export function databaseConnection(m) {
  return l.getEnabledConnections(m, "database").get(0, Map());
}

export function databaseConnectionName(m) {
  return databaseConnection(m).get("name");
}

export function resetLink(m, notFound="") {
  return m.getIn(["database", "opts", "resetLink"], notFound);
}

export function signUpLink(m, notFound="") {
  return m.getIn(["database", "opts", "signUpLink"], notFound);
}

export function setScreen(m, name, creds = []) {
  // TODO: the lock/index module should provide a way to clear
  // everything that needs the be cleared when changing screens, other
  // modules should not care.
  m = l.clearGlobalError(m);
  m = l.clearGlobalSuccess(m);
  m = clearCreds(m, creds);

  return m.set("screen", name);
}

export function getScreen(m) {
  const initialScreen = m.getIn(["database", "opts", "initialScreen"]);
  return m.get("screen", hasScreen(m, initialScreen) ? initialScreen : "login");
}

export function authWithUsername(m) {
  return m.getIn(["database", "opts", "usernameStyle"]) === "username";
}

export function hasScreen(m, s) {
  const { showForgot, showSignup } = databaseConnection(m).toJS();

  return !(showForgot === false && s === "resetPassword")
    && !(showSignup === false && s === "signUp")
    && m.getIn(["database", "opts", "screens"]).contains(s);
}

export function shouldAutoLogin(m) {
  return m.getIn(["database", "opts", "loginAfterSignUp"]);
}

export function passwordStrengthPolicy(m) {
  return databaseConnection(m).get("passwordPolicy", "none");
}
