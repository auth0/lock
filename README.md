# Lock

[Auth0](https://auth0.com) is an authentication broker that supports both social and enterprise identity providers, including Active Directory, LDAP, Google Apps, and Salesforce.

![Release](https://img.shields.io/npm/v/auth0-lock)
![Downloads](https://img.shields.io/npm/dw/auth0-lock)
[![License](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
![CircleCI](https://img.shields.io/circleci/build/github/auth0/lock)

## Documentation 

- [FAQs](./FAQ.md) - frequently asked questions about auth0-spa-js SDK.
- [Docs Site](https://auth0.com/docs) - explore our Docs site and learn more about Auth0.

## Getting Started

## Browser Compatibility

We ensure browser compatibility in Chrome, Safari, Firefox and IE >= 10.

### Installation

Using [npm](https://npmjs.org) in your project directory run the following command:

```sh
npm install auth0-lock
```

From CDN

```html
<!-- Latest patch release (recommended for production) -->
<script src="https://cdn.auth0.com/js/lock/11.34.2/lock.min.js"></script>
```

### Configure Auth0

### Configure the SDK

Create either an `Auth0Lock` or `Auth0LockPasswordless` instance. 

#### Auth0Lock

````js
import { Auth0Lock } from 'auth0-lock';

const lock = new Auth0Lock('{YOUR_AUTH0_CLIENT_ID}', '{YOUR_AUTH0_DOMAIN}');
````

#### Auth0LockPasswordless

````js
import { Auth0LockPasswordless } from 'auth0-lock';

const lock = new Auth0LockPasswordless('{YOUR_AUTH0_CLIENT_ID}', '{YOUR_AUTH0_DOMAIN}');
````

### Logging In

You can then configure a listener for the `authenticated` event to retrieve an access token and call `show` to display the Lock widget.

```html
<button id="login">Click to Login</button>
```

````js
lock.on('authenticated', function (authResult) {
  lock.getUserInfo(authResult.accessToken, function (error, profileResult) {
    if (error) {
      // Handle error
      return;
    }

    accessToken = authResult.accessToken;
    profile = profileResult;

    // Update DOM
  });
});

document.getElementById('login').addEventListener('click', () => {
  lock.show()
});.
````

For other comprehensive examples and documentation on the configuration options, see the [EXAMPLES.md](./EXAMPLES.md) document.

## Feedback

### Contributing

We appreciate feedback and contribution to this repo! Before you get started, please see the following:

- [Auth0's general contribution guidelines](https://github.com/auth0/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
- [Auth0's code of conduct guidelines](https://github.com/auth0/open-source-template/blob/master/CODE-OF-CONDUCT.md)
- [This repo's contribution guide](./DEVELOPMENT.md)

### Raise an issue

:warning: Note: We are no longer supporting requests for new features. Only requests for bug fixes or security patches will be considered.

To provide feedback or report a bug, please [raise an issue on our issue tracker](https://github.com/auth0/lock/issues).

### Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## What is Auth0?

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./auth0_dark_mode.png" width="150">
    <source media="(prefers-color-scheme: light)" srcset="./auth0_light_mode.png" width="150">
    <img alt="Auth0 Logo" src="./auth0_light_mode.png" width="150">
  </picture>
</p>
<p align="center">
  Auth0 is an easy to implement, adaptable authentication and authorization platform. To learn more checkout <a href="https://auth0.com/why-auth0">Why Auth0?</a>
</p>
<p align="center">
  This project is licensed under the MIT license. See the <a href="./LICENSE"> LICENSE</a> file for more info.
</p>