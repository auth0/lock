[![NPM version][npm-image]][npm-url]
[![Build status][circleci-image]][circleci-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

# Lock

[Auth0](https://auth0.com) is an authentication broker that supports social identity providers as well as enterprise identity providers such as Active Directory, LDAP, Google Apps, Salesforce.

## Install

From CDN

```html
<!-- Latest patch release (recommended for production) -->
<script src="http://cdn.auth0.com/js/lock/10.19.0/lock.min.js"></script>
```

From [npm](https://npmjs.org)

```sh
npm install auth0-lock
```

After installing the `auth0-lock` module, you'll need bundle it up along with all of its dependencies. We have examples for [browserify](examples/bundling/browserify/) and [webpack](examples/bundling/webpack/).

If you are targeting mobile audiences, it's recommended that you add:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
```

## API

### new Auth0Lock(clientID, domain, options)

Initializes a new instance of `Auth0Lock` configured with your application `clientID` and your account's `domain` at [Auth0](https://manage.auth0.com/). You can find this information at your [application settings](https://manage.auth0.com/#/applications).

- **clientId {String}**: Your application _clientId_ in Auth0.
- **domain {String}**: Your Auth0 _domain_. Usually _your-account.auth0.com_.
- **options {Object}**: Allows to customize the dialog's appearance and behavior. See [below](#customization) for the details.

#### Example

```js
var clientId = "YOUR_AUTH0_APP_CLIENTID";
var domain = "YOUR_DOMAIN_AT.auth0.com";
var lock = new Auth0Lock(clientId, domain);

lock.on("authenticated", function(authResult) {
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem("accessToken", authResult.accessToken);
    localStorage.setItem("profile", JSON.stringify(profile));

    // Update DOM
  });
});
```

### getProfile(idToken, callback)

> *Note:* this method is soon to be deprecated, use `getUserInfo` instead.

Once the user has logged in and you are in possesion of an id token, you can obtain the profile with `getProfile`.

- **idToken {String}**: User id token.
- **callback {Function}**: Will be invoked after the user profile been retrieved.

### getUserInfo(accessToken, callback)

Once the user has logged in and you are in possesion of an access token, you can obtain the profile with `getUserInfo`.

- **accessToken {String}**: User access token.
- **callback {Function}**: Will be invoked after the user profile been retrieved.

#### Example

```js
lock.getUserInfo(accessToken, function(error, profile) {
  if (!error) {
    alert("hello " + profile.name);
  }
});
```

### on(event, callback)

Lock will emit events during its lifecycle.

- `show`: emitted when Lock is shown. Has no arguments.
- `hide`: emitted when Lock is hidden. Has no arguments.
- `unrecoverable_error`: emitted when there is an unrecoverable error, for instance when no connection is available. Has the error as the only argument.
- `authenticated`: emitted after a successful authentication. Has the authentication result as the only argument.
- `authorization_error`: emitted when authorization fails. Has error as the only argument.
- `hash_parsed`: every time a new Auth0Lock object is initialized in redirect mode (the default), it will attempt to parse the hash part of the url looking for the result of a login attempt. This is a _low level_ event for advanced use cases and _authenticated_ and _authorization_error_ should be preferred when possible. After that this event will be emitted with `null` if it couldn't find anything in the hash. It will be emitted with the same argument as the `authenticated` event after a successful login or with the same argument as `authorization_error` if something went wrong. This event won't be emitted in popup mode because there is no need to parse the url's hash part.
- `forgot_password ready`: emitted when the "Forgot password" screen is shown.
- `forgot_password submit`: emitted when the user clicks on the submit button of the "Forgot password" screen.
- `signin submit`: emitted when the user clicks on the submit button of the "Login" screen.
- `signup submit`: emitted when the user clicks on the submit button of the "Sign up" screen.
- `federated login`: emitted when the user clicks on a social connection button. Has the connection name and the strategy as arguments. 

### show(options)

Displays the widget, allowing to override some options.

- **options {Object}**: Allows to customize some aspect of the dialog's appearance and behavior. The options allowed in here are subset of the options allowed in the constructor and will override them: `allowedConnections`, `auth.params`, `allowLogin`, `allowSignUp`, `allowForgotPassword`, `initialScreen`, `rememberLastLogin` and `flashMessage`. See [below](#customization) for the details. Keep in mind that `auth.params` will be fully replaced and not merged.

#### Example

```js
// without options
lock.show();

// will override the allowedConnections option passed to the constructor, if any
lock.show({allowedConnections: ["twitter", "facebook"]})

// will override the entire auth.params object passed to the constructor, if any
lock.show({auth: {params: {state: 'auth_state'}}})
```

### resumeAuth(hash, callback)

If you set the [auth.autoParseHash](#authentication-options) option to `false`, you'll need to call this method to complete the authentication flow. This method is useful when you're using a client-side router that uses a `#` to handle urls (angular2 with `useHash` or react-router with `hashHistory`).
- **hash {String}**: The hash fragment received from the redirect.
- **callback {Function}**: Will be invoked after the parse is done. Has an error (if any) as the first argument and the authentication result as the second one. If there is no hash available, both arguments will be `null`.

#### Example

```js
lock.resumeAuth(hash, function(error, authResult) {
  if (error) {
    alert("Could not parse hash");
  }
  console.log(authResult.accessToken);
});
```

### logout(options)

Logs out the user

- **options {Object}**: This is optional and follows the same rules as [this](https://auth0.com/docs/libraries/auth0js#logout)

#### Example

```js
lock.logout({ returnTo: 'https://myapp.com/bye-bye' });
```

## OIDC Conformant Mode

It is strongly encouraged that Lock be used in OIDC Conformant mode when embedding it directly in your application. When this mode is enabled, it will force Lock to use Auth0's current authentication pipeline and will prevent it from reaching legacy endpoints. This mode is not required when using Lock at Auth0's [hosted login page]().

To enable OIDC conformant mode, pass a flag in the options object.

```js
var lockOptions = {
  oidcConformant: true
}
```

Using OIDC Conformant mode in Lock necessitates a cross-origin authentication flow which makes use of third party cookies to process the authentication transaction securely. Ensure that **Cross-Origin Authentication** is enabled by switching it on in the [settings]() for your client in the Auth0 dashboard.

For more information, please see the [OIDC adoption guide]() and the [cross-origin authentication doc]().

### Customization

The appearance of the widget and the mechanics of authentication can be customized with an `options` object which has one or more of the following properties. Each method that opens the dialog can take an `options` object as its first argument.

#### UI options

- **allowedConnections {Array}**: List of connection that will be available to perform the authentication. It defaults to all enabled connections.
- **autoclose {Boolean}**: Determines whether or not the Lock will be closed automatically after a successful sign in. If the Lock is not `closable` it won't be closed even if this option is set to `true`. Defaults to `false`.
- **autofocus {Boolean}**: Determines whether or not the first input on the screen, that is the email or phone number input, should have focus when the Lock is displayed. Defaults to `false` when a `container` option is provided or the Lock is being render on a mobile device. Otherwise it defaults to `true`.
- **avatar {Object}**: Determines whether or not an avatar and a user name should be displayed on the Lock's header once an email or username has been entered and how to obtain it. By default avatars are fetched from [Gravatar](http://gravatar.com/). Supplying `null` will disable the functionality. To fetch avatar from other provider see [below](#avatar-provider).
- **container {String}**: The `id` of the html element where the Lock will be rendered. This makes the Lock appear inline instead of in a modal window.
- **language {String}**: Specifies the language of the widget. Defaults to `"en"`. Supported languages are:
  - `de`: German
  - `en`: English
  - `es`: Spanish
  - `it`: Italian
  - `nb`: Norwegian bokmål
  - `pt-BR`: Brazilian Portuguese
  - `ru`: Russian
  - `zh`: Chinese
  - `ja`: Japanese
  - [Check all the available languages](https://github.com/auth0/lock/tree/master/src/i18n)
- **languageDictionary {Object}**: Allows to customize every piece of text displayed in the Lock. Defaults to `{}`. See below [Language Dictionary Specification](#language-dictionary-specification) for the details.
- **closable {Boolean}**: Determines whether or not the Lock can be closed. When a `container` option is provided its value is always `false`, otherwise it defaults to `true`.
- **popupOptions {Object}**: Allows to customize the location of the popup in the screen. Any [position and size feature](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Position_and_size_features) allowed by `window.open` is accepted. Defaults to `{}`.
- **rememberLastLogin {Boolean}**: Determines whether or not to show a screen that allows you to quickly log in with the account you used the last time when the `initialScreen` option is set to to `"login"` (the default). Defaults to `true`.
- **flashMessage {Object}**: Shows an `error` or `success` flash message when Lock is shown.
  + **type {String}**: The message type, it should be `error` or `success`.
  + **text {String}**: The text to show.
- **allowAutocomplete {Boolean}**: Determines whether or not the the email or username inputs will allow autocomplete (`<input autocomplete />`). Defaults to `false`.
- **scrollGlobalMessagesIntoView {Boolean}**: Determines whether or not a globalMessage should be scrolled into the user's viewport. Defaults to `true`.
- **allowShowPassword {Boolean}**: Determines whether or not add a checkbox to show the password when typing it. Defaults to `false`.


#### Theming options

Theme options are grouped in the `theme` property of the `options` object.

```js
var options = {
  theme: {
    labeledSubmitButton: false,
    logo: "https://example.com/assets/logo.png",
    primaryColor: "green",
    authButtons: {
      connectionName: {
        displayName: "...", 
        primaryColor: "...", 
        foregroundColor: "...", 
        icon: "http://.../logo.png"
      }
    }
  }
};
```

- **labeledSubmitButton {Boolean}**: Indicates whether or not the submit button should have a label. Defaults to `true`. When set to `false` a icon will be shown. The labels can be customized through the `languageDictionary`.
- **logo {String}**: Url for an image that will be placed in the Lock's header. Defaults to Auth0's logo.
- **primaryColor {String}**: Defines the primary color of the Lock, all colors used in the widget will be calculated from it. This option is useful when providing a custom `logo` to ensure all colors go well together with the logo's color palette. Defaults to `"#ea5323"`.
- **authButtons {Object}**: Allows the customization of the custom oauth2 login buttons.
  + **displayName {String}**: The name to show instead of the connection name.
  + **primaryColor {String}**: The button's background color. Defaults to `"#eb5424"`.
  + **foregroundColor {String}**: The button's text color. Defaults to `"#FFFFFF"`.
  + **icon {String}**: The icon's url for the connection. For example:`"http://site.com/logo.png"`.

#### Authentication options

Authentication options are grouped in the `auth` property of the `options` object.

```js
var options = {
  auth: {
   params: {param1: "value1"},
   autoParseHash: true,
   redirect: true,
   redirectUrl: "some url",
   responseMode: "form_post",
   responseType: "token",
   sso: true,
   connectionScopes: {
    connectionName: [ 'scope1', 'scope2' ]
   }
  }
};
```

- **params {Object}**: Specifies extra parameters that will be sent when starting a login. Defaults to `{}`.
- **autoParseHash {Boolean}**: When set to `true`, Lock will parse the `window.location.hash` string when instantiated. If set to `false`, you'll have to manually resume authentication using the [resumeAuth](#resumeauthhash-callback) method.
- **redirect {Boolean}**: When set to `true`, the default, _redirect mode_ will be used. Otherwise, _popup mode_ is chosen. See [below](#popup-mode) for more details.
- **redirectUrl {String}**: The url Auth0 will redirect back after authentication. Defaults to the empty string `""` (no redirect URL).
- **responseMode {String}**:  Should be set to `"form_post"` if you want the code or the token to be transmitted via an HTTP POST request to the `redirectUrl` instead of being included in its query or fragment parts. Otherwise, it should be ommited.
- **responseType {String}**:  Should be set to `"token"` for Single Page Applications, and `"code"` otherwise. Also, `"id_token"` is supported for the first case. Defaults to `"code"` when `redirectUrl` is provided, and to `"token"` otherwise.
- **sso {Boolean}**:  Determines whether Single Sign On is enabled or not in **Lock**. The Auth0 SSO session will be created regardless of this option if SSO is enabled for your client or tenant.
- **connectionScopes {Object}**:  Allows to set scopes to be sent to the oauth2/social connection for authentication.

#### Social options

- **socialButtonStyle {String}**: Determines the size of the buttons for the social providers. Possible values are `"big"` and `"small"`. The default style depends on the connections that are available:
  - If only social connections are available, it will default to `"big"` when there are 5 connections at most, and default to `"small"` otherwise.
  - If connections from types other than social are also available, it will default to `"big"` when there are 3 social connections at most, and default to `"small"` otherwise.

#### Database options

- **additionalSignUpFields {Array}**: Allows to provide extra input fields during sign up. See [below](#additional-sign-up-fields) more for details. Defaults to `[]`.
- **allowLogin {Boolean}**: When set to `false` the widget won't display the _login screen_. This is useful if you want to use the widget just for sign ups (the _login and sign up tabs_ in the _sign up screen_ will be hidden) or to reset passwords (the _back button_ in the _forgot password screen_ will be hidden). In such cases you may also need to specify the `initialScreen`, `allowForgotPassword` and `allowSignUp` options. It defaults to `true`.
- **allowForgotPassword {Boolean}**: When set to `false` hides the _"Don't remember your password?"_ link in the _login screen_, making the _forgot password screen_ unreachable. Defaults to `true`. Keep in mind that if you are using a database connection with a _custom database_ which doesn't have a _change password script_ the forgot password screen won't be available.
- **allowSignUp {Boolean}**: When set to `false` hides the _login and sign up tabs_ in the _login screen_, making the _sign up screen_ unreachable. Defaults to `true`. Keep in mind that if the database connection has sign ups _disabled_ or you are using a _custom database_ with coesn't have a _create script_, then the sign up screen won't be available.
- **defaultDatabaseConnection {String}**: Specifies the database connection that will be used when there is more than one available.
- **initialScreen {String}**: Name of the screen that will be shown when the widget is opened. Valid values are `"login"`, `"signUp"`, and `"forgotPassword"`. If this option is left unspecified, the widget will pick the first screen that is available from the previous list. Is recommended that you set `allowLogin` to `"false"` when you set `initialScreen` to `"forgotPassword"`, otherwise a back button will be shown in the forgot password screen and it might not be clear to the user where is she/he going back.
- **loginAfterSignUp {Boolean}**: Determines whether or not the user will be automatically signed in after a successful sign up. Defaults to `true`.
- **forgotPasswordLink {String}**: URL for a page that allows the user to reset her password. When set to a non-empty string, the user will be linked to the provided URL when clicking the _"Don't remember your password?"_ link in the _login screen_.
- **mustAcceptTerms {Boolean}**: When set to `true` displays a checkbox input along the terms and conditions that must be checked before signing up. The terms and conditions can be specified via the `languageDictionary` option, see the example below. Defaults to `false`.
- **prefill {Object}**: Allows to set the initial value for the _email_ and/or _username_ inputs, e.g. `{prefill: {email: "someone@auth0.com", username: "someone"}}`. When omitted no initial value will be provided.
- **signUpLink {String}**: URL for a page that allows the user to sign up. When set to a non-empty string, the user will be linked to the provided URL when clicking the _sign up_ tab in the _login screen_.
- **usernameStyle {String}**: Determines what will be used to identify the user for a Database connection that has the `requires_username` flag set, otherwise it will be ignored. Possible values are `"username"` and `"email"` and by default both `username` and `email` are allowed.

#### Enterprise options

- **defaultEnterpriseConnection {String}**: Specifies the enterprise connection which allows to login using an username and a password that will be used when there is more than one available or there is a database connection. If a `defaultDatabaseConnection` is provided the database connection will be used and this option will be ignored.

#### Example

```js
var options = {
  container: "myContainer",
  closable: false,
  languageDictionary: {
    signUpTerms: "I agree to the <a href='/terms' target='_new'>terms of service</a> and <a href='/privacy' target='_new'>privacy policy</a>.",
    title: "My Company",
  },
  autofocus: false
};
```

#### Other options

- **configurationBaseUrl {String}**: Overrides client settings base url. By default it uses Auth0's CDN url when `domain` has the format `*.auth0.com`. Otherwise, it uses the provided `domain`.
- **languageBaseUrl {String}**: Overrides the language source url for Auth0's provided translations. By default it uses to Auth0's CDN url `https://cdn.auth0.com`.
- **hashCleanup {Boolean}**: When enabled, it will remove the hash part of the callback url after the user authentication. Defaults to `true`.
- **connectionResolver {Function}**: When in use, provides an extensibility point to make it possible to choose which connection to use based on the username information. Has `username`, `context` and `callback` as parameters. The callback expects an object like: `{type: 'database', name: 'connection name'}`. **This only works for database connections.** Keep in mind that this resolver will run in the username/email input's `onBlur` event, so keep it simple and fast. **This is a beta feature. If you find a bug, please open a github [issue](https://github.com/auth0/lock/issues/new).**

```js
var options = {
  connectionResolver: function (username, context, cb) {
    var domain = username.includes('@') && username.split('@')[1];
    if (domain) {
      // If the username is test@auth0.com, the connection used will be the `auth0.com` connection.
      // Make sure you have a database connection with the name `auth0.com`.
      cb({ type: 'database', name: domain });
    } else {
      // Use the default approach to figure it out the connection
      cb(null);
    }
  }
}
```

#### Language Dictionary Specification

A language dictionary is an object that allows you to customize every piece of text the Lock needs to display. For instance, the following code will change the title displayed in the header and the placeholder for the email field.


```js
var options = {
  languageDictionary: {
    emailInputPlaceholder: "please enter you email",
    title: "My Company"
  },
};
```

#### Additional sign up fields

Extra input fields can be added to the sign up screen with the `additionalSignUpFields` option. Every input must have a `name` and a `placeholder`, and an `icon` url can also be provided. Also, the initial value can be provided with the `prefill` option, which can be a **string** with the value or a **function** that obtains it. Other options depend on the type of the field, which is defined via the `type` option and defaults to `"text"`.

The new fields are rendered below the regular sign up input fields in the order they are provided.

##### Text field

A `validator` function can also be provided.


```js
var options = {
  additionalSignUpFields: [{
    name: "address",
    placeholder: "enter your address",
    // The following properties are optional
    icon: "https://example.com/assests/address_icon.png",
    prefill: "street 123",
    validator: function(address) {
      return {
         valid: address.length >= 10,
         hint: "Must have 10 or more chars" // optional
      };
    }
  }]
}
```

##### Select field

To specify a select field `type: "select"` needs to be provided along with the `options` property.

```js
var options = {
  additionalSignUpFields: [{
    type: "select",
    name: "location",
    placeholder: "choose your location",
    options: [
      {value: "us", label: "United States"},
      {value: "fr", label: "France"},
      {value: "ar", label: "Argentina"}
    ],
    // The following properties are optional
    icon: "https://example.com/assests/location_icon.png",
    prefill: "us"
  }]
}
```

The `options` and the `prefill` value can be provided through a function.

```js
var options = {
  additionalSignUpFields: [{
    type: "select",
    name: "location",
    placeholder: "choose your location",
    options: function(cb) {
      // obtain options, in case of error you call cb with the error in the
      // first arg instead of null
      cb(null, options);
    },
    icon: "https://example.com/assests/location_icon.png",
    prefill: function(cb) {
      // obtain prefill, in case of error you call cb with the error in the
      // first arg instead of null
      cb(null, prefill);
    }
  }]
}
```


##### Checkbox field

To specify a checkbox field use: `type: "checkbox"`
The `prefill` value can determine the default state of the checkbox and it is required.

```js
var options = {
  additionalSignUpFields: [{
    type: "checkbox",
    name: "newsletter",
    prefill: "true",
    placeholder: "I hereby agree that I want to receive marketing emails from your company",
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

var lock = new Auth0Lock(clientId, domain, options);
lock.show();
```


More information can be found in [Auth0's documentation](https://auth0.com/docs/libraries/lock/v10/popup-mode).

## Browser Compatibility

We ensure browser compatibility in Chrome, Safari, Firefox and IE >= 10. We currently use [zuul](https://github.com/defunctzombie/zuul) along with [Saucelabs](https://saucelabs.com) to run integration tests on each push.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.


[circleci-image]: https://img.shields.io/circleci/project/github/auth0/lock.svg?style=flat-square
[circleci-url]: https://circleci.com/gh/auth0/lock/tree/master
[npm-image]: https://img.shields.io/npm/v/auth0-lock.svg?style=flat-square
[npm-url]: https://npmjs.org/package/auth0-lock
[license-image]: http://img.shields.io/npm/l/auth0-lock.svg?style=flat-square
[license-url]: #license
[downloads-image]: http://img.shields.io/npm/dm/auth0-lock.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/auth0-lock
[david-image]: https://david-dm.org/auth0/lock/status.svg?style=flat-square
[david-url]: https://david-dm.org/auth0/lock
