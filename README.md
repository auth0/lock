[![Build Status](https://auth0-tc-hub.herokuapp.com/bt23/status.png)](https://auth0-tc-hub.herokuapp.com/bt23)
[![NPM version](https://badge.fury.io/js/auth0-widget.js.png)](http://badge.fury.io/js/auth0-widget.js)

[![Auth0](http://blog.auth0.com.s3.amazonaws.com/logo-290x200-letters.png)](http://auth0.com)

[Auth0](http://auth0.com) is an authentication broker that supports social identity providers as well as enterprise identity providers such as Active Directory, LDAP, Office365, Google Apps, Salesforce.

The Auth0 Login Widget makes it easy to integrate SSO in your app. You won't have to worry about:
* Having a professional looking login dialog that displays well on any resolution and device.
* Finding the right icons for popular social providers.
* Remembering what was the identity provider the user chose the last time.
* Solving the home realm discovery challenge with enterprise users (i.e.: asking the enterprise user the email, and redirecting to the right enterprise identity provider).
* Implementing a standard sign in protocol (OpenID Connect / OAuth2 Login)

## Usage

Take `auth0-widget.js` or `auth0-widget.min.js` from the `build` directory and import it to your page.

### Initialize:

Construct a new instance of the Auth0 Widget as follows:

~~~html
<script src="auth0-widget.min.js"></script>
<script type="text/javascript">
  var widget = new Auth0Widget({
    domain:       'mine.auth0.com',
    clientID:     'dsa7d77dsa7d7',
    callbackURL:  'http://my-app.com/callback'
  });

  // ...
</script>
~~~

### Show Widget:

To invoke the widget, use the `show` method:

~~~javascript
widget.show();
// or
widget.show(options, callback);
~~~

#### Options

* __connections__: Array of enabled connections that will be used for the widget. _Default: all enabled connections_.
* __container__: The id of the DIV where the widget will be contained.
* __icon__: Icon url. _Recommended: 32x32_.
* __showIcon__: Show/Hide widget icon. _Default: false_.
* __resources__: JSON object that contains your customized text labels. As a reference, you can take a look at the example app (example/strings/es-ES.json) which customizes all of the supported labels to Spanish.

~~~javascript
widget.show({
  connections: ['facebook', 'google-oauth2', 'twitter', 'Username-Password-Authentication', 'fabrikam.com'],
  resources: {
    title: "Sign In with Auth0"
  },
  container: 'root',
  icon: 'https://s3.amazonaws.com/assets.fabrikam.com/w2/img/logo-32.png',
  showIcon: true
}, funcion () {
  // The Auth0 Widget is now loaded.
});
~~~

#### Customizing error messages
You can also customize the error messages that will be displayed on certain situations:

~~~javascript
widget.show({
  resources: {
    // ... other properties ...
    // wrongEmailPasswordErrorText, serverErrorText, signupEnterpriseEmailWarningText, signupServerErrorText and resetServerErrorText are used only if you have a Database connection
    wrongEmailPasswordErrorText: 'Custom error message for invalid user/pass.',
    serverErrorText: 'There was an error processing the sign in.',
    signupEnterpriseEmailWarningText: 'This domain {domain} has been configured for Single Sign On and you can\'t create an account. Try signing in instead.',
    signupServerErrorText: 'There was an unhandled error processing the sign up.',
    resetServerErrorText: 'There was an unhandled error processing the change password.',
    // strategyDomainInvalid is shown if the email does not have a matching enterprise connection
    strategyDomainInvalid: 'The domain {domain} has not been setup.',
    // strategyEmailInvalid is shown if the email is not valid
    strategyEmailInvalid: 'The email is invalid.'
  }
});
~~~

## Single Page Applications

You can handle the authorization process client-side as follows:

~~~javascript
<script type="text/javascript">
  var widget = new Auth0Widget({
    domain:       'mine.auth0.com',
    clientID:     'dsa7d77dsa7d7',
    callbackURL:  'http://my-app.com/',
    callbackOnLocationHash: true
  });

  auth0.parseHash(window.location.hash, function (profile, id_token, access_token, state) {
    alert('hello ' + profile.name);
    //use id_token to call your rest api
  });
</script>
~~~

## Example

The example directory has a ready-to-go app. In order to run it you need [node](http://nodejs.org/) installed, then execute `npm run example` from the root of this project.

## Develop

Run `npm run dev` and point your browser to `http://localhost:9999/test_harness.html` to run the test suite.

## Browser Compatibility

We are using [BrowserStack](http://browserstack.com) and [Travis-CI](http://travis-ci.org) to run the test suite on multiple browsers on every push.

## License

The MIT License (MIT)

Copyright (c) 2013 AUTH10 LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
