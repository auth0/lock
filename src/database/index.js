import Immutable, { List, Map } from 'immutable';
import * as l from '../core/index';
import * as client from '../core/client/index';
import { clearFields, setField } from '../field/index';
import { dataFns } from '../utils/data_utils';

const { get, initNS, tget, tset } = dataFns(["database"]);

export function initDatabase(m, options) {
  m = initNS(m, Immutable.fromJS(processDatabaseOptions(options)));
  additionalSignUpFields(m).forEach(x => m = setField(m, x.get("name"), "", x.get("validator")));
  return m;
}

function processDatabaseOptions(options) {
  let {
    additionalSignUpFields,
    allowForgotPassword,
    allowSignUp,
    forgotPasswordLink,
    initialScreen,
    loginAfterSignUp,
    signUpLink,
    usernameStyle
  } = options;

  // TODO: add a warning if it is not "username" or "email", leave it
  // undefined, and change accesor fn.
  usernameStyle = usernameStyle === "username" ? "username" : "email";

  let screens = ["login", "signUp", "forgotPassword"];

  if (initialScreen != undefined
      && (typeof initialScreen != "string" || screens.indexOf(initialScreen) === -1)) {
    l.warn(options, "The `initialScreen` option will be ignored, because it is not one of the following allowed strings \"login\", \"signUp\", \"forgotPassword\".");
    initialScreen = undefined;
  }

  if (allowForgotPassword !== undefined && typeof allowForgotPassword != "boolean") {
    l.warn(options, "The `allowForgotPassword` option will be ignored, because it is not a booelan.");
  } else if (allowForgotPassword === false) {
    screens = screens.filter(x => x != "forgotPassword");
  }

  if (allowSignUp !== undefined && typeof allowSignUp != "boolean") {
    l.warn(options, "The `allowSignUp` option will be ignored, because it is not a booelan.");
  } else if (allowSignUp === false) {
    screens = screens.filter(x => x != "signUp");
  }

  if (forgotPasswordLink != undefined && typeof forgotPasswordLink != "string") {
    l.warn(options, "The `forgotPasswordLink` option will be ignored, because it is not a string");
    forgotPasswordLink = undefined;
  }

  if (signUpLink != undefined && typeof signUpLink != "string") {
    l.warn(options, "The `signUpLink` option will be ignored, because it is not a string");
    signUpLink = undefined;
  }


  if (additionalSignUpFields && !Array.isArray(additionalSignUpFields)) {
    l.warn(options, "The `additionalSignUpFields` option will be ignored, because it is not an array");
    additionalSignUpFields = undefined;
  } else if (additionalSignUpFields) {
    additionalSignUpFields = new Immutable.fromJS(additionalSignUpFields);
    // TODO: emit warnings for invalid fields
    // TODO: improve validation
    additionalSignUpFields = additionalSignUpFields.filter(x => {
      const reservedNames = ["email", "username", "password"];
      return typeof x.get("name") === "string"
        && x.get("name").match(/^[a-zA-Z0-9_]+$/)
        && reservedNames.indexOf(x.get("name")) === -1
        && typeof x.get("placeholder") === "string"
        && x.get("placeholder").length > 0
        && (typeof x.get("validator") === "undefined" || typeof x.get("validator") === "function");
    });
  }


  // TODO: add a warning if it is not a boolean, leave it undefined,
  // and change accesor fn.
  loginAfterSignUp = loginAfterSignUp === false ? false : true;

  return Map({
    additionalSignUpFields,
    forgotPasswordLink,
    initialScreen,
    loginAfterSignUp,
    screens,
    signUpLink,
    usernameStyle
  }).filter(x => typeof x !== "undefined").toJS();
}

export function databaseConnection(m) {
  return l.connections(m, "database").get(0, Map());
}

export function databaseConnectionName(m) {
  return databaseConnection(m).get("name");
}

export function forgotPasswordLink(m, notFound="") {
  return get(m, "forgotPasswordLink", notFound);
}

export function signUpLink(m, notFound="") {
  return get(m, "signUpLink", notFound);
}

export function setScreen(m, name, fields = []) {
  // TODO: the lock/index module should provide a way to clear
  // everything that needs the be cleared when changing screens, other
  // modules should not care.
  m = l.clearGlobalError(m);
  m = l.clearGlobalSuccess(m);
  m = clearFields(m, fields);

  return tset(m, "screen", name);
}

export function getScreen(m) {
  const initialScreen = get(m, "initialScreen");
  return tget(
    m,
    "screen",
    hasScreen(m, initialScreen) ? initialScreen : "login"
  );
}

export function authWithUsername(m) {
  const { requires_username } = databaseConnection(m).toJS();
  return requires_username || get(m, "usernameStyle") === "username";
}

export function hasScreen(m, s) {
  const { showForgot, showSignup } = databaseConnection(m).toJS();

  return !(showForgot === false && s === "forgotPassword")
    && !(showSignup === false && s === "signUp")
    && get(m, "screens").contains(s);
}

export function shouldAutoLogin(m) {
  return get(m, "loginAfterSignUp");
}

export function passwordStrengthPolicy(m) {
  return databaseConnection(m).get("passwordPolicy", "none");
}

export function additionalSignUpFields(m) {
  return get(m, "additionalSignUpFields", List());
}
