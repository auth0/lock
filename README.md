[![Auth0](https://cldup.com/yYelLVuXby.jpg)](http://auth0.com)

# Lock
[![NPM version][npm-image]][npm-url]
[![Build status][strider-image]][strider-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[Auth0](https://auth0.com) is an authentication broker that supports social identity providers as well as enterprise identity providers such as Active Directory, LDAP, Google Apps, Salesforce.

Lock makes it easy to integrate SSO in your app. You won't have to worry about:

* Having a professional looking login dialog that displays well on any resolution and device.
* Finding the right icons for popular social providers.
* Remembering what was the identity provider the user chose the last time.
* Solving the home realm discovery challenge with enterprise users (i.e.: asking the enterprise user the email, and redirecting to the right enterprise identity provider).
* Implementing a standard sign in protocol (OpenID Connect / OAuth2 Login)

[![Auth0](https://i.cloudup.com/6opoEX_Z9z.png)](http://auth0.com)

> You can try it out yourself online at our [Auth0 Lock playground][playground-url].

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
<script src="http://cdn.auth0.com/js/lock-7.min.js"></script>

<!-- Latest minor release -->
<script src="http://cdn.auth0.com/js/lock-7.x.min.js"></script>

<!-- Latest patch release (recommended for production) -->
<script src="http://cdn.auth0.com/js/lock-7.x.y.min.js"></script>
```

If you are targeting mobile audiences, it's recommended that you add:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
```

### Browserify

If you are using Browserify to build your project, you will need to add the following transformations required by Auth0 Lock:

``` json
{
  "devDependencies": {
    "brfs": "0.0.8",
    "ejsify": "0.1.0",
    "packageify": "^0.2.0"
  }
}
```

### webpack

If you are using webpack, you will need to install loaders (`$ npm install --save brfs ejsify json-loader packageify transform-loader`) and then use them in your `webpack.config.js` file:

```js
loaders: [{
  test: /node_modules\/auth0-lock\/.*\.js$/,
  loaders: [
    'transform-loader/cacheable?brfs',
    'transform-loader/cacheable?packageify'
  ]
}, {
  test: /node_modules\/auth0-lock\/.*\.ejs$/,
  loader: 'transform-loader/cacheable?ejsify'
}, {
  test: /\.json$/,
  loader: 'json-loader'
}]
```

## Documentation
You can find the full documentation for Lock on the [Auth0 docs site](https://auth0.com/docs/libraries/lock).

* [Complete API][lock-customization]
* [UI customization][ui-customization]
* [Single Page Applications][spa-notes] implementation notes.
* [Regular Web Applications][webapps-notes] implementing notes.
* [Overlay vs Embedded mode][display-modes]
* [Popup vs Redirect mode][authentication-modes] notes. **What are the authentication modes?**.
* [Error customization][error-customization] notes.
* [I18n][i18n-notes] notes.
* [Events][events-notes] notes.
* [Development][development-notes] notes.
* [Release process][release-process] notes.
* [Auth0Lock playground][playground-url]
* [Using Refresh Tokens][using-refresh-tokens]
* Legacy **Auth0Widget** [Migration guide][migration-guide] to **Auth0Lock**


## Demos

The **support/development-demo** directory has a ready-to-go app. In order to run it you need [node](http://nodejs.org/) installed.

Then execute `npm i` to install dependencies (only once) and `npm run demo` from the root of this project.

Finally, point your browser at `http://localhost:3000/` and play around.


## Examples

The **examples** directory has some implementation samples you can find useful:

- [Lock & Webpack sample](https://github.com/auth0/lock/tree/master/examples/webpack)


## Browser Compatibility

We ensure browser compatibility in `Chrome`, `Safari`, `Firefox` and `IE >= 9`. We currently use [zuul](https://github.com/defunctzombie/zuul) along with [Saucelabs](https://saucelabs.com) to run integration tests on each push.

## Contributing

To run the tests:

Run `grunt dev` and point your browser to `http://localhost:9999/test_harness.html` to run the test suite.

Run `grunt phantom` if you have PhantomJS installed.

Run `grunt integration` (or `npm test`) if you have [SauceLabs][sauce-url] account. You will need a `SAUCE_ACCESS_KEY` and `SAUCE_USERNAME` env variables.

[sauce-url]: http://saucelabs.com

To publish a new version use:

```
  # release new version
  $ ./bin/version {patch,minor,major}

  # update remote repository
  $ git push origin master

  # and let Auth0's CI worry about the rest
```

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

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

[lock-initialization]: https://auth0.com/docs/libraries/lock/initialization
[lock-customization]: https://auth0.com/docs/libraries/lock/customization
[application-types]: https://auth0.com/docs/libraries/lock/types-of-applications
[display-modes]: https://auth0.com/docs/libraries/lock/display-modes
[spa-notes]: https://auth0.com/docs/libraries/lock/types-of-applications#single-page-app
[webapps-notes]: https://auth0.com/docs/libraries/lock/types-of-applications#regular-webapp
[authentication-modes]: https://auth0.com/docs/libraries/lock/authentication-modes
[popup-mode]: https://auth0.com/docs/libraries/lock/authentication-modes#popup-mode
[redirect-mode]: https://auth0.com/docs/libraries/lock/authentication-modes#redirect-mode
[ui-customization]: https://auth0.com/docs/libraries/lock/ui-customization
[error-customization]: https://auth0.com/docs/libraries/lock/customizing-error-messages
[i18n-notes]: https://auth0.com/docs/libraries/lock/i18n
[events-notes]: https://auth0.com/docs/libraries/lock/events
[development-notes]: https://github.com/auth0/lock/wiki/Development-notes
[release-process]: https://github.com/auth0/lock/wiki/Release-process
[playground-url]: http://auth0.github.com/playground
[migration-guide]: https://auth0.com/docs/libraries/lock/migration-guide
[using-refresh-tokens]: https://auth0.com/docs/libraries/lock/using-refresh-tokens
