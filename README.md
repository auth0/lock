[![Build status][travis-image]][travis-url]
[![License][license-image]][license-url]

# Lock Next

[Auth0](https://auth0.com) is an authentication broker that supports social identity providers as well as enterprise identity providers such as Active Directory, LDAP, Google Apps, Salesforce.

Lock Next is an early access beta for the new [Lock](http://auth0.com/lock) release.

## Install

From CDN

```html
<!-- Latest patch release (recommended for production) -->
<script src="http://cdn.auth0.com/js/lock/10.0.0-beta.1/lock.min.js"></script>
```

From [bower](http://bower.io)

```sh
bower install auth0-lock#10.0.0-beta.1
```

```html
<script src="bower_components/auth0-lock/build/auth0-lock.min.js"></script>
```

From [npm](https://npmjs.org)

```sh
npm install auth0-lock@10.0.0-beta.1
```

After installing the `auth0-lock` module, you'll need bundle it up along with all of its dependencies. We have examples for [browserify](examples/bundling/browserify/) and [webpack](examples/bundling/webpack/).

If you are targeting mobile audiences, it's recommended that you add:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
```

## API

### new Auth0Lock(clientID, domain, options, callback)

Initializes a new instance of `Auth0Lock` configured with your application `clientID` and your account's `domain` at [Auth0](https://manage.auth0.com/). You can find this information at your [application settings](https://manage.auth0.com/#/applications).

- **clientId {String}**: Your application _clientId_ in Auth0.
- **domain {String}**: Your Auth0 _domain_. Usually _your-account.auth0.com_.
- **options {Object}**: Allows to customize the dialog's appearance and behavior. See [below](#customization) for the details.
- **callback {function}**: Will be invoked after an attempt to authenticate the user.

#### Example

```js
var clientId = "YOUR_AUTH0_APP_CLIENTID";
var domain = "YOUR_DOMAIN_AT.auth0.com";
var lock = new Auth0Lock(clientId, domain, {},
  function(error, result) {
    // Will always be executed. Execution will happen on a later frame, so the
    // `lock` variable and everything will be available on scope.
    if (error) {
      // Handle error
    }

    if (result) {
      // We need to check for a result, if there was an error `result` will be
      // undefined.

      // store the token and profile in local storage (or wherever you choose)
      localStorage.setItem('id_token', result.idToken);
      localStorage.setItem('profile', JSON.stringify(result.profile));
    }
});
```

### Customization

The appearance of the widget and the mechanics of authentication can be customized with an `options` object which has one or more of the following properties. Each method that opens the dialog can take an `options` object as its first argument.

#### UI options

- **autoclose {Boolean}**: Determines whether or not the Lock will be closed automatically after a successful sign in. If the Lock is not `closable` it won't be closed even if this option is set to `true`. Defaults to `false`.
- **autofocus {Boolean}**: Determines whether or not the first input on the screen, that is the email or phone number input, should have focus when the Lock is displayed. Defaults to `false` when a `container` option is provided or the Lock is being render on a mobile device. Otherwise it defaults to `true`.
- **avatar {Object}**: Determines whether or not an avatar and a user name should be displayed on the Lock's header once an email or username has been entered and how to obtain it. By default avatars are fetched from [Gravatar](http://gravatar.com/). Supplying `null` will disable the functionality. To fetch avatar from other provider see [below](#avatar-provider).
- **container {String}**: The `id` of the html element where the Lock will be rendered. This makes the Lock appear inline instead of in a modal window.
- **languageDictionary {Object}**: Allows to customize every piece of text displayed in the Lock. Defaults to `{}`. See below [Language Dictionary Specification](#language-dictionary-specification) for the details.
- **closable {Boolean}**: Determines whether or not the Lock can be closed. When a `container` option is provided its value is always `false`, otherwise it defaults to `true`.
- **popupOptions {Object}**: Allows to customize the location of the popup in the screen. Any [position and size feature](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Position_and_size_features) allowed by `window.open` is accepted. Defaults to `{}`.
- **rememberLastLogin {Boolean}**: Determines whether or not to show a screen that allows you to quickly log in with the account you used the last time. Defaults to `true`.
- **allowedConnections {Array}**: List of connection that will be available to perform the authentication. It defaults to all enabled connections.

#### Theming options

Theme options are grouped in the `theme` property of the `options` object.

```js
var options = {
  theme: {
    logo: "https://example.com/assets/logo.png",
    primaryColor: "green"
  }
};
```

- **logo {String}**: Url for an image that will be placed in the Lock's header. Defaults to Auth0's logo.
- **primaryColor {String}**: Defines the primary color of the Lock, all colors used in the widget will be calculated from it. This option is useful when providing a custom `logo` to ensure all colors go well together with the logo's color palette. Defaults to `"#ea5323"`.

#### Authentication options

Authentication options are grouped in the `auth` property of the `options` object.

```js
var options = {
  auth: {
   jsonp: false,
   params: {param1: "value1"},
   redirect: true,
   redirectUrl: "some url",
   responseType: "token",
   sso: true
  }
};
```

- **jsonp {Boolean}**: Use JSONP requests when calling Auth0's API. This setup is useful when no CORS allowed. Defaults to `false`.
- **params {Object}**: Specifies extra parameters that will be sent when starting a login. Defaults to `{}`.
- **redirect {Boolean}**: When set to `true`, the default, _redirect mode_ will be used. Otherwise, _popup mode_ is chosen. See [below](#popup-mode) for more details.
- **redirectUrl {String}**: The url Auth0 will redirect back after authentication. Defaults to the empty string `""` (no redirect URL).
- **responseType {String}**:  Should be set to `"token"` for Single Page Applications, and `"code"` otherwise. Defaults to `"code"` when `callbackURL` is provided, and to `"token"` otherwise.
- **sso {Boolean}**:  Determines whether Single Sign On is enabled or not. Defaults to `true`.

#### Social options

- **socialButtonStyle {String}**: Determines the size of the buttons for the social providers. It defaults to `"big"` when there are at most tree social providers enabled, otherwise it defaults to `"small"`.

#### Database options

- **additionalSignUpFields {Array}**: Allows to provide extra input fields during sign up. See [below](#additional-sign-up-field) more for details. Defaults to `[]`.
- **allowForgotPassword {Boolean}**: When set to `false` hides the _"Don't remember your password?"_ link in the _login screen_, making the _reset password screen_ unreachable. Defaults to `true`.
- **allowSignUp {Boolean}**: When set to `false` hides the _login and sign up tabs_ in the _login screen_, making the _sign up screen_ unreachable. Defaults to `true`.
- **initialScreen {String}**: Name of the screen that will be shown when the widget is opened. Valid values are `"signUp"`, `"forgotPassword"`, and defaults to `"login"`.
- **loginAfterSignUp {String}**: Determines whether or not the user will be automatically signed in after a successful sign up. Defaults to `true`.
- **forgotPasswordLink {String}**: URL for a page that allows the user to reset her password. When set to a non-empty string, the user will be linked to the provided URL when clicking the _"Don't remember your password?"_ link in the _login screen_.
- **prefill {Object}**: Allows to set the initial value for the _email_ and/or _username_ inputs, e.g. `{prefill: {email: "someone@auth0.com", username: "someone"}}`. When omitted no initial value will be provided.
- **signUpLink {String}**: URL for a page that allows the user to sign up. When set to a non-empty string, the user will be linked to the provided URL when clicking the _sign up_ tab in the _login screen_.
- **usernameStyle {String}**: Determines what will be used to identify the user. Possible values are `"username"` and `"email"`. Defaults to `"email"`.

#### Example

```js
var options = {
  container: "myContainer",
  closable: false,
  languageDictionary: {title: "My Company"},
  autofocus: false
};
```

#### Language Dictionary Specification

A language dictionary is an object that contains every piece of text the Lock needs to display. Different textual components are needed depending on what method you called to open the Lock. The following is an example of the language dictionary used by default:

```js
{
  forgotPassword: {
    emailInputPlaceholder: "yours@example.com",
    headerText: "Please enter your email and the new password. We will send you an email to confirm the password change.",
    usernameInputPlaceholder: "your username"
  },
  lastLogin: {
    headerText: "Last time you logged in with",
    skipLastLoginLabel: "Not your account?"
  },
  login: {
    emailInputPlaceholder: "yours@example.com",
    forgotPasswordLabel: "Don't remember your password?",
    headerText: "",
    loginTabLabel: "Login",
    loginWith: "Login with {idp}",
    passwordInputPlaceholder: "your password",
    separatorText: "or",
    signUpTabLabel: "Sign Up",
    smallSocialButtonsHeader: "Login with",
    usernameInputPlaceholder: "your username"
  },
  signUp: {
    emailInputPlaceholder: "yours@example.com",
    headerText: "",
    loginTabLabel: "Login",
    passwordInputPlaceholder: "your password",
    separatorText: "or",
    signUpTabLabel: "Sign Up",
    signUpWith: "Sign up with {idp}",
    usernameInputPlaceholder: "your username",
  },
  signedIn: {
    success: "Thanks for signing in."
  },
  signedUp: {
    success: "Thanks for signing up."
  },
  title: "Auth0",
  welcome: "Welcome {name}!"
}
```

When you construct the Lock you can override any value by providing a [languageDictionary option](#ui-options).

```js
var options = {
  signUp: {
    emailInputPlaceholder: "please enter you email",
  },
  title: "My Company"
};
```

The previous code will change the title displayed in the header and will display a footer in the sign up screen.

As you can see from the examples, some keys are _namespaced_ inside another object and some are not. In the first case, they are only used in a given screen, while in the latter can be used from any screen. Also, most of the values accept HTML tags. The exception are the the ones used as input placeholders.

#### Additional sign up fields

Extra input fields can be added to the sign up screen with the `additionalSignUpFields` option. Every input must have a `name` and a `placeholder`, an `icon` url and a `validator` function can also be provided. The fields are rendered below the regular sign up input fields in the order they are provided.

```js
var options = {
  additionalSignUpFields: [{
    name: "address",
    icon: "https://example.com/assests/address_icon.png",
    placeholder: "enter your address",
    validator: function(address) {
      return address.length > 10;
    }
  }]
}
```

#### Avatar provider

Lock can show avatars fetched from anywhere. A custom avatar provider can be specified with the `avatar` option by passing an object with the keys `url` and `displayName`. Both properties are functions that take an email and a callback function.

```js
var options = {
  avatar: {
    url: function(email, cb) {
      // obtain url for email, in case of error you call cb with the error in
      // the first arg instead of null
      cb(null, url);
    },
    displayName: function(email, cb) {
      // obtain displayName for email, in case of error you call cb with the
      // error in the first arg instead of null
      cb(null, displayName);
    }
  }
};
```

### Popup mode

A popup window can be displayed instead of redirecting the user to a social provider website. While this has the advantage of preserving page state, it has some issues. Often times users have popup blockers that prevent the login page from even displaying. There are also known issues with mobile browsers. For example, in recent versions of Chrome on iOS, the login popup does not get [closed properly](https://github.com/auth0/lock/issues/71) after login. For these reasons, we encourage developers to avoid this mode, even with Single Page Apps.

If you nevertheless decide to use it, you can activate popup mode by passing the option `auth: {redirect: false}` when constructing `Auth0Lock`.

```js
var clientId = "YOUR_AUTH0_APP_CLIENTID";
var domain = "YOUR_DOMAIN_AT.auth0.com";
var options = {
  auth: {
    redirect: false
  }
};

var lock = new Auth0LockPasswordless(clientId, domain, options,
  function(error, result) {
    // Will only be executed after an attempt to login has been made (contrast
    // this with redirect mode in which the function is always executed)
});
```


More information can be found in [Auth0's documentation](https://auth0.com/docs/libraries/lock/authentication-modes#popup-mode).

## Browser Compatibility

We ensure browser compatibility in Chrome, Safari, Firefox and IE >= 10. We currently use [zuul](https://github.com/defunctzombie/zuul) along with [Saucelabs](https://saucelabs.com) to run integration tests on each push.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.


[travis-image]: https://travis-ci.org/auth0/lock.svg?branch=v10
[travis-url]: https://travis-ci.org/auth0/lock

[npm-image]: https://img.shields.io/npm/v/auth0-lock-next.svg?style=flat-square
[npm-url]: https://npmjs.org/package/auth0-lock-next
[david-image]: http://img.shields.io/david/auth0/lock-next.svg?style=flat-square
[david-url]: https://david-dm.org/auth0/lock-next
[license-image]: http://img.shields.io/npm/l/auth0-lock-next.svg?style=flat-square
[license-url]: #license
[downloads-image]: http://img.shields.io/npm/dm/auth0-lock-next.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/auth0-lock-next
