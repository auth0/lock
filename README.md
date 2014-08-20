[![Auth0](https://i.cloudup.com/9sk1vhcfbS.png)](http://auth0.com)

# Auth0 Lock
[![NPM version][npm-image]][npm-url]
[![Build status][strider-image]][strider-url]
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

> Note: if you are using `auth0-widget` < v6.0.0, check this [repository](https://github.com/auth0/widget) for proper documentation.

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

## Usage

```js
// Initialize Auth0Lock with your `clientID` and `domain`
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// and deploy it
var login = document.querySelector('a#login')

login.onclick = function (e) {
  e.preventDefault();
  lock.show();
}

```

## API

### Auth0Lock(clientID, domain[, options])

Initialize `Auth0Lock` with a `clientID` and the account's `domain`.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

lock.show();
```

> Note: For a full detail on the initialization configuration check the [wiki][initialization-configuration] article.


### .show(options[, callback])

Open the widget on `signin` mode with `signup` and `reset` button actions if enabled for the configured/default account connection.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display
lock.show(options);

```

> Note: Check the [show configuration][show-configuration] article for more examples and options index.

### .showSignin(options[, callback])

Open the widget on `signin` mode, but withouht the bottom `signup` nor `reset` button actions. This method is useful when your site has custom *signup* and *reset* links at a different form.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display
lock.showSignin(options);

```
> Note: Check the [show configuration][show-configuration] article for more examples and options.

### .showSignup(options[, callback])

Open the widget on `signup` mode, but withouht the `cancel` button action to go back to `signin`. This method is useful when your site has custom *signin* and *reset* links at a different form.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display
lock.showSignup(options);

```
> Note: Check the [show configuration][show-configuration] article for more examples and options.

### .showReset(options[, callback])

Open the widget on `reset` mode, but withouht the bottom `cancel` button action to go back to `signin`.  This method is useful when your site has custom *signin* and *signup* links at a different form.

> Note: For a full detail of initialization configuration check the [wiki][show-configuration] article on this topic.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display
lock.showReset(options);
```

> Note: Check the [show configuration][show-configuration] article for more examples and options.

### .hide([callback])

Close the widget and invoke `callback` when removed from DOM.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display
lock.show(options);

// trigger hide when esc key pressed
document.addEventListener('keypress', function(e) {
  // hide if esc
  lock.hide();
}, false);
```

### .logout([query])

Log out loggedin user with optional query parameters for the `GET` request.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// Call logout with query parameters
lock.logout({ ref: window.location.href });
```

## Run examples

The **example** directory has a ready-to-go app. In order to run it you need [node](http://nodejs.org/) installed. Then execute `npm i` to install dependencies (only once) and `grunt example` from the root of this project. Point your browser at `http://localhost:9999/` and check the examples.

## Browser Compatibility

We ensure browser compatibility in `Chrome`, `Safari`, `Firefox` and `IE >= 9`. We currently use [zuul](https://github.com/defunctzombie/zuul) along with [Saucelabs](https://saucelabs.com) to run integration tests on each push.

## Resources

* [UI customization][ui-customization] for the `Auth0Lock`.
* [Development][development-notes] notes.
* [Release process][release-process] notes.

<!-- Vaaaaarrsss -->

[download1]: https://raw.github.com/auth0/lock/master/build/auth0-lock.js
[download2]: https://raw.github.com/auth0/lock/master/build/auth0-lock.min.js

[npm-image]: https://img.shields.io/npm/v/auth0-lock.svg?style=flat-square
[npm-url]: https://npmjs.org/package/auth0-lock
[strider-image]: https://ci.auth0.com/auth0/lock/badge
[strider-url]: https://ci.auth0.com/auth0/lock
[coveralls-image]: https://img.shields.io/coveralls/auth0/lock.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/auth0/lock?branch=master
[david-image]: http://img.shields.io/david/auth0/lock.svg?style=flat-square
[david-url]: https://david-dm.org/auth0/lock
[license-image]: http://img.shields.io/npm/l/auth0-lock.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/auth0-lock.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/auth0-lock

[initialization-configuration]: https://github.com/auth0/lock/wiki/Initialization-configuration
[ui-customization]: https://github.com/auth0/lock/wiki/UI-customization
[development-notes]: https://github.com/auth0/lock/wiki/Development-notes
[release-process]: https://github.com/auth0/lock/wiki/Release-process
