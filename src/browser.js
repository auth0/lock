/*
 *
 * This is used to build the bundle with browserify.
 *
 * The bundle is used by people who doesn't use browserify.
 * Those who use browserify will install with npm and require the module,
 * the package.json file points to index.js.
 */
import 'core-js';
import Auth0Lock from './index';
import Auth0LockPasswordless from './passwordless';

if (typeof window !== 'undefined') {
  if (typeof window.define == 'function' && window.define.amd) {
    window.define('auth0Lock', function () {
      return Auth0Lock;
    });
    window.define('auth0LockPasswordless', function () {
      return Auth0LockPasswordless;
    });
  } else if (window.window) {
    window.Auth0Lock = Auth0Lock;
    window.Auth0LockPasswordless = Auth0LockPasswordless;
  }
}
