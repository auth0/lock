import Auth0LockPasswordless from 'auth0-lock-next';
import CustomMode from './custom_mode';


// register plugin
Auth0LockPasswordless.plugins.register(CustomMode);

const lock = new Auth0LockPasswordless("cid", "tenant.auth0.com");

// invoke method added by plugin
lock.custom();
