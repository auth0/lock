import Auth0Lock from 'auth0-lock';

const cid = 'BWDP9XS89CJq1w6Nzq7iFOHsTh6ChS2b';
const domain = 'brucke.auth0.com';
const options = {
  oidcConformant: true,
  allowShowPassword: true,
  usernameStyle: 'email',
  defaultDatabaseConnection: 'acme',
  prefill: {
    email: 'johnfoo@gmail.com'
  }
};

const lock = new Auth0Lock(cid, domain, options);

lock.on('authenticated', function(authResult) {
  console.log(authResult);

  if (!authResult.accessToken) return;

  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    console.log(error, profile);
  });
});

lock.on('authorization_error', function(error) {
  console.log('authorization_error', error);
});

lock.show();
