import p from '../package';
import Auth0LockPasswordless from './lock/auth0_lock_passwordless';
import Auth0 from 'auth0-js';
// import crashedSpec from './crashed/mode_spec';
import passwordlessEmailSpec from './passwordless-email/mode_spec';
import passwordlessSMSSpec from './passwordless-sms/mode_spec';

// Auth0LockPasswordless.plugins.register(crashedSpec);
Auth0LockPasswordless.plugins.register(passwordlessEmailSpec);
Auth0LockPasswordless.plugins.register(passwordlessSMSSpec);

// TODO temp for DEV only
global.window.Auth0LockPasswordless = Auth0LockPasswordless;

import styles from '../css/index.css';
import transitions from '../css/transitions.css';
import overwrites from '../css/overwrites.css';

// Setup versions
Auth0LockPasswordless.version = p.version
Auth0.clientInfo.name +=  " (LockPasswordless)";
Auth0.clientInfo.version += ` (${Auth0LockPasswordless.version})`;
