/**
 * Export list of allowed options for `.show*()` methods
 */

module.exports = [
  // internals
  'mode',
  'popupCallback',
  // user configurable
  'connections',
  'container',
  'dict',
  'disableSignupAction',
  'signupLink',
  'disableResetAction',
  'resetLink',
  'focusInput',
  'popup',
  'popupOptions',
  'authParams',
  'sso',
  'closable',
  'rememberLastLogin',
  'integratedWindowsLogin',
  'usernameStyle',
  'title',
  'socialBigButtons',
  'defaultUserPasswordConnection',
  'useNewReset',
  // Moved from constructor and hacked into auth0-js instance
  'responseType',
  'callbackURL',
  'forceJSONP'
];
