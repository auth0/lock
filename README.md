[![Auth0](https://i.cloudup.com/1vaSVATKTL.png)](http://auth0.com)

[![NPM version](https://badge.fury.io/js/auth0-widget.js.png)](http://badge.fury.io/js/auth0-widget.js)

[![Auth0](https://i.cloudup.com/fKuIOiaPrL.png)](http://auth0.com)

[Auth0](https://auth0.com) is an authentication broker that supports social identity providers as well as enterprise identity providers such as Active Directory, LDAP, Office365, Google Apps, Salesforce.

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
<script src="http://cdn.auth0.com/w2/auth0-widget-4.1.js"></script>
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
widget.signin();
// or
widget.signin(options, callback);
~~~

#### Options

* __connections__: Array of enabled connections that will be used for the widget. _Default: all enabled connections_.
* __container__: The id of the DIV where the widget will be contained.
* __icon__: Icon url. _Recommended: 32x32_.
* __showIcon__: Show/Hide widget icon. _Default: false_.
* __connection_scopes__: Scopes to request to each identity provider that are not configured for the connection.

~~~javascript
widget.signin({
  connections: ['facebook', 'google-oauth2', 'twitter', 'Username-Password-Authentication', 'fabrikam.com'],
  container: 'root',
  icon: 'https://s3.amazonaws.com/assets.fabrikam.com/w2/img/logo-32.png',
  showIcon: true,
  connection_scopes: {
    'facebook': ['public_profile', 'user_friends'],
    'google-oauth2': ['https://www.googleapis.com/auth/orkut'],
    // none for twitter
  }
}, function () {
  // The Auth0 Widget is now loaded.
});
~~~

## `signup` and `reset`

It is also possible to start the widget in the __Sign Up mode__ or __Reset Password__ mode as follows:

~~~javascript
widget.signup(/* [same as the .signin method] */)

// or

widget.reset(/* [same as the .signin method] */)
~~~

## Single Page Applications

You can handle the authorization process client-side as follows:

~~~javascript
<script type="text/javascript">

  function callback(err, profile, id_token, access_token, state) {
      if (err) {
        // Handle authentication error
        return;
      }
      alert('hello ' + profile.name);
      //use result.id_token to call your rest api
  }

  var widget = new Auth0Widget({
    domain:       'mine.auth0.com',
    clientID:     'dsa7d77dsa7d7',
    callbackURL:  'http://my-app.com/',
    callbackOnLocationHash: true
  });

  widget.signin({popup: true}, null, callback)
</script>
~~~

## i18n

__Note 1:__ most of the translations are machine generated, please help us to move this forward.

Version `1.2.0` we added support for internationalization:

![](http://s3.amazonaws.com/blog.auth0.com/login_langs.gif)

You can call instantiate the widget with the `dict` option:

~~~javascript
  var widget = new Auth0Widget({
    domain:       'mine.auth0.com',
    clientID:     'dsa7d77dsa7d7',
    callbackURL:  'http://my-app.com/',
    dict:         'es'
  });
~~~

where dict can be a string matching the name of the file in the `i18n` folder or it could be an object literal as follows:

~~~javascript
  var widget = new Auth0Widget({
    domain:       'mine.auth0.com',
    clientID:     'dsa7d77dsa7d7',
    callbackURL:  'http://my-app.com/',
    dict:         {
      "loadingTitle": "loading...",
      "close": "close",
      "signin": {
      ..//same as in i18n json files
    }
  });
~~~

## Customize the look and feel

Apply your own style to the elements.

All classes and ids are prefixed with `a0-` to avoid conflicts with your own stylesheets.

Send us an screenshot! We would love to see what you can do.

## Example

The example directory has a ready-to-go app. In order to run it you need [node](http://nodejs.org/) installed and **grunt** (`npm i grunt -g`), then execute `grunt example` from the root of this project.

## Develop

To run the tests that don't require [BrowserStack](http://browserstack.com), first install `npm install -g testem` and then run `grunt test`.

To run the entire test suite run `grunt dev` and point your browser to `http://localhost:9999/test_harness.html`.

## Browser Compatibility

We are using [BrowserStack](http://browserstack.com) to run the test suite on multiple browsers on every push.

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
