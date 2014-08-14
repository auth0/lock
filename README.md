[![Auth0](https://i.cloudup.com/9sk1vhcfbS.png)](http://auth0.com)

# Auth0 Lock
[![NPM version](https://badge.fury.io/js/auth0-lock.js.png)](http://badge.fury.io/js/auth0-lock.js)

[Auth0](https://auth0.com) is an authentication broker that supports social identity providers as well as enterprise identity providers such as Active Directory, LDAP, Google Apps, Salesforce.

The Auth0 Lock makes it easy to integrate SSO in your app. You won't have to worry about:
* Having a professional looking login dialog that displays well on any resolution and device.
* Finding the right icons for popular social providers.
* Remembering what was the identity provider the user chose the last time.
* Solving the home realm discovery challenge with enterprise users (i.e.: asking the enterprise user the email, and redirecting to the right enterprise identity provider).
* Implementing a standard sign in protocol (OpenID Connect / OAuth2 Login)

[![Auth0](https://i.cloudup.com/6opoEX_Z9z.png)](http://auth0.com)

## Install

With [npm](https://npmjs.org):

```
  npm install auth0-lock
```

With bower:

```
  bower install auth0-lock
```

With our CDN:

```html
<script src="http://cdn.auth0.com/w2/auth0-lock-1.0.js"></script>
```

Or take `auth0-lock.js` ( minified: `auth0-lock.min.js`) from the `build` directory and add it to your HTML.

## Usage

```javascript
var clientID = 'xxxxxx';
var domain = '<account>.auth0.com';

// Initialize Auth0Lock with your `clientID` and `domain` only
var lock = new Auth0Lock(clientID, domain);

lock.show();

// Or configure with instance options like...
var lock = new Auth0Lock(clientID, domain, {
  forceJSONP: true,
  callbackOnLocationHash: true,
  callbackURL: 'http://my-app.com/callback'
});

```

## API

### Auth0Lock(clientID, domain[, options])

Initialize `Auth0Lock` with `clientID` and account's `domain`. Also allow for `options` to be passed to configure `auth0-js` lib dependency.

```
  var lock = new Auth0Lock('clientID', 'domain');

  document.querySelector('a#login').onclick = function(e) {
    e.preventDefault();
    lock.show();
  }
```

> Note: For a full detail of initialization configuration check the [wiki][initialization-configuration] article on this topic.


### **.show(options[, callback])**

Open the widget on `signin` mode  with `signup` and `reset` button actions if enabled for the connection configuration.

```
  var lock = new Auth0Lock('clientID', 'domain');

  // normal display
  lock.show(options);

  // no page redirect trigger
  // useful for single page applications
  lock.show(options, function(profile, token) {

  })
```

> Note: For a full detail of initialization configuration check the [wiki]() article on this topic.


### **.showSignin(options[, callback])**

Open the widget on `signin` mode, but withouht the bottom `signup` nor `reset` button actions.

> Usefull when your site has custom *signup*, and *reset* links at a different form.


### **.showSignup(options[, callback])**

Open the widget on `signup` mode, but withouht the bottom `cancel` button action to go back to `signin`.

> Usefull when your site has custom *signup*, and *reset* links at a different form.


### **.showReset(options[, callback])**

Open the widget on `reset` mode, but withouht the bottom `cancel` button action to go back to `signin`.

>Usefull when your site has custom *signup*, and *reset* links at a different form.

### **.hide([callback])**

Close the widget and invoke `callback` if defined.

### **.logout([query])**

Log out loggedin user with optional query parameters for the `GET` request.

## Run examples

The example directory has a ready-to-go app. In order to run it you need [node](http://nodejs.org/) installed and **grunt** (`npm i grunt -g`), then execute `grunt example` from the root of this project.

## Browser Compatibility

We use [BrowserStack](http://browserstack.com) to run the test suite on multiple browsers at every push.
We ensure browser compatibility in `Chrome`, `Safari`, `Firefox` and `IE >= 9`.

## Releases

To get a release to work, you need to follow these simple commands

```
  # clear and update dependencies
  $ rm -rf node_modules
  $ npm cache clean
  $ npm i

  # release new version
  $ ./bin/version {patch,minor,major}

  # update remote repository
  $ git push origin master --tags

  # ... and then npm (you might wan't to wait tests pass on CI)
  $ npm publish
```

That's it!

## Resources

* [UI customization](ui-customization) for the `Auth0Lock`.
* [Development](development-notes) notes.
* [Release process](release-notes) notes.


## License

MIT

[initialization-configuration][https://github.com/auth0/lock/wiki/Initialization-configuration]
[ui-customization][https://github.com/auth0/lock/wiki/UI-customization]
[development-notes][https://github.com/auth0/lock/wiki/Development-notes]
[release-notes][https://github.com/auth0/lock/wiki/Release-notes]
