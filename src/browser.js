/*
 *
 * This is used to build the bundle with browserify.
 *
 * The bundle is used by people who doesn't use browserify.
 * Those who use browserify will install with npm and require the module,
 * the package.json file points to index.js.
 */

import Auth0Lock from './index';
// import Auth0LockPasswordless from './passwordless';

if (typeof global.window.define == 'function' && global.window.define.amd) {
  global.window.define('auth0Lock', function() {
    return Auth0Lock;
  });
  // global.window.define('auth0LockPasswordless', function () { return Auth0LockPasswordless; });
} else if (global.window) {
  global.window.Auth0Lock = Auth0Lock;
  // global.window.Auth0LockPasswordless = Auth0LockPasswordless;
}
