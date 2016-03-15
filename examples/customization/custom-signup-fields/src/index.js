import Auth0Lock from 'auth0-lock-next/lib/classic';
import CustomSignUpScreen from './custom_sign_up_screen';

Auth0Lock.SCREENS.signUp = CustomSignUpScreen;

const cid = "yKJO1ckwuY1X8gPEhTRfhJXyObfiLxih";
const domain = "mdocs.auth0.com";

const lock = new Auth0Lock(cid, domain);
lock.show();
