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
  'userPwdConnectionName',
  // Moved from constructor and hacked into auth0-js instance
  'callbackOnLocationHash',
  'callbackURL',
  'forceJSONP'
];
