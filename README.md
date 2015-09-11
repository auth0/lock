# Lock Passwordless

[![NPM version][npm-image]][npm-url]
[![Build status][strider-image]][strider-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[Auth0](https://auth0.com) Lock Passwordless is a professional looking dialog that allows users to log in by receiving a one-time password via email or text message.

## Usage

The most common scenario would be to open the dialog when the user clicks a login button. In order to do that, you can initialize a new `Auth0LockPasswordless` object, register an event handler for the _click_ event on the button element, and finally invoke the `magiclink` method from it.

```javascript
var clientID = "YOUR_AUTH0_APP_CLIENTID";
var domain = "YOUR_DOMAIN_AT.auth0.com";
var lock = new Auth0LockPasswordless(clientID, domain);
document.getElementById("loginButton").onclick = function(e) {
  lock.magiclink(function() {
    // this will be invoked after an attempt to send an email with a link that
    // will log the user in automatically has been sent to the entered address
  });
};
```

The `magiclink` method is only one of the many methods available in `Auth0LockPasswordless` objects that will display the dialog. Depending on which one you invoke, the behavior of the dialog will be different. Each one of these methods take an optional `options` argument, which is not being shown in the code snippet above, and a `callback` function. The `options` will allow you to customize how the dialog will look, and `callback` will be invoked when the dialog's job can be considered done. See below the API section for more details.

## Install

From CDN

```html
<!-- Latest major release -->
<script src="http://cdn.auth0.com/js/lock-passwordless-1.min.js"></script>

<!-- Latest minor release -->
<script src="http://cdn.auth0.com/js/lock-passwordless-1.x.min.js"></script>

<!-- Latest patch release (recommended for production) -->
<script src="http://cdn.auth0.com/js/lock-passwordless-1.x.y.min.js"></script>
```

From [bower](http://bower.io)

```sh
bower install auth0-lock-passwordless
```

```html
<script src="bower_components/auth0-lock-passwordless/dist/auth0-lock-passwordless.min.js"></script>
```

From [npm](https://npmjs.org)

`Auth0LockPasswordless` distribution file is built using [browserify](http://browserify.org/). By installing via npm you will need to compile it or add it to your own build process.

```sh
npm install auth0-lock-passwordless
```

Browserify will need the following transforms to bundle the `auth0-lock-passwordless` module:

``` json
{
  "devDependencies": {
    "babelify": "^6.1.2",
    "browserify-css": "^0.6.1",
    "packageify": "^0.2.2"
  }
}
```

And you'll need to configure babelify with the following options:

```json
{
  "blacklist": [
    "regenerator"
  ],
  "optional": [
    "es7.functionBind",
    "es7.objectRestSpread"
  ]
}
```

Finally, make sure browserify consider files with the _.jsx_ extension as modules. This can be done with the `--extension=.jsx` option.

If you are targeting mobile audiences, it's recommended that you add:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
```

## API

### new Auth0LockPasswordless(clientID, domain)

Initializes a new instance of `Auth0LockPasswordless` configured with your application `clientID` and your account's `domain` at [Auth0](https://manage.auth0.com/).

- **clientID {String}**: Your application _clientID_ in Auth0.
- **domain {String}**: Your Auth0 _domain_. Usually _your-account.auth0.com_.

You can find this information at your [application settings](https://manage.auth0.com/#/applications).

#### Example

```javascript
var clientID = "YOUR_AUTH0_APP_CLIENTID";
var domain = "YOUR_DOMAIN_AT.auth0.com";
var lock = new Auth0LockPasswordless(clientID, domain);
```

### .magiclink(options, callback)

Opens a dialog that asks the user for an email address. Once entered, it will send an email containing a _magic link_ that allows the user to log in automatically.

- **options {Object}**: Allows to customize the dialog's appearance. See below for the details.
- **callback {Function}**: Will be invoked after an attempt to send the the email has been made. In case of success it will receive the entered email address.

#### Example

```javascript
// invoke magiclink without options or callback
lock.magiclink();

// invoke magiclink with an option that prevents the user from closing the
// dialog
lock.magiclink({closable: false});

// invoke magiclink with a callback function that displays an alert when the
// email has been sent.
lock.magiclink(function(error, email) {
  if (!error) {
    alert("A magic link has been sent to " + email);
  }
});

// invoke magiclink with options and callback
lock.magiclink({closable: false}, function(error, email) {
  if (!error) {
    alert("A magic link has been sent to " + email);
  }
});
```

### .emailcode(options, callback)

Opens a dialog that asks the user for an email address. Then, it will ask for a _code_ that has been sent in an email to the given address. The code will be used as a one-time password to log in.

- **options {Object}**: Allows to customize the dialog's appearance. See below for the details.
- **callback {Function}**: Will be invoked after an attempt to log the user in has been made.

#### Example

```javascript
// invoke emailcode without options or callback
lock.emailcode();

// invoke emailcode with an option that prevents the user from closing the
// dialog
lock.emailcode({closable: false});

// invoke emailcode with a callback function that displays an alert when the
// user has logged in.
lock.emailcode(function(error, profile, id_token, access_token, state, refresh_token) {
  if (!error) {
    alert("User has logged in");
  }
});

// invoke magiclink with options and callback
lock.emailcode({closable: false}, function(error, profile, id_token, access_token, state, refresh_token) {
  if (!error) {
    alert("User has logged in");
  }
});
```

### .sms(options, callback)

Opens a dialog that asks the user for a phone number. Then, it will ask for a _code_ that has been sent in an text message to the given number. The code will be used as a one-time password to log in.

- **options {Object}**: Allows to customize the dialog's appearance. See below for the details.
- **callback {Function}**: Will be invoked after an attempt to log the user in has been made.

#### Example

```javascript
// invoke sms without options or callback
lock.sms();

// invoke sms with an option that prevents the user from closing the dialog
lock.sms({closable: false});

// invoke sms with a callback function that displays an alert when the user has
// logged in.
lock.sms(function(error, profile, id_token, access_token, state, refresh_token) {
  if (!error) {
    alert("User has logged in");
  }
});

// invoke sms with options and callback
lock.sms({closable: false}, function(error, profile, id_token, access_token, state, refresh_token) {
  if (!error) {
    alert("User has logged in");
  }
});
```

### .close(callback)

Closes the dialog.

- **callback {Function}**: Will be invoked after the lock has been closed with no arguments.

#### Example

```javascript
// invoke close without a callback
lock.close();

// invoke close with a callback
lock.close(function() {
  alert("The Lock has been closed");
});
```

### .logout(query)

Log out an user.

<dl>
- **query {String}**: Query parameters that will be send with the request to log the user out.

#### Example

```javascript
// invoke logout without query parameters
lock.logout();

// invoke logout with query parameters
lock.logout({ref: window.location.href});
```

### UI Customization

The appearance of the widget can be customized with an `options` object which has one or more of the following properties. Each method that opens the dialog can take an `options` object as its first argument.

- **container {String}**: The `id` of the html element where the Lock will be rendered. This makes the Lock appear inline instead of in a modal window.
- **icon {String}**: Url for an image that will be placed in the Lock's header. Defaults to Auth0's logo.
- **closable {Boolean}**: Determines whether or not the Lock can be closed. It defaults to `false` when a `container` option is provided, otherwise it defaults to `true`.
- **defaultLocation {String}**: Country code that will be selected by default when entering a phone number, e.g. `"+54"`. When the same country code is used for several countries, the name of the country also needs to be specified, e.g. `"+1 United States"`, `"+1 Canada"` and so on.
- **focusInput {Boolean}**: Determines whether or not the first input on the screen, that is the email or phone number input, should have focus when the Lock is displayed. Defaults to `false` when a `container` option is provided or the Lock is being render on a mobile device. Otherwise it defaults to `true`.
- **gravatar {Boolean}**: Determines whether or not Gravatar images and user names should be displayed on the Lock's header once an email has been entered. Defaults to `true`.
- **terms {String}**: HTML fragment displayed in the footer that usually contains a link to the terms of service users agree by signing up. Defaults to the empty string `""`.

#### Example

```javascript
var options = {
  container: "myContainer",
  icon: "/path/to/my/icon.png",
  closable: false,
  focusInput: false,
  gravatar: false,
  terms: "By signing up, you agree to our <a href='/terms' target='_new'>terms of service</a>."
};
```

### Callbacks and Errors

 As a rule of thumb, all callbacks passed to a method that opens the Lock are invoked when the job of the Lock can be considered done. The first argument of the callback is reserved for an error object. If an error occurred, the callback will be invoked with just the error object. If no error occurred, the callback will be invoked with `null` as the first argument, followed by any number of arguments it needs.

 All error objects have an `error` and a `description` property. The first will contain a synthetic code used to identify the error, and the later will contain a more readable description. They may contain other useful properties according to the situation.

 See each method's documentation for the specifics.

## Browser Compatibility

We ensure browser compatibility in Chrome, Safari, Firefox and IE >= 9. We currently use [zuul](https://github.com/defunctzombie/zuul) along with [Saucelabs](https://saucelabs.com) to run integration tests on each push.

## Contributing

TODO

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Resources

TODO

[npm-image]: https://img.shields.io/npm/v/auth0-lock-passwordless.svg?style=flat-square
[npm-url]: https://npmjs.org/package/auth0-lock-passwordless
[strider-image]: https://ci.auth0.com/auth0/lock-passwordless/badge
[strider-url]: https://ci.auth0.com/auth0/lock-passwordless
[coveralls-image]: https://img.shields.io/coveralls/auth0/lock-passwordless.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/auth0/lock-passwordless?branch=master
[david-image]: http://img.shields.io/david/auth0/lock-passwordless.svg?style=flat-square
[david-url]: https://david-dm.org/auth0/lock-passwordless
[license-image]: http://img.shields.io/npm/l/auth0-lock-passwordless.svg?style=flat-square
[license-url]: #license
[downloads-image]: http://img.shields.io/npm/dm/auth0-lock-passwordless.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/auth0-lock-passwordless
