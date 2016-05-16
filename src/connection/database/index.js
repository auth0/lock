import Immutable, { List, Map } from 'immutable';
import * as l from '../../core/index';
import * as client from '../../core/client/index';
import { clearFields, setField, setOptionField } from '../../field/index';
import { dataFns } from '../../utils/data_utils';

const { get, initNS, tget, tset } = dataFns(["database"]);

export function initDatabase(m, options) {
  m = initNS(m, Immutable.fromJS(processDatabaseOptions(options)));
  additionalSignUpFields(m).forEach(x => {
    m = x.get("type") === "select"
      ? setOptionField(m, x.get("name"), x.get("prefill"))
      : setField(m, x.get("name"), x.get("prefill", ""), x.get("validator"))
  });
  return m;
}

function processDatabaseOptions(opts) {
  let {
    additionalSignUpFields,
    allowForgotPassword,
    allowSignUp,
    defaultDatabaseConnection,
    forgotPasswordLink,
    initialScreen,
    loginAfterSignUp,
    mustAcceptTerms,
    signUpLink,
    usernameStyle
  } = opts;

  // TODO: add a warning if it is not "username" or "email", leave it
  // undefined, and change accesor fn.
  usernameStyle = usernameStyle === "username" ? "username" : "email";

  let screens = ["login", "signUp", "forgotPassword"];

  if (initialScreen != undefined
      && (typeof initialScreen != "string" || screens.indexOf(initialScreen) === -1)) {
    l.warn(opts, "The `initialScreen` option will be ignored, because it is not one of the following allowed strings \"login\", \"signUp\", \"forgotPassword\".");
    initialScreen = undefined;
  }

  if (allowForgotPassword !== undefined && typeof allowForgotPassword != "boolean") {
    l.warn(opts, "The `allowForgotPassword` option will be ignored, because it is not a booelan.");
  } else if (allowForgotPassword === false) {
    screens = screens.filter(x => x != "forgotPassword");
  }

  if (allowSignUp !== undefined && typeof allowSignUp != "boolean") {
    l.warn(opts, "The `allowSignUp` option will be ignored, because it is not a booelan.");
  } else if (allowSignUp === false) {
    screens = screens.filter(x => x != "signUp");
  }

  if (defaultDatabaseConnection != undefined && typeof defaultDatabaseConnection !== "string") {
    l.warn(opts, "The `defaultDatabaseConnection` option will be ignored, because it is not a string.");
    defaultDatabaseConnection = undefined;
  }

  if (forgotPasswordLink != undefined && typeof forgotPasswordLink != "string") {
    l.warn(opts, "The `forgotPasswordLink` option will be ignored, because it is not a string");
    forgotPasswordLink = undefined;
  }

  if (signUpLink != undefined && typeof signUpLink != "string") {
    l.warn(opts, "The `signUpLink` option will be ignored, because it is not a string");
    signUpLink = undefined;
  }

  if (mustAcceptTerms !== undefined && typeof mustAcceptTerms != "boolean") {
    l.warn(opts, "The `mustAcceptTerms` option will be ignored, because it is not a booelan.");
    mustAcceptTerms = undefined;
  }

  if (additionalSignUpFields && !Array.isArray(additionalSignUpFields)) {
    l.warn(opts, "The `additionalSignUpFields` option will be ignored, because it is not an array");
    additionalSignUpFields = undefined;
  } else if (additionalSignUpFields) {
    additionalSignUpFields = additionalSignUpFields.reduce((r, x) => {
      let { icon, name, options, placeholder, prefill, type, validator } = x;
      let filter = true;

      const reservedNames = ["email", "username", "password"];
      if (typeof name != "string" || !name.match(/^[a-zA-Z0-9_]+$/) || reservedNames.indexOf(name) > -1) {
        l.warn(opts, `A \`name\` property must be provided for every element of \`additionalSignUpFields\`. It must be a non-empty string consisting of letters, numbers and underscores. The following names are reserved, and therefore, cannot be used: ${reservedNames.join(", ")}.`);
        filter = false;
      }

      if (typeof placeholder != "string" || !placeholder) {
        l.warn(opts, "A `placeholder` property must be provided for every element of `additionalSignUpFields`. It must be a non-empty string.");
        filter = false;
      }

      if (icon != undefined && (typeof icon != "string" || !icon)) {
        l.warn(opts, "When provided, the `icon` property of an element of `additionalSignUpFields` must be a non-empty string.");
        icon = undefined;
      }

      if (prefill != undefined && (typeof prefill != "string" || !prefill)) {
        l.warn(opts, "When provided, the `prefill` property of an element of `additionalSignUpFields` must be a non-empty string.");
        prefill = undefined;
      }

      const types = ["select", "text"];
      if (type != undefined && (typeof type != "string" || types.indexOf(type) === -1)) {
        l.warn(opts, `When provided, the \`type\` property of an element of \`additionalSignUpFields\` must be one of the following strings: "${types.join("\", \"")}".`);
        type = undefined;
      }

      if (validator != undefined && type === "select") {
        l.warn(opts, "Elements of `additionalSignUpFields` with a \"select\" `type` cannot specify a `validator` function, all of its `options` are assumed to be valid.");
        validator = undefined;
      }

      if (validator != undefined && typeof validator != "function") {
        l.warn(opts, "When provided, the `validator` property of an element of `additionalSignUpFields` must be a function.");
        validator = undefined;
      }

      if (options != undefined && !global.Array.isArray(options)) {
        l.warn(opts, "When provided, the `options` property of an element of `additionalSignUpFields` must be an array.");
        options = undefined;
      }

      if (options != undefined) {
        let valid = true, hasPrefill = !prefill;

        options.forEach(x => {
          valid = valid
            && x.label && typeof x.label === "string"
            && x.value && typeof x.value === "string";

          if (!hasPrefill && x.value === prefill) {
            prefill = x;
            hasPrefill = true;
          }
        });

        if (!valid) {
          l.warn(opts, "When provided, the elements of the `options` property of the `additionalSignUpFields` must have the following format: {label: \"non-empty string\", value: \"non-empty string\"}");
          options = undefined;
        }

        if (!hasPrefill) {
          l.warn(opts, "The `options` of an element of `additionalSignUpFields` doesn't contain the provided `prefill` value");
        }
      }

      if (options != undefined && type != "select") {
        l.warn(opts, "The `options` property can only by provided for an element of `additionalSignUpFields` when its `type` equals to \"select\"");
        options = undefined;
      }

      if (type === "select" && options === undefined) {
        l.warn(opts, `When providing a \`type\` property in an element of \`additionalSignUpFields\` a valid \`options\` property must also be provided.`);
        filter = false;
      }

      return filter
        ? r.concat([{icon, name, options, placeholder, prefill, type, validator}])
        : r;
    }, []);

    additionalSignUpFields = Immutable.fromJS(additionalSignUpFields);
  }


  // TODO: add a warning if it is not a boolean, leave it undefined,
  // and change accesor fn.
  loginAfterSignUp = loginAfterSignUp === false ? false : true;

  return Map({
    additionalSignUpFields,
    defaultConnectionName: defaultDatabaseConnection,
    forgotPasswordLink,
    initialScreen,
    loginAfterSignUp,
    mustAcceptTerms,
    screens,
    signUpLink,
    usernameStyle
  }).filter(x => typeof x !== "undefined").toJS();
}

export function defaultDatabaseConnection(m) {
  const name = defaultDatabaseConnectionName(m);
  return name && l.findConnection(m, name);
}

export function defaultDatabaseConnectionName(m) {
  return get(m, "defaultConnectionName");
}

export function databaseConnection(m) {
  return defaultDatabaseConnection(m) || l.connection(m, "database");
}

export function databaseConnectionName(m) {
  return (databaseConnection(m) || Map()).get("name");
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
  const { requires_username } = (databaseConnection(m) || Map()).toJS();
  return requires_username || get(m, "usernameStyle") === "username";
}

export function hasScreen(m, s) {
  const { showForgot, showSignup } = (databaseConnection(m) || Map()).toJS();

  return !(showForgot === false && s === "forgotPassword")
    && !(showSignup === false && s === "signUp")
    && get(m, "screens").contains(s);
}

export function shouldAutoLogin(m) {
  return get(m, "loginAfterSignUp");
}

export function passwordStrengthPolicy(m) {
  return (databaseConnection(m) || Map()).get("passwordPolicy", "none");
}

export function additionalSignUpFields(m) {
  return get(m, "additionalSignUpFields", List());
}

export function mustAcceptTerms(m) {
  return get(m, "mustAcceptTerms", false);
}

export function termsAccepted(m) {
  return !mustAcceptTerms(m) || tget(m, "termsAccepted", false);
}

export function toggleTermsAcceptance(m) {
  return tset(m, "termsAccepted", !termsAccepted(m));
}
