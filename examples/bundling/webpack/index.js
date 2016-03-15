import Auth0LockPasswordless from 'auth0-lock-next';

const cid = "Gcs1jSu5FAFpDrPe0jrqGpfbTEkzCk15";
const domain = "pwdlessdemo.auth0.com";

const lock = new Auth0LockPasswordless(cid, domain);

lock.magiclink();
