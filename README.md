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
<script src="http://cdn.auth0.com/js/lock-6.min.js"></script>

<!-- Latest minor release -->
<script src="http://cdn.auth0.com/js/lock-6.0.min.js"></script>

<!-- Latest patch release -->
<script src="http://cdn.auth0.com/js/lock-6.0.0.min.js"></script>
```

You can [try Auth0 Lock online using the PlayGround](http://lock-pl4y.herokuapp.com).

## Usage

```js
// Initialize Auth0Lock with your `clientID` and `domain`
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// and deploy it
var login = document.querySelector('a#login')

login.onclick = function (e) {
  e.preventDefault();
  lock.show(function onLogin(err, profile, id_token) {
    if (err) {
      // There was an error logging the user in
      return;
    }

    // User is logged in
  });
};
```

This is one of the example of how Auth0 Lock would work with a Single Page App (SPA). Please [click here to get more information about using Auth0 Lock with a SPA](https://github.com/auth0/lock/wiki/Types-Of-Applications#single-page-app) or [click here to get information on how to use it with a Regular WebApp](https://github.com/auth0/lock/wiki/Types-Of-Applications#regular-webapp)

## Authentication Modes

We can use Auth0 Lock with Popup Mode or Redirect Mode. [Click here to learn more about this 2 modes](https://github.com/auth0/lock/wiki/Authentication-Modes) and [click here to learn how to implement them with Auth0 Lock](https://github.com/auth0/lock/wiki/Types-Of-Applications)

## API

### Auth0Lock(clientID, domain[, options])

Initialize `Auth0Lock` with a `clientID` and the account's `domain`.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');
```

> Note: For a full detail on the initialization configuration [you can check the wiki][lock-initialization] article.


### .show([options, callback]) || .show(callback)

Open the widget on `signin` mode with `signup` and `reset` button actions if enabled for the configured/default account connection.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display with redirect 
lock.show(options);

// If no options are needed and you'll use popup
lock.show(function onLogin(err, profile, token) {
  
});

```

> [Click here to learn more about using Auth0 Lock's authentication](https://github.com/auth0/lock/wiki/Types-Of-Applications) and check the [Auth0Lock customization][lock-customization] article for more examples and options.

### .showSignin([options, callback]) || .showSignin(callback)

Open the widget on `signin` mode, but withouht the bottom `signup` nor `reset` button actions. This method is useful when your site has custom *signup* and *reset* links at a different form.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display with redirect 
lock.showSignin(options);

// If no options are needed and you'll use popup
lock.showSignin(function onLogin(err, profile, token) {
```
> [Click here to learn more about using Auth0 Lock's authentication](https://github.com/auth0/lock/wiki/Types-Of-Applications) and check the [Auth0Lock customization][lock-customization] article for more examples and options.


### .showSignup([options, callback]) || .showSignup(callback)

Open the widget on `signup` mode, but withouht the `cancel` button action to go back to `signin`. This method is useful when your site has custom *signin* and *reset* links at a different form.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display with redirect 
lock.showSignup(options);

// If no options are needed and you'll use popup
lock.showSignup(function onLogin(err, profile, token) {

```
> [Click here to learn more about using Auth0 Lock's authentication](https://github.com/auth0/lock/wiki/Types-Of-Applications) and check the [Auth0Lock customization][lock-customization] article for more examples and options.


### .showReset([options, callback]) || .showReset(callback)

Open the widget on `reset` mode, but withouht the bottom `cancel` button action to go back to `signin`.  This method is useful when your site has custom *signin* and *signup* links at a different form.

```js
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// normal display with redirect 
lock.showReset(options);

// If no options are needed and you'll use popup
lock.showReset(function onLogin(err, profile, token) {
```

> [Click here to learn more about using Auth0 Lock's authentication](https://github.com/auth0/lock/wiki/Types-Of-Applications) and check the [Auth0Lock customization][lock-customization] article for more examples and options.


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

## Examples

The **example** directory has a ready-to-go app. In order to run it you need [node](http://nodejs.org/) installed.

Then execute `npm i` to install dependencies (only once) and `npm example` from the root of this project.

Finally, point your browser at `http://localhost:9999/` and play around.

## Browser Compatibility

We ensure browser compatibility in `Chrome`, `Safari`, `Firefox` and `IE >= 9`. We currently use [zuul](https://github.com/defunctzombie/zuul) along with [Saucelabs](https://saucelabs.com) to run integration tests on each push.

## Resources

* [UI customization][ui-customization] for the `Auth0Lock`.
* [Error customization][error-customization] notes.
* [Implementing Auth0 Lock with Single Page Apps](https://github.com/auth0/lock/wiki/Types-Of-Applications#single-page-app).
* [Implementing Auth0 Lock with Regular WebApps](https://github.com/auth0/lock/wiki/Types-Of-Applications#regular-webapp).
* [Popup vs Redirect. What are the authentication modes?](https://github.com/auth0/lock/wiki/Authentication-Modes).
* [I18n][i18n-notes] notes.
* [Events][events-notes] notes.
* [Development][development-notes] notes.
* [Release process][release-process] notes.
* Legacy **auth0-widget**`< v6.0.0` [repository](https://github.com/auth0/widget) and [docs](https://docs.auth0.com/login-widget2).
* [Auth0 Lock Playground](http://lock-pl4y.herokuapp.com)

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

[lock-initialization]: https://github.com/auth0/lock/wiki/Auth0lock-initialization
[lock-customization]: https://github.com/auth0/lock/wiki/Auth0lock-customization
[ui-customization]: https://github.com/auth0/lock/wiki/UI-customization
[error-customization]: https://github.com/auth0/lock/wiki/Customizing-error-messages
[spa-notes]: https://github.com/auth0/lock/wiki/Single-page-applications
[i18n-notes]: https://github.com/auth0/lock/wiki/I18n
[events-notes]: https://github.com/auth0/lock/wiki/Events
[development-notes]: https://github.com/auth0/lock/wiki/Development-notes
[release-process]: https://github.com/auth0/lock/wiki/Release-process
