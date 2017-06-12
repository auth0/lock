import Immutable, { List, Map } from 'immutable';
import * as l from '../../core/index';
import {
  hideInvalidFields,
  clearFields,
  getFieldValue,
  setField,
  registerOptionField
} from '../../field/index';
import { dataFns } from '../../utils/data_utils';
import sync from '../../sync';
import trim from 'trim';
import { defaultDirectory } from '../../core/tenant';
import { findADConnectionWithoutDomain } from '../../connection/enterprise';

const { get, initNS, tget, tset } = dataFns(['database']);

export function initDatabase(m, options) {
  m = initNS(m, Immutable.fromJS(processDatabaseOptions(options)));
  m = resolveAdditionalSignUpFields(m);
  return m;
}

function assertMaybeBoolean(opts, name) {
  const valid = opts[name] === undefined || typeof opts[name] === 'boolean';
  if (!valid) l.warn(opts, `The \`${name}\` option will be ignored, because it is not a booelan.`);
  return valid;
}

function assertMaybeEnum(opts, name, a) {
  const valid = opts[name] === undefined || a.indexOf(opts[name]) > -1;
  if (!valid)
    l.warn(
      opts,
      `The \`${name}\` option will be ignored, because it is not one of the following allowed values: ${a
        .map(x => JSON.stringify(x))
        .join(', ')}.`
    );
  return valid;
}

function assertMaybeString(opts, name) {
  const valid =
    opts[name] === undefined || (typeof opts[name] === 'string' && trim(opts[name]).length > 0);
  if (!valid)
    l.warn(opts, `The \`${name}\` option will be ignored, because it is not a non-empty string.`);
  return valid;
}

function assertMaybeArray(opts, name) {
  const valid = opts[name] === undefined || global.Array.isArray(opts[name]);
  if (!valid) l.warn(opts, `The \`${name}\` option will be ignored, because it is not an array.`);
  return valid;
}

function processDatabaseOptions(opts) {
  let {
    additionalSignUpFields,
    defaultDatabaseConnection,
    forgotPasswordLink,
    loginAfterSignUp,
    mustAcceptTerms,
    signUpLink,
    usernameStyle
  } = opts;

  let { initialScreen, screens } = processScreenOptions(opts);

  if (!assertMaybeEnum(opts, 'usernameStyle', ['email', 'username'])) {
    usernameStyle = undefined;
  }

  if (!assertMaybeString(opts, 'defaultDatabaseConnection')) {
    defaultDatabaseConnection = undefined;
  }

  if (!assertMaybeString(opts, 'forgotPasswordLink')) {
    forgotPasswordLink = undefined;
  }

  if (!assertMaybeString(opts, 'signUpLink')) {
    signUpLink = undefined;
  }

  if (!assertMaybeBoolean(opts, 'mustAcceptTerms')) {
    mustAcceptTerms = undefined;
  }

  if (!assertMaybeArray(opts, 'additionalSignUpFields')) {
    additionalSignUpFields = undefined;
  } else if (additionalSignUpFields) {
    additionalSignUpFields = additionalSignUpFields.reduce((r, x) => {
      let { icon, name, options, placeholder, prefill, type, validator } = x;
      let filter = true;

      const reservedNames = ['email', 'username', 'password'];
      if (
        typeof name != 'string' ||
        !name.match(/^[a-zA-Z0-9_]+$/) ||
        reservedNames.indexOf(name) > -1
      ) {
        l.warn(
          opts,
          `Ignoring an element of \`additionalSignUpFields\` because it does not contain valid \`name\` property. Every element of \`additionalSignUpFields\` must be an object with a \`name\` property that is a non-empty string consisting of letters, numbers and underscores. The following names are reserved, and therefore, cannot be used: ${reservedNames.join(', ')}.`
        );
        filter = false;
      }

      if (typeof placeholder != 'string' || !placeholder) {
        l.warn(
          opts,
          'Ignoring an element of `additionalSignUpFields` because it does not contain a valid `placeholder` property. Every element of `additionalSignUpFields` must have a `placeholder` property that is a non-empty string.'
        );
        filter = false;
      }

      if (icon != undefined && (typeof icon != 'string' || !icon)) {
        l.warn(
          opts,
          'When provided, the `icon` property of an element of `additionalSignUpFields` must be a non-empty string.'
        );
        icon = undefined;
      }

      if (
        prefill != undefined &&
        (typeof prefill != 'string' || !prefill) &&
        typeof prefill != 'function'
      ) {
        l.warn(
          opts,
          'When provided, the `prefill` property of an element of `additionalSignUpFields` must be a non-empty string or a function.'
        );
        prefill = undefined;
      }

      const types = ['select', 'text', 'checkbox'];
      if (type != undefined && (typeof type != 'string' || types.indexOf(type) === -1)) {
        l.warn(
          opts,
          `When provided, the \`type\` property of an element of \`additionalSignUpFields\` must be one of the following strings: "${types.join('", "')}".`
        );
        type = undefined;
      }

      if (validator != undefined && type === 'select') {
        l.warn(
          opts,
          'Elements of `additionalSignUpFields` with a "select" `type` cannot specify a `validator` function, all of its `options` are assumed to be valid.'
        );
        validator = undefined;
      }

      if (validator != undefined && typeof validator != 'function') {
        l.warn(
          opts,
          'When provided, the `validator` property of an element of `additionalSignUpFields` must be a function.'
        );
        validator = undefined;
      }

      if (options != undefined && type != 'select') {
        l.warn(
          opts,
          'The `options` property can only by provided for an element of `additionalSignUpFields` when its `type` equals to "select"'
        );
        options = undefined;
      }

      if (
        (options != undefined && !global.Array.isArray(options) && typeof options != 'function') ||
        (type === 'select' && options === undefined)
      ) {
        l.warn(
          opts,
          'Ignoring an element of `additionalSignUpFields` because it has a "select" `type` but does not specify an `options` property that is an Array or a function.'
        );
        filter = false;
      }

      return filter
        ? r.concat([{ icon, name, options, placeholder, prefill, type, validator }])
        : r;
    }, []);

    additionalSignUpFields = Immutable.fromJS(additionalSignUpFields).map(x =>
      x.filter(y => y !== undefined)
    );
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
  })
    .filter(x => typeof x !== 'undefined')
    .toJS();
}

function processScreenOptions(
  opts,
  defaults = {
    allowLogin: true,
    allowSignUp: true,
    allowForgotPassword: true,
    initialScreen: undefined
  }
) {
  let { allowForgotPassword, allowLogin, allowSignUp, initialScreen } = opts;

  const screens = [];

  if (
    allowLogin === true ||
    (!assertMaybeBoolean(opts, 'allowLogin') && defaults.allowLogin) ||
    (allowLogin === undefined && defaults.allowLogin)
  ) {
    screens.push('login');
  }

  if (
    allowSignUp === true ||
    (!assertMaybeBoolean(opts, 'allowSignUp') && defaults.allowSignUp) ||
    (allowSignUp === undefined && defaults.allowSignUp)
  ) {
    screens.push('signUp');
  }

  if (
    allowForgotPassword === true ||
    (!assertMaybeBoolean(opts, 'allowForgotPassword') && defaults.allowForgotPassword) ||
    (allowForgotPassword === undefined && defaults.allowForgotPassword)
  ) {
    screens.push('forgotPassword');
  }

  screens.push('mfaLogin');

  if (!assertMaybeEnum(opts, 'initialScreen', screens)) {
    initialScreen = undefined;
  }

  if (initialScreen === undefined) {
    initialScreen = defaults.initialScreen || screens[0];
  }

  return { initialScreen, screens: new List(screens) };
}

export function overrideDatabaseOptions(m, opts) {
  const { initialScreen, screens } = processScreenOptions(opts, {
    allowLogin: availableScreens(m).contains('login'),
    allowSignUp: availableScreens(m).contains('signUp'),
    allowForgotPassword: availableScreens(m).contains('forgotPassword'),
    initialScreen: get(m, 'initialScreen')
  });
  m = tset(m, 'initialScreen', initialScreen);
  m = tset(m, 'screens', screens);
  return m;
}

export function defaultDatabaseConnection(m) {
  const name = defaultDatabaseConnectionName(m);
  return name && l.findConnection(m, name);
}

export function defaultDatabaseConnectionName(m) {
  return get(m, 'defaultConnectionName');
}

export function databaseConnection(m) {
  return defaultDirectory(m) || defaultDatabaseConnection(m) || l.connection(m, 'database');
}

export function databaseConnectionName(m) {
  return (databaseConnection(m) || Map()).get('name');
}

export function forgotPasswordLink(m, notFound = '') {
  return get(m, 'forgotPasswordLink', notFound);
}

export function signUpLink(m, notFound = '') {
  return get(m, 'signUpLink', notFound);
}

export function setScreen(m, name, fields = []) {
  // TODO: the lock/index module should provide a way to clear
  // everything that needs the be cleared when changing screens, other
  // modules should not care.
  m = l.clearGlobalError(m);
  m = l.clearGlobalSuccess(m);
  m = hideInvalidFields(m, fields);
  m = clearFields(m, fields);

  return tset(m, 'screen', name);
}

export function getScreen(m) {
  const screen = tget(m, 'screen');
  const initialScreen = getInitialScreen(m);
  const screens = [screen, initialScreen, 'login', 'signUp', 'forgotPassword', 'mfaLogin'];
  const availableScreens = screens.filter(x => hasScreen(m, x));
  return availableScreens[0];
}

export function availableScreens(m) {
  return tget(m, 'screens') || get(m, 'screens', new List());
}

export function getInitialScreen(m) {
  return tget(m, 'initialScreen') || get(m, 'initialScreen');
}

export function hasInitialScreen(m, str) {
  return getInitialScreen(m) === str;
}

export function databaseConnectionRequiresUsername(m) {
  return (databaseConnection(m) || Map()).toJS().requireUsername;
}

export function databaseUsernameStyle(m) {
  if (l.hasSomeConnections(m, 'database')) {
    return databaseConnectionRequiresUsername(m) ? get(m, 'usernameStyle', 'any') : 'email';
  }

  return l.hasSomeConnections(m, 'enterprise') && findADConnectionWithoutDomain(m)
    ? 'username'
    : 'email';
}

export function databaseLogInWithEmail(m) {
  return databaseUsernameStyle(m) === 'email';
}

export function databaseUsernameValue(m) {
  return getFieldValue(m, databaseLogInWithEmail(m) ? 'email' : 'username');
}

export function authWithUsername(m) {
  return databaseConnectionRequiresUsername(m) || get(m, 'usernameStyle', 'email') === 'username';
}

export function hasScreen(m, s) {
  const { allowForgot, allowSignup } = (databaseConnection(m) || Map()).toJS();

  return (
    !(allowForgot === false && s === 'forgotPassword') &&
    !(allowSignup === false && s === 'signUp') &&
    availableScreens(m).contains(s)
  );
}

export function shouldAutoLogin(m) {
  return get(m, 'loginAfterSignUp');
}

export function passwordStrengthPolicy(m) {
  return (databaseConnection(m) || Map()).get('passwordPolicy', 'none');
}

export function additionalSignUpFields(m) {
  return get(m, 'additionalSignUpFields', List());
}

export function mustAcceptTerms(m) {
  return get(m, 'mustAcceptTerms', false);
}

export function termsAccepted(m) {
  return !mustAcceptTerms(m) || tget(m, 'termsAccepted', false);
}

export function toggleTermsAcceptance(m) {
  return tset(m, 'termsAccepted', !termsAccepted(m));
}

export function resolveAdditionalSignUpFields(m) {
  return additionalSignUpFields(m).reduce((r, x) => {
    return x.get('type') === 'select'
      ? resolveAdditionalSignUpSelectField(r, x)
      : resolveAdditionalSignUpTextField(r, x);
  }, m);
}

function resolveAdditionalSignUpSelectField(m, x) {
  const name = x.get('name');
  const keyNs = ['additionalSignUpField', name];
  const prefill = x.get('prefill');
  const options = x.get('options');

  let resolvedPrefill = typeof prefill === 'function' ? undefined : prefill || '';
  let resolvedOptions = typeof options === 'function' ? undefined : options;

  const register = m => {
    return resolvedPrefill !== undefined && resolvedOptions !== undefined
      ? registerOptionField(m, name, Immutable.fromJS(resolvedOptions), resolvedPrefill)
      : m;
  };

  if (resolvedPrefill === undefined) {
    m = sync(m, keyNs.concat('prefill'), {
      recoverResult: '',
      successFn: (m, result) => {
        resolvedPrefill = result;
        return register(m);
      },
      syncFn: (m, cb) => prefill(cb)
    });
  }

  if (resolvedOptions === undefined) {
    m = sync(m, keyNs.concat('options'), {
      successFn: (m, result) => {
        resolvedOptions = result;
        return register(m);
      },
      syncFn: (m, cb) => options(cb)
    });
  }

  if (resolvedPrefill !== undefined && resolvedOptions !== undefined) {
    m = registerOptionField(m, name, Immutable.fromJS(resolvedOptions), resolvedPrefill);
  }

  return m;
}

function resolveAdditionalSignUpTextField(m, x) {
  const name = x.get('name');
  const key = ['additionalSignUpField', name, 'prefill'];
  const prefill = x.get('prefill');
  const validator = x.get('validator');

  let resolvedPrefill = typeof prefill === 'function' ? undefined : prefill || '';

  if (resolvedPrefill === undefined) {
    m = sync(m, key, {
      recoverResult: '',
      successFn: (m, result) => {
        return setField(m, name, result, validator);
      },
      syncFn: (m, cb) => prefill(cb)
    });
  } else {
    m = setField(m, name, resolvedPrefill, validator);
  }

  return m;
}
