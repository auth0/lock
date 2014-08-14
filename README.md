[![Auth0](https://i.cloudup.com/9sk1vhcfbS.png)](http://auth0.com)

# Auth0 Lock
[![NPM version][npm-image]][npm-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]


[Auth0](https://auth0.com) is an authentication broker that supports social identity providers as well as enterprise identity providers such as Active Directory, LDAP, Google Apps, Salesforce.

The Auth0 Lock makes it easy to integrate SSO in your app. You won't have to worry about:
* Having a professional looking login dialog that displays well on any resolution and device.
* Finding the right icons for popular social providers.
* Remembering what was the identity provider the user chose the last time.
* Solving the home realm discovery challenge with enterprise users (i.e.: asking the enterprise user the email, and redirecting to the right enterprise identity provider).
* Implementing a standard sign in protocol (OpenID Connect / OAuth2 Login)

[![Auth0](https://i.cloudup.com/6opoEX_Z9z.png)](http://auth0.com)

## Install

From [npm](https://npmjs.org):

```sh
npm install auth0-lock
```

From [bower](http://bower.io):

```sh
bower install auth0-lock
```

Or our CDN:

```html
<!-- Latest major release -->
<script src="http://cdn.auth0.com/auth0-lock/6/auth0-lock.min.js"></script>

<!-- Latest minor release -->
<script src="http://cdn.auth0.com/auth0-lock/6.0/auth0-lock.min.js"></script>

<!-- Latest patch release -->
<script src="http://cdn.auth0.com/auth0-lock/6.0.0/auth0-lock.min.js"></script>
```

> Note: You can also download the compiled builds from this repo for latest [auth0-lock.js][download1] and [auth0-lock.min.js][download2]. Although this is **not recomended**, and you should always get any stable release from the previous install methods.

## Usage

```js
// Initialize Auth0Lock with your `clientID` and `domain`
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// and deploy it
lock.show();
```

## API

### Auth0Lock(clientID, domain[, options])

Initialize `Auth0Lock` with `clientID` and account's `domain`.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

document.querySelector('a#login').onclick = function (e) {
  e.preventDefault();
  lock.show();
}
```

Allow `options` to be passed to configure `auth0-js` lib dependency and other internals.

```js
// Or configure with instance options like...

var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');
  callbackOnLocationHash: true,
  callbackURL: 'http://my-app.com/callback',
  forceJSONP: true
});

```

> Note: For a full detail on the initialization configuration check the [wiki][initialization-configuration] article for this topic.


### **.show(options[, callback])**

Open the widget on `signin` mode  with `signup` and `reset` button actions if enabled for the connection configuration.

> Note: For a full detail of initialization configuration check the [wiki][show-configuration] article on this topic.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display
lock.show(options);

// no page redirect trigger
// useful for single page applications
lock.show(options, function(profile, token) {

})
```

### **.showSignin(options[, callback])**

Open the widget on `signin` mode, but withouht the bottom `signup` nor `reset` button actions.

> Note: For a full detail of initialization configuration check the [wiki][show-configuration] article on this topic.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display
lock.show(options);

// no page redirect trigger
// useful for single page applications
lock.show(options, function(profile, token) {

})
```
> Usefull when your site has custom *signup*, and *reset* links at a different form.

### **.showSignup(options[, callback])**

Open the widget on `signup` mode, but withouht the bottom `cancel` button action to go back to `signin`.

> Note: For a full detail of initialization configuration check the [wiki][show-configuration] article on this topic.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display
lock.show(options);

// no page redirect trigger
// useful for single page applications
lock.show(options, function(profile, token) {

})
```
> Usefull when your site has custom *signup*, and *reset* links at a different form.

### **.showReset(options[, callback])**

Open the widget on `reset` mode, but withouht the bottom `cancel` button action to go back to `signin`.

> Note: For a full detail of initialization configuration check the [wiki][show-configuration] article on this topic.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display
lock.show(options);

// no page redirect trigger
// useful for single page applications
lock.show(options, function(profile, token) {

})
```

> Usefull when your site has custom *signup*, and *reset* links at a different form.

### **.hide([callback])**

Close the widget and invoke `callback` if defined.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display
lock.show(options);

// no page redirect trigger
// useful for single page applications
lock.show(options, function(profile, token) {

})
```

### **.logout([query])**

Log out loggedin user with optional query parameters for the `GET` request.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// Call logout with query parameters
lock.logout({ ref: window.location.href });
```

## Run examples

The example directory has a ready-to-go app. In order to run it you need [node](http://nodejs.org/) installed and **grunt** (`npm i grunt -g`), then execute `grunt example` from the root of this project.

## Browser Compatibility

We use [BrowserStack](http://browserstack.com) to run the test suite on multiple browsers at every push.
We ensure browser compatibility in `Chrome`, `Safari`, `Firefox` and `IE >= 9`.

## Resources

* [UI customization][ui-customization] for the `Auth0Lock`.
* [Development][development-notes] notes.
* [Release process][release-process] notes.

<!-- Variables -->

[download1]: https://raw.github.com/auth0/lock/master/build/auth0-lock.js
[download2]: https://raw.github.com/auth0/lock/master/build/auth0-lock.min.js

[npm-image]: https://img.shields.io/npm/v/auth0-lock.svg?style=flat-square
[npm-url]: https://npmjs.org/package/auth0-lock
[coveralls-image]: https://img.shields.io/coveralls/auth0/lock.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/auth0/lock?branch=master
[david-image]: http://img.shields.io/david/auth0/lock.svg?style=flat-square
[david-url]: https://david-dm.org/auth0-lock
[license-image]: http://img.shields.io/npm/l/auth0-lock.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/auth0-lock.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/auth0-lock

[initialization-configuration]: https://github.com/auth0/lock/wiki/Initialization-configuration
[ui-customization]: https://github.com/auth0/lock/wiki/UI-customization
[development-notes]: https://github.com/auth0/lock/wiki/Development-notes
[release-process]: https://github.com/auth0/lock/wiki/Release-process
