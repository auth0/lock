# Lock Passwordless

[![NPM version][npm-image]][npm-url]
[![Build status][strider-image]][strider-url]
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

- **options {Object}**: Allows to customize the dialog's appearance and behavior. See [below](#customization) for the details.
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

- **options {Object}**: Allows to customize the dialog's appearance and behavior. See [below](#customization) for the details.
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

- **options {Object}**: Allows to customize the dialog's appearance and behavior. See [below](#customization) for the details.
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

### .getProfile(token, callback)

Fetches the full user profile.

- **token {String}**: User id token.
- **callback {Function}**: Will be invoked after the user profile been retrieved.

#### Example
```js
lock.getProfile(id_token, function(error, profile) {
  if (!error) {
    alert("hello " + profile.name);
  }
});
```

### .logout(query)

Log out an user.

- **query {String}**: Query parameters that will be send with the request to log the user out.

### .parseHash(hash)

Parses the hash containing `access_token` and `id_token` appended by Auth0 to the URL in redirect mode.

- **hash {string}**: Hash appended by Auth0 to the URL in redirect mode.

#### Example
```js
lock.parseHash(window.location.hash);
```

#### Example

```javascript
// invoke logout without query parameters
lock.logout();

// invoke logout with query parameters
lock.logout({ref: window.location.href});
```

### Customization

The appearance of the widget and the mechanics of authentication can be customized with an `options` object which has one or more of the following properties. Each method that opens the dialog can take an `options` object as its first argument.

#### UI options

- **autoclose {Boolean}**: Determines whether or not the Lock will be closed automatically after a successful sign in. If the Lock is not `closable` it won't be closed even if this option is set to `true`. Defaults to `false`.
- **container {String}**: The `id` of the html element where the Lock will be rendered. This makes the Lock appear inline instead of in a modal window.
- **dict {Object}**: Allows to customize every piece of text displayed in the Lock. Defaults to `{}`. See below [Dict Specification](#dict-specification) for the details.
- **icon {String}**: Url for an image that will be placed in the Lock's header. Defaults to Auth0's logo.
- **closable {Boolean}**: Determines whether or not the Lock can be closed. When a `container` option is provided its value is always `false`, otherwise it defaults to `true`.
- **defaultLocation {String}**: [ISO country code](http://www.iso.org/iso/country_codes) of the country that will be selected by default when entering a phone number. Defaults to `"US"`.
- **focusInput {Boolean}**: Determines whether or not the first input on the screen, that is the email or phone number input, should have focus when the Lock is displayed. Defaults to `false` when a `container` option is provided or the Lock is being render on a mobile device. Otherwise it defaults to `true`.
- **fillMode {Boolean}**: Determines whether or not the Lock will expand to fill the full width of its container element when the `container` is provided. Defaults to `false`.
- **gravatar {Boolean}**: Determines whether or not Gravatar images and user names should be displayed on the Lock's header once an email has been entered. Defaults to `true`.
- **primaryColor {String}**: Defines the primary color of the Lock, all colors used in the widget will be calculated from it. This option is useful when providing a custom `icon` to ensure all colors go well together with the icon's color palette. Defaults to `"#ea5323"`.
- **rememberLastLogin {Boolean}**: Determines whether or not the email or the phone number will be filled automatically with the one you used the last time. Defaults to `true`.

#### Authentication options

- **authParams {Object}**: Specifies extra parameters that will be sent when starting a login. Defaults to `{}`.
- **callbackURL {String}**: The url Auth0 will redirect back after authentication. Defaults to `location.href`.
- **forceJSONP {Boolean}**: Force JSONP requests for all requests to Auth0. This setup is useful when no CORS allowed. Defaults to `false`.
- **responseType {String}**:  Should be set to `"token"` for Single Page Applications, and `"code"` otherwise. Defaults to `"code"` when `callbackURL` is provided, and to `"token"` otherwise.

#### Example

```js
var options = {
  container: "myContainer",
  icon: "/path/to/my/icon.png",
  closable: false,
  dict: {title: "My Company"},
  focusInput: false,
  gravatar: false
};
```

#### Dict Specification

A dict, short for dictionary, is an object that contains every piece of text the Lock needs to display. Different textual components are needed depending on what method you called to open the Lock. The following is an example of the dict used when the Lock is opened with the `emailcode` method:

```js
{
  code: {
    codeInputPlaceholder: "Your code",
    footerText: "",
    headerText: "Please check your email ({email})<br />You've received a message from us<br />with your passcode."
  },
  confirmation: {
    success: "Thanks for signing in."
  },
  email: {
    emailInputPlaceholder: "yours@example.com",
    footerText: "",
    headerText: "Enter your email to sign in or sign up."
  },
  title: "Auth0",
  welcome: "Welcome {name}!"
}
```

When you open the Lock with `emailcode` or any other method available, you can override any value by providing a [dict option](#ui-options).

```js
lock.emailcode({
  email: {
    footerText: "You must agree to our <a href='/terms' target='_new'>terms of service</a>"
  },
  title: "My Company"
});
```

The previous code will change the title displayed in the header and will display a footer when the Lock is asking the user for the email.

As you can see from the examples, some keys are _namespaced_ inside another object and some are not. In the first case, they are only used in a given screen, while in the latter can be used from any screen. Also, most of the values accept HTML tags. The exception are the the ones used as input placeholders. Finally, some strings can be interpolated, which means that they contain a placeholder which will be replaced before being displayed. For instance:

```js
lock.emailcode({
  code: {
    headerText: "The code has been sent to {email}"
  }
});
```

Will cause the Lock to show the message _"The code has been sent to someone@auth0.com"_ when asking for the verification code to a user that entered the email _"someone@auth0.com"_.

You can check the [source code](src/dict/dicts.js) to see the actual dictionaries used by the Lock.

### Callbacks and Errors

 As a rule of thumb, all callbacks passed to a method that opens the Lock are invoked when the job of the Lock can be considered done. The first argument of the callback is reserved for an error object. If an error occurred, the callback will be invoked with just the error object. If no error occurred, the callback will be invoked with `null` as the first argument, followed by any number of arguments it needs.

 All error objects have an `error` and a `description` property. The first will contain a synthetic code used to identify the error, and the later will contain a more readable description. They may contain other useful properties according to the situation.

 See each method's documentation for the specifics.

## Browser Compatibility

We ensure browser compatibility in Chrome, Safari, Firefox and IE >= 10, and working to support IE9. We currently use [zuul](https://github.com/defunctzombie/zuul) along with [Saucelabs](https://saucelabs.com) to run integration tests on each push.

## Contributing

Clone the repo and run the following commands:

```
npm install
npm start
```

Changes to the source code will be automatically rebuilt. To see the result, point your favorite browser to [http://localhost:3000/playground/](http://localhost:3000/playground/).

However, testing changes that way can be cumbersome because there are HTTP request involved which are being rate-limited. If your changes are scoped to the UI, you will be better off running:

```
npm run design
```

And pointing your browser to [http://localhost:3000/design/](http://localhost:3000/design/). It behaves just like `npm start` but requests to the [Auth0](https://auth0.com) API will be simulated.


### Running the tests

Tests can be run in [PhantomJS](http://phantomjs.org/) or in a web browser with the following commands:

```
npm run test:phantom
npm run test:browser
```

### Releasing a new version

Whenever a new commit is pushed to _master_, the CI will attempt to deploy a new release to [Github](https://github.com) and [npm](https://www.npmjs.com) if the tests pass and there isn't already a release for the version specified in the [package.json](package.json) file. See [bin/deploy](bin/deploy) for the details.

There is also a convenient [script](bin/version) to prepare a new release:

```
bin/version {patch,minor,major}
```

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub [issue tracker](https://github.com/auth0/lock-passwordless/issues). The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.



[npm-image]: https://img.shields.io/npm/v/auth0-lock-passwordless.svg?style=flat-square
[npm-url]: https://npmjs.org/package/auth0-lock-passwordless
[strider-image]: https://ci.auth0.com/auth0/lock-passwordless/badge
[strider-url]: https://ci.auth0.com/auth0/lock-passwordless
[david-image]: http://img.shields.io/david/auth0/lock-passwordless.svg?style=flat-square
[david-url]: https://david-dm.org/auth0/lock-passwordless
[license-image]: http://img.shields.io/npm/l/auth0-lock-passwordless.svg?style=flat-square
[license-url]: #license
[downloads-image]: http://img.shields.io/npm/dm/auth0-lock-passwordless.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/auth0-lock-passwordless
