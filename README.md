# Getting Started

A common scenario would be to open the lock when the user clicks a login button. In order to do that, you need to create a new `Auth0Lock` object and register an event handler that calls the `open` method when the login button is clicked.

```javascript
var lock = new Auth0Lock(clientID, domain);
document.getElementById("loginButton").onclick = function(e) {
  lock.open("passwordless-email", function() {
    // This will be invoked when an email has been sent to the user
  });
};
```

The first argument of `open`, `"passwordlessEmail"` in the example, determines the behavior of the widget, and we call it the lock's **mode**. Right now, only `passwordlessEmail` and `passwordlessSMS` are supported, but we are working on many others, such as _social_,
_enterprise_, _user/pass_ and _kerberos_. See below for more about modes.

The last argument is a function that will be called when a email with a link to login is sent to the user. The moment the callback is invoked and its arguments depends on the mode and its configuration.

It is possible to specify a second argument with a list of options to customize the Lock behavior. Also, there are other methods besides `open` available. See below for the complete details about the API.

## API

### new Auth0Lock(clientID, domain)

### .open(mode, [options, callback])

### .close(mode, [options, callback])

### .logout([query])

## Modes

### passwordles-email

### passwordles-sms
