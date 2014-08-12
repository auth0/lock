# Auth0Lock

[![NPM version](https://badge.fury.io/js/auth0-lock.js.png)](http://badge.fury.io/js/auth0-lock.js)

[Auth0](https://auth0.com) is an authentication broker that supports social identity providers as well as enterprise identity providers such as Active Directory, LDAP, Google Apps, Salesforce.

The Auth0 Lock makes it easy to integrate SSO in your app. You won't have to worry about:
* Having a professional looking login dialog that displays well on any resolution and device.
* Finding the right icons for popular social providers.
* Remembering what was the identity provider the user chose the last time.
* Solving the home realm discovery challenge with enterprise users (i.e.: asking the enterprise user the email, and redirecting to the right enterprise identity provider).
* Implementing a standard sign in protocol (OpenID Connect / OAuth2 Login)

[![Auth0](https://i.cloudup.com/fKuIOiaPrL.png)](http://auth0.com)

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

var lock = new Auth0Lock(clientID, domain);

// Or with options
var lock = new Auth0Lock(clientID, domain, {
  forceJSONP: true,
  callbackOnLocationHash: true',
  callbackURL: 'http://my-app.com/callback'
});

// And then you can handle to show and hide Auth0Lock
lock.show();    // show with default options
lock.showSignin();  // ... only signin
lock.showSignup();  // ... only signup
lock.showReset();   // ... only reset
lock.hide();        // hide
lock.logout();      // logout

```

## API

### **Auth0Lock(clientID, domain[, options])**

Initialize `Auth0Lock` for `clientID` and `domain` with `options.


#### Required parameters:
- **clientID**: [String] - Your application clientID in Auth0.
- **domain**: [String] - Your Auth0 domain. Usually ```<account>.auth0.com```.

#### Options:
- **callbackURL**: [Boolean] - the url auth0 will redirect back after authentication.
- **callbackOnLocationHash**: [Boolean] - `true` for Single Page Applications, otherwise `false`. Default is `false`.
- **forceJSONP**: [Boolean] - Force JSONP requests for all `auth0-js` instance requests. Default is `false`
- **cdn**: [String] - Use as CDN base url. Defaults to `domain` if it doesn't equal `*.auth0.com`
- **assetsUrl**: [String] Use as assets base url. Defaults to `domain` if it doesn't equal `*.auth0.com`

### **.show(options[, callback])**

Open the widget on `signin` mode  with `signup` and `reset` button actions if enabled on connection configuration.


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


## Options:

### User configurable

| Name                    | Type            | Description
|:----------------------- |:---------------:|:------------
| connections             | [Array]         | Filter configured connections for the Auth0's application by `connections` list.
| container               | [String]        | Element's id to insert the widget in DOM.
| dict                    | [String|Object] | Supported language alias ( eg: `es`|`it`|`pt`) or dictionary object with [supported](https://github.com/auth0/lock/blob/mastei18n/en.json) keys. Defaults to `en`.
| disableSignupAction     | [Boolean]       | Force hide signup button action. Defaults to `false` on `.show`, and `true` on every other `.show*()` action.
| signupLink              | [String]        | Set `signup` button action link to `signupLink`. When set, forces `disableSignupAction` to `false`.
| disableResetAction      | [Boolean]       | Force hide reset button action. Defaults to `false` on `.show`, and `true` on every other `.show*()` action.
| resetLink               | [String]        | Set `reset` button action link to `forgotLink`. When set, forces `disableResetAction` to `false`.
| focusInput              | [Boolean]       | Resolves whether focus or not the *email|username* input when shown. Defaults to `false` when mobile or embeded mode, `true` iother cases.
| popup                   | [Boolean]       | Enable popup mode. Defaults to `false`. When a `callback` is provided it's set to `true` and enables `no-redirect` mode fosigning in.
| popupOptions            | [Object]        | Options for the `window.open` parameters.
| extraParameters         | [Object]        | List of parameters for `auth0.js` API call request.
| sso                     | [Boolean]       |  Sets a cookie used for single sign on. This only applies to Database Connections when using `popup: true`. The cookie will bused later to show the "Last time you signed in with ..."
| closable                | [Boolean]       | Enable/disable closable feature when not embeded in DOM. Defaults to `true`.
| rememberLastLogin       | [Boolean]       | Ask for SSO data and enable **last time you signed in with[...]** message. Defaults to `true`
| enableADRealmDiscovery  | [Boolean]       | ???
| username_style          | [String]        | Set `username` input `type` to either `username` or `email`. Defaults to `email`.
| title                   | [String]        | Set widget's heading to `title`.
| socialBigButtons        | [Boolean]       | Force large social buttons insted of icons. Defaults to `true` for less than 4, and `false` for more than 3.
| userPwdConnectionName   | [String]        | When multiple database connections enabled force `signin`/`signup`/`reset` to the one described here. If not provided, defaultto the first on list of connections. Shall be renamed to just `forceDatabase`. |

### Internally resolved

| Name                    | Type            | Description
|:----------------------- |:---------------:|:------------
| popupCallback           | [Function]      | Internally setted from `callback` parameter.

## Customize the look and feel

Apply your own style to the elements.

All classes and ids are prefixed with `a0-` to avoid conflicts with your own stylesheets.

Send us an screenshot! We would love to see what you can do.

## Example

The example directory has a ready-to-go app. In order to run it you need [node](http://nodejs.org/) installed and **grunt** (`npm i grunt -g`), then execute `grunt example` from the root of this project.

## Browser Compatibility

We are using [BrowserStack](http://browserstack.com) to run the test suite on multiple browsers on every push.

## Development

To run the tests that don't require [BrowserStack](http://browserstack.com), first install `npm install -g testem` and then run `grunt test`.

To run the entire test suite run `grunt dev` and point your browser to `http://localhost:9999/test_harness.html`.


### Run integration tests

Remove previously existing instances of `browserstack-cli`:

```sh
npm remove -g browserstack-cli
```

Install the following `browserstack-cli` fork:

```sh
npm install -g https://github.com/jfromaniello/browserstack-cli/tarball/master
```
Remove the old `~/.browserstack` folder to download the jarfile again:

```sh
rm -rf ~/.browserstack
```

Setup browserstack:
```sh
browserstack setup
```

There, you will be prompted for `Username`, `Password`, `Tunnel private key` and `Tunnel API key`. Reach out to somebody at Auth0 in order to get those credentials.

Finally, after doing that, to run the tests:

```sh
npm test
```

#### Troubleshooting

* Problem: **message: Invalid or corrupt jarfile `~/.browserstack/BrowserStackTunnel.jar`**

  Solution: Remove `~/.browserstack` and run ` browserstack setup` again.

* Problem: **message: Timed out without seeing Press Ctrl-C to exit**

  Solution: Are you uploading something big? Browserstack may need more upload bandwidth.

* Problem: **message: Timed out without seeing Press Ctrl-C to exit**

  Solution: That means there might be an issue with a running java process. Do:

  ```sh
  ps | egrep java
  ```

  Kill the java process, run `npm test` again and it should be solved.

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

## License

MIT

