import p from '../package';
import Auth0LockPasswordless from './lock/auth0_lock_passwordless';
import Auth0 from 'auth0-js';

// TODO temp for DEV only
global.window.Auth0LockPasswordless = Auth0LockPasswordless;

import styles from '../css/index.css';
import transitions from '../css/transitions.css';
import overwrites from '../css/overwrites.css';

// Setup versions
Auth0LockPasswordless.version = p.version
Auth0.clientInfo.name +=  " (LockPasswordless)";
Auth0.clientInfo.version += ` (${Auth0LockPasswordless.version})`;
