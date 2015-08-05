import p from '../package';
import Renderer from './lock/renderer';
import { subscribe, getState } from './store/index';
import Auth0Lock from './lock/auth0_lock';
import Auth0 from 'auth0-js';
import crashedSpec from './crashed/mode_spec';
import passwordlessEmailSpec from './passwordless-email/mode_spec';

Auth0Lock.registerMode(crashedSpec);
Auth0Lock.registerMode(passwordlessEmailSpec);

// TODO temp for DEV only
global.window.Auth0Lock = Auth0Lock;

import styles from '../css/index.css';

// Setup versions
Auth0Lock.version = p.version
Auth0.clientInfo.name +=  " (LockPasswordless)";
Auth0.clientInfo.version += ` (${Auth0Lock.version})`;


const renderer = new Renderer();
subscribe("main", () => renderer.render(getState()));
