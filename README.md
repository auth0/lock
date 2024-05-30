![Auth0's configurable login form for web applications](https://cdn.auth0.com/website/sdks/banners/lock-banner.png)
![Release](https://img.shields.io/npm/v/auth0-lock)
![Downloads](https://img.shields.io/npm/dw/auth0-lock)
[![License](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/auth0/lock/actions/workflows/test.yml/badge.svg)](https://github.com/auth0/lock/actions/workflows/test.yml)

> :warning: Lock is built using React 18 from v12 onwards. Getting issues? Please [submit a bug report](https://github.com/auth0/lock/issues/new?assignees=&labels=bug+report,v12&template=report_a_bug.md&title=).

> :warning: From v12 onwards, we no longer publish to Bower.

## Documentation

- [Docs Site](https://auth0.com/docs) - explore our Docs site and learn more about Auth0.

## Getting Started

### Browser Compatibility

We ensure browser compatibility in Chrome, Safari, Firefox and IE >= 11.

### Installation

Install Lock into your project using [npm](https://npmjs.org):

```sh
npm install auth0-lock
```

From CDN

```html
<!-- Latest patch release (recommended for production) -->
<script src="https://cdn.auth0.com/js/lock/12.5.1/lock.min.js"></script>
```

### Configure Auth0

Create a **Single Page Application** in the [Auth0 Dashboard](https://manage.auth0.com/#/applications).

> **If you're using an existing application**, verify that you have configured the following settings in your Single Page Application:
>
> - Click on the "Settings" tab of your application's page.
> - Scroll down and click on the "Show Advanced Settings" link.
> - Under "Advanced Settings", click on the "OAuth" tab.
> - Ensure that "JsonWebToken Signature Algorithm" is set to `RS256` and that "OIDC Conformant" is enabled.
>   Next, configure the following URLs for your application under the "Application URIs" section of the "Settings" page:

- **Allowed Callback URLs**: `http://localhost:3000`
- **Allowed Logout URLs**: `http://localhost:3000`
- **Allowed Web Origins**: `http://localhost:3000`

> These URLs should reflect the origins that your application is running on. **Allowed Callback URLs** may also include a path, depending on where you're handling the callback (see below).
> Take note of the **Client ID** and **Domain** values under the "Basic Information" section. You'll need these values in the next step.

### Configure the SDK

Create either an `Auth0Lock` or `Auth0LockPasswordless` instance, depending on your use case:

#### Auth0Lock

```js
import { Auth0Lock } from 'auth0-lock';

const lock = new Auth0Lock('{YOUR_AUTH0_CLIENT_ID}', '{YOUR_AUTH0_DOMAIN}');
```

#### Auth0LockPasswordless

```js
import { Auth0LockPasswordless } from 'auth0-lock';

const lock = new Auth0LockPasswordless('{YOUR_AUTH0_CLIENT_ID}', '{YOUR_AUTH0_DOMAIN}');
```

### Logging In

Configure a listener for the `authenticated` event to retrieve an access token and call `show` to display the Lock widget.

```html
<button id="login">Click to Login</button>
```

```js
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

// Show the widget when the login button is clicked
document.getElementById('login').addEventListener('click', () => {
  lock.show()
});.
```

For other comprehensive examples and documentation on the configuration options, see the [EXAMPLES.md](https://github.com/auth0/lock/blob/master/EXAMPLES.md) document.

## Feedback

### Contributing

We appreciate feedback and contribution to this repo! Before you get started, please see the following:

- [Auth0's general contribution guidelines](https://github.com/auth0/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
- [Auth0's code of conduct guidelines](https://github.com/auth0/open-source-template/blob/master/CODE-OF-CONDUCT.md)
- [This repo's contribution guide](https://github.com/auth0/lock/blob/master/DEVELOPMENT.md)

### Raise an issue

:warning: Note: We are no longer supporting requests for new features. Only requests for bug fixes or security patches will be considered.

To provide feedback or report a bug, please [raise an issue on our issue tracker](https://github.com/auth0/lock/issues).

### Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## What is Auth0?

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.auth0.com/website/sdks/logos/auth0_dark_mode.png" width="150">
    <source media="(prefers-color-scheme: light)" srcset="https://cdn.auth0.com/website/sdks/logos/auth0_light_mode.png" width="150">
    <img alt="Auth0 Logo" src="https://cdn.auth0.com/website/sdks/logos/auth0_light_mode.png" width="150">
  </picture>
</p>
<p align="center">
  Auth0 is an easy to implement, adaptable authentication and authorization platform. To learn more checkout <a href="https://auth0.com/why-auth0">Why Auth0?</a>
</p>
<p align="center">
  This project is licensed under the MIT license. See the <a href="https://github.com/auth0/lock/blob/master/LICENSE"> LICENSE</a> file for more info.
</p>
